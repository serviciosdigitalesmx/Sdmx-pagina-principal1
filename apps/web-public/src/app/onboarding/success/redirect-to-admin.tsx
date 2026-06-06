"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { resolveAdminBridgeUrl } from "@/lib/admin-url";

export function RedirectToAdmin() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const tenant = searchParams.get("tenant");

  const bridgeResult = useMemo(() => {
    if (!token) {
      return { url: null as string | null, error: null as string | null };
    }

    const url = resolveAdminBridgeUrl(token, tenant);

    return url ? { url, error: null } : { url: null, error: "Falta configurar la URL del panel." };
  }, [tenant, token]);

  const error = !token ? "Falta la sesión en el callback de éxito." : bridgeResult.error;
  const targetUrl = bridgeResult.url;

  useEffect(() => {
    if (!targetUrl) {
      return;
    }

    window.location.replace(targetUrl);
  }, [targetUrl]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(44,110,159,0.12),_transparent_30%),linear-gradient(180deg,#f4f6f9_0%,#eef2f6_38%,#ffffff_100%)] px-6 py-12 text-slate-950">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_90px_rgba(15,23,42,0.08)]">
        <p className="text-xs uppercase tracking-[0.35em] text-[#1f2937]">Registro completado</p>
        <h1 className="text-4xl font-semibold tracking-tight">Tu prueba gratuita ya quedó creada.</h1>
        <p className="text-lg leading-8 text-slate-600">
          {tenant ? `Taller: ${tenant}.` : "El taller fue creado correctamente."} La sesión quedó guardada en este navegador.
        </p>
        {error ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
            {error}
          </div>
        ) : (
          <div className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-600">
            Preparando tu panel administrativo...
          </div>
        )}
      </section>
    </main>
  );
}
