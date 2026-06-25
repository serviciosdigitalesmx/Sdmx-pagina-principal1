begin;

create table if not exists public.message_queue (
  id uuid primary key default gen_random_uuid(),

  tenant_id uuid not null references public.tenants(id) on delete cascade,
  service_order_id uuid references public.service_orders(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,

  channel text not null default 'whatsapp',
  provider text not null default 'manual_wa_me',
  status text not null default 'generated',

  template_key text not null,
  template_version text not null default 't13-v1',

  recipient_name text,
  recipient_phone text not null,
  recipient_phone_e164 text,

  message_body text not null,
  wa_me_url text not null,

  public_token_last4 text,
  portal_url_hash text,

  consent_status_snapshot text,
  consent_scope_snapshot text,

  generated_by uuid,
  idempotency_key text,

  metadata jsonb not null default '{}'::jsonb,

  generated_at timestamptz not null default timezone('utc', now()),
  opened_at timestamptz,
  sent_at timestamptz,
  failed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),

  constraint message_queue_channel_check
    check (channel in ('whatsapp')),
  constraint message_queue_provider_check
    check (provider in ('manual_wa_me', 'future_provider')),
  constraint message_queue_status_check
    check (status in ('generated', 'opened_manual', 'cancelled', 'failed')),
  constraint message_queue_template_key_check
    check (template_key in ('order_received', 'status_update', 'authorization_request', 'portal_link', 'warranty_info')),
  constraint message_queue_recipient_phone_check
    check (btrim(recipient_phone) <> ''),
  constraint message_queue_message_body_check
    check (btrim(message_body) <> ''),
  constraint message_queue_wa_me_url_check
    check (btrim(wa_me_url) <> '')
);

create index if not exists message_queue_order_idx
  on public.message_queue (tenant_id, service_order_id, created_at desc);

create index if not exists message_queue_status_idx
  on public.message_queue (tenant_id, status, created_at desc);

create index if not exists message_queue_channel_idx
  on public.message_queue (tenant_id, channel, created_at desc);

create unique index if not exists message_queue_tenant_idempotency_key_idx
  on public.message_queue (tenant_id, idempotency_key)
  where idempotency_key is not null;

alter table public.message_queue enable row level security;

revoke all on public.message_queue from anon;
revoke all on public.message_queue from authenticated;

grant select, insert, update, delete on public.message_queue to service_role;

commit;
