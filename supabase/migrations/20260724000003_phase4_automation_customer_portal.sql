-- 1. Autorizaciones del cliente (aprobación de cotizaciones)
CREATE TABLE IF NOT EXISTS public.customer_authorizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES public.service_orders(id) ON DELETE CASCADE,
  public_token UUID NOT NULL UNIQUE,
  authorization_type TEXT NOT NULL CONSTRAINT chk_auth_type CHECK (authorization_type IN ('diagnosis', 'repair', 'quotation')),
  decision TEXT CONSTRAINT chk_decision CHECK (decision IN ('accepted', 'rejected')),
  amount_authorized DECIMAL(10,2),
  scope_snapshot JSONB,
  accepted_by_name TEXT,
  accepted_by_phone TEXT,
  accepted_by_email TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  decided_at TIMESTAMPTZ
);

-- 2. Pagos en línea (integración con pasarelas)
CREATE TABLE IF NOT EXISTS public.online_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.service_orders(id) ON DELETE SET NULL,
  sale_id UUID REFERENCES public.sales(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'MXN',
  payment_method TEXT NOT NULL,
  reference TEXT,
  status TEXT NOT NULL CONSTRAINT chk_online_payment_status CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  raw_response JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  paid_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ
);

-- 3. Definición de reglas de automatización (configurables por tenant)
CREATE TABLE IF NOT EXISTS public.automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  condition JSONB,
  action_type TEXT NOT NULL CONSTRAINT chk_action_type CHECK (action_type IN ('send_whatsapp', 'send_email', 'send_notification')),
  action_config JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Log de ejecución de reglas
CREATE TABLE IF NOT EXISTS public.automation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  rule_id UUID REFERENCES public.automation_rules(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.service_orders(id) ON DELETE CASCADE,
  event_type TEXT,
  status TEXT NOT NULL CONSTRAINT chk_log_status CHECK (status IN ('success', 'failed', 'pending')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Plantillas de Mensajes
CREATE TABLE IF NOT EXISTS public.message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  channel TEXT NOT NULL CONSTRAINT chk_channel CHECK (channel IN ('whatsapp', 'email', 'sms')),
  subject TEXT,
  body TEXT NOT NULL,
  variables TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Reseñas de clientes (automatizadas)
CREATE TABLE IF NOT EXISTS public.customer_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.service_orders(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  platform TEXT,
  review_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.customer_authorizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.online_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_reviews ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS (tenant isolation)
CREATE POLICY "Tenant Isolation: customer_authorizations" ON public.customer_authorizations FOR ALL USING (tenant_id = auth.jwt()->>'tenant_id'::uuid);
CREATE POLICY "Tenant Isolation: online_payments" ON public.online_payments FOR ALL USING (tenant_id = auth.jwt()->>'tenant_id'::uuid);
CREATE POLICY "Tenant Isolation: automation_rules" ON public.automation_rules FOR ALL USING (tenant_id = auth.jwt()->>'tenant_id'::uuid);
CREATE POLICY "Tenant Isolation: automation_logs" ON public.automation_logs FOR ALL USING (tenant_id = auth.jwt()->>'tenant_id'::uuid);
CREATE POLICY "Tenant Isolation: message_templates" ON public.message_templates FOR ALL USING (tenant_id = auth.jwt()->>'tenant_id'::uuid);
CREATE POLICY "Tenant Isolation: customer_reviews" ON public.customer_reviews FOR ALL USING (tenant_id = auth.jwt()->>'tenant_id'::uuid);

-- Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_customer_authorizations_public_token ON public.customer_authorizations(public_token);
CREATE INDEX IF NOT EXISTS idx_online_payments_order_id ON public.online_payments(order_id);
CREATE INDEX IF NOT EXISTS idx_automation_rules_event ON public.automation_rules(tenant_id, event_type);
CREATE INDEX IF NOT EXISTS idx_automation_logs_order ON public.automation_logs(tenant_id, order_id);
CREATE INDEX IF NOT EXISTS idx_message_templates_name ON public.message_templates(tenant_id, name);
CREATE INDEX IF NOT EXISTS idx_customer_reviews_rating ON public.customer_reviews(tenant_id, rating);
