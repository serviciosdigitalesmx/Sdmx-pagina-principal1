import { Request, Response } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '@white-label/database';

const subscriptionSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
  deviceLabel: z.string().optional().or(z.literal('')),
});

export const getVapidPublicKey = async (_req: Request, res: Response) => {
  const publicKey = process.env.PWA_VAPID_PUBLIC_KEY?.trim();
  if (!publicKey) {
    return res.status(503).json({ error: 'PWA_VAPID_PUBLIC_KEY is not configured' });
  }

  return res.json({ success: true, data: { publicKey } });
};

export const subscribePush = async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId;
    if (!tenantId) {
      return res.status(401).json({ error: 'Tenant context is required' });
    }

    const body = subscriptionSchema.parse(req.body);
    const { data, error } = await supabaseAdmin
      .from('pwa_push_subscriptions')
      .upsert({
        tenant_id: tenantId,
        user_id: req.user?.userId ?? null,
        endpoint: body.endpoint,
        p256dh: body.keys.p256dh,
        auth: body.keys.auth,
        device_label: body.deviceLabel || null,
        active: true,
        last_seen_at: new Date().toISOString(),
      }, { onConflict: 'tenant_id,endpoint' })
      .select('id, tenant_id, user_id, endpoint, active, created_at, updated_at')
      .single();

    if (error) {
      return res.status(502).json({ error: 'Failed to persist push subscription', details: error.message });
    }

    return res.status(201).json({ success: true, data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid payload', details: error.errors });
    }
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const unsubscribePush = async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId;
    if (!tenantId) {
      return res.status(401).json({ error: 'Tenant context is required' });
    }

    const body = z.object({ endpoint: z.string().url() }).parse(req.body);
    const { error } = await supabaseAdmin
      .from('pwa_push_subscriptions')
      .update({ active: false, updated_at: new Date().toISOString() })
      .eq('tenant_id', tenantId)
      .eq('endpoint', body.endpoint);

    if (error) {
      return res.status(502).json({ error: 'Failed to deactivate push subscription', details: error.message });
    }

    return res.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid payload', details: error.errors });
    }
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

