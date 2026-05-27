create table if not exists public.tenant_semaphore_rules (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  industry_key text,
  workflow_key text,
  status_key text not null,
  metric text not null,
  green_until_minutes integer,
  yellow_until_minutes integer,
  red_after_minutes integer,
  priority integer not null default 0,
  reason_template text,
  suggested_action_template text,
  action_key text,
  enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tenant_semaphore_rules_unique unique (tenant_id, industry_key, workflow_key, status_key, metric)
);

create index if not exists tenant_semaphore_rules_tenant_idx
  on public.tenant_semaphore_rules (tenant_id, industry_key, workflow_key, priority, status_key, metric);

alter table public.tenant_semaphore_rules enable row level security;

drop policy if exists tenant_semaphore_rules_select on public.tenant_semaphore_rules;
create policy tenant_semaphore_rules_select
on public.tenant_semaphore_rules
for select
using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);

drop policy if exists tenant_semaphore_rules_write on public.tenant_semaphore_rules;
create policy tenant_semaphore_rules_write
on public.tenant_semaphore_rules
for all
using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id)
with check ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);

drop trigger if exists trg_tenant_semaphore_rules_updated_at on public.tenant_semaphore_rules;
create trigger trg_tenant_semaphore_rules_updated_at
before update on public.tenant_semaphore_rules
for each row execute function public.set_updated_at();
