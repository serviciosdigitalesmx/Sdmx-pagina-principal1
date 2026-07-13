"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Clock3, FileText, MessageCircle, Shield, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge, SurfaceCard } from "@white-label/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiClient } from "@/lib/api-client";
import { resolveAdminApiBaseUrl } from "@/lib/api-base-url";
import { getApiOptions } from "@/lib/tenant";
import type { Order, OrderChecklist, OrderDocument, OrderEvent } from "@/types";
import { getTenantSlug } from "@/lib/tenant";
import { resolveBaseDomain } from "@white-label/config";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onOrderUpdated: () => void;
};

function formatDate(value?: string | null) {
  if (!value) return "Sin fecha";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sin fecha";
  return new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(date);
}

function buildPdfUrl(order: Order | null) {
  if (!order) return null;
  const tenantSlug = getTenantSlug();
  const apiBaseUrl = resolveAdminApiBaseUrl().replace(/\/$/, "");
  if (tenantSlug && apiBaseUrl && order.folio) {
    return `${apiBaseUrl}/api/public/tenant/${encodeURIComponent(tenantSlug)}/orders/${encodeURIComponent(order.folio)}/pdf`;
  }
  return order.receipt_url ?? null;
}

function buildWhatsappUrl(order: Order | null) {
  const phone = order?.device_info?.customer_phone?.replace(/\D/g, "");
  if (!phone) return null;
  const folio = order?.folio ?? "";
  const tenantSlug = getTenantSlug();
  const baseDomain = resolveBaseDomain();
  const customerPortalBase = process.env.NEXT_PUBLIC_CUSTOMER_TRACKING_URL?.replace(/\/$/, "") ?? (baseDomain ? `https://clientes.${baseDomain}` : "");
  const portalUrl = tenantSlug && folio && customerPortalBase
    ? `${customerPortalBase}/t/${encodeURIComponent(tenantSlug)}/portal/${encodeURIComponent(folio)}`
    : "";
  const message = encodeURIComponent(`Hola, tu equipo ${folio} está en seguimiento. Puedes consultar su estado aquí: ${portalUrl || "portal público"}.`);
  return `https://wa.me/${phone}?text=${message}`;
}

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-800/70 py-2 text-sm last:border-b-0">
      <span className="text-slate-400">{label}</span>
      <span className="max-w-[62%] text-right font-medium text-slate-100">{String(value)}</span>
    </div>
  );
}

export function OrderModal({ open, onOpenChange, order, onOrderUpdated }: Props) {
  const [activeTab, setActiveTab] = useState<"details" | "checklist" | "photos" | "history">("details");
  const [detail, setDetail] = useState<{ order: Order; checklist: OrderChecklist | null; documents: OrderDocument[]; events: OrderEvent[] } | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [savingDetails, setSavingDetails] = useState(false);
  const [savingChecklist, setSavingChecklist] = useState(false);
  const [detailsDraft, setDetailsDraft] = useState({
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    deviceType: "",
    deviceModel: "",
    serialNumber: "",
    issue: "",
    promisedDate: "",
  });
  const [checklistDraft, setChecklistDraft] = useState({
    hasCharger: false,
    screenCondition: "",
    powersOn: false,
    backupRequired: false,
    notes: "",
    cosmeticCondition: "",
    reportedPhysicalDamage: "",
    accessoriesReceived: "",
    customerAcceptanceRequired: false,
    acceptedAt: "",
    acceptedByName: "",
  });

  const pdfUrl = buildPdfUrl(order);
  const whatsappUrl = buildWhatsappUrl(order);

  useEffect(() => {
    if (!open || !order?.id) return;

    let cancelled = false;
    setLoadingDetail(true);

    void apiClient
      .get<{ data: { order: Order; checklist?: OrderChecklist | null; documents?: OrderDocument[]; events?: OrderEvent[] } }>(
        `/orders/${encodeURIComponent(order.id)}`,
        getApiOptions(),
      )
      .then((response) => {
        if (cancelled) return;
        const loaded = response.data;
        setDetail({
          order: loaded.order,
          checklist: loaded.checklist ?? null,
          documents: loaded.documents ?? [],
          events: loaded.events ?? [],
        });
        setDetailsDraft({
          clientName: loaded.order.device_info?.customer_name || "",
          clientPhone: loaded.order.device_info?.customer_phone || "",
          clientEmail: loaded.order.device_info?.customer_email || "",
          deviceType: loaded.order.device_info?.type || "",
          deviceModel: loaded.order.device_info?.model || "",
          serialNumber: loaded.order.serial_number || loaded.order.device_info?.serial_number || "",
          issue: loaded.order.problem_description || "",
          promisedDate: loaded.order.promised_date ? String(loaded.order.promised_date).slice(0, 10) : "",
        });
        setChecklistDraft({
          hasCharger: Boolean(loaded.checklist?.has_charger),
          screenCondition: loaded.checklist?.screen_condition || "",
          powersOn: Boolean(loaded.checklist?.powers_on),
          backupRequired: Boolean(loaded.checklist?.backup_required),
          notes: loaded.checklist?.notes || "",
          cosmeticCondition: loaded.checklist?.cosmetic_condition || "",
          reportedPhysicalDamage: loaded.checklist?.reported_physical_damage || "",
          accessoriesReceived: loaded.checklist?.accessories_received || "",
          customerAcceptanceRequired: Boolean(loaded.checklist?.customer_acceptance_required),
          acceptedAt: loaded.checklist?.accepted_at ? String(loaded.checklist.accepted_at).slice(0, 16) : "",
          acceptedByName: loaded.checklist?.accepted_by_name || "",
        });
      })
      .catch((error) => {
        console.error("Failed to load order detail:", error);
        if (!cancelled) setDetail(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingDetail(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, order?.id]);

  if (!open || !order) return null;

  const currentOrder = detail?.order ?? order;
  const checklist = detail?.checklist ?? null;
  const documents = detail?.documents ?? [];
  const events = detail?.events ?? [];
  const device = currentOrder.device_info ?? {};
  const statusLabel = String(currentOrder.status || "recibido").replaceAll("_", " ");

  const saveDetails = async () => {
    if (!order.id) return;
    setSavingDetails(true);
    try {
      await apiClient.patch(
        `/orders/${encodeURIComponent(order.id)}/details`,
        {
          clientName: detailsDraft.clientName,
          clientPhone: detailsDraft.clientPhone,
          clientEmail: detailsDraft.clientEmail,
          deviceType: detailsDraft.deviceType,
          deviceModel: detailsDraft.deviceModel,
          serialNumber: detailsDraft.serialNumber,
          issue: detailsDraft.issue,
          promisedDate: detailsDraft.promisedDate,
        },
        getApiOptions(),
      );
      await onOrderUpdated();
    } finally {
      setSavingDetails(false);
    }
  };

  const saveChecklist = async () => {
    if (!order.id) return;
    setSavingChecklist(true);
    try {
      await apiClient.put(
        `/orders/${encodeURIComponent(order.id)}/checklist`,
        {
          ...checklistDraft,
          acceptedAt: checklistDraft.acceptedAt ? new Date(checklistDraft.acceptedAt).toISOString() : "",
        },
        getApiOptions(),
      );
      await onOrderUpdated();
    } finally {
      setSavingChecklist(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-1rem)] border border-slate-800 bg-slate-950/96 p-0 shadow-[0_30px_120px_rgba(2,6,23,0.65)] sm:max-w-[920px]">
        <div className="flex h-[calc(100dvh-1rem)] max-h-[calc(100dvh-1rem)] flex-col overflow-hidden">
          <div className="border-b border-slate-800/80 px-4 py-3 sm:px-5">
            <DialogHeader className="mb-0">
              <DialogTitle className="flex items-center justify-between gap-3 text-base text-slate-100 sm:text-lg">
                <span className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-sky-300" />
                  Orden {currentOrder.folio}
                </span>
                <Badge variant="success">{statusLabel}</Badge>
              </DialogTitle>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-5">
            {loadingDetail ? (
              <div className="py-12 text-center text-sm text-slate-400">Cargando detalle...</div>
            ) : (
              <>
                <div className="mb-4 grid gap-3 md:grid-cols-3">
                  <SurfaceCard elevated className="p-4 md:col-span-2">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Resumen</p>
                        <h3 className="mt-1 text-lg font-semibold text-slate-50">{device.customer_name || "Cliente sin nombre"}</h3>
                      </div>
                      <Badge variant={currentOrder.warranty_until ? "success" : "neutral"}>
                        <Shield className="mr-1 h-3.5 w-3.5" />
                        {currentOrder.warranty_until ? "Con garantía" : "Sin garantía"}
                      </Badge>
                    </div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <InfoRow label="Equipo" value={[device.type, device.model].filter(Boolean).join(" - ") || "Sin dato"} />
                      <InfoRow label="Serie / IMEI" value={device.serial_number || currentOrder.serial_number || "Sin dato"} />
                      <InfoRow label="Falla" value={currentOrder.problem_description || "Sin dato"} />
                      <InfoRow label="Promesa" value={formatDate(currentOrder.promised_date)} />
                      <InfoRow label="Costo estimado" value={`$${Number(currentOrder.estimated_cost || 0).toFixed(2)}`} />
                      <InfoRow label="Costo final" value={`$${Number(currentOrder.final_cost || 0).toFixed(2)}`} />
                    </div>
                  </SurfaceCard>

                  <SurfaceCard elevated className="p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Acciones</p>
                    <div className="mt-3 grid gap-2">
                      <Button className="justify-start gap-2" variant="outline" onClick={() => onOpenChange(false)}>
                        <X className="h-4 w-4" />
                        Cerrar
                      </Button>
                      <Button
                        className="justify-start gap-2"
                        variant="outline"
                        onClick={() => window.location.assign(`/dashboard/operativo?order=${encodeURIComponent(currentOrder.id)}`)}
                      >
                        <Clock3 className="h-4 w-4" />
                        Editar en recepción
                      </Button>
                      {pdfUrl ? (
                        <Button className="justify-start gap-2" onClick={() => window.open(pdfUrl, "_blank", "noopener,noreferrer")}>
                          <FileText className="h-4 w-4" />
                          Ver PDF
                        </Button>
                      ) : null}
                      {whatsappUrl ? (
                        <Button className="justify-start gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={() => window.open(whatsappUrl, "_blank", "noopener,noreferrer")}>
                          <MessageCircle className="h-4 w-4" />
                          WhatsApp cliente
                        </Button>
                      ) : null}
                      <div className="rounded-2xl border border-sky-500/15 bg-black/20 px-4 py-3 text-xs text-slate-400">
                        <div className="font-semibold text-slate-200">Actualizada</div>
                        <div className="mt-1">{formatDate(currentOrder.updated_at || currentOrder.created_at)}</div>
                      </div>
                    </div>
                  </SurfaceCard>
                </div>

                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
                  <TabsList className="sticky top-0 z-10 grid w-full grid-cols-4 border border-slate-800 bg-slate-950/95 p-1 backdrop-blur-xl">
                    <TabsTrigger value="details" className="rounded-xl text-xs text-slate-400 data-[state=active]:bg-sky-500/20 data-[state=active]:text-sky-50">Detalles</TabsTrigger>
                    <TabsTrigger value="checklist" className="rounded-xl text-xs text-slate-400 data-[state=active]:bg-sky-500/20 data-[state=active]:text-sky-50">Checklist</TabsTrigger>
                    <TabsTrigger value="photos" className="rounded-xl text-xs text-slate-400 data-[state=active]:bg-sky-500/20 data-[state=active]:text-sky-50">Fotos</TabsTrigger>
                    <TabsTrigger value="history" className="rounded-xl text-xs text-slate-400 data-[state=active]:bg-sky-500/20 data-[state=active]:text-sky-50">Historial</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="mt-4 space-y-4">
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                      <SurfaceCard elevated className="p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Cliente</p>
                        <div className="mt-3 space-y-3">
                          <Input value={detailsDraft.clientName} onChange={(e) => setDetailsDraft((current) => ({ ...current, clientName: e.target.value }))} placeholder="Nombre" />
                          <Input value={detailsDraft.clientPhone} onChange={(e) => setDetailsDraft((current) => ({ ...current, clientPhone: e.target.value }))} placeholder="Teléfono" />
                          <Input value={detailsDraft.clientEmail} onChange={(e) => setDetailsDraft((current) => ({ ...current, clientEmail: e.target.value }))} placeholder="Correo" />
                        </div>
                      </SurfaceCard>
                      <SurfaceCard elevated className="p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Equipo</p>
                        <div className="mt-3 space-y-3">
                          <Input value={detailsDraft.deviceType} onChange={(e) => setDetailsDraft((current) => ({ ...current, deviceType: e.target.value }))} placeholder="Tipo de dispositivo" />
                          <Input value={detailsDraft.deviceModel} onChange={(e) => setDetailsDraft((current) => ({ ...current, deviceModel: e.target.value }))} placeholder="Modelo" />
                          <Input value={detailsDraft.serialNumber} onChange={(e) => setDetailsDraft((current) => ({ ...current, serialNumber: e.target.value }))} placeholder="Serie / IMEI" />
                        </div>
                      </SurfaceCard>
                      <SurfaceCard elevated className="p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Operación</p>
                        <div className="mt-3 space-y-3">
                          <Input type="date" value={detailsDraft.promisedDate} onChange={(e) => setDetailsDraft((current) => ({ ...current, promisedDate: e.target.value }))} />
                          <InfoRow label="Estado" value={statusLabel} />
                          <InfoRow label="Garantía" value={currentOrder.warranty_until ? formatDate(currentOrder.warranty_until) : "Sin garantía"} />
                        </div>
                      </SurfaceCard>
                    </div>
                    <SurfaceCard elevated className="p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Falla reportada</p>
                      <Textarea
                        className="mt-3 min-h-28"
                        value={detailsDraft.issue}
                        onChange={(e) => setDetailsDraft((current) => ({ ...current, issue: e.target.value }))}
                        placeholder="Describe el problema"
                      />
                      <div className="mt-4 flex justify-end">
                        <Button onClick={() => void saveDetails()} disabled={savingDetails} className="gap-2">
                          {savingDetails ? "Guardando..." : "Guardar ficha"}
                        </Button>
                      </div>
                    </SurfaceCard>
                  </TabsContent>

                  <TabsContent value="checklist" className="mt-4 space-y-4">
                    <SurfaceCard elevated className="p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Checklist</p>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <label className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm">
                          <input type="checkbox" checked={checklistDraft.hasCharger} onChange={(e) => setChecklistDraft((current) => ({ ...current, hasCharger: e.target.checked }))} />
                          Trae cargador
                        </label>
                        <label className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm">
                          <input type="checkbox" checked={checklistDraft.powersOn} onChange={(e) => setChecklistDraft((current) => ({ ...current, powersOn: e.target.checked }))} />
                          Equipo prende
                        </label>
                        <label className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm">
                          <input type="checkbox" checked={checklistDraft.backupRequired} onChange={(e) => setChecklistDraft((current) => ({ ...current, backupRequired: e.target.checked }))} />
                          Respaldo requerido
                        </label>
                        <label className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm">
                          <input type="checkbox" checked={checklistDraft.customerAcceptanceRequired} onChange={(e) => setChecklistDraft((current) => ({ ...current, customerAcceptanceRequired: e.target.checked }))} />
                          Aceptación requerida
                        </label>
                        <Input value={checklistDraft.screenCondition} onChange={(e) => setChecklistDraft((current) => ({ ...current, screenCondition: e.target.value }))} placeholder="Condición de pantalla" />
                        <Input value={checklistDraft.acceptedByName} onChange={(e) => setChecklistDraft((current) => ({ ...current, acceptedByName: e.target.value }))} placeholder="Aceptado por" />
                        <Input value={checklistDraft.cosmeticCondition} onChange={(e) => setChecklistDraft((current) => ({ ...current, cosmeticCondition: e.target.value }))} placeholder="Condición cosmética" />
                        <Input value={checklistDraft.reportedPhysicalDamage} onChange={(e) => setChecklistDraft((current) => ({ ...current, reportedPhysicalDamage: e.target.value }))} placeholder="Daño físico" />
                        <Input value={checklistDraft.accessoriesReceived} onChange={(e) => setChecklistDraft((current) => ({ ...current, accessoriesReceived: e.target.value }))} placeholder="Accesorios recibidos" />
                        <Input type="datetime-local" value={checklistDraft.acceptedAt} onChange={(e) => setChecklistDraft((current) => ({ ...current, acceptedAt: e.target.value }))} />
                        <Textarea className="md:col-span-2" value={checklistDraft.notes} onChange={(e) => setChecklistDraft((current) => ({ ...current, notes: e.target.value }))} placeholder="Notas" />
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button onClick={() => void saveChecklist()} disabled={savingChecklist} className="gap-2">
                          {savingChecklist ? "Guardando..." : "Guardar checklist"}
                        </Button>
                      </div>
                    </SurfaceCard>
                  </TabsContent>

                  <TabsContent value="photos" className="mt-4 space-y-4">
                    <SurfaceCard elevated className="p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Fotos</p>
                      <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
                        {documents.filter((doc) => doc.file_type === "intake_photo").map((doc) => (
                          <div key={doc.id} className="aspect-square overflow-hidden rounded-xl border border-slate-800 bg-black/20">
                            {doc.public_url ? (
                              <img src={doc.public_url} alt={doc.file_name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-slate-500">Sin vista previa</div>
                            )}
                          </div>
                        ))}
                      </div>
                      {documents.filter((doc) => doc.file_type === "intake_photo").length === 0 ? (
                        <p className="py-4 text-center text-slate-400">No hay fotos de recepción</p>
                      ) : null}
                    </SurfaceCard>
                  </TabsContent>

                  <TabsContent value="history" className="mt-4 space-y-4">
                    <SurfaceCard elevated className="p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Historial</p>
                      <div className="mt-3 space-y-2">
                        {events.length > 0 ? events.map((event) => (
                          <div key={event.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-sm font-semibold text-sky-300">{event.event_type || "evento"}</span>
                              <span className="text-xs text-slate-400">{formatDate(event.created_at)}</span>
                            </div>
                            {event.note ? <p className="mt-1 text-sm text-slate-100">{event.note}</p> : null}
                            {event.actor_name ? <p className="mt-1 text-xs text-slate-400">Por: {event.actor_name}</p> : null}
                          </div>
                        )) : (
                          <p className="py-4 text-center text-slate-400">Sin historial de eventos</p>
                        )}
                      </div>
                    </SurfaceCard>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>

          <div className="border-t border-slate-800/80 bg-slate-950/96 px-4 py-3 sm:px-5">
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cerrar ficha
              </Button>
              <Button onClick={onOrderUpdated} className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Refrescar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
