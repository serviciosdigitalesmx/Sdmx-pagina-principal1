#!/bin/bash

OUT="SOURCE_OF_TRUTH_REPORT.md"
rm -f "$OUT"

TENANTS_FK=$(grep -R "references public.tenants(id)" supabase/migrations 2>/dev/null | wc -l | tr -d ' ')
ORGS_FK=$(grep -R "references public.organizations(id)" supabase/migrations 2>/dev/null | wc -l | tr -d ' ')

TENANTS_BACKEND=$(grep -R "\btenants\b" apps/api/src 2>/dev/null | wc -l | tr -d ' ')
ORGS_BACKEND=$(grep -R "\borganizations\b" apps/api/src 2>/dev/null | wc -l | tr -d ' ')

TENANT_JWT=$(grep -R "tenant_id" supabase/migrations apps/api/src 2>/dev/null | wc -l | tr -d ' ')
ORG_ID=$(grep -R "organization_id" supabase/migrations apps/api/src 2>/dev/null | wc -l | tr -d ' ')

TENANT_ONBOARD=$(grep -R "from('tenants')" apps/api/src apps/web-* 2>/dev/null | wc -l | tr -d ' ')
ORG_ONBOARD=$(grep -R "from('organizations')" apps/api/src apps/web-* 2>/dev/null | wc -l | tr -d ' ')

{
echo "# SOURCE OF TRUTH REPORT"
echo ""
echo "## FOREIGN KEYS"
echo "TENANTS FK: $TENANTS_FK"
echo "ORGANIZATIONS FK: $ORGS_FK"
echo ""
echo "## BACKEND REFERENCES"
echo "TENANTS: $TENANTS_BACKEND"
echo "ORGANIZATIONS: $ORGS_BACKEND"
echo ""
echo "## SECURITY / JWT"
echo "tenant_id references: $TENANT_JWT"
echo "organization_id references: $ORG_ID"
echo ""
echo "## QUERIES"
echo "from('tenants'): $TENANT_ONBOARD"
echo "from('organizations'): $ORG_ONBOARD"
echo ""

TENANTS_SCORE=$((TENANTS_FK + TENANTS_BACKEND + TENANT_JWT + TENANT_ONBOARD))
ORGS_SCORE=$((ORGS_FK + ORGS_BACKEND + ORG_ID + ORG_ONBOARD))

echo "## SCORE"
echo "TENANTS SCORE = $TENANTS_SCORE"
echo "ORGANIZATIONS SCORE = $ORGS_SCORE"
echo ""

if [ "$TENANTS_SCORE" -gt "$ORGS_SCORE" ]; then
  echo "### CANDIDATO FUENTE DE VERDAD"
  echo "TENANTS"
elif [ "$ORGS_SCORE" -gt "$TENANTS_SCORE" ]; then
  echo "### CANDIDATO FUENTE DE VERDAD"
  echo "ORGANIZATIONS"
else
  echo "### EMPATE"
fi

echo ""
echo "## TOP 50 USOS TENANTS"
grep -Rni "\btenants\b" apps/api/src supabase/migrations 2>/dev/null | head -50

echo ""
echo "## TOP 50 USOS ORGANIZATIONS"
grep -Rni "\borganizations\b" apps/api/src supabase/migrations 2>/dev/null | head -50

} >> "$OUT"

pbcopy < "$OUT"

echo "Reporte generado: $OUT"
echo "Copiado al portapapeles"
