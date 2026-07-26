-- Migración: 20260727000003_update_create_order_rpc.sql
CREATE OR REPLACE FUNCTION public.create_service_order_transaction(
    p_tenant_id uuid,
    p_sucursal_id uuid,
    p_customer_name text,
    p_customer_phone text,
    p_customer_email text,
    p_folio text,
    p_public_token uuid,
    p_device_type text,
    p_device_model text,
    p_serial_number text,
    p_issue text,
    p_estimated_cost numeric,
    p_final_cost numeric,
    p_promised_date date,
    p_assigned_user_id uuid,
    p_catalog_model_id uuid,
    p_catalog_fault_id uuid,
    p_checklist_responses jsonb,
    p_priority text,
    p_actor_name text,
    p_checklist_data jsonb,
    p_idempotency_key text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_customer_id uuid;
    v_order_id uuid;
    v_event_id uuid;
    v_existing_order_id uuid;
BEGIN
    -- 0. Verificar Idempotencia
    IF p_idempotency_key IS NOT NULL THEN
        SELECT id INTO v_existing_order_id
        FROM public.service_orders
        WHERE tenant_id = p_tenant_id AND idempotency_key = p_idempotency_key;

        IF FOUND THEN
            -- Retornar la orden existente para evitar duplicados
            RETURN jsonb_build_object(
                'id', v_existing_order_id,
                'customer_id', (SELECT customer_id FROM public.service_orders WHERE id = v_existing_order_id),
                'idempotent_hit', true
            );
        END IF;
    END IF;

    -- 1. Buscar o Crear Cliente (Upsert Lógico)
    SELECT id INTO v_customer_id
    FROM public.customers
    WHERE tenant_id = p_tenant_id 
      AND (phone = p_customer_phone OR (email IS NOT NULL AND email = p_customer_email))
    LIMIT 1;

    IF v_customer_id IS NULL THEN
        INSERT INTO public.customers (tenant_id, sucursal_id, name, phone, email)
        VALUES (p_tenant_id, p_sucursal_id, p_customer_name, p_customer_phone, p_customer_email)
        RETURNING id INTO v_customer_id;
    ELSE
        UPDATE public.customers
        SET name = p_customer_name
        WHERE id = v_customer_id;
    END IF;

    -- 2. Insertar Orden de Servicio
    INSERT INTO public.service_orders (
        tenant_id,
        sucursal_id,
        customer_id,
        folio,
        public_token,
        status,
        device_info,
        serial_number,
        problem_description,
        metadata,
        estimated_cost,
        final_cost,
        promised_date,
        assigned_user_id,
        catalog_model_id,
        catalog_fault_id,
        checklist_responses,
        idempotency_key
    ) VALUES (
        p_tenant_id,
        p_sucursal_id,
        v_customer_id,
        p_folio,
        p_public_token,
        'recibido',
        jsonb_build_object(
            'customer_name', p_customer_name,
            'customer_phone', p_customer_phone,
            'customer_email', p_customer_email,
            'type', p_device_type,
            'brand', p_device_model,
            'model', p_device_model,
            'serial_number', p_serial_number
        ),
        p_serial_number,
        p_issue,
        jsonb_build_object('priority', COALESCE(p_priority, 'normal')),
        p_estimated_cost,
        p_final_cost,
        p_promised_date,
        p_assigned_user_id,
        p_catalog_model_id,
        p_catalog_fault_id,
        p_checklist_responses,
        p_idempotency_key
    ) RETURNING id INTO v_order_id;

    -- 3. Insertar Checklist
    INSERT INTO public.service_order_checklists (
        tenant_id,
        service_order_id,
        field_values,
        created_by
    ) VALUES (
        p_tenant_id,
        v_order_id,
        p_checklist_data,
        p_assigned_user_id
    );

    -- 4. Evento de Auditoría
    v_event_id := gen_random_uuid();
    INSERT INTO public.service_order_events (
        id,
        tenant_id,
        service_order_id,
        event_type,
        new_status,
        note,
        actor_name,
        created_at
    ) VALUES (
        v_event_id,
        p_tenant_id,
        v_order_id,
        'status_changed',
        'recibido',
        'Orden creada e ingresada a sucursal',
        p_actor_name,
        now()
    );

    UPDATE public.service_orders
    SET evidence_metadata = jsonb_build_array(
        jsonb_build_object(
            'kind', 'event',
            'id', v_event_id,
            'event_type', 'status_changed',
            'previous_status', null,
            'new_status', 'recibido',
            'note', 'Orden creada e ingresada a sucursal',
            'actor_name', p_actor_name,
            'created_at', now()
        )
    )
    WHERE id = v_order_id AND tenant_id = p_tenant_id;

    -- 5. Retornar IDs
    RETURN jsonb_build_object(
        'id', v_order_id,
        'customer_id', v_customer_id
    );
END;
$$;
