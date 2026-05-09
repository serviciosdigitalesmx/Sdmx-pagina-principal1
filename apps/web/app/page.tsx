"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Bot, ClipboardList, MessageCircle, Package2, ShieldCheck, Sparkles, Truck } from "lucide-react";

const categories = [
  {
    title: "Trapeadores",
    items: ["Microfibra", "Franja húmeda", "Jalador", "Mango reforzado"]
  },
  {
    title: "Escobas",
    items: ["Casa", "Industrial", "Palo largo", "Cepillo duro"]
  },
  {
    title: "Limpieza",
    items: ["Fibras", "Esponjas", "Jabones", "Desinfectantes"]
  },
  {
    title: "Varios",
    items: ["Accesorios", "Cubetas", "Repuestos", "Mayoreo"]
  }
];

const flow = [
  "El cliente abre el catálogo.",
  "Elige productos y cantidades.",
  "Envía el pedido por WhatsApp.",
  "El backend puede registrar clics y pedidos en Google Sheets."
];

const seleniumSteps = [
  "Abre una URL real de catálogo.",
  "Detecta imágenes por tarjeta, `img` o `background-image`.",
  "Descarga cada archivo en una carpeta local.",
  "Continúa aunque un producto falle."
];

export default function RootPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.16),_transparent_24%),radial-gradient(circle_at_84%_16%,_rgba(59,130,246,0.14),_transparent_20%),linear-gradient(180deg,#08110c_0%,#0f1720_100%)] text-[#edf7ef]">
      <section className="mx-auto max-w-[1500px] px-4 py-6 md:px-8 md:py-10">
        <div className="overflow-hidden rounded-[34px] border border-emerald-400/20 bg-[#0b1410]/92 shadow-[0_28px_80px_rgba(0,0,0,.45)]">
          <div className="grid gap-8 px-5 py-8 lg:grid-cols-[1.08fr_.92fr] lg:px-10 lg:py-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-200">
                <Sparkles className="h-4 w-4" />
                Don Cepillo
              </div>

              <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-[-0.07em] text-white md:text-6xl">
                Catálogo web para productos de limpieza
                <span className="block text-emerald-300">con pedido por WhatsApp</span>
              </h1>

              <p className="mt-5 max-w-2xl text-lg text-white/72 md:text-xl">
                Landing enfocada en mayoreo para negocios, restaurantes, hoteles, oficinas y distribuidores. Incluye integración
                con Google Apps Script para eventos y pedidos, y un bot Selenium para descargar imágenes reales del catálogo.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="#catalogo"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-6 py-3 text-sm font-bold text-[#08110c] shadow-[0_14px_30px_rgba(16,185,129,.24)]"
                >
                  Ver catálogo
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#pedido"
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-6 py-3 text-sm font-semibold text-white"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-300" />
                  Pedir por WhatsApp
                </a>
              </div>

              <div className="mt-8 grid gap-3 text-sm text-white/80 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <Truck className="h-4 w-4 text-emerald-300" />
                  <span>Venta al mayoreo para negocios</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                  <span>Backend en Google Sheets con Apps Script</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <BadgeCheck className="h-4 w-4 text-emerald-300" />
                  <span>Pedido rápido y atención por WhatsApp</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <ClipboardList className="h-4 w-4 text-emerald-300" />
                  <span>Registro de clics y órdenes</span>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#111a17] p-5 shadow-[0_20px_60px_rgba(0,0,0,.35)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/45">Automatización</p>
                  <p className="mt-1 text-2xl font-black text-white">Bot Selenium</p>
                </div>
                <div className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-xs font-semibold text-emerald-200">
                  Descarga real
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {seleniumSteps.map((step) => (
                  <div key={step} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/4 px-4 py-3">
                    <Bot className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                    <p className="text-sm text-white/78">{step}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[24px] border border-white/8 bg-black/25 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/40">Variables clave</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/70">
                  {["MENU_SOURCE_URL", "DOWNLOAD_DIR", "CHROME_BINARY_PATH", "SELENIUM_TIMEOUT", "PAGE_LOAD_TIMEOUT"].map(
                    (name) => (
                      <span key={name} className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                        {name}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="catalogo" className="mx-auto max-w-[1500px] px-4 pb-8 md:px-8">
        <div className="grid gap-4 lg:grid-cols-4">
          {categories.map((category) => (
            <article
              key={category.title}
              className="rounded-[30px] border border-emerald-400/18 bg-[#0c1512] p-5 shadow-[0_20px_50px_rgba(0,0,0,.28)]"
            >
              <div className="mx-auto -mt-10 mb-5 w-fit rounded-full bg-emerald-500 px-5 py-2 text-sm font-black uppercase tracking-[0.2em] text-[#07110c]">
                {category.title}
              </div>

              <div className="space-y-3">
                {category.items.map((item) => (
                  <div key={`${category.title}-${item}`} className="flex items-center justify-between gap-4 border-b border-white/6 pb-2">
                    <span className="text-sm font-semibold text-white/88">{item}</span>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Mayoreo</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="pedido" className="mx-auto max-w-[1500px] px-4 pb-16 md:px-8">
        <div className="grid gap-5 lg:grid-cols-[1fr_.82fr]">
          <div className="rounded-[30px] border border-white/10 bg-white/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">Flujo de pedido</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-white md:text-4xl">
              Pedidos simples, reales y con trazabilidad.
            </h2>
            <div className="mt-4 grid gap-3">
              {flow.map((step, index) => (
                <div key={step} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-xs font-black text-[#08110c]">
                    {index + 1}
                  </span>
                  <p className="text-sm text-white/78">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-[#0f1814] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">Ejecución</p>
            <pre className="mt-4 overflow-auto rounded-[24px] border border-white/10 bg-black/35 p-4 text-xs leading-6 text-white/78">
{`export MENU_SOURCE_URL="https://tu-catalogo-real"
export DOWNLOAD_DIR="$PWD/menu_downloads"
export SELENIUM_HEADLESS=1
python3 legacy-srfix/scripts/download_menu_images_selenium.py`}
            </pre>
            <div className="mt-4 rounded-[24px] border border-emerald-400/15 bg-emerald-400/8 p-4 text-sm text-white/78">
              El backend original de Don Cepillo usa Google Apps Script y Google Sheets para registrar pedidos y clics.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
