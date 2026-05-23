import Link from 'next/link';
import { AutoRedirectToAdmin } from './redirect-to-admin';

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

    if (normalizedAdminUrl.protocol !== 'https:') {
      return null;
    }

    return new URL(`/auth/bridge?token=${encodeURIComponent(token)}`, normalizedAdminUrl).toString();
  } catch {
    return null;
  }
}

export default function OnboardingSuccessPage({
  searchParams,
}: {
  searchParams: {
    tenant?: string;
    token?: string;
  };
}) {
  const token = searchParams.token;
  const bridgeUrl = resolveAdminBridgeUrl(token);
  const missingToken = !token;
  const missingAdminUrl = Boolean(token) && !bridgeUrl;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(44,110,159,0.12),_transparent_30%),linear-gradient(180deg,#f4f6f9_0%,#eef2f6_38%,#ffffff_100%)] px-6 py-12 text-slate-950">
      {bridgeUrl ? <AutoRedirectToAdmin token={token} /> : null}
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_90px_rgba(15,23,42,0.08)]">
        <p className="text-xs uppercase tracking-[0.35em] text-[#245a82]">Registro completado</p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Tu prueba gratuita ya quedó creada.
        </h1>
        <p className="text-lg leading-8 text-slate-600">
          {searchParams.tenant ? `Tenant: ${searchParams.tenant}.` : 'El tenant fue creado correctamente.'}{' '}
          La sesión quedó guardada en este navegador.
        </p>
        {missingToken || missingAdminUrl ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
            {missingToken ? 'Falta el token de sesión en el callback de éxito.' : 'Falta configurar NEXT_PUBLIC_WEB_ADMIN_URL con un origen https válido.'}
          </div>
        ) : null}
        <div className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-600">
          Si quieres seguir probando, abre el panel del taller con la misma sesión.
        </div>
        <div className="flex flex-wrap gap-3">
          {searchParams.tenant ? (
            <Link
              href={`/${searchParams.tenant}`}
            className="rounded-full bg-[#2c6e9f] px-8 py-3 font-semibold text-white transition hover:bg-[#245a82]"
          >
            Ir a mi landing
          </Link>
          ) : null}
          <Link
            href="/"
            className="rounded-full bg-slate-100 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}
