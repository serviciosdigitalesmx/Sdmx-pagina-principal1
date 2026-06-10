#!/usr/bin/env bash
set -euo pipefail

OUT="fixi-identity-violations-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUT"

grep -Rl "getCurrentSession(" apps/web-admin/src \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/current-session.txt" || true

grep -Rl "getStoredTenant(" apps/web-admin/src \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/stored-tenant.txt" || true

grep -Rl "getStoredUser(" apps/web-admin/src \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/stored-user.txt" || true

grep -Rl "localStorage.getItem" apps/web-admin/src \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/local-storage.txt" || true

grep -Rl "tenantId:" apps/web-admin/src \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/tenant-id.txt" || true

grep -Rl "tenantSlug:" apps/web-admin/src \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/tenant-slug.txt" || true

echo "OUTPUT=$OUT"
