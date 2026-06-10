#!/usr/bin/env bash
set -euo pipefail

OUT="fixi-tenant-hotspots-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUT"

grep -R "tenant_id" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
| cut -d: -f1 \
| sort \
| uniq -c \
| sort -nr \
> "$OUT/tenant-id-hotspots.txt"

grep -R "tenantSlug" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
| cut -d: -f1 \
| sort \
| uniq -c \
| sort -nr \
> "$OUT/tenant-slug-hotspots.txt"

grep -R "Sucursal" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
| cut -d: -f1 \
| sort \
| uniq -c \
| sort -nr \
> "$OUT/sucursal-hotspots.txt"

echo "OUTPUT=$OUT"
