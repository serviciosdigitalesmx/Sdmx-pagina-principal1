begin;

create table if not exists public.work_logs (
  id uuid primary key default gen_random_uuid(),

  tenant_id uuid not null references public.tenants(id) on delete cascade,
  service_order_id uuid not null references public.service_orders(id) on delete cascade,
  technician_user_id uuid not null references public.users(id) on delete restrict,
  sucursal_id uuid,

  status text not null default 'active',

  started_at timestamptz not null default timezone('utc', now()),
  paused_at timestamptz,
  ended_at timestamptz,

  paused_minutes integer not null default 0,
  duration_minutes integer,

  result text,
  notes text,

  commission_status text not null default 'not_configured',
  commission_rule_id uuid,
  commission_amount numeric(12,2),
  commission_snapshot jsonb,

  created_by uuid,
  updated_by uuid,
  approved_by uuid,
  approved_at timestamptz,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  constraint work_logs_status_check
    check (status in ('active', 'paused', 'completed', 'cancelled')),
  constraint work_logs_paused_minutes_check
    check (paused_minutes >= 0),
  constraint work_logs_duration_minutes_check
    check (duration_minutes is null or duration_minutes >= 0),
  constraint work_logs_commission_status_check
    check (commission_status in ('not_configured', 'calculated', 'pending_cost', 'cancelled')),
  constraint work_logs_time_order_check
    check (ended_at is null or ended_at >= started_at)
);

create table if not exists public.work_log_events (
  id uuid primary key default gen_random_uuid(),

  tenant_id uuid not null references public.tenants(id) on delete cascade,
  work_log_id uuid not null references public.work_logs(id) on delete cascade,
  service_order_id uuid not null references public.service_orders(id) on delete cascade,

  event_type text not null,
  previous_status text,
  new_status text,
  note text,

  actor_user_id uuid,
  actor_name text,

  snapshot jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default timezone('utc', now()),

  constraint work_log_events_type_check
    check (event_type in ('started', 'paused', 'resumed', 'stopped', 'cancelled', 'corrected', 'approved'))
);

create table if not exists public.technician_commission_rules (
  id uuid primary key default gen_random_uuid(),

  tenant_id uuid not null references public.tenants(id) on delete cascade,

  name text not null,
  active boolean not null default true,
  priority integer not null default 0,

  basis text not null default 'none',

  rate_percent numeric(7,4),
  fixed_amount numeric(12,2),
  hourly_amount numeric(12,2),

  valid_from timestamptz not null default timezone('utc', now()),
  valid_until timestamptz,

  created_by uuid,
  updated_by uuid,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  constraint technician_commission_rules_basis_check
    check (basis in ('none', 'fixed_per_work_log', 'per_hour', 'percent_estimated_cost', 'percent_final_cost')),
  constraint technician_commission_rules_validity_check
    check (valid_until is null or valid_until > valid_from)
);

create index if not exists work_logs_order_idx
  on public.work_logs (tenant_id, service_order_id, started_at desc);

create index if not exists work_logs_technician_idx
  on public.work_logs (tenant_id, technician_user_id, started_at desc);

create index if not exists work_logs_status_idx
  on public.work_logs (tenant_id, status, started_at desc);

create unique index if not exists work_logs_one_active_per_technician_idx
  on public.work_logs (tenant_id, technician_user_id)
  where status in ('active', 'paused');

create index if not exists work_log_events_log_idx
  on public.work_log_events (tenant_id, work_log_id, created_at desc);

create index if not exists work_log_events_order_idx
  on public.work_log_events (tenant_id, service_order_id, created_at desc);

create index if not exists technician_commission_rules_active_idx
  on public.technician_commission_rules (tenant_id, active, priority desc, valid_from desc);

alter table public.work_logs
  add constraint work_logs_commission_rule_id_fkey
  foreign key (commission_rule_id)
  references public.technician_commission_rules(id)
  on delete set null;

alter table public.work_logs enable row level security;
alter table public.work_log_events enable row level security;
alter table public.technician_commission_rules enable row level security;

revoke all on public.work_logs from anon;
revoke all on public.work_logs from authenticated;
revoke all on public.work_log_events from anon;
revoke all on public.work_log_events from authenticated;
revoke all on public.technician_commission_rules from anon;
revoke all on public.technician_commission_rules from authenticated;

grant select, insert, update, delete on public.work_logs to service_role;
grant select, insert, update, delete on public.work_log_events to service_role;
grant select, insert, update, delete on public.technician_commission_rules to service_role;

commit;
