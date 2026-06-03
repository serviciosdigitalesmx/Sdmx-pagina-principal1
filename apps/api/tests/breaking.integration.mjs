import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
import test from 'node:test';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '.env.local') });
dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '.env') });

const port = Number(process.env.BREAKING_TESTS_PORT ?? process.env.PORT ?? 4010);
const baseUrl =
  process.env.BREAKING_TESTS_BASE_URL?.trim()
  || process.env.NEXT_PUBLIC_API_URL?.trim()
  || `http://127.0.0.1:${port}`;
const tenantSlug = process.env.BREAKING_TESTS_TENANT_SLUG?.trim() ?? '';
const otherTenantSlug = process.env.BREAKING_TESTS_OTHER_TENANT_SLUG?.trim() ?? '';
const publicFolio = process.env.BREAKING_TESTS_PUBLIC_FOLIO?.trim() ?? '';
const authToken = process.env.BREAKING_TESTS_AUTH_TOKEN?.trim() ?? '';
const authTenantSlug = process.env.BREAKING_TESTS_AUTH_TENANT_SLUG?.trim() ?? tenantSlug;
const authOtherToken = process.env.BREAKING_TESTS_OTHER_AUTH_TOKEN?.trim() ?? '';
const authOtherTenantSlug = process.env.BREAKING_TESTS_OTHER_AUTH_TENANT_SLUG?.trim() ?? otherTenantSlug;
const inventoryId = process.env.BREAKING_TESTS_INVENTORY_ID?.trim() ?? '';
const inventorySucursalId = process.env.BREAKING_TESTS_INVENTORY_SUCURSAL_ID?.trim() ?? '';
const otherInventorySucursalId = process.env.BREAKING_TESTS_OTHER_INVENTORY_SUCURSAL_ID?.trim() ?? '';
const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '..', '..', '..');
const runLocalApi = !process.env.BREAKING_TESTS_BASE_URL?.trim();
const requiredEnv = runLocalApi ? ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'] : [];
const missingEnv = requiredEnv.filter((key) => !process.env[key]?.trim());

if (missingEnv.length > 0) {
  console.warn(`Skipping local API boot in breaking tests because these env vars are missing: ${missingEnv.join(', ')}`);
}

let serverProcess;

async function waitForHealth() {
  const startedAt = Date.now();
  while (Date.now() - startedAt < 45000) {
    try {
      const response = await fetch(`${baseUrl}/health`);
      if (response.ok) {
        return;
      }
    } catch {
      // keep polling until the server is ready
    }
    await delay(1000);
  }

  throw new Error(`Timed out waiting for API health at ${baseUrl}`);
}

function startServer() {
  if (serverProcess) {
    return;
  }

  serverProcess = spawn('pnpm', ['--dir', 'apps/api', 'dev'], {
    env: {
      ...process.env,
      PORT: String(port),
    },
    cwd: repoRoot,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  serverProcess.stdout.on('data', (chunk) => {
    process.stderr.write(chunk);
  });

  serverProcess.stderr.on('data', (chunk) => {
    process.stderr.write(chunk);
  });

  serverProcess.on('exit', (code, signal) => {
    if (code !== 0 && signal !== 'SIGTERM') {
      process.stderr.write(`API dev server exited with code ${code ?? 'null'} signal ${signal ?? 'null'}\n`);
    }
  });
}

async function stopServer() {
  if (!serverProcess) {
    return;
  }

  serverProcess.kill('SIGTERM');
  await delay(2000);
  serverProcess = undefined;
}

async function requestJson(path, init) {
  const response = await fetch(`${baseUrl}${path}`, init);
  const text = await response.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  return { response, body };
}

test.before(async () => {
  if (missingEnv.length > 0) {
    return;
  }
  if (runLocalApi) {
    startServer();
  }
  await waitForHealth();
});

test.after(async () => {
  if (missingEnv.length > 0) {
    return;
  }
  if (runLocalApi) {
    await stopServer();
  }
});

test('health endpoint is reachable', async () => {
  const { response, body } = await requestJson('/health');
  assert.equal(response.status, 200);
  assert.equal(body?.status ?? body?.ok, 'ok');
});

test('public landing resolves for a real tenant and does not expose forbidden fields', async (t) => {
  if (!tenantSlug) {
    t.skip('BREAKING_TESTS_TENANT_SLUG is required');
    return;
  }

  const { response, body } = await requestJson(`/api/public/tenant/${encodeURIComponent(tenantSlug)}/landing`);
  assert.equal(response.status, 200);
  assert.equal(body?.success, true);
  assert.equal(body?.data?.tenant?.slug, tenantSlug);
  assert.ok(body?.data?.landingContent);
  assert.equal(Object.hasOwn(body?.data ?? {}, 'internal_notes'), false);
});

test('public tracking returns a real order and keeps the tenant boundary intact', async (t) => {
  if (!tenantSlug || !publicFolio) {
    t.skip('BREAKING_TESTS_TENANT_SLUG and BREAKING_TESTS_PUBLIC_FOLIO are required');
    return;
  }

  const { response, body } = await requestJson(`/api/public/tracking?tenantSlug=${encodeURIComponent(tenantSlug)}&folio=${encodeURIComponent(publicFolio)}`);
  assert.equal(response.status, 200);
  assert.equal(body?.success, true);
  assert.equal(body?.data?.folio, publicFolio);
  assert.equal(body?.tenant?.slug, tenantSlug);
  assert.equal(Object.hasOwn(body?.data ?? {}, 'internal_notes'), false);
  assert.equal(Object.hasOwn(body?.data ?? {}, 'events'), false);
  assert.equal(Object.hasOwn(body?.data ?? {}, 'documents'), false);
});

test('wrong tenant slug does not resolve another tenant order', async (t) => {
  if (!tenantSlug || !otherTenantSlug || !publicFolio) {
    t.skip('BREAKING_TESTS_TENANT_SLUG, BREAKING_TESTS_OTHER_TENANT_SLUG, and BREAKING_TESTS_PUBLIC_FOLIO are required');
    return;
  }

  const { response, body } = await requestJson(`/api/public/tenant/${encodeURIComponent(otherTenantSlug)}/orders/${encodeURIComponent(publicFolio)}`);
  assert.equal(response.status, 404);
  assert.match(String(body?.error ?? ''), /no encontramos/i);
});

test('authenticated route rejects JWT tenant A with path tenant B', async (t) => {
  if (!authToken || !authTenantSlug || !authOtherTenantSlug) {
    t.skip('BREAKING_TESTS_AUTH_TOKEN, BREAKING_TESTS_AUTH_TENANT_SLUG, and BREAKING_TESTS_OTHER_AUTH_TENANT_SLUG are required');
    return;
  }

  const { response } = await requestJson(`/api/${encodeURIComponent(authOtherTenantSlug)}/users`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  assert.notEqual(response.status, 200);
  assert.ok([403, 404].includes(response.status));
});

test('tenant A token cannot read tenant B data through a tenant-scoped route', async (t) => {
  if (!authOtherToken || !authOtherTenantSlug || !tenantSlug) {
    t.skip('BREAKING_TESTS_OTHER_AUTH_TOKEN, BREAKING_TESTS_OTHER_AUTH_TENANT_SLUG, and BREAKING_TESTS_TENANT_SLUG are required');
    return;
  }

  const { response } = await requestJson(`/api/${encodeURIComponent(tenantSlug)}/users`, {
    headers: {
      Authorization: `Bearer ${authOtherToken}`,
    },
  });

  assert.notEqual(response.status, 200);
  assert.ok([403, 404].includes(response.status));
});

test('non-existent order folio returns 404 and does not leak record details', async (t) => {
  if (!tenantSlug) {
    t.skip('BREAKING_TESTS_TENANT_SLUG is required');
    return;
  }

  const folio = `__missing_${Date.now()}__`;
  const { response, body } = await requestJson(`/api/public/tenant/${encodeURIComponent(tenantSlug)}/orders/${encodeURIComponent(folio)}`);
  assert.equal(response.status, 404);
  assert.equal(body?.data, undefined);
});

test('inventory mutation cannot escape its sucursal boundary', async (t) => {
  if (!authToken || !authTenantSlug || !inventoryId || !inventorySucursalId || !otherInventorySucursalId) {
    t.skip('BREAKING_TESTS_AUTH_TOKEN, BREAKING_TESTS_AUTH_TENANT_SLUG, BREAKING_TESTS_INVENTORY_ID, BREAKING_TESTS_INVENTORY_SUCURSAL_ID, and BREAKING_TESTS_OTHER_INVENTORY_SUCURSAL_ID are required');
    return;
  }

  const { response } = await requestJson(`/api/${encodeURIComponent(authTenantSlug)}/inventory/${encodeURIComponent(inventoryId)}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      sucursalId: otherInventorySucursalId,
      note: 'breaking-test cross-branch attempt',
    }),
  });

  assert.notEqual(response.status, 200);
  assert.ok([403, 404].includes(response.status));
});
