import type { TenantRuntimeConfig, TenantSemaphoreRule, TenantWorkflowStatus } from '@white-label/types';

type OrderLike = Record<string, unknown> & {
  id?: string;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  received_at?: string | null;
  completed_at?: string | null;
  delivered_at?: string | null;
  promised_date?: string | null;
  scheduled_at?: string | null;
  due_at?: string | null;
  metadata?: Record<string, unknown> | null;
};

type RiskColor = 'green' | 'yellow' | 'red' | 'gray';

export type OperationalRisk = {
  color: RiskColor;
  reason: string;
  suggested_action: string;
  elapsed_minutes: number | null;
  rule_applied: string | null;
  priority: number;
};

function toMinutes(diffMs: number) {
  return Math.max(0, Math.floor(diffMs / 60000));
}

function parseDate(value: unknown) {
  if (typeof value !== 'string' && typeof value !== 'number' && !(value instanceof Date)) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function resolveStatusKey(status?: string | null) {
  const value = String(status ?? '').toLowerCase();
  if (value.includes('diag')) return 'diagnostico';
  if (value.includes('autoriz')) return 'autorizado';
  if (value.includes('repar')) return 'reparacion';
  if (value.includes('list')) return 'listo';
  if (value.includes('entreg')) return 'entregado';
  if (value.includes('cerr')) return 'cerrado';
  if (value.includes('cancel')) return 'cancelado';
  if (value.includes('visita')) return 'visita_programada';
  if (value.includes('solicit')) return 'solicitud_recibida';
  if (value.includes('cotiz')) return 'cotizacion_enviada';
  if (value.includes('program')) return 'servicio_programado';
  if (value.includes('realiz')) return 'servicio_realizado';
  return value || 'recibido';
}

function resolveStatusChangedAt(order: OrderLike, statusEvents?: Array<{ created_at?: string | null; new_status?: string | null }>) {
  const lastEvent = statusEvents?.filter((entry) => resolveStatusKey(entry.new_status)).slice(-1)[0] ?? null;
  const eventDate = lastEvent ? parseDate(lastEvent.created_at) : null;
  return eventDate
    ?? parseDate(order.delivered_at)
    ?? parseDate(order.completed_at)
    ?? parseDate(order.received_at)
    ?? parseDate(order.updated_at)
    ?? parseDate(order.created_at);
}

function resolveRelevantDate(order: OrderLike) {
  return parseDate(order.scheduled_at) ?? parseDate(order.due_at) ?? parseDate(order.promised_date) ?? null;
}

function interpolate(template: string, variables: Record<string, string | number | boolean | null | undefined>) {
  return template.replace(/{{\s*([a-zA-Z0-9_.-]+)\s*}}/g, (_match, key: string) => {
    const value = variables[key];
    return value === undefined || value === null ? '' : String(value);
  });
}

function pickRule(
  rules: TenantSemaphoreRule[],
  statusKey: string,
  workflowKey: string,
  industryKey?: string | null,
) {
  const filtered = rules
    .filter((rule) => rule.enabled !== false)
    .filter((rule) => rule.status_key === statusKey)
    .filter((rule) => !rule.workflow_key || rule.workflow_key === workflowKey)
    .filter((rule) => !rule.industry_key || !industryKey || rule.industry_key === industryKey)
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  return filtered[0] ?? null;
}

function resolveElapsedMinutes(order: OrderLike, metric: TenantSemaphoreRule['metric'], statusChangedAt: Date | null) {
  const now = new Date();
  const createdAt = parseDate(order.created_at);
  const relevantDate = resolveRelevantDate(order);

  switch (metric) {
    case 'minutes_since_created':
      return createdAt ? toMinutes(now.getTime() - createdAt.getTime()) : null;
    case 'minutes_since_status_changed':
      return statusChangedAt ? toMinutes(now.getTime() - statusChangedAt.getTime()) : null;
    case 'minutes_after_scheduled_at':
    case 'minutes_after_due_at':
    case 'minutes_after_promised_at':
      return relevantDate ? Math.max(0, toMinutes(now.getTime() - relevantDate.getTime())) : null;
    case 'minutes_until_scheduled_at':
    case 'minutes_until_due_at':
    case 'minutes_until_promised_at':
      return relevantDate ? toMinutes(relevantDate.getTime() - now.getTime()) : null;
    default:
      return null;
  }
}

function resolveThresholdColor(metric: TenantSemaphoreRule['metric'], elapsedMinutes: number | null, rule: TenantSemaphoreRule) {
  if (elapsedMinutes === null) return 'gray' as const;

  const green = rule.green_until_minutes ?? null;
  const yellow = rule.yellow_until_minutes ?? null;
  const red = rule.red_after_minutes ?? null;

  if (metric.startsWith('minutes_until_')) {
    if (elapsedMinutes <= 0) return 'red' as const;
    if (yellow !== null && elapsedMinutes <= yellow) return 'yellow' as const;
    if (green !== null && elapsedMinutes <= green) return 'green' as const;
    return 'green' as const;
  }

  if (red !== null && elapsedMinutes >= red) return 'red' as const;
  if (yellow !== null && elapsedMinutes >= yellow) return 'yellow' as const;
  if (green !== null && elapsedMinutes <= green) return 'green' as const;
  return 'green' as const;
}

function defaultNeutralRisk(statusKey: string, elapsedMinutes: number | null): OperationalRisk {
  return {
    color: ['entregado', 'cerrado', 'cancelado', 'finalizada'].includes(statusKey) ? 'gray' : 'green',
    reason: 'Sin regla configurada para este estado',
    suggested_action: 'Sin acción sugerida',
    elapsed_minutes: elapsedMinutes,
    rule_applied: null,
    priority: 0,
  };
}

export function calculateOperationalRisk({
  order,
  runtimeConfig,
  statusEvents = [],
}: {
  order: OrderLike;
  runtimeConfig: TenantRuntimeConfig;
  statusEvents?: Array<{ created_at?: string | null; new_status?: string | null }>;
}): OperationalRisk {
  const statusKey = resolveStatusKey(order.status);
  const workflowKey = 'service_orders';
  const terminalStatusKeys = new Set(
    runtimeConfig.workflowStatuses
      .filter((entry: TenantWorkflowStatus) => (entry.workflow_key || 'service_orders') === workflowKey && entry.is_terminal)
      .map((entry) => entry.status_key),
  );

  const statusChangedAt = resolveStatusChangedAt(order, statusEvents);
  const elapsedMinutes = resolveElapsedMinutes(order, 'minutes_since_status_changed', statusChangedAt);

  if (terminalStatusKeys.has(statusKey) || ['entregado', 'cerrado', 'cancelado', 'finalizada'].includes(statusKey)) {
    return {
      color: 'gray',
      reason: 'Orden cerrada',
      suggested_action: 'Sin acción requerida',
      elapsed_minutes: elapsedMinutes,
      rule_applied: null,
      priority: 0,
    };
  }

  const rule = pickRule(
    runtimeConfig.semaphoreRules,
    statusKey,
    workflowKey,
    runtimeConfig.industryProfile?.industry_key ?? null,
  );

  if (!rule) {
    return defaultNeutralRisk(statusKey, elapsedMinutes);
  }

  const metricElapsed = resolveElapsedMinutes(order, rule.metric, statusChangedAt);
  if (metricElapsed === null) {
    return {
      color: 'gray',
      reason: 'No hay fechas suficientes para calcular el riesgo',
      suggested_action: 'Actualizar fechas o estado',
      elapsed_minutes: null,
      rule_applied: `${rule.workflow_key ?? workflowKey}:${rule.status_key}:${rule.metric}`,
      priority: rule.priority ?? 0,
    };
  }

  const color = resolveThresholdColor(rule.metric, metricElapsed, rule);
  const labels = runtimeConfig.labels;
  const businessName = String((order.metadata?.business_name ?? order.metadata?.businessName) ?? '');
  const reason = interpolate(rule.reason_template ?? 'Sin motivo configurado', {
    status_label: runtimeConfig.statusLabels[statusKey] ?? statusKey,
    order_status: runtimeConfig.statusLabels[statusKey] ?? statusKey,
    business_name: businessName,
    order_folio: String(order.folio ?? order.id ?? ''),
    customer_name: String((order.metadata?.customer_name ?? order.metadata?.customerName) ?? ''),
    asset_label: labels.asset ?? 'Equipo',
  });
  const suggestedAction = interpolate(rule.suggested_action_template ?? 'Sin acción sugerida', {
    status_label: runtimeConfig.statusLabels[statusKey] ?? statusKey,
    order_status: runtimeConfig.statusLabels[statusKey] ?? statusKey,
    business_name: businessName,
    order_folio: String(order.folio ?? order.id ?? ''),
    customer_name: String((order.metadata?.customer_name ?? order.metadata?.customerName) ?? ''),
    asset_label: labels.asset ?? 'Equipo',
  });

  return {
    color,
    reason,
    suggested_action: suggestedAction,
    elapsed_minutes: metricElapsed,
    rule_applied: `${rule.workflow_key ?? workflowKey}:${rule.status_key}:${rule.metric}`,
    priority: rule.priority ?? 0,
  };
}
