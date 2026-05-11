'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';
import { uploadImage } from '@/lib/storage';
import ClienteForm from '@/components/equipos/ClienteForm';
import EquipoForm from '@/components/equipos/EquipoForm';
import Confirmacion from '@/components/equipos/Confirmacion';
import type { ServiceOrderCreateRequestDto } from '@sdmx/contracts';

type CotizacionData = {
  nombre: string;
  telefono: string;
  email: string;
  dispositivo: string;
  modelo: string;
  descripcion: string;
  urgencia: string;
};

type ReceptionFormData = Partial<ServiceOrderCreateRequestDto> & {
  nombre?: string;
  telefono?: string;
  email?: string;
  urgencia?: string;
  checklist?: {
    cargador: boolean;
    pantalla: boolean;
    prende: boolean;
    respaldo: boolean;
  };
};

type OrdenRecepcion = {
  folio: string;
  // client_id: string; // If this comes from the backend after creation
};

export default function RecepcionPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ReceptionFormData>({});
  const [folioCotizacion, setFolioCotizacion] = useState('');
  const [fotoRecepcion, setFotoRecepcion] = useState<File | null>(null);
  const router = useRouter();

  const cargarDesdeCotizacion = async () => {
    if (!folioCotizacion) return;
    const response = await apiClient.get<CotizacionData>(`/api/solicitudes/${folioCotizacion}`);
    if (response.success && response.data) {
      const data = response.data;
      setFormData({
        nombre: data.nombre,
        telefono: data.telefono,
        email: data.email,
        device_type: data.dispositivo,
        device_brand: data.dispositivo,
        device_model: data.modelo,
        problem_description: data.descripcion,
        urgencia: data.urgencia
      });
    }
  };

  const handleSubmit = async (finalData: ReceptionFormData) => {
    let fotoUrl = null;
    if (fotoRecepcion) fotoUrl = await uploadImage(fotoRecepcion, 'recepciones');

    // Map ReceptionFormData to ServiceOrderCreateRequestDto
    const serviceOrderPayload: ServiceOrderCreateRequestDto = {
      customer_id: finalData.customer_id,
      device_type: finalData.device_type,
      device_brand: finalData.device_brand,
      device_model: finalData.device_model,
      problem_description: finalData.problem_description,
      promised_date: finalData.promised_date,
      estimated_price: finalData.estimated_price,
    };

    const response = await apiClient.post<OrdenRecepcion>('/api/equipos', {
      ...serviceOrderPayload,
      foto_recepcion_url: fotoUrl,
      nombre: finalData.nombre,
      telefono: finalData.telefono,
      email: finalData.email,
      urgencia: finalData.urgencia,
      checklist: finalData.checklist,
    });
    if (response.success && response.data) {
      const orden = response.data;
      // Use finalData.telefono which is guaranteed to exist after ClienteForm
      const waLink = `https://wa.me/${finalData.telefono ?? ''}?text=¡Hola! Tu orden ${orden.folio} ha sido registrada. Estado: ${window.location.origin}/portal/${orden.folio}`;
      window.open(waLink, '_blank');
      router.push(`/dashboard?folio=${orden.folio}`);
    }
  };

  const confirmationData: ServiceOrderCreateRequestDto = {
    customer_id: formData.customer_id,
    device_type: formData.device_type,
    device_brand: formData.device_brand,
    device_model: formData.device_model,
    problem_description: formData.problem_description,
    promised_date: formData.promised_date,
    estimated_price: formData.estimated_price,
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step>=1?'bg-blue-600':'bg-gray-600'}`}>1</div>
          <div className="w-8 h-1 bg-gray-600"></div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step>=2?'bg-blue-600':'bg-gray-600'}`}>2</div>
          <div className="w-8 h-1 bg-gray-600"></div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step>=3?'bg-blue-600':'bg-gray-600'}`}>3</div>
        </div>
      </div>
      {step === 1 && <ClienteForm initialData={formData} onNext={(data: { nombre: string; telefono: string; email?: string })=>{setFormData({...formData,...data}); setStep(2);}} onLoadCotizacion={cargarDesdeCotizacion} folioCotizacion={folioCotizacion} setFolioCotizacion={setFolioCotizacion} />}
      {step === 2 && <EquipoForm initialData={formData} onNext={(data: Partial<ServiceOrderCreateRequestDto>)=>{setFormData({...formData,...data}); setStep(3);}} onBack={()=>setStep(1)} onFotoChange={setFotoRecepcion} />}
      {step === 3 && <Confirmacion data={confirmationData} onConfirm={() => handleSubmit(formData)} onBack={()=>setStep(2)} />}
    </div>
  );
}
