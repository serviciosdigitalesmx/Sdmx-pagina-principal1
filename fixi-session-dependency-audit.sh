#!/usr/bin/env bash
set -euo pipefail

OUT="fixi-session-dependency-audit-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUT"

grep -Rl "useTenant()" apps/web-admin/src \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/useTenant.txt"

grep -Rl "getStoredTenant()" apps/web-admin/src \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/getStoredTenant.txt"

grep -Rl "getStoredUser()" apps/web-admin/src \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/getStoredUser.txt"

grep -Rl "getCurrentSession()" apps/web-admin/src \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/getCurrentSession.txt"

grep -Rl "useTenantIdentity()" apps/web-admin/src \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/useTenantIdentity.txt"

echo "OUTPUT=$OUT"
