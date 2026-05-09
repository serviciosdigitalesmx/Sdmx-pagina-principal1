"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, LayoutGrid, Smartphone, Sparkles, Workflow } from "lucide-react";

const pillars = [
  {
    title: "Multi-tenant real",
    detail: "Aislamiento por tenant_id con Supabase y APIs dedicadas."
  },
  {
    title: "Frontend Next.js",
    detail: "Rutas públicas, portal del cliente y panel operativo en un solo monorepo."
  },
  {
    title: "Backend en Render",
    detail: "API separada, validación en backend y despliegue listo para producción."
  },
  {
    title: "Cero mocks",
    detail: "Sin datos simulados: todo consulta sistemas reales."
  }
];

const routes = [
  { label: "Entrar al panel", href: "/login" },
  { label: "Ver portal", href: "/portal" },
  { label: "Landing pública", href: "/landing/demo" }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,112,67,0.18),_transparent_24%),radial-gradient(circle_at_80%_20%,_rgba(255,255,255,0.08),_transparent_18%),linear-gradient(180deg,#080808_0%,#121212_100%)] text-[#f5f2ed]">
      <section className="mx-auto flex min-h-screen max-w-7xl items-center px-4 py-10 md:px-8">
        <div className="grid w-full gap-8 rounded-[36px] border border-white/10 bg-black/40 p-6 shadow-[0_30px_100px_rgba(0,0,0,.45)] lg:grid-cols-[1.05fr_.95fr] lg:p-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-orange-200">
              <Sparkles className="h-4 w-4" />
              Servicios Digitales MX
            </div>

            <h1 className="mt-6 max-w-3xl text-5xl font-black tracking-[-0.07em] text-white md:text-7xl">
              Sr. Fix
              <span className="block text-orange-300">operación real, multi-tenant y lista para producción</span>
            </h1>

            <p className="mt-5 max-w-2xl text-lg text-white/72 md:text-xl">
              Plataforma de taller con landing pública, portal del cliente, panel operativo y backend separado.
              Conexión real a Supabase, validación en API y despliegue preparado para Vercel + Render.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  {route.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ))}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {pillars.map((pillar) => (
                <article key={pillar.title} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-black text-white">{pillar.title}</div>
                  <p className="mt-1 text-sm text-white/65">{pillar.detail}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-[#121212] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">Arquitectura</p>
                <h2 className="mt-1 text-2xl font-black text-white">Monorepo en producción</h2>
              </div>
              <div className="rounded-full border border-orange-500/25 bg-orange-500/10 px-4 py-2 text-xs font-semibold text-orange-200">
                Next.js 15
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {[
                { icon: LayoutGrid, text: "apps/web para frontend y rutas públicas." },
                { icon: Workflow, text: "apps/backend-api para la lógica de negocio." },
                { icon: ShieldCheck, text: "Supabase con RLS y tenant_id." },
                { icon: Smartphone, text: "Portal del cliente para folios y seguimiento." }
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                  <Icon className="mt-0.5 h-4 w-4 text-orange-300" />
                  <p className="text-sm text-white/75">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/40">Variables de entorno</p>
              <div className="mt-3 grid gap-2 text-xs text-white/70">
                <code className="rounded-full border border-white/10 bg-black/30 px-3 py-1">NEXT_PUBLIC_API_BASE_URL</code>
                <code className="rounded-full border border-white/10 bg-black/30 px-3 py-1">SUPABASE_URL</code>
                <code className="rounded-full border border-white/10 bg-black/30 px-3 py-1">SUPABASE_SERVICE_ROLE_KEY</code>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
