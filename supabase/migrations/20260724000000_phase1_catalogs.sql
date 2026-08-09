-- Familias (ej. Smartphone, Laptop, Tablet)
CREATE TABLE IF NOT EXISTS public.catalog_families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Marcas (ej. Apple, Samsung, Dell)
CREATE TABLE IF NOT EXISTS public.catalog_brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  family_id UUID NOT NULL REFERENCES public.catalog_families(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Modelos (ej. iPhone 13, Galaxy S22)
CREATE TABLE IF NOT EXISTS public.catalog_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES public.catalog_brands(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  reference_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Fallas Frecuentes (ej. Pantalla Rota, Batería)
CREATE TABLE IF NOT EXISTS public.catalog_faults (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  model_id UUID NOT NULL REFERENCES public.catalog_models(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  estimated_labor_minutes INT,
  default_cost DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Refacciones Sugeridas (ej. Display LCD i11)
CREATE TABLE IF NOT EXISTS public.catalog_parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  fault_id UUID NOT NULL REFERENCES public.catalog_faults(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  sku TEXT,
  default_cost DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.catalog_families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalog_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalog_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalog_faults ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalog_parts ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS (tenant isolation)
CREATE POLICY "Tenant Isolation: catalog_families" ON public.catalog_families FOR ALL USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY "Tenant Isolation: catalog_brands" ON public.catalog_brands FOR ALL USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY "Tenant Isolation: catalog_models" ON public.catalog_models FOR ALL USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY "Tenant Isolation: catalog_faults" ON public.catalog_faults FOR ALL USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid);
CREATE POLICY "Tenant Isolation: catalog_parts" ON public.catalog_parts FOR ALL USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid);

-- Indexación para optimizar búsquedas por tenant y relaciones
CREATE INDEX IF NOT EXISTS idx_catalog_families_tenant ON public.catalog_families(tenant_id);
CREATE INDEX IF NOT EXISTS idx_catalog_brands_family ON public.catalog_brands(tenant_id, family_id);
CREATE INDEX IF NOT EXISTS idx_catalog_models_brand ON public.catalog_models(tenant_id, brand_id);
CREATE INDEX IF NOT EXISTS idx_catalog_faults_model ON public.catalog_faults(tenant_id, model_id);
CREATE INDEX IF NOT EXISTS idx_catalog_parts_fault ON public.catalog_parts(tenant_id, fault_id);

-- Enlazar orders al catálogo
ALTER TABLE public.service_orders ADD COLUMN catalog_model_id UUID REFERENCES public.catalog_models(id) ON DELETE SET NULL;
