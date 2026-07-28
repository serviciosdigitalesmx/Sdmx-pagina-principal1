import { Request, Response } from 'express';
import { z } from 'zod';
import { getTenantClient } from '@white-label/database';

const convertRequestSchema = z.object({
  estimatedCost: z.coerce.number().min(0).default(0),
  deviceType: z.string().min(1).optional(),
  deviceModel: z.string().min(1).optional(),
  issue: z.string().min(1).optional(),
  createCustomer: z.coerce.boolean().default(true),
});

const requestIdSchema = z.string().uuid();

function normalizeRequestStatus(status?: string | null) {
  const value = String(status ?? '').toLowerCase();
  if (value.includes('revis')) return 'en_revision';
  if (value.includes('conv')) return 'convertida';
  if (value.includes('rech')) return 'rechazada';
  return 'pendiente';
}

export async function listServiceRequests(req: Request, res: Response) {
  try {
    const tenantId = req.tenantId;

    if (!tenantId) {
      return res.status(401).json({ error: 'Tenant context is required' });
    }

    const supabase = getTenantClient(tenantId);
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      return res.status(502).json({ error: 'Failed to fetch service requests', details: error.message });
    }

    return res.status(200).json({
      success: true,
      data: data ?? [],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}

export async function getServiceRequestById(req: Request, res: Response) {
  try {
    const tenantId = req.tenantId;
    const requestId = req.params.id;

    if (!tenantId) {
      return res.status(401).json({ error: 'Tenant context is required' });
    }

    if (!requestId) {
      return res.status(400).json({ error: 'Request id is required' });
    }

    const supabase = getTenantClient(tenantId);
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('id', requestId)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Request not found', details: error?.message ?? 'Not found' });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...data,
        normalized_status: normalizeRequestStatus((data as { status?: string | null }).status ?? null),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}

export async function convertServiceRequestToOrder(req: Request, res: Response) {
  try {
    const tenantId = req.tenantId;
    const requestId = req.params.id;

    if (!tenantId) {
      return res.status(401).json({ error: 'Tenant context is required' });
    }

    if (!requestIdSchema.safeParse(requestId).success) {
      return res.status(400).json({ error: 'Invalid request id' });
    }

    const body = convertRequestSchema.parse(req.body);
    const supabase = getTenantClient(tenantId);

    const { data, error: rpcError } = await supabase.rpc('convert_service_request_transaction', {
      p_tenant_id: tenantId,
      p_request_id: requestId,
      p_estimated_cost: body.estimatedCost,
      p_device_type: body.deviceType ?? null,
      p_device_model: body.deviceModel ?? null,
      p_issue: body.issue ?? null,
      p_create_customer: body.createCustomer,
    });

    if (rpcError) {
      if (rpcError.message.includes('REQUEST_NOT_FOUND')) {
        return res.status(404).json({ error: 'Request not found', code: 'REQUEST_NOT_FOUND' });
      }

      if (rpcError.message.includes('REQUEST_ALREADY_CONVERTED')) {
        return res.status(409).json({ error: 'Request already converted', code: 'REQUEST_ALREADY_CONVERTED' });
      }

      if (rpcError.message.includes('INVALID_REQUEST_CONVERSION_INPUT')) {
        return res.status(400).json({ error: 'Invalid payload', code: 'INVALID_REQUEST_CONVERSION_INPUT' });
      }

      return res.status(502).json({ error: 'Failed to convert request to order', details: rpcError.message });
    }

    const result = data as { request_id?: unknown; order_id?: unknown; customer_id?: unknown } | null;
    if (
      !result
      || typeof result.request_id !== 'string'
      || typeof result.order_id !== 'string'
      || (result.customer_id !== null && typeof result.customer_id !== 'string')
    ) {
      return res.status(502).json({ error: 'Invalid conversion result from database' });
    }

    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid payload', details: error.errors });
    }
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}
