begin;

alter table public.customers
  add column if not exists data_consent_status text not null default 'pending',
  add column if not exists data_consent_date timestamptz,
  add column if not exists data_consent_version text,
  add column if not exists data_consent_scope jsonb not null default '[]'::jsonb,
  add column if not exists data_consent_updated_by uuid references public.users(id) on delete set null,
  add column if not exists data_consent_updated_at timestamptz;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'customers_data_consent_status_check'
      and conrelid = 'public.customers'::regclass
  ) then
    alter table public.customers
      add constraint customers_data_consent_status_check
      check (data_consent_status in ('pending', 'accepted', 'rejected', 'revoked'));
  end if;
end $$;

create index if not exists customers_tenant_consent_idx
  on public.customers (tenant_id, data_consent_status, data_consent_updated_at desc);

alter table public.service_order_documents
  add column if not exists is_customer_visible boolean not null default false,
  add column if not exists retention_policy_version text,
  add column if not exists retention_expires_at timestamptz;

create index if not exists service_order_documents_public_visibility_idx
  on public.service_order_documents (tenant_id, service_order_id, is_customer_visible, retention_expires_at, created_at desc);

commit;
