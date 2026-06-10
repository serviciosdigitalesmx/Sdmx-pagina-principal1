#!/usr/bin/env bash
set -euo pipefail

TMP_DIR="fixi-refactor-upload"

rm -rf "$TMP_DIR"
mkdir -p "$TMP_DIR"

cp apps/web-admin/src/providers/TenantIdentityProvider.tsx \
"$TMP_DIR/" 2>/dev/null || true

cp apps/web-admin/src/components/tenant/tenant-provider.tsx \
"$TMP_DIR/" 2>/dev/null || true

cp apps/web-admin/src/components/guard/use-auth.ts \
"$TMP_DIR/" 2>/dev/null || true

cp apps/web-admin/src/lib/auth.ts \
"$TMP_DIR/" 2>/dev/null || true

cp apps/web-admin/src/lib/session.ts \
"$TMP_DIR/" 2>/dev/null || true

cp apps/web-admin/src/lib/tenant.ts \
"$TMP_DIR/" 2>/dev/null || true

tar -czf "$HOME/Desktop/fixi-refactor-chatgpt.tar.gz" "$TMP_DIR"

rm -rf "$TMP_DIR"

echo
echo "======================================"
echo "ARCHIVO GENERADO"
echo "======================================"
echo
echo "$HOME/Desktop/fixi-refactor-chatgpt.tar.gz"
echo
echo "Subelo a ChatGPT"
echo
