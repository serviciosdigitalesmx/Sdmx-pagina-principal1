#!/usr/bin/env bash
set -euo pipefail

echo "== Git =="
git status --short --branch

echo
echo "== Typecheck API =="
pnpm --dir apps/api typecheck

echo
echo "== Typecheck web-admin =="
if node -e "const p=require('./apps/web-admin/package.json'); process.exit(p.scripts && p.scripts.typecheck ? 0 : 1)" 2>/dev/null; then
  pnpm --dir apps/web-admin typecheck
else
  echo "apps/web-admin has no typecheck script; skipping"
fi

echo
echo "== Verificar T13 =="
test -f docs/ai-packets/T13-packet.md
test -f docs/implementation-bundles/T13/README.md
test -f docs/implementation-bundles/T13/verify.sh
test -f docs/implementation-results/T13-result.md
ls supabase/migrations/*_t13_message_queue.sql >/dev/null

rg -n "message_queue|manual_wa_me|whatsapp_draft_generated" supabase/migrations apps/api/src
rg -n "createOrderWhatsAppDraft|listOrderWhatsAppMessages|whatsapp/draft|whatsapp/messages" apps/api/src/controllers/orders.ts apps/api/src/routes/orders.ts

echo
echo "== Confirmar que no hay proveedor real =="
if rg -n "WHATSAPP_TOKEN|WHATSAPP_SECRET|graph.facebook|cloud api|provider_message_id|webhook" \
  apps/api/src/controllers/orders.ts \
  apps/api/src/routes/orders.ts \
  apps/api/src/services/whatsapp-messages.ts \
  supabase/migrations/20260625070326_t13_message_queue.sql \
  docs/implementation-results/T13-result.md; then
  echo "Unexpected real WhatsApp provider implementation found"
  exit 1
else
  echo "No real WhatsApp provider, OK"
fi

echo
echo "== Diff stat =="
git diff --stat

echo
echo "T13 verify OK"
