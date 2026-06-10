#!/usr/bin/env bash
set -euo pipefail

OUT="fixi-phase1-targets-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUT"

cat > "$OUT/backend-tenant.txt" <<LIST
apps/api/src/controllers/orders.ts
apps/api/src/controllers/catalogs.ts
apps/api/src/controllers/purchase-orders.ts
apps/api/src/controllers/auth.controller.ts
apps/api/src/controllers/users.ts
apps/api/src/controllers/meta.ts
apps/api/src/controllers/suppliers.ts
apps/api/src/controllers/security.ts
apps/api/src/controllers/tasks.ts
apps/api/src/controllers/finance.ts
apps/api/src/controllers/sucursales.ts
apps/api/src/controllers/public.ts
apps/api/src/services/tenant-config.ts
apps/api/src/middleware/auth.ts
LIST

cat > "$OUT/frontend-tenant.txt" <<LIST
apps/web-admin/src/providers/TenantIdentityProvider.tsx
apps/web-admin/src/lib/scope.ts
apps/web-admin/src/lib/tenant.ts
apps/web-admin/src/components/dashboard/branch-selector.tsx
apps/web-admin/src/components/dashboard/sidebar.tsx
apps/web-admin/src/app/dashboard/sucursales/page.tsx
LIST

echo
echo "OUTPUT=$OUT"

echo
echo "BACKEND FILES:"
cat "$OUT/backend-tenant.txt"

echo
echo "FRONTEND FILES:"
cat "$OUT/frontend-tenant.txt"
