# T11 PACKET PARA GPT-5.5

## 1. Objetivo
T11 debe permitir que el cliente autorice online una cotizacion, diagnostico, reparacion o trabajo.
Debe registrar aceptacion explicita, identidad minima, timestamp, evidencia tecnica y auditoria critica.
No debe crear `devices`, no debe renombrar tablas y debe respetar el portal publico existente.
El punto a cerrar es si la autorizacion vive como tabla nueva, campos en orden o solo eventos/documentos.

## 2. Estado Git
- Rama actual: `main`.
- Estado antes de crear packet: limpio, `## main...origin/main`.
- Ultimos 12 commits:
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
- Archivos creados por esta tarea: `docs/ai-packets/T11-packet.md`.

## 3. Dependencias previas
- T00 Fundaciones: obliga a usar el mapeo `repair_orders` / `orders` -> `service_orders` y compatibilidad progresiva.
- T01 checklist legal: ya existe aceptacion de recepcion en `service_order_checklists`, pero no autorizacion de presupuesto.
- T02 consentimiento/evidencias/documentos: `service_order_documents` tiene visibilidad cliente y `customers` tiene consentimiento de datos.
- T03 serial/IMEI: `service_orders.serial_number` y `service_requests.serial_number` dan contexto, no identidad separada.
- T09 historial por dispositivo: no crea `devices`; el historial interno usa `service_orders.serial_number`.
- T10 garantias: agrega `service_order_warranties` y conserva `service_orders.warranty_until`; no toca finanzas/inventario automaticamente.
- Portal cliente/publico: existe consulta publica por `apps/api/src/controllers/public.ts` y frontend en `apps/web-clientes`.
- Auditoria T04: toda accion critica debe registrar `audit_logs` con `request_id`, `data_before` y `data_after` cuando aplique.

## 4. Decisiones heredadas
- T11 no debe crear `devices` porque T00 prohibe separar dispositivos/rewrite de T09/T10 sin ticket dedicado.
- Debe usar `service_orders` como entidad autorizable real si no existen `quotations` fisicas.
- Debe usar `service_order_documents` solo para evidencia/anexos visibles o privados segun T02.
- Debe usar `service_order_events` para timeline de autorizacion visible/interno.
- Debe respetar `is_customer_visible` y `retention_expires_at` para no exponer evidencia privada.
- Debe respetar `service_orders.public_token`; el repo actual tambien acepta folio plano y eso es riesgo a decidir.

## 5. Documentacion revisada
- `AGENTS.md`: mapeo oficial; prohibe inventar rutas/tablas/columnas y renombrar fisico sin workpack.
- `docs/specs/decisions_t00_fundaciones_canonicas.md`: estrategia B+A, compatibilidad progresiva, migraciones aditivas permitidas por ticket.
- `docs/specs/spec_01_fundaciones.md`: presupuesto canonico usa `quotations`/`quotation_items`, pero esas tablas no existen fisicamente en el repo actual.
- `docs/specs/spec_02_recepcion_finanzas.md`: checklist vive en `service_order_checklists`; evidencias en `service_order_documents`; eventos en `service_order_events`; consentimiento cliente en `PATCH /customers/:id/consent`.
- `docs/specs/spec_03_inventario_cliente.md`: T11 reduce friccion y registra aceptacion formal; canonicamente habla de `quotations` y `service_order_documents`.
- `docs/specs/spec_04_plataforma.md`: T04 rige acciones criticas; T16 debe probar recepcion/caja/portal sin regresiones.
- `docs/specs/implementation_order.md`: T11 va despues de T10 y antes de T12/T13.
- `docs/specs/dependencies.md`: T11 depende de Fundaciones y desbloquea T12/autorizacion de reparacion.
- `docs/ai-packets/T09-packet.md`: confirma no crear `devices`; historial usa `service_orders.serial_number`.
- `docs/implementation-results/T09-result.md`: endpoint interno no debe exponerse en portal publico.
- `docs/ai-packets/T10-packet.md`: garantia usa `service_orders`, documentos/eventos, audit logs; no modifica finanzas/inventario.
- `docs/implementation-results/T10-result.md`: T10 agrego `service_order_warranties`, no frontend, no signed URLs.

## 6. Modelo fisico real encontrado
- `service_orders`
  - Confirmado en `supabase/migrations/20260424_baseline_schema.sql`, `20260530143000_add_public_token_to_service_orders.sql`, `20260603095001_drop_total_cost_from_service_orders.sql`.
  - Columnas relevantes: `id`, `tenant_id`, `customer_id`, `service_request_id`, `folio`, `status`, `device_type`, `device_brand`, `device_model`, `serial_number`, `reported_issue`, `internal_diagnosis`, `estimated_cost`, `final_cost`, `promised_date`, `received_at`, `completed_at`, `delivered_at`, `warranty_until`, `public_token`.
  - Uso T11: entidad real a autorizar; `estimated_cost` es el presupuesto actual y `public_token` el acceso publico seguro existente.
- `service_requests`
  - Confirmado en `supabase/migrations/20260424_baseline_schema.sql` y T03.
  - Columnas relevantes: `tenant_id`, `folio`, `customer_name`, `customer_phone`, `customer_email`, `device_type`, `device_model`, `serial_number`, `issue_description`, `quoted_total`, `deposit_amount`, `balance_amount`, `solicitud_origen_ip`, `metadata`.
  - Uso T11: cotizacion/lead publico previo; no es la autorizacion formal de una orden.
- `quotations`
  - No se encontro `create table` en `supabase/migrations`.
  - Uso T11: nombre canonico/documental, sin tabla fisica actual.
- `quotation_items`
  - No se encontro `create table` en `supabase/migrations`.
  - Uso T11: nombre canonico/documental, sin tabla fisica actual.
- `service_order_documents`
  - Confirmado en `supabase/migrations/20260523190000_order_documents_events.sql` y T02.
  - Columnas relevantes: `tenant_id`, `service_order_id`, `bucket_name`, `storage_path`, `public_url`, `file_name`, `file_type`, `mime_type`, `source`, `is_customer_visible`, `retention_expires_at`.
  - Uso T11: anexos/evidencia de aceptacion o firma si se autoriza, cuidando visibilidad.
- `service_order_events`
  - Confirmado en `supabase/migrations/20260523190000_order_documents_events.sql`.
  - Columnas relevantes: `tenant_id`, `service_order_id`, `event_type`, `previous_status`, `new_status`, `note`, `actor_name`, `created_by`, `created_at`.
  - Uso T11: timeline de autorizacion, aceptacion/rechazo o cambio de presupuesto.
- `customers`
  - Confirmado en `supabase/migrations/20260424_baseline_schema.sql` y T02.
  - Columnas relevantes: `tenant_id`, `full_name`, `phone`, `email`, `data_consent_status`, `data_consent_date`, `data_consent_version`, `data_consent_scope`.
  - Uso T11: identidad/contacto del aceptante si ya existe cliente.
- `audit_logs`
  - Confirmado en `20260530132000_security_backoffice_tables.sql` y `20260531110000_fix_security_backoffice_schema.sql`.
  - Columnas relevantes: `tenant_id`, `user_id`, `action`, `ip_address`, `user_agent`, `request_id`, `data_before`, `data_after`, `created_at`.
  - Uso T11: auditoria critica de aceptacion/rechazo y snapshot.
- Autorizacion/firma/consentimiento existente
  - `service_order_checklists`: `customer_acceptance_required`, `accepted_at`, `accepted_by_name` en `20260621090000_add_checklist_legal_fields_to_service_order_checklists.sql`.
  - `customers`: consentimiento de datos T02, no presupuesto.
  - No se encontro `service_order_authorizations` fisica.

## 7. Codigo real relacionado
- `apps/api/src/controllers/public.ts`
  - Funciones: `createPublicQuote`, `trackPublicOrder`, `getPublicPortalOrder`, `getPublicOrderPdf`, `createPublicStoreOrder`.
  - Importa porque crea leads en `service_requests`, consulta portal y PDF publicos.
  - Candidato a modificacion para T11 si se agrega autorizacion publica.
- `apps/api/src/routes/public.ts`
  - Rutas: `POST /quotes`, `GET /tenant/:tenantSlug/orders/:folio`, `GET /tenant/:tenantSlug/orders/:folio/pdf`.
  - Importa porque el endpoint T11 publico deberia convivir ahi.
  - Candidato a modificacion.
- `apps/api/src/controllers/orders.ts`
  - Funciones: `updateOrderFinancials`, `getOrderWarrantySummary`, `insertOrderDocument`, `insertOrderEvent`, `updateOrderWarranty`.
  - Importa por costos, documentos/eventos y patrones de tenant.
  - Candidato a referencia/modificacion minima interna.
- `apps/api/src/routes/orders.ts`
  - Rutas internas de orden y garantia.
  - Importa si se agrega consulta interna de autorizaciones.
  - Candidato a modificacion solo si GPT-5.5 autoriza endpoint interno.
- `apps/api/src/services/evidence-adapter.ts`
  - Lee `service_order_events` y `service_order_documents`.
  - Importa como patron normalizado de evidencia.
  - Solo referencia probable.
- `apps/web-clientes/src/app/t/[tenantSlug]/portal/[folio]/page.tsx`
  - Renderiza `PortalView` con `initialFolio`.
  - Importa porque portal por path acepta lo que llama folio.
  - No tocar en packet; candidato futuro para UI T11.
- `apps/web-clientes/src/app/t/[tenantSlug]/portal/page.tsx`
  - Acepta query `folio` o `token`.
  - Importa porque confirma compatibilidad publica por token/folio.
  - Candidato futuro.
- `apps/web-clientes/src/lib/api/orders.ts`
  - `getOrderByFolio` llama `/api/public/tenant/:tenantSlug/orders/:folio`.
  - Importa para contrato publico.
  - Candidato futuro.
- `apps/web-clientes/src/lib/portal/portal-view.tsx`
  - Busca orden, muestra documentos/timeline, genera PDF usando `result.order.folio`.
  - Importa porque hoy no hay UI de aceptar presupuesto.
  - Candidato futuro.
- `apps/web-admin/src/components/solicitudes/quote-modal.tsx`
  - Construye mensaje de cotizacion desde solicitudes.
  - Importa porque hay cotizacion UI pero no autorizacion formal.
  - Solo referencia para T11 salvo decision de admin UI.
- `apps/web-admin/src/components/dashboard/orders/order-detail-drawer.tsx`
  - Muestra checklist, documentos, PDF y URL portal por folio.
  - Importa por riesgo de seguir compartiendo folio plano.
  - Candidato futuro si se expone estado de autorizacion.

## 8. Flujo actual encontrado
- Consulta publica por folio/token: si existe. `getPublicPortalOrder` filtra `tenant_id` y usa `.or(folio.eq,public_token.eq)`.
- Aceptacion de cotizacion: no se encontro endpoint publico de aceptar presupuesto.
- Aprobacion de reparacion: no se encontro endpoint formal de autorizacion online.
- Firma digital: no se encontro tabla/campo formal; solo busquedas de firma en auth/webhooks no aplican.
- Consentimiento cliente: existe T02 en `customers` y T01 en checklist, pero no autoriza presupuesto.
- Documentos visibles al cliente: existe `is_customer_visible=true` y `retention_expires_at`.
- Eventos publicos/privados: portal carga `service_order_events` excluyendo `note`; no hay flag explicito publico/privado en eventos.
- Generacion de PDF/recibo: existe `getPublicOrderPdf`; usa portal por folio/token y documentos visibles.

## 9. Opciones tecnicas para T11
### Opcion A — Campos en `service_orders`
- Ventajas: menor cambio; cerca de `estimated_cost`, `final_cost`, `public_token`; facil de leer en portal.
- Riesgos: limitado para multiples autorizaciones/versiones; dificil congelar snapshots e historial legal.
- Archivos afectados: migracion aditiva sobre `service_orders`, `public.ts`, posiblemente portal cliente.
- Compatibilidad: alta con T00/T09/T10; media con T02/T04 si no hay snapshot/auditoria robusta.

### Opcion B — Tabla nueva `service_order_authorizations`
- Ventajas: autorizacion formal por orden; permite tipo, estado, firma/texto, IP, user-agent, token usado, timestamps, snapshot y auditoria.
- Riesgos: requiere SQL/RLS/RPC/endpoints y contrato idempotente; hay que decidir unicidad y versionado.
- Archivos afectados: migracion nueva, `controllers/public.ts`, `routes/public.ts`, docs/verify, opcional `orders.ts`.
- Compatibilidad: mejor con T00/T02/T04/T09/T10 si referencia `service_orders` y no crea `quotations`.

### Opcion C — Usar documentos/eventos solamente
- Ventajas: minimo cambio; reutiliza `service_order_documents` y `service_order_events`.
- Riesgos: baja estructura legal, dificil idempotencia, dificil validar monto/snapshot y reportar autorizaciones.
- Archivos afectados: `public.ts`, quizas sin SQL salvo eventos/documentos.
- Compatibilidad: parcial; puede servir como evidencia, pero no como autorizacion formal auditable.

## 10. Reglas legales/tecnicas que debe cuidar T11
- Aceptacion explicita con decision `accepted`/`rejected`.
- Fecha/hora inmutable y generada del lado servidor.
- Nombre del aceptante y contacto si existe.
- IP y user-agent si estan disponibles.
- Firma/base64 solo si GPT-5.5 la autoriza; si no, evidencia tecnica fuerte.
- Token publico usado, sin devolverlo en payload publico.
- Snapshot del texto aceptado y version de terminos.
- Costo autorizado y alcance autorizado congelados.
- Validar que el costo enviado coincida con `service_orders.estimated_cost`.
- Privacidad de documentos; solo visibles al cliente cuando corresponda.
- No exponer otro tenant; siempre `(tenant_id, public_token)` para acceso publico sensible.
- No permitir aceptacion vencida, revocada o duplicada sin regla explicita.
- Auditoria critica: si falla auditoria, debe fallar la autorizacion.

## 11. Riesgos reales
- Autorizacion sin orden o sobre orden de otro tenant.
- Aceptacion por token filtrado o por folio enumerado.
- Texto legal mutable despues de aceptado.
- Monto cambiado despues de aceptar sin nueva autorizacion.
- Firma no persistida o persistida como URL publica.
- Exposicion de documentos privados por `public_url`.
- Conflicto con cotizacion porque `quotations` no existe y `service_requests` es lead, no orden autorizable.
- Conflicto con garantia si se confunde autorizacion de presupuesto con `service_order_warranties`.
- Conflicto con finanzas si aceptar presupuesto crea cobros automaticamente.
- Portal publico sin rate limit y hoy con lookup por folio plano.
- Falta de audit log o audit log sin `request_id`.

## 12. Preguntas para GPT-5.5
1. ¿T11 debe usar Opcion B (`service_order_authorizations`) como tabla nueva aditiva?
2. ¿El endpoint publico debe aceptar exclusivamente `public_token` y dejar de aceptar folio para autorizacion?
3. ¿Se requiere firma dibujada/base64 o basta evidencia tecnica: timestamp, IP, user-agent, terminos y snapshot?
4. ¿Debe permitirse una sola autorizacion por orden o versionado cuando cambie `estimated_cost`?
5. ¿T11 debe incluir UI del portal ahora o solo backend/migracion con contrato listo para T12?

## 13. Lo que GPT-5.5 debe devolver
- T11 WORKPACK cerrado.
- Decision entre Opcion A/B/C.
- Archivos autorizados.
- SQL exacto si hay migracion.
- Endpoints internos.
- Endpoints publicos si aplica.
- Contrato request/response.
- Reglas de autorizacion.
- Reglas de privacidad.
- Reglas de aceptacion/firma.
- Pasos para Codex Mini.
- Comandos de validacion.
- Rollback.
- Criterios de aceptacion.
