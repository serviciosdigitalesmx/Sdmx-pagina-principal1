import { getTenantClient } from '@white-label/database';

const MAX_WORK_LOG_ROWS = 5000;

type WorkLogStatus = 'active' | 'paused' | 'completed' | 'cancelled';

type ScopeContext = {
  mode?: 'consolidated' | 'branch';
  sucursalId?: string | null;
};

type WorkLogRow = {
  id: string;
  service_order_id: string;
  technician_user_id: string;
  sucursal_id: string | null;
  status: WorkLogStatus;
  started_at: string;
  paused_at: string | null;
  ended_at: string | null;
  paused_minutes: number | string | null;
  duration_minutes: number | string | null;
  commission_status: 'not_configured' | 'calculated' | 'pending_cost' | 'cancelled';
  commission_amount: number | string | null;
};

type UserRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
};

type SucursalRow = {
  id: string;
  name: string | null;
};

type Aggregate = {
  totalLogs: number;
  completedLogs: number;
  activeLogs: number;
  pausedLogs: number;
  cancelledLogs: number;
  totalDurationMinutes: number;
  totalPausedMinutes: number;
  logsWithoutDuration: number;
  informativeCommissionTotal: number;
  pendingCostCommissionCount: number;
  notConfiguredCommissionCount: number;
  orderIds: Set<string>;
};

export class ProductivityReportError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.name = 'ProductivityReportError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

function isUuid(value: string | null | undefined) {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function numberOrNull(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function roundTwo(value: number) {
  return Math.round(value * 100) / 100;
}

function minutesBetween(from: string, to: Date) {
  const started = new Date(from).getTime();
  if (!Number.isFinite(started)) return 0;
  return Math.max(0, Math.floor((to.getTime() - started) / 60000));
}

function emptyAggregate(): Aggregate {
  return {
    totalLogs: 0,
    completedLogs: 0,
    activeLogs: 0,
    pausedLogs: 0,
    cancelledLogs: 0,
    totalDurationMinutes: 0,
    totalPausedMinutes: 0,
    logsWithoutDuration: 0,
    informativeCommissionTotal: 0,
    pendingCostCommissionCount: 0,
    notConfiguredCommissionCount: 0,
    orderIds: new Set<string>(),
  };
}

function addWorkLogToAggregate(aggregate: Aggregate, row: WorkLogRow) {
  aggregate.totalLogs += 1;
  if (row.status === 'completed') aggregate.completedLogs += 1;
  if (row.status === 'active') aggregate.activeLogs += 1;
  if (row.status === 'paused') aggregate.pausedLogs += 1;
  if (row.status === 'cancelled') aggregate.cancelledLogs += 1;

  if (row.service_order_id) aggregate.orderIds.add(row.service_order_id);

  const pausedMinutes = numberOrNull(row.paused_minutes);
  if (pausedMinutes !== null && pausedMinutes > 0) aggregate.totalPausedMinutes += pausedMinutes;

  const durationMinutes = numberOrNull(row.duration_minutes);
  if (row.status === 'completed') {
    if (durationMinutes !== null && durationMinutes >= 0) {
      aggregate.totalDurationMinutes += durationMinutes;
    } else {
      aggregate.logsWithoutDuration += 1;
    }
  }

  const commissionAmount = numberOrNull(row.commission_amount);
  if (commissionAmount !== null) aggregate.informativeCommissionTotal += commissionAmount;
  if (row.commission_status === 'pending_cost') aggregate.pendingCostCommissionCount += 1;
  if (row.commission_status === 'not_configured') aggregate.notConfiguredCommissionCount += 1;
}

function serializeSummary(aggregate: Aggregate, distinctTechnicians: number, truncated: boolean) {
  const completedWithDuration = Math.max(0, aggregate.completedLogs - aggregate.logsWithoutDuration);
  const averageDurationMinutes = completedWithDuration > 0
    ? aggregate.totalDurationMinutes / completedWithDuration
    : 0;

  return {
    totalLogs: aggregate.totalLogs,
    completedLogs: aggregate.completedLogs,
    activeLogs: aggregate.activeLogs,
    pausedLogs: aggregate.pausedLogs,
    cancelledLogs: aggregate.cancelledLogs,
    totalDurationMinutes: aggregate.totalDurationMinutes,
    totalDurationHours: roundTwo(aggregate.totalDurationMinutes / 60),
    averageDurationMinutes: roundTwo(averageDurationMinutes),
    totalPausedMinutes: aggregate.totalPausedMinutes,
    logsWithoutDuration: aggregate.logsWithoutDuration,
    distinctTechnicians,
    distinctOrders: aggregate.orderIds.size,
    informativeCommissionTotal: roundTwo(aggregate.informativeCommissionTotal),
    calculatedCommissionTotal: roundTwo(aggregate.informativeCommissionTotal),
    pendingCostCommissionCount: aggregate.pendingCostCommissionCount,
    notConfiguredCommissionCount: aggregate.notConfiguredCommissionCount,
    truncated,
  };
}

function displayUser(row: UserRow | undefined, userId: string) {
  return row?.full_name?.trim() || row?.email?.trim() || userId;
}

function serializeTechnicianAggregate(userId: string, aggregate: Aggregate, usersById: Map<string, UserRow>) {
  const completedWithDuration = Math.max(0, aggregate.completedLogs - aggregate.logsWithoutDuration);
  const averageDurationMinutes = completedWithDuration > 0
    ? aggregate.totalDurationMinutes / completedWithDuration
    : 0;

  return {
    technicianUserId: userId,
    technicianName: displayUser(usersById.get(userId), userId),
    totalLogs: aggregate.totalLogs,
    completedLogs: aggregate.completedLogs,
    activeLogs: aggregate.activeLogs,
    pausedLogs: aggregate.pausedLogs,
    totalDurationMinutes: aggregate.totalDurationMinutes,
    totalDurationHours: roundTwo(aggregate.totalDurationMinutes / 60),
    averageDurationMinutes: roundTwo(averageDurationMinutes),
    distinctOrders: aggregate.orderIds.size,
    informativeCommissionTotal: roundTwo(aggregate.informativeCommissionTotal),
    pendingCostCommissionCount: aggregate.pendingCostCommissionCount,
  };
}

function serializeSucursalAggregate(sucursalId: string, aggregate: Aggregate, sucursalesById: Map<string, SucursalRow>) {
  const normalizedSucursalId = sucursalId === 'sin_sucursal' ? null : sucursalId;
  return {
    sucursalId: normalizedSucursalId,
    sucursalName: normalizedSucursalId ? sucursalesById.get(normalizedSucursalId)?.name?.trim() || normalizedSucursalId : 'Sin sucursal',
    totalLogs: aggregate.totalLogs,
    completedLogs: aggregate.completedLogs,
    activeLogs: aggregate.activeLogs,
    pausedLogs: aggregate.pausedLogs,
    totalDurationMinutes: aggregate.totalDurationMinutes,
    totalDurationHours: roundTwo(aggregate.totalDurationMinutes / 60),
    informativeCommissionTotal: roundTwo(aggregate.informativeCommissionTotal),
  };
}

export async function getProductivityReport(params: {
  tenantId: string;
  from: Date;
  to: Date;
  sucursalId?: string | null;
  technicianUserId?: string | null;
  status: WorkLogStatus | 'all';
  scope?: ScopeContext | null;
}) {
  if (params.scope?.mode === 'branch' && !isUuid(params.scope.sucursalId)) {
    throw new ProductivityReportError(403, 'Sucursal scope is required');
  }

  const effectiveSucursalId = params.scope?.mode === 'branch'
    ? params.scope.sucursalId ?? null
    : params.sucursalId ?? null;

  const supabase = getTenantClient(params.tenantId);
  let query = supabase
    .from('work_logs')
    .select('id, service_order_id, technician_user_id, sucursal_id, status, started_at, paused_at, ended_at, paused_minutes, duration_minutes, commission_status, commission_amount')
    .eq('tenant_id', params.tenantId)
    .gte('started_at', params.from.toISOString())
    .lte('started_at', params.to.toISOString())
    .order('started_at', { ascending: false })
    .limit(MAX_WORK_LOG_ROWS + 1);

  if (effectiveSucursalId) query = query.eq('sucursal_id', effectiveSucursalId);
  if (params.technicianUserId) query = query.eq('technician_user_id', params.technicianUserId);
  if (params.status !== 'all') query = query.eq('status', params.status);

  const { data, error } = await query;
  if (error) throw new ProductivityReportError(502, 'Failed to load productivity report', error.message);

  const fetchedRows = ((data as WorkLogRow[] | null) ?? []);
  const truncated = fetchedRows.length > MAX_WORK_LOG_ROWS;
  const rows = truncated ? fetchedRows.slice(0, MAX_WORK_LOG_ROWS) : fetchedRows;

  const technicianIds = [...new Set(rows.map((row) => row.technician_user_id).filter(isUuid))];
  const sucursalIds = [...new Set(rows.map((row) => row.sucursal_id).filter(isUuid))];

  const [usersResult, sucursalesResult] = await Promise.all([
    technicianIds.length > 0
      ? supabase.from('users').select('id, full_name, email, role').eq('tenant_id', params.tenantId).in('id', technicianIds)
      : Promise.resolve({ data: [], error: null }),
    sucursalIds.length > 0
      ? supabase.from('sucursales').select('id, name').eq('tenant_id', params.tenantId).in('id', sucursalIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (usersResult.error) throw new ProductivityReportError(502, 'Failed to load productivity users', usersResult.error.message);
  if (sucursalesResult.error) throw new ProductivityReportError(502, 'Failed to load productivity sucursales', sucursalesResult.error.message);

  const usersById = new Map(((usersResult.data as UserRow[] | null) ?? []).map((row) => [row.id, row]));
  const sucursalesById = new Map(((sucursalesResult.data as SucursalRow[] | null) ?? []).map((row) => [row.id, row]));
  const summary = emptyAggregate();
  const technicianAggregates = new Map<string, Aggregate>();
  const sucursalAggregates = new Map<string, Aggregate>();

  for (const row of rows) {
    addWorkLogToAggregate(summary, row);

    const technicianAggregate = technicianAggregates.get(row.technician_user_id) ?? emptyAggregate();
    addWorkLogToAggregate(technicianAggregate, row);
    technicianAggregates.set(row.technician_user_id, technicianAggregate);

    const sucursalKey = row.sucursal_id ?? 'sin_sucursal';
    const sucursalAggregate = sucursalAggregates.get(sucursalKey) ?? emptyAggregate();
    addWorkLogToAggregate(sucursalAggregate, row);
    sucursalAggregates.set(sucursalKey, sucursalAggregate);
  }

  const now = new Date();
  const openLogs = rows
    .filter((row) => row.status === 'active' || row.status === 'paused')
    .slice(0, 50)
    .map((row) => ({
      id: row.id,
      serviceOrderId: row.service_order_id,
      technicianUserId: row.technician_user_id,
      technicianName: displayUser(usersById.get(row.technician_user_id), row.technician_user_id),
      sucursalId: row.sucursal_id,
      status: row.status,
      startedAt: row.started_at,
      pausedAt: row.paused_at,
      ageMinutes: minutesBetween(row.started_at, now),
    }));

  return {
    period: {
      from: params.from.toISOString(),
      to: params.to.toISOString(),
    },
    filters: {
      sucursalId: effectiveSucursalId,
      technicianUserId: params.technicianUserId ?? null,
      status: params.status,
    },
    summary: serializeSummary(summary, technicianAggregates.size, truncated),
    byTechnician: [...technicianAggregates.entries()]
      .map(([userId, aggregate]) => serializeTechnicianAggregate(userId, aggregate, usersById))
      .sort((left, right) => right.totalDurationMinutes - left.totalDurationMinutes),
    bySucursal: [...sucursalAggregates.entries()]
      .map(([sucursalId, aggregate]) => serializeSucursalAggregate(sucursalId, aggregate, sucursalesById))
      .sort((left, right) => right.totalDurationMinutes - left.totalDurationMinutes),
    openLogs,
    notes: [
      'Las comisiones son informativas y no representan pagos.',
    ],
    truncated,
  };
}
