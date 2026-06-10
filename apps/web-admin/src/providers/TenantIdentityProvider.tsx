'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { getCurrentSession } from '@/lib/session';
import { getActiveSucursalId, getApiOptions } from '@/lib/tenant';
import type { TenantIdentity, TenantRole } from '@/domain/tenant/Identity';
import type { Sucursal } from '@/types';

type TenantIdentityContextValue = {
  identity: TenantIdentity | null;
  isLoading: boolean;
};

const TenantIdentityContext = createContext<TenantIdentityContextValue>({
  identity: null,
  isLoading: true,
});

function normalizeRole(role: string): TenantRole {
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

function humanizeSlug(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ') || 'Negocio';
}

export function TenantIdentityProvider({ children }: { children: React.ReactNode }) {
  const [identity, setIdentity] = useState<TenantIdentity | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function loadIdentity() {
      try {
        const session = getCurrentSession();

        if (!session) {
          if (alive) setIdentity(null);
          return;
        }

        const activeBranchId = getActiveSucursalId();
        const branchId = activeBranchId && activeBranchId !== 'GLOBAL' ? activeBranchId : null;

        let branchName: string | null = branchId ? 'Sucursal' : 'Todas las sucursales';
        let branchCode: string | null = branchId ? null : 'GLOBAL';

        if (branchId) {
          const response = await apiClient.get<{ data: Sucursal[] }>('/sucursales', getApiOptions());
          const sucursales = Array.isArray(response.data) ? response.data : [];
          const activeSucursal = sucursales.find((s) => s.id === branchId);

          if (activeSucursal) {
            branchName = activeSucursal.name;
            branchCode = activeSucursal.code || activeSucursal.name.substring(0, 3).toUpperCase();
          }
        }

        const nextIdentity: TenantIdentity = {
          tenantId: session.tenantId,
          tenantSlug: session.tenantSlug,
          tenantName: session.tenantName || humanizeSlug(session.tenantSlug),

          branchId,
          branchCode,
          branchName,

          userId: session.userId,
          userEmail: session.email,
          role: normalizeRole(session.role),
        };

        if (alive) setIdentity(nextIdentity);
      } catch (error) {
        console.error('Failed to load tenant identity:', error);
        if (alive) setIdentity(null);
      } finally {
        if (alive) setIsLoading(false);
      }
    }

    loadIdentity();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <TenantIdentityContext.Provider value={{ identity, isLoading }}>
      {children}
    </TenantIdentityContext.Provider>
  );
}

export function useTenantIdentity() {
  return useContext(TenantIdentityContext);
}
