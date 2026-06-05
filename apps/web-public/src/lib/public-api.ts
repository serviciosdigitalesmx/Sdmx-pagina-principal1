import { resolveApiBaseUrl } from "@white-label/config";

export function getPublicApiPath(pathname: string): string {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;

  try {
    return new URL(normalizedPath, resolveApiBaseUrl()).toString().replace(/\/$/, "");
  } catch {
    throw new Error("Invalid public API path");
  }
}
