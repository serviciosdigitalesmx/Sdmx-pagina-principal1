#!/usr/bin/env bash
set -euo pipefail

OUT="fixi-dependency-graph-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUT"

echo "Analizando dependencias..."

find apps packages \
-type f \
\( -name "*.ts" -o -name "*.tsx" \) \
-not -path "*/node_modules/*" \
-not -path "*/.next/*" \
> "$OUT/files.txt"

while read -r FILE
do
  echo "FILE: $FILE" >> "$OUT/imports.txt"

  grep "^import " "$FILE" \
  >> "$OUT/imports.txt" || true

  echo >> "$OUT/imports.txt"

done < "$OUT/files.txt"

echo
echo "OUTPUT=$OUT"
