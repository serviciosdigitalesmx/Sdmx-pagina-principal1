"use client";

import { useEffect } from "react";
import { saveAuthToken } from "@/lib/auth-storage";

function resolveNextUrl() {
  return new URL("/dashboard", window.location.origin).toString();
}

export default function AuthBridgePage() {
  const token = typeof window === "undefined" ? null : new URL(window.location.href).searchParams.get("token");
  const nextUrl = typeof window === "undefined" ? null : resolveNextUrl();

  useEffect(() => {
    if (!token) {
      return;
    }

    saveAuthToken(token);

    if (nextUrl) {
      window.location.replace(nextUrl);
    }
  }, [nextUrl, token]);

  return (
    <main
      className="flex min-h-screen items-center justify-center px-6 text-zinc-100"
      style={{
        background:
          "radial-gradient(circle_at_top,_rgba(180,83,9,0.14),_transparent_22%),radial-gradient(circle_at_80%_10%,_rgba(251,191,36,0.08),_transparent_24%),linear-gradient(180deg,#050505_0%,#0f0f10_46%,#141210_100%)",
      }}
    >
      <div className="max-w-lg rounded-[2rem] border border-stone-700 bg-[linear-gradient(180deg,rgba(16,14,12,0.96),rgba(22,18,14,0.98))] p-8 text-center shadow-[0_30px_120px_rgba(120,53,15,0.16)] backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.35em] text-amber-100">Sesión autenticada</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">Preparando el panel</h1>
        <p className="mt-4 text-sm leading-7 text-stone-300">
          {token ? "La sesión quedó guardada. Redirigiendo al panel..." : "No llegó la sesión."}
        </p>
      </div>
    </main>
  );
}
