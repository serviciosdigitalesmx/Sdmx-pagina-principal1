#!/bin/bash
set -e

OUT="AUDIT_ORGANIZATIONS_TO_TENANTS.md"
rm -f "$OUT"

echo "# AUDIT ORGANIZATIONS -> TENANTS" >> "$OUT"
echo "" >> "$OUT"

echo "## ORGANIZATIONS" >> "$OUT"
grep -Rni "organizations" apps/api/src supabase/migrations >> "$OUT" || true

echo "" >> "$OUT"
echo "## TENANTS" >> "$OUT"
grep -Rni "tenants" apps/api/src supabase/migrations >> "$OUT" || true

echo "" >> "$OUT"
echo "## CREATE TENANT" >> "$OUT"
grep -RniE "create.*tenant|insert.*tenants|from\\('tenants'\\)" apps/api/src supabase/migrations >> "$OUT" || true

echo "" >> "$OUT"
echo "## CREATE ORGANIZATION" >> "$OUT"
grep -RniE "create.*organization|insert.*organizations|from\\('organizations'\\)" apps/api/src supabase/migrations >> "$OUT" || true

echo "" >> "$OUT"
echo "## MIGRATIONS" >> "$OUT"
find supabase/migrations -type f | sort >> "$OUT"

echo ""
echo "Generado: $OUT"
