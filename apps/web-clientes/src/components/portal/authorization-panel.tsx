"use client";

import { useEffect, useState, type FormEvent } from "react";
import { getOrderAuthorization, submitOrderAuthorization } from "@/lib/api/orders";
import type { PublicAuthorizationResponse } from "@/lib/types";

type AuthorizationPanelProps = {
  tenantSlug: string;
  publicToken: string;
  onDecision: () => Promise<void>;
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(value);
}

export function AuthorizationPanel({ tenantSlug, publicToken, onDecision }: AuthorizationPanelProps) {
  const [summary, setSummary] = useState<PublicAuthorizationResponse["data"] | null>(null);
  const [name, setName] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<"accepted" | "rejected" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void (async () => {
      await Promise.resolve();
      if (!active) return;

      setLoading(true);
      setError(null);
      try {
        const response = await getOrderAuthorization(tenantSlug, publicToken);
        if (active) setSummary(response.data);
      } catch {
        if (active) setError("No pudimos cargar la autorización. Intenta de nuevo.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [publicToken, tenantSlug]);

  const submitDecision = async (decision: "accepted" | "rejected") => {
    if (!summary || !name.trim()) {
      setError("Escribe el nombre de quien toma la decisión.");
      return;
    }
    if (decision === "accepted" && !termsAccepted) {
      setError("Debes aceptar los términos para autorizar la reparación.");
      return;
    }

    const amount = summary.order.finalCost ?? summary.order.estimatedCost;
    const device = [summary.order.device.type, summary.order.device.brand, summary.order.device.model].filter(Boolean).join(" ");
    const scopeSnapshot = [
      `Equipo: ${device || "No especificado"}`,
      `Falla reportada: ${summary.order.reportedIssue || "No especificada"}`,
      `Monto: ${formatMoney(amount)}`,
    ].join(". ");

    setSubmitting(decision);
    setError(null);
    setSuccess(null);
    try {
      await submitOrderAuthorization(tenantSlug, publicToken, {
        decision,
        authorizationType: "quotation",
        acceptedByName: name.trim(),
        authorizedAmount: decision === "accepted" ? amount : undefined,
        scopeSnapshot,
        termsVersion: summary.terms.version,
        termsSnapshot: summary.terms.text,
        signatureMethod: "typed_name",
        signatureText: name.trim(),
        idempotencyKey: crypto.randomUUID(),
      });
      setSuccess(decision === "accepted" ? "Autorización registrada correctamente." : "Rechazo registrado correctamente.");
      const refreshed = await getOrderAuthorization(tenantSlug, publicToken);
      setSummary(refreshed.data);
      await onDecision();
    } catch {
      setError("No pudimos registrar tu decisión. Revisa los datos e intenta de nuevo.");
    } finally {
      setSubmitting(null);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitDecision("accepted");
  };

  if (loading) {
    return <section className="rounded-[1.75rem] border border-sky-400/15 bg-white/5 p-6 text-sm text-slate-300">Cargando autorización...</section>;
  }

  if (!summary) {
    return error ? <section className="rounded-[1.75rem] border border-rose-400/20 bg-rose-500/10 p-6 text-sm text-rose-200">{error}</section> : null;
  }

  const amount = summary.order.finalCost ?? summary.order.estimatedCost;
  const alreadyAccepted = summary.authorization.hasAcceptedAuthorization;

  return (
    <section className="rounded-[1.75rem] border border-sky-400/20 bg-sky-500/10 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.2)]">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">Decisión del cliente</p>
      <h3 className="mt-2 text-xl font-black text-slate-50">Autorizar cotización</h3>
      <div className="mt-4 rounded-[1.25rem] border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
        <p>{summary.order.reportedIssue || "Revisión y reparación del equipo indicado."}</p>
        <p className="mt-3 text-2xl font-black text-slate-50">{formatMoney(amount)}</p>
      </div>

      {alreadyAccepted ? (
        <p className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200">
          Esta cotización ya fue autorizada.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="authorization-name" className="text-sm font-medium text-slate-200">Nombre completo</label>
            <input
              id="authorization-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-sky-400/20 bg-black/20 px-4 py-3 text-slate-50 outline-none focus:border-sky-400"
              autoComplete="name"
              required
            />
          </div>
          <label className="flex items-start gap-3 text-sm leading-6 text-slate-300">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(event) => setTermsAccepted(event.target.checked)}
              className="mt-1 h-4 w-4"
            />
            <span>{summary.terms.text}</span>
          </label>
          {error ? <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}
          {success ? <p className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{success}</p> : null}
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => void submitDecision("rejected")}
              disabled={submitting !== null}
              className="rounded-2xl border border-rose-400/30 px-4 py-3 text-sm font-semibold text-rose-200 disabled:opacity-60"
            >
              {submitting === "rejected" ? "Registrando..." : "Rechazar"}
            </button>
            <button
              type="submit"
              disabled={submitting !== null}
              className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {submitting === "accepted" ? "Autorizando..." : "Autorizar"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
