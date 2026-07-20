import { apiClient } from "./client";
import type { BackendOrderResponse, PortalOrderResponse, PublicAuthorizationResponse } from "../types";

export function getOrderByFolio(tenantSlug: string, folio: string) {
  return apiClient<BackendOrderResponse>(`/api/public/tenant/${encodeURIComponent(tenantSlug)}/orders/${encodeURIComponent(folio)}`);
}

export function getPortalOrderByToken(tenantSlug: string, publicToken: string) {
  return apiClient<PortalOrderResponse>(`/api/public/tenant/${encodeURIComponent(tenantSlug)}/orders/${encodeURIComponent(publicToken)}/portal`);
}

export function getOrderAuthorization(tenantSlug: string, publicToken: string) {
  return apiClient<PublicAuthorizationResponse>(`/api/public/tenant/${encodeURIComponent(tenantSlug)}/orders/${encodeURIComponent(publicToken)}/authorization`);
}

export function submitOrderAuthorization(
  tenantSlug: string,
  publicToken: string,
  payload: Record<string, unknown>,
) {
  return apiClient<{ success: boolean }>(`/api/public/tenant/${encodeURIComponent(tenantSlug)}/orders/${encodeURIComponent(publicToken)}/authorization`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
