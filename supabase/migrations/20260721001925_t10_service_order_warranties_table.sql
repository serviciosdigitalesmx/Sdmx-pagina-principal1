create table if not exists public.service_order_warranties (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  original_order_id uuid not null references public.service_orders(id) on delete cascade,
  claim_order_id uuid references public.service_orders(id) on delete set null,
  warranty_until date,
  eligibility_status text not null default 'unknown',
  status text not null default 'open',
  coverage_scope text not null default 'full',
  claim_reason text not null,
  reported_issue text,
  requested_resolution text,
  resolution_notes text,
  created_by uuid references public.users(id) on delete set null,
  approved_by uuid references public.users(id) on delete set null,
  rejected_by uuid references public.users(id) on delete set null,
  resolved_by uuid references public.users(id) on delete set null,
  cancelled_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  approved_at timestamptz,
  rejected_at timestamptz,
  resolved_at timestamptz,
  cancelled_at timestamptz,
  constraint service_order_warranties_eligibility_status_check check (eligibility_status in ('active','expired','no_warranty','unknown')),
  constraint service_order_warranties_status_check check (status in ('open','under_review','approved','rejected','resolved','cancelled')),
  constraint service_order_warranties_coverage_scope_check check (coverage_scope in ('full','labor','parts','diagnosis','other')),
  constraint service_order_warranties_claim_reason_check check (btrim(claim_reason) <> '')
);
create unique index if not exists service_order_warranties_tenant_claim_order_unique_idx on public.service_order_warranties (tenant_id,claim_order_id) where claim_order_id is not null;
create index if not exists service_order_warranties_original_order_idx on public.service_order_warranties (tenant_id,original_order_id,created_at desc);
create index if not exists service_order_warranties_status_idx on public.service_order_warranties (tenant_id,status,created_at desc);
create index if not exists service_order_warranties_claim_order_idx on public.service_order_warranties (tenant_id,claim_order_id) where claim_order_id is not null;
alter table public.service_order_warranties enable row level security;
revoke all on public.service_order_warranties from anon;
revoke all on public.service_order_warranties from authenticated;
grant select,insert,update,delete on public.service_order_warranties to service_role;;
