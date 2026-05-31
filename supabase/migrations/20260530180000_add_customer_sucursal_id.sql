alter table if exists public.customers
  add column if not exists sucursal_id uuid;

create index if not exists customers_tenant_sucursal_idx
  on public.customers (tenant_id, sucursal_id);

do $$
begin
  if to_regclass('public.sucursales') is not null then
    execute '
      alter table public.customers
      drop constraint if exists customers_sucursal_id_fkey';

    execute '
      alter table public.customers
      add constraint customers_sucursal_id_fkey
      foreign key (sucursal_id)
      references public.sucursales(id)
      on delete set null';
  end if;
end $$;
