import { supabaseAdmin } from '@white-label/database';

type LogLevel = 'info' | 'error';

type SafeLogParams = {
  requestId?: string | null;
  method?: string | null;
  path?: string | null;
  statusCode?: number | null;
  message?: string | null;
  error?: unknown;
  details?: Record<string, unknown> | null;
};

type DependencyStatus = 'ok' | 'error';

const SENSITIVE_KEY_PATTERN = /(authorization|cookie|token|password|secret|public_token|message_body|wa_me_url|payload|body|headers)/i;

function safeErrorMessage(error: unknown, fallback = 'Internal server error') {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string' && error.trim()) return error.trim();
  return fallback;
}

function sanitizeDetails(details: Record<string, unknown> | null | undefined) {
  if (!details) return undefined;

  return Object.fromEntries(
    Object.entries(details)
      .filter(([key]) => !SENSITIVE_KEY_PATTERN.test(key))
      .map(([key, value]) => {
        if (value === null || value === undefined) return [key, value];
        if (['string', 'number', 'boolean'].includes(typeof value)) return [key, value];
        return [key, '[redacted]'];
      }),
  );
}

function writeLog(level: LogLevel, event: string, params: SafeLogParams = {}) {
  const entry: Record<string, unknown> = {
    level,
    event,
    requestId: params.requestId ?? null,
    method: params.method ?? null,
    path: params.path ?? null,
    statusCode: params.statusCode ?? null,
    message: params.message ?? (params.error ? safeErrorMessage(params.error) : null),
    timestamp: new Date().toISOString(),
  };

  const details = sanitizeDetails(params.details);
  if (details && Object.keys(details).length > 0) {
    entry.details = details;
  }

  if (level === 'error' && process.env.NODE_ENV !== 'production' && params.error instanceof Error) {
    entry.stack = params.error.stack;
  }

  const line = JSON.stringify(entry);
  if (level === 'error') {
    console.error(line);
    return;
  }
  console.info(line);
}

export function safeLogError(event: string, params: SafeLogParams = {}) {
  writeLog('error', event, params);
}

export function safeLogInfo(event: string, params: SafeLogParams = {}) {
  writeLog('info', event, params);
}

async function checkDatabase() {
  const startedAt = Date.now();

  try {
    const { error } = await supabaseAdmin
      .from('tenants')
      .select('id', { count: 'exact', head: true })
      .limit(1);

    const latencyMs = Date.now() - startedAt;
    if (error) {
      return { status: 'error' as DependencyStatus, latencyMs };
    }

    return { status: 'ok' as DependencyStatus, latencyMs };
  } catch {
    return { status: 'error' as DependencyStatus, latencyMs: Date.now() - startedAt };
  }
}

export async function runDependencyHealthCheck() {
  const database = await checkDatabase();
  const status = database.status === 'ok' ? 'ok' : 'degraded';

  return {
    status,
    timestamp: new Date().toISOString(),
    service: process.env.API_NAME ?? 'sdmx-backend-api',
    dependencies: {
      database,
    },
  };
}
