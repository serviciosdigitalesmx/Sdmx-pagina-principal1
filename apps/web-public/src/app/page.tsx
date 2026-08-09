import Link from "next/link";
import { optionalEnv } from "@white-label/config";
import { RootAuthHashRedirect } from "@/components/root-auth-hash-redirect";
import { resolveAdminUrl } from "@/lib/admin-url";

const productName = optionalEnv("NEXT_PUBLIC_SAAS_BRAND_NAME") ?? "FIXI";
const publicUrl = optionalEnv("NEXT_PUBLIC_WEB_PUBLIC_URL") ?? "https://serviciosdigitalesmx.online";
const adminBaseUrl = resolveAdminUrl();
const adminLoginUrl = adminBaseUrl ? `${adminBaseUrl}/login` : "/login";
const adminOnboardingUrl = adminBaseUrl ? `${adminBaseUrl}/login?mode=signup` : "/login?mode=signup";

const workflow = [
  {
    number: "01",
    title: "Recibe con evidencia",
    copy: "Crea la orden, registra el equipo, documenta su condición y deja el checklist en el mismo expediente.",
    tags: ["Ficha editable", "Fotos", "Checklist"],
  },
  {
    number: "02",
    title: "Opera sin perder contexto",
    copy: "Recepción, técnicos y administración trabajan sobre la misma orden y su historial de movimientos.",
    tags: ["Estados", "Tareas", "Trazabilidad"],
  },
  {
    number: "03",
    title: "Mantén informado al cliente",
    copy: "Comparte por WhatsApp el acceso correcto al portal para que consulte avances y documentos de su servicio.",
    tags: ["WhatsApp", "Portal", "Documentos"],
  },
];

const capabilityGroups = [
  {
    label: "Operación",
    title: "Cada orden tiene una historia completa.",
    copy: "Solicitudes, recepción, diagnóstico, seguimiento, garantía y cierre conectados a la misma orden.",
    items: ["Órdenes y solicitudes", "Clientes y activos", "Tareas y garantías", "Archivo y documentos"],
  },
  {
    label: "Control",
    title: "Las decisiones salen del taller, no de una hoja aparte.",
    copy: "Existencias, proveedores, compras, gastos y reportes se organizan dentro de la operación del tenant.",
    items: ["Stock por sucursal", "Proveedores y compras", "Gastos y finanzas", "Reportes operativos"],
  },
  {
    label: "Relación",
    title: "Tu cliente ve tu marca y su servicio.",
    copy: "El portal mantiene informado al cliente y los planes superiores añaden una landing configurable con la identidad del negocio.",
    items: ["Landing del taller", "Portal del cliente", "Contacto por WhatsApp", "Configuración por tenant"],
  },
];

const planRows = [
  { label: "Usuarios incluidos", basic: "2", pro: "5", scale: "Ilimitados" },
  { label: "Sucursales", basic: "1", pro: "2", scale: "Ilimitadas" },
  { label: "Órdenes mensuales", basic: "50", pro: "500", scale: "Ilimitadas" },
  { label: "Almacenamiento", basic: "2 GB", pro: "10 GB", scale: "100 GB" },
  { label: "Integración con WhatsApp", basic: "Sin límite", pro: "Sin límite", scale: "Sin límite" },
  { label: "PDFs y comprobantes", basic: "Incluidos", pro: "Incluidos", scale: "Incluidos" },
  { label: "Seguimiento para clientes", basic: "Incluido", pro: "Incluido", scale: "Incluido" },
  { label: "Landing pública del taller", basic: "—", pro: "Incluida", scale: "Incluida" },
  { label: "Logo y branding personalizados", basic: "—", pro: "Incluidos", scale: "Incluidos" },
  { label: "Control de refacciones", basic: "Incluido", pro: "Incluido", scale: "Incluido" },
  { label: "Control de compras y gastos", basic: "—", pro: "Incluido", scale: "Incluido" },
  { label: "Indicadores del negocio", basic: "Resumen", pro: "Reportes", scale: "Reportes + finanzas" },
  { label: "Administración de usuarios y roles", basic: "—", pro: "Incluida", scale: "Incluida" },
  { label: "Finanzas completas", basic: "—", pro: "—", scale: "Incluidas" },
];

const pricingPlans = [
  {
    key: "basic",
    name: "Básico",
    price: "$300",
    eyebrow: "Para un taller pequeño",
    description: "Recibe equipos, organiza órdenes y mantén informado al cliente.",
    summary: ["1 sucursal y 2 usuarios", "50 órdenes al mes", "WhatsApp y portal incluidos"],
  },
  {
    key: "pro",
    name: "Profesional",
    price: "$450",
    eyebrow: "Para un taller creciendo",
    description: "Controla compras, gastos y reportes mientras coordinas más personal.",
    summary: ["2 sucursales y 5 usuarios", "500 órdenes al mes", "Landing pública y branding", "Compras, gastos y reportes"],
    featured: true,
  },
  {
    key: "scale",
    name: "Empresarial",
    price: "$600",
    eyebrow: "Para un taller establecido",
    description: "La operación completa con capacidad ilimitada y control financiero.",
    summary: ["Sucursales y usuarios ilimitados", "Órdenes ilimitadas", "Seguridad y finanzas completas"],
  },
];

const comparisons = [
  ["La condición del equipo queda en mensajes sueltos", "Fotos, checklist y documentos viven en la orden"],
  ["El cliente llama para preguntar por cada avance", "El cliente consulta el portal de su taller"],
  ["Cada persona lleva su propia versión del trabajo", "El equipo comparte estados, tareas e historial"],
  ["Los números se reconstruyen al final del mes", "La operación alimenta reportes y finanzas"],
];

const faqs = [
  ["¿Puedo probar FIXI antes de elegir un plan?", "Sí. El registro inicia una prueba para que recorras el flujo operativo antes de decidir qué plan necesita tu taller."],
  ["¿La landing y el portal tienen la marca de mi taller?", "El Portal del cliente muestra la identidad básica del taller en todos los planes. Desde Profesional puedes publicar una landing y personalizar logo, servicios, ubicación y presencia pública."],
  ["¿El cliente necesita instalar una aplicación?", "No. El seguimiento público se consulta desde un enlace web compartido por el taller."],
  ["¿Puedo cambiar de plan cuando crezca?", "Sí. Los planes están organizados por capacidad de usuarios, sucursales, órdenes, almacenamiento y módulos operativos."],
  ["¿La información de distintos talleres se mezcla?", "No. FIXI opera con información y configuración separadas por tenant."],
];

function BrandMark() {
  return (
    <span className="fx-brand-mark" aria-hidden="true">
      <span>F</span>
      <i />
    </span>
  );
}

function Arrow() {
  return <span aria-hidden="true" className="fx-arrow">↗</span>;
}

function SectionKicker({ children }: { children: React.ReactNode }) {
  return <p className="fx-kicker">{children}</p>;
}

function ProductMap() {
  return (
    <div className="fx-product-map" aria-label="Mapa visual de los módulos de FIXI">
      <div className="fx-product-map-bar">
        <div className="fx-mini-brand"><BrandMark /><b>FIXI</b></div>
        <span>Operación del taller</span>
        <i><span />Tenant activo</i>
      </div>
      <div className="fx-product-map-body">
        <div className="fx-product-map-nav" aria-hidden="true">
          <span className="is-active">Resumen</span>
          <span>Recepción</span>
          <span>Técnico</span>
          <span>Clientes</span>
          <span>Stock</span>
          <span>Reportes</span>
        </div>
        <div className="fx-product-map-main">
          <div className="fx-map-heading">
            <div><small>FLUJO CONECTADO</small><strong>Una orden. Todo el contexto.</strong></div>
            <span>Nueva orden <Arrow /></span>
          </div>
          <div className="fx-map-steps">
            <article><i>01</i><small>RECEPCIÓN</small><b>Condición y evidencia</b><span className="is-complete">Listo</span></article>
            <article><i>02</i><small>OPERACIÓN</small><b>Estado y responsable</b><span>En curso</span></article>
            <article><i>03</i><small>CLIENTE</small><b>Portal y documentos</b><span>Conectado</span></article>
          </div>
          <div className="fx-map-detail">
            <div className="fx-map-detail-title"><span>Expediente de servicio</span><b>Historial disponible</b></div>
            <div className="fx-map-detail-grid">
              <span><i>✓</i>Datos del equipo</span>
              <span><i>✓</i>Checklist de recepción</span>
              <span><i>✓</i>Evidencia fotográfica</span>
              <span><i>✓</i>Seguimiento del cliente</span>
            </div>
          </div>
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
    description: "Software para talleres de reparación con órdenes, evidencia, seguimiento al cliente y operación separada por tenant.",
    offers: { "@type": "AggregateOffer", lowPrice: "300", highPrice: "600", priceCurrency: "MXN" },
  };

  return (
    <main className="fx-site">
      <RootAuthHashRedirect />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="fx-announcement">
        <span>Prueba FIXI con el flujo completo</span>
        <Link href={adminOnboardingUrl}>Crear mi taller <Arrow /></Link>
      </div>

      <header className="fx-header">
        <Link href="#inicio" className="fx-logo" aria-label="Ir al inicio de FIXI"><BrandMark /><span>FIXI</span></Link>
        <nav aria-label="Navegación principal">
          <Link href="#como-funciona">Cómo funciona</Link>
          <Link href="#producto">Producto</Link>
          <Link href="#descargar-app">Descargar App</Link>
          <Link href="#planes">Planes</Link>
          <Link href="#preguntas">Preguntas</Link>
        </nav>
        <div className="fx-header-actions">
          <a href="/fixi-app.apk" download="fixi-app.apk" className="fx-outline-button fx-button-small" style={{ borderColor: 'rgba(38,210,216,0.4)', color: '#26d2d8' }}>Descargar APK 📱</a>
          <Link href={adminLoginUrl} className="fx-login">Iniciar sesión</Link>
          <Link href={adminOnboardingUrl} className="fx-button fx-button-small">Probar gratis <Arrow /></Link>
        </div>
      </header>

      <section id="inicio" className="fx-hero">
        <div className="fx-hero-copy">
          <SectionKicker>Software para talleres de reparación</SectionKicker>
          <h1>Cuando un cliente reclama, <em>tu taller tiene cómo responder.</em></h1>
          <p>FIXI reúne órdenes, fotos, checklist, documentos y seguimiento del cliente para que cada servicio tenga contexto desde la recepción hasta la entrega.</p>
          <div className="fx-hero-actions">
            <Link href={adminOnboardingUrl} className="fx-button fx-button-large">Empezar prueba gratis <Arrow /></Link>
            <Link href="#como-funciona" className="fx-text-link">Ver cómo funciona <span aria-hidden="true">↓</span></Link>
          </div>
          <div className="fx-trust-line" aria-label="Ventajas de la prueba">
            <span><i>✓</i>Sin tarjeta para empezar</span>
            <span><i>✓</i>Configuración guiada</span>
            <span><i>✓</i>Cancela cuando quieras</span>
          </div>
        </div>
        <div className="fx-hero-visual">
          <div className="fx-visual-glow" />
          <ProductMap />
          <div className="fx-proof-note fx-proof-note-left"><span>✓</span><div><b>Evidencia organizada</b><small>Dentro de cada orden</small></div></div>
          <div className="fx-proof-note fx-proof-note-right"><span>↗</span><div><b>Portal conectado</b><small>Con la marca del taller</small></div></div>
        </div>
      </section>

      <section className="fx-value-strip" aria-label="Áreas cubiertas por FIXI">
        <span>Recepción</span><i />
        <span>Operación</span><i />
        <span>Clientes</span><i />
        <span>Inventario</span><i />
        <span>Finanzas</span><i />
        <span>Portal</span>
      </section>

      <section id="como-funciona" className="fx-workflow-section">
        <div className="fx-section-heading">
          <div><SectionKicker>Así trabaja FIXI</SectionKicker><h2>Tres momentos.<br />Un solo expediente.</h2></div>
          <p>La información se captura donde nace y acompaña al equipo durante todo el servicio.</p>
        </div>
        <div className="fx-workflow-grid">
          {workflow.map((step) => (
            <article key={step.number}>
              <div className="fx-step-top"><span>{step.number}</span><i /></div>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
              <div>{step.tags.map((tag) => <small key={tag}>{tag}</small>)}</div>
            </article>
          ))}
        </div>
        <div className="fx-workflow-cta"><p>El resultado: menos información perdida y una operación que se puede revisar.</p><Link href={adminOnboardingUrl} className="fx-text-link fx-text-link-light">Quiero probar el flujo <Arrow /></Link></div>
      </section>

      <section className="fx-comparison-section">
        <div className="fx-comparison-copy"><SectionKicker>El costo del desorden</SectionKicker><h2>No necesitas trabajar más.<br />Necesitas dejar de reconstruir lo que pasó.</h2><p>FIXI convierte cada interacción del taller en información consultable para el equipo y para el cliente.</p></div>
        <div className="fx-comparison-table">
          <div className="fx-comparison-header"><span>Sin un sistema conectado</span><span>Con FIXI</span></div>
          {comparisons.map(([before, after]) => <div className="fx-comparison-row" key={before}><p><i>×</i>{before}</p><p><i>✓</i>{after}</p></div>)}
        </div>
      </section>

      <section id="producto" className="fx-capabilities-section">
        <div className="fx-section-heading fx-section-heading-dark">
          <div><SectionKicker>Todo el taller conectado</SectionKicker><h2>Una plataforma que sí refleja<br />cómo opera tu negocio.</h2></div>
          <p>Activa la capacidad que tu plan incluye sin cambiar de herramienta ni duplicar información.</p>
        </div>
        <div className="fx-capability-grid">
          {capabilityGroups.map((group, index) => (
            <article key={group.label}>
              <div className="fx-capability-index">0{index + 1}</div>
              <SectionKicker>{group.label}</SectionKicker>
              <h3>{group.title}</h3>
              <p>{group.copy}</p>
              <ul>{group.items.map((item) => <li key={item}><span>+</span>{item}</li>)}</ul>
            </article>
          ))}
        </div>
        <div className="fx-tenant-callout">
          <div><span className="fx-tenant-icon">T</span><div><b>Tu negocio al frente</b><p>Portal con identidad básica en todos los planes; landing, logo y branding desde Profesional.</p></div></div>
          <Link href={adminOnboardingUrl} className="fx-outline-button fx-outline-button-dark">Crear mi espacio <Arrow /></Link>
        </div>
      </section>

      <section id="descargar-app" className="fx-apk-download-section" style={{ padding: '80px 0', background: 'linear-gradient(135deg, #091629 0%, #0d223f 100%)', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'white' }}>
        <div style={{ width: 'min(1240px, calc(100% - 48px))', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center' }}>
          <div>
            <SectionKicker>APLICACIÓN NATIVA ANDROID</SectionKicker>
            <h2 style={{ color: 'white', margin: '12px 0 16px', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: '600', letterSpacing: '-0.05em' }}>
              Lleva FIXI en tu smartphone Motorola o Android 📲
            </h2>
            <p style={{ color: '#a0b3c6', fontSize: '16px', lineHeight: '1.6', marginBottom: '28px' }}>
              Gestiona recepciones de equipo, estados de trabajo, catálogos y perfil de taller directamente desde la App nativa rápida e interactiva.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
              <a 
                href="/fixi-app.apk" 
                download="fixi-app.apk" 
                className="fx-button fx-button-large" 
                style={{ background: 'linear-gradient(135deg, #257df3, #26d2d8)' }}
              >
                Descargar APK Directo <Arrow />
              </a>
              <span style={{ fontSize: '13px', color: '#6be4ea', fontWeight: '600' }}>
                ✓ Versión Android Nativa (.apk)
              </span>
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '30px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #257df3, #26d2d8)', display: 'grid', placeItems: 'center', fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
                📱
              </div>
              <div>
                <h3 style={{ margin: 0, color: 'white', fontSize: '18px' }}>FIXI Mobile for Android</h3>
                <small style={{ color: '#7e96b0' }}>Versión 1.0 Native Jetpack Compose</small>
              </div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '12px', color: '#c2d4e5', fontSize: '14px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><i style={{ color: '#26d2d8', fontStyle: 'normal' }}>✓</i> Recepción Express de órdenes con + FAB</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><i style={{ color: '#26d2d8', fontStyle: 'normal' }}>✓</i> Conexión directa a Supabase y Backend</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><i style={{ color: '#26d2d8', fontStyle: 'normal' }}>✓</i> Catálogo de familias, marcas y fallas</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><i style={{ color: '#26d2d8', fontStyle: 'normal' }}>✓</i> Actualización de estados en tiempo real</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="planes" className="fx-pricing-section">
        <div className="fx-pricing-intro">
          <div><SectionKicker>Precios transparentes</SectionKicker><h2>Elige por capacidad,<br />no por letras chiquitas.</h2></div>
          <p>Todos los planes incluyen el núcleo operativo, documentos, Portal del cliente y contacto por WhatsApp. La Landing pública y el branding personalizado comienzan en Profesional.</p>
        </div>
        <div className="fx-pricing-grid">
          {pricingPlans.map((plan) => (
            <article className={plan.featured ? "is-featured" : ""} key={plan.key}>
              {plan.featured && <span className="fx-popular">Recomendado</span>}
              <p className="fx-plan-eyebrow">{plan.eyebrow}</p>
              <h3>{plan.name}</h3>
              <p className="fx-plan-description">{plan.description}</p>
              <div className="fx-price"><b>{plan.price}</b><span>MXN<br />por mes</span></div>
              <ul>{plan.summary.map((feature) => <li key={feature}><i>✓</i>{feature}</li>)}</ul>
              <Link href={adminOnboardingUrl} className={plan.featured ? "fx-button" : "fx-outline-button"}>Elegir {plan.name} <Arrow /></Link>
            </article>
          ))}
        </div>

        <div className="fx-plan-comparison" role="region" aria-label="Comparación completa de planes" tabIndex={0}>
          <div className="fx-plan-row fx-plan-row-header"><b>Todo lo que incluye</b><span>Básico</span><span>Profesional</span><span>Empresarial</span></div>
          {planRows.map((row) => (
            <div className="fx-plan-row" key={row.label}><b>{row.label}</b><span>{row.basic}</span><span>{row.pro}</span><span>{row.scale}</span></div>
          ))}
        </div>
        <p className="fx-plan-note">Los límites mostrados corresponden a la configuración vigente de planes en FIXI.</p>
      </section>

      <section id="preguntas" className="fx-faq-section">
        <div className="fx-faq-heading"><SectionKicker>Preguntas frecuentes</SectionKicker><h2>Lo importante,<br />antes de empezar.</h2><p>Si necesitas revisar un caso particular de tu taller, crea tu cuenta y recorre primero el flujo real.</p></div>
        <div className="fx-faq-list">
          {faqs.map(([question, answer], index) => <details key={question} open={index === 0}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}
        </div>
      </section>

      <section className="fx-final-cta">
        <div className="fx-final-cta-mark"><BrandMark /></div>
        <SectionKicker>Tu próxima recepción puede quedar completa</SectionKicker>
        <h2>Deja de perseguir información.<br />Haz que la orden la conserve.</h2>
        <p>Abre tu taller en FIXI, configura tu operación y prueba el flujo antes de elegir un plan.</p>
        <Link href={adminOnboardingUrl} className="fx-button fx-button-light fx-button-large">Crear mi taller gratis <Arrow /></Link>
        <small>Sin tarjeta para empezar · Configuración guiada</small>
      </section>

      <footer id="contacto" className="fx-footer">
        <div className="fx-footer-brand"><Link href="#inicio" className="fx-logo fx-logo-light"><BrandMark /><span>FIXI</span></Link><p>Software operativo para talleres de reparación.</p></div>
        <div><p className="fx-footer-label">PRODUCTO</p><Link href="#como-funciona">Cómo funciona</Link><Link href="#producto">Plataforma</Link><Link href="#descargar-app">Descargar App (APK)</Link><Link href="#planes">Planes</Link></div>
        <div><p className="fx-footer-label">ACCESO</p><Link href={adminLoginUrl}>Iniciar sesión</Link><Link href={adminOnboardingUrl}>Crear taller</Link><a href={publicUrl}>Sitio público</a></div>
        <div className="fx-footer-note"><p>Información y configuración separadas por tenant para que cada taller opere con su propia identidad.</p></div>
        <div className="fx-footer-bottom"><span>© 2026 FIXI</span><span>Hecho para talleres que quieren operar con claridad.</span></div>
      </footer>

      <div className="fx-mobile-cta"><Link href={adminOnboardingUrl}>Probar FIXI gratis <Arrow /></Link></div>
    </main>
  );
}
