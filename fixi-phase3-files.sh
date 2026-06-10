#!/usr/bin/env bash
set -euo pipefail

OUT="fixi-phase3-files-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUT"

grep -Rl "getStoredTenant" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/getStoredTenant-files.txt" || true

grep -Rl "getStoredUser" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/getStoredUser-files.txt" || true

grep -Rl "getCurrentSession" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/getCurrentSession-files.txt" || true

grep -Rl "getActiveScope" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/getActiveScope-files.txt" || true

grep -Rl "TenantIdentity" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/tenantIdentity-files.txt" || true

grep -Rl "useAuth()" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/useAuth-files.txt" || true

echo "OUTPUT=$OUT"
