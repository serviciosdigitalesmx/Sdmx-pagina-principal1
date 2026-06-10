#!/usr/bin/env bash
set -euo pipefail

OUT="fixi-tenant-map-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUT"

echo "TENANT SLUG"

grep -R "tenantSlug" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/tenant-slug.txt" || true

echo "TENANT ID"

grep -R "tenant_id" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/tenant-id.txt" || true

echo "TENANT NAME"

grep -R "tenantName" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/tenant-name.txt" || true

echo "BRANCH ID"

grep -R "branch_id" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/branch-id.txt" || true

echo "BRANCH NAME"

grep -R "branchName" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/branch-name.txt" || true

echo "HEADERS"

grep -R "Sucursal" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/header-sucursal.txt" || true

grep -R "tenant" apps/web-admin/src \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/admin-tenant.txt" || true

echo
echo "OUTPUT=$OUT"
