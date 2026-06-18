'use client';

import { Calendar, User, Phone, Package, AlertCircle, MessageSquare, FileText, ArrowRightCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ServiceRequest } from '@/types';
import { Badge, SurfaceCard } from '@white-label/ui';

interface RequestCardProps {
  request: ServiceRequest;
  onQuote: () => void;
  onConvert: () => void;
}

export function RequestCard({ request, onQuote, onConvert }: RequestCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const urgencyLabels: Record<string, { label: string; color: string }> = {
    baja: { label: 'Baja', color: 'text-green-400' },
    media: { label: 'Media', color: 'text-yellow-400' },
    alta: { label: 'Alta', color: 'text-orange-400' },
    urgente: { label: 'Urgente', color: 'text-red-400' },
  };

  const urgency = urgencyLabels[request.urgency] || { label: request.urgency, color: 'text-slate-400' };

  return (
    <SurfaceCard elevated className="space-y-4 p-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-50">{request.folio}</h3>
            <span className="text-xs text-slate-400">{formatDate(request.created_at)}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs font-semibold ${urgency.color}`}>{urgency.label}</span>
            <Badge variant="primary">Pendiente</Badge>
          </div>
        </div>
      </div>

      {/* Customer info */}
      <div className="space-y-1 text-sm">
        <div className="flex items-center gap-2 text-slate-400">
          <User className="w-3 h-3" />
          <span>{request.customer_name}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Phone className="w-3 h-3" />
          <span>{request.customer_phone}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Package className="w-3 h-3" />
          <span>{request.device_type} {request.device_model}</span>
        </div>
      </div>

      {/* Issue preview */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-2 text-sm">
        <p className="mb-1 text-xs text-slate-400">Problema:</p>
        <p className="line-clamp-2">{request.issue_description}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <Button
          onClick={onQuote}
          className="flex-1 bg-sky-500 text-sm hover:bg-sky-600"
        >
          <FileText className="w-4 h-4 mr-1" />
          Cotizar
        </Button>
        <Button
          onClick={onConvert}
          variant="outline"
          className="flex-1 text-sm"
        >
          <ArrowRightCircle className="w-4 h-4 mr-1" />
          Convertir
        </Button>
      </div>
    </SurfaceCard>
  );
}
