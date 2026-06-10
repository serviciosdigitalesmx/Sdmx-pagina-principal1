#!/usr/bin/env bash
set -euo pipefail

OUT="fixi-normalization-$(date +%Y%m%d-%H%M%S)"

mkdir -p "$OUT"

echo "=================================================="
echo "FIXI NORMALIZATION AUDIT"
echo "=================================================="

echo
echo "[1/15] PROCESS.ENV"

grep -R "process.env" \
apps packages \
--include="*.ts" \
--include="*.tsx" \
> "$OUT/process-env.txt" || true

echo
echo "[2/15] HARDCODED URLS"

grep -R "http://" apps packages \
> "$OUT/http-urls.txt" || true

grep -R "https://" apps packages \
> "$OUT/https-urls.txt" || true

echo
echo "[3/15] HARDCODED DOMAINS"

grep -R "serviciosdigitalesmx.online" \
apps packages \
> "$OUT/domains.txt" || true

grep -R "onrender.com" \
apps packages \
> "$OUT/render.txt" || true

grep -R "vercel.app" \
apps packages \
> "$OUT/vercel.txt" || true

echo
echo "[4/15] API RESOLUTION"

grep -R "resolveApiBaseUrl" \
apps packages \
> "$OUT/api-resolvers.txt" || true

grep -R "API_URL" \
apps packages \
> "$OUT/api-url.txt" || true

grep -R "NEXT_PUBLIC_API_URL" \
apps packages \
> "$OUT/next-public-api-url.txt" || true

echo
echo "[5/15] SUPABASE"

grep -R "createClient" \
apps packages \
> "$OUT/create-client.txt" || true

grep -R "supabase" \
apps packages \
> "$OUT/supabase.txt" || true

echo
echo "[6/15] AUTH"

grep -R "localStorage" \
apps packages \
> "$OUT/local-storage.txt" || true

grep -R "sessionStorage" \
apps packages \
> "$OUT/session-storage.txt" || true

grep -R "accessToken" \
apps packages \
> "$OUT/access-token.txt" || true

grep -R "refreshToken" \
apps packages \
> "$OUT/refresh-token.txt" || true

echo
echo "[7/15] TENANTS"

grep -R "tenantSlug" \
apps packages \
> "$OUT/tenant-slug.txt" || true

grep -R "tenant_id" \
apps packages \
> "$OUT/tenant-id.txt" || true

grep -R "branch_id" \
apps packages \
> "$OUT/branch-id.txt" || true

grep -R "TenantIdentity" \
apps packages \
> "$OUT/tenant-identity.txt" || true

echo
echo "[8/15] BRANDING"

grep -R "sr fix" \
apps packages \
> "$OUT/srfix.txt" || true

grep -R "fixi" \
apps packages \
> "$OUT/fixi.txt" || true

grep -R "demo" \
apps packages \
> "$OUT/demo.txt" || true

grep -R "qa" \
apps packages \
> "$OUT/qa.txt" || true

echo
echo "[9/15] CUSTOMERS"

grep -R "customer_name" \
apps packages \
> "$OUT/customer-name.txt" || true

grep -R "customer_id" \
apps packages \
> "$OUT/customer-id.txt" || true

echo
echo "[10/15] INVENTORY"

grep -R "inventory" \
apps packages \
> "$OUT/inventory.txt" || true

echo
echo "[11/15] FINANCE"

grep -R "financial" \
apps packages \
> "$OUT/finance.txt" || true

echo
echo "[12/15] PURCHASES"

grep -R "purchase" \
apps packages \
> "$OUT/purchases.txt" || true

echo
echo "[13/15] TASKS"

grep -R "task" \
apps packages \
> "$OUT/tasks.txt" || true

echo
echo "[14/15] SERVICES"

find apps packages \
-name "*service*" \
> "$OUT/services.txt"

echo
echo "[15/15] DUPLICATE CONFIG"

find . \
-name ".env*" \
> "$OUT/env-files.txt"

find . \
-name "vercel.json" \
> "$OUT/vercel-files.txt"

find . \
-name "next.config.*" \
> "$OUT/next-configs.txt"

echo
echo "=================================================="
echo "RESULTADO"
echo "=================================================="

find "$OUT" -type f | sort

echo
echo "OUTPUT:"
echo "$OUT"

