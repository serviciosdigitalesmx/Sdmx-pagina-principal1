"use client";

import { useEffect, useMemo, useState } from "react";
import { getCurrentSession } from "@/lib/session";
import { replayOfflineRequests } from "@/lib/pwa/offline-queue";

function ensureManifestHref(tenantSlug: string) {
  const manifestUrl = `/api/pwa/manifest?tenant=${encodeURIComponent(tenantSlug)}`;
  let link = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');

  if (!link) {
    link = document.createElement("link");
    link.rel = "manifest";
    document.head.appendChild(link);
  }

  link.href = manifestUrl;
}

async function registerServiceWorker(tenantSlug: string) {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  const swUrl = `/api/pwa/sw.js?tenant=${encodeURIComponent(tenantSlug)}`;
  try {
    await navigator.serviceWorker.register(swUrl, { scope: "/" });
  } catch {
    // Registration failure should not block the dashboard.
  }
}

export function PwaBootstrap() {
  const [online, setOnline] = useState<boolean>(true);
  const tenantSlug = useMemo(() => {
    try {
      return getCurrentSession()?.tenantSlug?.trim() || "";
    } catch {
      return "";
    }
  }, []);

  useEffect(() => {
    if (!tenantSlug) {
      return;
    }

    ensureManifestHref(tenantSlug);
    void registerServiceWorker(tenantSlug);
  }, [tenantSlug]);

  useEffect(() => {
    const onOnline = async () => {
      setOnline(true);
      try {
        const failures = await replayOfflineRequests(() => {
          try {
            return getCurrentSession()?.token ?? "";
          } catch {
            return "";
          }
        });
        if (failures.length === 0 && "serviceWorker" in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(registrations.map((registration) => registration.update().catch(() => undefined)));
        }
      } finally {
        // Keep the banner silent while online; queued requests are retried above.
      }
    };

    const onOffline = () => {
      setOnline(false);
    };

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex justify-center px-4 pt-4">
      {!online ? (
        <div className="pointer-events-auto rounded-full border border-amber-500/30 bg-amber-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-100 shadow-lg backdrop-blur">
          Sin conexión. Las acciones nuevas se guardarán para sincronizar al reconectar.
        </div>
      ) : null}
    </div>
  );
}
