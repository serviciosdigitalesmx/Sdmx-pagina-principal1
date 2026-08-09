import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
import test from 'node:test';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '..', '..', '..');

dotenv.config({ path: path.join(repoRoot, '.env.local') });
dotenv.config({ path: path.join(repoRoot, '.env') });

const port = Number(process.env.REQUEST_CONVERSION_TESTS_PORT ?? process.env.PORT ?? 4050);
const configuredBaseUrl = process.env.REQUEST_CONVERSION_TESTS_BASE_URL?.trim() ?? '';
const baseUrl = configuredBaseUrl || `http://127.0.0.1:${port}`;
const tenantSlug = process.env.REQUEST_CONVERSION_TESTS_TENANT_SLUG?.trim() ?? '';
const tenantId = process.env.REQUEST_CONVERSION_TESTS_TENANT_ID?.trim() ?? '';
const authToken = process.env.REQUEST_CONVERSION_TESTS_AUTH_TOKEN?.trim() ?? '';
const supabaseUrl = process.env.SUPABASE_URL?.trim() ?? '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? '';
const runLocalApi = !configuredBaseUrl;
const supabase = supabaseUrl && serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } })
  : null;

let serverProcess;

async function waitForHealth() {
  const startedAt = Date.now();
  while (Date.now() - startedAt < 45000) {
    try {
      const response = await fetch(`${baseUrl}/health`);
      if (response.ok) return;
    } catch {
      // Retry until the local API is ready.
    }
    await delay(1000);
  }
  throw new Error(`Timed out waiting for API health at ${baseUrl}`);
}

function startServer() {
  serverProcess = spawn('pnpm', ['--dir', 'apps/api', 'dev'], {
    cwd: repoRoot,
    env: { ...process.env, PORT: String(port) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  serverProcess.stdout.on('data', (chunk) => process.stderr.write(chunk));
  serverProcess.stderr.on('data', (chunk) => process.stderr.write(chunk));
}

async function stopServer() {
  if (!serverProcess) return;
  serverProcess.kill('SIGTERM');
  await delay(2000);
  serverProcess = undefined;
}

async function convertRequest(requestId) {
  const response = await fetch(
    `${baseUrl}/api/${encodeURIComponent(tenantSlug)}/requests/${encodeURIComponent(requestId)}/convert`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        estimatedCost: 1250,
        createCustomer: true,
      }),
    },
  );
  const body = await response.json();
  return { response, body };
}

test.before(async () => {
  if (!supabase || !tenantId || !tenantSlug || !authToken) return;
  if (runLocalApi) startServer();
  await waitForHealth();
});

test.after(async () => {
  if (runLocalApi) await stopServer();
});

test('concurrent conversion creates exactly one order for a service request', async (t) => {
  if (!supabase || !tenantId || !tenantSlug || !authToken) {
    t.skip('REQUEST_CONVERSION_TESTS_TENANT_ID, REQUEST_CONVERSION_TESTS_TENANT_SLUG, REQUEST_CONVERSION_TESTS_AUTH_TOKEN, SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY are required');
    return;
  }

  const marker = `request-conversion-${Date.now()}-${crypto.randomUUID()}`;
  const phone = `55${String(Date.now()).slice(-8)}`;
  let requestId;
  let orderId;
  let customerId;

  try {
    const { data: requestRow, error: requestError } = await supabase
      .from('service_requests')
      .insert({
        tenant_id: tenantId,
        folio: `SOL-${crypto.randomUUID()}`,
        customer_name: 'Integration Request Conversion',
        customer_phone: phone,
        customer_email: `${crypto.randomUUID()}@example.test`,
        device_type: 'Smartphone',
        device_model: 'Integration Device',
        issue_description: marker,
        status: 'pendiente',
        metadata: { request_conversion_test_id: marker },
      })
      .select('id')
      .single();

    if (requestError) throw requestError;
    requestId = requestRow.id;

    const results = await Promise.all([convertRequest(requestId), convertRequest(requestId)]);
    assert.deepEqual(results.map(({ response }) => response.status).sort(), [201, 409]);

    const created = results.find(({ response }) => response.status === 201);
    const rejected = results.find(({ response }) => response.status === 409);
    assert.equal(rejected?.body?.code, 'REQUEST_ALREADY_CONVERTED');

    orderId = created?.body?.data?.order_id;
    customerId = created?.body?.data?.customer_id;
    assert.ok(orderId);

    const { data: finalRequest, error: finalRequestError } = await supabase
      .from('service_requests')
      .select('status, converted_order_id')
      .eq('tenant_id', tenantId)
      .eq('id', requestId)
      .single();

    if (finalRequestError) throw finalRequestError;
    assert.equal(finalRequest.status, 'convertida');
    assert.equal(finalRequest.converted_order_id, orderId);

    const { data: orders, error: ordersError } = await supabase
      .from('service_orders')
      .select('id')
      .eq('tenant_id', tenantId)
      .contains('metadata', { request_conversion_test_id: marker });

    if (ordersError) throw ordersError;
    assert.equal(orders?.length, 1);
    assert.equal(orders?.[0]?.id, orderId);
  } finally {
    if (requestId) {
      await supabase.from('service_requests').delete().eq('tenant_id', tenantId).eq('id', requestId);
    }
    if (orderId) {
      await supabase.from('service_orders').delete().eq('tenant_id', tenantId).eq('id', orderId);
    }
    if (customerId) {
      await supabase.from('customers').delete().eq('tenant_id', tenantId).eq('id', customerId);
    }
  }
});
