import { getCurrentSession } from './session';
import { getActiveBranchId, setActiveBranchId, getPlatformScope } from '@/lib/scope';

export function getTenantSlug(): string | null {
  return getCurrentSession()?.tenantSlug ?? null;
}

export function getTenantId(): string | null {
  return getCurrentSession()?.tenantId ?? null;
}

export function getCurrentUserSucursalId(): string | null {
  return getCurrentSession()?.branchId ?? null;
}

export function getActiveSucursalId(): string | null {
  return getActiveBranchId();
}

export function setActiveSucursalId(sucursalId: string | null, options?: { skipReload?: boolean }) {
  setActiveBranchId(sucursalId, options);
}

export function canUseConsolidatedView(): boolean {
  return getCurrentSession()?.role === 'owner';
}

export function getApiOptions() {
  const scope = getPlatformScope();

  return {
    tenantSlug: scope?.tenantSlug,
    sucursalId: scope?.branchId,
  };
}
