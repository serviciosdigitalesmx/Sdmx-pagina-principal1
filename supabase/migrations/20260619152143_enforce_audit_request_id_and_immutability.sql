begin;

alter table public.audit_logs
  add column if not exists request_id text;

alter table public.audit_logs disable trigger trg_audit_logs_immutable_update;
alter table public.audit_logs disable trigger trg_audit_logs_immutable_delete;

update public.audit_logs
set request_id = gen_random_uuid()::text
where request_id is null or btrim(request_id) = '';

alter table public.audit_logs enable trigger trg_audit_logs_immutable_update;
alter table public.audit_logs enable trigger trg_audit_logs_immutable_delete;

alter table public.audit_logs
  alter column request_id set not null;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgrelid = 'public.audit_logs'::regclass
      and tgname = 'trg_audit_logs_immutable_update'
      and not tgisinternal
  ) then
    raise exception 'Missing audit_logs immutable update trigger';
  end if;

  if not exists (
    select 1
    from pg_trigger
    where tgrelid = 'public.audit_logs'::regclass
      and tgname = 'trg_audit_logs_immutable_delete'
      and not tgisinternal
  ) then
    raise exception 'Missing audit_logs immutable delete trigger';
  end if;
end;
$$;

comment on column public.audit_logs.request_id is 'Internal API-generated request id. External request headers are not trusted as the source of audit identity.';

commit;;
