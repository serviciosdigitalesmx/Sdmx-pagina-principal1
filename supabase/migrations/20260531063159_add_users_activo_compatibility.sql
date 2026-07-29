begin;

alter table public.users
  add column if not exists activo boolean not null default true;

update public.users
set activo = coalesce(activo, is_active, true)
where activo is distinct from coalesce(activo, is_active, true);

create index if not exists users_tenant_role_active_idx
  on public.users (tenant_id, role, activo);

create or replace function public.sync_users_admin_compat()
returns trigger
language plpgsql
as $$
begin
  new.activo := coalesce(new.activo, new.is_active, true);
  new.is_active := coalesce(new.is_active, new.activo, true);

  if new.sucursal_id is null and new.branch_id is not null then
    new.sucursal_id := new.branch_id;
  elsif new.branch_id is null and new.sucursal_id is not null then
    new.branch_id := new.sucursal_id;
  end if;

  new.updated_at := timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_sync_users_admin_compat on public.users;
create trigger trg_sync_users_admin_compat
before insert or update on public.users
for each row execute function public.sync_users_admin_compat();

commit;;
