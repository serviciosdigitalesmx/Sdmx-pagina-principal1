#!/usr/bin/env bash
set -euo pipefail

OUT="fixi-contract-audit-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUT"

grep -R "interface " apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/interfaces.txt" || true

grep -R "type " apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/types.txt" || true

grep -R "z.object" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/zod.txt" || true

echo
echo "OUTPUT=$OUT"
