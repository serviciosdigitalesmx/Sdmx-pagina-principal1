-- 1. Checklists dinámicos por familia
CREATE TABLE IF NOT EXISTS public.catalog_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  family_id UUID NOT NULL REFERENCES public.catalog_families(id) ON DELETE CASCADE,
  item_key TEXT NOT NULL, -- ej. "has_charger", "screen_condition"
  item_label TEXT NOT NULL, -- "Trae cargador", "Condición de pantalla"
  item_type TEXT NOT NULL CONSTRAINT chk_item_type CHECK (item_type IN ('boolean', 'text', 'select')),
  options JSONB, -- para selects: ['OK', 'Rayado', 'Roto']
  required BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.catalog_checklists ENABLE ROW LEVEL SECURITY;

-- Política de RLS (tenant isolation)
CREATE POLICY "Tenant Isolation: catalog_checklists" ON public.catalog_checklists FOR ALL USING (tenant_id = auth.jwt()->>'tenant_id'::uuid);

-- Índices de Rendimiento
CREATE INDEX IF NOT EXISTS idx_catalog_checklists_family ON public.catalog_checklists(tenant_id, family_id);

-- 2. Modificar service_orders para asociar con la nueva jerarquía de catálogos
ALTER TABLE public.service_orders ADD COLUMN IF NOT EXISTS catalog_model_id UUID REFERENCES public.catalog_models(id) ON DELETE SET NULL;
ALTER TABLE public.service_orders ADD COLUMN IF NOT EXISTS catalog_fault_id UUID REFERENCES public.catalog_faults(id) ON DELETE SET NULL;
ALTER TABLE public.service_orders ADD COLUMN IF NOT EXISTS checklist_responses JSONB;

-- 3. Crear índices para optimizar búsquedas difusas en órdenes y clientes
CREATE INDEX IF NOT EXISTS idx_service_orders_folio ON public.service_orders(folio);
CREATE INDEX IF NOT EXISTS idx_service_orders_device_info ON public.service_orders USING gin (device_info);
CREATE INDEX IF NOT EXISTS idx_customers_name ON public.customers(name);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);

-- 4. Función para obtener sugerencias de compras
CREATE OR REPLACE FUNCTION public.get_purchase_suggestions(p_tenant_id UUID, p_sucursal_id UUID)
RETURNS TABLE (
  product_id UUID,
  sku TEXT,
  name TEXT,
  current_stock NUMERIC,
  pending_reservations NUMERIC,
  minimum_stock NUMERIC,
  suggested_quantity NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.sku,
    p.name,
    COALESCE(si.stock_current, 0)::NUMERIC AS current_stock,
    COALESCE(r.pending, 0)::NUMERIC AS pending_reservations,
    p.minimum_stock::NUMERIC,
    GREATEST(0, (COALESCE(r.pending, 0) + p.minimum_stock) - COALESCE(si.stock_current, 0))::NUMERIC AS suggested_quantity
  FROM public.products p
  LEFT JOIN public.sucursal_inventory si ON si.product_id = p.id AND si.sucursal_id = p_sucursal_id
  LEFT JOIN (
    SELECT ir.product_id, SUM(ir.reserved_quantity - ir.consumed_quantity) AS pending
    FROM public.inventory_reservations ir
    WHERE ir.status = 'active' AND ir.tenant_id = p_tenant_id
    GROUP BY ir.product_id
  ) r ON r.product_id = p.id
  WHERE p.tenant_id = p_tenant_id
  ORDER BY suggested_quantity DESC;
END;
$$ LANGUAGE plpgsql;
