import type { Benefit, FaqItem, GalleryItem, LandingContent, Service, SocialLink, Testimonial } from "../types";

export type ContentValidationIssue = {
  field: string;
  message: string;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeString(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  return String(value).trim();
}

function normalizeService(item: unknown): Service | null {
  if (!item || typeof item !== "object") return null;
  const record = item as Record<string, unknown>;
  const title = normalizeString(record.title);
  const description = normalizeString(record.description);
  if (!title && !description) return null;
  return {
    title: title || "Servicio",
    description: description || "Sin descripción disponible"
  };
}

function normalizeBenefit(item: unknown): Benefit | null {
  if (!item || typeof item !== "object") return null;
  const record = item as Record<string, unknown>;
  const title = normalizeString(record.title);
  const description = normalizeString(record.description);
  if (!title && !description) return null;
  return {
    title: title || "Beneficio",
    description: description || "Sin descripción disponible"
  };
}

function normalizeFaq(item: unknown): FaqItem | null {
  if (!item || typeof item !== "object") return null;
  const record = item as Record<string, unknown>;
  const question = normalizeString(record.question);
  const answer = normalizeString(record.answer);
  if (!question && !answer) return null;
  return {
    question: question || "Pregunta",
    answer: answer || "Sin respuesta disponible"
  };
}

function normalizeTestimonial(item: unknown): Testimonial | null {
  if (!item || typeof item !== "object") return null;
  const record = item as Record<string, unknown>;
  const clientName = normalizeString(record.clientName);
  const comment = normalizeString(record.comment);
  const date = normalizeString(record.date);

  let rating = 5;
  if (record.rating !== null && record.rating !== undefined) {
    const parsed = Number(record.rating);
    if (Number.isFinite(parsed)) {
      rating = parsed;
    }
  }

  if (!clientName && !comment) return null;
  return {
    clientName: clientName || "Cliente",
    comment: comment || "Sin comentarios",
    date: date || new Date().toLocaleDateString(),
    rating: rating
  };
}

function normalizeGalleryItem(item: unknown): GalleryItem | null {
  if (!item || typeof item !== "object") return null;
  const record = item as Record<string, unknown>;
  const url = normalizeString(record.url);
  if (!url) return null;

  const typeValue = normalizeString(record.type);
  const type: "image" | "video" = typeValue === "video" ? "video" : "image";

  return {
    id: isNonEmptyString(record.id) ? record.id : undefined,
    url,
    alt: isNonEmptyString(record.alt) ? record.alt : undefined,
    caption: isNonEmptyString(record.caption) ? record.caption : undefined,
    type,
  };
}

function normalizeSocialLink(item: unknown): SocialLink | null {
  if (!item || typeof item !== "object") return null;
  const record = item as Record<string, unknown>;
  const label = normalizeString(record.label);
  const href = normalizeString(record.href);
  if (!label && !href) return null;
  return {
    label: label || "Enlace",
    href: href || "#"
  };
}

export function validateLandingContent(input: unknown): ContentValidationIssue[] {
  const issues: ContentValidationIssue[] = [];
  if (!input || typeof input !== "object") {
    return [{ field: "landingContent", message: "landingContent debe ser un objeto válido" }];
  }

  const content = input as Record<string, unknown>;
  if (!isNonEmptyString(content.heroTitle)) issues.push({ field: "heroTitle", message: "heroTitle requerido" });
  if (!isNonEmptyString(content.heroDescription)) issues.push({ field: "heroDescription", message: "heroDescription requerido" });
  if (!isNonEmptyString(content.primaryCtaLabel)) issues.push({ field: "primaryCtaLabel", message: "primaryCtaLabel requerido" });
  if (!isNonEmptyString(content.primaryCtaHref)) issues.push({ field: "primaryCtaHref", message: "primaryCtaHref requerido" });

  return issues;
}

export function normalizeLandingContent(input: unknown, tenantName: string, tenantSlug: string): LandingContent | null {
  const content = (input && typeof input === "object") ? (input as Record<string, unknown>) : {};
  const services = Array.isArray(content.services) ? content.services.map(normalizeService).filter(Boolean) as Service[] : [];
  const benefits = Array.isArray(content.benefits) ? content.benefits.map(normalizeBenefit).filter(Boolean) as Benefit[] : [];
  const faqs = Array.isArray(content.faqs) ? content.faqs.map(normalizeFaq).filter(Boolean) as FaqItem[] : [];
  const testimonials = Array.isArray(content.testimonials) ? content.testimonials.map(normalizeTestimonial).filter(Boolean) as Testimonial[] : [];
  const gallery = Array.isArray(content.gallery) ? content.gallery.map(normalizeGalleryItem).filter(Boolean) as GalleryItem[] : [];
  const socialLinks = Array.isArray(content.socialLinks) ? content.socialLinks.map(normalizeSocialLink).filter(Boolean) as SocialLink[] : [];

  let sections: Array<{ id: string; enabled?: boolean }> | undefined = undefined;
  if (Array.isArray(content.sections)) {
    sections = content.sections
      .map((sec) => {
        if (!sec || typeof sec !== "object") return null;
        const sRecord = sec as Record<string, unknown>;
        const id = normalizeString(sRecord.id);
        if (!id) return null;
        return {
          id,
          enabled: sRecord.enabled !== undefined ? Boolean(sRecord.enabled) : true,
        };
      })
      .filter(Boolean) as Array<{ id: string; enabled?: boolean }>;
  }

  return {
    heroTitle: normalizeString(content.heroTitle) || tenantName || "Bienvenidos",
    heroSubtitle: normalizeString(content.heroSubtitle) || "Landing pública por tenant",
    heroDescription: normalizeString(content.heroDescription) || `Landing pública del taller ${tenantSlug || ""}.`,
    seoTitle: normalizeString(content.seoTitle) || tenantName || "Inicio",
    seoDescription: normalizeString(content.seoDescription) || `Landing pública del taller ${tenantSlug || ""}.`,
    primaryCtaLabel: normalizeString(content.primaryCtaLabel) || "Cotizar ahora",
    primaryCtaHref: normalizeString(content.primaryCtaHref) || "/",
    secondaryCtaLabel: normalizeString(content.secondaryCtaLabel) || "Ver estatus",
    secondaryCtaHref: normalizeString(content.secondaryCtaHref) || `/t/${tenantSlug || "default"}/portal`,
    contactLabel: normalizeString(content.contactLabel) || "Contacto",
    contactHref: normalizeString(content.contactHref) || "",
    contactPhone: normalizeString(content.contactPhone),
    contactEmail: normalizeString(content.contactEmail),
    contactAddress: normalizeString(content.contactAddress),
    hours: normalizeString(content.hours),
    services,
    benefits,
    testimonials,
    socialLinks,
    gallery,
    faqs,
    aboutTitle: normalizeString(content.aboutTitle),
    aboutDescription: normalizeString(content.aboutDescription),
    ratingLabel: normalizeString(content.ratingLabel) || undefined,
    ratingValue: normalizeString(content.ratingValue) || undefined,
    ratingCountLabel: normalizeString(content.ratingCountLabel) || undefined,
    locationTitle: normalizeString(content.locationTitle) || undefined,
    locationDescription: normalizeString(content.locationDescription) || undefined,
    showMap: content.showMap !== undefined ? Boolean(content.showMap) : false,
    mapEmbedUrl: normalizeString(content.mapEmbedUrl),
    showVideo: content.showVideo !== undefined ? Boolean(content.showVideo) : false,
    videoUrl: normalizeString(content.videoUrl),
    sections,
  };
}
