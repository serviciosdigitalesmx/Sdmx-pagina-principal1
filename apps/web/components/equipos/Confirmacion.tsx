'use client';
import type { ServiceOrderCreateRequestDto } from '@sdmx/contracts';

export default function Confirmacion({ data, onConfirm, onBack }: { data: ServiceOrderCreateRequestDto; onConfirm: (d: ServiceOrderCreateRequestDto)=>void; onBack: ()=>void }) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-800 p-4 rounded space-y-2">
        <p><strong>ID Cliente:</strong> {data.customer_id ?? 'Pendiente'}</p>
        <p><strong>Tipo:</strong> {data.device_type ?? 'Pendiente'}</p>
        <p><strong>Descripción del Equipo:</strong> {data.device_brand} - {data.device_model}</p>
        <p><strong>Falla:</strong> {data.problem_description ?? 'Pendiente'}</p>
        <p><strong>Fecha promesa:</strong> {data.promised_date ?? 'Pendiente'}</p>
        <p><strong>Costo:</strong> ${data.estimated_price ?? 'Por definir'}</p>
      </div>
      <div className="flex gap-3">
        <button onClick={onBack} className="btn-secondary flex-1">Corregir</button>
        <button onClick={() => onConfirm(data)} className="btn-primary flex-1">Guardar Orden</button>
      </div>
    </div>
  );
}
