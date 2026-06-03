#!/bin/bash
set -e

OUT="AUDIT_EVIDENCE_METADATA.md"
rm -f "$OUT"

echo "# AUDIT EVIDENCE_METADATA" >> "$OUT"
echo "" >> "$OUT"

echo "## ESCRITURAS" >> "$OUT"
grep -Rni "evidence_metadata.*=" apps/api/src >> "$OUT" || true
grep -Rni "evidence_metadata:" apps/api/src >> "$OUT" || true
grep -Rni "update({.*evidence_metadata" apps/api/src >> "$OUT" || true
grep -Rni "insert({.*evidence_metadata" apps/api/src >> "$OUT" || true

echo "" >> "$OUT"
echo "## TODAS LAS REFERENCIAS BACKEND" >> "$OUT"
grep -Rni "evidence_metadata" apps/api/src >> "$OUT" || true

echo "" >> "$OUT"
echo "## TODAS LAS REFERENCIAS FRONTEND" >> "$OUT"
grep -Rni "evidence_metadata" apps/web-admin/src apps/web-public/src apps/web-clientes/src >> "$OUT" || true

echo "" >> "$OUT"
echo "## DOCUMENTOS" >> "$OUT"
grep -Rni "service_order_documents" apps/api/src supabase/migrations >> "$OUT" || true

echo "" >> "$OUT"
echo "## EVENTS" >> "$OUT"
grep -Rni "service_order_events" apps/api/src supabase/migrations >> "$OUT" || true

echo ""
echo "Generado: $OUT"
