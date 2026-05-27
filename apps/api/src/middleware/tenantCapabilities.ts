import { Request, Response, NextFunction } from 'express';
import { loadTenantBillingSummary } from '../services/tenant-billing';
import { loadTenantRuntimeConfig } from '../services/tenant-config';
import { resolveTenantCapabilities } from '../services/tenant-capabilities';

const PUBLIC_MODULE_KEYS = new Set(['landing', 'portal', 'whatsapp']);

export async function loadTenantCapabilitiesForRequest(req: Request) {
  const tenantId = req.tenantId ?? req.user?.tenantId;
  if (!tenantId) {
    return null;
  }

  const [runtimeConfig, billing] = await Promise.all([
    loadTenantRuntimeConfig(tenantId),
    loadTenantBillingSummary(tenantId, req.user?.tenantSlug ?? req.params.tenantSlug ?? null).catch(() => null),
  ]);

  return resolveTenantCapabilities({
    tenantId,
    tenantSlug: req.user?.tenantSlug ?? req.params.tenantSlug ?? null,
    tenantEmail: req.user?.email ?? null,
    billing,
    runtimeConfig,
  });
}

export async function attachTenantCapabilities(req: Request, _res: Response, next: NextFunction) {
  try {
    req.tenantCapabilities = await loadTenantCapabilitiesForRequest(req) ?? undefined;
    next();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to resolve tenant capabilities';
    return _res.status(502).json({ error: message });
  }
}

export function requireTenantModule(moduleKey: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const normalizedModuleKey = moduleKey.trim().toLowerCase();

    if (PUBLIC_MODULE_KEYS.has(normalizedModuleKey)) {
      return next();
    }

    try {
      const capabilities = req.tenantCapabilities ?? await loadTenantCapabilitiesForRequest(req);

      if (!capabilities) {
        return res.status(400).json({ error: 'Missing tenant capabilities' });
      }

      req.tenantCapabilities = capabilities;

      if (capabilities.access_status === 'master' || capabilities.access_status === 'billing_exempt') {
        return next();
      }

      if (capabilities.active_modules.includes(normalizedModuleKey)) {
        return next();
      }

      return res.status(403).json({
        error: 'Module not active for this tenant',
        details: {
          moduleKey: normalizedModuleKey,
          lockedModules: capabilities.locked_modules,
          planKey: capabilities.plan_key,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to validate module access';
      return res.status(502).json({ error: message });
    }
  };
}
