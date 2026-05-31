import { createHmac } from 'node:crypto';
import { supabaseAdmin } from '@white-label/database';

export type BillingPlanCode = 'basic' | 'pro' | 'enterprise';

type CheckoutRequest = {
  plan: BillingPlanCode;
  tenantSlug?: string;
};

type CheckoutResponse = {
  initPoint: string;
  preferenceId?: string;
};

type MercadoPagoPreferenceResponse = {
  id?: string;
  init_point?: string;
  sandbox_init_point?: string;
};

type MercadoPagoPaymentResponse = {
  id?: string | number;
  status?: string;
  metadata?: {
    tenantId?: string;
    tenantSlug?: string;
    plan?: BillingPlanCode;
    userId?: string;
  };
};

const PLAN_PRICES: Record<BillingPlanCode, number> = {
  basic: 300,
  pro: 450,
  enterprise: 600,
};

function resolveBillingBaseUrl() {
  const candidates = [
    process.env.NEXT_PUBLIC_WEB_PUBLIC_URL,
    process.env.APP_URL,
    process.env.NEXT_PUBLIC_WEB_ADMIN_URL,
    process.env.CORS_ALLOWED_ORIGINS?.split(',').map((origin) => origin.trim()).find(Boolean),
  ].filter((value): value is string => Boolean(value?.trim()));

  if (candidates.length === 0) {
    throw new Error('APP_URL is required');
  }

  return new URL(candidates[0]).toString().replace(/\/$/, '');
}

function requireMercadoPagoAccessToken() {
  const accessToken = process.env.MP_ACCESS_TOKEN?.trim();
  if (!accessToken) {
    throw new Error('MP_ACCESS_TOKEN no configurado');
  }
  return accessToken;
}

function resolveWebhookBaseUrl() {
  const webhookBaseUrl = process.env.WEBHOOK_BASE_URL?.trim() || process.env.APP_URL?.trim();
  if (!webhookBaseUrl) {
    throw new Error('WEBHOOK_BASE_URL is required');
  }
  return webhookBaseUrl.replace(/\/$/, '');
}

function mapPaymentStatus(status: string) {
  if (status === 'approved') return 'active';
  if (status === 'rejected') return 'canceled';
  if (status === 'in_process') return 'pending';
  if (status === 'pending') return 'pending';
  return 'past_due';
}

function buildSignature(paymentId: string, topic: string, signature: string) {
  const webhookSecret = process.env.MP_WEBHOOK_SECRET?.trim();
  if (!webhookSecret) {
    return true;
  }

  const parts = signature.split(',').reduce((acc, part) => {
    const [key, value] = part.split('=');
    if (key && value) {
      acc[key.trim()] = value.trim();
    }
    return acc;
  }, {} as Record<string, string>);

  const ts = parts.ts;
  const v1 = parts.v1;

  if (!ts || !v1) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - Number(ts)) > 600) {
    return false;
  }

  const template = `id:${paymentId};topic:${topic};ts:${ts};`;
  const computed = createHmac('sha256', webhookSecret).update(template).digest('hex');
  return computed === v1;
}

async function writeAuditLog(tenantId: string, action: string, payload: Record<string, unknown>) {
  const { error } = await supabaseAdmin.from('audit_logs').insert([{
    tenant_id: tenantId,
    action,
    data_after: payload,
    created_at: new Date().toISOString(),
  }]);

  if (error) {
    return;
  }
}

async function resolveTenantForCheckout(authUserId?: string | null, tenantSlug?: string) {
  if (tenantSlug) {
    const { data: tenantRow, error: tenantError } = await supabaseAdmin
      .from('tenants')
      .select('id, slug, name, trial_expires_at, billing_exempt')
      .eq('slug', tenantSlug)
      .maybeSingle();

    if (tenantError) {
      throw new Error(tenantError.message);
    }

    if (!tenantRow) {
      throw new Error('Tenant not found');
    }

    return {
      userRow: null,
      tenantRow,
    };
  }

  if (!authUserId) {
    throw new Error('No se pudo resolver el tenant de la sesión');
  }

  const { data: userRow, error: userError } = await supabaseAdmin
    .from('users')
    .select('id, tenant_id, role, email')
    .eq('auth_user_id', authUserId)
    .maybeSingle();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!userRow?.tenant_id) {
    throw new Error('No se pudo resolver el tenant de la sesión');
  }

  const { data: tenantRow, error: tenantError } = await supabaseAdmin
    .from('tenants')
    .select('id, slug, name, trial_expires_at, billing_exempt')
    .eq('id', userRow.tenant_id)
    .maybeSingle();

  if (tenantError) {
    throw new Error(tenantError.message);
  }

  if (!tenantRow) {
    throw new Error('Tenant not found');
  }

  return { userRow, tenantRow };
}

async function updateOrganizationSubscription(input: {
  tenantId: string;
  tenantSlug: string;
  status: string;
}) {
  const { data: existing } = await supabaseAdmin
    .from('organizations')
    .select('id')
    .eq('id', input.tenantId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabaseAdmin
      .from('organizations')
      .update({
        subscription_status: input.status,
      })
      .eq('id', input.tenantId);

    if (error) {
      throw error;
    }
    return;
  }

  const { error } = await supabaseAdmin.from('organizations').insert([{
    id: input.tenantId,
    name: input.tenantSlug,
    slug: input.tenantSlug,
    subscription_status: input.status,
  }]);

  if (error) {
    throw error;
  }
}

export async function createBillingCheckout(authUserId: string | null, request: CheckoutRequest): Promise<CheckoutResponse> {
  const accessToken = requireMercadoPagoAccessToken();
  const amount = PLAN_PRICES[request.plan];

  if (!amount) {
    throw new Error('Plan inválido');
  }

  const { userRow, tenantRow } = await resolveTenantForCheckout(authUserId, request.tenantSlug);
  const appUrl = resolveBillingBaseUrl();
  const webhookBaseUrl = resolveWebhookBaseUrl();

  const preference = {
    items: [
      {
        title: `Servicios Digitales MX - Plan ${request.plan}`,
        quantity: 1,
        currency_id: 'MXN',
        unit_price: amount,
      },
    ],
    back_urls: {
      success: `${appUrl}/billing/success`,
      failure: `${appUrl}/billing/failure`,
      pending: `${appUrl}/billing/pending`,
    },
    auto_return: 'approved',
    notification_url: `${webhookBaseUrl}/api/webhooks/mercadopago`,
    metadata: {
      tenantId: tenantRow.id,
      tenantSlug: tenantRow.slug,
      plan: request.plan,
      ...(userRow ? { userId: userRow.id } : {}),
    },
  };

  const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(preference),
  });

  const json = await response.json().catch(() => ({} as MercadoPagoPreferenceResponse));

  if (!response.ok) {
    throw new Error('Mercado Pago rechazó la preferencia');
  }

  const initPoint = String(json.init_point || json.sandbox_init_point || '').trim();
  if (!initPoint) {
    throw new Error('Mercado Pago no devolvió init_point');
  }

  await writeAuditLog(tenantRow.id, 'billing.checkout_created', {
    tenantId: tenantRow.id,
    tenantSlug: tenantRow.slug,
    plan: request.plan,
    preferenceId: json.id ?? null,
    initPoint,
  });

  return {
    initPoint,
    preferenceId: json.id ? String(json.id) : undefined,
  };
}

export async function handleMercadoPagoWebhook(payload: unknown, signature?: string, requestId?: string) {
  const accessToken = requireMercadoPagoAccessToken();
  const typedPayload = payload as {
    type?: string;
    action?: string;
    data?: { id?: string | number };
    id?: string | number;
    topic?: string;
  };

  const topic = String(typedPayload.type || typedPayload.action || typedPayload.topic || '');
  const paymentId = String(typedPayload.data?.id || typedPayload.id || '');

  if (!paymentId || !topic.includes('payment')) {
    return { received: true };
  }

  if (signature && !buildSignature(paymentId, topic, signature)) {
    throw new Error('Firma inválida');
  }

  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { authorization: `Bearer ${accessToken}` },
  });

  const payment = await response.json().catch(() => ({} as MercadoPagoPaymentResponse));
  if (!response.ok) {
    throw new Error('No se pudo obtener el pago');
  }

  const tenantId = String(payment.metadata?.tenantId || '');
  const tenantSlug = String(payment.metadata?.tenantSlug || '');
  const plan = (payment.metadata?.plan || 'basic') as BillingPlanCode;
  const mappedStatus = mapPaymentStatus(String(payment.status || 'pending'));

  if (tenantId) {
    await updateOrganizationSubscription({
      tenantId,
      tenantSlug,
      status: mappedStatus,
    });
  }

  await writeAuditLog(tenantId || 'unknown', 'billing.mercadopago_webhook', {
    paymentId,
    status: payment.status,
    requestId,
    plan,
  });

  return { received: true };
}
