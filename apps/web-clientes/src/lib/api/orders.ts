import { apiClient } from "./client";
import type { BackendOrderResponse, PortalOrderResponse } from "../types";

export function getOrderByFolio(tenantSlug: string, folio: string) {
  return apiClient<BackendOrderResponse>(`/api/public/tenant/${encodeURIComponent(tenantSlug)}/orders/${encodeURIComponent(folio)}`);
}

export function getPortalOrderByToken(tenantSlug: string, publicToken: string) {
  return apiClient<PortalOrderResponse>(`/api/public/tenant/${encodeURIComponent(tenantSlug)}/orders/${encodeURIComponent(publicToken)}/portal`);
}
