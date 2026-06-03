#!/bin/bash
set -e

TS="$(date +%Y%m%d_%H%M%S)"
BACKUP_DIR="backups/fix-costos-final-cost-$TS"
mkdir -p "$BACKUP_DIR"

FILES=(
  "apps/api/src/controllers/finance.ts"
  "apps/api/src/controllers/reports.ts"
  "apps/api/src/controllers/public.ts"
  "apps/web-admin/src/components/dashboard/operational-hub.tsx"
  "apps/web-public/src/app/t/[tenantSlug]/portal/page.tsx"
  "apps/web-public/src/components/public-portal-lookup.tsx"
  "apps/web-clientes/src/lib/types.ts"
)

echo "Respaldando archivos..."
for f in "${FILES[@]}"; do
  if [ -f "$f" ]; then
    mkdir -p "$BACKUP_DIR/$(dirname "$f")"
    cp "$f" "$BACKUP_DIR/$f"
  fi
done

python3 <<'PY'
from pathlib import Path

def replace(path, replacements):
    p = Path(path)
    if not p.exists():
        print(f"SKIP missing {path}")
        return
    text = p.read_text()
    original = text
    for old, new in replacements:
        text = text.replace(old, new)
    if text != original:
        p.write_text(text)
        print(f"UPDATED {path}")
    else:
        print(f"NOCHANGE {path}")

replace("apps/api/src/controllers/finance.ts", [
    (
        "function resolveOrderIncome(order: { total_cost?: number | null; final_cost?: number | null }) {\n  return Number(order.total_cost ?? order.final_cost ?? 0);\n}",
        "function resolveOrderIncome(order: { final_cost?: number | null }) {\n  return Number(order.final_cost ?? 0);\n}"
    ),
    (
        ".select('id, tenant_id, sucursal_id, total_cost, final_cost, created_at, status')",
        ".select('id, tenant_id, sucursal_id, final_cost, created_at, status')"
    ),
    (
        "resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null })",
        "resolveOrderIncome(order as { final_cost?: number | null })"
    ),
])

replace("apps/api/src/controllers/reports.ts", [
    (
        ".select('id, status, created_at, total_cost, final_cost, sucursal_id, promised_date, folio')",
        ".select('id, status, created_at, final_cost, sucursal_id, promised_date, folio')"
    ),
    (
        "(sum, order) => sum + Number((order as { total_cost?: number | null; final_cost?: number | null }).total_cost ?? (order as { total_cost?: number | null; final_cost?: number | null }).final_cost ?? 0)",
        "(sum, order) => sum + Number((order as { final_cost?: number | null }).final_cost ?? 0)"
    ),
])

replace("apps/api/src/controllers/public.ts", [
    (
        ".select('id, tenant_id, folio, status, total_cost, created_at, device_info, problem_description, serial_number, receipt_url, estimated_cost, final_cost, metadata')",
        ".select('id, tenant_id, folio, status, created_at, device_info, problem_description, serial_number, receipt_url, estimated_cost, final_cost, metadata')"
    ),
    (
        ".select('id, tenant_id, folio, status, total_cost, created_at, updated_at, promised_date, device_info, problem_description, serial_number, receipt_url, estimated_cost, final_cost, evidence_metadata, metadata')",
        ".select('id, tenant_id, folio, status, created_at, updated_at, promised_date, device_info, problem_description, serial_number, receipt_url, estimated_cost, final_cost, evidence_metadata, metadata')"
    ),
])

replace("apps/web-admin/src/components/dashboard/operational-hub.tsx", [
    ("total_cost?: number;", "final_cost?: number;"),
    ("formatMoney(order.total_cost)", "formatMoney(order.final_cost)"),
])

replace("apps/web-public/src/app/t/[tenantSlug]/portal/page.tsx", [
    ("total_cost?: number | null;", "final_cost?: number | null;"),
    ("order.total_cost", "order.final_cost"),
])

replace("apps/web-public/src/components/public-portal-lookup.tsx", [
    ("total_cost?: number | null;", "final_cost?: number | null;"),
    ("result.order.total_cost", "result.order.final_cost"),
])

replace("apps/web-clientes/src/lib/types.ts", [
    ("total_cost?: number | null;", "final_cost?: number | null;"),
])
PY

echo ""
echo "Validando referencias reales a total_cost en código fuente..."
grep -Rni \
  --exclude-dir=.next \
  --exclude-dir=node_modules \
  --exclude-dir=dist \
  --exclude-dir=build \
  --exclude-dir=.git \
  --exclude="*.bak*" \
  "total_cost" apps/api/src apps/web-admin/src apps/web-public/src apps/web-clientes/src || true

echo ""
echo "Typecheck API..."
pnpm --filter @white-label/api typecheck

echo ""
echo "Build API..."
pnpm --filter @white-label/api build

echo ""
echo "Typecheck web-admin si existe..."
pnpm --filter web-admin typecheck || true

echo ""
echo "Backup en: $BACKUP_DIR"
echo "OK: consumidores principales migrados a final_cost."
