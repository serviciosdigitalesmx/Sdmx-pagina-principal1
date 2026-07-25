'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Wallet, LogOut, ArrowRight, Loader2, DollarSign } from 'lucide-react';
import { apiGateway } from '@/services/apiGateway';
import { toast } from 'sonner';

interface ShiftModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'open' | 'close';
  activeShift?: any;
  onSuccess: () => void;
}

export function ShiftModal({ open, onOpenChange, mode, activeShift, onSuccess }: ShiftModalProps) {
  const [loading, setLoading] = useState(false);
  const [registers, setRegisters] = useState<any[]>([]);
  const [selectedRegister, setSelectedRegister] = useState('');
  const [cashAmount, setCashAmount] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (open && mode === 'open') {
      apiGateway.getCashRegisters()
        .then((res) => {
          setRegisters(res);
          if (res.length > 0) setSelectedRegister(res[0].id);
        })
        .catch(() => toast.error('Error al cargar cajas registradoras'));
    }
  }, [open, mode]);

  const handleOpenShift = async () => {
    if (!selectedRegister) {
      toast.error('Por favor selecciona una caja.');
      return;
    }
    setLoading(true);
    try {
      await apiGateway.openCashShift(selectedRegister, Number(cashAmount) || 0);
      toast.success('¡Caja abierta con éxito!');
      onOpenChange(false);
      onSuccess();
    } catch (e: any) {
      toast.error(e.message || 'Error al abrir caja');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseShift = async () => {
    setLoading(true);
    try {
      const closed = await apiGateway.closeCashShift(Number(cashAmount) || 0, notes);
      toast.success('¡Turno de caja cerrado exitosamente!');
      onOpenChange(false);
      onSuccess();
    } catch (e: any) {
      toast.error(e.message || 'Error al cerrar caja');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-w-md p-6 rounded-xl border border-slate-200 shadow-lg">
        {mode === 'open' ? (
          <>
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-emerald-50 p-3 mb-4">
                <Wallet className="h-6 w-6 text-emerald-600" />
              </div>
              <DialogTitle className="text-xl font-bold text-slate-900">Apertura de Caja</DialogTitle>
              <DialogDescription className="text-slate-500 mt-1">
                Selecciona la caja e introduce el fondo de caja inicial.
              </DialogDescription>
            </div>

            <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Caja Registradora</label>
                <select
                  value={selectedRegister}
                  onChange={(e) => setSelectedRegister(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {registers.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Fondo Inicial (Efectivo)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <Input
                    type="number"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    placeholder="0.00"
                    className="pl-7 h-10 border-slate-200 bg-white rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <Button
                onClick={handleOpenShift}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-2.5 mt-4"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ArrowRight className="h-4 w-4 mr-2" />}
                Abrir Turno de Caja
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-rose-50 p-3 mb-4">
                <LogOut className="h-6 w-6 text-rose-600" />
              </div>
              <DialogTitle className="text-xl font-bold text-slate-900">Arqueo y Cierre de Caja</DialogTitle>
              <DialogDescription className="text-slate-500 mt-1">
                Cuenta el efectivo físico en caja e ingrésalo para realizar el cuadre.
              </DialogDescription>
            </div>

            <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Efectivo Físico en Caja</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <Input
                    type="number"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    placeholder="0.00"
                    className="pl-7 h-10 border-slate-200 bg-white rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Notas / Novedades del turno</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej. El turno se entregó sin novedades, faltan monedas..."
                  className="border-slate-200 bg-white rounded-lg resize-none min-h-[80px]"
                />
              </div>

              <Button
                onClick={handleCloseShift}
                disabled={loading}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-lg py-2.5 mt-4"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <LogOut className="h-4 w-4 mr-2" />}
                Confirmar Arqueo y Cerrar
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
