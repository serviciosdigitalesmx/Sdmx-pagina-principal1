'use client';

import { useCallback, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Wrench, CheckCircle2, XCircle, CreditCard, AlertCircle, Clock, Smartphone, FileText, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { apiGateway } from '@/services/apiGateway';
import { SignaturePad } from '@/components/ordenes/signature-pad';

type PublicOrderPayload = {
  order?: {
    folio?: string;
    status?: string;
    final_cost?: number | string;
    estimated_cost?: number | string;
    problem_description?: string;
    device_info?: {
      brand?: string;
      model?: string;
      customer_name?: string;
      customer_phone?: string;
    };
  };
  authorization?: {
    decision?: string;
  };
};

export default function PublicPremiumPortalPage() {
  const params = useParams();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<PublicOrderPayload | null>(null);
  const [authorization, setAuthorization] = useState<PublicOrderPayload['authorization'] | null>(null);

  // Formularios de decisión
  const [acceptedByName, setAcceptedByName] = useState('');
  const [acceptedByPhone, setAcceptedByPhone] = useState('');
  const [signatureBase64, setSignatureBase64] = useState<string | null>(null);
  const [decisionLoading, setDecisionLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const loadPortal = useCallback(async () => {
    if (!token) return;
    try {
      const res = (await apiGateway.getPublicOrderDetails(token)) as PublicOrderPayload;
      setOrderData(res);
      setAuthorization(res.authorization ?? null);
      
      // Pre-llenar datos del cliente si existen
      if (res.order?.device_info?.customer_name) setAcceptedByName(res.order.device_info.customer_name);
      if (res.order?.device_info?.customer_phone) setAcceptedByPhone(res.order.device_info.customer_phone);
    } catch {
      toast.error('No se pudo cargar la información.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const task = window.setTimeout(() => { void loadPortal(); }, 0);
    return () => window.clearTimeout(task);
  }, [loadPortal]);

  const handleDecision = async (decision: 'accepted' | 'rejected') => {
    if (decision === 'accepted') {
      if (!termsAccepted) return toast.error('Debes aceptar los términos de reparación.');
      if (!acceptedByName || !acceptedByPhone) return toast.error('Nombre y teléfono obligatorios.');
      if (!signatureBase64) return toast.error('Tu firma es requerida para proteger tu equipo.');
    }

    setDecisionLoading(true);
    try {
      const res = await apiGateway.authorizeOrder(token, {
        decision,
        acceptedByName,
        acceptedByPhone,
      });
      // TODO: Subir la firma (signatureBase64) como un attachment al order_id usando apiGateway
      toast.success(decision === 'accepted' ? '¡Orden autorizada con éxito!' : 'Presupuesto rechazado.');
      setAuthorization(res.authorization);
      await loadPortal(); // Recargar estado real
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Error al enviar respuesta');
    } finally {
      setDecisionLoading(false);
    }
  };

  const handleOnlinePayment = async () => {
    setPaymentLoading(true);
    try {
      const res = await apiGateway.createPublicOrderPayment(token, 'online');
      toast.success('Abriendo pasarela de pago seguro...');
      // Redirección a la pasarela (Fixi Pay o MercadoPago)
      if (res.initPoint) {
        window.location.href = res.initPoint;
      }
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Error al generar link de pago');
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
      </div>
    );
  }

  if (!orderData?.order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="h-20 w-20 bg-rose-100 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="h-10 w-10 text-rose-500" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Enlace Caducado</h2>
        <p className="text-slate-500 mt-3 max-w-md">El folio que intentas consultar no existe o el enlace de seguridad ha expirado.</p>
      </div>
    );
  }

  const { order } = orderData;
  const isAuthorized = authorization?.decision === 'accepted';
  const isRejected = authorization?.decision === 'rejected';
  const finalCost = Number(order.final_cost) > 0 ? Number(order.final_cost) : Number(order.estimated_cost || 0);

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 font-sans">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Banner de Estado (Modern App Feel) */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Estado en tiempo real</span>
            <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5
              ${order.status === 'listo' || order.status === 'entregado' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${order.status === 'listo' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`}></span>
              {order.status}
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">Orden {order.folio}</h1>
          <p className="text-slate-500 text-sm">{order.device_info?.brand} {order.device_info?.model}</p>
        </div>

        {/* Diagnóstico y Problema */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
            <Wrench className="h-4 w-4" /> Diagnóstico Técnico
          </h3>
          <p className="text-lg font-medium text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
            &quot;{order.problem_description}&quot;
          </p>
        </div>

        {/* Bloque de Autorización (Call To Action principal) */}
        <div className={`rounded-3xl p-6 shadow-sm border ${isAuthorized ? 'bg-emerald-50 border-emerald-200' : isRejected ? 'bg-rose-50 border-rose-200' : 'bg-white border-sky-200 shadow-sky-500/10'}`}>
          {isAuthorized ? (
            <div className="text-center py-4">
              <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-xl font-black text-emerald-900 tracking-tight">Presupuesto Aprobado</h3>
              <p className="text-sm text-emerald-700 mt-2">Nuestros técnicos ya están working en tu equipo.</p>
              <div className="mt-6 p-4 bg-white rounded-2xl shadow-sm border border-emerald-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total a pagar</span>
                <span className="text-3xl font-black text-slate-900">${finalCost.toFixed(2)}</span>
              </div>
              <Button onClick={handleOnlinePayment} disabled={paymentLoading} className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-14 font-bold text-lg shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]">
                {paymentLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <CreditCard className="h-5 w-5 mr-2" />} Pagar en línea ahora
              </Button>
            </div>
          ) : isRejected ? (
            <div className="text-center py-4">
              <XCircle className="h-12 w-12 text-rose-500 mx-auto mb-3" />
              <h3 className="text-xl font-black text-rose-900 tracking-tight">Presupuesto Declinado</h3>
              <p className="text-sm text-rose-700 mt-2">Hemos pausado el trabajo. Pasa a recoger tu equipo cuando desees.</p>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-end border-b border-slate-100 pb-5 mb-5">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Autorización requerida</h3>
                  <p className="text-sm text-slate-500 mt-1">Revisa y autoriza para iniciar el trabajo.</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Costo Total</span>
                  <span className="text-3xl font-black text-sky-600">${finalCost.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Nombre Autoriza</label>
                    <Input value={acceptedByName} onChange={e => setAcceptedByName(e.target.value)} className="bg-slate-50 border-slate-200 h-12" placeholder="Tu nombre" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Teléfono Confirma</label>
                    <Input value={acceptedByPhone} onChange={e => setAcceptedByPhone(e.target.value)} className="bg-slate-50 border-slate-200 h-12" placeholder="Tu celular" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 flex justify-between">
                    Firma Digital <span className="text-sky-500">* Obligatoria</span>
                  </label>
                  {/* Digital Signature Pad */}
                  <SignaturePad onSign={setSignatureBase64} />
                </div>

                <label className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
                  <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                  <span className="text-xs text-slate-600 leading-relaxed">
                    Autorizo formalmente la reparación de mi equipo bajo el diagnóstico y costos presentados. Acepto los términos de garantía aplicables a las refacciones instaladas.
                  </span>
                </label>

                <div className="flex gap-3 pt-2">
                  <Button onClick={() => handleDecision('rejected')} disabled={decisionLoading} variant="outline" className="flex-1 h-14 rounded-xl border-rose-200 text-rose-600 font-bold hover:bg-rose-50">
                    Rechazar
                  </Button>
                  <Button onClick={() => handleDecision('accepted')} disabled={decisionLoading} className="flex-1 h-14 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-black shadow-lg shadow-sky-500/25">
                    {decisionLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Check className="h-5 w-5 mr-2" />} 
                    Autorizar Trabajo
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
