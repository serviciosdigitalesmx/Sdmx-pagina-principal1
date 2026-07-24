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
  pos: 'orders',
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
  { label: 'Operación', keys: ['dashboard', 'pos', 'operativo', 'tecnico', 'solicitudes', 'archivo'] },
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
    <div className="flex h-full flex-col bg-slate-50 border-r border-slate-200">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 shadow-sm">
            <span className="text-xs font-black text-white">{platformBrand.substring(0, 2).toUpperCase()}</span>
          </div>
          {!collapsed && (
            <span className="font-semibold tracking-[0.08em] text-slate-900">
              {platformBrand.substring(0, 2)}<span className="text-sky-600">{platformBrand.substring(2)}</span>
            </span>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="rounded-xl p-1 text-slate-500 hover:bg-slate-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="rounded-xl p-1 text-slate-500 hover:bg-slate-200"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {!collapsed && (
        <div className="px-3 pt-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-900 transition hover:border-slate-300 hover:shadow-sm"
            title="Ir al tablero"
          >
            <LayoutDashboard className="h-5 w-5 text-slate-900" />
            <span>Ir al tablero</span>
          </Link>
        </div>
      )}

      {/* Sucursal indicator */}
      {!collapsed && !isLoading && identity && (
        <div className="mx-4 mt-4 rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm">
          <p className="text-xs text-slate-500 font-medium">Sucursal activa</p>
          <p className="text-sm font-semibold text-slate-900 truncate">
            {identity.branchName}
          </p>
          {showConsolidated && activeSucursalId !== 'GLOBAL' && (
            <p className="mt-1 text-xs text-slate-500">Puedes volver a la vista general</p>
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
                <div className="px-3 pt-4 pb-1 text-xs font-semibold text-slate-500">
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
                      flex items-center gap-3 rounded-xl px-3 py-2 transition-all duration-200
                      ${isActive
                        ? 'bg-slate-100 text-slate-900 font-medium'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }
                      ${collapsed ? 'justify-center' : ''}
                    `}
                    title={collapsed ? module.label : undefined}
                  >
                    <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    {!collapsed && (
                      <span className="text-sm">{module.label}</span>
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
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Plan Pro
            </div>
            <p className="mt-2 text-sm text-slate-600">Ajusta branding, sucursales y flujo operativo.</p>
            <Link
              href="/dashboard/billing"
              className="mt-3 inline-flex w-full items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
            >
              Administrar plan
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
