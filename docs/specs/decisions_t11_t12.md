# Decisions T11 / T12

Fecha de resolucion: 2026-06-20

Alcance:

- T11 Autorizacion online con aceptacion/firma.
- T12 Portal cliente completo con documentos.

Este documento convierte el diseno aterrizado de Gemini en decision tecnica oficial contra el repo real. No implementa codigo, migraciones, tests ni configuracion.

T04 permanece cerrado y vigente: toda accion critica debe auditarse con el servicio central y `request_id`.

## Evidencia Real Encontrada

### Rutas reales

- [apps/api/src/index.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/index.ts) monta public bajo `/api/public`.
- [apps/api/src/routes/public.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/routes/public.ts) expone:
  - `POST /api/public/quotes`
  - `GET /api/public/tracking`
  - `GET /api/public/tenant/:tenantSlug/landing`
  - `GET /api/public/tenant/:tenantSlug/orders/:folio`
  - `GET /api/public/tenant/:tenantSlug/orders/:folio/pdf`
- El repo no usa convencion `/api/v1`.

### Controladores reales

- [apps/api/src/controllers/public.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/controllers/public.ts) implementa `getPublicPortalOrder`.
- [apps/api/src/controllers/public.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/controllers/public.ts) implementa `getPublicOrderPdf`.
- [apps/api/src/controllers/public.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/controllers/public.ts) implementa `createPublicQuote` sobre `service_requests`.
- [apps/api/src/controllers/public.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/controllers/public.ts) resuelve hoy el portal con `.or(folio.eq.${searchValue},public_token.eq.${searchValue})`.

### Tablas reales y campos existentes

- [supabase/migrations/20260424_baseline_schema.sql](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/supabase/migrations/20260424_baseline_schema.sql) define `service_orders` con `folio`, `estimated_cost`, `final_cost`, `status` y relacion a `customers`.
- [supabase/migrations/20260514133525_remote_schema.sql](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/supabase/migrations/20260514133525_remote_schema.sql) agrega `device_info`, `evidence_metadata`, `internal_notes`, `problem_description` y `warranty_until`.
- [supabase/migrations/20260530143000_add_public_token_to_service_orders.sql](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/supabase/migrations/20260530143000_add_public_token_to_service_orders.sql) agrega `service_orders.public_token`, lo rellena, lo deja `not null`, con default `gen_random_uuid()::text` e indice unico `(tenant_id, public_token)`.
- [supabase/migrations/20260523190000_order_documents_events.sql](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/supabase/migrations/20260523190000_order_documents_events.sql) define `service_order_documents` y `service_order_events`.
- No existen tablas fisicas `quotations` ni `quotation_items` en el repo.
- No existe tabla `service_order_authorizations`.

### Frontend real

- [apps/web-clientes/src/app/t/[tenantSlug]/portal/[folio]/page.tsx](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-clientes/src/app/t/[tenantSlug]/portal/[folio]/page.tsx) pasa el segmento `[folio]` a `PortalView` como `initialFolio`.
- [apps/web-clientes/src/lib/portal/portal-view.tsx](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-clientes/src/lib/portal/portal-view.tsx) llama `getOrderByFolio(tenantSlug, searchValue)`.
- [apps/web-clientes/src/lib/api/orders.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-clientes/src/lib/api/orders.ts) consume `/api/public/tenant/:tenantSlug/orders/:folio`.
- [apps/web-clientes/src/lib/portal/portal-view.tsx](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-clientes/src/lib/portal/portal-view.tsx) genera el link de PDF usando `result.order.folio`, lo cual conserva el riesgo de folio plano en PDF.
- [apps/web-clientes/src/components/portal/document-list.tsx](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-clientes/src/components/portal/document-list.tsx) muestra documentos recibidos del backend.
- [apps/web-clientes/src/components/portal/evidence-gallery.tsx](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-clientes/src/components/portal/evidence-gallery.tsx) muestra imagenes/videos recibidos del backend.

### Storage/PDF real

- [apps/api/src/controllers/orders.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/controllers/orders.ts) usa `SUPABASE_ORDER_BUCKET` o fallback `order-assets`.
- [apps/api/src/controllers/orders.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/controllers/orders.ts) crea el bucket con `public: true` si no existe.
- [apps/api/src/controllers/orders.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/controllers/orders.ts) usa `getPublicUrl`, por lo que las URLs almacenadas son publicas y no expiran.
- [apps/api/src/controllers/public.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/controllers/public.ts) genera PDF publico en memoria con `PDFKit` en `getPublicOrderPdf`.
- [apps/api/src/controllers/public.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/controllers/public.ts) tambien puede devolver `pdf_attachment` apuntando a `receipt_url` o documento `receipt_pdf` almacenado.

### Riesgos reales

- Riesgo critico: enumeracion por folio en `GET /api/public/tenant/:tenantSlug/orders/:folio` y `.../pdf`.
- Riesgo critico: el portal puede exponer PII, documentos, eventos y costos si un tercero adivina folios secuenciales.
- Riesgo alto: el frontend del portal todavia pide "folio" y permite busqueda manual por folio/token.
- Riesgo alto: el link de PDF se construye hoy con `result.order.folio`, aunque la orden haya sido abierta por token.
- Riesgo medio: los documentos usan `public_url` no expirable porque el bucket actual es publico.
- Riesgo medio: no existe visibilidad publica por documento/evidencia hasta que T02 quede aplicado completamente.

## Mapa Dominio -> Fisico

| Dominio | Fisico actual | Decision |
| --- | --- | --- |
| autorizacion | No existe tabla fisica | Crear `service_order_authorizations`. |
| portal | `apps/web-clientes` + `apps/web-public` consumiendo `/api/public/tenant/:tenantSlug/orders/:folio` | Mantener ruta compatible, pero exigir `public_token` para datos sensibles. |
| documentos | `service_order_documents` + puente `service_orders.evidence_metadata` | Usar documentos normalizados y filtrar visibilidad cuando T02 este aplicado. |
| orden | `service_orders` | La orden es la entidad real autorizable. |
| cotizacion/presupuesto | `service_orders.estimated_cost` y `service_orders.final_cost`; `service_requests` solo para leads | No usar `quotations` ni `quotation_items` como tablas fisicas. |
| token publico | `service_orders.public_token` | Fuente unica para acceso publico seguro al portal y PDF. |

## T11 Autorizacion Online Con Aceptacion/Firma

### EXISTE EN REPO

- `service_orders` contiene `estimated_cost` y `final_cost`.
- `service_orders.public_token` existe y es unico por tenant.
- `service_requests` existe para solicitudes/leads publicos.
- `service_order_events` existe para timeline.
- `audit_logs` y el servicio de auditoria T04 ya existen.
- No existen `quotations`, `quotation_items` ni `service_order_authorizations`.

### CAMBIO DE ESQUEMA PROPUESTO

Crear `service_order_authorizations`:

- `id` uuid PK
- `tenant_id` uuid FK `tenants.id` not null
- `service_order_id` uuid FK `service_orders.id` not null
- `status` text not null default `accepted`
- `authorized_cost` numeric(12,2) not null
- `currency` text not null default `MXN`
- `quote_snapshot` jsonb not null
- `accepted_terms_version` text not null
- `accepted_by_name` text null
- `client_ip` text null
- `client_user_agent` text null
- `authorization_method` text not null default `public_portal`
- `public_token_used` text not null
- `request_id` text not null
- `created_at` timestamptz not null default UTC now

Constraints e indices:

- `CHECK (authorized_cost > 0)`
- `CHECK (status IN ('accepted', 'rejected'))`
- `CHECK (authorization_method IN ('public_portal'))`
- unique `(tenant_id, service_order_id)`
- index `(tenant_id, service_order_id, created_at desc)`
- index `(tenant_id, created_at desc)`

RLS:

- habilitar y forzar RLS.
- lectura solo por tenant autenticado.
- escritura desde backend con contexto de tenant y validacion de `public_token`.
- no exponer escritura directa publica por tabla; el acceso publico debe pasar por controlador backend.

### DECISION TECNICA FINAL

- La entidad autorizable real es `service_orders`.
- Se usa `service_orders` porque no existen `quotations` ni `quotation_items` y porque el monto real a autorizar vive hoy en `estimated_cost`.
- `estimated_cost` es el monto autorizable. `final_cost` no sustituye al monto autorizado; puede cambiar despues por flujo financiero, pero si sube el presupuesto debe requerirse nueva decision de producto antes de permitir otra autorizacion.
- La autorizacion debe congelar `authorized_cost` y `quote_snapshot` al momento de aceptar.
- `quote_snapshot` debe incluir al menos: `service_order_id`, `folio`, `estimated_cost`, `final_cost`, `currency`, `problem_description`, resumen de `device_info`, `status`, `accepted_terms_version` y timestamp de generacion.
- No se guarda firma dibujada como prueba legal fuerte. La evidencia tecnica sera timestamp, IP, user-agent, version de terminos, token usado, snapshot de monto y auditoria T04.
- Idempotencia: una orden solo puede tener una autorizacion activa registrada por unique `(tenant_id, service_order_id)`. Reintentos con la misma orden deben devolver la autorizacion existente si el snapshot no cambio; si el monto cambio, debe responder error de conflicto y requerir flujo explicito posterior.

Payload final:

```json
{
  "publicToken": "uuid-string",
  "decision": "accepted",
  "acceptedByName": "string opcional",
  "acceptedTermsVersion": "string obligatorio",
  "authorizedCost": 1234.56
}
```

Endpoint final con convencion real:

- `POST /api/public/tenant/:tenantSlug/orders/:publicToken/authorization`

Validaciones backend:

- `tenantSlug` debe resolver a un tenant existente.
- `publicToken` debe buscar exclusivamente `service_orders.public_token`.
- La orden debe pertenecer al tenant resuelto.
- `estimated_cost` debe ser mayor a cero.
- `authorizedCost` debe igualar `service_orders.estimated_cost` al momento de autorizar.
- `acceptedTermsVersion` es obligatorio.
- No aceptar si ya existe autorizacion para la orden con snapshot distinto.
- No aceptar por `folio` plano.

Auditoria T04:

- Evento critico: `order.budget_authorized_by_client`.
- Debe incluir `tenant_id`, `service_order_id`, `authorized_cost`, `public_token_used`, `client_ip`, `client_user_agent`, `accepted_terms_version`, `request_id`, `dataBefore` y `dataAfter`.
- Si falla auditoria critica, falla la autorizacion.
- Tambien debe registrarse evento de orden en `service_order_events` para timeline operativo.

Pruebas requeridas:

- aceptar presupuesto con token valido crea una fila en `service_order_authorizations`.
- aceptar con folio plano no funciona.
- aceptar con token de otro tenant no funciona.
- aceptar con `estimated_cost` cero falla.
- aceptar con `authorizedCost` distinto a `estimated_cost` falla.
- reintento idempotente no duplica autorizacion.
- accion critica genera `audit_logs.request_id`.

Rollback:

- desactivar endpoint de autorizacion publica.
- conservar `service_order_authorizations` como historico.
- seguir mostrando portal sin boton de autorizacion.
- no borrar autorizaciones existentes.

Definition of Done:

- el cliente puede autorizar el monto exacto desde portal con `public_token`.
- la autorizacion queda ligada a `service_orders`.
- el monto queda congelado en `authorized_cost` y `quote_snapshot`.
- no hay dependencia de tablas `quotations` ni `quotation_items`.
- la auditoria critica queda escrita con `request_id`.

## T12 Portal Cliente Completo Con Documentos

### EXISTE EN REPO

- `service_orders.public_token` existe.
- `getPublicPortalOrder` busca hoy por `folio` o `public_token`.
- `getPublicOrderPdf` busca hoy por `folio` o `public_token`.
- `PortalView` recibe el segmento `[folio]`, lo manda al backend y muestra timeline, documentos, evidencias, mensajes y PDF.
- `DocumentList` y `EvidenceGallery` muestran URLs recibidas del backend.
- `service_order_documents` y `service_order_events` existen.
- `service_orders.evidence_metadata` sigue siendo puente legacy.
- El PDF publico se genera con `PDFKit`; no se guarda necesariamente como nuevo archivo.

### CAMBIO DE ESQUEMA PROPUESTO

- No se requiere tabla nueva para el acceso por token porque `service_orders.public_token` ya existe.
- Si T02 ya agrego campos de visibilidad, el portal debe filtrar `service_order_documents` por visibilidad publica.
- Si T02 no esta aplicado, el portal debe ser conservador y no exponer documentos sensibles por defecto.
- No inventar buckets nuevos.
- No introducir signed URLs en este bloque porque el repo no las usa hoy.

### DECISION TECNICA FINAL

- El acceso publico seguro al portal y al PDF debe ser exclusivamente por `service_orders.public_token`.
- La ruta puede conservar el nombre historico `:folio` para compatibilidad de frontend, pero semanticamente el valor aceptado debe ser `public_token`.
- `GET /api/public/tenant/:tenantSlug/orders/:publicToken` debe consultar con `.eq('tenant_id', tenant.id).eq('public_token', publicToken)`.
- `GET /api/public/tenant/:tenantSlug/orders/:publicToken/pdf` debe consultar con el mismo criterio.
- No se permite lookup publico por folio plano para datos sensibles.

URLs antiguas por folio:

- Deben responder 404 generico.
- No deben revelar si el folio existe.
- El mensaje de UI debe pedir solicitar un nuevo enlace seguro al taller.
- No debe haber fallback automatico de folio a token.

Informacion que se muestra:

- tenant publico minimo: nombre, slug, branding y contacto publico.
- orden sanitizada: `folio`, `status`, fechas publicas, `promised_date`, `device_info` limitado, `problem_description` si es apta para cliente, `estimated_cost`, `final_cost` cuando sea necesario para presupuesto/autorizacion.
- timeline publico derivado de `service_order_events` y estado actual.
- documentos/evidencias marcados como visibles para cliente.
- PDF de recepcion/cotizacion generado o almacenado si es visible para cliente.
- estado de autorizacion cuando T11 este implementado.
- garantia cuando T10 este implementado.

Informacion que nunca se muestra:

- `internal_notes`
- `internal_diagnosis`
- auditoria interna
- usuarios internos o IDs internos no necesarios
- historial completo del dispositivo T09
- datos de otros clientes u otras ordenes
- documentos/evidencias internos
- costos internos, proveedores, margenes, inventario o movimientos financieros internos
- `public_token` en el payload de respuesta

Documentos/evidencias visibles:

- Fuente primaria: `service_order_documents`.
- Fuente temporal legacy: `service_orders.evidence_metadata`, solo mientras exista puente.
- El portal debe filtrar por visibilidad cuando T02 este disponible.
- Mientras no exista visibilidad por documento, no debe exponerse evidencia interna por defecto.
- No se crean buckets nuevos ni URLs firmadas en esta decision.

PDF:

- El PDF publico debe requerir `public_token`.
- El link generado por frontend debe usar el token de entrada, no `result.order.folio`.
- El PDF generado en memoria debe usar la misma sanitizacion que el portal.
- Si se devuelve `receipt_url` o `receipt_pdf` almacenado, debe respetar visibilidad publica.

Token invalido:

- Responder 404 generico.
- No distinguir token inexistente, folio antiguo, tenant valido sin orden o orden no visible.
- No devolver detalles internos de error.

Aislamiento tenant:

- Resolver tenant por `tenantSlug`.
- Buscar orden por `(tenant_id, public_token)`.
- No permitir consulta por token sin tenant.
- No permitir que un token de otro tenant devuelva datos.

Cambios frontend:

- Cambiar copy de "folio" a "enlace/token de acceso" donde aplique.
- Mantener segmento `[folio]` solo como compatibilidad de ruta si no se renombra.
- `getOrderByFolio` debe pasar a semantica de `getOrderByPublicToken`.
- `generatedPdfHref` debe usar el valor de token de acceso y no `result.order.folio`.
- Estados vacios/error deben ser genericos y no revelar existencia de folios.

Pruebas de seguridad:

- `GET /api/public/tenant/:slug/orders/:folio-secuencial` devuelve 404.
- `GET /api/public/tenant/:slug/orders/:public_token` devuelve datos sanitizados.
- `GET /api/public/tenant/:slug/orders/:public_token/pdf` devuelve PDF sanitizado.
- token valido de tenant A no funciona en tenant B.
- respuesta publica no incluye `internal_notes`, `internal_diagnosis`, `audit_logs`, IDs de usuarios internos ni `public_token`.
- documento interno no aparece en portal.
- PDF por folio plano no funciona.

Rollback:

- si el portal por token falla, desactivar UI publica y pedir reenvio de enlace seguro.
- no reactivar lookup por folio plano para datos sensibles.
- conservar `public_token` en `service_orders`.
- mantener endpoints publicos respondiendo 404 generico mientras se corrige.

Definition of Done:

- el portal publico solo abre con `public_token`.
- el PDF publico solo abre con `public_token`.
- las URLs antiguas por folio plano no exponen datos.
- documentos y evidencias visibles estan filtrados.
- el payload publico queda sanitizado.
- la UI no invita al usuario a enumerar folios.

## Archivos Exactos A Modificar Cuando Se Implemente

### Backend

- [apps/api/src/controllers/public.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/controllers/public.ts)
- [apps/api/src/routes/public.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/routes/public.ts)
- [apps/api/src/controllers/orders.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/controllers/orders.ts)
- [apps/api/src/services/evidence-adapter.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/services/evidence-adapter.ts)
- [apps/api/src/services/audit.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/services/audit.ts)
- [apps/api/src/lib/request-ip.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/lib/request-ip.ts)

### Frontend

- [apps/web-clientes/src/app/t/[tenantSlug]/portal/[folio]/page.tsx](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-clientes/src/app/t/[tenantSlug]/portal/[folio]/page.tsx)
- [apps/web-clientes/src/lib/portal/portal-view.tsx](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-clientes/src/lib/portal/portal-view.tsx)
- [apps/web-clientes/src/lib/api/orders.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-clientes/src/lib/api/orders.ts)
- [apps/web-clientes/src/lib/types.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-clientes/src/lib/types.ts)
- [apps/web-clientes/src/lib/utils/normalizers.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-clientes/src/lib/utils/normalizers.ts)
- [apps/web-clientes/src/components/portal/document-list.tsx](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-clientes/src/components/portal/document-list.tsx)
- [apps/web-clientes/src/components/portal/evidence-gallery.tsx](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-clientes/src/components/portal/evidence-gallery.tsx)
- [apps/web-public/src/components/public-portal-lookup.tsx](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-public/src/components/public-portal-lookup.tsx)

### Supabase

- nueva migracion para `service_order_authorizations`
- ninguna migracion nueva para `public_token`, porque ya existe

## Bloqueantes Reales

- T12 no debe cerrarse sin eliminar lookup por folio plano en portal y PDF.
- T11 no debe cerrarse sin tabla `service_order_authorizations`.
- T11 no debe cerrarse si la autorizacion no congela `estimated_cost` y version de terminos.
- T11/T12 dependen de que T02 defina visibilidad publica de documentos/evidencias; si T02 no esta aplicado, el portal debe ser restrictivo con documentos.
- La UI debe dejar de construir PDF publico con `result.order.folio`.

## Veredicto

**LISTO PARA IMPLEMENTAR T11/T12**

Motivo:

- la orden real (`service_orders`) y `public_token` ya existen
- el portal y PDF publicos ya existen y tienen una ruta clara de hardening
- no se requiere `quotations` ni `quotation_items`
- la autorizacion faltante queda delimitada en una tabla nueva y contrato publico concreto
- los bloqueantes son de implementacion, no de decision tecnica
