import { getTenantClient } from '@white-label/database';

export const PORTABILITY_SCHEMA_VERSION = 'fixi-portability-v1';

const DEFAULT_LIMIT = 1000;
const MAX_ROWS_PER_ENTITY = 1000;
const MAX_IMPORT_ROWS = 5000;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type DbClient = ReturnType<typeof getTenantClient>;
type JsonObject = Record<string, unknown>;

export class PortabilityError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'PortabilityError';
  }
}

type EntityConfig = {
  key: string;
  table: string;
  select: string;
  orderBy?: string;
  transform: (row: JsonObject) => JsonObject;
};

type PreviewIssue = {
  entity: string;
  row: number | null;
  field?: string;
  message: string;
};

type PreviewEntityResult = {
  key: string;
  rows: number;
  accepted: number;
  rejected: number;
  warnings: PreviewIssue[];
  errors: PreviewIssue[];
};

function assertTenantId(tenantId: string) {
  if (!UUID_PATTERN.test(tenantId)) {
    throw new PortabilityError('Invalid tenant id', 400);
  }
}

function parseLimit(input: unknown) {
  if (input === undefined || input === null || input === '') {
    return DEFAULT_LIMIT;
  }

  const value = Number(input);
  if (!Number.isInteger(value) || value < 1) {
    throw new PortabilityError('Invalid limit', 400);
  }

  return Math.min(value, MAX_ROWS_PER_ENTITY);
}

function text(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function lowerKey(value: unknown) {
  return text(value)?.toLowerCase() ?? null;
}

function numberValue(value: unknown) {
  return typeof value === 'number' ? value : value ?? null;
}

function rowId(row: JsonObject) {
  return text(row.id) ?? null;
}

function relationId(row: JsonObject, key: string) {
  return text(row[key]) ?? null;
}

function boolValue(value: unknown) {
  return typeof value === 'boolean' ? value : Boolean(value);
}

function compactObject(input: JsonObject) {
  return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined));
}

const exportEntities: EntityConfig[] = [
  {
    key: 'customers',
    table: 'customers',
    select: 'id, sucursal_id, name, phone, email, data_consent_status, data_consent_date, data_consent_version, data_consent_scope, created_at',
    orderBy: 'created_at',
    transform: (row) => compactObject({
      source_id: rowId(row),
      sucursal_source_id: relationId(row, 'sucursal_id'),
      name: text(row.name),
      phone: text(row.phone),
      email: text(row.email),
      data_consent_status: text(row.data_consent_status),
      data_consent_date: row.data_consent_date ?? null,
      data_consent_version: text(row.data_consent_version),
      data_consent_scope: row.data_consent_scope ?? [],
      created_at: row.created_at ?? null,
    }),
  },
  {
    key: 'sucursales',
    table: 'sucursales',
    select: 'id, name, code, address, city, state, phone, is_active, created_at, updated_at',
    orderBy: 'created_at',
    transform: (row) => compactObject({
      source_id: rowId(row),
      name: text(row.name),
      code: text(row.code),
      address: text(row.address),
      city: text(row.city),
      state: text(row.state),
      phone: text(row.phone),
      is_active: boolValue(row.is_active),
      created_at: row.created_at ?? null,
      updated_at: row.updated_at ?? null,
    }),
  },
  {
    key: 'users_sanitized',
    table: 'users',
    select: 'id, name, full_name, email, phone, role, activo, is_active, sucursal_id, created_at, updated_at',
    orderBy: 'created_at',
    transform: (row) => compactObject({
      source_id: rowId(row),
      name: text(row.name) ?? text(row.full_name),
      email: text(row.email),
      phone: text(row.phone),
      role: text(row.role),
      is_active: row.activo ?? row.is_active ?? true,
      sucursal_source_id: relationId(row, 'sucursal_id'),
      created_at: row.created_at ?? null,
      updated_at: row.updated_at ?? null,
    }),
  },
  {
    key: 'products',
    table: 'products',
    select: 'id, sku, name, category, brand, compatible_model, minimum_stock, unit, location, notes, is_active, created_at, updated_at',
    orderBy: 'created_at',
    transform: (row) => compactObject({
      source_id: rowId(row),
      sku: text(row.sku),
      name: text(row.name),
      category: text(row.category),
      brand: text(row.brand),
      compatible_model: text(row.compatible_model),
      minimum_stock: numberValue(row.minimum_stock),
      unit: text(row.unit),
      location: text(row.location),
      notes: text(row.notes),
      is_active: row.is_active ?? true,
      created_at: row.created_at ?? null,
      updated_at: row.updated_at ?? null,
    }),
  },
  {
    key: 'suppliers',
    table: 'suppliers',
    select: 'id, business_name, legal_name, contact_name, phone, whatsapp, email, address, city, state, categories, lead_time_days, price_score, speed_score, quality_score, reliability_score, notes, is_active, created_at, updated_at',
    orderBy: 'created_at',
    transform: (row) => compactObject({
      source_id: rowId(row),
      business_name: text(row.business_name),
      legal_name: text(row.legal_name),
      contact_name: text(row.contact_name),
      phone: text(row.phone),
      whatsapp: text(row.whatsapp),
      email: text(row.email),
      address: text(row.address),
      city: text(row.city),
      state: text(row.state),
      categories: row.categories ?? null,
      lead_time_days: numberValue(row.lead_time_days),
      price_score: numberValue(row.price_score),
      speed_score: numberValue(row.speed_score),
      quality_score: numberValue(row.quality_score),
      reliability_score: numberValue(row.reliability_score),
      notes: text(row.notes),
      is_active: row.is_active ?? true,
      created_at: row.created_at ?? null,
      updated_at: row.updated_at ?? null,
    }),
  },
  {
    key: 'service_requests',
    table: 'service_requests',
    select: 'id, customer_name, customer_phone, customer_email, device_type, device_model, issue_description, urgency, status, quoted_total, created_at, updated_at, metadata, serial_number',
    orderBy: 'created_at',
    transform: (row) => compactObject({
      source_id: rowId(row),
      customer_name: text(row.customer_name),
      customer_phone: text(row.customer_phone),
      customer_email: text(row.customer_email),
      device_type: text(row.device_type),
      device_model: text(row.device_model),
      issue_description: text(row.issue_description),
      urgency: text(row.urgency),
      status: text(row.status),
      quoted_total: numberValue(row.quoted_total),
      serial_number: text(row.serial_number),
      metadata: row.metadata ?? null,
      created_at: row.created_at ?? null,
      updated_at: row.updated_at ?? null,
    }),
  },
  {
    key: 'service_orders_sanitized',
    table: 'service_orders',
    select: 'id, customer_id, sucursal_id, status, device_info, problem_description, serial_number, estimated_cost, final_cost, promised_date, warranty_until, created_at, updated_at',
    orderBy: 'created_at',
    transform: (row) => compactObject({
      source_id: rowId(row),
      customer_source_id: relationId(row, 'customer_id'),
      sucursal_source_id: relationId(row, 'sucursal_id'),
      status: text(row.status),
      device_info: row.device_info ?? null,
      problem_description: text(row.problem_description),
      serial_number: text(row.serial_number),
      estimated_cost: numberValue(row.estimated_cost),
      final_cost: numberValue(row.final_cost),
      promised_date: row.promised_date ?? null,
      warranty_until: row.warranty_until ?? null,
      created_at: row.created_at ?? null,
      updated_at: row.updated_at ?? null,
    }),
  },
  {
    key: 'service_order_events',
    table: 'service_order_events',
    select: 'id, service_order_id, event_type, previous_status, new_status, note, actor_name, created_at',
    orderBy: 'created_at',
    transform: (row) => compactObject({
      source_id: rowId(row),
      service_order_source_id: relationId(row, 'service_order_id'),
      event_type: text(row.event_type),
      previous_status: text(row.previous_status),
      new_status: text(row.new_status),
      note: text(row.note),
      actor_name: text(row.actor_name),
      created_at: row.created_at ?? null,
    }),
  },
  {
    key: 'service_order_checklists',
    table: 'service_order_checklists',
    select: 'id, service_order_id, has_charger, screen_condition, powers_on, backup_required, notes, cosmetic_condition, reported_physical_damage, accessories_received, customer_acceptance_required, accepted_at, accepted_by_name, created_at, updated_at',
    orderBy: 'created_at',
    transform: (row) => compactObject({
      source_id: rowId(row),
      service_order_source_id: relationId(row, 'service_order_id'),
      has_charger: row.has_charger ?? false,
      screen_condition: text(row.screen_condition),
      powers_on: row.powers_on ?? false,
      backup_required: row.backup_required ?? false,
      notes: text(row.notes),
      cosmetic_condition: text(row.cosmetic_condition),
      reported_physical_damage: row.reported_physical_damage ?? false,
      accessories_received: row.accessories_received ?? null,
      customer_acceptance_required: row.customer_acceptance_required ?? false,
      accepted_at: row.accepted_at ?? null,
      accepted_by_name: text(row.accepted_by_name),
      created_at: row.created_at ?? null,
      updated_at: row.updated_at ?? null,
    }),
  },
  {
    key: 'service_order_documents_metadata',
    table: 'service_order_documents',
    select: 'id, service_order_id, file_name, file_type, mime_type, file_size, source, is_customer_visible, retention_expires_at, created_at',
    orderBy: 'created_at',
    transform: (row) => compactObject({
      source_id: rowId(row),
      service_order_source_id: relationId(row, 'service_order_id'),
      file_name: text(row.file_name),
      file_type: text(row.file_type),
      mime_type: text(row.mime_type),
      file_size: numberValue(row.file_size),
      source: text(row.source),
      is_customer_visible: row.is_customer_visible ?? false,
      retention_expires_at: row.retention_expires_at ?? null,
      created_at: row.created_at ?? null,
    }),
  },
  {
    key: 'sucursal_inventory_snapshot',
    table: 'sucursal_inventory',
    select: 'id, sucursal_id, product_id, stock_current, created_at, updated_at',
    orderBy: 'created_at',
    transform: (row) => compactObject({
      source_id: rowId(row),
      sucursal_source_id: relationId(row, 'sucursal_id'),
      product_source_id: relationId(row, 'product_id'),
      stock_current: numberValue(row.stock_current),
      created_at: row.created_at ?? null,
      updated_at: row.updated_at ?? null,
    }),
  },
];

const excludedEntities = [
  { key: 'payments', reason: 'Excluded from T20 MVP: real payment/cash data is out of scope.' },
  { key: 'refunds', reason: 'Excluded from T20 MVP: refund data is out of scope.' },
  { key: 'cash', reason: 'Excluded from T20 MVP: cash register data is out of scope.' },
  { key: 'expenses', reason: 'Excluded from T20 MVP: finance data is out of scope.' },
  { key: 'finance', reason: 'Excluded from T20 MVP: finance data is out of scope.' },
  { key: 'billing', reason: 'Excluded from T20 MVP: billing enforcement data is out of scope.' },
  { key: 'audit_logs', reason: 'Excluded from T20 MVP: audit data must not be exported.' },
  { key: 'message_queue', reason: 'Excluded from T20 MVP: outbound messaging data is out of scope.' },
  { key: 'pwa_push_subscriptions', reason: 'Excluded from T20 MVP: notification endpoints are out of scope.' },
  { key: 'security_sessions', reason: 'Excluded from T20 MVP: sessions and credentials are sensitive.' },
  { key: 'raw_storage_objects', reason: 'Excluded from T20 MVP: binary/storage export is out of scope.' },
];

const allowedImportEntities = new Set(exportEntities.map((entity) => entity.key));
const blockedImportEntities = new Set(excludedEntities.map((entity) => entity.key));
const exactDangerousFields = new Set([
  'tenant_id',
  ['public', 'token'].join('_'),
  ['mfa', 'secret'].join('_'),
  ['storage', 'path'].join('_'),
  ['bucket', 'name'].join('_'),
  ['public', 'url'].join('_'),
  ['service', 'role'].join('_'),
  ['password', 'hash'].join('_'),
]);
const dangerousFragments = ['password', 'secret', 'token'];

async function loadTenantInfo(client: DbClient, tenantId: string) {
  const { data, error } = await client
    .from('tenants')
    .select('id, slug, name')
    .eq('id', tenantId)
    .maybeSingle();

  if (error) {
    throw new PortabilityError('Unable to read tenant metadata', 502, error.message);
  }

  return {
    slug: text(data?.slug),
    name: text(data?.name),
  };
}

async function countEntity(client: DbClient, entity: EntityConfig, tenantId: string) {
  const { count, error } = await client
    .from(entity.table)
    .select('id', { count: 'exact', head: true })
    .eq('tenant_id', tenantId);

  if (error) {
    return { count: 0, included: false, reason: error.message };
  }

  return { count: count ?? 0, included: true };
}

async function readEntityRows(client: DbClient, entity: EntityConfig, tenantId: string, limit: number) {
  let query = client
    .from(entity.table)
    .select(entity.select)
    .eq('tenant_id', tenantId)
    .limit(limit);

  if (entity.orderBy) {
    query = query.order(entity.orderBy, { ascending: true });
  }

  const { data, error } = await query;

  if (error) {
    throw new PortabilityError(`Unable to export ${entity.key}`, 502, error.message);
  }

  return (data ?? []).map((row) => entity.transform(row as unknown as JsonObject));
}

export async function getTenantExportSummary(params: {
  tenantId: string;
  requestId?: string | null;
}) {
  assertTenantId(params.tenantId);
  const client = getTenantClient(params.tenantId);
  const tenant = await loadTenantInfo(client, params.tenantId);
  const entityCounts = await Promise.all(
    exportEntities.map(async (entity) => ({
      key: entity.key,
      ...(await countEntity(client, entity, params.tenantId)),
    })),
  );

  return {
    schema_version: PORTABILITY_SCHEMA_VERSION,
    tenant,
    generated_at: new Date().toISOString(),
    source: 'tenant_export_summary',
    entities: entityCounts,
    excluded: excludedEntities,
    limits: {
      max_rows_per_entity: MAX_ROWS_PER_ENTITY,
    },
    requestId: params.requestId ?? null,
  };
}

export async function getTenantExportData(params: {
  tenantId: string;
  limit?: unknown;
  requestId?: string | null;
}) {
  assertTenantId(params.tenantId);
  const limit = parseLimit(params.limit);
  const client = getTenantClient(params.tenantId);
  const tenant = await loadTenantInfo(client, params.tenantId);
  const entries = await Promise.all(
    exportEntities.map(async (entity) => [entity.key, await readEntityRows(client, entity, params.tenantId, limit)] as const),
  );
  const entities = Object.fromEntries(entries);
  const warnings = exportEntities
    .filter((entity) => (entities[entity.key] ?? []).length >= limit)
    .map((entity) => ({
      key: entity.key,
      message: `Entity reached export limit of ${limit} rows.`,
    }));

  return {
    schema_version: PORTABILITY_SCHEMA_VERSION,
    exported_at: new Date().toISOString(),
    tenant,
    format: 'json',
    limits: {
      max_rows_per_entity: MAX_ROWS_PER_ENTITY,
      applied_limit: limit,
    },
    entities,
    excluded: excludedEntities,
    warnings,
    requestId: params.requestId ?? null,
  };
}

function isPlainObject(value: unknown): value is JsonObject {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function findDangerousFields(value: unknown, entity: string, row: number | null, path = ''): PreviewIssue[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => findDangerousFields(item, entity, row, `${path}[${index}]`));
  }

  if (!isPlainObject(value)) {
    return [];
  }

  return Object.entries(value).flatMap(([key, nested]) => {
    const normalized = key.trim().toLowerCase();
    const currentPath = path ? `${path}.${key}` : key;
    const issues = exactDangerousFields.has(normalized) || dangerousFragments.some((fragment) => normalized.includes(fragment))
      ? [{ entity, row, field: currentPath, message: 'Field is not allowed in import preview.' }]
      : [];

    return [...issues, ...findDangerousFields(nested, entity, row, currentPath)];
  });
}

function naturalKeys(entity: string, row: JsonObject) {
  const keys: string[] = [];
  const pushKey = (prefix: string, value: unknown) => {
    const normalized = lowerKey(value);
    if (normalized) {
      keys.push(`${prefix}:${normalized}`);
    }
  };

  if (entity === 'customers') {
    pushKey('email', row.email);
    pushKey('phone', row.phone);
  }

  if (entity === 'products') {
    pushKey('sku', row.sku);
    pushKey('name', row.name);
  }

  if (entity === 'sucursales') {
    pushKey('code', row.code);
    pushKey('name', row.name);
  }

  return keys;
}

async function loadExistingNaturalKeys(client: DbClient, tenantId: string, entity: string) {
  if (entity === 'customers') {
    const { data, error } = await client
      .from('customers')
      .select('email, phone')
      .eq('tenant_id', tenantId)
      .limit(MAX_ROWS_PER_ENTITY);
    if (error) throw new PortabilityError('Unable to preview customers', 502, error.message);
    return new Set((data ?? []).flatMap((row) => naturalKeys(entity, row as JsonObject)));
  }

  if (entity === 'products') {
    const { data, error } = await client
      .from('products')
      .select('sku, name')
      .eq('tenant_id', tenantId)
      .limit(MAX_ROWS_PER_ENTITY);
    if (error) throw new PortabilityError('Unable to preview products', 502, error.message);
    return new Set((data ?? []).flatMap((row) => naturalKeys(entity, row as JsonObject)));
  }

  if (entity === 'sucursales') {
    const { data, error } = await client
      .from('sucursales')
      .select('code, name')
      .eq('tenant_id', tenantId)
      .limit(MAX_ROWS_PER_ENTITY);
    if (error) throw new PortabilityError('Unable to preview sucursales', 502, error.message);
    return new Set((data ?? []).flatMap((row) => naturalKeys(entity, row as JsonObject)));
  }

  return new Set<string>();
}

export async function previewTenantImport(params: {
  tenantId: string;
  body: unknown;
  requestId?: string | null;
}) {
  assertTenantId(params.tenantId);

  if (!isPlainObject(params.body)) {
    throw new PortabilityError('Invalid import preview payload', 400);
  }

  if (params.body.schema_version !== PORTABILITY_SCHEMA_VERSION) {
    throw new PortabilityError('Unsupported schema_version', 400);
  }

  if (!isPlainObject(params.body.entities)) {
    throw new PortabilityError('Invalid entities payload', 400);
  }

  const client = getTenantClient(params.tenantId);
  const entityResults: PreviewEntityResult[] = [];
  const wouldCreate: JsonObject[] = [];
  const wouldSkip: JsonObject[] = [];
  const wouldConflict: JsonObject[] = [];
  let totalRows = 0;
  let acceptedRows = 0;
  let rejectedRows = 0;

  for (const [entityKey, rawRows] of Object.entries(params.body.entities)) {
    if (blockedImportEntities.has(entityKey)) {
      const error = { entity: entityKey, row: null, message: 'Entity is excluded from T20 import preview.' };
      entityResults.push({ key: entityKey, rows: 0, accepted: 0, rejected: 0, warnings: [], errors: [error] });
      rejectedRows += 1;
      continue;
    }

    if (!allowedImportEntities.has(entityKey)) {
      const error = { entity: entityKey, row: null, message: 'Entity is not supported by T20 import preview.' };
      entityResults.push({ key: entityKey, rows: 0, accepted: 0, rejected: 0, warnings: [], errors: [error] });
      rejectedRows += 1;
      continue;
    }

    if (!Array.isArray(rawRows)) {
      const error = { entity: entityKey, row: null, message: 'Entity payload must be an array.' };
      entityResults.push({ key: entityKey, rows: 0, accepted: 0, rejected: 0, warnings: [], errors: [error] });
      rejectedRows += 1;
      continue;
    }

    if (rawRows.length > MAX_ROWS_PER_ENTITY) {
      throw new PortabilityError('Too many rows for entity', 413, { entity: entityKey, max: MAX_ROWS_PER_ENTITY });
    }

    totalRows += rawRows.length;
    if (totalRows > MAX_IMPORT_ROWS) {
      throw new PortabilityError('Too many rows for import preview', 413, { max: MAX_IMPORT_ROWS });
    }

    const existingKeys = await loadExistingNaturalKeys(client, params.tenantId, entityKey);
    const seenKeys = new Set<string>();
    const errors: PreviewIssue[] = [];
    const warnings: PreviewIssue[] = [];
    let accepted = 0;
    let rejected = 0;

    rawRows.forEach((row, index) => {
      const rowNumber = index + 1;
      if (!isPlainObject(row)) {
        errors.push({ entity: entityKey, row: rowNumber, message: 'Row must be an object.' });
        rejected += 1;
        wouldSkip.push({ entity: entityKey, row: rowNumber, reason: 'invalid_row' });
        return;
      }

      const fieldIssues = findDangerousFields(row, entityKey, rowNumber);
      if (fieldIssues.length > 0) {
        errors.push(...fieldIssues);
        rejected += 1;
        wouldSkip.push({ entity: entityKey, row: rowNumber, reason: 'dangerous_field' });
        return;
      }

      const keys = naturalKeys(entityKey, row);
      const duplicateInBundle = keys.some((key) => seenKeys.has(key));
      keys.forEach((key) => seenKeys.add(key));

      if (duplicateInBundle) {
        warnings.push({ entity: entityKey, row: rowNumber, message: 'Potential duplicate inside import bundle.' });
        wouldSkip.push({ entity: entityKey, row: rowNumber, reason: 'duplicate_in_bundle', keys });
      } else if (keys.some((key) => existingKeys.has(key))) {
        wouldConflict.push({ entity: entityKey, row: rowNumber, reason: 'natural_key_already_exists', keys });
      } else {
        wouldCreate.push({ entity: entityKey, row: rowNumber, keys });
      }

      accepted += 1;
    });

    acceptedRows += accepted;
    rejectedRows += rejected;
    entityResults.push({
      key: entityKey,
      rows: rawRows.length,
      accepted,
      rejected,
      warnings,
      errors,
    });
  }

  return {
    valid: rejectedRows === 0,
    schema_version: PORTABILITY_SCHEMA_VERSION,
    summary: {
      total_rows: totalRows,
      accepted_rows: acceptedRows,
      rejected_rows: rejectedRows,
    },
    entities: entityResults,
    would_create: wouldCreate,
    would_skip: wouldSkip,
    would_conflict: wouldConflict,
    requestId: params.requestId ?? null,
  };
}

export function summarizeExportEntities(bundle: Awaited<ReturnType<typeof getTenantExportData>>) {
  return Object.fromEntries(
    Object.entries(bundle.entities).map(([key, rows]) => [key, Array.isArray(rows) ? rows.length : 0]),
  );
}

export function summarizePreview(preview: Awaited<ReturnType<typeof previewTenantImport>>) {
  return {
    schema_version: preview.schema_version,
    entity_keys: preview.entities.map((entity) => entity.key),
    counts: preview.summary,
    valid: preview.valid,
    rejected_count: preview.summary.rejected_rows,
  };
}
