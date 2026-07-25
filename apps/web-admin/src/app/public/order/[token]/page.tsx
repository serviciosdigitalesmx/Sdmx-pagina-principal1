'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Wrench, CheckCircle, XCircle, CreditCard, MessageCircle, FileText, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { apiGateway } from '@/services/apiGateway';

export default function PublicOrderPage() {
  const params = useParams();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [authorization, setAuthorization] = useState<any>(null);

  // Form states
  const [acceptedByName, setAcceptedByName] = useState('');
  const [acceptedByPhone, setAcceptedByPhone] = useState('');
  const [acceptedByEmail, setAcceptedByEmail] = useState('');
  const [decisionLoading, setDecisionLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Payment states
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    if (token) {
      loadOrderDetails();
    }
  }, [token]);

  const loadOrderDetails = async () => {
    setLoading(false);
    try {
      const res = await apiGateway.getPublicOrderDetails(token);
      setOrder(res.order);
      setAuthorization(res.authorization);
    } catch (e) {
      toast.error('No se pudo cargar la orden');
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (decision: 'accepted' | 'rejected') => {
    if (decision === 'accepted' && !termsAccepted) {
      toast.error('Debes aceptar los términos y condiciones.');
      return;
    }
    if (decision === 'accepted' && (!acceptedByName || !acceptedByPhone)) {
      toast.error('Nombre y teléfono son obligatorios.');
      return;
    }

    setDecisionLoading(true);
    try {
      const res = await apiGateway.authorizeOrder(token, {
        decision,
        acceptedByName,
        acceptedByPhone,
        acceptedByEmail: acceptedByEmail || undefined
      });
      toast.success(decision === 'accepted' ? '¡Presupuesto autorizado con éxito!' : 'Presupuesto rechazado.');
      setAuthorization(res.authorization);
      loadOrderDetails();
    } catch (e: any) {
      toast.error(e.message || 'Error al enviar respuesta');
    } finally {
      setDecisionLoading(false);
    }
  };

  const handleOnlinePayment = async () => {
    setPaymentLoading(true);
    try {
      const res = await apiGateway.createPublicOrderPayment(token, order.estimated_cost || 100, 'mercadopago');
      toast.success('Abriendo pasarela de pago...');
      window.open(res.initPoint, '_blank');
    } catch (e) {
      toast.error('Error al iniciar el pago');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 text-center p-6">
        <AlertCircle className="h-12 w-12 text-rose-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Orden no encontrada</h2>
        <p className="text-slate-500 mt-2">El enlace público es inválido o ha expirado.</p>
      </div>
    );
  }

  const finalCost = Number(order.final_cost) > 0 ? Number(order.final_cost) : Number(order.estimated_cost || 0);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 text-slate-900">
      <div className="max-w-3xl mx-auto bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden">
        {/* Banner de Estado */}
        <div className="bg-sky-500 text-white p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-bold opacity-80">Orden de Servicio</span>
            <h1 className="text-3xl font-bold font-mono tracking-wide mt-1">{order.folio}</h1>
          </div>
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {order.status}
          </span>
        </div>

        <div className="p-8 space-y-8">
          {/* Detalles del Equipo */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold border-b border-slate-100 pb-2 flex items-center gap-2">
              <Wrench className="h-5 w-5 text-sky-500" />
              Detalles del Dispositivo
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400 block">Marca / Modelo:</span>
                <span className="font-semibold text-slate-800">{order.device_info?.brand || 'Dispositivo'} {order.device_info?.model || ''}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Número de Serie/IMEI:</span>
                <span className="font-semibold text-slate-800">{order.serial_number || 'N/A'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block">Falla Reportada:</span>
                <span className="font-medium text-slate-800">{order.problem_description}</span>
              </div>
            </div>
          </div>

          {/* Desglose de Costos */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex justify-between items-center">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-slate-500">Monto del Presupuesto</span>
              <p className="text-3xl font-bold text-slate-900 mt-1">${finalCost.toFixed(2)}</p>
            </div>
            {authorization?.decision === 'accepted' && (
              <Button
                onClick={handleOnlinePayment}
                disabled={paymentLoading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2 px-4 flex items-center gap-2"
              >
                {paymentLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                Pagar en Línea
              </Button>
            )}
          </div>

          {/* Sección de Autorización */}
          {authorization ? (
            <div className={`p-6 rounded-xl border flex items-start gap-3
              ${authorization.decision === 'accepted'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'}`}
            >
              {authorization.decision === 'accepted' ? (
                <>
                  <CheckCircle className="h-5 w-5 mt-0.5" />
                  <div>
                    <h4 className="font-bold">Presupuesto Autorizado</h4>
                    <p className="text-xs mt-1">Autorizado por {authorization.accepted_by_name} el {new Date(authorization.decided_at).toLocaleString()}.</p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 mt-0.5" />
                  <div>
                    <h4 className="font-bold">Presupuesto Rechazado</h4>
                    <p className="text-xs mt-1">Has rechazado este presupuesto. El taller ha sido notificado.</p>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="border border-slate-200 rounded-xl p-6 space-y-6">
              <h3 className="text-lg font-bold border-b border-slate-100 pb-2 flex items-center gap-2">
                <FileText className="h-5 w-5 text-sky-500" />
                Autorización de Diagnóstico y Reparación
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Nombre de quien autoriza *</label>
                  <Input
                    value={acceptedByName}
                    onChange={e => setAcceptedByName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="border-slate-200 bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Teléfono de contacto *</label>
                  <Input
                    value={acceptedByPhone}
                    onChange={e => setAcceptedByPhone(e.target.value)}
                    placeholder="10 dígitos"
                    className="border-slate-200 bg-white"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700">Email (Opcional)</label>
                  <Input
                    value={acceptedByEmail}
                    onChange={e => setAcceptedByEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={e => setTermsAccepted(e.target.checked)}
                    className="rounded border-slate-300 text-sky-500 focus:ring-sky-500 h-4 w-4 mt-0.5"
                  />
                  <span>
                    Acepto que el taller realice la reparación y declaro estar de acuerdo con el costo del diagnóstico y reparación cotizados arriba.
                  </span>
                </label>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => handleDecision('rejected')}
                  disabled={decisionLoading}
                  variant="outline"
                  className="flex-1 border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold py-2.5 rounded-xl"
                >
                  Rechazar Presupuesto
                </Button>
                <Button
                  onClick={() => handleDecision('accepted')}
                  disabled={decisionLoading}
                  className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 rounded-xl"
                >
                  {decisionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                  Autorizar Reparación
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Icon helper
function AlertCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  );
}
