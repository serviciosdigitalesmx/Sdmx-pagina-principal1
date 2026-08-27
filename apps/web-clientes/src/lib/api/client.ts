import { fetchJson } from "@white-label/config";

function formatEndpoint(endpoint: string): string {
  if (typeof endpoint !== "string" || !endpoint.trim()) {
    throw new Error("API client error: endpoint must be a non-empty string");
  }
  let formatted = endpoint.trim();

  if (/^https?:\/\//i.test(formatted)) {
    return formatted;
  }

  // Ensure leading slash and remove consecutive slashes
  if (!formatted.startsWith("/")) {
    formatted = "/" + formatted;
  }
  formatted = formatted.replace(/\/+/g, "/");
  return formatted;
}

export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  endpoint = formatEndpoint(endpoint);
  return fetchJson<T>(endpoint, options);
}
