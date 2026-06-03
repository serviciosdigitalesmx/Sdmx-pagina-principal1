# AUDITORÍA BACKEND FULL - Fixi
Fecha: miércoles,  3 de junio de 2026, 09:32:55 CST
Repo: /Users/jesusvilla/Desktop/Sdmx-pagina-principal


---

## 1. Estructura API

apps/api/src/controllers/auth.controller.ts
apps/api/src/controllers/billing.ts
apps/api/src/controllers/catalogs.ts
apps/api/src/controllers/finance.ts
apps/api/src/controllers/meta.ts
apps/api/src/controllers/orders.ts
apps/api/src/controllers/procurement.ts
apps/api/src/controllers/public.ts
apps/api/src/controllers/purchase-orders.ts
apps/api/src/controllers/pwa.ts
apps/api/src/controllers/reports.ts
apps/api/src/controllers/requests.ts
apps/api/src/controllers/security.ts
apps/api/src/controllers/stock-alerts.ts
apps/api/src/controllers/sucursales.ts
apps/api/src/controllers/suppliers.ts
apps/api/src/controllers/tasks.ts
apps/api/src/controllers/users.ts
apps/api/src/index.ts
apps/api/src/lib/resolve-scope.ts
apps/api/src/lib/scope.ts
apps/api/src/lib/user-roles.ts
apps/api/src/middleware/auth.ts
apps/api/src/middleware/errorHandler.ts
apps/api/src/middleware/financeScope.ts
apps/api/src/middleware/requireRole.ts
apps/api/src/middleware/scope.ts
apps/api/src/middleware/tenantBilling.ts
apps/api/src/middleware/tenantCapabilities.ts
apps/api/src/middleware/tenantResolver.ts
apps/api/src/middleware/validateTenant.ts
apps/api/src/routes/auth.ts
apps/api/src/routes/billing.ts
apps/api/src/routes/customers.ts
apps/api/src/routes/finance.ts
apps/api/src/routes/inventory.ts
apps/api/src/routes/orders.ts
apps/api/src/routes/procurement.ts
apps/api/src/routes/public.ts
apps/api/src/routes/purchase-orders.ts
apps/api/src/routes/pwa.ts
apps/api/src/routes/reports.ts
apps/api/src/routes/requests.ts
apps/api/src/routes/security.ts
apps/api/src/routes/stock-alerts.ts
apps/api/src/routes/sucursales.ts
apps/api/src/routes/suppliers.ts
apps/api/src/routes/tasks.ts
apps/api/src/routes/users.ts
apps/api/src/services/billing.ts
apps/api/src/services/operational-risk.ts
apps/api/src/services/pwa-push.ts
apps/api/src/services/security-backoffice.ts
apps/api/src/services/stock-alerts.ts
apps/api/src/services/tenant-billing.ts
apps/api/src/services/tenant-capabilities.ts
apps/api/src/services/tenant-config.ts
apps/api/src/types/env.d.ts
apps/api/src/types/express.d.ts
apps/api/src/types/web-push.d.ts

---

## 2. Rutas Express montadas en index.ts

59:app.use(cors({
104:app.use(express.json());
107:app.use('/api/auth', authRouter);
108:app.use('/api/:tenantSlug/auth', authRouter); // Support for tenant-prefixed auth
110:app.use('/api/:tenantSlug/orders', ordersRouter);
111:app.use('/api/orders', ordersRouter);
112:app.use('/api/:tenantSlug/requests', requestsRouter);
113:app.use('/api/requests', requestsRouter);
115:app.use('/api/:tenantSlug/finance', financeRouter);
116:app.use('/api/finance', financeRouter);
118:app.use('/api/:tenantSlug/customers', customersRouter);
119:app.use('/api/customers', customersRouter);
121:app.use('/api/:tenantSlug/inventory', inventoryRouter);
122:app.use('/api/inventory', inventoryRouter);
123:app.use('/api/:tenantSlug/sucursales', sucursalesRouter);
124:app.use('/api/sucursales', sucursalesRouter);
125:app.use('/api/:tenantSlug/suppliers', suppliersRouter);
126:app.use('/api/suppliers', suppliersRouter);
127:app.use('/api/:tenantSlug/purchase-orders', purchaseOrdersRouter);
128:app.use('/api/purchase-orders', purchaseOrdersRouter);
129:app.use('/api/:tenantSlug/tasks', tasksRouter);
130:app.use('/api/tasks', tasksRouter);
131:app.use('/api/:tenantSlug/users', usersRouter);
132:app.use('/api/users', usersRouter);
133:app.use('/api/:tenantSlug/security', securityRouter);
134:app.use('/api/security', securityRouter);
136:app.use('/api/:tenantSlug/procurement', procurementRouter);
137:app.use('/api/procurement', procurementRouter);
138:app.use('/api/:tenantSlug/reports', reportsRouter);
139:app.use('/api/reports', reportsRouter);
140:app.use('/api/:tenantSlug/stock-alerts', stockAlertsRouter);
141:app.use('/api/stock-alerts', stockAlertsRouter);
142:app.use('/api/:tenantSlug/pwa', pwaRouter);
143:app.use('/api/pwa', pwaRouter);
144:app.use('/api/:tenantSlug/billing', billingRouter);
145:app.use('/api/billing', billingRouter);
146:app.use('/api/webhooks', webhookRouter);
147:app.use('/api/public', publicRouter);
157:app.use(errorHandler);

---

## 3. Rutas con y sin tenantSlug

apps/api/src/index.ts:107:app.use('/api/auth', authRouter);
apps/api/src/index.ts:108:app.use('/api/:tenantSlug/auth', authRouter); // Support for tenant-prefixed auth
apps/api/src/index.ts:110:app.use('/api/:tenantSlug/orders', ordersRouter);
apps/api/src/index.ts:111:app.use('/api/orders', ordersRouter);
apps/api/src/index.ts:112:app.use('/api/:tenantSlug/requests', requestsRouter);
apps/api/src/index.ts:113:app.use('/api/requests', requestsRouter);
apps/api/src/index.ts:115:app.use('/api/:tenantSlug/finance', financeRouter);
apps/api/src/index.ts:116:app.use('/api/finance', financeRouter);
apps/api/src/index.ts:118:app.use('/api/:tenantSlug/customers', customersRouter);
apps/api/src/index.ts:119:app.use('/api/customers', customersRouter);
apps/api/src/index.ts:121:app.use('/api/:tenantSlug/inventory', inventoryRouter);
apps/api/src/index.ts:122:app.use('/api/inventory', inventoryRouter);
apps/api/src/index.ts:123:app.use('/api/:tenantSlug/sucursales', sucursalesRouter);
apps/api/src/index.ts:124:app.use('/api/sucursales', sucursalesRouter);
apps/api/src/index.ts:125:app.use('/api/:tenantSlug/suppliers', suppliersRouter);
apps/api/src/index.ts:126:app.use('/api/suppliers', suppliersRouter);
apps/api/src/index.ts:127:app.use('/api/:tenantSlug/purchase-orders', purchaseOrdersRouter);
apps/api/src/index.ts:128:app.use('/api/purchase-orders', purchaseOrdersRouter);
apps/api/src/index.ts:129:app.use('/api/:tenantSlug/tasks', tasksRouter);
apps/api/src/index.ts:130:app.use('/api/tasks', tasksRouter);
apps/api/src/index.ts:131:app.use('/api/:tenantSlug/users', usersRouter);
apps/api/src/index.ts:132:app.use('/api/users', usersRouter);
apps/api/src/index.ts:133:app.use('/api/:tenantSlug/security', securityRouter);
apps/api/src/index.ts:134:app.use('/api/security', securityRouter);
apps/api/src/index.ts:136:app.use('/api/:tenantSlug/procurement', procurementRouter);
apps/api/src/index.ts:137:app.use('/api/procurement', procurementRouter);
apps/api/src/index.ts:138:app.use('/api/:tenantSlug/reports', reportsRouter);
apps/api/src/index.ts:139:app.use('/api/reports', reportsRouter);
apps/api/src/index.ts:140:app.use('/api/:tenantSlug/stock-alerts', stockAlertsRouter);
apps/api/src/index.ts:141:app.use('/api/stock-alerts', stockAlertsRouter);
apps/api/src/index.ts:142:app.use('/api/:tenantSlug/pwa', pwaRouter);
apps/api/src/index.ts:143:app.use('/api/pwa', pwaRouter);
apps/api/src/index.ts:144:app.use('/api/:tenantSlug/billing', billingRouter);
apps/api/src/index.ts:145:app.use('/api/billing', billingRouter);
apps/api/src/index.ts:146:app.use('/api/webhooks', webhookRouter);
apps/api/src/index.ts:147:app.use('/api/public', publicRouter);

---

## 4. Frontend consumiendo API real

apps/web-admin/src/app/dashboard/compras/page.tsx:220:        emptyCopy={error || "La lista real sale de /api/:tenantSlug/purchase-orders."}
apps/web-admin/src/app/dashboard/proveedores/page.tsx:354:        emptyCopy={error || "La lista real sale de /api/:tenantSlug/suppliers con filtros y paginación."}
apps/web-admin/src/app/login/page.tsx:35:  const response = await fetch(`${apiUrl}/api/auth/exchange`, {
apps/web-admin/src/components/dashboard/dashboard-shell.tsx:263:    const vapidResponse = await fetch(`${apiBaseUrl}/api/${encodeURIComponent(activeTenant.tenantId)}/pwa/push/vapid`, {
apps/web-admin/src/components/dashboard/dashboard-shell.tsx:304:    await fetch(`${apiBaseUrl}/api/${encodeURIComponent(activeTenant.tenantId)}/pwa/push/subscribe`, {
apps/web-admin/src/components/pwa/pwa-bootstrap.tsx:8:  const manifestUrl = `/api/pwa/manifest?tenant=${encodeURIComponent(tenantSlug)}`;
apps/web-admin/src/components/pwa/pwa-bootstrap.tsx:25:  const swUrl = `/api/pwa/sw.js?tenant=${encodeURIComponent(tenantSlug)}`;
apps/web-admin/src/services/fixService.ts:415:      `/api/${this.tenantId}/customers`,
apps/web-admin/src/services/fixService.ts:423:      `/api/${this.tenantId}/inventory`,
apps/web-admin/src/services/fixService.ts:431:      `/api/${this.tenantId}/inventory`,
apps/web-admin/src/services/fixService.ts:442:      `/api/${this.tenantId}/inventory/${encodeURIComponent(id)}`,
apps/web-admin/src/services/fixService.ts:453:      `/api/${this.tenantId}/inventory/${encodeURIComponent(id)}/movements`,
apps/web-admin/src/services/fixService.ts:461:      `/api/${this.tenantId}/customers`,
apps/web-admin/src/services/fixService.ts:472:      `/api/${this.tenantId}/orders`,
apps/web-admin/src/services/fixService.ts:483:      `/api/${this.tenantId}/orders/${encodeURIComponent(id)}`,
apps/web-admin/src/services/fixService.ts:492:      `/api/${this.tenantId}/orders/${encodeURIComponent(orderId)}/attachments`,
apps/web-admin/src/services/fixService.ts:512:      `/api/${this.tenantId}/orders/${encodeURIComponent(orderId)}/notes`,
apps/web-admin/src/services/fixService.ts:523:      `/api/${this.tenantId}/orders/${encodeURIComponent(orderId)}/status`,
apps/web-admin/src/services/fixService.ts:534:      `/api/${this.tenantId}/orders/${encodeURIComponent(orderId)}/financials`,
apps/web-admin/src/services/fixService.ts:553:      `/api/${this.tenantId}/orders/${encodeURIComponent(orderId)}/details`,
apps/web-admin/src/services/fixService.ts:564:      `/api/${this.tenantId}/orders/${encodeURIComponent(orderId)}/checklist`,
apps/web-admin/src/services/fixService.ts:572:      `/api/${this.tenantId}/orders/${encodeURIComponent(orderId)}/checklist`,
apps/web-admin/src/services/fixService.ts:583:      `/api/${this.tenantId}/orders/${encodeURIComponent(orderId)}/warranty`,
apps/web-admin/src/services/fixService.ts:594:      `/api/${this.tenantId}/orders`,
apps/web-admin/src/services/fixService.ts:602:      `/api/${this.tenantId}/finance/balance`,
apps/web-admin/src/services/fixService.ts:614:      `/api/${this.tenantId}/finance/cashflow/${encodeURIComponent(resolvedSucursalId)}`,
apps/web-admin/src/services/fixService.ts:622:      `/api/${this.tenantId}/sucursales`,
apps/web-admin/src/services/fixService.ts:638:      `/api/${this.tenantId}/sucursales`,
apps/web-admin/src/services/fixService.ts:657:      `/api/${this.tenantId}/sucursales/${encodeURIComponent(id)}`,
apps/web-admin/src/services/fixService.ts:668:      `/api/${this.tenantId}/sucursales/${encodeURIComponent(id)}`,
apps/web-admin/src/services/fixService.ts:675:      `/api/${this.tenantId}/sucursales/${encodeURIComponent(sucursalId)}/users`,
apps/web-admin/src/services/fixService.ts:686:      `/api/${this.tenantId}/procurement/summary`,
apps/web-admin/src/services/fixService.ts:694:      `/api/${this.tenantId}/stock-alerts`,
apps/web-admin/src/services/fixService.ts:702:      `/api/${this.tenantId}/stock-alerts/${encodeURIComponent(id)}/acknowledge`,
apps/web-admin/src/services/fixService.ts:713:      `/api/${this.tenantId}/reports/summary`,
apps/web-admin/src/services/fixService.ts:737:      `/api/${this.tenantId}/suppliers${suffix ? `?${suffix}` : ''}`,
apps/web-admin/src/services/fixService.ts:751:      `/api/${this.tenantId}/suppliers/${encodeURIComponent(id)}`,
apps/web-admin/src/services/fixService.ts:759:      `/api/${this.tenantId}/suppliers`,
apps/web-admin/src/services/fixService.ts:770:      `/api/${this.tenantId}/suppliers/${encodeURIComponent(id)}`,
apps/web-admin/src/services/fixService.ts:781:      `/api/${this.tenantId}/suppliers/${encodeURIComponent(id)}/status`,
apps/web-admin/src/services/fixService.ts:792:      `/api/${this.tenantId}/suppliers/${encodeURIComponent(id)}/purchase-orders`,
apps/web-admin/src/services/fixService.ts:800:      `/api/${this.tenantId}/suppliers/${encodeURIComponent(id)}`,
apps/web-admin/src/services/fixService.ts:808:      `/api/${this.tenantId}/purchase-orders`,
apps/web-admin/src/services/fixService.ts:816:      `/api/${this.tenantId}/purchase-orders/${encodeURIComponent(id)}`,
apps/web-admin/src/services/fixService.ts:824:      `/api/${this.tenantId}/purchase-orders`,
apps/web-admin/src/services/fixService.ts:835:      `/api/${this.tenantId}/purchase-orders/${encodeURIComponent(id)}`,
apps/web-admin/src/services/fixService.ts:846:      `/api/${this.tenantId}/purchase-orders/${encodeURIComponent(id)}/status`,
apps/web-admin/src/services/fixService.ts:857:      `/api/${this.tenantId}/purchase-orders/${encodeURIComponent(id)}/receive`,
apps/web-admin/src/services/fixService.ts:868:      `/api/${this.tenantId}/purchase-orders/${encodeURIComponent(id)}`,
apps/web-admin/src/services/fixService.ts:876:      `/api/${this.tenantId}/security/summary`,
apps/web-admin/src/services/fixService.ts:892:      `/api/${this.tenantId}/security/audit${search.toString() ? `?${search.toString()}` : ''}`,
apps/web-admin/src/services/fixService.ts:907:      `/api/${this.tenantId}/security/sessions`,
apps/web-admin/src/services/fixService.ts:915:      `/api/${this.tenantId}/security/sessions/${encodeURIComponent(id)}`,
apps/web-admin/src/services/fixService.ts:923:      `/api/${this.tenantId}/security/rotate-keys`,
apps/web-admin/src/services/fixService.ts:934:      `/api/${this.tenantId}/security/mfa/setup`,
apps/web-admin/src/services/fixService.ts:942:      `/api/${this.tenantId}/security/mfa/verify`,
apps/web-admin/src/services/fixService.ts:953:      `/api/${this.tenantId}/security/mfa/require-admins`,
apps/web-admin/src/services/fixService.ts:972:      `/api/users${query ? `?${query}` : ''}`,
apps/web-admin/src/services/fixService.ts:987:      `/api/users/invite`,
apps/web-admin/src/services/fixService.ts:998:      `/api/users/${encodeURIComponent(id)}/role`,
apps/web-admin/src/services/fixService.ts:1009:      `/api/users/${encodeURIComponent(id)}`,
apps/web-admin/src/services/fixService.ts:1019:      `/api/users/${encodeURIComponent(id)}/purchase-orders`,
apps/web-admin/src/services/fixService.ts:1027:      `/api/${this.tenantId}/requests`,
apps/web-admin/src/services/fixService.ts:1035:      `/api/${this.tenantId}/requests/${encodeURIComponent(id)}`,
apps/web-admin/src/services/fixService.ts:1049:      `/api/${this.tenantId}/requests/${encodeURIComponent(id)}/convert`,
apps/web-admin/src/services/fixService.ts:1058:    return this.request<ApiSingleResponse<TenantLandingSettings>>(`/api/auth/tenant/${encodeURIComponent(this.tenantId)}/settings`, {
apps/web-admin/src/services/fixService.ts:1064:    return this.request<ApiSingleResponse<TenantLandingSettings>>(`/api/auth/tenant/${encodeURIComponent(this.tenantId)}/settings`, {
apps/web-admin/src/services/fixService.ts:1079:    return this.request<ApiSingleResponse<TenantLandingSettings>>(`/api/auth/tenant/${encodeURIComponent(this.tenantId)}/settings`, {
apps/web-admin/src/services/fixService.ts:1087:      `/api/${this.tenantId}/tasks`,
apps/web-admin/src/services/fixService.ts:1095:      `/api/${this.tenantId}/tasks/${encodeURIComponent(id)}`,
apps/web-admin/src/services/fixService.ts:1103:      `/api/${this.tenantId}/tasks`,
apps/web-admin/src/services/fixService.ts:1114:      `/api/${this.tenantId}/tasks/${encodeURIComponent(id)}`,
apps/web-admin/src/services/fixService.ts:1125:      `/api/${this.tenantId}/tasks/${encodeURIComponent(id)}/status`,
apps/web-admin/src/services/fixService.ts:1136:      `/api/${this.tenantId}/tasks/${encodeURIComponent(id)}/history`,
apps/web-admin/src/services/fixService.ts:1144:      `/api/${this.tenantId}/tasks/${encodeURIComponent(id)}`,
apps/web-admin/src/services/fixService.ts:1178:    return this.request<ApiSingleResponse<TenantLandingSettings>>(`/api/auth/tenant/${encodeURIComponent(this.tenantId)}/settings`, {
apps/web-public/src/app/[tenant]/cotizar/page.tsx:99:        const response = await fetch(`${apiUrl}/api/public/${encodeURIComponent(tenant)}`);
apps/web-public/src/app/[tenant]/cotizar/page.tsx:156:      const response = await fetch(`${apiUrl}/api/public/quotes`, {
apps/web-public/src/app/[tenant]/tracking/page.tsx:30:      const url = new URL(`${apiUrl}/api/public/tracking`);
apps/web-public/src/app/[tenant]/page.tsx:55:  const response = await fetch(`${apiBaseUrl}/api/public/tenant/${encodeURIComponent(tenant)}/landing`, { cache: "no-store" });
apps/web-public/src/app/t/[tenantSlug]/portal/page.tsx:148:    fetch(`${apiBaseUrl}/api/public/tenant/${encodeURIComponent(tenantSlug)}/landing`)
apps/web-public/src/app/t/[tenantSlug]/portal/page.tsx:187:        `${apiBaseUrl}/api/public/tenant/${encodeURIComponent(tenantSlug)}/orders/${encodeURIComponent(searchValue.trim())}`
apps/web-public/src/app/login/page.tsx:39:    const url = new URL(`${apiUrl}/api/auth/google`);
apps/web-public/src/app/login/page.tsx:50:  const response = await fetch(`${apiUrl}/api/auth/exchange`, {
apps/web-public/src/app/billing/page.tsx:60:      const response = await fetch(`${apiUrl}/api/billing/checkout`, {
apps/web-public/src/app/onboarding/google/callback/page.tsx:116:      const response = await fetch(`${apiUrl}/api/auth/google/complete`, {
apps/web-public/src/app/onboarding/page.tsx:48:      const response = await fetch(`${apiUrl}/api/auth/register`, {
apps/web-public/src/app/onboarding/page.tsx:92:    const url = new URL(`${apiUrl}/api/auth/google`);
apps/web-public/src/components/root-auth-hash-redirect.tsx:36:  const response = await fetch(`${apiUrl}/api/auth/exchange`, {
apps/web-public/src/components/public-portal-lookup.tsx:140:        `/api/public/tenant/${encodeURIComponent(targetTenant.trim())}/orders/${encodeURIComponent(targetFolio.trim())}`
apps/web-clientes/src/app/[tenantSlug]/page.tsx:3:import { getTenantLanding } from "@/lib/api/tenant";
apps/web-clientes/src/app/t/[tenantSlug]/portal/page.tsx:7:import { getTenantLanding } from "@/lib/api/tenant";
apps/web-clientes/src/app/t/[tenantSlug]/portal/page.tsx:8:import { getOrderByFolio } from "@/lib/api/orders";
apps/web-clientes/src/lib/api/orders.ts:5:  return apiClient<BackendOrderResponse>(`/api/public/tenant/${encodeURIComponent(tenantSlug)}/orders/${encodeURIComponent(folio)}`);
apps/web-clientes/src/lib/api/tenant.ts:5:  return apiClient<LandingResponse>(`/api/public/tenant/${encodeURIComponent(tenantSlug)}/landing`);

---

## 5. branch_id en backend productivo

apps/api/src/controllers/users.ts:92:    sucursalId: row.sucursal_id ?? row.branch_id ?? null,
apps/api/src/controllers/users.ts:127:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at', { count: 'exact' })
apps/api/src/controllers/users.ts:236:          branch_id: body.sucursalId ?? null,
apps/api/src/controllers/users.ts:239:        .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
apps/api/src/controllers/users.ts:274:        branch_id: body.sucursalId ?? null,
apps/api/src/controllers/users.ts:276:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
apps/api/src/controllers/users.ts:355:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
apps/api/src/controllers/users.ts:406:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')

---

## 6. branch_id en migraciones

supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:4:-- The old branch_id columns remain in place for compatibility during cutover.
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:6:create or replace function public._sync_sucursal_id_from_branch_id()
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:11:  if new.sucursal_id is null and new.branch_id is not null then
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:12:    new.sucursal_id := new.branch_id;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:13:  elsif new.branch_id is null and new.sucursal_id is not null then
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:14:    new.branch_id := new.sucursal_id;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:25:set sucursal_id = branch_id
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:27:  and branch_id is not null;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:44:for each row execute function public._sync_sucursal_id_from_branch_id();
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:51:set sucursal_id = branch_id
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:53:  and branch_id is not null;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:70:for each row execute function public._sync_sucursal_id_from_branch_id();
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:77:set sucursal_id = branch_id
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:79:  and branch_id is not null;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:96:for each row execute function public._sync_sucursal_id_from_branch_id();
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:103:set sucursal_id = branch_id
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:105:  and branch_id is not null;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:122:for each row execute function public._sync_sucursal_id_from_branch_id();
supabase/migrations/20260515110000_restore_users_compat.sql:4:  branch_id uuid,
supabase/migrations/20260530120000_expand_users_admin_module.sql:5:  add column if not exists branch_id uuid,
supabase/migrations/20260530120000_expand_users_admin_module.sql:37:  if new.sucursal_id is null and new.branch_id is not null then
supabase/migrations/20260530120000_expand_users_admin_module.sql:38:    new.sucursal_id := new.branch_id;
supabase/migrations/20260530120000_expand_users_admin_module.sql:39:  elsif new.branch_id is null and new.sucursal_id is not null then
supabase/migrations/20260530120000_expand_users_admin_module.sql:40:    new.branch_id := new.sucursal_id;
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:172:  i.branch_id,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:33:  branch_id uuid,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:94:  branch_id uuid,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:149:      order_sucursal_id := coalesce(new.sucursal_id, new.branch_id);
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:160:          branch_id,
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:5:-- and no client, job, or integration depends on branch_id or public.branches.
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:9:set sucursal_id = coalesce(sucursal_id, branch_id)
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:10:where sucursal_id is null and branch_id is not null;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:13:set sucursal_id = coalesce(sucursal_id, branch_id)
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:14:where sucursal_id is null and branch_id is not null;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:17:set sucursal_id = coalesce(sucursal_id, branch_id)
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:18:where sucursal_id is null and branch_id is not null;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:21:set sucursal_id = coalesce(sucursal_id, branch_id)
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:22:where sucursal_id is null and branch_id is not null;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:32:  drop constraint if exists service_orders_branch_id_fkey;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:35:  drop constraint if exists purchase_orders_branch_id_fkey;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:38:  drop constraint if exists inventory_movements_branch_id_fkey;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:41:  drop constraint if exists stock_alerts_branch_id_fkey;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:45:  drop column if exists branch_id;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:48:  drop column if exists branch_id;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:51:  drop column if exists branch_id;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:54:  drop column if exists branch_id;
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:25:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:61:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:78:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:5:-- and no client, job, or integration depends on branch_id or public.branches.
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:24:  drop constraint if exists service_orders_branch_id_fkey;
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:27:  drop constraint if exists purchase_orders_branch_id_fkey;
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:30:  drop constraint if exists inventory_movements_branch_id_fkey;
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:33:  drop constraint if exists stock_alerts_branch_id_fkey;
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:37:  drop column if exists branch_id;
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:40:  drop column if exists branch_id;
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:43:  drop column if exists branch_id;
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:46:  drop column if exists branch_id;
supabase/migrations/20260527100000_migrate_users_branch_to_sucursal.sql:7:-- Sync data from branch_id to sucursal_id for local/dev databases
supabase/migrations/20260527100000_migrate_users_branch_to_sucursal.sql:9:set sucursal_id = branch_id
supabase/migrations/20260527100000_migrate_users_branch_to_sucursal.sql:11:  and branch_id is not null;
supabase/migrations/20260527100000_migrate_users_branch_to_sucursal.sql:13:-- Drop the old branch_id column from users if it exists
supabase/migrations/20260527100000_migrate_users_branch_to_sucursal.sql:15:  drop column if exists branch_id;
supabase/migrations/20260514133525_remote_schema.sql:420:alter table "public"."branch_inventory" drop constraint "branch_inventory_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:424:alter table "public"."customer_payments" drop constraint "customer_payments_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:430:alter table "public"."expenses" drop constraint "expenses_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:436:alter table "public"."file_assets" drop constraint "file_assets_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:441:alter table "public"."inventory_movements" drop constraint "inventory_movements_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:453:alter table "public"."purchase_orders" drop constraint "purchase_orders_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:464:alter table "public"."service_orders" drop constraint "service_orders_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:468:alter table "public"."service_requests" drop constraint "service_requests_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:471:alter table "public"."stock_alerts" drop constraint "stock_alerts_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:479:alter table "public"."tasks" drop constraint "tasks_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:485:alter table "public"."users" drop constraint "users_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:532:drop index if exists "public"."service_orders_tenant_branch_idx";
supabase/migrations/20260514133525_remote_schema.sql:543:drop index if exists "public"."tasks_tenant_branch_idx";
supabase/migrations/20260514133525_remote_schema.sql:593:alter table "public"."service_orders" drop column "branch_id";
supabase/migrations/20260424_baseline_schema.sql:45:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:76:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:98:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:125:create index if not exists service_orders_tenant_branch_idx
supabase/migrations/20260424_baseline_schema.sql:126:  on public.service_orders (tenant_id, branch_id);
supabase/migrations/20260424_baseline_schema.sql:158:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:172:create index if not exists tasks_tenant_branch_idx on public.tasks (tenant_id, branch_id);
supabase/migrations/20260424_baseline_schema.sql:233:  branch_id uuid not null references public.branches(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:239:  on public.branch_inventory (tenant_id, branch_id, product_id);
supabase/migrations/20260424_baseline_schema.sql:243:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:279:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:296:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:306:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:328:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:344:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:161:  i.branch_id,
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:51:  branch_id uuid,
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:62:create index if not exists inventory_tenant_branch_idx
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:63:  on public.inventory (tenant_id, branch_id);
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:4:-- The old branch_id columns remain in place for compatibility during cutover.
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:6:create or replace function public._sync_sucursal_id_from_branch_id()
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:11:  if new.sucursal_id is null and new.branch_id is not null then
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:12:    new.sucursal_id := new.branch_id;
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:13:  elsif new.branch_id is null and new.sucursal_id is not null then
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:14:    new.branch_id := new.sucursal_id;
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:41:for each row execute function public._sync_sucursal_id_from_branch_id();
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:64:for each row execute function public._sync_sucursal_id_from_branch_id();
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:87:for each row execute function public._sync_sucursal_id_from_branch_id();
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:110:for each row execute function public._sync_sucursal_id_from_branch_id();
supabase/migrations/20260514120000_enable_rls_and_policies.sql:217:  and branch_id::text = auth.jwt() ->> 'sucursal_id'
supabase/migrations/20260514120000_enable_rls_and_policies.sql:226:  and branch_id::text = auth.jwt() ->> 'sucursal_id'
supabase/migrations/20260514120000_enable_rls_and_policies.sql:235:  and branch_id::text = auth.jwt() ->> 'sucursal_id'
supabase/migrations/20260514120000_enable_rls_and_policies.sql:240:  and branch_id::text = auth.jwt() ->> 'sucursal_id'
supabase/migrations/20260514120000_enable_rls_and_policies.sql:249:  and branch_id::text = auth.jwt() ->> 'sucursal_id'
supabase/migrations/20260514150000_add_tenant_onboarding.sql:5:  branch_id uuid,

---

## 7. sucursal_id en backend

apps/api/src/middleware/auth.ts:14:  sucursal_id?: string;
apps/api/src/middleware/auth.ts:61:    sucursal_id: z.string().min(1).optional(),
apps/api/src/middleware/auth.ts:93:        .select('id, tenant_id, role, sucursal_id, activo, is_active, mfa_enabled')
apps/api/src/middleware/auth.ts:137:        sucursalId: userRow.sucursal_id ?? claims.sucursal_id,
apps/api/src/controllers/meta.ts:63:      .select('tenant_id, role, sucursal_id')
apps/api/src/controllers/meta.ts:96:        sucursalId: userRow.sucursal_id ?? null,
apps/api/src/controllers/auth.controller.ts:91:    sucursal_id: sucursalId ?? undefined,
apps/api/src/controllers/auth.controller.ts:392:      .select('id, tenant_id, role, sucursal_id, activo, is_active')
apps/api/src/controllers/auth.controller.ts:445:      userRow.sucursal_id,
apps/api/src/controllers/suppliers.ts:414:      .select('id, tenant_id, sucursal_id, supplier_id, related_service_order_id, folio, status, reference, payment_terms, expected_date, subtotal, tax_amount, total, notes, created_at, updated_at')
apps/api/src/controllers/reports.ts:17:    let ordersQuery = supabase.from('service_orders').select('id, status, created_at, total_cost, final_cost, sucursal_id, promised_date, folio').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:19:    let inventoryQuery = supabase.from('sucursal_inventory').select('id, stock_current, product_id, sucursal_id, products:product_id (id, cost)').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:20:    let financeQuery = supabase.from('finances').select('id, balance, income, expense, created_at, sucursal_id').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:22:    let usersQuery = supabase.from('users').select('id, full_name, role, sucursal_id').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:25:      .select('id, tenant_id, sucursal_id, product_id, service_order_id, movement_type, quantity, created_at, products:product_id (id, sku, name)')
apps/api/src/controllers/reports.ts:30:      ordersQuery = ordersQuery.eq('sucursal_id', effectiveSucursalId);
apps/api/src/controllers/reports.ts:31:      inventoryQuery = inventoryQuery.eq('sucursal_id', effectiveSucursalId);
apps/api/src/controllers/reports.ts:32:      financeQuery = financeQuery.eq('sucursal_id', effectiveSucursalId);
apps/api/src/controllers/reports.ts:33:      usersQuery = usersQuery.eq('sucursal_id', effectiveSucursalId);
apps/api/src/controllers/reports.ts:34:      movementsQuery = movementsQuery.eq('sucursal_id', effectiveSucursalId);
apps/api/src/controllers/reports.ts:125:      const key = String((order as { sucursal_id?: string | null }).sucursal_id ?? 'sin_sucursal');
apps/api/src/controllers/purchase-orders.ts:143:    supabase.from('inventory_movements').select('id, tenant_id, sucursal_id, product_id, purchase_order_id, movement_type, quantity, unit_cost, reference, notes, created_by, created_at').eq('tenant_id', tenantId).eq('purchase_order_id', orderId).order('created_at', { ascending: true }),
apps/api/src/controllers/purchase-orders.ts:161:      .select('id, tenant_id, sucursal_id, supplier_id, related_service_order_id, folio, status, reference, payment_terms, expected_date, subtotal, tax_amount, total, notes, created_at, updated_at')
apps/api/src/controllers/purchase-orders.ts:166:      query = query.eq('sucursal_id', scope.sucursalId);
apps/api/src/controllers/purchase-orders.ts:191:    if (scope?.mode === 'branch' && scope.sucursalId && String((order.data as { sucursal_id?: string | null }).sucursal_id ?? '') !== scope.sucursalId) {
apps/api/src/controllers/purchase-orders.ts:233:        sucursal_id: resolvedSucursalId,
apps/api/src/controllers/purchase-orders.ts:312:    if (body.sucursalId !== undefined) payload.sucursal_id = resolvedSucursalId;
apps/api/src/controllers/purchase-orders.ts:407:    if (scope?.mode === 'branch' && scope.sucursalId && String(order.sucursal_id ?? '') !== scope.sucursalId) {
apps/api/src/controllers/purchase-orders.ts:433:      const orderSucursalId = order.sucursal_id ?? scope?.sucursalId ?? null;
apps/api/src/controllers/purchase-orders.ts:445:        .select('id, tenant_id, sucursal_id, product_id, stock_current')
apps/api/src/controllers/purchase-orders.ts:448:        .eq('sucursal_id', orderSucursalId)
apps/api/src/controllers/purchase-orders.ts:458:            sucursal_id: orderSucursalId,
apps/api/src/controllers/purchase-orders.ts:462:          .select('id, tenant_id, sucursal_id, product_id, stock_current')
apps/api/src/controllers/purchase-orders.ts:473:          sucursal_id: orderSucursalId ?? nextInventory.sucursal_id ?? null,
apps/api/src/controllers/purchase-orders.ts:478:      await refreshInventoryAlert(tenantId, productCatalog.id, orderSucursalId ?? nextInventory.sucursal_id ?? null, nextStock);
apps/api/src/controllers/purchase-orders.ts:483:        sucursal_id: orderSucursalId,
apps/api/src/controllers/orders.ts:133:    scopedQuery = scopedQuery.eq('sucursal_id', branchId);
apps/api/src/controllers/orders.ts:516:          sucursal_id: requestedSucursalId,
apps/api/src/controllers/orders.ts:629:        sucursal_id: requestedSucursalId,
apps/api/src/controllers/orders.ts:814:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts:1045:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts:1129:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts:1233:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts:1328:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/security.ts:148:        sucursal_id: body.sucursalId ?? undefined,
apps/api/src/controllers/security.ts:165:        sucursal_id: body.sucursalId ?? null,
apps/api/src/controllers/security.ts:167:      .select('id, tenant_id, auth_user_id, full_name, email, role, is_active, sucursal_id, created_at')
apps/api/src/controllers/catalogs.ts:89:    .select('id, tenant_id, sucursal_id, product_id, stock_current')
apps/api/src/controllers/catalogs.ts:92:    .eq('sucursal_id', sucursalId)
apps/api/src/controllers/catalogs.ts:105:      .select('id, tenant_id, sucursal_id, product_id, stock_current')
apps/api/src/controllers/catalogs.ts:119:      sucursal_id: sucursalId,
apps/api/src/controllers/catalogs.ts:123:    .select('id, tenant_id, sucursal_id, product_id, stock_current')
apps/api/src/controllers/catalogs.ts:164:      .select('id, tenant_id, sucursal_id, name, phone, email, created_at')
apps/api/src/controllers/catalogs.ts:171:      query = query.eq('sucursal_id', scopedSucursalId);
apps/api/src/controllers/catalogs.ts:192:      sucursal_id: scope?.sucursalId ?? null,
apps/api/src/controllers/catalogs.ts:196:    }]).select('id, tenant_id, sucursal_id, name, phone, email, created_at').single();
apps/api/src/controllers/catalogs.ts:220:      .select('id, tenant_id, sucursal_id, product_id, stock_current, created_at, updated_at, products:product_id (id, sku, name, minimum_stock)')
apps/api/src/controllers/catalogs.ts:226:      query = query.eq('sucursal_id', effectiveSucursalId);
apps/api/src/controllers/catalogs.ts:314:    .select('id, tenant_id, sucursal_id, product_id, stock_current, created_at, products:product_id (id, sku, name, minimum_stock)')
apps/api/src/controllers/catalogs.ts:326:      : (body.sucursalId ?? scope?.sucursalId ?? currentRow.sucursal_id ?? null);
apps/api/src/controllers/catalogs.ts:343:    if (scope?.mode === 'branch' && currentRow.sucursal_id && scope.sucursalId && currentRow.sucursal_id !== scope.sucursalId) {
apps/api/src/controllers/catalogs.ts:362:        sucursal_id: scope?.mode === 'branch' ? (scope.sucursalId ?? currentRow.sucursal_id ?? nextSucursalId) : nextSucursalId,
apps/api/src/controllers/catalogs.ts:366:      .select('id, tenant_id, sucursal_id, product_id, stock_current, created_at, products:product_id (id, sku, name, minimum_stock)')
apps/api/src/controllers/catalogs.ts:378:        sucursal_id: scope?.mode === 'branch' ? (scope.sucursalId ?? currentRow.sucursal_id ?? nextSucursalId) : nextSucursalId,
apps/api/src/controllers/catalogs.ts:391:      await refreshInventoryAlert(tenantId, productRow.id, scope?.mode === 'branch' ? (scope.sucursalId ?? currentRow.sucursal_id ?? nextSucursalId) : nextSucursalId, nextStock);
apps/api/src/controllers/catalogs.ts:413:      .select('id, tenant_id, product_id, stock_current, sucursal_id')
apps/api/src/controllers/catalogs.ts:422:    if (inventoryRow?.sucursal_id && !(await validateSucursalOwnership(supabase, tenantId, inventoryRow.sucursal_id))) {
apps/api/src/controllers/catalogs.ts:430:    if (req.scope?.mode === 'branch' && req.scope.sucursalId && inventoryRow.sucursal_id && inventoryRow.sucursal_id !== req.scope.sucursalId) {
apps/api/src/controllers/catalogs.ts:447:      .select('id, tenant_id, sucursal_id, product_id, service_order_id, purchase_order_id, movement_type, quantity, unit_cost, reference, notes, created_by, created_at')
apps/api/src/controllers/users.ts:92:    sucursalId: row.sucursal_id ?? row.branch_id ?? null,
apps/api/src/controllers/users.ts:127:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at', { count: 'exact' })
apps/api/src/controllers/users.ts:205:        sucursal_id: body.sucursalId ?? undefined,
apps/api/src/controllers/users.ts:235:          sucursal_id: body.sucursalId ?? null,
apps/api/src/controllers/users.ts:239:        .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
apps/api/src/controllers/users.ts:273:        sucursal_id: body.sucursalId ?? null,
apps/api/src/controllers/users.ts:276:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
apps/api/src/controllers/users.ts:355:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
apps/api/src/controllers/users.ts:406:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
apps/api/src/controllers/users.ts:465:      .select('id, tenant_id, sucursal_id, supplier_id, related_service_order_id, folio, status, reference, payment_terms, expected_date, subtotal, tax_amount, total, notes, created_at, updated_at')
apps/api/src/controllers/finance.ts:41:      .select('id, tenant_id, sucursal_id, total_cost, final_cost, created_at, status')
apps/api/src/controllers/finance.ts:46:      .select('id, tenant_id, sucursal_id, balance, income, expense, created_at')
apps/api/src/controllers/finance.ts:75:      ? orders.filter((order) => String((order as { sucursal_id?: string | null }).sucursal_id ?? '') === sucursalId)
apps/api/src/controllers/finance.ts:78:      ? expenses.filter((expense) => String((expense as { sucursal_id?: string | null }).sucursal_id ?? '') === sucursalId)
apps/api/src/controllers/finance.ts:137:    const sucursalOrders = orders.filter((order) => String((order as { sucursal_id?: string | null }).sucursal_id ?? '') === sucursalId);
apps/api/src/controllers/finance.ts:138:    const sucursalExpenses = expenses.filter((expense) => String((expense as { sucursal_id?: string | null }).sucursal_id ?? '') === sucursalId);
apps/api/src/controllers/finance.ts:140:    const grouped = new Map<string, { id: string; tenant_id: string; sucursal_id: string; balance: number; income: number; expense: number; created_at: string }>();
apps/api/src/controllers/finance.ts:144:      const current = grouped.get(day) ?? { id: `${sucursalId}-${day}`, tenant_id: tenantId, sucursal_id: sucursalId, balance: 0, income: 0, expense: 0, created_at: day };
apps/api/src/controllers/finance.ts:153:      const current = grouped.get(day) ?? { id: `${sucursalId}-${day}`, tenant_id: tenantId, sucursal_id: sucursalId, balance: 0, income: 0, expense: 0, created_at: day };
apps/api/src/controllers/finance.ts:191:          sucursal_id: body.sucursalId,
apps/api/src/controllers/finance.ts:233:    if (data?.sucursal_id && !(await assertSucursalOwnership(supabase, tenantId, data.sucursal_id))) {
apps/api/src/controllers/finance.ts:238:    if (scope?.mode === 'branch' && (scope?.sucursalId ?? '') && data.sucursal_id !== scope.sucursalId) {
apps/api/src/controllers/finance.ts:259:      .select('id, sucursal_id')
apps/api/src/controllers/finance.ts:269:    if (scope?.mode === 'branch' && (scope?.sucursalId ?? '') && lookup.data.sucursal_id !== scope.sucursalId) {
apps/api/src/controllers/tasks.ts:118:      query = query.eq('sucursal_id', effectiveSucursalId);
apps/api/src/controllers/tasks.ts:171:      sucursal_id: resolvedSucursalId,
apps/api/src/controllers/tasks.ts:228:      payload.sucursal_id = resolvedSucursalId;
apps/api/src/controllers/procurement.ts:15:      .select('id, tenant_id, product_id, stock_current, sucursal_id, created_at')
apps/api/src/controllers/sucursales.ts:275:      .update({ sucursal_id: sucursalId })
apps/api/src/controllers/sucursales.ts:278:      .select('id, tenant_id, sucursal_id, full_name, email, role, is_active')
apps/api/src/services/stock-alerts.ts:6:  sucursal_id: string | null;
apps/api/src/services/stock-alerts.ts:37:    ? await baseQuery.is('sucursal_id', null).maybeSingle()
apps/api/src/services/stock-alerts.ts:38:    : await baseQuery.eq('sucursal_id', sucursalId).maybeSingle();
apps/api/src/services/stock-alerts.ts:51:      const { error } = sucursalId === null ? await deleteQuery.is('sucursal_id', null) : await deleteQuery.eq('sucursal_id', sucursalId);
apps/api/src/services/stock-alerts.ts:59:    sucursal_id: sucursalId,
apps/api/src/services/stock-alerts.ts:72:      .is('sucursal_id', sucursalId)
apps/api/src/services/stock-alerts.ts:88:    .select('id, tenant_id, sucursal_id, product_id, severity, acknowledged_by, acknowledged_at, created_at')
apps/api/src/services/stock-alerts.ts:92:    query = query.eq('sucursal_id', sucursalId.trim());

---

## 8. Inventario: tablas y uso

apps/api/src/controllers/reports.ts:19:    let inventoryQuery = supabase.from('sucursal_inventory').select('id, stock_current, product_id, sucursal_id, products:product_id (id, cost)').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:24:      .from('inventory_movements')
apps/api/src/controllers/purchase-orders.ts:143:    supabase.from('inventory_movements').select('id, tenant_id, sucursal_id, product_id, purchase_order_id, movement_type, quantity, unit_cost, reference, notes, created_by, created_at').eq('tenant_id', tenantId).eq('purchase_order_id', orderId).order('created_at', { ascending: true }),
apps/api/src/controllers/purchase-orders.ts:444:        .from('sucursal_inventory')
apps/api/src/controllers/purchase-orders.ts:455:          .from('sucursal_inventory')
apps/api/src/controllers/purchase-orders.ts:470:        .from('sucursal_inventory')
apps/api/src/controllers/purchase-orders.ts:506:      const { error: movementError } = await supabase.from('inventory_movements').insert(movementRows);
apps/api/src/controllers/catalogs.ts:88:    .from('sucursal_inventory')
apps/api/src/controllers/catalogs.ts:101:      .from('sucursal_inventory')
apps/api/src/controllers/catalogs.ts:116:    .from('sucursal_inventory')
apps/api/src/controllers/catalogs.ts:219:      .from('sucursal_inventory')
apps/api/src/controllers/catalogs.ts:313:      .from('sucursal_inventory')
apps/api/src/controllers/catalogs.ts:359:      .from('sucursal_inventory')
apps/api/src/controllers/catalogs.ts:376:      const { error: movementError } = await supabase.from('inventory_movements').insert([{
apps/api/src/controllers/catalogs.ts:412:      .from('sucursal_inventory')
apps/api/src/controllers/catalogs.ts:446:      .from('inventory_movements')
apps/api/src/controllers/procurement.ts:14:      .from('sucursal_inventory')
apps/api/src/services/stock-alerts.ts:31:    .from('stock_alerts')
apps/api/src/services/stock-alerts.ts:47:        .from('stock_alerts')
apps/api/src/services/stock-alerts.ts:68:      .from('stock_alerts')
apps/api/src/services/stock-alerts.ts:79:  const { error } = await supabase.from('stock_alerts').insert([payload]);
apps/api/src/services/stock-alerts.ts:87:    .from('stock_alerts')
apps/api/src/services/stock-alerts.ts:104:    .from('stock_alerts')
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:22:alter table if exists public.inventory_movements enable row level security;
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:23:alter table if exists public.stock_alerts enable row level security;
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:28:alter table if exists public.inventory_movements force row level security;
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:29:alter table if exists public.stock_alerts force row level security;
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:76:drop policy if exists inventory_movements_select on public.inventory_movements;
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:77:create policy inventory_movements_select
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:78:on public.inventory_movements
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:83:drop policy if exists inventory_movements_write_owner_manager on public.inventory_movements;
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:84:create policy inventory_movements_write_owner_manager
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:85:on public.inventory_movements
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:91:drop policy if exists stock_alerts_select on public.stock_alerts;
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:92:create policy stock_alerts_select
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:93:on public.stock_alerts
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:98:drop policy if exists stock_alerts_write_owner_manager on public.stock_alerts;
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:99:create policy stock_alerts_write_owner_manager
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:100:on public.stock_alerts
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:109:grant select, insert, update, delete on public.inventory_movements to authenticated;
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:110:grant select, insert, update, delete on public.stock_alerts to authenticated;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:72:-- inventory_movements
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:73:alter table if exists public.inventory_movements
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:76:update public.inventory_movements
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:81:create index if not exists inventory_movements_tenant_sucursal_idx
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:82:  on public.inventory_movements (tenant_id, sucursal_id, created_at desc);
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:84:alter table public.inventory_movements
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:85:  drop constraint if exists inventory_movements_sucursal_id_fkey;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:87:alter table public.inventory_movements
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:88:  add constraint inventory_movements_sucursal_id_fkey
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:93:drop trigger if exists trg_inventory_movements_sync_sucursal_branch on public.inventory_movements;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:94:create trigger trg_inventory_movements_sync_sucursal_branch
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:95:before insert or update on public.inventory_movements
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:98:-- stock_alerts
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:99:alter table if exists public.stock_alerts
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:102:update public.stock_alerts
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:107:create index if not exists stock_alerts_tenant_sucursal_idx
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:108:  on public.stock_alerts (tenant_id, sucursal_id);
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:110:alter table public.stock_alerts
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:111:  drop constraint if exists stock_alerts_sucursal_id_fkey;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:113:alter table public.stock_alerts
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:114:  add constraint stock_alerts_sucursal_id_fkey
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:119:drop trigger if exists trg_stock_alerts_sync_sucursal_branch on public.stock_alerts;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:120:create trigger trg_stock_alerts_sync_sucursal_branch
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:121:before insert or update on public.stock_alerts
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:5:-- used by the current backend: public.sucursales and public.sucursal_inventory.
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:111:create table if not exists public.sucursal_inventory (
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:121:create index if not exists sucursal_inventory_tenant_idx
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:122:  on public.sucursal_inventory (tenant_id);
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:124:create index if not exists sucursal_inventory_tenant_sucursal_idx
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:125:  on public.sucursal_inventory (tenant_id, sucursal_id);
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:127:create index if not exists sucursal_inventory_tenant_product_idx
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:128:  on public.sucursal_inventory (tenant_id, product_id);
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:130:create unique index if not exists sucursal_inventory_uidx
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:131:  on public.sucursal_inventory (tenant_id, sucursal_id, product_id);
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:133:drop trigger if exists trg_sucursal_inventory_updated_at on public.sucursal_inventory;
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:134:create trigger trg_sucursal_inventory_updated_at
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:135:before update on public.sucursal_inventory
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:138:alter table public.sucursal_inventory enable row level security;
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:139:alter table public.sucursal_inventory force row level security;
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:141:drop policy if exists sucursal_inventory_select on public.sucursal_inventory;
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:142:create policy sucursal_inventory_select
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:143:on public.sucursal_inventory
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:148:drop policy if exists sucursal_inventory_write_owner_manager on public.sucursal_inventory;
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:149:create policy sucursal_inventory_write_owner_manager
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:150:on public.sucursal_inventory
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:160:insert into public.sucursal_inventory (
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:189:grant select, insert, update, delete on public.sucursal_inventory to authenticated;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:16:update public.inventory_movements
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:20:update public.stock_alerts
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:27:drop trigger if exists trg_inventory_movements_sync_sucursal_branch on public.inventory_movements;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:28:drop trigger if exists trg_stock_alerts_sync_sucursal_branch on public.stock_alerts;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:37:alter table public.inventory_movements
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:38:  drop constraint if exists inventory_movements_branch_id_fkey;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:40:alter table public.stock_alerts
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:41:  drop constraint if exists stock_alerts_branch_id_fkey;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:50:alter table public.inventory_movements
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:53:alter table public.stock_alerts
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:58:create table if not exists public.inventory_movements (
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:73:create index if not exists inventory_movements_tenant_product_idx
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:74:  on public.inventory_movements (tenant_id, product_id, created_at desc);
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:75:create table if not exists public.stock_alerts (
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:19:drop trigger if exists trg_inventory_movements_sync_sucursal_branch on public.inventory_movements;
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:20:drop trigger if exists trg_stock_alerts_sync_sucursal_branch on public.stock_alerts;
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:29:alter table public.inventory_movements
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:30:  drop constraint if exists inventory_movements_branch_id_fkey;
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:32:alter table public.stock_alerts
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:33:  drop constraint if exists stock_alerts_branch_id_fkey;
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:42:alter table public.inventory_movements
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:45:alter table public.stock_alerts
supabase/migrations/20260514133525_remote_schema.sql:1:drop trigger if exists "trg_branch_inventory_updated_at" on "public"."branch_inventory";
supabase/migrations/20260514133525_remote_schema.sql:15:drop policy "branch_inventory_delete_owner_manager" on "public"."branch_inventory";
supabase/migrations/20260514133525_remote_schema.sql:16:drop policy "branch_inventory_select" on "public"."branch_inventory";
supabase/migrations/20260514133525_remote_schema.sql:17:drop policy "branch_inventory_update_owner_manager" on "public"."branch_inventory";
supabase/migrations/20260514133525_remote_schema.sql:18:drop policy "branch_inventory_write_owner_manager" on "public"."branch_inventory";
supabase/migrations/20260514133525_remote_schema.sql:42:revoke delete on table "public"."branch_inventory" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:43:revoke insert on table "public"."branch_inventory" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:44:revoke references on table "public"."branch_inventory" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:45:revoke select on table "public"."branch_inventory" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:46:revoke trigger on table "public"."branch_inventory" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:47:revoke truncate on table "public"."branch_inventory" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:48:revoke update on table "public"."branch_inventory" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:49:revoke delete on table "public"."branch_inventory" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:50:revoke insert on table "public"."branch_inventory" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:51:revoke references on table "public"."branch_inventory" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:52:revoke select on table "public"."branch_inventory" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:53:revoke trigger on table "public"."branch_inventory" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:54:revoke truncate on table "public"."branch_inventory" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:55:revoke update on table "public"."branch_inventory" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:56:revoke delete on table "public"."branch_inventory" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:57:revoke insert on table "public"."branch_inventory" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:58:revoke references on table "public"."branch_inventory" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:59:revoke select on table "public"."branch_inventory" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:60:revoke trigger on table "public"."branch_inventory" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:61:revoke truncate on table "public"."branch_inventory" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:62:revoke update on table "public"."branch_inventory" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:147:revoke delete on table "public"."inventory_movements" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:148:revoke insert on table "public"."inventory_movements" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:149:revoke references on table "public"."inventory_movements" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:150:revoke select on table "public"."inventory_movements" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:151:revoke trigger on table "public"."inventory_movements" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:152:revoke truncate on table "public"."inventory_movements" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:153:revoke update on table "public"."inventory_movements" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:154:revoke delete on table "public"."inventory_movements" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:155:revoke insert on table "public"."inventory_movements" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:156:revoke references on table "public"."inventory_movements" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:157:revoke select on table "public"."inventory_movements" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:158:revoke trigger on table "public"."inventory_movements" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:159:revoke truncate on table "public"."inventory_movements" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:160:revoke update on table "public"."inventory_movements" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:161:revoke delete on table "public"."inventory_movements" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:162:revoke insert on table "public"."inventory_movements" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:163:revoke references on table "public"."inventory_movements" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:164:revoke select on table "public"."inventory_movements" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:165:revoke trigger on table "public"."inventory_movements" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:166:revoke truncate on table "public"."inventory_movements" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:167:revoke update on table "public"."inventory_movements" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:315:revoke delete on table "public"."stock_alerts" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:316:revoke insert on table "public"."stock_alerts" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:317:revoke references on table "public"."stock_alerts" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:318:revoke select on table "public"."stock_alerts" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:319:revoke trigger on table "public"."stock_alerts" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:320:revoke truncate on table "public"."stock_alerts" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:321:revoke update on table "public"."stock_alerts" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:322:revoke delete on table "public"."stock_alerts" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:323:revoke insert on table "public"."stock_alerts" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:324:revoke references on table "public"."stock_alerts" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:325:revoke select on table "public"."stock_alerts" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:326:revoke trigger on table "public"."stock_alerts" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:327:revoke truncate on table "public"."stock_alerts" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:328:revoke update on table "public"."stock_alerts" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:329:revoke delete on table "public"."stock_alerts" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:330:revoke insert on table "public"."stock_alerts" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:331:revoke references on table "public"."stock_alerts" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:332:revoke select on table "public"."stock_alerts" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:333:revoke trigger on table "public"."stock_alerts" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:334:revoke truncate on table "public"."stock_alerts" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:335:revoke update on table "public"."stock_alerts" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:420:alter table "public"."branch_inventory" drop constraint "branch_inventory_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:421:alter table "public"."branch_inventory" drop constraint "branch_inventory_product_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:422:alter table "public"."branch_inventory" drop constraint "branch_inventory_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:441:alter table "public"."inventory_movements" drop constraint "inventory_movements_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:442:alter table "public"."inventory_movements" drop constraint "inventory_movements_created_by_fkey";
supabase/migrations/20260514133525_remote_schema.sql:443:alter table "public"."inventory_movements" drop constraint "inventory_movements_product_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:444:alter table "public"."inventory_movements" drop constraint "inventory_movements_purchase_order_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:445:alter table "public"."inventory_movements" drop constraint "inventory_movements_service_order_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:446:alter table "public"."inventory_movements" drop constraint "inventory_movements_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:470:alter table "public"."stock_alerts" drop constraint "stock_alerts_acknowledged_by_fkey";
supabase/migrations/20260514133525_remote_schema.sql:471:alter table "public"."stock_alerts" drop constraint "stock_alerts_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:472:alter table "public"."stock_alerts" drop constraint "stock_alerts_product_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:473:alter table "public"."stock_alerts" drop constraint "stock_alerts_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:491:alter table "public"."branch_inventory" drop constraint "branch_inventory_pkey";
supabase/migrations/20260514133525_remote_schema.sql:496:alter table "public"."inventory_movements" drop constraint "inventory_movements_pkey";
supabase/migrations/20260514133525_remote_schema.sql:504:alter table "public"."stock_alerts" drop constraint "stock_alerts_pkey";
supabase/migrations/20260514133525_remote_schema.sql:509:drop index if exists "public"."branch_inventory_pkey";
supabase/migrations/20260514133525_remote_schema.sql:510:drop index if exists "public"."branch_inventory_uidx";
supabase/migrations/20260514133525_remote_schema.sql:520:drop index if exists "public"."inventory_movements_pkey";
supabase/migrations/20260514133525_remote_schema.sql:521:drop index if exists "public"."inventory_movements_tenant_product_idx";
supabase/migrations/20260514133525_remote_schema.sql:537:drop index if exists "public"."stock_alerts_pkey";
supabase/migrations/20260514133525_remote_schema.sql:547:drop table "public"."branch_inventory";
supabase/migrations/20260514133525_remote_schema.sql:552:drop table "public"."inventory_movements";
supabase/migrations/20260514133525_remote_schema.sql:560:drop table "public"."stock_alerts";
supabase/migrations/20260424_baseline_schema.sql:230:create table if not exists public.branch_inventory (
supabase/migrations/20260424_baseline_schema.sql:238:create unique index if not exists branch_inventory_uidx
supabase/migrations/20260424_baseline_schema.sql:239:  on public.branch_inventory (tenant_id, branch_id, product_id);
supabase/migrations/20260424_baseline_schema.sql:276:create table if not exists public.inventory_movements (
supabase/migrations/20260424_baseline_schema.sql:291:create index if not exists inventory_movements_tenant_product_idx
supabase/migrations/20260424_baseline_schema.sql:292:  on public.inventory_movements (tenant_id, product_id, created_at desc);
supabase/migrations/20260424_baseline_schema.sql:293:create table if not exists public.stock_alerts (
supabase/migrations/20260424_baseline_schema.sql:405:drop trigger if exists trg_branch_inventory_updated_at on public.branch_inventory;
supabase/migrations/20260424_baseline_schema.sql:406:create trigger trg_branch_inventory_updated_at
supabase/migrations/20260424_baseline_schema.sql:407:before update on public.branch_inventory
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:5:-- used by the current backend: public.sucursales and public.sucursal_inventory.
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:104:create table if not exists public.sucursal_inventory (
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:114:create index if not exists sucursal_inventory_tenant_idx
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:115:  on public.sucursal_inventory (tenant_id);
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:117:create index if not exists sucursal_inventory_tenant_sucursal_idx
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:118:  on public.sucursal_inventory (tenant_id, sucursal_id);
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:120:create index if not exists sucursal_inventory_tenant_product_idx
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:121:  on public.sucursal_inventory (tenant_id, product_id);
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:123:create unique index if not exists sucursal_inventory_uidx
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:124:  on public.sucursal_inventory (tenant_id, sucursal_id, product_id);
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:126:drop trigger if exists trg_sucursal_inventory_updated_at on public.sucursal_inventory;
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:127:create trigger trg_sucursal_inventory_updated_at
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:128:before update on public.sucursal_inventory
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:131:alter table public.sucursal_inventory enable row level security;
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:132:alter table public.sucursal_inventory force row level security;
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:134:drop policy if exists sucursal_inventory_select on public.sucursal_inventory;
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:135:create policy sucursal_inventory_select
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:136:on public.sucursal_inventory
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:141:drop policy if exists sucursal_inventory_write_owner_manager on public.sucursal_inventory;
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:142:create policy sucursal_inventory_write_owner_manager
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:143:on public.sucursal_inventory
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:149:insert into public.sucursal_inventory (
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:175:grant select, insert, update, delete on public.sucursal_inventory to authenticated;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:55:alter table if exists public.sucursal_inventory enable row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:62:alter table if exists public.inventory_movements enable row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:63:alter table if exists public.stock_alerts enable row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:76:alter table if exists public.sucursal_inventory force row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:83:alter table if exists public.inventory_movements force row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:84:alter table if exists public.stock_alerts force row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:328:  if to_regclass('public.sucursal_inventory') is not null then
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:329:    execute 'drop policy if exists sucursal_inventory_select on public.sucursal_inventory';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:331:      create policy sucursal_inventory_select
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:332:      on public.sucursal_inventory
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:337:    execute 'drop policy if exists sucursal_inventory_write_owner_manager on public.sucursal_inventory';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:339:      create policy sucursal_inventory_write_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:340:      on public.sucursal_inventory
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:509:  if to_regclass('public.inventory_movements') is not null then
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:510:    execute 'drop policy if exists inventory_movements_select on public.inventory_movements';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:512:      create policy inventory_movements_select
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:513:      on public.inventory_movements
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:518:    execute 'drop policy if exists inventory_movements_write_owner_manager on public.inventory_movements';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:520:      create policy inventory_movements_write_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:521:      on public.inventory_movements
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:529:  if to_regclass('public.stock_alerts') is not null then
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:530:    execute 'drop policy if exists stock_alerts_select on public.stock_alerts';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:532:      create policy stock_alerts_select
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:533:      on public.stock_alerts
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:538:    execute 'drop policy if exists stock_alerts_write_owner_manager on public.stock_alerts';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:540:      create policy stock_alerts_write_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:541:      on public.stock_alerts
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:660:  if to_regclass('public.sucursal_inventory') is not null then
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:661:    grant select, insert, update, delete on public.sucursal_inventory to authenticated;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:702:  if to_regclass('public.inventory_movements') is not null then
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:703:    grant select, insert, update, delete on public.inventory_movements to authenticated;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:708:  if to_regclass('public.stock_alerts') is not null then
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:709:    grant select, insert, update, delete on public.stock_alerts to authenticated;
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:66:-- inventory_movements
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:67:alter table if exists public.inventory_movements
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:72:create index if not exists inventory_movements_tenant_sucursal_idx
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:73:  on public.inventory_movements (tenant_id, sucursal_id, created_at desc);
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:75:alter table public.inventory_movements
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:76:  drop constraint if exists inventory_movements_sucursal_id_fkey;
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:78:alter table public.inventory_movements
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:79:  add constraint inventory_movements_sucursal_id_fkey
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:84:drop trigger if exists trg_inventory_movements_sync_sucursal_branch on public.inventory_movements;
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:85:create trigger trg_inventory_movements_sync_sucursal_branch
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:86:before insert or update on public.inventory_movements
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:89:-- stock_alerts
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:90:alter table if exists public.stock_alerts
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:95:create index if not exists stock_alerts_tenant_sucursal_idx
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:96:  on public.stock_alerts (tenant_id, sucursal_id);
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:98:alter table public.stock_alerts
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:99:  drop constraint if exists stock_alerts_sucursal_id_fkey;
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:101:alter table public.stock_alerts
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:102:  add constraint stock_alerts_sucursal_id_fkey
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:107:drop trigger if exists trg_stock_alerts_sync_sucursal_branch on public.stock_alerts;
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:108:create trigger trg_stock_alerts_sync_sucursal_branch
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:109:before insert or update on public.stock_alerts
supabase/migrations/20260514120000_enable_rls_and_policies.sql:5:alter table if exists public.branch_inventory enable row level security;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:123:drop policy if exists branch_inventory_select on public.branch_inventory;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:124:create policy branch_inventory_select
supabase/migrations/20260514120000_enable_rls_and_policies.sql:125:on public.branch_inventory
supabase/migrations/20260514120000_enable_rls_and_policies.sql:130:drop policy if exists branch_inventory_write_owner_manager on public.branch_inventory;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:131:create policy branch_inventory_write_owner_manager
supabase/migrations/20260514120000_enable_rls_and_policies.sql:132:on public.branch_inventory
supabase/migrations/20260514120000_enable_rls_and_policies.sql:138:drop policy if exists branch_inventory_update_owner_manager on public.branch_inventory;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:139:create policy branch_inventory_update_owner_manager
supabase/migrations/20260514120000_enable_rls_and_policies.sql:140:on public.branch_inventory
supabase/migrations/20260514120000_enable_rls_and_policies.sql:150:drop policy if exists branch_inventory_delete_owner_manager on public.branch_inventory;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:151:create policy branch_inventory_delete_owner_manager
supabase/migrations/20260514120000_enable_rls_and_policies.sql:152:on public.branch_inventory
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:22:alter table if exists public.inventory_movements enable row level security;
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:23:alter table if exists public.stock_alerts enable row level security;
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:28:alter table if exists public.inventory_movements force row level security;
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:29:alter table if exists public.stock_alerts force row level security;
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:76:drop policy if exists inventory_movements_select on public.inventory_movements;
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:77:create policy inventory_movements_select
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:78:on public.inventory_movements
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:83:drop policy if exists inventory_movements_write_owner_manager on public.inventory_movements;
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:84:create policy inventory_movements_write_owner_manager
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:85:on public.inventory_movements
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:91:drop policy if exists stock_alerts_select on public.stock_alerts;
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:92:create policy stock_alerts_select
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:93:on public.stock_alerts
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:98:drop policy if exists stock_alerts_write_owner_manager on public.stock_alerts;
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:99:create policy stock_alerts_write_owner_manager
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:100:on public.stock_alerts
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:109:grant select, insert, update, delete on public.inventory_movements to authenticated;
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:110:grant select, insert, update, delete on public.stock_alerts to authenticated;

---

## 9. Costos: estimated_cost / final_cost / total_cost / subtotal

apps/api/src/controllers/requests.ts:161:          estimated_cost: estimatedCost,
apps/api/src/controllers/requests.ts:162:          final_cost: finalCost,
apps/api/src/controllers/suppliers.ts:414:      .select('id, tenant_id, sucursal_id, supplier_id, related_service_order_id, folio, status, reference, payment_terms, expected_date, subtotal, tax_amount, total, notes, created_at, updated_at')
apps/api/src/controllers/reports.ts:17:    let ordersQuery = supabase.from('service_orders').select('id, status, created_at, total_cost, final_cost, sucursal_id, promised_date, folio').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:103:      (sum, order) => sum + Number((order as { total_cost?: number | null; final_cost?: number | null }).total_cost ?? (order as { total_cost?: number | null; final_cost?: number | null }).final_cost ?? 0),
apps/api/src/controllers/purchase-orders.ts:161:      .select('id, tenant_id, sucursal_id, supplier_id, related_service_order_id, folio, status, reference, payment_terms, expected_date, subtotal, tax_amount, total, notes, created_at, updated_at')
apps/api/src/controllers/purchase-orders.ts:225:    const subtotal = body.items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.unitCost), 0);
apps/api/src/controllers/purchase-orders.ts:227:    const total = Number((subtotal + taxAmount).toFixed(2));
apps/api/src/controllers/purchase-orders.ts:240:        subtotal,
apps/api/src/controllers/purchase-orders.ts:241:        tax_amount: taxAmount,
apps/api/src/controllers/purchase-orders.ts:263:      subtotal: Number((Number(item.quantity) * Number(item.unitCost)).toFixed(2)),
apps/api/src/controllers/purchase-orders.ts:498:          subtotal: Number((Number(item.qty_ordered ?? 0) * Number(item.unit_cost ?? 0)).toFixed(2)),
apps/api/src/controllers/orders.ts:530:          estimated_cost: estimatedCost,
apps/api/src/controllers/orders.ts:531:          final_cost: finalCost,
apps/api/src/controllers/orders.ts:626:        final_cost: finalCost,
apps/api/src/controllers/orders.ts:627:        estimated_cost: estimatedCost,
apps/api/src/controllers/orders.ts:1229:      .select('id, estimated_cost, final_cost, evidence_metadata')
apps/api/src/controllers/orders.ts:1242:    const nextEstimatedCost = typeof body.estimatedCost === 'number' ? body.estimatedCost : Number(order.estimated_cost ?? 0);
apps/api/src/controllers/orders.ts:1243:    const nextFinalCost = typeof body.finalCost === 'number' ? body.finalCost : Number(order.final_cost ?? nextEstimatedCost);
apps/api/src/controllers/orders.ts:1248:        estimated_cost: nextEstimatedCost,
apps/api/src/controllers/orders.ts:1249:        final_cost: nextFinalCost,
apps/api/src/controllers/users.ts:465:      .select('id, tenant_id, sucursal_id, supplier_id, related_service_order_id, folio, status, reference, payment_terms, expected_date, subtotal, tax_amount, total, notes, created_at, updated_at')
apps/api/src/controllers/finance.ts:17:function resolveOrderIncome(order: { total_cost?: number | null; final_cost?: number | null }) {
apps/api/src/controllers/finance.ts:18:  return Number(order.total_cost ?? order.final_cost ?? 0);
apps/api/src/controllers/finance.ts:41:      .select('id, tenant_id, sucursal_id, total_cost, final_cost, created_at, status')
apps/api/src/controllers/finance.ts:81:    const totalIncome = filteredOrders.reduce((sum, order) => sum + resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null }), 0);
apps/api/src/controllers/finance.ts:98:        balance: resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null }),
apps/api/src/controllers/finance.ts:99:        income: resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null }),
apps/api/src/controllers/finance.ts:145:      const income = resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null });
apps/api/src/controllers/public.ts:297:      .select('id, tenant_id, folio, status, total_cost, created_at, device_info, problem_description, serial_number, receipt_url, estimated_cost, final_cost, metadata')
apps/api/src/controllers/public.ts:351:      .select('id, tenant_id, folio, status, total_cost, created_at, updated_at, promised_date, device_info, problem_description, serial_number, receipt_url, estimated_cost, final_cost, evidence_metadata, metadata')
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:125:  payment_amount numeric(12,2);
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:148:      payment_amount := coalesce(nullif(new.final_cost, 0), nullif(new.estimated_cost, 0), 0);
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:180:          payment_amount,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:33:  subtotal numeric(12,2) not null default 0,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:34:  tax_amount numeric(12,2) not null default 0,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:54:  subtotal numeric(12,2) not null default 0,
supabase/migrations/20260514133525_remote_schema.sql:601:alter table "public"."service_orders" drop column "estimated_cost";
supabase/migrations/20260514133525_remote_schema.sql:602:alter table "public"."service_orders" drop column "final_cost";
supabase/migrations/20260514133525_remote_schema.sql:617:alter table "public"."service_orders" add column "total_cost" numeric(12,2) default 0;
supabase/migrations/20260514133525_remote_schema.sql:651:alter table "public"."service_orders" add constraint "service_orders_total_cost_check" CHECK ((total_cost >= (0)::numeric)) not valid;
supabase/migrations/20260514133525_remote_schema.sql:652:alter table "public"."service_orders" validate constraint "service_orders_total_cost_check";
supabase/migrations/20260514133525_remote_schema.sql:664:    so.total_cost,
supabase/migrations/20260424_baseline_schema.sql:110:  estimated_cost numeric(12,2) not null default 0,
supabase/migrations/20260424_baseline_schema.sql:111:  final_cost numeric(12,2) not null default 0,
supabase/migrations/20260424_baseline_schema.sql:251:  subtotal numeric(12,2) not null default 0,
supabase/migrations/20260424_baseline_schema.sql:252:  tax_amount numeric(12,2) not null default 0,
supabase/migrations/20260424_baseline_schema.sql:272:  subtotal numeric(12,2) not null default 0,
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:102:  add column if not exists estimated_cost numeric(12,2) not null default 0;
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:105:  add column if not exists final_cost numeric(12,2) not null default 0;

---

## 10. Escrituras a service_orders

apps/api/src/controllers/orders.ts:303:  const { error } = await supabase.from('service_order_documents').insert([row]);
apps/api/src/controllers/orders.ts:319:  const { error } = await supabase.from('service_order_events').insert([row]);
apps/api/src/controllers/orders.ts:512:      .from('service_orders')
apps/api/src/controllers/orders.ts:513:      .insert([
apps/api/src/controllers/orders.ts:556:    const { error: checklistError } = await supabase.from('service_order_checklists').insert([
apps/api/src/controllers/orders.ts:578:      .from('service_orders')
apps/api/src/controllers/orders.ts:579:      .update({
apps/api/src/controllers/orders.ts:659:      .from('service_orders')
apps/api/src/controllers/orders.ts:708:      .from('service_orders')
apps/api/src/controllers/orders.ts:809:      .from('service_orders')
apps/api/src/controllers/orders.ts:882:        .from('service_orders')
apps/api/src/controllers/orders.ts:889:        .from('service_orders')
apps/api/src/controllers/orders.ts:890:        .update({
apps/api/src/controllers/orders.ts:915:        .from('service_orders')
apps/api/src/controllers/orders.ts:942:        .from('service_orders')
apps/api/src/controllers/orders.ts:957:        .from('service_orders')
apps/api/src/controllers/orders.ts:958:        .update({
apps/api/src/controllers/orders.ts:1040:      .from('service_orders')
apps/api/src/controllers/orders.ts:1066:      .from('service_orders')
apps/api/src/controllers/orders.ts:1067:      .update({ evidence_metadata: appendEvidenceEntry((order as { evidence_metadata?: unknown }).evidence_metadata, noteEntry) })
apps/api/src/controllers/orders.ts:1124:      .from('service_orders')
apps/api/src/controllers/orders.ts:1147:      .from('service_orders')
apps/api/src/controllers/orders.ts:1148:      .update({
apps/api/src/controllers/orders.ts:1165:      .from('service_orders')
apps/api/src/controllers/orders.ts:1166:      .update({
apps/api/src/controllers/orders.ts:1228:      .from('service_orders')
apps/api/src/controllers/orders.ts:1246:      .from('service_orders')
apps/api/src/controllers/orders.ts:1247:      .update({
apps/api/src/controllers/orders.ts:1276:        .from('service_orders')
apps/api/src/controllers/orders.ts:1277:        .update({
apps/api/src/controllers/orders.ts:1323:      .from('service_orders')
apps/api/src/controllers/orders.ts:1349:      .from('service_orders')
apps/api/src/controllers/orders.ts:1350:      .update({
apps/api/src/controllers/orders.ts:1423:      .from('service_orders')
apps/api/src/controllers/orders.ts:1480:      .from('service_orders')
apps/api/src/controllers/orders.ts:1498:      .from('service_orders')
apps/api/src/controllers/orders.ts:1499:      .update({ warranty_until: warrantyUntil })
apps/api/src/controllers/orders.ts:1522:      .from('service_orders')
apps/api/src/controllers/orders.ts:1523:      .update({
apps/api/src/controllers/requests.ts:120:        .insert([
apps/api/src/controllers/requests.ts:144:      .from('service_orders')
apps/api/src/controllers/requests.ts:145:      .insert([
apps/api/src/controllers/requests.ts:175:      .update({
apps/api/src/controllers/finance.ts:40:      .from('service_orders')
apps/api/src/controllers/finance.ts:188:      .insert([
apps/api/src/controllers/public.ts:244:      .insert([
apps/api/src/controllers/public.ts:296:      .from('service_orders')
apps/api/src/controllers/public.ts:350:      .from('service_orders')

---

## 11. Finanzas e ingresos

apps/api/src/controllers/suppliers.ts:30:  paymentTerms: z.string().optional().or(z.literal('')),
apps/api/src/controllers/suppliers.ts:58:    payment_terms: row.payment_terms ?? null,
apps/api/src/controllers/suppliers.ts:59:    condiciones_pago: row.payment_terms ?? null,
apps/api/src/controllers/suppliers.ts:86:    .select('id, tenant_id, business_name, rfc, legal_name, contact_name, phone, whatsapp, email, address, city, state, categories, lead_time_days, payment_terms, price_score, speed_score, quality_score, reliability_score, notes, is_active, created_at, updated_at', { count: 'exact' })
apps/api/src/controllers/suppliers.ts:162:      .select('id, tenant_id, business_name, rfc, legal_name, contact_name, phone, whatsapp, email, address, city, state, categories, lead_time_days, payment_terms, price_score, speed_score, quality_score, reliability_score, notes, is_active, created_at, updated_at')
apps/api/src/controllers/suppliers.ts:210:          payment_terms: body.paymentTerms?.trim() || null,
apps/api/src/controllers/suppliers.ts:219:      .select('id, tenant_id, business_name, rfc, legal_name, contact_name, phone, whatsapp, email, address, city, state, categories, lead_time_days, payment_terms, price_score, speed_score, quality_score, reliability_score, notes, is_active, created_at, updated_at')
apps/api/src/controllers/suppliers.ts:287:    if (body.paymentTerms !== undefined) payload.payment_terms = body.paymentTerms?.trim() || null;
apps/api/src/controllers/suppliers.ts:296:      .select('id, tenant_id, business_name, rfc, legal_name, contact_name, phone, whatsapp, email, address, city, state, categories, lead_time_days, payment_terms, price_score, speed_score, quality_score, reliability_score, notes, is_active, created_at, updated_at')
apps/api/src/controllers/suppliers.ts:357:      .select('id, tenant_id, business_name, rfc, legal_name, contact_name, phone, whatsapp, email, address, city, state, categories, lead_time_days, payment_terms, price_score, speed_score, quality_score, reliability_score, notes, is_active, created_at, updated_at')
apps/api/src/controllers/suppliers.ts:414:      .select('id, tenant_id, sucursal_id, supplier_id, related_service_order_id, folio, status, reference, payment_terms, expected_date, subtotal, tax_amount, total, notes, created_at, updated_at')
apps/api/src/controllers/reports.ts:20:    let financeQuery = supabase.from('finances').select('id, balance, income, expense, created_at, sucursal_id').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:21:    let requestsQuery = supabase.from('service_requests').select('id, balance_amount, status, created_at').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:58:    const finances = financeResult.data ?? [];
apps/api/src/controllers/reports.ts:102:    const totalIncome = orders.reduce(
apps/api/src/controllers/reports.ts:106:    const totalExpense = finances.reduce((sum, item) => sum + Number((item as { expense?: number }).expense ?? 0), 0);
apps/api/src/controllers/reports.ts:107:    const totalBalance = Number((totalIncome - totalExpense).toFixed(2));
apps/api/src/controllers/reports.ts:115:    const accountsReceivable = requests.reduce((sum, item) => sum + Number((item as { balance_amount?: number }).balance_amount ?? 0), 0);
apps/api/src/controllers/reports.ts:184:        totalIncome,
apps/api/src/controllers/reports.ts:185:        totalExpense,
apps/api/src/controllers/reports.ts:186:        totalBalance,
apps/api/src/controllers/reports.ts:197:        lastUpdatedAt: finances[0]?.created_at ?? orders[0]?.created_at ?? null,
apps/api/src/controllers/purchase-orders.ts:22:  paymentTerms: z.string().optional().or(z.literal('')),
apps/api/src/controllers/purchase-orders.ts:32:  paymentTerms: z.string().optional().or(z.literal('')).nullable(),
apps/api/src/controllers/purchase-orders.ts:161:      .select('id, tenant_id, sucursal_id, supplier_id, related_service_order_id, folio, status, reference, payment_terms, expected_date, subtotal, tax_amount, total, notes, created_at, updated_at')
apps/api/src/controllers/purchase-orders.ts:238:        payment_terms: body.paymentTerms || null,
apps/api/src/controllers/purchase-orders.ts:316:    if (body.paymentTerms !== undefined) payload.payment_terms = body.paymentTerms || null;
apps/api/src/controllers/users.ts:465:      .select('id, tenant_id, sucursal_id, supplier_id, related_service_order_id, folio, status, reference, payment_terms, expected_date, subtotal, tax_amount, total, notes, created_at, updated_at')
apps/api/src/controllers/finance.ts:5:const createExpenseSchema = z.object({
apps/api/src/controllers/finance.ts:17:function resolveOrderIncome(order: { total_cost?: number | null; final_cost?: number | null }) {
apps/api/src/controllers/finance.ts:38:  const [ordersResult, expensesResult] = await Promise.all([
apps/api/src/controllers/finance.ts:45:      .from('finances')
apps/api/src/controllers/finance.ts:46:      .select('id, tenant_id, sucursal_id, balance, income, expense, created_at')
apps/api/src/controllers/finance.ts:51:  const errors = [ordersResult.error, expensesResult.error].filter(Boolean);
apps/api/src/controllers/finance.ts:58:    expenses: expensesResult.data ?? [],
apps/api/src/controllers/finance.ts:62:export const getBalance = async (req: Request, res: Response) => {
apps/api/src/controllers/finance.ts:67:      return res.status(403).json({ error: 'Only owner can access global balance' });
apps/api/src/controllers/finance.ts:72:    const { orders, expenses } = await loadFinanceFacts(tenantId);
apps/api/src/controllers/finance.ts:77:    const filteredExpenses = sucursalId
apps/api/src/controllers/finance.ts:78:      ? expenses.filter((expense) => String((expense as { sucursal_id?: string | null }).sucursal_id ?? '') === sucursalId)
apps/api/src/controllers/finance.ts:79:      : expenses;
apps/api/src/controllers/finance.ts:81:    const totalIncome = filteredOrders.reduce((sum, order) => sum + resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null }), 0);
apps/api/src/controllers/finance.ts:82:    const totalExpense = filteredExpenses.reduce((sum, item) => sum + Number((item as { expense?: number }).expense ?? 0), 0);
apps/api/src/controllers/finance.ts:83:    const totalBalance = Number((totalIncome - totalExpense).toFixed(2));
apps/api/src/controllers/finance.ts:87:        id: `income-${tenantId}`,
apps/api/src/controllers/finance.ts:89:        balance: totalBalance,
apps/api/src/controllers/finance.ts:90:        income: totalIncome,
apps/api/src/controllers/finance.ts:91:        expense: totalExpense,
apps/api/src/controllers/finance.ts:98:        balance: resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null }),
apps/api/src/controllers/finance.ts:99:        income: resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null }),
apps/api/src/controllers/finance.ts:100:        expense: 0,
apps/api/src/controllers/finance.ts:104:      ...filteredExpenses.slice(0, 25).map((expense) => ({
apps/api/src/controllers/finance.ts:105:        id: String((expense as { id?: string }).id ?? `${tenantId}-expense`),
apps/api/src/controllers/finance.ts:107:        balance: Number((expense as { balance?: number; expense?: number }).balance ?? 0),
apps/api/src/controllers/finance.ts:108:        income: 0,
apps/api/src/controllers/finance.ts:109:        expense: Number((expense as { expense?: number }).expense ?? 0),
apps/api/src/controllers/finance.ts:110:        created_at: String((expense as { created_at?: string }).created_at ?? new Date().toISOString()),
apps/api/src/controllers/finance.ts:111:        type: 'expense',
apps/api/src/controllers/finance.ts:117:    console.error('Error getting balance:', error);
apps/api/src/controllers/finance.ts:136:    const { orders, expenses } = await loadFinanceFacts(tenantId);
apps/api/src/controllers/finance.ts:138:    const sucursalExpenses = expenses.filter((expense) => String((expense as { sucursal_id?: string | null }).sucursal_id ?? '') === sucursalId);
apps/api/src/controllers/finance.ts:140:    const grouped = new Map<string, { id: string; tenant_id: string; sucursal_id: string; balance: number; income: number; expense: number; created_at: string }>();
apps/api/src/controllers/finance.ts:144:      const current = grouped.get(day) ?? { id: `${sucursalId}-${day}`, tenant_id: tenantId, sucursal_id: sucursalId, balance: 0, income: 0, expense: 0, created_at: day };
apps/api/src/controllers/finance.ts:145:      const income = resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null });
apps/api/src/controllers/finance.ts:146:      current.income += income;
apps/api/src/controllers/finance.ts:147:      current.balance += income;
apps/api/src/controllers/finance.ts:151:    for (const expense of sucursalExpenses) {
apps/api/src/controllers/finance.ts:152:      const day = toDayKey((expense as { expense_date?: string; created_at?: string }).expense_date ?? (expense as { created_at?: string }).created_at ?? null);
apps/api/src/controllers/finance.ts:153:      const current = grouped.get(day) ?? { id: `${sucursalId}-${day}`, tenant_id: tenantId, sucursal_id: sucursalId, balance: 0, income: 0, expense: 0, created_at: day };
apps/api/src/controllers/finance.ts:154:      const amount = Number((expense as { expense?: number }).expense ?? 0);
apps/api/src/controllers/finance.ts:155:      current.expense += amount;
apps/api/src/controllers/finance.ts:156:      current.balance -= amount;
apps/api/src/controllers/finance.ts:168:export const createExpense = async (req: Request, res: Response) => {
apps/api/src/controllers/finance.ts:173:    const body = createExpenseSchema.parse(req.body);
apps/api/src/controllers/finance.ts:187:      .from('finances')
apps/api/src/controllers/finance.ts:192:          balance: Number((-body.amount).toFixed(2)),
apps/api/src/controllers/finance.ts:193:          income: 0,
apps/api/src/controllers/finance.ts:194:          expense: body.amount,
apps/api/src/controllers/finance.ts:201:      return res.status(502).json({ error: 'Failed to create expense', details: error.message });
apps/api/src/controllers/finance.ts:209:    console.error('Error creating expense:', error);
apps/api/src/controllers/finance.ts:214:export const getExpense = async (req: Request, res: Response) => {
apps/api/src/controllers/finance.ts:217:    const expenseId = req.params.id;
apps/api/src/controllers/finance.ts:219:    if (!expenseId) return res.status(400).json({ error: 'Missing expense id' });
apps/api/src/controllers/finance.ts:223:      .from('finances')
apps/api/src/controllers/finance.ts:226:      .eq('id', expenseId)
apps/api/src/controllers/finance.ts:230:      return res.status(502).json({ error: 'Failed to fetch expense', details: error.message });
apps/api/src/controllers/finance.ts:244:    console.error('Error getting expense:', error);
apps/api/src/controllers/finance.ts:249:export const deleteExpense = async (req: Request, res: Response) => {
apps/api/src/controllers/finance.ts:252:    const expenseId = req.params.id;
apps/api/src/controllers/finance.ts:254:    if (!expenseId) return res.status(400).json({ error: 'Missing expense id' });
apps/api/src/controllers/finance.ts:258:      .from('finances')
apps/api/src/controllers/finance.ts:261:      .eq('id', expenseId)
apps/api/src/controllers/finance.ts:265:      return res.status(502).json({ error: 'Failed to fetch expense', details: lookup.error.message });
apps/api/src/controllers/finance.ts:274:      .from('finances')
apps/api/src/controllers/finance.ts:277:      .eq('id', expenseId);
apps/api/src/controllers/finance.ts:280:      return res.status(502).json({ error: 'Failed to delete expense', details: error.message });
apps/api/src/controllers/finance.ts:285:    console.error('Error deleting expense:', error);
apps/api/src/controllers/public.ts:258:          balance_amount: 0,
apps/api/src/services/tenant-capabilities.ts:31:  { key: 'expenses', label: 'Gastos', description: 'Control de egresos', category: 'control', frontend_routes: ['/dashboard/gastos'], backend_permissions: [], default_enabled_by_industry: ['electronics_repair', 'hvac_service'], required_plan: 'pro', aliases: [] },
apps/api/src/services/tenant-capabilities.ts:32:  { key: 'finance', label: 'Finanzas', description: 'Flujo de caja y balance', category: 'control', frontend_routes: ['/dashboard/finanzas'], backend_permissions: [], default_enabled_by_industry: ['electronics_repair', 'hvac_service'], required_plan: 'scale', aliases: [] },
apps/api/src/services/tenant-capabilities.ts:53:    module_allowlist: ['dashboard', 'customers', 'requests', 'orders', 'appointments', 'assets', 'stock', 'suppliers', 'purchase-orders', 'expenses', 'reports', 'documents', 'portal', 'landing', 'whatsapp', 'warranty', 'billing', 'settings', 'sucursales', 'tasks', 'security'],
apps/api/src/services/tenant-config.ts:122:    { module_key: 'expenses', module_label: 'Gastos', enabled: true, sort_order: 8, metadata: {} },
apps/api/src/services/tenant-config.ts:240:    { module_key: 'expenses', module_label: 'Gastos', enabled: true, sort_order: 8, metadata: {} },
apps/api/src/services/billing.ts:22:type MercadoPagoPaymentResponse = {
apps/api/src/services/billing.ts:70:function mapPaymentStatus(status: string) {
apps/api/src/services/billing.ts:78:function buildSignature(paymentId: string, topic: string, signature: string) {
apps/api/src/services/billing.ts:104:  const template = `id:${paymentId};topic:${topic};ts:${ts};`;
apps/api/src/services/billing.ts:297:  const paymentId = String(typedPayload.data?.id || typedPayload.id || '');
apps/api/src/services/billing.ts:299:  if (!paymentId || !topic.includes('payment')) {
apps/api/src/services/billing.ts:303:  if (signature && !buildSignature(paymentId, topic, signature)) {
apps/api/src/services/billing.ts:307:  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
apps/api/src/services/billing.ts:311:  const payment = await response.json().catch(() => ({} as MercadoPagoPaymentResponse));
apps/api/src/services/billing.ts:316:  const tenantId = String(payment.metadata?.tenantId || '');
apps/api/src/services/billing.ts:317:  const tenantSlug = String(payment.metadata?.tenantSlug || '');
apps/api/src/services/billing.ts:318:  const plan = (payment.metadata?.plan || 'basic') as BillingPlanCode;
apps/api/src/services/billing.ts:319:  const mappedStatus = mapPaymentStatus(String(payment.status || 'pending'));
apps/api/src/services/billing.ts:330:    paymentId,
apps/api/src/services/billing.ts:331:    status: payment.status,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:30:create table if not exists public.customer_payments (
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:37:  payment_type text,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:39:  payment_method text,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:47:create index if not exists customer_payments_tenant_order_idx
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:48:  on public.customer_payments (tenant_id, service_order_id, paid_at desc);
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:53:alter table public.customer_payments
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:119:-- Audit trail and automatic payment/history on order status transitions.
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:120:create or replace function public._sync_order_status_audit_and_payment()
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:125:  payment_amount numeric(12,2);
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:148:      payment_amount := coalesce(nullif(new.final_cost, 0), nullif(new.estimated_cost, 0), 0);
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:153:        from public.customer_payments p
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:156:          and coalesce(p.payment_type, '') = 'Entrega'
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:158:        insert into public.customer_payments (
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:164:          payment_type,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:166:          payment_method,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:180:          payment_amount,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:197:drop trigger if exists trg_service_orders_status_audit_and_payment on public.service_orders;
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:198:create trigger trg_service_orders_status_audit_and_payment
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:200:for each row execute function public._sync_order_status_audit_and_payment();
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:31:  payment_terms text,
supabase/migrations/20260514133525_remote_schema.sql:4:drop trigger if exists "trg_expenses_updated_at" on "public"."expenses";
supabase/migrations/20260514133525_remote_schema.sql:23:drop policy "expenses_manager_delete_own_sucursal" on "public"."expenses";
supabase/migrations/20260514133525_remote_schema.sql:24:drop policy "expenses_manager_read_own_sucursal" on "public"."expenses";
supabase/migrations/20260514133525_remote_schema.sql:25:drop policy "expenses_manager_update_own_sucursal" on "public"."expenses";
supabase/migrations/20260514133525_remote_schema.sql:26:drop policy "expenses_manager_write_own_sucursal" on "public"."expenses";
supabase/migrations/20260514133525_remote_schema.sql:27:drop policy "expenses_owner" on "public"."expenses";
supabase/migrations/20260514133525_remote_schema.sql:84:revoke delete on table "public"."customer_payments" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:85:revoke insert on table "public"."customer_payments" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:86:revoke references on table "public"."customer_payments" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:87:revoke select on table "public"."customer_payments" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:88:revoke trigger on table "public"."customer_payments" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:89:revoke truncate on table "public"."customer_payments" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:90:revoke update on table "public"."customer_payments" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:91:revoke delete on table "public"."customer_payments" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:92:revoke insert on table "public"."customer_payments" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:93:revoke references on table "public"."customer_payments" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:94:revoke select on table "public"."customer_payments" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:95:revoke trigger on table "public"."customer_payments" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:96:revoke truncate on table "public"."customer_payments" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:97:revoke update on table "public"."customer_payments" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:98:revoke delete on table "public"."customer_payments" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:99:revoke insert on table "public"."customer_payments" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:100:revoke references on table "public"."customer_payments" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:101:revoke select on table "public"."customer_payments" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:102:revoke trigger on table "public"."customer_payments" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:103:revoke truncate on table "public"."customer_payments" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:104:revoke update on table "public"."customer_payments" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:105:revoke delete on table "public"."expenses" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:106:revoke insert on table "public"."expenses" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:107:revoke references on table "public"."expenses" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:108:revoke select on table "public"."expenses" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:109:revoke trigger on table "public"."expenses" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:110:revoke truncate on table "public"."expenses" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:111:revoke update on table "public"."expenses" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:112:revoke delete on table "public"."expenses" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:113:revoke insert on table "public"."expenses" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:114:revoke references on table "public"."expenses" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:115:revoke select on table "public"."expenses" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:116:revoke trigger on table "public"."expenses" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:117:revoke truncate on table "public"."expenses" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:118:revoke update on table "public"."expenses" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:119:revoke delete on table "public"."expenses" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:120:revoke insert on table "public"."expenses" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:121:revoke references on table "public"."expenses" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:122:revoke select on table "public"."expenses" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:123:revoke trigger on table "public"."expenses" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:124:revoke truncate on table "public"."expenses" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:125:revoke update on table "public"."expenses" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:424:alter table "public"."customer_payments" drop constraint "customer_payments_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:425:alter table "public"."customer_payments" drop constraint "customer_payments_created_by_fkey";
supabase/migrations/20260514133525_remote_schema.sql:426:alter table "public"."customer_payments" drop constraint "customer_payments_customer_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:427:alter table "public"."customer_payments" drop constraint "customer_payments_service_order_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:428:alter table "public"."customer_payments" drop constraint "customer_payments_service_request_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:429:alter table "public"."customer_payments" drop constraint "customer_payments_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:430:alter table "public"."expenses" drop constraint "expenses_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:431:alter table "public"."expenses" drop constraint "expenses_created_by_fkey";
supabase/migrations/20260514133525_remote_schema.sql:432:alter table "public"."expenses" drop constraint "expenses_purchase_order_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:433:alter table "public"."expenses" drop constraint "expenses_service_order_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:434:alter table "public"."expenses" drop constraint "expenses_supplier_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:435:alter table "public"."expenses" drop constraint "expenses_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:493:alter table "public"."customer_payments" drop constraint "customer_payments_pkey";
supabase/migrations/20260514133525_remote_schema.sql:494:alter table "public"."expenses" drop constraint "expenses_pkey";
supabase/migrations/20260514133525_remote_schema.sql:513:drop index if exists "public"."customer_payments_pkey";
supabase/migrations/20260514133525_remote_schema.sql:517:drop index if exists "public"."expenses_pkey";
supabase/migrations/20260514133525_remote_schema.sql:518:drop index if exists "public"."expenses_tenant_date_idx";
supabase/migrations/20260514133525_remote_schema.sql:549:drop table "public"."customer_payments";
supabase/migrations/20260514133525_remote_schema.sql:550:drop table "public"."expenses";
supabase/migrations/20260424_baseline_schema.sql:88:  balance_amount numeric(12,2) not null default 0,
supabase/migrations/20260424_baseline_schema.sql:198:  payment_terms text,
supabase/migrations/20260424_baseline_schema.sql:249:  payment_terms text,
supabase/migrations/20260424_baseline_schema.sql:303:create table if not exists public.expenses (
supabase/migrations/20260424_baseline_schema.sql:310:  expense_type text not null,
supabase/migrations/20260424_baseline_schema.sql:315:  payment_method text,
supabase/migrations/20260424_baseline_schema.sql:318:  expense_date date not null,
supabase/migrations/20260424_baseline_schema.sql:323:create index if not exists expenses_tenant_date_idx
supabase/migrations/20260424_baseline_schema.sql:324:  on public.expenses (tenant_id, expense_date desc);
supabase/migrations/20260424_baseline_schema.sql:325:create table if not exists public.customer_payments (
supabase/migrations/20260424_baseline_schema.sql:332:  payment_type text,
supabase/migrations/20260424_baseline_schema.sql:334:  payment_method text,
supabase/migrations/20260424_baseline_schema.sql:417:drop trigger if exists trg_expenses_updated_at on public.expenses;
supabase/migrations/20260424_baseline_schema.sql:418:create trigger trg_expenses_updated_at
supabase/migrations/20260424_baseline_schema.sql:419:before update on public.expenses
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:28:  payment_terms text,
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:68:create table if not exists public.finances (
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:72:  balance numeric(12,2) not null default 0,
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:73:  income numeric(12,2) not null default 0,
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:74:  expense numeric(12,2) not null default 0,
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:79:create index if not exists finances_tenant_idx
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:80:  on public.finances (tenant_id);
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:82:create index if not exists finances_tenant_sucursal_idx
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:83:  on public.finances (tenant_id, sucursal_id);
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:170:drop trigger if exists trg_finances_updated_at on public.finances;
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:171:create trigger trg_finances_updated_at
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:172:before update on public.finances
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:177:alter table public.finances enable row level security;
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:222:drop policy if exists finances_select on public.finances;
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:223:create policy finances_select
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:224:on public.finances
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:230:drop policy if exists finances_write_owner_manager on public.finances;
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:231:create policy finances_write_owner_manager
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:232:on public.finances
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:266:grant select, insert, update, delete on table public.finances to authenticated, service_role;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:58:alter table if exists public.expenses enable row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:64:alter table if exists public.customer_payments enable row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:66:alter table if exists public.finances enable row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:79:alter table if exists public.expenses force row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:85:alter table if exists public.customer_payments force row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:87:alter table if exists public.finances force row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:388:  if to_regclass('public.expenses') is not null then
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:389:    execute 'drop policy if exists expenses_owner on public.expenses';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:391:      create policy expenses_owner
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:392:      on public.expenses
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:398:    execute 'drop policy if exists expenses_manager_read_own_sucursal on public.expenses';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:400:      create policy expenses_manager_read_own_sucursal
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:401:      on public.expenses
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:410:    execute 'drop policy if exists expenses_manager_write_own_sucursal on public.expenses';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:412:      create policy expenses_manager_write_own_sucursal
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:413:      on public.expenses
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:421:    execute 'drop policy if exists expenses_manager_update_own_sucursal on public.expenses';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:423:      create policy expenses_manager_update_own_sucursal
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:424:      on public.expenses
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:436:    execute 'drop policy if exists expenses_manager_delete_own_sucursal on public.expenses';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:438:      create policy expenses_manager_delete_own_sucursal
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:439:      on public.expenses
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:549:  if to_regclass('public.customer_payments') is not null then
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:550:    execute 'drop policy if exists customer_payments_select on public.customer_payments';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:552:      create policy customer_payments_select
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:553:      on public.customer_payments
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:558:    execute 'drop policy if exists customer_payments_write_owner_manager on public.customer_payments';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:560:      create policy customer_payments_write_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:561:      on public.customer_payments
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:589:  if to_regclass('public.finances') is not null then
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:590:    execute 'drop policy if exists finances_select on public.finances';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:592:      create policy finances_select
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:593:      on public.finances
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:598:    execute 'drop policy if exists finances_write_owner_manager on public.finances';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:600:      create policy finances_write_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:601:      on public.finances
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:678:  if to_regclass('public.expenses') is not null then
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:679:    grant select, insert, update, delete on public.expenses to authenticated;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:714:  if to_regclass('public.customer_payments') is not null then
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:715:    grant select, insert, update, delete on public.customer_payments to authenticated;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:726:  if to_regclass('public.finances') is not null then
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:727:    grant select, insert, update, delete on public.finances to authenticated;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:6:alter table if exists public.expenses enable row level security;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:197:-- EXPENSES
supabase/migrations/20260514120000_enable_rls_and_policies.sql:198:drop policy if exists expenses_owner on public.expenses;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:199:create policy expenses_owner
supabase/migrations/20260514120000_enable_rls_and_policies.sql:200:on public.expenses
supabase/migrations/20260514120000_enable_rls_and_policies.sql:210:drop policy if exists expenses_manager_read_own_sucursal on public.expenses;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:211:create policy expenses_manager_read_own_sucursal
supabase/migrations/20260514120000_enable_rls_and_policies.sql:212:on public.expenses
supabase/migrations/20260514120000_enable_rls_and_policies.sql:219:drop policy if exists expenses_manager_write_own_sucursal on public.expenses;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:220:create policy expenses_manager_write_own_sucursal
supabase/migrations/20260514120000_enable_rls_and_policies.sql:221:on public.expenses
supabase/migrations/20260514120000_enable_rls_and_policies.sql:228:drop policy if exists expenses_manager_update_own_sucursal on public.expenses;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:229:create policy expenses_manager_update_own_sucursal
supabase/migrations/20260514120000_enable_rls_and_policies.sql:230:on public.expenses
supabase/migrations/20260514120000_enable_rls_and_policies.sql:242:drop policy if exists expenses_manager_delete_own_sucursal on public.expenses;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:243:create policy expenses_manager_delete_own_sucursal
supabase/migrations/20260514120000_enable_rls_and_policies.sql:244:on public.expenses

---

## 12. RLS / tenant isolation

apps/api/src/middleware/scope.ts:4:export const attachScope = (req: Request, res: Response, next: NextFunction) => {
apps/api/src/middleware/validateTenant.ts:3:export const validateTenant = (req: Request, res: Response, next: NextFunction) => {
apps/api/src/middleware/validateTenant.ts:9:    return res.status(401).json({ error: 'Missing tenant_slug in token' });
apps/api/src/middleware/tenantResolver.ts:9:    return res.status(401).json({ error: 'Missing tenant_slug in token' });
apps/api/src/middleware/auth.ts:10:  tenant_id: string;
apps/api/src/middleware/auth.ts:11:  tenant_slug?: string;
apps/api/src/middleware/auth.ts:34:  const tenantId = typeof payload.tenant_id === 'string' ? payload.tenant_id : null;
apps/api/src/middleware/auth.ts:57:    tenant_id: z.string().min(1),
apps/api/src/middleware/auth.ts:58:    tenant_slug: z.string().min(1).optional(),
apps/api/src/middleware/auth.ts:93:        .select('id, tenant_id, role, sucursal_id, activo, is_active, mfa_enabled')
apps/api/src/middleware/auth.ts:95:        .eq('tenant_id', claims.tenant_id)
apps/api/src/middleware/auth.ts:110:          .select('id, tenant_id, user_id, revoked_at')
apps/api/src/middleware/auth.ts:112:          .eq('tenant_id', claims.tenant_id)
apps/api/src/middleware/auth.ts:133:        tenantId: claims.tenant_id,
apps/api/src/middleware/auth.ts:134:        tenantSlug: claims.tenant_slug ?? null,
apps/api/src/middleware/tenantBilling.ts:7:  const masterTenantSlug = process.env.MASTER_TENANT_SLUG?.trim() ?? '';
apps/api/src/types/env.d.ts:14:    MASTER_TENANT_SLUG?: string;
apps/api/src/controllers/meta.ts:63:      .select('tenant_id, role, sucursal_id')
apps/api/src/controllers/meta.ts:71:    if (!userRow?.tenant_id) {
apps/api/src/controllers/meta.ts:78:      .eq('id', userRow.tenant_id)
apps/api/src/controllers/meta.ts:240:        tenant_id: tenantRow.id,
apps/api/src/controllers/meta.ts:256:        .upsert(industryPayload, { onConflict: 'tenant_id' });
apps/api/src/controllers/meta.ts:276:            tenant_id: tenantRow.id,
apps/api/src/controllers/meta.ts:290:          .eq('tenant_id', tenantRow.id);
apps/api/src/controllers/meta.ts:300:          .upsert(rows, { onConflict: 'tenant_id,module_key' });
apps/api/src/controllers/meta.ts:315:            tenant_id: tenantRow.id,
apps/api/src/controllers/meta.ts:326:        .eq('tenant_id', tenantRow.id);
apps/api/src/controllers/meta.ts:350:            tenant_id: tenantRow.id,
apps/api/src/controllers/meta.ts:367:          .eq('tenant_id', tenantRow.id);
apps/api/src/controllers/meta.ts:377:          .upsert(rows, { onConflict: 'tenant_id,workflow_key,status_key' });
apps/api/src/controllers/meta.ts:395:            tenant_id: tenantRow.id,
apps/api/src/controllers/meta.ts:416:          .eq('tenant_id', tenantRow.id);
apps/api/src/controllers/meta.ts:426:          .upsert(rows, { onConflict: 'tenant_id,entity,field_key' });
apps/api/src/controllers/meta.ts:443:            tenant_id: tenantRow.id,
apps/api/src/controllers/meta.ts:465:          .eq('tenant_id', tenantRow.id);
apps/api/src/controllers/meta.ts:475:          .upsert(rows, { onConflict: 'tenant_id,industry_key,workflow_key,status_key,metric' });
apps/api/src/controllers/auth.controller.ts:89:    tenant_id: tenant.id,
apps/api/src/controllers/auth.controller.ts:90:    tenant_slug: tenant.slug ?? undefined,
apps/api/src/controllers/auth.controller.ts:181:      tenantId: tenant?.tenant_id ?? null,
apps/api/src/controllers/auth.controller.ts:182:      tenantSlug: tenant?.slug ?? tenant?.tenant_slug ?? null,
apps/api/src/controllers/auth.controller.ts:185:    // Map database column `slug` to expected `tenant_slug`
apps/api/src/controllers/auth.controller.ts:186:    const tenantSlug = tenant.slug ?? tenant.tenant_slug;
apps/api/src/controllers/auth.controller.ts:187:    if (!tenant?.tenant_id || !tenantSlug) {
apps/api/src/controllers/auth.controller.ts:191:    console.log('STEP_TENANT_OBTAINED', { tenantId: tenant.tenant_id, tenantSlug });
apps/api/src/controllers/auth.controller.ts:197:      tenant_id: tenant.tenant_id,
apps/api/src/controllers/auth.controller.ts:198:      tenant_slug: tenantSlug,
apps/api/src/controllers/auth.controller.ts:199:    }, tenant.tenant_id);
apps/api/src/controllers/auth.controller.ts:202:      tenantId: tenant.tenant_id,
apps/api/src/controllers/auth.controller.ts:213:      tenantId: tenant.tenant_id,
apps/api/src/controllers/auth.controller.ts:219:        id: tenant.tenant_id,
apps/api/src/controllers/auth.controller.ts:323:  const tenantSlug = tenant.slug ?? tenant.tenant_slug;
apps/api/src/controllers/auth.controller.ts:324:  if (!tenant?.tenant_id || !tenantSlug) {
apps/api/src/controllers/auth.controller.ts:327:  console.log('STEP_GOOGLE_TENANT_OBTAINED', { tenantId: tenant.tenant_id, tenantSlug });
apps/api/src/controllers/auth.controller.ts:330:    { id: tenant.tenant_id, slug: tenantSlug },
apps/api/src/controllers/auth.controller.ts:338:        id: tenant.tenant_id,
apps/api/src/controllers/auth.controller.ts:392:      .select('id, tenant_id, role, sucursal_id, activo, is_active')
apps/api/src/controllers/auth.controller.ts:400:    if (!userRow?.tenant_id) {
apps/api/src/controllers/auth.controller.ts:411:      .eq('id', userRow.tenant_id)
apps/api/src/controllers/auth.controller.ts:428:        .eq('tenant_id', tenantSecurity.id)
apps/api/src/controllers/auth.controller.ts:456:      .eq('tenant_id', tenantSecurity.id);
apps/api/src/controllers/auth.controller.ts:459:      tenant_id: tenantSecurity.id,
apps/api/src/controllers/requests.ts:33:      .eq('tenant_id', tenantId)
apps/api/src/controllers/requests.ts:68:      .eq('tenant_id', tenantId)
apps/api/src/controllers/requests.ts:108:      .eq('tenant_id', tenantId)
apps/api/src/controllers/requests.ts:122:            tenant_id: tenantId,
apps/api/src/controllers/requests.ts:147:          tenant_id: tenantId,
apps/api/src/controllers/requests.ts:178:      .eq('tenant_id', tenantId)
apps/api/src/controllers/suppliers.ts:42:    tenant_id: row.tenant_id,
apps/api/src/controllers/suppliers.ts:86:    .select('id, tenant_id, business_name, rfc, legal_name, contact_name, phone, whatsapp, email, address, city, state, categories, lead_time_days, payment_terms, price_score, speed_score, quality_score, reliability_score, notes, is_active, created_at, updated_at', { count: 'exact' })
apps/api/src/controllers/suppliers.ts:87:    .eq('tenant_id', tenantId);
apps/api/src/controllers/suppliers.ts:162:      .select('id, tenant_id, business_name, rfc, legal_name, contact_name, phone, whatsapp, email, address, city, state, categories, lead_time_days, payment_terms, price_score, speed_score, quality_score, reliability_score, notes, is_active, created_at, updated_at')
apps/api/src/controllers/suppliers.ts:163:      .eq('tenant_id', tenantId)
apps/api/src/controllers/suppliers.ts:197:          tenant_id: tenantId,
apps/api/src/controllers/suppliers.ts:219:      .select('id, tenant_id, business_name, rfc, legal_name, contact_name, phone, whatsapp, email, address, city, state, categories, lead_time_days, payment_terms, price_score, speed_score, quality_score, reliability_score, notes, is_active, created_at, updated_at')
apps/api/src/controllers/suppliers.ts:262:      .eq('tenant_id', tenantId)
apps/api/src/controllers/suppliers.ts:294:      .eq('tenant_id', tenantId)
apps/api/src/controllers/suppliers.ts:296:      .select('id, tenant_id, business_name, rfc, legal_name, contact_name, phone, whatsapp, email, address, city, state, categories, lead_time_days, payment_terms, price_score, speed_score, quality_score, reliability_score, notes, is_active, created_at, updated_at')
apps/api/src/controllers/suppliers.ts:340:      .eq('tenant_id', tenantId)
apps/api/src/controllers/suppliers.ts:355:      .eq('tenant_id', tenantId)
apps/api/src/controllers/suppliers.ts:357:      .select('id, tenant_id, business_name, rfc, legal_name, contact_name, phone, whatsapp, email, address, city, state, categories, lead_time_days, payment_terms, price_score, speed_score, quality_score, reliability_score, notes, is_active, created_at, updated_at')
apps/api/src/controllers/suppliers.ts:400:      .eq('tenant_id', tenantId)
apps/api/src/controllers/suppliers.ts:414:      .select('id, tenant_id, sucursal_id, supplier_id, related_service_order_id, folio, status, reference, payment_terms, expected_date, subtotal, tax_amount, total, notes, created_at, updated_at')
apps/api/src/controllers/suppliers.ts:415:      .eq('tenant_id', tenantId)
apps/api/src/controllers/suppliers.ts:445:      .eq('tenant_id', tenantId)
apps/api/src/controllers/suppliers.ts:460:      .eq('tenant_id', tenantId)
apps/api/src/controllers/reports.ts:17:    let ordersQuery = supabase.from('service_orders').select('id, status, created_at, total_cost, final_cost, sucursal_id, promised_date, folio').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:18:    let customersQuery = supabase.from('customers').select('id').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:19:    let inventoryQuery = supabase.from('sucursal_inventory').select('id, stock_current, product_id, sucursal_id, products:product_id (id, cost)').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:20:    let financeQuery = supabase.from('finances').select('id, balance, income, expense, created_at, sucursal_id').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:21:    let requestsQuery = supabase.from('service_requests').select('id, balance_amount, status, created_at').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:22:    let usersQuery = supabase.from('users').select('id, full_name, role, sucursal_id').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:25:      .select('id, tenant_id, sucursal_id, product_id, service_order_id, movement_type, quantity, created_at, products:product_id (id, sku, name)')
apps/api/src/controllers/reports.ts:26:      .eq('tenant_id', tenantId)
apps/api/src/controllers/purchase-orders.ts:60:    .eq('tenant_id', tenantId)
apps/api/src/controllers/purchase-orders.ts:71:    .eq('tenant_id', tenantId)
apps/api/src/controllers/purchase-orders.ts:82:    .eq('tenant_id', tenantId)
apps/api/src/controllers/purchase-orders.ts:98:    .select('id, tenant_id, sku, name')
apps/api/src/controllers/purchase-orders.ts:99:    .eq('tenant_id', tenantId)
apps/api/src/controllers/purchase-orders.ts:114:      tenant_id: tenantId,
apps/api/src/controllers/purchase-orders.ts:129:    .select('id, tenant_id, sku, name')
apps/api/src/controllers/purchase-orders.ts:141:    supabase.from('purchase_orders').select('*').eq('tenant_id', tenantId).eq('id', orderId).maybeSingle(),
apps/api/src/controllers/purchase-orders.ts:142:    supabase.from('purchase_order_items').select('*').eq('tenant_id', tenantId).eq('purchase_order_id', orderId).order('created_at', { ascending: true }),
apps/api/src/controllers/purchase-orders.ts:143:    supabase.from('inventory_movements').select('id, tenant_id, sucursal_id, product_id, purchase_order_id, movement_type, quantity, unit_cost, reference, notes, created_by, created_at').eq('tenant_id', tenantId).eq('purchase_order_id', orderId).order('created_at', { ascending: true }),
apps/api/src/controllers/purchase-orders.ts:161:      .select('id, tenant_id, sucursal_id, supplier_id, related_service_order_id, folio, status, reference, payment_terms, expected_date, subtotal, tax_amount, total, notes, created_at, updated_at')
apps/api/src/controllers/purchase-orders.ts:162:      .eq('tenant_id', tenantId)
apps/api/src/controllers/purchase-orders.ts:232:        tenant_id: tenantId,
apps/api/src/controllers/purchase-orders.ts:255:      tenant_id: tenantId,
apps/api/src/controllers/purchase-orders.ts:296:    const { data: existing, error: existingError } = await supabase.from('purchase_orders').select('id').eq('tenant_id', tenantId).eq('id', orderId).maybeSingle();
apps/api/src/controllers/purchase-orders.ts:322:      .eq('tenant_id', tenantId)
apps/api/src/controllers/purchase-orders.ts:346:    const { data: existing, error: existingError } = await supabase.from('purchase_orders').select('id').eq('tenant_id', tenantId).eq('id', orderId).maybeSingle();
apps/api/src/controllers/purchase-orders.ts:354:      .eq('tenant_id', tenantId)
apps/api/src/controllers/purchase-orders.ts:377:    const { data: existing, error: existingError } = await supabase.from('purchase_orders').select('id').eq('tenant_id', tenantId).eq('id', orderId).maybeSingle();
apps/api/src/controllers/purchase-orders.ts:384:      .eq('tenant_id', tenantId)
apps/api/src/controllers/purchase-orders.ts:404:    const { data: order, error: orderError } = await supabase.from('purchase_orders').select('*').eq('tenant_id', tenantId).eq('id', orderId).single();
apps/api/src/controllers/purchase-orders.ts:414:      .eq('tenant_id', tenantId)
apps/api/src/controllers/purchase-orders.ts:445:        .select('id, tenant_id, sucursal_id, product_id, stock_current')
apps/api/src/controllers/purchase-orders.ts:446:        .eq('tenant_id', tenantId)
apps/api/src/controllers/purchase-orders.ts:457:            tenant_id: tenantId,
apps/api/src/controllers/purchase-orders.ts:462:          .select('id, tenant_id, sucursal_id, product_id, stock_current')
apps/api/src/controllers/purchase-orders.ts:475:        .eq('tenant_id', tenantId)
apps/api/src/controllers/purchase-orders.ts:482:        tenant_id: tenantId,
apps/api/src/controllers/purchase-orders.ts:500:        .eq('tenant_id', tenantId)
apps/api/src/controllers/purchase-orders.ts:515:      .eq('tenant_id', tenantId)
apps/api/src/controllers/pwa.ts:34:        tenant_id: tenantId,
apps/api/src/controllers/pwa.ts:42:      }, { onConflict: 'tenant_id,endpoint' })
apps/api/src/controllers/pwa.ts:43:      .select('id, tenant_id, user_id, endpoint, active, created_at, updated_at')
apps/api/src/controllers/pwa.ts:70:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:87:  tenant_id: string;
apps/api/src/controllers/orders.ts:102:  tenant_id: string;
apps/api/src/controllers/orders.ts:292:  tenant_id: string;
apps/api/src/controllers/orders.ts:311:  tenant_id: string;
apps/api/src/controllers/orders.ts:515:          tenant_id: tenantId,
apps/api/src/controllers/orders.ts:558:        tenant_id: tenantId,
apps/api/src/controllers/orders.ts:591:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:596:      tenant_id: tenantId,
apps/api/src/controllers/orders.ts:661:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:710:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:720:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:725:        .select('id, tenant_id, service_order_id, bucket_name, storage_path, public_url, file_name, file_type, mime_type, file_size, source, created_at')
apps/api/src/controllers/orders.ts:726:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:731:        .select('id, tenant_id, service_order_id, event_type, previous_status, new_status, note, actor_name, created_at')
apps/api/src/controllers/orders.ts:732:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:810:      .select('id, tenant_id, evidence_metadata')
apps/api/src/controllers/orders.ts:811:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:814:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts:851:        tenant_id: tenantId,
apps/api/src/controllers/orders.ts:869:        tenant_id: tenantId,
apps/api/src/controllers/orders.ts:884:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:901:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:917:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:944:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:970:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:982:        tenant_id: tenantId,
apps/api/src/controllers/orders.ts:998:        tenant_id: tenantId,
apps/api/src/controllers/orders.ts:1042:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1045:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts:1068:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1078:      tenant_id: tenantId,
apps/api/src/controllers/orders.ts:1126:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1129:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts:1154:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1178:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1183:      tenant_id: tenantId,
apps/api/src/controllers/orders.ts:1230:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1233:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts:1252:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1280:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1289:        tenant_id: tenantId,
apps/api/src/controllers/orders.ts:1325:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1328:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts:1358:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1386:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1425:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1440:        tenant_id: tenantId,
apps/api/src/controllers/orders.ts:1482:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1500:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1512:      tenant_id: tenantId,
apps/api/src/controllers/orders.ts:1535:      .eq('tenant_id', tenantId)
apps/api/src/controllers/security.ts:38:    .eq('tenant_id', tenantId);
apps/api/src/controllers/security.ts:51:    .eq('tenant_id', tenantId)
apps/api/src/controllers/security.ts:71:      supabaseAdmin.from('users').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId),
apps/api/src/controllers/security.ts:72:      supabaseAdmin.from('sucursales').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId),
apps/api/src/controllers/security.ts:145:        tenant_id: tenantId,
apps/api/src/controllers/security.ts:146:        tenant_slug: tenantRow.slug,
apps/api/src/controllers/security.ts:159:        tenant_id: tenantId,
apps/api/src/controllers/security.ts:167:      .select('id, tenant_id, auth_user_id, full_name, email, role, is_active, sucursal_id, created_at')
apps/api/src/controllers/security.ts:221:      .select('id, tenant_id, user_id, action, ip_address, user_agent, data_before, data_after, created_at', { count: 'exact' })
apps/api/src/controllers/security.ts:222:      .eq('tenant_id', tenantId)
apps/api/src/controllers/security.ts:276:      .select('id, tenant_id, user_id, session_key, ip_address, user_agent, last_activity_at, revoked_at, created_at, updated_at, users(id, name, full_name, email, role)')
apps/api/src/controllers/security.ts:277:      .eq('tenant_id', tenantId)
apps/api/src/controllers/security.ts:320:      .eq('tenant_id', tenantId)
apps/api/src/controllers/security.ts:322:      .select('id, tenant_id, user_id, revoked_at')
apps/api/src/controllers/security.ts:388:      .eq('tenant_id', tenantId)
apps/api/src/controllers/security.ts:419:      .eq('tenant_id', tenantId)
apps/api/src/controllers/security.ts:437:      .eq('tenant_id', tenantId);
apps/api/src/controllers/security.ts:473:      .eq('tenant_id', tenantId)
apps/api/src/controllers/security.ts:496:      .eq('tenant_id', tenantId);
apps/api/src/controllers/catalogs.ts:39:    .select('id, tenant_id, sku, name')
apps/api/src/controllers/catalogs.ts:40:    .eq('tenant_id', tenantId)
apps/api/src/controllers/catalogs.ts:55:      tenant_id: tenantId,
apps/api/src/controllers/catalogs.ts:70:    .select('id, tenant_id, sku, name')
apps/api/src/controllers/catalogs.ts:89:    .select('id, tenant_id, sucursal_id, product_id, stock_current')
apps/api/src/controllers/catalogs.ts:90:    .eq('tenant_id', tenantId)
apps/api/src/controllers/catalogs.ts:103:      .eq('tenant_id', tenantId)
apps/api/src/controllers/catalogs.ts:105:      .select('id, tenant_id, sucursal_id, product_id, stock_current')
apps/api/src/controllers/catalogs.ts:118:      tenant_id: tenantId,
apps/api/src/controllers/catalogs.ts:123:    .select('id, tenant_id, sucursal_id, product_id, stock_current')
apps/api/src/controllers/catalogs.ts:145:    .eq('tenant_id', tenantId)
apps/api/src/controllers/catalogs.ts:164:      .select('id, tenant_id, sucursal_id, name, phone, email, created_at')
apps/api/src/controllers/catalogs.ts:165:      .eq('tenant_id', tenantId)
apps/api/src/controllers/catalogs.ts:191:      tenant_id: tenantId,
apps/api/src/controllers/catalogs.ts:196:    }]).select('id, tenant_id, sucursal_id, name, phone, email, created_at').single();
apps/api/src/controllers/catalogs.ts:220:      .select('id, tenant_id, sucursal_id, product_id, stock_current, created_at, updated_at, products:product_id (id, sku, name, minimum_stock)')
apps/api/src/controllers/catalogs.ts:221:      .eq('tenant_id', tenantId)
apps/api/src/controllers/catalogs.ts:235:      ? await supabase.from('products').select('id, sku, name, tenant_id').eq('tenant_id', tenantId).in('id', productIds)
apps/api/src/controllers/catalogs.ts:314:    .select('id, tenant_id, sucursal_id, product_id, stock_current, created_at, products:product_id (id, sku, name, minimum_stock)')
apps/api/src/controllers/catalogs.ts:315:      .eq('tenant_id', tenantId)
apps/api/src/controllers/catalogs.ts:349:      .select('id, tenant_id, sku, name')
apps/api/src/controllers/catalogs.ts:350:      .eq('tenant_id', tenantId)
apps/api/src/controllers/catalogs.ts:364:      .eq('tenant_id', tenantId)
apps/api/src/controllers/catalogs.ts:366:      .select('id, tenant_id, sucursal_id, product_id, stock_current, created_at, products:product_id (id, sku, name, minimum_stock)')
apps/api/src/controllers/catalogs.ts:377:        tenant_id: tenantId,
apps/api/src/controllers/catalogs.ts:413:      .select('id, tenant_id, product_id, stock_current, sucursal_id')
apps/api/src/controllers/catalogs.ts:414:      .eq('tenant_id', tenantId)
apps/api/src/controllers/catalogs.ts:436:      .select('id, tenant_id, sku, name')
apps/api/src/controllers/catalogs.ts:437:      .eq('tenant_id', tenantId)
apps/api/src/controllers/catalogs.ts:447:      .select('id, tenant_id, sucursal_id, product_id, service_order_id, purchase_order_id, movement_type, quantity, unit_cost, reference, notes, created_by, created_at')
apps/api/src/controllers/catalogs.ts:448:      .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts:50:    .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts:79:    tenantId: String(row.tenant_id ?? ''),
apps/api/src/controllers/users.ts:127:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at', { count: 'exact' })
apps/api/src/controllers/users.ts:128:      .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts:202:        tenant_id: tenantId,
apps/api/src/controllers/users.ts:203:        tenant_slug: tenantRow.slug,
apps/api/src/controllers/users.ts:217:      .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts:239:        .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
apps/api/src/controllers/users.ts:265:        tenant_id: tenantId,
apps/api/src/controllers/users.ts:276:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
apps/api/src/controllers/users.ts:335:      .select('id, tenant_id, auth_user_id, role, activo, is_active')
apps/api/src/controllers/users.ts:337:      .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts:354:      .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts:355:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
apps/api/src/controllers/users.ts:405:      .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts:406:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
apps/api/src/controllers/users.ts:450:      .select('id, tenant_id, auth_user_id, name, full_name, email, role, activo')
apps/api/src/controllers/users.ts:452:      .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts:465:      .select('id, tenant_id, sucursal_id, supplier_id, related_service_order_id, folio, status, reference, payment_terms, expected_date, subtotal, tax_amount, total, notes, created_at, updated_at')
apps/api/src/controllers/users.ts:466:      .eq('tenant_id', tenantId)
apps/api/src/controllers/finance.ts:25:    .eq('tenant_id', tenantId)
apps/api/src/controllers/finance.ts:41:      .select('id, tenant_id, sucursal_id, total_cost, final_cost, created_at, status')
apps/api/src/controllers/finance.ts:42:      .eq('tenant_id', tenantId)
apps/api/src/controllers/finance.ts:46:      .select('id, tenant_id, sucursal_id, balance, income, expense, created_at')
apps/api/src/controllers/finance.ts:47:      .eq('tenant_id', tenantId)
apps/api/src/controllers/finance.ts:88:        tenant_id: tenantId,
apps/api/src/controllers/finance.ts:97:        tenant_id: tenantId,
apps/api/src/controllers/finance.ts:106:        tenant_id: tenantId,
apps/api/src/controllers/finance.ts:140:    const grouped = new Map<string, { id: string; tenant_id: string; sucursal_id: string; balance: number; income: number; expense: number; created_at: string }>();
apps/api/src/controllers/finance.ts:144:      const current = grouped.get(day) ?? { id: `${sucursalId}-${day}`, tenant_id: tenantId, sucursal_id: sucursalId, balance: 0, income: 0, expense: 0, created_at: day };
apps/api/src/controllers/finance.ts:153:      const current = grouped.get(day) ?? { id: `${sucursalId}-${day}`, tenant_id: tenantId, sucursal_id: sucursalId, balance: 0, income: 0, expense: 0, created_at: day };
apps/api/src/controllers/finance.ts:190:          tenant_id: tenantId,
apps/api/src/controllers/finance.ts:225:      .eq('tenant_id', tenantId)
apps/api/src/controllers/finance.ts:260:      .eq('tenant_id', tenantId)
apps/api/src/controllers/finance.ts:276:      .eq('tenant_id', tenantId)
apps/api/src/controllers/tasks.ts:81:    .eq('tenant_id', tenantId)
apps/api/src/controllers/tasks.ts:89:  tenant_id: string;
apps/api/src/controllers/tasks.ts:97:    tenant_id: row.tenant_id,
apps/api/src/controllers/tasks.ts:115:    let query = supabase.from('tasks').select('*').eq('tenant_id', tenantId).order('created_at', { ascending: false }).limit(100);
apps/api/src/controllers/tasks.ts:136:      supabase.from('tasks').select('*').eq('tenant_id', tenantId).eq('id', taskId).maybeSingle(),
apps/api/src/controllers/tasks.ts:137:      supabase.from('task_history').select('*').eq('tenant_id', tenantId).eq('task_id', taskId).order('created_at', { ascending: false }),
apps/api/src/controllers/tasks.ts:170:      tenant_id: tenantId,
apps/api/src/controllers/tasks.ts:189:      tenant_id: tenantId,
apps/api/src/controllers/tasks.ts:237:    const { data, error } = await supabase.from('tasks').update(payload).eq('tenant_id', tenantId).eq('id', taskId).select('*').single();
apps/api/src/controllers/tasks.ts:241:    await insertTaskHistory(supabase, { tenant_id: tenantId, task_id: taskId, event_type: 'updated', comment: body.description || body.title || null, changed_by: null });
apps/api/src/controllers/tasks.ts:268:    const { data: current, error: currentError } = await supabase.from('tasks').select('status').eq('tenant_id', tenantId).eq('id', taskId).single();
apps/api/src/controllers/tasks.ts:273:    const { data, error } = await supabase.from('tasks').update({ status: body.status, updated_by: null }).eq('tenant_id', tenantId).eq('id', taskId).select('*').single();
apps/api/src/controllers/tasks.ts:279:      tenant_id: tenantId,
apps/api/src/controllers/tasks.ts:305:    const { error } = await supabase.from('tasks').delete().eq('tenant_id', tenantId).eq('id', taskId);
apps/api/src/controllers/tasks.ts:309:    await insertTaskHistory(supabase, { tenant_id: tenantId, task_id: taskId, event_type: 'deleted', comment: null, changed_by: null }).catch(() => null);
apps/api/src/controllers/tasks.ts:326:      .eq('tenant_id', tenantId)
apps/api/src/controllers/procurement.ts:15:      .select('id, tenant_id, product_id, stock_current, sucursal_id, created_at')
apps/api/src/controllers/procurement.ts:16:      .eq('tenant_id', tenantId)
apps/api/src/controllers/procurement.ts:27:      ? await supabase.from('products').select('id, sku, name').eq('tenant_id', tenantId).in('id', productIds)
apps/api/src/controllers/public.ts:246:          tenant_id: tenant.id,
apps/api/src/controllers/public.ts:297:      .select('id, tenant_id, folio, status, total_cost, created_at, device_info, problem_description, serial_number, receipt_url, estimated_cost, final_cost, metadata')
apps/api/src/controllers/public.ts:298:      .eq('tenant_id', tenant.id)
apps/api/src/controllers/public.ts:351:      .select('id, tenant_id, folio, status, total_cost, created_at, updated_at, promised_date, device_info, problem_description, serial_number, receipt_url, estimated_cost, final_cost, evidence_metadata, metadata')
apps/api/src/controllers/public.ts:352:      .eq('tenant_id', tenant.id)
apps/api/src/controllers/public.ts:363:      .eq('tenant_id', tenant.id)
apps/api/src/controllers/public.ts:374:      .eq('tenant_id', tenant.id)
apps/api/src/controllers/sucursales.ts:28:    .select('id, tenant_id')
apps/api/src/controllers/sucursales.ts:29:    .eq('tenant_id', tenantId)
apps/api/src/controllers/sucursales.ts:44:    .eq('tenant_id', tenantId);
apps/api/src/controllers/sucursales.ts:64:      .select('id, tenant_id, name, code, address, city, state, phone, is_active, created_at, updated_at')
apps/api/src/controllers/sucursales.ts:65:      .eq('tenant_id', tenantId)
apps/api/src/controllers/sucursales.ts:110:      tenant_id: tenantId,
apps/api/src/controllers/sucursales.ts:123:      .select('id, tenant_id, name, code, address, city, state, phone, is_active, created_at, updated_at')
apps/api/src/controllers/sucursales.ts:176:      .eq('tenant_id', tenantId)
apps/api/src/controllers/sucursales.ts:178:      .select('id, tenant_id, name, code, address, city, state, phone, is_active, created_at, updated_at')
apps/api/src/controllers/sucursales.ts:220:      .eq('tenant_id', tenantId)
apps/api/src/controllers/sucursales.ts:260:      .select('id, tenant_id')
apps/api/src/controllers/sucursales.ts:261:      .eq('tenant_id', tenantId)
apps/api/src/controllers/sucursales.ts:276:      .eq('tenant_id', tenantId)
apps/api/src/controllers/sucursales.ts:278:      .select('id, tenant_id, sucursal_id, full_name, email, role, is_active')
apps/api/src/routes/inventory.ts:3:import { validateTenant } from '../middleware/validateTenant';
apps/api/src/routes/inventory.ts:4:import { attachScope } from '../middleware/scope';
apps/api/src/routes/inventory.ts:13:router.use(validateTenant);
apps/api/src/routes/inventory.ts:14:router.use(attachScope);
apps/api/src/routes/customers.ts:3:import { validateTenant } from '../middleware/validateTenant';
apps/api/src/routes/customers.ts:4:import { attachScope } from '../middleware/scope';
apps/api/src/routes/customers.ts:13:router.use(validateTenant);
apps/api/src/routes/customers.ts:14:router.use(attachScope);
apps/api/src/routes/requests.ts:3:import { validateTenant } from '../middleware/validateTenant';
apps/api/src/routes/requests.ts:4:import { attachScope } from '../middleware/scope';
apps/api/src/routes/requests.ts:13:router.use(validateTenant);
apps/api/src/routes/requests.ts:14:router.use(attachScope);
apps/api/src/routes/suppliers.ts:3:import { validateTenant } from '../middleware/validateTenant';
apps/api/src/routes/suppliers.ts:4:import { attachScope } from '../middleware/scope';
apps/api/src/routes/suppliers.ts:21:router.use(validateTenant);
apps/api/src/routes/suppliers.ts:22:router.use(attachScope);
apps/api/src/routes/reports.ts:3:import { validateTenant } from '../middleware/validateTenant';
apps/api/src/routes/reports.ts:4:import { attachScope } from '../middleware/scope';
apps/api/src/routes/reports.ts:13:router.use(validateTenant);
apps/api/src/routes/reports.ts:14:router.use(attachScope);
apps/api/src/routes/purchase-orders.ts:3:import { validateTenant } from '../middleware/validateTenant';
apps/api/src/routes/purchase-orders.ts:4:import { attachScope } from '../middleware/scope';
apps/api/src/routes/purchase-orders.ts:21:router.use(validateTenant);
apps/api/src/routes/purchase-orders.ts:22:router.use(attachScope);
apps/api/src/routes/pwa.ts:3:import { validateTenant } from '../middleware/validateTenant';
apps/api/src/routes/pwa.ts:4:import { attachScope } from '../middleware/scope';
apps/api/src/routes/pwa.ts:12:router.use(validateTenant);
apps/api/src/routes/pwa.ts:13:router.use(attachScope);
apps/api/src/routes/orders.ts:3:import { validateTenant } from '../middleware/validateTenant';
apps/api/src/routes/orders.ts:4:import { attachScope } from '../middleware/scope';
apps/api/src/routes/orders.ts:13:router.use(validateTenant);
apps/api/src/routes/orders.ts:14:router.use(attachScope);
apps/api/src/routes/security.ts:3:import { validateTenant } from '../middleware/validateTenant';
apps/api/src/routes/security.ts:4:import { attachScope } from '../middleware/scope';
apps/api/src/routes/security.ts:14:router.use(validateTenant);
apps/api/src/routes/security.ts:15:router.use(attachScope);
apps/api/src/routes/users.ts:3:import { attachScope } from '../middleware/scope';
apps/api/src/routes/users.ts:12:router.use(attachScope);
apps/api/src/routes/billing.ts:4:import { validateTenant } from '../middleware/validateTenant';
apps/api/src/routes/billing.ts:5:import { attachScope } from '../middleware/scope';
apps/api/src/routes/billing.ts:14:router.post('/checkout/protected', requireAuth, validateTenant, attachScope, requireRole('owner', 'manager'), createCheckout);
apps/api/src/routes/finance.ts:3:import { validateTenant } from '../middleware/validateTenant';
apps/api/src/routes/finance.ts:4:import { attachScope } from '../middleware/scope';
apps/api/src/routes/finance.ts:14:router.use(validateTenant);
apps/api/src/routes/finance.ts:15:router.use(attachScope);
apps/api/src/routes/tasks.ts:3:import { validateTenant } from '../middleware/validateTenant';
apps/api/src/routes/tasks.ts:4:import { attachScope } from '../middleware/scope';
apps/api/src/routes/tasks.ts:12:router.use(validateTenant);
apps/api/src/routes/tasks.ts:13:router.use(attachScope);
apps/api/src/routes/procurement.ts:3:import { validateTenant } from '../middleware/validateTenant';
apps/api/src/routes/procurement.ts:4:import { attachScope } from '../middleware/scope';
apps/api/src/routes/procurement.ts:12:router.use(validateTenant);
apps/api/src/routes/procurement.ts:13:router.use(attachScope);
apps/api/src/routes/stock-alerts.ts:3:import { validateTenant } from '../middleware/validateTenant';
apps/api/src/routes/stock-alerts.ts:11:router.use(validateTenant);
apps/api/src/routes/auth.ts:4:import { validateTenant } from '../middleware/validateTenant';
apps/api/src/routes/auth.ts:15:router.get('/tenant/:tenantSlug/settings', requireAuth, validateTenant, getTenantSettings);
apps/api/src/routes/auth.ts:16:router.put('/tenant/:tenantSlug/settings', requireAuth, validateTenant, updateTenantSettings);
apps/api/src/routes/sucursales.ts:3:import { validateTenant } from '../middleware/validateTenant';
apps/api/src/routes/sucursales.ts:12:router.use(validateTenant);
apps/api/src/services/security-backoffice.ts:111:    tenant_id: input.tenantId,
apps/api/src/services/tenant-capabilities.ts:92:  const masterTenantSlug = normalizeKey(process.env.MASTER_TENANT_SLUG);
apps/api/src/services/pwa-push.ts:37:    .eq('tenant_id', tenantId)
apps/api/src/services/pwa-push.ts:69:    tenant_id: tenantId,
apps/api/src/services/tenant-config.ts:527:    tenant_id: '',
apps/api/src/services/tenant-config.ts:553:        tenant_id: '',
apps/api/src/services/tenant-config.ts:602:      .select('tenant_id, industry_key, industry_label, asset_label, order_label, request_label, customer_label, portal_label, quote_label, default_workflow_key, is_active, metadata')
apps/api/src/services/tenant-config.ts:603:      .eq('tenant_id', tenantId)
apps/api/src/services/tenant-config.ts:607:      .select('id, tenant_id, module_key, module_label, enabled, sort_order, metadata')
apps/api/src/services/tenant-config.ts:608:      .eq('tenant_id', tenantId)
apps/api/src/services/tenant-config.ts:613:      .select('id, tenant_id, label_key, label_value, context')
apps/api/src/services/tenant-config.ts:614:      .eq('tenant_id', tenantId)
apps/api/src/services/tenant-config.ts:618:      .select('id, tenant_id, workflow_key, status_key, label, tone, sort_order, is_default, is_terminal, metadata')
apps/api/src/services/tenant-config.ts:619:      .eq('tenant_id', tenantId)
apps/api/src/services/tenant-config.ts:625:      .select('id, tenant_id, entity, field_key, field_label, field_type, required, options, field_order, placeholder, help_text, visible, validation, metadata')
apps/api/src/services/tenant-config.ts:626:      .eq('tenant_id', tenantId)
apps/api/src/services/tenant-config.ts:632:      .select('id, tenant_id, industry_key, workflow_key, status_key, metric, green_until_minutes, yellow_until_minutes, red_after_minutes, priority, reason_template, suggested_action_template, action_key, enabled, metadata, created_at')
apps/api/src/services/tenant-config.ts:633:      .eq('tenant_id', tenantId)
apps/api/src/services/tenant-config.ts:680:          tenant_id: '',
apps/api/src/services/tenant-config.ts:687:        tenant_id: '',
apps/api/src/services/tenant-config.ts:694:        tenant_id: '',
apps/api/src/services/billing.ts:111:    tenant_id: tenantId,
apps/api/src/services/billing.ts:150:    .select('id, tenant_id, role, email')
apps/api/src/services/billing.ts:158:  if (!userRow?.tenant_id) {
apps/api/src/services/billing.ts:165:    .eq('id', userRow.tenant_id)
apps/api/src/services/stock-alerts.ts:5:  tenant_id: string;
apps/api/src/services/stock-alerts.ts:33:    .eq('tenant_id', params.tenantId)
apps/api/src/services/stock-alerts.ts:49:        .eq('tenant_id', params.tenantId)
apps/api/src/services/stock-alerts.ts:58:    tenant_id: params.tenantId,
apps/api/src/services/stock-alerts.ts:70:      .eq('tenant_id', params.tenantId)
apps/api/src/services/stock-alerts.ts:88:    .select('id, tenant_id, sucursal_id, product_id, severity, acknowledged_by, acknowledged_at, created_at')
apps/api/src/services/stock-alerts.ts:89:    .eq('tenant_id', tenantId);
apps/api/src/services/stock-alerts.ts:109:    .eq('tenant_id', params.tenantId)
supabase/migrations/20260530143000_add_public_token_to_service_orders.sql:15:  on public.service_orders (tenant_id, public_token);
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:3:create or replace function public._live_tenant_id()
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:8:  select nullif(auth.jwt() ->> 'tenant_id', '')::uuid
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:16:  select coalesce(auth.jwt() ->> 'role', '')
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:19:alter table if exists public.products enable row level security;
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:20:alter table if exists public.purchase_orders enable row level security;
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:21:alter table if exists public.purchase_order_items enable row level security;
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:22:alter table if exists public.inventory_movements enable row level security;
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:23:alter table if exists public.stock_alerts enable row level security;
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:25:alter table if exists public.products force row level security;
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:26:alter table if exists public.purchase_orders force row level security;
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:27:alter table if exists public.purchase_order_items force row level security;
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:28:alter table if exists public.inventory_movements force row level security;
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:29:alter table if exists public.stock_alerts force row level security;
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:32:create policy products_select
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:36:using (public._live_tenant_id() = tenant_id);
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:39:create policy products_write_owner_manager
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:43:using (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'))
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:44:with check (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'));
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:47:create policy purchase_orders_select
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:51:using (public._live_tenant_id() = tenant_id);
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:54:create policy purchase_orders_write_owner_manager
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:58:using (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'))
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:59:with check (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'));
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:62:create policy purchase_order_items_select
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:66:using (public._live_tenant_id() = tenant_id);
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:69:create policy purchase_order_items_write_owner_manager
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:73:using (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'))
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:74:with check (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'));
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:77:create policy inventory_movements_select
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:81:using (public._live_tenant_id() = tenant_id);
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:84:create policy inventory_movements_write_owner_manager
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:88:using (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'))
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:89:with check (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'));
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:92:create policy stock_alerts_select
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:96:using (public._live_tenant_id() = tenant_id);
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:99:create policy stock_alerts_write_owner_manager
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:103:using (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'))
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:104:with check (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'));
supabase/migrations/20260530121000_add_assigned_user_to_service_orders.sql:7:  on public.service_orders (tenant_id, assigned_user_id, created_at desc);
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:30:  on public.service_orders (tenant_id, sucursal_id);
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:56:  on public.purchase_orders (tenant_id, sucursal_id);
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:82:  on public.inventory_movements (tenant_id, sucursal_id, created_at desc);
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:108:  on public.stock_alerts (tenant_id, sucursal_id);
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:2:  tenant_id uuid primary key references public.tenants(id) on delete cascade,
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:21:alter table public.tenant_industry_profiles enable row level security;
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:24:create policy tenant_industry_profiles_select
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:27:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:30:create policy tenant_industry_profiles_write
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:33:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id)
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:34:with check ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:38:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:46:  constraint tenant_enabled_modules_unique unique (tenant_id, module_key)
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:49:create index if not exists tenant_enabled_modules_tenant_idx
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:50:  on public.tenant_enabled_modules (tenant_id, sort_order, module_key);
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:52:alter table public.tenant_enabled_modules enable row level security;
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:55:create policy tenant_enabled_modules_select
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:58:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:61:create policy tenant_enabled_modules_write
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:64:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id)
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:65:with check ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:69:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:75:  constraint tenant_label_overrides_unique unique (tenant_id, label_key)
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:78:create index if not exists tenant_label_overrides_tenant_idx
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:79:  on public.tenant_label_overrides (tenant_id, label_key);
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:81:alter table public.tenant_label_overrides enable row level security;
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:84:create policy tenant_label_overrides_select
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:87:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:90:create policy tenant_label_overrides_write
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:93:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id)
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:94:with check ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:98:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:109:  constraint tenant_workflow_statuses_unique unique (tenant_id, workflow_key, status_key)
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:112:create index if not exists tenant_workflow_statuses_tenant_idx
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:113:  on public.tenant_workflow_statuses (tenant_id, workflow_key, sort_order, status_key);
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:115:alter table public.tenant_workflow_statuses enable row level security;
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:118:create policy tenant_workflow_statuses_select
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:121:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:124:create policy tenant_workflow_statuses_write
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:127:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id)
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:128:with check ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260515110000_restore_users_compat.sql:3:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260515110000_restore_users_compat.sql:16:  on public.users (tenant_id, lower(email));
supabase/migrations/20260515110000_restore_users_compat.sql:18:  on public.users (tenant_id, auth_user_id)
supabase/migrations/20260515110000_restore_users_compat.sql:20:alter table public.users enable row level security;
supabase/migrations/20260530120000_expand_users_admin_module.sql:20:  on public.users (tenant_id, role, activo);
supabase/migrations/20260530120000_expand_users_admin_module.sql:23:  on public.users (tenant_id, ultimo_acceso desc nulls last);
supabase/migrations/20260527070000_tenant_semaphore_rules.sql:3:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260527070000_tenant_semaphore_rules.sql:19:  constraint tenant_semaphore_rules_unique unique (tenant_id, industry_key, workflow_key, status_key, metric)
supabase/migrations/20260527070000_tenant_semaphore_rules.sql:22:create index if not exists tenant_semaphore_rules_tenant_idx
supabase/migrations/20260527070000_tenant_semaphore_rules.sql:23:  on public.tenant_semaphore_rules (tenant_id, industry_key, workflow_key, priority, status_key, metric);
supabase/migrations/20260527070000_tenant_semaphore_rules.sql:25:alter table public.tenant_semaphore_rules enable row level security;
supabase/migrations/20260527070000_tenant_semaphore_rules.sql:28:create policy tenant_semaphore_rules_select
supabase/migrations/20260527070000_tenant_semaphore_rules.sql:31:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260527070000_tenant_semaphore_rules.sql:34:create policy tenant_semaphore_rules_write
supabase/migrations/20260527070000_tenant_semaphore_rules.sql:37:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id)
supabase/migrations/20260527070000_tenant_semaphore_rules.sql:38:with check ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:13:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:24:  on public.audit_logs (tenant_id, created_at desc);
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:27:  on public.audit_logs (tenant_id, action);
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:30:  on public.audit_logs (tenant_id, user_id, created_at desc);
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:34:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:46:  on public.security_sessions (tenant_id, revoked_at, last_activity_at desc);
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:49:  on public.security_sessions (tenant_id, user_id, last_activity_at desc);
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:51:alter table if exists public.audit_logs enable row level security;
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:52:alter table if exists public.security_sessions enable row level security;
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:53:alter table if exists public.audit_logs force row level security;
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:54:alter table if exists public.security_sessions force row level security;
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:57:create policy audit_logs_select_owner
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:61:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id and coalesce(auth.jwt() ->> 'role', '') = 'owner');
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:64:create policy security_sessions_select_owner_manager
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:69:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:70:  and coalesce(auth.jwt() ->> 'role', '') in ('owner', 'manager')
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:12:  select nullif(auth.jwt() ->> 'tenant_id', '')::uuid
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:20:  select coalesce(auth.jwt() ->> 'role', '')
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:25:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:38:  on public.sucursales (tenant_id, code)
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:41:create index if not exists sucursales_tenant_idx
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:42:  on public.sucursales (tenant_id);
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:49:alter table public.sucursales enable row level security;
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:50:alter table public.sucursales force row level security;
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:53:create policy sucursales_select
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:57:using (public._sucursal_tenant_jwt_id() = tenant_id);
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:60:create policy sucursales_write_owner_manager
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:64:using (public._sucursal_tenant_jwt_id() = tenant_id and public._sucursal_jwt_role() in ('owner', 'manager'))
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:65:with check (public._sucursal_tenant_jwt_id() = tenant_id and public._sucursal_jwt_role() in ('owner', 'manager'));
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:73:  tenant_id,
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:86:  b.tenant_id,
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:98:set tenant_id = excluded.tenant_id,
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:113:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:121:create index if not exists sucursal_inventory_tenant_idx
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:122:  on public.sucursal_inventory (tenant_id);
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:125:  on public.sucursal_inventory (tenant_id, sucursal_id);
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:128:  on public.sucursal_inventory (tenant_id, product_id);
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:131:  on public.sucursal_inventory (tenant_id, sucursal_id, product_id);
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:138:alter table public.sucursal_inventory enable row level security;
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:139:alter table public.sucursal_inventory force row level security;
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:142:create policy sucursal_inventory_select
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:146:using (public._sucursal_tenant_jwt_id() = tenant_id);
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:149:create policy sucursal_inventory_write_owner_manager
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:153:using (public._sucursal_tenant_jwt_id() = tenant_id and public._sucursal_jwt_role() in ('owner', 'manager'))
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:154:with check (public._sucursal_tenant_jwt_id() = tenant_id and public._sucursal_jwt_role() in ('owner', 'manager'));
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:162:  tenant_id,
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:171:  i.tenant_id,
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:179:  on p.tenant_id = i.tenant_id
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:181:on conflict (tenant_id, sucursal_id, product_id) do update
supabase/migrations/20260527010000_align_service_requests_tenant_fk.sql:4:  drop constraint if exists service_requests_tenant_id_fkey;
supabase/migrations/20260527010000_align_service_requests_tenant_fk.sql:7:  add constraint service_requests_tenant_id_fkey
supabase/migrations/20260527010000_align_service_requests_tenant_fk.sql:8:  foreign key (tenant_id)
supabase/migrations/20260527010000_align_service_requests_tenant_fk.sql:13:  alter column tenant_id set not null;
supabase/migrations/20260527010000_align_service_requests_tenant_fk.sql:15:alter table public.service_requests enable row level security;
supabase/migrations/20260527010000_align_service_requests_tenant_fk.sql:18:create policy service_requests_select
supabase/migrations/20260527010000_align_service_requests_tenant_fk.sql:22:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260527010000_align_service_requests_tenant_fk.sql:25:create policy service_requests_insert_tenant
supabase/migrations/20260527010000_align_service_requests_tenant_fk.sql:29:with check ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260527010000_align_service_requests_tenant_fk.sql:32:create policy service_requests_update_tenant
supabase/migrations/20260527010000_align_service_requests_tenant_fk.sql:36:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id)
supabase/migrations/20260527010000_align_service_requests_tenant_fk.sql:37:with check ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260527010000_align_service_requests_tenant_fk.sql:40:create policy service_requests_delete_tenant
supabase/migrations/20260527010000_align_service_requests_tenant_fk.sql:44:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260523204000_restore_branches_table.sql:4:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260523204000_restore_branches_table.sql:16:  on public.branches (tenant_id, code)
supabase/migrations/20260523204000_restore_branches_table.sql:18:create index if not exists branches_tenant_idx
supabase/migrations/20260523204000_restore_branches_table.sql:19:  on public.branches (tenant_id);
supabase/migrations/20260523204000_restore_branches_table.sql:24:alter table public.branches enable row level security;
supabase/migrations/20260523204000_restore_branches_table.sql:26:create policy branches_select
supabase/migrations/20260523204000_restore_branches_table.sql:30:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260523204000_restore_branches_table.sql:33:create policy branches_write_owner_manager
supabase/migrations/20260523204000_restore_branches_table.sql:37:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260523204000_restore_branches_table.sql:38:  and auth.jwt() ->> 'role' in ('owner', 'manager')
supabase/migrations/20260523204000_restore_branches_table.sql:41:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260523204000_restore_branches_table.sql:42:  and auth.jwt() ->> 'role' in ('owner', 'manager')
supabase/migrations/20260527050000_tenant_field_definitions_phase2.sql:3:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260527050000_tenant_field_definitions_phase2.sql:18:  constraint tenant_field_definitions_unique unique (tenant_id, entity, field_key)
supabase/migrations/20260527050000_tenant_field_definitions_phase2.sql:22:  on public.tenant_field_definitions (tenant_id, entity, visible, field_order, field_key);
supabase/migrations/20260527050000_tenant_field_definitions_phase2.sql:24:alter table public.tenant_field_definitions enable row level security;
supabase/migrations/20260527050000_tenant_field_definitions_phase2.sql:27:create policy tenant_field_definitions_select
supabase/migrations/20260527050000_tenant_field_definitions_phase2.sql:30:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260527050000_tenant_field_definitions_phase2.sql:33:create policy tenant_field_definitions_write
supabase/migrations/20260527050000_tenant_field_definitions_phase2.sql:36:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id)
supabase/migrations/20260527050000_tenant_field_definitions_phase2.sql:37:with check ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:5:  on public.customers (tenant_id, phone)
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:9:  on public.customers (tenant_id, lower(email))
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:14:  on public.service_orders (tenant_id, promised_date, status);
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:18:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:28:  on public.service_order_status_history (tenant_id, service_order_id, created_at desc);
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:32:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:48:  on public.customer_payments (tenant_id, service_order_id, paid_at desc);
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:51:  on public.purchase_order_items (tenant_id, purchase_order_id, created_at desc);
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:93:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:130:      tenant_id,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:138:      new.tenant_id,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:154:        where p.tenant_id = new.tenant_id
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:159:          tenant_id,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:174:          new.tenant_id,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:203:alter table if exists public.audit_logs enable row level security;
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:204:alter table if exists public.security_sessions enable row level security;
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:205:alter table if exists public.audit_logs force row level security;
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:206:alter table if exists public.security_sessions force row level security;
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:209:create policy audit_logs_select_owner
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:213:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id and coalesce(auth.jwt() ->> 'role', '') = 'owner');
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:216:create policy security_sessions_select_owner_manager
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:221:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:222:  and coalesce(auth.jwt() ->> 'role', '') in ('owner', 'manager')
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:3:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:21:  on public.products (tenant_id, sku);
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:24:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:43:  on public.purchase_orders (tenant_id, folio);
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:46:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:60:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:74:  on public.inventory_movements (tenant_id, product_id, created_at desc);
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:77:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260530180000_add_customer_sucursal_id.sql:5:  on public.customers (tenant_id, sucursal_id);
supabase/migrations/20260514133525_remote_schema.sql:422:alter table "public"."branch_inventory" drop constraint "branch_inventory_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:423:alter table "public"."branches" drop constraint "branches_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:429:alter table "public"."customer_payments" drop constraint "customer_payments_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:435:alter table "public"."expenses" drop constraint "expenses_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:439:alter table "public"."file_assets" drop constraint "file_assets_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:446:alter table "public"."inventory_movements" drop constraint "inventory_movements_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:447:alter table "public"."notification_events" drop constraint "notification_events_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:449:alter table "public"."products" drop constraint "products_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:452:alter table "public"."purchase_order_items" drop constraint "purchase_order_items_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:457:alter table "public"."purchase_orders" drop constraint "purchase_orders_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:460:alter table "public"."service_order_checklists" drop constraint "service_order_checklists_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:463:alter table "public"."service_order_status_history" drop constraint "service_order_status_history_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:469:alter table "public"."service_requests" drop constraint "service_requests_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:473:alter table "public"."stock_alerts" drop constraint "stock_alerts_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:474:alter table "public"."suppliers" drop constraint "suppliers_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:477:alter table "public"."task_history" drop constraint "task_history_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:483:alter table "public"."tasks" drop constraint "tasks_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:486:alter table "public"."users" drop constraint "users_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:487:alter table "public"."customers" drop constraint "customers_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:489:alter table "public"."service_orders" drop constraint "service_orders_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:515:drop index if exists "public"."customers_tenant_idx";
supabase/migrations/20260514133525_remote_schema.sql:539:drop index if exists "public"."suppliers_tenant_idx";
supabase/migrations/20260514133525_remote_schema.sql:572:alter table "public"."organizations" enable row level security;
supabase/migrations/20260514133525_remote_schema.sql:582:alter table "public"."profiles" enable row level security;
supabase/migrations/20260514133525_remote_schema.sql:632:alter table "public"."tenants" enable row level security;
supabase/migrations/20260514133525_remote_schema.sql:653:alter table "public"."customers" add constraint "customers_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE not valid;
supabase/migrations/20260514133525_remote_schema.sql:654:alter table "public"."customers" validate constraint "customers_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:657:alter table "public"."service_orders" add constraint "service_orders_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE not valid;
supabase/migrations/20260514133525_remote_schema.sql:658:alter table "public"."service_orders" validate constraint "service_orders_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:667:    so.tenant_id
supabase/migrations/20260514133525_remote_schema.sql:712:create policy "Tenant isolation: customers"
supabase/migrations/20260514133525_remote_schema.sql:717:using ((tenant_id = ( SELECT profiles.organization_id
supabase/migrations/20260514133525_remote_schema.sql:720:create policy "Org members can see each other"
supabase/migrations/20260514133525_remote_schema.sql:728:create policy "Tenant isolation: orders"
supabase/migrations/20260514133525_remote_schema.sql:733:using ((tenant_id = ( SELECT profiles.organization_id
supabase/migrations/20260424_baseline_schema.sql:28:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:40:  on public.branches (tenant_id, code)
supabase/migrations/20260424_baseline_schema.sql:44:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:57:  on public.users (tenant_id, lower(email));
supabase/migrations/20260424_baseline_schema.sql:60:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:70:create index if not exists customers_tenant_idx on public.customers (tenant_id);
supabase/migrations/20260424_baseline_schema.sql:71:create index if not exists customers_tenant_phone_idx on public.customers (tenant_id, phone);
supabase/migrations/20260424_baseline_schema.sql:72:create index if not exists customers_tenant_email_idx on public.customers (tenant_id, lower(email));
supabase/migrations/20260424_baseline_schema.sql:75:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:94:  on public.service_requests (tenant_id, folio);
supabase/migrations/20260424_baseline_schema.sql:97:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:124:  on public.service_orders (tenant_id, folio);
supabase/migrations/20260424_baseline_schema.sql:126:  on public.service_orders (tenant_id, branch_id);
supabase/migrations/20260424_baseline_schema.sql:128:  on public.service_orders (tenant_id, status);
supabase/migrations/20260424_baseline_schema.sql:131:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:145:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:157:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:172:create index if not exists tasks_tenant_branch_idx on public.tasks (tenant_id, branch_id);
supabase/migrations/20260424_baseline_schema.sql:173:create index if not exists tasks_tenant_status_idx on public.tasks (tenant_id, status);
supabase/migrations/20260424_baseline_schema.sql:177:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:186:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:208:create index if not exists suppliers_tenant_idx on public.suppliers (tenant_id);
supabase/migrations/20260424_baseline_schema.sql:211:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:229:  on public.products (tenant_id, sku);
supabase/migrations/20260424_baseline_schema.sql:232:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:239:  on public.branch_inventory (tenant_id, branch_id, product_id);
supabase/migrations/20260424_baseline_schema.sql:242:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:261:  on public.purchase_orders (tenant_id, folio);
supabase/migrations/20260424_baseline_schema.sql:264:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:278:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:292:  on public.inventory_movements (tenant_id, product_id, created_at desc);
supabase/migrations/20260424_baseline_schema.sql:295:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:305:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:324:  on public.expenses (tenant_id, expense_date desc);
supabase/migrations/20260424_baseline_schema.sql:327:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:343:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:356:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:12:  select nullif(auth.jwt() ->> 'tenant_id', '')::uuid
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:20:  select coalesce(auth.jwt() ->> 'role', '')
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:25:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:38:  on public.sucursales (tenant_id, code)
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:41:create index if not exists sucursales_tenant_idx
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:42:  on public.sucursales (tenant_id);
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:49:alter table public.sucursales enable row level security;
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:50:alter table public.sucursales force row level security;
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:53:create policy sucursales_select
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:57:using (public._sucursal_tenant_jwt_id() = tenant_id);
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:60:create policy sucursales_write_owner_manager
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:64:using (public._sucursal_tenant_jwt_id() = tenant_id and public._sucursal_jwt_role() in ('owner', 'manager'))
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:65:with check (public._sucursal_tenant_jwt_id() = tenant_id and public._sucursal_jwt_role() in ('owner', 'manager'));
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:69:  tenant_id,
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:82:  b.tenant_id,
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:94:set tenant_id = excluded.tenant_id,
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:106:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:114:create index if not exists sucursal_inventory_tenant_idx
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:115:  on public.sucursal_inventory (tenant_id);
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:118:  on public.sucursal_inventory (tenant_id, sucursal_id);
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:121:  on public.sucursal_inventory (tenant_id, product_id);
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:124:  on public.sucursal_inventory (tenant_id, sucursal_id, product_id);
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:131:alter table public.sucursal_inventory enable row level security;
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:132:alter table public.sucursal_inventory force row level security;
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:135:create policy sucursal_inventory_select
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:139:using (public._sucursal_tenant_jwt_id() = tenant_id);
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:142:create policy sucursal_inventory_write_owner_manager
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:146:using (public._sucursal_tenant_jwt_id() = tenant_id and public._sucursal_jwt_role() in ('owner', 'manager'))
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:147:with check (public._sucursal_tenant_jwt_id() = tenant_id and public._sucursal_jwt_role() in ('owner', 'manager'));
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:151:  tenant_id,
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:160:  i.tenant_id,
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:168:  on p.tenant_id = i.tenant_id
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:170:on conflict (tenant_id, sucursal_id, product_id) do update
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:15:  tenant_id uuid not null references public.organizations(id) on delete cascade,
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:39:create index if not exists suppliers_tenant_idx
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:40:  on public.suppliers (tenant_id);
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:43:  on public.suppliers (tenant_id, business_name);
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:46:  on public.suppliers (tenant_id, rfc);
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:50:  tenant_id uuid not null references public.organizations(id) on delete cascade,
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:59:create index if not exists inventory_tenant_idx
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:60:  on public.inventory (tenant_id);
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:63:  on public.inventory (tenant_id, branch_id);
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:66:  on public.inventory (tenant_id, sku);
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:70:  tenant_id uuid not null references public.organizations(id) on delete cascade,
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:79:create index if not exists finances_tenant_idx
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:80:  on public.finances (tenant_id);
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:83:  on public.finances (tenant_id, sucursal_id);
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:87:  tenant_id uuid not null references public.organizations(id) on delete cascade,
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:117:  on public.service_orders (tenant_id, folio);
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:120:  on public.service_orders (tenant_id, status);
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:123:  on public.service_orders (tenant_id, created_at desc);
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:175:alter table public.suppliers enable row level security;
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:176:alter table public.inventory enable row level security;
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:177:alter table public.finances enable row level security;
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:178:alter table public.service_order_checklists enable row level security;
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:181:create policy suppliers_select
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:185:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:189:create policy suppliers_write_owner_manager
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:193:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:194:  and auth.jwt() ->> 'role' in ('owner', 'manager')
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:197:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:198:  and auth.jwt() ->> 'role' in ('owner', 'manager')
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:202:create policy inventory_select
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:206:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:210:create policy inventory_write_owner_manager
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:214:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:215:  and auth.jwt() ->> 'role' in ('owner', 'manager')
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:218:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:219:  and auth.jwt() ->> 'role' in ('owner', 'manager')
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:223:create policy finances_select
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:227:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:231:create policy finances_write_owner_manager
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:235:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:236:  and auth.jwt() ->> 'role' in ('owner', 'manager')
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:239:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:240:  and auth.jwt() ->> 'role' in ('owner', 'manager')
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:244:create policy service_order_checklists_select
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:248:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:252:create policy service_order_checklists_write_owner_manager
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:256:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:257:  and auth.jwt() ->> 'role' in ('owner', 'manager')
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:260:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:261:  and auth.jwt() ->> 'role' in ('owner', 'manager')
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:12:  select nullif(auth.jwt() ->> 'tenant_id', '')::uuid
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:20:  select coalesce(auth.jwt() ->> 'role', '')
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:47:alter table if exists public.tenants enable row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:48:alter table if exists public.users enable row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:49:alter table if exists public.customers enable row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:50:alter table if exists public.service_requests enable row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:51:alter table if exists public.service_orders enable row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:52:alter table if exists public.service_order_documents enable row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:53:alter table if exists public.service_order_events enable row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:54:alter table if exists public.sucursales enable row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:55:alter table if exists public.sucursal_inventory enable row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:56:alter table if exists public.products enable row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:57:alter table if exists public.suppliers enable row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:58:alter table if exists public.expenses enable row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:59:alter table if exists public.tasks enable row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:60:alter table if exists public.purchase_orders enable row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:61:alter table if exists public.purchase_order_items enable row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:62:alter table if exists public.inventory_movements enable row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:63:alter table if exists public.stock_alerts enable row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:64:alter table if exists public.customer_payments enable row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:65:alter table if exists public.file_assets enable row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:66:alter table if exists public.finances enable row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:68:alter table if exists public.tenants force row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:69:alter table if exists public.users force row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:70:alter table if exists public.customers force row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:71:alter table if exists public.service_requests force row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:72:alter table if exists public.service_orders force row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:73:alter table if exists public.service_order_documents force row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:74:alter table if exists public.service_order_events force row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:75:alter table if exists public.sucursales force row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:76:alter table if exists public.sucursal_inventory force row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:77:alter table if exists public.products force row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:78:alter table if exists public.suppliers force row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:79:alter table if exists public.expenses force row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:80:alter table if exists public.tasks force row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:81:alter table if exists public.purchase_orders force row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:82:alter table if exists public.purchase_order_items force row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:83:alter table if exists public.inventory_movements force row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:84:alter table if exists public.stock_alerts force row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:85:alter table if exists public.customer_payments force row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:86:alter table if exists public.file_assets force row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:87:alter table if exists public.finances force row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:94:      create policy tenants_select_same_tenant
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:103:      create policy tenants_insert_owner
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:112:      create policy tenants_update_owner
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:122:      create policy tenants_delete_owner
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:133:      create policy users_select_tenant
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:137:      using (public._is_tenant_member(tenant_id))
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:142:      create policy users_write_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:146:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:147:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:154:      create policy customers_select
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:158:      using (public._is_tenant_member(tenant_id))
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:162:      create policy customers_write_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:166:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:170:      create policy customers_update_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:174:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:175:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:179:      create policy customers_delete_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:183:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:190:      create policy service_requests_select
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:194:      using (public._is_tenant_member(tenant_id))
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:198:      create policy service_requests_write_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:202:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:206:      create policy service_requests_update_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:210:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:211:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:215:      create policy service_requests_delete_tenant
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:219:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:226:      create policy service_orders_select
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:230:      using (public._is_tenant_member(tenant_id))
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:234:      create policy service_orders_write_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:238:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:242:      create policy service_orders_update_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:246:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:247:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:251:      create policy service_orders_delete_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:255:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:259:      create policy service_orders_update_technician
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:263:      using (public._is_tenant_member(tenant_id) and public._jwt_role() = 'technician')
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:264:      with check (public._is_tenant_member(tenant_id) and public._jwt_role() = 'technician')
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:271:      create policy service_order_documents_select
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:275:      using (public._is_tenant_member(tenant_id))
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:279:      create policy service_order_documents_write_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:283:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:284:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:291:      create policy service_order_events_select
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:295:      using (public._is_tenant_member(tenant_id))
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:299:      create policy service_order_events_write_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:303:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:304:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:311:      create policy sucursales_select
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:315:      using (public._is_tenant_member(tenant_id))
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:319:      create policy sucursales_write_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:323:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:324:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:331:      create policy sucursal_inventory_select
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:335:      using (public._is_tenant_member(tenant_id))
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:339:      create policy sucursal_inventory_write_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:343:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:344:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:351:      create policy products_select
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:355:      using (public._is_tenant_member(tenant_id))
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:359:      create policy products_write_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:363:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:364:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:371:      create policy suppliers_select
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:375:      using (public._is_tenant_member(tenant_id))
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:379:      create policy suppliers_write_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:383:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:384:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:391:      create policy expenses_owner
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:395:      using (public._is_tenant_member(tenant_id) and public._jwt_role() = 'owner')
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:396:      with check (public._is_tenant_member(tenant_id) and public._jwt_role() = 'owner')
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:400:      create policy expenses_manager_read_own_sucursal
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:405:        public._is_tenant_member(tenant_id)
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:407:        and ((public._tenant_jwt_id() = tenant_id) is true)
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:412:      create policy expenses_manager_write_own_sucursal
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:417:        public._is_tenant_member(tenant_id)
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:423:      create policy expenses_manager_update_own_sucursal
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:428:        public._is_tenant_member(tenant_id)
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:432:        public._is_tenant_member(tenant_id)
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:438:      create policy expenses_manager_delete_own_sucursal
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:443:        public._is_tenant_member(tenant_id)
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:452:      create policy tasks_select
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:456:      using (public._is_tenant_member(tenant_id))
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:460:      create policy tasks_write_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:464:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:465:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:472:      create policy purchase_orders_select
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:476:      using (public._is_tenant_member(tenant_id))
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:480:      create policy purchase_orders_write_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:484:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:485:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:492:      create policy purchase_order_items_select
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:496:      using (public._is_tenant_member(tenant_id))
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:500:      create policy purchase_order_items_write_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:504:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:505:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:512:      create policy inventory_movements_select
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:516:      using (public._is_tenant_member(tenant_id))
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:520:      create policy inventory_movements_write_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:524:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:525:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:532:      create policy stock_alerts_select
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:536:      using (public._is_tenant_member(tenant_id))
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:540:      create policy stock_alerts_write_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:544:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:545:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:552:      create policy customer_payments_select
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:556:      using (public._is_tenant_member(tenant_id))
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:560:      create policy customer_payments_write_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:564:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:565:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:572:      create policy file_assets_select
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:576:      using (public._is_tenant_member(tenant_id))
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:580:      create policy file_assets_write_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:584:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:585:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:592:      create policy finances_select
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:596:      using (public._is_tenant_member(tenant_id))
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:600:      create policy finances_write_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:604:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:605:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:27:  on public.service_orders (tenant_id, sucursal_id);
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:50:  on public.purchase_orders (tenant_id, sucursal_id);
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:73:  on public.inventory_movements (tenant_id, sucursal_id, created_at desc);
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:96:  on public.stock_alerts (tenant_id, sucursal_id);
supabase/migrations/20260530132000_security_backoffice_tables.sql:14:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260530132000_security_backoffice_tables.sql:25:  on public.audit_logs (tenant_id, created_at desc);
supabase/migrations/20260530132000_security_backoffice_tables.sql:28:  on public.audit_logs (tenant_id, action);
supabase/migrations/20260530132000_security_backoffice_tables.sql:31:  on public.audit_logs (tenant_id, user_id, created_at desc);
supabase/migrations/20260530132000_security_backoffice_tables.sql:35:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260530132000_security_backoffice_tables.sql:47:  on public.security_sessions (tenant_id, revoked_at, last_activity_at desc);
supabase/migrations/20260530132000_security_backoffice_tables.sql:50:  on public.security_sessions (tenant_id, user_id, last_activity_at desc);
supabase/migrations/20260530132000_security_backoffice_tables.sql:52:alter table public.audit_logs enable row level security;
supabase/migrations/20260530132000_security_backoffice_tables.sql:53:alter table public.security_sessions enable row level security;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:2:alter table if exists public.service_orders enable row level security;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:3:alter table if exists public.customers enable row level security;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:4:alter table if exists public.service_requests enable row level security;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:5:alter table if exists public.branch_inventory enable row level security;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:6:alter table if exists public.expenses enable row level security;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:7:alter table if exists public.tasks enable row level security;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:8:alter table if exists public.suppliers enable row level security;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:9:alter table if exists public.products enable row level security;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:12:create policy service_orders_select
supabase/migrations/20260514120000_enable_rls_and_policies.sql:16:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:19:create policy service_orders_write_owner_manager
supabase/migrations/20260514120000_enable_rls_and_policies.sql:23:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:24:  and auth.jwt() ->> 'role' in ('owner', 'manager')
supabase/migrations/20260514120000_enable_rls_and_policies.sql:27:create policy service_orders_update_owner_manager
supabase/migrations/20260514120000_enable_rls_and_policies.sql:31:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:32:  and auth.jwt() ->> 'role' in ('owner', 'manager')
supabase/migrations/20260514120000_enable_rls_and_policies.sql:35:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:36:  and auth.jwt() ->> 'role' in ('owner', 'manager')
supabase/migrations/20260514120000_enable_rls_and_policies.sql:39:create policy service_orders_delete_owner_manager
supabase/migrations/20260514120000_enable_rls_and_policies.sql:43:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:44:  and auth.jwt() ->> 'role' in ('owner', 'manager')
supabase/migrations/20260514120000_enable_rls_and_policies.sql:47:create policy service_orders_update_technician
supabase/migrations/20260514120000_enable_rls_and_policies.sql:51:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:52:  and auth.jwt() ->> 'role' = 'technician'
supabase/migrations/20260514120000_enable_rls_and_policies.sql:55:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:56:  and auth.jwt() ->> 'role' = 'technician'
supabase/migrations/20260514120000_enable_rls_and_policies.sql:60:create policy customers_select
supabase/migrations/20260514120000_enable_rls_and_policies.sql:64:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:67:create policy customers_write_owner_manager
supabase/migrations/20260514120000_enable_rls_and_policies.sql:71:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:72:  and auth.jwt() ->> 'role' in ('owner', 'manager')
supabase/migrations/20260514120000_enable_rls_and_policies.sql:75:create policy customers_update_owner_manager
supabase/migrations/20260514120000_enable_rls_and_policies.sql:79:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:80:  and auth.jwt() ->> 'role' in ('owner', 'manager')
supabase/migrations/20260514120000_enable_rls_and_policies.sql:83:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:84:  and auth.jwt() ->> 'role' in ('owner', 'manager')
supabase/migrations/20260514120000_enable_rls_and_policies.sql:87:create policy customers_delete_owner_manager
supabase/migrations/20260514120000_enable_rls_and_policies.sql:91:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:92:  and auth.jwt() ->> 'role' in ('owner', 'manager')
supabase/migrations/20260514120000_enable_rls_and_policies.sql:96:create policy service_requests_select
supabase/migrations/20260514120000_enable_rls_and_policies.sql:100:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:103:create policy service_requests_write_owner_manager
supabase/migrations/20260514120000_enable_rls_and_policies.sql:107:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:108:  and auth.jwt() ->> 'role' in ('owner', 'manager')
supabase/migrations/20260514120000_enable_rls_and_policies.sql:111:create policy service_requests_update_owner_manager
supabase/migrations/20260514120000_enable_rls_and_policies.sql:115:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:116:  and auth.jwt() ->> 'role' in ('owner', 'manager')
supabase/migrations/20260514120000_enable_rls_and_policies.sql:119:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:120:  and auth.jwt() ->> 'role' in ('owner', 'manager')
supabase/migrations/20260514120000_enable_rls_and_policies.sql:124:create policy branch_inventory_select
supabase/migrations/20260514120000_enable_rls_and_policies.sql:128:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:131:create policy branch_inventory_write_owner_manager
supabase/migrations/20260514120000_enable_rls_and_policies.sql:135:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:136:  and auth.jwt() ->> 'role' in ('owner', 'manager')
supabase/migrations/20260514120000_enable_rls_and_policies.sql:139:create policy branch_inventory_update_owner_manager
supabase/migrations/20260514120000_enable_rls_and_policies.sql:143:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:144:  and auth.jwt() ->> 'role' in ('owner', 'manager')
supabase/migrations/20260514120000_enable_rls_and_policies.sql:147:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:148:  and auth.jwt() ->> 'role' in ('owner', 'manager')
supabase/migrations/20260514120000_enable_rls_and_policies.sql:151:create policy branch_inventory_delete_owner_manager
supabase/migrations/20260514120000_enable_rls_and_policies.sql:155:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:156:  and auth.jwt() ->> 'role' in ('owner', 'manager')
supabase/migrations/20260514120000_enable_rls_and_policies.sql:160:create policy products_select
supabase/migrations/20260514120000_enable_rls_and_policies.sql:164:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:167:create policy suppliers_select
supabase/migrations/20260514120000_enable_rls_and_policies.sql:171:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:174:create policy products_write_owner_manager
supabase/migrations/20260514120000_enable_rls_and_policies.sql:178:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:179:  and auth.jwt() ->> 'role' in ('owner', 'manager')
supabase/migrations/20260514120000_enable_rls_and_policies.sql:182:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:183:  and auth.jwt() ->> 'role' in ('owner', 'manager')
supabase/migrations/20260514120000_enable_rls_and_policies.sql:186:create policy suppliers_write_owner_manager
supabase/migrations/20260514120000_enable_rls_and_policies.sql:190:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:191:  and auth.jwt() ->> 'role' in ('owner', 'manager')
supabase/migrations/20260514120000_enable_rls_and_policies.sql:194:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:195:  and auth.jwt() ->> 'role' in ('owner', 'manager')
supabase/migrations/20260514120000_enable_rls_and_policies.sql:199:create policy expenses_owner
supabase/migrations/20260514120000_enable_rls_and_policies.sql:203:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:204:  and auth.jwt() ->> 'role' = 'owner'
supabase/migrations/20260514120000_enable_rls_and_policies.sql:207:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:208:  and auth.jwt() ->> 'role' = 'owner'
supabase/migrations/20260514120000_enable_rls_and_policies.sql:211:create policy expenses_manager_read_own_sucursal
supabase/migrations/20260514120000_enable_rls_and_policies.sql:215:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:216:  and auth.jwt() ->> 'role' = 'manager'
supabase/migrations/20260514120000_enable_rls_and_policies.sql:217:  and branch_id::text = auth.jwt() ->> 'sucursal_id'
supabase/migrations/20260514120000_enable_rls_and_policies.sql:220:create policy expenses_manager_write_own_sucursal
supabase/migrations/20260514120000_enable_rls_and_policies.sql:224:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:225:  and auth.jwt() ->> 'role' = 'manager'
supabase/migrations/20260514120000_enable_rls_and_policies.sql:226:  and branch_id::text = auth.jwt() ->> 'sucursal_id'
supabase/migrations/20260514120000_enable_rls_and_policies.sql:229:create policy expenses_manager_update_own_sucursal
supabase/migrations/20260514120000_enable_rls_and_policies.sql:233:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:234:  and auth.jwt() ->> 'role' = 'manager'
supabase/migrations/20260514120000_enable_rls_and_policies.sql:235:  and branch_id::text = auth.jwt() ->> 'sucursal_id'
supabase/migrations/20260514120000_enable_rls_and_policies.sql:238:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:239:  and auth.jwt() ->> 'role' = 'manager'
supabase/migrations/20260514120000_enable_rls_and_policies.sql:240:  and branch_id::text = auth.jwt() ->> 'sucursal_id'
supabase/migrations/20260514120000_enable_rls_and_policies.sql:243:create policy expenses_manager_delete_own_sucursal
supabase/migrations/20260514120000_enable_rls_and_policies.sql:247:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:248:  and auth.jwt() ->> 'role' = 'manager'
supabase/migrations/20260514120000_enable_rls_and_policies.sql:249:  and branch_id::text = auth.jwt() ->> 'sucursal_id'
supabase/migrations/20260514120000_enable_rls_and_policies.sql:253:create policy tasks_select
supabase/migrations/20260514120000_enable_rls_and_policies.sql:257:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:260:create policy tasks_write_owner_manager
supabase/migrations/20260514120000_enable_rls_and_policies.sql:264:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:265:  and auth.jwt() ->> 'role' in ('owner', 'manager')
supabase/migrations/20260514120000_enable_rls_and_policies.sql:268:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:269:  and auth.jwt() ->> 'role' in ('owner', 'manager')
supabase/migrations/20260514150000_add_tenant_onboarding.sql:4:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260514150000_add_tenant_onboarding.sql:31:  on public.users (tenant_id, auth_user_id)
supabase/migrations/20260514150000_add_tenant_onboarding.sql:34:  on public.users (tenant_id, lower(email));
supabase/migrations/20260514150000_add_tenant_onboarding.sql:35:alter table public.users enable row level security;
supabase/migrations/20260514150000_add_tenant_onboarding.sql:44:  tenant_id uuid,
supabase/migrations/20260514150000_add_tenant_onboarding.sql:45:  tenant_slug text,
supabase/migrations/20260514150000_add_tenant_onboarding.sql:54:  v_tenant_id uuid;
supabase/migrations/20260514150000_add_tenant_onboarding.sql:105:  returning id into v_tenant_id;
supabase/migrations/20260514150000_add_tenant_onboarding.sql:108:    tenant_id,
supabase/migrations/20260514150000_add_tenant_onboarding.sql:116:    v_tenant_id,
supabase/migrations/20260514150000_add_tenant_onboarding.sql:125:  tenant_id := v_tenant_id;
supabase/migrations/20260514150000_add_tenant_onboarding.sql:126:  tenant_slug := v_slug;
supabase/migrations/20260514150000_add_tenant_onboarding.sql:133:alter table public.tenants enable row level security;
supabase/migrations/20260514150000_add_tenant_onboarding.sql:135:create policy tenants_select_same_tenant
supabase/migrations/20260514150000_add_tenant_onboarding.sql:138:using ((auth.jwt() ->> 'tenant_id')::uuid = id);
supabase/migrations/20260514150000_add_tenant_onboarding.sql:140:create policy tenants_insert_owner
supabase/migrations/20260514150000_add_tenant_onboarding.sql:143:with check (auth.jwt() ->> 'role' = 'owner');
supabase/migrations/20260514150000_add_tenant_onboarding.sql:145:create policy tenants_update_owner
supabase/migrations/20260514150000_add_tenant_onboarding.sql:149:  (auth.jwt() ->> 'tenant_id')::uuid = id
supabase/migrations/20260514150000_add_tenant_onboarding.sql:150:  and auth.jwt() ->> 'role' = 'owner'
supabase/migrations/20260514150000_add_tenant_onboarding.sql:153:  (auth.jwt() ->> 'tenant_id')::uuid = id
supabase/migrations/20260514150000_add_tenant_onboarding.sql:154:  and auth.jwt() ->> 'role' = 'owner'
supabase/migrations/20260514150000_add_tenant_onboarding.sql:157:create policy tenants_delete_owner
supabase/migrations/20260514150000_add_tenant_onboarding.sql:161:  (auth.jwt() ->> 'tenant_id')::uuid = id
supabase/migrations/20260514150000_add_tenant_onboarding.sql:162:  and auth.jwt() ->> 'role' = 'owner'
supabase/migrations/20260530150000_add_pwa_push_subscriptions.sql:3:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260530150000_add_pwa_push_subscriptions.sql:16:  on public.pwa_push_subscriptions (tenant_id, endpoint);
supabase/migrations/20260530150000_add_pwa_push_subscriptions.sql:18:alter table public.pwa_push_subscriptions enable row level security;
supabase/migrations/20260530150000_add_pwa_push_subscriptions.sql:21:create policy pwa_push_subscriptions_select
supabase/migrations/20260530150000_add_pwa_push_subscriptions.sql:24:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260530150000_add_pwa_push_subscriptions.sql:27:create policy pwa_push_subscriptions_write
supabase/migrations/20260530150000_add_pwa_push_subscriptions.sql:30:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id)
supabase/migrations/20260530150000_add_pwa_push_subscriptions.sql:31:with check ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260523190000_order_documents_events.sql:3:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260523190000_order_documents_events.sql:17:  on public.service_order_documents (tenant_id, service_order_id, created_at desc);
supabase/migrations/20260523190000_order_documents_events.sql:20:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260523190000_order_documents_events.sql:31:  on public.service_order_events (tenant_id, service_order_id, created_at desc);
supabase/migrations/20260523190000_order_documents_events.sql:32:alter table public.service_order_documents enable row level security;
supabase/migrations/20260523190000_order_documents_events.sql:33:alter table public.service_order_events enable row level security;
supabase/migrations/20260523190000_order_documents_events.sql:35:create policy service_order_documents_select
supabase/migrations/20260523190000_order_documents_events.sql:38:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260523190000_order_documents_events.sql:40:create policy service_order_documents_write_owner_manager
supabase/migrations/20260523190000_order_documents_events.sql:43:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id)
supabase/migrations/20260523190000_order_documents_events.sql:44:with check ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260523190000_order_documents_events.sql:46:create policy service_order_events_select
supabase/migrations/20260523190000_order_documents_events.sql:49:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260523190000_order_documents_events.sql:51:create policy service_order_events_write_owner_manager
supabase/migrations/20260523190000_order_documents_events.sql:54:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id)
supabase/migrations/20260523190000_order_documents_events.sql:55:with check ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:3:create or replace function public._live_tenant_id()
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:8:  select nullif(auth.jwt() ->> 'tenant_id', '')::uuid
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:16:  select coalesce(auth.jwt() ->> 'role', '')
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:19:alter table if exists public.products enable row level security;
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:20:alter table if exists public.purchase_orders enable row level security;
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:21:alter table if exists public.purchase_order_items enable row level security;
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:22:alter table if exists public.inventory_movements enable row level security;
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:23:alter table if exists public.stock_alerts enable row level security;
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:25:alter table if exists public.products force row level security;
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:26:alter table if exists public.purchase_orders force row level security;
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:27:alter table if exists public.purchase_order_items force row level security;
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:28:alter table if exists public.inventory_movements force row level security;
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:29:alter table if exists public.stock_alerts force row level security;
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:32:create policy products_select
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:36:using (public._live_tenant_id() = tenant_id);
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:39:create policy products_write_owner_manager
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:43:using (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'))
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:44:with check (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'));
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:47:create policy purchase_orders_select
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:51:using (public._live_tenant_id() = tenant_id);
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:54:create policy purchase_orders_write_owner_manager
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:58:using (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'))
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:59:with check (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'));
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:62:create policy purchase_order_items_select
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:66:using (public._live_tenant_id() = tenant_id);
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:69:create policy purchase_order_items_write_owner_manager
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:73:using (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'))
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:74:with check (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'));
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:77:create policy inventory_movements_select
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:81:using (public._live_tenant_id() = tenant_id);
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:84:create policy inventory_movements_write_owner_manager
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:88:using (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'))
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:89:with check (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'));
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:92:create policy stock_alerts_select
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:96:using (public._live_tenant_id() = tenant_id);
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:99:create policy stock_alerts_write_owner_manager
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:103:using (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'))
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:104:with check (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'));

---

## 13. Variables de entorno usadas

apps/api/src/middleware/tenantBilling.ts:7:  const masterTenantSlug = process.env.MASTER_TENANT_SLUG?.trim() ?? '';
apps/api/src/middleware/tenantBilling.ts:8:  const masterAccountEmail = process.env.MASTER_ACCOUNT_EMAIL?.trim() ?? '';
apps/api/src/index.ts:33:const port = process.env.PORT || 4000;
apps/api/src/index.ts:34:const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS ?? 'http://localhost:3000')
apps/api/src/index.ts:39:const baseDomains = (process.env.BASE_DOMAIN ?? 'serviciosdigitalesmx.online,serviciosdigitalesmx.dev')
apps/api/src/index.ts:52:  process.env.APP_URL?.trim(),
apps/api/src/index.ts:53:  process.env.NEXT_PUBLIC_WEB_PUBLIC_URL?.trim(),
apps/api/src/index.ts:54:  process.env.NEXT_PUBLIC_WEB_ADMIN_URL?.trim(),
apps/api/src/index.ts:150:  const apiName = process.env.API_NAME ?? 'White-label API';
apps/api/src/index.ts:159:const isVercel = Boolean(process.env.VERCEL);
apps/api/src/controllers/meta.ts:9:  const apiName = process.env.API_NAME ?? 'White-label API';
apps/api/src/controllers/meta.ts:25:    service: process.env.API_NAME ?? 'White-label API',
apps/api/src/controllers/auth.controller.ts:21:  const configuredOrigins = (process.env.CORS_ALLOWED_ORIGINS ?? '')
apps/api/src/controllers/auth.controller.ts:26:  const appUrl = process.env.APP_URL?.trim();
apps/api/src/controllers/auth.controller.ts:53:  const configuredAppUrl = process.env.APP_URL?.trim();
apps/api/src/controllers/auth.controller.ts:65:  const secret = tenantId ? await resolveTenantJwtSecret(tenantId) : process.env.JWT_SECRET;
apps/api/src/controllers/auth.controller.ts:127:    console.error('REGISTER_MISSING_APP_URL', { requestOrigin: requestOrigin, configured: process.env.APP_URL });
apps/api/src/controllers/auth.controller.ts:243:  const supabaseUrl = process.env.SUPABASE_URL;
apps/api/src/controllers/auth.controller.ts:244:  const publicAppUrl = process.env.APP_URL;
apps/api/src/controllers/requests.ts:138:    const folioPrefix = process.env.ORDER_FOLIO_PREFIX ?? 'ORD';
apps/api/src/controllers/reports.ts:108:    const lowStockCount = inventory.filter((item) => Number((item as { stock_current?: number }).stock_current ?? 0) <= Number(process.env.LOW_STOCK_THRESHOLD ?? 5)).length;
apps/api/src/controllers/pwa.ts:15:  const publicKey = process.env.PWA_VAPID_PUBLIC_KEY?.trim();
apps/api/src/controllers/orders.ts:202:  return process.env.SUPABASE_ORDER_BUCKET ?? 'order-assets';
apps/api/src/controllers/orders.ts:505:    const folioPrefix = process.env.ORDER_FOLIO_PREFIX ?? 'ORD';
apps/api/src/controllers/billing.ts:57:  if (!process.env.MP_ACCESS_TOKEN) {
apps/api/src/controllers/procurement.ts:44:    const lowStockThreshold = Number(process.env.LOW_STOCK_THRESHOLD ?? 5);
apps/api/src/services/security-backoffice.ts:87:  const globalSecret = process.env.JWT_SECRET;
apps/api/src/services/tenant-capabilities.ts:92:  const masterTenantSlug = normalizeKey(process.env.MASTER_TENANT_SLUG);
apps/api/src/services/tenant-capabilities.ts:93:  const masterAccountEmail = normalizeKey(process.env.MASTER_ACCOUNT_EMAIL);
apps/api/src/services/pwa-push.ts:11:  const publicKey = process.env.PWA_VAPID_PUBLIC_KEY?.trim();
apps/api/src/services/pwa-push.ts:12:  const privateKey = process.env.PWA_VAPID_PRIVATE_KEY?.trim();
apps/api/src/services/pwa-push.ts:13:  const subject = process.env.PWA_VAPID_SUBJECT?.trim();
apps/api/src/services/pwa-push.ts:26:  const publicKey = process.env.PWA_VAPID_PUBLIC_KEY?.trim();
apps/api/src/services/pwa-push.ts:27:  const privateKey = process.env.PWA_VAPID_PRIVATE_KEY?.trim();
apps/api/src/services/pwa-push.ts:28:  const subject = process.env.PWA_VAPID_SUBJECT?.trim();
apps/api/src/services/tenant-billing.ts:54:  const upgradeBaseUrl = process.env.APP_URL?.trim() || process.env.CORS_ALLOWED_ORIGINS?.split(',').map((origin) => origin.trim()).find(Boolean) || null;
apps/api/src/services/billing.ts:41:    process.env.NEXT_PUBLIC_WEB_PUBLIC_URL,
apps/api/src/services/billing.ts:42:    process.env.APP_URL,
apps/api/src/services/billing.ts:43:    process.env.NEXT_PUBLIC_WEB_ADMIN_URL,
apps/api/src/services/billing.ts:44:    process.env.CORS_ALLOWED_ORIGINS?.split(',').map((origin) => origin.trim()).find(Boolean),
apps/api/src/services/billing.ts:55:  const accessToken = process.env.MP_ACCESS_TOKEN?.trim();
apps/api/src/services/billing.ts:63:  const webhookBaseUrl = process.env.WEBHOOK_BASE_URL?.trim() || process.env.APP_URL?.trim();
apps/api/src/services/billing.ts:79:  const webhookSecret = process.env.MP_WEBHOOK_SECRET?.trim();
apps/api/src/services/stock-alerts.ts:15:  const parsed = Number(process.env.LOW_STOCK_THRESHOLD ?? 5);
apps/web-admin/src/app/dashboard/ordenes/page.tsx:305:  const customerPortalBase = process.env.NEXT_PUBLIC_CUSTOMER_TRACKING_URL ?? "";
apps/web-admin/src/app/layout.tsx:7:  title: process.env.NEXT_PUBLIC_TENANT_META_TITLE ?? "Servicios Digitales MX Admin",
apps/web-admin/src/app/layout.tsx:9:    process.env.NEXT_PUBLIC_TENANT_META_DESCRIPTION ??
apps/web-admin/src/app/layout.tsx:14:  themeColor: process.env.NEXT_PUBLIC_THEME_PRIMARY ?? "#334155",
apps/web-admin/src/app/layout.tsx:22:  const themePrimary = process.env.NEXT_PUBLIC_THEME_PRIMARY ?? "#334155";
apps/web-admin/src/app/layout.tsx:23:  const themeSecondary = process.env.NEXT_PUBLIC_THEME_SECONDARY ?? "#0f172a";
apps/web-admin/src/app/layout.tsx:24:  const themeAccent = process.env.NEXT_PUBLIC_THEME_ACCENT ?? "#38bdf8";
apps/web-admin/src/app/api/pwa/manifest/route.ts:4:  return request.nextUrl.searchParams.get("tenant")?.trim() || process.env.NEXT_PUBLIC_DEFAULT_TENANT_SLUG?.trim() || "web-admin";
apps/web-admin/src/app/api/pwa/manifest/route.ts:17:    theme_color: process.env.NEXT_PUBLIC_THEME_PRIMARY ?? "#334155",
apps/web-admin/src/app/api/pwa/sw.js/route.ts:86:  const tenantSlug = request.nextUrl.searchParams.get("tenant")?.trim() || process.env.NEXT_PUBLIC_DEFAULT_TENANT_SLUG?.trim() || "web-admin";
apps/web-admin/src/app/login/page.tsx:59:  const publicOnboardingHref = useMemo(() => process.env.NEXT_PUBLIC_WEB_PUBLIC_URL ? new URL("/onboarding", process.env.NEXT_PUBLIC_WEB_PUBLIC_URL).toString() : null, []);
apps/web-admin/src/app/login/page.tsx:93:      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
apps/web-admin/src/lib/auth-storage.ts:3:export const AUTH_TOKEN_KEY = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY ?? "app_auth_token";
apps/web-admin/src/lib/supabase-browser.ts:8:  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
apps/web-admin/src/lib/supabase-browser.ts:9:  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
apps/web-public/src/app/dashboard/page.tsx:8:    process.env.NEXT_PUBLIC_WEB_ADMIN_URL?.trim(),
apps/web-public/src/app/dashboard/page.tsx:9:    process.env.NEXT_PUBLIC_BASE_DOMAIN?.trim() ? `https://app.${process.env.NEXT_PUBLIC_BASE_DOMAIN.trim()}` : null,
apps/web-public/src/app/onboarding/success/redirect-to-admin.tsx:8:    process.env.NEXT_PUBLIC_WEB_ADMIN_URL?.trim(),
apps/web-public/src/app/onboarding/success/redirect-to-admin.tsx:9:    process.env.NEXT_PUBLIC_BASE_DOMAIN?.trim() ? `https://app.${process.env.NEXT_PUBLIC_BASE_DOMAIN.trim()}` : null,
apps/web-public/src/components/root-auth-hash-redirect.tsx:13:    process.env.NEXT_PUBLIC_WEB_ADMIN_URL ??
apps/web-public/src/components/root-auth-hash-redirect.tsx:14:    (process.env.NEXT_PUBLIC_BASE_DOMAIN ? `https://app.${process.env.NEXT_PUBLIC_BASE_DOMAIN}` : "");
apps/web-public/src/lib/auth-storage.ts:3:export const AUTH_TOKEN_KEY = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY ?? "app_auth_token";
apps/web-public/src/lib/supabase-browser.ts:8:  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
apps/web-public/src/lib/supabase-browser.ts:9:  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
apps/web-clientes/src/app/layout.tsx:6:    process.env.NEXT_PUBLIC_CUSTOMER_META_TITLE ??
apps/web-clientes/src/app/layout.tsx:9:    process.env.NEXT_PUBLIC_CUSTOMER_META_DESCRIPTION ??

---

## 14. Imports workspace críticos

apps/api/src/middleware/auth.ts:4:import { supabaseAdmin } from '@white-label/database';
apps/api/src/controllers/meta.ts:2:import { supabaseAdmin } from '@white-label/database';
apps/api/src/controllers/auth.controller.ts:4:import { supabaseAdmin } from '@white-label/database';
apps/api/src/controllers/requests.ts:3:import { getTenantClient } from '@white-label/database';
apps/api/src/controllers/suppliers.ts:3:import { getTenantClient } from '@white-label/database';
apps/api/src/controllers/reports.ts:2:import { getTenantClient } from '@white-label/database';
apps/api/src/controllers/purchase-orders.ts:4:import { getTenantClient } from '@white-label/database';
apps/api/src/controllers/pwa.ts:3:import { supabaseAdmin } from '@white-label/database';
apps/api/src/controllers/orders.ts:5:import { getTenantClient, supabaseAdmin } from '@white-label/database';
apps/api/src/controllers/security.ts:4:import { supabaseAdmin } from '@white-label/database';
apps/api/src/controllers/catalogs.ts:3:import { getTenantClient } from '@white-label/database';
apps/api/src/controllers/users.ts:3:import { supabaseAdmin } from '@white-label/database';
apps/api/src/controllers/finance.ts:3:import { getTenantClient } from '@white-label/database';
apps/api/src/controllers/tasks.ts:4:import { getTenantClient, supabaseAdmin } from '@white-label/database';
apps/api/src/controllers/procurement.ts:2:import { getTenantClient } from '@white-label/database';
apps/api/src/controllers/public.ts:3:import { getTenantClient, supabaseAdmin } from '@white-label/database';
apps/api/src/controllers/sucursales.ts:3:import { getTenantClient, supabaseAdmin } from '@white-label/database';
apps/api/src/services/security-backoffice.ts:2:import { supabaseAdmin } from '@white-label/database';
apps/api/src/services/operational-risk.ts:1:import type { TenantRuntimeConfig, TenantSemaphoreRule, TenantWorkflowStatus } from '@white-label/types';
apps/api/src/services/tenant-capabilities.ts:6:} from '@white-label/types';
apps/api/src/services/pwa-push.ts:2:import { supabaseAdmin } from '@white-label/database';
apps/api/src/services/tenant-config.ts:1:import { supabaseAdmin } from '@white-label/database';
apps/api/src/services/tenant-config.ts:11:} from '@white-label/types';
apps/api/src/services/tenant-billing.ts:1:import { supabaseAdmin } from '@white-label/database';
apps/api/src/services/billing.ts:2:import { supabaseAdmin } from '@white-label/database';
apps/api/src/services/stock-alerts.ts:1:import { getTenantClient } from '@white-label/database';
packages/database/package.json:2:  "name": "@white-label/database",
packages/database/package.json:10:    "@supabase/supabase-js": "^2.43.4"
packages/database/src/index.ts:1:import { createClient } from '@supabase/supabase-js';
packages/database/src/index.ts:32:export * from '@supabase/supabase-js';
packages/types/package.json:2:  "name": "@white-label/types",
apps/web-admin/src/lib/supabase-browser.ts:3:import { createClient } from "@supabase/supabase-js";
apps/web-public/src/lib/supabase-browser.ts:3:import { createClient } from '@supabase/supabase-js';

---

## 15. package.json importantes

### Root package.json
{
  "name": "srfix-monorepo",
  "private": true,
  "packageManager": "pnpm@11.3.0",
  "engines": {
    "node": "22.x"
  },
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "clean": "turbo run clean && rm -rf node_modules",
    "mobile:sync": "pnpm --dir apps/mobile run sync",
    "mobile:android": "pnpm --dir apps/mobile run android",
    "mobile:open": "pnpm --dir apps/mobile run open"
  },
  "devDependencies": {
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "next": "16.2.6",
    "react": "^19.2.6",
    "react-dom": "^19.2.6",
    "turbo": "latest",
    "typescript": "^5.4.5"
  }
}

### API package.json
{
  "name": "@white-label/api",
  "version": "1.0.0",
  "packageManager": "pnpm@11.3.0",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "start": "node dist/index.js",
    "lint": "eslint \"src/**/*.ts\"",
    "typecheck": "tsc --noEmit",
    "test:breaking": "node --test tests/breaking.integration.mjs"
  },
  "dependencies": {
    "@white-label/database": "workspace:*",
    "@white-label/types": "workspace:*",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "pdfkit": "^0.18.0",
    "web-push": "^3.6.7",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/node": "^20.12.11",
    "@types/pdfkit": "^0.17.6",
    "eslint": "^9",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.4.5",
    "typescript-eslint": "^8.38.0"
  }
}

### pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
dangerouslyAllowAllBuilds: true

### render.yaml
services:
  - type: web
    name: sdmx-backend-api
    runtime: node
    plan: free
    buildCommand: pnpm install --frozen-lockfile && pnpm --filter @white-label/api build
    startCommand: pnpm --filter @white-label/api start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: CORS_ALLOWED_ORIGINS
        value: https://serviciosdigitalesmx.online,https://app.serviciosdigitalesmx.online,https://clientes.serviciosdigitalesmx.online,http://localhost:3000,http://localhost:3001
      - key: APP_URL
        value: https://serviciosdigitalesmx.online
      - key: WEBHOOK_BASE_URL
        sync: false
      - key: BASE_DOMAIN
        value: serviciosdigitalesmx.online
      - key: SUPABASE_URL
        sync: false
      - key: SUPABASE_ANON_KEY
        sync: false
      - key: SUPABASE_SERVICE_ROLE_KEY
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: API_NAME
        value: Sdmx Backend API

---

## 16. Typecheck backend

.                                        | [WARN] Unsupported engine: wanted: {"node":"22.x"} (current: {"node":"v24.13.1","pnpm":"11.3.0"})
apps/web-admin                           | [WARN] Unsupported engine: wanted: {"node":"22.x"} (current: {"node":"v24.13.1","pnpm":"11.3.0"})
apps/web-clientes                        | [WARN] Unsupported engine: wanted: {"node":"22.x"} (current: {"node":"v24.13.1","pnpm":"11.3.0"})
apps/web-public                          | [WARN] Unsupported engine: wanted: {"node":"22.x"} (current: {"node":"v24.13.1","pnpm":"11.3.0"})
$ tsc --noEmit

---

## 17. Build backend

.                                        | [WARN] Unsupported engine: wanted: {"node":"22.x"} (current: {"node":"v24.13.1","pnpm":"11.3.0"})
apps/web-admin                           | [WARN] Unsupported engine: wanted: {"node":"22.x"} (current: {"node":"v24.13.1","pnpm":"11.3.0"})
apps/web-clientes                        | [WARN] Unsupported engine: wanted: {"node":"22.x"} (current: {"node":"v24.13.1","pnpm":"11.3.0"})
apps/web-public                          | [WARN] Unsupported engine: wanted: {"node":"22.x"} (current: {"node":"v24.13.1","pnpm":"11.3.0"})
$ tsc

---

FIN AUDITORÍA
