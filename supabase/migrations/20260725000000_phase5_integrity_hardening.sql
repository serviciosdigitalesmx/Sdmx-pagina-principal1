-- Phase 5: Integrity Hardening

-- 1. Unique constraints on catalogs (using partial/functional unique indexes for idempotency and flexibility)
CREATE UNIQUE INDEX IF NOT EXISTS uq_catalog_families_name ON public.catalog_families (tenant_id, lower(name));
CREATE UNIQUE INDEX IF NOT EXISTS uq_catalog_brands_name ON public.catalog_brands (tenant_id, family_id, lower(name));
CREATE UNIQUE INDEX IF NOT EXISTS uq_catalog_models_name ON public.catalog_models (tenant_id, brand_id, lower(name));
CREATE UNIQUE INDEX IF NOT EXISTS uq_catalog_faults_name ON public.catalog_faults (tenant_id, model_id, lower(name));

DO $$
BEGIN
    CREATE UNIQUE INDEX IF NOT EXISTS uq_catalog_checklist_items_key ON public.catalog_checklist_items (tenant_id, family_id, item_key);
EXCEPTION
    WHEN undefined_table THEN NULL;
END
$$;

-- 2. Cash register constraints
-- Only one open shift per user per tenant
CREATE UNIQUE INDEX IF NOT EXISTS uq_cash_shifts_open_user ON public.cash_shifts (tenant_id, opened_by) WHERE status = 'open';

-- Only one active register per name per sucursal
CREATE UNIQUE INDEX IF NOT EXISTS uq_cash_registers_active_name ON public.cash_registers (sucursal_id, lower(name)) WHERE is_active = true;

-- 3. CHECK constraints
-- sale_items (referred to as pos_sale_items)
DO $$
BEGIN
    ALTER TABLE public.sale_items ADD CONSTRAINT chk_sale_items_qty CHECK (quantity > 0);
EXCEPTION
    WHEN duplicate_object OR undefined_table THEN NULL;
END $$;

DO $$
BEGIN
    ALTER TABLE public.sale_items ADD CONSTRAINT chk_sale_items_price CHECK (unit_price >= 0);
EXCEPTION
    WHEN duplicate_object OR undefined_table THEN NULL;
END $$;

-- pos_sale_items (in case it exists)
DO $$
BEGIN
    ALTER TABLE public.pos_sale_items ADD CONSTRAINT chk_pos_sale_items_qty CHECK (quantity > 0);
EXCEPTION
    WHEN duplicate_object OR undefined_table THEN NULL;
END $$;

DO $$
BEGIN
    ALTER TABLE public.pos_sale_items ADD CONSTRAINT chk_pos_sale_items_price CHECK (unit_price >= 0);
EXCEPTION
    WHEN duplicate_object OR undefined_table THEN NULL;
END $$;

-- products
DO $$
BEGIN
    ALTER TABLE public.products ADD CONSTRAINT chk_products_cost CHECK (cost >= 0);
EXCEPTION
    WHEN duplicate_object OR undefined_table OR undefined_column THEN NULL;
END $$;

DO $$
BEGIN
    ALTER TABLE public.products ADD CONSTRAINT chk_products_price CHECK (sale_price >= 0);
EXCEPTION
    WHEN duplicate_object OR undefined_table OR undefined_column THEN NULL;
END $$;

-- inventory_movements
DO $$
BEGIN
    ALTER TABLE public.inventory_movements ADD CONSTRAINT chk_inventory_movements_qty CHECK (quantity != 0);
EXCEPTION
    WHEN duplicate_object OR undefined_table THEN NULL;
END $$;

-- 4. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_service_orders_tenant_status_2 ON public.service_orders(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_service_orders_tenant_created_at_desc ON public.service_orders(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_customers_tenant_phone_2 ON public.customers(tenant_id, phone);
CREATE INDEX IF NOT EXISTS idx_customers_tenant_email_2 ON public.customers(tenant_id, email);
CREATE INDEX IF NOT EXISTS idx_sales_tenant_cash_shift_id ON public.sales(tenant_id, cash_shift_id);

DO $$
BEGIN
    CREATE INDEX IF NOT EXISTS idx_pos_sales_tenant_cash_shift_id ON public.pos_sales(tenant_id, cash_shift_id);
EXCEPTION
    WHEN undefined_table THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_cash_shifts_tenant_status ON public.cash_shifts(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_catalog_families_tenant_2 ON public.catalog_families(tenant_id);
CREATE INDEX IF NOT EXISTS idx_catalog_brands_tenant_family_2 ON public.catalog_brands(tenant_id, family_id);

-- 5. Idempotency keys
-- sales / pos_sales
DO $$
BEGIN
    ALTER TABLE public.sales ADD COLUMN IF NOT EXISTS idempotency_key TEXT;
EXCEPTION
    WHEN undefined_table THEN NULL;
END $$;

DO $$
BEGIN
    CREATE UNIQUE INDEX IF NOT EXISTS uq_sales_idempotency_key ON public.sales (tenant_id, idempotency_key) WHERE idempotency_key IS NOT NULL;
EXCEPTION
    WHEN undefined_table THEN NULL;
END $$;

DO $$
BEGIN
    ALTER TABLE public.pos_sales ADD COLUMN IF NOT EXISTS idempotency_key TEXT;
EXCEPTION
    WHEN undefined_table THEN NULL;
END $$;

DO $$
BEGIN
    CREATE UNIQUE INDEX IF NOT EXISTS uq_pos_sales_idempotency_key ON public.pos_sales (tenant_id, idempotency_key) WHERE idempotency_key IS NOT NULL;
EXCEPTION
    WHEN undefined_table THEN NULL;
END $$;

-- customer_payments
DO $$
BEGIN
    ALTER TABLE public.customer_payments ADD COLUMN IF NOT EXISTS idempotency_key TEXT;
EXCEPTION
    WHEN undefined_table THEN NULL;
END $$;

DO $$
BEGIN
    CREATE UNIQUE INDEX IF NOT EXISTS uq_customer_payments_idempotency_key ON public.customer_payments (tenant_id, idempotency_key) WHERE idempotency_key IS NOT NULL;
EXCEPTION
    WHEN undefined_table THEN NULL;
END $$;
