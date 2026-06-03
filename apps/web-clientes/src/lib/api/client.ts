import { fetchJson } from "@white-label/config";

export async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
  return fetchJson<T>(endpoint, options);
}
