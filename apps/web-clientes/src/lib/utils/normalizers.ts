import type { BackendOrderResponse, NormalizedAttachment, NormalizedDocument, NormalizedEvent, NormalizedMessage, NormalizedOrder, NormalizedOrderDetail, NormalizedTimelineEvent, PortalOrderResponse } from "../types";

export function normalizeOrderDetail(raw: BackendOrderResponse["data"]): NormalizedOrderDetail {
  const r = raw ?? {};
  return {
    order: normalizeOrder(r.order),
    orderStatusLabel: r.order?.status ?? "No disponible",
    timeline: normalizeTimeline(r.timeline ?? []),
    pdfAttachment: r.pdf_attachment ? normalizeDocument(r.pdf_attachment) : undefined,
    attachments: normalizeAttachments(r.attachments ?? []),
    documents: normalizeDocuments(r.documents ?? []),
    events: normalizeEvents(r.events ?? []),
    messages: normalizeMessages(r.messages ?? []),
    source: "legacy",
  };
}

export function normalizePortalOrderDetail(raw: PortalOrderResponse["data"]): NormalizedOrderDetail {
  const r = raw ?? {};
  const order = r.order ?? {};
  const device = order.device ?? {};
  const dates = order.dates ?? {};
  const costs = order.costs ?? {};
  const timeline = r.timeline ?? {};
  const timelineItems = Array.isArray(timeline.items) ? timeline.items : [];
  const documents = r.documents ?? {};
  const documentItems = Array.isArray(documents.items) ? documents.items : [];

  return {
    order: {
      folio: order.folio ?? "No disponible",
      status: order.status ?? "pending",
      statusLabel: order.status ?? "No disponible",
      deviceType: device.type || "No disponible",
      deviceBrand: device.brand || "No disponible",
      deviceModel: device.model || "No disponible",
      serialNumber: device.serialNumber ?? undefined,
      problemDescription: order.reportedIssue || "No disponible",
      createdAt: safeDate(dates.receivedAt),
      updatedAt: safeDate(dates.updatedAt ?? dates.receivedAt),
      promisedDate: dates.promisedDate ? safeDate(dates.promisedDate) : undefined,
      estimatedCost: typeof costs.estimated === "number" ? costs.estimated : 0,
      finalCost: costs.final ?? null,
      completedAt: dates.completedAt ? safeDate(dates.completedAt) : undefined,
      deliveredAt: dates.deliveredAt ? safeDate(dates.deliveredAt) : undefined,
    },
    orderStatusLabel: order.status ?? "No disponible",
    timeline: normalizePortalTimeline(timelineItems),
    attachments: [],
    documents: normalizePortalDocuments(documentItems),
    events: timelineItems.map((event) => {
      const ev = event ?? {};
      return {
        id: ev.id ?? Math.random().toString(36).substring(7),
        type: ev.type ?? "event",
        description: ev.note ?? ev.label ?? "Evento sin descripción",
        date: safeDate(ev.createdAt),
      };
    }),
    messages: [],
    authorization: r.authorization ?? null,
    warranty: r.warranty ?? null,
    pdf: r.pdf ?? { available: false, url: null },
    source: "canonical",
  };
}

function safeDate(value?: unknown): Date {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? new Date() : value;
  }
  if (typeof value === "number") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? new Date() : d;
  }
  if (typeof value === "string" && value.trim()) {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? new Date() : d;
  }
  return new Date();
}

function normalizeOrder(order: BackendOrderResponse["data"]["order"]): NormalizedOrder {
  const o = order ?? {};
  const deviceInfo = o.device_info ?? {};
  return {
    folio: o.folio ?? "No disponible",
    status: o.status ?? "pending",
    statusLabel: o.status ?? "No disponible",
    deviceType: String(deviceInfo.type ?? "No disponible"),
    deviceBrand: String(deviceInfo.brand ?? "No disponible"),
    deviceModel: String(deviceInfo.model ?? "No disponible"),
    serialNumber: deviceInfo.serial_number ?? o.serial_number ?? undefined,
    problemDescription: String(o.problem_description ?? "No disponible"),
    createdAt: safeDate(o.created_at),
    updatedAt: safeDate(o.updated_at ?? o.created_at),
    promisedDate: o.promised_date ? safeDate(o.promised_date) : undefined,
    customerName: deviceInfo.customer_name ?? undefined,
    customerPhone: deviceInfo.customer_phone ?? undefined,
    customerEmail: deviceInfo.customer_email ?? undefined,
    estimatedCost: typeof o.estimated_cost === "number" ? o.estimated_cost : undefined,
    finalCost: o.final_cost ?? null,
  };
}

function normalizeTimeline(events: BackendOrderResponse["data"]["timeline"]): NormalizedTimelineEvent[] {
  const arr = Array.isArray(events) ? events : [];
  return arr.map((event, index) => {
    const ev = event ?? {};
    return {
      id: ev.label ? `${ev.label}-${index}` : `event-${index}-${Math.random().toString(36).substring(7)}`,
      label: ev.label ?? "Evento",
      status: ev.status === "completed" || ev.status === "in_progress" || ev.status === "pending" ? ev.status : "pending",
      note: ev.note ?? undefined,
      date: new Date(),
    };
  });
}

function normalizePortalTimeline(events: PortalOrderResponse["data"]["timeline"]["items"]): NormalizedTimelineEvent[] {
  const arr = Array.isArray(events) ? events : [];
  return arr.map((event, index) => {
    const ev = event ?? {};
    return {
      id: ev.id ?? `portal-event-${index}-${Math.random().toString(36).substring(7)}`,
      label: ev.label ?? "Evento",
      status: ev.status === "received" || ev.status === "delivered" || ev.status === "completed" ? "completed" : ev.type === "status" ? "in_progress" : "pending",
      note: ev.note ?? ev.type ?? undefined,
      date: safeDate(ev.createdAt),
    };
  });
}

function normalizeAttachments(attachments: BackendOrderResponse["data"]["attachments"]): NormalizedAttachment[] {
  const arr = Array.isArray(attachments) ? attachments : [];
  return arr.map((attachment) => {
    const att = attachment ?? {};
    const fileType = String(att.file_type ?? "");
    let type: "image" | "video" | "document" = "document";
    if (fileType.startsWith("image")) {
      type = "image";
    } else if (fileType.startsWith("video")) {
      type = "video";
    }
    return {
      id: att.id ?? Math.random().toString(36).substring(7),
      name: att.file_name ?? "Adjunto",
      url: att.public_url ?? "",
      type,
      mimeType: att.mime_type ?? "",
      source: att.source ?? "unknown",
      date: safeDate(att.created_at),
    };
  });
}

function normalizeDocuments(documents: BackendOrderResponse["data"]["documents"]): NormalizedDocument[] {
  const arr = Array.isArray(documents) ? documents : [];
  return arr.map((document) => {
    const doc = document ?? {};
    return {
      id: doc.id ?? Math.random().toString(36).substring(7),
      name: doc.file_name ?? "Documento",
      url: doc.public_url ?? null,
      type: resolveDocumentType(doc.file_type ?? "", doc.mime_type),
      date: safeDate(doc.created_at),
    };
  });
}

function normalizePortalDocuments(documents: PortalOrderResponse["data"]["documents"]["items"]): NormalizedDocument[] {
  const arr = Array.isArray(documents) ? documents : [];
  return arr.map((document) => {
    const doc = document ?? {};
    return {
      id: doc.id ?? Math.random().toString(36).substring(7),
      name: doc.fileName ?? "Documento",
      url: doc.url ?? null,
      type: resolveDocumentType(doc.fileType ?? "", doc.mimeType),
      date: safeDate(doc.createdAt),
    };
  });
}

function resolveDocumentType(fileType: string, mimeType?: string | null): NormalizedDocument["type"] {
  const ft = String(fileType || "").toLowerCase();
  const mt = String(mimeType || "").toLowerCase();
  if (ft === "invoice" || ft === "warranty" || ft === "diagnostic") return ft;
  if (mt.startsWith("image/") || ft.includes("photo") || ft.includes("image")) return "image";
  if (mt.startsWith("video/") || ft.includes("video")) return "video";
  return "other";
}

function normalizeDocument(document: NonNullable<BackendOrderResponse["data"]["pdf_attachment"]>): NormalizedDocument {
  const doc = document ?? {};
  return {
    id: doc.fileName ?? doc.label ?? "documento-pdf",
    name: doc.label ?? "Documento PDF",
    url: doc.url ?? null,
    type: "invoice",
    date: new Date(),
  };
}

function normalizeEvents(events: BackendOrderResponse["data"]["events"]): NormalizedEvent[] {
  const arr = Array.isArray(events) ? events : [];
  return arr.map((event) => {
    const ev = event ?? {};
    return {
      id: ev.id ?? Math.random().toString(36).substring(7),
      type: ev.event_type ?? "event",
      description: ev.note ?? ev.event_type ?? "Evento sin descripción",
      date: safeDate(ev.created_at),
    };
  });
}

function normalizeMessages(messages: BackendOrderResponse["data"]["messages"]): NormalizedMessage[] {
  const arr = Array.isArray(messages) ? messages : [];
  return arr.map((message) => {
    const msg = message ?? {};
    return {
      id: msg.id ?? Math.random().toString(36).substring(7),
      from: "technician",
      content: msg.note ?? "",
      read: true,
      date: safeDate(msg.created_at),
    };
  });
}
