#!/usr/bin/env bash
set -euo pipefail

CODEX_DEPS="/Users/usuario/.cache/codex-runtimes/codex-primary-runtime/dependencies"
if [[ -d "$CODEX_DEPS" ]]; then
  export PATH="$CODEX_DEPS/node/bin:$CODEX_DEPS/bin:$PATH"
fi

echo "== Git =="
git status --short --branch

echo
echo "== Typecheck API =="
pnpm --dir apps/api typecheck

echo
echo "== Verificar T11 =="
test -f docs/ai-packets/T11-packet.md
test -f docs/implementation-bundles/T11/README.md
test -f docs/implementation-bundles/T11/verify.sh
test -f docs/implementation-results/T11-result.md
ls supabase/migrations/*_t11_service_order_authorizations.sql >/dev/null

rg -n "service_order_authorizations|submit_service_order_authorization" supabase/migrations
rg -n "getPublicOrderAuthorization|submitPublicOrderAuthorization" apps/api/src/controllers/public.ts apps/api/src/routes/public.ts
rg -n "getOrderAuthorizations|authorizations" apps/api/src/controllers/orders.ts apps/api/src/routes/orders.ts
rg -n "service_order.authorization.submitted|authorization_accepted|authorization_rejected" supabase/migrations apps/api/src

echo
echo "== Diff stat =="
git diff --stat

echo
echo "T11 verify OK"
