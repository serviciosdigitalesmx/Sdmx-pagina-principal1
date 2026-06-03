# AUDITORIA FINAL DE DEUDA TECNICA
Fecha: miércoles,  3 de junio de 2026, 11:26:57 CST

# ORGANIZATIONS

Uso en código: 4
Queries organizations: 8
FK organizations: 4

TOP ORGANIZATIONS
apps/api/src/services/tenant-billing.ts:37:      .from('organizations')
apps/api/src/services/billing.ts:185:    .from('organizations')
apps/api/src/services/billing.ts:192:      .from('organizations')
apps/api/src/services/billing.ts:204:  const { error } = await supabaseAdmin.from('organizations').insert([{
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

==================================================

# TOTAL_COST

total_cost: 8
estimated_cost: 24
final_cost: 35

USOS TOTAL_COST
supabase/migrations/20260603095001_drop_total_cost_from_service_orders.sql:1:-- Drop legacy total_cost after migrating all runtime consumers to final_cost.
supabase/migrations/20260603095001_drop_total_cost_from_service_orders.sql:5:-- 3) total_cost was backfilled to final_cost before this migration.
supabase/migrations/20260603095001_drop_total_cost_from_service_orders.sql:8:  drop constraint if exists service_orders_total_cost_check;
supabase/migrations/20260603095001_drop_total_cost_from_service_orders.sql:11:  drop column if exists total_cost;
supabase/migrations/20260514133525_remote_schema.sql:617:alter table "public"."service_orders" add column "total_cost" numeric(12,2) default 0;
supabase/migrations/20260514133525_remote_schema.sql:651:alter table "public"."service_orders" add constraint "service_orders_total_cost_check" CHECK ((total_cost >= (0)::numeric)) not valid;
supabase/migrations/20260514133525_remote_schema.sql:652:alter table "public"."service_orders" validate constraint "service_orders_total_cost_check";
supabase/migrations/20260514133525_remote_schema.sql:664:    so.total_cost,

USOS ESTIMATED_COST
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:530:          estimated_cost: estimatedCost,
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:627:        estimated_cost: estimatedCost,
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1229:      .select('id, estimated_cost, final_cost, evidence_metadata')
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1242:    const nextEstimatedCost = typeof body.estimatedCost === 'number' ? body.estimatedCost : Number(order.estimated_cost ?? 0);
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1248:        estimated_cost: nextEstimatedCost,
apps/api/src/controllers/requests.ts:196:          estimated_cost: estimatedCost,
apps/api/src/controllers/orders.ts:530:          estimated_cost: estimatedCost,
apps/api/src/controllers/orders.ts:627:        estimated_cost: estimatedCost,
apps/api/src/controllers/orders.ts:1229:      .select('id, estimated_cost, final_cost, evidence_metadata')
apps/api/src/controllers/orders.ts:1242:    const nextEstimatedCost = typeof body.estimatedCost === 'number' ? body.estimatedCost : Number(order.estimated_cost ?? 0);
apps/api/src/controllers/orders.ts:1248:        estimated_cost: nextEstimatedCost,
apps/api/src/controllers/requests.ts.bak.20260603_101809:161:          estimated_cost: estimatedCost,
apps/api/src/controllers/orders.ts.bak.20260603_102231:530:          estimated_cost: estimatedCost,
apps/api/src/controllers/orders.ts.bak.20260603_102231:627:        estimated_cost: estimatedCost,
apps/api/src/controllers/orders.ts.bak.20260603_102231:1229:      .select('id, estimated_cost, final_cost, evidence_metadata')
apps/api/src/controllers/orders.ts.bak.20260603_102231:1242:    const nextEstimatedCost = typeof body.estimatedCost === 'number' ? body.estimatedCost : Number(order.estimated_cost ?? 0);
apps/api/src/controllers/orders.ts.bak.20260603_102231:1248:        estimated_cost: nextEstimatedCost,
apps/api/src/controllers/public.ts:297:      .select('id, tenant_id, folio, status, created_at, device_info, problem_description, serial_number, receipt_url, estimated_cost, final_cost, metadata')
apps/api/src/controllers/public.ts:351:      .select('id, tenant_id, folio, status, created_at, updated_at, promised_date, device_info, problem_description, serial_number, receipt_url, estimated_cost, final_cost, evidence_metadata, metadata')
supabase/migrations/20260603095001_drop_total_cost_from_service_orders.sql:4:-- 2) service_orders.estimated_cost is the quote/estimate.
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:148:      payment_amount := coalesce(nullif(new.final_cost, 0), nullif(new.estimated_cost, 0), 0);
supabase/migrations/20260514133525_remote_schema.sql:601:alter table "public"."service_orders" drop column "estimated_cost";
supabase/migrations/20260424_baseline_schema.sql:110:  estimated_cost numeric(12,2) not null default 0,
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:102:  add column if not exists estimated_cost numeric(12,2) not null default 0;

USOS FINAL_COST
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:531:          final_cost: finalCost,
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:626:        final_cost: finalCost,
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1229:      .select('id, estimated_cost, final_cost, evidence_metadata')
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1243:    const nextFinalCost = typeof body.finalCost === 'number' ? body.finalCost : Number(order.final_cost ?? nextEstimatedCost);
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1249:        final_cost: nextFinalCost,
apps/api/src/controllers/requests.ts:197:          final_cost: finalCost,
apps/api/src/controllers/reports.ts:17:    let ordersQuery = supabase.from('service_orders').select('id, status, created_at, final_cost, sucursal_id, promised_date, folio').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:103:      (sum, order) => sum + Number((order as { final_cost?: number | null }).final_cost ?? 0),
apps/api/src/controllers/orders.ts:531:          final_cost: finalCost,
apps/api/src/controllers/orders.ts:626:        final_cost: finalCost,
apps/api/src/controllers/orders.ts:1229:      .select('id, estimated_cost, final_cost, evidence_metadata')
apps/api/src/controllers/orders.ts:1243:    const nextFinalCost = typeof body.finalCost === 'number' ? body.finalCost : Number(order.final_cost ?? nextEstimatedCost);
apps/api/src/controllers/orders.ts:1249:        final_cost: nextFinalCost,
apps/api/src/controllers/requests.ts.bak.20260603_101809:162:          final_cost: finalCost,
apps/api/src/controllers/orders.ts.bak.20260603_102231:531:          final_cost: finalCost,
apps/api/src/controllers/orders.ts.bak.20260603_102231:626:        final_cost: finalCost,
apps/api/src/controllers/orders.ts.bak.20260603_102231:1229:      .select('id, estimated_cost, final_cost, evidence_metadata')
apps/api/src/controllers/orders.ts.bak.20260603_102231:1243:    const nextFinalCost = typeof body.finalCost === 'number' ? body.finalCost : Number(order.final_cost ?? nextEstimatedCost);
apps/api/src/controllers/orders.ts.bak.20260603_102231:1249:        final_cost: nextFinalCost,
apps/api/src/controllers/finance.ts:17:function resolveOrderIncome(order: { final_cost?: number | null }) {
apps/api/src/controllers/finance.ts:18:  return Number(order.final_cost ?? 0);
apps/api/src/controllers/finance.ts:41:      .select('id, tenant_id, sucursal_id, final_cost, created_at, status')
apps/api/src/controllers/finance.ts:81:    const totalIncome = filteredOrders.reduce((sum, order) => sum + resolveOrderIncome(order as { final_cost?: number | null }), 0);
apps/api/src/controllers/finance.ts:98:        balance: resolveOrderIncome(order as { final_cost?: number | null }),
apps/api/src/controllers/finance.ts:99:        income: resolveOrderIncome(order as { final_cost?: number | null }),
apps/api/src/controllers/finance.ts:145:      const income = resolveOrderIncome(order as { final_cost?: number | null });
apps/api/src/controllers/public.ts:297:      .select('id, tenant_id, folio, status, created_at, device_info, problem_description, serial_number, receipt_url, estimated_cost, final_cost, metadata')
apps/api/src/controllers/public.ts:351:      .select('id, tenant_id, folio, status, created_at, updated_at, promised_date, device_info, problem_description, serial_number, receipt_url, estimated_cost, final_cost, evidence_metadata, metadata')
supabase/migrations/20260603095001_drop_total_cost_from_service_orders.sql:1:-- Drop legacy total_cost after migrating all runtime consumers to final_cost.
supabase/migrations/20260603095001_drop_total_cost_from_service_orders.sql:3:-- 1) service_orders.final_cost is the canonical charged amount.
supabase/migrations/20260603095001_drop_total_cost_from_service_orders.sql:5:-- 3) total_cost was backfilled to final_cost before this migration.
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:148:      payment_amount := coalesce(nullif(new.final_cost, 0), nullif(new.estimated_cost, 0), 0);
supabase/migrations/20260514133525_remote_schema.sql:602:alter table "public"."service_orders" drop column "final_cost";
supabase/migrations/20260424_baseline_schema.sql:111:  final_cost numeric(12,2) not null default 0,
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:105:  add column if not exists final_cost numeric(12,2) not null default 0;

==================================================

# BRANCH_ID

branch_id backend: 8
sucursal_id backend: 133

TOP BRANCH_ID
apps/api/src/controllers/users.ts.bak.20260603_093424:92:    sucursalId: row.sucursal_id ?? row.branch_id ?? null,
apps/api/src/controllers/users.ts.bak.20260603_093424:127:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at', { count: 'exact' })
apps/api/src/controllers/users.ts.bak.20260603_093424:236:          branch_id: body.sucursalId ?? null,
apps/api/src/controllers/users.ts.bak.20260603_093424:239:        .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
apps/api/src/controllers/users.ts.bak.20260603_093424:274:        branch_id: body.sucursalId ?? null,
apps/api/src/controllers/users.ts.bak.20260603_093424:276:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
apps/api/src/controllers/users.ts.bak.20260603_093424:355:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
apps/api/src/controllers/users.ts.bak.20260603_093424:406:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
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

==================================================

# ARCHIVOS TEMPORALES

apps/api/src/controllers/requests.ts.bak.20260603_101809
apps/api/src/controllers/orders.ts.bak.20260603_102231
apps/api/src/controllers/users.ts.bak.20260603_093424
apps/api/src/controllers/orders.ts.pre_evidence_cleanup

==================================================

# RESUMEN EJECUTIVO

organizations: POSIBLE DEUDA TECNICA
total_cost: REQUIERE REVISION
branch_id: CASI ELIMINADO

FIN
