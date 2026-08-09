begin;

alter table public.service_requests
  add column if not exists converted_order_id uuid;

alter table public.service_requests
  drop constraint if exists service_requests_converted_order_id_fkey;

alter table public.service_requests
  add constraint service_requests_converted_order_id_fkey
  foreign key (converted_order_id)
  references public.service_orders(id)
  on delete set null;

create unique index if not exists service_requests_converted_order_id_uidx
  on public.service_requests (converted_order_id)
  where converted_order_id is not null;

create or replace function public.convert_service_request_transaction(
  p_tenant_id uuid,
  p_request_id uuid,
  p_estimated_cost numeric,
  p_device_type text,
  p_device_model text,
  p_issue text,
  p_create_customer boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_request public.service_requests%rowtype;
  v_customer_id uuid;
  v_order_id uuid;
  v_phone text;
  v_email text;
  v_estimated_cost numeric(12, 2);
  v_folio text;
begin
  if p_tenant_id is null or p_request_id is null then
    raise exception 'INVALID_REQUEST_CONVERSION_INPUT';
  end if;

  select *
  into v_request
  from public.service_requests
  where tenant_id = p_tenant_id
    and id = p_request_id
  for update;

  if not found then
    raise exception 'REQUEST_NOT_FOUND';
  end if;

  if lower(trim(coalesce(v_request.status, ''))) = 'convertida'
     or v_request.converted_order_id is not null then
    raise exception 'REQUEST_ALREADY_CONVERTED';
  end if;

  if coalesce(p_create_customer, true) then
    v_phone := nullif(trim(coalesce(v_request.customer_phone, '')), '');
    v_email := nullif(trim(coalesce(v_request.customer_email, '')), '');

    if v_phone is not null then
      select id
      into v_customer_id
      from public.customers
      where tenant_id = p_tenant_id
        and phone = v_phone
      limit 1;
    end if;

    if v_customer_id is null and v_email is not null then
      select id
      into v_customer_id
      from public.customers
      where tenant_id = p_tenant_id
        and lower(email) = lower(v_email)
      limit 1;
    end if;

    if v_customer_id is null then
      insert into public.customers (
        tenant_id,
        name,
        phone,
        email
      )
      values (
        p_tenant_id,
        v_request.customer_name,
        v_phone,
        v_email
      )
      returning id into v_customer_id;
    end if;
  end if;

  v_estimated_cost := round(greatest(coalesce(p_estimated_cost, v_request.quoted_total, 0), 0)::numeric, 2);
  v_folio := 'ORD-' || upper(replace(v_request.id::text, '-', ''));

  insert into public.service_orders (
    tenant_id,
    customer_id,
    folio,
    status,
    device_info,
    problem_description,
    metadata,
    estimated_cost,
    final_cost,
    receipt_url
  )
  values (
    p_tenant_id,
    v_customer_id,
    v_folio,
    'recibido',
    jsonb_build_object(
      'customer_name', v_request.customer_name,
      'customer_phone', v_request.customer_phone,
      'customer_email', v_request.customer_email,
      'type', coalesce(nullif(trim(p_device_type), ''), v_request.device_type, ''),
      'brand', coalesce(nullif(trim(p_device_model), ''), v_request.device_model, ''),
      'model', coalesce(nullif(trim(p_device_model), ''), v_request.device_model, '')
    ),
    coalesce(nullif(trim(p_issue), ''), v_request.issue_description, ''),
    coalesce(v_request.metadata, '{}'::jsonb),
    v_estimated_cost,
    v_estimated_cost,
    null
  )
  returning id into v_order_id;

  update public.service_requests
  set status = 'convertida',
      converted_order_id = v_order_id,
      updated_at = now()
  where tenant_id = p_tenant_id
    and id = p_request_id;

  return jsonb_build_object(
    'request_id', v_request.id,
    'order_id', v_order_id,
    'customer_id', v_customer_id
  );
end;
$$;

revoke all on function public.convert_service_request_transaction(
  uuid, uuid, numeric, text, text, text, boolean
) from public, anon, authenticated;

grant execute on function public.convert_service_request_transaction(
  uuid, uuid, numeric, text, text, text, boolean
) to service_role;

commit;
;
