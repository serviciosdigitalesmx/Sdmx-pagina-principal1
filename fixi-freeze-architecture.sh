#!/usr/bin/env bash
set -euo pipefail

OUT="fixi-freeze-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUT"

echo "Generando blueprint..."

cat > "$OUT/ARCHITECTURE.md" <<'DOC'
# FIXI ARCHITECTURE FREEZE

## Sistemas

web-public
web-clientes
web-admin
api

## Capas

Frontend
Backend
Database
Auth
Deploy

## Objetivo

Una sola fuente de verdad para:

- Auth
- Tenant
- Branch
- API
- Supabase
- Config
- Deploy
DOC

grep -R "process.env" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/env-usage.txt" || true

grep -R "createClient" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/supabase-clients.txt" || true

grep -R "tenantSlug" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/tenant-slugs.txt" || true

grep -R "tenant_id" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/tenant-ids.txt" || true

grep -R "branch_id" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/branch-ids.txt" || true

grep -R "resolveApiBaseUrl" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/api-resolvers.txt" || true

find . -name "vercel.json" \
-not -path "*/node_modules/*" \
-not -path "*/.next/*" \
> "$OUT/vercel-files.txt"

find . -path "*/.vercel/project.json" \
-not -path "*/node_modules/*" \
-not -path "*/.next/*" \
> "$OUT/vercel-projects.txt"

echo
echo "OUTPUT=$OUT"
