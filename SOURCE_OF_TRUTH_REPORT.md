# SOURCE OF TRUTH REPORT

## FOREIGN KEYS
TENANTS FK: 49
ORGANIZATIONS FK: 4

## BACKEND REFERENCES
TENANTS: 21
ORGANIZATIONS: 4

## SECURITY / JWT
tenant_id references: 871
organization_id references: 6

## QUERIES
from('tenants'): 21
from('organizations'): 4

## SCORE
TENANTS SCORE = 962
ORGANIZATIONS SCORE = 18

### CANDIDATO FUENTE DE VERDAD
TENANTS

## TOP 50 USOS TENANTS
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:327:    .from('tenants')
apps/api/src/controllers/meta.ts:76:      .from('tenants')
apps/api/src/controllers/meta.ts:115:      .from('tenants')
apps/api/src/controllers/meta.ts:180:      .from('tenants')
apps/api/src/controllers/meta.ts:216:        .from('tenants')
apps/api/src/controllers/auth.controller.ts:409:      .from('tenants')
apps/api/src/controllers/orders.ts:327:    .from('tenants')
apps/api/src/controllers/security.ts:130:      .from('tenants')
apps/api/src/controllers/security.ts:366:      .from('tenants')
apps/api/src/controllers/security.ts:377:      .from('tenants')
apps/api/src/controllers/security.ts:535:      .from('tenants')
apps/api/src/controllers/security.ts:545:      .from('tenants')
apps/api/src/controllers/orders.ts.bak.20260603_102231:327:    .from('tenants')
apps/api/src/controllers/users.ts.bak.20260603_093424:63:    .from('tenants')
apps/api/src/controllers/users.ts:63:    .from('tenants')
apps/api/src/controllers/public.ts:98:    .from('tenants')
apps/api/src/services/security-backoffice.ts:93:    .from('tenants')
apps/api/src/services/tenant-config.ts:596:      .from('tenants')
apps/api/src/services/tenant-billing.ts:32:      .from('tenants')
apps/api/src/services/billing.ts:125:      .from('tenants')
apps/api/src/services/billing.ts:163:    .from('tenants')
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

## TOP 50 USOS ORGANIZATIONS
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
