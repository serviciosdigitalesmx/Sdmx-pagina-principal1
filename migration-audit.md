# Migration Audit

## Scope

| Item | Status | Notes |
|---|---:|---|
| Source of truth reviewed | Yes | Based on local audit only |
| Supabase remote changes | Not touched | No remote validation performed in this step |
| Migration files | Read-only review | No edits made |

## Migration Families

| Family | Representative Files | Assessment |
|---|---|---|
| Baseline/schema bootstrap | `20260424_baseline_schema.sql`, `20260514133525_remote_schema.sql` | Historical snapshot material, not a clean incremental contract |
| RLS and policy hardening | `20260514120000_enable_rls_and_policies.sql`, `20260527083000_harden_tenant_isolation_rls.sql`, `20260528000600_harden_live_inventory_rls.sql`, `20260530193000_audit_hardening_multitenant.sql` | Active and security-relevant |
| Tenant domain rollout | `20260527030000_tenant_industry_config_phase1.sql`, `20260527050000_tenant_field_definitions_phase2.sql`, `20260527070000_tenant_semaphore_rules.sql` | Active and relevant |
| Sucursales cutover | `20260527091000_cutover_branches_to_sucursales.sql`, `20260527093000_migrate_branch_fks_to_sucursales.sql`, `20260527095000_drop_branch_compat_after_cutover.sql`, `20260528001442_cutover_branches_to_sucursales.sql`, `20260528001652_migrate_branch_fks_to_sucursales.sql`, `20260528001842_drop_branch_compat_after_cutover.sql` | High-risk duplicate sequence |
| Security/backoffice | `20260530132000_security_backoffice_tables.sql`, `20260531110000_fix_security_backoffice_schema.sql` | High-risk duplicate sequence |
| User compatibility | `20260530120000_expand_users_admin_module.sql`, `20260531063159_add_users_activo_compatibility.sql`, `20260531063240_add_users_mfa_enabled_compatibility.sql` | Compatibility overlap |
| Inventory hardening | `20260527084500_harden_live_inventory_rls.sql`, `20260528000600_harden_live_inventory_rls.sql` | Duplicate hardening path |
| Product features | `20260530121000_add_assigned_user_to_service_orders.sql`, `20260530143000_add_public_token_to_service_orders.sql`, `20260530150000_add_pwa_push_subscriptions.sql`, `20260530180000_add_customer_sucursal_id.sql` | Active feature surface |

## Clearly Active Migrations

| File | Why It Appears Active | Status |
|---|---|---|
| `20260514120000_enable_rls_and_policies.sql` | Core access control baseline | Keep |
| `20260527030000_tenant_industry_config_phase1.sql` | Tenant configuration expansion | Keep |
| `20260527050000_tenant_field_definitions_phase2.sql` | Tenant field schema rollout | Keep |
| `20260527070000_tenant_semaphore_rules.sql` | Tenant rule system | Keep |
| `20260527083000_harden_tenant_isolation_rls.sql` | Tenant isolation hardening | Keep |
| `20260528000600_harden_live_inventory_rls.sql` | Current inventory hardening path | Keep pending duplicate review |
| `20260530121000_add_assigned_user_to_service_orders.sql` | Feature addition | Keep |
| `20260530143000_add_public_token_to_service_orders.sql` | Feature addition | Keep |
| `20260530150000_add_pwa_push_subscriptions.sql` | Feature addition | Keep |
| `20260530180000_add_customer_sucursal_id.sql` | Feature addition | Keep |
| `20260530193000_audit_hardening_multitenant.sql` | Security hardening | Keep |

## Duplicate or Contradictory Sets

| Domain | Files | Risk |
|---|---|---|
| Branch to sucursales cutover | `20260527091000_cutover_branches_to_sucursales.sql`, `20260528001442_cutover_branches_to_sucursales.sql` | Duplicate cutover logic may create conflicting DDL order |
| Foreign key migration | `20260527093000_migrate_branch_fks_to_sucursales.sql`, `20260528001652_migrate_branch_fks_to_sucursales.sql` | Duplicate FK migration logic |
| Compatibility drop | `20260527095000_drop_branch_compat_after_cutover.sql`, `20260528001842_drop_branch_compat_after_cutover.sql` | Duplicate cleanup of legacy compatibility |
| Security backoffice tables | `20260530132000_security_backoffice_tables.sql`, `20260531110000_fix_security_backoffice_schema.sql` | Two passes solving the same schema surface |
| `users.activo` compatibility | `20260530120000_expand_users_admin_module.sql`, `20260531063159_add_users_activo_compatibility.sql` | Overlapping compatibility intent |
| `users.mfa_enabled` compatibility | `20260530132000_security_backoffice_tables.sql`, `20260531063240_add_users_mfa_enabled_compatibility.sql`, `20260531110000_fix_security_backoffice_schema.sql` | Overlapping compatibility intent |
| Inventory RLS hardening | `20260527084500_harden_live_inventory_rls.sql`, `20260528000600_harden_live_inventory_rls.sql` | Duplicate hardening path |

## Suspicious Historical Snapshots

| File | Why Suspicious | Recommended Handling |
|---|---|---|
| `20260424_baseline_schema.sql` | Bootstrap baseline only, not end-state contract | Keep as historical bootstrap |
| `20260514133525_remote_schema.sql` | Snapshot-style file that may encode stale or removed objects | Treat as historical reference only |

## Migration Risk Assessment

| Risk Level | Area | Why |
|---|---|---|
| High | `branch` -> `sucursales` family | Multiple overlapping migrations likely encode the same cutover in different forms |
| High | Security/backoffice | Two migrations appear to address the same schema hardening surface |
| High | Compatibility columns | Repeated compatibility additions can drift from the canonical schema |
| Medium | Historical snapshots | Useful for provenance, dangerous if treated as the live contract |
| Medium | Inventory RLS | Duplicate hardening may indicate partial overlap or reapplication risk |

## Operational Notes

| Note | Implication |
|---|---|
| `branch_*`, `branches`, `inventory`, `expenses`, `panel_*` appear in historical transitions | Indicates an older model was progressively migrated |
| `branches` appears to have been transitional compatibility during cutover | Final schema should prefer the canonical sucursales naming |
| No edits were made to migrations | This audit is informational only |

## Recommendation

| Step | Action |
|---|---|
| 1 | Validate the canonical migration order against the live Supabase migration list |
| 2 | Classify duplicate families by actual execution order and schema diff |
| 3 | Freeze deletion until the canonical path is formally approved |
| 4 | Treat snapshots as provenance, not as source for fresh provisioning without review |

