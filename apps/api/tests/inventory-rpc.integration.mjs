import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import test from 'node:test';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '.env.local') });
dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '.env') });

const supabaseUrl = process.env.SUPABASE_URL?.trim() ?? '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? '';

const tenantId = process.env.INVENTORY_RPC_TEST_TENANT_ID?.trim() ?? '';
const sucursalId = process.env.INVENTORY_RPC_TEST_SUCURSAL_ID?.trim() ?? '';
const productId = process.env.INVENTORY_RPC_TEST_PRODUCT_ID?.trim() ?? '';
const purchaseOrderId = process.env.INVENTORY_RPC_TEST_PURCHASE_ORDER_ID?.trim() ?? '';

const missingEnv = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'INVENTORY_RPC_TEST_TENANT_ID',
  'INVENTORY_RPC_TEST_SUCURSAL_ID',
  'INVENTORY_RPC_TEST_PRODUCT_ID',
  'INVENTORY_RPC_TEST_PURCHASE_ORDER_ID',
].filter((key) => !process.env[key]?.trim());

if (missingEnv.length > 0) {
  console.warn(`Skipping inventory RPC tests because these env vars are missing: ${missingEnv.join(', ')}`);
}

async function restRequest(pathname, init = {}) {
  const response = await fetch(`${supabaseUrl}${pathname}`, {
    ...init,
    headers: {
      apikey: serviceRoleKey,
      authorization: `Bearer ${serviceRoleKey}`,
      ...(init.headers ?? {}),
    },
  });

  const text = await response.text();
  let body = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  return { response, body };
}

async function rpc(name, payload) {
  const { response, body } = await restRequest(`/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(payload),
  });

  return { response, body };
}

async function getInventorySnapshotByProduct(productIdValue) {
  const { response, body } = await restRequest(
    `/rest/v1/sucursal_inventory?select=id,tenant_id,sucursal_id,product_id,stock_current&tenant_id=eq.${encodeURIComponent(tenantId)}&sucursal_id=eq.${encodeURIComponent(sucursalId)}&product_id=eq.${encodeURIComponent(productIdValue)}&limit=1`,
    { method: 'GET' },
  );

  assert.equal(response.status, 200);
  return Array.isArray(body) && body.length > 0 ? body[0] : null;
}

async function getMovementCount(referenceFilter, productIdValue = productId) {
  const { response, body } = await restRequest(
    `/rest/v1/inventory_movements?select=id&tenant_id=eq.${encodeURIComponent(tenantId)}&sucursal_id=eq.${encodeURIComponent(sucursalId)}&product_id=eq.${encodeURIComponent(productIdValue)}${referenceFilter ? `&reference=eq.${encodeURIComponent(referenceFilter)}` : ''}`,
    {
      method: 'GET',
      headers: {
        Prefer: 'count=exact',
      },
    },
  );

  assert.equal(response.status, 200);
  const contentRange = response.headers.get('content-range') ?? '';
  const totalMatch = contentRange.match(/\/(\d+|\*)$/);
  if (totalMatch && totalMatch[1] !== '*') {
    return Number(totalMatch[1]);
  }
  return Array.isArray(body) ? body.length : 0;
}

async function getPurchaseOrderItem() {
  const { response, body } = await restRequest(
    `/rest/v1/purchase_order_items?select=id,tenant_id,purchase_order_id,product_id,sku_snapshot,qty_ordered,qty_received,unit_cost&tenant_id=eq.${encodeURIComponent(tenantId)}&purchase_order_id=eq.${encodeURIComponent(purchaseOrderId)}&order=created_at.asc&limit=1`,
    { method: 'GET' },
  );

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(body));
  assert.ok(body.length > 0);
  return body[0];
}

async function getPurchaseOrder() {
  const { response, body } = await restRequest(
    `/rest/v1/purchase_orders?select=id,tenant_id,sucursal_id,status,folio&tenant_id=eq.${encodeURIComponent(tenantId)}&id=eq.${encodeURIComponent(purchaseOrderId)}&limit=1`,
    { method: 'GET' },
  );

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(body));
  assert.ok(body.length > 0);
  return body[0];
}

test.before(async () => {
  if (missingEnv.length > 0) {
    return;
  }
  assert.ok(supabaseUrl, 'SUPABASE_URL is required');
  assert.ok(serviceRoleKey, 'SUPABASE_SERVICE_ROLE_KEY is required');
});

test('adjust_inventory is atomic under concurrent updates', async (t) => {
  if (missingEnv.length > 0) {
    t.skip('inventory RPC test env is required');
    return;
  }

  const before = await getInventorySnapshotByProduct(productId);
  const baseline = Number(before?.stock_current ?? 0);
  const reference = `rpc-adjust-${Date.now()}`;

  const [first, second] = await Promise.all([
    rpc('adjust_inventory', {
      p_tenant_id: tenantId,
      p_sucursal_id: sucursalId,
      p_product_id: productId,
      p_quantity_delta: 5,
      p_reference: reference,
      p_notes: 'concurrency test A',
      p_changed_by: null,
    }),
    rpc('adjust_inventory', {
      p_tenant_id: tenantId,
      p_sucursal_id: sucursalId,
      p_product_id: productId,
      p_quantity_delta: 7,
      p_reference: reference,
      p_notes: 'concurrency test B',
      p_changed_by: null,
    }),
  ]);

  assert.equal(first.response.status, 200);
  assert.equal(second.response.status, 200);
  assert.ok(first.body);
  assert.ok(second.body);

  await delay(250);

  const after = await getInventorySnapshotByProduct(productId);
  assert.ok(after);
  assert.equal(Number(after.stock_current), baseline + 12);

  const movementCount = await getMovementCount(reference, productId);
  assert.equal(movementCount, 2);
});

test('receive_purchase_inventory accumulates partial receipts atomically', async (t) => {
  if (missingEnv.length > 0) {
    t.skip('inventory RPC test env is required');
    return;
  }

  const order = await getPurchaseOrder();
  const item = await getPurchaseOrderItem();
  const resolvedProductId = String(item.product_id ?? productId ?? '');
  const resolvedSucursalId = String(order.sucursal_id ?? sucursalId ?? '');
  const itemId = String(item.id ?? '');
  const baseOrderQty = Number(item.qty_ordered ?? 0);
  const baseReceived = Number(item.qty_received ?? 0);

  assert.ok(itemId, 'purchase order item id is required');
  assert.ok(resolvedProductId, 'product_id or INVENTORY_RPC_TEST_PRODUCT_ID is required');
  assert.ok(resolvedSucursalId, 'sucursal_id or INVENTORY_RPC_TEST_SUCURSAL_ID is required');
  assert.ok(baseOrderQty >= 2, 'purchase order item quantity must be at least 2 for the concurrency split test');

  const inventoryBefore = await getInventorySnapshotByProduct(resolvedProductId);
  const baselineStock = Number(inventoryBefore?.stock_current ?? 0);
  const referenceCountBefore = await getMovementCount(order.folio, resolvedProductId);
  const firstQuantity = Math.floor(baseOrderQty / 2);
  const secondQuantity = baseOrderQty - firstQuantity;

  const [first, second] = await Promise.all([
    rpc('receive_purchase_inventory', {
      p_tenant_id: tenantId,
      p_purchase_order_id: purchaseOrderId,
      p_sucursal_id: resolvedSucursalId,
      p_received_items: [
        {
          purchaseOrderItemId: itemId,
          skuSnapshot: String(item.sku_snapshot ?? ''),
          quantity: firstQuantity,
          unitCost: Number(item.unit_cost ?? 0),
        },
      ],
      p_notes: 'partial receipt concurrency A',
      p_changed_by: null,
    }),
    rpc('receive_purchase_inventory', {
      p_tenant_id: tenantId,
      p_purchase_order_id: purchaseOrderId,
      p_sucursal_id: resolvedSucursalId,
      p_received_items: [
        {
          purchaseOrderItemId: itemId,
          skuSnapshot: String(item.sku_snapshot ?? ''),
          quantity: secondQuantity,
          unitCost: Number(item.unit_cost ?? 0),
        },
      ],
      p_notes: 'partial receipt concurrency B',
      p_changed_by: null,
    }),
  ]);

  assert.equal(first.response.status, 200);
  assert.equal(second.response.status, 200);

  await delay(250);

  const { response: itemResponse, body: itemBody } = await restRequest(
    `/rest/v1/purchase_order_items?select=id,qty_received,status,qty_ordered&tenant_id=eq.${encodeURIComponent(tenantId)}&id=eq.${encodeURIComponent(itemId)}&limit=1`,
    { method: 'GET' },
  );
  assert.equal(itemResponse.status, 200);
  assert.ok(Array.isArray(itemBody));
  assert.ok(itemBody.length > 0);

  const updatedItem = itemBody[0];
  assert.equal(Number(updatedItem.qty_received), baseReceived + baseOrderQty);
  assert.ok(['parcial', 'recibida'].includes(String(updatedItem.status ?? '')));

  const updatedOrder = await getPurchaseOrder();
  assert.equal(String(updatedOrder.status ?? ''), 'recibida');

  const inventoryAfter = await getInventorySnapshotByProduct(resolvedProductId);
  assert.ok(inventoryAfter);
  assert.equal(Number(inventoryAfter.stock_current), baselineStock + baseOrderQty);

  const referenceCountAfter = await getMovementCount(order.folio, resolvedProductId);
  assert.equal(referenceCountAfter, referenceCountBefore + 2);
});
