begin;

create table if not exists public.service_order_authorizations (
  id uuid primary key default gen_random_uuid(),

  tenant_id uuid not null references public.tenants(id) on delete cascade,
  service_order_id uuid not null references public.service_orders(id) on delete cascade,

  authorization_type text not null default 'repair',
  status text not null default 'accepted',

  authorized_amount numeric,
  estimated_cost_snapshot numeric,
  final_cost_snapshot numeric,
  scope_snapshot text not null,
  terms_version text not null,
  terms_snapshot text not null,

  accepted_by_name text not null,
  accepted_by_phone text,
  accepted_by_email text,

  signature_method text not null default 'typed_name',
  signature_text text,

  public_token_last4 text,
  ip_address text,
  user_agent text,

  idempotency_key text,

  decided_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),

  constraint service_order_authorizations_type_check
    check (authorization_type in ('diagnosis', 'repair', 'quotation', 'work', 'other')),
  constraint service_order_authorizations_status_check
    check (status in ('accepted', 'rejected')),
  constraint service_order_authorizations_accepted_by_name_check
    check (btrim(accepted_by_name) <> ''),
  constraint service_order_authorizations_scope_snapshot_check
    check (btrim(scope_snapshot) <> ''),
  constraint service_order_authorizations_terms_version_check
    check (btrim(terms_version) <> ''),
  constraint service_order_authorizations_terms_snapshot_check
    check (btrim(terms_snapshot) <> ''),
  constraint service_order_authorizations_signature_method_check
    check (signature_method in ('typed_name', 'checkbox', 'none'))
);

create index if not exists service_order_authorizations_order_idx
  on public.service_order_authorizations (tenant_id, service_order_id, created_at desc);

create index if not exists service_order_authorizations_status_idx
  on public.service_order_authorizations (tenant_id, status, created_at desc);

create unique index if not exists service_order_authorizations_tenant_idempotency_key_idx
  on public.service_order_authorizations (tenant_id, idempotency_key)
  where idempotency_key is not null;

create unique index if not exists service_order_authorizations_one_acceptance_per_snapshot_idx
  on public.service_order_authorizations (
    tenant_id,
    service_order_id,
    authorization_type,
    estimated_cost_snapshot
  )
  where status = 'accepted';

alter table public.service_order_authorizations enable row level security;

revoke all on public.service_order_authorizations from anon;
revoke all on public.service_order_authorizations from authenticated;

grant select, insert, update, delete on public.service_order_authorizations to service_role;

create or replace function public.submit_service_order_authorization(
  p_tenant_id uuid,
  p_public_token text,
  p_authorization_type text,
  p_decision text,
  p_accepted_by_name text,
  p_accepted_by_phone text default null,
  p_accepted_by_email text default null,
  p_authorized_amount numeric default null,
  p_scope_snapshot text default null,
  p_terms_version text default null,
  p_terms_snapshot text default null,
  p_signature_method text default 'typed_name',
  p_signature_text text default null,
  p_idempotency_key text default null,
  p_ip_address text default null,
  p_user_agent text default null,
  p_request_id text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.service_orders%rowtype;
  v_authorization public.service_order_authorizations%rowtype;
  v_clean_token text;
  v_clean_idempotency_key text;
  v_authorization_type text;
  v_decision text;
  v_signature_method text;
begin
  v_clean_token := nullif(btrim(coalesce(p_public_token, '')), '');
  v_clean_idempotency_key := nullif(btrim(coalesce(p_idempotency_key, '')), '');
  v_authorization_type := coalesce(nullif(btrim(coalesce(p_authorization_type, '')), ''), 'repair');
  v_decision := nullif(btrim(coalesce(p_decision, '')), '');
  v_signature_method := coalesce(nullif(btrim(coalesce(p_signature_method, '')), ''), 'typed_name');

  if p_tenant_id is null then raise exception 'p_tenant_id is required'; end if;
  if v_clean_token is null then raise exception 'p_public_token is required'; end if;
  if nullif(btrim(coalesce(p_request_id, '')), '') is null then raise exception 'p_request_id is required'; end if;
  if v_decision not in ('accepted', 'rejected') then raise exception 'Invalid authorization decision'; end if;
  if v_authorization_type not in ('diagnosis', 'repair', 'quotation', 'work', 'other') then raise exception 'Invalid authorization type'; end if;
  if v_signature_method not in ('typed_name', 'checkbox', 'none') then raise exception 'Invalid signature method'; end if;
  if nullif(btrim(coalesce(p_accepted_by_name, '')), '') is null then raise exception 'p_accepted_by_name is required'; end if;
  if nullif(btrim(coalesce(p_scope_snapshot, '')), '') is null then raise exception 'p_scope_snapshot is required'; end if;
  if nullif(btrim(coalesce(p_terms_version, '')), '') is null then raise exception 'p_terms_version is required'; end if;
  if nullif(btrim(coalesce(p_terms_snapshot, '')), '') is null then raise exception 'p_terms_snapshot is required'; end if;

  if v_clean_idempotency_key is not null then
    select *
      into v_authorization
      from public.service_order_authorizations
     where tenant_id = p_tenant_id
       and idempotency_key = v_clean_idempotency_key
     limit 1;

    if found then
      return jsonb_build_object(
        'authorization_id', v_authorization.id,
        'service_order_id', v_authorization.service_order_id,
        'status', v_authorization.status,
        'authorization_type', v_authorization.authorization_type,
        'decided_at', v_authorization.decided_at,
        'estimated_cost_snapshot', v_authorization.estimated_cost_snapshot,
        'authorized_amount', v_authorization.authorized_amount
      );
    end if;
  end if;

  select *
    into v_order
    from public.service_orders
   where tenant_id = p_tenant_id
     and public_token = v_clean_token
   limit 1;

  if not found then
    raise exception 'Order not found';
  end if;

  if v_decision = 'accepted' then
    if p_authorized_amount is null then
      raise exception 'p_authorized_amount is required for accepted authorizations';
    end if;

    if v_order.estimated_cost is not null and p_authorized_amount <> v_order.estimated_cost then
      raise exception 'Authorized amount does not match current estimated cost';
    end if;
  end if;

  insert into public.service_order_authorizations (
    tenant_id,
    service_order_id,
    authorization_type,
    status,
    authorized_amount,
    estimated_cost_snapshot,
    final_cost_snapshot,
    scope_snapshot,
    terms_version,
    terms_snapshot,
    accepted_by_name,
    accepted_by_phone,
    accepted_by_email,
    signature_method,
    signature_text,
    public_token_last4,
    ip_address,
    user_agent,
    idempotency_key
  ) values (
    p_tenant_id,
    v_order.id,
    v_authorization_type,
    v_decision,
    p_authorized_amount,
    v_order.estimated_cost,
    v_order.final_cost,
    btrim(p_scope_snapshot),
    btrim(p_terms_version),
    btrim(p_terms_snapshot),
    btrim(p_accepted_by_name),
    nullif(btrim(coalesce(p_accepted_by_phone, '')), ''),
    nullif(btrim(coalesce(p_accepted_by_email, '')), ''),
    v_signature_method,
    nullif(btrim(coalesce(p_signature_text, '')), ''),
    right(v_clean_token, 4),
    nullif(btrim(coalesce(p_ip_address, '')), ''),
    nullif(btrim(coalesce(p_user_agent, '')), ''),
    v_clean_idempotency_key
  )
  returning * into v_authorization;

  insert into public.service_order_events (
    tenant_id,
    service_order_id,
    event_type,
    previous_status,
    new_status,
    note,
    actor_name,
    created_by
  ) values (
    p_tenant_id,
    v_order.id,
    case when v_decision = 'accepted' then 'authorization_accepted' else 'authorization_rejected' end,
    null,
    v_order.status,
    concat(
      'Autorizacion ', v_decision,
      ' para ', v_authorization_type,
      '. Monto snapshot: ', coalesce(v_authorization.authorized_amount::text, 'sin monto'),
      '. Token last4: ', coalesce(v_authorization.public_token_last4, 'n/a')
    ),
    v_authorization.accepted_by_name,
    null
  );

  insert into public.audit_logs (
    tenant_id,
    user_id,
    action,
    ip_address,
    user_agent,
    request_id,
    data_after
  ) values (
    p_tenant_id,
    null,
    'service_order.authorization.submitted',
    nullif(btrim(coalesce(p_ip_address, '')), '')::inet,
    nullif(btrim(coalesce(p_user_agent, '')), ''),
    p_request_id,
    jsonb_build_object(
      'authorization_id', v_authorization.id,
      'service_order_id', v_authorization.service_order_id,
      'decision', v_authorization.status,
      'authorization_type', v_authorization.authorization_type,
      'authorized_amount', v_authorization.authorized_amount,
      'estimated_cost_snapshot', v_authorization.estimated_cost_snapshot,
      'final_cost_snapshot', v_authorization.final_cost_snapshot,
      'terms_version', v_authorization.terms_version,
      'public_token_last4', v_authorization.public_token_last4
    )
  );

  return jsonb_build_object(
    'authorization_id', v_authorization.id,
    'service_order_id', v_authorization.service_order_id,
    'status', v_authorization.status,
    'authorization_type', v_authorization.authorization_type,
    'decided_at', v_authorization.decided_at,
    'estimated_cost_snapshot', v_authorization.estimated_cost_snapshot,
    'authorized_amount', v_authorization.authorized_amount
  );
end;
$$;

revoke all on function public.submit_service_order_authorization(uuid, text, text, text, text, text, text, numeric, text, text, text, text, text, text, text, text, text) from public;
grant execute on function public.submit_service_order_authorization(uuid, text, text, text, text, text, text, numeric, text, text, text, text, text, text, text, text, text) to service_role;

commit;
