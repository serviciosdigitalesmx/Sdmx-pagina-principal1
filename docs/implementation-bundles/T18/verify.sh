#!/usr/bin/env bash
set -euo pipefail

CODEX_PNPM="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm"
if ! command -v pnpm >/dev/null 2>&1 && [ -x "$CODEX_PNPM" ]; then
  export PATH="$(dirname "$CODEX_PNPM"):$PATH"
fi

CODEX_NODE="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
if ! command -v node >/dev/null 2>&1 && [ -x "$CODEX_NODE" ]; then
  export PATH="$(dirname "$CODEX_NODE"):$PATH"
fi

echo "== Git =="
git status --short --branch

echo
echo "== Typecheck API =="
pnpm --dir apps/api typecheck

echo
echo "== Verificar T18 =="
test -f docs/ai-packets/T18-packet.md
test -f docs/implementation-bundles/T18/README.md
test -f docs/implementation-bundles/T18/verify.sh
test -f docs/implementation-results/T18-result.md
test -f apps/api/src/middleware/requestId.ts
test -f apps/api/src/services/observability.ts

rg -n "requestIdMiddleware|x-request-id|requestId|safeLogError|safeLogInfo|runDependencyHealthCheck|getDependencyHealth|health/dependencies|/api/health/dependencies" \
  apps/api/src/index.ts \
  apps/api/src/controllers/meta.ts \
  apps/api/src/middleware/errorHandler.ts \
  apps/api/src/middleware/requestId.ts \
  apps/api/src/services/observability.ts \
  docs/implementation-results/T18-result.md

echo
echo "== Confirmar que no hay migración T18 =="
if ls supabase/migrations/*_t18* 1>/dev/null 2>&1; then
  echo "Unexpected T18 migration found"
  exit 1
else
  echo "No T18 migration, OK"
fi

echo
echo "== Confirmar que no toca dominios prohibidos =="
if git diff --name-only | rg "apps/web-admin|apps/web-clientes|controllers/orders|routes/orders|controllers/reports|routes/reports|work-logs|productivity-reports|whatsapp|message_queue|pwa-push|notification_events|inventory|finance|financial|payment|refund|cash|billing|supabase/migrations"; then
  echo "Unexpected cross-domain changes found"
  exit 1
else
  echo "No cross-domain changes, OK"
fi

echo
echo "== Diff stat =="
git diff --stat

echo
echo "T18 verify OK"
