begin;

create index if not exists service_orders_tenant_serial_number_normalized_idx
  on public.service_orders (tenant_id, lower(btrim(serial_number)))
  where serial_number is not null and btrim(serial_number) <> '';

create or replace function public.find_device_history_by_serial(
  p_tenant_id uuid,
  p_serial_number text,
  p_limit integer default 50
)
returns table (
  id uuid,
  tenant_id uuid,
  folio text,
  status text,
  priority text,
  customer_id uuid,
  device_info jsonb,
  device_type text,
  device_brand text,
  device_model text,
  serial_number text,
  reported_issue text,
  internal_diagnosis text,
  estimated_cost numeric,
  final_cost numeric,
  promised_date date,
  received_at timestamptz,
  completed_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_tenant_id is null then
    raise exception 'p_tenant_id is required';
  end if;

  if nullif(btrim(coalesce(p_serial_number, '')), '') is null then
    raise exception 'p_serial_number is required';
  end if;

  p_limit := greatest(1, least(coalesce(p_limit, 50), 100));

  return query
  select
    so.id,
    so.tenant_id,
    so.folio,
    so.status,
    so.priority,
    so.customer_id,
    so.device_info,
    so.device_type,
    so.device_brand,
    so.device_model,
    so.serial_number,
    so.reported_issue,
    so.internal_diagnosis,
    so.estimated_cost,
    so.final_cost,
    so.promised_date,
    so.received_at,
    so.completed_at,
    so.delivered_at,
    so.created_at,
    so.updated_at
  from public.service_orders so
  where so.tenant_id = p_tenant_id
    and lower(btrim(so.serial_number)) = lower(btrim(p_serial_number))
  order by coalesce(so.received_at, so.created_at) desc, so.created_at desc
  limit p_limit;
end;
$$;

revoke all on function public.find_device_history_by_serial(uuid, text, integer) from public;
grant execute on function public.find_device_history_by_serial(uuid, text, integer) to service_role;

commit;
