"use client";

import { useMemo, useState } from "react";
import { CheckCircle, Clock3, FileText, MessageCircle, Phone, Shield, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge, SurfaceCard } from "@white-label/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Order, OrderChecklist, OrderDocument, OrderEvent } from "@/types";
import { getTenantSlug } from "@/lib/tenant";

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
  return order.receipt_url ?? null;
}

function buildWhatsappUrl(order: Order | null) {
  const phone = order?.device_info?.customer_phone?.replace(/\D/g, "");
  if (!phone) return null;
  const folio = order?.folio ?? "";
  const tenantSlug = getTenantSlug();
  const portalBase = process.env.NEXT_PUBLIC_WEB_PUBLIC_URL?.replace(/\/$/, "") ?? "";
  const portalUrl = tenantSlug && portalBase ? `${portalBase}/${encodeURIComponent(tenantSlug)}/portal?folio=${encodeURIComponent(folio)}` : "";
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

  const checklist = useMemo(() => null as OrderChecklist | null, []);
  const documents = useMemo(() => [] as OrderDocument[], []);
  const events = useMemo(() => [] as OrderEvent[], []);
  const pdfUrl = buildPdfUrl(order);
  const whatsappUrl = buildWhatsappUrl(order);

  if (!open || !order) return null;

  const device = order.device_info ?? {};
  const statusLabel = String(order.status || "recibido").replaceAll("_", " ");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-1rem)] border border-slate-800 bg-slate-950/96 p-0 shadow-[0_30px_120px_rgba(2,6,23,0.65)] sm:max-w-[820px]">
        <div className="flex h-[calc(100dvh-1rem)] max-h-[calc(100dvh-1rem)] flex-col overflow-hidden">
          <div className="border-b border-slate-800/80 px-4 py-3 sm:px-5">
            <DialogHeader className="mb-0">
              <DialogTitle className="flex items-center justify-between gap-3 text-base text-slate-100 sm:text-lg">
                <span className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-sky-300" />
                  Orden {order.folio}
                </span>
                <Badge variant="success">{statusLabel}</Badge>
              </DialogTitle>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-5">
            <div className="mb-4 grid gap-3 md:grid-cols-3">
              <SurfaceCard elevated className="p-4 md:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Resumen</p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-50">{device.customer_name || "Cliente sin nombre"}</h3>
                  </div>
                  <Badge variant={order.warranty_until ? "success" : "neutral"}>
                    <Shield className="mr-1 h-3.5 w-3.5" />
                    {order.warranty_until ? "Con garantía" : "Sin garantía"}
                  </Badge>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <InfoRow label="Equipo" value={[device.type, device.model].filter(Boolean).join(" - ") || "Sin dato"} />
                  <InfoRow label="Serie / IMEI" value={device.serial_number || order.serial_number || "Sin dato"} />
                  <InfoRow label="Falla" value={order.problem_description || "Sin dato"} />
                  <InfoRow label="Promesa" value={formatDate(order.promised_date)} />
                  <InfoRow label="Costo estimado" value={`$${Number(order.estimated_cost || 0).toFixed(2)}`} />
                  <InfoRow label="Costo final" value={`$${Number(order.final_cost || 0).toFixed(2)}`} />
                </div>
              </SurfaceCard>

              <SurfaceCard elevated className="p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Acciones</p>
                <div className="mt-3 space-y-2">
                  <Button className="w-full justify-start gap-2" variant="outline" onClick={() => onOpenChange(false)}>
                    <X className="h-4 w-4" />
                    Cerrar
                  </Button>
                  <Button className="w-full justify-start gap-2" variant="outline" onClick={() => window.open(`/dashboard/operativo?order=${encodeURIComponent(order.id)}`, "_blank")}>
                    <Clock3 className="h-4 w-4" />
                    Ir a operativo
                  </Button>
                  {pdfUrl ? (
                    <Button className="w-full justify-start gap-2" onClick={() => window.open(pdfUrl, "_blank", "noopener,noreferrer")}>
                      <FileText className="h-4 w-4" />
                      Ver PDF
                    </Button>
                  ) : null}
                  {whatsappUrl ? (
                    <Button className="w-full justify-start gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={() => window.open(whatsappUrl, "_blank", "noopener,noreferrer")}>
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp cliente
                    </Button>
                  ) : null}
                  <div className="rounded-2xl border border-sky-500/15 bg-black/20 px-4 py-3 text-xs text-slate-400">
                    <div className="font-semibold text-slate-200">Actualizada</div>
                    <div className="mt-1">{formatDate(order.updated_at || order.created_at)}</div>
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
                    <InfoRow label="Nombre" value={device.customer_name || "Sin dato"} />
                    <InfoRow label="Teléfono" value={device.customer_phone || "Sin dato"} />
                    <InfoRow label="Email" value={device.customer_email || "Sin dato"} />
                  </SurfaceCard>
                  <SurfaceCard elevated className="p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Equipo</p>
                    <InfoRow label="Tipo" value={device.type || "Sin dato"} />
                    <InfoRow label="Modelo" value={device.model || "Sin dato"} />
                    <InfoRow label="Serie / IMEI" value={device.serial_number || order.serial_number || "Sin dato"} />
                  </SurfaceCard>
                  <SurfaceCard elevated className="p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Operación</p>
                    <InfoRow label="Estado" value={statusLabel} />
                    <InfoRow label="Fecha promesa" value={formatDate(order.promised_date)} />
                    <InfoRow label="Garantía" value={order.warranty_until ? formatDate(order.warranty_until) : "Sin garantía"} />
                  </SurfaceCard>
                </div>
                <SurfaceCard elevated className="p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Falla reportada</p>
                  <p className="mt-2 text-sm leading-6 text-slate-100">{order.problem_description || "Sin dato"}</p>
                </SurfaceCard>
              </TabsContent>

              <TabsContent value="checklist" className="mt-4 space-y-4">
                <SurfaceCard elevated className="p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Checklist</p>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <InfoRow label="Trae cargador" value={checklist?.has_charger ? "Sí" : "No"} />
                    <InfoRow label="Equipo prende" value={checklist?.powers_on ? "Sí" : "No"} />
                    <InfoRow label="Respaldo" value={checklist?.backup_required ? "Sí" : "No"} />
                    <InfoRow label="Aceptación del cliente" value={checklist?.customer_acceptance_required ? "Requerida" : "No requerida"} />
                    <InfoRow label="Condición de pantalla" value={checklist?.screen_condition || "Sin dato"} />
                    <InfoRow label="Notas" value={checklist?.notes || "Sin dato"} />
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
          </div>

          <div className="border-t border-slate-800/80 bg-slate-950/96 px-4 py-3 sm:px-5">
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
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
