"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState, type FormEvent } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { resolveApiBaseUrl } from "@white-label/config";

type PortalPayload = {
  success: true;
  tenant: {
    id: string;
    slug: string;
    name: string;
    branding?: { logoUrl?: string | null } | null;
    contact_phone?: string | null;
    contact_email?: string | null;
    contactPhone?: string | null;
    contactEmail?: string | null;
    config?: {
      templates?: {
        portal?: Record<string, unknown>;
        landing?: Record<string, unknown>;
      };
    };
  };
  data: {
    order: {
      id: string;
      folio: string;
      status: string;
      created_at?: string | null;
      updated_at?: string | null;
      promised_date?: string | null;
      total_cost?: number | null;
      estimated_cost?: number | null;
      final_cost?: number | null;
      device_info?: {
        customer_name?: string;
        customer_phone?: string;
        customer_email?: string;
        brand?: string;
        model?: string;
        type?: string;
      };
      problem_description?: string | null;
      serial_number?: string | null;
    };
    orderStatusLabel: string;
    timeline: Array<{ label: string; status: "completado" | "actual" | "pendiente"; note: string }>;
    pdf_attachment?: { url: string; label: string; fileName: string | null; mimeType: string; source: string } | null;
    attachments: Array<{ url?: string; label?: string; fileName?: string | null; mimeType?: string; source?: string }>;
    documents: Array<{
      id: string;
      file_name: string;
      file_type: string;
      public_url: string | null;
      mime_type: string;
      created_at: string;
      source: string;
    }>;
    events: Array<{
      id: string;
      event_type: string;
      previous_status?: string | null;
      new_status?: string | null;
      note?: string | null;
      actor_name?: string | null;
      created_at: string;
    }>;
    messages: Array<{ id: string; note: string; actor_name?: string | null; created_at: string }>;
  };
};

type PortalMediaItem = {
  id: string;
  url: string;
  label: string;
  fileName: string | null;
  fileType: string;
  source: string;
};

function resolveWhatsappHref(phone?: string | null, folio?: string) {
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, "");
  if (!digits) return undefined;
  const text = encodeURIComponent(`Hola, quiero consultar mi folio ${folio ?? ""}.`);
  return `https://wa.me/${digits}?text=${text}`;
}

function formatDate(value?: string | null) {
  if (!value) return "N/D";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "N/D" : date.toLocaleString("es-MX");
}

function formatDateOnly(value?: string | null) {
  if (!value) return "N/D";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "N/D" : date.toLocaleDateString("es-MX");
}

function daysRemaining(promisedDate?: string | null) {
  if (!promisedDate) return null;
  const end = new Date(promisedDate);
  if (Number.isNaN(end.getTime())) return null;
  const diff = end.getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function PortalPage() {
  const params = useParams<{ tenantSlug?: string }>();
  const searchParams = useSearchParams();
  const tenantSlug = typeof params?.tenantSlug === "string" && params.tenantSlug.trim().length > 0 ? params.tenantSlug : "";
  const [folio, setFolio] = useState(() => searchParams.get("folio")?.trim() ?? searchParams.get("token")?.trim() ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PortalPayload["data"] | null>(null);
  const [tenant, setTenant] = useState<PortalPayload["tenant"] | null>(null);
  const [galleryImage, setGalleryImage] = useState<string | null>(null);
  const [tenantLabel, setTenantLabel] = useState<string>(tenantSlug || "Tenant");

  const apiBaseUrl = resolveApiBaseUrl();
  const portalContent = tenant?.config?.templates?.portal ?? {};
  const logoUrl = tenant?.branding?.logoUrl ?? null;
  const contactPhone = tenant?.contact_phone ?? tenant?.contactPhone ?? null;
  const contactEmail = tenant?.contact_email ?? tenant?.contactEmail ?? null;
  const whatsappHref = useMemo(() => resolveWhatsappHref(contactPhone, result?.order.folio), [contactPhone, result?.order.folio]);
  const currentDate = useMemo(() => new Date().toLocaleDateString("es-MX", { weekday: "long", year: "numeric", month: "long", day: "numeric" }), []);
  const remainingDays = daysRemaining(result?.order.promised_date ?? null);
  const hasLiveCam = Boolean((portalContent as Record<string, unknown>).showVideo || (tenant?.config?.templates?.landing as Record<string, unknown> | undefined)?.showVideo);
  const liveCamUrl = String((portalContent as Record<string, unknown>).videoUrl ?? (tenant?.config?.templates?.landing as Record<string, unknown> | undefined)?.videoUrl ?? "");
  const mapUrl = String((tenant?.config?.templates?.landing as Record<string, unknown> | undefined)?.mapEmbedUrl ?? "");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setTenant(null);

    try {
      if (!tenantSlug) {
        throw new Error("Tenant slug ausente en la ruta");
      }

      const searchValue = folio.trim();
      if (!searchValue) {
        throw new Error("Ingresa tu folio o token");
      }

      const response = await fetch(`${apiBaseUrl}/api/public/tenant/${encodeURIComponent(tenantSlug)}/orders/${encodeURIComponent(searchValue)}`);
      const payload = (await response.json().catch(() => null)) as PortalPayload | { error?: string } | null;

      if (!response.ok) {
        throw new Error(payload && "error" in payload && payload.error ? payload.error : "No encontramos una orden con ese folio");
      }

      if (payload && "success" in payload) {
        setTenantLabel(payload.tenant.name || tenantSlug);
        setTenant(payload.tenant);
        setResult(payload.data);
      } else {
        throw new Error("Respuesta inválida del servidor");
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  const orderImages = useMemo<PortalMediaItem[]>(
    () => [
      ...(result?.documents ?? []).map((item) => ({
        id: item.id,
        url: item.public_url ?? "",
        label: item.file_name,
        fileName: item.file_name,
        fileType: item.file_type,
        source: item.source,
      })),
      ...(result?.attachments ?? []).map((item, index) => ({
        id: `attachment-${index}`,
        url: item.url ?? "",
        label: item.label ?? item.fileName ?? "Adjunto",
        fileName: item.fileName ?? null,
        fileType: item.mimeType ?? "application/octet-stream",
        source: item.source ?? "attachment",
      })),
    ].filter((item) => Boolean(item.url)),
    [result?.attachments, result?.documents]
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(44,110,159,0.16),_transparent_30%),linear-gradient(180deg,#f4f6f9_0%,#eef2f6_48%,#ffffff_100%)] px-4 py-6 text-slate-950">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_90px_rgba(15,23,42,0.08)]">
          <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                {logoUrl ? (
                  <Image src={logoUrl} alt={tenantLabel} width={64} height={64} className="h-16 w-16 object-contain" />
                ) : (
                  <span className="text-2xl font-bold text-slate-600">{tenantLabel.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#1f2937]">Seguimiento técnico</p>
                <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950 [font-family:var(--font-cormorant)]">Portal del cliente</h1>
                <p className="mt-2 text-sm text-slate-600">{tenantLabel}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-right">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Fecha de hoy</div>
              <div className="mt-1 text-lg font-semibold text-slate-950">{currentDate}</div>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <form onSubmit={handleSubmit} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_60px_rgba(15,23,42,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#1f2937]">Busca tu orden</p>
            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-slate-700">Folio o token</label>
              <input
                value={folio}
                onChange={(event) => setFolio(event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-[#334155] focus:ring-2 focus:ring-[#334155]/20"
                placeholder="ORD-XXXXXXXX o token"
                required
              />
            </div>
            {error ? <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button disabled={loading} className="rounded-full bg-[#334155] px-6 py-3 font-semibold text-white transition hover:bg-[#1f2937] disabled:opacity-60">
                {loading ? "Consultando..." : "Buscar orden"}
              </button>
              <p className="text-sm leading-6 text-slate-600">La consulta solo muestra datos de tu taller.</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Actualización diaria", "Datos seguros", "Contacto directo", "Live cam disponible"].map((badge) => (
                <span key={badge} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
                  {badge}
                </span>
              ))}
            </div>
          </form>

          <aside className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_60px_rgba(15,23,42,0.08)]">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Folio consultado", result?.order.folio ?? "N/D"],
                ["Estado actual", result?.orderStatusLabel ?? "N/D"],
                ["Tipo de equipo", result?.order.device_info?.type ?? "N/D"],
                ["Marca y modelo", [result?.order.device_info?.brand, result?.order.device_info?.model].filter(Boolean).join(" ") || "N/D"],
                ["Falla reportada", result?.order.problem_description ?? "N/D"],
                ["Fecha de ingreso", formatDate(result?.order.created_at)],
                ["Fecha promesa", formatDateOnly(result?.order.promised_date)],
                ["Días restantes", remainingDays === null ? "N/D" : remainingDays > 0 ? `${remainingDays} días` : `${Math.abs(remainingDays)} días vencidos`],
                ["Última actualización", formatDate(result?.order.updated_at ?? result?.events?.[result.events.length - 1]?.created_at)],
              ].map(([label, value]) => (
                <div key={label as string} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{label as string}</div>
                  <div className="mt-1 text-sm font-semibold text-slate-950">{String(value)}</div>
                </div>
              ))}
            </div>
          </aside>
        </section>

        {result ? (
          <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_60px_rgba(15,23,42,0.08)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#1f2937]">Seguimiento detallado</p>
                  <h2 className="mt-2 text-3xl font-bold text-slate-950">Avances técnicos</h2>
                </div>
                <span className="rounded-full bg-[#475569]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#475569]">
                  {result.orderStatusLabel}
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {result.timeline.map((step) => (
                  <div key={step.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-slate-950">{step.label}</span>
                      <span className="rounded-full bg-white px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-500">{step.status}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{step.note}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#1f2937]">Fotografías de avance</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Haz clic para ampliar</p>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {orderImages.length > 0 ? (
                    orderImages.map((item) => {
                      const imageUrl = item.url;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setGalleryImage(imageUrl)}
                          className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 text-left"
                        >
                          {imageUrl ? (
                            <Image src={imageUrl} alt={item.label || "Evidencia"} width={800} height={600} className="h-48 w-full object-cover" />
                          ) : null}
                          <div className="p-4">
                            <div className="text-sm font-semibold text-slate-950">{item.label || "Adjunto"}</div>
                            <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{item.fileType ?? item.source ?? "evidencia"}</div>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-sm text-slate-500 sm:col-span-2">
                      Aún no hay fotografías registradas.
                    </div>
                  )}
                </div>
              </div>
            </article>

            <aside className="space-y-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Acciones del cliente</p>
                <div className="mt-4 flex flex-col gap-3">
                  {whatsappHref ? (
                    <a href={whatsappHref} target="_blank" rel="noreferrer" className="rounded-full bg-emerald-500 px-4 py-3 text-center font-semibold text-white transition hover:bg-emerald-600">
                      WhatsApp
                    </a>
                  ) : null}
                  {result.pdf_attachment?.url || result.documents.length > 0 ? (
                    <div className="space-y-3">
                      {(result.documents.length > 0
                        ? result.documents.map((doc) => ({
                            key: doc.id,
                            url: doc.public_url ?? "",
                            label: doc.file_name,
                          }))
                        : result.pdf_attachment
                          ? [{ key: "pdf", url: result.pdf_attachment.url, label: result.pdf_attachment.label }]
                          : []
                      ).map((doc) => {
                        if (!doc.url) return null;
                        return (
                          <a
                            key={doc.key}
                            href={doc.url}
                            target="_blank"
                            rel="noreferrer"
                            className="block rounded-full border border-slate-300 bg-white px-4 py-3 text-center font-semibold text-slate-800 transition hover:bg-slate-50"
                          >
                            {doc.label ?? "Ver documento"}
                          </a>
                        );
                      })}
                    </div>
                  ) : null}
                  {mapUrl ? (
                    <a href={mapUrl} target="_blank" rel="noreferrer" className="rounded-full border border-slate-300 bg-white px-4 py-3 text-center font-semibold text-slate-800 transition hover:bg-slate-50">
                      Visitar sucursal
                    </a>
                  ) : null}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Live Cam</p>
                {hasLiveCam && liveCamUrl ? (
                  <a href={liveCamUrl} target="_blank" rel="noreferrer" className="mt-3 block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800">
                    Abrir transmisión en vivo
                  </a>
                ) : (
                  <p className="mt-2 text-sm text-slate-600">No está habilitada para este taller.</p>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Últimos movimientos</p>
                <div className="mt-3 space-y-3">
                  {(result.messages.length > 0 ? result.messages : result.events.map((event) => ({ id: event.id, note: event.note ?? event.event_type, actor_name: event.actor_name, created_at: event.created_at }))).slice(0, 5).map((message) => (
                    <div key={message.id} className="rounded-2xl bg-slate-50 px-4 py-3">
                      <div className="text-sm font-semibold text-slate-950">{message.actor_name ?? "Taller"}</div>
                      <div className="mt-1 text-sm text-slate-600">{message.note}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{formatDate(message.created_at)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </section>
        ) : (
          <section className="rounded-[1.75rem] border border-dashed border-slate-200 bg-white p-8 text-center text-slate-600 shadow-[0_16px_60px_rgba(15,23,42,0.08)]">
            <p className="text-lg font-semibold text-slate-950">No encontramos una orden con ese folio</p>
            <p className="mt-2 text-sm">Ingresa un folio válido para ver el estado de tu reparación.</p>
          </section>
        )}

        <footer className="rounded-[1.5rem] border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-[0_12px_50px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-semibold text-slate-900">SrFix</div>
              <div>Plataforma de seguimiento y atención para talleres.</div>
            </div>
            <div className="flex flex-wrap gap-3">
              <span>Derechos reservados</span>
              <span>·</span>
              <Link href="/" className="font-semibold text-slate-900">Privacidad</Link>
            </div>
          </div>
        </footer>
      </div>

      {galleryImage ? (
        <button
          type="button"
          onClick={() => setGalleryImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8"
        >
          <div className="max-h-[90vh] max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl">
            <Image src={galleryImage} alt="Fotografía ampliada" width={1400} height={1000} className="h-auto w-full object-contain" />
          </div>
        </button>
      ) : null}
    </main>
  );
}
