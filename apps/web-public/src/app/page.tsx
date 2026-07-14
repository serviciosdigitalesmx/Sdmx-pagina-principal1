import Link from "next/link";
import { optionalEnv } from "@white-label/config";
import { RootAuthHashRedirect } from "@/components/root-auth-hash-redirect";
import { resolveAdminUrl } from "@/lib/admin-url";

const productName = optionalEnv("NEXT_PUBLIC_SAAS_BRAND_NAME") ?? "FIXI";
const publicUrl = optionalEnv("NEXT_PUBLIC_WEB_PUBLIC_URL") ?? "https://serviciosdigitalesmx.online";
const adminBaseUrl = resolveAdminUrl();
const adminLoginUrl = adminBaseUrl ? `${adminBaseUrl}/login` : "/login";
const adminOnboardingUrl = adminBaseUrl ? `${adminBaseUrl}/login?mode=signup` : "/login?mode=signup";

const productTabs = [
  { label: "Recepción", eyebrow: "Entrada sin discusiones", title: "Cada equipo llega con evidencia, firma y un folio claro.", copy: "Registra condición, accesorios y falla reportada en una sola ficha. FIXI deja el historial listo desde el primer minuto." },
  { label: "Seguimiento", eyebrow: "Cliente informado", title: "El estatus del servicio se consulta sin perseguir al taller.", copy: "Comparte un enlace seguro por WhatsApp y mantén cada avance visible para el cliente correcto." },
  { label: "Operación", eyebrow: "El taller bajo control", title: "Órdenes, técnicos y pendientes en la misma vista.", copy: "Prioriza lo urgente y detecta qué necesita atención sin cambiar de herramienta." },
  { label: "Negocio", eyebrow: "Decisiones con contexto", title: "Lo que entra, lo que sale y lo que falta por cobrar.", copy: "La operación diaria queda conectada con los datos que necesita la persona dueña del taller." },
];

const productPillars = [
  ["01", "Fichas que sí trabajan", "Campos editables, checklist, fotos y movimientos para que el expediente acompañe a tu operación."],
  ["02", "Portal con tu marca", "Cada taller configura logo, contacto y landing. El cliente ve a su negocio, no una pantalla genérica."],
  ["03", "Comunicación directa", "WhatsApp abre el seguimiento correcto y mantiene la conversación entre el taller y su cliente."],
];

const pricingPlans = [
  { name: "Básico", price: "$300", copy: "Para operar un taller y ordenar la recepción, clientes y seguimiento.", features: ["1 sucursal", "Hasta 2 usuarios", "Portal y landing del taller"] },
  { name: "Profesional", price: "$450", copy: "Para talleres con más movimiento que necesitan control operativo completo.", features: ["Hasta 2 sucursales", "Hasta 3 usuarios", "Compras y reportes"], featured: true },
  { name: "Empresarial", price: "$600", copy: "Para negocios que ya coordinan equipos, sucursales y finanzas a escala.", features: ["Sucursales ilimitadas", "Usuarios ilimitados", "Control financiero completo"] },
];

function BrandMark() {
  return (
    <div className="fx-brand-mark" aria-hidden="true">
      <span>F</span>
      <i />
    </div>
  );
}

function Arrow() {
  return <span aria-hidden="true" className="fx-arrow">↗</span>;
}

function DashboardPreview() {
  return (
    <div className="fx-screen" aria-label="Vista ilustrativa de FIXI">
      <div className="fx-screen-top">
        <div className="fx-screen-logo"><BrandMark /><span>FIXI</span></div>
        <div className="fx-screen-search">Buscar por orden, cliente o IMEI</div>
        <div className="fx-screen-user"><span className="fx-live-dot" /> Taller activo</div>
      </div>
      <div className="fx-screen-body">
        <aside className="fx-screen-nav">
          <span className="fx-nav-current">Resumen</span>
          <span>Recepción</span>
          <span>Técnico</span>
          <span>Clientes</span>
          <span>Inventario</span>
        </aside>
        <div className="fx-screen-main">
          <div className="fx-screen-heading"><div><small>HOY EN EL TALLER</small><b>Operación en marcha</b></div><button type="button">Nueva orden <Arrow /></button></div>
          <div className="fx-status-grid">
            <div><span className="fx-status-icon fx-cyan">⌁</span><p>Por revisar</p><b>Recepciones</b></div>
            <div><span className="fx-status-icon fx-blue">↗</span><p>En proceso</p><b>Servicio activo</b></div>
            <div><span className="fx-status-icon fx-orange">✓</span><p>Por entregar</p><b>Cliente informado</b></div>
          </div>
          <div className="fx-order-panel">
            <div className="fx-order-heading"><div><small>ORDEN SRF-1042</small><b>Equipo recibido para diagnóstico</b></div><span>Actualizada</span></div>
            <div className="fx-order-lines"><i /><i /><i /></div>
            <div className="fx-order-footer"><span>Checklist completo</span><span>WhatsApp listo</span><span>Portal activo</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionKicker({ children }: { children: React.ReactNode }) {
  return <p className="fx-kicker">{children}</p>;
}

export default function Home() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: productName,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: "Software para talleres de reparación con órdenes, seguimiento al cliente y configuración por tenant.",
    offers: { "@type": "Offer", price: "300", priceCurrency: "MXN" },
  };

  return (
    <main className="fx-site">
      <RootAuthHashRedirect />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <header className="fx-header">
        <Link href="#inicio" className="fx-logo" aria-label="Ir al inicio de FIXI"><BrandMark /><span>FIXI</span></Link>
        <nav aria-label="Navegación principal"><Link href="#producto">Producto</Link><Link href="#flujo">Flujo</Link><Link href="#planes">Planes</Link><Link href="#contacto">Contacto</Link></nav>
        <div className="fx-header-actions"><Link href={adminLoginUrl} className="fx-login">Iniciar sesión</Link><Link href={adminOnboardingUrl} className="fx-button fx-button-small">Prueba gratis <Arrow /></Link></div>
      </header>

      <section id="inicio" className="fx-hero">
        <div className="fx-hero-copy">
          <SectionKicker>Software operativo para talleres</SectionKicker>
          <h1>El control de tu taller,<br /><em>bien hecho.</em></h1>
          <p>FIXI conecta recepción, operación y seguimiento del cliente para que tu taller trabaje con claridad, no con pendientes sueltos.</p>
          <div className="fx-hero-actions"><Link href={adminOnboardingUrl} className="fx-button">Crea tu taller <Arrow /></Link><Link href="#producto" className="fx-text-link">Conoce la plataforma <Arrow /></Link></div>
          <div className="fx-hero-notes"><span><i className="fx-check">✓</i> Configuración inicial guiada</span><span><i className="fx-check">✓</i> Sin tarjeta para empezar</span></div>
        </div>
        <div className="fx-hero-product"><div className="fx-orbit fx-orbit-one" /><div className="fx-orbit fx-orbit-two" /><DashboardPreview /><div className="fx-note fx-note-top"><b>Una orden, un expediente</b><span>Fotos, checklist y movimientos.</span></div><div className="fx-note fx-note-bottom"><span className="fx-note-icon">↗</span><div><b>El cliente sigue el avance</b><span>Desde el portal de tu taller.</span></div></div></div>
      </section>

      <section className="fx-intro-band"><p>FIXI no sustituye la forma en que trabajas.</p><b>La vuelve visible, ordenada y compartible.</b><span>Operación real · Marca propia · Información por tenant</span></section>

      <section id="producto" className="fx-product-section">
        <div className="fx-section-heading"><div><SectionKicker>La plataforma</SectionKicker><h2>Una vista clara para cada<br />momento del taller.</h2></div><p>Desde la primera ficha hasta la entrega, cada módulo está conectado para que el equipo avance sin duplicar información.</p></div>
        <div className="fx-tab-row" role="list" aria-label="Módulos principales">{productTabs.map((tab, index) => <a href={`#tab-${index}`} className={index === 0 ? "is-active" : ""} key={tab.label}>{tab.label}</a>)}</div>
        <div className="fx-feature-layout">
          <div className="fx-feature-copy">{productTabs.map((tab, index) => <article id={`tab-${index}`} key={tab.label} className={index === 0 ? "fx-feature-active" : "fx-feature-muted"}><SectionKicker>{tab.eyebrow}</SectionKicker><h3>{tab.title}</h3><p>{tab.copy}</p><Link href={adminOnboardingUrl} className="fx-text-link">Configura tu operación <Arrow /></Link></article>)}</div>
          <div className="fx-receipt-preview"><div className="fx-receipt-top"><span>Ficha de recepción</span><b>SRF-1042</b></div><div className="fx-receipt-device"><div className="fx-device-icon">▣</div><div><small>EQUIPO</small><b>Smartphone · Diagnóstico</b></div><span className="fx-state">Recibido</span></div><div className="fx-receipt-grid"><div><small>CLIENTE</small><b>Información protegida</b></div><div><small>FECHA PROMESA</small><b>Definida por el taller</b></div><div><small>CONDICIÓN</small><b>Fotos y checklist</b></div><div><small>SEGUIMIENTO</small><b>Portal disponible</b></div></div><div className="fx-receipt-track"><div><span>Recepción</span><i className="is-done" /></div><div><span>Diagnóstico</span><i className="is-pending" /></div><div><span>Entrega</span><i /></div></div><div className="fx-receipt-actions"><span>Historial de cambios</span><button type="button">Enviar por WhatsApp <Arrow /></button></div></div>
        </div>
      </section>

      <section id="flujo" className="fx-flow-section"><div className="fx-flow-heading"><SectionKicker>Diseñado alrededor de la operación</SectionKicker><h2>Todo lo que pasa en el taller<br />tiene su lugar.</h2></div><div className="fx-pillar-grid">{productPillars.map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p><div className="fx-pillar-line" /></article>)}</div></section>

      <section className="fx-portal-section"><div className="fx-portal-copy"><SectionKicker>Tu marca al frente</SectionKicker><h2>Un portal que se siente<br />como <em>tu taller.</em></h2><p>FIXI prepara la estructura. El taller administra su nombre, logo, contacto, servicios y ubicación desde su propia configuración.</p><ul><li><span>01</span>Landing pública configurada por tenant</li><li><span>02</span>Cotizador y portal de estatus integrados</li><li><span>03</span>Mapa y contacto reales del negocio</li></ul><Link href={adminOnboardingUrl} className="fx-button">Configura tu presencia <Arrow /></Link></div><div className="fx-portal-card"><div className="fx-tenant-nav"><span className="fx-tenant-logo">TF</span><b>Tu Taller</b><i /><span>Inicio</span><span>Servicios</span><span>Contacto</span></div><div className="fx-tenant-hero"><p>SEGUIMIENTO HECHO SIMPLE</p><h3>Tu equipo.<br /><em>Tu información.</em></h3><button type="button">Consultar estatus <Arrow /></button></div><div className="fx-tenant-footer"><span>Logo y colores del taller</span><span>Portal conectado</span></div></div></section>

      <section id="planes" className="fx-pricing-section"><div className="fx-pricing-heading"><div><SectionKicker>Planes claros</SectionKicker><h2>Empieza con lo que<br />tu taller necesita.</h2></div><p>Todos incluyen el portal del cliente y la landing del taller. Crece cuando tu operación lo pida.</p></div><div className="fx-pricing-grid">{pricingPlans.map((plan) => <article className={plan.featured ? "is-featured" : ""} key={plan.name}>{plan.featured && <span className="fx-popular">Más elegido</span>}<h3>{plan.name}</h3><p>{plan.copy}</p><div className="fx-price"><b>{plan.price}</b><span>MXN / mes</span></div><ul>{plan.features.map((feature) => <li key={feature}><i>✓</i>{feature}</li>)}</ul><Link href={adminOnboardingUrl} className={plan.featured ? "fx-button" : "fx-outline-button"}>Comenzar <Arrow /></Link></article>)}</div></section>

      <section className="fx-cta-section"><div><SectionKicker>Tu siguiente orden puede empezar mejor</SectionKicker><h2>Abre tu taller en FIXI<br />y deja de perseguir información.</h2></div><Link href={adminOnboardingUrl} className="fx-button fx-button-light">Crear mi cuenta <Arrow /></Link></section>

      <footer id="contacto" className="fx-footer"><div className="fx-footer-brand"><Link href="#inicio" className="fx-logo"><BrandMark /><span>FIXI</span></Link><p>Software operativo para talleres de reparación.</p></div><div><p className="fx-footer-label">PRODUCTO</p><Link href="#producto">Plataforma</Link><Link href="#flujo">Cómo funciona</Link><Link href="#planes">Planes</Link></div><div><p className="fx-footer-label">ACCESO</p><Link href={adminLoginUrl}>Iniciar sesión</Link><Link href={adminOnboardingUrl}>Crear taller</Link><a href={publicUrl}>Sitio público</a></div><div className="fx-footer-note"><p>Tu información se mantiene separada por tenant. Cada taller opera con su propia configuración.</p></div><div className="fx-footer-bottom"><span>© 2026 FIXI</span><span>Hecho para talleres que quieren operar mejor.</span></div></footer>
    </main>
  );
}
