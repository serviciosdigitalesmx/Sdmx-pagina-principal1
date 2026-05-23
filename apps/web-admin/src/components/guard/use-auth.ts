"use client";

import { useMemo } from 'react';
import { useTenant } from '@/components/tenant/tenant-provider';
import { getCurrentSession } from '@/lib/session';

export type Role = 'owner' | 'manager' | 'technician';

export type AuthState = {
  role: Role;
  tenantId: string;
  tenantSlug: string;
  sucursalId: string;
  userEmail: string;
};

export function useAuth(): AuthState {
  const tenant = useTenant();

  return useMemo(() => {
    if (typeof window !== 'undefined') {
      const session = getCurrentSession();
      if (session) {
        return {
          role: (session.role || tenant.userRole).toLowerCase() as Role,
          tenantId: session.tenantSlug || tenant.tenantId,
          tenantSlug: session.tenantSlug,
          sucursalId: session.sucursalId || tenant.userSucursalId,
          userEmail: session.email || tenant.userEmail,
        } satisfies AuthState;
      }
    }

    return {
      role: tenant.userRole.toLowerCase() as Role,
      tenantId: tenant.tenantId,
      tenantSlug: tenant.tenantId,
      sucursalId: tenant.userSucursalId,
      userEmail: tenant.userEmail,
    } satisfies AuthState;
  }, [tenant]);
}
