#!/usr/bin/env bash
set -euo pipefail

OUT="fixi-blueprint-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUT"

echo "[1] APPS"
find apps -name package.json > "$OUT/apps.txt"

echo "[2] ROUTES"
find apps -path "*/src/app/*page.tsx" > "$OUT/routes.txt"

echo "[3] ENV"
grep -R "process.env" apps packages \
> "$OUT/process-env.txt" || true

echo "[4] API"
grep -R "resolveApiBaseUrl" apps packages \
> "$OUT/api-resolvers.txt" || true

grep -R "NEXT_PUBLIC_API_URL" apps packages \
> "$OUT/api-url.txt" || true

echo "[5] AUTH"
grep -R "auth/exchange" apps packages \
> "$OUT/auth-exchange.txt" || true

echo "[6] TENANTS"
grep -R "tenantSlug" apps packages \
> "$OUT/tenant-slug.txt" || true

grep -R "tenant_id" apps packages \
> "$OUT/tenant-id.txt" || true

grep -R "branch_id" apps packages \
> "$OUT/branch-id.txt" || true

echo "[7] SUPABASE"
grep -R "createClient" apps packages \
> "$OUT/create-client.txt" || true

grep -R "SUPABASE" apps packages \
> "$OUT/supabase.txt" || true

echo "[8] DEPLOY"
find . -name "vercel.json" \
> "$OUT/vercel.txt"

find . -path "*/.vercel/project.json" \
> "$OUT/project-links.txt"

echo
echo "OUTPUT=$OUT"
