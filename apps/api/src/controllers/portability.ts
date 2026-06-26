import { Request, Response } from 'express';
import { getRequestIp } from '../lib/request-ip';
import { writeAuditLog } from '../services/security-backoffice';
import {
  getTenantExportData,
  getTenantExportSummary,
  PortabilityError,
  previewTenantImport,
  summarizeExportEntities,
  summarizePreview,
} from '../services/tenant-data-portability';

function tenantIdFromRequest(req: Request) {
  return req.tenantId ?? req.user?.tenantId ?? null;
}

function requestContext(req: Request) {
  return {
    tenantId: tenantIdFromRequest(req),
    userId: req.user?.userId ?? null,
    requestId: req.requestId ?? null,
    ipAddress: getRequestIp(req.headers, req.ip),
    userAgent: req.get('user-agent') ?? null,
  };
}

async function auditPortability(req: Request, action: string, dataAfter: Record<string, unknown>) {
  const context = requestContext(req);
  if (!context.tenantId) {
    throw new PortabilityError('Missing tenant context', 400);
  }

  await writeAuditLog({
    tenantId: context.tenantId,
    userId: context.userId,
    action,
    ipAddress: context.ipAddress,
    userAgent: context.userAgent,
    dataBefore: null,
    dataAfter: {
      ...dataAfter,
      requestId: context.requestId,
    },
  });
}

function respondError(res: Response, req: Request, error: unknown) {
  if (error instanceof PortabilityError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      details: error.details ?? undefined,
      requestId: req.requestId ?? null,
    });
  }

  const message = error instanceof Error ? error.message : 'Portability request failed';
  return res.status(502).json({
    success: false,
    error: message,
    requestId: req.requestId ?? null,
  });
}

export async function getExportSummary(req: Request, res: Response) {
  try {
    const tenantId = tenantIdFromRequest(req);
    if (!tenantId) {
      throw new PortabilityError('Missing tenant context', 400);
    }

    const data = await getTenantExportSummary({
      tenantId,
      requestId: req.requestId ?? null,
    });

    await auditPortability(req, 'portability.export.summary', {
      schema_version: data.schema_version,
      entity_counts: Object.fromEntries(data.entities.map((entity) => [entity.key, entity.count])),
      excluded_keys: data.excluded.map((entity) => entity.key),
    });

    return res.json({ success: true, data, requestId: req.requestId ?? null });
  } catch (error) {
    return respondError(res, req, error);
  }
}

export async function getExportData(req: Request, res: Response) {
  try {
    const tenantId = tenantIdFromRequest(req);
    if (!tenantId) {
      throw new PortabilityError('Missing tenant context', 400);
    }

    const data = await getTenantExportData({
      tenantId,
      limit: req.query.limit,
      requestId: req.requestId ?? null,
    });
    const entityCounts = summarizeExportEntities(data);

    await auditPortability(req, 'portability.export.data', {
      schema_version: data.schema_version,
      entity_counts: entityCounts,
      excluded_keys: data.excluded.map((entity) => entity.key),
      limit: data.limits.applied_limit,
    });

    return res.json({ success: true, data, requestId: req.requestId ?? null });
  } catch (error) {
    return respondError(res, req, error);
  }
}

export async function previewImport(req: Request, res: Response) {
  try {
    const tenantId = tenantIdFromRequest(req);
    if (!tenantId) {
      throw new PortabilityError('Missing tenant context', 400);
    }

    const data = await previewTenantImport({
      tenantId,
      body: req.body,
      requestId: req.requestId ?? null,
    });

    await auditPortability(req, 'portability.import.preview', summarizePreview(data));

    return res.json({ success: true, data, requestId: req.requestId ?? null });
  } catch (error) {
    return respondError(res, req, error);
  }
}
