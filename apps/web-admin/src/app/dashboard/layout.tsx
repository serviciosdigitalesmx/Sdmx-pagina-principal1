'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { AppShell, ShellContent } from '@/components/base/app-shell';
import { LoadingState, ErrorState } from '@/components/base/states';
import { isAuthenticated } from '@/lib/auth';
import { getCurrentSession } from '@/lib/session';
import { TenantIdentityProvider } from '@/providers/TenantIdentityProvider';
import { ModuleRouteGuard } from '@/components/guard/module-route-guard';
import { BillingExpiredScreen } from '@/components/billing/billing-expired-screen';
import { PlanLimitModal } from '@/components/billing/plan-limit-modal';
import { SetupWizardModal } from '@/components/onboarding/setup-wizard-modal';
import { isBillingExpired, onBillingExpired } from '@/lib/billing-expired';

import { GlobalQuickReceiveModal } from '@/components/ordenes/global-quick-receive';

import type { User } from '@/types';

function getSessionUser(): User | null {
  const session = getCurrentSession();

  if (!session) return null;

  const role = (['owner', 'manager', 'technician', 'client'].includes(session.role)
    ? session.role
    : 'manager') as User['role'];

  return {
    id: session.userId,
    email: session.email,
    name: session.email || 'Usuario activo',
    role,
    tenantId: session.tenantId,
    tenantSlug: session.tenantSlug,
    sucursalId: session.branchId,
  };
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user] = useState<ReturnType<typeof getSessionUser>>(() =>
    isAuthenticated() ? getSessionUser() : null,
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [authError] = useState<string | null>(() =>
    isAuthenticated() ? null : 'Necesitas iniciar sesión para acceder al panel.',
  );
  const [billingExpired, setBillingExpired] = useState(isBillingExpired);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router, pathname]);

  useEffect(() => {
    return onBillingExpired(setBillingExpired);
  }, []);

  const isBillingPage = pathname?.startsWith('/dashboard/billing');

  if (billingExpired && !isBillingPage) {
    return <BillingExpiredScreen />;
  }

  if (!user) {
    return authError ? (
      <AppShell>
        <ShellContent className="flex min-h-screen items-center justify-center">
          <ErrorState message={authError} />
        </ShellContent>
      </AppShell>
    ) : (
      <AppShell>
        <ShellContent className="flex min-h-screen items-center justify-center">
          <LoadingState label="Cargando sesión..." />
        </ShellContent>
      </AppShell>
    );
  }

  return (
    <TenantIdentityProvider>
      <AppShell>
        <div className="flex min-h-screen">
          <Sidebar mobileOpen={menuOpen} onMobileOpenChange={setMenuOpen} />
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <Header user={user} onMenuClick={() => setMenuOpen(true)} />
            <main className="flex-1 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4 lg:px-6">
              <div className="mx-auto w-full max-w-[1720px]">
                <ModuleRouteGuard>{children}</ModuleRouteGuard>
              </div>
            </main>
          </div>
        </div>
        <PlanLimitModal />
        <SetupWizardModal />
        <GlobalQuickReceiveModal />
      </AppShell>
    </TenantIdentityProvider>
  );
}
