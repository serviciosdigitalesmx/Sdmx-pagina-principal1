'use client';

import { useState } from 'react';
import { Loader2, Save, Smartphone, User, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useEscClose } from '@/hooks/useEscClose';
import { getCurrentSession } from '@/lib/session';
import { apiGateway } from '@/services/apiGateway';
import { OmniSearch } from './omni-search';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type IntakeForm = {
  clientName: string;
  clientPhone: string;
  deviceType: string;
  deviceModel: string;
  issue: string;
  powersOn: boolean;
  notes: string;
};

const emptyForm: IntakeForm = {
  clientName: '',
  clientPhone: '',
  deviceType: '',
  deviceModel: '',
  issue: '',
  powersOn: false,
  notes: '',
};

export function QuickReceiveModal({ open, onOpenChange }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<IntakeForm>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEscClose(() => {
    if (open && !isSubmitting) onOpenChange(false);
  });

  const close = () => {
    if (isSubmitting) return;
    setForm(emptyForm);
    onOpenChange(false);
  };

  const submitOrder = async () => {
    const clientName = form.clientName.trim();
    const clientPhone = form.clientPhone.replace(/\D/g, '');
    const deviceType = form.deviceType.trim();
    const deviceModel = form.deviceModel.trim();
    const issue = form.issue.trim();

    if (!clientName || clientPhone.length < 10 || !deviceType || !deviceModel || !issue) {
      toast.error('Completa nombre, WhatsApp, tipo de equipo, marca y modelo, y la falla reportada.');
      return;
    }

    setIsSubmitting(true);
    try {
      const session = getCurrentSession();
      await apiGateway.createOrder({
        clientName,
        clientPhone,
        deviceType,
        deviceModel,
        issue,
        sucursalId: session?.branchId || undefined,
        checklist: {
          powersOn: form.powersOn,
          notes: form.notes.trim(),
        },
      });
      toast.success('Orden registrada.');
      setForm(emptyForm);
      onOpenChange(false);
      router.refresh();
      window.dispatchEvent(new CustomEvent('refresh-orders'));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo registrar la orden.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => (nextOpen ? onOpenChange(true) : close())}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-slate-50 p-0 sm:max-w-3xl">
        <header className="flex items-start justify-between border-b border-slate-200 bg-white p-5">
          <div>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <Smartphone className="h-5 w-5 text-sky-600" />
              Nueva orden
            </DialogTitle>
            <DialogDescription className="mt-1 text-slate-500">
              Registra lo indispensable para iniciar la recepción.
            </DialogDescription>
          </div>
          <button
            type="button"
            onClick={close}
            disabled={isSubmitting}
            className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
            aria-label="Cerrar recepción"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="grid gap-6 p-5 md:grid-cols-2">
          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-700">
              <User className="h-4 w-4" /> Cliente
            </div>
            <OmniSearch
              placeholder="Busca por nombre, WhatsApp o folio..."
              onCustomerSelect={(customer) => {
                setForm((current) => ({
                  ...current,
                  clientName: customer.name,
                  clientPhone: customer.phone ?? '',
                }));
              }}
            />
            <Field label="Nombre completo *">
              <Input
                value={form.clientName}
                onChange={(event) => setForm((current) => ({ ...current, clientName: event.target.value }))}
                placeholder="Ej. Juan Perez"
                autoComplete="name"
              />
            </Field>
            <Field label="WhatsApp / teléfono *">
              <Input
                value={form.clientPhone}
                onChange={(event) => setForm((current) => ({ ...current, clientPhone: event.target.value }))}
                placeholder="10 dígitos"
                inputMode="tel"
                autoComplete="tel"
              />
            </Field>
          </section>

          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
              <Smartphone className="h-4 w-4" /> Equipo y recepción
            </div>
            <Field label="Tipo de equipo *">
              <select
                value={form.deviceType}
                onChange={(event) => setForm((current) => ({ ...current, deviceType: event.target.value }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Selecciona un tipo</option>
                <option value="Smartphone">Smartphone</option>
                <option value="Laptop">Laptop</option>
                <option value="Tablet">Tablet</option>
                <option value="Computadora">Computadora</option>
                <option value="Consola">Consola</option>
                <option value="Otro">Otro</option>
              </select>
            </Field>
            <Field label="Marca y modelo *">
              <Input
                value={form.deviceModel}
                onChange={(event) => setForm((current) => ({ ...current, deviceModel: event.target.value }))}
                placeholder="Ej. Apple iPhone 13"
              />
            </Field>
            <Field label="Falla reportada *">
              <textarea
                value={form.issue}
                onChange={(event) => setForm((current) => ({ ...current, issue: event.target.value }))}
                placeholder="Describe brevemente el problema"
                rows={3}
                className="flex w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </Field>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3 py-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={form.powersOn}
                onChange={(event) => setForm((current) => ({ ...current, powersOn: event.target.checked }))}
                className="h-4 w-4 rounded border-slate-300 text-sky-600"
              />
              El equipo enciende
            </label>
            <Field label="Notas de recepción">
              <textarea
                value={form.notes}
                onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                placeholder="Observaciones importantes de entrada"
                rows={2}
                className="flex w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </Field>
          </section>
        </div>

        <footer className="flex justify-end border-t border-slate-200 bg-white p-5">
          <Button onClick={() => void submitOrder()} disabled={isSubmitting} className="min-w-44">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isSubmitting ? 'Registrando...' : 'Crear orden'}
          </Button>
        </footer>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  );
}
