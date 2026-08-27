'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { apiGateway } from '@/services/apiGateway';
import { getActiveScope } from '@/lib/scope';
import type { Product } from '@/types';

interface TransferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onTransferSuccess: () => void;
}

export function TransferModal({ open, onOpenChange, product, onTransferSuccess }: TransferModalProps) {
  const scope = getActiveScope();
  const [loading, setLoading] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState(() => crypto.randomUUID());
  const [sucursales, setSucursales] = useState<Array<{ id: string; name: string }>>([]);
  const [formData, setFormData] = useState({
    sucursalDestino: '',
    cantidad: 1,
    motivo: '',
    notas: '',
  });
  const origen = (product as Product & { sucursal_id?: string | null }).sucursal_id || scope?.sucursalId;

  const loadSucursales = async () => {
    try {
      const data = await apiGateway.getSucursales();
      setSucursales(data.reduce<Array<{ id: string; name: string }>>((branches, branch) => {
        if (typeof branch.id === 'string' && typeof branch.name === 'string') {
          branches.push({ id: branch.id, name: branch.name });
        }
        return branches;
      }, []));
    } catch (error) {
      console.error('Error al cargar sucursales:', error);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setIdempotencyKey(crypto.randomUUID());
      setFormData({
        sucursalDestino: '',
        cantidad: 1,
        motivo: '',
        notas: '',
      });
      void loadSucursales();
    }
    onOpenChange(nextOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    if (!formData.sucursalDestino) {
      alert('Debe seleccionar una sucursal destino');
      return;
    }

    if (formData.cantidad <= 0 || formData.cantidad > (product.stock_current ?? 0)) {
      alert('Cantidad inválida o superior al stock disponible');
      return;
    }

    if (!origen) {
      alert('No se pudo determinar la sucursal de origen');
      return;
    }

    if (origen === formData.sucursalDestino) {
      alert('La sucursal destino no puede ser la misma que el origen');
      return;
    }

    setLoading(true);
    try {
      await apiGateway.transferInventory({
        sku: product.sku,
        sucursalOrigen: origen,
        sucursalDestino: formData.sucursalDestino,
        cantidad: Number(formData.cantidad),
        motivo: formData.motivo,
        notas: formData.notas,
        idempotencyKey,
      });
      onTransferSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to transfer inventory:', error);
      alert(error instanceof Error ? error.message : 'Error al transferir el inventario');
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md border border-slate-800 bg-slate-950/95 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-slate-50">Transferir Inventario</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-lg bg-slate-900/50 p-3 text-sm">
            <div className="font-semibold text-slate-200">{product.name}</div>
            <div className="mt-1 flex items-center justify-between text-slate-400">
              <span>SKU: {product.sku}</span>
              <span>Stock actual: <strong className="text-sky-300">{product.stock_current}</strong></span>
            </div>
          </div>

          <div>
            <Label>Sucursal Destino *</Label>
            <select
              value={formData.sucursalDestino}
              onChange={(e) => setFormData({ ...formData, sucursalDestino: e.target.value })}
              className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
              required
            >
              <option value="">Seleccione una sucursal</option>
              {sucursales.filter(s => s.id !== origen).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Cantidad a transferir *</Label>
            <Input
              type="number"
              min="1"
              max={product.stock_current ?? 0}
              step="1"
              value={formData.cantidad}
              onChange={(e) => setFormData({ ...formData, cantidad: Number(e.target.value) || 1 })}
              required
            />
          </div>

          <div>
            <Label>Motivo</Label>
            <Input
              placeholder="Ej: Reabastecimiento urgente"
              value={formData.motivo}
              onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
            />
          </div>

          <div>
            <Label>Notas Adicionales</Label>
            <Textarea
              value={formData.notas}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Transfiriendo...' : 'Confirmar Transferencia'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
