#!/bin/bash
set -e

OUT="AUDITORIA_FASE_SIGUIENTE.md"
rm -f "$OUT"

section() {
  echo "" >> "$OUT"
  echo "---" >> "$OUT"
  echo "" >> "$OUT"
  echo "## $1" >> "$OUT"
  echo "" >> "$OUT"
}

echo "# AUDITORIA FASE SIGUIENTE" >> "$OUT"
echo "Fecha: $(date)" >> "$OUT"
echo "" >> "$OUT"

section "1. Rutas sin tenantSlug"
grep -Rni "app.use('/api/" apps/api/src/index.ts >> "$OUT" || true

section "2. Uso de customers"
grep -RniE "from\\('customers'\\)|from\\(\"customers\"\\)|customer_id|customerId" \
apps/api/src >> "$OUT" || true

section "3. Creación de órdenes"
grep -RniE "insert\\(|createOrder|service_orders" \
apps/api/src/controllers/orders.ts \
apps/api/src/controllers/requests.ts >> "$OUT" || true

section "4. organizations"
grep -Rni "organizations" \
apps/api/src \
supabase/migrations >> "$OUT" || true

section "5. tenants"
grep -Rni "tenants" \
apps/api/src \
supabase/migrations >> "$OUT" || true

section "6. service_order_status_history"
grep -Rni "service_order_status_history" \
apps/api/src \
supabase/migrations >> "$OUT" || true

section "7. service_order_events"
grep -Rni "service_order_events" \
apps/api/src \
supabase/migrations >> "$OUT" || true

section "8. evidence_metadata"
grep -Rni "evidence_metadata" \
apps/api/src \
apps/web-admin/src \
apps/web-public/src \
apps/web-clientes/src \
supabase/migrations >> "$OUT" || true

section "9. Evidencias dedicadas"
grep -RniE "evidence|attachment|attachments|files|service_order_evidence" \
apps/api/src \
supabase/migrations >> "$OUT" || true

section "10. Foreign Keys service_orders"
grep -Rni "service_orders" \
supabase/migrations >> "$OUT" || true

echo ""
echo "FIN"
echo "Archivo generado: $OUT"
