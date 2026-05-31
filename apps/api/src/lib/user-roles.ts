export type StoredUserRole = 'owner' | 'manager' | 'technician' | 'admin' | 'operador' | 'tecnico' | 'cliente' | 'compras';
export type EffectiveUserRole = 'owner' | 'manager' | 'technician' | 'client';

export function normalizeStoredUserRole(role: string | null | undefined): StoredUserRole | null {
  const value = String(role ?? '').trim().toLowerCase();
  if (!value) return null;
  if (['owner', 'admin'].includes(value)) return value as StoredUserRole;
  if (['manager', 'operador', 'compras', 'gerente_sucursal', 'gerente sucursal'].includes(value)) return 'manager';
  if (['technician', 'tecnico'].includes(value)) return value as StoredUserRole;
  if (value === 'cliente') return 'cliente';
  return null;
}

export function resolveEffectiveUserRole(role: string | null | undefined): EffectiveUserRole | null {
  const normalized = normalizeStoredUserRole(role);
  if (!normalized) return null;
  if (normalized === 'owner' || normalized === 'admin') return 'owner';
  if (normalized === 'manager' || normalized === 'operador' || normalized === 'compras') return 'manager';
  if (normalized === 'technician' || normalized === 'tecnico') return 'technician';
  return 'client';
}

export function resolveDisplayUserRole(role: string | null | undefined): StoredUserRole | null {
  const normalized = normalizeStoredUserRole(role);
  if (!normalized) return null;
  if (normalized === 'admin') return 'admin';
  if (normalized === 'operador') return 'operador';
  if (normalized === 'tecnico') return 'tecnico';
  if (normalized === 'cliente') return 'cliente';
  if (normalized === 'compras') return 'compras';
  if (normalized === 'owner') return 'admin';
  if (normalized === 'manager') return 'operador';
  return 'tecnico';
}
