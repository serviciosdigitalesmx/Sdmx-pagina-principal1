# Cleanup Report

## Scope

| Item | Status | Notes |
|---|---:|---|
| Monorepo active apps | Confirmed | `apps/api`, `apps/web-admin`, `apps/web-public`, `apps/web-clientes` |
| Shared packages | Confirmed | `packages/config`, `packages/database`, `packages/types`, `packages/ui` |
| Supabase migrations | Confirmed | `supabase/migrations` is part of the active platform surface |
| Legacy `js/` tree | Historical | No active imports found from the current monorepo runtime |

## Active Runtime Surface

| Path | Role | Status |
|---|---|---|
| `apps/api/src` | Backend API | Active |
| `apps/web-admin/src` | Admin frontend | Active |
| `apps/web-public/src` | Public frontend | Active |
| `apps/web-clientes/src` | Customer portal frontend | Active |
| `packages/config/src/index.ts` | Shared configuration | Active |
| `packages/database/src/index.ts` | Shared database layer | Active |
| `packages/types/index.ts` | Shared types | Active |
| `packages/ui/src` | Shared UI components | Active |
| `supabase/migrations` | Database migrations | Active |

## Legacy Material

| Path | Reason Classified as Legacy | Action |
|---|---|---|
| `js/` | Pre-Next.js UI and navigation tree | Keep for history only |
| `docs/CONTRATO_SR_FIX.md` | Historical SrFix contract | Review-only |
| `docs/AUDITORIA_CONTRATO_SR_FIX.md` | Historical audit | Review-only |
| `docs/MAPA_FUNCIONAL_SR_FIX_A_SDMX.md` | Historical migration map | Review-only |
| `docs/WEB_ADMIN_SR_FIX_INTEGRATION_MAP.md` | Historical integration map | Review-only |
| `docs/BITACORA_REFACTOR.md` | Refactor log from prior stage | Review-only |
| `docs/CONTRATO_EJECUCION_REFACTOR.md` | Refactor execution contract | Review-only |
| `docs/CHECKLIST_REFACTOR_PENDIENTES.md` | Old pending checklist | Review-only |
| `docs/ROADMAP_MIGRACION_SDMX.md` | Historical roadmap | Review-only |

## Duplicate or Dead Artifacts

| Path | Classification | Notes |
|---|---|---|
| `Run` | Dead file | Empty file tracked in root |
| `audit-sdmx-platform-20260529-031649.txt` | Audit artifact | Local audit output tracked in root |
| `packages/config/src/index.ts.bak` | Backup artifact | Duplicate config snapshot |
| `apps/web-admin/.env.production.local-backup` | Backup artifact | Local backup file |
| `apps/web-public/.env.production.local-backup` | Backup artifact | Local backup file |
| `apps/web-clientes/.env.production.local-backup` | Backup artifact | Local backup file |
| `apps/mobile/android/app/src/androidTest/java/com/getcapacitor/myapp/ExampleInstrumentedTest.java` | Dead test artifact | Default scaffold test |
| `apps/mobile/android/app/src/test/java/com/getcapacitor/myapp/ExampleUnitTest.java` | Dead test artifact | Default scaffold test |

## Local Build / Cache Noise

| Pattern | Classification | Notes |
|---|---|---|
| `apps/**/.next/*` | Build cache | Not source |
| `apps/**/dist/*` | Build output | Not source |
| `apps/**/node_modules/*` | Dependency install | Not source |
| `packages/**/node_modules/*` | Dependency install | Not source |
| `apps/mobile/android/build/*` | Build output | Not source |
| `supabase/.temp/*` | Local temp state | Not source |
| `.pnpm-store/` | Package cache | Not source |
| `.turbo/` | Build cache | Not source |
| `.vercel/` | Vercel local state | Not source |
| `*.tsbuildinfo` | TypeScript build cache | Not source |
| `*.local-backup` | Backup artifact | Not source |
| `.env.example.bak` | Backup artifact | Not source |

## UI and Routing Findings

| Path | Finding | Risk |
|---|---|---|
| `apps/api/src/routes/orders.ts` | Contains `/legacy` route that mirrors `listOrders` behavior | Medium |
| `apps/web-admin/src/app/api/pwa/manifest/route.ts` | Still contains SrFix branding/copy | Low |
| `apps/web-admin/src/app/api/pwa/sw.js/route.ts` | Still contains SrFix branding/copy | Low |
| `apps/web-public/src/app/[tenant]/page.tsx` | Footer/copy still reflects legacy branding | Medium |
| `apps/web-clientes/src/app/t/[tenantSlug]/portal/page.tsx` | Portal UI still reflects legacy branding | Medium |
| `scripts/audit-sdmx-platform-map.sh` | References obsolete `apps/backend-api` path | Medium |
| `scripts/deploy-all.sh` | Overcoupled Vercel flow, needs review before operational use | Medium |
| `scripts/setup-vercel.sh` | Contains hardcoded values and seed logic that should move to env/config | High |

## Environment Contract Issues

| Variable / Alias | Finding | Status |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Used in runtime contracts | Active |
| `NEXT_PUBLIC_API_BASE_URL` | Functionally duplicates API URL contract | Technical debt |
| `NEXT_PUBLIC_ENABLE_PWA` | Appears in config/docs but no clear runtime consumer found | Suspect legacy |
| `NEXT_PUBLIC_DEFAULT_TENANT_NAME` | Appears in config/docs but no clear runtime consumer found | Suspect legacy |
| `NEXT_PUBLIC_TENANT_BRAND_NAME` | Appears in config/docs but no clear runtime consumer found | Suspect legacy |
| `NEXT_PUBLIC_SAAS_DEMO_URL` | Appears in config/docs but no clear runtime consumer found | Suspect legacy |
| `NEXT_PUBLIC_SAAS_LEGAL_NAME` | Appears in config/docs but no clear runtime consumer found | Suspect legacy |
| `NEXT_PUBLIC_SAAS_BRAND_SHORT` | Appears in config/docs but no clear runtime consumer found | Suspect legacy |
| `NEXT_PUBLIC_SAAS_CONTACT_EMAIL` | Appears in config/docs but no clear runtime consumer found | Suspect legacy |
| `NEXT_PUBLIC_SAAS_CONTACT_PHONE` | Appears in config/docs but no clear runtime consumer found | Suspect legacy |
| `NEXT_PUBLIC_BILLING_URL_TEMPLATE` | Appears in config/docs but no clear runtime consumer found | Suspect legacy |
| `NEXT_PUBLIC_LANDING_URL_TEMPLATE` | Appears in config/docs but no clear runtime consumer found | Suspect legacy |
| `MP_ACCESS_TOKEN` | Appears in config/docs but no clear runtime consumer found | Suspect legacy |
| `MP_WEBHOOK_SECRET` | Appears in config/docs but no clear runtime consumer found | Suspect legacy |

## Cleanup Candidates

| Priority | Candidate | Reason | Recommendation |
|---|---|---|---|
| P0 | `Run` | Empty tracked file | Remove in cleanup phase |
| P0 | `audit-sdmx-platform-20260529-031649.txt` | Local audit artifact | Remove in cleanup phase |
| P0 | `packages/config/src/index.ts.bak` | Backup duplicate | Remove in cleanup phase |
| P0 | `*.local-backup` files | Backup artifacts | Remove in cleanup phase |
| P1 | `apps/mobile/android/app/src/test/java/com/getcapacitor/myapp/ExampleUnitTest.java` | Scaffold test | Review then remove if unused |
| P1 | `apps/mobile/android/app/src/androidTest/java/com/getcapacitor/myapp/ExampleInstrumentedTest.java` | Scaffold test | Review then remove if unused |
| P1 | `scripts/audit-sdmx-platform-map.sh` | Obsolete path references | Refactor before future use |
| P2 | `apps/api/src/routes/orders.ts` `/legacy` route | Compatibility surface | Refactor after contract review |

## Conclusion

| Area | Assessment |
|---|---|
| Runtime health | Stable enough to keep source untouched |
| Repository hygiene | Needs cleanup of backups, artifacts, and cache noise |
| Legacy branding | Present in a few active UI surfaces |
| Operational risk | Highest around duplicated config and historical Supabase migrations |

