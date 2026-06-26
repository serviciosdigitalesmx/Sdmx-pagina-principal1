#!/usr/bin/env bash
set -euo pipefail

changed_files() {
  {
    git diff --name-only
    git diff --cached --name-only
    git ls-files --others --exclude-standard
  } | sort -u
}

T20_SOURCE_FILES=(
  "apps/api/src/index.ts"
  "apps/api/src/routes/portability.ts"
  "apps/api/src/controllers/portability.ts"
  "apps/api/src/services/tenant-data-portability.ts"
)

echo "== Git =="
git status --short --branch

echo
echo "== Typecheck API =="
pnpm --dir apps/api typecheck

echo
echo "== Verificar archivos T20 =="
test -f docs/ai-packets/T20-packet.md
test -f apps/api/src/routes/portability.ts
test -f apps/api/src/controllers/portability.ts
test -f apps/api/src/services/tenant-data-portability.ts
test -f docs/implementation-bundles/T20/README.md
test -f docs/implementation-bundles/T20/verify.sh
test -f docs/implementation-results/T20-result.md

echo
echo "== Verificar contenido T20 =="
rg -n "fixi-portability-v1|export/summary|export/data|import/preview|tenant-data-portability|getTenantExportSummary|getTenantExportData|previewTenantImport|portability.export.summary|portability.export.data|portability.import.preview|schema_version|would_create|would_skip|would_conflict|requestId" \
  apps/api/src/index.ts \
  apps/api/src/routes/portability.ts \
  apps/api/src/controllers/portability.ts \
  apps/api/src/services/tenant-data-portability.ts \
  docs/implementation-results/T20-result.md

echo
echo "== Confirmar que no hay migración T20 =="
if find supabase/migrations -maxdepth 1 -name '*_t20*' -print -quit | grep -q .; then
  echo "Unexpected T20 migration found"
  find supabase/migrations -maxdepth 1 -name '*_t20*' -print
  exit 1
else
  echo "No T20 migration, OK"
fi

echo
echo "== Confirmar que no toca dominios prohibidos =="
if changed_files | rg "apps/web-admin|apps/web-clientes|apps/web-public|apps/api/src/services/billing.ts|apps/api/src/services/billing-adapter.ts|mercado|payment|refund|cash|message_queue|pwa-push|notification_events|public.ts|supabase/migrations|package.json|pnpm-lock.yaml"; then
  echo "Unexpected forbidden changes found"
  exit 1
else
  echo "No forbidden changes, OK"
fi

echo
echo "== Confirmar que no hay import apply/destructivo =="
if rg -n "(import/apply|truncate|\\.delete\\(|\\.upsert\\(|\\.insert\\(|\\.update\\(|rpc\\(|drop table|create table|alter table|raw sql|execute sql)" "${T20_SOURCE_FILES[@]}"; then
  echo "Potential forbidden destructive implementation found"
  exit 1
else
  echo "No destructive import implementation, OK"
fi

echo
echo "== Confirmar que no hay select star =="
if rg -n "select\\(['\\\"]\\*['\\\"]|select:\\s*['\\\"]\\*" "${T20_SOURCE_FILES[@]}"; then
  echo "Unexpected select star found"
  exit 1
else
  echo "No select star, OK"
fi

echo
echo "== Confirmar que no se seleccionan campos sensibles =="
if rg -n "(select:\\s*['\\\"][^'\\\"]*(public_token|bucket_name|storage_path|public_url|mfa_secret|service_role|password_hash|audit_logs|message_queue|pwa_push_subscriptions|security_sessions)|\\.select\\(['\\\"][^'\\\"]*(public_token|bucket_name|storage_path|public_url|mfa_secret|service_role|password_hash|audit_logs|message_queue|pwa_push_subscriptions|security_sessions))" \
  "apps/api/src/services/tenant-data-portability.ts"; then
  echo "Unexpected sensitive field selected for export"
  exit 1
else
  echo "No sensitive export selected fields, OK"
fi

echo
echo "== Diff stat =="
git diff --stat

echo
echo "T20 verify OK"
