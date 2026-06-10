#!/usr/bin/env bash
set -euo pipefail

OUT="fixi-contract-hotspots-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUT"

grep -R "interface " apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
| sed 's/^.*interface /interface /' \
| cut -d'{' -f1 \
| sort \
| uniq -c \
| sort -nr \
> "$OUT/interfaces-ranked.txt"

grep -R "^type " apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
| sed 's/^.*type /type /' \
| cut -d'=' -f1 \
| sort \
| uniq -c \
| sort -nr \
> "$OUT/types-ranked.txt"

echo "OUTPUT=$OUT"
