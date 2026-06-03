#!/bin/bash

OUT="AUDIT_SERVICE_ORDERS.md"
rm -f "$OUT"

echo "# SERVICE ORDERS" >> "$OUT"
echo "" >> "$OUT"

grep -Rni "service_orders" apps/api/src >> "$OUT"

echo "" >> "$OUT"
echo "================================" >> "$OUT"
echo "" >> "$OUT"

grep -RniE "tenant_id|sucursal_id|customer_id|estimated_cost|final_cost|status" apps/api/src/controllers/orders.ts >> "$OUT"

echo "" >> "$OUT"
echo "================================" >> "$OUT"
echo "" >> "$OUT"

grep -RniE "service_orders.*tenant_id|service_orders.*customer_id|service_orders.*sucursal_id" supabase/migrations >> "$OUT"

pbcopy < "$OUT"

echo "COPIADO"
