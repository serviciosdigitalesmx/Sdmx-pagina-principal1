'use client';

import { Eye, Calendar, Package, DollarSign, PhoneCall, MessageCircleMore } from 'lucide-react';
import type { Order } from '@/types';
import { Badge, SurfaceCard } from '@white-label/ui';

interface OrderCardProps {
  order: Order;
  onClick: () => void;
}

export function OrderCard({ order, onClick }: OrderCardProps) {
  const { color, diasRestantes, status } = order;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Sin fecha';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
  };

  const customerName = order.customers?.name || order.device_info?.customer_name || 'Cliente sin nombre';
  const deviceName = `${order.device_info?.type || ''} ${order.device_info?.model || ''}`.trim() || 'Equipo sin especificar';
  const hasPromiseDate = !!order.promised_date;
  const daysLeft = diasRestantes !== undefined && diasRestantes !== null ? diasRestantes : null;
  const customerPhone = order.customers?.phone || order.device_info?.customer_phone || null;

  const openWhatsApp = () => {
    if (!customerPhone) return;
    const normalized = customerPhone.replace(/\D/g, '');
    if (!normalized) return;
    const message = encodeURIComponent(`Hola, te compartimos el estatus de tu equipo ${order.folio}.`);
    window.open(`https://wa.me/${normalized}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  const callCustomer = () => {
    if (!customerPhone) return;
    window.open(`tel:${customerPhone}`, '_self');
  };

  return (
    <SurfaceCard
      elevated
      className={`cursor-pointer p-5 transition-transform duration-200 hover:scale-[1.01] ${color === 'rojo' ? 'border-rose-400/20' : color === 'amarillo' ? 'border-amber-400/20' : color === 'verde' ? 'border-emerald-400/20' : ''}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold tracking-wide text-sky-300">{order.folio}</span>
            <Badge variant={status === 'entregado' ? 'neutral' : status === 'cancelado' ? 'danger' : status === 'listo' ? 'success' : status === 'diagnostico' ? 'warning' : 'primary'}>
              {status}
            </Badge>
          </div>
          <h3 className="text-lg font-semibold mt-2 truncate">{customerName}</h3>
          <p className="text-sm text-slate-400 truncate">{deviceName}</p>
        </div>
        {hasPromiseDate && daysLeft !== null && (
          <div className="text-right">
            <div className="text-xs uppercase tracking-wider text-slate-400">Promesa</div>
            <div className={`text-sm font-bold ${daysLeft <= 2 ? 'text-rose-400' : daysLeft <= 4 ? 'text-yellow-500' : 'text-slate-400'}`}>
              {daysLeft} día{daysLeft !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-slate-400">
          <Package className="w-4 h-4" />
          <span className="truncate">{order.problem_description?.slice(0, 60) || 'Sin descripción'}</span>
        </div>
        {order.estimated_cost > 0 && (
          <div className="flex items-center gap-2 text-slate-400">
            <DollarSign className="w-4 h-4 text-sky-400" />
            <span>Estimado: ${order.estimated_cost.toFixed(2)}</span>
          </div>
        )}
        {customerPhone && (
          <div className="flex items-center gap-2 text-slate-400">
            <PhoneCall className="w-4 h-4" />
            <span className="truncate">{customerPhone}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 border-t border-slate-800 pt-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            <span>Recibido: {formatDate(order.created_at)}</span>
          </div>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onClick();
            }}
            className="inline-flex items-center gap-1 text-sky-300 transition hover:text-sky-200"
          >
            <Eye className="w-3 h-3" />
            <span>Ver detalle</span>
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onClick();
            }}
            className="rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-100 transition hover:bg-sky-500/15"
          >
            Detalle
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              callCustomer();
            }}
            disabled={!customerPhone}
            className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Llamar
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              openWhatsApp();
            }}
            disabled={!customerPhone}
            className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <MessageCircleMore className="mr-1 h-3 w-3" />
            WhatsApp
          </button>
        </div>
      </div>
    </SurfaceCard>
  );
}
