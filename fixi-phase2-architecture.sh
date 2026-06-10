#!/usr/bin/env bash
set -euo pipefail

OUT="fixi-phase2-architecture-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUT"

echo "INTERFACES"

grep -R "interface " apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/interfaces.txt" || true

echo "TYPES"

grep -R "^type " apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/types.txt" || true

echo "ZOD"

grep -R "z.object" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/zod.txt" || true

echo "DTO"

grep -R "DTO" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/dto.txt" || true

echo "SERVICES"

find apps packages \
-name "*service*.ts" \
-not -path "*/node_modules/*" \
-not -path "*/.next/*" \
> "$OUT/services.txt"

echo "PROVIDERS"

find apps packages \
-name "*provider*.ts*" \
-not -path "*/node_modules/*" \
-not -path "*/.next/*" \
> "$OUT/providers.txt"

echo "HOOKS"

find apps packages \
-name "use-*.ts*" \
-not -path "*/node_modules/*" \
-not -path "*/.next/*" \
> "$OUT/hooks.txt"

echo
echo "OUTPUT=$OUT"
