#!/bin/bash

OUT="AUDIT_TENANTS_ORGANIZATIONS_RELATION.md"
rm -f "$OUT"

echo "# RELACION TENANTS / ORGANIZATIONS" >> "$OUT"
echo "" >> "$OUT"

echo "## CREATE TABLE TENANTS" >> "$OUT"
grep -Rni "create table.*tenants" supabase/migrations >> "$OUT" || true

echo "" >> "$OUT"
echo "## CREATE TABLE ORGANIZATIONS" >> "$OUT"
grep -Rni "create table.*organizations" supabase/migrations >> "$OUT" || true

echo "" >> "$OUT"
echo "## FOREIGN KEYS HACIA TENANTS" >> "$OUT"
grep -Rni "references public.tenants" supabase/migrations >> "$OUT" || true

echo "" >> "$OUT"
echo "## FOREIGN KEYS HACIA ORGANIZATIONS" >> "$OUT"
grep -Rni "references public.organizations" supabase/migrations >> "$OUT" || true

echo "" >> "$OUT"
echo "## COLUMNAS organization_id" >> "$OUT"
grep -Rni "organization_id" supabase/migrations apps/api/src >> "$OUT" || true

echo "" >> "$OUT"
echo "## COLUMNAS tenant_id" >> "$OUT"
grep -Rni "tenant_id" supabase/migrations apps/api/src >> "$OUT" || true

echo "" >> "$OUT"

echo "Listo"
