# PURCHASE ORDERS

    const body = receiveSchema.parse(req.body);
    const scope = req.scope;
    const supabase = getTenantClient(tenantId);

    const { data: order, error: orderError } = await supabase.from('purchase_orders').select('*').eq('tenant_id', tenantId).eq('id', orderId).single();
    if (orderError || !order) return res.status(404).json({ error: 'Purchase order not found', details: orderError?.message ?? 'Not found' });

    if (scope?.mode === 'branch' && scope.sucursalId && String(order.sucursal_id ?? '') !== scope.sucursalId) {
      return res.status(403).json({ error: 'Sucursal mismatch' });
    }

    const { data: items, error: itemsError } = await supabase
      .from('purchase_order_items')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('purchase_order_id', orderId)
      .order('created_at', { ascending: true });
    if (itemsError) return res.status(502).json({ error: 'Failed to fetch purchase order items', details: itemsError.message });

    const receivedBySku = new Map<string, number>();
    for (const receivedItem of body.receivedItems ?? []) {
      const key = receivedItem.skuSnapshot?.trim();
      if (!key) continue;
      receivedBySku.set(key, Number(receivedItem.quantity));
    }

    const inventorySnapshots: Array<Record<string, unknown>> = [];
    const movementRows: Array<Record<string, unknown>> = [];

    for (const item of items ?? []) {
      const sku = String(item.sku_snapshot ?? '');
      const receivedQuantity = receivedBySku.get(sku) ?? Number(item.qty_ordered ?? 0);
      if (!receivedQuantity || receivedQuantity <= 0) continue;
      const orderSucursalId = order.sucursal_id ?? scope?.sucursalId ?? null;

      const productCatalog = await ensureProductCatalogRecord(
        supabase,
        tenantId,
        sku,
        String(item.product_name_snapshot ?? sku),
        String(item.product_name_snapshot ?? sku),
      );

      const { data: inventoryRow, error: inventoryError } = await supabase
        .from('sucursal_inventory')
        .select('id, tenant_id, sucursal_id, product_id, stock_current')
        .eq('tenant_id', tenantId)
        .eq('product_id', productCatalog.id)
        .eq('sucursal_id', orderSucursalId)
        .maybeSingle();
      if (inventoryError) return res.status(502).json({ error: 'Failed to fetch inventory row', details: inventoryError.message });

      let nextInventory = inventoryRow;
      if (!nextInventory) {
        const { data: createdInventory, error: createInventoryError } = await supabase
          .from('sucursal_inventory')
          .insert([{
            tenant_id: tenantId,
            sucursal_id: orderSucursalId,
            product_id: productCatalog.id,
            stock_current: 0,
          }])
          .select('id, tenant_id, sucursal_id, product_id, stock_current')
          .single();
        if (createInventoryError || !createdInventory) return res.status(502).json({ error: 'Failed to create inventory item on receipt', details: createInventoryError?.message ?? 'Unknown error' });
        nextInventory = createdInventory;
      }

      const nextStock = Number(nextInventory.stock_current ?? 0) + receivedQuantity;
      const { error: updateInventoryError } = await supabase
        .from('sucursal_inventory')
        .update({
          stock_current: nextStock,
          sucursal_id: orderSucursalId ?? nextInventory.sucursal_id ?? null,
        })
        .eq('tenant_id', tenantId)
        .eq('id', nextInventory.id);
      if (updateInventoryError) return res.status(502).json({ error: 'Failed to update inventory stock', details: updateInventoryError.message });
      await refreshInventoryAlert(tenantId, productCatalog.id, orderSucursalId ?? nextInventory.sucursal_id ?? null, nextStock);

      inventorySnapshots.push({ id: nextInventory.id, sku, stock_current: nextStock });
      movementRows.push({
        tenant_id: tenantId,
        sucursal_id: orderSucursalId,
        product_id: productCatalog.id,
        purchase_order_id: orderId,
        movement_type: 'purchase_received',
        quantity: receivedQuantity,
        unit_cost: Number(item.unit_cost ?? 0),
        reference: String(order.folio),
        notes: body.notes || null,
        created_by: null,
      });

      const { error: updateItemError } = await supabase
        .from('purchase_order_items')
        .update({
          qty_received: receivedQuantity,
          subtotal: Number((Number(item.qty_ordered ?? 0) * Number(item.unit_cost ?? 0)).toFixed(2)),
        })
        .eq('tenant_id', tenantId)
        .eq('id', item.id);
      if (updateItemError) return res.status(502).json({ error: 'Failed to update purchase order item', details: updateItemError.message });
    }

    if (movementRows.length > 0) {
      const { error: movementError } = await supabase.from('inventory_movements').insert(movementRows);
      if (movementError) return res.status(502).json({ error: 'Failed to persist inventory movements', details: movementError.message });
    }

    const { data: updatedOrder, error: updateOrderError } = await supabase
      .from('purchase_orders')
      .update({
        status: 'recibida',
      })
      .eq('tenant_id', tenantId)
      .eq('id', orderId)
      .select('*')
      .single();

    if (updateOrderError) return res.status(502).json({ error: 'Failed to finalize purchase order', details: updateOrderError.message });

    return res.json({ success: true, data: { order: updatedOrder, inventory: inventorySnapshots, movements: movementRows } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid payload', details: error.errors });
    }
    console.error('Error receiving purchase order:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

==================================================

# CATALOGS INVENTORY

};

export const updateInventoryItem = async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId;
    if (!tenantId) return res.status(401).json({ error: 'Tenant context is required' });

    const inventoryId = req.params.id;
    const body = updateInventorySchema.parse(req.body);
    const scope = req.scope;
    const supabase = getTenantClient(tenantId);

    const { data: currentRow, error: currentError } = await supabase
      .from('sucursal_inventory')
    .select('id, tenant_id, sucursal_id, product_id, stock_current, created_at, products:product_id (id, sku, name, minimum_stock)')
      .eq('tenant_id', tenantId)
      .eq('id', inventoryId)
      .single();

    if (currentError || !currentRow) {
      return res.status(404).json({ error: 'Inventory item not found', details: currentError?.message ?? 'Not found' });
    }

    const nextStock = typeof body.stock === 'number' ? body.stock : Number(currentRow.stock_current ?? 0);
    const nextSucursalId = body.sucursalId === null
      ? null
      : (body.sucursalId ?? scope?.sucursalId ?? currentRow.sucursal_id ?? null);

    if (body.sucursalId && !isUuid(body.sucursalId)) {
      return res.status(400).json({ error: 'Invalid sucursalId' });
    }
    if (body.sucursalId && !(await validateSucursalOwnership(supabase, tenantId, body.sucursalId))) {
      return res.status(403).json({ error: 'Sucursal mismatch' });
    }

    if (scope?.mode === 'branch' && scope.sucursalId && body.sucursalId && body.sucursalId !== scope.sucursalId) {
      return res.status(403).json({ error: 'Sucursal mismatch' });
    }

    if (scope?.mode === 'branch' && !scope.sucursalId) {
      return res.status(400).json({ error: 'Sucursal activa requerida' });
    }

    if (scope?.mode === 'branch' && currentRow.sucursal_id && scope.sucursalId && currentRow.sucursal_id !== scope.sucursalId) {
      return res.status(403).json({ error: 'Sucursal mismatch' });
    }

    const { data: productRow, error: productError } = await supabase
      .from('products')
      .select('id, tenant_id, sku, name')
      .eq('tenant_id', tenantId)
      .eq('id', currentRow.product_id)
      .maybeSingle();

    if (productError || !productRow) {
      return res.status(404).json({ error: 'Product not found for inventory row', details: productError?.message ?? 'Not found' });
    }

    const { data: updatedRow, error: updateError } = await supabase
      .from('sucursal_inventory')
      .update({
        stock_current: nextStock,
        sucursal_id: scope?.mode === 'branch' ? (scope.sucursalId ?? currentRow.sucursal_id ?? nextSucursalId) : nextSucursalId,
      })
      .eq('tenant_id', tenantId)
      .eq('id', inventoryId)
      .select('id, tenant_id, sucursal_id, product_id, stock_current, created_at, products:product_id (id, sku, name, minimum_stock)')
      .single();

    if (updateError) {
      return res.status(502).json({ error: 'Failed to update inventory item', details: updateError.message });
    }

    if (typeof body.stock === 'number' && body.stock !== Number(currentRow.stock_current ?? 0)) {
      const movementType = body.stock > Number(currentRow.stock_current ?? 0) ? 'in' : 'out';
      const quantity = Math.abs(body.stock - Number(currentRow.stock_current ?? 0));
      const { error: movementError } = await supabase.from('inventory_movements').insert([{
        tenant_id: tenantId,
        sucursal_id: scope?.mode === 'branch' ? (scope.sucursalId ?? currentRow.sucursal_id ?? nextSucursalId) : nextSucursalId,
        product_id: productRow.id,
        movement_type: movementType,
        quantity,
        unit_cost: 0,
        reference: 'stock_adjustment',
        notes: body.note || null,
        created_by: null,
      }]);

      if (movementError) {
        return res.status(502).json({ error: 'Failed to persist inventory movement', details: movementError.message });
      }
      await refreshInventoryAlert(tenantId, productRow.id, scope?.mode === 'branch' ? (scope.sucursalId ?? currentRow.sucursal_id ?? nextSucursalId) : nextSucursalId, nextStock);
    }

    return res.json({ success: true, data: updatedRow });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid payload', details: error.errors });
    }
    console.error('Error updating inventory item:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const listInventoryMovements = async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId;
    if (!tenantId) return res.status(401).json({ error: 'Tenant context is required' });
    const inventoryId = req.params.id;
    const supabase = getTenantClient(tenantId);

    const { data: inventoryRow, error: inventoryError } = await supabase
      .from('sucursal_inventory')
      .select('id, tenant_id, product_id, stock_current, sucursal_id')
      .eq('tenant_id', tenantId)
      .eq('id', inventoryId)
      .maybeSingle();

    if (inventoryError) {
      return res.status(502).json({ error: 'Failed to fetch inventory item', details: inventoryError.message });
    }

    if (inventoryRow?.sucursal_id && !(await validateSucursalOwnership(supabase, tenantId, inventoryRow.sucursal_id))) {
      return res.status(403).json({ error: 'Sucursal mismatch' });
    }

    if (!inventoryRow) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    if (req.scope?.mode === 'branch' && req.scope.sucursalId && inventoryRow.sucursal_id && inventoryRow.sucursal_id !== req.scope.sucursalId) {
      return res.status(403).json({ error: 'Sucursal mismatch' });
    }

    const { data: productRow, error: productError } = await supabase
      .from('products')
      .select('id, tenant_id, sku, name')
      .eq('tenant_id', tenantId)
      .eq('id', inventoryRow.product_id)
      .maybeSingle();

    if (productError) {
      return res.status(502).json({ error: 'Failed to resolve product catalog row', details: productError.message });
    }

    const { data, error } = await supabase
      .from('inventory_movements')
      .select('id, tenant_id, sucursal_id, product_id, service_order_id, purchase_order_id, movement_type, quantity, unit_cost, reference, notes, created_by, created_at')
      .eq('tenant_id', tenantId)
      .eq('product_id', productRow?.id ?? inventoryId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      return res.status(502).json({ error: 'Failed to fetch inventory movements', details: error.message });
    }

    return res.json({ success: true, data: data ?? [] });
  } catch (error) {
    console.error('Error listing inventory movements:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

==================================================

# PROCUREMENT

import { Request, Response } from 'express';
import { getTenantClient } from '@white-label/database';

export const getProcurementSummary = async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId;

    if (!tenantId) {
      return res.status(401).json({ error: 'Tenant context is required' });
    }

    const supabase = getTenantClient(tenantId);
    const { data, error } = await supabase
      .from('sucursal_inventory')
      .select('id, tenant_id, product_id, stock_current, sucursal_id, created_at')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) {
      return res.status(502).json({ error: 'Failed to fetch procurement summary', details: error.message });
    }

    const items = Array.isArray(data) ? data : [];
    const productIds = items.map((item) => String((item as { product_id?: string }).product_id ?? '')).filter(Boolean);
    const { data: products, error: productsError } = productIds.length > 0
      ? await supabase.from('products').select('id, sku, name').eq('tenant_id', tenantId).in('id', productIds)
      : { data: [], error: null };

    if (productsError) {
      return res.status(502).json({ error: 'Failed to resolve procurement products', details: productsError.message });
    }

    const productMap = new Map((products ?? []).map((product) => [String((product as { id?: string }).id ?? ''), product]));
    const resolvedItems = items.map((item) => {
      const product = productMap.get(String((item as { product_id?: string }).product_id ?? '')) as Record<string, unknown> | undefined;
      return {
        ...item,
        sku: product?.sku ?? null,
        description: product?.name ?? null,
        stock: Number((item as { stock_current?: number }).stock_current ?? 0),
      };
    });
    const lowStockThreshold = Number(process.env.LOW_STOCK_THRESHOLD ?? 5);
    const lowStockItems = resolvedItems.filter((item) => Number(item.stock ?? 0) <= lowStockThreshold);
    const totalStock = resolvedItems.reduce((sum, item) => sum + Number(item.stock ?? 0), 0);

    return res.json({
      success: true,
      data: {
        totalItems: resolvedItems.length,
        lowStockThreshold,
        lowStockCount: lowStockItems.length,
        totalStock,
        lowStockItems,
      },
    });
  } catch (error) {
    console.error('Error getting procurement summary:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
