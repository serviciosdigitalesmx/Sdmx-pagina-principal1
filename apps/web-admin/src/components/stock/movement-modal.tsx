'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ArrowDownLeft, ArrowUpRight, CircleSlash, Package, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import { getApiOptions } from '@/lib/tenant';
import type { InventoryMovement, Product } from '@/types';

interface MovementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onMovementSaved: () => void;
}

export function MovementModal({ open, onOpenChange, product, onMovementSaved }: MovementModalProps) {
  const [loading, setLoading] = useState(false);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [error, setError] = useState<string | null>(null);

  const totalIn = useMemo(
    () => movements.filter((movement) => Number(movement.quantity ?? 0) > 0).reduce((sum, movement) => sum + Number(movement.quantity ?? 0), 0),
    [movements]
  );

  const totalOut = useMemo(
    () => movements.filter((movement) => Number(movement.quantity ?? 0) < 0).reduce((sum, movement) => sum + Math.abs(Number(movement.quantity ?? 0)), 0),
    [movements]
  );

  useEffect(() => {
    const loadMovements = async () => {
      if (!open || !product) return;

      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get<{ data: InventoryMovement[] }>(`/inventory/${product.id}/movements`, getApiOptions());
        setMovements(Array.isArray(response.data) ? response.data : []);
      } catch (loadError) {
        console.error('Failed to load inventory movements:', loadError);
        setError('No se pudo cargar el historial real del producto.');
        setMovements([]);
      } finally {
        setLoading(false);
      }
    };

    loadMovements();
  }, [open, product]);

  if (!product) return null;

  const movementMeta = (movement: InventoryMovement) => {
    const quantity = Number(movement.quantity ?? 0);
    if (quantity > 0) {
      return { label: 'Entrada', icon: ArrowDownLeft, tone: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' };
    }
    if (quantity < 0) {
      return { label: 'Salida', icon: ArrowUpRight, tone: 'border-rose-500/30 bg-rose-500/10 text-rose-400' };
    }
    return { label: 'Ajuste', icon: CircleSlash, tone: 'border-amber-500/30 bg-amber-500/10 text-amber-400' };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border border-slate-800 bg-slate-950/95 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-slate-50">
            Kardex real - {product.sku}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Stock actual</div>
            <div className="mt-2 text-2xl font-semibold text-slate-50">{Number(product.stock_current ?? 0)}</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Entradas</div>
            <div className="mt-2 text-2xl font-semibold text-emerald-400">{totalIn}</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Salidas</div>
            <div className="mt-2 text-2xl font-semibold text-rose-400">{totalOut}</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-50">Historial de movimientos</div>
              <div className="text-xs text-slate-400">
                {product.name} · {product.location || 'Sin ubicación'} · mínimo {Number(product.minimum_stock ?? 0)}
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="gap-2 self-start"
              onClick={async () => {
                setLoading(true);
                setError(null);
                try {
                  const response = await apiClient.get<{ data: InventoryMovement[] }>(`/inventory/${product.id}/movements`, getApiOptions());
                  setMovements(Array.isArray(response.data) ? response.data : []);
                  onMovementSaved();
                } catch (reloadError) {
                  console.error('Failed to reload inventory movements:', reloadError);
                  setError('No se pudo recargar el historial real del producto.');
                } finally {
                  setLoading(false);
                }
              }}
            >
              <RefreshCw className="h-4 w-4" />
              Actualizar
            </Button>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-300">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="mt-4 max-h-[420px] space-y-3 overflow-auto pr-1">
            {loading && (
              <div className="flex items-center justify-center py-10 text-sm text-slate-400">
                Cargando kardex real...
              </div>
            )}

            {!loading && movements.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-800 px-4 py-10 text-center">
                <Package className="mx-auto h-8 w-8 text-slate-400" />
                <div className="mt-3 text-sm font-medium text-slate-50">Sin movimientos reales</div>
                <div className="mt-1 text-xs text-slate-400">
                  El backend no devolvió movimientos para este producto.
                </div>
              </div>
            )}

            {movements.map((movement) => {
              const meta = movementMeta(movement);
              const Icon = meta.icon;

              return (
                <div key={movement.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full border ${meta.tone}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-sky-300">{meta.label}</span>
                          <span className="rounded-full border border-slate-800 px-2 py-0.5 text-xs text-slate-400">
                            {movement.movement_type}
                          </span>
                          {movement.service_order_id && (
                            <span className="rounded-full border border-slate-800 px-2 py-0.5 text-xs text-slate-400">
                              Orden {movement.service_order_id}
                            </span>
                          )}
                          {movement.purchase_order_id && (
                            <span className="rounded-full border border-slate-800 px-2 py-0.5 text-xs text-slate-400">
                              Compra {movement.purchase_order_id}
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-sm text-slate-400">{movement.reference || 'Sin referencia'}</div>
                        {movement.notes && <div className="mt-1 text-sm text-slate-400">{movement.notes}</div>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-slate-50">
                        {Number(movement.quantity ?? 0) > 0 ? '+' : ''}
                        {Number(movement.quantity ?? 0)}
                      </div>
                      <div className="text-xs text-slate-400">
                        {movement.created_at ? new Date(movement.created_at).toLocaleString() : 'Sin fecha'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
