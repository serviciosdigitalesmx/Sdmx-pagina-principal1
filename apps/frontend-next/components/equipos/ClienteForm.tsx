'use client';
import { useState } from 'react';
export default function ClienteForm({ initialData, onNext, onLoadCotizacion, folioCotizacion, setFolioCotizacion }: any) {
  const [nombre, setNombre] = useState(initialData.cliente_nombre || '');
  const [telefono, setTelefono] = useState(initialData.cliente_telefono || '');
  const [email, setEmail] = useState(initialData.cliente_email || '');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ cliente_nombre: nombre, cliente_telefono: telefono, cliente_email: email });
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
