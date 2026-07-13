"use client";

import { useEffect, useMemo, useState } from "react";
import { Globe, RefreshCw, Save, Eye, Copy, ExternalLink } from "lucide-react";
import { SurfaceCard } from "@white-label/ui";
import { apiGateway } from "@/services/apiGateway";
import { tenantSettingsService } from "@/services/tenant-settings/tenantSettingsService";

type LandingService = {
  title: string;
  description: string;
};

type SocialLink = {
  label: string;
  href: string;
};

type LandingBenefit = { title: string; description: string };
type LandingTestimonial = { clientName: string; rating: number; comment: string; date: string };
type LandingGalleryItem = { id?: string; url: string; alt?: string; caption?: string; type?: "image" | "video" };
type LandingFaq = { question: string; answer: string };
type LandingSection = { id: string; enabled?: boolean };

type LandingContent = {
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
  services: LandingService[];
  benefits: LandingBenefit[];
  testimonials: LandingTestimonial[];
  gallery: LandingGalleryItem[];
  faqs: LandingFaq[];
  aboutTitle: string;
  aboutDescription: string;
  ratingLabel: string;
  ratingValue: string;
  ratingCountLabel: string;
  locationTitle: string;
  locationDescription: string;
  sections: LandingSection[];
  socialLinks: SocialLink[];
  showMap: boolean;
  mapEmbedUrl: string;
  showVideo: boolean;
  videoUrl: string;
};

type TenantLandingSettings = {
  availableIndustries?: Array<{
    key: string;
    label: string;
    description: string;
    defaultWorkflowKey: string;
    modules: string[];
  }>;
  tenant: {
    id: string;
    slug: string;
    name: string;
    branding?: {
      logoUrl?: string | null;
      faviconUrl?: string | null;
      heroImageUrl?: string | null;
      coverImageUrl?: string | null;
      primaryColor?: string | null;
      secondaryColor?: string | null;
      [key: string]: unknown;
    } | null;
    landing_content?: Partial<LandingContent> | null;
    industry_profile?: {
      industry_key?: string | null;
      industry_label?: string | null;
      asset_label?: string | null;
      order_label?: string | null;
      request_label?: string | null;
      customer_label?: string | null;
      portal_label?: string | null;
      quote_label?: string | null;
      default_workflow_key?: string | null;
      is_active?: boolean | null;
      metadata?: Record<string, unknown> | null;
    } | null;
  };
};

const emptyService: LandingService = { title: "", description: "" };
const emptySocial: SocialLink = { label: "", href: "" };
const DEFAULT_INDUSTRY_KEY = "electronics_repair";
const advancedLandingKeys = ["benefits", "testimonials", "gallery", "faqs", "aboutTitle", "aboutDescription", "sections"] as const;

const defaultLandingContent: LandingContent = {
  heroTitle: "Reparación profesional de electrónicos",
  heroSubtitle: "Diagnóstico, reparación y seguimiento técnico",
  heroDescription: "Especialistas en recuperar tu tecnología con diagnóstico claro, comunicación directa y seguimiento de principio a fin.",
  primaryCtaLabel: "Cotizar",
  primaryCtaHref: "#cotizar",
  secondaryCtaLabel: "Ver estatus",
  secondaryCtaHref: "/portal",
  contactLabel: "WhatsApp / contacto",
  contactHref: "",
  seoTitle: "Taller de reparación",
  seoDescription: "Landing pública por tenant para talleres de reparación de electrónicos.",
  services: [
    { title: "Laptops y Surface", description: "Pantallas, teclados, placas, almacenamiento y equipos de trabajo." },
    { title: "Tarjetas de video", description: "Diagnóstico avanzado, mantenimiento y reparación de componentes gráficos." },
    { title: "Consolas y controles", description: "Puertos, fuentes, ventilación, joysticks y botones." },
    { title: "Smartphones y tablets", description: "Pantallas, baterías, puertos de carga y daños por líquido." },
    { title: "PCs de escritorio", description: "Mantenimiento, ensamblado y reparación de componentes." },
    { title: "Diagnóstico técnico", description: "Evaluación inicial y explicación clara de opciones de reparación." },
  ],
  benefits: [
    { title: "Seguimiento claro", description: "El cliente consulta el avance de su equipo desde el portal." },
    { title: "Comunicación directa", description: "WhatsApp y datos de contacto propios del taller." },
    { title: "Documentos disponibles", description: "Comprobantes y archivos públicos vinculados a cada servicio." },
  ],
  testimonials: [],
  gallery: [],
  faqs: [
    { question: "¿Cómo consulto el estado de mi equipo?", answer: "Ingresa al portal del cliente con el folio compartido por el taller." },
    { question: "¿Cómo solicito una cotización?", answer: "Completa el formulario de esta página y el taller recibirá tu solicitud." },
  ],
  aboutTitle: "",
  aboutDescription: "",
  ratingLabel: "",
  ratingValue: "",
  ratingCountLabel: "",
  locationTitle: "",
  locationDescription: "",
  sections: [
    { id: "hero", enabled: true },
    { id: "services", enabled: true },
    { id: "benefits", enabled: true },
    { id: "testimonials", enabled: false },
    { id: "gallery", enabled: false },
    { id: "contact", enabled: true },
    { id: "quote", enabled: true },
  ],
  socialLinks: [emptySocial],
  showMap: false,
  mapEmbedUrl: "",
  showVideo: false,
  videoUrl: "",
};

function normalizeLandingContent(input?: Partial<LandingContent> | null): LandingContent {
  return {
    heroTitle: input?.heroTitle?.trim() ?? defaultLandingContent.heroTitle,
    heroSubtitle: input?.heroSubtitle?.trim() || defaultLandingContent.heroSubtitle,
    heroDescription: input?.heroDescription?.trim() ?? defaultLandingContent.heroDescription,
    primaryCtaLabel: input?.primaryCtaLabel?.trim() || defaultLandingContent.primaryCtaLabel,
    primaryCtaHref: input?.primaryCtaHref?.trim() || defaultLandingContent.primaryCtaHref,
    secondaryCtaLabel: input?.secondaryCtaLabel?.trim() || defaultLandingContent.secondaryCtaLabel,
    secondaryCtaHref: input?.secondaryCtaHref?.trim() || defaultLandingContent.secondaryCtaHref,
    contactLabel: input?.contactLabel?.trim() || defaultLandingContent.contactLabel,
    contactHref: input?.contactHref?.trim() || defaultLandingContent.contactHref,
    seoTitle: input?.seoTitle?.trim() || defaultLandingContent.seoTitle,
    seoDescription: input?.seoDescription?.trim() || defaultLandingContent.seoDescription,
    services: Array.isArray(input?.services) && input?.services.length > 0 ? input.services : [emptyService],
    benefits: Array.isArray(input?.benefits) ? input.benefits : [],
    testimonials: Array.isArray(input?.testimonials) ? input.testimonials : [],
    gallery: Array.isArray(input?.gallery) ? input.gallery : [],
    faqs: Array.isArray(input?.faqs) ? input.faqs : [],
    aboutTitle: input?.aboutTitle?.trim() || "",
    aboutDescription: input?.aboutDescription?.trim() || "",
    ratingLabel: input?.ratingLabel?.trim() || "",
    ratingValue: input?.ratingValue?.trim() || "",
    ratingCountLabel: input?.ratingCountLabel?.trim() || "",
    locationTitle: input?.locationTitle?.trim() || "",
    locationDescription: input?.locationDescription?.trim() || "",
    sections: Array.isArray(input?.sections) ? input.sections : defaultLandingContent.sections,
    socialLinks: Array.isArray(input?.socialLinks) && input?.socialLinks.length > 0 ? input.socialLinks : [emptySocial],
    showMap: Boolean(input?.showMap),
    mapEmbedUrl: input?.mapEmbedUrl?.trim() || defaultLandingContent.mapEmbedUrl,
    showVideo: Boolean(input?.showVideo),
    videoUrl: input?.videoUrl?.trim() || defaultLandingContent.videoUrl,
  };
}

function toPublicHref(tenantSlug: string, href: string) {
  if (!href) return "#";
  if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return href;
  }
  const normalized = href.startsWith("/") ? href : `/${href}`;
  return `/${encodeURIComponent(tenantSlug)}${normalized}`;
}

export default function LandingSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [settings, setSettings] = useState<TenantLandingSettings | null>(null);
  const [landingContent, setLandingContent] = useState<LandingContent>(defaultLandingContent);
  const [advancedLandingJson, setAdvancedLandingJson] = useState("");
  const [industryKey, setIndustryKey] = useState<string>(DEFAULT_INDUSTRY_KEY);
  const branding = settings?.tenant.branding ?? null;

  async function load() {
    try {
      setLoading(true);
      setError("");
      const result = await tenantSettingsService.getTenantLandingSettings();
      setSettings(result.data);
      const normalizedLanding = normalizeLandingContent(result.data.tenant.landing_content ?? null);
      setLandingContent(normalizedLanding);
      setAdvancedLandingJson(JSON.stringify(Object.fromEntries(advancedLandingKeys.map((key) => [key, normalizedLanding[key]])), null, 2));
      setIndustryKey(typeof result.data.tenant.industry_profile?.industry_key === "string" ? result.data.tenant.industry_profile.industry_key : DEFAULT_INDUSTRY_KEY);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar la landing");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const tenantSlug = settings?.tenant.slug ?? "";
  const preview = useMemo(() => ({
    primaryHref: toPublicHref(tenantSlug, landingContent.primaryCtaHref),
    secondaryHref: toPublicHref(tenantSlug, landingContent.secondaryCtaHref),
    contactHref: toPublicHref(tenantSlug, landingContent.contactHref),
  }), [landingContent.contactHref, landingContent.primaryCtaHref, landingContent.secondaryCtaHref, tenantSlug]);
  const publicBaseUrl = process.env.NEXT_PUBLIC_WEB_PUBLIC_URL?.replace(/\/$/, "") ?? "";
  const tenantPublicUrl = publicBaseUrl && tenantSlug ? `${publicBaseUrl}/${encodeURIComponent(tenantSlug)}` : "";

  const updateField = <K extends keyof LandingContent>(key: K, value: LandingContent[K]) => {
    setLandingContent((current) => ({ ...current, [key]: value }));
  };

  const updateService = (index: number, key: keyof LandingService, value: string) => {
    setLandingContent((current) => ({
      ...current,
      services: current.services.map((service, idx) => (idx === index ? { ...service, [key]: value } : service)),
    }));
  };

  const updateSocial = (index: number, key: keyof SocialLink, value: string) => {
    setLandingContent((current) => ({
      ...current,
      socialLinks: current.socialLinks.map((item, idx) => (idx === index ? { ...item, [key]: value } : item)),
    }));
  };

  const addService = () => setLandingContent((current) => ({ ...current, services: [...current.services, { ...emptyService }] }));
  const addSocial = () => setLandingContent((current) => ({ ...current, socialLinks: [...current.socialLinks, { ...emptySocial }] }));
  const copyTenantPublicUrl = async () => {
    if (!tenantPublicUrl) return;
    await navigator.clipboard.writeText(tenantPublicUrl);
    setSuccess("URL pública copiada al portapapeles.");
  };

  const uploadBrandingAsset = async (assetType: "logo" | "favicon" | "heroImage" | "coverImage", file: File) => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const uploadResult = await apiGateway.uploadTenantBrandingAsset({ assetType, file });
      setSettings((current) => current ? { ...current, tenant: uploadResult.data.tenant } : current);
      setSuccess("Archivo subido correctamente.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir el archivo");
    } finally {
      setSaving(false);
    }
  };

  async function handleSave() {
    let contentToSave = landingContent;
    try {
      const parsed = advancedLandingJson.trim() ? JSON.parse(advancedLandingJson) as Partial<LandingContent> : {};
      contentToSave = { ...landingContent, ...Object.fromEntries(advancedLandingKeys.map((key) => [key, parsed[key] ?? landingContent[key]])) };
    } catch {
      setError("La configuración avanzada debe ser JSON válido.");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const selectedIndustry = settings?.availableIndustries?.find((item) => item.key === industryKey) ?? null;
      const result = await tenantSettingsService.updateTenantLandingSettings({
        branding: settings?.tenant.branding ?? undefined,
        landingContent: contentToSave,
        industryProfile: {
          industry_key: industryKey,
          industry_label: selectedIndustry?.label ?? settings?.tenant.industry_profile?.industry_label ?? null,
          asset_label: settings?.tenant.industry_profile?.asset_label ?? null,
          order_label: settings?.tenant.industry_profile?.order_label ?? null,
          request_label: settings?.tenant.industry_profile?.request_label ?? null,
          customer_label: settings?.tenant.industry_profile?.customer_label ?? null,
          portal_label: settings?.tenant.industry_profile?.portal_label ?? null,
          quote_label: settings?.tenant.industry_profile?.quote_label ?? null,
          default_workflow_key: selectedIndustry?.defaultWorkflowKey ?? settings?.tenant.industry_profile?.default_workflow_key ?? "service_orders",
          is_active: true,
          metadata: { source: "dashboard_landing_editor" },
        },
      });

      setSettings(result.data);
      const normalizedLanding = normalizeLandingContent(result.data.tenant.landing_content ?? null);
      setLandingContent(normalizedLanding);
      setAdvancedLandingJson(JSON.stringify(Object.fromEntries(advancedLandingKeys.map((key) => [key, normalizedLanding[key]])), null, 2));
      setSuccess("Landing guardada correctamente.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar landing");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="flex h-full items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-500/25 border-t-sky-400" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-sky-400/70">Marketing SaaS</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-50">Landing</h1>
          <p className="mt-1 text-sm text-slate-400">Configura la landing pública del tenant {settings?.tenant.name ?? tenantSlug}.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => void load()} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-sky-400/30 hover:bg-slate-800/80">
            <RefreshCw className="w-4 h-4" />
            Recargar
          </button>
          <button onClick={() => void handleSave()} className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:opacity-60" disabled={saving}>
            <Save className="w-4 h-4" />
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>

      {error ? <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</div> : null}
      {success ? <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">{success}</div> : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.95fr)]">
        <div className="space-y-4">
          <SurfaceCard elevated className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-50">URL pública del tenant</h2>
                <p className="text-sm text-slate-400">Comparte esta URL para abrir la landing pública del negocio.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void copyTenantPublicUrl()}
                  disabled={!tenantPublicUrl}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-sky-400/30 hover:bg-slate-800/80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Copy className="w-4 h-4" />
                  Copiar URL
                </button>
                <a
                  href={tenantPublicUrl || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:pointer-events-none disabled:opacity-50"
                  aria-disabled={!tenantPublicUrl}
                >
                  <ExternalLink className="w-4 h-4" />
                  Abrir URL
                </a>
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-sky-300 break-all">
              {tenantPublicUrl || "URL pública no disponible"}
            </div>
          </SurfaceCard>

          <SurfaceCard elevated className="space-y-3 p-4">
            <h2 className="text-base font-semibold text-slate-50">Branding del tenant</h2>
            <p className="text-sm text-slate-400">Sube logo, favicon y piezas visuales para la landing del cliente.</p>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-100">Logo</span>
                  {branding?.logoUrl ? <a href={branding.logoUrl} target="_blank" rel="noreferrer" className="text-xs text-sky-300">Ver actual</a> : null}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="input"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      void uploadBrandingAsset("logo", file);
                      e.currentTarget.value = "";
                    }
                  }}
                />
              </label>

              <label className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-100">Favicon</span>
                  {branding?.faviconUrl ? <a href={branding.faviconUrl} target="_blank" rel="noreferrer" className="text-xs text-sky-300">Ver actual</a> : null}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="input"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      void uploadBrandingAsset("favicon", file);
                      e.currentTarget.value = "";
                    }
                  }}
                />
              </label>

              <label className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-100">Imagen hero</span>
                  {branding?.heroImageUrl ? <a href={branding.heroImageUrl} target="_blank" rel="noreferrer" className="text-xs text-sky-300">Ver actual</a> : null}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="input"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      void uploadBrandingAsset("heroImage", file);
                      e.currentTarget.value = "";
                    }
                  }}
                />
              </label>

              <label className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-100">Imagen cover</span>
                  {branding?.coverImageUrl ? <a href={branding.coverImageUrl} target="_blank" rel="noreferrer" className="text-xs text-sky-300">Ver actual</a> : null}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="input"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      void uploadBrandingAsset("coverImage", file);
                      e.currentTarget.value = "";
                    }
                  }}
                />
              </label>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {branding?.logoUrl ? <img src={branding.logoUrl} alt="Logo actual" className="h-24 w-full rounded-2xl border border-slate-800 bg-slate-900/60 object-contain p-3" /> : null}
              {branding?.heroImageUrl ? <img src={branding.heroImageUrl} alt="Imagen hero actual" className="h-24 w-full rounded-2xl border border-slate-800 bg-slate-900/60 object-cover" /> : null}
            </div>
          </SurfaceCard>

          <SurfaceCard elevated className="space-y-3 p-4">
            <div className="flex items-center gap-2 text-sky-300"><Globe className="w-5 h-5" /><h2 className="text-lg font-semibold text-slate-50">Hero</h2></div>
            <div className="grid gap-3 md:grid-cols-2">
              <input value={landingContent.heroTitle} onChange={(e) => updateField("heroTitle", e.target.value)} className="input" placeholder="Título principal" />
              <input value={landingContent.heroSubtitle} onChange={(e) => updateField("heroSubtitle", e.target.value)} className="input" placeholder="Subtítulo" />
              <textarea value={landingContent.heroDescription} onChange={(e) => updateField("heroDescription", e.target.value)} className="input min-h-24 md:col-span-2" placeholder="Descripción principal" />
            </div>
          </SurfaceCard>

          <SurfaceCard elevated className="space-y-3 p-4">
            <h2 className="text-lg font-semibold text-slate-50">CTAs y SEO</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <input value={landingContent.primaryCtaLabel} onChange={(e) => updateField("primaryCtaLabel", e.target.value)} className="input" placeholder="CTA primario" />
              <input value={landingContent.primaryCtaHref} onChange={(e) => updateField("primaryCtaHref", e.target.value)} className="input" placeholder="/cotizar" />
              <input value={landingContent.secondaryCtaLabel} onChange={(e) => updateField("secondaryCtaLabel", e.target.value)} className="input" placeholder="CTA secundario" />
              <input value={landingContent.secondaryCtaHref} onChange={(e) => updateField("secondaryCtaHref", e.target.value)} className="input" placeholder="/tracking" />
              <input value={landingContent.contactLabel} onChange={(e) => updateField("contactLabel", e.target.value)} className="input" placeholder="Etiqueta de contacto" />
              <input value={landingContent.contactHref} onChange={(e) => updateField("contactHref", e.target.value)} className="input" placeholder="https://wa.me/..." />
              <input value={landingContent.seoTitle} onChange={(e) => updateField("seoTitle", e.target.value)} className="input md:col-span-2" placeholder="SEO title" />
              <textarea value={landingContent.seoDescription} onChange={(e) => updateField("seoDescription", e.target.value)} className="input min-h-20 md:col-span-2" placeholder="SEO description" />
            </div>
          </SurfaceCard>

          <SurfaceCard elevated className="space-y-3 p-4">
            <h2 className="text-lg font-semibold text-slate-50">Reputación y ubicación</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <input value={landingContent.ratingLabel} onChange={(e) => updateField("ratingLabel", e.target.value)} className="input" placeholder="Etiqueta de reputación" />
              <input value={landingContent.ratingValue} onChange={(e) => updateField("ratingValue", e.target.value)} className="input" placeholder="Calificación, por ejemplo 5.0" />
              <input value={landingContent.ratingCountLabel} onChange={(e) => updateField("ratingCountLabel", e.target.value)} className="input md:col-span-2" placeholder="Texto de opiniones verificadas" />
              <input value={landingContent.locationTitle} onChange={(e) => updateField("locationTitle", e.target.value)} className="input" placeholder="Título de ubicación" />
              <input value={landingContent.locationDescription} onChange={(e) => updateField("locationDescription", e.target.value)} className="input" placeholder="Descripción de ubicación" />
              <label className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-slate-200">
                <input type="checkbox" checked={landingContent.showMap} onChange={(e) => updateField("showMap", e.target.checked)} />
                Mostrar mapa
              </label>
              <input value={landingContent.mapEmbedUrl} onChange={(e) => updateField("mapEmbedUrl", e.target.value)} className="input" placeholder="URL de mapa embebido" />
              <label className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-slate-200">
                <input type="checkbox" checked={landingContent.showVideo} onChange={(e) => updateField("showVideo", e.target.checked)} />
                Ofrecer transmisión en vivo
              </label>
              <input value={landingContent.videoUrl} onChange={(e) => updateField("videoUrl", e.target.value)} className="input" placeholder="URL de transmisión" />
            </div>
          </SurfaceCard>

          <SurfaceCard elevated className="space-y-3 p-4">
            <h2 className="text-lg font-semibold text-slate-50">Bloques avanzados</h2>
            <p className="text-sm text-slate-400">Configura beneficios, reseñas, galería, preguntas frecuentes y la sección institucional. Se guarda en la configuración real de la landing.</p>
            <textarea value={advancedLandingJson} onChange={(e) => setAdvancedLandingJson(e.target.value)} className="input min-h-80 font-mono text-xs" spellCheck={false} />
          </SurfaceCard>

          <SurfaceCard elevated className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-50">Servicios</h2>
              <button onClick={addService} className="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-sky-400/30 hover:bg-slate-800/80">Agregar servicio</button>
            </div>
            <div className="space-y-3">
              {landingContent.services.map((service, index) => (
                <div key={`${service.title}-${index}`} className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-3">
                  <input value={service.title} onChange={(e) => updateService(index, "title", e.target.value)} className="input" placeholder="Título del servicio" />
                  <textarea value={service.description} onChange={(e) => updateService(index, "description", e.target.value)} className="input min-h-16" placeholder="Descripción" />
                </div>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard elevated className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-50">Redes y perfil</h2>
              <button onClick={addSocial} className="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-sky-400/30 hover:bg-slate-800/80">Agregar enlace</button>
            </div>
            <select value={industryKey} onChange={(e) => setIndustryKey(e.target.value)} className="input">
              {(settings?.availableIndustries ?? []).map((industry) => <option key={industry.key} value={industry.key}>{industry.label}</option>)}
            </select>
            <div className="space-y-3">
              {landingContent.socialLinks.map((link, index) => (
                <div key={`${link.label}-${index}`} className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-3 md:grid-cols-2">
                  <input value={link.label} onChange={(e) => updateSocial(index, "label", e.target.value)} className="input" placeholder="Instagram, WhatsApp..." />
                  <input value={link.href} onChange={(e) => updateSocial(index, "href", e.target.value)} className="input" placeholder="https://..." />
                </div>
              ))}
            </div>
          </SurfaceCard>
        </div>

        <SurfaceCard elevated className="space-y-4 p-4 xl:sticky xl:top-4 self-start">
          <div className="flex items-center gap-2 text-sky-300">
            <Eye className="w-5 h-5" />
            <h2 className="text-lg font-semibold text-slate-50">Preview</h2>
          </div>
          <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/50 p-4">
            <div className="text-xs uppercase tracking-[0.25em] text-sky-400">{tenantSlug || "tenant"}</div>
            <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-50">{landingContent.heroTitle}</h3>
            <p className="mt-2 text-sm text-slate-200">{landingContent.heroSubtitle}</p>
            <p className="mt-3 text-sm text-slate-400">{landingContent.heroDescription}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={preview.primaryHref} className="inline-flex items-center justify-center rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-400">{landingContent.primaryCtaLabel}</a>
              <a href={preview.secondaryHref} className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-sky-400/30 hover:bg-slate-800/80">{landingContent.secondaryCtaLabel}</a>
            </div>
            <div className="mt-3 text-xs text-slate-400">
              Contacto: <a href={preview.contactHref} className="text-sky-300">{landingContent.contactLabel}</a>
            </div>
            <div className="mt-4 space-y-2">
              {landingContent.services.map((service, index) => (
                <div key={`${service.title}-${index}`} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                  <div className="font-semibold text-slate-100">{service.title || "Servicio"}</div>
                  <div className="mt-1 text-sm text-slate-400">{service.description || "Descripción pendiente."}</div>
                </div>
              ))}
            </div>
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
