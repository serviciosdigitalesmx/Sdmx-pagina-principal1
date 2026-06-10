#!/usr/bin/env bash
set -euo pipefail

ROOT="$(pwd)"
OUT="fixi-audit-$(date +%Y%m%d-%H%M%S)"

mkdir -p "$OUT"

echo "=================================================="
echo "FIXI MASTER AUDIT"
echo "=================================================="

echo
echo "[1/12] APPS"
find apps -maxdepth 2 -name package.json \
> "$OUT/apps.txt"

echo
echo "[2/12] PACKAGES"
find packages -maxdepth 2 -name package.json \
> "$OUT/packages.txt"

echo
echo "[3/12] ROUTES"
find apps \
-path "*/src/app/*page.tsx" \
> "$OUT/routes.txt"

echo
echo "[4/12] API ROUTES"
find apps \
-path "*/src/app/api/*" \
> "$OUT/api-routes.txt"

echo
echo "[5/12] NEXT CONFIGS"
find . \
-name "next.config.*" \
> "$OUT/next-configs.txt"

echo
echo "[6/12] VERCEL CONFIGS"
find . \
-name "vercel.json" \
> "$OUT/vercel-configs.txt"

echo
echo "[7/12] PROJECT LINKS"
find . \
-path "*/.vercel/project.json" \
> "$OUT/vercel-projects.txt"

echo
echo "[8/12] ENV USAGE"

grep -R "process.env" \
apps packages \
> "$OUT/process-env.txt" || true

grep -R "NEXT_PUBLIC_" \
apps packages \
> "$OUT/next-public.txt" || true

grep -R "SUPABASE" \
apps packages \
> "$OUT/supabase.txt" || true

echo
echo "[9/12] API RESOLUTION"

grep -R "resolveApiBaseUrl" \
apps packages \
> "$OUT/api-resolvers.txt" || true

grep -R "NEXT_PUBLIC_API_URL" \
apps packages \
> "$OUT/api-url.txt" || true

grep -R "API_URL" \
apps packages \
> "$OUT/api-url-usage.txt" || true

echo
echo "[10/12] AUTH"

grep -R "auth/exchange" \
apps packages \
> "$OUT/auth-exchange.txt" || true

grep -R "accessToken" \
apps packages \
> "$OUT/access-token.txt" || true

grep -R "refreshToken" \
apps packages \
> "$OUT/refresh-token.txt" || true

echo
echo "[11/12] MULTITENANT"

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
echo "[12/12] HARDCODES"

grep -R "api.serviciosdigitalesmx.online" \
apps packages \
> "$OUT/hardcoded-api.txt" || true

grep -R "sdmx-backend-api.onrender.com" \
apps packages \
> "$OUT/hardcoded-render.txt" || true

grep -R "serviciosdigitalesmx.online" \
apps packages \
> "$OUT/hardcoded-domain.txt" || true

echo
echo "=================================================="
echo "RESUMEN"
echo "=================================================="

echo "OUTPUT:"
echo "$OUT"

echo
echo "ARCHIVOS:"
find "$OUT" -type f | sort

echo
echo "LISTO"
