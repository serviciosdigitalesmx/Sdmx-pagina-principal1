'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Globe,
  ClipboardList,
  Wrench,
  FileText,
  Archive,
  Users,
  CheckSquare,
  Package,
  Truck,
  ShoppingCart,
  Wallet,
  LineChart,
  BarChart3,
  Building2,
  Shield,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { DASHBOARD_MODULES } from '@/types';
import { getActiveSucursalId, canUseConsolidatedView } from '@/lib/tenant';
import { isModuleEnabled, type TenantModuleKey } from '@/lib/module-access';
import { useTenantIdentity } from '@/providers/TenantIdentityProvider';
import { platformBrand } from '@/config/branding';

const getIcon = (iconName: string) => {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    LayoutDashboard,
    Globe,
    ClipboardList,
    Wrench,
    FileText,
    Archive,
    Users,
    CheckSquare,
    Package,
    Truck,
    ShoppingCart,
    Wallet,
    LineChart,
    BarChart3,
    Building2,
    Shield,
  };
  return icons[iconName] || LayoutDashboard;
};

const DASHBOARD_MODULE_ACCESS: Partial<Record<string, TenantModuleKey>> = {
  operativo: 'orders',
  tecnico: 'orders',
  solicitudes: 'requests',
  archivo: 'archive',
  clientes: 'customers',
  tareas: 'tasks',
  stock: 'inventory',
  proveedores: 'procurement',
  compras: 'procurement',
  gastos: 'finance',
  finanzas: 'finance',
  reportes: 'reports',
  sucursales: 'branches',
  seguridad: 'security',
  usuarios: 'users',
  landing: 'landing',
};

const ROLE_ALLOWED_MODULES: Record<'owner' | 'manager' | 'technician' | 'client', string[] | null> = {
  owner: null,
  manager: null,
  technician: ['dashboard', 'tecnico', 'operativo', 'solicitudes', 'tareas', 'archivo'],
  client: ['dashboard', 'landing'],
};

const MODULE_GROUPS: Array<{ label: string; keys: string[] }> = [
  { label: 'Operación', keys: ['dashboard', 'operativo', 'tecnico', 'solicitudes', 'archivo'] },
  { label: 'Relación', keys: ['landing', 'clientes', 'tareas'] },
  { label: 'Administración', keys: ['stock', 'proveedores', 'compras', 'gastos', 'finanzas', 'reportes', 'sucursales', 'seguridad', 'usuarios'] },
];

export function Sidebar({
  mobileOpen,
  onMobileOpenChange,
}: {
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { identity, isLoading } = useTenantIdentity();

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeSucursalId = mounted ? getActiveSucursalId() : null;
  const showConsolidated = mounted ? canUseConsolidatedView() : false;
  const visibleModules = DASHBOARD_MODULES.filter((module) => {
    const role = identity?.role ?? 'manager';
    const allowedByRole = ROLE_ALLOWED_MODULES[role as keyof typeof ROLE_ALLOWED_MODULES];
    if (allowedByRole && !allowedByRole.includes(module.key)) {
      return false;
    }

    if (module.key === 'dashboard') {
      return true;
    }

    const accessKey = DASHBOARD_MODULE_ACCESS[module.key];

    return accessKey ? isModuleEnabled(accessKey) : true;
  });
  const visibleModuleByKey = new Map(visibleModules.map((module) => [module.key, module]));

  const sidebarContent = (
    <div className="flex h-full flex-col bg-slate-950/95">
      <div className="flex items-center justify-between border-b border-white/8 bg-white/[0.02] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(96,165,250,0.95),rgba(34,211,238,0.85))] shadow-[0_12px_28px_rgba(37,99,235,0.22)]">
            <span className="text-xs font-black text-white">{platformBrand.substring(0, 2).toUpperCase()}</span>
          </div>
          {!collapsed && (
            <span className="font-semibold tracking-[0.08em] text-slate-100">
              {platformBrand.substring(0, 2)}<span className="text-sky-400">{platformBrand.substring(2)}</span>
            </span>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="rounded-xl p-1 text-slate-400 hover:bg-slate-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="rounded-xl p-1 text-slate-400 hover:bg-slate-800"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {!collapsed && (
        <div className="px-3 pt-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-2xl border border-sky-500/20 bg-[linear-gradient(135deg,rgba(30,64,175,0.28),rgba(8,145,178,0.18))] px-3 py-3 text-sm font-medium text-slate-100 transition hover:border-sky-400/30 hover:shadow-[0_18px_40px_rgba(37,99,235,0.16)]"
            title="Ir al tablero"
          >
            <LayoutDashboard className="h-5 w-5 text-sky-400" />
            <span>Ir al tablero</span>
          </Link>
        </div>
      )}

      {/* Sucursal indicator */}
      {!collapsed && !isLoading && identity && (
        <div className="mx-4 mt-4 rounded-2xl border border-white/8 bg-white/[0.03] p-3 text-center">
          <p className="text-xs text-slate-400">Sucursal activa</p>
          <p className="text-sm font-semibold text-sky-400 truncate">
            {identity.branchName}
          </p>
          {showConsolidated && activeSucursalId !== 'GLOBAL' && (
            <p className="mt-1 text-xs text-slate-400">Puedes volver a la vista general</p>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {MODULE_GROUPS.map((group) => {
          const groupModules = group.keys
            .map((key) => visibleModuleByKey.get(key))
            .filter((module): module is NonNullable<typeof module> => Boolean(module));

          if (groupModules.length === 0) return null;

          return (
            <div key={group.label} className="space-y-1">
              {!collapsed && (
                <div className="px-3 pt-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                  {group.label}
                </div>
              )}
              {groupModules.map((module) => {
                const Icon = getIcon(module.icon);
                const isActive = pathname === module.href || pathname.startsWith(`${module.href}/`);

                return (
                  <Link
                    key={module.key}
                    href={module.href}
                    data-e2e={`nav-${module.key}`}
                    className={`
                      flex items-center gap-3 rounded-2xl border px-3 py-2.5 transition-all duration-200
                      ${isActive
                        ? 'border-sky-500/30 bg-[linear-gradient(135deg,rgba(14,165,233,0.18),rgba(59,130,246,0.08))] text-slate-50 shadow-[0_12px_30px_rgba(59,130,246,0.12)]'
                        : 'border-transparent text-slate-400 hover:border-white/8 hover:bg-white/[0.03] hover:text-slate-100'
                      }
                      ${collapsed ? 'justify-center' : ''}
                    `}
                    title={collapsed ? module.label : undefined}
                  >
                    <span className={`flex h-9 w-9 items-center justify-center rounded-2xl ${isActive ? 'bg-sky-500/15 text-sky-300' : 'bg-white/[0.03] text-slate-400'}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    {!collapsed && (
                      <span className="text-sm font-medium">{module.label}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="px-3 pb-4">
          <div className="rounded-3xl border border-sky-500/15 bg-[linear-gradient(180deg,rgba(30,64,175,0.18),rgba(2,6,23,0.6))] p-4 shadow-[0_20px_60px_rgba(37,99,235,0.12)]">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
              <Sparkles className="h-4 w-4" />
              SaaS ready
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-50">Ajusta branding, sucursales y flujo operativo desde aquí.</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              La navegación está ordenada por operación, relación y administración para que el panel se sienta más limpio.
            </p>
            <Link
              href="/dashboard/billing"
              className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-500/10 px-3 py-2 text-sm font-semibold text-sky-100 transition hover:bg-sky-500/15"
            >
              Ver planes
            </Link>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => onMobileOpenChange?.(true)}
        className="fixed left-4 top-4 z-50 rounded-xl border border-slate-800 bg-slate-950/95 p-2 shadow-[0_12px_36px_rgba(2,6,23,0.4)] lg:hidden"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile sidebar */}
      <div
        className={`
          fixed inset-0 z-50 lg:hidden transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => onMobileOpenChange?.(false)} />
        <div className="relative h-full w-72 border-r border-slate-800 bg-slate-950/98">
          <button
            onClick={() => onMobileOpenChange?.(false)}
            className="absolute right-4 top-4 rounded-xl p-1 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
          {sidebarContent}
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside
        className={`
          hidden lg:block border-r border-white/8 transition-all duration-300 bg-slate-950/95
          ${collapsed ? 'w-[4.5rem]' : 'w-72'}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
