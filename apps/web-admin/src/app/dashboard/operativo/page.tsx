'use client';

import { useState, useEffect } from 'react';
import { Smartphone, User, ClipboardList, CheckCircle, Plus, Sparkles, AlertCircle, Loader2, Mic, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { apiGateway } from '@/services/apiGateway';
import { OmniSearch } from '@/components/ordenes/omni-search';
import { Success } from '@/components/operativo/success';
import { CatalogFamily, CatalogBrand, CatalogModel, CatalogFault, CatalogPart } from '@/types';

export default function OperativoPage() {
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{ folio: string; customerPhone: string; pdfUrl: string | null; trackingUrl: string | null } | null>(null);

  // Client State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');

  // Catalog Hierarchy State
  const [families, setFamilies] = useState<CatalogFamily[]>([]);
  const [selectedFamily, setSelectedFamily] = useState<CatalogFamily | null>(null);
  
  const [brands, setBrands] = useState<CatalogBrand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<CatalogBrand | null>(null);

  const [models, setModels] = useState<CatalogModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<CatalogModel | null>(null);

  const [faults, setFaults] = useState<CatalogFault[]>([]);
  const [selectedFault, setSelectedFault] = useState<CatalogFault | null>(null);

  const [parts, setParts] = useState<CatalogPart[]>([]);

  // Other Fields
  const [serialNumber, setSerialNumber] = useState('');
  const [issueFreeText, setIssueFreeText] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [notes, setNotes] = useState('');

  // Checklist State
  const [checklists, setChecklists] = useState<any[]>([]);
  const [checklistResponses, setChecklistResponses] = useState<Record<string, any>>({});

  // Voice Note State
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    loadFamilies();
  }, []);

  useEffect(() => {
    if (selectedFamily) {
      loadBrands(selectedFamily.id);
      loadChecklists(selectedFamily.id);
      setSelectedBrand(null);
      setSelectedModel(null);
      setSelectedFault(null);
      setModels([]);
      setFaults([]);
      setParts([]);
      setChecklistResponses({});
    }
  }, [selectedFamily]);

  useEffect(() => {
    if (selectedBrand) {
      loadModels(selectedBrand.id);
      setSelectedModel(null);
      setSelectedFault(null);
      setFaults([]);
      setParts([]);
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (selectedModel) {
      loadFaults(selectedModel.id);
      setSelectedFault(null);
      setParts([]);
    }
  }, [selectedModel]);

  useEffect(() => {
    if (selectedFault) {
      loadParts(selectedFault.id);
      if (selectedFault.default_cost !== null) {
        setEstimatedCost(String(selectedFault.default_cost));
      }
    }
  }, [selectedFault]);

  const loadFamilies = async () => {
    try {
      const data = await apiGateway.getCatalogFamilies();
      setFamilies(data);
    } catch (e) {
      toast.error('Error al cargar familias');
    }
  };

  const loadBrands = async (familyId: string) => {
    try {
      const data = await apiGateway.getCatalogBrands(familyId);
      setBrands(data);
    } catch (e) {
      toast.error('Error al cargar marcas');
    }
  };

  const loadModels = async (brandId: string) => {
    try {
      const data = await apiGateway.getCatalogModels(brandId);
      setModels(data);
    } catch (e) {
      toast.error('Error al cargar modelos');
    }
  };

  const loadFaults = async (modelId: string) => {
    try {
      const data = await apiGateway.getCatalogFaults(modelId);
      setFaults(data);
    } catch (e) {
      toast.error('Error al cargar fallas');
    }
  };

  const loadParts = async (faultId: string) => {
    try {
      const data = await apiGateway.getCatalogParts(faultId);
      setParts(data);
    } catch (e) {
      toast.error('Error al cargar refacciones');
    }
  };

  const loadChecklists = async (familyId: string) => {
    try {
      const data = await apiGateway.getCatalogChecklists(familyId);
      setChecklists(data);
      // Initialize responses
      const initial: Record<string, any> = {};
      data.forEach((item: any) => {
        if (item.item_type === 'boolean') initial[item.item_key] = false;
        else if (item.item_type === 'select') initial[item.item_key] = item.options?.[0] || '';
        else initial[item.item_key] = '';
      });
      setChecklistResponses(initial);
    } catch (e) {
      toast.error('Error al cargar checklist');
    }
  };

  const handleVoiceNote = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('El reconocimiento de voz no está soportado en este navegador.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-MX';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
      toast.info('Grabando voz... habla ahora.');
    };

    recognition.onerror = () => {
      setIsRecording(false);
      toast.error('Error al reconocer voz.');
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setNotes(prev => prev ? `${prev}\n${transcript}` : transcript);
      toast.success('Nota de voz agregada');
    };

    recognition.start();
  };

  const handleSave = async () => {
    if (!clientName || !clientPhone || !selectedModel || (!selectedFault && !issueFreeText)) {
      toast.error('Por favor completa los campos obligatorios (Cliente, Modelo y Falla).');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        clientName,
        clientPhone,
        clientEmail: clientEmail || undefined,
        deviceType: selectedFamily?.name || 'Celular',
        deviceModel: selectedModel.name,
        serialNumber: serialNumber || undefined,
        issue: selectedFault?.name || issueFreeText,
        estimatedCost: Number(estimatedCost) || 0,
        catalogModelId: selectedModel.id,
        catalogFaultId: selectedFault?.id || undefined,
        checklistResponses: checklistResponses,
        checklist: {
          notes: notes || undefined
        }
      };

      const result = await apiGateway.createOrder(payload);
      toast.success('Orden de servicio registrada con éxito.');
      setSuccessData({
        folio: result.folio,
        customerPhone: clientPhone,
        pdfUrl: result.receipt_url || null,
        trackingUrl: null
      });
    } catch (e: any) {
      toast.error(e.message || 'Error al guardar orden');
    } finally {
      setLoading(false);
    }
  };

  const handleNewOrder = () => {
    setSuccessData(null);
    setClientName('');
    setClientPhone('');
    setClientEmail('');
    setSelectedFamily(null);
    setSelectedBrand(null);
    setSelectedModel(null);
    setSelectedFault(null);
    setSerialNumber('');
    setIssueFreeText('');
    setEstimatedCost('');
    setNotes('');
  };

  if (successData) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6 bg-slate-900 min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="max-w-xl w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-8">
          <Success
            folio={successData.folio}
            customerPhone={successData.customerPhone}
            pdfUrl={successData.pdfUrl}
            trackingUrl={successData.trackingUrl}
            onNewOrder={handleNewOrder}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-140px)] w-full gap-6 p-6 bg-slate-50 overflow-hidden">
      {/* Panel Izquierdo (30%): Cliente */}
      <div className="w-[30%] flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
          <User className="h-5 w-5 text-sky-500" />
          <h3 className="font-bold text-slate-900">1. Cliente</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="mb-4">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Buscador Inteligente</label>
            <div className="mt-1">
              <OmniSearch
                placeholder="Buscar cliente por nombre/teléfono..."
                onCustomerSelect={(c) => {
                  setClientName(c.name);
                  setClientPhone(c.phone);
                  setClientEmail(c.email || '');
                  toast.success(`Cliente ${c.name} cargado`);
                }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Nombre Completo *</label>
              <Input
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder="Ej. Juan Pérez"
                className="border-slate-200 bg-white h-10 rounded-lg text-slate-900 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Teléfono *</label>
              <Input
                value={clientPhone}
                onChange={e => setClientPhone(e.target.value)}
                placeholder="10 dígitos"
                className="border-slate-200 bg-white h-10 rounded-lg text-slate-900 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Email (Opcional)</label>
              <Input
                value={clientEmail}
                onChange={e => setClientEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="border-slate-200 bg-white h-10 rounded-lg text-slate-900 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Panel Central (50%): Dispositivo Chips */}
      <div className="flex-1 flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
          <Smartphone className="h-5 w-5 text-sky-500" />
          <h3 className="font-bold text-slate-900">2. Dispositivo</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/20">
          {/* Familias */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tipo de Dispositivo</span>
            <div className="flex flex-wrap gap-2">
              {families.map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFamily(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
                    ${selectedFamily?.id === f.id
                      ? 'bg-sky-50 border-sky-300 text-sky-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          {/* Marcas */}
          {selectedFamily && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Marca</span>
              <div className="flex flex-wrap gap-2">
                {brands.length === 0 && <span className="text-xs text-slate-400">No hay marcas registradas</span>}
                {brands.map(b => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBrand(b)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
                      ${selectedBrand?.id === b.id
                        ? 'bg-sky-50 border-sky-300 text-sky-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Modelos */}
          {selectedBrand && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Modelo</span>
              <div className="flex flex-wrap gap-2">
                {models.length === 0 && <span className="text-xs text-slate-400">No hay modelos registrados</span>}
                {models.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModel(m)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
                      ${selectedModel?.id === m.id
                        ? 'bg-sky-50 border-sky-300 text-sky-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Fallas Frecuentes */}
          {selectedModel && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Fallas Frecuentes</span>
              <div className="flex flex-wrap gap-2">
                {faults.length === 0 && <span className="text-xs text-slate-400">No hay fallas precargadas</span>}
                {faults.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFault(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
                      ${selectedFault?.id === f.id
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Refacciones Sugeridas */}
          {selectedFault && parts.length > 0 && (
            <div className="bg-amber-50/50 border border-amber-200/60 p-4 rounded-xl space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">Refacción Recomendada</span>
              {parts.map(p => (
                <div key={p.id} className="flex justify-between items-center text-xs text-amber-900">
                  <span className="font-semibold">{p.name}</span>
                  <span className="text-slate-500 font-mono">SKU: {p.sku || 'N/A'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Panel Derecho (20%): Checklist y Guardado */}
      <div className="w-[20%] flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
          <ClipboardList className="h-5 w-5 text-sky-500" />
          <h3 className="font-bold text-slate-900">3. Detalles</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">IMEI / Número de Serie</label>
            <Input
              value={serialNumber}
              onChange={e => setSerialNumber(e.target.value)}
              placeholder="Opcional"
              className="border-slate-200 bg-white h-9 rounded-lg text-slate-900 text-sm"
            />
          </div>

          {!selectedFault && selectedModel && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Problema Reportado *</label>
              <Input
                value={issueFreeText}
                onChange={e => setIssueFreeText(e.target.value)}
                placeholder="Falla detectada..."
                className="border-slate-200 bg-white h-9 rounded-lg text-slate-900 text-sm"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Presupuesto Sugerido ($)</label>
            <Input
              type="number"
              value={estimatedCost}
              onChange={e => setEstimatedCost(e.target.value)}
              placeholder="0.00"
              className="border-slate-200 bg-white h-9 rounded-lg text-slate-900 text-sm"
            />
          </div>

          {/* Checklist Dinámico */}
          {checklists.length > 0 && (
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Inspección Inicial</span>
              {checklists.map(item => (
                <div key={item.id} className="space-y-1">
                  {item.item_type === 'boolean' ? (
                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!checklistResponses[item.item_key]}
                        onChange={e => setChecklistResponses(prev => ({ ...prev, [item.item_key]: e.target.checked }))}
                        className="rounded border-slate-350 text-sky-500 focus:ring-sky-500 h-4 w-4"
                      />
                      {item.item_label}
                    </label>
                  ) : item.item_type === 'select' ? (
                    <div className="space-y-1">
                      <label className="text-xs text-slate-600">{item.item_label}</label>
                      <select
                        value={checklistResponses[item.item_key] || ''}
                        onChange={e => setChecklistResponses(prev => ({ ...prev, [item.item_key]: e.target.value }))}
                        className="flex h-8 w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-900 focus:outline-none"
                      >
                        {item.options?.map((opt: string) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <label className="text-xs text-slate-600">{item.item_label}</label>
                      <Input
                        value={checklistResponses[item.item_key] || ''}
                        onChange={e => setChecklistResponses(prev => ({ ...prev, [item.item_key]: e.target.value }))}
                        className="border-slate-200 bg-white h-8 rounded-lg text-slate-900 text-xs"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Notas y Multimedia */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Notas / Adjuntos</span>
            <Textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Notas de recepción o daños visibles..."
              className="border-slate-200 bg-white resize-none text-xs min-h-[60px]"
            />
            <div className="flex gap-2 justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={handleVoiceNote}
                className={`flex-1 text-xs py-1 h-8 ${isRecording ? 'border-rose-500 text-rose-600 bg-rose-50' : ''}`}
              >
                <Mic className="h-3.5 w-3.5 mr-1" />
                Voz
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs py-1 h-8"
              >
                <Camera className="h-3.5 w-3.5 mr-1" />
                Foto
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white rounded-xl py-2.5 font-semibold text-sm"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
            {loading ? 'Creando...' : 'Crear Orden'}
          </Button>
        </div>
      </div>
    </div>
  );
}
