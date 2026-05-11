'use client';
import { useState } from 'react';
import type { ServiceOrderCreateRequestDto } from '@sdmx/contracts';

export default function EquipoForm({ initialData, onNext, onBack, onFotoChange }: { initialData: Partial<ServiceOrderCreateRequestDto>; onNext: (data: ServiceOrderCreateRequestDto)=>void; onBack: ()=>void; onFotoChange: (file: File|null)=>void }) {
  const [tipo, setTipo] = useState(initialData.device_type || initialData.deviceInfo?.type || '');
  const [modelo, setModelo] = useState(initialData.equipo_modelo || '');
  const [falla, setFalla] = useState(initialData.falla || '');
  const [fechaPromesa, setFechaPromesa] = useState(initialData.fecha_promesa || '');
  const [costo, setCosto] = useState((initialData.costo_estimado ?? initialData.estimatedCost ?? '') as any);
  const [checklist, setChecklist] = useState({ cargador: false, pantalla: false, prende: false, respaldo: false });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ equipo_tipo: tipo, equipo_modelo: modelo, falla, fecha_promesa: fechaPromesa, costo_estimado: costo, checklist });
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label>Tipo de dispositivo *</label><select value={tipo} onChange={(e) => setTipo(e.target.value)} required className="w-full input"><option value="">Selecciona</option><option>Smartphone</option><option>Tablet</option><option>Laptop</option><option>Computadora</option><option>Otro</option></select></div>
      <div><label>Marca y modelo *</label><input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} required className="w-full input" /></div>
      <div><label>Falla reportada *</label><textarea value={falla} onChange={(e) => setFalla(e.target.value)} required rows={3} className="w-full input" /></div>
      <div className="border p-4 rounded"><p className="font-semibold mb-2">Checklist de recepción:</p><div className="grid grid-cols-2 gap-2"><label><input type="checkbox" checked={checklist.cargador} onChange={e => setChecklist({...checklist, cargador: e.target.checked})} /> Cargador</label><label><input type="checkbox" checked={checklist.pantalla} onChange={e => setChecklist({...checklist, pantalla: e.target.checked})} /> Pantalla OK</label><label><input type="checkbox" checked={checklist.prende} onChange={e => setChecklist({...checklist, prende: e.target.checked})} /> Prende</label><label><input type="checkbox" checked={checklist.respaldo} onChange={e => setChecklist({...checklist, respaldo: e.target.checked})} /> Datos respaldados</label></div></div>
      <div><label>Foto de recepción</label><input type="file" accept="image/*" onChange={(e) => onFotoChange(e.target.files?.[0] || null)} className="w-full" /></div>
      <div className="grid grid-cols-2 gap-4"><div><label>Fecha promesa *</label><input type="date" value={fechaPromesa} onChange={(e) => setFechaPromesa(e.target.value)} required className="w-full input" /></div><div><label>Costo estimado $</label><input type="number" step="0.01" value={costo} onChange={(e) => setCosto(e.target.value)} className="w-full input" /></div></div>
      <div className="flex gap-3"><button type="button" onClick={onBack} className="btn-secondary flex-1">Atrás</button><button type="submit" className="btn-primary flex-1">Continuar</button></div>
    </form>
  );
}
