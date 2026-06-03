# RELACION TENANTS / ORGANIZATIONS

## CREATE TABLE TENANTS
supabase/migrations/20260424_baseline_schema.sql:14:create table if not exists public.tenants (

## CREATE TABLE ORGANIZATIONS
supabase/migrations/20260514133525_remote_schema.sql:565:create table "public"."organizations" (

## FOREIGN KEYS HACIA TENANTS
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:2:  tenant_id uuid primary key references public.tenants(id) on delete cascade,
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:38:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:69:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:98:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260515110000_restore_users_compat.sql:3:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260527070000_tenant_semaphore_rules.sql:3:  tenant_id uuid not null references public.tenants(id) on delete cascade,
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
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:25:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:106:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260530132000_security_backoffice_tables.sql:14:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260530132000_security_backoffice_tables.sql:35:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260514150000_add_tenant_onboarding.sql:4:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260530150000_add_pwa_push_subscriptions.sql:3:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260523190000_order_documents_events.sql:3:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260523190000_order_documents_events.sql:20:  tenant_id uuid not null references public.tenants(id) on delete cascade,

## FOREIGN KEYS HACIA ORGANIZATIONS
supabase/migrations/20260514133525_remote_schema.sql:643:alter table "public"."profiles" add constraint "profiles_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES public.organizations(id) not valid;
supabase/migrations/20260514133525_remote_schema.sql:653:alter table "public"."customers" add constraint "customers_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE not valid;
supabase/migrations/20260514133525_remote_schema.sql:657:alter table "public"."service_orders" add constraint "service_orders_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE not valid;
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:15:  tenant_id uuid not null references public.organizations(id) on delete cascade,
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:50:  tenant_id uuid not null references public.organizations(id) on delete cascade,
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:70:  tenant_id uuid not null references public.organizations(id) on delete cascade,
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:87:  tenant_id uuid not null references public.organizations(id) on delete cascade,

## COLUMNAS organization_id
supabase/migrations/20260514133525_remote_schema.sql:577:    "organization_id" uuid,
supabase/migrations/20260514133525_remote_schema.sql:643:alter table "public"."profiles" add constraint "profiles_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES public.organizations(id) not valid;
supabase/migrations/20260514133525_remote_schema.sql:644:alter table "public"."profiles" validate constraint "profiles_organization_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:717:using ((tenant_id = ( SELECT profiles.organization_id
supabase/migrations/20260514133525_remote_schema.sql:725:using ((organization_id = ( SELECT profiles_1.organization_id
supabase/migrations/20260514133525_remote_schema.sql:733:using ((tenant_id = ( SELECT profiles.organization_id

## COLUMNAS tenant_id
supabase/migrations/20260530143000_add_public_token_to_service_orders.sql:15:  on public.service_orders (tenant_id, public_token);
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:3:create or replace function public._live_tenant_id()
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:8:  select nullif(auth.jwt() ->> 'tenant_id', '')::uuid
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:36:using (public._live_tenant_id() = tenant_id);
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:43:using (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'))
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:44:with check (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'));
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:51:using (public._live_tenant_id() = tenant_id);
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:58:using (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'))
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:59:with check (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'));
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:66:using (public._live_tenant_id() = tenant_id);
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:73:using (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'))
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:74:with check (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'));
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:81:using (public._live_tenant_id() = tenant_id);
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:88:using (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'))
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:89:with check (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'));
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:96:using (public._live_tenant_id() = tenant_id);
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:103:using (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'))
supabase/migrations/20260527084500_harden_live_inventory_rls.sql:104:with check (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'));
supabase/migrations/20260530121000_add_assigned_user_to_service_orders.sql:7:  on public.service_orders (tenant_id, assigned_user_id, created_at desc);
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:30:  on public.service_orders (tenant_id, sucursal_id);
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:56:  on public.purchase_orders (tenant_id, sucursal_id);
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:82:  on public.inventory_movements (tenant_id, sucursal_id, created_at desc);
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:108:  on public.stock_alerts (tenant_id, sucursal_id);
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:2:  tenant_id uuid primary key references public.tenants(id) on delete cascade,
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:27:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:33:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id)
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:34:with check ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:38:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:46:  constraint tenant_enabled_modules_unique unique (tenant_id, module_key)
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:49:create index if not exists tenant_enabled_modules_tenant_idx
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:50:  on public.tenant_enabled_modules (tenant_id, sort_order, module_key);
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:58:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:64:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id)
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:65:with check ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:69:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:75:  constraint tenant_label_overrides_unique unique (tenant_id, label_key)
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:78:create index if not exists tenant_label_overrides_tenant_idx
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:79:  on public.tenant_label_overrides (tenant_id, label_key);
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:87:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:93:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id)
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:94:with check ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:98:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:109:  constraint tenant_workflow_statuses_unique unique (tenant_id, workflow_key, status_key)
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:112:create index if not exists tenant_workflow_statuses_tenant_idx
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:113:  on public.tenant_workflow_statuses (tenant_id, workflow_key, sort_order, status_key);
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:121:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:127:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id)
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:128:with check ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260515110000_restore_users_compat.sql:3:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260515110000_restore_users_compat.sql:16:  on public.users (tenant_id, lower(email));
supabase/migrations/20260515110000_restore_users_compat.sql:18:  on public.users (tenant_id, auth_user_id)
supabase/migrations/20260530120000_expand_users_admin_module.sql:20:  on public.users (tenant_id, role, activo);
supabase/migrations/20260530120000_expand_users_admin_module.sql:23:  on public.users (tenant_id, ultimo_acceso desc nulls last);
supabase/migrations/20260527070000_tenant_semaphore_rules.sql:3:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260527070000_tenant_semaphore_rules.sql:19:  constraint tenant_semaphore_rules_unique unique (tenant_id, industry_key, workflow_key, status_key, metric)
supabase/migrations/20260527070000_tenant_semaphore_rules.sql:22:create index if not exists tenant_semaphore_rules_tenant_idx
supabase/migrations/20260527070000_tenant_semaphore_rules.sql:23:  on public.tenant_semaphore_rules (tenant_id, industry_key, workflow_key, priority, status_key, metric);
supabase/migrations/20260527070000_tenant_semaphore_rules.sql:31:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260527070000_tenant_semaphore_rules.sql:37:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id)
supabase/migrations/20260527070000_tenant_semaphore_rules.sql:38:with check ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:13:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:24:  on public.audit_logs (tenant_id, created_at desc);
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:27:  on public.audit_logs (tenant_id, action);
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:30:  on public.audit_logs (tenant_id, user_id, created_at desc);
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:34:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:46:  on public.security_sessions (tenant_id, revoked_at, last_activity_at desc);
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:49:  on public.security_sessions (tenant_id, user_id, last_activity_at desc);
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:61:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id and coalesce(auth.jwt() ->> 'role', '') = 'owner');
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:69:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:12:  select nullif(auth.jwt() ->> 'tenant_id', '')::uuid
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:25:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:38:  on public.sucursales (tenant_id, code)
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:41:create index if not exists sucursales_tenant_idx
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:42:  on public.sucursales (tenant_id);
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:57:using (public._sucursal_tenant_jwt_id() = tenant_id);
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
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:146:using (public._sucursal_tenant_jwt_id() = tenant_id);
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
supabase/migrations/20260527010000_align_service_requests_tenant_fk.sql:22:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260527010000_align_service_requests_tenant_fk.sql:29:with check ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260527010000_align_service_requests_tenant_fk.sql:36:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id)
supabase/migrations/20260527010000_align_service_requests_tenant_fk.sql:37:with check ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260527010000_align_service_requests_tenant_fk.sql:44:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260523204000_restore_branches_table.sql:4:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260523204000_restore_branches_table.sql:16:  on public.branches (tenant_id, code)
supabase/migrations/20260523204000_restore_branches_table.sql:18:create index if not exists branches_tenant_idx
supabase/migrations/20260523204000_restore_branches_table.sql:19:  on public.branches (tenant_id);
supabase/migrations/20260523204000_restore_branches_table.sql:30:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260523204000_restore_branches_table.sql:37:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260523204000_restore_branches_table.sql:41:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260527050000_tenant_field_definitions_phase2.sql:3:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260527050000_tenant_field_definitions_phase2.sql:18:  constraint tenant_field_definitions_unique unique (tenant_id, entity, field_key)
supabase/migrations/20260527050000_tenant_field_definitions_phase2.sql:22:  on public.tenant_field_definitions (tenant_id, entity, visible, field_order, field_key);
supabase/migrations/20260527050000_tenant_field_definitions_phase2.sql:30:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
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
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:213:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id and coalesce(auth.jwt() ->> 'role', '') = 'owner');
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:221:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
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
supabase/migrations/20260514133525_remote_schema.sql:653:alter table "public"."customers" add constraint "customers_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE not valid;
supabase/migrations/20260514133525_remote_schema.sql:654:alter table "public"."customers" validate constraint "customers_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:657:alter table "public"."service_orders" add constraint "service_orders_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE not valid;
supabase/migrations/20260514133525_remote_schema.sql:658:alter table "public"."service_orders" validate constraint "service_orders_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:667:    so.tenant_id
supabase/migrations/20260514133525_remote_schema.sql:717:using ((tenant_id = ( SELECT profiles.organization_id
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
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:25:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:38:  on public.sucursales (tenant_id, code)
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:41:create index if not exists sucursales_tenant_idx
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:42:  on public.sucursales (tenant_id);
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:57:using (public._sucursal_tenant_jwt_id() = tenant_id);
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
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:139:using (public._sucursal_tenant_jwt_id() = tenant_id);
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
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:185:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:193:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:197:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:206:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:214:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:218:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:227:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:235:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:239:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:248:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:256:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:260:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:12:  select nullif(auth.jwt() ->> 'tenant_id', '')::uuid
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:137:      using (public._is_tenant_member(tenant_id))
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:146:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:147:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:158:      using (public._is_tenant_member(tenant_id))
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:166:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:174:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:175:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:183:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:194:      using (public._is_tenant_member(tenant_id))
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:202:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:210:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:211:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:219:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:230:      using (public._is_tenant_member(tenant_id))
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:238:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:246:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:247:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:255:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:263:      using (public._is_tenant_member(tenant_id) and public._jwt_role() = 'technician')
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:264:      with check (public._is_tenant_member(tenant_id) and public._jwt_role() = 'technician')
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:275:      using (public._is_tenant_member(tenant_id))
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:283:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:284:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:295:      using (public._is_tenant_member(tenant_id))
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:303:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:304:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:315:      using (public._is_tenant_member(tenant_id))
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:323:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:324:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:335:      using (public._is_tenant_member(tenant_id))
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:343:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:344:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:355:      using (public._is_tenant_member(tenant_id))
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:363:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:364:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:375:      using (public._is_tenant_member(tenant_id))
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:383:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:384:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:395:      using (public._is_tenant_member(tenant_id) and public._jwt_role() = 'owner')
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:396:      with check (public._is_tenant_member(tenant_id) and public._jwt_role() = 'owner')
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:405:        public._is_tenant_member(tenant_id)
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:407:        and ((public._tenant_jwt_id() = tenant_id) is true)
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:417:        public._is_tenant_member(tenant_id)
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:428:        public._is_tenant_member(tenant_id)
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:432:        public._is_tenant_member(tenant_id)
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:443:        public._is_tenant_member(tenant_id)
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:456:      using (public._is_tenant_member(tenant_id))
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:464:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:465:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:476:      using (public._is_tenant_member(tenant_id))
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:484:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:485:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:496:      using (public._is_tenant_member(tenant_id))
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:504:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:505:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:516:      using (public._is_tenant_member(tenant_id))
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:524:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:525:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:536:      using (public._is_tenant_member(tenant_id))
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:544:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:545:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:556:      using (public._is_tenant_member(tenant_id))
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:564:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:565:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:576:      using (public._is_tenant_member(tenant_id))
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:584:      using (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:585:      with check (public._is_tenant_member(tenant_id) and public._is_owner_or_manager())
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:596:      using (public._is_tenant_member(tenant_id))
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
supabase/migrations/20260514120000_enable_rls_and_policies.sql:16:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:23:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:31:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:35:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:43:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:51:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:55:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:64:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:71:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:79:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:83:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:91:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:100:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:107:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:115:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:119:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:128:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:135:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:143:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:147:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:155:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:164:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:171:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:178:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:182:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:190:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:194:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:203:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:207:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:215:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:224:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:233:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:238:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:247:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:257:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:264:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514120000_enable_rls_and_policies.sql:268:  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
supabase/migrations/20260514150000_add_tenant_onboarding.sql:4:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260514150000_add_tenant_onboarding.sql:31:  on public.users (tenant_id, auth_user_id)
supabase/migrations/20260514150000_add_tenant_onboarding.sql:34:  on public.users (tenant_id, lower(email));
supabase/migrations/20260514150000_add_tenant_onboarding.sql:44:  tenant_id uuid,
supabase/migrations/20260514150000_add_tenant_onboarding.sql:54:  v_tenant_id uuid;
supabase/migrations/20260514150000_add_tenant_onboarding.sql:105:  returning id into v_tenant_id;
supabase/migrations/20260514150000_add_tenant_onboarding.sql:108:    tenant_id,
supabase/migrations/20260514150000_add_tenant_onboarding.sql:116:    v_tenant_id,
supabase/migrations/20260514150000_add_tenant_onboarding.sql:125:  tenant_id := v_tenant_id;
supabase/migrations/20260514150000_add_tenant_onboarding.sql:138:using ((auth.jwt() ->> 'tenant_id')::uuid = id);
supabase/migrations/20260514150000_add_tenant_onboarding.sql:149:  (auth.jwt() ->> 'tenant_id')::uuid = id
supabase/migrations/20260514150000_add_tenant_onboarding.sql:153:  (auth.jwt() ->> 'tenant_id')::uuid = id
supabase/migrations/20260514150000_add_tenant_onboarding.sql:161:  (auth.jwt() ->> 'tenant_id')::uuid = id
supabase/migrations/20260530150000_add_pwa_push_subscriptions.sql:3:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260530150000_add_pwa_push_subscriptions.sql:16:  on public.pwa_push_subscriptions (tenant_id, endpoint);
supabase/migrations/20260530150000_add_pwa_push_subscriptions.sql:24:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260530150000_add_pwa_push_subscriptions.sql:30:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id)
supabase/migrations/20260530150000_add_pwa_push_subscriptions.sql:31:with check ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260523190000_order_documents_events.sql:3:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260523190000_order_documents_events.sql:17:  on public.service_order_documents (tenant_id, service_order_id, created_at desc);
supabase/migrations/20260523190000_order_documents_events.sql:20:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260523190000_order_documents_events.sql:31:  on public.service_order_events (tenant_id, service_order_id, created_at desc);
supabase/migrations/20260523190000_order_documents_events.sql:38:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260523190000_order_documents_events.sql:43:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id)
supabase/migrations/20260523190000_order_documents_events.sql:44:with check ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260523190000_order_documents_events.sql:49:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260523190000_order_documents_events.sql:54:using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id)
supabase/migrations/20260523190000_order_documents_events.sql:55:with check ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:3:create or replace function public._live_tenant_id()
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:8:  select nullif(auth.jwt() ->> 'tenant_id', '')::uuid
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:36:using (public._live_tenant_id() = tenant_id);
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:43:using (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'))
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:44:with check (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'));
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:51:using (public._live_tenant_id() = tenant_id);
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:58:using (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'))
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:59:with check (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'));
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:66:using (public._live_tenant_id() = tenant_id);
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:73:using (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'))
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:74:with check (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'));
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:81:using (public._live_tenant_id() = tenant_id);
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:88:using (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'))
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:89:with check (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'));
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:96:using (public._live_tenant_id() = tenant_id);
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:103:using (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'))
supabase/migrations/20260528000600_harden_live_inventory_rls.sql:104:with check (public._live_tenant_id() = tenant_id and public._live_role() in ('owner', 'manager'));
apps/api/src/middleware/auth.ts:10:  tenant_id: string;
apps/api/src/middleware/auth.ts:34:  const tenantId = typeof payload.tenant_id === 'string' ? payload.tenant_id : null;
apps/api/src/middleware/auth.ts:57:    tenant_id: z.string().min(1),
apps/api/src/middleware/auth.ts:93:        .select('id, tenant_id, role, sucursal_id, activo, is_active, mfa_enabled')
apps/api/src/middleware/auth.ts:95:        .eq('tenant_id', claims.tenant_id)
apps/api/src/middleware/auth.ts:110:          .select('id, tenant_id, user_id, revoked_at')
apps/api/src/middleware/auth.ts:112:          .eq('tenant_id', claims.tenant_id)
apps/api/src/middleware/auth.ts:133:        tenantId: claims.tenant_id,
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:87:  tenant_id: string;
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:102:  tenant_id: string;
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:292:  tenant_id: string;
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:311:  tenant_id: string;
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:515:          tenant_id: tenantId,
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:558:        tenant_id: tenantId,
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:591:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:596:      tenant_id: tenantId,
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:661:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:710:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:720:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:725:        .select('id, tenant_id, service_order_id, bucket_name, storage_path, public_url, file_name, file_type, mime_type, file_size, source, created_at')
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:726:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:731:        .select('id, tenant_id, service_order_id, event_type, previous_status, new_status, note, actor_name, created_at')
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:732:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:810:      .select('id, tenant_id, evidence_metadata')
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:811:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:814:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:851:        tenant_id: tenantId,
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:869:        tenant_id: tenantId,
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:884:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:901:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:917:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:944:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:970:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:982:        tenant_id: tenantId,
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:998:        tenant_id: tenantId,
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1042:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1045:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1068:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1078:      tenant_id: tenantId,
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1126:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1129:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1154:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1178:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1183:      tenant_id: tenantId,
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1230:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1233:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1252:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1280:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1289:        tenant_id: tenantId,
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1325:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1328:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1358:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1386:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1425:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1440:        tenant_id: tenantId,
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1482:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1500:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1512:      tenant_id: tenantId,
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1535:      .eq('tenant_id', tenantId)
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
apps/api/src/controllers/auth.controller.ts:181:      tenantId: tenant?.tenant_id ?? null,
apps/api/src/controllers/auth.controller.ts:187:    if (!tenant?.tenant_id || !tenantSlug) {
apps/api/src/controllers/auth.controller.ts:191:    console.log('STEP_TENANT_OBTAINED', { tenantId: tenant.tenant_id, tenantSlug });
apps/api/src/controllers/auth.controller.ts:197:      tenant_id: tenant.tenant_id,
apps/api/src/controllers/auth.controller.ts:199:    }, tenant.tenant_id);
apps/api/src/controllers/auth.controller.ts:202:      tenantId: tenant.tenant_id,
apps/api/src/controllers/auth.controller.ts:213:      tenantId: tenant.tenant_id,
apps/api/src/controllers/auth.controller.ts:219:        id: tenant.tenant_id,
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
apps/api/src/controllers/requests.ts:128:          .eq('tenant_id', tenantId)
apps/api/src/controllers/requests.ts:139:          .eq('tenant_id', tenantId)
apps/api/src/controllers/requests.ts:153:              tenant_id: tenantId,
apps/api/src/controllers/requests.ts:182:          tenant_id: tenantId,
apps/api/src/controllers/requests.ts:213:      .eq('tenant_id', tenantId)
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
apps/api/src/controllers/reports.ts:17:    let ordersQuery = supabase.from('service_orders').select('id, status, created_at, final_cost, sucursal_id, promised_date, folio').eq('tenant_id', tenantId).limit(500);
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
apps/api/src/controllers/requests.ts.bak.20260603_101809:33:      .eq('tenant_id', tenantId)
apps/api/src/controllers/requests.ts.bak.20260603_101809:68:      .eq('tenant_id', tenantId)
apps/api/src/controllers/requests.ts.bak.20260603_101809:108:      .eq('tenant_id', tenantId)
apps/api/src/controllers/requests.ts.bak.20260603_101809:122:            tenant_id: tenantId,
apps/api/src/controllers/requests.ts.bak.20260603_101809:147:          tenant_id: tenantId,
apps/api/src/controllers/requests.ts.bak.20260603_101809:178:      .eq('tenant_id', tenantId)
apps/api/src/controllers/security.ts:38:    .eq('tenant_id', tenantId);
apps/api/src/controllers/security.ts:51:    .eq('tenant_id', tenantId)
apps/api/src/controllers/security.ts:71:      supabaseAdmin.from('users').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId),
apps/api/src/controllers/security.ts:72:      supabaseAdmin.from('sucursales').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId),
apps/api/src/controllers/security.ts:145:        tenant_id: tenantId,
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
apps/api/src/controllers/orders.ts.bak.20260603_102231:87:  tenant_id: string;
apps/api/src/controllers/orders.ts.bak.20260603_102231:102:  tenant_id: string;
apps/api/src/controllers/orders.ts.bak.20260603_102231:292:  tenant_id: string;
apps/api/src/controllers/orders.ts.bak.20260603_102231:311:  tenant_id: string;
apps/api/src/controllers/orders.ts.bak.20260603_102231:515:          tenant_id: tenantId,
apps/api/src/controllers/orders.ts.bak.20260603_102231:558:        tenant_id: tenantId,
apps/api/src/controllers/orders.ts.bak.20260603_102231:591:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.bak.20260603_102231:596:      tenant_id: tenantId,
apps/api/src/controllers/orders.ts.bak.20260603_102231:661:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.bak.20260603_102231:710:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.bak.20260603_102231:720:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.bak.20260603_102231:725:        .select('id, tenant_id, service_order_id, bucket_name, storage_path, public_url, file_name, file_type, mime_type, file_size, source, created_at')
apps/api/src/controllers/orders.ts.bak.20260603_102231:726:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.bak.20260603_102231:731:        .select('id, tenant_id, service_order_id, event_type, previous_status, new_status, note, actor_name, created_at')
apps/api/src/controllers/orders.ts.bak.20260603_102231:732:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.bak.20260603_102231:810:      .select('id, tenant_id, evidence_metadata')
apps/api/src/controllers/orders.ts.bak.20260603_102231:811:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.bak.20260603_102231:814:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts.bak.20260603_102231:851:        tenant_id: tenantId,
apps/api/src/controllers/orders.ts.bak.20260603_102231:869:        tenant_id: tenantId,
apps/api/src/controllers/orders.ts.bak.20260603_102231:884:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.bak.20260603_102231:901:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.bak.20260603_102231:917:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.bak.20260603_102231:944:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.bak.20260603_102231:970:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.bak.20260603_102231:982:        tenant_id: tenantId,
apps/api/src/controllers/orders.ts.bak.20260603_102231:998:        tenant_id: tenantId,
apps/api/src/controllers/orders.ts.bak.20260603_102231:1042:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.bak.20260603_102231:1045:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts.bak.20260603_102231:1068:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.bak.20260603_102231:1078:      tenant_id: tenantId,
apps/api/src/controllers/orders.ts.bak.20260603_102231:1126:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.bak.20260603_102231:1129:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts.bak.20260603_102231:1154:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.bak.20260603_102231:1178:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.bak.20260603_102231:1183:      tenant_id: tenantId,
apps/api/src/controllers/orders.ts.bak.20260603_102231:1230:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.bak.20260603_102231:1233:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts.bak.20260603_102231:1252:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.bak.20260603_102231:1280:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.bak.20260603_102231:1289:        tenant_id: tenantId,
apps/api/src/controllers/orders.ts.bak.20260603_102231:1325:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.bak.20260603_102231:1328:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts.bak.20260603_102231:1358:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.bak.20260603_102231:1386:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.bak.20260603_102231:1425:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.bak.20260603_102231:1440:        tenant_id: tenantId,
apps/api/src/controllers/orders.ts.bak.20260603_102231:1482:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.bak.20260603_102231:1500:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts.bak.20260603_102231:1512:      tenant_id: tenantId,
apps/api/src/controllers/orders.ts.bak.20260603_102231:1535:      .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts.bak.20260603_093424:50:    .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts.bak.20260603_093424:79:    tenantId: String(row.tenant_id ?? ''),
apps/api/src/controllers/users.ts.bak.20260603_093424:127:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at', { count: 'exact' })
apps/api/src/controllers/users.ts.bak.20260603_093424:128:      .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts.bak.20260603_093424:202:        tenant_id: tenantId,
apps/api/src/controllers/users.ts.bak.20260603_093424:217:      .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts.bak.20260603_093424:239:        .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
apps/api/src/controllers/users.ts.bak.20260603_093424:265:        tenant_id: tenantId,
apps/api/src/controllers/users.ts.bak.20260603_093424:276:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
apps/api/src/controllers/users.ts.bak.20260603_093424:335:      .select('id, tenant_id, auth_user_id, role, activo, is_active')
apps/api/src/controllers/users.ts.bak.20260603_093424:337:      .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts.bak.20260603_093424:354:      .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts.bak.20260603_093424:355:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
apps/api/src/controllers/users.ts.bak.20260603_093424:405:      .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts.bak.20260603_093424:406:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
apps/api/src/controllers/users.ts.bak.20260603_093424:450:      .select('id, tenant_id, auth_user_id, name, full_name, email, role, activo')
apps/api/src/controllers/users.ts.bak.20260603_093424:452:      .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts.bak.20260603_093424:465:      .select('id, tenant_id, sucursal_id, supplier_id, related_service_order_id, folio, status, reference, payment_terms, expected_date, subtotal, tax_amount, total, notes, created_at, updated_at')
apps/api/src/controllers/users.ts.bak.20260603_093424:466:      .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts:50:    .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts:79:    tenantId: String(row.tenant_id ?? ''),
apps/api/src/controllers/users.ts:127:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, created_at, updated_at', { count: 'exact' })
apps/api/src/controllers/users.ts:128:      .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts:202:        tenant_id: tenantId,
apps/api/src/controllers/users.ts:217:      .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts:238:        .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, created_at, updated_at')
apps/api/src/controllers/users.ts:264:        tenant_id: tenantId,
apps/api/src/controllers/users.ts:274:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, created_at, updated_at')
apps/api/src/controllers/users.ts:333:      .select('id, tenant_id, auth_user_id, role, activo, is_active')
apps/api/src/controllers/users.ts:335:      .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts:352:      .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts:353:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, created_at, updated_at')
apps/api/src/controllers/users.ts:403:      .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts:404:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, created_at, updated_at')
apps/api/src/controllers/users.ts:448:      .select('id, tenant_id, auth_user_id, name, full_name, email, role, activo')
apps/api/src/controllers/users.ts:450:      .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts:463:      .select('id, tenant_id, sucursal_id, supplier_id, related_service_order_id, folio, status, reference, payment_terms, expected_date, subtotal, tax_amount, total, notes, created_at, updated_at')
apps/api/src/controllers/users.ts:464:      .eq('tenant_id', tenantId)
apps/api/src/controllers/finance.ts:25:    .eq('tenant_id', tenantId)
apps/api/src/controllers/finance.ts:41:      .select('id, tenant_id, sucursal_id, final_cost, created_at, status')
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
apps/api/src/controllers/public.ts:297:      .select('id, tenant_id, folio, status, created_at, device_info, problem_description, serial_number, receipt_url, estimated_cost, final_cost, metadata')
apps/api/src/controllers/public.ts:298:      .eq('tenant_id', tenant.id)
apps/api/src/controllers/public.ts:351:      .select('id, tenant_id, folio, status, created_at, updated_at, promised_date, device_info, problem_description, serial_number, receipt_url, estimated_cost, final_cost, evidence_metadata, metadata')
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
apps/api/src/services/security-backoffice.ts:111:    tenant_id: input.tenantId,
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

