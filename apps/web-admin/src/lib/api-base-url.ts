import { resolveApiBaseUrl } from "@white-label/config";

// Delegate to shared config so client and server use the same production API origin.
export function resolveAdminApiBaseUrl(): string {
  return resolveApiBaseUrl();
}
