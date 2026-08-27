import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import { LeadForm } from "../lead/lead-form";
import { resolveLandingSectionRegistry } from "./section-registry";
import { resolveTenantTheme } from "../theme/theme-resolver";
import type { LandingContent, Tenant } from "../types";

type LandingRendererProps = {
  tenant: Tenant;
  landingContent: LandingContent;
};

function whatsappHref(phone?: string | null) {
  const digits = phone?.replace(/\D/g, "") ?? "";
  return digits ? `https://wa.me/${digits}` : null;
}

function initials(value: string) {
  return value.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase();
}

export function LandingRenderer({ tenant, landingContent }: LandingRendererProps) {
  const theme = resolveTenantTheme(tenant);
  const enabled = new Set(resolveLandingSectionRegistry(landingContent).filter((section) => section.enabled).map((section) => section.id));
  const whatsapp = whatsappHref(landingContent.contactPhone || tenant.contactPhone);
  const heroImage = theme.imagery.heroImage || theme.imagery.coverImage || tenant.branding.heroImageUrl || tenant.branding.coverImageUrl || tenant.branding.logoUrl || null;
  const portalHref = `/t/${tenant.slug}/portal`;
  const ratingValue = landingContent.ratingValue || "";
  const ratingLabel = landingContent.ratingLabel || "";
  const ratingCountLabel = landingContent.ratingCountLabel || "";
  const locationHref = landingContent.showMap && landingContent.mapEmbedUrl
    ? landingContent.mapEmbedUrl
    : tenant.contactAddress
      ? `https://www.google.com/maps/search/${encodeURIComponent(tenant.contactAddress)}`
      : "";

  const pageStyle = {
    "--tenant-primary": theme.colors.primary,
    "--tenant-secondary": theme.colors.secondary,
    "--tenant-accent": theme.colors.accent,
    "--tenant-surface": theme.colors.surface,
    "--tenant-border": theme.colors.border,
    "--tenant-success": theme.colors.success,
    "--tenant-muted": theme.colors.muted,
    fontFamily: theme.typography.sans,
  } as CSSProperties;
  const displayStyle = { fontFamily: theme.typography.display } as CSSProperties;

  return (
    <main className="min-h-screen bg-[#1e1e1e] text-[#f2f2f2]" style={pageStyle}>
      <nav className="sticky top-0 z-30 border-b-2 bg-[#1e1e1e]/95 px-5 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.32)] backdrop-blur md:px-[5%]" style={{ borderColor: "var(--tenant-accent)" }}>
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4">
          <a href="#inicio" className="flex min-w-0 items-center gap-3 text-lg font-black uppercase tracking-[0.08em] sm:text-xl" style={displayStyle}>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded border border-white/20 bg-white/5">
              {tenant.branding.logoUrl ? <Image src={tenant.branding.logoUrl} alt="" width={36} height={36} className="h-full w-full object-contain" /> : initials(tenant.name)}
            </span>
            <span className="truncate">{tenant.name}</span>
          </a>
          <div className="hidden items-center gap-7 text-sm font-bold uppercase tracking-[0.12em] text-[#8a8f95] lg:flex" style={{ fontFamily: theme.typography.mono }}>
            <a href="#inicio" className="transition hover:text-white">Inicio</a>
            <a href="#cotizar" className="transition hover:text-white">Cotizar</a>
            {landingContent.testimonials?.length ? <a href="#opiniones" className="transition hover:text-white">Opiniones</a> : null}
            {tenant.contactAddress ? <a href="#ubicacion" className="transition hover:text-white">Ubicación</a> : null}
          </div>
          <Link href={portalHref} className="shrink-0 rounded px-4 py-2 text-sm font-bold uppercase tracking-[0.1em] text-white shadow-[0_0_20px_color-mix(in_srgb,var(--tenant-accent)_42%,transparent)]" style={{ backgroundColor: "var(--tenant-accent)" }}>
            Ver estado
          </Link>
        </div>
      </nav>

      {enabled.has("hero") ? <section id="inicio" className="relative overflow-hidden bg-[linear-gradient(135deg,#1e1e1e_0%,#2b2b2b_100%)] px-5 py-20 md:min-h-[min(760px,calc(100vh-70px))] md:px-[5%] md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_45%,color-mix(in_srgb,var(--tenant-accent)_20%,transparent)_0%,transparent_35%),radial-gradient(circle_at_84%_76%,color-mix(in_srgb,var(--tenant-primary)_28%,transparent)_0%,transparent_37%)]" />
        <div className="relative mx-auto grid max-w-[1400px] items-center gap-12 lg:grid-cols-2">
          <div>
            {ratingLabel ? <div className="mb-6 inline-flex items-center gap-2 border px-4 py-2 text-xs font-bold uppercase tracking-[0.14em]" style={{ borderColor: "var(--tenant-accent)", color: "var(--tenant-accent)", fontFamily: theme.typography.mono }}>
              {ratingLabel}
            </div> : null}
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em]" style={{ color: "var(--tenant-accent)", fontFamily: theme.typography.mono }}>{landingContent.heroSubtitle}</p>
            <h1 className="max-w-3xl text-5xl font-black uppercase leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-7xl" style={displayStyle}>{landingContent.heroTitle}</h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[#b6bbc0]">{landingContent.heroDescription}</p>
            {ratingValue || ratingCountLabel ? <div className="mt-7 flex max-w-xl flex-wrap items-center gap-3 border border-[#8a8f95] border-l-4 bg-[#2b2b2b]/80 px-5 py-4" style={{ borderLeftColor: "var(--tenant-primary)" }}>
              <span className="text-base font-black tracking-[0.16em]" style={{ color: "var(--tenant-primary)" }}>{ratingValue}</span>
              <span className="text-sm font-semibold text-white">{ratingCountLabel}</span>
            </div> : null}
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#cotizar" className="rounded border-2 px-6 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-[0_6px_24px_color-mix(in_srgb,var(--tenant-primary)_38%,transparent)] transition hover:-translate-y-0.5" style={{ backgroundColor: "var(--tenant-primary)", borderColor: "var(--tenant-primary)" }}>Cotizar</a>
              <Link href={portalHref} className="rounded border-2 px-6 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5" style={{ backgroundColor: "var(--tenant-accent)", borderColor: "var(--tenant-accent)" }}>Ver estado</Link>
              {whatsapp ? <a href={whatsapp} target="_blank" rel="noreferrer" className="rounded border-2 px-6 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5" style={{ backgroundColor: "var(--tenant-success)", borderColor: "var(--tenant-success)" }}>WhatsApp</a> : null}
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[500px] lg:justify-self-end">
            <div className="aspect-square overflow-hidden border-2 bg-[#2b2b2b] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5),inset_0_0_40px_color-mix(in_srgb,var(--tenant-accent)_12%,transparent)]" style={{ borderColor: "var(--tenant-accent)" }}>
              {heroImage ? <Image src={heroImage} alt={tenant.name} width={500} height={500} className="h-full w-full object-contain" /> : <div className="flex h-full items-center justify-center text-center text-sm text-[#8a8f95]">El tenant puede configurar su imagen principal.</div>}
            </div>
          </div>
        </div>
      </section> : null}

      <section className="border-y-4 px-5 py-16 text-center" style={{ backgroundColor: "var(--tenant-accent)", borderColor: "var(--tenant-primary)" }}>
        <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl" style={displayStyle}>¿Ya dejaste tu equipo?</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">Consulta el estado de tu servicio en tiempo real y recibe actualizaciones directas de tu taller.</p>
        <Link href={portalHref} className="mt-7 inline-flex border-2 bg-white px-7 py-4 text-sm font-black uppercase tracking-[0.13em] transition hover:-translate-y-0.5" style={{ borderColor: "var(--tenant-primary)", color: "var(--tenant-accent)" }}>Ir al panel del cliente</Link>
      </section>

      {enabled.has("services") ? <section id="cotizar" className="bg-[#1e1e1e] px-5 py-20 md:px-[5%]">
        <div className="mx-auto max-w-[1200px]">
          <header className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-black uppercase tracking-tight" style={displayStyle}>Cotizar</h2>
            <div className="mx-auto mt-4 h-1 w-16" style={{ backgroundColor: "var(--tenant-primary)" }} />
            <p className="mt-5 text-[#8a8f95]">Selecciona el servicio que necesitas y comparte los detalles para recibir una respuesta del taller.</p>
          </header>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(landingContent.services ?? []).map((service, index) => <article key={`${service.title}-${index}`} className="border border-[#5e646a] bg-[#242424] p-7 transition hover:-translate-y-1 hover:border-[var(--tenant-accent)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.28)]">
              <div className="mb-8 flex h-12 w-12 items-center justify-center border text-sm font-black" style={{ color: "var(--tenant-accent)", borderColor: "var(--tenant-accent)" }}>{String(index + 1).padStart(2, "0")}</div>
              <h3 className="text-lg font-black uppercase tracking-wide text-white" style={displayStyle}>{service.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[#9ca1a7]">{service.description}</p>
            </article>)}
          </div>
          {enabled.has("quote") ? <div className="mt-12 border-t-4 bg-[#2b2b2b] p-5 sm:p-8" style={{ borderTopColor: "var(--tenant-primary)" }}><LeadForm tenantSlug={tenant.slug} tenantName={tenant.name} contactPhone={tenant.contactPhone || null} contactEmail={tenant.contactEmail || null} fieldDefinitions={tenant.config?.fieldDefinitions ?? []} /></div> : null}
        </div>
      </section> : null}

      {enabled.has("benefits") && landingContent.benefits?.length ? <section className="bg-[#242424] px-5 py-20 md:px-[5%]"><div className="mx-auto grid max-w-[1200px] gap-5 md:grid-cols-3">{landingContent.benefits.map((benefit, index) => <article key={`${benefit.title}-${index}`} className="border border-white/15 p-6"><p className="text-xs font-bold tracking-[0.16em]" style={{ color: "var(--tenant-accent)" }}>0{index + 1}</p><h2 className="mt-4 text-xl font-black uppercase" style={displayStyle}>{benefit.title}</h2><p className="mt-3 text-sm leading-7 text-[#9ca1a7]">{benefit.description}</p></article>)}</div></section> : null}

      {enabled.has("about") ? <section className="bg-[#1e1e1e] px-5 py-20 md:px-[5%]"><div className="mx-auto max-w-4xl border-l-4 py-3 pl-7" style={{ borderColor: "var(--tenant-primary)" }}><p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "var(--tenant-accent)" }}>Sobre el taller</p><h2 className="mt-3 text-4xl font-black uppercase" style={displayStyle}>{landingContent.aboutTitle}</h2><p className="mt-5 max-w-3xl text-base leading-8 text-[#b6bbc0]">{landingContent.aboutDescription}</p></div></section> : null}

      {enabled.has("gallery") && landingContent.gallery?.length ? <section className="bg-[#1e1e1e] px-5 py-20 md:px-[5%]"><div className="mx-auto max-w-[1200px]"><h2 className="text-center text-4xl font-black uppercase" style={displayStyle}>Nuestro trabajo</h2><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{landingContent.gallery.map((item, index) => <figure key={item.id || `${item.url}-${index}`} className="overflow-hidden border border-white/15 bg-[#2b2b2b]"><Image src={item.url} alt={item.alt || tenant.name} width={1200} height={900} className="aspect-[4/3] w-full object-cover" />{item.caption ? <figcaption className="p-4 text-sm text-[#b6bbc0]">{item.caption}</figcaption> : null}</figure>)}</div></div></section> : null}

      {enabled.has("testimonials") && landingContent.testimonials?.length ? <section id="opiniones" className="bg-[#2b2b2b] px-5 py-20 md:px-[5%]"><div className="mx-auto max-w-[1200px]"><header className="text-center"><h2 className="text-4xl font-black uppercase" style={displayStyle}>Lo que dicen nuestros clientes</h2><p className="mt-4 text-[#8a8f95]">Opiniones compartidas por este taller</p></header><div className="mt-10 grid gap-5 lg:grid-cols-3">{landingContent.testimonials.map((testimonial, index) => <article key={`${testimonial.clientName}-${index}`} className="border border-[#5e646a] bg-[#242424] p-6"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-black text-white" style={{ backgroundColor: "var(--tenant-accent)" }}>{initials(testimonial.clientName)}</span><div><h3 className="font-bold text-white">{testimonial.clientName}</h3><p className="text-xs tracking-[0.12em]" style={{ color: "var(--tenant-primary)" }}>{"*".repeat(Math.max(1, Math.min(5, testimonial.rating || 5)))}</p></div></div><p className="mt-5 text-sm leading-7 text-[#c0c4c8]">&ldquo;{testimonial.comment}&rdquo;</p>{testimonial.date ? <p className="mt-5 text-xs uppercase tracking-[0.12em] text-[#8a8f95]">{testimonial.date}</p> : null}</article>)}</div></div></section> : null}

      {enabled.has("contact") ? <section id="ubicacion" className="bg-[#1e1e1e] px-5 py-20 md:px-[5%]"><div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-2"><div><h2 className="text-4xl font-black uppercase" style={displayStyle}>{landingContent.locationTitle || tenant.name}</h2>{landingContent.locationDescription ? <p className="mt-5 text-[#9ca1a7]">{landingContent.locationDescription}</p> : null}<div className="mt-7 space-y-4 border-l-2 pl-5" style={{ borderColor: "var(--tenant-primary)" }}>{tenant.contactAddress ? <p className="text-sm leading-7 text-[#d9dcdf]">{tenant.contactAddress}</p> : null}{landingContent.hours ? <p className="text-sm leading-7 text-[#d9dcdf]">{landingContent.hours}</p> : null}{tenant.contactPhone ? <p className="text-sm text-[#d9dcdf]">{tenant.contactPhone}</p> : null}</div><div className="mt-7 flex flex-wrap gap-3">{locationHref ? <a href={locationHref} target="_blank" rel="noreferrer" className="rounded border-2 px-5 py-3 text-sm font-bold uppercase tracking-[0.1em] text-white" style={{ backgroundColor: "var(--tenant-primary)", borderColor: "var(--tenant-primary)" }}>Ver ubicación</a> : null}{whatsapp ? <a href={whatsapp} target="_blank" rel="noreferrer" className="rounded border-2 px-5 py-3 text-sm font-bold uppercase tracking-[0.1em] text-white" style={{ backgroundColor: "var(--tenant-success)", borderColor: "var(--tenant-success)" }}>WhatsApp</a> : null}</div></div>{landingContent.showMap && landingContent.mapEmbedUrl ? <iframe title={`Ubicación de ${tenant.name}`} src={landingContent.mapEmbedUrl} className="min-h-[340px] w-full border border-white/15" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /> : <div className="flex min-h-[340px] items-center justify-center border border-dashed border-white/20 p-8 text-center text-sm text-[#8a8f95]">El tenant puede configurar su mapa o ubicación.</div>}</div></section> : null}

      {enabled.has("faq") && landingContent.faqs?.length ? <section className="bg-[#242424] px-5 py-20 md:px-[5%]"><div className="mx-auto max-w-4xl"><h2 className="text-center text-4xl font-black uppercase" style={displayStyle}>Preguntas frecuentes</h2><div className="mt-10 space-y-3">{landingContent.faqs.map((faq, index) => <details key={`${faq.question}-${index}`} className="border border-white/15 bg-[#1e1e1e] p-5"><summary className="cursor-pointer font-bold text-white">{faq.question}</summary><p className="mt-4 text-sm leading-7 text-[#b6bbc0]">{faq.answer}</p></details>)}</div></div></section> : null}

      {landingContent.showVideo && landingContent.videoUrl ? <section className="bg-[#1e1e1e] px-5 py-16 text-center"><a href={landingContent.videoUrl} target="_blank" rel="noreferrer" className="inline-flex border-2 px-7 py-4 text-sm font-black uppercase tracking-[0.12em] text-white" style={{ borderColor: "var(--tenant-primary)", backgroundColor: "var(--tenant-primary)" }}>Ver transmisión en vivo</a></section> : null}

      <footer className="border-t border-white/10 bg-[#242424] px-5 py-10 text-center text-sm text-[#8a8f95]">{tenant.name}{landingContent.contactEmail ? ` · ${landingContent.contactEmail}` : ""}</footer>
    </main>
  );
}
