#!/usr/bin/env bash
set -euo pipefail

OUT="fixi-identity-dump-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUT"

cp apps/web-admin/src/domain/tenant/Identity.ts \
"$OUT/Identity.ts" 2>/dev/null || true

cp apps/web-admin/src/providers/TenantIdentityProvider.tsx \
"$OUT/TenantIdentityProvider.tsx" 2>/dev/null || true

cp apps/web-admin/src/lib/tenant.ts \
"$OUT/tenant.ts" 2>/dev/null || true

cp apps/web-admin/src/lib/auth.ts \
"$OUT/auth.ts" 2>/dev/null || true

cp apps/web-admin/src/lib/session.ts \
"$OUT/session.ts" 2>/dev/null || true

echo "OUTPUT=$OUT"
