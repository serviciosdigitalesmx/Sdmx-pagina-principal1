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
import { ShieldAlert, AlertCircle, Calendar } from 'lucide-react';

function formatDate(value?: string | null) {
  if (!value) return "Sin fecha";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sin fecha";
  return new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

interface WarrantyClaimModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  orderFolio: string;
  warrantyUntil: string | null;
  onSuccess: () => void;
}

export function WarrantyClaimModal({ open, onOpenChange, orderId, orderFolio, warrantyUntil, onSuccess }: WarrantyClaimModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    claimReason: '',
    reportedIssue: '',
    requestedResolution: '',
    coverageScope: 'full',
  });

  const isExpired = !warrantyUntil || new Date(warrantyUntil) < new Date();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.claimReason.trim()) {
      alert('El motivo del reclamo es obligatorio');
      return;
    }

    setLoading(true);
    try {
      await apiGateway.createOrderWarrantyClaim(orderId, formData);
      alert('El reclamo de garantía ha sido registrado correctamente.');
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      alert(`Error al registrar garantía: ${err.message || 'Ocurrió un error inesperado.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl border border-slate-800 bg-slate-950 text-slate-100">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl text-slate-50">Solicitar Garantía</DialogTitle>
              <div className="text-sm text-slate-400 mt-1">
                Orden #{orderFolio}
              </div>
            </div>
          </div>
        </DialogHeader>

        {isExpired && (
          <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-100">Garantía expirada o no registrada</p>
              <p className="mt-1 opacity-90">La vigencia de garantía para esta orden ya concluyó o no se registró. Aún puedes crear el reclamo, pero requerirá autorización especial.</p>
            </div>
          </div>
        )}
        
        {!isExpired && warrantyUntil && (
          <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200 flex items-center gap-3">
            <Calendar className="h-5 w-5 text-emerald-400 shrink-0" />
            <div>
              <span className="opacity-90">Garantía vigente hasta: </span>
              <span className="font-semibold text-emerald-100">{formatDate(warrantyUntil)}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="claimReason" className="text-slate-300">Motivo del reclamo <span className="text-rose-500">*</span></Label>
            <Input
              id="claimReason"
              value={formData.claimReason}
              onChange={(e) => setFormData({ ...formData, claimReason: e.target.value })}
              className="border-slate-800 bg-slate-900 text-slate-100"
              placeholder="Ej. La pantalla instalada no responde al tacto"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reportedIssue" className="text-slate-300">Falla reportada por el cliente</Label>
            <Textarea
              id="reportedIssue"
              value={formData.reportedIssue}
              onChange={(e) => setFormData({ ...formData, reportedIssue: e.target.value })}
              className="border-slate-800 bg-slate-900 text-slate-100 min-h-[80px]"
              placeholder="Detalla qué está fallando según el cliente..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requestedResolution" className="text-slate-300">Resolución solicitada</Label>
            <Input
              id="requestedResolution"
              value={formData.requestedResolution}
              onChange={(e) => setFormData({ ...formData, requestedResolution: e.target.value })}
              className="border-slate-800 bg-slate-900 text-slate-100"
              placeholder="Ej. Reemplazo de pieza, revisión general..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverageScope" className="text-slate-300">Alcance de Cobertura</Label>
            <select
              id="coverageScope"
              value={formData.coverageScope}
              onChange={(e) => setFormData({ ...formData, coverageScope: e.target.value })}
              className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="full">Total (Pieza y Mano de obra)</option>
              <option value="labor">Solo Mano de Obra</option>
              <option value="parts">Solo Piezas/Refacciones</option>
              <option value="diagnosis">Revisión/Diagnóstico</option>
              <option value="other">Otro</option>
            </select>
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-slate-100"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.claimReason.trim()}
              className="bg-orange-500 text-white hover:bg-orange-600"
            >
              {loading ? 'Registrando...' : 'Registrar Reclamo'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
