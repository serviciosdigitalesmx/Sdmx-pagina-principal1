-- Canon Rule: Auto-create tenant and sucursal whenever a new user is created in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_auth_user_tenant()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_workshop_name text;
  v_slug_base text;
  v_email text;
  v_phone text;
  v_tenant_id uuid;
  v_sucursal_id uuid;
BEGIN
  -- Check if user already exists in public.users with a tenant
  IF EXISTS (SELECT 1 FROM public.users WHERE auth_user_id = NEW.id AND tenant_id IS NOT NULL) THEN
    RETURN NEW;
  END IF;

  v_email := coalesce(NEW.email, 'user_' || substr(NEW.id::text, 1, 8) || '@fixi.local');
  v_workshop_name := coalesce(
    nullif(btrim(NEW.raw_user_meta_data->>'workshop_name'), ''),
    nullif(btrim(NEW.raw_user_meta_data->>'full_name'), ''),
    'Taller de ' || split_part(v_email, '@', 1)
  );
  v_slug_base := v_workshop_name;
  v_phone := coalesce(NEW.phone, nullif(btrim(NEW.raw_user_meta_data->>'phone'), ''), '5555555555');

  -- Invoke create_tenant_transaction to provision tenant & owner user row
  BEGIN
    PERFORM public.create_tenant_transaction(
      NEW.id,
      v_workshop_name,
      v_slug_base,
      v_email,
      v_phone,
      'Matriz Principal',
      NULL
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'auto_create_tenant error: %', SQLERRM;
  END;

  -- Ensure a default sucursal exists for this newly created tenant and assign it to the user
  SELECT tenant_id INTO v_tenant_id FROM public.users WHERE auth_user_id = NEW.id LIMIT 1;

  IF v_tenant_id IS NOT NULL THEN
    SELECT id INTO v_sucursal_id FROM public.sucursales WHERE tenant_id = v_tenant_id AND is_active = true LIMIT 1;
    
    IF v_sucursal_id IS NULL THEN
      INSERT INTO public.sucursales (tenant_id, name, address, is_active)
      VALUES (v_tenant_id, 'Matriz Principal', 'Sucursal Principal', true)
      RETURNING id INTO v_sucursal_id;
    END IF;

    UPDATE public.users SET sucursal_id = v_sucursal_id WHERE auth_user_id = NEW.id AND sucursal_id IS NULL;
  END IF;

  RETURN NEW;
END;
$$;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS tr_on_auth_user_created_tenant ON auth.users;

-- Create trigger on auth.users
CREATE TRIGGER tr_on_auth_user_created_tenant
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_auth_user_tenant();
