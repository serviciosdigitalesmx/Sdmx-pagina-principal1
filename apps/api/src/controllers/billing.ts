import { Request, Response } from 'express';
import { z } from 'zod';
import { createBillingCheckout, handleMercadoPagoWebhook } from '../services/billing';

const checkoutSchema = z.object({
  plan: z.enum(['basic', 'pro', 'enterprise']),
});

export async function createCheckout(req: Request, res: Response) {
  if (!req.user?.sub) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const parsed = checkoutSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
  }

  try {
    const result = await createBillingCheckout(req.user.sub, parsed.data);
    return res.status(201).json({
      success: true,
      initPoint: result.initPoint,
      preferenceId: result.preferenceId ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}

export async function createPublicCheckout(req: Request, res: Response) {
  const bodySchema = z.object({
    tenantSlug: z.string().min(1),
    plan: z.enum(['basic', 'pro', 'enterprise']),
  });

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
  }

  try {
    const { tenantSlug, plan } = parsed.data;
    const result = await createBillingCheckout(null, { plan, tenantSlug });
    return res.status(201).json({ success: true, initPoint: result.initPoint, preferenceId: result.preferenceId ?? null });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}

export async function mercadopagoWebhook(req: Request, res: Response) {
  const signature = (req.headers['x-signature'] as string | undefined) ?? (req.headers['x-mp-signature'] as string | undefined);
  const requestId = (req.headers['x-request-id'] as string | undefined) ?? (req.headers['x-correlation-id'] as string | undefined);

  if (!process.env.MP_ACCESS_TOKEN) {
    return res.status(500).json({ error: 'MP_ACCESS_TOKEN no configurado' });
  }

  try {
    const result = await handleMercadoPagoWebhook(req.body, signature, requestId);
    return res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}
