-- Migración: 20260727000001_update_order_status_atomic.sql
CREATE OR REPLACE FUNCTION public.update_order_status_atomic(
  p_tenant_id uuid,
  p_order_id uuid,
  p_new_status text,
  p_previous_status text,
  p_note text,
  p_actor_name text,
  p_delivered_to_name text DEFAULT NULL,
  p_delivered_to_relationship text DEFAULT NULL,
  p_completed_at timestamptz DEFAULT NULL,
  p_delivered_at timestamptz DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_order service_orders%ROWTYPE;
  v_event_id uuid;
  v_evidence_metadata jsonb;
BEGIN
  -- Bloquear la orden para evitar concurrencia
  SELECT * INTO v_order
  FROM service_orders
  WHERE id = p_order_id AND tenant_id = p_tenant_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'ORDER_NOT_FOUND';
  END IF;

  -- Validar transición (opcional, se puede delegar al controlador)
  IF v_order.status = p_new_status THEN
    -- Si ya está en el mismo estado, no hacer nada (idempotente)
    RETURN jsonb_build_object('id', v_order.id, 'status', v_order.status, 'already_updated', true);
  END IF;

  -- Actualizar orden
  UPDATE service_orders
  SET
    status = p_new_status,
    completed_at = COALESCE(p_completed_at, completed_at),
    delivered_at = COALESCE(p_delivered_at, delivered_at),
    delivered_to_name = COALESCE(p_delivered_to_name, delivered_to_name),
    delivered_to_relationship = COALESCE(p_delivered_to_relationship, delivered_to_relationship),
    updated_by = current_setting('app.current_user_id', true)::uuid,
    updated_at = now()
  WHERE id = p_order_id AND tenant_id = p_tenant_id
  RETURNING * INTO v_order;

  -- Crear evento
  v_event_id := gen_random_uuid();
  INSERT INTO service_order_events (
    id, tenant_id, service_order_id, event_type,
    previous_status, new_status, note, actor_name, created_at
  ) VALUES (
    v_event_id, p_tenant_id, p_order_id, 'status_changed',
    p_previous_status, p_new_status, p_note, p_actor_name, now()
  );

  -- Actualizar metadata de evidencia (append)
  v_evidence_metadata := COALESCE(v_order.evidence_metadata, '[]'::jsonb);
  v_evidence_metadata := v_evidence_metadata || jsonb_build_array(
    jsonb_build_object(
      'kind', 'event',
      'id', v_event_id,
      'event_type', 'status_changed',
      'previous_status', p_previous_status,
      'new_status', p_new_status,
      'note', p_note,
      'actor_name', p_actor_name,
      'created_at', now()
    )
  );
  UPDATE service_orders
  SET evidence_metadata = v_evidence_metadata
  WHERE id = p_order_id AND tenant_id = p_tenant_id;

  RETURN jsonb_build_object(
    'id', v_order.id,
    'status', v_order.status,
    'updated', true
  );
END;
$$;

REVOKE ALL ON FUNCTION public.update_order_status_atomic(
  uuid, uuid, text, text, text, text, text, text, timestamptz, timestamptz
) FROM PUBLIC;
