'use client';

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User, Smartphone, DollarSign, Loader2, Save, Camera, X, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { apiGateway } from "@/services/apiGateway";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getCurrentSession } from "@/lib/session";
import { OmniSearch } from "./omni-search";
import { compressImage } from "@/lib/image-utils";
import { SignaturePad } from "./signature-pad";
import { Badge } from "@white-label/ui";

type UploadStatus = 'idle' | 'compressing' | 'uploading' | 'success' | 'error';

interface PhotoTask {
  id: string;
  file: File;
  preview: string;
  base64Compressed: string | null;
  status: UploadStatus;
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function QuickReceiveModal({ open, onOpenChange }: Props) {
  const router = useRouter();
  
  // Catálogos
  const [families, setFamilies] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [faults, setFaults] = useState<any[]>([]);

  // Estados de carga general
  const [loadingCatalogs, setLoadingCatalogs] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado de Formulario
  const [formData, setFormData] = useState({
    clientName: "",
    clientPhone: "",
    familyId: "",
    brandId: "",
    modelId: "",
    faultId: "",
    deviceModelName: "", // Por si se escribe manual
    issueName: "", // Por si se escribe manual
    serialNumber: "",
    priority: "normal",
    promisedDate: "",
    estimatedCost: "",
    deposit: "",
    notes: ""
  });

  // Estado de Evidencias y Firma
  const [photos, setPhotos] = useState<PhotoTask[]>([]);
  const [signature, setSignature] = useState<string | null>(null);
  
  // Máquina de estados para el flujo transaccional
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [submissionPhase, setSubmissionPhase] = useState<'draft' | 'uploading' | 'done'>('draft');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      loadInitialCatalogs();
    } else {
      resetForm();
    }
  }, [open]);

  // --- Carga de Catálogos (Cascada) ---
  const loadInitialCatalogs = async () => {
    setLoadingCatalogs(true);
    try {
      const res = await apiGateway.getCatalogFamilies();
      setFamilies(res);
      if (res.length > 0) {
        setFormData(prev => ({ ...prev, familyId: res[0].id }));
        loadBrands(res[0].id);
      }
    } catch (e) {
      toast.error('Error al cargar familias');
    } finally {
      setLoadingCatalogs(false);
    }
  };

  const loadBrands = async (familyId: string) => {
    try {
      const res = await apiGateway.getCatalogBrands(familyId);
      setBrands(res);
      setModels([]);
      setFaults([]);
    } catch (e) { }
  };

  const loadModels = async (brandId: string) => {
    try {
      const res = await apiGateway.getCatalogModels(brandId);
      setModels(res);
      setFaults([]);
    } catch (e) { }
  };

  const loadFaults = async (modelId: string) => {
    try {
      const res = await apiGateway.getCatalogFaults(modelId);
      setFaults(res);
    } catch (e) { }
  };

  const handleFamilySelect = (id: string) => {
    setFormData(prev => ({ ...prev, familyId: id, brandId: "", modelId: "", faultId: "", deviceModelName: "" }));
    loadBrands(id);
  };

  const handleBrandSelect = (id: string) => {
    setFormData(prev => ({ ...prev, brandId: id, modelId: "", faultId: "", deviceModelName: "" }));
    loadModels(id);
  };

  const handleModelSelect = (id: string, name: string) => {
    setFormData(prev => ({ ...prev, modelId: id, deviceModelName: name, faultId: "", issueName: "" }));
    loadFaults(id);
  };

  const handleFaultSelect = (fault: any) => {
    setFormData(prev => ({ 
      ...prev, 
      faultId: fault.id, 
      issueName: fault.name,
      estimatedCost: fault.default_cost ? String(fault.default_cost) : prev.estimatedCost 
    }));
  };

  // --- Evidencia Fotográfica ---
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    
    const newPhotos: PhotoTask[] = newFiles.map(file => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      base64Compressed: null,
      status: 'idle'
    }));

    setPhotos(prev => [...prev, ...newPhotos]);
    if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
  };

  const removePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setFormData({
      clientName: "", clientPhone: "", familyId: "", brandId: "", modelId: "", faultId: "",
      deviceModelName: "", issueName: "", serialNumber: "", priority: "normal",
      promisedDate: "", estimatedCost: "", deposit: "", notes: ""
    });
    setPhotos([]);
    setSignature(null);
    setCreatedOrderId(null);
    setSubmissionPhase('draft');
  };

  // --- Flujo Transaccional ---
  const submitOrder = async () => {
    const finalModel = formData.deviceModelName || (models.find(m => m.id === formData.modelId)?.name) || "Equipo Generico";
    const finalIssue = formData.issueName || (faults.find(f => f.id === formData.faultId)?.name) || "Revisión General";

    if (!formData.clientName || !formData.clientPhone || !finalModel || !finalIssue) {
      toast.error("Cliente, Modelo y Falla son obligatorios.");
      return;
    }

    setIsSubmitting(true);
    let currentOrderId = createdOrderId;

    // FASE 1: Crear Orden (Si no se ha creado ya por un reintento)
    if (!currentOrderId) {
      try {
        const session = getCurrentSession();
        const payload = {
          clientName: formData.clientName,
          clientPhone: formData.clientPhone.replace(/\D/g, ''),
          deviceType: families.find(f => f.id === formData.familyId)?.name || 'Generico',
          deviceModel: finalModel,
          serialNumber: formData.serialNumber,
          issue: finalIssue,
          estimatedCost: Number(formData.estimatedCost) || 0,
          sucursalId: session?.branchId || undefined,
          catalogModelId: formData.modelId || undefined,
          catalogFaultId: formData.faultId || undefined,
          promisedDate: formData.promisedDate || undefined,
          metadata: { priority: formData.priority },
          checklist: { notes: formData.notes }
        };

        const result = (await apiGateway.createOrder(payload)) as any;
        currentOrderId = result.id;
        setCreatedOrderId(currentOrderId);

        // Cobrar anticipo si existe
        if (formData.deposit && Number(formData.deposit) > 0 && currentOrderId) {
          await apiGateway.createOrderPayment(currentOrderId, {
            amount: Number(formData.deposit),
            paymentMethod: "cash",
            notes: "Abono en recepción"
          });
        }
      } catch (err: any) {
        toast.error(err?.message || "Error al crear la orden base.");
        setIsSubmitting(false);
        return;
      }
    }

    // FASE 2: Compresión y Subida de Evidencia
    if (photos.length > 0 || signature) {
      setSubmissionPhase('uploading');
      
      const tasksToUpload = photos.filter(p => p.status === 'idle' || p.status === 'error');
      
      // Promesas de subida en paralelo
      const uploadPromises = tasksToUpload.map(async (photo) => {
        try {
          // Actualizar estado a comprimiendo
          setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, status: 'compressing' } : p));
          
          const base64 = photo.base64Compressed || await compressImage(photo.file);
          
          // Actualizar estado a subiendo
          setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, status: 'uploading', base64Compressed: base64 } : p));
          
          await apiGateway.uploadOrderAttachment(currentOrderId!, photo.file, 'intake_photo'); // La api interna maneja el base64 si es necesario, adaptamos a tu wrapper
          
          // Éxito
          setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, status: 'success' } : p));
        } catch (e) {
          // Error individual
          setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, status: 'error' } : p));
          throw e;
        }
      });

      // Añadir firma a las promesas si existe
      if (signature) {
        // Asumiendo que podemos enviar la firma como base64 al mismo endpoint o similar
        // Esto depende de tu implementación en el backend para la firma.
        // Aquí lo simularemos adjuntándolo como foto.
        const sigFile = dataURLtoFile(signature, 'firma.png');
        uploadPromises.push(
           apiGateway.uploadOrderAttachment(currentOrderId!, sigFile, 'intake_photo').then(() => {})
        );
      }

      const results = await Promise.allSettled(uploadPromises);
      const hasErrors = results.some(r => r.status === 'rejected');

      if (hasErrors) {
        toast.error("Algunas imágenes fallaron por la conexión. Puedes reintentar.");
        setIsSubmitting(false);
        return; // Detenemos aquí, el usuario puede dar clic en "Reintentar"
      }
    }

    // FASE 3: Finalizar
    setSubmissionPhase('done');
    toast.success("¡Orden y evidencias procesadas al 100%!");
    setTimeout(() => {
      onOpenChange(false);
      router.refresh();
      window.dispatchEvent(new CustomEvent('refresh-orders'));
    }, 1500);
  };

  // Helper
  function dataURLtoFile(dataurl: string, filename: string) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)![1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){ u8arr[n] = bstr.charCodeAt(n); }
    return new File([u8arr], filename, {type:mime});
  }


  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val && createdOrderId && submissionPhase === 'uploading') {
        if(!confirm("La orden se creó pero faltan fotos por subir. ¿Seguro que quieres salir?")) return;
      }
      onOpenChange(val);
    }}>
      <DialogContent className="bg-slate-50 sm:max-w-6xl p-0 overflow-hidden shadow-2xl border-slate-200 h-[90vh] flex flex-col">
        {/* HEADER */}
        <div className="bg-white border-b border-slate-200 p-4 shrink-0 flex items-center justify-between">
          <div>
            <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-sky-500" />
              Recepción a 1-Clic
            </DialogTitle>
            <DialogDescription className="text-slate-500 mt-1">
              Flujo unificado. Captura equipo, cotiza y toma evidencia sin cambiar de pantalla.
            </DialogDescription>
          </div>
          {submissionPhase === 'done' && (
            <Badge variant="success" className="text-sm px-3 py-1">¡Completado!</Badge>
          )}
        </div>

        {/* BODY - 3 COLUMNS */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* COL 1: CLIENTE E HISTORIAL */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-sky-600 font-bold uppercase tracking-wider text-xs">
                <User className="h-4 w-4" /> 1. Cliente (Búsqueda Rápida)
              </div>
              
              <OmniSearch 
                placeholder="Escribe número, nombre o folio..."
                onCustomerSelect={(c) => {
                  setFormData(prev => ({ ...prev, clientName: c.name, clientPhone: c.phone }));
                }}
                onModelSelect={(m) => handleModelSelect(m.id, m.name)}
              />

              <div className="space-y-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Nombre Completo *</label>
                  <Input name="clientName" value={formData.clientName} onChange={handleChange} placeholder="Ej. Juan Pérez" className="bg-slate-50 h-10" disabled={!!createdOrderId} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Teléfono (WhatsApp) *</label>
                  <Input name="clientPhone" value={formData.clientPhone} onChange={handleChange} placeholder="10 dígitos" className="bg-slate-50 h-10 font-mono" disabled={!!createdOrderId} />
                </div>
              </div>
            </div>

            {/* COL 2: DISPOSITIVO PREDICTIVO */}
            <div className="space-y-5 md:border-l md:border-slate-200 md:pl-8">
              <div className="flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-wider text-xs">
                <Smartphone className="h-4 w-4" /> 2. Dispositivo & Falla
              </div>

              <div className="space-y-4">
                {/* Marcas Top Chips */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Marca</label>
                  <div className="flex flex-wrap gap-2">
                    {brands.slice(0, 6).map(b => (
                      <button key={b.id} onClick={() => handleBrandSelect(b.id)} disabled={!!createdOrderId}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${formData.brandId === b.id ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-105' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}>
                        {b.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Modelos Top Chips */}
                {models.length > 0 && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Modelo</label>
                    <div className="flex flex-wrap gap-2">
                      {models.slice(0, 8).map(m => (
                        <button key={m.id} onClick={() => handleModelSelect(m.id, m.name)} disabled={!!createdOrderId}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${formData.modelId === m.id ? 'bg-sky-500 text-white border-sky-600 shadow-md scale-105' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}>
                          {m.name}
                        </button>
                      ))}
                      <Input name="deviceModelName" value={formData.deviceModelName} onChange={handleChange} placeholder="Otro modelo..." className="w-32 h-8 text-xs bg-white" disabled={!!createdOrderId} />
                    </div>
                  </div>
                )}

                {/* Fallas Chips */}
                {faults.length > 0 && formData.modelId && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fallas Comunes</label>
                    <div className="flex flex-wrap gap-2">
                      {faults.map(f => (
                        <button key={f.id} onClick={() => handleFaultSelect(f)} disabled={!!createdOrderId}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${formData.faultId === f.id ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-105' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}>
                          {f.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {(!faults.length || !formData.modelId) && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Falla Manual *</label>
                    <Input name="issueName" value={formData.issueName} onChange={handleChange} placeholder="Ej. No retiene carga" className="bg-white h-10" disabled={!!createdOrderId} />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">IMEI/Serie</label>
                    <Input name="serialNumber" value={formData.serialNumber} onChange={handleChange} placeholder="Escanea..." className="bg-white h-10 font-mono text-xs" disabled={!!createdOrderId} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Prioridad</label>
                    <select name="priority" value={formData.priority} onChange={handleChange} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none" disabled={!!createdOrderId}>
                      <option value="normal">Normal</option>
                      <option value="alta">🔴 Urgente</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* COL 3: EVIDENCIA Y FINANZAS */}
            <div className="space-y-5 md:border-l md:border-slate-200 md:pl-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-violet-600 font-bold uppercase tracking-wider text-xs">
                  <Camera className="h-4 w-4" /> 3. Evidencia y Cobro
                </div>
              </div>

              {/* Módulo de Fotos Nativas */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <label className="flex items-center justify-center w-full h-12 border-2 border-dashed border-sky-300 rounded-xl bg-sky-50 text-sky-600 cursor-pointer hover:bg-sky-100 transition">
                  <Camera className="h-5 w-5 mr-2" />
                  <span className="font-bold text-sm">Tomar Foto (Física o Estética)</span>
                  <input type="file" accept="image/*" capture="environment" multiple className="hidden" ref={fileInputRef} onChange={handlePhotoSelect} />
                </label>

                {/* Grid de Previsualización y Progreso */}
                {photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {photos.map(p => (
                      <div key={p.id} className="relative aspect-square rounded-lg border border-slate-200 overflow-hidden bg-slate-100">
                        <img src={p.preview} alt="evidencia" className="object-cover w-full h-full" />
                        
                        {/* Overlay de estado */}
                        {p.status !== 'idle' && (
                          <div className={`absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white backdrop-blur-sm transition-all`}>
                            {p.status === 'compressing' && <><RefreshCw className="h-4 w-4 animate-spin mb-1" /><span className="text-[9px] font-bold">Comprimiendo</span></>}
                            {p.status === 'uploading' && <><Loader2 className="h-4 w-4 animate-spin mb-1" /><span className="text-[9px] font-bold">Subiendo</span></>}
                            {p.status === 'success' && <CheckCircle2 className="h-6 w-6 text-emerald-400" />}
                            {p.status === 'error' && <AlertCircle className="h-6 w-6 text-rose-400" />}
                          </div>
                        )}

                        {/* Botón eliminar (solo si no está procesando ni terminado) */}
                        {p.status === 'idle' && (
                          <button onClick={() => removePhoto(p.id)} className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white hover:bg-rose-500">
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Finanzas */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Cotización Total ($)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">$</span>
                    <Input name="estimatedCost" value={formData.estimatedCost} onChange={handleChange} placeholder="0.00" className="bg-white h-12 pl-7 text-lg font-black text-slate-900 border-slate-300" disabled={!!createdOrderId} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Dejar Anticipo ($)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 text-sm font-bold">$</span>
                    <Input name="deposit" value={formData.deposit} onChange={handleChange} placeholder="0.00" className="bg-white h-12 pl-7 text-lg font-black text-emerald-600 border-emerald-200" disabled={!!createdOrderId} />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Firma del Cliente (Opcional)</label>
                <SignaturePad onSign={(b64) => setSignature(b64)} />
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER - BOTON MAESTRO */}
        <div className="bg-slate-100 border-t border-slate-200 p-5 shrink-0 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium">
            {submissionPhase === 'draft' ? "Crea la orden y sube evidencias en 1 clic." : submissionPhase === 'uploading' ? "Asegurando evidencias en la nube..." : "¡Todo listo!"}
          </div>
          
          <Button 
            onClick={submitOrder} 
            disabled={isSubmitting || submissionPhase === 'done'}
            className={`h-14 px-8 text-lg font-black shadow-xl transition-all
              ${submissionPhase === 'uploading' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-sky-500 hover:bg-sky-600'}`}
          >
            {submissionPhase === 'uploading' ? (
               <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Procesando {photos.filter(p=>p.status !== 'success').length} fotos...</>
            ) : submissionPhase === 'done' ? (
               <><CheckCircle2 className="h-5 w-5 mr-2" /> Finalizado</>
            ) : (
               <><Save className="h-5 w-5 mr-2" /> Ingresar Equipo</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
