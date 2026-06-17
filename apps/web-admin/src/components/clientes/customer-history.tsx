'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Calendar, Package, DollarSign, FileText } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { getApiOptions } from '@/lib/tenant';
import type { Customer, CustomerHistory } from '@/types';

interface CustomerHistoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
}

export function CustomerHistory({ open, onOpenChange, customer }: CustomerHistoryProps) {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<CustomerHistory | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customer && open) {
      loadHistory();
    }
  }, [customer, open]);

  const loadHistory = async () => {
    if (!customer) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ success: boolean; data: CustomerHistory }>(`/customers/${customer.id}/history`, getApiOptions());
      setHistory(response.data);
    } catch (error) {
      console.error('Failed to load customer history:', error);
      setHistory(null);
      setError(error instanceof Error ? error.message : 'No se pudo cargar el historial del cliente');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto border border-slate-800 bg-slate-950/95 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-slate-50">
          Historial - {customer.full_name || customer.name}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-sky-300" />
          </div>
        ) : (
          <div className="space-y-6">
            {error ? (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-100">
                <p className="font-semibold">No se pudo cargar el historial</p>
                <p className="mt-1 text-rose-100/80">{error}</p>
                <button
                  type="button"
                  onClick={() => loadHistory()}
                  className="mt-3 rounded-2xl border border-rose-500/20 bg-slate-950/70 px-4 py-2 font-semibold text-rose-100"
                >
                  Reintentar
                </button>
              </div>
            ) : null}

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3 text-center">
                <div className="text-2xl font-bold text-slate-50">{history?.totalEquipos || 0}</div>
                <div className="text-xs text-slate-400">Equipos</div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3 text-center">
                <div className="text-2xl font-bold text-green-500">{history?.totalReparaciones || 0}</div>
                <div className="text-xs text-slate-400">Reparaciones</div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3 text-center">
                <div className="text-2xl font-bold text-yellow-500">{history?.totalCotizaciones || 0}</div>
                <div className="text-xs text-slate-400">Cotizaciones</div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3 text-center">
                <div className="text-2xl font-bold text-sky-300">${(history?.ticketPromedio || 0).toFixed(2)}</div>
                <div className="text-xs text-slate-400">Ticket promedio</div>
              </div>
            </div>

            {/* Equipos table */}
            {history?.equipos && history.equipos.length > 0 && (
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-sky-300">
                  <Package className="w-4 h-4" />
                  Equipos y reparaciones
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-slate-800 text-slate-400">
                      <tr>
                        <th className="text-left py-2">Folio</th>
                        <th className="text-left py-2">Equipo</th>
                        <th className="text-left py-2">Estado</th>
                        <th className="text-left py-2">Fecha</th>
                        <th className="text-right py-2">Costo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.equipos.map((equipo) => (
                        <tr key={equipo.FOLIO} className="border-b border-slate-800/80">
                          <td className="py-2 font-mono text-sky-300">{equipo.FOLIO}</td>
                          <td className="py-2">{equipo.TIPO} {equipo.MODELO}</td>
                          <td className="py-2">{equipo.ESTADO}</td>
                          <td className="py-2">{formatDate(equipo.FECHA_INGRESO)}</td>
                          <td className="py-2 text-right">${equipo.COSTO_ESTIMADO.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Cotizaciones table */}
            {history?.cotizaciones && history.cotizaciones.length > 0 && (
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-sky-300">
                  <FileText className="w-4 h-4" />
                  Cotizaciones
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-slate-800 text-slate-400">
                      <tr>
                        <th className="text-left py-2">Folio</th>
                        <th className="text-left py-2">Dispositivo</th>
                        <th className="text-left py-2">Estado</th>
                        <th className="text-right py-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.cotizaciones.map((cot) => (
                        <tr key={cot.folio} className="border-b border-slate-800/80">
                          <td className="py-2 font-mono text-sky-300">{cot.folio}</td>
                          <td className="py-2">{cot.dispositivo} {cot.modelo}</td>
                          <td className="py-2">{cot.estado}</td>
                          <td className="py-2 text-right">${cot.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {(!history?.equipos?.length && !history?.cotizaciones?.length) && (
              <div className="py-8 text-center text-slate-400">
                Sin historial de equipos o cotizaciones
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
