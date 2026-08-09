import { loadTenantRuntimeConfig } from './tenant-config';
import type { TenantRuntimeConfig } from '@white-label/types';

const cache = new Map<string, { data: TenantRuntimeConfig; timestamp: number }>();
const CACHE_TTL_MS = 60 * 1000; // 1 minuto

export async function getCachedTenantConfig(tenantId: string): Promise<TenantRuntimeConfig> {
  const now = Date.now();
  const entry = cache.get(tenantId);
  if (entry && (now - entry.timestamp) < CACHE_TTL_MS) {
    return entry.data;
  }

  const config = await loadTenantRuntimeConfig(tenantId);
  cache.set(tenantId, { data: config, timestamp: now });
  return config;
}

// Función para invalidar caché (ej: después de actualizar settings)
export function invalidateTenantConfig(tenantId: string) {
  cache.delete(tenantId);
}

// Opcional: limpieza periódica de caché expirada
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp > CACHE_TTL_MS) {
      cache.delete(key);
    }
  }
}, 60 * 1000);
