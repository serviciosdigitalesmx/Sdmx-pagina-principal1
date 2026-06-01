"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { readAuthToken } from "@/lib/auth-storage";
import { getCurrentSession } from "@/lib/session";
import { OperationalHub } from "@/components/dashboard/operational-hub";
import { EmptyState } from "@white-label/ui";

function SessionPending() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <EmptyState
        title="Preparando el panel"
        description="Esperando a que el token de sesión quede disponible en este navegador."
        className="w-full max-w-lg"
      />
    </main>
  );
}

export function SessionGate() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const redirected = useRef(false);

  useEffect(() => {
    const readSession = () => {
      const token = readAuthToken();
      // If no token but a development token is provided via env, use it as a fallback for local testing
      const devToken = typeof window !== 'undefined' ? (window.__NEXT_DATA__?.props?.pageProps?.env?.NEXT_PUBLIC_DEV_AUTH_TOKEN ?? (process.env?.NEXT_PUBLIC_DEV_AUTH_TOKEN ?? null)) : null;
      if (!token && devToken) {
        try {
          // write directly to localStorage for session gate detection
          window.localStorage.setItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY ?? 'app_auth_token', String(devToken));
        } catch {}
      }

      const finalToken = readAuthToken();
      const currentSession = getCurrentSession();
      setReady(Boolean(finalToken) && Boolean(currentSession));

      if ((!token || !currentSession) && !redirected.current) {
        redirected.current = true;
        if (token && !currentSession) {
          try {
            window.localStorage.removeItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY ?? "app_auth_token");
            window.sessionStorage.removeItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY ?? "app_auth_token");
          } catch {}
        }
        router.replace("/login");
      }
    };

    readSession();

    const interval = window.setInterval(readSession, 250);
    const onStorage = () => readSession();

    window.addEventListener("storage", onStorage);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("storage", onStorage);
    };
  }, [router]);

  if (!ready) {
    return <SessionPending />;
  }

  return <OperationalHub />;
}
