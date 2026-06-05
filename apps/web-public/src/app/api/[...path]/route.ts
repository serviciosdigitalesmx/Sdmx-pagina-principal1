import { NextRequest, NextResponse } from "next/server";
import { optionalEnv, resolveApiBaseUrl } from "@white-label/config";

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
]);

function getBackendBaseUrl() {
  const configuredUrl = optionalEnv("API_URL");

  if (!configuredUrl) {
    return resolveApiBaseUrl();
  }

  return configuredUrl;
}

type RouteParams = {
  path: string | string[] | undefined;
};

async function proxyRequest(request: NextRequest, params: RouteParams) {
  const backendBaseUrl = getBackendBaseUrl();
  const pathSegment = Array.isArray(params.path) ? params.path.join("/") : params.path ?? "";
  const path = `/api/${pathSegment}`;
  const targetUrl = new URL(path, backendBaseUrl);
  targetUrl.search = request.nextUrl.search;

  const headers = new Headers(request.headers);
  headers.delete("host");

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: "manual",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  const response = await fetch(targetUrl, init);
  const responseHeaders = new Headers(response.headers);

  for (const header of HOP_BY_HOP_HEADERS) {
    responseHeaders.delete(header);
  }

  const acceptHeader = request.headers.get("accept") ?? "";
  const wantsHtmlRedirect = acceptHeader.includes("text/html");

  if (request.method === "POST" && wantsHtmlRedirect) {
    const payload = await response.clone().json().catch(() => null) as
      | { redirectUrl?: string; error?: string }
      | null;

    if (!response.ok) {
      const errorMessage = payload?.error ?? `Request failed with status ${response.status}`;
      return NextResponse.redirect(
        new URL(`/onboarding?error=${encodeURIComponent(errorMessage)}`, request.url),
        303,
      );
    }

    const redirectUrl = payload?.redirectUrl;
    if (!redirectUrl) {
      return NextResponse.redirect(
        new URL(`/onboarding?error=${encodeURIComponent("No redirect URL returned by backend")}`, request.url),
        303,
      );
    }

    const redirectResponse = NextResponse.redirect(redirectUrl, 303);
    const setCookie = responseHeaders.get("set-cookie");
    if (setCookie) {
      redirectResponse.headers.set("set-cookie", setCookie);
    }
    return redirectResponse;
  }

  return new NextResponse(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}

export async function GET(request: NextRequest, context: { params: Promise<RouteParams> }) {
  return proxyRequest(request, await context.params);
}

export async function POST(request: NextRequest, context: { params: Promise<RouteParams> }) {
  return proxyRequest(request, await context.params);
}

export async function PUT(request: NextRequest, context: { params: Promise<RouteParams> }) {
  return proxyRequest(request, await context.params);
}

export async function PATCH(request: NextRequest, context: { params: Promise<RouteParams> }) {
  return proxyRequest(request, await context.params);
}

export async function DELETE(request: NextRequest, context: { params: Promise<RouteParams> }) {
  return proxyRequest(request, await context.params);
}

export async function HEAD(request: NextRequest, context: { params: Promise<RouteParams> }) {
  return proxyRequest(request, await context.params);
}
