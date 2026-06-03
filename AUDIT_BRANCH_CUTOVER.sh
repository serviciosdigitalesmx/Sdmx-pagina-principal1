#!/bin/bash

OUT="AUDIT_BRANCH_CUTOVER.md"
rm -f "$OUT"

echo "# BRANCH_ID VS SUCURSAL_ID" >> "$OUT"
echo "" >> "$OUT"

echo "## branch_id en backend" >> "$OUT"
grep -Rni "branch_id" apps/api/src >> "$OUT" || true

echo "" >> "$OUT"
echo "## sucursal_id en backend" >> "$OUT"
grep -Rni "sucursal_id" apps/api/src >> "$OUT" || true

echo "" >> "$OUT"
echo "## branch_id migraciones" >> "$OUT"
grep -Rni "branch_id" supabase/migrations >> "$OUT" || true

echo "" >> "$OUT"
echo "## sucursal_id migraciones" >> "$OUT"
grep -Rni "sucursal_id" supabase/migrations >> "$OUT" || true

echo "" >> "$OUT"
echo "## users" >> "$OUT"
grep -RniE "branch_id|sucursal_id" apps/api/src/controllers/users.ts apps/api/src/services 2>/dev/null >> "$OUT" || true

echo "" >> "$OUT"
echo "## orders" >> "$OUT"
grep -RniE "branch_id|sucursal_id" apps/api/src/controllers/orders.ts >> "$OUT" || true

echo "" >> "$OUT"
echo "## inventory" >> "$OUT"
grep -RniE "branch_id|sucursal_id" apps/api/src/controllers apps/api/src/services | grep -i inventory >> "$OUT" || true

pbcopy < "$OUT"

echo "LISTO"
