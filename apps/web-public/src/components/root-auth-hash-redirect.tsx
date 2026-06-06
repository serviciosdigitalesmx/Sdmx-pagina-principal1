"use client";

import { useEffect } from "react";
import { saveAuthToken } from "@/lib/auth-storage";
import { getPublicApiPath } from "@/lib/public-api";
import { resolveAdminBridgeUrl } from "@/lib/admin-url";

async function exchangeSessionForApiToken(accessToken: string) {
  const response = await fetch(getPublicApiPath("/api/auth/exchange"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ accessToken }),
  });

  const payload = (await response.json().catch(() => ({}))) as { error?: string; token?: string };

  if (!response.ok || !payload.token) {
    throw new Error(payload.error || `No pudimos convertir la sesión. HTTP ${response.status}`);
  }

  return payload.token;
}

export function RootAuthHashRedirect() {
  useEffect(() => {
    const hash = typeof window === "undefined" ? "" : window.location.hash.replace(/^#/, "");

    if (!hash) {
      return;
    }

    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");

    if (!accessToken) {
      return;
    }

    let cancelled = false;

    const redirect = async () => {
      try {
        const apiToken = await exchangeSessionForApiToken(accessToken);

        if (cancelled) {
          return;
        }

        saveAuthToken(apiToken, true);
        window.location.replace(resolveAdminBridgeUrl(apiToken) ?? "/dashboard");
      } catch (error) {
        console.error("ROOT_HASH_REDIRECT_FAILED", error);
      }
    };

    void redirect();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
