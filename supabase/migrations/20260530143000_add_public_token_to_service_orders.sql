alter table if exists public.service_orders
  add column if not exists public_token text;

update public.service_orders
set public_token = coalesce(public_token, gen_random_uuid()::text)
where public_token is null or btrim(public_token) = '';

alter table public.service_orders
  alter column public_token set default gen_random_uuid()::text;

alter table public.service_orders
  alter column public_token set not null;

create unique index if not exists service_orders_tenant_public_token_uidx
  on public.service_orders (tenant_id, public_token);

