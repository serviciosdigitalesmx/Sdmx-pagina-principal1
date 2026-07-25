import { Request, Response } from 'express';
import { supabaseAdmin, getTenantClient } from '@white-label/database';
import { getRequestIp } from '../lib/request-ip';

// Helper to get IP
function getClientIp(req: Request): string {
  return (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '').split(',')[0].trim();
}

// 1. GET /api/public/order/:publicToken
export async function getPublicOrderDetails(req: Request, res: Response) {
  const { publicToken } = req.params;
  if (!publicToken) return res.status(400).json({ error: 'Public token required' });

  // Load order using supabaseAdmin (which bypasses RLS dynamically since it's a public request)
  const { data: order, error } = await supabaseAdmin
    .from('service_orders')
    .select('*, customer:customer_id(*)')
    .eq('public_token', publicToken)
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  if (!order) return res.status(404).json({ error: 'Order not found' });

  // Get authorization status
  const { data: authorization } = await supabaseAdmin
    .from('customer_authorizations')
    .select('*')
    .eq('order_id', order.id)
    .maybeSingle();

  return res.json({
    order,
    authorization: authorization || null
  });
}

// 2. POST /api/public/order/:publicToken/authorize
export async function authorizeOrder(req: Request, res: Response) {
  const { publicToken } = req.params;
  const { decision, acceptedByName, acceptedByPhone, acceptedByEmail } = req.body;

  if (!publicToken) return res.status(400).json({ error: 'Public token required' });
  if (!decision || !['accepted', 'rejected'].includes(decision)) {
    return res.status(400).json({ error: 'Invalid decision' });
  }

  // Load order
  const { data: order, error: orderErr } = await supabaseAdmin
    .from('service_orders')
    .select('*')
    .eq('public_token', publicToken)
    .maybeSingle();

  if (orderErr || !order) return res.status(404).json({ error: 'Order not found' });

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
      ip_address: clientIp,
      user_agent: userAgent,
      decided_at: new Date().toISOString()
    })
    .select()
    .single();

  if (authErr) return res.status(500).json({ error: authErr.message });

  // Update order status: If accepted -> 'reparacion', if rejected -> 'presupuesto_rechazado' (or update it accordingly)
  const nextStatus = decision === 'accepted' ? 'reparacion' : 'presupuesto_rechazado';
  await supabaseAdmin
    .from('service_orders')
    .update({ status: nextStatus })
    .eq('id', order.id);

  return res.json({ success: true, authorization });
}

// 3. POST /api/public/order/:publicToken/payment
export async function createPublicOrderPayment(req: Request, res: Response) {
  const { publicToken } = req.params;
  const { amount, paymentMethod } = req.body;

  if (!publicToken) return res.status(400).json({ error: 'Public token required' });
  if (!amount || Number(amount) <= 0) return res.status(400).json({ error: 'Invalid amount' });

  // Load order
  const { data: order, error: orderErr } = await supabaseAdmin
    .from('service_orders')
    .select('*')
    .eq('public_token', publicToken)
    .maybeSingle();

  if (orderErr || !order) return res.status(404).json({ error: 'Order not found' });

  // Insert pending online payment
  const { data: payment, error: payErr } = await supabaseAdmin
    .from('online_payments')
    .insert({
      tenant_id: order.tenant_id,
      order_id: order.id,
      amount: Number(amount),
      payment_method: paymentMethod,
      status: 'pending'
    })
    .select()
    .single();

  if (payErr) return res.status(500).json({ error: payErr.message });

  // Re-use MercadoPago checkout logic or Stripe checkout logic if present,
  // For the sake of Phase 4 we will mock the redirect URL and complete checkout.
  return res.json({
    success: true,
    payment,
    initPoint: `https://checkout.fixi.lat/pay/${payment.id}` // Mock payment gateway link
  });
}
