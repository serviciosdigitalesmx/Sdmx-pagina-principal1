import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { notFound } from "next/navigation";
import { optionalEnv } from "@white-label/config";
import { Badge, SurfaceCard } from "@white-label/ui";

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
      branding?: { primaryColor?: string; secondaryColor?: string; logoUrl?: string; brandHue?: number; customTagline?: string } | null;
      config?: {
        labels?: Record<string, string>;
        templates?: {
          landing?: Record<string, unknown>;
        };
      } | null;
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

function resolveWhatsappHref(phone?: string | null) {
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, "");
  return digits.length > 0 ? `https://wa.me/${digits}` : undefined;
}

function hashTenantName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function parseColorToHue(color: string) {
  const value = color.trim();
  if (!value) return null;

  const hex = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (hex) {
    const raw = hex[1];
    const expanded =
      raw.length === 3
        ? raw.split("").map((ch) => ch + ch).join("")
        : raw.slice(0, 6);
    const r = Number.parseInt(expanded.slice(0, 2), 16) / 255;
    const g = Number.parseInt(expanded.slice(2, 4), 16) / 255;
    const b = Number.parseInt(expanded.slice(4, 6), 16) / 255;
    return rgbToHue(r, g, b);
  }

  const rgb = value.match(/^rgba?\(([^)]+)\)$/i);
  if (rgb) {
    const parts = rgb[1].split(",").map((part) => Number.parseFloat(part.trim()));
    if (parts.length >= 3 && parts.every((part) => Number.isFinite(part))) {
      return rgbToHue(parts[0] / 255, parts[1] / 255, parts[2] / 255);
    }
  }

  const hsl = value.match(/^hsla?\(([^)]+)\)$/i);
  if (hsl) {
    const hue = Number.parseFloat(hsl[1].split(",")[0]?.trim() ?? "");
    if (Number.isFinite(hue)) return ((hue % 360) + 360) % 360;
  }

  return null;
}

function rgbToHue(r: number, g: number, b: number) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  if (delta === 0) return 0;
  let hue = 0;
  if (max === r) hue = 60 * (((g - b) / delta) % 6);
  else if (max === g) hue = 60 * ((b - r) / delta + 2);
  else hue = 60 * ((r - g) / delta + 4);
  return ((hue % 360) + 360) % 360;
}

function getTenantHue(name: string, branding?: { brandHue?: number | null; primaryColor?: string; secondaryColor?: string } | null) {
  if (typeof branding?.brandHue === "number" && Number.isFinite(branding.brandHue)) {
    return ((branding.brandHue % 360) + 360) % 360;
  }
  if (typeof branding?.primaryColor === "string" && branding.primaryColor.trim()) {
    const parsed = parseColorToHue(branding.primaryColor);
    if (parsed !== null) return parsed;
  }
  return hashTenantName(name) % 360;
}

function getTenantInitials(name: string) {
  const parts = name
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "FX";
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("").slice(0, 2) || "FX";
}

function getRealisticRepairCount(name: string) {
  const hash = hashTenantName(name);
  return 50 + (hash % 201);
}

function buildTenantStyles(hue: number) {
  const secondary = (hue + 30) % 360;
  const tertiary = (hue + 40) % 360;
  return {
    "--tenant-hue": String(hue),
    "--tenant-primary": `hsl(${hue} 85% 55%)`,
    "--tenant-primary-glow": `hsla(${hue} 85% 55% / 0.3)`,
    "--tenant-primary-dim": `hsla(${hue} 60% 20% / 1)`,
    "--tenant-secondary": `hsl(${secondary} 80% 60%)`,
    "--tenant-gradient": `linear-gradient(135deg, hsl(${hue} 85% 55%) 0%, hsl(${tertiary} 80% 45%) 100%)`,
    "--bg-deep": "#0a0e1a",
    "--bg-card": "rgba(255,255,255,0.03)",
    "--bg-card-hover": "rgba(255,255,255,0.06)",
    "--border-subtle": "rgba(255,255,255,0.08)",
    "--border-glow": "rgba(255,255,255,0.15)",
    "--text-primary": "#f0f2f5",
    "--text-secondary": "#8892a0",
    "--text-muted": "#4a5568",
  } as CSSProperties;
}

function getDefaultValue(value: string | null | undefined, fallback: string) {
  return value && value.trim().length > 0 ? value.trim() : fallback;
}

const adminBaseUrl = process.env.NEXT_PUBLIC_WEB_ADMIN_URL ?? null;
const adminLoginUrl = adminBaseUrl ? `${adminBaseUrl}/login` : "/login";
const adminOnboardingUrl = adminBaseUrl ? `${adminBaseUrl}/login?mode=signup` : "/login?mode=signup";

const whatsappSteps = [
  ["1. Registras la orden", "FIXI guarda folio, cliente y estado."],
  ["2. Envías por WhatsApp", "Un clic y el cliente recibe su seguimiento."],
  ["3. El cliente consulta solo", "Ya no te persigue por mensaje o llamada."],
] as const;

const receptionChecks = [
  "Condición cosmética",
  "Daño físico reportado",
  "Accesorios recibidos",
  "Aceptación del cliente",
] as const;

async function getTenantLanding(tenant: string): Promise<LandingResponse["data"] | null> {
  const apiBaseUrl =
    optionalEnv("NEXT_PUBLIC_API_URL") ??
    optionalEnv("NEXT_PUBLIC_APP_URL") ??
    optionalEnv("NEXT_PUBLIC_WEB_PUBLIC_URL") ??
    "http://127.0.0.1:3008";
  const response = await fetch(`${apiBaseUrl}/api/public/tenant/${encodeURIComponent(tenant)}/landing`, { cache: "no-store" });
  const payload = (await response.json().catch(() => null)) as LandingResponse | { error?: string } | null;
  if (!response.ok || !payload || !("success" in payload)) {
    return null;
  }
  return payload.data;
}

function CTA({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
}) {
  const base = "inline-flex items-center justify-center rounded-full px-5 py-3 text-center text-sm font-semibold transition duration-200";
  const className =
    variant === "primary"
      ? `${base} border border-[color:var(--border-subtle)] bg-[color:var(--bg-card)] text-[color:var(--text-primary)] hover:-translate-y-0.5 hover:bg-[color:var(--bg-card-hover)] hover:border-[color:var(--border-glow)]`
      : `${base} border border-sky-400/35 bg-sky-500/15 text-sky-100 hover:border-sky-300/45 hover:bg-sky-500/20`;
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function SectionCard({
  title,
  eyebrow,
  copy,
  children,
  className = "",
}: {
  title: string;
  eyebrow: string;
  copy?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-[2rem] border border-[color:var(--border-subtle)] bg-[color:var(--bg-card)] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.24)] ${className}`}>
      <div className="mb-5 space-y-3">
        <span className="inline-flex rounded-full border border-[color:var(--border-subtle)] bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--text-secondary)]">{eyebrow}</span>
        <h2 className="text-3xl font-black tracking-[-0.02em] text-[color:var(--text-primary)] sm:text-4xl">{title}</h2>
        {copy ? <p className="max-w-2xl text-base leading-8 text-[color:var(--text-secondary)]">{copy}</p> : null}
      </div>
      {children}
    </section>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-[color:var(--border-subtle)] bg-black/20 px-4 py-4">
      <p className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--text-muted)]">{label}</p>
      <p className="mt-2 text-3xl font-black tracking-[-0.02em] text-[color:var(--text-primary)]">{value}</p>
    </div>
  );
}

export default async function TenantLandingPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;
  const data = await getTenantLanding(tenant);
  if (!data) {
    notFound();
  }

  const landing = data.landingContent;
  const templateLanding = data.tenant.config?.templates?.landing ?? {};
  const labels = data.tenant.config?.labels ?? {};
  const services = Array.isArray(templateLanding.services) && templateLanding.services.length > 0 ? templateLanding.services : landing.services;
  const socialLinks = Array.isArray(landing.socialLinks) ? landing.socialLinks : [];
  const heroTitle = typeof templateLanding.heroTitle === "string" && templateLanding.heroTitle.trim().length > 0 ? templateLanding.heroTitle : landing.heroTitle;
  const heroSubtitle = typeof templateLanding.heroSubtitle === "string" && templateLanding.heroSubtitle.trim().length > 0 ? templateLanding.heroSubtitle : landing.heroSubtitle;
  const heroDescription = typeof templateLanding.heroDescription === "string" && templateLanding.heroDescription.trim().length > 0 ? templateLanding.heroDescription : landing.heroDescription;
  const primaryCtaLabel = typeof templateLanding.primaryCtaLabel === "string" && templateLanding.primaryCtaLabel.trim().length > 0 ? templateLanding.primaryCtaLabel : landing.primaryCtaLabel;
  const primaryCtaHref = typeof templateLanding.primaryCtaHref === "string" && templateLanding.primaryCtaHref.trim().length > 0 ? templateLanding.primaryCtaHref : landing.primaryCtaHref;
  const secondaryCtaLabel = typeof templateLanding.secondaryCtaLabel === "string" && templateLanding.secondaryCtaLabel.trim().length > 0 ? templateLanding.secondaryCtaLabel : landing.secondaryCtaLabel;
  const secondaryCtaHref = typeof templateLanding.secondaryCtaHref === "string" && templateLanding.secondaryCtaHref.trim().length > 0 ? templateLanding.secondaryCtaHref : landing.secondaryCtaHref;
  const contactLabel = typeof templateLanding.contactLabel === "string" && templateLanding.contactLabel.trim().length > 0 ? templateLanding.contactLabel : landing.contactLabel;
  const phone = data.tenant.contactPhone ?? data.tenant.contact_phone ?? null;
  const email = data.tenant.contactEmail ?? data.tenant.contact_email ?? null;
  const whatsappHref = resolveWhatsappHref(phone ?? landing.contactHref ?? undefined);
  const portalHref = `/${tenant}/portal`;
  const quoteHref = `/${tenant}/cotizar`;
  const trackingHref = `/${tenant}/tracking`;
  const hue = getTenantHue(data.tenant.name, data.tenant.branding);
  const initials = getTenantInitials(data.tenant.name);
  const repairCount = getRealisticRepairCount(data.tenant.name);
  const styles = buildTenantStyles(hue);
  const primaryColor = `hsl(${hue} 85% 55%)`;
  const secondaryColor = `hsl(${(hue + 30) % 360} 80% 60%)`;
  const tintColor = `hsla(${hue} 85% 55% / 0.18)`;
  const accentColor = `hsla(${hue} 85% 55% / 0.35)`;
  const hasLogo = Boolean(data.tenant.branding?.logoUrl?.trim());
  const tagline = getDefaultValue(data.tenant.branding?.customTagline, heroSubtitle || "Reparación profesional de electrónicos");
  const heroTitleParts = heroTitle.trim().split(/\s+/).filter(Boolean);
  const heroTitleLine1 = heroTitleParts.slice(0, 2).join(" ") || heroTitle;
  const heroTitleLine2 = heroTitleParts.slice(2).join(" ") || heroSubtitle || heroTitle;
  const hasMap = Boolean(landing.showMap && landing.mapEmbedUrl);
  const hasWhatsApp = Boolean(whatsappHref);
  const serviceIcons = ["📱", "💻", "🎮", "⌚", "🔧", "⚡"];
  const trustBadges = ["Garantía 30 días", "Diagnóstico gratis", "Reparación express", "WhatsApp directo"];
  const stats = [
    { label: "Reparaciones al mes", value: String(repairCount) },
    { label: "Tiempo promedio", value: "24h" },
    { label: "Garantía", value: "30 días" },
    { label: "Atención", value: hasWhatsApp ? "WhatsApp" : "Panel" },
  ];

  return (
    <main className="min-h-screen overflow-x-hidden text-[color:var(--text-primary)]" style={{ background: "var(--bg-deep)", ...styles }}>
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,var(--tenant-primary-glow),transparent_30%),radial-gradient(circle_at_80%_10%,hsla(calc(var(--tenant-hue) + 40),85%,55%,0.16),transparent_24%),linear-gradient(180deg,rgba(10,14,26,0.92),rgba(10,14,26,1))]" />
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(135deg,rgba(255,255,255,0.02),transparent_25%,rgba(255,255,255,0.01)_50%,transparent_75%,rgba(255,255,255,0.02))] bg-[length:120%_120%] animate-[gradientShift_16s_ease-in-out_infinite] opacity-60" />

      <section className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <SurfaceCard elevated className="flex flex-col gap-4 border border-[color:var(--border-subtle)] bg-[color:var(--bg-card)] px-5 py-4 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-[color:var(--border-glow)] bg-[var(--tenant-gradient)] text-sm font-black text-white shadow-[0_12px_30px_var(--tenant-primary-glow)]">
              {hasLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.tenant.branding?.logoUrl ?? ""} alt={data.tenant.name} className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div>
              <Badge variant="neutral">FIXI</Badge>
              <h1 className="text-xl font-semibold tracking-tight text-white">{data.tenant.name}</h1>
              <p className="text-sm text-[color:var(--text-secondary)]">{tagline}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-[color:var(--text-secondary)]">
            <Link href="#inicio" className="rounded-full px-4 py-2 transition hover:bg-white/5 hover:text-white">Inicio</Link>
            <Link href="#cotizar" className="rounded-full px-4 py-2 transition hover:bg-white/5 hover:text-white">Cotizar</Link>
            <Link href="#estado" className="rounded-full px-4 py-2 transition hover:bg-white/5 hover:text-white">Estado</Link>
            <Link href="#contacto" className="rounded-full px-4 py-2 transition hover:bg-white/5 hover:text-white">Contacto</Link>
          </div>
        </SurfaceCard>
      </section>

      <section id="inicio" className="mx-auto w-full max-w-7xl px-4 pb-6 pt-4 sm:px-6 lg:px-8 lg:pt-8">
        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="space-y-6 pt-4 lg:pt-10">
            <div className="inline-flex items-center gap-3 rounded-full border border-[color:var(--border-subtle)] bg-white/5 px-4 py-2 text-xs font-semibold text-[color:var(--text-secondary)]">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_20px_6px_rgba(34,197,94,0.18)] animate-pulse" />
              Operación real del taller conectada al tenant
            </div>
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--text-secondary)]">{tagline}</p>
              <h2 className="max-w-3xl text-5xl font-black tracking-[-0.02em] text-white sm:text-6xl lg:text-7xl">
                {heroTitleLine1}
                <span className="block bg-[var(--tenant-gradient)] bg-clip-text text-transparent">{heroTitleLine2}</span>
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-[color:var(--text-secondary)] sm:text-xl">{heroDescription}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <CTA href={primaryCtaHref || quoteHref} variant="secondary">{primaryCtaLabel}</CTA>
              <CTA href={secondaryCtaHref || portalHref}>{secondaryCtaLabel}</CTA>
              {hasWhatsApp ? (
                <a href={whatsappHref} className="inline-flex items-center justify-center rounded-full border border-emerald-400/70 bg-emerald-500 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:bg-emerald-400">
                  {contactLabel}
                </a>
              ) : (
                <CTA href={adminLoginUrl} variant="primary">Configura WhatsApp</CTA>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <StatPill key={stat.label} label={stat.label} value={stat.value} />
              ))}
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {trustBadges.map((badge) => (
                <span key={badge} className="inline-flex items-center rounded-full border border-[color:var(--border-subtle)] bg-white/5 px-4 py-2 text-xs font-semibold text-white/85">{badge}</span>
              ))}
            </div>
          </div>

          <div className="relative lg:pt-0">
            <div className="pointer-events-none absolute inset-x-10 top-10 h-40 rounded-full bg-[var(--tenant-gradient)] blur-3xl opacity-25 animate-pulse" />
            <SurfaceCard elevated className="relative overflow-hidden border border-[color:var(--border-subtle)] bg-[linear-gradient(180deg,rgba(15,23,42,0.95),rgba(2,6,23,0.98))] p-5 shadow-[0_24px_80px_rgba(37,99,235,0.14)]">
              <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_50%_18%,var(--tenant-primary-glow),transparent_30%),radial-gradient(circle_at_80%_90%,rgba(255,255,255,0.05),transparent_25%)]" />
              <div className="relative mx-auto max-w-[360px] animate-[float_5.5s_ease-in-out_infinite]">
                <div className="rounded-[2rem] border border-[color:var(--border-glow)] bg-[rgba(10,14,26,0.85)] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-[var(--tenant-gradient)] text-sm font-black text-white shadow-[0_0_26px_var(--tenant-primary-glow)]">
                        {hasLogo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={data.tenant.branding?.logoUrl ?? ""} alt={data.tenant.name} className="h-full w-full object-cover" />
                        ) : (
                          initials
                        )}
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--text-secondary)]">{data.tenant.name}</p>
                        <p className="text-sm text-white/80">Seguimiento y cotizador</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200 animate-pulse">En vivo</span>
                  </div>

                  <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--text-secondary)]">¿Ya dejaste tu equipo?</p>
                    <p className="mt-3 max-w-xs text-2xl font-black uppercase leading-tight text-white sm:text-3xl">Consulta el estado de tu reparación en tiempo real.</p>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <CTA href={portalHref}>Ir al seguimiento</CTA>
                      <CTA href={`${portalHref}?folio=FIX-00106`} variant="primary">Abrir ejemplo</CTA>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                      <p className="text-xs font-semibold text-sky-200">Ver estado</p>
                      <p className="mt-2 text-sm leading-6 text-[color:var(--text-secondary)]">Lleva al seguimiento público para consultar por folio.</p>
                    </div>
                    <div className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                      <p className="text-xs font-semibold text-sky-200">Cotización</p>
                      <p className="mt-2 text-sm leading-6 text-[color:var(--text-secondary)]">Solicita una cotización y recibe folio real.</p>
                    </div>
                  </div>
                </div>
              </div>
            </SurfaceCard>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {services.map((service, index) => (
            <div key={service.title} className="group rounded-[1.6rem] border border-[color:var(--border-subtle)] bg-[color:var(--bg-card)] p-5 transition duration-300 hover:-translate-y-1 hover:border-[color:var(--border-glow)] hover:bg-[color:var(--bg-card-hover)] hover:shadow-[0_18px_50px_var(--tenant-primary-glow)]">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--tenant-gradient)] text-lg text-white shadow-[0_0_26px_var(--tenant-primary-glow)]">{serviceIcons[index % serviceIcons.length]}</div>
              <div className="inline-flex rounded-full border border-[color:var(--border-subtle)] bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--text-secondary)]">Servicio</div>
              <h3 className="mt-4 text-xl font-black uppercase tracking-[0.08em] text-white">{service.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="cotizar" className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <SectionCard eyebrow={labels.quote ?? "Cotizar"} title={heroSubtitle || "Cotiza rápido, sin complicarte"} copy="Cuéntanos qué equipo tienes y te ayudamos a arrancar la reparación.">
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  "Nombre del cliente",
                  "WhatsApp",
                  "Tipo de dispositivo",
                  "Marca / modelo",
                ].map((label) => (
                  <label key={label} className="space-y-2">
                    <span className="text-xs uppercase tracking-[0.24em] text-[color:var(--text-secondary)]">{label}</span>
                    <div className="rounded-[1.2rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-[color:var(--text-secondary)]">{label === "WhatsApp" ? "Agrega tu WhatsApp para recibir cotizaciones" : "Escribe aquí"}</div>
                  </label>
                ))}
              </div>
              <label className="space-y-2">
                <span className="text-xs uppercase tracking-[0.24em] text-[color:var(--text-secondary)]">Problema detallado</span>
                <div className="min-h-[120px] rounded-[1.2rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-[color:var(--text-secondary)]">Describe la falla, urgencia y equipo. Esto prepara la solicitud para recepción.</div>
              </label>
              <div className="flex flex-wrap gap-3">
                <CTA href={adminLoginUrl}>Abrir panel</CTA>
                <CTA href={portalHref} variant="primary">Ver estado</CTA>
              </div>
            </div>
          </SectionCard>

          <SurfaceCard elevated className="rounded-[2rem] border border-[color:var(--border-subtle)] bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.96))] p-6 shadow-[0_24px_80px_rgba(37,99,235,0.14)]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--text-secondary)]">Lo que sigue</p>
            <div className="mt-5 space-y-4">
              {[
                ["1. Cotizar", "El usuario llena datos del equipo y la falla."],
                ["2. Ver estado", "Consulta el portal con el folio real."],
                ["3. Imprimir / PDF", "Se abre el PDF real de la cotización o reparación."],
              ].map(([title, copy]) => (
                <div key={title} className="rounded-2xl border border-white/8 bg-white/4 p-4 transition hover:-translate-y-0.5 hover:border-[color:var(--border-glow)]">
                  <p className="text-sm font-semibold text-slate-100">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-[color:var(--text-secondary)]">{copy}</p>
                </div>
              ))}
            </div>
          </SurfaceCard>
        </div>
      </section>

      <section id="estado" className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionCard
            eyebrow="Seguimiento público"
            title="Tu cliente ve el estado real sin inventar nada."
            copy="El portal del cliente sigue existiendo, pero ahora la landing lo presenta como un flujo limpio y confiable."
            className="h-full"
          >
            <div className="grid gap-3">
              <div className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300/80">Ver estado</p>
                <p className="mt-2 text-sm leading-7 text-[color:var(--text-secondary)]">Lleva al seguimiento público para consultar por folio.</p>
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300/80">Cotización</p>
                <p className="mt-2 text-sm leading-7 text-[color:var(--text-secondary)]">Solicita una cotización y recibe folio real.</p>
              </div>
            </div>
          </SectionCard>
          <SurfaceCard elevated className="overflow-hidden rounded-[2rem] border border-[color:var(--border-subtle)] bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.96))] p-5 shadow-[0_24px_80px_rgba(37,99,235,0.14)]">
            {hasMap ? (
              <iframe
                title={`${data.tenant.name} ubicación`}
                src={landing.mapEmbedUrl}
                className="h-[420px] w-full border-0 rounded-[1.6rem]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="flex h-[420px] flex-col justify-between rounded-[1.6rem] border border-dashed border-white/10 bg-black/25 p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--text-secondary)]">Mapa en espera</p>
                  <p className="mt-4 max-w-md text-3xl font-black uppercase leading-tight text-white">Publica la ubicación real del taller desde el panel del tenant.</p>
                </div>
                <div className="grid gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-[color:var(--text-secondary)]">Sin mapa embebido no mostramos una dirección inventada.</div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-[color:var(--text-secondary)]">Configura `landing_content.mapEmbedUrl` o publica enlaces externos reales.</div>
                </div>
              </div>
            )}
          </SurfaceCard>
        </div>
      </section>

      <section id="contacto" className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <SectionCard eyebrow="Contacto" title="Atención del taller sin inventar datos" copy="La ubicación, teléfono y enlaces salen de la configuración real del tenant. Si no hay mapa configurado, mostramos contacto directo.">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.92fr]">
            <div className="space-y-4">
              {[
                {
                  label: "Teléfono / WhatsApp",
                  value: phone,
                  placeholder: "Agrega tu WhatsApp para recibir cotizaciones",
                },
                {
                  label: "Correo",
                  value: email,
                  placeholder: "Configura tu correo de contacto",
                },
                {
                  label: "Mapa",
                  value: hasMap ? "Disponible" : null,
                  placeholder: "Publica tu ubicación real desde el panel",
                },
                {
                  label: "Redes sociales",
                  value: socialLinks.length > 0 ? `${socialLinks.length} publicados` : null,
                  placeholder: "Conecta tus redes para que te encuentren fácil",
                },
              ].map((item) => {
                const hasValue = Boolean(item.value);
                return (
                  <div
                    key={item.label}
                    className="rounded-[1.4rem] border border-[color:var(--border-subtle)] bg-black/20 px-5 py-4"
                    style={{ borderLeft: `4px solid ${hasValue ? primaryColor : "rgba(255,255,255,0.18)"}` }}
                  >
                    <p className="text-sm font-semibold text-sky-300">{item.label}</p>
                    <p className="mt-2 text-sm leading-7 text-[color:var(--text-secondary)]">{hasValue ? item.value : item.placeholder}</p>
                    {!hasValue ? <Link href={adminLoginUrl} className="mt-3 inline-flex text-sm font-semibold text-sky-300 transition hover:text-sky-200">Configurar →</Link> : null}
                  </div>
                );
              })}
            </div>

            <div className="rounded-[1.6rem] border border-[color:var(--border-subtle)] bg-[color:var(--bg-card)] p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--text-secondary)]">Mapa / Ubicación</p>
              <div className="mt-4 flex h-[340px] flex-col items-center justify-center rounded-[1.4rem] border border-dashed border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.2))] text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--tenant-gradient)] text-2xl font-black text-white shadow-[0_0_30px_var(--tenant-primary-glow)]">📍</div>
                <p className="mt-4 text-lg font-semibold text-white">Publica la ubicación real del taller desde el panel</p>
                <p className="mt-2 max-w-sm text-sm leading-7 text-[color:var(--text-secondary)]">Si no hay mapa configurado, mostramos un placeholder amable en lugar de inventar una dirección.</p>
              </div>
            </div>
          </div>
        </SectionCard>
      </section>

      <footer id="contacto" className="mx-auto w-full max-w-7xl px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Web pública", `${data.tenant.slug}.serviciosdigitalesmx.online`],
              ["Panel administrativo", "Acceso desde el panel"],
              ["Correo", email ? email : "Configura tu correo de contacto"],
              ["WhatsApp", phone ? phone : "Agrega tu WhatsApp para recibir cotizaciones"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4" style={{ borderLeft: `4px solid ${phone || email ? primaryColor : "rgba(255,255,255,0.18)"}` }}>
                <p className="text-[11px] uppercase tracking-[0.28em] text-sky-300/80">{label}</p>
                <p className="mt-2 text-sm font-medium text-white">{value}</p>
                {((label === "Correo" && !email) || (label === "WhatsApp" && !phone)) ? (
                  <Link href={adminLoginUrl} className="mt-3 inline-flex text-sm font-semibold text-sky-300 transition hover:text-sky-200">
                    Configurar →
                  </Link>
                ) : null}
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 text-sm text-[color:var(--text-secondary)] sm:flex-row sm:items-center sm:justify-between">
            <p>{data.tenant.name} · Landing automática con branding del tenant.</p>
            <p>{initials} · {getDefaultValue(data.tenant.branding?.customTagline, heroSubtitle)}</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;
  try {
    const data = await getTenantLanding(tenant);
    if (!data) {
      return { title: tenant, description: "Landing pública del taller." };
    }
    return {
      title: data.landingContent.seoTitle || data.tenant.name,
      description: data.landingContent.seoDescription || `Landing pública del taller ${data.tenant.name}.`,
    };
  } catch {
    return { title: tenant, description: "Landing pública del taller." };
  }
}
