import Link from "next/link";
import { srFixTheme } from "@/components/srfix-theme";

export default function BillingPendingPage() {
  return (
    <main className="min-h-screen px-6 py-10 text-zinc-100" style={{ background: srFixTheme.background }}>
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-[2rem] border border-amber-700/30 bg-[linear-gradient(180deg,rgba(16,14,12,0.96),rgba(22,18,14,0.98))] p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-amber-200">Pago pendiente</p>
        <h1 className="text-4xl font-bold tracking-tight text-stone-50">Estamos esperando confirmación</h1>
        <p className="text-lg leading-8 text-stone-300">
          El checkout fue creado, pero Mercado Pago todavía no confirma el pago. Vuelve al hub o revisa el estado en unos minutos.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/hub" className="rounded-full bg-amber-400 px-5 py-3 font-semibold text-zinc-950">
            Ir al hub
          </Link>
          <Link href="/billing" className="rounded-full border border-stone-700 px-5 py-3 font-semibold text-stone-100">
            Ver planes
          </Link>
        </div>
      </section>
    </main>
  );
}
