#!/usr/bin/env bash
set -euo pipefail

OUT="fixi-tenant-contract-audit-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUT"

grep -R "interface TenantIdentity" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/interface.txt" || true

grep -R "TenantIdentity =" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/assignments.txt" || true

grep -R "TenantIdentityProvider" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/provider.txt" || true

grep -R "tenantId:" apps/web-admin/src \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/tenantId.txt" || true

grep -R "tenantSlug:" apps/web-admin/src \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/tenantSlug.txt" || true

grep -R "userRole:" apps/web-admin/src \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/userRole.txt" || true

grep -R "userEmail:" apps/web-admin/src \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/userEmail.txt" || true

echo "OUTPUT=$OUT"
