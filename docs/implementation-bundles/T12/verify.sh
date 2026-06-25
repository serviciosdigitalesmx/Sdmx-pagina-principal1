#!/usr/bin/env bash
set -euo pipefail

RUNTIME_BIN="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin"
RUNTIME_NODE_BIN="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin"
if [ -d "$RUNTIME_BIN" ] && [ -d "$RUNTIME_NODE_BIN" ]; then
  export PATH="$RUNTIME_NODE_BIN:$RUNTIME_BIN:$PATH"
fi

echo "== Git =="
git status --short --branch

echo
echo "== Typecheck API =="
pnpm --dir apps/api typecheck

echo
echo "== Typecheck web-clientes =="
if node -e "const p=require('./apps/web-clientes/package.json'); process.exit(p.scripts && p.scripts.typecheck ? 0 : 1)" 2>/dev/null; then
  pnpm --dir apps/web-clientes typecheck
else
  echo "apps/web-clientes has no typecheck script; skipping"
fi

echo
echo "== Verificar T12 =="
test -f docs/ai-packets/T12-packet.md
test -f docs/implementation-bundles/T12/README.md
test -f docs/implementation-bundles/T12/verify.sh
test -f docs/implementation-results/T12-result.md

rg -n "getPublicPortalByToken|/portal" apps/api/src/controllers/public.ts apps/api/src/routes/public.ts
rg -n "getPortalOrderByToken|authorization|warranty|documents|timeline" apps/web-clientes/src
rg -n "is_customer_visible|retention_expires_at|public_token|service_order_authorizations|service_order_warranties" apps/api/src/controllers/public.ts

echo
echo "== Confirmar que no hubo migración T12 =="
if ls supabase/migrations/*_t12_* >/dev/null 2>&1; then
  echo "Unexpected T12 migration found"
  exit 1
else
  echo "No T12 migration found, OK"
fi

echo
echo "== Diff stat =="
git diff --stat

echo
echo "T12 verify OK"

