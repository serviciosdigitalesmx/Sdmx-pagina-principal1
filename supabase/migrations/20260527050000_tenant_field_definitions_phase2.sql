create table if not exists public.tenant_field_definitions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  entity text not null,
  field_key text not null,
  field_label text not null,
  field_type text not null,
  required boolean not null default false,
  options jsonb not null default '[]'::jsonb,
  field_order integer not null default 0,
  placeholder text,
  help_text text,
  visible boolean not null default true,
  validation jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tenant_field_definitions_unique unique (tenant_id, entity, field_key)
);

create index if not exists tenant_field_definitions_tenant_entity_idx
  on public.tenant_field_definitions (tenant_id, entity, visible, field_order, field_key);

alter table public.tenant_field_definitions enable row level security;

drop policy if exists tenant_field_definitions_select on public.tenant_field_definitions;
create policy tenant_field_definitions_select
on public.tenant_field_definitions
for select
using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);

drop policy if exists tenant_field_definitions_write on public.tenant_field_definitions;
create policy tenant_field_definitions_write
on public.tenant_field_definitions
for all
using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id)
with check ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);

alter table public.service_requests
  add column if not exists metadata jsonb not null default '{}'::jsonb;

alter table public.service_orders
  add column if not exists metadata jsonb not null default '{}'::jsonb;

drop trigger if exists trg_tenant_field_definitions_updated_at on public.tenant_field_definitions;
create trigger trg_tenant_field_definitions_updated_at
before update on public.tenant_field_definitions
for each row execute function public.set_updated_at();
