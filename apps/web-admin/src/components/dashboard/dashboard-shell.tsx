"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { TenantProvider, type TenantConfig, useTenantTheme } from "@/components/tenant/tenant-provider";
import { ProtectedLink } from "@/components/guard/ProtectedLink";
import { useAuth } from "@/components/guard/use-auth";
import type { Role } from "@/components/guard/use-auth";
import { fixService } from "@/services/fixService";
import { getModuleByRoute, getModuleStatusCounts } from "@/lib/module-catalog";
import { readAuthToken } from "@/lib/auth-storage";
import { resolveApiBaseUrl } from "@white-label/config";
import { useToast } from "@white-label/ui";

export const ADMIN_BUILD_MARKER = "tenant-session-c323cf60";

type NavItem = {
  href: string;
  label: string;
  allowedRoles: Role[];
  moduleKey?: string;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    title: "Integrador",
    items: [
      { href: "/dashboard", label: "Resumen", allowedRoles: ["owner", "manager", "technician"] },
      { href: "/dashboard/ordenes", label: "Órdenes", allowedRoles: ["owner", "manager", "technician"], moduleKey: "orders" },
      { href: "/dashboard/archivo", label: "Archivo", allowedRoles: ["owner", "manager", "technician"], moduleKey: "archivo" },
      { href: "/dashboard/solicitudes", label: "Solicitudes", allowedRoles: ["owner", "manager", "technician"], moduleKey: "requests" },
      { href: "/dashboard/landing", label: "Sitio del tenant", allowedRoles: ["owner", "manager"], moduleKey: "landing" },
    ],
  },
  {
    title: "Paneles",
    items: [
      { href: "/dashboard/clientes", label: "Clientes", allowedRoles: ["owner", "manager", "technician"], moduleKey: "customers" },
      { href: "/dashboard/proveedores", label: "Proveedores", allowedRoles: ["owner", "manager"], moduleKey: "suppliers" },
      { href: "/dashboard/stock", label: "Stock", allowedRoles: ["owner", "manager", "technician"], moduleKey: "stock" },
      { href: "/dashboard/tareas", label: "Tareas", allowedRoles: ["owner", "manager", "technician"], moduleKey: "tasks" },
    ],
  },
  {
    title: "Control",
    items: [
      { href: "/dashboard/compras", label: "Compras", allowedRoles: ["owner", "manager"], moduleKey: "purchase-orders" },
      { href: "/dashboard/gastos", label: "Gastos", allowedRoles: ["owner", "manager"], moduleKey: "expenses" },
      { href: "/dashboard/finanzas", label: "Finanzas", allowedRoles: ["owner", "manager"], moduleKey: "finance" },
      { href: "/dashboard/reportes", label: "Reportes", allowedRoles: ["owner", "manager"], moduleKey: "reports" },
      { href: "/dashboard/usuarios", label: "Usuarios", allowedRoles: ["owner", "manager"], moduleKey: "users" },
      { href: "/dashboard/seguridad", label: "Seguridad", allowedRoles: ["owner", "manager"], moduleKey: "security" },
      { href: "/dashboard/sucursales", label: "Sucursales", allowedRoles: ["owner", "manager"], moduleKey: "sucursales" },
    ],
  },
];

function DashboardShellContent({
  children,
  tenant,
}: {
  children: React.ReactNode;
  tenant: TenantConfig;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = useTenantTheme();
  const auth = useAuth();
  const { pushToast } = useToast();
  const [sucursales, setSucursales] = React.useState<Array<{ id?: string; name?: string; city?: string; code?: string }>>([]);
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const [tenantConfig, setTenantConfig] = React.useState<{
    active_modules?: string[];
    labels?: Record<string, string>;
    status_labels?: Record<string, string>;
    capabilities?: {
      active_modules: string[];
      locked_modules: string[];
      plan_key: 'basic' | 'pro' | 'scale';
      access_status: 'active' | 'trial' | 'billing_exempt' | 'master' | 'blocked';
    };
  } | null>(null);
  const activeTenant = React.useMemo<TenantConfig>(() => {
    const tenantLabel = auth.tenantSlug || tenant.tenantId;

    return {
      ...tenant,
      tenantId: tenantLabel,
      tenantName: tenantLabel.charAt(0).toUpperCase() + tenantLabel.slice(1),
      userEmail: auth.userEmail || tenant.userEmail,
      userRole: auth.role || tenant.userRole,
    };
  }, [auth.role, auth.tenantSlug, auth.userEmail, tenant]);
  const sucursalId = searchParams.get('sucursalId') ?? auth.sucursalId ?? '';
  const enabledModules = React.useMemo(() => {
    const activeModules = tenantConfig?.capabilities?.active_modules ?? tenantConfig?.active_modules;
    if (Array.isArray(activeModules) && activeModules.length > 0) {
      return new Set(activeModules);
    }
    return null;
  }, [tenantConfig?.active_modules, tenantConfig?.capabilities?.active_modules]);

  const visibleNavGroups = React.useMemo(() => {
    if (!enabledModules) {
      return navGroups;
    }

    return navGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => !item.moduleKey || item.href === '/dashboard' || enabledModules.has(item.moduleKey)),
      }))
      .filter((group) => group.items.length > 0);
  }, [enabledModules]);

  const moduleStatusCounts = React.useMemo(() => getModuleStatusCounts(), []);

  React.useEffect(() => {
    let cancelled = false;

    async function loadSucursales() {
      try {
        const data = await fixService.getSucursales();
        if (!cancelled) {
          setSucursales(data as Array<{ id?: string; name?: string; city?: string; code?: string }>);
        }
      } catch {
        if (!cancelled) setSucursales([]);
      }
    }

    void loadSucursales();

    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (!mobileNavOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileNavOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileNavOpen]);

  React.useEffect(() => {
    let cancelled = false;

    async function loadTenantSettings() {
      try {
        const settings = await fixService.getTenantSettings();
        if (!cancelled) {
          setTenantConfig({
            active_modules: settings.data.tenant.active_modules ?? settings.data.config?.activeModules ?? [],
            labels: settings.data.tenant.labels ?? settings.data.config?.labels ?? {},
            status_labels: settings.data.tenant.status_labels ?? settings.data.config?.statusLabels ?? {},
            capabilities: settings.data.tenant.capabilities ?? settings.data.config?.capabilities ?? undefined,
          });
        }
      } catch {
        if (!cancelled) {
          setTenantConfig(null);
        }
      }
    }

    void loadTenantSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  function updateSucursal(nextSucursalId: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextSucursalId) {
      params.set('sucursalId', nextSucursalId);
    } else {
      params.delete('sucursalId');
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  async function enablePushNotifications() {
    if (typeof window === "undefined") {
      return;
    }

    if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      pushToast({
        tone: "error",
        title: "Push no disponible",
        description: "Este navegador no soporta notificaciones push.",
      });
      return;
    }

    const permission = await window.Notification.requestPermission();
    if (permission !== "granted") {
      return;
    }

    const token = readAuthToken();
    if (!token) {
      pushToast({
        tone: "error",
        title: "Sin sesión",
        description: "No hay sesión activa.",
      });
      return;
    }

    const apiBaseUrl = resolveApiBaseUrl();
    const vapidResponse = await fetch(`${apiBaseUrl}/api/${encodeURIComponent(activeTenant.tenantId)}/pwa/push/vapid`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!vapidResponse.ok) {
      pushToast({
        tone: "error",
        title: "No se pudo activar push",
        description: "No fue posible cargar la llave pública de notificaciones.",
      });
      return;
    }

    const vapidPayload = (await vapidResponse.json().catch(() => null)) as { success?: boolean; data?: { publicKey?: string } } | null;
    const publicKey = vapidPayload?.data?.publicKey;
    if (!publicKey) {
      pushToast({
        tone: "error",
        title: "Llave pública ausente",
        description: "La llave pública de notificaciones no está disponible.",
      });
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
    const subscriptionJson = subscription.toJSON();
    if (!subscriptionJson.keys) {
      pushToast({
        tone: "error",
        title: "Suscripción inválida",
        description: "No se pudo leer la suscripción push.",
      });
      return;
    }

    await fetch(`${apiBaseUrl}/api/${encodeURIComponent(activeTenant.tenantId)}/pwa/push/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        keys: subscriptionJson.keys,
        deviceLabel: navigator.userAgent,
      }),
    });

    pushToast({
      tone: "success",
      title: "Push activado",
      description: "Notificaciones push activadas.",
    });
  }

  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  return (
    <div key={pathname} className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.14),_transparent_20%),linear-gradient(180deg,#05060a_0%,#0a0d16_42%,#05060a_100%)] text-zinc-100 lg:flex-row">
      {mobileNavOpen ? (
        <button
          type="button"
          aria-label="Cerrar menú"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}
      <aside
        id="dashboard-mobile-nav"
        className={[
          "fixed inset-y-0 left-0 z-40 flex w-[18rem] max-w-[86vw] shrink-0 flex-col border-b border-white/8 bg-[linear-gradient(180deg,rgba(9,12,20,0.98),rgba(6,8,15,0.96))] backdrop-blur-xl transition-transform duration-200 will-change-transform lg:static lg:z-auto lg:w-[18rem] lg:max-w-none lg:border-b-0 lg:border-r lg:border-white/10",
          mobileNavOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="border-b border-white/10 p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-[linear-gradient(135deg,rgba(124,58,237,0.3),rgba(79,70,229,0.85))] text-sm font-black text-white shadow-[0_14px_40px_rgba(0,0,0,0.24)]">
              {activeTenant.brandName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-semibold tracking-wide text-zinc-50">{activeTenant.brandName}</div>
              <div className="text-xs text-zinc-400">{activeTenant.tenantName}</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-6 overflow-y-auto p-4">
          {visibleNavGroups.map((group) => (
            <section key={group.title} className="space-y-3">
              <div className="px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-200/55">
                {group.title}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const moduleInfo = getModuleByRoute(item.href);
                  const badge =
                    moduleInfo?.deliveryStatus === "ready"
                      ? "Listo"
                      : moduleInfo?.deliveryStatus === "partial"
                        ? "Parcial"
                        : moduleInfo?.deliveryStatus === "pending"
                          ? "Pendiente"
                          : undefined;

                  return (
                    <ProtectedLink
                      key={item.href}
                      to={item.href}
                      label={item.label}
                      allowedRoles={item.allowedRoles}
                      badge={badge}
                      className={[
                        "flex min-h-11 items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200 touch-manipulation",
                        pathname === item.href ||
                        (item.href !== '/dashboard' && pathname?.startsWith(item.href))
                          ? "border border-violet-400/25 bg-[linear-gradient(135deg,rgba(124,58,237,0.26),rgba(79,70,229,0.14))] text-zinc-50 shadow-[0_10px_30px_rgba(0,0,0,0.22)]"
                          : "text-zinc-400 hover:border hover:border-white/10 hover:bg-white/5 hover:text-zinc-50",
                      ].join(' ')}
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4 text-sm text-zinc-400">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-zinc-50">{activeTenant.userEmail}</div>
            <div className="mt-1 text-xs text-zinc-400">Rol: {activeTenant.userRole}</div>
            <div className="text-xs text-zinc-400">Sucursal: {activeTenant.sucursalName}</div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-zinc-300">
              <div className="rounded-xl border border-white/10 bg-black/25 px-2 py-2 text-center">
                <div className="font-semibold text-zinc-50">{moduleStatusCounts.ready}</div>
                <div className="text-zinc-500">Listos</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/25 px-2 py-2 text-center">
                <div className="font-semibold text-zinc-50">{moduleStatusCounts.partial}</div>
                <div className="text-zinc-500">Parciales</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/25 px-2 py-2 text-center">
                <div className="font-semibold text-zinc-50">{moduleStatusCounts.pending}</div>
                <div className="text-zinc-500">Pendientes</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-start justify-between gap-4 border-b border-white/10 bg-[linear-gradient(180deg,rgba(9,12,20,0.98),rgba(7,10,18,0.92))] px-4 py-4 backdrop-blur-xl sm:items-center sm:px-6 sm:py-0 sm:h-16">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-zinc-50 [font-family:var(--font-display)]">FIXI · Tablero interno</div>
            <div className="text-xs leading-5 text-zinc-400">
              Tenant: {activeTenant.tenantId} · Rol: {activeTenant.userRole} · Sucursal: {activeTenant.sucursalName}
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setMobileNavOpen((current) => !current)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/10 bg-black/30 px-3 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-white/5 active:scale-95 lg:hidden"
              aria-label="Abrir menú"
              aria-expanded={mobileNavOpen}
              aria-controls="dashboard-mobile-nav"
            >
              ☰
            </button>
            <Link href="/dashboard/landing" className="inline-flex min-h-11 items-center rounded-full border border-white/10 px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-white/5 active:scale-95">
              Configurar sitio
            </Link>
            <button
              type="button"
              onClick={() => void enablePushNotifications()}
              className="inline-flex min-h-11 items-center rounded-full border border-white/10 px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-white/5 active:scale-95"
            >
              Activar push
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-zinc-950" style={{ backgroundColor: theme.accent }}>
              {activeTenant.userEmail.slice(0, 1).toUpperCase()}
            </div>
          </div>
        </header>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-black/25 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400 sm:px-6">
          <span>BUILD: {ADMIN_BUILD_MARKER}</span>
          <div className="flex flex-wrap items-center gap-2 normal-case tracking-normal">
            <span className="text-[11px] uppercase tracking-[0.18em] text-zinc-400">Todas las sucursales</span>
            <select
              value={sucursalId}
              onChange={(event) => updateSucursal(event.target.value)}
              className="min-h-11 min-w-52 rounded-full border border-zinc-700 bg-zinc-950 px-3 py-3 text-sm text-zinc-100 touch-manipulation"
            >
              <option value="">Todas / contexto actual</option>
              {sucursales.map((sucursal) => (
                <option key={sucursal.id ?? sucursal.code ?? sucursal.name} value={sucursal.id ?? ''}>
                  {sucursal.name ?? 'Sucursal'}{sucursal.city ? ` · ${sucursal.city}` : ''}{sucursal.code ? ` (${sucursal.code})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
        <main className="flex-1 overflow-auto bg-transparent p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

export function DashboardShell({
  children,
  tenant,
}: {
  children: React.ReactNode;
  tenant: TenantConfig;
}) {
  return (
    <TenantProvider value={tenant}>
      <DashboardShellContent tenant={tenant}>{children}</DashboardShellContent>
    </TenantProvider>
  );
}
