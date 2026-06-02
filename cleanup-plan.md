# Cleanup Plan

## Objective

| Goal | Constraint | Outcome |
|---|---|---|
| Reduce repo noise | No code changes in this phase | Prepare cleanup scope only |
| Preserve production stability | No deletions yet | Review and approval gate first |
| Avoid schema risk | No migration edits | Freeze Supabase changes until approved |

## Phase A Scope

| Included | Excluded |
|---|---|
| Report generation | Deletions |
| Inventory of dead artifacts | Refactors |
| Legacy classification | Source code changes |
| Migration risk mapping | Migration edits |
| Cleanup candidate list | Supabase remote changes |

## Cleanup Categories

| Category | Examples | Planned Treatment |
|---|---|---|
| Dead tracked files | `Run`, `audit-sdmx-platform-20260529-031649.txt` | Remove after approval |
| Backup files | `*.bak`, `*.local-backup` | Remove after approval |
| Build/cache noise | `.next`, `dist`, `node_modules`, `.turbo`, `.pnpm-store`, `.vercel`, `supabase/.temp` | Keep ignored, no source action |
| Legacy docs | `docs/*SrFix*`, historical refactor docs | Reclassify as historical or archive later |
| Compatibility routes | `apps/api/src/routes/orders.ts` `/legacy` route | Review separately before any refactor |
| Legacy branding in UI | `apps/web-admin`, `apps/web-public`, `apps/web-clientes` surfaces | Separate UI cleanup phase |

## Priority Order

| Priority | Area | Reason |
|---|---|---|
| P0 | Root artifacts and backups | Safe hygiene, low behavioral risk |
| P1 | Obsolete utility scripts | Reduces operational confusion |
| P2 | Legacy docs classification | Improves source-of-truth clarity |
| P3 | UI branding cleanup | Requires product review, not just deletion |
| P4 | Compatibility routes and schema paths | Needs explicit contract validation |

## Proposed Execution Gates

| Gate | Acceptance Criteria | Owner Action |
|---|---|---|
| Gate 1 | Cleanup report and migration audit reviewed | Approve Phase A scope |
| Gate 2 | Exact deletion list approved | Permit file removals |
| Gate 3 | No outstanding dependency on dead artifacts | Proceed with hygiene cleanup |
| Gate 4 | Migration families canonicalized | Allow schema-side cleanup planning |

## Files Marked for Potential Removal

| Path | Reason | Approval Needed |
|---|---|---|
| `Run` | Empty tracked artifact | Yes |
| `audit-sdmx-platform-20260529-031649.txt` | Local audit artifact tracked in root | Yes |
| `packages/config/src/index.ts.bak` | Backup duplicate | Yes |
| `apps/web-admin/.env.production.local-backup` | Local backup | Yes |
| `apps/web-public/.env.production.local-backup` | Local backup | Yes |
| `apps/web-clientes/.env.production.local-backup` | Local backup | Yes |
| `apps/mobile/android/app/src/androidTest/java/com/getcapacitor/myapp/ExampleInstrumentedTest.java` | Default scaffold test | Yes |
| `apps/mobile/android/app/src/test/java/com/getcapacitor/myapp/ExampleUnitTest.java` | Default scaffold test | Yes |

## Files Marked for Refactor Later

| Path | Reason | Notes |
|---|---|---|
| `scripts/audit-sdmx-platform-map.sh` | Obsolete path references | Update only after approval |
| `scripts/deploy-all.sh` | Operationally brittle | Validate against current deployment flow first |
| `scripts/setup-vercel.sh` | Hardcoded values and seed logic | Move toward env-driven config later |
| `apps/api/src/routes/orders.ts` | Legacy compatibility route | Review contract before any removal |
| `apps/web-admin/src/app/api/pwa/manifest/route.ts` | Legacy branding in response | Cleanup requires UI/product signoff |
| `apps/web-admin/src/app/api/pwa/sw.js/route.ts` | Legacy branding in response | Cleanup requires UI/product signoff |
| `apps/web-public/src/app/[tenant]/page.tsx` | Legacy branding in UI | Cleanup requires UI/product signoff |
| `apps/web-clientes/src/app/t/[tenantSlug]/portal/page.tsx` | Legacy branding in UI | Cleanup requires UI/product signoff |

## Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Deleting tracked artifacts too early | Could obscure audit trail | Wait for approval |
| Removing compatibility code prematurely | Could break tenant flows | Validate contracts first |
| Editing migrations without canonical order | Could corrupt schema history | Freeze migration changes |
| Treating docs as runtime truth | Could mislead implementation | Reclassify docs before use |

## Approval Request for Phase A

| Question | Required Answer |
|---|---|
| Can tracked dead artifacts be removed? | Yes / No |
| Can backup files be removed? | Yes / No |
| Can obsolete helper scripts be refactored later? | Yes / No |
| Can migration families remain frozen until canonical review? | Yes / No |

## Next Step

| If approved | Then |
|---|---|
| Phase A cleanup | Remove only the approved dead artifacts and backups |
| Phase B review | Reassess scripts, docs, and compatibility routes |
| Phase C schema work | Resolve canonical migration families before touching Supabase |

