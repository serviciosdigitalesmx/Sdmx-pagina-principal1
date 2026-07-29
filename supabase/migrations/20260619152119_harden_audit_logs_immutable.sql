begin;

alter table public.audit_logs
  add column if not exists entity_type text,
  add column if not exists entity_id text,
  add column if not exists request_id text,
  add column if not exists ip inet,
  add column if not exists "before" jsonb,
  add column if not exists "after" jsonb;

update public.audit_logs
set
  "before" = case when "before" is null and data_before is not null then data_before else "before" end,
  "after" = case when "after" is null and data_after is not null then data_after else "after" end
where
  ("before" is null and data_before is not null)
  or ("after" is null and data_after is not null);

create index if not exists audit_logs_tenant_entity_created_idx
  on public.audit_logs (tenant_id, entity_type, entity_id, created_at desc);

create index if not exists audit_logs_tenant_request_created_idx
  on public.audit_logs (tenant_id, request_id, created_at desc)
  where request_id is not null;

create or replace function public.prevent_audit_logs_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'audit_logs is immutable';
end;
$$;

drop trigger if exists trg_audit_logs_immutable_update on public.audit_logs;
create trigger trg_audit_logs_immutable_update
before update on public.audit_logs
for each row
execute function public.prevent_audit_logs_mutation();

drop trigger if exists trg_audit_logs_immutable_delete on public.audit_logs;
create trigger trg_audit_logs_immutable_delete
before delete on public.audit_logs
for each row
execute function public.prevent_audit_logs_mutation();

alter table public.audit_logs enable row level security;
alter table public.audit_logs force row level security;

commit;;
