import { useState } from 'react';

interface ClienteFormProps {
  initialData: { nombre?: string; telefono?: string; email?: string; };
  onNext: (data: { nombre: string; telefono: string; email?: string }) => void;
  onLoadCotizacion: () => void;
  folioCotizacion: string;
  setFolioCotizacion: (folio: string) => void;
}

export default function ClienteForm({ initialData, onNext, onLoadCotizacion, folioCotizacion, setFolioCotizacion }: ClienteFormProps) {
  const [nombre, setNombre] = useState(initialData.nombre || '');
  const [telefono, setTelefono] = useState(initialData.telefono || '');
  const [email, setEmail] = useState(initialData.email || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ nombre, telefono, email });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-800 p-4 rounded mb-4">
        <label className="block text-sm text-gray-400">Cargar por folio de cotización</label>
        <div className="flex gap-2">
          <input type="text" value={folioCotizacion} onChange={(e) => setFolioCotizacion(e.target.value)} className="flex-1 input" placeholder="COT-00001" />
          <button type="button" onClick={onLoadCotizacion} className="btn-secondary">Cargar</button>
        </div>
      </div>
      <div><label>Nombre completo *</label><input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="w-full input" /></div>
      <div><label>WhatsApp *</label><input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} required maxLength={10} className="w-full input" /></div>
      <div><label>Email (opcional)</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full input" /></div>
      <button type="submit" className="btn-primary w-full">Continuar</button>
    </form>
  );
}
