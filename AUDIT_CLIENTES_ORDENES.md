# AUDIT CLIENTES / ÓRDENES
Fecha: miércoles,  3 de junio de 2026, 11:17:25 CST
Repo: /Users/jesusvilla/Desktop/Sdmx-pagina-principal

## orders.ts
apps/api/src/controllers/orders.ts:5:import { getTenantClient, supabaseAdmin } from '@white-label/database';
apps/api/src/controllers/orders.ts:42:  clientName: z.string().min(1).optional(),
apps/api/src/controllers/orders.ts:43:  clientPhone: z.string().min(7).optional(),
apps/api/src/controllers/orders.ts:44:  clientEmail: z.string().email().optional().or(z.literal('')),
apps/api/src/controllers/orders.ts:161:  clientName: z.string().min(1, 'El nombre del cliente es requerido'),
apps/api/src/controllers/orders.ts:162:  clientPhone: z.string().min(10, 'El teléfono debe tener al menos 10 dígitos'),
apps/api/src/controllers/orders.ts:163:  clientEmail: z.string().email('Email inválido').optional().or(z.literal('')),
apps/api/src/controllers/orders.ts:290:async function insertOrderDocument(supabase: ReturnType<typeof getTenantClient>, row: {
apps/api/src/controllers/orders.ts:309:async function insertOrderEvent(supabase: ReturnType<typeof getTenantClient>, row: {
apps/api/src/controllers/orders.ts:344:  const statuses = config.statusOptions.service_orders ?? [];
apps/api/src/controllers/orders.ts:407:  doc.text(`Cliente: ${String((options.order.device_info as { customer_name?: string } | undefined)?.customer_name ?? '')}`);
apps/api/src/controllers/orders.ts:408:  doc.text(`Teléfono: ${String((options.order.device_info as { customer_phone?: string } | undefined)?.customer_phone ?? '')}`);
apps/api/src/controllers/orders.ts:409:  doc.text(`Correo: ${String((options.order.device_info as { customer_email?: string } | undefined)?.customer_email ?? '')}`);
apps/api/src/controllers/orders.ts:491:    const supabase = getTenantClient(tenantId);
apps/api/src/controllers/orders.ts:512:      .from('service_orders')
apps/api/src/controllers/orders.ts:524:            customer_name: validatedData.clientName,
apps/api/src/controllers/orders.ts:525:            customer_phone: validatedData.clientPhone,
apps/api/src/controllers/orders.ts:526:            customer_email: validatedData.clientEmail || null,
apps/api/src/controllers/orders.ts:578:      .from('service_orders')
apps/api/src/controllers/orders.ts:657:    const supabase = getTenantClient(tenantId);
apps/api/src/controllers/orders.ts:659:      .from('service_orders')
apps/api/src/controllers/orders.ts:706:    const supabase = getTenantClient(tenantId);
apps/api/src/controllers/orders.ts:708:      .from('service_orders')
apps/api/src/controllers/orders.ts:806:    const supabase = getTenantClient(tenantId);
apps/api/src/controllers/orders.ts:809:      .from('service_orders')
apps/api/src/controllers/orders.ts:882:        .from('service_orders')
apps/api/src/controllers/orders.ts:889:        .from('service_orders')
apps/api/src/controllers/orders.ts:915:        .from('service_orders')
apps/api/src/controllers/orders.ts:942:        .from('service_orders')
apps/api/src/controllers/orders.ts:957:        .from('service_orders')
apps/api/src/controllers/orders.ts:1037:    const supabase = getTenantClient(tenantId);
apps/api/src/controllers/orders.ts:1040:      .from('service_orders')
apps/api/src/controllers/orders.ts:1066:      .from('service_orders')
apps/api/src/controllers/orders.ts:1121:    const supabase = getTenantClient(tenantId);
apps/api/src/controllers/orders.ts:1124:      .from('service_orders')
apps/api/src/controllers/orders.ts:1147:      .from('service_orders')
apps/api/src/controllers/orders.ts:1165:      .from('service_orders')
apps/api/src/controllers/orders.ts:1225:    const supabase = getTenantClient(tenantId);
apps/api/src/controllers/orders.ts:1228:      .from('service_orders')
apps/api/src/controllers/orders.ts:1246:      .from('service_orders')
apps/api/src/controllers/orders.ts:1276:        .from('service_orders')
apps/api/src/controllers/orders.ts:1320:    const supabase = getTenantClient(tenantId);
apps/api/src/controllers/orders.ts:1323:      .from('service_orders')
apps/api/src/controllers/orders.ts:1340:      customer_name: body.clientName ?? String(currentDeviceInfo.customer_name ?? ''),
apps/api/src/controllers/orders.ts:1341:      customer_phone: body.clientPhone ?? String(currentDeviceInfo.customer_phone ?? ''),
apps/api/src/controllers/orders.ts:1342:      customer_email: body.clientEmail === undefined ? currentDeviceInfo.customer_email ?? null : body.clientEmail || null,
apps/api/src/controllers/orders.ts:1349:      .from('service_orders')
apps/api/src/controllers/orders.ts:1382:    const supabase = getTenantClient(tenantId);
apps/api/src/controllers/orders.ts:1420:    const supabase = getTenantClient(tenantId);
apps/api/src/controllers/orders.ts:1423:      .from('service_orders')
apps/api/src/controllers/orders.ts:1478:    const supabase = getTenantClient(tenantId);
apps/api/src/controllers/orders.ts:1480:      .from('service_orders')
apps/api/src/controllers/orders.ts:1498:      .from('service_orders')
apps/api/src/controllers/orders.ts:1522:      .from('service_orders')

## requests.ts
apps/api/src/controllers/requests.ts:3:import { getTenantClient } from '@white-label/database';
apps/api/src/controllers/requests.ts:10:  createCustomer: z.coerce.boolean().default(true),
apps/api/src/controllers/requests.ts:29:    const supabase = getTenantClient(tenantId);
apps/api/src/controllers/requests.ts:64:    const supabase = getTenantClient(tenantId);
apps/api/src/controllers/requests.ts:103:    const supabase = getTenantClient(tenantId);
apps/api/src/controllers/requests.ts:116:    let customerId: string | null = null;
apps/api/src/controllers/requests.ts:118:    if (body.createCustomer) {
apps/api/src/controllers/requests.ts:119:      const phone = String(requestRow.customer_phone ?? '').trim();
apps/api/src/controllers/requests.ts:120:      const email = String(requestRow.customer_email ?? '').trim();
apps/api/src/controllers/requests.ts:122:      let existingCustomer = null;
apps/api/src/controllers/requests.ts:124:      if (phone) {
apps/api/src/controllers/requests.ts:126:          .from('customers')
apps/api/src/controllers/requests.ts:129:          .eq('phone', phone)
apps/api/src/controllers/requests.ts:132:        existingCustomer = data;
apps/api/src/controllers/requests.ts:135:      if (!existingCustomer && email) {
apps/api/src/controllers/requests.ts:137:          .from('customers')
apps/api/src/controllers/requests.ts:143:        existingCustomer = data;
apps/api/src/controllers/requests.ts:146:      if (existingCustomer?.id) {
apps/api/src/controllers/requests.ts:147:        customerId = existingCustomer.id;
apps/api/src/controllers/requests.ts:149:        const { data: customerData, error: customerError } = await supabase
apps/api/src/controllers/requests.ts:150:          .from('customers')
apps/api/src/controllers/requests.ts:154:              name: requestRow.customer_name,
apps/api/src/controllers/requests.ts:155:              phone: phone || null,
apps/api/src/controllers/requests.ts:162:        if (customerError || !customerData) {
apps/api/src/controllers/requests.ts:164:            error: 'Failed to create customer from request',
apps/api/src/controllers/requests.ts:165:            details: customerError?.message ?? 'Unknown error',
apps/api/src/controllers/requests.ts:169:        customerId = customerData.id;
apps/api/src/controllers/requests.ts:179:      .from('service_orders')
apps/api/src/controllers/requests.ts:183:          customer_id: customerId,
apps/api/src/controllers/requests.ts:187:            customer_name: requestRow.customer_name,
apps/api/src/controllers/requests.ts:188:            customer_phone: requestRow.customer_phone,
apps/api/src/controllers/requests.ts:189:            customer_email: requestRow.customer_email,
apps/api/src/controllers/requests.ts:228:        customer_id: customerId,

## customers usage
apps/api/src/index.ts:8:import customersRouter from './routes/customers';
apps/api/src/index.ts:118:app.use('/api/:tenantSlug/customers', customersRouter);
apps/api/src/index.ts:119:app.use('/api/customers', customersRouter);
apps/api/src/controllers/requests.ts:126:          .from('customers')
apps/api/src/controllers/requests.ts:137:          .from('customers')
apps/api/src/controllers/requests.ts:150:          .from('customers')
apps/api/src/controllers/reports.ts:18:    let customersQuery = supabase.from('customers').select('id').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:37:    const [ordersResult, customersResult, inventoryResult, financeResult, requestsResult, usersResult, movementsResult] = await Promise.all([
apps/api/src/controllers/reports.ts:39:      customersQuery,
apps/api/src/controllers/reports.ts:47:    const errors = [ordersResult.error, customersResult.error, inventoryResult.error, financeResult.error, requestsResult.error, usersResult.error, movementsResult.error].filter(Boolean);
apps/api/src/controllers/reports.ts:56:    const customers = customersResult.data ?? [];
apps/api/src/controllers/reports.ts:181:        customersCount: customers.length,
apps/api/src/controllers/requests.ts.bak.20260603_101809:119:        .from('customers')
apps/api/src/controllers/catalogs.ts:6:const createCustomerSchema = z.object({
apps/api/src/controllers/catalogs.ts:156:export const listCustomers = async (req: Request, res: Response) => {
apps/api/src/controllers/catalogs.ts:163:      .from('customers')
apps/api/src/controllers/catalogs.ts:175:    if (error) return res.status(502).json({ error: 'Failed to fetch customers', details: error.message });
apps/api/src/controllers/catalogs.ts:178:    console.error('Error listing customers:', error);
apps/api/src/controllers/catalogs.ts:187:    const body = createCustomerSchema.parse(req.body);
apps/api/src/controllers/catalogs.ts:190:    const { data, error } = await supabase.from('customers').insert([{
apps/api/src/routes/customers.ts:8:import { createCustomer, listCustomers } from '../controllers/catalogs';
apps/api/src/routes/customers.ts:18:router.get('/', requireTenantModule('customers'), requireRole('owner', 'manager', 'technician'), listCustomers);
apps/api/src/routes/customers.ts:19:router.post('/', requireTenantModule('customers'), requireRole('owner', 'manager'), createCustomer);
apps/api/src/services/tenant-capabilities.ts:23:  { key: 'customers', label: 'Clientes', description: 'Clientes y contactos', category: 'core', frontend_routes: ['/dashboard/clientes'], backend_permissions: [], default_enabled_by_industry: ['electronics_repair', 'hvac_service'], required_plan: null, aliases: [] },
apps/api/src/services/tenant-capabilities.ts:49:    module_allowlist: ['dashboard', 'customers', 'requests', 'orders', 'portal', 'landing', 'whatsapp', 'documents'],
apps/api/src/services/tenant-capabilities.ts:53:    module_allowlist: ['dashboard', 'customers', 'requests', 'orders', 'appointments', 'assets', 'stock', 'suppliers', 'purchase-orders', 'expenses', 'reports', 'documents', 'portal', 'landing', 'whatsapp', 'warranty', 'billing', 'settings', 'sucursales', 'tasks', 'security'],
apps/api/src/services/tenant-config.ts:116:    { module_key: 'customers', module_label: 'Clientes', enabled: true, sort_order: 2, metadata: {} },
apps/api/src/services/tenant-config.ts:234:    { module_key: 'customers', module_label: 'Clientes', enabled: true, sort_order: 2, metadata: {} },
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:4:create unique index if not exists customers_tenant_phone_uidx
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:5:  on public.customers (tenant_id, phone)
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:8:create unique index if not exists customers_tenant_email_uidx
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:9:  on public.customers (tenant_id, lower(email))
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:34:  customer_id uuid references public.customers(id) on delete set null,
supabase/migrations/20260530180000_add_customer_sucursal_id.sql:1:alter table if exists public.customers
supabase/migrations/20260530180000_add_customer_sucursal_id.sql:4:create index if not exists customers_tenant_sucursal_idx
supabase/migrations/20260530180000_add_customer_sucursal_id.sql:5:  on public.customers (tenant_id, sucursal_id);
supabase/migrations/20260530180000_add_customer_sucursal_id.sql:11:      alter table public.customers
supabase/migrations/20260530180000_add_customer_sucursal_id.sql:12:      drop constraint if exists customers_sucursal_id_fkey';
supabase/migrations/20260530180000_add_customer_sucursal_id.sql:15:      alter table public.customers
supabase/migrations/20260530180000_add_customer_sucursal_id.sql:16:      add constraint customers_sucursal_id_fkey
supabase/migrations/20260514133525_remote_schema.sql:3:drop trigger if exists "trg_customers_updated_at" on "public"."customers";
supabase/migrations/20260514133525_remote_schema.sql:19:drop policy "customers_delete_owner_manager" on "public"."customers";
supabase/migrations/20260514133525_remote_schema.sql:20:drop policy "customers_select" on "public"."customers";
supabase/migrations/20260514133525_remote_schema.sql:21:drop policy "customers_update_owner_manager" on "public"."customers";
supabase/migrations/20260514133525_remote_schema.sql:22:drop policy "customers_write_owner_manager" on "public"."customers";
supabase/migrations/20260514133525_remote_schema.sql:487:alter table "public"."customers" drop constraint "customers_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:514:drop index if exists "public"."customers_tenant_email_idx";
supabase/migrations/20260514133525_remote_schema.sql:515:drop index if exists "public"."customers_tenant_idx";
supabase/migrations/20260514133525_remote_schema.sql:516:drop index if exists "public"."customers_tenant_phone_idx";
supabase/migrations/20260514133525_remote_schema.sql:583:alter table "public"."customers" drop column "full_name";
supabase/migrations/20260514133525_remote_schema.sql:584:alter table "public"."customers" drop column "is_active";
supabase/migrations/20260514133525_remote_schema.sql:585:alter table "public"."customers" drop column "notes";
supabase/migrations/20260514133525_remote_schema.sql:586:alter table "public"."customers" drop column "tag";
supabase/migrations/20260514133525_remote_schema.sql:587:alter table "public"."customers" drop column "updated_at";
supabase/migrations/20260514133525_remote_schema.sql:588:alter table "public"."customers" add column "name" text not null;
supabase/migrations/20260514133525_remote_schema.sql:589:alter table "public"."customers" alter column "created_at" set default now();
supabase/migrations/20260514133525_remote_schema.sql:590:alter table "public"."customers" alter column "created_at" drop not null;
supabase/migrations/20260514133525_remote_schema.sql:591:alter table "public"."customers" alter column "id" set default extensions.uuid_generate_v4();
supabase/migrations/20260514133525_remote_schema.sql:653:alter table "public"."customers" add constraint "customers_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE not valid;
supabase/migrations/20260514133525_remote_schema.sql:654:alter table "public"."customers" validate constraint "customers_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:655:alter table "public"."service_orders" add constraint "service_orders_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES public.customers(id) not valid;
supabase/migrations/20260514133525_remote_schema.sql:669:     LEFT JOIN public.customers c ON ((so.customer_id = c.id)));
supabase/migrations/20260514133525_remote_schema.sql:712:create policy "Tenant isolation: customers"
supabase/migrations/20260514133525_remote_schema.sql:713:  on "public"."customers"
supabase/migrations/20260424_baseline_schema.sql:58:create table if not exists public.customers (
supabase/migrations/20260424_baseline_schema.sql:70:create index if not exists customers_tenant_idx on public.customers (tenant_id);
supabase/migrations/20260424_baseline_schema.sql:71:create index if not exists customers_tenant_phone_idx on public.customers (tenant_id, phone);
supabase/migrations/20260424_baseline_schema.sql:72:create index if not exists customers_tenant_email_idx on public.customers (tenant_id, lower(email));
supabase/migrations/20260424_baseline_schema.sql:99:  customer_id uuid references public.customers(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:329:  customer_id uuid references public.customers(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:377:drop trigger if exists trg_customers_updated_at on public.customers;
supabase/migrations/20260424_baseline_schema.sql:378:create trigger trg_customers_updated_at
supabase/migrations/20260424_baseline_schema.sql:379:before update on public.customers
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:49:alter table if exists public.customers enable row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:70:alter table if exists public.customers force row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:151:  if to_regclass('public.customers') is not null then
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:152:    execute 'drop policy if exists customers_select on public.customers';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:154:      create policy customers_select
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:155:      on public.customers
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:160:    execute 'drop policy if exists customers_write_owner_manager on public.customers';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:162:      create policy customers_write_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:163:      on public.customers
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:168:    execute 'drop policy if exists customers_update_owner_manager on public.customers';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:170:      create policy customers_update_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:171:      on public.customers
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:177:    execute 'drop policy if exists customers_delete_owner_manager on public.customers';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:179:      create policy customers_delete_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:180:      on public.customers
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:624:  if to_regclass('public.customers') is not null then
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:625:    grant select, insert, update, delete on public.customers to authenticated;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:3:alter table if exists public.customers enable row level security;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:58:-- CUSTOMERS
supabase/migrations/20260514120000_enable_rls_and_policies.sql:59:drop policy if exists customers_select on public.customers;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:60:create policy customers_select
supabase/migrations/20260514120000_enable_rls_and_policies.sql:61:on public.customers
supabase/migrations/20260514120000_enable_rls_and_policies.sql:66:drop policy if exists customers_write_owner_manager on public.customers;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:67:create policy customers_write_owner_manager
supabase/migrations/20260514120000_enable_rls_and_policies.sql:68:on public.customers
supabase/migrations/20260514120000_enable_rls_and_policies.sql:74:drop policy if exists customers_update_owner_manager on public.customers;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:75:create policy customers_update_owner_manager
supabase/migrations/20260514120000_enable_rls_and_policies.sql:76:on public.customers
supabase/migrations/20260514120000_enable_rls_and_policies.sql:86:drop policy if exists customers_delete_owner_manager on public.customers;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:87:create policy customers_delete_owner_manager
supabase/migrations/20260514120000_enable_rls_and_policies.sql:88:on public.customers

## service_orders schema
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
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:34:  customer_id uuid references public.customers(id) on delete set null,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:35:  service_order_id uuid references public.service_orders(id) on delete set null,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:95:  service_order_id uuid references public.service_orders(id) on delete set null,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:161:          customer_id,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:176:          new.customer_id,
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
supabase/migrations/20260514133525_remote_schema.sql:426:alter table "public"."customer_payments" drop constraint "customer_payments_customer_id_fkey";
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
supabase/migrations/20260514133525_remote_schema.sql:665:    c.name AS customer_name,
supabase/migrations/20260514133525_remote_schema.sql:666:    c.phone AS customer_phone,
supabase/migrations/20260514133525_remote_schema.sql:668:   FROM (public.service_orders so
supabase/migrations/20260514133525_remote_schema.sql:669:     LEFT JOIN public.customers c ON ((so.customer_id = c.id)));
supabase/migrations/20260514133525_remote_schema.sql:729:  on "public"."service_orders"
supabase/migrations/20260424_baseline_schema.sql:78:  customer_name text not null,
supabase/migrations/20260424_baseline_schema.sql:79:  customer_phone text,
supabase/migrations/20260424_baseline_schema.sql:95:create table if not exists public.service_orders (
supabase/migrations/20260424_baseline_schema.sql:99:  customer_id uuid references public.customers(id) on delete set null,
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
supabase/migrations/20260424_baseline_schema.sql:329:  customer_id uuid references public.customers(id) on delete set null,
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

## typecheck
.                                        | [WARN] Unsupported engine: wanted: {"node":"22.x"} (current: {"node":"v24.13.1","pnpm":"11.3.0"})
apps/web-admin                           | [WARN] Unsupported engine: wanted: {"node":"22.x"} (current: {"node":"v24.13.1","pnpm":"11.3.0"})
apps/web-clientes                        | [WARN] Unsupported engine: wanted: {"node":"22.x"} (current: {"node":"v24.13.1","pnpm":"11.3.0"})
apps/web-public                          | [WARN] Unsupported engine: wanted: {"node":"22.x"} (current: {"node":"v24.13.1","pnpm":"11.3.0"})
$ tsc --noEmit
