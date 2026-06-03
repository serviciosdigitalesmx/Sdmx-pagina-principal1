#!/bin/bash
set -e

FILE="apps/api/src/controllers/orders.ts"
BACKUP="${FILE}.bak.$(date +%Y%m%d_%H%M%S)"

cp "$FILE" "$BACKUP"

python3 <<'PY'
from pathlib import Path
import re

p = Path("apps/api/src/controllers/orders.ts")
text = p.read_text()

patterns = [

r"""
await\s+supabase
\s*\.from\('service_orders'\)
\s*\.update\(\{
\s*evidence_metadata:\s*appendEvidenceEntry\(
.*?
\)
\s*\}\)
\s*\.eq\('tenant_id',\s*tenantId\)
\s*\.eq\('id',\s*data\.id\);
""",

r"""
await\s+supabase
\s*\.from\('service_orders'\)
\s*\.update\(\{
\s*evidence_metadata:\s*appendEvidenceEntry\(
.*?
\)
\s*\}\)
\s*\.eq\('tenant_id',\s*tenantId\)
\s*\.eq\('id',\s*orderId\);
""",

]

for pattern in patterns:
    text = re.sub(
        pattern,
        "// evidence_metadata write removed - migrated to service_order_events/service_order_documents",
        text,
        flags=re.S | re.X
    )

p.write_text(text)

print("OK")
PY

echo ""
echo "Verificando escrituras restantes..."
grep -n "appendEvidenceEntry(" apps/api/src/controllers/orders.ts || true

echo ""
echo "Typecheck..."
pnpm --filter @white-label/api typecheck

echo ""
echo "Build..."
pnpm --filter @white-label/api build

echo ""
echo "OK - FASE 6A aplicada"
