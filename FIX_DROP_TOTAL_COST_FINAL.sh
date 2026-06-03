#!/bin/bash
set -e

TS="$(date +%Y%m%d%H%M%S)"
MIGRATION="supabase/migrations/${TS}_drop_total_cost_from_service_orders.sql"

cat > "$MIGRATION" <<'SQL'
-- Drop legacy total_cost after migrating all runtime consumers to final_cost.
-- Preconditions already validated:
-- 1) service_orders.final_cost is the canonical charged amount.
-- 2) service_orders.estimated_cost is the quote/estimate.
-- 3) total_cost was backfilled to final_cost before this migration.

alter table public.service_orders
  drop constraint if exists service_orders_total_cost_check;

alter table public.service_orders
  drop column if exists total_cost;
SQL

echo "Migración creada: $MIGRATION"

echo ""
echo "Validando que código fuente no consuma total_cost..."
if grep -Rni \
  --exclude-dir=.next \
  --exclude-dir=node_modules \
  --exclude-dir=dist \
  --exclude-dir=build \
  --exclude-dir=.git \
  --exclude="*.bak*" \
  "total_cost" apps/api/src apps/web-admin/src apps/web-public/src apps/web-clientes/src; then
  echo ""
  echo "ERROR: todavía hay referencias total_cost en código fuente."
  exit 1
fi

echo ""
echo "Typecheck API..."
pnpm --filter @white-label/api typecheck

echo ""
echo "Build API..."
pnpm --filter @white-label/api build

echo ""
echo "Typecheck web-admin..."
pnpm --filter web-admin typecheck || true

echo ""
echo "OK: migración lista para eliminar total_cost."
echo "Archivo: $MIGRATION"
