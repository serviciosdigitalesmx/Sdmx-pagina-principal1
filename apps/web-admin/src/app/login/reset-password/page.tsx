"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Eye, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react';
import { getBrowserSupabaseClient } from '@/lib/supabase-browser';
import { platformBrand } from '@/config/branding';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const prepareRecovery = async () => {
      try {
        const supabase = getBrowserSupabaseClient();
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
          window.history.replaceState(null, '', '/login/reset-password');
        }

        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!data.session) throw new Error('El enlace de recuperación no es válido o ya venció.');
        if (!cancelled) setReady(true);
      } catch (recoveryError) {
        if (!cancelled) setError(recoveryError instanceof Error ? recoveryError.message : 'No se pudo validar el enlace de recuperación.');
      }
    };

    void prepareRecovery();
    return () => { cancelled = true; };
  }, []);

  const updatePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (password.length < 8) throw new Error('La contraseña debe tener al menos 8 caracteres.');
      if (password !== confirmation) throw new Error('Las contraseñas no coinciden.');

      const supabase = getBrowserSupabaseClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      await supabase.auth.signOut();
      router.replace('/login?reset=success');
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'No se pudo actualizar la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="fixi-auth-page flex min-h-screen items-center justify-center bg-[#030914] px-5 py-10 text-white">
      <section className="fixi-auth-card w-full max-w-xl rounded-[2rem] border border-white/[0.08] bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_34%),#081321] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.42)] sm:p-9">
        <div className="flex items-center justify-between border-b border-white/[0.07] pb-5">
          <div><p className="text-xl font-black tracking-[0.16em]">{platformBrand}</p><p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-slate-500">Recuperación de acceso</p></div>
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-300/15 bg-sky-400/[0.08] text-sky-200"><LockKeyhole className="h-5 w-5" /></span>
        </div>

        <div className="py-7">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-300/70">Nueva contraseña</p>
          <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] sm:text-4xl">Protege nuevamente tu cuenta.</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">El enlace valida tu sesión de recuperación antes de permitir el cambio.</p>
        </div>

        {error ? (
          <div role="alert" className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-100">{error}</div>
        ) : null}

        {!ready && !error ? (
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-4 text-sm text-slate-400"><span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-sky-300" />Validando enlace seguro...</div>
        ) : null}

        {ready ? (
          <form onSubmit={updatePassword} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Contraseña nueva</span>
              <span className="relative block"><LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} className="h-14 w-full rounded-xl border border-white/[0.09] bg-white/[0.035] pl-11 pr-12 text-sm outline-none transition focus:border-sky-400/55 focus:ring-4 focus:ring-sky-400/[0.07]" autoComplete="new-password" minLength={8} required /><button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white" aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></span>
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Confirmar contraseña</span>
              <span className="relative block"><CheckCircle2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><input type={showPassword ? 'text' : 'password'} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="h-14 w-full rounded-xl border border-white/[0.09] bg-white/[0.035] pl-11 pr-4 text-sm outline-none transition focus:border-sky-400/55 focus:ring-4 focus:ring-sky-400/[0.07]" autoComplete="new-password" minLength={8} required /></span>
            </label>
            <button type="submit" disabled={loading} className="inline-flex h-14 w-full items-center justify-center rounded-xl bg-[linear-gradient(135deg,#0ea5e9,#2563eb)] text-sm font-black shadow-[0_18px_42px_rgba(14,165,233,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Actualizando...' : 'Guardar contraseña'}</button>
          </form>
        ) : null}

        {error ? <Link href="/login?mode=reset" className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 text-sm font-semibold text-sky-300 hover:text-sky-200"><ArrowLeft className="h-4 w-4" /> Solicitar otro enlace</Link> : null}

        <div className="mt-7 flex items-center gap-2 border-t border-white/[0.07] pt-5 text-[10px] uppercase tracking-[0.14em] text-slate-600"><ShieldCheck className="h-4 w-4" /> Sesión de recuperación protegida</div>
      </section>
    </main>
  );
}
