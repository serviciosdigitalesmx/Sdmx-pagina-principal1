#!/bin/bash
set -e

OUT="AUDIT_CLIENTES_ORDENES.md"
rm -f "$OUT"

echo "# AUDIT CLIENTES / ÓRDENES" >> "$OUT"
echo "Fecha: $(date)" >> "$OUT"
echo "Repo: $(pwd)" >> "$OUT"
echo "" >> "$OUT"

echo "## orders.ts" >> "$OUT"
grep -RniE "customer|client|phone|service_orders|customers" apps/api/src/controllers/orders.ts >> "$OUT" || true

echo "" >> "$OUT"
echo "## requests.ts" >> "$OUT"
grep -RniE "customer|client|phone|service_orders|customers" apps/api/src/controllers/requests.ts >> "$OUT" || true

echo "" >> "$OUT"
echo "## customers usage" >> "$OUT"
grep -RniE "from\\('customers'\\)|from\\(\"customers\"\\)|customers" apps/api/src supabase/migrations >> "$OUT" || true

echo "" >> "$OUT"
echo "## service_orders schema" >> "$OUT"
grep -RniE "service_orders|customer_id|customer_name|customer_phone" supabase/migrations >> "$OUT" || true

echo "" >> "$OUT"
echo "## typecheck" >> "$OUT"
pnpm --filter @white-label/api typecheck >> "$OUT" 2>&1 || true

echo "Listo: $OUT"
open "$OUT"
