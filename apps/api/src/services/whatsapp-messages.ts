import { createHash } from 'crypto';
import { supabaseAdmin } from '@white-label/database';

type TemplateKey = 'order_received' | 'status_update' | 'authorization_request' | 'portal_link' | 'warranty_info';

type RequestUser = {
  role?: string;
  email?: string;
  userId?: string;
  sub?: string;
};

type ScopeContext = {
  mode: 'consolidated' | 'branch';
  sucursalId: string | null;
};

type ServiceOrderRow = {
  id: string;
  tenant_id: string;
  sucursal_id: string | null;
  assigned_user_id: string | null;
  customer_id: string | null;
  folio: string | null;
  status: string | null;
  device_info: Record<string, unknown> | null;
  estimated_cost: number | string | null;
  public_token: string | null;
  warranty_until: string | null;
};

type CustomerRow = {
  id: string;
  name: string | null;
  phone: string | null;
  data_consent_status: string | null;
  data_consent_scope: unknown;
};

type MessageQueueRow = {
  id: string;
  status: string;
  template_key: TemplateKey;
  recipient_phone: string;
  recipient_phone_e164: string | null;
  public_token_last4: string | null;
  consent_status_snapshot: string | null;
  generated_at: string;
  opened_at: string | null;
  created_at: string;
};

export class WhatsAppMessageError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.name = 'WhatsAppMessageError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

function isUuid(value: unknown) {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function getGeneratedBy(user?: RequestUser | null) {
  if (isUuid(user?.userId)) return user?.userId ?? null;
  if (isUuid(user?.sub)) return user?.sub ?? null;
  return null;
}

function last4(value: string | null | undefined) {
  const clean = String(value ?? '').trim();
  return clean ? clean.slice(-4) : null;
}

function sanitizePhone(rawPhone: string, countryCode?: string | null) {
  const digits = rawPhone.replace(/\D/g, '');
  const cleanCountry = String(countryCode ?? '').replace(/\D/g, '');

  if (digits.length === 10 && cleanCountry === '52') {
    return `52${digits}`;
  }

  if (digits.length >= 11 && digits.length <= 15) {
    return digits;
  }

  throw new WhatsAppMessageError(400, 'Recipient phone is invalid');
}

function formatMoney(value: number | string | null) {
  const parsed = Number(value ?? 0);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(parsed);
}

function getDeviceInfoValue(deviceInfo: Record<string, unknown> | null | undefined, key: string) {
  const value = deviceInfo?.[key];
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function buildPortalUrl(tenantSlug: string | null | undefined, publicToken: string) {
  const slug = String(tenantSlug ?? '').trim();
  if (!slug) {
    throw new WhatsAppMessageError(500, 'Tenant slug is required to build portal URL');
  }

  const baseUrl = (process.env.NEXT_PUBLIC_WEB_PUBLIC_URL || process.env.APP_URL || '').trim().replace(/\/$/, '');
  const path = `/t/${encodeURIComponent(slug)}/portal?token=${encodeURIComponent(publicToken)}`;
  return baseUrl ? `${baseUrl}${path}` : path;
}

function buildTemplateMessage(params: {
  templateKey: TemplateKey;
  customerName: string;
  businessName: string;
  folio: string;
  status: string;
  portalUrl: string;
  estimatedCost: string | null;
  warrantyUntil: string | null;
}) {
  const { templateKey, customerName, businessName, folio, status, portalUrl, estimatedCost, warrantyUntil } = params;

  if (templateKey === 'order_received') {
    return `Hola ${customerName}, recibimos tu orden ${folio} en ${businessName}. Puedes consultar el estado de forma segura aqui: ${portalUrl}`;
  }

  if (templateKey === 'status_update') {
    return `Hola ${customerName}, tu orden ${folio} cambio a estado "${status}". Revisa el avance aqui: ${portalUrl}`;
  }

  if (templateKey === 'authorization_request') {
    const costText = estimatedCost ? ` Monto estimado: ${estimatedCost}.` : '';
    return `Hola ${customerName}, necesitamos tu autorizacion para continuar con la orden ${folio}.${costText} Revisa y autoriza aqui: ${portalUrl}`;
  }

  if (templateKey === 'warranty_info') {
    const warrantyText = warrantyUntil ? ` Vigencia: ${warrantyUntil}.` : '';
    return `Hola ${customerName}, puedes consultar la informacion de garantia de tu orden ${folio}.${warrantyText} Entra aqui: ${portalUrl}`;
  }

  return `Hola ${customerName}, consulta el portal seguro de tu orden ${folio} aqui: ${portalUrl}`;
}

function isConsentBlocked(status: string | null | undefined) {
  return ['revoked', 'denied', 'rejected', 'declined'].includes(String(status ?? '').trim().toLowerCase());
}

function buildConsentWarning(status: string | null | undefined) {
  const normalized = String(status ?? '').trim().toLowerCase();
  if (normalized === 'accepted') return null;
  if (!normalized) return 'No hay consentimiento registrado; el borrador queda como accion manual.';
  return `Consentimiento no confirmado (${normalized}); el borrador queda como accion manual.`;
}

async function loadTenant(tenantId: string) {
  const { data, error } = await supabaseAdmin
    .from('tenants')
    .select('id, name, slug')
    .eq('id', tenantId)
    .maybeSingle();

  if (error || !data) {
    throw new WhatsAppMessageError(404, 'Tenant not found', error?.message);
  }

  return {
    name: String(data.name ?? 'FIXI'),
    slug: String(data.slug ?? ''),
  };
}

async function loadOrder(params: { tenantId: string; orderId: string; user?: RequestUser | null; scope?: ScopeContext | null }) {
  let query = supabaseAdmin
    .from('service_orders')
    .select('id, tenant_id, sucursal_id, assigned_user_id, customer_id, folio, status, device_info, estimated_cost, public_token, warranty_until')
    .eq('tenant_id', params.tenantId)
    .eq('id', params.orderId);

  if (params.scope?.mode === 'branch' && isUuid(params.scope.sucursalId)) {
    query = query.eq('sucursal_id', params.scope.sucursalId);
  }

  if (params.user?.role === 'technician' && isUuid(params.user.userId)) {
    query = query.eq('assigned_user_id', params.user.userId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    throw new WhatsAppMessageError(502, 'Failed to load service order', error.message);
  }

  if (!data) {
    throw new WhatsAppMessageError(404, 'Order not found');
  }

  return data as ServiceOrderRow;
}

async function loadCustomer(tenantId: string, customerId: string | null) {
  if (!customerId) return null;

  const { data, error } = await supabaseAdmin
    .from('customers')
    .select('id, name, phone, data_consent_status, data_consent_scope')
    .eq('tenant_id', tenantId)
    .eq('id', customerId)
    .maybeSingle();

  if (error) {
    throw new WhatsAppMessageError(502, 'Failed to load customer', error.message);
  }

  return (data as CustomerRow | null) ?? null;
}

function normalizeMessageRow(row: MessageQueueRow) {
  return {
    id: row.id,
    status: row.status,
    templateKey: row.template_key,
    recipientPhoneE164: row.recipient_phone_e164,
    publicTokenLast4: row.public_token_last4,
    consentStatusSnapshot: row.consent_status_snapshot,
    generatedAt: row.generated_at,
    openedAt: row.opened_at,
    createdAt: row.created_at,
  };
}

export async function createWhatsAppDraft(params: {
  tenantId: string;
  tenantSlug?: string | null;
  orderId: string;
  templateKey: TemplateKey;
  recipientPhone?: string | null;
  countryCode?: string | null;
  idempotencyKey?: string | null;
  user?: RequestUser | null;
  scope?: ScopeContext | null;
}) {
  const [tenant, order] = await Promise.all([
    loadTenant(params.tenantId),
    loadOrder({ tenantId: params.tenantId, orderId: params.orderId, user: params.user, scope: params.scope }),
  ]);

  if (!order.public_token || !String(order.public_token).trim()) {
    throw new WhatsAppMessageError(409, 'Order has no public token');
  }

  const customer = await loadCustomer(params.tenantId, order.customer_id);
  const deviceInfo = order.device_info ?? {};
  const rawPhone = params.recipientPhone?.trim()
    || customer?.phone?.trim()
    || getDeviceInfoValue(deviceInfo, 'customer_phone')
    || '';

  if (!rawPhone) {
    throw new WhatsAppMessageError(400, 'Recipient phone is required');
  }

  if (isConsentBlocked(customer?.data_consent_status)) {
    throw new WhatsAppMessageError(409, 'Customer consent blocks WhatsApp draft', {
      consentStatus: customer?.data_consent_status,
    });
  }

  const recipientPhoneE164 = sanitizePhone(rawPhone, params.countryCode);
  const portalUrl = buildPortalUrl(params.tenantSlug || tenant.slug, order.public_token);
  const customerName = customer?.name || getDeviceInfoValue(deviceInfo, 'customer_name') || 'cliente';
  const folio = String(order.folio ?? 'sin folio');
  const messageBody = buildTemplateMessage({
    templateKey: params.templateKey,
    customerName,
    businessName: tenant.name,
    folio,
    status: String(order.status ?? 'sin estado'),
    portalUrl,
    estimatedCost: formatMoney(order.estimated_cost),
    warrantyUntil: order.warranty_until,
  });
  const waMeUrl = `https://wa.me/${recipientPhoneE164}?text=${encodeURIComponent(messageBody)}`;
  const idempotencyKey = (params.idempotencyKey ?? '').trim()
    || `t13:${params.tenantId}:${params.orderId}:${params.templateKey}:${recipientPhoneE164}`;
  const publicTokenLast4 = last4(order.public_token);
  const consentScopeSnapshot = customer?.data_consent_scope == null ? null : JSON.stringify(customer.data_consent_scope);

  const insertPayload = {
    tenant_id: params.tenantId,
    service_order_id: order.id,
    customer_id: order.customer_id,
    channel: 'whatsapp',
    provider: 'manual_wa_me',
    status: 'generated',
    template_key: params.templateKey,
    template_version: 't13-v1',
    recipient_name: customerName,
    recipient_phone: rawPhone,
    recipient_phone_e164: recipientPhoneE164,
    message_body: messageBody,
    wa_me_url: waMeUrl,
    public_token_last4: publicTokenLast4,
    portal_url_hash: createHash('sha256').update(portalUrl).digest('hex'),
    consent_status_snapshot: customer?.data_consent_status ?? null,
    consent_scope_snapshot: consentScopeSnapshot,
    generated_by: getGeneratedBy(params.user),
    idempotency_key: idempotencyKey,
    metadata: {
      templateKey: params.templateKey,
      manualOnly: true,
      source: 't13',
      orderFolio: folio,
    },
  };

  const { data: inserted, error: insertError } = await supabaseAdmin
    .from('message_queue')
    .insert([insertPayload])
    .select('id, status, template_key, recipient_phone, recipient_phone_e164, public_token_last4, consent_status_snapshot, generated_at, opened_at, created_at')
    .single();

  let messageRow = inserted as MessageQueueRow | null;
  let reusedExisting = false;

  if (insertError) {
    if (insertError.code !== '23505') {
      throw new WhatsAppMessageError(502, 'Failed to persist WhatsApp draft', insertError.message);
    }

    const { data: existing, error: existingError } = await supabaseAdmin
      .from('message_queue')
      .select('id, status, template_key, recipient_phone, recipient_phone_e164, public_token_last4, consent_status_snapshot, generated_at, opened_at, created_at')
      .eq('tenant_id', params.tenantId)
      .eq('idempotency_key', idempotencyKey)
      .maybeSingle();

    if (existingError || !existing) {
      throw new WhatsAppMessageError(502, 'Failed to load existing WhatsApp draft', existingError?.message);
    }

    messageRow = existing as MessageQueueRow;
    reusedExisting = true;
  }

  if (!reusedExisting) {
    const { error: eventError } = await supabaseAdmin.from('service_order_events').insert([{
      tenant_id: params.tenantId,
      service_order_id: order.id,
      event_type: 'whatsapp_draft_generated',
      previous_status: order.status,
      new_status: order.status,
      note: `WhatsApp draft generated with template ${params.templateKey}. Token last4: ${publicTokenLast4 ?? 'n/a'}.`,
      actor_name: params.user?.email ?? params.user?.role ?? 'system',
      created_by: getGeneratedBy(params.user),
    }]);

    if (eventError) {
      throw new WhatsAppMessageError(502, 'Failed to persist WhatsApp draft event', eventError.message);
    }
  }

  if (!messageRow) {
    throw new WhatsAppMessageError(502, 'WhatsApp draft was not persisted');
  }

  return {
    queueId: messageRow.id,
    status: messageRow.status,
    templateKey: messageRow.template_key,
    recipientPhone: recipientPhoneE164,
    waMeUrl,
    messageBody,
    consentWarning: buildConsentWarning(customer?.data_consent_status),
  };
}

export async function listWhatsAppMessages(params: {
  tenantId: string;
  orderId: string;
  user?: RequestUser | null;
  scope?: ScopeContext | null;
}) {
  await loadOrder({ tenantId: params.tenantId, orderId: params.orderId, user: params.user, scope: params.scope });

  const { data, error } = await supabaseAdmin
    .from('message_queue')
    .select('id, status, template_key, recipient_phone, recipient_phone_e164, public_token_last4, consent_status_snapshot, generated_at, opened_at, created_at')
    .eq('tenant_id', params.tenantId)
    .eq('service_order_id', params.orderId)
    .eq('channel', 'whatsapp')
    .order('created_at', { ascending: false });

  if (error) {
    throw new WhatsAppMessageError(502, 'Failed to load WhatsApp message history', error.message);
  }

  return (data as MessageQueueRow[] | null ?? []).map(normalizeMessageRow);
}
