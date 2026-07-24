'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { apiGateway } from '@/services/apiGateway';
import { History, Smartphone, Calendar, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import type { DeviceHistoryItem } from '@/types';
import { Badge } from '@white-label/ui';

function formatDate(value?: string | null) {
  if (!value) return "Sin fecha";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sin fecha";
  return new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

interface DeviceHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serialNumber: string | null;
  currentOrderId?: string;
}

export function DeviceHistoryModal({ open, onOpenChange, serialNumber, currentOrderId }: DeviceHistoryModalProps) {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<DeviceHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && serialNumber) {
      loadHistory();
    } else {
      setHistory([]);
      setError(null);
    }
  }, [open, serialNumber]);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGateway.getDeviceHistoryBySerial(serialNumber!);
      setHistory(data as unknown as DeviceHistoryItem[]);
    } catch (err) {
      console.error('Error loading device history:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar el historial del dispositivo');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'entregado' || s === 'delivered') return <Badge variant="success">Entregado</Badge>;
    if (s === 'cancelado' || s === 'cancelled') return <Badge variant="danger">Cancelado</Badge>;
    if (s === 'listo' || s === 'ready') return <Badge variant="success">Listo</Badge>;
    if (s === 'reparacion' || s === 'repairing') return <Badge variant="warning">En reparación</Badge>;
    return <Badge variant="neutral">{status}</Badge>;
  };

  if (!serialNumber) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border border-slate-800 bg-slate-950 text-slate-100 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
              <History className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl text-slate-50">Historial Clínico del Dispositivo</DialogTitle>
              <div className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Serie / IMEI: <span className="text-slate-200 font-mono">{serialNumber}</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-500/25 border-t-sky-400" />
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-6 text-center text-sm text-rose-100">
              <AlertTriangle className="h-8 w-8 mx-auto mb-3 text-rose-400" />
              <p className="font-semibold">No se pudo cargar el historial</p>
              <p className="mt-2 text-rose-100/80">{error}</p>
              <Button
                variant="outline"
                className="mt-4 border-rose-500/20 bg-slate-950/70 text-rose-100 hover:bg-rose-500/20 hover:text-rose-50"
                onClick={loadHistory}
              >
                Reintentar
              </Button>
            </div>
          ) : history.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">
              <History className="h-12 w-12 mx-auto mb-4 text-slate-500" />
              <p className="text-lg font-medium text-slate-300">Sin historial previo</p>
              <p className="mt-2 text-sm text-slate-400">Este dispositivo no tiene reparaciones anteriores registradas en esta cuenta.</p>
            </div>
          ) : (
            <div className="relative border-l border-slate-800 ml-4 pl-6 space-y-8 pb-4">
              {history.map((order, index) => (
                <div key={order.id} className="relative">
                  <div className={`absolute -left-[33px] flex h-6 w-6 items-center justify-center rounded-full border-4 border-slate-950 ${order.id === currentOrderId ? 'bg-sky-500 text-sky-50' : 'bg-slate-800 text-slate-400'}`}>
                    {order.status.toLowerCase() === 'entregado' || order.status.toLowerCase() === 'delivered' ? (
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-current" />
                    )}
                  </div>
                  
                  <div className={`rounded-xl border p-4 ${order.id === currentOrderId ? 'border-sky-500/50 bg-sky-500/5' : 'border-slate-800 bg-slate-900/50'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-semibold text-sky-300">#{order.folio}</span>
                          {getStatusBadge(order.status)}
                          {order.id === currentOrderId && <Badge variant="neutral" className="bg-sky-500/20 text-sky-300 border-sky-500/30">Orden Actual</Badge>}
                        </div>
                        <h4 className="mt-2 font-medium text-slate-200">
                          {order.device_type} {order.device_brand} {order.device_model}
                        </h4>
                        
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-500 block text-xs uppercase tracking-wider mb-1">Problema Reportado</span>
                            <span className="text-slate-300">{order.reported_issue || 'No especificado'}</span>
                          </div>
                          {order.internal_diagnosis && (
                            <div>
                              <span className="text-slate-500 block text-xs uppercase tracking-wider mb-1">Diagnóstico</span>
                              <span className="text-slate-300">{order.internal_diagnosis}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2 text-right">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Calendar className="h-4 w-4" />
                          {formatDate(order.created_at)}
                        </div>
                        {order.final_cost !== null && order.final_cost > 0 && (
                          <div className="mt-2">
                            <span className="text-slate-500 text-xs uppercase tracking-wider block">Costo Final</span>
                            <span className="font-semibold text-emerald-400">${Number(order.final_cost).toFixed(2)}</span>
                          </div>
                        )}
                        <Button variant="ghost" className="text-sky-400 px-0 h-auto gap-1 mt-2 text-xs" onClick={() => window.open(`/dashboard/ordenes/${order.id}`, '_blank')}>
                          Ver orden completa <ArrowRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
