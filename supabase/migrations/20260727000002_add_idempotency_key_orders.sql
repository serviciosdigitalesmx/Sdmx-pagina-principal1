-- Migración: 20260727000002_add_idempotency_key_orders.sql
ALTER TABLE public.service_orders
ADD COLUMN IF NOT EXISTS idempotency_key text;

-- Asegurar que la clave de idempotencia sea única por tenant (si existe)
CREATE UNIQUE INDEX IF NOT EXISTS uq_service_orders_idempotency
ON public.service_orders (tenant_id, idempotency_key)
WHERE idempotency_key IS NOT NULL;
