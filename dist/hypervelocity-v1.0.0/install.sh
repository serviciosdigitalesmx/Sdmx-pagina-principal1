#!/usr/bin/env bash
set -euo pipefail

PACKAGE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_REPO="${1:-}"
FORCE="${2:-}"

if [[ -z "$TARGET_REPO" ]]; then
  printf 'Uso: %s /ruta/al/repositorio [--force]\n' "$0" >&2
  exit 2
fi

TARGET_REPO="$(cd "$TARGET_REPO" && pwd)"
CONTROL_DIR="${HYPERVELOCITY_CONTROL_DIR:-.hypervelocity}"
DEST="$TARGET_REPO/$CONTROL_DIR/SUPERVISOR"

if [[ -e "$DEST" && "$FORCE" != "--force" ]]; then
  printf 'El destino ya existe: %s\nUsa --force solo si quieres reemplazar el motor y la policy.\n' "$DEST" >&2
  exit 3
fi

mkdir -p "$DEST"
cp "$PACKAGE_DIR/hypervelocity/hypervelocity_supervisor.py" "$DEST/"
cp "$PACKAGE_DIR/hypervelocity/gemini_api_worker.py" "$DEST/"
cp "$PACKAGE_DIR/hypervelocity/policy.json" "$DEST/"
chmod 755 "$DEST/hypervelocity_supervisor.py" "$DEST/gemini_api_worker.py"

printf 'Hypervelocity v%s instalado en %s\n' "$(<"$PACKAGE_DIR/VERSION")" "$TARGET_REPO"
printf 'Control plane: %s\n' "$TARGET_REPO/$CONTROL_DIR"
printf 'Doctor: HYPERVELOCITY_REPO=%q %q/doctor.sh\n' "$TARGET_REPO" "$PACKAGE_DIR"
