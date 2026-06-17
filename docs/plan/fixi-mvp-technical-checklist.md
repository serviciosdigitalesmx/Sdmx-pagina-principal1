# Fixi MVP Technical Checklist

Fecha: 2026-06-16

Objetivo: convertir el MVP de Fixi en una lista técnica por repo/archivo, alineada con la arquitectura real del monorepo.

## Reglas

- No mocks.
- No hardcode.
- No cambiar contratos API salvo necesidad explícita.
- Frontend en Next.js.
- Backend en Render.
- DB en Supabase con `tenant_id` y RLS.
- Cualquier cambio debe ser verificable con build y navegador real.

## Fase 0. Base de contrato y estabilidad

### `apps/web-public`

- [`src/lib/admin-url.ts`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-public/src/lib/admin-url.ts)
  - Resolver la URL canónica del admin desde env de producción.
- [`src/app/onboarding/page.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-public/src/app/onboarding/page.tsx)
  - Enviar onboarding al admin correcto.
- [`src/app/onboarding/success/page.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-public/src/app/onboarding/success/page.tsx)
  - Redirigir al panel con sesión viva.
- [`src/app/api/[...path]/route.ts`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-public/src/app/api/[...path]/route.ts)
  - Evitar `Failed to Fetch` por proxy o CORS mal resueltos.
- [`src/lib/public-api.ts`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-public/src/lib/public-api.ts)
  - Resolver endpoints públicos con `process.env`.

### `apps/web-admin`

- [`src/lib/api-base-url.ts`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/lib/api-base-url.ts)
  - Base API consistente para cliente y bridge.
- [`src/lib/auth.ts`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/lib/auth.ts)
  - Persistir sesión y runtime del tenant sin perder contexto.
- [`src/lib/tenant-runtime-config.ts`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/lib/tenant-runtime-config.ts)
  - Cargar vertical, módulos y configuración activa.
- [`src/lib/module-access.ts`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/lib/module-access.ts)
  - Respetar acceso por rol y módulos activos.
- [`src/components/guard/module-route-guard.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/components/guard/module-route-guard.tsx)
  - Bloquear módulos sensibles cuando corresponda.
- [`src/domain/vertical/VerticalRegistry.ts`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/domain/vertical/VerticalRegistry.ts)
  - Alinear industrias reales y módulos habilitados.

### `apps/api`

- [`src/controllers/auth.controller.ts`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/controllers/auth.controller.ts)
  - Bridge auth, onboarding, exchange, tenant settings.
- [`src/routes/auth.ts`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/routes/auth.ts)
  - Contratos públicos de auth.
- [`src/index.ts`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/index.ts)
  - CORS, cookies, origins, envs y seguridad base.
- [`src/middleware/auth.ts`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/middleware/auth.ts)
  - Protección de rutas autenticadas.
- [`src/middleware/tenantResolver.ts`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/middleware/tenantResolver.ts)
  - Resolver tenant real por request.

### Validaciones

- `pnpm --filter web-admin build`
- `pnpm --filter web-public build`
- Navegación real sin 404 en onboarding/callback.
- No `Network Error` ni `Failed to Fetch` en flujos base.

---

## Fase 1. Recepción y Seguimiento

### `apps/web-admin`

- [`src/app/dashboard/operativo/page.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/app/dashboard/operativo/page.tsx)
  - Recepción completa y seguimiento.
- [`src/components/operativo/step-1.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/components/operativo/step-1.tsx)
- [`src/components/operativo/step-2.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/components/operativo/step-2.tsx)
- [`src/components/operativo/step-3.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/components/operativo/step-3.tsx)
- [`src/components/operativo/success.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/components/operativo/success.tsx)
  - Generar orden, checklist, evidencias y salida correcta.
- [`src/components/dashboard/orders/order-detail-drawer.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/components/dashboard/orders/order-detail-drawer.tsx)
  - Link público, timeline, PDF y evidencias visibles.
- [`src/components/dashboard/orders/order-timeline.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/components/dashboard/orders/order-timeline.tsx)
  - Bitácora de estados.
- [`src/components/dashboard/orders/order-intake-modal.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/components/dashboard/orders/order-intake-modal.tsx)
  - Captura de recepción.
- [`src/components/tecnico/order-modal.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/components/tecnico/order-modal.tsx)
  - Detalle operativo del técnico.

### `apps/web-public`

- [`src/app/[tenant]/tracking/page.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-public/src/app/[tenant]/tracking/page.tsx)
  - Tracking público por tenant.
- [`src/app/portal/[folio]/page.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-public/src/app/portal/[folio]/page.tsx)
  - Portal cliente público.
- [`src/lib/portal/portal-view.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-public/src/lib/portal/portal-view.tsx)
  - Estado, timeline, evidencias, PDF y WhatsApp.
- [`src/app/[tenant]/cotizar/page.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-public/src/app/[tenant]/cotizar/page.tsx)
  - Entrada pública al flujo.

### `apps/api`

- [`src/controllers/orders.ts`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/controllers/orders.ts)
- [`src/routes/orders.ts`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/routes/orders.ts)
- [`src/services/evidence-adapter.ts`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/services/evidence-adapter.ts)
- [`src/services/orders/*`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/services/orders)
  - Tracking, evidencias, PDF y estados.

### Validaciones

- WhatsApp abre el folio correcto.
- El PDF se genera y se visualiza.
- Las evidencias se persisten y se renderizan.

---

## Fase 2. Tenant Public Frontend

### `apps/web-admin`

- [`src/app/dashboard/landing/page.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/app/dashboard/landing/page.tsx)
  - Mostrar URL pública del tenant y configurarla.

### `apps/web-public`

- [`src/app/page.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-public/src/app/page.tsx)
- [`src/app/landing/[slug]/page.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-public/src/app/landing/[slug]/page.tsx)
- [`src/app/[tenant]/page.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-public/src/app/[tenant]/page.tsx)
- [`src/lib/landing/landing-renderer.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-public/src/lib/landing/landing-renderer.tsx)
- [`src/lib/landing/tenant-landing-loader.ts`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-public/src/lib/landing/tenant-landing-loader.ts)
- [`src/lib/content/content-renderer.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-public/src/lib/content/content-renderer.tsx)
  - Landing comercial, servicios, cotizador, seguimiento y portal.

### `apps/web-clientes`

- [`src/app/[tenantSlug]/page.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-clientes/src/app/[tenantSlug]/page.tsx)
- [`src/app/t/[tenantSlug]/portal/page.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-clientes/src/app/t/[tenantSlug]/portal/page.tsx)
- [`src/app/t/[tenantSlug]/portal/[folio]/page.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-clientes/src/app/t/[tenantSlug]/portal/[folio]/page.tsx)
- [`src/lib/landing/landing-renderer.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-clientes/src/lib/landing/landing-renderer.tsx)
- [`src/lib/landing/tenant-landing-loader.ts`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-clientes/src/lib/landing/tenant-landing-loader.ts)
- [`src/lib/portal/portal-view.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-clientes/src/lib/portal/portal-view.tsx)
- [`src/lib/theme/theme-resolver.ts`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-clientes/src/lib/theme/theme-resolver.ts)
- [`src/lib/theme/tenant-theme-provider.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-clientes/src/lib/theme/tenant-theme-provider.tsx)
  - Engine único del tenant público.

### Validaciones

- La URL pública se puede copiar y abrir desde admin.
- El tenant público renderiza landing y portal con datos reales.
- No aparecen `Network Error` ni `Failed to Fetch`.

---

## Fase 3. Panel Técnico

### `apps/web-admin`

- [`src/app/dashboard/tecnico/page.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/app/dashboard/tecnico/page.tsx)
- [`src/components/tecnico/order-card.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/components/tecnico/order-card.tsx)
- [`src/components/tecnico/order-modal.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/components/tecnico/order-modal.tsx)
- [`src/app/dashboard/ordenes/page.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/app/dashboard/ordenes/page.tsx)
- [`src/components/dashboard/orders/order-detail-drawer.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/components/dashboard/orders/order-detail-drawer.tsx)
  - Datos completos, edición y flujo técnico correcto.

### Validaciones

- El técnico entra al panel correcto.
- No ve módulos administrativos.
- El dashboard técnico funciona con datos reales.

---

## Fase 4. CRM

### `apps/web-admin`

- [`src/app/dashboard/clientes/page.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/app/dashboard/clientes/page.tsx)
- [`src/components/clientes/customer-modal.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/components/clientes/customer-modal.tsx)
- [`src/components/clientes/customer-history.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/components/clientes/customer-history.tsx)
- [`src/services/users/usersService.ts`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/services/users/usersService.ts)
  - Alta, actualización, deduplicación e historial.

### `apps/api`

- [`src/controllers/catalogs.ts`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/controllers/catalogs.ts)
- [`src/routes/customers.ts`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/routes/customers.ts)
- [`src/services/CustomerService.ts`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/services/CustomerService.ts)
  - CRM unificado por tenant.

### Validaciones

- Se crea o actualiza cliente automáticamente.
- No hay duplicados obvios.
- El historial se mantiene consolidado.

---

## Fase 5. Roles y Permisos

### `apps/api`

- [`src/middleware/requireRole.ts`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/middleware/requireRole.ts)
- [`src/middleware/scope.ts`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/middleware/scope.ts)
- [`src/lib/user-roles.ts`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/lib/user-roles.ts)
- [`src/routes/users.ts`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/routes/users.ts)
- [`src/routes/security.ts`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/routes/security.ts)
  - RBAC real para Dueño, Gerente, Técnico y Recepción.

### `apps/web-admin`

- [`src/components/guard/RequireRole.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/components/guard/RequireRole.tsx)
- [`src/components/guard/ProtectedLink.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/components/guard/ProtectedLink.tsx)
- [`src/components/dashboard/sidebar.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/components/dashboard/sidebar.tsx)
- [`src/app/dashboard/usuarios/page.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/app/dashboard/usuarios/page.tsx)
- [`src/app/dashboard/seguridad/page.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/app/dashboard/seguridad/page.tsx)
  - Bloqueo de módulos sensibles según rol.

### Validaciones

- Técnico no ve finanzas, seguridad, usuarios, configuración ni sucursales.
- Recepción no ve finanzas, seguridad ni usuarios.

---

## Fase 6. Seguridad Operativa

### `apps/web-admin`

- [`src/app/dashboard/sucursales/page.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/app/dashboard/sucursales/page.tsx)
- [`src/components/sucursales/sucursal-modal.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/components/sucursales/sucursal-modal.tsx)
- [`src/components/sucursales/transfer-modal.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/components/sucursales/transfer-modal.tsx)
- [`src/components/stock/movement-modal.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/components/stock/movement-modal.tsx)
  - Autorización y trazabilidad de acciones críticas.

### `apps/api`

- [`src/controllers/sucursales.ts`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/controllers/sucursales.ts)
- [`src/routes/sucursales.ts`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/routes/sucursales.ts)
- [`src/controllers/catalogs.ts`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/controllers/catalogs.ts)
- [`src/routes/inventory.ts`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/routes/inventory.ts)
- [`src/middleware/financeScope.ts`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/middleware/financeScope.ts)
- [`src/middleware/tenantCapabilities.ts`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/middleware/tenantCapabilities.ts)
  - Control de permisos y validación de operaciones sensibles.

### Validaciones

- Crear sucursal requiere autorización correcta.
- Ajustar inventario requiere autorización correcta.
- Transferir stock deja trazabilidad.

---

## Fase 7. Landing SaaS

### `apps/web-public`

- [`src/app/page.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-public/src/app/page.tsx)
- [`src/app/globals.css`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-public/src/app/globals.css)
- [`src/components/storefront-client.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-public/src/components/storefront-client.tsx)
- [`src/components/public-portal-lookup.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-public/src/components/public-portal-lookup.tsx)
- [`src/components/srfix-theme.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-public/src/components/srfix-theme.tsx)
  - Nueva identidad visual y eliminación del Portal Cliente como feature SaaS.

### `packages/ui`

- [`src/components/Card.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/packages/ui/src/components/Card.tsx)
- [`src/components/Button.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/packages/ui/src/components/Button.tsx)
- [`src/components/Badge.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/packages/ui/src/components/Badge.tsx)
- [`src/components/Table.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/packages/ui/src/components/Table.tsx)
- [`src/components/EmptyState.tsx`](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/packages/ui/src/components/EmptyState.tsx)
  - Base compartida para una misma familia visual.

### Validaciones

- Hero, preview, navegación y componentes alineados.
- Portal Cliente removido de la comunicación principal del SaaS.

---

## Validación final

- `pnpm --filter web-admin build`
- `pnpm --filter web-public build`
- `pnpm --filter web-clientes build`
- `pnpm --filter api build`
- Navegación real con sesión y tenant reales.
- Evidencia de producción para cada flujo crítico.
