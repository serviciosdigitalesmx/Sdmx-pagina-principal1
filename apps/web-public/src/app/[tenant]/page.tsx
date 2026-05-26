import Link from "next/link";
import { HeroButton, ShellBadge, srFixTheme } from "@/components/srfix-theme";

type LandingResponse = {
  success: true;
  data: {
    tenant: {
      id: string;
      slug: string;
      name: string;
      contactPhone?: string | null;
      contactEmail?: string | null;
      contact_phone?: string | null;
      contact_email?: string | null;
      branding?: { primaryColor?: string; secondaryColor?: string; logoUrl?: string } | null;
    };
    landingContent: {
      heroTitle: string;
      heroSubtitle: string;
      heroDescription: string;
      primaryCtaLabel: string;
      primaryCtaHref: string;
      secondaryCtaLabel: string;
      secondaryCtaHref: string;
      contactLabel: string;
      contactHref: string;
      seoTitle: string;
      seoDescription: string;
      services: Array<{ title: string; description: string }>;
      socialLinks: Array<{ label: string; href: string }>;
      showMap: boolean;
      mapEmbedUrl: string;
      showVideo: boolean;
      videoUrl: string;
    };
  };
};

function resolveApiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
}

function resolveWhatsappHref(phone?: string | null) {
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, "");
  return digits.length > 0 ? `https://wa.me/${digits}` : undefined;
}

async function getTenantLanding(tenant: string): Promise<LandingResponse["data"]> {
  const apiBaseUrl = resolveApiBaseUrl();
  if (!apiBaseUrl) throw new Error("NEXT_PUBLIC_API_URL o NEXT_PUBLIC_API_BASE_URL no está configurada");
  const response = await fetch(`${apiBaseUrl}/api/public/tenant/${encodeURIComponent(tenant)}/landing`, { cache: "no-store" });
  const payload = (await response.json().catch(() => null)) as LandingResponse | { error?: string } | null;
  if (!response.ok || !payload || !("success" in payload)) {
    throw new Error((payload && "error" in payload && payload.error) || "No pudimos cargar la landing del tenant");
  }
  return payload.data;
}

export default async function TenantLandingPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;
  const data = await getTenantLanding(tenant);
  const landing = data.landingContent;
  const whatsappHref = resolveWhatsappHref(data.tenant.contactPhone ?? data.tenant.contact_phone ?? landing.contactHref ?? undefined);
  const primaryHref = landing.primaryCtaHref.startsWith("http")
    ? landing.primaryCtaHref
    : `/${tenant}${landing.primaryCtaHref.startsWith("/") ? landing.primaryCtaHref : `/${landing.primaryCtaHref}`}`;
  const secondaryHref = landing.secondaryCtaHref.startsWith("http")
    ? landing.secondaryCtaHref
    : `/${tenant}${landing.secondaryCtaHref.startsWith("/") ? landing.secondaryCtaHref : `/${landing.secondaryCtaHref}`}`;

  return (
    <main className="min-h-screen text-zinc-100" style={{ background: srFixTheme.background }}>
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <header className="rounded-[2rem] border border-amber-700/15 bg-[linear-gradient(180deg,rgba(16,14,12,0.96),rgba(14,13,12,0.92))] px-5 py-4 shadow-[0_20px_70px_rgba(120,53,15,0.18)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.35em] text-amber-100/70">Landing pública del taller</p>
              <ShellBadge>{landing.heroSubtitle}</ShellBadge>
              <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl [font-family:var(--font-cormorant)]">
                {landing.heroTitle}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300 sm:leading-8">{landing.heroDescription}</p>
            </div>
            <div className="grid gap-3 rounded-[1.75rem] border border-stone-700/70 bg-black/20 p-5 sm:grid-cols-2">
              <Link href={primaryHref} className="rounded-full bg-amber-50 px-5 py-4 text-center font-semibold text-zinc-950 transition hover:bg-amber-100">
                {landing.primaryCtaLabel}
              </Link>
              <Link href={secondaryHref} className="rounded-full border border-stone-700 px-5 py-4 text-center font-semibold text-zinc-100 transition hover:border-amber-700/30 hover:bg-white/10">
                {landing.secondaryCtaLabel}
              </Link>
              {whatsappHref ? (
                <a href={whatsappHref} className="rounded-full border border-stone-700 px-5 py-4 text-center font-semibold text-zinc-100 transition hover:border-amber-700/30 hover:bg-white/10">
                  {landing.contactLabel}
                </a>
              ) : null}
              <Link href={`/t/${tenant}/portal`} className="rounded-full border border-stone-700 px-5 py-4 text-center font-semibold text-zinc-100 transition hover:border-amber-700/30 hover:bg-white/10">
                Portal del cliente
              </Link>
            </div>
          </div>
        </header>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {landing.services.length > 0 ? landing.services.map((service) => (
            <article key={`${service.title}-${service.description}`} className="rounded-[1.75rem] border border-stone-700/70 bg-white/4 p-6 shadow-[0_16px_60px_rgba(0,0,0,0.24)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-100/70">Servicio</p>
              <h2 className="mt-3 text-2xl font-bold text-zinc-50">{service.title}</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-300">{service.description}</p>
            </article>
          )) : null}
        </section>

        <section className="grid gap-6 rounded-[2rem] border border-amber-700/15 bg-[linear-gradient(180deg,rgba(16,14,12,0.96),rgba(22,18,14,0.98))] p-6 shadow-[0_16px_70px_rgba(0,0,0,0.24)] lg:grid-cols-[1fr_0.95fr] lg:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-100/70">Operación pública</p>
            <h2 className="mt-3 text-3xl font-bold text-zinc-50 [font-family:var(--font-cormorant)]">
              {data.tenant.name} atiende, cotiza y rastrea desde una sola experiencia.
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">{landing.seoDescription}</p>
          </div>
          <div className="rounded-[1.75rem] border border-stone-700/70 bg-black/20 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-400">Contacto</p>
            <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-300">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3">
                <span className="font-semibold text-zinc-50">Teléfono:</span> {data.tenant.contactPhone ?? data.tenant.contact_phone ?? "Sin teléfono"}
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3">
                <span className="font-semibold text-zinc-50">Correo:</span> {data.tenant.contactEmail ?? data.tenant.contact_email ?? "Sin correo"}
              </div>
              {data.tenant.branding?.logoUrl ? (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3">
                  <span className="font-semibold text-zinc-50">Logo:</span> activo
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;
  try {
    const data = await getTenantLanding(tenant);
    return {
      title: data.landingContent.seoTitle || data.tenant.name,
      description: data.landingContent.seoDescription || `Landing pública del taller ${data.tenant.name}.`,
    };
  } catch {
    return { title: tenant, description: "Landing pública del taller." };
  }
}
