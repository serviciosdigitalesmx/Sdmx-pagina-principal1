# T13 PACKET PARA GPT-5.5

## 1. Objetivo
T13 debe definir WhatsApp automatizado o semi-automatizado para Fixi.
Debe partir de consentimiento T02, autorizacion T11 y portal T12 por `public_token`.
No debe enviar datos privados ni prometer envio real sin proveedor.
Debe decidir si se implementa como `wa.me`, plantillas, cola/outbox o integracion real.
Este packet solo recolecta evidencia; no implementa codigo.

## 2. Estado Git
- Rama actual: `## main...origin/main`.
- Ultimos 16 commits:
  - `1f95c27 feat(t12): add secure customer portal by token`
  - `317ce2b feat(t11): add online order authorizations`
  - `50ffcf7 feat(t10): add service order warranty claims`
  - `312b8b5 feat(t09): add device history by serial`
  - `43d962e feat(t08): consume reserved inventory atomically`
  - `96e8835 feat(t07): add inventory reservations`
  - `266c362 docs: define T00 canonical foundations strategy`
  - `5912caf chore: add supabase cli dependency`
  - `6935a29 feat(t02): add consent and evidence visibility controls`
  - `343b0bb feat(t06): add order payment refunds`
  - `327c375 feat(t05): register order payments`
  - `0c7fef5 feat(t03): enforce configurable serial number`
  - `9afcada feat(t01): enforce legal intake checklist`
  - `62d9c78 docs: finalize Fixi implementation decisions`
  - `67b8e4f docs: add technical design and repo reality for T17 to T20`
  - `9f554e7 docs: add technical design and repo reality for T13, T14 and T15`
- Cambios locales antes de crear packet: ninguno.
- Archivos creados por esta tarea: `docs/ai-packets/T13-packet.md`.

## 3. Dependencias previas
- T00 Fundaciones: exige mapeo fisico oficial; `orders`/`repair_orders` -> `service_orders`, documentos -> `service_order_documents`, eventos -> `service_order_events`, auditoria -> `audit_logs`.
- T02 consentimiento/privacidad: `customers` agrega `data_consent_status`, `data_consent_scope`; documentos agregan `is_customer_visible` y `retention_expires_at`.
- T11 autorizacion online: autorizacion publica usa exclusivamente `service_orders.public_token`, no folio plano, y audita con `audit_logs`.
- T12 portal por token: endpoint canonico `GET /public/tenant/:tenantSlug/orders/:publicToken/portal` busca por `(tenant_id, public_token)` y no devuelve token completo.
- Clientes/telefonos: telefonos existen en `customers.phone`, `service_requests.customer_phone` y `device_info.customer_phone` usado por UI admin.
- Eventos/timeline: `service_order_events` existe para timeline; T13 puede registrar eventos de mensaje sin exponer internos.
- Auditoria T04: acciones manuales o reenvios deben auditarse con `request_id`; envio automatico debe dejar bitacora confiable.

## 4. Decisiones heredadas
- T13 no debe exponer datos privados porque T02 dice que evidencia interna nunca aparece en portal cliente.
- Mensajes deben usar link por `public_token` cuando aplique porque T11/T12 cerraron acciones sensibles por token.
- Folio puede aparecer como texto informativo, pero no como credencial de acceso.
- Debe convivir con portal T12: mandar URL al portal canonico por token, no a endpoint legacy por folio si el mensaje da acceso sensible.
- Debe respetar consentimiento del cliente antes de encolar/enviar WhatsApp.
- No debe automatizar envio real sin proveedor/configuracion/credenciales definidos; hoy solo hay `wa.me`, plantillas y push interno.

## 5. Documentacion revisada
- `AGENTS.md`: ordena seguir docs canonicos/specs, no inventar columnas/rutas/tablas y detenerse si el repo esta sucio.
- `docs/specs/decisions_t00_fundaciones_canonicas.md`: confirma mapeo fisico vivo: `service_orders`, `service_order_documents`, `service_order_events`, `audit_logs`.
- `docs/specs/spec_01_fundaciones.md`: estados criticos de orden requieren auditoria; T13 debe respetar tenant/roles/ordenes.
- `docs/specs/spec_02_recepcion_finanzas.md`: evidencia vive en `service_order_documents`; evidencia interna nunca aparece en portal; consentimiento va por cliente.
- `docs/specs/spec_03_inventario_cliente.md`: T13 es WhatsApp con cola y bitacora; propone `message_queue` o similar para trazabilidad, reintentos y plantillas.
- `docs/specs/spec_04_plataforma.md`: T04 rige auditoria y T16 debe probar recepcion/caja/portal sin regresiones.
- `docs/specs/implementation_order.md`: T13 va despues de T02, T11 y T12; no implementar visibles sin contratos de datos/permisos/auditoria.
- `docs/specs/dependencies.md`: T13 depende de T02, T11 y T12 para comunicacion automatizada.
- `docs/specs/decisions_t13_t14_t15.md`: decision previa propone `message_queue`, no mezclar con `notification_events`, usar `public_token`, idempotencia y dispatcher real.
- `docs/ai-packets/T11-packet.md`: identifica riesgo de folio plano y exige usar `public_token` para acciones sensibles.
- `docs/implementation-results/T11-result.md`: T11 no acepta autorizacion por folio; guarda solo `public_token_last4`; auditoria falla cerrado.
- `docs/ai-packets/T12-packet.md`: portal debe ser read-only sanitizado; T09 interno no debe exponerse; folio plano es riesgo.
- `docs/implementation-results/T12-result.md`: T12 agrega portal por token, no devuelve `public_token`, no expone audit logs, y recomienda T13 con cola/bitacora.

## 6. Modelo fisico real encontrado
- `service_orders`
  - Confirmado en `supabase/migrations/20260424_baseline_schema.sql` y `20260530143000_add_public_token_to_service_orders.sql`.
  - Columnas relevantes observadas: `id`, `tenant_id`, `customer_id`, `service_request_id`, `folio`, `status`, `device_info`, `serial_number`, `reported_issue`, `internal_diagnosis`, `estimated_cost`, `final_cost`, `public_token`, fechas.
  - Uso T13: origen de orden, folio informativo, token seguro, cliente y contexto.
- `service_requests`
  - Baseline crea `customer_name`, `customer_phone`, `customer_email`, `folio`; `20260514133525_remote_schema.sql` la elimina y no se encontro recreate posterior.
  - Uso T13: solo referencia/riesgo; no asumir fisico estable sin confirmar base objetivo.
- `customers`
  - Baseline crea `tenant_id`, `full_name`, `phone`, `email`; T02 agrega `data_consent_status`, `data_consent_scope`, `data_consent_updated_at`.
  - Uso T13: validar telefono y consentimiento.
- `service_order_events`
  - `20260523190000_order_documents_events.sql`: `tenant_id`, `service_order_id`, `event_type`, `previous_status`, `new_status`, `note`, `actor_name`, `created_by`, `created_at`.
  - Uso T13: timeline/bitacora de orden; posible evento cuando se genera o encola mensaje.
- `service_order_documents`
  - `20260523190000_order_documents_events.sql` y T02: `bucket_name`, `storage_path`, `public_url`, `file_type`, `is_customer_visible`, `retention_expires_at`.
  - Uso T13: no adjuntar ni mandar documentos privados; link al portal T12 en vez de URLs directas sensibles.
- `service_order_authorizations`
  - `20260624173310_t11_service_order_authorizations.sql`: `service_order_id`, `status`, `authorized_amount`, `public_token_last4`, `accepted_by_phone`, `ip_address`, `user_agent`.
  - Uso T13: mensajes de autorizacion deben enlazar flujo T11/T12 sin exponer IP/user-agent/firma/token completo.
- `notification_events`
  - Baseline crea `tenant_id`, `channel`, `event_type`, `recipient`, `payload_json`, `status`, `sent_at`, `created_at`; `20260514133525_remote_schema.sql` la elimina; no se encontro recreate.
  - Codigo `apps/api/src/services/pwa-push.ts` aun escribe `notification_events` con `channel='push'`.
  - Uso T13: no confiar como cola WhatsApp hasta resolver desalineacion; no mezclar push interno con mensajes transaccionales.
- Tablas de mensajes/templates
  - No existe `message_queue`, `message_outbox`, `message_logs` ni tabla fisica de templates.
  - Plantillas WhatsApp existen en codigo/config runtime (`apps/api/src/services/tenant-config.ts`) y limites en `tenant-capabilities.ts`.

## 7. Codigo real relacionado
- `apps/api/src/routes/orders.ts`
  - `POST /:id/messages` apunta a `addOrderMessage`.
  - Importa como posible ruta existente de mensajes de orden; candidato a revisar/modificar si T13 agrega bitacora manual.
- `apps/api/src/controllers/orders.ts`
  - Escribe `service_order_events`; crea `public_token`; dispara `sendTenantPushNotification`.
  - Riesgo: notificaciones actuales son push interno, no WhatsApp; candidato si se encola al cambiar estado.
- `apps/api/src/controllers/public.ts`
  - `getPublicPortalByToken` busca por `public_token`; `getPublicOrderPdf` legacy busca por folio/token.
  - Solo referencia para construir links seguros.
- `apps/api/src/services/pwa-push.ts`
  - Envia PWA push y escribe `notification_events`.
  - Riesgo: tabla puede no existir por migracion remota; no es proveedor WhatsApp.
- `apps/api/src/services/tenant-capabilities.ts`
  - Modulo `whatsapp` existe; limites `whatsapp_templates` por plan.
  - Referencia/candidato para limites de T13.
- `apps/api/src/services/tenant-config.ts`
  - Plantillas `whatsapp` con `{{customer_name}}`, `{{order_folio}}`, `{{portal_url}}`; reglas sugieren reenviar por WhatsApp.
  - Candidato para resolver templates sin hardcodear mensajes.
- `apps/web-admin/src/components/dashboard/orders/order-detail-drawer.tsx`
  - Genera `wa.me` con tracking URL por folio; riesgo de folio plano.
  - Candidato a modificar para usar token/endpoint T12 si disponible.
- `apps/web-admin/src/components/dashboard/orders/order-intake-modal.tsx`
  - Genera WhatsApp manual con `portalUrl`.
  - Riesgo: sanitizacion simple de telefono y link legacy.
- `apps/web-admin/src/components/operativo/success.tsx`
  - Abre `wa.me/52${customerPhone}` con folio y tracking URL.
  - Riesgo: prefijo fijo MX y folio como acceso.
- `apps/web-admin/src/components/solicitudes/quote-modal.tsx`
  - Arma cotizacion con conceptos/montos y abre `wa.me/52${phone}`.
  - Riesgo: datos comerciales sensibles en texto, sin bitacora/consentimiento.
- `apps/web-admin/src/services/apiGateway.ts`
  - Define tipos de WhatsApp templates, telefono y publicUrl; no envia WhatsApp real.
  - Referencia para contratos frontend.
- `apps/web-clientes/src/lib/portal/portal-view.tsx`
  - Cliente puede contactar al taller por `wa.me` usando telefono del tenant y folio.
  - Referencia; T13 es comunicacion taller->cliente, no cliente->taller.
- `apps/web-clientes/src/lib/landing/landing-renderer.tsx` y `lead-form.tsx`
  - Links `wa.me` hacia contacto del taller.
  - Solo referencia para links manuales publicos.

## 8. Flujo actual encontrado
- Boton WhatsApp en admin: si, en detalle de orden, intake, success y cotizaciones.
- Mensaje precargado `wa.me`: si, con texto armado en frontend.
- Envio real por API: no encontrado.
- Plantillas de mensaje: si, en `tenant-config.ts`, no tabla fisica.
- Link de seguimiento: si, actualmente admin usa tracking/portal con folio en varias pantallas.
- Link PDF: si, PDF publico legacy por folio/token; T12 no implemento PDF token-based.
- Link autorizacion T11: backend publico por `public_token`; T12 lo resume en portal.
- Link portal T12 por token: endpoint existe; admin links aun no actualizados para compartir `public_token`.
- Recordatorios automaticos: no encontrados; solo sugerencias de semaforo.
- Cola/outbox: no existe `message_queue` ni worker.
- Consentimiento antes de enviar: no encontrado en UI WhatsApp actual.
- Validacion de telefono: solo `replace(/\D/g,'')`, con prefijo `52` hardcodeado en algunos componentes.

## 9. Opciones tecnicas para T13
### Opcion A - WhatsApp semi-automatizado con `wa.me`
- Ventajas: bajo riesgo, sin proveedor, aprovecha UI actual.
- Riesgos: no hay entrega verificable, no hay reintentos, telefono equivocado, folio/token en texto del navegador.
- Archivos afectados: `web-admin` componentes de orden/cotizacion, tipos/API si se centraliza mensaje.
- SQL: no requerido si solo se corrigen links; podria registrar evento.
- Compatibilidad T02/T11/T12: alta si usa consentimiento y portal por token.

### Opcion B - Plantillas internas + historial de eventos
- Ventajas: usa templates de tenant, versiona contenido y registra `service_order_events`.
- Riesgos: `service_order_events` no es cola; puede confundirse generado con entregado.
- Archivos afectados: API orders/services, admin UI, tenant-config.
- SQL: posible no, si reusa eventos; si requiere versionado real, si.
- Compatibilidad: buena para auditoria ligera; insuficiente para automatizacion real.

### Opcion C - Outbox/cola para proveedor futuro
- Ventajas: idempotencia, estados, reintentos, bitacora; alinea decision previa `message_queue`.
- Riesgos: requiere migracion, permisos/RLS, dispatcher y reglas de retencion.
- Archivos afectados: migracion, API notifications/orders, services, admin bitacora.
- SQL: si, tabla `message_queue` o similar.
- Compatibilidad: mejor con T02/T11/T12 si guarda `template_key`, `public_token`/link seguro y consentimiento.

### Opcion D - Integracion real WhatsApp API/proveedor
- Ventajas: envio real, provider_message_id, delivery status si proveedor soporta.
- Riesgos: credenciales, templates aprobados, costos, rate limits, webhooks, datos personales.
- Archivos afectados: todo C mas provider adapter, env vars, webhook/worker.
- SQL: si, cola + intentos/estado proveedor.
- Compatibilidad: solo viable si GPT-5.5 define proveedor, credenciales, webhooks y politica.

## 10. Reglas de seguridad/privacidad que debe cuidar T13
- No mandar datos privados por defecto.
- No mandar `internal_diagnosis`, notas internas ni documentos privados.
- Usar links seguros por `public_token` para portal/autorizacion/garantia.
- No exponer `public_token` completo en logs innecesarios; si se guarda, justificar y proteger.
- Sanitizar telefono, pais y formato; no asumir siempre `52`.
- Respetar `customers.data_consent_status` y scope antes de encolar/enviar.
- Registrar evento/bitacora sin guardar contenido sensible excesivo.
- No hacer envios reales sin proveedor explicito.
- No guardar credenciales en codigo.
- No romper portal legacy ni PDF legacy.
- Distinguir `generated`, `queued`, `sent`, `failed` y `delivered` si aplica.
- Idempotencia obligatoria para evitar duplicados.

## 11. Riesgos reales
- Enviar datos al telefono equivocado por telefono no verificado o copiado de `device_info`.
- Mensajes con datos sensibles en cotizaciones o diagnosticos.
- Folio enumerado si el link vuelve al tracking legacy.
- Token filtrado por URLs/logs si se comparte completo sin controles.
- Plantilla mutable sin version ni snapshot.
- Falta de consentimiento o scope para mensajeria.
- Prometer envio automatico sin proveedor ni dispatcher.
- WhatsApp bloqueando links, formatos o rate limits.
- Auditoria insuficiente si solo se abre `wa.me`.
- Confundir mensaje generado con mensaje entregado.
- No distinguir manual vs automatico.
- Desalineacion de `notification_events`: baseline la crea, remote la elimina, codigo PWA la usa.

## 12. Preguntas para GPT-5.5
1. ¿T13 debe implementar A, B, C o D para este ciclo?
2. Si se elige cola, ¿la tabla canonica sera `message_queue`, `message_outbox` u otro nombre?
3. ¿T13 debe actualizar links admin para usar portal T12 por `public_token` aunque admin hoy no siempre tenga token disponible?
4. ¿Que consentimiento exacto habilita WhatsApp: `accepted` general o scope especifico de mensajeria?
5. ¿Se autoriza proveedor real ahora o T13 debe quedar semi-automatizado/cola sin dispatch externo?

## 13. Lo que GPT-5.5 debe devolver
- T13 WORKPACK cerrado.
- Decision entre A/B/C/D.
- Archivos autorizados.
- SQL exacto si requiere migracion.
- Endpoints si aplica.
- Contrato request/response.
- Cambios frontend permitidos.
- Reglas de plantillas.
- Reglas de consentimiento.
- Reglas de links seguros.
- Reglas de auditoria/eventos.
- Pasos cerrados para Codex Mini.
- Comandos de validacion.
- Rollback.
- Criterios de aceptacion.
