"use client";

import { useMemo } from 'react';
import { useTenantIdentity } from '@/providers/TenantIdentityProvider';
import { getActiveScope } from '@/lib/scope';

export type Role = 'owner' | 'manager' | 'technician' | 'client';

export type AuthState = {
  role: Role;
  tenantId: string;
  tenantSlug: string;
  sucursalId: string;
  userEmail: string;
  ready: boolean;
};

function normalizeRole(role: string | undefined | null): Role {
  const normalized = String(role || '').toLowerCase();

  if (
    normalized === 'owner' ||
    normalized === 'manager' ||
    normalized === 'technician' ||
    normalized === 'client'
  ) {
    return normalized;
  }

  return 'manager';
}

export function useAuth(): AuthState {
  const { identity, isLoading } = useTenantIdentity();

  return useMemo(() => {
    const activeScope = getActiveScope();
    const sucursalId = activeScope?.sucursalId ?? identity?.branchId ?? '';

    return {
      role: normalizeRole(identity?.role),
      tenantId: identity?.tenantId ?? '',
      tenantSlug: identity?.tenantSlug ?? '',
      sucursalId,
      userEmail: identity?.userEmail ?? '',
      ready: !isLoading && Boolean(identity?.tenantId && identity?.tenantSlug),
    } satisfies AuthState;
  }, [identity, isLoading]);
}
