import Link from "next/link";
import { srFixTheme } from "@/components/srfix-theme";

export default function BillingFailurePage() {
  return (
    <main className="min-h-screen px-6 py-10 text-zinc-100" style={{ background: srFixTheme.background }}>
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-[2rem] border border-rose-700/30 bg-[linear-gradient(180deg,rgba(16,14,12,0.96),rgba(22,18,14,0.98))] p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-rose-200">Pago rechazado</p>
        <h1 className="text-4xl font-bold tracking-tight text-stone-50">No pudimos completar el cobro</h1>
        <p className="text-lg leading-8 text-stone-300">
          El checkout no quedó aprobado. Puedes revisar los datos y volver a intentar la activación cuando quieras.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/billing" className="rounded-full bg-rose-400 px-5 py-3 font-semibold text-zinc-950">
            Volver a planes
          </Link>
          <Link href="/hub" className="rounded-full border border-stone-700 px-5 py-3 font-semibold text-stone-100">
            Ir al hub
          </Link>
        </div>
      </section>
    </main>
  );
}
