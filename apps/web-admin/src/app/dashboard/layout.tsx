import React from 'react';
import { headers } from 'next/headers';
import Link from 'next/link';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { optionalEnv } from '@white-label/config';

function MissingTenantDashboard() {
  return (
    <main className="min-h-screen bg-[#0b0f19] px-4 py-16 text-slate-100">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center justify-center gap-8 text-center">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] font-mono text-[#64748b]">
            [SYSTEM NOTICE: TENANT_UNRESOLVED]
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Tenant no resuelto
          </h1>
          <p className="mx-auto max-w-md text-sm leading-6 text-slate-400">
            No se pudo resolver un tenant activo para este entorno local. Inicia sesión o entra por el bridge para continuar con una sesión válida.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl bg-[#334155] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(44,110,159,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1f2937] hover:shadow-[0_10px_25px_rgba(44,110,159,0.3)]"
          >
            Ir a login
          </Link>
          <Link
            href="/auth/bridge"
            className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800/40 px-6 py-3.5 text-sm font-semibold text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 hover:text-white"
          >
            Abrir bridge
          </Link>
        </div>
      </div>
    </main>
  );
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const host = headersList.get('host') || '';

  const envTenantId = optionalEnv('NEXT_PUBLIC_DEFAULT_TENANT_ID');
  let tenantId = envTenantId;
  if (host && host.includes('.') && !host.includes('localhost') && !host.includes('vercel.app')) {
    const sub = host.split('.')[0];
    if (sub !== 'app') {
      tenantId = sub;
    }
  }

  if (!tenantId) {
    return <MissingTenantDashboard />;
  }

  const brandName = optionalEnv('NEXT_PUBLIC_TENANT_BRAND_NAME') ?? 'Fixi';
  const sucursalName = optionalEnv('NEXT_PUBLIC_DEFAULT_SUCURSAL_NAME') ?? 'Sucursal';
  const userEmail = optionalEnv('NEXT_PUBLIC_DEFAULT_USER_EMAIL') ?? '';
  const userSucursalId = optionalEnv('NEXT_PUBLIC_DEFAULT_USER_SUCURSAL_ID') ?? '';
  const userRole = (optionalEnv('NEXT_PUBLIC_DEFAULT_USER_ROLE') ?? 'manager').toLowerCase();
  const themePrimary = optionalEnv('NEXT_PUBLIC_THEME_PRIMARY') ?? '';
  const themeSecondary = optionalEnv('NEXT_PUBLIC_THEME_SECONDARY') ?? '';
  const themeAccent = optionalEnv('NEXT_PUBLIC_THEME_ACCENT') ?? '';

  const tenant = {
    tenantId,
    tenantName: tenantId.charAt(0).toUpperCase() + tenantId.slice(1),
    brandName,
    sucursalName,
    userEmail,
    userSucursalId,
    userRole,
    theme: {
      primary: themePrimary,
      secondary: themeSecondary,
      accent: themeAccent,
    },
  };

  return <DashboardShell tenant={tenant}>{children}</DashboardShell>;
}
