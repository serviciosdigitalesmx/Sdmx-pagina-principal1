begin;

create unique index if not exists inventory_movements_transfer_out_idempotency_idx
  on public.inventory_movements (tenant_id, reference)
  where movement_type = 'transfer_out';

create unique index if not exists inventory_movements_transfer_in_idempotency_idx
  on public.inventory_movements (tenant_id, reference)
  where movement_type = 'transfer_in';

create or replace function public.transfer_inventory_transaction(
  p_tenant_id uuid,
  p_sku text,
  p_sucursal_origen uuid,
  p_sucursal_destino uuid,
  p_cantidad numeric,
  p_idempotency_key text,
  p_changed_by uuid,
  p_motivo text default null,
  p_notas text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_product public.products%rowtype;
  v_origin public.sucursal_inventory%rowtype;
  v_destination public.sucursal_inventory%rowtype;
  v_existing_movement public.inventory_movements%rowtype;
  v_origin_stock numeric(12,2);
  v_destination_stock numeric(12,2);
  v_notes text;
begin
  if p_tenant_id is null then raise exception 'TRANSFER_TENANT_REQUIRED'; end if;
  if nullif(trim(coalesce(p_sku, '')), '') is null then raise exception 'TRANSFER_SKU_REQUIRED'; end if;
  if p_sucursal_origen is null or p_sucursal_destino is null then raise exception 'TRANSFER_BRANCH_REQUIRED'; end if;
  if p_sucursal_origen = p_sucursal_destino then raise exception 'TRANSFER_SAME_BRANCH'; end if;
  if coalesce(p_cantidad, 0) <= 0 then raise exception 'TRANSFER_INVALID_QUANTITY'; end if;
  if nullif(trim(coalesce(p_idempotency_key, '')), '') is null then raise exception 'TRANSFER_IDEMPOTENCY_REQUIRED'; end if;

  perform pg_advisory_xact_lock(hashtextextended(p_tenant_id::text || ':' || trim(p_sku), 0));

  select *
    into v_existing_movement
    from public.inventory_movements
   where tenant_id = p_tenant_id
     and reference = p_idempotency_key
     and movement_type = 'transfer_out'
   limit 1;

  if found then
    select * into v_origin
      from public.sucursal_inventory
     where tenant_id = p_tenant_id
       and sucursal_id = p_sucursal_origen
       and product_id = v_existing_movement.product_id;
    select * into v_destination
      from public.sucursal_inventory
     where tenant_id = p_tenant_id
       and sucursal_id = p_sucursal_destino
       and product_id = v_existing_movement.product_id;

    return jsonb_build_object(
      'product_id', v_existing_movement.product_id,
      'origin_inventory_id', v_origin.id,
      'destination_inventory_id', v_destination.id,
      'origin_stock', v_origin.stock_current,
      'destination_stock', v_destination.stock_current,
      'moved', abs(v_existing_movement.quantity),
      'reference', p_idempotency_key,
      'idempotent_replay', true
    );
  end if;

  if not exists (
    select 1 from public.sucursales
     where tenant_id = p_tenant_id and id = p_sucursal_origen and is_active = true
  ) or not exists (
    select 1 from public.sucursales
     where tenant_id = p_tenant_id and id = p_sucursal_destino and is_active = true
  ) then
    raise exception 'TRANSFER_BRANCH_NOT_FOUND';
  end if;

  select * into v_product
    from public.products
   where tenant_id = p_tenant_id and sku = trim(p_sku)
   limit 1;
  if not found then raise exception 'TRANSFER_PRODUCT_NOT_FOUND'; end if;

  select * into v_origin
    from public.sucursal_inventory
   where tenant_id = p_tenant_id
     and sucursal_id = p_sucursal_origen
     and product_id = v_product.id
   for update;
  if not found then raise exception 'TRANSFER_ORIGIN_NOT_FOUND'; end if;
  if v_origin.stock_current < p_cantidad then raise exception 'TRANSFER_INSUFFICIENT_STOCK'; end if;

  insert into public.sucursal_inventory (tenant_id, sucursal_id, product_id, stock_current)
  values (p_tenant_id, p_sucursal_destino, v_product.id, 0)
  on conflict (tenant_id, sucursal_id, product_id) do nothing;

  select * into v_destination
    from public.sucursal_inventory
   where tenant_id = p_tenant_id
     and sucursal_id = p_sucursal_destino
     and product_id = v_product.id
   for update;

  update public.sucursal_inventory
     set stock_current = stock_current - p_cantidad,
         updated_at = timezone('utc', now())
   where id = v_origin.id
   returning stock_current into v_origin_stock;

  update public.sucursal_inventory
     set stock_current = stock_current + p_cantidad,
         updated_at = timezone('utc', now())
   where id = v_destination.id
   returning stock_current into v_destination_stock;

  v_notes := concat_ws(' | ', nullif(trim(coalesce(p_motivo, '')), ''), nullif(trim(coalesce(p_notas, '')), ''));
  if v_notes = '' then v_notes := null; end if;

  insert into public.inventory_movements (
    tenant_id, sucursal_id, product_id, movement_type, quantity,
    unit_cost, reference, notes, created_by
  ) values
    (p_tenant_id, p_sucursal_origen, v_product.id, 'transfer_out', -p_cantidad,
     coalesce(v_product.cost, 0), p_idempotency_key, v_notes, p_changed_by),
    (p_tenant_id, p_sucursal_destino, v_product.id, 'transfer_in', p_cantidad,
     coalesce(v_product.cost, 0), p_idempotency_key, v_notes, p_changed_by);

  return jsonb_build_object(
    'product_id', v_product.id,
    'origin_inventory_id', v_origin.id,
    'destination_inventory_id', v_destination.id,
    'origin_stock', v_origin_stock,
    'destination_stock', v_destination_stock,
    'moved', p_cantidad,
    'reference', p_idempotency_key,
    'idempotent_replay', false
  );
end;
$$;

revoke all on function public.transfer_inventory_transaction(uuid, text, uuid, uuid, numeric, text, uuid, text, text) from public;
grant execute on function public.transfer_inventory_transaction(uuid, text, uuid, uuid, numeric, text, uuid, text, text) to service_role;

commit;
