#!/usr/bin/env bash
set -euo pipefail

OUT="fixi-identity-trace-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUT"

FILES=(
"apps/web-admin/src/providers/TenantIdentityProvider.tsx"
"apps/web-admin/src/lib/scope.ts"
"apps/web-admin/src/lib/tenant.ts"
"apps/web-admin/src/lib/session.ts"
"apps/web-admin/src/components/guard/use-auth.ts"
"apps/api/src/middleware/auth.ts"
"apps/api/src/lib/resolve-scope.ts"
)

for FILE in "${FILES[@]}"
do
  if [ -f "$FILE" ]; then
    cp "$FILE" "$OUT/$(basename "$FILE").txt"
  fi
done

echo "OUTPUT=$OUT"
