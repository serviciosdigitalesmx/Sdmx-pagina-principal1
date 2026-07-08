"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBrowserSupabaseClient } from '@/lib/supabase-browser';
import { loginWithSupabase } from '@/lib/auth';
import { setActiveSucursalId } from '@/lib/tenant';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState('Procesando acceso seguro...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const finishAuth = async () => {
      try {
        const supabase = getBrowserSupabaseClient();
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            throw exchangeError;
          }
        }

        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          throw sessionError;
        }

        const accessToken = data.session?.access_token;

        if (!accessToken) {
          throw new Error('No se pudo recuperar la sesión de Google.');
        }

        const { user } = await loginWithSupabase(accessToken);
        setActiveSucursalId(user.sucursalId || null, { skipReload: true });

        if (!cancelled) {
          window.history.replaceState(null, '', '/auth/callback');
          router.replace('/dashboard');
        }
      } catch (authError) {
        if (!cancelled) {
          setError(authError instanceof Error ? authError.message : 'No se pudo completar el acceso');
          setMessage('Hubo un problema al terminar el inicio de sesión.');
        }
      }
    };

    void finishAuth();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0f17] px-6 text-white">
      <div className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
        <p className="text-xs uppercase tracking-[0.32em] text-white/50">FIXI Admin</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Finalizando sesión</h1>
        <p className="mt-3 text-sm leading-6 text-white/65">{message}</p>
        {error ? (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-left text-sm text-red-200">
            {error}
          </div>
        ) : (
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
            Validando Google y cargando el dashboard
          </div>
        )}
      </div>
    </main>
  );
}
