-- Migration: add folio column and index if missing
-- Date: 2026-05-09

ALTER TABLE IF EXISTS public.service_orders
  ADD COLUMN IF NOT EXISTS folio bigint;

-- If folio is NULL for existing rows, populate sequentially using row_number()
WITH updated AS (
  SELECT id, row_number() OVER (ORDER BY created_at NULLS LAST, id) as rn
  FROM public.service_orders
  WHERE folio IS NULL
)
UPDATE public.service_orders s
SET folio = u.rn
FROM updated u
WHERE s.id = u.id AND s.folio IS NULL;

CREATE INDEX IF NOT EXISTS idx_service_orders_tenant_folio ON public.service_orders (tenant_id, folio);
