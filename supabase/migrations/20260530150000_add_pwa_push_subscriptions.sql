create table if not exists public.pwa_push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid references public.users(id) on delete set null,
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  device_label text,
  active boolean not null default true,
  last_seen_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists pwa_push_subscriptions_tenant_endpoint_uidx
  on public.pwa_push_subscriptions (tenant_id, endpoint);

alter table public.pwa_push_subscriptions enable row level security;

drop policy if exists pwa_push_subscriptions_select on public.pwa_push_subscriptions;
create policy pwa_push_subscriptions_select
on public.pwa_push_subscriptions
for select
using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);

drop policy if exists pwa_push_subscriptions_write on public.pwa_push_subscriptions;
create policy pwa_push_subscriptions_write
on public.pwa_push_subscriptions
for all
using ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id)
with check ((auth.jwt() ->> 'tenant_id')::uuid = tenant_id);

