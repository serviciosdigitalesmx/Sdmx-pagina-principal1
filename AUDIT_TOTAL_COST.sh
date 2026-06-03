#!/bin/bash
set -e

OUT="AUDIT_TOTAL_COST.md"
rm -f "$OUT"

echo "# AUDIT TOTAL_COST" >> "$OUT"
echo "" >> "$OUT"

echo "## Backend" >> "$OUT"
grep -Rni "total_cost" apps/api/src >> "$OUT" || true

echo "" >> "$OUT"
echo "## Frontend" >> "$OUT"
grep -Rni "total_cost" apps/web-admin apps/web-public apps/web-clientes >> "$OUT" || true

echo "" >> "$OUT"
echo "## Migraciones" >> "$OUT"
grep -Rni "total_cost" supabase/migrations >> "$OUT" || true

echo "" >> "$OUT"
echo "## Select service_orders" >> "$OUT"
grep -Rni "service_orders" apps/api/src/controllers >> "$OUT" || true

echo "" >> "$OUT"
echo "## Update service_orders" >> "$OUT"
grep -Rni "\.update({" apps/api/src/controllers/orders.ts >> "$OUT" || true

echo "" >> "$OUT"
echo "## Insert service_orders" >> "$OUT"
grep -n "\.insert" apps/api/src/controllers/orders.ts >> "$OUT" || true

echo ""
echo "Listo: $OUT"
