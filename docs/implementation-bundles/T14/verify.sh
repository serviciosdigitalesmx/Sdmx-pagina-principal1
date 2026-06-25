#!/usr/bin/env bash
set -euo pipefail

echo "== Git =="
git status --short --branch

echo
echo "== Typecheck API =="
pnpm --dir apps/api typecheck

echo
echo "== Verificar T14 =="
test -f docs/ai-packets/T14-packet.md
test -f docs/implementation-bundles/T14/README.md
test -f docs/implementation-bundles/T14/verify.sh
test -f docs/implementation-results/T14-result.md
ls supabase/migrations/*_t14_work_logs_commissions.sql >/dev/null

rg -n "work_logs|work_log_events|technician_commission_rules" supabase/migrations apps/api/src
rg -n "startOrderWorkLog|pauseOrderWorkLog|resumeOrderWorkLog|stopOrderWorkLog|listOrderWorkLogs|commission-rules|work-logs" apps/api/src/controllers/orders.ts apps/api/src/routes/orders.ts

echo
echo "== Confirmar que no toca WhatsApp/PWA/finanzas/inventario =="
if git diff --name-only | rg "whatsapp-messages|pwa-push|inventory|finance|financial|payments|refund|message_queue|notification_events"; then
  echo "Unexpected cross-domain changes found"
  exit 1
else
  echo "No cross-domain changes, OK"
fi

echo
echo "== Diff stat =="
git diff --stat

echo
echo "T14 verify OK"
