begin;

create table if not exists public.permissions (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  resource text not null,
  action text not null,
  conditions jsonb,
  is_active boolean not null default true,
  unique (role, resource, action)
);

create index if not exists permissions_active_lookup_idx
  on public.permissions (role, resource, action)
  where is_active = true;

alter table public.permissions enable row level security;

commit;
