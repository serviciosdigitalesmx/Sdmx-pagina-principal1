#!/usr/bin/env bash
set -euo pipefail

OUT="fixi-phase3-impact-map-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUT"

grep -R "getStoredTenant" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/getStoredTenant.txt" || true

grep -R "getStoredUser" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/getStoredUser.txt" || true

grep -R "getActiveScope" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/getActiveScope.txt" || true

grep -R "getCurrentSession" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/getCurrentSession.txt" || true

grep -R "useAuth()" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/useAuth.txt" || true

grep -R "TenantIdentity" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/tenantIdentity.txt" || true

echo
echo "OUTPUT=$OUT"
