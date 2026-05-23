import Link from "next/link";

const productName = process.env.NEXT_PUBLIC_SAAS_BRAND_NAME ?? "FIXIE";
const legalName = process.env.NEXT_PUBLIC_SAAS_LEGAL_NAME ?? "Servicios Digitales MX";
const demoUrl = process.env.NEXT_PUBLIC_SAAS_DEMO_URL;
const contactEmail = process.env.NEXT_PUBLIC_SAAS_CONTACT_EMAIL ?? "contacto@serviciosdigitalesmx.com";
const contactPhone = process.env.NEXT_PUBLIC_SAAS_CONTACT_PHONE;
const starterPrice = process.env.NEXT_PUBLIC_SAAS_STARTER_PRICE ?? "$300 MXN";
const growthPrice = process.env.NEXT_PUBLIC_SAAS_GROWTH_PRICE ?? "$450 MXN";
const enterprisePrice = process.env.NEXT_PUBLIC_SAAS_ENTERPRISE_PRICE ?? "$600 MXN";
const contactEmailHref = contactEmail ? `mailto:${contactEmail}` : "#contacto";
const contactPhoneHref = contactPhone ? `tel:${contactPhone.replace(/\s+/g, "")}` : undefined;
const whatsappHref = contactPhone ? `https://wa.me/${contactPhone.replace(/\D/g, "")}` : undefined;
const demoHref = demoUrl ?? "/t/demo/portal";

const metrics = [
  { value: "+40%", label: "Menos llamadas de seguimiento" },
  { value: "100%", label: "Aislamiento con tenant_id + RLS" },
  { value: "0%", label: "Branding genérico visible" },
];

const coreCards = [
  {
    eyebrow: "Cotizador",
    title: "Entrada comercial rápida",
    copy: "Equipo, diagnóstico preliminar y presupuesto sin fricción. Un flujo que convierte visitas en órdenes claras.",
    bullets: ["Equipo y falla", "Cotización guiada", "WhatsApp directo"],
  },
  {
    eyebrow: "Tracking",
    title: "Portal público por tenant",
    copy: "El cliente consulta su folio, ve el timeline y entiende el estado sin perseguir al taller.",
    bullets: ["Consulta por folio", "Timeline real", "PDF y evidencia"],
  },
  {
    eyebrow: "Mesa de control",
    title: "Cockpit operativo del taller",
    copy: "Recepción, técnico, stock, finanzas y sucursales en un tablero con lectura inmediata.",
    bullets: ["Kanban operativo", "Stock y finanzas", "Roles por sucursal"],
  },
  {
    eyebrow: "WhatsApp",
    title: "Notificación con un clic",
    copy: "El taller avisa avance, autorización o entrega en el canal que el cliente ya usa.",
    bullets: ["Mensajes de estado", "Folio visible", "Cierre más rápido"],
  },
];

const trustBlocks = [
  {
    title: "Aislamiento estricto",
    copy: "Cada dato se filtra por tenant_id. La seguridad no es una capa visual: es una regla de datos.",
  },
  {
    title: "White-label real",
    copy: "Logo, colores, nombre comercial y enlaces mutan por tenant para que el SaaS se sienta del taller.",
  },
  {
    title: "Arquitectura de producción",
    copy: "Frontend en Vercel, backend en Render y Supabase con RLS. Sin atajos de persistencia.",
  },
];

const planFeatures = {
  starter: ["1 sucursal", "1 rol de operación", "Landing y tracking", "Soporte base"],
  pro: ["Hasta 3 sucursales", "Roles owner + manager", "PDF white-label", "WhatsApp y portal cliente"],
  business: ["Multisucursal real", "Roles granulares", "Evidencia avanzada", "Escalamiento operativo"],
};

const planCopy = [
  {
    name: "Starter",
    price: starterPrice,
    highlight: false,
    features: planFeatures.starter,
  },
  {
    name: "Pro",
    price: growthPrice,
    highlight: true,
    features: planFeatures.pro,
  },
  {
    name: "Business",
    price: enterprisePrice,
    highlight: false,
    features: planFeatures.business,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_24%),radial-gradient(circle_at_80%_10%,_rgba(52,211,153,0.14),_transparent_22%),linear-gradient(180deg,#09090b_0%,#0f1115_48%,#0b0d10_100%)] text-zinc-100">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <header className="rounded-[2rem] border border-zinc-800/70 bg-zinc-950/80 px-5 py-4 shadow-[0_20px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-[linear-gradient(180deg,rgba(34,211,238,0.18),rgba(15,23,42,0.92))] text-sm font-black text-cyan-300 shadow-[0_20px_60px_rgba(34,211,238,0.15)]">
                FX
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.42em] text-cyan-300">FIXIE</p>
                <p className="mt-1 text-sm text-zinc-400">{legalName}</p>
              </div>
            </div>

            <nav className="flex flex-wrap items-center gap-2 text-sm text-zinc-300">
              <a className="rounded-full border border-zinc-800 px-4 py-2 transition hover:border-cyan-400/30 hover:bg-white/5" href="#producto">
                Producto
              </a>
              <a className="rounded-full border border-zinc-800 px-4 py-2 transition hover:border-cyan-400/30 hover:bg-white/5" href="#seguridad">
                Seguridad
              </a>
              <a className="rounded-full border border-zinc-800 px-4 py-2 transition hover:border-cyan-400/30 hover:bg-white/5" href="#precios">
                Precios
              </a>
              <a className="rounded-full border border-zinc-800 px-4 py-2 transition hover:border-cyan-400/30 hover:bg-white/5" href="#contacto">
                Contacto
              </a>
              <Link
                className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 font-semibold text-cyan-200 transition hover:border-cyan-300/40 hover:bg-cyan-400/15"
                href="/onboarding"
              >
                Crear mi tenant
              </Link>
            </nav>
          </div>
        </header>

        <section className="grid gap-6 rounded-[2.5rem] border border-zinc-800/70 bg-[linear-gradient(180deg,rgba(9,9,11,0.92),rgba(15,17,21,0.96))] px-5 py-8 shadow-[0_30px_120px_rgba(0,0,0,0.45)] lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-10">
          <div className="space-y-8">
            <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-300">
              SaaS multitenant para talleres premium
            </div>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-balance text-5xl font-black tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
                El sistema operativo para talleres que operan a nivel premium.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
                {productName} reúne cotización, tracking, evidencia y control interno en una sola plataforma con marca blanca,
                aislamiento real por tenant_id y experiencia lista para vender.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                className="rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-200"
                href="/onboarding"
              >
                Crear mi tenant
              </Link>
              <Link
                className="rounded-full border border-zinc-700 bg-white/5 px-6 py-3 text-sm font-semibold text-zinc-100 transition hover:border-cyan-400/30 hover:bg-white/10"
                href={demoHref}
              >
                Ver demo en vivo
              </Link>
              <a
                className="rounded-full border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:bg-white/5"
                href={whatsappHref ?? contactEmailHref}
              >
                WhatsApp
              </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {metrics.map((metric) => (
                <article key={metric.label} className="rounded-[1.5rem] border border-zinc-800/70 bg-white/4 p-5 backdrop-blur">
                  <p className="text-3xl font-black tracking-tight text-white">{metric.value}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">{metric.label}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <article className="rounded-[1.75rem] border border-zinc-800/80 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(9,9,11,0.98))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
              <div className="flex items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-cyan-300">Mesa de control</p>
                  <h2 className="mt-2 text-2xl font-bold text-white">Cockpit operativo</h2>
                </div>
                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  LIVE
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  ["Recepción", "Orden, cliente y evidencia"],
                  ["Técnico", "Diagnóstico y notas"],
                  ["Stock", "Inventario y compras"],
                  ["Finanzas", "Cobros y gastos"],
                ].map(([title, desc]) => (
                  <div key={title} className="rounded-2xl border border-zinc-800 bg-white/5 p-4">
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-zinc-400">{desc}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[1.75rem] border border-zinc-800/80 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.14),_transparent_24%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(9,9,11,0.98))] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-emerald-300">Tracking cliente</p>
                  <h3 className="mt-2 text-xl font-bold text-white">Consulta por folio</h3>
                </div>
                <span className="rounded-full border border-zinc-700 bg-white/5 px-3 py-1 text-xs text-zinc-300">Mobile preview</span>
              </div>
              <div className="mt-4 rounded-[1.5rem] border border-zinc-800 bg-zinc-950 p-4">
                <div className="mx-auto max-w-[320px] rounded-[1.5rem] border border-zinc-800 bg-[linear-gradient(180deg,#0f172a,#111827)] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.26em] text-zinc-400">
                    <span>Folio</span>
                    <span>ORD-MP...</span>
                  </div>
                  <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-300">Estado</p>
                    <p className="mt-2 text-2xl font-black text-white">En diagnóstico</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">Timeline, evidencia y PDF visibles para el cliente.</p>
                  </div>
                  <div className="mt-4 space-y-2">
                    {["Recibida", "Diagnóstico", "Reparación"].map((step, index) => (
                      <div key={step} className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-white/5 px-3 py-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${index < 2 ? "bg-emerald-400" : "bg-zinc-600"}`} />
                        <span className="text-sm text-zinc-200">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-4" id="producto">
          {coreCards.map((card) => (
            <article
              key={card.title}
              className="rounded-[1.75rem] border border-zinc-800/70 bg-zinc-950/85 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.28)] transition hover:-translate-y-0.5 hover:border-cyan-400/30"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-300">{card.eyebrow}</p>
              <h2 className="mt-3 text-xl font-bold text-white">{card.title}</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-400">{card.copy}</p>
              <ul className="mt-4 space-y-2">
                {card.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-2 text-sm text-zinc-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section id="seguridad" className="grid gap-4 rounded-[2.5rem] border border-zinc-800/70 bg-[linear-gradient(180deg,rgba(9,9,11,0.92),rgba(15,17,21,0.98))] px-5 py-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-cyan-300">Confianza técnica</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
              Transparencia que vende seguridad.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-8 text-zinc-300">
              Para talleres serios, FIXIE no oculta la arquitectura. La muestra con claridad: aislamiento, marca blanca y
              despliegue de producción desde el primer vistazo.
            </p>
          </div>

          <div className="grid gap-4">
            {trustBlocks.map((block) => (
              <article key={block.title} className="rounded-[1.5rem] border border-zinc-800 bg-white/5 p-5">
                <h3 className="text-lg font-semibold text-white">{block.title}</h3>
                <p className="mt-2 text-sm leading-7 text-zinc-400">{block.copy}</p>
              </article>
            ))}
            <div className="rounded-[1.5rem] border border-cyan-400/20 bg-cyan-400/10 p-5 text-sm leading-7 text-cyan-50">
              <span className="font-semibold text-cyan-200">Contrato de seguridad:</span> cada tenant ve sólo su información, su branding
              y su operación.
            </div>
          </div>
        </section>

        <section id="precios" className="space-y-6 rounded-[2.5rem] border border-zinc-800/70 bg-zinc-950/85 px-5 py-8 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-emerald-300">Precios</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
              El plan Pro es el punto dulce para vender y operar.
            </h2>
            <p className="mt-4 text-base leading-8 text-zinc-300">
              Claridad total: cada plan explica cuántas sucursales, roles y capacidades desbloquea. Sin letra chica.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {planCopy.map((plan) => (
              <article
                key={plan.name}
                className={[
                  "rounded-[1.75rem] border p-6 shadow-[0_18px_70px_rgba(0,0,0,0.28)]",
                  plan.highlight
                    ? "border-cyan-400/30 bg-[linear-gradient(180deg,rgba(34,211,238,0.10),rgba(9,9,11,1))] ring-1 ring-cyan-400/20"
                    : "border-zinc-800 bg-white/4",
                ].join(" ")}
              >
                {plan.highlight ? (
                  <div className="mb-4 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">
                    Más popular
                  </div>
                ) : null}
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-400">{plan.name}</p>
                <p className="mt-3 text-4xl font-black tracking-tight text-white">{plan.price}</p>
                <ul className="mt-5 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm leading-6 text-zinc-300">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/onboarding"
                  className={[
                    "mt-6 inline-flex w-full justify-center rounded-full px-5 py-3 text-sm font-semibold transition",
                    plan.highlight
                      ? "bg-cyan-300 text-zinc-950 hover:bg-cyan-200"
                      : "border border-zinc-700 bg-white/5 text-zinc-100 hover:border-cyan-400/30 hover:bg-white/10",
                  ].join(" ")}
                >
                  Iniciar demo gratis con este plan
                </Link>
              </article>
            ))}
          </div>
        </section>

        <footer
          id="contacto"
          className="grid gap-6 rounded-[2.5rem] border border-zinc-800/70 bg-[linear-gradient(180deg,rgba(15,17,21,0.92),rgba(9,9,11,0.98))] px-5 py-8 lg:grid-cols-[1fr_0.95fr] lg:px-8"
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-cyan-300">Contacto</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-white">Cierra la venta con un flujo limpio.</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-300">
              Déjanos tus datos para arrancar una demo o valida el producto con el recorrido público. FIXIE está hecho para
              verse sólido desde el primer contacto.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-zinc-800 bg-white/5 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-zinc-300">Email</span>
                <input
                  type="email"
                  className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/20"
                  placeholder={contactEmail}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-zinc-300">Teléfono</span>
                <input
                  type="tel"
                  className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/20"
                  placeholder={contactPhone ?? "55 0000 0000"}
                />
              </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href={contactEmailHref} className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-200">
                Escribir por email
              </a>
              <a href={contactPhoneHref ?? whatsappHref ?? "#contacto"} className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:border-cyan-400/30 hover:bg-white/10">
                Llamar o WhatsApp
              </a>
            </div>
          </div>
        </footer>
      </section>
    </main>
  );
}
