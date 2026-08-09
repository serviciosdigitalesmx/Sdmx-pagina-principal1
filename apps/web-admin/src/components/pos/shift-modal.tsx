'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Wallet, LogOut, ArrowRight, Loader2, DollarSign, X } from 'lucide-react';
import { apiGateway } from '@/services/apiGateway';
import { toast } from 'sonner';
import { useEscClose } from '@/hooks/useEscClose';

interface ShiftModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'open' | 'close';
  activeShift?: any;
  onSuccess: () => void;
}

export function ShiftModal({ open, onOpenChange, mode, activeShift, onSuccess }: ShiftModalProps) {
  useEscClose(() => {
    if (open) onOpenChange(false);
  });
  const [loading, setLoading] = useState(false);
  const [registers, setRegisters] = useState<any[]>([]);
  const [selectedRegister, setSelectedRegister] = useState('');
  const [cashAmount, setCashAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [registerName, setRegisterName] = useState('Caja principal');

  useEffect(() => {
    if (open && mode === 'open') {
      apiGateway.getCashRegisters()
        .then((res) => {
          setRegisters(res);
          if (res.length > 0) setSelectedRegister(String(res[0].id ?? ''));
        })
        .catch(() => toast.error('Error al cargar cajas registradoras'));
    }
  }, [open, mode]);

  const handleOpenShift = async () => {
    let targetRegisterId = selectedRegister;
    setLoading(true);
    try {
      if (!targetRegisterId) {
        const scope = (await import('@/lib/scope')).getActiveScope();
        if (!scope?.sucursalId) {
          toast.error('Selecciona una sucursal activa antes de abrir caja.');
          setLoading(false);
          return;
        }
        const created = await apiGateway.createCashRegister({
          name: registerName.trim() || 'Caja principal',
          sucursalId: scope.sucursalId,
        });
        targetRegisterId = String(created.id ?? '');
        setSelectedRegister(targetRegisterId);
      }

      await apiGateway.openCashShift(targetRegisterId, Number(cashAmount) || 0);
      toast.success('¡Caja abierta con éxito!');
      onOpenChange(false);
      onSuccess();
    } catch (e: any) {
      toast.error(e.message || 'Error al abrir caja');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRegister = async () => {
    const scope = (await import('@/lib/scope')).getActiveScope();
    if (!scope?.sucursalId) {
      toast.error('Selecciona una sucursal antes de crear la caja.');
      return;
    }
    setLoading(true);
    try {
      const register = await apiGateway.createCashRegister({ name: registerName.trim() || 'Caja principal', sucursalId: scope.sucursalId });
      const next = { id: String(register.id ?? ''), name: String(register.name ?? registerName) };
      setRegisters([next]);
      setSelectedRegister(next.id);
      toast.success('Caja creada para esta sucursal.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo crear la caja');
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
      <DialogContent className="bg-white max-w-md p-6 rounded-2xl border border-slate-200 shadow-2xl text-slate-900 relative">
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>
        {mode === 'open' ? (
          <>
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-emerald-100 p-3.5 mb-3 shadow-sm">
                <Wallet className="h-7 w-7 text-emerald-700" />
              </div>
              <DialogTitle className="text-2xl font-bold text-slate-900">Apertura de Turno</DialogTitle>
              <DialogDescription className="text-slate-600 mt-1 font-medium">
                Selecciona la caja e introduce el fondo de caja inicial para operar.
              </DialogDescription>
            </div>

            <div className="space-y-5 mt-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">Caja Registradora</label>
                {registers.length > 0 ? (
                  <select
                    value={selectedRegister}
                    onChange={(e) => setSelectedRegister(e.target.value)}
                    className="flex h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  >
                    {registers.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                ) : (
                  <div className="space-y-3 rounded-xl border border-sky-200 bg-sky-50/80 p-4">
                    <p className="text-xs text-sky-950 font-semibold leading-relaxed">
                      Esta sucursal aún no tiene una caja registrada. Se creará automáticamente con el nombre de abajo al presionar <strong>"Abrir Turno de Caja"</strong>.
                    </p>
                    <Input
                      value={registerName}
                      onChange={(event) => setRegisterName(event.target.value)}
                      placeholder="Ej. Caja Principal"
                      className="border-slate-300 bg-white text-slate-900 font-semibold h-10"
                      aria-label="Nombre de la nueva caja"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">Fondo Inicial (Efectivo)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-base">$</span>
                  <Input
                    type="number"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    placeholder="0.00"
                    className="pl-8 h-11 border-slate-300 bg-white rounded-xl text-slate-900 font-bold text-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
              </div>

              <Button
                onClick={handleOpenShift}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl py-3 text-base shadow-md transition-all active:scale-[0.98] mt-4"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <ArrowRight className="h-5 w-5 mr-2" />}
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
