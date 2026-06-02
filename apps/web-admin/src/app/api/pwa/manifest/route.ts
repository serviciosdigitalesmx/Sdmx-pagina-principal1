import { NextRequest } from "next/server";

function getTenantSlug(request: NextRequest) {
  return request.nextUrl.searchParams.get("tenant")?.trim() || process.env.NEXT_PUBLIC_DEFAULT_TENANT_SLUG?.trim() || "web-admin";
}

export async function GET(request: NextRequest) {
  const tenantSlug = getTenantSlug(request);
  const manifest = {
    name: `${tenantSlug} · Servicios Digitales MX`,
    short_name: "SDMX Admin",
    description: "Panel multi-tenant para seguimiento técnico y operación del taller.",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: process.env.NEXT_PUBLIC_THEME_PRIMARY ?? "#334155",
    icons: [
      { src: "/favicon.ico", sizes: "256x256", type: "image/x-icon" },
    ],
  };

  return Response.json(manifest, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
