#!/bin/bash
set -e

TS="$(date +%Y%m%d_%H%M%S)"
OUT_DIR="$HOME/Desktop/consolidados-$TS"
BACKEND_OUT="$OUT_DIR/BACKEND_CONSOLIDADO.md"
FRONTEND_OUT="$OUT_DIR/FRONTEND_CONSOLIDADO.md"
FULL_OUT="$OUT_DIR/PROYECTO_CONSOLIDADO_BACKEND_FRONTEND.md"

mkdir -p "$OUT_DIR"

write_file_block() {
  local output="$1"
  local file="$2"
  local lang=""

  case "$file" in
    *.ts) lang="ts" ;;
    *.tsx) lang="tsx" ;;
    *.js) lang="js" ;;
    *.jsx) lang="jsx" ;;
    *.json) lang="json" ;;
    *.sql) lang="sql" ;;
    *.yml|*.yaml) lang="yaml" ;;
    *.md) lang="md" ;;
    *.css) lang="css" ;;
    *.html) lang="html" ;;
    *.env|*.example) lang="bash" ;;
    *) lang="" ;;
  esac

  echo "" >> "$output"
  echo "---" >> "$output"
  echo "" >> "$output"
  echo "## $file" >> "$output"
  echo "" >> "$output"
  echo '```'"$lang" >> "$output"
  cat "$file" >> "$output"
  echo "" >> "$output"
  echo '```' >> "$output"
}

init_doc() {
  local output="$1"
  local title="$2"

  echo "# $title" > "$output"
  echo "" >> "$output"
  echo "Generado: $(date)" >> "$output"
  echo "Repo: $(pwd)" >> "$output"
  echo "" >> "$output"
  echo "## Notas" >> "$output"
  echo "" >> "$output"
  echo "- Consolidado para auditoría por IA." >> "$output"
  echo "- Excluye node_modules, .next, dist, build, .git, backups y archivos binarios." >> "$output"
  echo "- No incluye .env reales." >> "$output"
  echo "" >> "$output"
}

init_doc "$BACKEND_OUT" "BACKEND CONSOLIDADO - Fixi / Servicios Digitales MX"
init_doc "$FRONTEND_OUT" "FRONTEND CONSOLIDADO - Fixi / Servicios Digitales MX"

echo "Generando backend consolidado..."

BACKEND_FILES=$(find \
  apps/api/src \
  packages \
  supabase/migrations \
  scripts \
  -type f \
  \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.json" -o -name "*.sql" -o -name "*.md" -o -name "*.yml" -o -name "*.yaml" \) \
  ! -path "*/node_modules/*" \
  ! -path "*/.next/*" \
  ! -path "*/dist/*" \
  ! -path "*/build/*" \
  ! -path "*/coverage/*" \
  ! -path "*/.git/*" \
  ! -path "*/backups/*" \
  2>/dev/null | sort)

for file in $BACKEND_FILES; do
  write_file_block "$BACKEND_OUT" "$file"
done

for file in package.json pnpm-workspace.yaml render.yaml tsconfig.json .env.example; do
  if [ -f "$file" ]; then
    write_file_block "$BACKEND_OUT" "$file"
  fi
done

echo "Generando frontend consolidado..."

FRONTEND_FILES=$(find \
  apps/web-admin/src \
  apps/web-public/src \
  apps/web-clientes/src \
  -type f \
  \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.css" -o -name "*.md" \) \
  ! -path "*/node_modules/*" \
  ! -path "*/.next/*" \
  ! -path "*/dist/*" \
  ! -path "*/build/*" \
  ! -path "*/coverage/*" \
  ! -path "*/.git/*" \
  ! -path "*/backups/*" \
  2>/dev/null | sort)

for file in $FRONTEND_FILES; do
  write_file_block "$FRONTEND_OUT" "$file"
done

for file in \
  apps/web-admin/package.json apps/web-admin/next.config.* apps/web-admin/tsconfig.json \
  apps/web-public/package.json apps/web-public/next.config.* apps/web-public/tsconfig.json \
  apps/web-clientes/package.json apps/web-clientes/next.config.* apps/web-clientes/tsconfig.json \
  package.json pnpm-workspace.yaml tsconfig.json .env.example
do
  for resolved in $file; do
    if [ -f "$resolved" ]; then
      write_file_block "$FRONTEND_OUT" "$resolved"
    fi
  done
done

echo "Generando consolidado completo..."

cat "$BACKEND_OUT" > "$FULL_OUT"
echo "" >> "$FULL_OUT"
echo "" >> "$FULL_OUT"
echo "# FRONTEND" >> "$FULL_OUT"
cat "$FRONTEND_OUT" >> "$FULL_OUT"

echo ""
echo "Listo."
echo ""
ls -lh "$OUT_DIR"
echo ""
echo "Archivos generados:"
echo "- $BACKEND_OUT"
echo "- $FRONTEND_OUT"
echo "- $FULL_OUT"
echo ""
echo "Abriendo carpeta..."
open "$OUT_DIR"
