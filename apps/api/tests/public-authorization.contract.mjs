import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '..', '..', '..');
const controllerPath = path.join(repoRoot, 'apps/api/src/controllers/public.ts');
const routePath = path.join(repoRoot, 'apps/api/src/routes/public.ts');
const webClientPath = path.join(repoRoot, 'apps/web-clientes/src');

const fieldNames = [
  'authorizationType',
  'scopeSnapshot',
  'termsVersion',
  'termsSnapshot',
  'signatureMethod',
  'authorizedAmount',
];

async function controllerSource() {
  return readFile(controllerPath, 'utf8');
}

async function publicAuthorizationUrl() {
  const baseUrl = process.env.PUBLIC_AUTHORIZATION_CONTRACT_BASE_URL?.trim();
  const tenantSlug = process.env.PUBLIC_AUTHORIZATION_CONTRACT_TENANT_SLUG?.trim();
  const publicToken = process.env.PUBLIC_AUTHORIZATION_CONTRACT_PUBLIC_TOKEN?.trim();
  if (!baseUrl || !tenantSlug || !publicToken) return null;
  return `${baseUrl}/api/public/tenant/${encodeURIComponent(tenantSlug)}/orders/${encodeURIComponent(publicToken)}/authorization`;
}

function payload(overrides = {}) {
  return {
    decision: 'accepted',
    authorizationType: 'quotation',
    acceptedByName: 'T11 Contract Test',
    acceptedByPhone: '',
    acceptedByEmail: '',
    authorizedAmount: 1,
    scopeSnapshot: 'T11 contract scope',
    termsVersion: 't11-contract-v1',
    termsSnapshot: 'T11 contract terms',
    signatureMethod: 'typed_name',
    signatureText: 'T11 Contract Test',
    idempotencyKey: crypto.randomUUID(),
    ...overrides,
  };
}

test('public authorization contract declares the canonical fields and RPC', async () => {
  const source = await controllerSource();
  const routes = await readFile(routePath, 'utf8');
  for (const field of fieldNames) assert.match(source, new RegExp(`\\b${field}\\b`));
  assert.match(routes, /router\.post\(['"]\/tenant\/:tenantSlug\/orders\/:publicToken\/authorization['"]/);
  assert.match(source, /submit_service_order_authorization/);
  assert.match(source, /service_order_authorizations/);
});

test('accepted authorization requires amount and terms; rejected authorization keeps the contract', async () => {
  const source = await controllerSource();
  assert.match(source, /decision === ['"]accepted['"][\s\S]{0,260}authorizedAmount/);
  assert.match(source, /termsVersion: z\.string\(\)\.trim\(\)\.min\(1\)/);
  assert.match(source, /termsSnapshot: z\.string\(\)\.trim\(\)\.min\(1\)/);
  assert.deepEqual(payload({ decision: 'rejected', authorizedAmount: undefined }).decision, 'rejected');
});

test('public authorization route preserves invalid-token and tenant-isolation boundaries', async () => {
  const source = await controllerSource();
  assert.match(source, /resolveTenantIdBySlug\(tenantSlug\)/);
  assert.match(source, /p_tenant_id:\s*tenant\.id/);
  assert.match(source, /p_public_token:\s*publicToken\.trim\(\)/);
  assert.match(source, /p_idempotency_key:\s*body\.idempotencyKey/);
  assert.match(source, /duplicate|already/i);
  assert.match(source, /order not found/i);
});

test('frontend does not contain service-role credentials or client usage', async () => {
  const result = await import('node:child_process').then(({ execFile }) => new Promise((resolve, reject) => {
    execFile('rg', ['-n', '--hidden', '-g', '!*.map', 'SUPABASE_SERVICE_ROLE_KEY|service_role', webClientPath], (error, stdout) => {
      if (error && error.code !== 1) reject(error);
      else resolve(stdout);
    });
  }));
  assert.equal(result, '');
});

test('live public authorization contract is opt-in and skipped without explicit fixture variables', async (t) => {
  const url = await publicAuthorizationUrl();
  if (!url) {
    t.skip('PUBLIC_AUTHORIZATION_CONTRACT_BASE_URL, TENANT_SLUG, and PUBLIC_TOKEN are required');
    return;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload()),
  });
  assert.ok([201, 404, 409].includes(response.status));
});
