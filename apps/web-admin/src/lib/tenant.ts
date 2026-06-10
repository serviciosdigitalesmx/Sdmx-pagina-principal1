import { getCurrentSession } from './session';

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
  if (typeof window === 'undefined') return null;

  const stored = window.localStorage.getItem('srf_sucursal_activa');
  if (stored && stored !== 'GLOBAL') return stored;

  return getCurrentUserSucursalId();
}

export function setActiveSucursalId(sucursalId: string | null, options?: { skipReload?: boolean }) {
  if (typeof window === 'undefined') return;

  if (!sucursalId || sucursalId === 'GLOBAL') {
    window.localStorage.removeItem('srf_sucursal_activa');
  } else {
    window.localStorage.setItem('srf_sucursal_activa', sucursalId);
  }

  if (!options?.skipReload) {
    window.location.reload();
  }
}

export function canUseConsolidatedView(): boolean {
  return getCurrentSession()?.role === 'owner';
}

export function getApiOptions() {
  return {
    tenantSlug: getTenantSlug() || undefined,
    sucursalId: getActiveSucursalId(),
  };
}
