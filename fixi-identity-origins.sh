#!/usr/bin/env bash
set -euo pipefail

OUT="fixi-identity-origins-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUT"

grep -R "getStoredTenant" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/getStoredTenant.txt" || true

grep -R "getStoredUser" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/getStoredUser.txt" || true

grep -R "getCurrentSession" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/getCurrentSession.txt" || true

grep -R "useTenantIdentity" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/useTenantIdentity.txt" || true

grep -R "useTenant(" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/useTenant.txt" || true

echo "OUTPUT=$OUT"
