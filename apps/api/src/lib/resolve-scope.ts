import type { Request } from 'express';
import { getRequestedSucursalId, isUuid, normalizeScopeRole, type ScopeContext, type ScopeRole } from './scope';

function resolveTenantId(req: Pick<Request, 'tenantId' | 'user'>) {
  return req.tenantId ?? req.user?.tenantId ?? null;
}

function resolveTenantSlug(req: Pick<Request, 'user' | 'params'>) {
  return req.user?.tenantSlug ?? (typeof req.params?.tenantSlug === 'string' ? req.params.tenantSlug : null);
}

function resolveRole(req: Pick<Request, 'user'>): ScopeRole {
  return normalizeScopeRole(req.user?.role);
}

export function resolveScope(req: Request, user = req.user): ScopeContext {
  const tenantId = resolveTenantId(req);
  if (!tenantId) {
    throw new Error('Tenant context is required');
  }

  const role = resolveRole(req);
  const tenantSlug = resolveTenantSlug(req);
  const requestedSucursalId = getRequestedSucursalId(req);
  const sessionSucursalId = isUuid(user?.sucursalId) ? user?.sucursalId ?? null : null;

  if (role === 'owner') {
    const sucursalId = requestedSucursalId ?? null;
    return {
      mode: sucursalId ? 'branch' : 'consolidated',
      tenantId,
      tenantSlug,
      sucursalId,
      canUseConsolidatedView: true,
      role,
      source: requestedSucursalId ? 'query' : sessionSucursalId ? 'session' : 'default',
      requestedSucursalId,
    };
  }

  const sucursalId = requestedSucursalId ?? sessionSucursalId ?? null;

  return {
    mode: 'branch',
    tenantId,
    tenantSlug,
    sucursalId,
    canUseConsolidatedView: false,
    role,
    source: requestedSucursalId ? 'query' : sessionSucursalId ? 'session' : 'default',
    requestedSucursalId,
  };
}
