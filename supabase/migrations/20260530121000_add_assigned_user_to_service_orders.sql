begin;

alter table public.service_orders
  add column if not exists assigned_user_id uuid references public.users(id) on delete set null;

create index if not exists service_orders_tenant_assigned_idx
  on public.service_orders (tenant_id, assigned_user_id, created_at desc);

commit;
