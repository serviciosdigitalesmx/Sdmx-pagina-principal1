# Diseño Técnico: T11 e T12 (Basado en la Realidad del Repo)

Este documento contiene el diseño técnico y el reporte de realidad operativa para la implementación de los tickets T11 (Autorización online con aceptación/firma) y T12 (Portal cliente completo con documentos), basados en la inspección del esquema de base de datos actual y el código monolítico.

## 1. Evidencia Real Encontrada (`EXISTE EN REPO`)

Tras inspeccionar `apps/api/src/controllers/public.ts`, el frontend en `apps/web-clientes` y el esquema transaccional en `supabase/migrations/`:

*   **Tabla física principal (Financiera):** `public.service_orders`. El presupuesto a aprobar existe dentro de la propia orden bajo los campos físicos `estimated_cost` y `final_cost`.
*   **Cotizaciones Públicas (Leads):** Se usa la tabla `public.service_requests` como *inbox* de prospectos. **No existen** las tablas `quotations` ni `quotation_items` indicadas en la doc canónica.
*   **Token Público:** Existe el campo transaccional `public_token` (UUIDv4) en `public.service_orders`, añadido en `20260530143000_add_public_token_to_service_orders.sql`.
*   **Documentos:** Se gestionan mediante `public.service_order_documents` que asienta URLs estáticas provenientes del Storage, complementado con JSON empaquetado en metadatos (Adapter: `getEvidenceMetadata()`).
*   **Generación PDF:** El sistema utiliza la librería en memoria `PDFKit` directamente en el endpoint `GET /api/v1/public/tenant/:tenantSlug/orders/:folio/pdf`. No almacena los PDF renderizados.
*   **Portal:** Frontend web en Next.js situado en la ruta `apps/web-clientes/src/app/t/[tenantSlug]/portal/[folio]/page.tsx`.

## 2. Mapa del Sistema y Contradicciones

### Contradicciones Documentación Canónica vs Realidad
*   **Módulo Cotizaciones:** La documentación oficial solicita tablas y lógicas aisladas (`quotations`), pero el código real usa monolíticamente a `service_orders` para portar los costos (`estimated_cost`) y a `service_requests` para portar los presupuestos iniciales o contactos (`createPublicQuote`).
*   **Seguridad:** El controlador API existente (`getPublicPortalOrder` línea 713 de `public.ts`) resuelve la búsqueda permitiendo un `.or` entre `folio` y `public_token`. Los folios son predecibles y de corta longitud (ej. ORD-001), por lo cual el mecanismo real sufre de un riesgo crítico de enumeración.

### Riesgos de Seguridad Detectados (Críticos)
*   **Ataque por Enumeración (Cross-Tenant Exposure):** Al poder consultar `.../orders/ORD-001`, un robot podría iterar sobre los folios secuenciales de un taller para extraer facturas, presupuestos, PII, documentos y PDFs privados si se conoce el slug del tenant.
*   **Storage Sin Expiración:** El backend entrega al portal la columna plana `public_url`. Esto implica que las imágenes u oficios de identidad están expuestos vitaliciamente o exigen configuración en el bucket que no está impuesta desde el código de aplicación.

---

## 3. T11: Autorización Online con Aceptación/Firma

### `DECISIÓN QUE DEBE VALIDAR CODEX`
Dado que no existe la tabla `quotations`, el objeto a autorizar recaerá sobre la propia `service_orders` cuando transite a estado "cotizado/diagnóstico" y posea un `estimated_cost` > 0.

### `CAMBIO DE ESQUEMA PROPUESTO`
```sql
CREATE TABLE public.service_order_authorizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  service_order_id uuid NOT NULL REFERENCES public.service_orders(id),
  authorized_cost numeric(12,2) NOT NULL,
  authorization_method text NOT NULL DEFAULT 'public_portal',
  client_ip text,
  client_user_agent text,
  accepted_terms_version text,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);
CREATE UNIQUE INDEX auth_order_uidx ON public.service_order_authorizations (service_order_id);
```

### Mecanismo de Aceptación, Firma e Idempotencia
*   **Aceptación en Portal:** Botón visible al usuario (cuando se aplique token seguro) indicando "Autorizar Costo de $X.XX MXN" anclado a un checkbox obligatorio ("Acepto términos").
*   **Firma Segura:** NO se recolectará un trazo / imagen bitmap del usuario ya que no aporta peso legal probatorio y es falsificable. En cambio, se registrará el momento cronológico (Timestamp), la IP remota real y el User-Agent. **Esta fila en BD será la evidencia técnica inmutable de la voluntad del cliente.**
*   **Idempotencia:** Asegurada a nivel base de datos por el índice único `auth_order_uidx` sobre `service_order_id`. Solo se puede otorgar el consentimiento una única vez por orden.

### Permisos y Auditoría
*   Aprobación disparará el sub-sistema interno llamando a `writeCriticalAuditLog()` con evento explícito: `order.budget_authorized_by_client`.

---

## 4. T12: Portal Cliente Completo Con Documentos

### `CAMBIO DE ESQUEMA PROPUESTO (A nivel Backend / Middleware)`
Es mandatorio bloquear inmediatamente la consulta por **folio plano** en el API público. La ruta frontend de `/t/[tenantSlug]/portal/[folio]` se mantendrá semánticamente, pero el string inyectado ahí por parte del taller (y WhatsApp) deberá ser el **`public_token` (UUIDv4)**.

### Información Visible / No Visible
*   **Se Muestra:** Línea de vida cronológica dinámica (Timeline), identificador genérico del modelo, costo a aceptar, documentos visuales y el ticket / PDF generado en memoria.
*   **No se Muestra:** Diagnósticos marcados para consumo interno (`internal_diagnosis`), desglose logístico o rotación de proveedores, ni el historial completo (Ticket T09) por estricta protección de datos del portador actual.

### Aislamiento Tenant y URLs
*   El backend filtrará estáticamente mediante `.eq('tenant_id', tenant.id).eq('public_token', token)` logrando la superposición de un doble factor seguro de URL.
*   El PDF (`getPublicOrderPdf`) no requerirá un mecanismo de borrado ni expiración física ya que no descansa en Storage, se vaporiza en la memoria RAM tras completar el stream de `PDFKit`.

### Flujo de Rollback / Degradación Graceful
*   En el caso en que un tercero trate de entrar vía URL con folio obsoleto, el frontend atajará con un 404 seguro o un Banner informativo incitando a pedir un nuevo token seguro vía el mostrador del comercio. 

---

## 5. Separación Obligatoria y Verificación

Los tags de clasificación (`EXISTE EN REPO`, `CAMBIO DE ESQUEMA PROPUESTO`, `DECISIÓN QUE DEBE VALIDAR CODEX`) se han respetado.

## 6. Bloqueantes Reales y Veredicto
*   **Veredicto:** `LISTO PARA ATERRIZAJE CON CODEX`
*   **Bloqueantes:** Se debe priorizar el aseguramiento en la encriptación/ofuscación del token a la hora de inyectar los links en SMS y T13 (WhatsApp Automatizado). Ningún otro bloqueante técnico impide el desarrollo.
