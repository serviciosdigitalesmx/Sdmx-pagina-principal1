import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
import test from 'node:test';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '.env.local') });
dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '.env') });

const port = Number(process.env.EVIDENCE_TEST_PORT ?? process.env.PORT ?? 4020);
const baseUrl =
  process.env.EVIDENCE_TEST_BASE_URL?.trim()
  || process.env.NEXT_PUBLIC_API_URL?.trim()
  || `http://127.0.0.1:${port}`;
const tenantSlug = process.env.EVIDENCE_TEST_TENANT_SLUG?.trim() ?? '';
const publicFolio = process.env.EVIDENCE_TEST_PUBLIC_FOLIO?.trim() ?? '';
const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '..', '..', '..');
const runLocalApi = !process.env.EVIDENCE_TEST_BASE_URL?.trim();
const requiredEnv = runLocalApi ? ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'EVIDENCE_TEST_TENANT_SLUG', 'EVIDENCE_TEST_PUBLIC_FOLIO'] : [];
const missingEnv = requiredEnv.filter((key) => !process.env[key]?.trim());

if (missingEnv.length > 0) {
  console.warn(`Skipping evidence adapter tests because these env vars are missing: ${missingEnv.join(', ')}`);
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
      // retry until ready
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
      FEATURE_EVIDENCE_MODE: 'normalized',
    },
    cwd: repoRoot,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  serverProcess.stdout.on('data', (chunk) => process.stderr.write(chunk));
  serverProcess.stderr.on('data', (chunk) => process.stderr.write(chunk));
}

async function stopServer() {
  if (!serverProcess) {
    return;
  }

  serverProcess.kill('SIGTERM');
  await delay(2000);
  serverProcess = undefined;
}

async function requestJson(pathname, init) {
  const response = await fetch(`${baseUrl}${pathname}`, init);
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

test('public portal order remains readable when evidence mode is normalized', async (t) => {
  if (missingEnv.length > 0) {
    t.skip('EVIDENCE_TEST_TENANT_SLUG and EVIDENCE_TEST_PUBLIC_FOLIO are required');
    return;
  }

  const { response, body } = await requestJson(
    `/api/public/tenant/${encodeURIComponent(tenantSlug)}/orders/${encodeURIComponent(publicFolio)}`,
  );

  assert.equal(response.status, 200);
  assert.equal(body?.success, true);
  assert.equal(body?.data?.order?.folio, publicFolio);
  assert.ok(Array.isArray(body?.data?.documents));
  assert.ok(Array.isArray(body?.data?.events));
  assert.ok(Array.isArray(body?.data?.messages));
});
