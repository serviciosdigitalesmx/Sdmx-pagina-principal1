#!/usr/bin/env bash
set -euo pipefail

LATEST_SOT=$(ls -dt fixi-source-of-truth-* | head -1)

echo
echo "================ AUTH ================"
wc -l "$LATEST_SOT"/auth-exchange.txt || true
wc -l "$LATEST_SOT"/current-session.txt || true
wc -l "$LATEST_SOT"/local-storage.txt || true

echo
echo "================ TENANT ================"
wc -l "$LATEST_SOT"/tenant-slug.txt || true
wc -l "$LATEST_SOT"/tenant-id.txt || true
wc -l "$LATEST_SOT"/branch-id.txt || true

echo
echo "================ API ================"
wc -l "$LATEST_SOT"/api-url.txt || true
wc -l "$LATEST_SOT"/api-resolver.txt || true

echo
echo "================ SUPABASE ================"
wc -l "$LATEST_SOT"/create-client.txt || true
wc -l "$LATEST_SOT"/supabase.txt || true

echo
echo "================ TOP 20 localStorage ================"
head -20 "$LATEST_SOT"/local-storage.txt || true

echo
echo "================ TOP 20 tenantSlug ================"
head -20 "$LATEST_SOT"/tenant-slug.txt || true

echo
echo "================ TOP 20 createClient ================"
head -20 "$LATEST_SOT"/create-client.txt || true
