# AUDITORIA FASE SIGUIENTE
Fecha: miércoles,  3 de junio de 2026, 10:12:29 CST


---

## 1. Rutas sin tenantSlug

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

## 2. Uso de customers

apps/api/src/controllers/requests.ts:116:    let customerId: string | null = null;
apps/api/src/controllers/requests.ts:119:        .from('customers')
apps/api/src/controllers/requests.ts:135:      customerId = customerData.id;
apps/api/src/controllers/requests.ts:148:          customer_id: customerId,
apps/api/src/controllers/requests.ts:193:        customer_id: customerId,
apps/api/src/controllers/reports.ts:18:    let customersQuery = supabase.from('customers').select('id').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/catalogs.ts:163:      .from('customers')
apps/api/src/controllers/catalogs.ts:190:    const { data, error } = await supabase.from('customers').insert([{

---

## 3. Creación de órdenes

apps/api/src/controllers/orders.ts:160:const createOrderSchema = z.object({
apps/api/src/controllers/orders.ts:303:  const { error } = await supabase.from('service_order_documents').insert([row]);
apps/api/src/controllers/orders.ts:319:  const { error } = await supabase.from('service_order_events').insert([row]);
apps/api/src/controllers/orders.ts:344:  const statuses = config.statusOptions.service_orders ?? [];
apps/api/src/controllers/orders.ts:482:export const createOrder = async (req: Request, res: Response) => {
apps/api/src/controllers/orders.ts:490:    const validatedData = createOrderSchema.parse(req.body);
apps/api/src/controllers/orders.ts:512:      .from('service_orders')
apps/api/src/controllers/orders.ts:513:      .insert([
apps/api/src/controllers/orders.ts:556:    const { error: checklistError } = await supabase.from('service_order_checklists').insert([
apps/api/src/controllers/orders.ts:578:      .from('service_orders')
apps/api/src/controllers/orders.ts:659:      .from('service_orders')
apps/api/src/controllers/orders.ts:708:      .from('service_orders')
apps/api/src/controllers/orders.ts:809:      .from('service_orders')
apps/api/src/controllers/orders.ts:882:        .from('service_orders')
apps/api/src/controllers/orders.ts:889:        .from('service_orders')
apps/api/src/controllers/orders.ts:915:        .from('service_orders')
apps/api/src/controllers/orders.ts:942:        .from('service_orders')
apps/api/src/controllers/orders.ts:957:        .from('service_orders')
apps/api/src/controllers/orders.ts:1040:      .from('service_orders')
apps/api/src/controllers/orders.ts:1066:      .from('service_orders')
apps/api/src/controllers/orders.ts:1124:      .from('service_orders')
apps/api/src/controllers/orders.ts:1147:      .from('service_orders')
apps/api/src/controllers/orders.ts:1165:      .from('service_orders')
apps/api/src/controllers/orders.ts:1228:      .from('service_orders')
apps/api/src/controllers/orders.ts:1246:      .from('service_orders')
apps/api/src/controllers/orders.ts:1276:        .from('service_orders')
apps/api/src/controllers/orders.ts:1323:      .from('service_orders')
apps/api/src/controllers/orders.ts:1349:      .from('service_orders')
apps/api/src/controllers/orders.ts:1423:      .from('service_orders')
apps/api/src/controllers/orders.ts:1480:      .from('service_orders')
apps/api/src/controllers/orders.ts:1498:      .from('service_orders')
apps/api/src/controllers/orders.ts:1522:      .from('service_orders')
apps/api/src/controllers/requests.ts:120:        .insert([
apps/api/src/controllers/requests.ts:144:      .from('service_orders')
apps/api/src/controllers/requests.ts:145:      .insert([

---

## 4. organizations

apps/api/src/services/tenant-billing.ts:37:      .from('organizations')
apps/api/src/services/billing.ts:179:async function updateOrganizationSubscription(input: {
apps/api/src/services/billing.ts:185:    .from('organizations')
apps/api/src/services/billing.ts:192:      .from('organizations')
apps/api/src/services/billing.ts:204:  const { error } = await supabaseAdmin.from('organizations').insert([{
apps/api/src/services/billing.ts:322:    await updateOrganizationSubscription({
supabase/migrations/20260514133525_remote_schema.sql:565:create table "public"."organizations" (
supabase/migrations/20260514133525_remote_schema.sql:572:alter table "public"."organizations" enable row level security;
supabase/migrations/20260514133525_remote_schema.sql:633:CREATE UNIQUE INDEX organizations_pkey ON public.organizations USING btree (id);
supabase/migrations/20260514133525_remote_schema.sql:634:CREATE UNIQUE INDEX organizations_slug_key ON public.organizations USING btree (slug);
supabase/migrations/20260514133525_remote_schema.sql:637:alter table "public"."organizations" add constraint "organizations_pkey" PRIMARY KEY using index "organizations_pkey";
supabase/migrations/20260514133525_remote_schema.sql:639:alter table "public"."organizations" add constraint "organizations_slug_key" UNIQUE using index "organizations_slug_key";
supabase/migrations/20260514133525_remote_schema.sql:643:alter table "public"."profiles" add constraint "profiles_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES public.organizations(id) not valid;
supabase/migrations/20260514133525_remote_schema.sql:653:alter table "public"."customers" add constraint "customers_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE not valid;
supabase/migrations/20260514133525_remote_schema.sql:657:alter table "public"."service_orders" add constraint "service_orders_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE not valid;
supabase/migrations/20260514133525_remote_schema.sql:670:grant delete on table "public"."organizations" to "anon";
supabase/migrations/20260514133525_remote_schema.sql:671:grant insert on table "public"."organizations" to "anon";
supabase/migrations/20260514133525_remote_schema.sql:672:grant references on table "public"."organizations" to "anon";
supabase/migrations/20260514133525_remote_schema.sql:673:grant select on table "public"."organizations" to "anon";
supabase/migrations/20260514133525_remote_schema.sql:674:grant trigger on table "public"."organizations" to "anon";
supabase/migrations/20260514133525_remote_schema.sql:675:grant truncate on table "public"."organizations" to "anon";
supabase/migrations/20260514133525_remote_schema.sql:676:grant update on table "public"."organizations" to "anon";
supabase/migrations/20260514133525_remote_schema.sql:677:grant delete on table "public"."organizations" to "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:678:grant insert on table "public"."organizations" to "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:679:grant references on table "public"."organizations" to "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:680:grant select on table "public"."organizations" to "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:681:grant trigger on table "public"."organizations" to "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:682:grant truncate on table "public"."organizations" to "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:683:grant update on table "public"."organizations" to "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:684:grant delete on table "public"."organizations" to "service_role";
supabase/migrations/20260514133525_remote_schema.sql:685:grant insert on table "public"."organizations" to "service_role";
supabase/migrations/20260514133525_remote_schema.sql:686:grant references on table "public"."organizations" to "service_role";
supabase/migrations/20260514133525_remote_schema.sql:687:grant select on table "public"."organizations" to "service_role";
supabase/migrations/20260514133525_remote_schema.sql:688:grant trigger on table "public"."organizations" to "service_role";
supabase/migrations/20260514133525_remote_schema.sql:689:grant truncate on table "public"."organizations" to "service_role";
supabase/migrations/20260514133525_remote_schema.sql:690:grant update on table "public"."organizations" to "service_role";
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:15:  tenant_id uuid not null references public.organizations(id) on delete cascade,
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:50:  tenant_id uuid not null references public.organizations(id) on delete cascade,
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:70:  tenant_id uuid not null references public.organizations(id) on delete cascade,
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:87:  tenant_id uuid not null references public.organizations(id) on delete cascade,

---

## 5. tenants

apps/api/src/middleware/tenantCapabilities.ts:16:    loadTenantBillingSummary(tenantId, req.user?.tenantSlug ?? req.params.tenantSlug ?? null).catch(() => null),
apps/api/src/middleware/tenantCapabilities.ts:21:    tenantSlug: req.user?.tenantSlug ?? req.params.tenantSlug ?? null,
apps/api/src/middleware/validateTenant.ts:4:  const routeTenantSlug = req.params.tenantSlug ?? req.params.tenantId ?? req.params.tenant;
apps/api/src/middleware/validateTenant.ts:5:  const tokenTenantSlug = req.user?.tenantSlug ?? null;
apps/api/src/middleware/validateTenant.ts:8:  if (!tokenTenantSlug) {
apps/api/src/middleware/validateTenant.ts:12:  if (routeTenantSlug && routeTenantSlug !== tokenTenantSlug) {
apps/api/src/middleware/tenantResolver.ts:4:  const routeTenantSlug = req.params.tenantSlug ?? req.params.tenantId ?? req.params.tenant;
apps/api/src/middleware/tenantResolver.ts:6:  const tokenTenantSlug = req.user?.tenantSlug ?? null;
apps/api/src/middleware/tenantResolver.ts:8:  if (!tokenTenantSlug) {
apps/api/src/middleware/tenantResolver.ts:12:  if (routeTenantSlug && routeTenantSlug !== tokenTenantSlug) {
apps/api/src/middleware/auth.ts:134:        tenantSlug: claims.tenant_slug ?? null,
apps/api/src/middleware/tenantBilling.ts:6:  const tenantSlug = req.user?.tenantSlug ?? req.params.tenantSlug ?? null;
apps/api/src/middleware/tenantBilling.ts:7:  const masterTenantSlug = process.env.MASTER_TENANT_SLUG?.trim() ?? '';
apps/api/src/middleware/tenantBilling.ts:14:  if ((masterTenantSlug && tenantSlug && tenantSlug === masterTenantSlug) || (masterAccountEmail && req.user?.email && req.user.email === masterAccountEmail)) {
apps/api/src/middleware/tenantBilling.ts:19:    const billing = await loadTenantBillingSummary(tenantId, tenantSlug);
apps/api/src/middleware/tenantBilling.ts:29:        tenantSlug: billing.tenantSlug || null,
apps/api/src/types/express.d.ts:8:      tenantSlug: string | null;
apps/api/src/types/express.d.ts:39:        tenantSlug?: string | null;
apps/api/src/lib/scope.ts:11:  tenantSlug: string | null;
apps/api/src/lib/resolve-scope.ts:8:function resolveTenantSlug(req: Pick<Request, 'user' | 'params'>) {
apps/api/src/lib/resolve-scope.ts:9:  return req.user?.tenantSlug ?? (typeof req.params?.tenantSlug === 'string' ? req.params.tenantSlug : null);
apps/api/src/lib/resolve-scope.ts:23:  const tenantSlug = resolveTenantSlug(req);
apps/api/src/lib/resolve-scope.ts:32:      tenantSlug,
apps/api/src/lib/resolve-scope.ts:46:    tenantSlug,
apps/api/src/index.ts:108:app.use('/api/:tenantSlug/auth', authRouter); // Support for tenant-prefixed auth
apps/api/src/index.ts:110:app.use('/api/:tenantSlug/orders', ordersRouter);
apps/api/src/index.ts:112:app.use('/api/:tenantSlug/requests', requestsRouter);
apps/api/src/index.ts:115:app.use('/api/:tenantSlug/finance', financeRouter);
apps/api/src/index.ts:118:app.use('/api/:tenantSlug/customers', customersRouter);
apps/api/src/index.ts:121:app.use('/api/:tenantSlug/inventory', inventoryRouter);
apps/api/src/index.ts:123:app.use('/api/:tenantSlug/sucursales', sucursalesRouter);
apps/api/src/index.ts:125:app.use('/api/:tenantSlug/suppliers', suppliersRouter);
apps/api/src/index.ts:127:app.use('/api/:tenantSlug/purchase-orders', purchaseOrdersRouter);
apps/api/src/index.ts:129:app.use('/api/:tenantSlug/tasks', tasksRouter);
apps/api/src/index.ts:131:app.use('/api/:tenantSlug/users', usersRouter);
apps/api/src/index.ts:133:app.use('/api/:tenantSlug/security', securityRouter);
apps/api/src/index.ts:136:app.use('/api/:tenantSlug/procurement', procurementRouter);
apps/api/src/index.ts:138:app.use('/api/:tenantSlug/reports', reportsRouter);
apps/api/src/index.ts:140:app.use('/api/:tenantSlug/stock-alerts', stockAlertsRouter);
apps/api/src/index.ts:142:app.use('/api/:tenantSlug/pwa', pwaRouter);
apps/api/src/index.ts:144:app.use('/api/:tenantSlug/billing', billingRouter);
apps/api/src/controllers/meta.ts:76:      .from('tenants')
apps/api/src/controllers/meta.ts:94:        tenantSlug: tenantRow.slug,
apps/api/src/controllers/meta.ts:105:export const getTenantSettings = async (req: Request, res: Response) => {
apps/api/src/controllers/meta.ts:106:  const tenantSlug = req.params.tenantSlug;
apps/api/src/controllers/meta.ts:109:  if (!tenantSlug && !tenantId) {
apps/api/src/controllers/meta.ts:115:      .from('tenants')
apps/api/src/controllers/meta.ts:120:      : await query.eq('slug', tenantSlug).maybeSingle();
apps/api/src/controllers/meta.ts:130:      tenantSlug: data.slug,
apps/api/src/controllers/meta.ts:170:export const updateTenantSettings = async (req: Request, res: Response) => {
apps/api/src/controllers/meta.ts:171:  const tenantSlug = req.params.tenantSlug;
apps/api/src/controllers/meta.ts:174:  if (!tenantSlug && !tenantId) {
apps/api/src/controllers/meta.ts:180:      .from('tenants')
apps/api/src/controllers/meta.ts:185:      : await tenantQuery.eq('slug', tenantSlug).maybeSingle();
apps/api/src/controllers/meta.ts:216:        .from('tenants')
apps/api/src/controllers/meta.ts:487:      tenantSlug: data.slug,
apps/api/src/controllers/auth.controller.ts:101:      tenantSlug: tenant.slug ?? null,
apps/api/src/controllers/auth.controller.ts:182:      tenantSlug: tenant?.slug ?? tenant?.tenant_slug ?? null,
apps/api/src/controllers/auth.controller.ts:186:    const tenantSlug = tenant.slug ?? tenant.tenant_slug;
apps/api/src/controllers/auth.controller.ts:187:    if (!tenant?.tenant_id || !tenantSlug) {
apps/api/src/controllers/auth.controller.ts:191:    console.log('STEP_TENANT_OBTAINED', { tenantId: tenant.tenant_id, tenantSlug });
apps/api/src/controllers/auth.controller.ts:198:      tenant_slug: tenantSlug,
apps/api/src/controllers/auth.controller.ts:206:    const redirectUrl = `${appUrl}/onboarding/success?tenant=${encodeURIComponent(tenantSlug)}&token=${encodeURIComponent(token)}`;
apps/api/src/controllers/auth.controller.ts:214:      tenantSlug,
apps/api/src/controllers/auth.controller.ts:220:        slug: tenantSlug,
apps/api/src/controllers/auth.controller.ts:323:  const tenantSlug = tenant.slug ?? tenant.tenant_slug;
apps/api/src/controllers/auth.controller.ts:324:  if (!tenant?.tenant_id || !tenantSlug) {
apps/api/src/controllers/auth.controller.ts:327:  console.log('STEP_GOOGLE_TENANT_OBTAINED', { tenantId: tenant.tenant_id, tenantSlug });
apps/api/src/controllers/auth.controller.ts:330:    { id: tenant.tenant_id, slug: tenantSlug },
apps/api/src/controllers/auth.controller.ts:339:        slug: tenantSlug,
apps/api/src/controllers/auth.controller.ts:346:      redirectUrl: `${appUrl}/onboarding/success?tenant=${encodeURIComponent(tenantSlug)}&token=${encodeURIComponent(authPayload.token)}`,
apps/api/src/controllers/auth.controller.ts:408:    const { data: tenantSecurity, error: tenantSecurityError } = await supabaseAdmin
apps/api/src/controllers/auth.controller.ts:409:      .from('tenants')
apps/api/src/controllers/auth.controller.ts:414:    if (tenantSecurityError) {
apps/api/src/controllers/auth.controller.ts:415:      return res.status(502).json({ error: tenantSecurityError.message });
apps/api/src/controllers/auth.controller.ts:418:    if (!tenantSecurity) {
apps/api/src/controllers/auth.controller.ts:423:    if (tenantSecurity.require_admin_mfa && isAdminRole) {
apps/api/src/controllers/auth.controller.ts:428:        .eq('tenant_id', tenantSecurity.id)
apps/api/src/controllers/auth.controller.ts:443:      { id: tenantSecurity.id, slug: tenantSecurity.slug },
apps/api/src/controllers/auth.controller.ts:456:      .eq('tenant_id', tenantSecurity.id);
apps/api/src/controllers/auth.controller.ts:459:      tenant_id: tenantSecurity.id,
apps/api/src/controllers/auth.controller.ts:474:        id: tenantSecurity.id,
apps/api/src/controllers/auth.controller.ts:475:        slug: tenantSecurity.slug,
apps/api/src/controllers/auth.controller.ts:476:        name: tenantSecurity.name,
apps/api/src/controllers/orders.ts:327:    .from('tenants')
apps/api/src/controllers/security.ts:130:      .from('tenants')
apps/api/src/controllers/security.ts:366:      .from('tenants')
apps/api/src/controllers/security.ts:377:      .from('tenants')
apps/api/src/controllers/security.ts:535:      .from('tenants')
apps/api/src/controllers/security.ts:545:      .from('tenants')
apps/api/src/controllers/users.ts.bak.20260603_093424:61:async function resolveTenantSlug(tenantId: string) {
apps/api/src/controllers/users.ts.bak.20260603_093424:63:    .from('tenants')
apps/api/src/controllers/users.ts.bak.20260603_093424:195:    const tenantRow = await resolveTenantSlug(tenantId);
apps/api/src/controllers/users.ts:61:async function resolveTenantSlug(tenantId: string) {
apps/api/src/controllers/users.ts:63:    .from('tenants')
apps/api/src/controllers/users.ts:195:    const tenantRow = await resolveTenantSlug(tenantId);
apps/api/src/controllers/billing.ts:34:    tenantSlug: z.string().min(1),
apps/api/src/controllers/billing.ts:44:    const { tenantSlug, plan } = parsed.data;
apps/api/src/controllers/billing.ts:45:    const result = await createBillingCheckout(null, { plan, tenantSlug });
apps/api/src/controllers/public.ts:71:  tenantSlug: z.string().min(1),
apps/api/src/controllers/public.ts:86:  tenantSlug: z.string().min(1),
apps/api/src/controllers/public.ts:92:  tenantSlug: z.string().min(1),
apps/api/src/controllers/public.ts:98:    .from('tenants')
apps/api/src/controllers/public.ts:143:function normalizeLandingContent(input: unknown, tenantName: string, tenantSlug: string): Required<LandingContent> {
apps/api/src/controllers/public.ts:163:    seoDescription: content.seoDescription?.trim() || `Landing pública del taller ${tenantSlug}.`,
apps/api/src/controllers/public.ts:177:  tenantSlug: string,
apps/api/src/controllers/public.ts:179:  const normalized = normalizeLandingContent(rawLandingContent, tenantName, tenantSlug);
apps/api/src/controllers/public.ts:227:    const { tenantSlug, fullName, phone, email, deviceBrand, deviceModel, issue, deviceType, serialNumber, priorityLevel, passwordOrPin } = parsed.data;
apps/api/src/controllers/public.ts:229:    const tenant = await resolveTenantIdBySlug(tenantSlug);
apps/api/src/controllers/public.ts:291:    const { tenantSlug, folio, email } = parsed.data;
apps/api/src/controllers/public.ts:292:    const tenant = await resolveTenantIdBySlug(tenantSlug);
apps/api/src/controllers/public.ts:343:    const { tenantSlug, folio } = parsed.data;
apps/api/src/controllers/public.ts:344:    const tenant = await resolveTenantIdBySlug(tenantSlug);
apps/api/src/controllers/public.ts:508:  const tenantSlug = req.params.tenantSlug;
apps/api/src/controllers/public.ts:510:  if (!tenantSlug) {
apps/api/src/controllers/public.ts:515:    const tenant = await resolveTenantIdBySlug(tenantSlug);
apps/api/src/controllers/sucursales.ts:40:async function countTenantSucursales(tenantId: string) {
apps/api/src/controllers/sucursales.ts:94:      const currentSucursales = await countTenantSucursales(tenantId);
apps/api/src/routes/billing.ts:10:// Public checkout endpoint for customer-initiated purchases (tenantSlug must be provided)
apps/api/src/routes/public.ts:8:router.get('/tenant/:tenantSlug/landing', getPublicTenantLanding);
apps/api/src/routes/public.ts:9:router.get('/tenant/:tenantSlug/orders/:folio', getPublicPortalOrder);
apps/api/src/routes/auth.ts:5:import { getCurrentUser, resolveTenantForSupabaseUser, getTenantSettings, updateTenantSettings } from '../controllers/meta';
apps/api/src/routes/auth.ts:15:router.get('/tenant/:tenantSlug/settings', requireAuth, validateTenant, getTenantSettings);
apps/api/src/routes/auth.ts:16:router.put('/tenant/:tenantSlug/settings', requireAuth, validateTenant, updateTenantSettings);
apps/api/src/services/security-backoffice.ts:93:    .from('tenants')
apps/api/src/services/operational-risk.ts:1:import type { TenantRuntimeConfig, TenantSemaphoreRule, TenantWorkflowStatus } from '@white-label/types';
apps/api/src/services/operational-risk.ts:80:  rules: TenantSemaphoreRule[],
apps/api/src/services/operational-risk.ts:94:function resolveElapsedMinutes(order: OrderLike, metric: TenantSemaphoreRule['metric'], statusChangedAt: Date | null) {
apps/api/src/services/operational-risk.ts:117:function resolveThresholdColor(metric: TenantSemaphoreRule['metric'], elapsedMinutes: number | null, rule: TenantSemaphoreRule) {
apps/api/src/services/tenant-capabilities.ts:91:function getAccessStatus(billing: TenantBillingSummary | null | undefined, tenantSlug?: string | null, tenantEmail?: string | null): TenantCapabilities['access_status'] {
apps/api/src/services/tenant-capabilities.ts:92:  const masterTenantSlug = normalizeKey(process.env.MASTER_TENANT_SLUG);
apps/api/src/services/tenant-capabilities.ts:94:  if (tenantSlug && masterTenantSlug && normalizeKey(tenantSlug) === masterTenantSlug) return 'master';
apps/api/src/services/tenant-capabilities.ts:104:  tenantSlug,
apps/api/src/services/tenant-capabilities.ts:110:  tenantSlug?: string | null;
apps/api/src/services/tenant-capabilities.ts:116:  const accessStatus = getAccessStatus(billing, tenantSlug, tenantEmail);
apps/api/src/services/tenant-config.ts:8:  TenantSemaphoreRule,
apps/api/src/services/tenant-config.ts:60:  semaphoreRules: Array<Pick<TenantSemaphoreRule, 'industry_key' | 'workflow_key' | 'status_key' | 'metric' | 'green_until_minutes' | 'yellow_until_minutes' | 'red_after_minutes' | 'priority' | 'reason_template' | 'suggested_action_template' | 'action_key' | 'enabled' | 'metadata'>>;
apps/api/src/services/tenant-config.ts:90:  metric: TenantSemaphoreRule['metric'],
apps/api/src/services/tenant-config.ts:94:  extra: Partial<Pick<TenantSemaphoreRule, 'industry_key' | 'workflow_key' | 'priority' | 'action_key' | 'enabled' | 'metadata'>> = {},
apps/api/src/services/tenant-config.ts:578:  semaphoreRules: TenantSemaphoreRule[];
apps/api/src/services/tenant-config.ts:596:      .from('tenants')
apps/api/src/services/tenant-config.ts:683:  const semaphoreRules = (((semaphoreRulesResult.data as TenantSemaphoreRule[] | null) ?? []) as TenantSemaphoreRule[]).length > 0
apps/api/src/services/tenant-config.ts:684:    ? ((semaphoreRulesResult.data as TenantSemaphoreRule[] | null) ?? [])
apps/api/src/services/tenant-billing.ts:5:  tenantSlug: string;
apps/api/src/services/tenant-billing.ts:29:export async function loadTenantBillingSummary(tenantId: string, tenantSlug?: string | null): Promise<TenantBillingSummary> {
apps/api/src/services/tenant-billing.ts:32:      .from('tenants')
apps/api/src/services/tenant-billing.ts:47:  const resolvedTenantSlug = tenantSlug ?? tenantRow?.slug ?? organizationRow?.slug ?? null;
apps/api/src/services/tenant-billing.ts:59:    tenantSlug: resolvedTenantSlug ?? '',
apps/api/src/services/billing.ts:8:  tenantSlug?: string;
apps/api/src/services/billing.ts:27:    tenantSlug?: string;
apps/api/src/services/billing.ts:122:async function resolveTenantForCheckout(authUserId?: string | null, tenantSlug?: string) {
apps/api/src/services/billing.ts:123:  if (tenantSlug) {
apps/api/src/services/billing.ts:125:      .from('tenants')
apps/api/src/services/billing.ts:127:      .eq('slug', tenantSlug)
apps/api/src/services/billing.ts:163:    .from('tenants')
apps/api/src/services/billing.ts:181:  tenantSlug: string;
apps/api/src/services/billing.ts:206:    name: input.tenantSlug,
apps/api/src/services/billing.ts:207:    slug: input.tenantSlug,
apps/api/src/services/billing.ts:224:  const { userRow, tenantRow } = await resolveTenantForCheckout(authUserId, request.tenantSlug);
apps/api/src/services/billing.ts:246:      tenantSlug: tenantRow.slug,
apps/api/src/services/billing.ts:274:    tenantSlug: tenantRow.slug,
apps/api/src/services/billing.ts:317:  const tenantSlug = String(payment.metadata?.tenantSlug || '');
apps/api/src/services/billing.ts:324:      tenantSlug,
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:2:  tenant_id uuid primary key references public.tenants(id) on delete cascade,
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:38:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:69:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:98:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260515110000_restore_users_compat.sql:3:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260527070000_tenant_semaphore_rules.sql:3:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:3:alter table if exists public.tenants
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:13:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:34:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:25:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:113:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260527010000_align_service_requests_tenant_fk.sql:9:  references public.tenants(id)
supabase/migrations/20260523204000_restore_branches_table.sql:4:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260527050000_tenant_field_definitions_phase2.sql:3:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:18:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:32:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:93:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:3:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:24:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:46:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:60:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:77:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260514133525_remote_schema.sql:13:drop trigger if exists "trg_tenants_updated_at" on "public"."tenants";
supabase/migrations/20260514133525_remote_schema.sql:624:alter table "public"."tenants" drop column "contact_email";
supabase/migrations/20260514133525_remote_schema.sql:625:alter table "public"."tenants" drop column "contact_name";
supabase/migrations/20260514133525_remote_schema.sql:626:alter table "public"."tenants" drop column "contact_phone";
supabase/migrations/20260514133525_remote_schema.sql:627:alter table "public"."tenants" drop column "plan";
supabase/migrations/20260514133525_remote_schema.sql:628:alter table "public"."tenants" drop column "status";
supabase/migrations/20260514133525_remote_schema.sql:629:alter table "public"."tenants" drop column "updated_at";
supabase/migrations/20260514133525_remote_schema.sql:630:alter table "public"."tenants" add column "billing_exempt" boolean not null default false;
supabase/migrations/20260514133525_remote_schema.sql:631:alter table "public"."tenants" alter column "created_at" set default now();
supabase/migrations/20260514133525_remote_schema.sql:632:alter table "public"."tenants" enable row level security;
supabase/migrations/20260424_baseline_schema.sql:14:create table if not exists public.tenants (
supabase/migrations/20260424_baseline_schema.sql:28:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:44:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:60:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:75:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:97:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:131:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:145:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:157:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:177:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:186:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:211:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:232:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:242:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:264:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:278:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:295:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:305:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:327:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:343:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:356:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:365:drop trigger if exists trg_tenants_updated_at on public.tenants;
supabase/migrations/20260424_baseline_schema.sql:366:create trigger trg_tenants_updated_at
supabase/migrations/20260424_baseline_schema.sql:367:before update on public.tenants
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:25:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:106:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:47:alter table if exists public.tenants enable row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:68:alter table if exists public.tenants force row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:91:  if to_regclass('public.tenants') is not null then
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:92:    execute 'drop policy if exists tenants_select_same_tenant on public.tenants';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:94:      create policy tenants_select_same_tenant
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:95:      on public.tenants
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:101:    execute 'drop policy if exists tenants_insert_owner on public.tenants';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:103:      create policy tenants_insert_owner
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:104:      on public.tenants
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:110:    execute 'drop policy if exists tenants_update_owner on public.tenants';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:112:      create policy tenants_update_owner
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:113:      on public.tenants
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:120:    execute 'drop policy if exists tenants_delete_owner on public.tenants';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:122:      create policy tenants_delete_owner
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:123:      on public.tenants
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:612:  if to_regclass('public.tenants') is not null then
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:613:    grant select, insert, update, delete on public.tenants to authenticated;
supabase/migrations/20260602113500_restore_tenant_contact_columns.sql:1:alter table public.tenants
supabase/migrations/20260602113500_restore_tenant_contact_columns.sql:6:comment on column public.tenants.contact_name is 'Primary contact name for tenant onboarding and public pages.';
supabase/migrations/20260602113500_restore_tenant_contact_columns.sql:7:comment on column public.tenants.contact_email is 'Primary contact email for tenant onboarding and public pages.';
supabase/migrations/20260602113500_restore_tenant_contact_columns.sql:8:comment on column public.tenants.contact_phone is 'Primary contact phone for tenant onboarding and public pages.';
supabase/migrations/20260530132000_security_backoffice_tables.sql:3:alter table public.tenants
supabase/migrations/20260530132000_security_backoffice_tables.sql:14:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260530132000_security_backoffice_tables.sql:35:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260514150000_add_tenant_onboarding.sql:4:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260514150000_add_tenant_onboarding.sql:16:alter table public.tenants
supabase/migrations/20260514150000_add_tenant_onboarding.sql:23:update public.tenants
supabase/migrations/20260514150000_add_tenant_onboarding.sql:26:alter table public.tenants
supabase/migrations/20260514150000_add_tenant_onboarding.sql:28:alter table public.tenants
supabase/migrations/20260514150000_add_tenant_onboarding.sql:76:  while exists (select 1 from public.tenants where slug = v_slug) loop
supabase/migrations/20260514150000_add_tenant_onboarding.sql:80:  insert into public.tenants (
supabase/migrations/20260514150000_add_tenant_onboarding.sql:133:alter table public.tenants enable row level security;
supabase/migrations/20260514150000_add_tenant_onboarding.sql:134:drop policy if exists tenants_select_same_tenant on public.tenants;
supabase/migrations/20260514150000_add_tenant_onboarding.sql:135:create policy tenants_select_same_tenant
supabase/migrations/20260514150000_add_tenant_onboarding.sql:136:on public.tenants
supabase/migrations/20260514150000_add_tenant_onboarding.sql:139:drop policy if exists tenants_insert_owner on public.tenants;
supabase/migrations/20260514150000_add_tenant_onboarding.sql:140:create policy tenants_insert_owner
supabase/migrations/20260514150000_add_tenant_onboarding.sql:141:on public.tenants
supabase/migrations/20260514150000_add_tenant_onboarding.sql:144:drop policy if exists tenants_update_owner on public.tenants;
supabase/migrations/20260514150000_add_tenant_onboarding.sql:145:create policy tenants_update_owner
supabase/migrations/20260514150000_add_tenant_onboarding.sql:146:on public.tenants
supabase/migrations/20260514150000_add_tenant_onboarding.sql:156:drop policy if exists tenants_delete_owner on public.tenants;
supabase/migrations/20260514150000_add_tenant_onboarding.sql:157:create policy tenants_delete_owner
supabase/migrations/20260514150000_add_tenant_onboarding.sql:158:on public.tenants
supabase/migrations/20260530150000_add_pwa_push_subscriptions.sql:3:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260523190000_order_documents_events.sql:3:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260523190000_order_documents_events.sql:20:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260523193000_tenant_landing_content.sql:1:alter table public.tenants
supabase/migrations/20260523193000_tenant_landing_content.sql:21:update public.tenants
supabase/migrations/20260523193000_tenant_landing_content.sql:60:alter table public.tenants
supabase/migrations/20260523193000_tenant_landing_content.sql:61:  drop constraint if exists tenants_landing_content_is_object;
supabase/migrations/20260523193000_tenant_landing_content.sql:62:alter table public.tenants
supabase/migrations/20260523193000_tenant_landing_content.sql:63:  add constraint tenants_landing_content_is_object

---

## 6. service_order_status_history

supabase/migrations/20260530193000_audit_hardening_multitenant.sql:16:create table if not exists public.service_order_status_history (
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:27:create index if not exists service_order_status_history_tenant_order_idx
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:28:  on public.service_order_status_history (tenant_id, service_order_id, created_at desc);
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:129:    insert into public.service_order_status_history (
supabase/migrations/20260514133525_remote_schema.sql:273:revoke delete on table "public"."service_order_status_history" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:274:revoke insert on table "public"."service_order_status_history" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:275:revoke references on table "public"."service_order_status_history" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:276:revoke select on table "public"."service_order_status_history" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:277:revoke trigger on table "public"."service_order_status_history" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:278:revoke truncate on table "public"."service_order_status_history" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:279:revoke update on table "public"."service_order_status_history" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:280:revoke delete on table "public"."service_order_status_history" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:281:revoke insert on table "public"."service_order_status_history" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:282:revoke references on table "public"."service_order_status_history" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:283:revoke select on table "public"."service_order_status_history" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:284:revoke trigger on table "public"."service_order_status_history" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:285:revoke truncate on table "public"."service_order_status_history" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:286:revoke update on table "public"."service_order_status_history" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:287:revoke delete on table "public"."service_order_status_history" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:288:revoke insert on table "public"."service_order_status_history" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:289:revoke references on table "public"."service_order_status_history" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:290:revoke select on table "public"."service_order_status_history" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:291:revoke trigger on table "public"."service_order_status_history" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:292:revoke truncate on table "public"."service_order_status_history" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:293:revoke update on table "public"."service_order_status_history" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:461:alter table "public"."service_order_status_history" drop constraint "service_order_status_history_changed_by_fkey";
supabase/migrations/20260514133525_remote_schema.sql:462:alter table "public"."service_order_status_history" drop constraint "service_order_status_history_service_order_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:463:alter table "public"."service_order_status_history" drop constraint "service_order_status_history_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:502:alter table "public"."service_order_status_history" drop constraint "service_order_status_history_pkey";
supabase/migrations/20260514133525_remote_schema.sql:530:drop index if exists "public"."service_order_status_history_order_idx";
supabase/migrations/20260514133525_remote_schema.sql:531:drop index if exists "public"."service_order_status_history_pkey";
supabase/migrations/20260514133525_remote_schema.sql:558:drop table "public"."service_order_status_history";
supabase/migrations/20260424_baseline_schema.sql:143:create table if not exists public.service_order_status_history (
supabase/migrations/20260424_baseline_schema.sql:153:create index if not exists service_order_status_history_order_idx
supabase/migrations/20260424_baseline_schema.sql:154:  on public.service_order_status_history (service_order_id, created_at desc);

---

## 7. service_order_events

apps/api/src/controllers/orders.ts:319:  const { error } = await supabase.from('service_order_events').insert([row]);
apps/api/src/controllers/orders.ts:321:    throw new Error(`Failed to persist service_order_events: ${error.message}`);
apps/api/src/controllers/orders.ts:730:        .from('service_order_events')
apps/api/src/controllers/public.ts:372:      .from('service_order_events')
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:53:alter table if exists public.service_order_events enable row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:74:alter table if exists public.service_order_events force row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:288:  if to_regclass('public.service_order_events') is not null then
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:289:    execute 'drop policy if exists service_order_events_select on public.service_order_events';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:291:      create policy service_order_events_select
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:292:      on public.service_order_events
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:297:    execute 'drop policy if exists service_order_events_write_owner_manager on public.service_order_events';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:299:      create policy service_order_events_write_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:300:      on public.service_order_events
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:648:  if to_regclass('public.service_order_events') is not null then
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:649:    grant select, insert, update, delete on public.service_order_events to authenticated;
supabase/migrations/20260523190000_order_documents_events.sql:18:create table if not exists public.service_order_events (
supabase/migrations/20260523190000_order_documents_events.sql:30:create index if not exists service_order_events_tenant_order_idx
supabase/migrations/20260523190000_order_documents_events.sql:31:  on public.service_order_events (tenant_id, service_order_id, created_at desc);
supabase/migrations/20260523190000_order_documents_events.sql:33:alter table public.service_order_events enable row level security;
supabase/migrations/20260523190000_order_documents_events.sql:45:drop policy if exists service_order_events_select on public.service_order_events;
supabase/migrations/20260523190000_order_documents_events.sql:46:create policy service_order_events_select
supabase/migrations/20260523190000_order_documents_events.sql:47:on public.service_order_events
supabase/migrations/20260523190000_order_documents_events.sql:50:drop policy if exists service_order_events_write_owner_manager on public.service_order_events;
supabase/migrations/20260523190000_order_documents_events.sql:51:create policy service_order_events_write_owner_manager
supabase/migrations/20260523190000_order_documents_events.sql:52:on public.service_order_events

---

## 8. evidence_metadata

apps/api/src/controllers/orders.ts:580:        evidence_metadata: appendEvidenceEntry(data.evidence_metadata, {
apps/api/src/controllers/orders.ts:757:    const evidenceMetadata = readEvidenceMetadata(orderResult.data.evidence_metadata);
apps/api/src/controllers/orders.ts:810:      .select('id, tenant_id, evidence_metadata')
apps/api/src/controllers/orders.ts:883:        .select('evidence_metadata')
apps/api/src/controllers/orders.ts:891:          evidence_metadata: appendEvidenceEntry(latestDocumentEvidence?.evidence_metadata, {
apps/api/src/controllers/orders.ts:943:        .select('evidence_metadata')
apps/api/src/controllers/orders.ts:960:          evidence_metadata: appendEvidenceEntry(latestReceiptOrder?.evidence_metadata, {
apps/api/src/controllers/orders.ts:1041:      .select('id, status, evidence_metadata')
apps/api/src/controllers/orders.ts:1067:      .update({ evidence_metadata: appendEvidenceEntry((order as { evidence_metadata?: unknown }).evidence_metadata, noteEntry) })
apps/api/src/controllers/orders.ts:1125:      .select('id, status, evidence_metadata')
apps/api/src/controllers/orders.ts:1167:        evidence_metadata: appendEvidenceEntry(data.evidence_metadata, {
apps/api/src/controllers/orders.ts:1229:      .select('id, estimated_cost, final_cost, evidence_metadata')
apps/api/src/controllers/orders.ts:1278:          evidence_metadata: appendEvidenceEntry((order as { evidence_metadata?: unknown }).evidence_metadata, noteEntry),
apps/api/src/controllers/orders.ts:1481:      .select('id, warranty_until, evidence_metadata')
apps/api/src/controllers/orders.ts:1524:        evidence_metadata: appendEvidenceEntry(order.evidence_metadata, {
apps/api/src/controllers/public.ts:351:      .select('id, tenant_id, folio, status, created_at, updated_at, promised_date, device_info, problem_description, serial_number, receipt_url, estimated_cost, final_cost, evidence_metadata, metadata')
apps/api/src/controllers/public.ts:382:    const evidenceMetadata = Array.isArray(data.evidence_metadata) ? data.evidence_metadata : [];
supabase/migrations/20260514133525_remote_schema.sql:614:alter table "public"."service_orders" add column "evidence_metadata" jsonb default '[]'::jsonb;

---

## 9. Evidencias dedicadas

apps/api/src/controllers/meta.ts:255:        .from('tenant_industry_profiles')
apps/api/src/controllers/orders.ts:13:const encodedFileSchema = z.object({
apps/api/src/controllers/orders.ts:17:  fileType: z.enum(['intake_photo', 'attachment_pdf']),
apps/api/src/controllers/orders.ts:20:const attachmentRequestSchema = z.object({
apps/api/src/controllers/orders.ts:21:  files: z.array(encodedFileSchema).min(1),
apps/api/src/controllers/orders.ts:52:type EvidenceEntry =
apps/api/src/controllers/orders.ts:57:      file_type: 'intake_photo' | 'attachment_pdf' | 'receipt_pdf';
apps/api/src/controllers/orders.ts:143:function buildPdfAttachment(receiptUrl?: string | null) {
apps/api/src/controllers/orders.ts:217:function readEvidenceMetadata(input: unknown): EvidenceEntry[] {
apps/api/src/controllers/orders.ts:221:  return input.filter(Boolean) as EvidenceEntry[];
apps/api/src/controllers/orders.ts:224:function appendEvidenceEntry(input: unknown, entry: EvidenceEntry) {
apps/api/src/controllers/orders.ts:225:  return [...readEvidenceMetadata(input), entry];
apps/api/src/controllers/orders.ts:228:function normalizeOrderDocuments(rows: OrderDocumentRow[] | null | undefined, metadata: EvidenceEntry[]) {
apps/api/src/controllers/orders.ts:240:    .filter((entry): entry is Extract<EvidenceEntry, { kind: 'document' }> => entry.kind === 'document')
apps/api/src/controllers/orders.ts:259:function normalizeOrderEvents(rows: OrderEventRow[] | null | undefined, metadata: EvidenceEntry[]) {
apps/api/src/controllers/orders.ts:271:    .filter((entry): entry is Extract<EvidenceEntry, { kind: 'event' }> => entry.kind === 'event')
apps/api/src/controllers/orders.ts:447:    fileSizeLimit: 52428800,
apps/api/src/controllers/orders.ts:461:  fileType: 'intake_photo' | 'attachment_pdf' | 'receipt_pdf';
apps/api/src/controllers/orders.ts:580:        evidence_metadata: appendEvidenceEntry(data.evidence_metadata, {
apps/api/src/controllers/orders.ts:605:    const pdfAttachment = buildPdfAttachment(validatedData.receiptUrl || null);
apps/api/src/controllers/orders.ts:631:        pdf_attachment: pdfAttachment,
apps/api/src/controllers/orders.ts:632:        attachments: pdfAttachment ? [pdfAttachment] : [],
apps/api/src/controllers/orders.ts:757:    const evidenceMetadata = readEvidenceMetadata(orderResult.data.evidence_metadata);
apps/api/src/controllers/orders.ts:758:    const documents = normalizeOrderDocuments(documentsResult.data ?? [], evidenceMetadata);
apps/api/src/controllers/orders.ts:759:    const events = normalizeOrderEvents(eventsResult.data ?? [], evidenceMetadata);
apps/api/src/controllers/orders.ts:770:    const pdfAttachment = buildPdfAttachment(
apps/api/src/controllers/orders.ts:785:        pdf_attachment: pdfAttachment,
apps/api/src/controllers/orders.ts:786:        attachments: pdfAttachment ? [pdfAttachment] : [],
apps/api/src/controllers/orders.ts:795:export const uploadOrderAttachments = async (req: Request, res: Response) => {
apps/api/src/controllers/orders.ts:805:    const parsed = attachmentRequestSchema.parse(req.body);
apps/api/src/controllers/orders.ts:810:      .select('id, tenant_id, evidence_metadata')
apps/api/src/controllers/orders.ts:829:    for (const file of parsed.files) {
apps/api/src/controllers/orders.ts:842:          error: 'Failed to upload attachment',
apps/api/src/controllers/orders.ts:881:      const { data: latestDocumentEvidence } = await supabase
apps/api/src/controllers/orders.ts:883:        .select('evidence_metadata')
apps/api/src/controllers/orders.ts:891:          evidence_metadata: appendEvidenceEntry(latestDocumentEvidence?.evidence_metadata, {
apps/api/src/controllers/orders.ts:943:        .select('evidence_metadata')
apps/api/src/controllers/orders.ts:950:          error: 'Failed to persist receipt evidence',
apps/api/src/controllers/orders.ts:960:          evidence_metadata: appendEvidenceEntry(latestReceiptOrder?.evidence_metadata, {
apps/api/src/controllers/orders.ts:1010:      // receipt evidence is appended in the single update above to avoid duplicate writes
apps/api/src/controllers/orders.ts:1021:    console.error('Error uploading attachments:', error);
apps/api/src/controllers/orders.ts:1041:      .select('id, status, evidence_metadata')
apps/api/src/controllers/orders.ts:1054:    const noteEntry: EvidenceEntry = {
apps/api/src/controllers/orders.ts:1067:      .update({ evidence_metadata: appendEvidenceEntry((order as { evidence_metadata?: unknown }).evidence_metadata, noteEntry) })
apps/api/src/controllers/orders.ts:1125:      .select('id, status, evidence_metadata')
apps/api/src/controllers/orders.ts:1167:        evidence_metadata: appendEvidenceEntry(data.evidence_metadata, {
apps/api/src/controllers/orders.ts:1229:      .select('id, estimated_cost, final_cost, evidence_metadata')
apps/api/src/controllers/orders.ts:1278:          evidence_metadata: appendEvidenceEntry((order as { evidence_metadata?: unknown }).evidence_metadata, noteEntry),
apps/api/src/controllers/orders.ts:1481:      .select('id, warranty_until, evidence_metadata')
apps/api/src/controllers/orders.ts:1524:        evidence_metadata: appendEvidenceEntry(order.evidence_metadata, {
apps/api/src/controllers/public.ts:6:type PdfAttachment = {
apps/api/src/controllers/public.ts:203:function buildPdfAttachment(receiptUrl?: string | null): PdfAttachment | null {
apps/api/src/controllers/public.ts:351:      .select('id, tenant_id, folio, status, created_at, updated_at, promised_date, device_info, problem_description, serial_number, receipt_url, estimated_cost, final_cost, evidence_metadata, metadata')
apps/api/src/controllers/public.ts:382:    const evidenceMetadata = Array.isArray(data.evidence_metadata) ? data.evidence_metadata : [];
apps/api/src/controllers/public.ts:383:    const metadataDocuments = evidenceMetadata
apps/api/src/controllers/public.ts:390:          file_type: String(document.file_type ?? 'attachment_pdf'),
apps/api/src/controllers/public.ts:397:    const metadataEvents = evidenceMetadata
apps/api/src/controllers/public.ts:439:    const pdfAttachment = buildPdfAttachment(data.receipt_url || receiptDocument?.public_url || null);
apps/api/src/controllers/public.ts:491:        pdf_attachment: pdfAttachment,
apps/api/src/controllers/public.ts:492:        attachments: pdfAttachment ? [pdfAttachment] : [],
apps/api/src/routes/orders.ts:8:import { addOrderMessage, addOrderNote, createOrder, getOrderById, getOrderChecklist, listOrders, updateOrderChecklist, updateOrderDetails, updateOrderFinancials, updateOrderStatus, updateOrderWarranty, uploadOrderAttachments } from '../controllers/orders';
apps/api/src/routes/orders.ts:24:router.post('/:id/attachments', requireTenantModule('documents'), uploadOrderAttachments);
apps/api/src/services/tenant-config.ts:601:      .from('tenant_industry_profiles')
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:1:create table if not exists public.tenant_industry_profiles (
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:18:create index if not exists tenant_industry_profiles_industry_key_idx
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:19:  on public.tenant_industry_profiles (industry_key);
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:21:alter table public.tenant_industry_profiles enable row level security;
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:23:drop policy if exists tenant_industry_profiles_select on public.tenant_industry_profiles;
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:24:create policy tenant_industry_profiles_select
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:25:on public.tenant_industry_profiles
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:29:drop policy if exists tenant_industry_profiles_write on public.tenant_industry_profiles;
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:30:create policy tenant_industry_profiles_write
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:31:on public.tenant_industry_profiles
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:130:drop trigger if exists trg_tenant_industry_profiles_updated_at on public.tenant_industry_profiles;
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:131:create trigger trg_tenant_industry_profiles_updated_at
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:132:before update on public.tenant_industry_profiles
supabase/migrations/20260514133525_remote_schema.sql:573:create table "public"."profiles" (
supabase/migrations/20260514133525_remote_schema.sql:582:alter table "public"."profiles" enable row level security;
supabase/migrations/20260514133525_remote_schema.sql:614:alter table "public"."service_orders" add column "evidence_metadata" jsonb default '[]'::jsonb;
supabase/migrations/20260514133525_remote_schema.sql:635:CREATE UNIQUE INDEX profiles_email_key ON public.profiles USING btree (email);
supabase/migrations/20260514133525_remote_schema.sql:636:CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);
supabase/migrations/20260514133525_remote_schema.sql:638:alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";
supabase/migrations/20260514133525_remote_schema.sql:640:alter table "public"."profiles" add constraint "profiles_email_key" UNIQUE using index "profiles_email_key";
supabase/migrations/20260514133525_remote_schema.sql:641:alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;
supabase/migrations/20260514133525_remote_schema.sql:642:alter table "public"."profiles" validate constraint "profiles_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:643:alter table "public"."profiles" add constraint "profiles_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES public.organizations(id) not valid;
supabase/migrations/20260514133525_remote_schema.sql:644:alter table "public"."profiles" validate constraint "profiles_organization_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:645:alter table "public"."profiles" add constraint "profiles_role_check" CHECK ((role = ANY (ARRAY['owner'::text, 'admin'::text, 'tech'::text]))) not valid;
supabase/migrations/20260514133525_remote_schema.sql:646:alter table "public"."profiles" validate constraint "profiles_role_check";
supabase/migrations/20260514133525_remote_schema.sql:691:grant delete on table "public"."profiles" to "anon";
supabase/migrations/20260514133525_remote_schema.sql:692:grant insert on table "public"."profiles" to "anon";
supabase/migrations/20260514133525_remote_schema.sql:693:grant references on table "public"."profiles" to "anon";
supabase/migrations/20260514133525_remote_schema.sql:694:grant select on table "public"."profiles" to "anon";
supabase/migrations/20260514133525_remote_schema.sql:695:grant trigger on table "public"."profiles" to "anon";
supabase/migrations/20260514133525_remote_schema.sql:696:grant truncate on table "public"."profiles" to "anon";
supabase/migrations/20260514133525_remote_schema.sql:697:grant update on table "public"."profiles" to "anon";
supabase/migrations/20260514133525_remote_schema.sql:698:grant delete on table "public"."profiles" to "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:699:grant insert on table "public"."profiles" to "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:700:grant references on table "public"."profiles" to "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:701:grant select on table "public"."profiles" to "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:702:grant trigger on table "public"."profiles" to "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:703:grant truncate on table "public"."profiles" to "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:704:grant update on table "public"."profiles" to "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:705:grant delete on table "public"."profiles" to "service_role";
supabase/migrations/20260514133525_remote_schema.sql:706:grant insert on table "public"."profiles" to "service_role";
supabase/migrations/20260514133525_remote_schema.sql:707:grant references on table "public"."profiles" to "service_role";
supabase/migrations/20260514133525_remote_schema.sql:708:grant select on table "public"."profiles" to "service_role";
supabase/migrations/20260514133525_remote_schema.sql:709:grant trigger on table "public"."profiles" to "service_role";
supabase/migrations/20260514133525_remote_schema.sql:710:grant truncate on table "public"."profiles" to "service_role";
supabase/migrations/20260514133525_remote_schema.sql:711:grant update on table "public"."profiles" to "service_role";
supabase/migrations/20260514133525_remote_schema.sql:717:using ((tenant_id = ( SELECT profiles.organization_id
supabase/migrations/20260514133525_remote_schema.sql:718:   FROM public.profiles
supabase/migrations/20260514133525_remote_schema.sql:719:  WHERE (profiles.id = auth.uid()))));
supabase/migrations/20260514133525_remote_schema.sql:721:  on "public"."profiles"
supabase/migrations/20260514133525_remote_schema.sql:725:using ((organization_id = ( SELECT profiles_1.organization_id
supabase/migrations/20260514133525_remote_schema.sql:726:   FROM public.profiles profiles_1
supabase/migrations/20260514133525_remote_schema.sql:727:  WHERE (profiles_1.id = auth.uid()))));
supabase/migrations/20260514133525_remote_schema.sql:733:using ((tenant_id = ( SELECT profiles.organization_id
supabase/migrations/20260514133525_remote_schema.sql:734:   FROM public.profiles
supabase/migrations/20260514133525_remote_schema.sql:735:  WHERE (profiles.id = auth.uid()))));

---

## 10. Foreign Keys service_orders

supabase/migrations/20260530143000_add_public_token_to_service_orders.sql:1:alter table if exists public.service_orders
supabase/migrations/20260530143000_add_public_token_to_service_orders.sql:4:update public.service_orders
supabase/migrations/20260530143000_add_public_token_to_service_orders.sql:8:alter table public.service_orders
supabase/migrations/20260530143000_add_public_token_to_service_orders.sql:11:alter table public.service_orders
supabase/migrations/20260530143000_add_public_token_to_service_orders.sql:14:create unique index if not exists service_orders_tenant_public_token_uidx
supabase/migrations/20260530143000_add_public_token_to_service_orders.sql:15:  on public.service_orders (tenant_id, public_token);
supabase/migrations/20260603095001_drop_total_cost_from_service_orders.sql:3:-- 1) service_orders.final_cost is the canonical charged amount.
supabase/migrations/20260603095001_drop_total_cost_from_service_orders.sql:4:-- 2) service_orders.estimated_cost is the quote/estimate.
supabase/migrations/20260603095001_drop_total_cost_from_service_orders.sql:7:alter table public.service_orders
supabase/migrations/20260603095001_drop_total_cost_from_service_orders.sql:8:  drop constraint if exists service_orders_total_cost_check;
supabase/migrations/20260603095001_drop_total_cost_from_service_orders.sql:10:alter table public.service_orders
supabase/migrations/20260530121000_add_assigned_user_to_service_orders.sql:3:alter table public.service_orders
supabase/migrations/20260530121000_add_assigned_user_to_service_orders.sql:6:create index if not exists service_orders_tenant_assigned_idx
supabase/migrations/20260530121000_add_assigned_user_to_service_orders.sql:7:  on public.service_orders (tenant_id, assigned_user_id, created_at desc);
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:20:-- service_orders
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:21:alter table if exists public.service_orders
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:24:update public.service_orders
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:29:create index if not exists service_orders_tenant_sucursal_idx
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:30:  on public.service_orders (tenant_id, sucursal_id);
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:32:alter table public.service_orders
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:33:  drop constraint if exists service_orders_sucursal_id_fkey;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:35:alter table public.service_orders
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:36:  add constraint service_orders_sucursal_id_fkey
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:41:drop trigger if exists trg_service_orders_sync_sucursal_branch on public.service_orders;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:42:create trigger trg_service_orders_sync_sucursal_branch
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:43:before insert or update on public.service_orders
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:11:  default_workflow_key text not null default 'service_orders',
supabase/migrations/20260527050000_tenant_field_definitions_phase2.sql:42:alter table public.service_orders
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:13:create index if not exists service_orders_tenant_promised_status_idx
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:14:  on public.service_orders (tenant_id, promised_date, status);
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:19:  service_order_id uuid not null references public.service_orders(id) on delete cascade,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:35:  service_order_id uuid references public.service_orders(id) on delete set null,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:95:  service_order_id uuid references public.service_orders(id) on delete set null,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:197:drop trigger if exists trg_service_orders_status_audit_and_payment on public.service_orders;
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:198:create trigger trg_service_orders_status_audit_and_payment
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:199:after update of status on public.service_orders
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:8:update public.service_orders
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:25:drop trigger if exists trg_service_orders_sync_sucursal_branch on public.service_orders;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:31:alter table public.service_orders
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:32:  drop constraint if exists service_orders_branch_id_fkey;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:44:alter table public.service_orders
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:27:  related_service_order_id uuid references public.service_orders(id) on delete set null,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:63:  service_order_id uuid references public.service_orders(id) on delete set null,
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:17:drop trigger if exists trg_service_orders_sync_sucursal_branch on public.service_orders;
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:23:alter table public.service_orders
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:24:  drop constraint if exists service_orders_branch_id_fkey;
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:36:alter table public.service_orders
supabase/migrations/20260525021500_relax_service_order_status_constraint.sql:1:alter table public.service_orders
supabase/migrations/20260525021500_relax_service_order_status_constraint.sql:2:  drop constraint if exists service_orders_status_check;
supabase/migrations/20260525021500_relax_service_order_status_constraint.sql:4:alter table public.service_orders
supabase/migrations/20260525021500_relax_service_order_status_constraint.sql:5:  add constraint service_orders_status_check
supabase/migrations/20260514133525_remote_schema.sql:9:drop trigger if exists "trg_service_orders_updated_at" on "public"."service_orders";
supabase/migrations/20260514133525_remote_schema.sql:30:drop policy "service_orders_delete_owner_manager" on "public"."service_orders";
supabase/migrations/20260514133525_remote_schema.sql:31:drop policy "service_orders_select" on "public"."service_orders";
supabase/migrations/20260514133525_remote_schema.sql:32:drop policy "service_orders_update_owner_manager" on "public"."service_orders";
supabase/migrations/20260514133525_remote_schema.sql:33:drop policy "service_orders_update_technician" on "public"."service_orders";
supabase/migrations/20260514133525_remote_schema.sql:34:drop policy "service_orders_write_owner_manager" on "public"."service_orders";
supabase/migrations/20260514133525_remote_schema.sql:464:alter table "public"."service_orders" drop constraint "service_orders_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:465:alter table "public"."service_orders" drop constraint "service_orders_created_by_fkey";
supabase/migrations/20260514133525_remote_schema.sql:466:alter table "public"."service_orders" drop constraint "service_orders_service_request_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:467:alter table "public"."service_orders" drop constraint "service_orders_updated_by_fkey";
supabase/migrations/20260514133525_remote_schema.sql:488:alter table "public"."service_orders" drop constraint "service_orders_customer_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:489:alter table "public"."service_orders" drop constraint "service_orders_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:532:drop index if exists "public"."service_orders_tenant_branch_idx";
supabase/migrations/20260514133525_remote_schema.sql:533:drop index if exists "public"."service_orders_tenant_folio_uidx";
supabase/migrations/20260514133525_remote_schema.sql:534:drop index if exists "public"."service_orders_tenant_status_idx";
supabase/migrations/20260514133525_remote_schema.sql:592:alter table "public"."service_orders" drop column "archived_at";
supabase/migrations/20260514133525_remote_schema.sql:593:alter table "public"."service_orders" drop column "branch_id";
supabase/migrations/20260514133525_remote_schema.sql:594:alter table "public"."service_orders" drop column "caso_resolucion_tecnica";
supabase/migrations/20260514133525_remote_schema.sql:595:alter table "public"."service_orders" drop column "completed_at";
supabase/migrations/20260514133525_remote_schema.sql:596:alter table "public"."service_orders" drop column "created_by";
supabase/migrations/20260514133525_remote_schema.sql:597:alter table "public"."service_orders" drop column "delivered_at";
supabase/migrations/20260514133525_remote_schema.sql:598:alter table "public"."service_orders" drop column "device_brand";
supabase/migrations/20260514133525_remote_schema.sql:599:alter table "public"."service_orders" drop column "device_model";
supabase/migrations/20260514133525_remote_schema.sql:600:alter table "public"."service_orders" drop column "device_type";
supabase/migrations/20260514133525_remote_schema.sql:601:alter table "public"."service_orders" drop column "estimated_cost";
supabase/migrations/20260514133525_remote_schema.sql:602:alter table "public"."service_orders" drop column "final_cost";
supabase/migrations/20260514133525_remote_schema.sql:603:alter table "public"."service_orders" drop column "folio";
supabase/migrations/20260514133525_remote_schema.sql:604:alter table "public"."service_orders" drop column "internal_diagnosis";
supabase/migrations/20260514133525_remote_schema.sql:605:alter table "public"."service_orders" drop column "priority";
supabase/migrations/20260514133525_remote_schema.sql:606:alter table "public"."service_orders" drop column "promised_date";
supabase/migrations/20260514133525_remote_schema.sql:607:alter table "public"."service_orders" drop column "received_at";
supabase/migrations/20260514133525_remote_schema.sql:608:alter table "public"."service_orders" drop column "reported_issue";
supabase/migrations/20260514133525_remote_schema.sql:609:alter table "public"."service_orders" drop column "service_request_id";
supabase/migrations/20260514133525_remote_schema.sql:610:alter table "public"."service_orders" drop column "updated_at";
supabase/migrations/20260514133525_remote_schema.sql:611:alter table "public"."service_orders" drop column "updated_by";
supabase/migrations/20260514133525_remote_schema.sql:612:alter table "public"."service_orders" add column "accessories" text;
supabase/migrations/20260514133525_remote_schema.sql:613:alter table "public"."service_orders" add column "device_info" jsonb not null;
supabase/migrations/20260514133525_remote_schema.sql:614:alter table "public"."service_orders" add column "evidence_metadata" jsonb default '[]'::jsonb;
supabase/migrations/20260514133525_remote_schema.sql:615:alter table "public"."service_orders" add column "internal_notes" text;
supabase/migrations/20260514133525_remote_schema.sql:616:alter table "public"."service_orders" add column "problem_description" text not null;
supabase/migrations/20260514133525_remote_schema.sql:617:alter table "public"."service_orders" add column "total_cost" numeric(12,2) default 0;
supabase/migrations/20260514133525_remote_schema.sql:618:alter table "public"."service_orders" add column "warranty_until" timestamp with time zone;
supabase/migrations/20260514133525_remote_schema.sql:619:alter table "public"."service_orders" alter column "created_at" set default now();
supabase/migrations/20260514133525_remote_schema.sql:620:alter table "public"."service_orders" alter column "created_at" drop not null;
supabase/migrations/20260514133525_remote_schema.sql:621:alter table "public"."service_orders" alter column "id" set default extensions.uuid_generate_v4();
supabase/migrations/20260514133525_remote_schema.sql:622:alter table "public"."service_orders" alter column "status" set default 'pending'::text;
supabase/migrations/20260514133525_remote_schema.sql:623:alter table "public"."service_orders" alter column "status" drop not null;
supabase/migrations/20260514133525_remote_schema.sql:647:alter table "public"."service_orders" add constraint "check_device_info_structure" CHECK (((device_info ? 'brand'::text) AND (device_info ? 'model'::text))) not valid;
supabase/migrations/20260514133525_remote_schema.sql:648:alter table "public"."service_orders" validate constraint "check_device_info_structure";
supabase/migrations/20260514133525_remote_schema.sql:649:alter table "public"."service_orders" add constraint "service_orders_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'diagnosing'::text, 'waiting_parts'::text, 'ready'::text, 'delivered'::text, 'cancelled'::text]))) not valid;
supabase/migrations/20260514133525_remote_schema.sql:650:alter table "public"."service_orders" validate constraint "service_orders_status_check";
supabase/migrations/20260514133525_remote_schema.sql:651:alter table "public"."service_orders" add constraint "service_orders_total_cost_check" CHECK ((total_cost >= (0)::numeric)) not valid;
supabase/migrations/20260514133525_remote_schema.sql:652:alter table "public"."service_orders" validate constraint "service_orders_total_cost_check";
supabase/migrations/20260514133525_remote_schema.sql:655:alter table "public"."service_orders" add constraint "service_orders_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES public.customers(id) not valid;
supabase/migrations/20260514133525_remote_schema.sql:656:alter table "public"."service_orders" validate constraint "service_orders_customer_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:657:alter table "public"."service_orders" add constraint "service_orders_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE not valid;
supabase/migrations/20260514133525_remote_schema.sql:658:alter table "public"."service_orders" validate constraint "service_orders_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:659:create or replace view "public"."view_service_orders_detail" as  SELECT so.id,
supabase/migrations/20260514133525_remote_schema.sql:668:   FROM (public.service_orders so
supabase/migrations/20260514133525_remote_schema.sql:729:  on "public"."service_orders"
supabase/migrations/20260424_baseline_schema.sql:95:create table if not exists public.service_orders (
supabase/migrations/20260424_baseline_schema.sql:123:create unique index if not exists service_orders_tenant_folio_uidx
supabase/migrations/20260424_baseline_schema.sql:124:  on public.service_orders (tenant_id, folio);
supabase/migrations/20260424_baseline_schema.sql:125:create index if not exists service_orders_tenant_branch_idx
supabase/migrations/20260424_baseline_schema.sql:126:  on public.service_orders (tenant_id, branch_id);
supabase/migrations/20260424_baseline_schema.sql:127:create index if not exists service_orders_tenant_status_idx
supabase/migrations/20260424_baseline_schema.sql:128:  on public.service_orders (tenant_id, status);
supabase/migrations/20260424_baseline_schema.sql:132:  service_order_id uuid not null references public.service_orders(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:146:  service_order_id uuid not null references public.service_orders(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:159:  service_order_id uuid references public.service_orders(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:245:  related_service_order_id uuid references public.service_orders(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:281:  service_order_id uuid references public.service_orders(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:308:  service_order_id uuid references public.service_orders(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:330:  service_order_id uuid references public.service_orders(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:345:  service_order_id uuid references public.service_orders(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:385:drop trigger if exists trg_service_orders_updated_at on public.service_orders;
supabase/migrations/20260424_baseline_schema.sql:386:create trigger trg_service_orders_updated_at
supabase/migrations/20260424_baseline_schema.sql:387:before update on public.service_orders
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:88:  service_order_id uuid not null references public.service_orders(id) on delete cascade,
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:101:alter table public.service_orders
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:104:alter table public.service_orders
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:107:alter table public.service_orders
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:110:alter table public.service_orders
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:113:alter table public.service_orders
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:116:create index if not exists service_orders_tenant_folio_uidx
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:117:  on public.service_orders (tenant_id, folio);
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:119:create index if not exists service_orders_tenant_status_idx
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:120:  on public.service_orders (tenant_id, status);
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:122:create index if not exists service_orders_tenant_created_at_idx
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:123:  on public.service_orders (tenant_id, created_at desc);
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:125:alter table public.service_orders
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:126:  drop constraint if exists service_orders_status_check;
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:128:alter table public.service_orders
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:129:  add constraint service_orders_status_check
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:150:drop trigger if exists trg_service_orders_updated_at on public.service_orders;
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:151:create trigger trg_service_orders_updated_at
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:152:before update on public.service_orders
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:51:alter table if exists public.service_orders enable row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:72:alter table if exists public.service_orders force row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:223:  if to_regclass('public.service_orders') is not null then
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:224:    execute 'drop policy if exists service_orders_select on public.service_orders';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:226:      create policy service_orders_select
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:227:      on public.service_orders
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:232:    execute 'drop policy if exists service_orders_write_owner_manager on public.service_orders';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:234:      create policy service_orders_write_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:235:      on public.service_orders
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:240:    execute 'drop policy if exists service_orders_update_owner_manager on public.service_orders';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:242:      create policy service_orders_update_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:243:      on public.service_orders
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:249:    execute 'drop policy if exists service_orders_delete_owner_manager on public.service_orders';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:251:      create policy service_orders_delete_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:252:      on public.service_orders
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:257:    execute 'drop policy if exists service_orders_update_technician on public.service_orders';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:259:      create policy service_orders_update_technician
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:260:      on public.service_orders
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:636:  if to_regclass('public.service_orders') is not null then
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:637:    grant select, insert, update, delete on public.service_orders to authenticated;
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:20:-- service_orders
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:21:alter table if exists public.service_orders
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:26:create index if not exists service_orders_tenant_sucursal_idx
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:27:  on public.service_orders (tenant_id, sucursal_id);
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:29:alter table public.service_orders
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:30:  drop constraint if exists service_orders_sucursal_id_fkey;
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:32:alter table public.service_orders
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:33:  add constraint service_orders_sucursal_id_fkey
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:38:drop trigger if exists trg_service_orders_sync_sucursal_branch on public.service_orders;
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:39:create trigger trg_service_orders_sync_sucursal_branch
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:40:before insert or update on public.service_orders
supabase/migrations/20260514120000_enable_rls_and_policies.sql:2:alter table if exists public.service_orders enable row level security;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:11:drop policy if exists service_orders_select on public.service_orders;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:12:create policy service_orders_select
supabase/migrations/20260514120000_enable_rls_and_policies.sql:13:on public.service_orders
supabase/migrations/20260514120000_enable_rls_and_policies.sql:18:drop policy if exists service_orders_write_owner_manager on public.service_orders;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:19:create policy service_orders_write_owner_manager
supabase/migrations/20260514120000_enable_rls_and_policies.sql:20:on public.service_orders
supabase/migrations/20260514120000_enable_rls_and_policies.sql:26:drop policy if exists service_orders_update_owner_manager on public.service_orders;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:27:create policy service_orders_update_owner_manager
supabase/migrations/20260514120000_enable_rls_and_policies.sql:28:on public.service_orders
supabase/migrations/20260514120000_enable_rls_and_policies.sql:38:drop policy if exists service_orders_delete_owner_manager on public.service_orders;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:39:create policy service_orders_delete_owner_manager
supabase/migrations/20260514120000_enable_rls_and_policies.sql:40:on public.service_orders
supabase/migrations/20260514120000_enable_rls_and_policies.sql:46:drop policy if exists service_orders_update_technician on public.service_orders;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:47:create policy service_orders_update_technician
supabase/migrations/20260514120000_enable_rls_and_policies.sql:48:on public.service_orders
supabase/migrations/20260523190000_order_documents_events.sql:4:  service_order_id uuid not null references public.service_orders(id) on delete cascade,
supabase/migrations/20260523190000_order_documents_events.sql:21:  service_order_id uuid not null references public.service_orders(id) on delete cascade,
