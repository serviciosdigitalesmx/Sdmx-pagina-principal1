'use client';
import type { ServiceOrderCreateRequestDto } from '@sdmx/contracts';

export default function Confirmacion({ data, onConfirm, onBack }: { data: ServiceOrderCreateRequestDto; onConfirm: (d: ServiceOrderCreateRequestDto)=>void; onBack: ()=>void }) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-800 p-4 rounded space-y-2"><p><strong>Cliente:</strong> {data.cliente_nombre}</p><p><strong>Teléfono:</strong> {data.cliente_telefono}</p><p><strong>Equipo:</strong> {data.equipo_tipo} - {data.equipo_modelo}</p><p><strong>Falla:</strong> {data.falla}</p><p><strong>Fecha promesa:</strong> {data.fecha_promesa}</p><p><strong>Costo estimado:</strong> ${data.costo_estimado || 'Por definir'}</p></div>
      <div className="flex gap-3"><button onClick={onBack} className="btn-secondary flex-1">Corregir</button><button onClick={() => onConfirm(data)} className="btn-primary flex-1">Guardar Orden</button></div>
    </div>
  );
}
