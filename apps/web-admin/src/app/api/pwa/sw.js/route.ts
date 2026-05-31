import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { NextRequest } from "next/server";

function buildFallbackServiceWorker(tenantSlug: string) {
  return `
const CACHE_VERSION = 'srfix-web-admin-${tenantSlug}-v1';
const PRECACHE = [
  '/',
  '/dashboard',
  '/dashboard/ordenes',
  '/dashboard/clientes',
  '/dashboard/solicitudes',
  '/dashboard/stock',
  '/dashboard/compras',
  '/dashboard/gastos',
  '/dashboard/finanzas',
  '/dashboard/reportes',
  '/dashboard/proveedores',
  '/dashboard/usuarios',
  '/dashboard/seguridad',
  '/dashboard/sucursales',
  '/dashboard/tareas'
];

const CACHEABLE_PATHS = [/\\/dashboard\\//, /\\/portal\\//, /\\/api\\//];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(PRECACHE)).catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith('srfix-web-admin-') && key !== CACHE_VERSION).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  const isCacheable = request.method === 'GET' && CACHEABLE_PATHS.some((pattern) => pattern.test(url.pathname));
  if (!isCacheable) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_VERSION).then((cache) => cache.put(request, responseClone)).catch(() => undefined);
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        if (url.pathname.startsWith('/dashboard/')) {
          const offline = await caches.match('/dashboard');
          if (offline) return offline;
        }
        return new Response(JSON.stringify({ error: 'offline' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        });
      })
  );
});

self.addEventListener('push', (event) => {
  const payload = event.data ? event.data.json() : {};
  const title = payload.title || 'SrFix';
  const options = {
    body: payload.body || 'Tienes una actualización nueva en tu taller.',
    icon: payload.icon || '/favicon.ico',
    badge: payload.badge || '/favicon.ico',
    data: payload.data || {},
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
`;
}

export async function GET(request: NextRequest) {
  const tenantSlug = request.nextUrl.searchParams.get("tenant")?.trim() || process.env.NEXT_PUBLIC_DEFAULT_TENANT_SLUG?.trim() || "web-admin";
  const publicSwPath = path.join(process.cwd(), "public", "sw.js");

  let script = buildFallbackServiceWorker(tenantSlug);
  if (existsSync(publicSwPath)) {
    script = `${await readFile(publicSwPath, "utf8")}\nself.addEventListener('push', (event) => {\n  const payload = event.data ? event.data.json() : {};\n  const title = payload.title || 'SrFix';\n  const options = {\n    body: payload.body || 'Tienes una actualización nueva en tu taller.',\n    icon: payload.icon || '/favicon.ico',\n    badge: payload.badge || '/favicon.ico',\n    data: payload.data || {},\n  };\n  event.waitUntil(self.registration.showNotification(title, options));\n});\n`;
  }

  return new Response(script, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
