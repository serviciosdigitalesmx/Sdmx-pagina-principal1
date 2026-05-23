"use client";

import { useEffect } from "react";

function resolveAdminBridgeUrl(token?: string) {
  if (!token) {
    return null;
  }

  const adminUrl = process.env.NEXT_PUBLIC_WEB_ADMIN_URL;

  if (!adminUrl) {
    return null;
  }

  try {
    const normalizedAdminUrl = new URL(adminUrl);

    if (normalizedAdminUrl.protocol !== "https:") {
      return null;
    }

    return new URL(`/auth/bridge?token=${encodeURIComponent(token)}`, normalizedAdminUrl).toString();
  } catch {
    return null;
  }
}

export function AutoRedirectToAdmin({ token }: { token?: string }) {
  useEffect(() => {
    if (!token) {
      return;
    }

    const bridgeUrl = resolveAdminBridgeUrl(token);

    if (bridgeUrl) {
      window.location.replace(bridgeUrl);
      return;
    }
  }, [token]);

  return null;
}
