#!/usr/bin/env bash
set -euo pipefail

TARGET_REPO="${1:-${HYPERVELOCITY_REPO:-}}"
if [[ -z "$TARGET_REPO" ]]; then
  printf 'Uso: %s /ruta/al/repositorio\n' "$0" >&2
  exit 2
fi
TARGET_REPO="$(cd "$TARGET_REPO" && pwd)"
CONTROL_DIR="${HYPERVELOCITY_CONTROL_DIR:-.hypervelocity}"
SUPERVISOR="$TARGET_REPO/$CONTROL_DIR/SUPERVISOR/hypervelocity_supervisor.py"

if [[ ! -f "$SUPERVISOR" ]]; then
  printf 'No existe el supervisor instalado: %s\n' "$SUPERVISOR" >&2
  exit 3
fi

export HYPERVELOCITY_REPO="$TARGET_REPO"
export HYPERVELOCITY_CONTROL_DIR="$CONTROL_DIR"
export PYTHONDONTWRITEBYTECODE=1

python3 -m py_compile "$SUPERVISOR" "$TARGET_REPO/$CONTROL_DIR/SUPERVISOR/gemini_api_worker.py"
python3 "$SUPERVISOR" status
git -C "$TARGET_REPO" status --short --branch
printf 'Doctor PASS: sintaxis Python, control plane y estado Git verificados.\n'
