import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '..', '..', '..');
const clientDir = path.join(repoRoot, 'apps', 'web-clientes', 'src');
const ordersPath = path.join(clientDir, 'lib', 'api', 'orders.ts');
const apiClientPath = path.join(clientDir, 'lib', 'api', 'client.ts');
const authorizationPanelPath = path.join(clientDir, 'components', 'portal', 'authorization-panel.tsx');

async function source(filePath) {
  return readFile(filePath, 'utf8');
}

test('authorization client uses encoded public routes for tenant and token', async () => {
  const orders = await source(ordersPath);

  assert.match(orders, /getOrderAuthorization\(tenantSlug: string, publicToken: string\)/);
  assert.match(orders, /\/api\/public\/tenant\/\$\{encodeURIComponent\(tenantSlug\)\}\/orders\/\$\{encodeURIComponent\(publicToken\)\}\/authorization/);
  assert.match(orders, /submitOrderAuthorization\(\n\s*tenantSlug: string,\n\s*publicToken: string,/);
  assert.match(orders, /method:\s*["']POST["']/);
});

test('client delegates public configuration to fetchJson and contains no privileged credentials', async () => {
  const client = await source(apiClientPath);
  const orders = await source(ordersPath);
  const panel = await source(authorizationPanelPath);

  assert.match(client, /import\s*\{\s*fetchJson\s*\}\s*from\s*["']@white-label\/config["']/);
  assert.match(client, /return fetchJson<T>\(endpoint, options\)/);
  assert.doesNotMatch(client, /process\.env|https?:\/\//);
  assert.doesNotMatch(`${orders}\n${panel}`, /service[_-]?role|SUPABASE_SERVICE_ROLE_KEY|BEGIN (RSA|OPENSSH) PRIVATE KEY/i);
  assert.doesNotMatch(`${orders}\n${panel}`, /https?:\/\/[^'"`\s]+/i);
});

test('submitOrderAuthorization preserves the T11 authorization payload', async () => {
  const orders = await source(ordersPath);
  const panel = await source(authorizationPanelPath);
  const t11Fields = [
    'decision',
    'authorizationType',
    'acceptedByName',
    'authorizedAmount',
    'scopeSnapshot',
    'termsVersion',
    'termsSnapshot',
    'signatureMethod',
    'signatureText',
    'idempotencyKey',
  ];

  assert.match(orders, /body:\s*JSON\.stringify\(payload\)/);
  for (const field of t11Fields) assert.match(panel, new RegExp(`\\b${field}\\b`));
});
