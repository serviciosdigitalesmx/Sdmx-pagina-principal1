begin;

alter table public.service_orders
  add column if not exists updated_by uuid;

alter table public.service_orders
  drop constraint if exists service_orders_updated_by_fkey;

alter table public.service_orders
  add constraint service_orders_updated_by_fkey
  foreign key (updated_by)
  references public.users(id)
  on delete set null;

create index if not exists service_orders_updated_by_idx
  on public.service_orders (updated_by);

commit;
