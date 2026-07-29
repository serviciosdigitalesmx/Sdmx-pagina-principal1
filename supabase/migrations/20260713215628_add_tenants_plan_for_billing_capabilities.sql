alter table public.tenants add column if not exists plan text not null default 'basic';
update public.tenants set plan = 'basic' where plan is null or btrim(plan) = '';;
