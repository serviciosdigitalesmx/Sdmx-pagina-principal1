import { supabaseAdmin } from '@white-label/database';

type RequestUser = {
  role?: string;
  email?: string;
  userId?: string;
  sub?: string;
};

type ScopeContext = {
  mode: 'consolidated' | 'branch';
  sucursalId: string | null;
};

type ServiceOrderRow = {
  id: string;
  tenant_id: string;
  sucursal_id: string | null;
  assigned_user_id: string | null;
  status: string | null;
  estimated_cost: number | string | null;
  final_cost: number | string | null;
};

type WorkLogRow = {
  id: string;
  tenant_id: string;
  service_order_id: string;
  technician_user_id: string;
  sucursal_id: string | null;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  started_at: string;
  paused_at: string | null;
  ended_at: string | null;
  paused_minutes: number;
  duration_minutes: number | null;
  result: string | null;
  notes: string | null;
  commission_status: 'not_configured' | 'calculated' | 'pending_cost' | 'cancelled';
  commission_rule_id: string | null;
  commission_amount: number | string | null;
  commission_snapshot: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

type CommissionRuleRow = {
  id: string;
  tenant_id: string;
  name: string;
  active: boolean;
  priority: number;
  basis: 'none' | 'fixed_per_work_log' | 'per_hour' | 'percent_estimated_cost' | 'percent_final_cost';
  rate_percent: number | string | null;
  fixed_amount: number | string | null;
  hourly_amount: number | string | null;
  valid_from: string;
  valid_until: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export class WorkLogError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.name = 'WorkLogError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

function isUuid(value: unknown) {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function getActorId(user?: RequestUser | null) {
  if (isUuid(user?.userId)) return user?.userId ?? null;
  if (isUuid(user?.sub)) return user?.sub ?? null;
  return null;
}

function getActorName(user?: RequestUser | null) {
  return user?.email ?? user?.role ?? 'system';
}

function toNumber(value: number | string | null | undefined) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeMoney(value: number) {
  return Math.round(value * 100) / 100;
}

function diffMinutes(from: string | null | undefined, to: Date) {
  if (!from) return 0;
  const started = new Date(from).getTime();
  if (!Number.isFinite(started)) return 0;
  return Math.max(0, Math.floor((to.getTime() - started) / 60000));
}

function normalizeWorkLog(row: WorkLogRow) {
  return {
    id: row.id,
    serviceOrderId: row.service_order_id,
    technicianUserId: row.technician_user_id,
    sucursalId: row.sucursal_id,
    status: row.status,
    startedAt: row.started_at,
    pausedAt: row.paused_at,
    endedAt: row.ended_at,
    durationMinutes: row.duration_minutes,
    pausedMinutes: row.paused_minutes,
    result: row.result,
    notes: row.notes,
    commissionStatus: row.commission_status,
    commissionAmount: row.commission_amount == null ? null : Number(row.commission_amount),
    commissionRuleId: row.commission_rule_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function normalizeRule(row: CommissionRuleRow) {
  return {
    id: row.id,
    name: row.name,
    active: row.active,
    priority: row.priority,
    basis: row.basis,
    ratePercent: row.rate_percent == null ? null : Number(row.rate_percent),
    fixedAmount: row.fixed_amount == null ? null : Number(row.fixed_amount),
    hourlyAmount: row.hourly_amount == null ? null : Number(row.hourly_amount),
    validFrom: row.valid_from,
    validUntil: row.valid_until,
    metadata: row.metadata ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function loadOrder(params: { tenantId: string; orderId: string; user?: RequestUser | null; scope?: ScopeContext | null }) {
  let query = supabaseAdmin
    .from('service_orders')
    .select('id, tenant_id, sucursal_id, assigned_user_id, status, estimated_cost, final_cost')
    .eq('tenant_id', params.tenantId)
    .eq('id', params.orderId);

  if (params.scope?.mode === 'branch' && isUuid(params.scope.sucursalId)) {
    query = query.eq('sucursal_id', params.scope.sucursalId);
  }

  if (params.user?.role === 'technician' && isUuid(params.user.userId)) {
    query = query.eq('assigned_user_id', params.user.userId);
  }

  const { data, error } = await query.maybeSingle();
  if (error) throw new WorkLogError(502, 'Failed to load order', error.message);
  if (!data) throw new WorkLogError(404, 'Order not found');

  return data as ServiceOrderRow;
}

async function loadWorkLog(params: { tenantId: string; orderId: string; workLogId: string; user?: RequestUser | null }) {
  const { data, error } = await supabaseAdmin
    .from('work_logs')
    .select('*')
    .eq('tenant_id', params.tenantId)
    .eq('service_order_id', params.orderId)
    .eq('id', params.workLogId)
    .maybeSingle();

  if (error) throw new WorkLogError(502, 'Failed to load work log', error.message);
  if (!data) throw new WorkLogError(404, 'Work log not found');

  const row = data as WorkLogRow;
  if (params.user?.role === 'technician' && row.technician_user_id !== params.user.userId) {
    throw new WorkLogError(403, 'Technician can only operate own work logs');
  }

  return row;
}

async function insertEvent(params: {
  tenantId: string;
  workLogId: string;
  orderId: string;
  eventType: 'started' | 'paused' | 'resumed' | 'stopped' | 'cancelled' | 'corrected' | 'approved';
  previousStatus?: string | null;
  newStatus?: string | null;
  note?: string | null;
  user?: RequestUser | null;
  snapshot?: Record<string, unknown>;
}) {
  const { error } = await supabaseAdmin.from('work_log_events').insert([{
    tenant_id: params.tenantId,
    work_log_id: params.workLogId,
    service_order_id: params.orderId,
    event_type: params.eventType,
    previous_status: params.previousStatus ?? null,
    new_status: params.newStatus ?? null,
    note: params.note ?? null,
    actor_user_id: getActorId(params.user),
    actor_name: getActorName(params.user),
    snapshot: params.snapshot ?? {},
  }]);

  if (error) {
    throw new WorkLogError(502, 'Failed to persist work log event', error.message);
  }
}

function resolveTechnicianId(params: { user?: RequestUser | null; requestedTechnicianUserId?: string | null; order: ServiceOrderRow }) {
  if (params.user?.role === 'technician') {
    if (!isUuid(params.user.userId)) {
      throw new WorkLogError(403, 'Technician user id is required');
    }
    return params.user.userId;
  }

  if (isUuid(params.requestedTechnicianUserId)) return params.requestedTechnicianUserId;
  if (isUuid(params.order.assigned_user_id)) return params.order.assigned_user_id;
  if (isUuid(params.user?.userId)) return params.user?.userId ?? null;

  throw new WorkLogError(400, 'technicianUserId is required');
}

async function getActiveCommissionRule(tenantId: string, nowIso: string) {
  const { data, error } = await supabaseAdmin
    .from('technician_commission_rules')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('active', true)
    .lte('valid_from', nowIso)
    .or(`valid_until.is.null,valid_until.gt.${nowIso}`)
    .order('priority', { ascending: false })
    .order('valid_from', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new WorkLogError(502, 'Failed to load commission rule', error.message);
  return (data as CommissionRuleRow | null) ?? null;
}

function calculateCommission(params: { rule: CommissionRuleRow | null; order: ServiceOrderRow; durationMinutes: number }) {
  const { rule, order, durationMinutes } = params;
  if (!rule || rule.basis === 'none') {
    return { status: 'not_configured' as const, amount: null, ruleId: null, snapshot: null };
  }

  const snapshot = {
    id: rule.id,
    name: rule.name,
    basis: rule.basis,
    priority: rule.priority,
    ratePercent: rule.rate_percent,
    fixedAmount: rule.fixed_amount,
    hourlyAmount: rule.hourly_amount,
    validFrom: rule.valid_from,
    validUntil: rule.valid_until,
  };

  if (rule.basis === 'fixed_per_work_log') {
    return { status: 'calculated' as const, amount: normalizeMoney(toNumber(rule.fixed_amount)), ruleId: rule.id, snapshot };
  }

  if (rule.basis === 'per_hour') {
    const amount = (durationMinutes / 60) * toNumber(rule.hourly_amount);
    return { status: 'calculated' as const, amount: normalizeMoney(amount), ruleId: rule.id, snapshot };
  }

  if (rule.basis === 'percent_estimated_cost') {
    const base = toNumber(order.estimated_cost);
    if (base <= 0) return { status: 'pending_cost' as const, amount: null, ruleId: rule.id, snapshot };
    return { status: 'calculated' as const, amount: normalizeMoney(base * (toNumber(rule.rate_percent) / 100)), ruleId: rule.id, snapshot };
  }

  if (rule.basis === 'percent_final_cost') {
    const base = toNumber(order.final_cost);
    if (base <= 0) return { status: 'pending_cost' as const, amount: null, ruleId: rule.id, snapshot };
    return { status: 'calculated' as const, amount: normalizeMoney(base * (toNumber(rule.rate_percent) / 100)), ruleId: rule.id, snapshot };
  }

  return { status: 'not_configured' as const, amount: null, ruleId: null, snapshot: null };
}

export async function startWorkLog(params: {
  tenantId: string;
  orderId: string;
  technicianUserId?: string | null;
  notes?: string | null;
  user?: RequestUser | null;
  scope?: ScopeContext | null;
}) {
  const order = await loadOrder({ tenantId: params.tenantId, orderId: params.orderId, user: params.user, scope: params.scope });
  const technicianUserId = resolveTechnicianId({ user: params.user, requestedTechnicianUserId: params.technicianUserId, order });

  const { data, error } = await supabaseAdmin
    .from('work_logs')
    .insert([{
      tenant_id: params.tenantId,
      service_order_id: order.id,
      technician_user_id: technicianUserId,
      sucursal_id: order.sucursal_id,
      status: 'active',
      notes: params.notes ?? null,
      created_by: getActorId(params.user),
      updated_by: getActorId(params.user),
    }])
    .select('*')
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new WorkLogError(409, 'Technician already has an active or paused work log');
    }
    throw new WorkLogError(502, 'Failed to start work log', error.message);
  }

  const row = data as WorkLogRow;
  await insertEvent({
    tenantId: params.tenantId,
    workLogId: row.id,
    orderId: order.id,
    eventType: 'started',
    newStatus: row.status,
    note: params.notes ?? null,
    user: params.user,
    snapshot: normalizeWorkLog(row),
  });

  return normalizeWorkLog(row);
}

export async function pauseWorkLog(params: {
  tenantId: string;
  orderId: string;
  workLogId: string;
  note?: string | null;
  user?: RequestUser | null;
  scope?: ScopeContext | null;
}) {
  await loadOrder({ tenantId: params.tenantId, orderId: params.orderId, user: params.user, scope: params.scope });
  const current = await loadWorkLog({ tenantId: params.tenantId, orderId: params.orderId, workLogId: params.workLogId, user: params.user });

  if (current.status !== 'active') {
    throw new WorkLogError(409, 'Only active work logs can be paused');
  }

  const { data, error } = await supabaseAdmin
    .from('work_logs')
    .update({
      status: 'paused',
      paused_at: new Date().toISOString(),
      updated_by: getActorId(params.user),
      updated_at: new Date().toISOString(),
    })
    .eq('tenant_id', params.tenantId)
    .eq('id', current.id)
    .select('*')
    .single();

  if (error) throw new WorkLogError(502, 'Failed to pause work log', error.message);
  const row = data as WorkLogRow;

  await insertEvent({
    tenantId: params.tenantId,
    workLogId: row.id,
    orderId: params.orderId,
    eventType: 'paused',
    previousStatus: current.status,
    newStatus: row.status,
    note: params.note ?? null,
    user: params.user,
    snapshot: normalizeWorkLog(row),
  });

  return normalizeWorkLog(row);
}

export async function resumeWorkLog(params: {
  tenantId: string;
  orderId: string;
  workLogId: string;
  note?: string | null;
  user?: RequestUser | null;
  scope?: ScopeContext | null;
}) {
  await loadOrder({ tenantId: params.tenantId, orderId: params.orderId, user: params.user, scope: params.scope });
  const current = await loadWorkLog({ tenantId: params.tenantId, orderId: params.orderId, workLogId: params.workLogId, user: params.user });

  if (current.status !== 'paused') {
    throw new WorkLogError(409, 'Only paused work logs can be resumed');
  }

  const now = new Date();
  const pausedMinutes = current.paused_minutes + diffMinutes(current.paused_at, now);
  const { data, error } = await supabaseAdmin
    .from('work_logs')
    .update({
      status: 'active',
      paused_at: null,
      paused_minutes: pausedMinutes,
      updated_by: getActorId(params.user),
      updated_at: now.toISOString(),
    })
    .eq('tenant_id', params.tenantId)
    .eq('id', current.id)
    .select('*')
    .single();

  if (error) throw new WorkLogError(502, 'Failed to resume work log', error.message);
  const row = data as WorkLogRow;

  await insertEvent({
    tenantId: params.tenantId,
    workLogId: row.id,
    orderId: params.orderId,
    eventType: 'resumed',
    previousStatus: current.status,
    newStatus: row.status,
    note: params.note ?? null,
    user: params.user,
    snapshot: normalizeWorkLog(row),
  });

  return normalizeWorkLog(row);
}

export async function stopWorkLog(params: {
  tenantId: string;
  orderId: string;
  workLogId: string;
  result?: string | null;
  notes?: string | null;
  user?: RequestUser | null;
  scope?: ScopeContext | null;
}) {
  const order = await loadOrder({ tenantId: params.tenantId, orderId: params.orderId, user: params.user, scope: params.scope });
  const current = await loadWorkLog({ tenantId: params.tenantId, orderId: params.orderId, workLogId: params.workLogId, user: params.user });

  if (!['active', 'paused'].includes(current.status)) {
    throw new WorkLogError(409, 'Only active or paused work logs can be stopped');
  }

  const now = new Date();
  const pausedMinutes = current.paused_minutes + (current.status === 'paused' ? diffMinutes(current.paused_at, now) : 0);
  const totalMinutes = diffMinutes(current.started_at, now);
  const durationMinutes = Math.max(0, totalMinutes - pausedMinutes);
  const rule = await getActiveCommissionRule(params.tenantId, now.toISOString());
  const commission = calculateCommission({ rule, order, durationMinutes });

  const { data, error } = await supabaseAdmin
    .from('work_logs')
    .update({
      status: 'completed',
      paused_at: null,
      ended_at: now.toISOString(),
      paused_minutes: pausedMinutes,
      duration_minutes: durationMinutes,
      result: params.result ?? null,
      notes: params.notes ?? current.notes,
      commission_status: commission.status,
      commission_rule_id: commission.ruleId,
      commission_amount: commission.amount,
      commission_snapshot: commission.snapshot,
      updated_by: getActorId(params.user),
      updated_at: now.toISOString(),
    })
    .eq('tenant_id', params.tenantId)
    .eq('id', current.id)
    .select('*')
    .single();

  if (error) throw new WorkLogError(502, 'Failed to stop work log', error.message);
  const row = data as WorkLogRow;

  await insertEvent({
    tenantId: params.tenantId,
    workLogId: row.id,
    orderId: params.orderId,
    eventType: 'stopped',
    previousStatus: current.status,
    newStatus: row.status,
    note: params.notes ?? null,
    user: params.user,
    snapshot: normalizeWorkLog(row),
  });

  return normalizeWorkLog(row);
}

export async function listOrderWorkLogs(params: {
  tenantId: string;
  orderId: string;
  user?: RequestUser | null;
  scope?: ScopeContext | null;
}) {
  await loadOrder({ tenantId: params.tenantId, orderId: params.orderId, user: params.user, scope: params.scope });

  let query = supabaseAdmin
    .from('work_logs')
    .select('*')
    .eq('tenant_id', params.tenantId)
    .eq('service_order_id', params.orderId)
    .order('started_at', { ascending: false });

  if (params.user?.role === 'technician' && isUuid(params.user.userId)) {
    query = query.eq('technician_user_id', params.user.userId);
  }

  const { data, error } = await query;
  if (error) throw new WorkLogError(502, 'Failed to list work logs', error.message);

  return ((data as WorkLogRow[] | null) ?? []).map(normalizeWorkLog);
}

export async function listCommissionRules(tenantId: string) {
  const { data, error } = await supabaseAdmin
    .from('technician_commission_rules')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('priority', { ascending: false })
    .order('valid_from', { ascending: false });

  if (error) throw new WorkLogError(502, 'Failed to list commission rules', error.message);
  return ((data as CommissionRuleRow[] | null) ?? []).map(normalizeRule);
}

export async function createCommissionRule(params: {
  tenantId: string;
  name: string;
  basis: CommissionRuleRow['basis'];
  ratePercent?: number | null;
  fixedAmount?: number | null;
  hourlyAmount?: number | null;
  priority?: number | null;
  active?: boolean | null;
  user?: RequestUser | null;
}) {
  const { data, error } = await supabaseAdmin
    .from('technician_commission_rules')
    .insert([{
      tenant_id: params.tenantId,
      name: params.name,
      basis: params.basis,
      rate_percent: params.ratePercent ?? null,
      fixed_amount: params.fixedAmount ?? null,
      hourly_amount: params.hourlyAmount ?? null,
      priority: params.priority ?? 0,
      active: params.active ?? true,
      created_by: getActorId(params.user),
      updated_by: getActorId(params.user),
    }])
    .select('*')
    .single();

  if (error) throw new WorkLogError(502, 'Failed to create commission rule', error.message);
  return normalizeRule(data as CommissionRuleRow);
}

export async function updateCommissionRule(params: {
  tenantId: string;
  ruleId: string;
  patch: Partial<{
    name: string;
    basis: CommissionRuleRow['basis'];
    ratePercent: number | null;
    fixedAmount: number | null;
    hourlyAmount: number | null;
    priority: number;
    active: boolean;
  }>;
  user?: RequestUser | null;
}) {
  const updatePayload: Record<string, unknown> = {
    updated_by: getActorId(params.user),
    updated_at: new Date().toISOString(),
  };

  if (params.patch.name !== undefined) updatePayload.name = params.patch.name;
  if (params.patch.basis !== undefined) updatePayload.basis = params.patch.basis;
  if (params.patch.ratePercent !== undefined) updatePayload.rate_percent = params.patch.ratePercent;
  if (params.patch.fixedAmount !== undefined) updatePayload.fixed_amount = params.patch.fixedAmount;
  if (params.patch.hourlyAmount !== undefined) updatePayload.hourly_amount = params.patch.hourlyAmount;
  if (params.patch.priority !== undefined) updatePayload.priority = params.patch.priority;
  if (params.patch.active !== undefined) updatePayload.active = params.patch.active;

  const { data, error } = await supabaseAdmin
    .from('technician_commission_rules')
    .update(updatePayload)
    .eq('tenant_id', params.tenantId)
    .eq('id', params.ruleId)
    .select('*')
    .maybeSingle();

  if (error) throw new WorkLogError(502, 'Failed to update commission rule', error.message);
  if (!data) throw new WorkLogError(404, 'Commission rule not found');

  return normalizeRule(data as CommissionRuleRow);
}
