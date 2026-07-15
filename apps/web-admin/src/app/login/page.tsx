"use client";

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  Building2,
  Check,
  ClipboardCheck,
  Eye,
  EyeOff,
  Gauge,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { getBrowserSupabaseClient } from '@/lib/supabase-browser';
import { loginWithSupabase } from '@/lib/auth';
import { setActiveSucursalId } from '@/lib/tenant';
import { platformBrand } from '@/config/branding';

type AuthMode = 'login' | 'signup' | 'reset';

const modeCopy: Record<AuthMode, { eyebrow: string; title: string; description: string }> = {
  login: {
    eyebrow: 'Acceso al taller',
    title: 'Bienvenido de vuelta.',
    description: 'Ingresa para continuar con la operación de tu taller.',
  },
  signup: {
    eyebrow: 'Nuevo espacio',
    title: 'Abre tu taller en FIXI.',
    description: 'Crea tu cuenta y configura los datos reales de tu negocio paso a paso.',
  },
  reset: {
    eyebrow: 'Recuperar acceso',
    title: 'Volvamos a entrar.',
    description: 'Te enviaremos un enlace seguro para establecer una contraseña nueva.',
  },
};

function FixiMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`relative inline-flex items-center justify-center overflow-hidden rounded-2xl border border-sky-300/20 bg-[linear-gradient(145deg,#10233f,#07101e)] shadow-[0_18px_48px_rgba(14,165,233,0.18)] ${compact ? 'h-11 w-11' : 'h-14 w-14'}`} aria-hidden="true">
      <span className={`${compact ? 'text-base' : 'text-lg'} font-black tracking-[-0.08em] text-white`}>F</span>
      <span className={`${compact ? 'text-base' : 'text-lg'} font-black text-cyan-300`}>I</span>
      <i className="absolute inset-x-2 bottom-1 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
    </span>
  );
}

function ProductPreview() {
  const stages = [
    ['Recepción', 'Equipo y evidencia', true],
    ['Operación', 'Estado y responsable', true],
    ['Cliente', 'Portal y documentos', false],
  ] as const;

  return (
    <aside className="fixi-auth-preview relative hidden min-h-[760px] overflow-hidden border-r border-white/[0.08] bg-[#06101e] p-8 xl:flex xl:flex-col xl:justify-between 2xl:p-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(14,165,233,0.24),transparent_30%),radial-gradient(circle_at_88%_82%,rgba(34,211,238,0.12),transparent_28%)]" />
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FixiMark compact />
          <div>
            <p className="text-lg font-black tracking-[0.18em] text-white">{platformBrand}</p>
            <p className="text-[10px] uppercase tracking-[0.28em] text-sky-200/55">Panel operativo</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-400/[0.08] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-200">
          <i className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.8)]" />
          Acceso seguro
        </span>
      </div>

      <div className="relative z-10 my-10">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300/75">Tu operación continúa aquí</p>
        <h2 className="mt-4 max-w-xl text-4xl font-black leading-[1.06] tracking-[-0.04em] text-white 2xl:text-5xl">
          Todo el contexto del taller, listo para trabajar.
        </h2>
        <p className="mt-5 max-w-lg text-sm leading-7 text-slate-300/70">
          Recepción, seguimiento, inventario y relación con clientes conectados dentro del espacio de cada negocio.
        </p>

        <div className="fixi-auth-console mt-9 overflow-hidden rounded-[1.75rem] border border-sky-300/[0.14] bg-[#081426]/90 shadow-[0_30px_100px_rgba(0,0,0,0.42)]">
          <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <Gauge className="h-4 w-4 text-cyan-300" />
              Flujo de servicio
            </div>
            <span className="rounded-full border border-sky-300/10 bg-sky-300/[0.06] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-sky-200/70">Contexto conectado</span>
          </div>
          <div className="grid grid-cols-[6.5rem_1fr]">
            <div className="border-r border-white/[0.06] bg-black/10 p-4">
              {[['Resumen', Gauge], ['Órdenes', ClipboardCheck], ['Stock', Boxes], ['Sucursales', Building2]].map(([label, Icon], index) => {
                const IconComponent = Icon as typeof Gauge;
                return (
                  <div className={`mb-2 flex items-center gap-2 rounded-lg px-2.5 py-2 text-[10px] font-semibold ${index === 1 ? 'bg-sky-400/10 text-sky-200' : 'text-slate-500'}`} key={label as string}>
                    <IconComponent className="h-3.5 w-3.5" />
                    {label as string}
                  </div>
                );
              })}
            </div>
            <div className="p-5">
              <div className="flex items-end justify-between gap-3">
                <div><small className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Expediente operativo</small><p className="mt-1 text-sm font-bold text-white">Una orden, todo el historial</p></div>
                <span className="rounded-lg bg-sky-500 px-3 py-2 text-[9px] font-bold text-white">Nueva orden</span>
              </div>
              <div className="mt-5 space-y-2.5">
                {stages.map(([title, description, complete], index) => (
                  <div className="grid grid-cols-[1.75rem_1fr_auto] items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3" key={title}>
                    <span className={`flex h-7 w-7 items-center justify-center rounded-lg text-[9px] font-black ${complete ? 'bg-sky-400/12 text-sky-200' : 'bg-white/[0.05] text-slate-400'}`}>0{index + 1}</span>
                    <div><b className="block text-[11px] text-slate-100">{title}</b><small className="text-[9px] text-slate-500">{description}</small></div>
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${complete ? 'border-emerald-300/20 bg-emerald-300/10 text-emerald-200' : 'border-slate-700 text-slate-600'}`}><Check className="h-3 w-3" /></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-3 gap-3">
        {['Información por tenant', 'Sesión protegida', 'Acceso desde cualquier equipo'].map((item) => (
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-3 text-[10px] leading-4 text-slate-400" key={item}>
            <ShieldCheck className="mb-2 h-4 w-4 text-sky-300" />{item}
          </div>
        ))}
      </div>
    </aside>
  );
}

function LoginScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const requestedMode = searchParams.get('mode');
  const initialMode: AuthMode = requestedMode === 'signup' || requestedMode === 'reset' ? requestedMode : 'login';
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(searchParams.get('reset') === 'success' ? 'Tu contraseña fue actualizada. Ya puedes iniciar sesión.' : null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const publicUrl = process.env.NEXT_PUBLIC_WEB_PUBLIC_URL || 'https://app.serviciosdigitalesmx.online';
  const copy = modeCopy[mode];

  const selectMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError(null);
    setSuccess(null);
    const params = new URLSearchParams(searchParams.toString());
    if (nextMode === 'login') params.delete('mode');
    else params.set('mode', nextMode);
    params.delete('reset');
    router.replace(params.size ? `/login?${params.toString()}` : '/login', { scroll: false });
  };

  const handleSupabaseLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error('Entorno de autenticación incompleto.');
      }

      const supabase = getBrowserSupabaseClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (signInError) throw signInError;

      const accessToken = data.session?.access_token;
      if (!accessToken) throw new Error('No se obtuvo una sesión válida.');

      const { user } = await loginWithSupabase(accessToken);
      setActiveSucursalId(user.sucursalId || null, { skipReload: true });
      router.push(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = getBrowserSupabaseClient();
      const callbackUrl = new URL('/auth/callback', window.location.origin).toString();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: callbackUrl } });
      if (oauthError) throw oauthError;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar con Google.');
      setLoading(false);
    }
  };

  const handlePasswordReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResetLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!email.trim()) throw new Error('Escribe el correo de tu cuenta.');
      const supabase = getBrowserSupabaseClient();
      const redirectTo = new URL('/login/reset-password', window.location.origin).toString();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
      if (resetError) throw resetError;
      setSuccess('Te enviamos un enlace para cambiar tu contraseña. Revisa también tu carpeta de spam.');
    } catch (resetErr) {
      setError(resetErr instanceof Error ? resetErr.message : 'No se pudo enviar el enlace.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <main className="fixi-auth-page min-h-screen bg-[#030914] text-white">
      <div className="mx-auto grid min-h-screen w-full max-w-[1680px] xl:grid-cols-[1.08fr_0.92fr]">
        <ProductPreview />

        <section className="fixi-auth-card relative flex min-h-screen flex-col bg-[radial-gradient(circle_at_84%_0%,rgba(14,165,233,0.11),transparent_28%),#07101d] px-5 py-6 sm:px-10 lg:px-16 xl:px-14 2xl:px-20">
          <div className="mx-auto flex w-full max-w-[34rem] items-center justify-between">
            <Link href={publicUrl} className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition hover:text-white">
              <ArrowLeft className="h-4 w-4" /> Volver al sitio
            </Link>
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-200/70">
              <LockKeyhole className="h-3.5 w-3.5" /> Conexión cifrada
            </span>
          </div>

          <div className="mx-auto flex w-full max-w-[34rem] flex-1 flex-col justify-center py-10">
            <div className="mb-8 xl:hidden">
              <div className="flex items-center gap-3"><FixiMark /><div><p className="text-2xl font-black tracking-[0.16em]">{platformBrand}</p><p className="text-xs text-slate-500">Panel operativo</p></div></div>
            </div>

            <div className="mb-7 flex rounded-xl border border-white/[0.07] bg-black/15 p-1" aria-label="Opciones de acceso">
              {([['login', 'Iniciar sesión'], ['signup', 'Crear taller'], ['reset', 'Recuperar']] as const).map(([key, label]) => (
                <button
                  type="button"
                  className={`flex-1 rounded-lg px-2 py-2.5 text-xs font-bold transition ${mode === key ? 'bg-sky-500 text-white shadow-[0_8px_24px_rgba(14,165,233,0.2)]' : 'text-slate-500 hover:text-slate-200'}`}
                  onClick={() => selectMode(key)}
                  aria-pressed={mode === key}
                  key={key}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mb-7">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-300/75">{copy.eyebrow}</p>
              <h1 className="mt-3 text-4xl font-black tracking-[-0.045em] text-white sm:text-5xl">{copy.title}</h1>
              <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">{copy.description}</p>
            </div>

            {error ? <div role="alert" className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div> : null}
            {success ? <div role="status" className="mb-5 rounded-xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-sm leading-6 text-emerald-100">{success}</div> : null}

            {mode === 'login' ? (
              <form onSubmit={handleSupabaseLogin} className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Correo electrónico</span>
                  <span className="relative block">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-14 w-full rounded-xl border border-white/[0.09] bg-white/[0.035] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400/55 focus:bg-sky-400/[0.04] focus:ring-4 focus:ring-sky-400/[0.07]" placeholder="tu@taller.com" autoComplete="email" required />
                  </span>
                </label>
                <label className="block">
                  <span className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-[0.14em] text-slate-400"><span>Contraseña</span><button type="button" onClick={() => selectMode('reset')} className="normal-case tracking-normal text-sky-300 transition hover:text-sky-200">¿La olvidaste?</button></span>
                  <span className="relative block">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} className="h-14 w-full rounded-xl border border-white/[0.09] bg-white/[0.035] pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400/55 focus:bg-sky-400/[0.04] focus:ring-4 focus:ring-sky-400/[0.07]" placeholder="Tu contraseña" autoComplete="current-password" required />
                    <button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-200" aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                  </span>
                </label>
                <button type="submit" className="mt-2 inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#0ea5e9,#2563eb)] px-5 text-sm font-black text-white shadow-[0_18px_42px_rgba(14,165,233,0.22)] transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60" disabled={loading || resetLoading}>
                  {loading ? 'Validando acceso...' : 'Entrar al panel'} {!loading && <ArrowRight className="h-4 w-4" />}
                </button>
                <div className="flex items-center gap-3 py-1"><i className="h-px flex-1 bg-white/[0.07]" /><span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">o continúa con</span><i className="h-px flex-1 bg-white/[0.07]" /></div>
                <button type="button" onClick={handleGoogleLogin} disabled={loading || resetLoading} className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-white/[0.09] bg-white/[0.035] text-sm font-bold text-slate-100 transition hover:border-white/20 hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-60">
                  <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24"><path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335"/><path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4"/><path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05"/><path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853"/></svg>
                  Continuar con Google
                </button>
              </form>
            ) : null}

            {mode === 'reset' ? (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Correo de tu cuenta</span>
                  <span className="relative block"><Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-14 w-full rounded-xl border border-white/[0.09] bg-white/[0.035] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400/55 focus:ring-4 focus:ring-sky-400/[0.07]" placeholder="tu@taller.com" autoComplete="email" required /></span>
                </label>
                <button type="submit" className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#0ea5e9,#2563eb)] text-sm font-black text-white shadow-[0_18px_42px_rgba(14,165,233,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60" disabled={resetLoading || loading}>{resetLoading ? 'Enviando enlace...' : 'Enviar enlace seguro'} {!resetLoading && <ArrowRight className="h-4 w-4" />}</button>
                <button type="button" onClick={() => selectMode('login')} className="inline-flex h-12 w-full items-center justify-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"><ArrowLeft className="h-4 w-4" /> Volver a iniciar sesión</button>
              </form>
            ) : null}

            {mode === 'signup' ? (
              <div>
                <div className="space-y-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                  {['Registra los datos reales de tu taller', 'Configura tu sucursal y forma de contacto', 'Entra al panel con tu espacio separado por tenant'].map((item, index) => <div className="flex items-center gap-3 text-sm text-slate-300" key={item}><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-400/10 text-[10px] font-black text-sky-200">0{index + 1}</span>{item}</div>)}
                </div>
                <Link href={`${publicUrl}/onboarding`} className="mt-5 inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#0ea5e9,#2563eb)] text-sm font-black text-white shadow-[0_18px_42px_rgba(14,165,233,0.22)] transition hover:-translate-y-0.5 hover:brightness-110">Comenzar configuración <ArrowRight className="h-4 w-4" /></Link>
                <p className="mt-4 text-center text-xs leading-5 text-slate-500">El alta continúa en el onboarding oficial para crear correctamente el tenant y su primera sucursal.</p>
              </div>
            ) : null}
          </div>

          <div className="mx-auto flex w-full max-w-[34rem] flex-col gap-2 border-t border-white/[0.06] py-5 text-[10px] text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 {platformBrand}. Acceso al panel administrativo.</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Información separada por tenant</span>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#030914] text-white"><div className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-sky-400" /></div>}>
      <LoginScreen />
    </Suspense>
  );
}
