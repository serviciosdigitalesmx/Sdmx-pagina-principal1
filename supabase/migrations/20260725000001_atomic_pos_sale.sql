-- Migration: 20260725000001_atomic_pos_sale.sql
-- Description: RPC for atomic POS sale and atomic cash shift closing

DO $$ 
BEGIN 
  -- We assume standard tables exist: pos_sales, pos_sale_items, cash_shifts, inventory_movements
  
  -- Function to close shift atomically
  CREATE OR REPLACE FUNCTION close_cash_shift_atomic(
    p_tenant_id UUID,
    p_shift_id UUID,
    p_user_id UUID,
    p_final_cash NUMERIC,
    p_notes TEXT
  ) RETURNS JSONB
  LANGUAGE plpgsql
  SECURITY DEFINER
  AS $func$
  DECLARE
    v_shift RECORD;
    v_sales_cash NUMERIC := 0;
    v_payments_cash NUMERIC := 0;
    v_expenses_cash NUMERIC := 0;
    v_expected_cash NUMERIC := 0;
    v_difference NUMERIC := 0;
    v_closed_shift JSONB;
  BEGIN
    -- Lock the shift row
    SELECT * INTO v_shift FROM cash_shifts 
    WHERE id = p_shift_id AND tenant_id = p_tenant_id AND status = 'open'
    FOR UPDATE;

    IF v_shift IS NULL THEN
      RAISE EXCEPTION 'Shift not found or not open';
    END IF;

    -- Calculate aggregates atomically
    SELECT COALESCE(SUM(total), 0) INTO v_sales_cash
    FROM pos_sales 
    WHERE cash_shift_id = p_shift_id AND tenant_id = p_tenant_id AND status = 'completed';

    SELECT COALESCE(SUM(amount), 0) INTO v_payments_cash
    FROM customer_payments 
    WHERE cash_shift_id = p_shift_id AND tenant_id = p_tenant_id AND status = 'confirmed';

    SELECT COALESCE(SUM(amount), 0) INTO v_expenses_cash
    FROM cash_expenses 
    WHERE cash_shift_id = p_shift_id AND tenant_id = p_tenant_id;

    v_expected_cash := v_shift.initial_cash + v_sales_cash + v_payments_cash - v_expenses_cash;
    v_difference := p_final_cash - v_expected_cash;

    -- Update the shift
    UPDATE cash_shifts
    SET 
      status = 'closed',
      closed_by = p_user_id,
      closed_at = NOW(),
      final_cash = p_final_cash,
      expected_cash = v_expected_cash,
      difference = v_difference,
      notes = p_notes
    WHERE id = p_shift_id
    RETURNING to_jsonb(cash_shifts.*) INTO v_closed_shift;

    RETURN v_closed_shift;
  END;
  $func$;

EXCEPTION WHEN duplicate_function THEN NULL; 
END $$;
