#!/usr/bin/env bash
set -euo pipefail

export PATH="/Users/usuario/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:/Users/usuario/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:${PATH}"

echo "== Git =="
git status --short --branch

echo
echo "== Typecheck API =="
pnpm --dir apps/api typecheck

echo
echo "== Verificar T09 =="
test -f docs/ai-packets/T09-packet.md
test -f docs/implementation-bundles/T09/README.md
test -f docs/implementation-bundles/T09/verify.sh
test -f docs/implementation-results/T09-result.md
ls supabase/migrations/*_t09_device_history.sql >/dev/null

rg -n "find_device_history_by_serial|service_orders_tenant_serial_number_normalized_idx" supabase/migrations
rg -n "getDeviceHistoryBySerial|device-history" apps/api/src/controllers/orders.ts apps/api/src/routes/orders.ts
rg -n "service_order_status_history|service_order_events|service_order_documents|service_order_consumed" apps/api/src/controllers/orders.ts

echo
echo "== Diff stat =="
git diff --stat

echo
echo "T09 verify OK"
