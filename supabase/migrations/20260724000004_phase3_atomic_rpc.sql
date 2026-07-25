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
    p_checklist_data jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_customer_id uuid;
    v_order_id uuid;
    v_event_id uuid;
    v_result jsonb;
BEGIN
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
        -- Opcional: Actualizar el nombre del cliente si cambió
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
        checklist_responses
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
        p_checklist_responses
    ) RETURNING id INTO v_order_id;

    -- 3. Insertar Checklist
    INSERT INTO public.service_order_checklists (
        tenant_id,
        service_order_id,
        has_charger,
        screen_condition,
        powers_on,
        backup_required,
        notes,
        cosmetic_condition,
        reported_physical_damage,
        accessories_received,
        customer_acceptance_required,
        accepted_at,
        accepted_by_name
    ) VALUES (
        p_tenant_id,
        v_order_id,
        COALESCE((p_checklist_data->>'hasCharger')::boolean, false),
        p_checklist_data->>'screenCondition',
        COALESCE((p_checklist_data->>'powersOn')::boolean, false),
        COALESCE((p_checklist_data->>'backupRequired')::boolean, false),
        p_checklist_data->>'notes',
        p_checklist_data->>'cosmeticCondition',
        p_checklist_data->>'reportedPhysicalDamage',
        p_checklist_data->>'accessoriesReceived',
        COALESCE((p_checklist_data->>'customerAcceptanceRequired')::boolean, false),
        NULLIF(p_checklist_data->>'acceptedAt', ''),
        p_checklist_data->>'acceptedByName'
    );

    -- 4. Crear Evento Inicial en el Historial
    v_event_id := gen_random_uuid();
    INSERT INTO public.service_order_events (
        id, tenant_id, service_order_id, event_type, new_status, note, actor_name
    ) VALUES (
        v_event_id, p_tenant_id, v_order_id, 'created', 'recibido', p_issue, p_actor_name
    );

    -- 5. Vincular Evidencia en la Orden
    UPDATE public.service_orders
    SET evidence_metadata = jsonb_build_array(
        jsonb_build_object(
            'kind', 'event',
            'id', v_event_id,
            'event_type', 'created',
            'previous_status', null,
            'new_status', 'recibido',
            'note', p_issue,
            'actor_name', p_actor_name,
            'created_at', now()
        )
    )
    WHERE id = v_order_id;

    -- 6. Devolver resultado limpio
    v_result := jsonb_build_object(
        'id', v_order_id,
        'folio', p_folio,
        'public_token', p_public_token,
        'customer_id', v_customer_id
    );

    RETURN v_result;
END;
$$;
