#!/usr/bin/env bash
set -euo pipefail

OUT="fixi-architecture-audit-$(date +%Y%m%d-%H%M%S)"

mkdir -p "$OUT"

EXCLUDES=(
  --exclude-dir=node_modules
  --exclude-dir=.next
  --exclude-dir=dist
  --exclude-dir=build
  --exclude-dir=coverage
  --exclude-dir=.turbo
  --exclude-dir=.git
)

echo "APPS"
find apps \
-not -path "*/.next/*" \
-not -path "*/node_modules/*" \
-name package.json \
> "$OUT/apps.txt"

echo "PACKAGES"
find packages \
-not -path "*/node_modules/*" \
-name package.json \
> "$OUT/packages.txt"

echo "ROUTES"
find apps \
-not -path "*/.next/*" \
-path "*/src/app/*page.tsx" \
> "$OUT/routes.txt"

echo "ENV"
grep -R "${EXCLUDES[@]}" \
"process.env" \
apps packages \
> "$OUT/process-env.txt" || true

echo "SUPABASE"
grep -R "${EXCLUDES[@]}" \
"createClient" \
apps packages \
> "$OUT/create-client.txt" || true

echo "AUTH"
grep -R "${EXCLUDES[@]}" \
"auth/exchange" \
apps packages \
> "$OUT/auth-exchange.txt" || true

echo "TENANT SLUG"
grep -R "${EXCLUDES[@]}" \
"tenantSlug" \
apps packages \
> "$OUT/tenant-slug.txt" || true

echo "TENANT ID"
grep -R "${EXCLUDES[@]}" \
"tenant_id" \
apps packages \
> "$OUT/tenant-id.txt" || true

echo "BRANCH ID"
grep -R "${EXCLUDES[@]}" \
"branch_id" \
apps packages \
> "$OUT/branch-id.txt" || true

echo "API URL"
grep -R "${EXCLUDES[@]}" \
"NEXT_PUBLIC_API_URL" \
apps packages \
> "$OUT/api-url.txt" || true

echo "VERCEL"
find . \
-not -path "*/node_modules/*" \
-not -path "*/.next/*" \
-name vercel.json \
> "$OUT/vercel.txt"

echo
echo "OUTPUT=$OUT"
