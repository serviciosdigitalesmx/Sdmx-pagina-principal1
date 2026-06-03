#!/bin/bash
set -e

echo "========== EVIDENCE_METADATA WRITES =========="
grep -Rni "appendEvidenceEntry(" apps/api/src/controllers/orders.ts

echo ""
echo "========== EVIDENCE_METADATA READS =========="
grep -Rni "readEvidenceMetadata(" apps/api/src/controllers/orders.ts

echo ""
echo "========== PUBLIC CONSUMERS =========="
grep -Rni "evidence_metadata" apps/api/src/controllers/public.ts

echo ""
echo "========== DOCUMENTS =========="
grep -Rni "service_order_documents" apps/api/src/controllers/orders.ts

echo ""
echo "========== EVENTS =========="
grep -Rni "service_order_events" apps/api/src/controllers/orders.ts

echo ""
echo "LISTO"
