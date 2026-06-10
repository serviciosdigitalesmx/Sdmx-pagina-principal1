#!/usr/bin/env bash
set -euo pipefail

OUT="fixi-identity-contract-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUT"

sed -n '/interface TenantIdentity/,/}/p' \
apps/web-admin/src/domain/tenant/Identity.ts \
> "$OUT/tenant-identity.txt" || true

sed -n '/function getCurrentSession/,/^}/p' \
apps/web-admin/src/lib/session.ts \
> "$OUT/current-session.txt" || true

sed -n '/function getStoredTenant/,/^}/p' \
apps/web-admin/src/lib/tenant.ts \
> "$OUT/stored-tenant.txt" || true

sed -n '/function getStoredUser/,/^}/p' \
apps/web-admin/src/lib/tenant.ts \
> "$OUT/stored-user.txt" || true

sed -n '/export function useAuth/,/^}/p' \
apps/web-admin/src/components/guard/use-auth.ts \
> "$OUT/use-auth.txt" || true

echo "OUTPUT=$OUT"
