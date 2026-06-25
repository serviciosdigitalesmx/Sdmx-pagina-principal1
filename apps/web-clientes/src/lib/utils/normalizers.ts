import type { BackendOrderResponse, NormalizedAttachment, NormalizedDocument, NormalizedEvent, NormalizedMessage, NormalizedOrder, NormalizedOrderDetail, NormalizedTimelineEvent, PortalOrderResponse } from "../types";

export function normalizeOrderDetail(raw: BackendOrderResponse["data"]): NormalizedOrderDetail {
  return {
    order: normalizeOrder(raw.order),
    orderStatusLabel: raw.order.status,
    timeline: normalizeTimeline(raw.timeline ?? []),
    pdfAttachment: raw.pdf_attachment ? normalizeDocument(raw.pdf_attachment) : undefined,
    attachments: normalizeAttachments(raw.attachments ?? []),
    documents: normalizeDocuments(raw.documents ?? []),
    events: normalizeEvents(raw.events ?? []),
    messages: normalizeMessages(raw.messages ?? []),
    source: "legacy",
  };
}

export function normalizePortalOrderDetail(raw: PortalOrderResponse["data"]): NormalizedOrderDetail {
  return {
    order: {
      folio: raw.order.folio,
      status: raw.order.status,
      statusLabel: raw.order.status,
      deviceType: raw.order.device.type || "No disponible",
      deviceBrand: raw.order.device.brand || "No disponible",
      deviceModel: raw.order.device.model || "No disponible",
      serialNumber: raw.order.device.serialNumber ?? undefined,
      problemDescription: raw.order.reportedIssue || "No disponible",
      createdAt: safeDate(raw.order.dates.receivedAt),
      updatedAt: safeDate(raw.order.dates.updatedAt ?? raw.order.dates.receivedAt),
      promisedDate: raw.order.dates.promisedDate ? safeDate(raw.order.dates.promisedDate) : undefined,
      estimatedCost: raw.order.costs.estimated,
      finalCost: raw.order.costs.final,
      completedAt: raw.order.dates.completedAt ? safeDate(raw.order.dates.completedAt) : undefined,
      deliveredAt: raw.order.dates.deliveredAt ? safeDate(raw.order.dates.deliveredAt) : undefined,
    },
    orderStatusLabel: raw.order.status,
    timeline: normalizePortalTimeline(raw.timeline.items),
    attachments: [],
    documents: normalizePortalDocuments(raw.documents.items),
    events: raw.timeline.items.map((event) => ({
      id: event.id,
      type: event.type,
      description: event.note ?? event.label,
      date: safeDate(event.createdAt),
    })),
    messages: [],
    authorization: raw.authorization,
    warranty: raw.warranty,
    pdf: raw.pdf,
    source: "canonical",
  };
}

function safeDate(value?: string | Date | null): Date {
  if (value instanceof Date) return value;
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function normalizeOrder(order: BackendOrderResponse["data"]["order"]): NormalizedOrder {
  const deviceInfo = order.device_info ?? {};
  return {
    folio: order.folio,
    status: order.status,
    statusLabel: order.status,
    deviceType: String(deviceInfo.type ?? "No disponible"),
    deviceBrand: String(deviceInfo.brand ?? "No disponible"),
    deviceModel: String(deviceInfo.model ?? "No disponible"),
    serialNumber: deviceInfo.serial_number ?? order.serial_number ?? undefined,
    problemDescription: String(order.problem_description ?? "No disponible"),
    createdAt: new Date(order.created_at ?? Date.now()),
    updatedAt: new Date(order.updated_at ?? order.created_at ?? Date.now()),
    promisedDate: order.promised_date ? new Date(order.promised_date) : undefined,
    customerName: deviceInfo.customer_name ?? undefined,
    customerPhone: deviceInfo.customer_phone ?? undefined,
    customerEmail: deviceInfo.customer_email ?? undefined,
  };
}

function normalizeTimeline(events: BackendOrderResponse["data"]["timeline"]): NormalizedTimelineEvent[] {
  return events.map((event, index) => ({
    id: `${event.label}-${index}`,
    label: event.label,
    status: event.status,
    note: event.note,
    date: new Date(),
  }));
}

function normalizePortalTimeline(events: PortalOrderResponse["data"]["timeline"]["items"]): NormalizedTimelineEvent[] {
  return events.map((event) => ({
    id: event.id,
    label: event.label,
    status: event.status === "received" || event.status === "delivered" || event.status === "completed" ? "completed" : event.type === "status" ? "in_progress" : "pending",
    note: event.note ?? event.type,
    date: safeDate(event.createdAt),
  }));
}

function normalizeAttachments(attachments: BackendOrderResponse["data"]["attachments"]): NormalizedAttachment[] {
  return attachments.map((attachment) => ({
    id: attachment.id,
    name: attachment.file_name,
    url: attachment.public_url ?? "",
    type: attachment.file_type.startsWith("image") ? "image" : attachment.file_type.startsWith("video") ? "video" : "document",
    mimeType: attachment.mime_type,
    source: attachment.source,
    date: new Date(attachment.created_at),
  }));
}

function normalizeDocuments(documents: BackendOrderResponse["data"]["documents"]): NormalizedDocument[] {
  return documents.map((document) => ({
    id: document.id,
    name: document.file_name,
    url: document.public_url ?? null,
    type: resolveDocumentType(document.file_type, document.mime_type),
    date: new Date(document.created_at),
  }));
}

function normalizePortalDocuments(documents: PortalOrderResponse["data"]["documents"]["items"]): NormalizedDocument[] {
  return documents.map((document) => ({
    id: document.id,
    name: document.fileName,
    url: document.url,
    type: resolveDocumentType(document.fileType, document.mimeType),
    date: safeDate(document.createdAt),
  }));
}

function resolveDocumentType(fileType: string, mimeType?: string | null): NormalizedDocument["type"] {
  if (fileType === "invoice" || fileType === "warranty" || fileType === "diagnostic") return fileType;
  if (mimeType?.startsWith("image/") || fileType.includes("photo") || fileType.includes("image")) return "image";
  if (mimeType?.startsWith("video/") || fileType.includes("video")) return "video";
  return "other";
}

function normalizeDocument(document: NonNullable<BackendOrderResponse["data"]["pdf_attachment"]>): NormalizedDocument {
  return {
    id: document.fileName ?? document.label,
    name: document.label,
    url: document.url,
    type: "invoice",
    date: new Date(),
  };
}

function normalizeEvents(events: BackendOrderResponse["data"]["events"]): NormalizedEvent[] {
  return events.map((event) => ({
    id: event.id,
    type: event.event_type,
    description: event.note ?? event.event_type,
    date: new Date(event.created_at),
  }));
}

function normalizeMessages(messages: BackendOrderResponse["data"]["messages"]): NormalizedMessage[] {
  return messages.map((message) => ({
    id: message.id,
    from: "technician",
    content: message.note ?? "",
    read: true,
    date: new Date(message.created_at),
  }));
}
