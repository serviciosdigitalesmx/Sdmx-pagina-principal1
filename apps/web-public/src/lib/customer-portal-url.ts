import { resolveBaseDomain } from "@white-label/config";

function normalizeBaseUrl(candidate: string | null | undefined) {
  if (!candidate) return null;

  const trimmed = candidate.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
    if (parsed.protocol !== "https:") return null;
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

export function resolveCustomerPortalBaseUrl() {
  const fromEnv = normalizeBaseUrl(process.env.NEXT_PUBLIC_CUSTOMER_TRACKING_URL);
  if (fromEnv) return fromEnv;

  const baseDomain = resolveBaseDomain();
  if (baseDomain) {
    return `https://clientes.${baseDomain}`;
  }

  return "https://clientes.serviciosdigitalesmx.online";
}

export function buildCustomerPortalUrl(tenantSlug: string) {
  const cleanSlug = tenantSlug.trim();
  if (!cleanSlug) {
    return "/portal";
  }

  const baseUrl = resolveCustomerPortalBaseUrl();
  return `${baseUrl}/t/${encodeURIComponent(cleanSlug)}/portal`;
}
