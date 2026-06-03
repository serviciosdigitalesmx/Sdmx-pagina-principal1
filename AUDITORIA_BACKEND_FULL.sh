#!/bin/bash
set -e

OUT="AUDITORIA_BACKEND_FULL.md"
rm -f "$OUT"

echo "# AUDITORÍA BACKEND FULL - Fixi" >> "$OUT"
echo "Fecha: $(date)" >> "$OUT"
echo "Repo: $(pwd)" >> "$OUT"
echo "" >> "$OUT"

section() {
  echo "" >> "$OUT"
  echo "---" >> "$OUT"
  echo "" >> "$OUT"
  echo "## $1" >> "$OUT"
  echo "" >> "$OUT"
}

section "1. Estructura API"
find apps/api/src -type f | sort >> "$OUT"

section "2. Rutas Express montadas en index.ts"
grep -n "app.use" apps/api/src/index.ts >> "$OUT" || true

section "3. Rutas con y sin tenantSlug"
grep -Rni "app.use('/api/:tenantSlug\|app.use('/api/" apps/api/src/index.ts >> "$OUT" || true

section "4. Frontend consumiendo API real"
find apps/web-admin/src apps/web-public/src apps/web-clientes/src \
  -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
  -exec grep -Hn "/api/" {} \; >> "$OUT" || true

section "5. branch_id en backend productivo"
grep -Rni "branch_id" apps/api/src >> "$OUT" || true

section "6. branch_id en migraciones"
grep -Rni "branch_id" supabase/migrations >> "$OUT" || true

section "7. sucursal_id en backend"
grep -Rni "sucursal_id" apps/api/src >> "$OUT" || true

section "8. Inventario: tablas y uso"
grep -RniE "sucursal_inventory|inventory_movements|stock_alerts|branch_inventory|from\\('inventory'\\)|from\\(\"inventory\"\\)" apps/api/src supabase/migrations >> "$OUT" || true

section "9. Costos: estimated_cost / final_cost / total_cost / subtotal"
grep -RniE "estimated_cost|final_cost|total_cost|subtotal|tax_amount|payment_amount" apps/api/src supabase/migrations >> "$OUT" || true

section "10. Escrituras a service_orders"
grep -RniE "from\\('service_orders'\\)|from\\(\"service_orders\"\\)|insert\\(\\[|update\\(\\{" apps/api/src/controllers/orders.ts apps/api/src/controllers/requests.ts apps/api/src/controllers/finance.ts apps/api/src/controllers/public.ts >> "$OUT" || true

section "11. Finanzas e ingresos"
grep -RniE "resolveOrderIncome|income|expense|balance|finances|customer_payments|payment" apps/api/src/controllers apps/api/src/services supabase/migrations >> "$OUT" || true

section "12. RLS / tenant isolation"
grep -RniE "row level security|force row level security|create policy|tenant_id|tenant_slug|auth.jwt|validateTenant|tenantResolver|attachScope" apps/api/src supabase/migrations >> "$OUT" || true

section "13. Variables de entorno usadas"
grep -Rni "process.env" apps/api/src apps/web-admin/src apps/web-public/src apps/web-clientes/src render.yaml .env.example >> "$OUT" || true

section "14. Imports workspace críticos"
grep -RniE "@white-label/database|@white-label/types|@supabase/supabase-js" apps/api/src packages apps/web-admin/src apps/web-public/src apps/web-clientes/src package.json pnpm-workspace.yaml >> "$OUT" || true

section "15. package.json importantes"
echo "### Root package.json" >> "$OUT"
cat package.json >> "$OUT" 2>/dev/null || true
echo "" >> "$OUT"
echo "### API package.json" >> "$OUT"
cat apps/api/package.json >> "$OUT" 2>/dev/null || true
echo "" >> "$OUT"
echo "### pnpm-workspace.yaml" >> "$OUT"
cat pnpm-workspace.yaml >> "$OUT" 2>/dev/null || true
echo "" >> "$OUT"
echo "### render.yaml" >> "$OUT"
cat render.yaml >> "$OUT" 2>/dev/null || true

section "16. Typecheck backend"
pnpm --filter @white-label/api typecheck >> "$OUT" 2>&1 || true

section "17. Build backend"
pnpm --filter @white-label/api build >> "$OUT" 2>&1 || true

echo "" >> "$OUT"
echo "---" >> "$OUT"
echo "" >> "$OUT"
echo "FIN AUDITORÍA" >> "$OUT"

echo "Listo: $OUT"
