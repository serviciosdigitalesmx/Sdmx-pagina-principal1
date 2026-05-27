create table if not exists public.tenant_industry_profiles (
  tenant_id uuid primary key references public.tenants(id) on delete cascade,
  industry_key text not null default 'electronics_repair',
  industry_label text,
  asset_label text not null default 'Equipo',
  order_label text not null default 'Orden',
  request_label text not null default 'Solicitud',
  customer_label text not null default 'Cliente',
  portal_label text not null default 'Portal del cliente',
  quote_label text not null default 'Cotización',
  default_workflow_key text not null default 'service_orders',
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tenant_industry_profiles_industry_key_idx
  on public.tenant_industry_profiles (industry_key);

alter table public.tenant_industry_profiles enable row level security;

drop policy if exists tenant_industry_profiles_select on public.tenant_industry_profiles;
create policy tenant_industry_profiles_select
on public.tenant_industry_profiles
for select
using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);

drop policy if exists tenant_industry_profiles_write on public.tenant_industry_profiles;
create policy tenant_industry_profiles_write
on public.tenant_industry_profiles
for all
using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id)
with check ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);

create table if not exists public.tenant_enabled_modules (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  module_key text not null,
  module_label text,
  enabled boolean not null default true,
  sort_order integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tenant_enabled_modules_unique unique (tenant_id, module_key)
);

create index if not exists tenant_enabled_modules_tenant_idx
  on public.tenant_enabled_modules (tenant_id, sort_order, module_key);

alter table public.tenant_enabled_modules enable row level security;

drop policy if exists tenant_enabled_modules_select on public.tenant_enabled_modules;
create policy tenant_enabled_modules_select
on public.tenant_enabled_modules
for select
using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);

drop policy if exists tenant_enabled_modules_write on public.tenant_enabled_modules;
create policy tenant_enabled_modules_write
on public.tenant_enabled_modules
for all
using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id)
with check ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);

create table if not exists public.tenant_label_overrides (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  label_key text not null,
  label_value text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tenant_label_overrides_unique unique (tenant_id, label_key)
);

create index if not exists tenant_label_overrides_tenant_idx
  on public.tenant_label_overrides (tenant_id, label_key);

alter table public.tenant_label_overrides enable row level security;

drop policy if exists tenant_label_overrides_select on public.tenant_label_overrides;
create policy tenant_label_overrides_select
on public.tenant_label_overrides
for select
using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);

drop policy if exists tenant_label_overrides_write on public.tenant_label_overrides;
create policy tenant_label_overrides_write
on public.tenant_label_overrides
for all
using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id)
with check ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);

create table if not exists public.tenant_workflow_statuses (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  workflow_key text not null,
  status_key text not null,
  label text not null,
  tone text,
  sort_order integer not null default 0,
  is_default boolean not null default false,
  is_terminal boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tenant_workflow_statuses_unique unique (tenant_id, workflow_key, status_key)
);

create index if not exists tenant_workflow_statuses_tenant_idx
  on public.tenant_workflow_statuses (tenant_id, workflow_key, sort_order, status_key);

alter table public.tenant_workflow_statuses enable row level security;

drop policy if exists tenant_workflow_statuses_select on public.tenant_workflow_statuses;
create policy tenant_workflow_statuses_select
on public.tenant_workflow_statuses
for select
using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);

drop policy if exists tenant_workflow_statuses_write on public.tenant_workflow_statuses;
create policy tenant_workflow_statuses_write
on public.tenant_workflow_statuses
for all
using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id)
with check ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);

drop trigger if exists trg_tenant_industry_profiles_updated_at on public.tenant_industry_profiles;
create trigger trg_tenant_industry_profiles_updated_at
before update on public.tenant_industry_profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_tenant_enabled_modules_updated_at on public.tenant_enabled_modules;
create trigger trg_tenant_enabled_modules_updated_at
before update on public.tenant_enabled_modules
for each row execute function public.set_updated_at();

drop trigger if exists trg_tenant_label_overrides_updated_at on public.tenant_label_overrides;
create trigger trg_tenant_label_overrides_updated_at
before update on public.tenant_label_overrides
for each row execute function public.set_updated_at();

drop trigger if exists trg_tenant_workflow_statuses_updated_at on public.tenant_workflow_statuses;
create trigger trg_tenant_workflow_statuses_updated_at
before update on public.tenant_workflow_statuses
for each row execute function public.set_updated_at();
