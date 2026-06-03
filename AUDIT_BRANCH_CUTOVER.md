# BRANCH_ID VS SUCURSAL_ID

## branch_id en backend
apps/api/src/controllers/users.ts.bak.20260603_093424:92:    sucursalId: row.sucursal_id ?? row.branch_id ?? null,
apps/api/src/controllers/users.ts.bak.20260603_093424:127:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at', { count: 'exact' })
apps/api/src/controllers/users.ts.bak.20260603_093424:236:          branch_id: body.sucursalId ?? null,
apps/api/src/controllers/users.ts.bak.20260603_093424:239:        .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
apps/api/src/controllers/users.ts.bak.20260603_093424:274:        branch_id: body.sucursalId ?? null,
apps/api/src/controllers/users.ts.bak.20260603_093424:276:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
apps/api/src/controllers/users.ts.bak.20260603_093424:355:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
apps/api/src/controllers/users.ts.bak.20260603_093424:406:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')

## sucursal_id en backend
apps/api/src/middleware/auth.ts:14:  sucursal_id?: string;
apps/api/src/middleware/auth.ts:61:    sucursal_id: z.string().min(1).optional(),
apps/api/src/middleware/auth.ts:93:        .select('id, tenant_id, role, sucursal_id, activo, is_active, mfa_enabled')
apps/api/src/middleware/auth.ts:137:        sucursalId: userRow.sucursal_id ?? claims.sucursal_id,
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:133:    scopedQuery = scopedQuery.eq('sucursal_id', branchId);
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:516:          sucursal_id: requestedSucursalId,
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:629:        sucursal_id: requestedSucursalId,
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:814:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1045:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1129:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1233:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1328:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/meta.ts:63:      .select('tenant_id, role, sucursal_id')
apps/api/src/controllers/meta.ts:96:        sucursalId: userRow.sucursal_id ?? null,
apps/api/src/controllers/auth.controller.ts:91:    sucursal_id: sucursalId ?? undefined,
apps/api/src/controllers/auth.controller.ts:392:      .select('id, tenant_id, role, sucursal_id, activo, is_active')
apps/api/src/controllers/auth.controller.ts:445:      userRow.sucursal_id,
apps/api/src/controllers/suppliers.ts:414:      .select('id, tenant_id, sucursal_id, supplier_id, related_service_order_id, folio, status, reference, payment_terms, expected_date, subtotal, tax_amount, total, notes, created_at, updated_at')
apps/api/src/controllers/reports.ts:17:    let ordersQuery = supabase.from('service_orders').select('id, status, created_at, final_cost, sucursal_id, promised_date, folio').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:19:    let inventoryQuery = supabase.from('sucursal_inventory').select('id, stock_current, product_id, sucursal_id, products:product_id (id, cost)').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:20:    let financeQuery = supabase.from('finances').select('id, balance, income, expense, created_at, sucursal_id').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:22:    let usersQuery = supabase.from('users').select('id, full_name, role, sucursal_id').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:25:      .select('id, tenant_id, sucursal_id, product_id, service_order_id, movement_type, quantity, created_at, products:product_id (id, sku, name)')
apps/api/src/controllers/reports.ts:30:      ordersQuery = ordersQuery.eq('sucursal_id', effectiveSucursalId);
apps/api/src/controllers/reports.ts:31:      inventoryQuery = inventoryQuery.eq('sucursal_id', effectiveSucursalId);
apps/api/src/controllers/reports.ts:32:      financeQuery = financeQuery.eq('sucursal_id', effectiveSucursalId);
apps/api/src/controllers/reports.ts:33:      usersQuery = usersQuery.eq('sucursal_id', effectiveSucursalId);
apps/api/src/controllers/reports.ts:34:      movementsQuery = movementsQuery.eq('sucursal_id', effectiveSucursalId);
apps/api/src/controllers/reports.ts:125:      const key = String((order as { sucursal_id?: string | null }).sucursal_id ?? 'sin_sucursal');
apps/api/src/controllers/purchase-orders.ts:143:    supabase.from('inventory_movements').select('id, tenant_id, sucursal_id, product_id, purchase_order_id, movement_type, quantity, unit_cost, reference, notes, created_by, created_at').eq('tenant_id', tenantId).eq('purchase_order_id', orderId).order('created_at', { ascending: true }),
apps/api/src/controllers/purchase-orders.ts:161:      .select('id, tenant_id, sucursal_id, supplier_id, related_service_order_id, folio, status, reference, payment_terms, expected_date, subtotal, tax_amount, total, notes, created_at, updated_at')
apps/api/src/controllers/purchase-orders.ts:166:      query = query.eq('sucursal_id', scope.sucursalId);
apps/api/src/controllers/purchase-orders.ts:191:    if (scope?.mode === 'branch' && scope.sucursalId && String((order.data as { sucursal_id?: string | null }).sucursal_id ?? '') !== scope.sucursalId) {
apps/api/src/controllers/purchase-orders.ts:233:        sucursal_id: resolvedSucursalId,
apps/api/src/controllers/purchase-orders.ts:312:    if (body.sucursalId !== undefined) payload.sucursal_id = resolvedSucursalId;
apps/api/src/controllers/purchase-orders.ts:407:    if (scope?.mode === 'branch' && scope.sucursalId && String(order.sucursal_id ?? '') !== scope.sucursalId) {
apps/api/src/controllers/purchase-orders.ts:433:      const orderSucursalId = order.sucursal_id ?? scope?.sucursalId ?? null;
apps/api/src/controllers/purchase-orders.ts:445:        .select('id, tenant_id, sucursal_id, product_id, stock_current')
apps/api/src/controllers/purchase-orders.ts:448:        .eq('sucursal_id', orderSucursalId)
apps/api/src/controllers/purchase-orders.ts:458:            sucursal_id: orderSucursalId,
apps/api/src/controllers/purchase-orders.ts:462:          .select('id, tenant_id, sucursal_id, product_id, stock_current')
apps/api/src/controllers/purchase-orders.ts:473:          sucursal_id: orderSucursalId ?? nextInventory.sucursal_id ?? null,
apps/api/src/controllers/purchase-orders.ts:478:      await refreshInventoryAlert(tenantId, productCatalog.id, orderSucursalId ?? nextInventory.sucursal_id ?? null, nextStock);
apps/api/src/controllers/purchase-orders.ts:483:        sucursal_id: orderSucursalId,
apps/api/src/controllers/orders.ts:133:    scopedQuery = scopedQuery.eq('sucursal_id', branchId);
apps/api/src/controllers/orders.ts:516:          sucursal_id: requestedSucursalId,
apps/api/src/controllers/orders.ts:629:        sucursal_id: requestedSucursalId,
apps/api/src/controllers/orders.ts:814:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts:1045:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts:1129:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts:1233:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts:1328:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/security.ts:148:        sucursal_id: body.sucursalId ?? undefined,
apps/api/src/controllers/security.ts:165:        sucursal_id: body.sucursalId ?? null,
apps/api/src/controllers/security.ts:167:      .select('id, tenant_id, auth_user_id, full_name, email, role, is_active, sucursal_id, created_at')
apps/api/src/controllers/catalogs.ts:89:    .select('id, tenant_id, sucursal_id, product_id, stock_current')
apps/api/src/controllers/catalogs.ts:92:    .eq('sucursal_id', sucursalId)
apps/api/src/controllers/catalogs.ts:105:      .select('id, tenant_id, sucursal_id, product_id, stock_current')
apps/api/src/controllers/catalogs.ts:119:      sucursal_id: sucursalId,
apps/api/src/controllers/catalogs.ts:123:    .select('id, tenant_id, sucursal_id, product_id, stock_current')
apps/api/src/controllers/catalogs.ts:164:      .select('id, tenant_id, sucursal_id, name, phone, email, created_at')
apps/api/src/controllers/catalogs.ts:171:      query = query.eq('sucursal_id', scopedSucursalId);
apps/api/src/controllers/catalogs.ts:192:      sucursal_id: scope?.sucursalId ?? null,
apps/api/src/controllers/catalogs.ts:196:    }]).select('id, tenant_id, sucursal_id, name, phone, email, created_at').single();
apps/api/src/controllers/catalogs.ts:220:      .select('id, tenant_id, sucursal_id, product_id, stock_current, created_at, updated_at, products:product_id (id, sku, name, minimum_stock)')
apps/api/src/controllers/catalogs.ts:226:      query = query.eq('sucursal_id', effectiveSucursalId);
apps/api/src/controllers/catalogs.ts:314:    .select('id, tenant_id, sucursal_id, product_id, stock_current, created_at, products:product_id (id, sku, name, minimum_stock)')
apps/api/src/controllers/catalogs.ts:326:      : (body.sucursalId ?? scope?.sucursalId ?? currentRow.sucursal_id ?? null);
apps/api/src/controllers/catalogs.ts:343:    if (scope?.mode === 'branch' && currentRow.sucursal_id && scope.sucursalId && currentRow.sucursal_id !== scope.sucursalId) {
apps/api/src/controllers/catalogs.ts:362:        sucursal_id: scope?.mode === 'branch' ? (scope.sucursalId ?? currentRow.sucursal_id ?? nextSucursalId) : nextSucursalId,
apps/api/src/controllers/catalogs.ts:366:      .select('id, tenant_id, sucursal_id, product_id, stock_current, created_at, products:product_id (id, sku, name, minimum_stock)')
apps/api/src/controllers/catalogs.ts:378:        sucursal_id: scope?.mode === 'branch' ? (scope.sucursalId ?? currentRow.sucursal_id ?? nextSucursalId) : nextSucursalId,
apps/api/src/controllers/catalogs.ts:391:      await refreshInventoryAlert(tenantId, productRow.id, scope?.mode === 'branch' ? (scope.sucursalId ?? currentRow.sucursal_id ?? nextSucursalId) : nextSucursalId, nextStock);
apps/api/src/controllers/catalogs.ts:413:      .select('id, tenant_id, product_id, stock_current, sucursal_id')
apps/api/src/controllers/catalogs.ts:422:    if (inventoryRow?.sucursal_id && !(await validateSucursalOwnership(supabase, tenantId, inventoryRow.sucursal_id))) {
apps/api/src/controllers/catalogs.ts:430:    if (req.scope?.mode === 'branch' && req.scope.sucursalId && inventoryRow.sucursal_id && inventoryRow.sucursal_id !== req.scope.sucursalId) {
apps/api/src/controllers/catalogs.ts:447:      .select('id, tenant_id, sucursal_id, product_id, service_order_id, purchase_order_id, movement_type, quantity, unit_cost, reference, notes, created_by, created_at')
apps/api/src/controllers/orders.ts.bak.20260603_102231:133:    scopedQuery = scopedQuery.eq('sucursal_id', branchId);
apps/api/src/controllers/orders.ts.bak.20260603_102231:516:          sucursal_id: requestedSucursalId,
apps/api/src/controllers/orders.ts.bak.20260603_102231:629:        sucursal_id: requestedSucursalId,
apps/api/src/controllers/orders.ts.bak.20260603_102231:814:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts.bak.20260603_102231:1045:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts.bak.20260603_102231:1129:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts.bak.20260603_102231:1233:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts.bak.20260603_102231:1328:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/users.ts.bak.20260603_093424:92:    sucursalId: row.sucursal_id ?? row.branch_id ?? null,
apps/api/src/controllers/users.ts.bak.20260603_093424:127:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at', { count: 'exact' })
apps/api/src/controllers/users.ts.bak.20260603_093424:205:        sucursal_id: body.sucursalId ?? undefined,
apps/api/src/controllers/users.ts.bak.20260603_093424:235:          sucursal_id: body.sucursalId ?? null,
apps/api/src/controllers/users.ts.bak.20260603_093424:239:        .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
apps/api/src/controllers/users.ts.bak.20260603_093424:273:        sucursal_id: body.sucursalId ?? null,
apps/api/src/controllers/users.ts.bak.20260603_093424:276:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
apps/api/src/controllers/users.ts.bak.20260603_093424:355:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
apps/api/src/controllers/users.ts.bak.20260603_093424:406:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
apps/api/src/controllers/users.ts.bak.20260603_093424:465:      .select('id, tenant_id, sucursal_id, supplier_id, related_service_order_id, folio, status, reference, payment_terms, expected_date, subtotal, tax_amount, total, notes, created_at, updated_at')
apps/api/src/controllers/users.ts:92:    sucursalId: row.sucursal_id ?? null,
apps/api/src/controllers/users.ts:127:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, created_at, updated_at', { count: 'exact' })
apps/api/src/controllers/users.ts:205:        sucursal_id: body.sucursalId ?? undefined,
apps/api/src/controllers/users.ts:235:          sucursal_id: body.sucursalId ?? null,
apps/api/src/controllers/users.ts:238:        .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, created_at, updated_at')
apps/api/src/controllers/users.ts:272:        sucursal_id: body.sucursalId ?? null,
apps/api/src/controllers/users.ts:274:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, created_at, updated_at')
apps/api/src/controllers/users.ts:353:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, created_at, updated_at')
apps/api/src/controllers/users.ts:404:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, created_at, updated_at')
apps/api/src/controllers/users.ts:463:      .select('id, tenant_id, sucursal_id, supplier_id, related_service_order_id, folio, status, reference, payment_terms, expected_date, subtotal, tax_amount, total, notes, created_at, updated_at')
apps/api/src/controllers/finance.ts:41:      .select('id, tenant_id, sucursal_id, final_cost, created_at, status')
apps/api/src/controllers/finance.ts:46:      .select('id, tenant_id, sucursal_id, balance, income, expense, created_at')
apps/api/src/controllers/finance.ts:75:      ? orders.filter((order) => String((order as { sucursal_id?: string | null }).sucursal_id ?? '') === sucursalId)
apps/api/src/controllers/finance.ts:78:      ? expenses.filter((expense) => String((expense as { sucursal_id?: string | null }).sucursal_id ?? '') === sucursalId)
apps/api/src/controllers/finance.ts:137:    const sucursalOrders = orders.filter((order) => String((order as { sucursal_id?: string | null }).sucursal_id ?? '') === sucursalId);
apps/api/src/controllers/finance.ts:138:    const sucursalExpenses = expenses.filter((expense) => String((expense as { sucursal_id?: string | null }).sucursal_id ?? '') === sucursalId);
apps/api/src/controllers/finance.ts:140:    const grouped = new Map<string, { id: string; tenant_id: string; sucursal_id: string; balance: number; income: number; expense: number; created_at: string }>();
apps/api/src/controllers/finance.ts:144:      const current = grouped.get(day) ?? { id: `${sucursalId}-${day}`, tenant_id: tenantId, sucursal_id: sucursalId, balance: 0, income: 0, expense: 0, created_at: day };
apps/api/src/controllers/finance.ts:153:      const current = grouped.get(day) ?? { id: `${sucursalId}-${day}`, tenant_id: tenantId, sucursal_id: sucursalId, balance: 0, income: 0, expense: 0, created_at: day };
apps/api/src/controllers/finance.ts:191:          sucursal_id: body.sucursalId,
apps/api/src/controllers/finance.ts:233:    if (data?.sucursal_id && !(await assertSucursalOwnership(supabase, tenantId, data.sucursal_id))) {
apps/api/src/controllers/finance.ts:238:    if (scope?.mode === 'branch' && (scope?.sucursalId ?? '') && data.sucursal_id !== scope.sucursalId) {
apps/api/src/controllers/finance.ts:259:      .select('id, sucursal_id')
apps/api/src/controllers/finance.ts:269:    if (scope?.mode === 'branch' && (scope?.sucursalId ?? '') && lookup.data.sucursal_id !== scope.sucursalId) {
apps/api/src/controllers/tasks.ts:118:      query = query.eq('sucursal_id', effectiveSucursalId);
apps/api/src/controllers/tasks.ts:171:      sucursal_id: resolvedSucursalId,
apps/api/src/controllers/tasks.ts:228:      payload.sucursal_id = resolvedSucursalId;
apps/api/src/controllers/procurement.ts:15:      .select('id, tenant_id, product_id, stock_current, sucursal_id, created_at')
apps/api/src/controllers/sucursales.ts:275:      .update({ sucursal_id: sucursalId })
apps/api/src/controllers/sucursales.ts:278:      .select('id, tenant_id, sucursal_id, full_name, email, role, is_active')
apps/api/src/services/stock-alerts.ts:6:  sucursal_id: string | null;
apps/api/src/services/stock-alerts.ts:37:    ? await baseQuery.is('sucursal_id', null).maybeSingle()
apps/api/src/services/stock-alerts.ts:38:    : await baseQuery.eq('sucursal_id', sucursalId).maybeSingle();
apps/api/src/services/stock-alerts.ts:51:      const { error } = sucursalId === null ? await deleteQuery.is('sucursal_id', null) : await deleteQuery.eq('sucursal_id', sucursalId);
apps/api/src/services/stock-alerts.ts:59:    sucursal_id: sucursalId,
apps/api/src/services/stock-alerts.ts:72:      .is('sucursal_id', sucursalId)
apps/api/src/services/stock-alerts.ts:88:    .select('id, tenant_id, sucursal_id, product_id, severity, acknowledged_by, acknowledged_at, created_at')
apps/api/src/services/stock-alerts.ts:92:    query = query.eq('sucursal_id', sucursalId.trim());

## branch_id migraciones
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:4:-- The old branch_id columns remain in place for compatibility during cutover.
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:6:create or replace function public._sync_sucursal_id_from_branch_id()
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:11:  if new.sucursal_id is null and new.branch_id is not null then
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:12:    new.sucursal_id := new.branch_id;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:13:  elsif new.branch_id is null and new.sucursal_id is not null then
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:14:    new.branch_id := new.sucursal_id;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:25:set sucursal_id = branch_id
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:27:  and branch_id is not null;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:44:for each row execute function public._sync_sucursal_id_from_branch_id();
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:51:set sucursal_id = branch_id
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:53:  and branch_id is not null;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:70:for each row execute function public._sync_sucursal_id_from_branch_id();
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:77:set sucursal_id = branch_id
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:79:  and branch_id is not null;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:96:for each row execute function public._sync_sucursal_id_from_branch_id();
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:103:set sucursal_id = branch_id
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:105:  and branch_id is not null;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:122:for each row execute function public._sync_sucursal_id_from_branch_id();
supabase/migrations/20260515110000_restore_users_compat.sql:4:  branch_id uuid,
supabase/migrations/20260530120000_expand_users_admin_module.sql:5:  add column if not exists branch_id uuid,
supabase/migrations/20260530120000_expand_users_admin_module.sql:37:  if new.sucursal_id is null and new.branch_id is not null then
supabase/migrations/20260530120000_expand_users_admin_module.sql:38:    new.sucursal_id := new.branch_id;
supabase/migrations/20260530120000_expand_users_admin_module.sql:39:  elsif new.branch_id is null and new.sucursal_id is not null then
supabase/migrations/20260530120000_expand_users_admin_module.sql:40:    new.branch_id := new.sucursal_id;
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:172:  i.branch_id,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:33:  branch_id uuid,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:94:  branch_id uuid,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:149:      order_sucursal_id := coalesce(new.sucursal_id, new.branch_id);
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:160:          branch_id,
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:5:-- and no client, job, or integration depends on branch_id or public.branches.
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:9:set sucursal_id = coalesce(sucursal_id, branch_id)
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:10:where sucursal_id is null and branch_id is not null;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:13:set sucursal_id = coalesce(sucursal_id, branch_id)
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:14:where sucursal_id is null and branch_id is not null;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:17:set sucursal_id = coalesce(sucursal_id, branch_id)
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:18:where sucursal_id is null and branch_id is not null;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:21:set sucursal_id = coalesce(sucursal_id, branch_id)
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:22:where sucursal_id is null and branch_id is not null;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:32:  drop constraint if exists service_orders_branch_id_fkey;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:35:  drop constraint if exists purchase_orders_branch_id_fkey;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:38:  drop constraint if exists inventory_movements_branch_id_fkey;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:41:  drop constraint if exists stock_alerts_branch_id_fkey;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:45:  drop column if exists branch_id;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:48:  drop column if exists branch_id;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:51:  drop column if exists branch_id;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:54:  drop column if exists branch_id;
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:25:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:61:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:78:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:5:-- and no client, job, or integration depends on branch_id or public.branches.
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:24:  drop constraint if exists service_orders_branch_id_fkey;
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:27:  drop constraint if exists purchase_orders_branch_id_fkey;
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:30:  drop constraint if exists inventory_movements_branch_id_fkey;
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:33:  drop constraint if exists stock_alerts_branch_id_fkey;
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:37:  drop column if exists branch_id;
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:40:  drop column if exists branch_id;
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:43:  drop column if exists branch_id;
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:46:  drop column if exists branch_id;
supabase/migrations/20260527100000_migrate_users_branch_to_sucursal.sql:7:-- Sync data from branch_id to sucursal_id for local/dev databases
supabase/migrations/20260527100000_migrate_users_branch_to_sucursal.sql:9:set sucursal_id = branch_id
supabase/migrations/20260527100000_migrate_users_branch_to_sucursal.sql:11:  and branch_id is not null;
supabase/migrations/20260527100000_migrate_users_branch_to_sucursal.sql:13:-- Drop the old branch_id column from users if it exists
supabase/migrations/20260527100000_migrate_users_branch_to_sucursal.sql:15:  drop column if exists branch_id;
supabase/migrations/20260514133525_remote_schema.sql:420:alter table "public"."branch_inventory" drop constraint "branch_inventory_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:424:alter table "public"."customer_payments" drop constraint "customer_payments_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:430:alter table "public"."expenses" drop constraint "expenses_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:436:alter table "public"."file_assets" drop constraint "file_assets_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:441:alter table "public"."inventory_movements" drop constraint "inventory_movements_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:453:alter table "public"."purchase_orders" drop constraint "purchase_orders_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:464:alter table "public"."service_orders" drop constraint "service_orders_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:468:alter table "public"."service_requests" drop constraint "service_requests_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:471:alter table "public"."stock_alerts" drop constraint "stock_alerts_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:479:alter table "public"."tasks" drop constraint "tasks_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:485:alter table "public"."users" drop constraint "users_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:532:drop index if exists "public"."service_orders_tenant_branch_idx";
supabase/migrations/20260514133525_remote_schema.sql:543:drop index if exists "public"."tasks_tenant_branch_idx";
supabase/migrations/20260514133525_remote_schema.sql:593:alter table "public"."service_orders" drop column "branch_id";
supabase/migrations/20260424_baseline_schema.sql:45:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:76:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:98:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:125:create index if not exists service_orders_tenant_branch_idx
supabase/migrations/20260424_baseline_schema.sql:126:  on public.service_orders (tenant_id, branch_id);
supabase/migrations/20260424_baseline_schema.sql:158:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:172:create index if not exists tasks_tenant_branch_idx on public.tasks (tenant_id, branch_id);
supabase/migrations/20260424_baseline_schema.sql:233:  branch_id uuid not null references public.branches(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:239:  on public.branch_inventory (tenant_id, branch_id, product_id);
supabase/migrations/20260424_baseline_schema.sql:243:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:279:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:296:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:306:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:328:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:344:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:161:  i.branch_id,
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:51:  branch_id uuid,
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:62:create index if not exists inventory_tenant_branch_idx
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:63:  on public.inventory (tenant_id, branch_id);
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:4:-- The old branch_id columns remain in place for compatibility during cutover.
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:6:create or replace function public._sync_sucursal_id_from_branch_id()
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:11:  if new.sucursal_id is null and new.branch_id is not null then
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:12:    new.sucursal_id := new.branch_id;
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:13:  elsif new.branch_id is null and new.sucursal_id is not null then
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:14:    new.branch_id := new.sucursal_id;
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:41:for each row execute function public._sync_sucursal_id_from_branch_id();
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:64:for each row execute function public._sync_sucursal_id_from_branch_id();
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:87:for each row execute function public._sync_sucursal_id_from_branch_id();
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:110:for each row execute function public._sync_sucursal_id_from_branch_id();
supabase/migrations/20260514120000_enable_rls_and_policies.sql:217:  and branch_id::text = auth.jwt() ->> 'sucursal_id'
supabase/migrations/20260514120000_enable_rls_and_policies.sql:226:  and branch_id::text = auth.jwt() ->> 'sucursal_id'
supabase/migrations/20260514120000_enable_rls_and_policies.sql:235:  and branch_id::text = auth.jwt() ->> 'sucursal_id'
supabase/migrations/20260514120000_enable_rls_and_policies.sql:240:  and branch_id::text = auth.jwt() ->> 'sucursal_id'
supabase/migrations/20260514120000_enable_rls_and_policies.sql:249:  and branch_id::text = auth.jwt() ->> 'sucursal_id'
supabase/migrations/20260514150000_add_tenant_onboarding.sql:5:  branch_id uuid,

## sucursal_id migraciones
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:6:create or replace function public._sync_sucursal_id_from_branch_id()
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:11:  if new.sucursal_id is null and new.branch_id is not null then
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:12:    new.sucursal_id := new.branch_id;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:13:  elsif new.branch_id is null and new.sucursal_id is not null then
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:14:    new.branch_id := new.sucursal_id;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:22:  add column if not exists sucursal_id uuid;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:25:set sucursal_id = branch_id
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:26:where sucursal_id is null
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:29:create index if not exists service_orders_tenant_sucursal_idx
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:30:  on public.service_orders (tenant_id, sucursal_id);
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:33:  drop constraint if exists service_orders_sucursal_id_fkey;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:36:  add constraint service_orders_sucursal_id_fkey
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:37:  foreign key (sucursal_id)
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:44:for each row execute function public._sync_sucursal_id_from_branch_id();
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:48:  add column if not exists sucursal_id uuid;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:51:set sucursal_id = branch_id
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:52:where sucursal_id is null
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:55:create index if not exists purchase_orders_tenant_sucursal_idx
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:56:  on public.purchase_orders (tenant_id, sucursal_id);
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:59:  drop constraint if exists purchase_orders_sucursal_id_fkey;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:62:  add constraint purchase_orders_sucursal_id_fkey
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:63:  foreign key (sucursal_id)
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:70:for each row execute function public._sync_sucursal_id_from_branch_id();
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:74:  add column if not exists sucursal_id uuid;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:77:set sucursal_id = branch_id
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:78:where sucursal_id is null
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:81:create index if not exists inventory_movements_tenant_sucursal_idx
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:82:  on public.inventory_movements (tenant_id, sucursal_id, created_at desc);
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:85:  drop constraint if exists inventory_movements_sucursal_id_fkey;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:88:  add constraint inventory_movements_sucursal_id_fkey
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:89:  foreign key (sucursal_id)
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:96:for each row execute function public._sync_sucursal_id_from_branch_id();
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:100:  add column if not exists sucursal_id uuid;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:103:set sucursal_id = branch_id
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:104:where sucursal_id is null
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:107:create index if not exists stock_alerts_tenant_sucursal_idx
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:108:  on public.stock_alerts (tenant_id, sucursal_id);
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:111:  drop constraint if exists stock_alerts_sucursal_id_fkey;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:114:  add constraint stock_alerts_sucursal_id_fkey
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:115:  foreign key (sucursal_id)
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:122:for each row execute function public._sync_sucursal_id_from_branch_id();
supabase/migrations/20260530120000_expand_users_admin_module.sql:4:  add column if not exists sucursal_id uuid references public.sucursales(id) on delete set null,
supabase/migrations/20260530120000_expand_users_admin_module.sql:37:  if new.sucursal_id is null and new.branch_id is not null then
supabase/migrations/20260530120000_expand_users_admin_module.sql:38:    new.sucursal_id := new.branch_id;
supabase/migrations/20260530120000_expand_users_admin_module.sql:39:  elsif new.branch_id is null and new.sucursal_id is not null then
supabase/migrations/20260530120000_expand_users_admin_module.sql:40:    new.branch_id := new.sucursal_id;
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:114:  sucursal_id uuid references public.sucursales(id) on delete set null,
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:124:create index if not exists sucursal_inventory_tenant_sucursal_idx
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:125:  on public.sucursal_inventory (tenant_id, sucursal_id);
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:131:  on public.sucursal_inventory (tenant_id, sucursal_id, product_id);
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:163:  sucursal_id,
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:181:on conflict (tenant_id, sucursal_id, product_id) do update
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:126:  order_sucursal_id uuid;
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:149:      order_sucursal_id := coalesce(new.sucursal_id, new.branch_id);
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:175:          order_sucursal_id,
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:4:-- Run this only after production traffic has fully moved to sucursal_id
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:9:set sucursal_id = coalesce(sucursal_id, branch_id)
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:10:where sucursal_id is null and branch_id is not null;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:13:set sucursal_id = coalesce(sucursal_id, branch_id)
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:14:where sucursal_id is null and branch_id is not null;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:17:set sucursal_id = coalesce(sucursal_id, branch_id)
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:18:where sucursal_id is null and branch_id is not null;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:21:set sucursal_id = coalesce(sucursal_id, branch_id)
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:22:where sucursal_id is null and branch_id is not null;
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:4:-- Run this only after production traffic has fully moved to sucursal_id
supabase/migrations/20260530180000_add_customer_sucursal_id.sql:2:  add column if not exists sucursal_id uuid;
supabase/migrations/20260530180000_add_customer_sucursal_id.sql:4:create index if not exists customers_tenant_sucursal_idx
supabase/migrations/20260530180000_add_customer_sucursal_id.sql:5:  on public.customers (tenant_id, sucursal_id);
supabase/migrations/20260530180000_add_customer_sucursal_id.sql:12:      drop constraint if exists customers_sucursal_id_fkey';
supabase/migrations/20260530180000_add_customer_sucursal_id.sql:16:      add constraint customers_sucursal_id_fkey
supabase/migrations/20260530180000_add_customer_sucursal_id.sql:17:      foreign key (sucursal_id)
supabase/migrations/20260527100000_migrate_users_branch_to_sucursal.sql:3:-- Add sucursal_id to public.users if it does not exist
supabase/migrations/20260527100000_migrate_users_branch_to_sucursal.sql:5:  add column if not exists sucursal_id uuid references public.sucursales(id) on delete set null;
supabase/migrations/20260527100000_migrate_users_branch_to_sucursal.sql:7:-- Sync data from branch_id to sucursal_id for local/dev databases
supabase/migrations/20260527100000_migrate_users_branch_to_sucursal.sql:9:set sucursal_id = branch_id
supabase/migrations/20260527100000_migrate_users_branch_to_sucursal.sql:10:where sucursal_id is null
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:107:  sucursal_id uuid references public.sucursales(id) on delete set null,
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:117:create index if not exists sucursal_inventory_tenant_sucursal_idx
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:118:  on public.sucursal_inventory (tenant_id, sucursal_id);
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:124:  on public.sucursal_inventory (tenant_id, sucursal_id, product_id);
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:152:  sucursal_id,
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:170:on conflict (tenant_id, sucursal_id, product_id) do update
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:71:  sucursal_id uuid,
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:82:create index if not exists finances_tenant_sucursal_idx
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:83:  on public.finances (tenant_id, sucursal_id);
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:6:create or replace function public._sync_sucursal_id_from_branch_id()
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:11:  if new.sucursal_id is null and new.branch_id is not null then
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:12:    new.sucursal_id := new.branch_id;
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:13:  elsif new.branch_id is null and new.sucursal_id is not null then
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:14:    new.branch_id := new.sucursal_id;
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:22:  add column if not exists sucursal_id uuid;
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:26:create index if not exists service_orders_tenant_sucursal_idx
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:27:  on public.service_orders (tenant_id, sucursal_id);
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:30:  drop constraint if exists service_orders_sucursal_id_fkey;
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:33:  add constraint service_orders_sucursal_id_fkey
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:34:  foreign key (sucursal_id)
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:41:for each row execute function public._sync_sucursal_id_from_branch_id();
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:45:  add column if not exists sucursal_id uuid;
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:49:create index if not exists purchase_orders_tenant_sucursal_idx
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:50:  on public.purchase_orders (tenant_id, sucursal_id);
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:53:  drop constraint if exists purchase_orders_sucursal_id_fkey;
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:56:  add constraint purchase_orders_sucursal_id_fkey
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:57:  foreign key (sucursal_id)
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:64:for each row execute function public._sync_sucursal_id_from_branch_id();
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:68:  add column if not exists sucursal_id uuid;
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:72:create index if not exists inventory_movements_tenant_sucursal_idx
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:73:  on public.inventory_movements (tenant_id, sucursal_id, created_at desc);
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:76:  drop constraint if exists inventory_movements_sucursal_id_fkey;
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:79:  add constraint inventory_movements_sucursal_id_fkey
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:80:  foreign key (sucursal_id)
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:87:for each row execute function public._sync_sucursal_id_from_branch_id();
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:91:  add column if not exists sucursal_id uuid;
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:95:create index if not exists stock_alerts_tenant_sucursal_idx
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:96:  on public.stock_alerts (tenant_id, sucursal_id);
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:99:  drop constraint if exists stock_alerts_sucursal_id_fkey;
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:102:  add constraint stock_alerts_sucursal_id_fkey
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:103:  foreign key (sucursal_id)
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:110:for each row execute function public._sync_sucursal_id_from_branch_id();
supabase/migrations/20260514120000_enable_rls_and_policies.sql:217:  and branch_id::text = auth.jwt() ->> 'sucursal_id'
supabase/migrations/20260514120000_enable_rls_and_policies.sql:226:  and branch_id::text = auth.jwt() ->> 'sucursal_id'
supabase/migrations/20260514120000_enable_rls_and_policies.sql:235:  and branch_id::text = auth.jwt() ->> 'sucursal_id'
supabase/migrations/20260514120000_enable_rls_and_policies.sql:240:  and branch_id::text = auth.jwt() ->> 'sucursal_id'
supabase/migrations/20260514120000_enable_rls_and_policies.sql:249:  and branch_id::text = auth.jwt() ->> 'sucursal_id'

## users
apps/api/src/controllers/users.ts:92:    sucursalId: row.sucursal_id ?? null,
apps/api/src/controllers/users.ts:127:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, created_at, updated_at', { count: 'exact' })
apps/api/src/controllers/users.ts:205:        sucursal_id: body.sucursalId ?? undefined,
apps/api/src/controllers/users.ts:235:          sucursal_id: body.sucursalId ?? null,
apps/api/src/controllers/users.ts:238:        .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, created_at, updated_at')
apps/api/src/controllers/users.ts:272:        sucursal_id: body.sucursalId ?? null,
apps/api/src/controllers/users.ts:274:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, created_at, updated_at')
apps/api/src/controllers/users.ts:353:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, created_at, updated_at')
apps/api/src/controllers/users.ts:404:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, created_at, updated_at')
apps/api/src/controllers/users.ts:463:      .select('id, tenant_id, sucursal_id, supplier_id, related_service_order_id, folio, status, reference, payment_terms, expected_date, subtotal, tax_amount, total, notes, created_at, updated_at')
apps/api/src/services/stock-alerts.ts:6:  sucursal_id: string | null;
apps/api/src/services/stock-alerts.ts:37:    ? await baseQuery.is('sucursal_id', null).maybeSingle()
apps/api/src/services/stock-alerts.ts:38:    : await baseQuery.eq('sucursal_id', sucursalId).maybeSingle();
apps/api/src/services/stock-alerts.ts:51:      const { error } = sucursalId === null ? await deleteQuery.is('sucursal_id', null) : await deleteQuery.eq('sucursal_id', sucursalId);
apps/api/src/services/stock-alerts.ts:59:    sucursal_id: sucursalId,
apps/api/src/services/stock-alerts.ts:72:      .is('sucursal_id', sucursalId)
apps/api/src/services/stock-alerts.ts:88:    .select('id, tenant_id, sucursal_id, product_id, severity, acknowledged_by, acknowledged_at, created_at')
apps/api/src/services/stock-alerts.ts:92:    query = query.eq('sucursal_id', sucursalId.trim());

## orders
apps/api/src/controllers/orders.ts:133:    scopedQuery = scopedQuery.eq('sucursal_id', branchId);
apps/api/src/controllers/orders.ts:516:          sucursal_id: requestedSucursalId,
apps/api/src/controllers/orders.ts:629:        sucursal_id: requestedSucursalId,
apps/api/src/controllers/orders.ts:814:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts:1045:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts:1129:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts:1233:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts:1328:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',

## inventory
apps/api/src/controllers/reports.ts:19:    let inventoryQuery = supabase.from('sucursal_inventory').select('id, stock_current, product_id, sucursal_id, products:product_id (id, cost)').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:31:      inventoryQuery = inventoryQuery.eq('sucursal_id', effectiveSucursalId);
apps/api/src/controllers/purchase-orders.ts:143:    supabase.from('inventory_movements').select('id, tenant_id, sucursal_id, product_id, purchase_order_id, movement_type, quantity, unit_cost, reference, notes, created_by, created_at').eq('tenant_id', tenantId).eq('purchase_order_id', orderId).order('created_at', { ascending: true }),
apps/api/src/controllers/purchase-orders.ts:473:          sucursal_id: orderSucursalId ?? nextInventory.sucursal_id ?? null,
apps/api/src/controllers/purchase-orders.ts:478:      await refreshInventoryAlert(tenantId, productCatalog.id, orderSucursalId ?? nextInventory.sucursal_id ?? null, nextStock);
apps/api/src/controllers/catalogs.ts:391:      await refreshInventoryAlert(tenantId, productRow.id, scope?.mode === 'branch' ? (scope.sucursalId ?? currentRow.sucursal_id ?? nextSucursalId) : nextSucursalId, nextStock);
apps/api/src/controllers/catalogs.ts:422:    if (inventoryRow?.sucursal_id && !(await validateSucursalOwnership(supabase, tenantId, inventoryRow.sucursal_id))) {
apps/api/src/controllers/catalogs.ts:430:    if (req.scope?.mode === 'branch' && req.scope.sucursalId && inventoryRow.sucursal_id && inventoryRow.sucursal_id !== req.scope.sucursalId) {
