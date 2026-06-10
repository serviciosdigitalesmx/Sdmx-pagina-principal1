import { getCurrentSession } from '@/lib/session';
import type { PlatformScope } from '@/domain/platform/Scope';
import { DEFAULT_VERTICAL_CONFIG } from '@/domain/vertical/VerticalConfig';

const ACTIVE_BRANCH_KEY = 'srf_sucursal_activa';

export type ScopeContext = PlatformScope;

export function getActiveBranchId(): string | null {
  if (typeof window === 'undefined') return null;

  const stored = window.localStorage.getItem(ACTIVE_BRANCH_KEY);
  if (stored && stored !== 'GLOBAL') return stored;

  return getCurrentSession()?.branchId ?? null;
}

export function setActiveBranchId(branchId: string | null, options?: { skipReload?: boolean }) {
  if (typeof window === 'undefined') return;

  if (!branchId || branchId === 'GLOBAL') {
    window.localStorage.removeItem(ACTIVE_BRANCH_KEY);
  } else {
    window.localStorage.setItem(ACTIVE_BRANCH_KEY, branchId);
  }

  if (!options?.skipReload) {
    window.location.reload();
  }
}

export function getPlatformScope(): PlatformScope | null {
  const session = getCurrentSession();
  if (!session) return null;

  const branchId = getActiveBranchId();

  return {
    tenantId: session.tenantId,
    tenantSlug: session.tenantSlug,

    branchId,
    sucursalId: branchId,
    branchLabel: DEFAULT_VERTICAL_CONFIG.labels.branch,

    verticalCode: DEFAULT_VERTICAL_CONFIG.code,
    verticalName: DEFAULT_VERTICAL_CONFIG.name,

    mode: branchId ? 'branch' : 'tenant',
  };
}

/**
 * Adapter temporal de nombre viejo.
 * La fuente real ya es PlatformScope.
 */
export function getActiveScope(): ScopeContext | null {
  return getPlatformScope();
}

export function setActiveScope(input: {
  tenantId: string;
  tenantSlug: string;
  sucursalId?: string | null;
  branchId?: string | null;
}, options?: { skipReload?: boolean }) {
  setActiveBranchId(input.branchId ?? input.sucursalId ?? null, options);
}
