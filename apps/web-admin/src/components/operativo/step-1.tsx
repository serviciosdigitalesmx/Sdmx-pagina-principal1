'use client';

import { useEffect, useState } from 'react';
import { User, Phone, Mail, Search, RefreshCw } from 'lucide-react';
import { SurfaceCard } from '@white-label/ui';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getCustomerLabel } from '@/lib/labels';
import type { OrderFormData } from '@/app/dashboard/operativo/page';

interface Step1Props {
  data: OrderFormData;
  onSubmit: (data: Partial<OrderFormData>) => void;
  onLoadQuote: (folio: string) => void;
}

export function Step1({ data, onSubmit, onLoadQuote }: Step1Props) {
  const customerLabel = getCustomerLabel();
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [folioCotizacion, setFolioCotizacion] = useState(data.folioCotizacion);
  const [localData, setLocalData] = useState<OrderFormData>(data);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setLocalData(data);
    setFolioCotizacion(data.folioCotizacion);
  }, [data]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!localData.clienteNombre.trim()) newErrors.clienteNombre = 'El nombre es requerido';
    if (!localData.clienteTelefono.trim()) newErrors.clienteTelefono = 'El teléfono es requerido';
    else if (!/^\d{10}$/.test(localData.clienteTelefono.replace(/\D/g, ''))) {
      newErrors.clienteTelefono = 'Teléfono debe tener 10 dígitos';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(localData);
    }
  };

  const handleLoadQuote = () => {
    if (!folioCotizacion.trim()) return;
    setLoadingQuote(true);
    onLoadQuote(folioCotizacion);
    setTimeout(() => setLoadingQuote(false), 500);
  };

  return (
    <SurfaceCard elevated className="space-y-6 p-6">
      <form onSubmit={handleSubmit}>
      {/* Quote loader */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <Label className="flex items-center gap-1 text-sm text-slate-400">
          <Search className="w-4 h-4" />
          Cargar por folio de cotización
        </Label>
        <p className="mb-3 mt-1 text-xs text-slate-400">
          Puedes ingresar el folio en mayúsculas o minúsculas. Ej: COT-00001
        </p>
        <div className="flex gap-2">
          <Input
            value={folioCotizacion}
            onChange={(e) => {
              // Permitir pegar o teclear, forzando mayúsculas y formato base
              let val = e.target.value.toUpperCase().replace(/\s/g, '');
              if (val && !val.includes('-') && val.length > 3) {
                // Autocompletar el guión si lo olvidan
                val = val.substring(0, 3) + '-' + val.substring(3);
              }
              setFolioCotizacion(val);
            }}
            placeholder="COT-00001"
            className="flex-1 font-mono uppercase"
          />
          <Button
            type="button"
            onClick={handleLoadQuote}
            disabled={loadingQuote}
            variant="outline"
          >
            {loadingQuote ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Cargar
          </Button>
        </div>
        {data.folioCotizacion && (
          <p className="mt-2 text-xs text-emerald-400">
            Solicitud {data.folioCotizacion} cargada
          </p>
        )}
      </div>

      {/* Customer form */}
      <div className="space-y-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-50">
          <User className="w-5 h-5" />
          Datos del {customerLabel}
        </h3>

        <div>
          <Label>Nombre completo del {customerLabel.toLowerCase()} <span className="text-rose-400">*</span></Label>
          <Input
            value={localData.clienteNombre}
            onChange={(e) => setLocalData((current) => ({ ...current, clienteNombre: e.target.value }))}
            placeholder="Ej: Juan Pérez"
            className={errors.clienteNombre ? 'border-red-500' : ''}
          />
          {errors.clienteNombre && <p className="mt-1 text-xs text-rose-400">{errors.clienteNombre}</p>}
        </div>

        <div>
          <Label>WhatsApp <span className="text-rose-400">*</span> <span className="text-xs text-slate-400">(Se ajustará a 10 dígitos)</span></Label>
          <Input
            value={localData.clienteTelefono}
            onChange={(e) => {
              let val = e.target.value.replace(/\D/g, '');
              // Limpiar prefijo +52 si el usuario lo pega
              if (val.startsWith('52') && val.length > 10) {
                val = val.substring(2);
              }
              if (val.startsWith('1') && val.length > 10) {
                val = val.substring(1);
              }
              val = val.slice(0, 10);
              
              setLocalData((current) => ({
                ...current,
                clienteTelefono: val,
              }));
            }}
            placeholder="5512345678"
            maxLength={15}
            className={`font-mono ${errors.clienteTelefono ? 'border-red-500' : ''}`}
          />
          {errors.clienteTelefono && <p className="mt-1 text-xs text-rose-400">{errors.clienteTelefono}</p>}
        </div>

        <div>
          <Label>Email <span className="text-slate-400">(opcional)</span></Label>
          <Input
            value={localData.clienteEmail}
            onChange={(e) => setLocalData((current) => ({ ...current, clienteEmail: e.target.value }))}
            placeholder="cliente@email.com"
            type="email"
          />
        </div>
      </div>

      <Button type="submit" className="w-full py-3">
        Continuar
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
      </form>
    </SurfaceCard>
  );
}

import { ArrowRight } from 'lucide-react';
