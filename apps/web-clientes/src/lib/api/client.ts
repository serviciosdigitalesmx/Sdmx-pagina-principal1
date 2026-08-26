import { ApiError } from "@white-label/config";
import type { ApiErrorPayload } from "@white-label/config";

function normalizeUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withScheme);
    url.hash = "";
    url.search = "";
    url.pathname = url.pathname === "/" ? "" : url.pathname.replace(/\/$/, "");
    return url.toString().replace(/\/$/, "");
  } catch {
    return withScheme.replace(/\/$/, "");
  }
}

function resolveClientApiBaseUrl(): string {
  const envCandidates = [
    process.env.API_URL,
    process.env.NEXT_PUBLIC_API_URL,
    process.env.NEXT_PUBLIC_API_BASE_URL,
    process.env.NEXT_PUBLIC_RENDER_API_URL,
  ];

  for (const val of envCandidates) {
    const trimmed = val?.trim();
    if (trimmed) {
      return normalizeUrl(trimmed);
    }
  }

  const domainCandidates = [
    process.env.NEXT_PUBLIC_BASE_DOMAIN,
    process.env.BASE_DOMAIN,
  ];
  for (const domain of domainCandidates) {
    const trimmed = domain?.trim();
    if (trimmed) {
      const cleanedDomain = trimmed.replace(/^https?:\/\//, "").replace(/^app\./, "").replace(/^clientes\./, "").trim();
      if (cleanedDomain) {
        return `https://api.${cleanedDomain}`;
      }
    }
  }

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const port = window.location.port;

    if (host === "localhost" || host === "127.0.0.1" || host === "::1") {
      if (port === "3000") {
        return "http://127.0.0.1:3001";
      }
      return window.location.origin.replace(/\/$/, "");
    }

    if (host.startsWith("clientes.")) {
      return `https://${host.replace(/^clientes\./, "api.")}`;
    }

    const parts = host.split(".");
    if (parts.length >= 2) {
      const baseDomain = parts.slice(-2).join(".");
      if (baseDomain !== "vercel.app") {
        return `https://api.${baseDomain}`;
      }
    }
  }

  return "https://api.serviciosdigitalesmx.online";
}

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
  const formattedEndpoint = formatEndpoint(endpoint);

  let url: string;
  if (/^https?:\/\//i.test(formattedEndpoint)) {
    url = formattedEndpoint;
  } else {
    const apiBaseUrl = resolveClientApiBaseUrl();
    url = `${apiBaseUrl}${formattedEndpoint}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const payload = (await response.json().catch(() => null)) as ApiErrorPayload | T | null;

  if (!response.ok) {
    const errorPayload = payload && typeof payload === "object" ? (payload as ApiErrorPayload) : null;
    const message =
      errorPayload?.message && typeof errorPayload.message === "string"
        ? errorPayload.message
        : errorPayload?.error && typeof errorPayload.error === "string"
          ? errorPayload.error
          : `HTTP ${response.status}`;

    throw new ApiError(message, response.status, errorPayload?.details);
  }

  return payload as T;
}
