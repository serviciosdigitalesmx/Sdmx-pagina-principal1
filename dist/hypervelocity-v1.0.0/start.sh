#!/usr/bin/env bash
set -euo pipefail

TARGET_REPO="${1:-${HYPERVELOCITY_REPO:-}}"
GOAL="${2:-Reparar el repositorio usando exclusivamente el mapa A.SPEC existente}"
if [[ -z "$TARGET_REPO" ]]; then
  printf 'Uso: %s /ruta/al/repositorio "objetivo"\n' "$0" >&2
  exit 2
fi
TARGET_REPO="$(cd "$TARGET_REPO" && pwd)"
CONTROL_DIR="${HYPERVELOCITY_CONTROL_DIR:-.hypervelocity}"
SUPERVISOR="$TARGET_REPO/$CONTROL_DIR/SUPERVISOR/hypervelocity_supervisor.py"
export HYPERVELOCITY_REPO="$TARGET_REPO"
export HYPERVELOCITY_CONTROL_DIR="$CONTROL_DIR"
exec python3 "$SUPERVISOR" start "$GOAL"
