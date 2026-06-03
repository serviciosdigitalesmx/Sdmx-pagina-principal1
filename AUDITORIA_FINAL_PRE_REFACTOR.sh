#!/bin/bash
set -e

OUT="AUDITORIA_FINAL_PRE_REFACTOR.md"
rm -f "$OUT"

section() {
  echo "" >> "$OUT"
  echo "---" >> "$OUT"
  echo "" >> "$OUT"
  echo "## $1" >> "$OUT"
  echo "" >> "$OUT"
}

echo "# AUDITORIA FINAL PRE REFACTOR" >> "$OUT"
echo "" >> "$OUT"
echo "Fecha: $(date)" >> "$OUT"
echo "Repo: $(pwd)" >> "$OUT"
echo "" >> "$OUT"

section "1. Rutas Express"
grep -Rni "app.use(" apps/api/src >> "$OUT" || true

section "2. Orders Router"
cat apps/api/src/routes/orders.ts >> "$OUT" 2>/dev/null || true

section "3. Orders Controller"
cat apps/api/src/controllers/orders.ts >> "$OUT" 2>/dev/null || true

section "4. Requests Controller"
cat apps/api/src/controllers/requests.ts >> "$OUT" 2>/dev/null || true

section "5. Billing Controller"
cat apps/api/src/controllers/billing.ts >> "$OUT" 2>/dev/null || true

section "6. Billing Service"
cat apps/api/src/services/billing.ts >> "$OUT" 2>/dev/null || true

section "7. Tenant Billing"
cat apps/api/src/services/tenant-billing.ts >> "$OUT" 2>/dev/null || true

section "8. Public Controller"
cat apps/api/src/controllers/public.ts >> "$OUT" 2>/dev/null || true

section "9. Customers"
grep -Rni "from('customers')" apps/api/src >> "$OUT" || true

section "10. Organizations"
grep -Rni "organizations" apps/api/src supabase/migrations >> "$OUT" || true

section "11. Tenants"
grep -Rni "tenants" apps/api/src supabase/migrations >> "$OUT" || true

section "12. Evidence Metadata"
grep -Rni "evidence_metadata" apps/api/src apps/web-* supabase/migrations >> "$OUT" || true

section "13. Service Order Events"
grep -Rni "service_order_events" apps/api/src supabase/migrations >> "$OUT" || true

section "14. Service Order Status History"
grep -Rni "service_order_status_history" apps/api/src supabase/migrations >> "$OUT" || true

section "15. Service Order Documents"
grep -Rni "service_order_documents" apps/api/src supabase/migrations >> "$OUT" || true

section "16. Foreign Keys"
grep -Rni "references public." supabase/migrations >> "$OUT" || true

section "17. Tenant Isolation"
grep -Rni "tenant_id" apps/api/src >> "$OUT" || true

section "18. Sucursal Isolation"
grep -Rni "sucursal_id" apps/api/src >> "$OUT" || true

section "19. Legacy References"
grep -RniE "branch_id|organization_id|total_cost" apps/api/src supabase/migrations >> "$OUT" || true

section "20. Runtime Tables"
grep -RniE "\.from\('" apps/api/src >> "$OUT" || true

echo ""
echo "===================================================" >> "$OUT"
echo "FIN AUDITORIA" >> "$OUT"
echo "===================================================" >> "$OUT"

echo ""
echo "Generado:"
echo "$OUT"

open "$OUT"
