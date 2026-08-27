export type TenantRuntimeConfig = {
  industryKey: string | null;
  industryLabel: string | null;
  activeModules: string[];
};

const STORAGE_KEY = 'srf_tenant_runtime_config';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getRecord(value: unknown, key: string): Record<string, unknown> | null {
  if (!isRecord(value)) return null;

  const nested = value[key];
  return isRecord(nested) ? nested : null;
}

function getString(value: unknown, key: string): string | null {
  if (!isRecord(value)) return null;

  const nested = value[key];
  return typeof nested === 'string' ? nested : null;
}

function getStringArray(value: unknown, key: string): string[] | null {
  if (!isRecord(value) || !Array.isArray(value[key])) return null;

  return value[key].filter((item): item is string => typeof item === 'string');
}

export function saveTenantRuntimeConfig(input: TenantRuntimeConfig): void {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(input));

  if (input.industryKey) {
    window.localStorage.setItem('srf_industry_key', input.industryKey);
  }

  window.localStorage.setItem('srf_active_modules', JSON.stringify(Array.isArray(input.activeModules) ? input.activeModules : []));
}

export function getTenantRuntimeConfig(): TenantRuntimeConfig | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);

    return {
      industryKey: getString(parsed, 'industryKey'),
      industryLabel: getString(parsed, 'industryLabel'),
      activeModules: getStringArray(parsed, 'activeModules') ?? [],
    };
  } catch {
    return {
      industryKey: null,
      industryLabel: null,
      activeModules: [],
    };
  }
}

export function getStoredIndustryKey(): string | null {
  return getTenantRuntimeConfig()?.industryKey ?? null;
}

export function getStoredActiveModules(): string[] {
  return getTenantRuntimeConfig()?.activeModules ?? [];
}

export function extractTenantRuntimeConfig(payload: unknown): TenantRuntimeConfig {
  const root = isRecord(payload) ? payload : null;
  const data = getRecord(root, 'data');
  const config = getRecord(data, 'config') ?? getRecord(root, 'config');
  const tenant = getRecord(data, 'tenant') ?? getRecord(root, 'tenant') ?? data ?? root;
  const profile =
    getRecord(tenant, 'industry_profile') ??
    getRecord(tenant, 'industryProfile') ??
    getRecord(data, 'industry_profile') ??
    getRecord(config, 'industry_profile') ??
    getRecord(config, 'industryProfile') ??
    getRecord(root, 'industry_profile') ??
    null;
  const capabilities = getRecord(data, 'capabilities') ?? getRecord(config, 'capabilities') ?? getRecord(root, 'capabilities');

  return {
    industryKey:
      getString(profile, 'industry_key') ?? getString(profile, 'industryKey'),

    industryLabel:
      getString(profile, 'industry_label') ?? getString(profile, 'industryLabel'),

    activeModules:
      getStringArray(capabilities, 'active_modules') ??
      getStringArray(data, 'active_modules') ??
      getStringArray(root, 'active_modules') ??
      [],
  };
}
