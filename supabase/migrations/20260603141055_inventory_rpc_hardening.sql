begin;

alter table if exists public.purchase_order_items
  add column if not exists status text not null default 'pendiente';

create index if not exists purchase_order_items_tenant_po_status_idx
  on public.purchase_order_items (tenant_id, purchase_order_id, status);

create or replace function public.receive_purchase_inventory(
  p_tenant_id uuid,
  p_purchase_order_id uuid,
  p_sucursal_id uuid default null,
  p_received_items jsonb default null,
  p_notes text default null,
  p_changed_by uuid default null
)
returns table (
  purchase_order_id uuid,
  status text,
  updated_items jsonb,
  movements jsonb,
  inventory jsonb
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.purchase_orders%rowtype;
  v_sucursal_id uuid;
  v_item record;
  v_input_quantity numeric(12,2);
  v_input_unit_cost numeric(12,2);
  v_resolved_product_id uuid;
  v_inventory_row public.sucursal_inventory%rowtype;
  v_next_stock numeric(12,2);
  v_next_received numeric(12,2);
  v_item_status text;
  v_order_status text;
  v_total_ordered numeric(12,2);
  v_total_received numeric(12,2);
  v_updated_items jsonb := '[]'::jsonb;
  v_movements jsonb := '[]'::jsonb;
  v_inventory jsonb := '[]'::jsonb;
begin
  if p_tenant_id is null then
    raise exception 'p_tenant_id is required';
  end if;

  if p_purchase_order_id is null then
    raise exception 'p_purchase_order_id is required';
  end if;

  select *
    into v_order
    from public.purchase_orders
   where tenant_id = p_tenant_id
     and id = p_purchase_order_id
   for update;

  if not found then
    raise exception 'Purchase order not found';
  end if;

  v_sucursal_id := coalesce(p_sucursal_id, v_order.sucursal_id);
  if v_sucursal_id is null then
    raise exception 'sucursal_id is required';
  end if;

  if p_sucursal_id is not null and v_order.sucursal_id is not null and p_sucursal_id <> v_order.sucursal_id then
    raise exception 'Sucursal mismatch';
  end if;

  for v_item in
    with received_inputs as (
      select
        nullif(trim(value->>'purchase_order_item_id'), '')::uuid as purchase_order_item_id,
        nullif(trim(value->>'sku_snapshot'), '') as sku_snapshot,
        greatest(coalesce(nullif(trim(value->>'quantity'), '')::numeric, 0), 0)::numeric(12,2) as quantity,
        nullif(trim(value->>'unit_cost'), '')::numeric(12,2) as unit_cost
      from jsonb_array_elements(coalesce(p_received_items, '[]'::jsonb)) as value
    )
    select
      poi.*,
      ri.purchase_order_item_id as input_item_id,
      ri.sku_snapshot as input_sku_snapshot,
      coalesce(ri.quantity, 0)::numeric(12,2) as received_quantity,
      coalesce(ri.unit_cost, poi.unit_cost)::numeric(12,2) as received_unit_cost
    from public.purchase_order_items poi
    left join received_inputs ri
      on ri.purchase_order_item_id = poi.id
      or (ri.purchase_order_item_id is null and ri.sku_snapshot is not null and ri.sku_snapshot = poi.sku_snapshot)
    where poi.tenant_id = p_tenant_id
      and poi.purchase_order_id = p_purchase_order_id
    order by poi.created_at asc
    for update of poi
  loop
    v_input_quantity := coalesce(v_item.received_quantity, 0);
    if v_input_quantity <= 0 then
      continue;
    end if;

    if v_item.product_id is not null then
      select id
        into v_resolved_product_id
        from public.products
       where tenant_id = p_tenant_id
         and id = v_item.product_id
       for update;

      if not found then
        raise exception 'Product not found for purchase order item %', v_item.id;
      end if;
    else
      if coalesce(trim(v_item.sku_snapshot), '') = '' then
        raise exception 'purchase_order_item % is missing sku_snapshot', v_item.id;
      end if;

      insert into public.products (
        tenant_id,
        sku,
        name,
        category,
        brand,
        compatible_model,
        primary_supplier_id,
        cost,
        sale_price,
        minimum_stock,
        unit,
        location,
        notes,
        is_active
      ) values (
        p_tenant_id,
        v_item.sku_snapshot,
        coalesce(nullif(trim(v_item.product_name_snapshot), ''), v_item.sku_snapshot),
        null,
        null,
        null,
        null,
        coalesce(v_item.received_unit_cost, 0),
        0,
        0,
        null,
        null,
        coalesce(p_notes, v_item.product_name_snapshot),
        true
      )
      on conflict (tenant_id, sku) do update
        set name = excluded.name,
            notes = coalesce(excluded.notes, public.products.notes),
            updated_at = timezone('utc', now())
      returning id into v_resolved_product_id;
    end if;

    select *
      into v_inventory_row
      from public.sucursal_inventory
     where tenant_id = p_tenant_id
       and sucursal_id = v_sucursal_id
       and product_id = v_resolved_product_id
     for update;

    if found then
      v_next_stock := coalesce(v_inventory_row.stock_current, 0) + v_input_quantity;
      update public.sucursal_inventory
         set stock_current = v_next_stock,
             updated_at = timezone('utc', now())
       where id = v_inventory_row.id
       returning * into v_inventory_row;
    else
      insert into public.sucursal_inventory (
        tenant_id,
        sucursal_id,
        product_id,
        stock_current
      ) values (
        p_tenant_id,
        v_sucursal_id,
        v_resolved_product_id,
        v_input_quantity
      )
      on conflict (tenant_id, sucursal_id, product_id)
      do update set
        stock_current = public.sucursal_inventory.stock_current + excluded.stock_current,
        updated_at = timezone('utc', now())
      returning * into v_inventory_row;

      v_next_stock := coalesce(v_inventory_row.stock_current, 0);
    end if;

    insert into public.inventory_movements (
      tenant_id,
      sucursal_id,
      product_id,
      purchase_order_id,
      movement_type,
      quantity,
      unit_cost,
      reference,
      notes,
      created_by
    ) values (
      p_tenant_id,
      v_sucursal_id,
      v_resolved_product_id,
      p_purchase_order_id,
      'purchase_received',
      v_input_quantity,
      coalesce(v_item.received_unit_cost, 0),
      v_order.folio,
      p_notes,
      p_changed_by
    );

    v_next_received := coalesce(v_item.qty_received, 0) + v_input_quantity;
    v_item_status := case
      when v_next_received >= coalesce(v_item.qty_ordered, 0) then 'recibida'
      when v_next_received > 0 then 'parcial'
      else 'pendiente'
    end;

    update public.purchase_order_items
       set product_id = coalesce(product_id, v_resolved_product_id),
           qty_received = v_next_received,
           subtotal = round(coalesce(v_item.qty_ordered, 0) * coalesce(v_item.unit_cost, 0), 2),
           status = v_item_status,
           updated_at = timezone('utc', now())
     where id = v_item.id
       and tenant_id = p_tenant_id;

    v_updated_items := v_updated_items || jsonb_build_object(
      'id', v_item.id,
      'purchase_order_id', v_item.purchase_order_id,
      'product_id', v_resolved_product_id,
      'sku_snapshot', v_item.sku_snapshot,
      'qty_ordered', v_item.qty_ordered,
      'qty_received', v_next_received,
      'status', v_item_status,
      'unit_cost', v_item.unit_cost,
      'subtotal', round(coalesce(v_item.qty_ordered, 0) * coalesce(v_item.unit_cost, 0), 2)
    );

    v_movements := v_movements || jsonb_build_object(
      'tenant_id', p_tenant_id,
      'sucursal_id', v_sucursal_id,
      'product_id', v_resolved_product_id,
      'purchase_order_id', p_purchase_order_id,
      'movement_type', 'purchase_received',
      'quantity', v_input_quantity,
      'unit_cost', coalesce(v_item.received_unit_cost, 0),
      'reference', v_order.folio,
      'notes', p_notes
    );

    v_inventory := v_inventory || jsonb_build_object(
      'id', v_inventory_row.id,
      'tenant_id', v_inventory_row.tenant_id,
      'sucursal_id', v_inventory_row.sucursal_id,
      'product_id', v_inventory_row.product_id,
      'stock_current', v_inventory_row.stock_current
    );
  end loop;

  select
    coalesce(sum(qty_ordered), 0)::numeric(12,2),
    coalesce(sum(qty_received), 0)::numeric(12,2)
    into v_total_ordered,
         v_total_received
    from public.purchase_order_items
   where tenant_id = p_tenant_id
     and purchase_order_id = p_purchase_order_id;

  update public.purchase_orders
     set status = case
                    when v_total_received <= 0 then status
                    when v_total_received < v_total_ordered then 'parcial'
                    else 'recibida'
                  end,
         updated_by = p_changed_by,
         updated_at = timezone('utc', now())
   where id = p_purchase_order_id
     and tenant_id = p_tenant_id
  returning status into v_order_status;

  purchase_order_id := p_purchase_order_id;
  status := v_order_status;
  updated_items := v_updated_items;
  movements := v_movements;
  inventory := v_inventory;
  return next;
end;
$$;

create or replace function public.adjust_inventory(
  p_tenant_id uuid,
  p_sucursal_id uuid,
  p_product_id uuid,
  p_quantity_delta numeric default null,
  p_target_stock numeric default null,
  p_reference text default 'manual_adjustment',
  p_notes text default null,
  p_changed_by uuid default null
)
returns table (
  inventory_id uuid,
  stock_current numeric,
  movement_id uuid
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inventory_row public.sucursal_inventory%rowtype;
  v_current_stock numeric(12,2) := 0;
  v_next_stock numeric(12,2);
  v_delta numeric(12,2);
begin
  if p_tenant_id is null then
    raise exception 'p_tenant_id is required';
  end if;

  if p_sucursal_id is null then
    raise exception 'p_sucursal_id is required';
  end if;

  if p_product_id is null then
    raise exception 'p_product_id is required';
  end if;

  if p_quantity_delta is null and p_target_stock is null then
    raise exception 'p_quantity_delta or p_target_stock is required';
  end if;

  select *
    into v_inventory_row
    from public.sucursal_inventory
   where tenant_id = p_tenant_id
     and sucursal_id = p_sucursal_id
     and product_id = p_product_id
   for update;

  if found then
    v_current_stock := coalesce(v_inventory_row.stock_current, 0);
  end if;

  if p_target_stock is not null then
    v_next_stock := round(coalesce(p_target_stock, 0)::numeric, 2);
    v_delta := round((v_next_stock - v_current_stock)::numeric, 2);
  else
    v_delta := round(coalesce(p_quantity_delta, 0)::numeric, 2);
    v_next_stock := round((v_current_stock + v_delta)::numeric, 2);
  end if;

  if v_next_stock < 0 then
    raise exception 'Stock cannot be negative';
  end if;

  if found then
    update public.sucursal_inventory
       set stock_current = v_next_stock,
           updated_at = timezone('utc', now())
     where id = v_inventory_row.id
     returning * into v_inventory_row;
  else
    insert into public.sucursal_inventory (
      tenant_id,
      sucursal_id,
      product_id,
      stock_current
    ) values (
      p_tenant_id,
      p_sucursal_id,
      p_product_id,
      v_next_stock
    )
    on conflict (tenant_id, sucursal_id, product_id)
    do update set
      stock_current = excluded.stock_current,
      updated_at = timezone('utc', now())
    returning * into v_inventory_row;
  end if;

  if v_delta <> 0 then
    insert into public.inventory_movements (
      tenant_id,
      sucursal_id,
      product_id,
      movement_type,
      quantity,
      unit_cost,
      reference,
      notes,
      created_by
    ) values (
      p_tenant_id,
      p_sucursal_id,
      p_product_id,
      case when v_delta >= 0 then 'adjust_in' else 'adjust_out' end,
      abs(v_delta),
      0,
      coalesce(p_reference, 'manual_adjustment'),
      p_notes,
      p_changed_by
    )
    returning id into movement_id;
  else
    movement_id := null;
  end if;

  inventory_id := v_inventory_row.id;
  stock_current := v_inventory_row.stock_current;
  return next;
end;
$$;

revoke all on function public.receive_purchase_inventory(uuid, uuid, uuid, jsonb, text, uuid) from public;
revoke all on function public.adjust_inventory(uuid, uuid, uuid, numeric, numeric, text, text, uuid) from public;
grant execute on function public.receive_purchase_inventory(uuid, uuid, uuid, jsonb, text, uuid) to service_role;
grant execute on function public.adjust_inventory(uuid, uuid, uuid, numeric, numeric, text, text, uuid) to service_role;

commit;
