export function getPublicApiPath(pathname: string): string {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_RENDER_API_URL?.trim() ||
    process.env.API_URL?.trim();

  if (!apiBaseUrl) {
    return normalizedPath;
  }

  if (process.env.NODE_ENV === "production" && /^http:\/\//i.test(apiBaseUrl)) {
    return normalizedPath;
  }

  const withScheme = /^https?:\/\//i.test(apiBaseUrl) ? apiBaseUrl : `https://${apiBaseUrl}`;
  return `${withScheme.replace(/\/$/, "")}${normalizedPath}`;
}
