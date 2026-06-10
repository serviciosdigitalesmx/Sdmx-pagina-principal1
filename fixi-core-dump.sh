#!/usr/bin/env bash
set -euo pipefail

OUT="fixi-core-dump-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUT"

cp apps/web-admin/src/providers/TenantIdentityProvider.tsx \
"$OUT/" 2>/dev/null || true

cp apps/web-admin/src/lib/session.ts \
"$OUT/" 2>/dev/null || true

cp apps/web-admin/src/lib/tenant.ts \
"$OUT/" 2>/dev/null || true

cp apps/web-admin/src/lib/auth.ts \
"$OUT/" 2>/dev/null || true

cp apps/web-admin/src/lib/scope.ts \
"$OUT/" 2>/dev/null || true

cp apps/web-admin/src/components/guard/use-auth.ts \
"$OUT/" 2>/dev/null || true

cp apps/web-admin/src/services/fixService.ts \
"$OUT/" 2>/dev/null || true

echo "OUTPUT=$OUT"

echo
ls -lah "$OUT"
