import { getPlatformScope } from '@/lib/scope';
import { resolveVertical } from '@/domain/vertical/VerticalRegistry';
import { getStoredActiveModules, getStoredIndustryKey } from '@/lib/tenant-runtime-config';

export type TenantModuleKey =
  | 'orders'
  | 'customers'
  | 'inventory'
  | 'tasks'
  | 'reports'
  | 'procurement'
  | 'finance'
  | 'security'
  | 'requests'
  | 'settings'
  | 'users'
  | 'branches'
  | 'archive';

const MODULE_ROUTE_MAP: Record<string, TenantModuleKey> = {
  '/dashboard/ordenes': 'orders',
  '/dashboard/clientes': 'customers',
  '/dashboard/stock': 'inventory',
  '/dashboard/tareas': 'tasks',
  '/dashboard/reportes': 'reports',
  '/dashboard/compras': 'procurement',
  '/dashboard/proveedores': 'procurement',
  '/dashboard/finanzas': 'finance',
  '/dashboard/gastos': 'finance',
  '/dashboard/seguridad': 'security',
  '/dashboard/solicitudes': 'requests',
  '/dashboard/usuarios': 'users',
  '/dashboard/sucursales': 'branches',
  '/dashboard/archivo': 'archive',
};

export function getEnabledModules(): string[] {
  const storedActiveModules = getStoredActiveModules();
  if (storedActiveModules.length > 0) {
    return storedActiveModules;
  }

  const scope = getPlatformScope();
  const vertical = resolveVertical(getStoredIndustryKey() ?? scope?.verticalCode ?? null);

  return vertical.enabledModules ?? [];
}

export function isModuleEnabled(moduleKey: TenantModuleKey): boolean {
  const enabled = getEnabledModules();

  if (!enabled.length) {
    return true;
  }

  return enabled.includes(moduleKey);
}

export function isRouteEnabled(pathname: string): boolean {
  const moduleKey = MODULE_ROUTE_MAP[pathname];

  if (!moduleKey) {
    return true;
  }

  return isModuleEnabled(moduleKey);
}
