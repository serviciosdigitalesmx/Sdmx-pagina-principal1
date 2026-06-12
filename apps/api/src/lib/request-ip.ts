import { isIP } from 'net';

const IPV4_WITH_PORT = /^(\d{1,3}(?:\.\d{1,3}){3}):(\d+)$/;
const IPV6_WITH_PORT = /^\[([0-9a-fA-F:.%]+)\]:(\d+)$/;
const IPV6_BRACKETED = /^\[([0-9a-fA-F:.%]+)\]$/;

function normalizeCandidate(raw: string): string | null {
  const candidate = raw.trim();
  if (!candidate) return null;

  const firstPart = candidate.split(',')[0]?.trim();
  if (!firstPart) return null;

  const withoutPort = firstPart.match(IPV4_WITH_PORT)?.[1]
    ?? firstPart.match(IPV6_WITH_PORT)?.[1]
    ?? firstPart.match(IPV6_BRACKETED)?.[1]
    ?? firstPart;

  const stripped = withoutPort.replace(/^"+|"+$/g, '').trim();
  if (!stripped) return null;

  if (isIP(stripped) === 0) {
    return null;
  }

  return stripped;
}

export function getRequestIp(headers: Headers | Record<string, unknown> | undefined, fallback?: string | null): string | null {
  const headerValue = (name: string): string | undefined => {
    if (!headers) return undefined;
    const key = name.toLowerCase();

    if (typeof (headers as Headers).get === 'function') {
      return (headers as Headers).get(name) ?? (headers as Headers).get(key) ?? undefined;
    }

    const record = headers as Record<string, unknown>;
    const value = record[key] ?? record[name] ?? undefined;
    if (Array.isArray(value)) {
      return value.find((item) => typeof item === 'string') as string | undefined;
    }
    return typeof value === 'string' ? value : undefined;
  };

  const candidates = [
    headerValue('cf-connecting-ip'),
    headerValue('x-real-ip'),
    headerValue('x-forwarded-for'),
    fallback ?? undefined,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const normalized = normalizeCandidate(candidate);
    if (normalized) return normalized;
  }

  return null;
}

export function normalizeRequestIp(input?: string | null): string | null {
  if (!input) return null;
  return normalizeCandidate(input);
}
