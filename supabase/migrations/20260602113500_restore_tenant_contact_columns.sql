alter table public.tenants
  add column if not exists contact_name text,
  add column if not exists contact_email text,
  add column if not exists contact_phone text;

comment on column public.tenants.contact_name is 'Primary contact name for tenant onboarding and public pages.';
comment on column public.tenants.contact_email is 'Primary contact email for tenant onboarding and public pages.';
comment on column public.tenants.contact_phone is 'Primary contact phone for tenant onboarding and public pages.';
