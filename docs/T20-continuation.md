# T20 Continuation

## Fecha y hora

- 2026-07-03 07:41:18 PDT

## Estado inicial

- Rama: `main`, un commit adelante de `origin/main`.
- El worktree ya contenia cambios locales previos en `web-admin`, `web-public`, documentacion y scripts.
- No se revirtio, borro ni mezclo ningun cambio previo.
- `docs/T20-continuation.md` no existia antes de esta sesion.

## Fase actual

- Fase 1: Portal del cliente y resolucion por folio/token.
- Fase 2: PDF de orden al crear recepción.
- Flujo bajo revision: landing tenant -> `web-clientes` -> API publica -> orden/timeline/documentos -> UI y alta -> PDF inmediato.

## Cambios aplicados

- `apps/api/src/controllers/public.ts`
  - `getPublicPortalByToken` dejo de pedir columnas fisicas que no existen en produccion (`received_at`, `completed_at`, `delivered_at`, `device_type`, `device_brand`, `device_model`, `reported_issue`).
  - El portal ahora arma `device`, `reportedIssue` y fechas usando columnas reales (`device_info`, `serial_number`, `problem_description`, `created_at`, `updated_at`) y eventos historicos.
  - `receivedAt` usa `created_at`; `completedAt` y `deliveredAt` se derivan de `service_order_events` con fallback seguro.
- `apps/web-clientes/src/lib/portal/portal-view.tsx`
  - La consulta por token solo cae a folio legado cuando el token devuelve 404.
  - Errores 5xx y de red ya no se silencian como "folio no encontrado"; ahora se muestran mensajes claros.
  - Se agrego `htmlFor`/`id` al input del folio para mejorar accesibilidad.
- `apps/web-admin/src/app/dashboard/operativo/page.tsx`
  - El PDF de la orden ya se resuelve desde la respuesta de alta y cae al PDF publico por folio si la respuesta no trae un adjunto directo.
  - Si la foto de recepcion genera `receipt_pdf`, ese valor sigue teniendo prioridad.
- `apps/web-admin/src/app/dashboard/sucursales/page.tsx`
  - El boton `Usar` y el guardado de sucursal ahora fuerzan navegacion completa a `/dashboard` para evitar quedar atrapados en el estado anterior.
- `apps/web-admin/src/components/tecnico/order-modal.tsx`
  - Se recreo el modal tecnico que consumia `apps/web-admin/src/app/dashboard/ordenes/page.tsx`.
  - Quedo con overlay centrado, ancho acotado, alto acotado, footer fijo y contenido interno mas compacto para reducir scroll visual.
  - Las pestañas de Detalles, Checklist, Fotos e Historial siguen disponibles con una composicion mas densa y legible.
- Entorno local de `web-clientes`
  - Se agregaron `API_URL`, `NEXT_PUBLIC_API_URL` y `NEXT_PUBLIC_CUSTOMER_TRACKING_URL` a `.env.local` para poder levantar el portal en desarrollo con el backend correcto.

## Archivos tocados

- `docs/T20-continuation.md`

## Comandos ejecutados

- `pwd`
- `git status --short --branch`
- `ls`
- `find apps -maxdepth 3 -type f | sort | sed -n '1,200p'`
- Lectura de `package.json` raiz y de `apps/web-clientes`, `apps/web-public`, `apps/web-admin`, `apps/api`.
- Busqueda global con `rg` de portal, folio, token, PDF, IVA, sucursal y modal/scroll.
- Lectura de `AGENTS.md` raiz y reglas de apps afectadas.

## Resultado de validaciones

- `pnpm --dir apps/api typecheck` paso despues del ajuste.
- `pnpm --dir apps/api build` paso despues del ajuste.
- `pnpm --dir apps/web-clientes typecheck` paso despues del ajuste.
- `pnpm --dir apps/web-clientes build` paso despues del ajuste.
- `pnpm --dir apps/web-admin typecheck` paso despues del ajuste.
- `pnpm --dir apps/web-admin build` paso despues del ajuste.
- El dev server de `web-clientes` arranca con el backend correcto una vez alineado el entorno local.
- La build de `web-admin` volvio a compilar despues de recrear `apps/web-admin/src/components/tecnico/order-modal.tsx`.

## Hallazgos iniciales

- El portal canonico existe en `apps/web-clientes/src/app/t/[tenantSlug]/portal`.
- `web-clientes` contiene consultas separadas por folio y por `public_token`.
- La API publica expone rutas por token antes de la ruta dinamica por folio.
- Existen portales/tracking heredados adicionales en `web-public`; no se tocaran salvo que bloqueen el flujo canonico.
- La landing del tenant ya construye el enlace al portal de clientes mediante `NEXT_PUBLIC_CUSTOMER_TRACKING_URL`.
- En local, la primera falla real fue un `Missing required environment variable: API_URL`; ya quedo resuelto para desarrollo sin tocar produccion.
- El control de IVA ya existe en `apps/web-admin/src/components/dashboard/orders/order-intake-modal.tsx` y en `apps/web-admin/src/components/solicitudes/quote-modal.tsx`; la siguiente verificacion es de visibilidad/ubicacion, no de ausencia de logica.

## Pendientes exactos

- Validar en la siguiente corrida visual que el portal ya hidrate y pida la orden con el entorno corregido.
- Comprobar en la UI de alta que el boton PDF ya usa la URL publica inmediata.
- Confirmar visualmente si el toggle de IVA ya esta expuesto donde el usuario lo espera; el campo existe en el flujo de alta y en cotizacion, pero falta validar la experiencia.
- Si quieres una revision puramente visual, abrir `apps/web-admin` y medir si el modal tecnico ya cabe sin scroll excesivo en el viewport real.

## Siguiente comando recomendado

```bash
sed -n '1,620p' apps/web-clientes/src/lib/portal/portal-view.tsx
```

## Riesgos detectados

- Worktree sucio con cambios ajenos a esta fase.
- Duplicidad historica de superficies de portal entre `web-public` y `web-clientes`.
- Los mensajes de error actuales pueden colapsar errores de red, tenant inexistente y folio no encontrado en un solo mensaje.
- No se deben imprimir tokens publicos completos en logs ni documentacion.

## URLs y variables necesarias

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_CUSTOMER_TRACKING_URL`
- Portal canonico: `https://clientes.serviciosdigitalesmx.online/t/{tenantSlug}/portal`
- API publica: `https://api.serviciosdigitalesmx.online`

## Como continuar si se corta la sesion

1. Entrar a `/Users/usuario/Documents/New project 38/Sdmx-pagina-principal1`.
2. Ejecutar `git status --short --branch` y no revertir cambios previos.
3. Leer este archivo completo.
4. Continuar solo con Fase 1 hasta que `web-clientes` pase typecheck y build.
5. No iniciar PDF, IVA, sucursal o modal antes de cerrar y documentar Fase 1.
