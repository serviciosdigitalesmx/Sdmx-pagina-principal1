alter table public.audit_logs alter column request_id set default (gen_random_uuid()::text);;
