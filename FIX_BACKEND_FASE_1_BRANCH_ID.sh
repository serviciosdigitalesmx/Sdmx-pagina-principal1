#!/bin/bash
set -e

FILE="apps/api/src/controllers/users.ts"
BACKUP="apps/api/src/controllers/users.ts.bak.$(date +%Y%m%d_%H%M%S)"

echo "Respaldando $FILE -> $BACKUP"
cp "$FILE" "$BACKUP"

python3 <<'PY'
from pathlib import Path

p = Path("apps/api/src/controllers/users.ts")
text = p.read_text()

replacements = {
    "sucursalId: row.sucursal_id ?? row.branch_id ?? null,": "sucursalId: row.sucursal_id ?? null,",
    "sucursal_id, branch_id, created_at, updated_at": "sucursal_id, created_at, updated_at",
    "branch_id: body.sucursalId ?? null,\n": "",
}

for old, new in replacements.items():
    text = text.replace(old, new)

p.write_text(text)
PY

echo ""
echo "Validando branch_id en backend productivo..."
if grep -Rni "branch_id" apps/api/src; then
  echo ""
  echo "Aún quedan referencias branch_id en apps/api/src. Revisar salida anterior."
  exit 1
fi

echo ""
echo "Validando typecheck backend..."
pnpm --filter @white-label/api typecheck

echo ""
echo "Validando build backend..."
pnpm --filter @white-label/api build

echo ""
echo "OK: Fase 1 aplicada. branch_id eliminado del backend productivo."
