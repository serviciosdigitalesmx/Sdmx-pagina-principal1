import { Request, Response, NextFunction } from 'express';
import { loadTenantBillingSummary } from '../services/tenant-billing';
import { loadTenantRuntimeConfig } from '../services/tenant-config';
import { resolveTenantCapabilities } from '../services/tenant-capabilities';

const PUBLIC_MODULE_KEYS = new Set(['portal', 'whatsapp']);

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

import { getTenantClient } from '@white-label/database';

export function enforcePlanQuota(resource: 'users' | 'sucursales' | 'orders') {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const capabilities = req.tenantCapabilities ?? await loadTenantCapabilitiesForRequest(req);
      if (!capabilities) {
        return res.status(400).json({ error: 'Missing tenant capabilities' });
      }

      if (capabilities.access_status === 'master' || capabilities.access_status === 'billing_exempt') {
        return next();
      }

      const limitKey = resource === 'orders' ? 'monthly_orders' : resource;
      const limit = capabilities.limits[limitKey];
      
      // If limit is null, it means unlimited for this plan
      if (limit === null) {
        return next();
      }

      const tenantId = req.tenantId ?? req.user?.tenantId;
      if (!tenantId) {
        return res.status(400).json({ error: 'Missing tenant identification for quota check' });
      }

      const supabase = getTenantClient(tenantId);
      let count = 0;

      if (resource === 'users') {
        const { count: c, error } = await supabase.from('user_profiles').select('*', { count: 'exact', head: true }).eq('tenant_id', tenantId);
        if (error) throw error;
        count = c || 0;
      } else if (resource === 'sucursales') {
        const { count: c, error } = await supabase.from('sucursales').select('*', { count: 'exact', head: true }).eq('tenant_id', tenantId);
        if (error) throw error;
        count = c || 0;
      } else if (resource === 'orders') {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const { count: c, error } = await supabase.from('service_orders')
          .select('*', { count: 'exact', head: true })
          .eq('tenant_id', tenantId)
          .gte('created_at', startOfMonth.toISOString());
        if (error) throw error;
        count = c || 0;
      }

      if (count >= limit) {
        return res.status(403).json({ 
          error: 'Plan limit exceeded', 
          details: { resource, limit, current: count, planKey: capabilities.plan_key } 
        });
      }

      return next();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to validate plan quota';
      return res.status(502).json({ error: message });
    }
  };
}
