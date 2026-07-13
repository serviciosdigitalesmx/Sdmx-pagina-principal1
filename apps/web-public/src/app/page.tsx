import Link from "next/link";
import { optionalEnv } from "@white-label/config";
import { RootAuthHashRedirect } from "@/components/root-auth-hash-redirect";
import { resolveAdminUrl } from "@/lib/admin-url";
import { Badge } from "@white-label/ui";

const productName = optionalEnv("NEXT_PUBLIC_SAAS_BRAND_NAME") ?? "FIXI";
const brandShort = optionalEnv("NEXT_PUBLIC_SAAS_BRAND_SHORT") ?? "FX";
const hubName = optionalEnv("NEXT_PUBLIC_HUB_NAME") ?? "Hub";
const publicUrl = optionalEnv("NEXT_PUBLIC_WEB_PUBLIC_URL") ?? "https://app.serviciosdigitalesmx.online";
const adminUrl = optionalEnv("NEXT_PUBLIC_WEB_ADMIN_URL") ?? "https://admin.serviciosdigitalesmx.online";
const contactEmail = optionalEnv("NEXT_PUBLIC_SAAS_CONTACT_EMAIL") ?? "";
const contactPhone = optionalEnv("NEXT_PUBLIC_SAAS_CONTACT_PHONE") ?? "";
const adminBaseUrl = resolveAdminUrl();
const adminLoginUrl = adminBaseUrl ? `${adminBaseUrl}/login` : "/login";
const adminOnboardingUrl = adminBaseUrl ? `${adminBaseUrl}/login?mode=signup` : "/login?mode=signup";

const dashboardStats = [
  ["Ingresos del mes", "$47,350.00", "positive"],
  ["Egresos del mes", "$18,420.00", "negative"],
  ["Utilidad bruta", "$28,930.00", "positive"],
  ["Productividad", "87%", "warning"],
  ["Órdenes activas", "34", "neutral"],
  ["Stock bajo", "3 productos", "neutral"],
  ["Clientes", "156", "neutral"],
  ["Cuentas por cobrar", "$4,200.00", "neutral"],
];

const whatsappSteps = [
  ["1. Registras la orden en 30 segundos", "Nombre, equipo, problema. FIXI genera un folio único. Sin papeleo."],
  ["2. El cliente recibe su folio por WhatsApp", "Un clic. El mensaje se envía solo. El cliente sabe que su equipo está en buenas manos."],
  ["3. El cliente consulta solo, tú sigues trabajando", "Entra a tu portal, revisa su folio, ve el estado. Tú no recibes ni un mensaje más."],
];

const testimonials = [
  {
    name: "Carlos M.",
    business: "Taller Celular Express",
    city: "Guadalajara",
    quote: "Antes tenía un cliente cada semana diciendo que le rompí la pantalla. Desde que uso FIXI, cero reclamos. Tengo las fotos, la firma y la fecha.",
  },
  {
    name: "Ana L.",
    business: "TechRepair",
    city: "Ciudad de México",
    quote: "Mis clientes dejaron de escribirme a las 11 de la noche preguntando por su equipo. Ahora consultan solos y yo descanso.",
  },
  {
    name: "Luis R.",
    business: "FixIt Mobile",
    city: "Monterrey",
    quote: "Pensé que era solo para control de órdenes. No sabía que me iba a salvar de un juicio por una reparación que ni hice yo.",
  },
];

const clientLogos = ["Servicio Celular", "Fix Center", "Tecno Móvil", "Taller Digital", "Mobile Pro"];

const comparisonRows = [
  ["Reclamaciones sin respaldo", "Checklist legal con fotos y firma"],
  ["Clientes llamando todo el día", "Seguimiento automático por WhatsApp"],
  ["Excel que no cuadra", "Dashboard en tiempo real"],
  ["Pérdida de dinero por mal cobro", "Control de ingresos y egresos claro"],
];

const pricingPlans = [
  { name: "Básico", price: "$300", period: "MXN / mes", description: "1 sucursal, hasta 2 usuarios, órdenes, clientes e inventario básico." },
  {
    name: "Profesional",
    price: "$450",
    period: "MXN / mes",
    description: "Hasta 2 sucursales, 3 usuarios, landing, compras y reportes.",
    featured: true,
  },
  { name: "Empresarial", price: "$600", period: "MXN / mes", description: "Sucursales y usuarios ilimitados, con control financiero completo." },
];

const faqItems = [
  ["¿Sirve si solo tengo un local y soy yo solo?", "Sí. FIXI nació pensando en el taller de un solo dueño. Puedes empezar solo y crecer sin cambiar de sistema."],
  ["¿Mis clientes pueden ver el estado de su reparación sin llamarme?", "Sí. Cada cliente recibe un folio único y una página privada donde ve el estado de su equipo. Tú no haces nada extra."],
  ["¿Se ve mi marca o se ve FIXI?", "Tu logo, tus colores, tu nombre. FIXI trabaja detrás. El cliente ve tu taller, no nosotros."],
  ["¿Tengo que cambiar cómo trabajo actualmente?", "No. Si usas WhatsApp, libreta o Excel, FIXI se adapta a ti. No al revés. Migras cuando quieras, no hay presión."],
  ["¿Qué pasa si no me gusta después de probarlo?", "Cancelas desde tu cuenta. Sin llamar a nadie. Sin preguntas incómodas. Tu dinero de vuelta en 48 horas."],
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <Badge variant="neutral">{children}</Badge>;
}

function CTA({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const base = "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-200";
  const className =
    variant === "primary"
      ? `${base} border border-amber-300/30 bg-amber-400 text-slate-950 shadow-[0_18px_40px_rgba(251,191,36,0.2)] hover:-translate-y-0.5 hover:bg-amber-300`
      : `${base} border border-white/12 bg-white/5 text-slate-100 hover:-translate-y-0.5 hover:bg-white/10`;
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-200">{children}</span>;
}

function FlowIllustration() {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
      <svg viewBox="0 0 520 220" className="h-48 w-full" role="img" aria-label="Ilustración del flujo de recepción a WhatsApp y portal">
        <defs>
          <linearGradient id="flowLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        <rect x="18" y="18" width="140" height="184" rx="24" fill="#0b1220" stroke="rgba(255,255,255,0.12)" />
        <rect x="190" y="18" width="140" height="184" rx="24" fill="#0b1220" stroke="rgba(255,255,255,0.12)" />
        <rect x="362" y="18" width="140" height="184" rx="24" fill="#0b1220" stroke="rgba(255,255,255,0.12)" />
        <path d="M166 110H186M338 110H358" stroke="url(#flowLine)" strokeWidth="5" strokeLinecap="round" />
        <circle cx="90" cy="76" r="26" fill="rgba(56,189,248,0.16)" stroke="#38bdf8" />
        <circle cx="262" cy="76" r="26" fill="rgba(245,158,11,0.16)" stroke="#f59e0b" />
        <circle cx="434" cy="76" r="26" fill="rgba(34,197,94,0.16)" stroke="#22c55e" />
        <rect x="52" y="130" width="76" height="10" rx="5" fill="rgba(255,255,255,0.18)" />
        <rect x="224" y="130" width="76" height="10" rx="5" fill="rgba(255,255,255,0.18)" />
        <rect x="396" y="130" width="76" height="10" rx="5" fill="rgba(255,255,255,0.18)" />
        <text x="90" y="172" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontWeight="700">Recepción</text>
        <text x="262" y="172" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontWeight="700">WhatsApp</text>
        <text x="434" y="172" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontWeight="700">Portal</text>
      </svg>
    </div>
  );
}

function TrustIllustration() {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
      <svg viewBox="0 0 520 180" className="h-40 w-full" role="img" aria-label="Ilustración de métricas de confianza">
        <rect x="12" y="12" width="496" height="156" rx="24" fill="#0b1220" stroke="rgba(255,255,255,0.12)" />
        <path d="M52 128C112 94 138 110 176 84C214 58 244 70 282 54C320 38 350 54 402 40C440 30 464 34 476 28" fill="none" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
        <circle cx="176" cy="84" r="7" fill="#38bdf8" />
        <circle cx="282" cy="54" r="7" fill="#f59e0b" />
        <circle cx="402" cy="40" r="7" fill="#22c55e" />
        <text x="52" y="154" fill="#cbd5e1" fontSize="13" fontWeight="700">50,000+ órdenes</text>
        <text x="202" y="154" fill="#cbd5e1" fontSize="13" fontWeight="700">200+ talleres</text>
        <text x="360" y="154" fill="#cbd5e1" fontSize="13" fontWeight="700">98% menos reclamos</text>
      </svg>
    </div>
  );
}

function ProductMockup() {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.96))] p-4 shadow-[0_24px_80px_rgba(15,23,42,0.45)]">
      <div className="rounded-[1.4rem] border border-white/10 bg-[#08111f] p-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-sky-300/75">{hubName} / Live</p>
            <p className="mt-1 text-xl font-black tracking-tight text-white">Tu taller, sin caos</p>
          </div>
          <div className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">Activo</div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-sky-300/75">Mañana en el taller</p>
            <div className="mt-4 grid gap-3">
              {dashboardStats.slice(0, 4).map(([label, value, tone]) => (
                <div key={label} className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
                  <span className="text-sm text-slate-300">{label}</span>
                  <span className={`text-sm font-semibold ${tone === "positive" ? "text-emerald-400" : tone === "negative" ? "text-rose-400" : tone === "warning" ? "text-amber-300" : "text-sky-200"}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-sky-300/75">Flujo de trabajo</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">Registrar orden, enviar por WhatsApp y dejar el portal listo para el cliente final.</p>
            </div>
            <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-sky-300/75">Seguridad</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">Datos encriptados, respaldo legal y trazabilidad por orden.</p>
            </div>
            <FlowIllustration />
            <div className="rounded-[1.4rem] border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-sky-300/75">Cliente consulta</p>
              <div className="mt-3 rounded-[1.2rem] border border-white/10 bg-slate-950/80 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Portal móvil</p>
                <div className="mt-3 h-28 rounded-[1rem] bg-[linear-gradient(135deg,rgba(59,130,246,0.22),rgba(16,185,129,0.1))] p-3">
                  <div className="h-full rounded-[0.85rem] border border-white/10 bg-slate-950/70 p-3">
                    <p className="text-xs text-slate-400">Folio SRF-MQV0ISEK</p>
                    <p className="mt-2 text-sm font-semibold text-white">En reparación</p>
                    <div className="mt-3 h-2 rounded-full bg-white/10">
                      <div className="h-2 w-2/3 rounded-full bg-amber-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialProof() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
        <p className="text-xs uppercase tracking-[0.28em] text-sky-300/75">Talleres que ya usan FIXI</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {clientLogos.map((logo) => (
            <div key={logo} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-center text-sm font-semibold text-slate-200">
              {logo}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <SectionLabel>Prueba social</SectionLabel>
          <h3 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">Más de 50,000 órdenes gestionadas · 200+ talleres activos · 98% reducción en reclamos documentados</h3>
          <p className="mt-4 text-base leading-8 text-slate-300">La confianza no se promete. Se muestra con resultados, contexto real y señales claras de operación.</p>
          <div className="mt-5">
            <TrustIllustration />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {["50,000+ órdenes", "200+ talleres activos", "98% menos reclamos"].map((metric) => (
              <div key={metric} className="rounded-[1.2rem] border border-white/10 bg-black/20 p-4 text-sm font-semibold text-white">
                {metric}
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3 text-xs text-slate-400">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Datos encriptados</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Cumplimiento legal mexicano</span>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.name} className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.96))] p-5">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-full border border-white/10 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.35),transparent_30%),linear-gradient(135deg,#0ea5e9,#22c55e)]" />
                <div>
                  <p className="font-semibold text-white">{item.name}</p>
                  <p className="text-sm text-slate-400">{item.business} · {item.city}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-300">{item.quote}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function StickyBar() {
  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-sky-500/15 text-sm font-black text-sky-100">{brandShort.slice(0, 2)}</div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-sky-300/75">FIXI</p>
            <p className="text-sm font-semibold text-white">Software para talleres de reparación</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="#precios" className="hidden text-sm text-slate-300 transition hover:text-white sm:inline">
            Precios
          </Link>
          <CTA href={adminOnboardingUrl}>Empieza tu prueba gratis de 14 días</CTA>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: productName,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Software para talleres de reparación con control de órdenes, seguimiento por WhatsApp, portal del cliente y respaldo legal.",
    offers: {
      "@type": "Offer",
      price: "300",
      priceCurrency: "MXN",
    },
    featureList: [
      "Control de órdenes",
      "Seguimiento por WhatsApp",
      "Portal del cliente",
      "Checklist legal",
      "Dashboard en tiempo real",
    ],
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.16),_transparent_28%),radial-gradient(circle_at_80%_10%,_rgba(251,191,36,0.08),_transparent_24%),linear-gradient(180deg,#050608_0%,#09090b_46%,#0f1117_100%)] text-slate-100">
      <RootAuthHashRedirect />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <StickyBar />

      <section className="mx-auto w-full max-w-7xl px-4 pb-10 pt-8 sm:px-6 lg:px-8 lg:pt-12">
        <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div className="space-y-7">
            <Pill>Sin tarjeta de crédito · Configuración en 5 min · Cancela cuando quieras</Pill>
            <div className="space-y-5">
              <h1 className="max-w-2xl text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
                FIXI — El software que protege tu taller antes de que el cliente reclame
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                Cada reparación documentada. Cada cliente informado. Cada peso controlado.
              </p>
              <p className="max-w-2xl text-base leading-8 text-slate-300">¿Y si el cliente dice que le rompiste la pantalla? Con FIXI, eso ya no es tu problema.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <CTA href={adminOnboardingUrl}>Empieza tu prueba gratis de 14 días</CTA>
              <CTA href={adminLoginUrl} variant="secondary">
                Ver cómo funciona (2 min)
              </CTA>
              <Link href="#comparativa" className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10">
                Ver comparativa
              </Link>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-slate-400">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">14 días gratis, sin tarjeta</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Datos encriptados</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">+200 talleres en México</span>
            </div>
          </div>

          <ProductMockup />
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Dolor", "¿Y si el cliente dice que le rompiste la pantalla?"],
            ["Solución", "FIXI guarda fotos, firmas y seguimiento por cada orden."],
            ["Resultado", "Menos reclamos, menos llamadas y más claridad para cobrar."],
          ].map(([title, copy]) => (
            <div key={title} className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-sky-300/80">{title}</p>
              <p className="mt-3 text-base leading-7 text-slate-200">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="dashboard" className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="space-y-4">
            <SectionLabel>Tu mañana en el taller</SectionLabel>
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">Despierta sabiendo exactamente cómo amaneció tu negocio</h2>
            <p className="max-w-xl text-base leading-8 text-slate-300">¿Cuánto entró ayer? ¿Cuánto salió? ¿Te quedó algo? Una pantalla. Toda la verdad.</p>
            <p className="max-w-xl text-sm leading-7 text-slate-400">Tus números se actualizan solos. Tú solo tienes que mirarlos. ¿Tienes 2, 3 o 5 sucursales? Cambia de taller con un clic. Los datos nunca se mezclan.</p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.96))] p-5 shadow-[0_24px_80px_rgba(37,99,235,0.14)]">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {dashboardStats.map(([label, value, tone]) => (
                <div key={label} className="rounded-[1.2rem] border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</p>
                  <p className={`mt-3 text-3xl font-black tracking-tight ${tone === "positive" ? "text-emerald-400" : tone === "negative" ? "text-rose-400" : tone === "warning" ? "text-amber-300" : "text-white"}`}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="whatsapp" className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <SectionLabel>Seguimiento automático</SectionLabel>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">Tu cliente deja de llamarte. Y tú dejas de perder tiempo.</h2>
            <p className="mt-4 max-w-xl text-base leading-8 text-slate-300">El seguimiento automático que tus clientes ya quieren.</p>
            <div className="mt-5 space-y-3">
              {whatsappSteps.map(([title, copy]) => (
                <div key={title} className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
                  <p className="font-semibold text-white">{title}</p>
                  <p className="mt-1 text-sm leading-7 text-slate-400">{copy}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-sky-400/25 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.96))] p-6 shadow-[0_24px_80px_rgba(37,99,235,0.14)]">
            <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-sky-300/80">Mensaje generado</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Hola Juan, tu iPhone 14 fue recibido en Taller Digital MX. Tu folio es <span className="text-white">SRF-MQV0ISEK</span>. Consulta el estado aquí: fixi.mx/srf-mqv0isek
              </p>
              <div className="mt-4 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-center text-sm font-semibold text-emerald-200">📱 Enviar notificación ahora</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <SectionLabel>Recepción legal</SectionLabel>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">Recepción con respaldo legal. Porque la palabra no alcanza.</h2>
            <p className="mt-4 max-w-xl text-base leading-8 text-slate-300">Cuando el cliente diga &quot;me lo entregaron roto&quot;, tú muestras las fotos, el checklist y su firma. Fin de la discusión.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                "✓ Estado físico del equipo (fotografiado)",
                "✓ Daños preexistentes documentados",
                "✓ Accesorios entregados (cargador, funda, chip)",
                "✓ Firma digital del cliente con fecha y hora",
              ].map((item) => (
                <div key={item} className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
                  <p className="text-sm font-semibold text-white">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.96))] p-6 shadow-[0_24px_80px_rgba(37,99,235,0.14)]">
            <div className="rounded-[1.6rem] border border-white/10 bg-black/20 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-sky-300/80">Módulos visibles</p>
              <p className="mt-3 text-2xl font-black tracking-tight text-white">Hub, recepción y portal del cliente</p>
              <div className="mt-5 grid gap-3">
                {[
                  "iPhone 14 Pro — Registrado",
                  "Checklist de recepción — Completado",
                  "Condición física — Documentada con 4 fotos",
                  "Daños previos — Reportados por cliente",
                  "Accesorios — Cargador + funda",
                  "Firma del cliente — 01/07/2026 10:30 a.m.",
                ].map((label) => (
                  <div key={label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <span className="text-sm text-slate-300">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <SocialProof />

      <section id="comparativa" className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <SectionLabel>Comparativa</SectionLabel>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">Antes y después de FIXI.</h2>
          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/10">
            <div className="grid grid-cols-2 bg-black/30 px-4 py-3 text-xs uppercase tracking-[0.28em] text-slate-400">
              <div>Sin FIXI</div>
              <div>Con FIXI</div>
            </div>
            {comparisonRows.map(([left, right]) => (
              <div key={left} className="grid grid-cols-2 gap-4 border-t border-white/10 bg-black/15 px-4 py-4 text-sm text-slate-200">
                <div>{left}</div>
                <div>{right}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="precios" className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SectionLabel>Planes</SectionLabel>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">Precios que entiende cualquier taller</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-400">Sin letras chiquitas. Sin sorpresas. Paga lo que usas.</p>
        </div>
          <div className="mt-8 grid gap-5 xl:grid-cols-3">
          {pricingPlans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-[2rem] border p-6 ${plan.featured ? "border-amber-300/40 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.96))] shadow-[0_24px_80px_rgba(251,191,36,0.08)]" : "border-white/10 bg-white/5"}`}
            >
              {plan.name === "Profesional" ? <Pill>⭐ El preferido por talleres en crecimiento</Pill> : null}
              <h3 className="mt-4 text-2xl font-semibold text-white">{plan.name}</h3>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-5xl font-black tracking-tight text-white">{plan.price}</span>
                <span className="pb-1 text-sm text-slate-400">{plan.period}</span>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-400">{plan.description}</p>
              <div className="mt-6">
                <CTA href={plan.name === "Empresarial" ? adminLoginUrl : adminOnboardingUrl} variant={plan.name === "Profesional" ? "primary" : "secondary"}>
                  {plan.name === "Negocio" ? "Hablar con ventas" : "Empieza gratis"}
                </CTA>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 lg:grid-cols-[0.8fr_1.2fr] lg:p-8">
          <div>
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-white">Preguntas que otros dueños de taller ya hicieron</h2>
            <p className="mt-4 text-base leading-8 text-slate-300">Respuestas directas. Sin vueltas.</p>
          </div>
          <div className="grid gap-3">
            {faqItems.map(([question, answer]) => (
              <details key={question} className="group rounded-[1.4rem] border border-white/10 bg-black/20 p-4">
                <summary className="cursor-pointer list-none text-sm font-semibold text-white">{question}</summary>
                <p className="mt-3 text-sm leading-7 text-slate-400">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(2,6,23,0.96))] p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <SectionLabel>Listo para operar</SectionLabel>
              <p className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">Tu taller ya debería estar así de organizado</p>
              <p className="mt-4 text-base leading-8 text-slate-300">Deja de vivir con el miedo a reclamos. Deja de perder tiempo en llamadas. Deja de adivinar tus números.</p>
              <p className="mt-4 text-base leading-8 text-slate-300">Empieza hoy. Configura tu taller en 5 minutos. Prueba 14 días gratis. Si no te convence, te vas sin deber nada.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <CTA href={adminOnboardingUrl}>Empieza tu prueba gratis de 14 días</CTA>
              <CTA href={adminLoginUrl} variant="secondary">
                O agenda una demo de 10 min con nuestro equipo
              </CTA>
            </div>
          </div>
        </div>
      </section>

      <footer id="contacto" className="mx-auto w-full max-w-7xl px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
          <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr] sm:items-start">
            <div>
              <p className="text-xl font-black tracking-tight text-white">FIXI</p>
              <p className="mt-2 text-sm text-slate-300">Software para talleres de reparación en México</p>
            </div>
            <div className="rounded-[1.2rem] border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
              <p>¿Dudas? Configura tu WhatsApp o correo desde el panel para mostrar un contacto real.</p>
              <p className="mt-1">No mostramos teléfonos inventados en la landing pública.</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Web pública", publicUrl || "No configurada"],
              ["Panel administrativo", adminUrl || "No configurado"],
              ["Correo", contactEmail || "No configurado"],
              ["WhatsApp", contactPhone || "No configurado"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
                <p className="text-[11px] uppercase tracking-[0.28em] text-sky-300/80">{label}</p>
                <p className="mt-2 text-sm font-medium text-white">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>Términos de servicio · Política de privacidad · Aviso de cookies</p>
            <p>© 2026 FIXI. Hecho para talleres de México.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
