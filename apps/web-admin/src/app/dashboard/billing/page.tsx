"use client";

import { useEffect, useState } from "react";
import { Check, MessageCircle, Sparkles } from "lucide-react";
import { BillingExpiredScreen } from "@/components/billing/billing-expired-screen";
import { apiClient } from "@/lib/api-client";
import { clearBillingExpiredState } from "@/lib/billing-expired";

type BillingPlanCode = "basic" | "pro" | "enterprise";

type CheckoutResponse = {
  success: boolean;
  initPoint: string;
  preferenceId: string | null;
};

type BillingStatusResponse = {
  success: boolean;
  data: {
    subscriptionStatus: string;
    isBillingBlocked: boolean;
  };
};

const PLANS = [
  { code: "basic", name: "Básico", price: "$300 MXN/mes", description: "1 sucursal y hasta 2 usuarios. Órdenes, clientes, inventario básico y seguimiento." },
  { code: "pro", name: "Profesional", price: "$450 MXN/mes", description: "Hasta 2 sucursales y 5 usuarios. Landing y branding del negocio, compras, reportes y operación ampliada." },
  { code: "enterprise", name: "Empresarial", price: "$600 MXN/mes", description: "Sucursales y usuarios ilimitados, con control financiero y administrativo completo." },
] satisfies Array<{ code: BillingPlanCode; name: string; price: string; description: string }>;

const SELECTED_PLAN_KEY = "fixi:selected-billing-plan";

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState<BillingPlanCode>("pro");
  const [loadingPlan, setLoadingPlan] = useState<BillingPlanCode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentNotice, setPaymentNotice] = useState<string | null>(null);

  useEffect(() => {
    const storedPlan = window.sessionStorage.getItem(SELECTED_PLAN_KEY);
    if (PLANS.some((plan) => plan.code === storedPlan)) {
      setSelectedPlan(storedPlan as BillingPlanCode);
    }
  }, []);

  useEffect(() => {
    const paymentResult = new URLSearchParams(window.location.search).get("payment");
    if (!paymentResult) return;

    if (paymentResult === "failure") {
      setPaymentNotice("El pago no se completó. Puedes intentarlo otra vez con el plan seleccionado.");
      return;
    }

    if (paymentResult === "pending") {
      setPaymentNotice("Mercado Pago está procesando el cobro. El acceso se activará en cuanto lo confirme.");
    } else {
      setPaymentNotice("Pago recibido. Estamos confirmando la activación de tu cuenta...");
    }

    let cancelled = false;
    let attempts = 0;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const verifyActivation = async () => {
      attempts += 1;
      try {
        const status = await apiClient.get<BillingStatusResponse>("/billing/status");
        if (!status.data.isBillingBlocked && status.data.subscriptionStatus === "active") {
          clearBillingExpiredState();
          window.sessionStorage.removeItem(SELECTED_PLAN_KEY);
          window.location.replace("/dashboard");
          return;
        }
      } catch {
        // The webhook can still be processing; retry for a short bounded window.
      }

      if (!cancelled && attempts < 10) {
        timeoutId = setTimeout(() => void verifyActivation(), 2000);
      } else if (!cancelled) {
        setPaymentNotice("El pago sigue en confirmación. Tu acceso se habilitará automáticamente al aprobarse.");
      }
    };

    void verifyActivation();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const selectPlan = (plan: BillingPlanCode) => {
    setSelectedPlan(plan);
    setError(null);
    window.sessionStorage.setItem(SELECTED_PLAN_KEY, plan);
  };

  const activateSelectedPlan = async () => {
    setError(null);
    setLoadingPlan(selectedPlan);

    try {
      const checkout = await apiClient.post<CheckoutResponse>("/billing/checkout/protected", {
        plan: selectedPlan,
      });

      if (!checkout.initPoint) {
        throw new Error("La pasarela no devolvió una URL de pago.");
      }

      window.location.assign(checkout.initPoint);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "No se pudo iniciar el pago.");
      setLoadingPlan(null);
    }
  };

  const selectedPlanDetails = PLANS.find((plan) => plan.code === selectedPlan) ?? PLANS[1];

  return (
    <div className="space-y-8 px-4 py-8 text-white">
      <section className="mx-auto w-full max-w-6xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        <BillingExpiredScreen
          onActivate={() => void activateSelectedPlan()}
          activating={loadingPlan !== null}
          selectedPlanName={selectedPlanDetails.name}
        />
      </section>

      <section id="planes" className="mx-auto w-full max-w-6xl pb-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-sky-300/80">Planes disponibles</p>
            <h2 className="mt-3 text-2xl font-semibold">Elige el plan que vas a activar</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void activateSelectedPlan()}
              disabled={loadingPlan !== null}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Sparkles className="h-4 w-4" />
              {loadingPlan ? "Abriendo pago..." : `Activar ${selectedPlanDetails.name}`}
            </button>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_SAAS_CONTACT_PHONE?.replace(/\D/g, "") ?? ""}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-5 py-3 font-semibold text-emerald-100 transition hover:bg-emerald-500/15"
            >
              <MessageCircle className="h-4 w-4" />
              Hablar por WhatsApp
            </a>
          </div>
        </div>
        {error ? (
          <p role="alert" className="mb-5 rounded-2xl border border-rose-400/25 bg-rose-500/10 px-5 py-4 text-sm text-rose-100">
            {error}
          </p>
        ) : null}
        {paymentNotice ? (
          <p role="status" className="mb-5 rounded-2xl border border-sky-400/25 bg-sky-500/10 px-5 py-4 text-sm text-sky-100">
            {paymentNotice}
          </p>
        ) : null}
        <div className="grid gap-4 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <button
              key={plan.code}
              type="button"
              aria-pressed={selectedPlan === plan.code}
              onClick={() => selectPlan(plan.code)}
              className={`relative rounded-[1.5rem] border p-6 text-left text-white shadow-[0_24px_70px_rgba(0,0,0,0.22)] transition duration-200 hover:-translate-y-1 hover:border-sky-300/40 ${
                selectedPlan === plan.code
                  ? "border-sky-300 bg-sky-500/10 ring-2 ring-sky-400/25"
                  : "border-white/10 bg-slate-950/70"
              }`}
            >
              {selectedPlan === plan.code ? (
                <span className="absolute right-5 top-5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-400 text-slate-950">
                  <Check className="h-4 w-4" aria-hidden="true" />
                </span>
              ) : null}
              <p className="text-xs uppercase tracking-[0.32em] text-sky-300/80">{plan.name}</p>
              <h2 className="mt-3 text-3xl font-semibold">{plan.price}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{plan.description}</p>
              <span className="mt-5 inline-flex text-sm font-semibold text-sky-300">
                {selectedPlan === plan.code ? "Plan seleccionado" : "Seleccionar plan"}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
