import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RootAuthHashRedirect } from "@/components/root-auth-hash-redirect";
import { resolveAdminUrl } from "@/lib/admin-url";
import s from "./home.module.css";
import { LandingMobileNav } from "@/components/landing-mobile-nav";
import { optionalEnv } from "@white-label/config";
import logo from "../../public/brand/fixi-logo.jpg";
import board from "../../public/product/01-tablero.png";
import reception from "../../public/product/02-recepcion.png";
import detail from "../../public/product/03-detalle.png";
import checklist from "../../public/product/04-checklist.png";
import photos from "../../public/product/05-fotos-recorte.png";
import inventory from "../../public/product/06-inventario.png";
import payments from "../../public/product/07-cobros.png";

const base = resolveAdminUrl();
const signup = base ? `${base}/login?mode=signup` : "/login?mode=signup";
const login = base ? `${base}/login` : "/login";
export const metadata: Metadata = {
 icons: { icon: "/brand/fixi-logo.jpg", apple: "/brand/fixi-logo.jpg" },
 title: "FIXI — Todas las reparaciones de tu taller, bajo control",
 description: "Organiza órdenes, fotografías, clientes, inventario, anticipos y cobros con FIXI. Prueba gratis durante 15 días. Planes desde $300 MXN al mes.",
 alternates: { canonical: "https://serviciosdigitalesmx.online" },
 openGraph: { title: "FIXI — Tu taller, bajo control", description: "Software de gestión para talleres de reparación. Probar 15 días gratis.", url: "https://serviciosdigitalesmx.online", locale: "es_MX", type: "website" },
};
const nav = [["Beneficios","beneficios"],["Cómo funciona","como-funciona"],["Funcionalidades","funcionalidades"],["Precios","planes"]];
const problems = [
 ["Órdenes dispersas","Órdenes anotadas en libretas o conversaciones de WhatsApp."],
 ["Evidencia difícil de localizar","Fotografías y evidencias difíciles de localizar."],
 ["Pagos por conciliar","Anticipos y pagos que requieren conciliación manual."],
 ["Inventario sin centralizar","Inventario sin un control centralizado."],
 ["Consultas constantes","Clientes que preguntan constantemente por sus equipos."],
];
const benefits = [
 ["Entrega con mayor organización","Consulta el estado, historial y trabajos pendientes de cada reparación para coordinar mejor las entregas."],
 ["Controla tus cobros y anticipos","Mantén relacionados los pagos con las órdenes correspondientes y consulta los movimientos registrados."],
 ["Conoce el estado de cada equipo","Encuentra órdenes, responsables y avances desde un mismo sistema, sin buscar información en distintas conversaciones."],
];
const steps = [
 ["Recibe el equipo","Registra los datos del cliente y dispositivo, documenta las condiciones de recepción y agrega fotografías."],
 ["Da seguimiento a la reparación","Organiza las órdenes por estado, asigna responsables según permisos y registra diagnósticos, tareas y avances."],
 ["Cobra y entrega","Registra pagos y anticipos, consulta los importes pendientes y documenta la entrega del equipo."],
];
const capabilities = [
 ["Órdenes y reparaciones","Recepción, estados, diagnósticos, checklist, fotografías e historial."],
 ["Clientes y seguimiento","Expedientes de clientes, dispositivos asociados y portal del cliente."],
 ["Inventario","Registro de productos, existencias y movimientos de inventario."],
 ["Pagos y documentos","Anticipos, cobros, ventas y comprobantes comerciales."],
 ["Equipo de trabajo","Roles internos, permisos y control por sucursal, según el plan."],
];
const screens = [
 { title:"Recepción de equipos", copy:"El primer paso para registrar una reparación.",image:reception },
 { title:"Tablero de órdenes",copy:"Una vista de las reparaciones por estado.",image:board },
 { title:"Detalle de una reparación",copy:"Datos del equipo y plan de trabajo en un mismo lugar.",image:detail },
 { title:"Fotografías y checklist",copy:"Documenta las condiciones de recepción y la revisión de salida.",image:checklist },
 { title:"Inventario",copy:"Organiza el catálogo y consulta la disponibilidad.",image:inventory },
 { title:"Cobros y documentos comerciales",copy:"Consulta importes, movimientos y documentos de la orden.",image:payments },
];
const plans = [
 {name:"Básico",price:"300",copy:"Para organizar la operación de un taller pequeño.",items:["1 sucursal","2 usuarios","50 órdenes al mes","2 GB de almacenamiento","Portal del cliente y WhatsApp","PDFs y control de refacciones"]},
 {name:"Profesional",price:"450",copy:"Más capacidad para coordinar a tu equipo.",items:["2 sucursales","5 usuarios","500 órdenes al mes","10 GB de almacenamiento","Incluye las herramientas de Básico","Landing y branding personalizados","Compras, gastos, reportes y roles"]},
 {name:"Empresarial",price:"600",copy:"Capacidad para una operación con varias sucursales.",items:["Sucursales ilimitadas","Usuarios ilimitados","Órdenes ilimitadas","100 GB de almacenamiento","Incluye las herramientas de Profesional","Finanzas completas"]},
];
const faqs = [
 ["¿Qué incluye la prueba gratuita de 15 días?","Puedes conocer el flujo de FIXI y sus módulos durante 15 días: recepción, órdenes, fotografías, checklist, inventario y cobros. Al registrarte podrás consultar las capacidades disponibles para tu taller."],
 ["¿Necesito instalar algún programa?","Puedes acceder al sistema desde su dirección web. También está disponible la aplicación para Android. El seguimiento del cliente se consulta mediante un enlace web."],
 ["¿Puedo utilizar FIXI desde mi celular?","FIXI cuenta con una aplicación para Android, disponible al final de esta página. El portal de seguimiento del cliente puede consultarse desde el navegador."],
 ["¿Qué sucede con mis datos al terminar la prueba?","La continuidad del acceso y el tratamiento de los datos dependen de las condiciones del servicio. Revisa las condiciones aplicables a tu cuenta antes de terminar la prueba; no se ofrece conservación indefinida de la información."],
 ["¿Puedo cambiar de plan?","Sí. Los planes ofrecen diferentes capacidades de usuarios, sucursales, órdenes, almacenamiento y módulos. Consulta las opciones disponibles en la sección de suscripción de tu cuenta."],
 ["¿Cómo funciona el acceso para mis empleados?","Cada plan incluye un número de usuarios. Profesional y Empresarial incluyen administración de usuarios y roles para organizar el acceso del equipo según sus permisos."],
 ["¿Puedo administrar más de una sucursal?","Sí. Profesional incluye hasta 2 sucursales y Empresarial permite sucursales ilimitadas. Básico incluye 1 sucursal."],
 ["¿Cómo puedo cancelar mi suscripción?","Revisa las opciones de tu suscripción desde la cuenta y las condiciones del servicio aplicables. La fecha efectiva, los cargos y el tratamiento de los datos dependen de esas condiciones."],
];
function Brand(){return <span className={s.brand}><Image className={s.mark} src={logo} alt="" width={36} height={36} sizes="36px"/>FIXI</span>}
function Trial({children="Probar 15 días gratis"}:{children?:React.ReactNode}){return <Link className={s.button} href={signup}>{children}<span aria-hidden="true">↗</span></Link>}
function Heading({label,title,copy}:{label:string;title:string;copy?:string}){return <div className={s.heading}><p className={s.kicker}>{label}</p><h2>{title}</h2>{copy&&<p>{copy}</p>}</div>}
function Cards({items}:{items:string[][]}){return <div className={s.grid}>{items.map(([title,copy],i)=><article className={s.card} key={title}><span className={s.number} aria-hidden="true">0{i+1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>}
export default function Home(){
 const schema={"@context":"https://schema.org","@type":"SoftwareApplication",name:"FIXI",applicationCategory:"BusinessApplication",operatingSystem:"Web, Android",description:"Software de gestión para talleres de reparación.",offers:{"@type":"AggregateOffer",lowPrice:"300",highPrice:"600",priceCurrency:"MXN",offerCount:"3"}};
 return <main className={s.site}>
  <RootAuthHashRedirect/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/>
  <a className={s.skip} href="#contenido">Saltar al contenido</a>
  <header className={s.header}><div className={s.headerInner}><Link href="#inicio" aria-label="FIXI, inicio"><Brand/></Link><nav className={s.desktopNav} aria-label="Navegación principal">{nav.map(([label,id])=><a key={id} href={`#${id}`}>{label}</a>)}</nav><div className={s.headerActions}><Link href={login}>Iniciar sesión</Link><Trial>Probar gratis</Trial></div><LandingMobileNav className={s.mobileNav}>{nav.map(([label,id])=><a key={id} href={`#${id}`}>{label}</a>)}<Link href={login}>Iniciar sesión</Link><Trial/></LandingMobileNav></div></header>
  <div id="contenido" tabIndex={-1}>
   <section id="inicio" className={`${s.container} ${s.hero}`}><div className={s.heroCopy}><p className={s.kicker}>Software para talleres de reparación</p><h1>Todas las reparaciones de tu taller, <span>bajo control.</span></h1><p>Registra equipos, organiza órdenes, guarda fotografías, controla anticipos e inventario y mantén informados a tus clientes. Todo desde FIXI.</p><div className={s.heroActions}><Trial/><a className={s.secondary} href="#planes">Ver planes y precios <span aria-hidden="true">→</span></a></div><p className={s.heroNote}>De la recepción a la entrega, en un solo sistema.</p></div><figure className={s.heroVisual}><div className={s.imageFrame}><Image src={board} alt="Tablero de órdenes de FIXI con columnas por estado y datos del taller ocultos" sizes="(max-width: 1023px) 94vw, 55vw" preload/></div><figcaption>Tablero de órdenes · Captura editada para proteger los datos.</figcaption></figure></section>
   <section className={`${s.section} ${s.soft}`}><div className={s.container}><Heading label="El punto de partida" title="¿Tu taller todavía depende de libretas, mensajes y hojas de cálculo?" copy="Cuando la información está dispersa, administrar las reparaciones se vuelve más complicado de lo necesario."/><Cards items={problems}/></div></section>
   <section id="beneficios" className={s.section}><div className={s.container}><Heading label="Beneficios" title="Más control para tu taller. Menos complicaciones en tu operación."/><Cards items={benefits}/></div></section>
   <section id="como-funciona" className={`${s.section} ${s.soft}`}><div className={s.container}><Heading label="Cómo funciona" title="De la recepción a la entrega, todo organizado."/><ol className={s.steps}>{steps.map(([title,copy],i)=><li key={title}><span className={s.stepNumber}>0{i+1}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol></div></section>
   <section id="producto" className={s.section}><div className={s.container}><Heading label="FIXI por dentro" title="Conoce el sistema que utilizarás todos los días." copy="Explora las herramientas que te ayudan a organizar la operación de tu taller."/><p className={s.imageNote}>Imágenes de una sesión de FIXI, editadas con IA para ocultar datos y ajustar el encuadre. Pueden presentar pequeñas variaciones visuales.</p><div className={s.gallery}>{screens.map(screen=><figure key={screen.title} className={s.screen}><a href={screen.image.src} target="_blank" rel="noreferrer" aria-label={`Ampliar captura: ${screen.title}`}><Image src={screen.image} alt={`${screen.title} en FIXI, con datos ocultos`} sizes="(max-width: 767px) 92vw, (max-width: 1023px) 46vw, 390px"/></a><figcaption><h3>{screen.title}</h3><p>{screen.copy}</p></figcaption></figure>)}</div><details className={s.photoDetail}><summary>Ver el área de fotografías</summary><Image src={photos} alt="Sección de fotografías de FIXI con miniaturas protegidas por privacidad" sizes="(max-width: 767px) 92vw, 800px"/></details></div></section>
   <section id="funcionalidades" className={`${s.section} ${s.soft}`}><div className={s.container}><Heading label="Funcionalidades" title="Las herramientas que tu taller necesita, conectadas en un solo lugar."/><Cards items={capabilities}/><p className={s.footnote}>Los documentos comerciales de FIXI no se presentan como facturación fiscal CFDI del SAT.</p></div></section>
   <section id="planes" className={s.section}><div className={s.container}><Heading label="Precios" title="Elige el plan adecuado para tu taller." copy="Comienza con 15 días de prueba gratuita y conoce las herramientas de FIXI."/><div className={s.grid}>{plans.map(plan=><article key={plan.name} className={s.plan}><h3>{plan.name}</h3><p>{plan.copy}</p><div className={s.price}><strong>${plan.price}</strong><span>MXN / mes</span></div><ul>{plan.items.map(item=><li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul><Trial/></article>)}</div><p className={s.footnote}>Elige por capacidad: usuarios, sucursales, órdenes, almacenamiento y herramientas incluidas.</p></div></section>
   <section id="preguntas" className={`${s.section} ${s.soft}`}><div className={`${s.container} ${s.faqLayout}`}><Heading label="Preguntas frecuentes" title="Resolvemos tus dudas antes de comenzar."/><div className={s.faq}>{faqs.map(([question,answer])=><details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div></section>
   <section className={s.section}><div className={s.container}><div className={s.closing}><p className={s.kicker}>Empieza con FIXI</p><h2>Empieza a organizar tu taller con FIXI.</h2><p>Conoce cómo gestionar tus reparaciones, clientes, inventario y cobros desde un solo sistema.</p><Trial/></div></div></section>
  </div>
  <footer className={s.footer}><div className={s.container}><div className={s.footerGrid}><div><Link href="#inicio"><Brand/></Link><p>Software de gestión para talleres de reparación.</p><p>Servicios Digitales MX</p></div><nav aria-label="Producto"><h3>Producto</h3><a href="#beneficios">Beneficios</a><a href="#como-funciona">Cómo funciona</a><a href="#planes">Precios</a><a href="/fixi-app.apk?v=5.0.0" download>Descargar app Android 5.0.0</a></nav><nav aria-label="Acceso"><h3>Acceso</h3><Link href={login}>Iniciar sesión</Link><Link href={signup}>Crear mi taller</Link><a href="#preguntas">Preguntas frecuentes</a></nav></div><div className={s.footerBottom}><span>© {new Date().getFullYear()} FIXI · Servicios Digitales MX</span><span>De la recepción a la entrega.</span></div></div></footer>
 </main>;
}



