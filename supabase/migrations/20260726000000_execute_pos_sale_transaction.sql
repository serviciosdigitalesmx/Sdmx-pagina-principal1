-- Migration: 20260726000000_execute_pos_sale_transaction.sql
-- Description: RPC for atomic POS sale and atomic cash shift closing

CREATE UNIQUE INDEX IF NOT EXISTS uq_sales_tenant_idempotency
ON public.sales (tenant_id, idempotency_key)
WHERE idempotency_key IS NOT NULL;

ALTER TABLE public.sales
ADD COLUMN IF NOT EXISTS idempotency_key text;

CREATE OR REPLACE FUNCTION public.execute_pos_sale_transaction(
  p_tenant_id uuid,
  p_user_id uuid,
  p_cash_shift_id uuid,
  p_customer_name text,
  p_customer_phone text,
  p_payment_method text,
  p_reference text,
  p_notes text,
  p_items jsonb,
  p_idempotency_key text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_shift public.cash_shifts%ROWTYPE;
  v_register public.cash_registers%ROWTYPE;
  v_sale public.sales%ROWTYPE;
  v_item jsonb;
  v_product record;
  v_inventory record;
  v_quantity numeric;
  v_unit_price numeric;
  v_item_total numeric;
  v_subtotal numeric := 0;
BEGIN
  IF p_idempotency_key IS NULL OR length(trim(p_idempotency_key)) < 12 THEN
    RAISE EXCEPTION 'INVALID_IDEMPOTENCY_KEY';
  END IF;

  SELECT *
  INTO v_sale
  FROM public.sales
  WHERE tenant_id = p_tenant_id
    AND idempotency_key = p_idempotency_key
  LIMIT 1;

  IF FOUND THEN
    RETURN jsonb_build_object(
      'sale', to_jsonb(v_sale),
      'idempotentReplay', true
    );
  END IF;

  SELECT *
  INTO v_shift
  FROM public.cash_shifts
  WHERE id = p_cash_shift_id
    AND tenant_id = p_tenant_id
    AND opened_by = p_user_id
    AND status = 'open'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'ACTIVE_SHIFT_NOT_FOUND';
  END IF;

  -- Get the sucursal_id from the cash register
  SELECT *
  INTO v_register
  FROM public.cash_registers
  WHERE id = v_shift.cash_register_id
    AND tenant_id = p_tenant_id;

  IF jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'SALE_ITEMS_REQUIRED';
  END IF;

  IF p_payment_method NOT IN ('cash', 'card', 'transfer') THEN
    RAISE EXCEPTION 'INVALID_PAYMENT_METHOD';
  END IF;

  FOR v_item IN SELECT value FROM jsonb_array_elements(p_items)
  LOOP
    v_quantity := (v_item->>'quantity')::numeric;

    IF v_quantity IS NULL OR v_quantity <= 0 THEN
      RAISE EXCEPTION 'INVALID_QUANTITY';
    END IF;

    SELECT
      p.id,
      p.sku,
      p.name,
      COALESCE(p.sale_price, 0)::numeric AS unit_price
    INTO v_product
    FROM public.products p
    WHERE p.id = (v_item->>'productId')::uuid
      AND p.tenant_id = p_tenant_id
      AND COALESCE(p.is_active, true) = true;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'PRODUCT_NOT_FOUND';
    END IF;

    SELECT si.id, si.stock_current
    INTO v_inventory
    FROM public.sucursal_inventory si
    WHERE si.tenant_id = p_tenant_id
      AND si.sucursal_id = v_register.sucursal_id
      AND si.product_id = v_product.id
    FOR UPDATE;

    IF NOT FOUND OR COALESCE(v_inventory.stock_current, 0) < v_quantity THEN
      RAISE EXCEPTION 'INSUFFICIENT_STOCK:%', v_product.name;
    END IF;

    v_unit_price := v_product.unit_price;
    v_item_total := v_unit_price * v_quantity;
    v_subtotal := v_subtotal + v_item_total;
  END LOOP;

  INSERT INTO public.sales (
    tenant_id,
    cash_shift_id,
    customer_name,
    customer_phone,
    subtotal,
    total,
    payment_method,
    reference,
    notes,
    created_by,
    idempotency_key
  )
  VALUES (
    p_tenant_id,
    p_cash_shift_id,
    NULLIF(trim(p_customer_name), ''),
    NULLIF(trim(p_customer_phone), ''),
    v_subtotal,
    v_subtotal,
    p_payment_method,
    NULLIF(trim(p_reference), ''),
    NULLIF(trim(p_notes), ''),
    p_user_id,
    p_idempotency_key
  )
  RETURNING * INTO v_sale;

  FOR v_item IN SELECT value FROM jsonb_array_elements(p_items)
  LOOP
    v_quantity := (v_item->>'quantity')::numeric;

    SELECT
      p.id,
      p.sku,
      p.name,
      COALESCE(p.sale_price, 0)::numeric AS unit_price
    INTO v_product
    FROM public.products p
    WHERE p.id = (v_item->>'productId')::uuid
      AND p.tenant_id = p_tenant_id;

    SELECT si.id, si.stock_current
    INTO v_inventory
    FROM public.sucursal_inventory si
    WHERE si.tenant_id = p_tenant_id
      AND si.sucursal_id = v_register.sucursal_id
      AND si.product_id = v_product.id
    FOR UPDATE;

    v_unit_price := v_product.unit_price;
    v_item_total := v_unit_price * v_quantity;

    UPDATE public.sucursal_inventory
    SET stock_current = stock_current - v_quantity,
        updated_at = now()
    WHERE id = v_inventory.id
      AND tenant_id = p_tenant_id
      AND stock_current >= v_quantity;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'CONCURRENT_STOCK_CONFLICT:%', v_product.name;
    END IF;

    INSERT INTO public.sale_items (
      sale_id,
      product_id,
      sku_snapshot,
      description,
      quantity,
      unit_price,
      total
    )
    VALUES (
      v_sale.id,
      v_product.id,
      v_product.sku,
      v_product.name,
      v_quantity,
      v_unit_price,
      v_item_total
    );

    INSERT INTO public.inventory_movements (
      tenant_id,
      branch_id,
      product_id,
      movement_type,
      quantity,
      reference,
      notes,
      created_by
    )
    VALUES (
      p_tenant_id,
      v_register.sucursal_id,
      v_product.id,
      'sale',
      -v_quantity,
      v_sale.id::text,
      'Venta POS',
      p_user_id
    );
  END LOOP;

  RETURN jsonb_build_object(
    'sale', to_jsonb(v_sale),
    'idempotentReplay', false
  );
END;
$$;

REVOKE ALL ON FUNCTION public.execute_pos_sale_transaction(
  uuid, uuid, uuid, text, text, text, text, text, jsonb, text
) FROM PUBLIC;
