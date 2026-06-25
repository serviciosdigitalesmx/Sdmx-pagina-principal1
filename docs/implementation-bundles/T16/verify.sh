#!/usr/bin/env bash
set -euo pipefail

echo "== Git =="
git status --short --branch

echo
echo "== Verificar archivos T16 =="
test -f docs/ai-packets/T16-packet.md
test -f scripts/validate-t16-api-smoke.sh
test -f docs/implementation-bundles/T16/README.md
test -f docs/implementation-bundles/T16/verify.sh
test -f docs/implementation-results/T16-result.md

echo
echo "== Bash syntax =="
bash -n scripts/validate-t16-api-smoke.sh
bash -n docs/implementation-bundles/T16/verify.sh

echo
echo "== Verificar contenido T16 =="
rg -n "API_BASE_URL|/health|/healthz|/api/health|/health/dependencies|/api/health/dependencies|x-request-id|requestId|T16_PRODUCTIVITY_URL|T16_PUBLIC_PORTAL_URL|T16_PUBLIC_AUTHORIZATION_URL|T16_AUTH_TOKEN|T16 smoke OK" \
  scripts/validate-t16-api-smoke.sh \
  docs/implementation-bundles/T16/README.md \
  docs/implementation-results/T16-result.md

echo
echo "== Confirmar que no hay migración T16 =="
if ls supabase/migrations/*_t16* 1>/dev/null 2>&1; then
  echo "Unexpected T16 migration found"
  exit 1
else
  echo "No T16 migration, OK"
fi

echo
echo "== Confirmar que no toca apps ni package files =="
if git diff --name-only | rg "^(apps/|packages/|package.json|pnpm-lock.yaml|supabase/migrations/)"; then
  echo "Unexpected app/package/schema changes found"
  exit 1
else
  echo "No app/package/schema changes, OK"
fi

echo
echo "== Diff stat =="
git diff --stat

echo
echo "T16 verify OK"
