create or replace function public.normalize_audit_log_user_identity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.user_id is not null
    and not exists (select 1 from public.users where id = new.user_id)
  then
    select id
      into new.user_id
      from public.users
     where auth_user_id = new.user_id
       and tenant_id = new.tenant_id
     limit 1;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_normalize_audit_log_user_identity on public.audit_logs;
create trigger trg_normalize_audit_log_user_identity
before insert or update of user_id on public.audit_logs
for each row execute function public.normalize_audit_log_user_identity();
