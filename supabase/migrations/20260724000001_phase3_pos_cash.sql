-- 1. Cajas Registradoras (cash_registers)
CREATE TABLE IF NOT EXISTS public.cash_registers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  sucursal_id UUID NOT NULL REFERENCES public.sucursales(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Turnos de Caja (cash_shifts)
CREATE TABLE IF NOT EXISTS public.cash_shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  cash_register_id UUID NOT NULL REFERENCES public.cash_registers(id) ON DELETE CASCADE,
  opened_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  opened_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  initial_cash DECIMAL(10,2) NOT NULL DEFAULT 0,
  closed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  closed_at TIMESTAMPTZ,
  final_cash DECIMAL(10,2),
  expected_cash DECIMAL(10,2),
  difference DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'open' CONSTRAINT chk_cash_shift_status CHECK (status IN ('open', 'closed', 'suspended')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Ventas de Mostrador (sales)
CREATE TABLE IF NOT EXISTS public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  cash_shift_id UUID NOT NULL REFERENCES public.cash_shifts(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  customer_name TEXT,
  customer_phone TEXT,
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL CONSTRAINT chk_sale_payment_method CHECK (payment_method IN ('cash', 'card', 'transfer')),
  reference TEXT,
  notes TEXT,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Detalle de Ventas (sale_items)
CREATE TABLE IF NOT EXISTS public.sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  sku_snapshot TEXT,
  description TEXT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Egresos de Caja (cash_shift_expenses)
CREATE TABLE IF NOT EXISTS public.cash_shift_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  cash_shift_id UUID NOT NULL REFERENCES public.cash_shifts(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  receipt_url TEXT,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Enlazar pagos de órdenes a caja
ALTER TABLE public.customer_payments ADD COLUMN IF NOT EXISTS cash_shift_id UUID REFERENCES public.cash_shifts(id) ON DELETE SET NULL;

-- Habilitar RLS
ALTER TABLE public.cash_registers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_shift_expenses ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS (tenant isolation)
CREATE POLICY "Tenant Isolation: cash_registers" ON public.cash_registers FOR ALL USING (tenant_id = auth.jwt()->>'tenant_id'::uuid);
CREATE POLICY "Tenant Isolation: cash_shifts" ON public.cash_shifts FOR ALL USING (tenant_id = auth.jwt()->>'tenant_id'::uuid);
CREATE POLICY "Tenant Isolation: sales" ON public.sales FOR ALL USING (tenant_id = auth.jwt()->>'tenant_id'::uuid);
CREATE POLICY "Tenant Isolation: sale_items" ON public.sale_items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.sales s 
    WHERE s.id = sale_items.sale_id AND s.tenant_id = auth.jwt()->>'tenant_id'::uuid
  )
);
CREATE POLICY "Tenant Isolation: cash_shift_expenses" ON public.cash_shift_expenses FOR ALL USING (tenant_id = auth.jwt()->>'tenant_id'::uuid);

-- Índices de Rendimiento
CREATE INDEX IF NOT EXISTS idx_cash_registers_tenant_sucursal ON public.cash_registers(tenant_id, sucursal_id);
CREATE INDEX IF NOT EXISTS idx_cash_shifts_tenant_register ON public.cash_shifts(tenant_id, cash_register_id);
CREATE INDEX IF NOT EXISTS idx_sales_cash_shift ON public.sales(tenant_id, cash_shift_id);
CREATE INDEX IF NOT EXISTS idx_cash_shift_expenses_shift ON public.cash_shift_expenses(tenant_id, cash_shift_id);
CREATE INDEX IF NOT EXISTS idx_customer_payments_shift ON public.customer_payments(cash_shift_id);
