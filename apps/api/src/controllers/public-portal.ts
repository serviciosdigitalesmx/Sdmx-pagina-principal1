import { Request, Response } from 'express';
import { supabaseAdmin } from '@white-label/database';

// Helper to get IP
function getClientIp(req: Request): string {
  return (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '').split(',')[0].trim();
}

/** Public DTO — only safe fields for the customer portal */
function toPublicOrderDTO(order: Record<string, unknown>, customer: Record<string, unknown> | null) {
  return {
    folio: order.folio,
    status: order.status,
    statusLabel: mapStatusLabel(String(order.status ?? '')),
    deviceType: (order.device_info as Record<string, unknown> | null)?.device_type ?? null,
    deviceBrand: (order.device_info as Record<string, unknown> | null)?.brand ?? null,
    deviceModel: (order.device_info as Record<string, unknown> | null)?.model ?? null,
    issue: order.issue,
    estimatedCost: order.estimated_cost,
    totalCost: order.total_cost,
    promisedDate: order.promised_date,
    createdAt: order.created_at,
    customerName: customer?.name ?? null,
    tenantName: null as string | null, // populated separately if needed
    tenantLogo: null as string | null,
  };
}

function mapStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    recibido: 'Recibido',
    diagnostico: 'En Diagnóstico',
    presupuesto: 'Presupuesto Enviado',
    presupuesto_rechazado: 'Presupuesto Rechazado',
    reparacion: 'En Reparación',
    reparado: 'Reparado',
    listo: 'Listo para Entregar',
    entregado: 'Entregado',
    cancelado: 'Cancelado',
  };
  return labels[status] ?? status;
}

// 1. GET /api/public-portal/order/:publicToken
export async function getPublicOrderDetails(req: Request, res: Response) {
  const { publicToken } = req.params;
  if (!publicToken || publicToken.length < 10) {
    return res.status(404).json({ error: 'Not found' });
  }

  // Load order — select ONLY needed columns, no internal notes/costs/logs
  const { data: order, error } = await supabaseAdmin
    .from('service_orders')
    .select('id, tenant_id, folio, status, issue, device_info, estimated_cost, total_cost, promised_date, created_at, customer_id, public_token')
    .eq('public_token', publicToken)
    .maybeSingle();

  if (error) return res.status(500).json({ error: 'Internal error' });
  // Return same response for missing AND invalid tokens to prevent enumeration
  if (!order) return res.status(404).json({ error: 'Not found' });

  // Load customer — only name
  let customer: Record<string, unknown> | null = null;
  if (order.customer_id) {
    const { data: cust } = await supabaseAdmin
      .from('customers')
      .select('name')
      .eq('id', order.customer_id)
      .maybeSingle();
    customer = cust;
  }

  // Get public timeline events
  const { data: events } = await supabaseAdmin
    .from('service_order_events')
    .select('event_type, description, created_at')
    .eq('order_id', order.id)
    .order('created_at', { ascending: true });

  // Get authorization status
  const { data: authorization } = await supabaseAdmin
    .from('customer_authorizations')
    .select('id, authorization_type, decision, amount_authorized, decided_at')
    .eq('order_id', order.id)
    .order('decided_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  // Get public-visible evidence
  const { data: evidence } = await supabaseAdmin
    .from('service_order_documents')
    .select('id, file_type, file_url, created_at')
    .eq('order_id', order.id)
    .eq('visible_to_customer', true)
    .order('created_at', { ascending: true });

  // Get tenant branding
  const { data: tenant } = await supabaseAdmin
    .from('tenants')
    .select('business_name, logo_url')
    .eq('id', order.tenant_id)
    .maybeSingle();

  const dto = toPublicOrderDTO(order, customer);
  dto.tenantName = tenant?.business_name ?? null;
  dto.tenantLogo = tenant?.logo_url ?? null;

  return res.json({
    success: true,
    data: {
      order: dto,
      timeline: events ?? [],
      authorization: authorization ?? null,
      evidence: evidence ?? [],
    }
  });
}

// 2. POST /api/public-portal/order/:publicToken/authorize
export async function authorizeOrder(req: Request, res: Response) {
  const { publicToken } = req.params;
  const { decision, acceptedByName, acceptedByPhone, acceptedByEmail, signatureDataUrl, termsVersion } = req.body;

  if (!publicToken || publicToken.length < 10) {
    return res.status(404).json({ error: 'Not found' });
  }
  if (!decision || !['accepted', 'rejected'].includes(decision)) {
    return res.status(400).json({ success: false, error: 'Decisión inválida. Debe ser "accepted" o "rejected".' });
  }

  // Load order
  const { data: order, error: orderErr } = await supabaseAdmin
    .from('service_orders')
    .select('id, tenant_id, estimated_cost, status')
    .eq('public_token', publicToken)
    .maybeSingle();

  if (orderErr || !order) return res.status(404).json({ error: 'Not found' });

  // Check for existing authorization (idempotency)
  const { data: existing } = await supabaseAdmin
    .from('customer_authorizations')
    .select('id, decision')
    .eq('order_id', order.id)
    .eq('public_token', publicToken)
    .maybeSingle();

  if (existing) {
    // Already authorized — return existing result (idempotent)
    return res.json({ success: true, authorization: existing, alreadyProcessed: true });
  }

  // Insert authorization
  const clientIp = getClientIp(req);
  const userAgent = req.headers['user-agent'] || 'unknown';

  const { data: authorization, error: authErr } = await supabaseAdmin
    .from('customer_authorizations')
    .insert({
      tenant_id: order.tenant_id,
      order_id: order.id,
      public_token: publicToken,
      authorization_type: 'quotation',
      decision,
      amount_authorized: decision === 'accepted' ? order.estimated_cost : 0,
      accepted_by_name: acceptedByName || null,
      accepted_by_phone: acceptedByPhone || null,
      accepted_by_email: acceptedByEmail || null,
      signature_url: signatureDataUrl || null,
      terms_version: termsVersion || null,
      ip_address: clientIp,
      user_agent: userAgent,
      decided_at: new Date().toISOString()
    })
    .select('id, decision, amount_authorized, decided_at')
    .single();

  if (authErr) return res.status(500).json({ success: false, error: 'Error al guardar la autorización' });

  // Update order status using a conditional update (only from valid source statuses)
  const validSourceStatuses = ['presupuesto', 'diagnostico'];
  const nextStatus = decision === 'accepted' ? 'reparacion' : 'presupuesto_rechazado';

  await supabaseAdmin
    .from('service_orders')
    .update({ status: nextStatus })
    .eq('id', order.id)
    .in('status', validSourceStatuses);

  return res.json({ success: true, data: { authorization } });
}

// 3. POST /api/public-portal/order/:publicToken/payment — Create payment intent
export async function createPublicOrderPayment(req: Request, res: Response) {
  const { publicToken } = req.params;
  const { paymentMethod } = req.body;

  if (!publicToken || publicToken.length < 10) {
    return res.status(404).json({ error: 'Not found' });
  }

  // Load order
  const { data: order, error: orderErr } = await supabaseAdmin
    .from('service_orders')
    .select('id, tenant_id, estimated_cost, total_cost')
    .eq('public_token', publicToken)
    .maybeSingle();

  if (orderErr || !order) return res.status(404).json({ error: 'Not found' });

  // Calculate balance server-side (never trust client amount)
  const totalAuthorized = Number(order.total_cost ?? order.estimated_cost ?? 0);

  // Get existing confirmed payments
  const { data: existingPayments } = await supabaseAdmin
    .from('customer_payments')
    .select('amount')
    .eq('order_id', order.id)
    .eq('status', 'confirmed');

  const paidAmount = (existingPayments ?? []).reduce((sum, p) => sum + Number(p.amount ?? 0), 0);
  const balance = totalAuthorized - paidAmount;

  if (balance <= 0) {
    return res.status(400).json({ success: false, error: 'La orden ya está pagada completamente' });
  }

  // Check for MercadoPago credentials
  const mercadoPagoToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!mercadoPagoToken) {
    return res.status(503).json({
      success: false,
      error: 'Pasarela de pago no configurada. Contacte al taller para pagar directamente.',
      code: 'PAYMENT_GATEWAY_NOT_CONFIGURED'
    });
  }

  // TODO: Create real MercadoPago preference using the official SDK
  // This requires the mercadopago npm package and valid credentials.
  // For now, return a clear error instead of a fake URL.
  return res.status(503).json({
    success: false,
    error: 'Integración de pago en línea pendiente de configuración. Contacte al taller.',
    code: 'PAYMENT_INTEGRATION_PENDING',
    balance,
    paymentMethod: paymentMethod ?? 'mercadopago'
  });
}
