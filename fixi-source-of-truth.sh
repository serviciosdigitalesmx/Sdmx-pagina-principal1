#!/usr/bin/env bash
set -euo pipefail

OUT="fixi-source-of-truth-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUT"

echo "AUTH"

grep -R "auth/exchange" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/auth-exchange.txt" || true

grep -R "getCurrentSession" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/current-session.txt" || true

grep -R "localStorage" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/local-storage.txt" || true

echo "TENANT"

grep -R "tenantSlug" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/tenant-slug.txt" || true

grep -R "tenant_id" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/tenant-id.txt" || true

grep -R "branch_id" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/branch-id.txt" || true

echo "API"

grep -R "NEXT_PUBLIC_API_URL" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/api-url.txt" || true

grep -R "resolveApiBaseUrl" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/api-resolver.txt" || true

echo "SUPABASE"

grep -R "createClient" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/create-client.txt" || true

grep -R "SUPABASE" apps packages \
--exclude-dir=node_modules \
--exclude-dir=.next \
> "$OUT/supabase.txt" || true

echo
echo "OUTPUT=$OUT"
