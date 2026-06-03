#!/bin/bash

OUT="AUDIT_ORGANIZATIONS_TENANTS.md"
rm -f "$OUT"

echo "# ORGANIZATIONS VS TENANTS" >> "$OUT"
echo "" >> "$OUT"

echo "## 1. Migraciones" >> "$OUT"
grep -RniE "create table.*organizations|create table.*tenants" supabase/migrations >> "$OUT" || true

echo "" >> "$OUT"
echo "## 2. Uso de organizations" >> "$OUT"
grep -Rni "\borganizations\b" apps/api apps/web-admin apps/web-public apps/web-clientes supabase/migrations >> "$OUT" || true

echo "" >> "$OUT"
echo "## 3. Uso de tenants" >> "$OUT"
grep -Rni "\btenants\b" apps/api apps/web-admin apps/web-public apps/web-clientes supabase/migrations >> "$OUT" || true

echo "" >> "$OUT"
echo "## 4. tenant_id en backend" >> "$OUT"
grep -Rni "tenant_id" apps/api/src/controllers apps/api/src/middleware apps/api/src/services >> "$OUT" || true

echo "" >> "$OUT"
echo "## 5. organization_id en backend" >> "$OUT"
grep -Rni "organization_id" apps/api/src/controllers apps/api/src/middleware apps/api/src/services >> "$OUT" || true

echo "" >> "$OUT"

echo "Listo: $OUT"
