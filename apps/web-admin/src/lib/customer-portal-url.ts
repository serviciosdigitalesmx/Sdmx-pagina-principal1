const DEFAULT_CUSTOMER_PORTAL_URL = "https://clientes.serviciosdigitalesmx.online";

function normalizeHttpsUrl(candidate: string | undefined) {
  if (!candidate?.trim()) return null;

  try {
    const parsed = new URL(candidate.trim());
    return parsed.protocol === "https:" ? parsed.toString().replace(/\/$/, "") : null;
  } catch {
    return null;
  }
}

export function resolveCustomerPortalBaseUrl() {
  return normalizeHttpsUrl(process.env.NEXT_PUBLIC_CUSTOMER_TRACKING_URL) ?? DEFAULT_CUSTOMER_PORTAL_URL;
}

export function buildTenantLandingUrl(tenantSlug: string | null | undefined) {
  const cleanSlug = tenantSlug?.trim() ?? "";
  return cleanSlug ? `${resolveCustomerPortalBaseUrl()}/t/${encodeURIComponent(cleanSlug)}` : "";
}

export function buildCustomerTrackingUrl(tenantSlug: string | null | undefined, folio?: string) {
  const cleanSlug = tenantSlug?.trim() ?? "";
  if (!cleanSlug) return "";

  const url = new URL(`/t/${encodeURIComponent(cleanSlug)}/portal`, resolveCustomerPortalBaseUrl());
  if (folio?.trim()) url.searchParams.set("folio", folio.trim());
  return url.toString();
}
