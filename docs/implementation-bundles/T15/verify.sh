#!/usr/bin/env bash
set -euo pipefail

echo "== Git =="
git status --short --branch

echo
echo "== Typecheck API =="
pnpm --dir apps/api typecheck

echo
echo "== Verificar T15 =="
test -f docs/ai-packets/T15-packet.md
test -f docs/implementation-bundles/T15/README.md
test -f docs/implementation-bundles/T15/verify.sh
test -f docs/implementation-results/T15-result.md
test -f apps/api/src/services/productivity-reports.ts

rg -n "getProductivityReport|/productivity|productivity-reports|byTechnician|bySucursal|openLogs|informativeCommissionTotal|work_logs" \
  apps/api/src/controllers/reports.ts \
  apps/api/src/routes/reports.ts \
  apps/api/src/services/productivity-reports.ts \
  docs/implementation-results/T15-result.md

echo
echo "== Confirmar que no hay migración T15 =="
if ls supabase/migrations/*_t15* 1>/dev/null 2>&1; then
  echo "Unexpected T15 migration found"
  exit 1
else
  echo "No T15 migration, OK"
fi

echo
echo "== Confirmar que no toca dominios prohibidos =="
if git diff --name-only | rg "apps/web-admin|apps/web-clientes|whatsapp|message_queue|pwa-push|notification_events|inventory|finance|financial|payment|refund|cash|supabase/migrations"; then
  echo "Unexpected cross-domain changes found"
  exit 1
else
  echo "No cross-domain changes, OK"
fi

echo
echo "== Diff stat =="
git diff --stat

echo
echo "T15 verify OK"
