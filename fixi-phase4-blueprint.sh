#!/usr/bin/env bash
set -euo pipefail

OUT="fixi-phase4-blueprint-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUT"

cat > "$OUT/TenantIdentity.ts" <<'TS'
export interface TenantIdentity {
  tenantId: string;
  tenantSlug: string;
  tenantName: string;

  branchId: string | null;
  branchCode: string | null;
  branchName: string | null;

  userId: string;
  userEmail: string;
  role: string;
}
TS

cat > "$OUT/SessionSourceOfTruth.txt" <<'DOC'
ÚNICA FUENTE DE VERDAD

JWT
 ↓
getCurrentSession()
 ↓
TenantIdentityProvider
 ↓
useTenantIdentity()

PROHIBIDO

getStoredTenant()
getStoredUser()
useTenant()
TenantProvider
DOC

cat > "$OUT/FilesToDelete.txt" <<'DOC'
apps/web-admin/src/components/tenant/tenant-provider.tsx
DOC

cat > "$OUT/FilesToRefactor.txt" <<'DOC'
apps/web-admin/src/providers/TenantIdentityProvider.tsx
apps/web-admin/src/lib/auth.ts
apps/web-admin/src/lib/session.ts
apps/web-admin/src/components/guard/use-auth.ts
apps/web-admin/src/lib/tenant.ts
DOC

echo "OUTPUT=$OUT"
