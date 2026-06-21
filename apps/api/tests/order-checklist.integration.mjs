import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
import test from 'node:test';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '.env.local') });
dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '.env') });

const port = Number(process.env.CHECKLIST_TESTS_PORT ?? process.env.PORT ?? 4030);
const baseUrl =
  process.env.CHECKLIST_TESTS_BASE_URL?.trim()
  || process.env.NEXT_PUBLIC_API_URL?.trim()
  || `http://127.0.0.1:${port}`;
const tenantSlug = process.env.CHECKLIST_TESTS_TENANT_SLUG?.trim() ?? '';
const tenantId = process.env.CHECKLIST_TESTS_TENANT_ID?.trim() ?? '';
const authToken = process.env.CHECKLIST_TESTS_AUTH_TOKEN?.trim() ?? '';
const sucursalId = process.env.CHECKLIST_TESTS_SUCURSAL_ID?.trim() ?? '';
const supabaseUrl = process.env.SUPABASE_URL?.trim() ?? '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? '';
const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '..', '..', '..');
const runLocalApi = !process.env.CHECKLIST_TESTS_BASE_URL?.trim();
const requiredEnv = [
  'CHECKLIST_TESTS_TENANT_SLUG',
  'CHECKLIST_TESTS_TENANT_ID',
  'CHECKLIST_TESTS_AUTH_TOKEN',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  ...(runLocalApi ? [] : []),
];
const missingEnv = requiredEnv.filter((key) => !process.env[key]?.trim());

if (missingEnv.length > 0) {
  console.warn(`Skipping order checklist tests because these env vars are missing: ${missingEnv.join(', ')}`);
}

let serverProcess;
const supabase = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, { auth: { persistSession: false } })
  : null;

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

async function readTenantFieldDefinition() {
  const { data, error } = await supabase
    .from('tenant_field_definitions')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('entity', 'service_order_checklists')
    .eq('field_key', 'cosmetic_condition')
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function restoreTenantFieldDefinition(previousDefinition) {
  if (!supabase) return;

  if (previousDefinition) {
    const { error } = await supabase
      .from('tenant_field_definitions')
      .upsert(previousDefinition, { onConflict: 'tenant_id,entity,field_key' });
    if (error) throw error;
    return;
  }

  const { error } = await supabase
    .from('tenant_field_definitions')
    .delete()
    .eq('tenant_id', tenantId)
    .eq('entity', 'service_order_checklists')
    .eq('field_key', 'cosmetic_condition');

  if (error) throw error;
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

test('POST /orders rejects creation when tenant requires missing legal checklist field', async (t) => {
  if (missingEnv.length > 0 || !supabase) {
    t.skip('Checklist integration env vars are required');
    return;
  }

  const previousDefinition = await readTenantFieldDefinition();
  const nextDefinition = {
    id: previousDefinition?.id,
    tenant_id: tenantId,
    entity: 'service_order_checklists',
    field_key: 'cosmetic_condition',
    field_label: previousDefinition?.field_label ?? 'Condición cosmética',
    field_type: previousDefinition?.field_type ?? 'textarea',
    required: true,
    options: previousDefinition?.options ?? [],
    field_order: previousDefinition?.field_order ?? 10,
    placeholder: previousDefinition?.placeholder ?? 'Rayones, golpes o humedad visible',
    help_text: previousDefinition?.help_text ?? 'Campo requerido por prueba T01',
    visible: true,
    validation: previousDefinition?.validation ?? {},
    metadata: {
      ...(previousDefinition?.metadata ?? {}),
      test_case: 't01_checklist_required',
    },
  };

  try {
    const { error } = await supabase
      .from('tenant_field_definitions')
      .upsert(nextDefinition, { onConflict: 'tenant_id,entity,field_key' });

    if (error) throw error;

    const { response, body } = await requestJson(`/api/${encodeURIComponent(tenantSlug)}/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        ...(sucursalId ? { 'x-fixi-sucursal-id': sucursalId, 'x-sucursal-id': sucursalId } : {}),
      },
      body: JSON.stringify({
        clientName: `Checklist Test ${Date.now()}`,
        clientPhone: `55${String(Date.now()).slice(-8)}`,
        clientEmail: '',
        deviceType: 'Smartphone',
        deviceModel: 'Equipo T01',
        issue: 'Validar rechazo por checklist legal incompleto',
        estimatedCost: 0,
        includeIva: false,
        checklist: {
          hasCharger: false,
          screenCondition: '',
          powersOn: false,
          backupRequired: false,
          notes: '',
          reportedPhysicalDamage: '',
          accessoriesReceived: '',
          customerAcceptanceRequired: false,
          acceptedAt: '',
          acceptedByName: '',
        },
      }),
    });

    assert.equal(response.status, 400);
    assert.equal(body?.error, 'Required intake checklist fields are missing');
    assert.ok(body?.details?.fields?.includes('cosmetic_condition'));
  } finally {
    await restoreTenantFieldDefinition(previousDefinition);
  }
});
