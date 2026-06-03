#!/bin/bash
set -e

OUT="AUDIT_COSTOS_SERVICE_ORDERS.md"
rm -f "$OUT"

section() {
  echo "" >> "$OUT"
  echo "---" >> "$OUT"
  echo "" >> "$OUT"
  echo "## $1" >> "$OUT"
  echo "" >> "$OUT"
}

echo "# AUDITORÍA COSTOS SERVICE_ORDERS - Fixi" >> "$OUT"
echo "Fecha: $(date)" >> "$OUT"
echo "Repo: $(pwd)" >> "$OUT"
echo "" >> "$OUT"

section "1. Referencias backend a estimated_cost / final_cost / total_cost"
grep -RniE "estimated_cost|final_cost|total_cost" apps/api/src || true >> "$OUT"

section "2. Referencias frontend a estimatedCost / finalCost / totalCost / estimated_cost / final_cost / total_cost"
find apps/web-admin/src apps/web-public/src apps/web-clientes/src \
  -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
  -exec grep -HnE "estimatedCost|finalCost|totalCost|estimated_cost|final_cost|total_cost" {} \; >> "$OUT" || true

section "3. Selects de service_orders en backend"
grep -RniE "from\\('service_orders'\\)|from\\(\"service_orders\"\\)|service_orders" apps/api/src/controllers apps/api/src/services >> "$OUT" || true

section "4. Escrituras insert/update hacia service_orders"
grep -RniE "insert\\(\\[|insert\\(\\{|update\\(\\{" apps/api/src/controllers/orders.ts apps/api/src/controllers/requests.ts apps/api/src/controllers/public.ts apps/api/src/controllers/finance.ts >> "$OUT" || true

section "5. Bloques relevantes orders.ts"
echo "### Around estimated/final usage in orders.ts" >> "$OUT"
grep -nE "estimated_cost|final_cost|total_cost|estimatedCost|finalCost|totalCost" apps/api/src/controllers/orders.ts | while IFS=: read -r line rest; do
  start=$((line-12)); [ "$start" -lt 1 ] && start=1
  end=$((line+12))
  echo "" >> "$OUT"
  echo "#### apps/api/src/controllers/orders.ts:$line" >> "$OUT"
  sed -n "${start},${end}p" apps/api/src/controllers/orders.ts >> "$OUT"
done

section "6. Bloques relevantes finance.ts"
grep -nE "estimated_cost|final_cost|total_cost|resolveOrderIncome|income|balance" apps/api/src/controllers/finance.ts | while IFS=: read -r line rest; do
  start=$((line-12)); [ "$start" -lt 1 ] && start=1
  end=$((line+12))
  echo "" >> "$OUT"
  echo "#### apps/api/src/controllers/finance.ts:$line" >> "$OUT"
  sed -n "${start},${end}p" apps/api/src/controllers/finance.ts >> "$OUT"
done

section "7. Bloques relevantes reports.ts"
grep -nE "estimated_cost|final_cost|total_cost|income|revenue|valuation" apps/api/src/controllers/reports.ts | while IFS=: read -r line rest; do
  start=$((line-12)); [ "$start" -lt 1 ] && start=1
  end=$((line+12))
  echo "" >> "$OUT"
  echo "#### apps/api/src/controllers/reports.ts:$line" >> "$OUT"
  sed -n "${start},${end}p" apps/api/src/controllers/reports.ts >> "$OUT"
done

section "8. Bloques relevantes public.ts"
grep -nE "estimated_cost|final_cost|total_cost|estimatedCost|finalCost|totalCost" apps/api/src/controllers/public.ts | while IFS=: read -r line rest; do
  start=$((line-12)); [ "$start" -lt 1 ] && start=1
  end=$((line+12))
  echo "" >> "$OUT"
  echo "#### apps/api/src/controllers/public.ts:$line" >> "$OUT"
  sed -n "${start},${end}p" apps/api/src/controllers/public.ts >> "$OUT"
done

section "9. Bloques relevantes requests.ts"
grep -nE "estimated_cost|final_cost|total_cost|estimatedCost|finalCost|totalCost" apps/api/src/controllers/requests.ts | while IFS=: read -r line rest; do
  start=$((line-12)); [ "$start" -lt 1 ] && start=1
  end=$((line+12))
  echo "" >> "$OUT"
  echo "#### apps/api/src/controllers/requests.ts:$line" >> "$OUT"
  sed -n "${start},${end}p" apps/api/src/controllers/requests.ts >> "$OUT"
done

section "10. Migraciones service_orders y costos"
grep -RniE "service_orders|estimated_cost|final_cost|total_cost|payment_amount" supabase/migrations >> "$OUT" || true

section "11. Migraciones alrededor de service_orders"
grep -RnlE "service_orders|estimated_cost|final_cost|total_cost|payment_amount" supabase/migrations | sort | while read -r file; do
  echo "" >> "$OUT"
  echo "### $file" >> "$OUT"
  grep -nE "service_orders|estimated_cost|final_cost|total_cost|payment_amount" "$file" >> "$OUT" || true
done

section "12. Posible schema actual desde types o dist"
grep -RniE "estimated_cost|final_cost|total_cost" packages apps/api/src apps/api/dist 2>/dev/null >> "$OUT" || true

section "13. Validación actual typecheck/build"
echo "### Typecheck" >> "$OUT"
pnpm --filter @white-label/api typecheck >> "$OUT" 2>&1 || true
echo "" >> "$OUT"
echo "### Build" >> "$OUT"
pnpm --filter @white-label/api build >> "$OUT" 2>&1 || true

echo "" >> "$OUT"
echo "---" >> "$OUT"
echo "" >> "$OUT"
echo "FIN AUDITORÍA COSTOS" >> "$OUT"

echo "Listo: $OUT"
