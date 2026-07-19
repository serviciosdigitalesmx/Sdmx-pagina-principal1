# Resumen de Optimizaciones de Navegación y UX

A continuación se detallan las mejoras funcionales y de rendimiento percibido que se implementaron en la aplicación para garantizar una navegación coherente y fluida (estilo Single Page Application).

## 1. Preservación del historial en el Portal del Cliente

> [!NOTE]
> **Archivo modificado:** [`apps/web-clientes/src/app/not-found.tsx`](file:///Users/usuario/.gemini/antigravity/scratch/Sdmx-pagina-principal1/apps/web-clientes/src/app/not-found.tsx)

**El problema:** 
Cuando un cliente recibía un enlace por WhatsApp para rastrear su orden pero el folio era incorrecto o no existía, llegaba a la página de error 404. El botón de acción de esta página estaba configurado de forma estática con `<Link href="/">`. Al pulsarlo, en lugar de regresar al cliente al flujo de su taller o a WhatsApp, lo expulsaba a la página de inicio genérica de Fixi, rompiendo la coherencia de la navegación.

**La solución:**
Se refactorizó el componente de servidor a componente de cliente (`"use client"`) y se reemplazó el enlace estático por un botón que ejecuta `router.back()`. 
```diff
- <Link href="/">
+ <button onClick={() => router.back()}>
    Regresar
- </Link>
+ </button>
```
Con esto, el navegador retrocede de forma natural en el historial, regresando al usuario exactamente a donde estaba (por ejemplo, al chat de WhatsApp o a la landing del taller).

---

## 2. Navegación SPA en la creación de nuevas órdenes

> [!IMPORTANT]
> **Archivo modificado:** [`apps/web-admin/src/app/dashboard/clientes/page.tsx`](file:///Users/usuario/.gemini/antigravity/scratch/Sdmx-pagina-principal1/apps/web-admin/src/app/dashboard/clientes/page.tsx)

**El problema:** 
En el panel administrativo, dentro de la vista de listado de clientes, al hacer clic en el botón para crear una nueva orden para un cliente existente (`handleNewOrder`), la redirección se hacía utilizando `window.location.href = '/dashboard/operativo'`. Esta instrucción nativa de JavaScript fuerza al navegador a realizar una recarga completa de la página (full reload), lo que rompía la experiencia fluida, generando parpadeos y la sensación de "abrir una pestaña nueva".

**La solución:**
Se reemplazó la redirección nativa por el enrutador integrado de Next.js (`useRouter`).
```diff
  localStorage.setItem('srf_borrador_orden', JSON.stringify(draft));
- window.location.href = '/dashboard/operativo';
+ router.push('/dashboard/operativo');
```
Esto permite que la transición a la pantalla operativa ocurra instantáneamente dentro del contexto de la misma página, manteniendo la coherencia de la Single Page Application (SPA).

---

## 3. Corrección del "efecto de congelamiento" en el Login

> [!WARNING]
> **Archivo modificado:** [`apps/web-admin/src/app/login/page.tsx`](file:///Users/usuario/.gemini/antigravity/scratch/Sdmx-pagina-principal1/apps/web-admin/src/app/login/page.tsx)

**El problema:** 
Al iniciar sesión (`handleSupabaseLogin`), el sistema detenía la animación de carga (spinner) utilizando un bloque `finally { setLoading(false) }` inmediatamente después de invocar el redireccionamiento `router.push(redirect)`. Debido a que Next.js prepara la siguiente página en segundo plano antes de renderizarla, el botón de login volvía a su estado original (inactivo) durante 1 a 2 segundos mientras se descargaban los datos del dashboard. Para el usuario, esto daba la impresión de que la aplicación se había "congelado" o ignorado el clic.

**La solución:**
Se eliminó el bloque `finally` para evitar apagar el indicador de carga en caso de éxito.
```diff
    router.push(redirect);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión.');
+   setLoading(false);
- } finally {
-   setLoading(false);
  }
```
Ahora, el estado de carga (el spinner en el botón) se mantiene activo ininterrumpidamente hasta que Next.js termina su procesamiento y la página realmente cambia, otorgando retroalimentación visual continua.

---

## 4. Esqueleto de carga inter-módulos en el Panel Admin

> [!TIP]
> **Archivo nuevo:** [`apps/web-admin/src/app/dashboard/loading.tsx`](file:///Users/usuario/.gemini/antigravity/scratch/Sdmx-pagina-principal1/apps/web-admin/src/app/dashboard/loading.tsx)

**El problema:** 
Al navegar entre los distintos módulos del panel lateral (e.g. de *Operativo* a *Clientes* o *Finanzas*), si Next.js tomaba fracciones de segundo en resolver los componentes de la nueva ruta, la pantalla anterior se quedaba estática esperando, sin indicarle al usuario que la transición estaba en proceso.

**La solución:**
Se creó el archivo `loading.tsx` a nivel de la carpeta `/dashboard`. En Next.js App Router, este archivo actúa como un *Suspense Boundary* automático para todas las sub-rutas.
Al implementarlo reutilizando el componente base `LoadingState`:
```tsx
import { LoadingState } from '@/components/base/states';

export default function DashboardLoading() {
  return (
    <div className="flex h-[60vh] w-full items-center justify-center">
      <LoadingState label="Cargando módulo..." />
    </div>
  );
}
```
Ahora, cualquier clic en el menú lateral intercambia inmediatamente la pantalla por un indicador elegante que dice "Cargando módulo...", haciendo que la interacción se sienta 100% receptiva y sin tiempos muertos.
