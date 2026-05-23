"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readAuthToken } from "@/lib/auth-storage";
import { OperationalHub } from "@/components/dashboard/operational-hub";

function SessionPending() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(44,110,159,0.12),_transparent_28%),linear-gradient(180deg,#f4f6f9_0%,#eef2f6_100%)] px-6 text-slate-950">
      <div className="max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-[0_24px_90px_rgba(15,23,42,0.08)]">
        <p className="text-xs uppercase tracking-[0.35em] text-[#245a82]">Sesión</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Preparando el panel</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          Esperando a que el token de sesión quede disponible en este navegador.
        </p>
      </div>
    </main>
  );
}

function SessionInvalid() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(44,110,159,0.12),_transparent_28%),linear-gradient(180deg,#f4f6f9_0%,#eef2f6_100%)] px-6 text-slate-950">
      <div className="max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-[0_24px_90px_rgba(15,23,42,0.08)]">
        <p className="text-xs uppercase tracking-[0.35em] text-[#245a82]">Sesión inválida</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">No encontramos una sesión activa</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          Vuelve a iniciar sesión o crea un tenant nuevo para continuar.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/login" className="rounded-full bg-[#2c6e9f] px-5 py-3 font-semibold text-white transition hover:bg-[#245a82]">
            Ir al login
          </Link>
          <Link href="/onboarding" className="rounded-full border border-slate-300 px-5 py-3 font-semibold text-slate-800 transition hover:bg-slate-50">
            Crear tenant
          </Link>
        </div>
      </div>
    </main>
  );
}

export function SessionGate() {
  const [ready, setReady] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    const readSession = () => {
      const token = readAuthToken();
      setReady(Boolean(token));
      setInvalid(!token);
      setResolved(true);
    };

    readSession();

    const interval = window.setInterval(readSession, 250);
    const onStorage = () => readSession();

    window.addEventListener("storage", onStorage);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  if (resolved && invalid && !ready) {
    return <SessionInvalid />;
  }

  if (!ready) {
    return <SessionPending />;
  }

  return <OperationalHub />;
}
