-- Migration: 20260726000001_integrity_hardening_and_roles.sql
-- Description: Integrity hardening, roles and permissions, payment structures

CREATE UNIQUE INDEX IF NOT EXISTS uq_catalog_families_tenant_name
ON public.catalog_families (tenant_id, lower(trim(name)));

CREATE UNIQUE INDEX IF NOT EXISTS uq_catalog_brands_parent_name
ON public.catalog_brands (tenant_id, family_id, lower(trim(name)));

CREATE UNIQUE INDEX IF NOT EXISTS uq_catalog_models_parent_name
ON public.catalog_models (tenant_id, brand_id, lower(trim(name)));

CREATE UNIQUE INDEX IF NOT EXISTS uq_catalog_faults_parent_name
ON public.catalog_faults (tenant_id, model_id, lower(trim(name)));

CREATE UNIQUE INDEX IF NOT EXISTS uq_catalog_checklists_key
ON public.catalog_checklists (tenant_id, family_id, item_key);

CREATE UNIQUE INDEX IF NOT EXISTS uq_open_shift_per_user
ON public.cash_shifts (tenant_id, opened_by)
WHERE status = 'open';

CREATE UNIQUE INDEX IF NOT EXISTS uq_open_shift_per_register
ON public.cash_shifts (tenant_id, cash_register_id)
WHERE status = 'open';

ALTER TABLE public.sale_items
DROP CONSTRAINT IF EXISTS sale_items_quantity_positive;

ALTER TABLE public.sale_items
ADD CONSTRAINT sale_items_quantity_positive
CHECK (quantity > 0);

ALTER TABLE public.sale_items
DROP CONSTRAINT IF EXISTS sale_items_unit_price_nonnegative;

ALTER TABLE public.sale_items
ADD CONSTRAINT sale_items_unit_price_nonnegative
CHECK (unit_price >= 0);

ALTER TABLE public.cash_shift_expenses
DROP CONSTRAINT IF EXISTS cash_shift_expenses_amount_positive;

ALTER TABLE public.cash_shift_expenses
ADD CONSTRAINT cash_shift_expenses_amount_positive
CHECK (amount > 0);

CREATE INDEX IF NOT EXISTS idx_service_orders_tenant_status_created
ON public.service_orders (tenant_id, status, created_at DESC);

DO $$
BEGIN
  CREATE INDEX IF NOT EXISTS idx_customer_payments_order_status
  ON public.customer_payments (tenant_id, service_order_id, status);
EXCEPTION
  WHEN undefined_column OR undefined_table THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_automation_logs_tenant_created
ON public.automation_logs (tenant_id, created_at DESC);

-- Online payments support
ALTER TABLE public.online_payments
ADD COLUMN IF NOT EXISTS idempotency_key text,
ADD COLUMN IF NOT EXISTS provider_preference_id text;

CREATE UNIQUE INDEX IF NOT EXISTS uq_online_payments_tenant_idempotency
ON public.online_payments (tenant_id, idempotency_key)
WHERE idempotency_key IS NOT NULL;

ALTER TABLE public.customer_payments
ADD COLUMN IF NOT EXISTS provider_payment_id text;

CREATE UNIQUE INDEX IF NOT EXISTS uq_customer_payments_provider
ON public.customer_payments (tenant_id, provider_payment_id)
WHERE provider_payment_id IS NOT NULL;

-- Customer authorizations signature storage update
ALTER TABLE public.customer_authorizations
ADD COLUMN IF NOT EXISTS signature_bucket text,
ADD COLUMN IF NOT EXISTS signature_path text,
ADD COLUMN IF NOT EXISTS signature_sha256 text,
ADD COLUMN IF NOT EXISTS signature_mime_type text,
ADD COLUMN IF NOT EXISTS signature_size_bytes bigint;

-- Do not drop signature_url yet for backwards compatibility

-- Tenant Role Permissions Table
CREATE TABLE IF NOT EXISTS public.tenant_role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  role text NOT NULL,
  permission_key text NOT NULL,
  allowed boolean NOT NULL DEFAULT false,
  updated_by uuid NULL REFERENCES public.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, role, permission_key)
);

ALTER TABLE public.tenant_role_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant Isolation: tenant_role_permissions" ON public.tenant_role_permissions FOR ALL USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid);
