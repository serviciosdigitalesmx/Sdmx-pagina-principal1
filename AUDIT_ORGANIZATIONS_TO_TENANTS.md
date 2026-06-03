# AUDIT ORGANIZATIONS -> TENANTS

## ORGANIZATIONS
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

## TENANTS
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
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:327:    .from('tenants')
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
apps/api/src/controllers/orders.ts.bak.20260603_102231:327:    .from('tenants')
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

## CREATE TENANT
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:327:    .from('tenants')
apps/api/src/controllers/meta.ts:76:      .from('tenants')
apps/api/src/controllers/meta.ts:115:      .from('tenants')
apps/api/src/controllers/meta.ts:180:      .from('tenants')
apps/api/src/controllers/meta.ts:216:        .from('tenants')
apps/api/src/controllers/auth.controller.ts:166:    const { data: tenantRows, error: tenantError } = await supabaseAdmin.rpc('create_tenant_transaction', {
apps/api/src/controllers/auth.controller.ts:310:    const { data: tenantRows, error: tenantError } = await supabaseAdmin.rpc('create_tenant_transaction', {
apps/api/src/controllers/auth.controller.ts:409:      .from('tenants')
apps/api/src/controllers/reports.ts:17:    let ordersQuery = supabase.from('service_orders').select('id, status, created_at, final_cost, sucursal_id, promised_date, folio').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:20:    let financeQuery = supabase.from('finances').select('id, balance, income, expense, created_at, sucursal_id').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:21:    let requestsQuery = supabase.from('service_requests').select('id, balance_amount, status, created_at').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/purchase-orders.ts:143:    supabase.from('inventory_movements').select('id, tenant_id, sucursal_id, product_id, purchase_order_id, movement_type, quantity, unit_cost, reference, notes, created_by, created_at').eq('tenant_id', tenantId).eq('purchase_order_id', orderId).order('created_at', { ascending: true }),
apps/api/src/controllers/orders.ts:327:    .from('tenants')
apps/api/src/controllers/security.ts:130:      .from('tenants')
apps/api/src/controllers/security.ts:366:      .from('tenants')
apps/api/src/controllers/security.ts:377:      .from('tenants')
apps/api/src/controllers/security.ts:535:      .from('tenants')
apps/api/src/controllers/security.ts:545:      .from('tenants')
apps/api/src/controllers/orders.ts.bak.20260603_102231:327:    .from('tenants')
apps/api/src/controllers/users.ts.bak.20260603_093424:63:    .from('tenants')
apps/api/src/controllers/users.ts:63:    .from('tenants')
apps/api/src/controllers/billing.ts:45:    const result = await createBillingCheckout(null, { plan, tenantSlug });
apps/api/src/controllers/public.ts:98:    .from('tenants')
apps/api/src/routes/public.ts:2:import { createPublicQuote, getPublicPortalOrder, getPublicTenantLanding, trackPublicOrder } from '../controllers/public';
apps/api/src/services/security-backoffice.ts:93:    .from('tenants')
apps/api/src/services/tenant-config.ts:596:      .from('tenants')
apps/api/src/services/tenant-billing.ts:32:      .from('tenants')
apps/api/src/services/billing.ts:125:      .from('tenants')
apps/api/src/services/billing.ts:163:    .from('tenants')
supabase/migrations/20260530143000_add_public_token_to_service_orders.sql:14:create unique index if not exists service_orders_tenant_public_token_uidx
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:3:create or replace function public._live_tenant_id()
supabase/migrations/20260530121000_add_assigned_user_to_service_orders.sql:6:create index if not exists service_orders_tenant_assigned_idx
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:29:create index if not exists service_orders_tenant_sucursal_idx
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:55:create index if not exists purchase_orders_tenant_sucursal_idx
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:81:create index if not exists inventory_movements_tenant_sucursal_idx
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:107:create index if not exists stock_alerts_tenant_sucursal_idx
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:1:create table if not exists public.tenant_industry_profiles (
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:18:create index if not exists tenant_industry_profiles_industry_key_idx
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:24:create policy tenant_industry_profiles_select
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:30:create policy tenant_industry_profiles_write
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:36:create table if not exists public.tenant_enabled_modules (
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:49:create index if not exists tenant_enabled_modules_tenant_idx
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:55:create policy tenant_enabled_modules_select
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:61:create policy tenant_enabled_modules_write
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:67:create table if not exists public.tenant_label_overrides (
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:78:create index if not exists tenant_label_overrides_tenant_idx
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:84:create policy tenant_label_overrides_select
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:90:create policy tenant_label_overrides_write
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:96:create table if not exists public.tenant_workflow_statuses (
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:112:create index if not exists tenant_workflow_statuses_tenant_idx
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:118:create policy tenant_workflow_statuses_select
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:124:create policy tenant_workflow_statuses_write
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:131:create trigger trg_tenant_industry_profiles_updated_at
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:136:create trigger trg_tenant_enabled_modules_updated_at
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:141:create trigger trg_tenant_label_overrides_updated_at
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:146:create trigger trg_tenant_workflow_statuses_updated_at
supabase/migrations/20260515110000_restore_users_compat.sql:15:create unique index if not exists users_tenant_email_uidx
supabase/migrations/20260515110000_restore_users_compat.sql:17:create unique index if not exists users_tenant_auth_uidx
supabase/migrations/20260530120000_expand_users_admin_module.sql:19:create index if not exists users_tenant_role_active_idx
supabase/migrations/20260530120000_expand_users_admin_module.sql:22:create index if not exists users_tenant_last_access_idx
supabase/migrations/20260527070000_tenant_semaphore_rules.sql:1:create table if not exists public.tenant_semaphore_rules (
supabase/migrations/20260527070000_tenant_semaphore_rules.sql:22:create index if not exists tenant_semaphore_rules_tenant_idx
supabase/migrations/20260527070000_tenant_semaphore_rules.sql:28:create policy tenant_semaphore_rules_select
supabase/migrations/20260527070000_tenant_semaphore_rules.sql:34:create policy tenant_semaphore_rules_write
supabase/migrations/20260527070000_tenant_semaphore_rules.sql:41:create trigger trg_tenant_semaphore_rules_updated_at
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:23:create index if not exists audit_logs_tenant_created_idx
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:26:create index if not exists audit_logs_tenant_action_idx
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:29:create index if not exists audit_logs_tenant_user_idx
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:45:create index if not exists security_sessions_tenant_active_idx
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:48:create index if not exists security_sessions_tenant_user_idx
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:7:create or replace function public._sucursal_tenant_jwt_id()
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:37:create unique index if not exists sucursales_tenant_code_uidx
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:41:create index if not exists sucursales_tenant_idx
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:121:create index if not exists sucursal_inventory_tenant_idx
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:124:create index if not exists sucursal_inventory_tenant_sucursal_idx
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:127:create index if not exists sucursal_inventory_tenant_product_idx
supabase/migrations/20260527010000_align_service_requests_tenant_fk.sql:25:create policy service_requests_insert_tenant
supabase/migrations/20260527010000_align_service_requests_tenant_fk.sql:32:create policy service_requests_update_tenant
supabase/migrations/20260527010000_align_service_requests_tenant_fk.sql:40:create policy service_requests_delete_tenant
supabase/migrations/20260523204000_restore_branches_table.sql:15:create unique index if not exists branches_tenant_code_uidx
supabase/migrations/20260523204000_restore_branches_table.sql:18:create index if not exists branches_tenant_idx
supabase/migrations/20260527050000_tenant_field_definitions_phase2.sql:1:create table if not exists public.tenant_field_definitions (
supabase/migrations/20260527050000_tenant_field_definitions_phase2.sql:21:create index if not exists tenant_field_definitions_tenant_entity_idx
supabase/migrations/20260527050000_tenant_field_definitions_phase2.sql:27:create policy tenant_field_definitions_select
supabase/migrations/20260527050000_tenant_field_definitions_phase2.sql:33:create policy tenant_field_definitions_write
supabase/migrations/20260527050000_tenant_field_definitions_phase2.sql:46:create trigger trg_tenant_field_definitions_updated_at
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:4:create unique index if not exists customers_tenant_phone_uidx
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:8:create unique index if not exists customers_tenant_email_uidx
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:13:create index if not exists service_orders_tenant_promised_status_idx
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:27:create index if not exists service_order_status_history_tenant_order_idx
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:47:create index if not exists customer_payments_tenant_order_idx
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:50:create index if not exists purchase_order_items_tenant_po_idx
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:20:create unique index if not exists products_tenant_sku_uidx
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:42:create unique index if not exists purchase_orders_tenant_folio_uidx
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:73:create index if not exists inventory_movements_tenant_product_idx
supabase/migrations/20260530180000_add_customer_sucursal_id.sql:4:create index if not exists customers_tenant_sucursal_idx
supabase/migrations/20260514133525_remote_schema.sql:712:create policy "Tenant isolation: customers"
supabase/migrations/20260514133525_remote_schema.sql:728:create policy "Tenant isolation: orders"
supabase/migrations/20260424_baseline_schema.sql:14:create table if not exists public.tenants (
supabase/migrations/20260424_baseline_schema.sql:39:create unique index if not exists branches_tenant_code_uidx
supabase/migrations/20260424_baseline_schema.sql:56:create unique index if not exists users_tenant_email_uidx
supabase/migrations/20260424_baseline_schema.sql:70:create index if not exists customers_tenant_idx on public.customers (tenant_id);
supabase/migrations/20260424_baseline_schema.sql:71:create index if not exists customers_tenant_phone_idx on public.customers (tenant_id, phone);
supabase/migrations/20260424_baseline_schema.sql:72:create index if not exists customers_tenant_email_idx on public.customers (tenant_id, lower(email));
supabase/migrations/20260424_baseline_schema.sql:93:create unique index if not exists service_requests_tenant_folio_uidx
supabase/migrations/20260424_baseline_schema.sql:123:create unique index if not exists service_orders_tenant_folio_uidx
supabase/migrations/20260424_baseline_schema.sql:125:create index if not exists service_orders_tenant_branch_idx
supabase/migrations/20260424_baseline_schema.sql:127:create index if not exists service_orders_tenant_status_idx
supabase/migrations/20260424_baseline_schema.sql:172:create index if not exists tasks_tenant_branch_idx on public.tasks (tenant_id, branch_id);
supabase/migrations/20260424_baseline_schema.sql:173:create index if not exists tasks_tenant_status_idx on public.tasks (tenant_id, status);
supabase/migrations/20260424_baseline_schema.sql:208:create index if not exists suppliers_tenant_idx on public.suppliers (tenant_id);
supabase/migrations/20260424_baseline_schema.sql:228:create unique index if not exists products_tenant_sku_uidx
supabase/migrations/20260424_baseline_schema.sql:260:create unique index if not exists purchase_orders_tenant_folio_uidx
supabase/migrations/20260424_baseline_schema.sql:291:create index if not exists inventory_movements_tenant_product_idx
supabase/migrations/20260424_baseline_schema.sql:323:create index if not exists expenses_tenant_date_idx
supabase/migrations/20260424_baseline_schema.sql:366:create trigger trg_tenants_updated_at
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:7:create or replace function public._sucursal_tenant_jwt_id()
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:37:create unique index if not exists sucursales_tenant_code_uidx
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:41:create index if not exists sucursales_tenant_idx
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:114:create index if not exists sucursal_inventory_tenant_idx
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:117:create index if not exists sucursal_inventory_tenant_sucursal_idx
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:120:create index if not exists sucursal_inventory_tenant_product_idx
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:39:create index if not exists suppliers_tenant_idx
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:42:create index if not exists suppliers_tenant_business_name_idx
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:45:create index if not exists suppliers_tenant_rfc_idx
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:59:create index if not exists inventory_tenant_idx
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:62:create index if not exists inventory_tenant_branch_idx
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:65:create unique index if not exists inventory_tenant_sku_uidx
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:79:create index if not exists finances_tenant_idx
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:82:create index if not exists finances_tenant_sucursal_idx
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:116:create index if not exists service_orders_tenant_folio_uidx
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:119:create index if not exists service_orders_tenant_status_idx
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:122:create index if not exists service_orders_tenant_created_at_idx
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:7:create or replace function public._tenant_jwt_id()
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:23:create or replace function public._is_tenant_member(target_tenant uuid)
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:94:      create policy tenants_select_same_tenant
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:101:    execute 'drop policy if exists tenants_insert_owner on public.tenants';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:103:      create policy tenants_insert_owner
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:112:      create policy tenants_update_owner
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:122:      create policy tenants_delete_owner
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:133:      create policy users_select_tenant
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:215:      create policy service_requests_delete_tenant
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:613:    grant select, insert, update, delete on public.tenants to authenticated;
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:26:create index if not exists service_orders_tenant_sucursal_idx
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:49:create index if not exists purchase_orders_tenant_sucursal_idx
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:72:create index if not exists inventory_movements_tenant_sucursal_idx
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:95:create index if not exists stock_alerts_tenant_sucursal_idx
supabase/migrations/20260530132000_security_backoffice_tables.sql:24:create index if not exists audit_logs_tenant_created_idx
supabase/migrations/20260530132000_security_backoffice_tables.sql:27:create index if not exists audit_logs_tenant_action_idx
supabase/migrations/20260530132000_security_backoffice_tables.sql:30:create index if not exists audit_logs_tenant_user_idx
supabase/migrations/20260530132000_security_backoffice_tables.sql:46:create index if not exists security_sessions_tenant_active_idx
supabase/migrations/20260530132000_security_backoffice_tables.sql:49:create index if not exists security_sessions_tenant_user_idx
supabase/migrations/20260514150000_add_tenant_onboarding.sql:30:create unique index if not exists users_tenant_auth_uidx
supabase/migrations/20260514150000_add_tenant_onboarding.sql:33:create unique index if not exists users_tenant_email_uidx
supabase/migrations/20260514150000_add_tenant_onboarding.sql:36:create or replace function public.create_tenant_transaction(
supabase/migrations/20260514150000_add_tenant_onboarding.sql:80:  insert into public.tenants (
supabase/migrations/20260514150000_add_tenant_onboarding.sql:131:revoke all on function public.create_tenant_transaction(uuid, text, text, text, text) from public;
supabase/migrations/20260514150000_add_tenant_onboarding.sql:132:grant execute on function public.create_tenant_transaction(uuid, text, text, text, text) to service_role;
supabase/migrations/20260514150000_add_tenant_onboarding.sql:135:create policy tenants_select_same_tenant
supabase/migrations/20260514150000_add_tenant_onboarding.sql:139:drop policy if exists tenants_insert_owner on public.tenants;
supabase/migrations/20260514150000_add_tenant_onboarding.sql:140:create policy tenants_insert_owner
supabase/migrations/20260514150000_add_tenant_onboarding.sql:145:create policy tenants_update_owner
supabase/migrations/20260514150000_add_tenant_onboarding.sql:157:create policy tenants_delete_owner
supabase/migrations/20260530150000_add_pwa_push_subscriptions.sql:15:create unique index if not exists pwa_push_subscriptions_tenant_endpoint_uidx
supabase/migrations/20260523190000_order_documents_events.sql:16:create index if not exists service_order_documents_tenant_order_idx
supabase/migrations/20260523190000_order_documents_events.sql:30:create index if not exists service_order_events_tenant_order_idx
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:3:create or replace function public._live_tenant_id()

## CREATE ORGANIZATION
apps/api/src/services/tenant-billing.ts:37:      .from('organizations')
apps/api/src/services/billing.ts:185:    .from('organizations')
apps/api/src/services/billing.ts:192:      .from('organizations')
apps/api/src/services/billing.ts:204:  const { error } = await supabaseAdmin.from('organizations').insert([{
supabase/migrations/20260514133525_remote_schema.sql:565:create table "public"."organizations" (
supabase/migrations/20260514133525_remote_schema.sql:633:CREATE UNIQUE INDEX organizations_pkey ON public.organizations USING btree (id);
supabase/migrations/20260514133525_remote_schema.sql:634:CREATE UNIQUE INDEX organizations_slug_key ON public.organizations USING btree (slug);
supabase/migrations/20260514133525_remote_schema.sql:671:grant insert on table "public"."organizations" to "anon";
supabase/migrations/20260514133525_remote_schema.sql:678:grant insert on table "public"."organizations" to "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:685:grant insert on table "public"."organizations" to "service_role";

## MIGRATIONS
supabase/migrations/20260424_baseline_schema.sql
supabase/migrations/20260514120000_enable_rls_and_policies.sql
supabase/migrations/20260514133525_remote_schema.sql
supabase/migrations/20260514150000_add_tenant_onboarding.sql
supabase/migrations/20260515110000_restore_users_compat.sql
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql
supabase/migrations/20260523170000_enable_service_requests_rls.sql
supabase/migrations/20260523190000_order_documents_events.sql
supabase/migrations/20260523193000_tenant_landing_content.sql
supabase/migrations/20260523204000_restore_branches_table.sql
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql
supabase/migrations/20260525021500_relax_service_order_status_constraint.sql
supabase/migrations/20260527010000_align_service_requests_tenant_fk.sql
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql
supabase/migrations/20260527050000_tenant_field_definitions_phase2.sql
supabase/migrations/20260527070000_tenant_semaphore_rules.sql
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql
supabase/migrations/20260527084500_harden_live_inventory_rls.sql
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql
supabase/migrations/20260527100000_migrate_users_branch_to_sucursal.sql
supabase/migrations/20260528000600_harden_live_inventory_rls.sql
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql
supabase/migrations/20260530120000_expand_users_admin_module.sql
supabase/migrations/20260530121000_add_assigned_user_to_service_orders.sql
supabase/migrations/20260530132000_security_backoffice_tables.sql
supabase/migrations/20260530143000_add_public_token_to_service_orders.sql
supabase/migrations/20260530150000_add_pwa_push_subscriptions.sql
supabase/migrations/20260530180000_add_customer_sucursal_id.sql
supabase/migrations/20260530193000_audit_hardening_multitenant.sql
supabase/migrations/20260531063159_add_users_activo_compatibility.sql
supabase/migrations/20260531063240_add_users_mfa_enabled_compatibility.sql
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql
supabase/migrations/20260602113500_restore_tenant_contact_columns.sql
supabase/migrations/20260603095001_drop_total_cost_from_service_orders.sql
