#!/bin/bash

OUT="AUDIT_FINAL_DEUDA_TECNICA.md"
rm -f "$OUT"

echo "# AUDITORIA FINAL DE DEUDA TECNICA" >> "$OUT"
echo "Fecha: $(date)" >> "$OUT"
echo "" >> "$OUT"

########################################
# ORGANIZATIONS
########################################

echo "# ORGANIZATIONS" >> "$OUT"
echo "" >> "$OUT"

ORG_CODE=$(grep -R "\borganizations\b" apps/api/src apps/web-admin/src apps/web-public/src apps/web-clientes/src 2>/dev/null | wc -l | tr -d ' ')
ORG_QUERY=$(grep -R "from('organizations')" apps 2>/dev/null | wc -l | tr -d ' ')
ORG_FK=$(grep -R "references public.organizations(id)" supabase/migrations 2>/dev/null | wc -l | tr -d ' ')

echo "Uso en código: $ORG_CODE" >> "$OUT"
echo "Queries organizations: $ORG_QUERY" >> "$OUT"
echo "FK organizations: $ORG_FK" >> "$OUT"

echo "" >> "$OUT"
echo "TOP ORGANIZATIONS" >> "$OUT"
grep -Rni "\borganizations\b" apps/api/src supabase/migrations 2>/dev/null | head -50 >> "$OUT"

echo "" >> "$OUT"
echo "==================================================" >> "$OUT"
echo "" >> "$OUT"

########################################
# TOTAL COST
########################################

echo "# TOTAL_COST" >> "$OUT"
echo "" >> "$OUT"

TOTAL_COST=$(grep -R "total_cost" apps/api/src supabase/migrations 2>/dev/null | wc -l | tr -d ' ')
EST_COST=$(grep -R "estimated_cost" apps/api/src supabase/migrations 2>/dev/null | wc -l | tr -d ' ')
FINAL_COST=$(grep -R "final_cost" apps/api/src supabase/migrations 2>/dev/null | wc -l | tr -d ' ')

echo "total_cost: $TOTAL_COST" >> "$OUT"
echo "estimated_cost: $EST_COST" >> "$OUT"
echo "final_cost: $FINAL_COST" >> "$OUT"

echo "" >> "$OUT"
echo "USOS TOTAL_COST" >> "$OUT"
grep -Rni "total_cost" apps/api/src supabase/migrations 2>/dev/null | head -100 >> "$OUT"

echo "" >> "$OUT"
echo "USOS ESTIMATED_COST" >> "$OUT"
grep -Rni "estimated_cost" apps/api/src supabase/migrations 2>/dev/null | head -100 >> "$OUT"

echo "" >> "$OUT"
echo "USOS FINAL_COST" >> "$OUT"
grep -Rni "final_cost" apps/api/src supabase/migrations 2>/dev/null | head -100 >> "$OUT"

echo "" >> "$OUT"
echo "==================================================" >> "$OUT"
echo "" >> "$OUT"

########################################
# BRANCH
########################################

echo "# BRANCH_ID" >> "$OUT"
echo "" >> "$OUT"

BRANCH_CODE=$(grep -R "branch_id" apps/api/src 2>/dev/null | wc -l | tr -d ' ')
SUCURSAL_CODE=$(grep -R "sucursal_id" apps/api/src 2>/dev/null | wc -l | tr -d ' ')

echo "branch_id backend: $BRANCH_CODE" >> "$OUT"
echo "sucursal_id backend: $SUCURSAL_CODE" >> "$OUT"

echo "" >> "$OUT"
echo "TOP BRANCH_ID" >> "$OUT"
grep -Rni "branch_id" apps/api/src supabase/migrations 2>/dev/null | head -100 >> "$OUT"

echo "" >> "$OUT"
echo "==================================================" >> "$OUT"
echo "" >> "$OUT"

########################################
# BACKUPS BASURA
########################################

echo "# ARCHIVOS TEMPORALES" >> "$OUT"
echo "" >> "$OUT"

find apps -name "*.bak*" -type f >> "$OUT" 2>/dev/null || true
find apps -name "*.pre_*" -type f >> "$OUT" 2>/dev/null || true

echo "" >> "$OUT"
echo "==================================================" >> "$OUT"
echo "" >> "$OUT"

########################################
# RESUMEN
########################################

echo "# RESUMEN EJECUTIVO" >> "$OUT"
echo "" >> "$OUT"

if [ "$ORG_CODE" -lt 10 ]; then
  echo "organizations: POSIBLE DEUDA TECNICA" >> "$OUT"
else
  echo "organizations: SIGUE ACTIVO" >> "$OUT"
fi

if [ "$TOTAL_COST" -eq 0 ]; then
  echo "total_cost: ELIMINADO" >> "$OUT"
else
  echo "total_cost: REQUIERE REVISION" >> "$OUT"
fi

if [ "$BRANCH_CODE" -lt 20 ]; then
  echo "branch_id: CASI ELIMINADO" >> "$OUT"
else
  echo "branch_id: AUN VIVO" >> "$OUT"
fi

echo "" >> "$OUT"
echo "FIN" >> "$OUT"

pbcopy < "$OUT"

echo ""
echo "======================================="
echo "REPORTE GENERADO"
echo "$OUT"
echo "COPIADO AL PORTAPAPELES"
echo "======================================="
