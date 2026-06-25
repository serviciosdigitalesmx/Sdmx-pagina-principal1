# T12 PACKET PARA GPT-5.5

## 1. Objetivo
T12 debe completar el portal cliente con documentos, timeline, PDF, autorizaciones y garantías.
Debe ser read-only/sanitizado para el cliente salvo acciones explícitas ya existentes en T11.
Debe respetar T02: evidencia privada nunca aparece en portal cliente.
Debe coexistir con T09/T10/T11 sin crear `devices` ni `quotations`.
Debe cerrar la estrategia de acceso público: folio, token, o validación adicional.

## 2. Estado Git
- Rama actual: `main`, estado inicial limpio: `## main...origin/main`.
- Últimos 14 commits:
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
- Cambios locales antes del packet: ninguno.
- Archivos creados por esta tarea: `docs/ai-packets/T12-packet.md`.

## 3. Dependencias previas
- T00: mapeo canónico oficial; no renombrar tablas ni crear entidades físicas fuera de ticket.
- T02: agrega consentimiento y visibilidad/retención de documentos para cliente.
- T09: historial por dispositivo es interno; no debe exponerse completo en portal público.
- T10: garantías viven en `service_order_warranties`; frontend aún no las consume.
- T11: autorización pública ya existe por `public_token`; frontend aún no la consume.
- Portal existente: backend público en `apps/api/src/controllers/public.ts`; frontend en `apps/web-clientes`.
- T04/auditoría: acciones críticas usan `audit_logs`; T12 es principalmente lectura, salvo si integra acciones T11 ya auditadas.

## 4. Decisiones heredadas
- No crear `devices`: T00/T09 mantienen dispositivo inline en `service_orders.serial_number`.
- No exponer T09 completo: `docs/implementation-results/T09-result.md` dice que el endpoint es interno y no debe exponerse en portal público.
- Usar `service_orders.public_token` para acciones sensibles; T11 autorizaciones no aceptan folio plano.
- Reusar `service_order_documents` para documentos/evidencias visibles.
- Reusar `service_order_events` para timeline, pero requiere sanitización porque no tiene flag público/privado.
- Respetar `is_customer_visible=true` y `retention_expires_at` en documentos.
- T10/T11 deben coexistir: garantías y autorizaciones se leen/representan sin modificar inventario ni finanzas.

## 5. Documentación revisada
- `AGENTS.md`
  - Regla: mapeo `repair_orders` -> `service_orders`, documentos -> `service_order_documents`, eventos -> `service_order_events`.
  - Impacto: T12 debe usar físico vivo y no inventar tablas/rutas.
- `docs/specs/decisions_t00_fundaciones_canonicas.md`
  - Decisión: compatibilidad progresiva, no destructiva; se permite migración aditiva solo con workpack.
  - Impacto: portal debe adaptarse al modelo actual.
- `docs/specs/spec_01_fundaciones.md`
  - Decisión: cliente pertenece a tenant; dispositivo vive en la orden; `devices` separado es cambio futuro.
  - Impacto: portal debe aislar tenant y no crear entidad dispositivo.
- `docs/specs/spec_02_recepcion_finanzas.md`
  - Decisión: evidencia nueva vive en `service_order_documents`; timeline en `service_order_events`; evidencia interna nunca aparece en portal cliente.
  - Impacto: filtro de privacidad es requisito central de T12.
- `docs/specs/spec_03_inventario_cliente.md`
  - Decisión: T12 es portal cliente completo con documentos; vista read-only sanitizada de orden con validación pública.
  - Impacto: hay que cerrar validación pública, documentos y visibilidad.
- `docs/specs/spec_04_plataforma.md`
  - Decisión: T16 debe probar flujos recepción/caja/portal sin regresiones.
  - Impacto: T12 debe dejar comandos/criterios de validación del portal.
- `docs/specs/implementation_order.md`
  - Decisión: T12 está en el bloque cliente y retención después de T09/T10/T11.
  - Impacto: no avanzar T13 sin portal estable.
- `docs/specs/dependencies.md`
  - Decisión: T12 depende de T02, T10 y T11; desbloquea autoservicio cliente.
  - Impacto: debe incorporar documentos, garantía y autorización.
- `docs/ai-packets/T09-packet.md`
  - Decisión: no crear `devices`; historial usa `service_orders.serial_number`.
  - Impacto: portal solo debe mostrar resumen seguro del equipo/orden.
- `docs/implementation-results/T09-result.md`
  - Decisión: historial interno agrega documentos como metadata segura y no genera signed URLs.
  - Impacto: no llevar endpoint interno directo al portal público.
- `docs/ai-packets/T10-packet.md`
  - Decisión: garantías deben preservar documentos/eventos; no signed URLs salvo workpack explícito.
  - Impacto: T12 puede mostrar garantía, no reclamo interno completo.
- `docs/implementation-results/T10-result.md`
  - Decisión: frontend aún no consume endpoints T10; resumen devuelve metadata segura; no signed URLs.
  - Impacto: T12 debe decidir UI/endpoint público de garantía.
- `docs/ai-packets/T11-packet.md`
  - Decisión: portal histórico acepta folio/token; acciones sensibles deben usar `(tenant_id, public_token)`.
  - Impacto: T12 debe corregir o documentar riesgo de folio.
- `docs/implementation-results/T11-result.md`
  - Decisión: autorización pública usa exclusivamente `public_token`, no devuelve token completo y no cambia endpoint histórico del portal.
  - Impacto: T12 debe integrar UI/lectura de autorización sin relajar seguridad.

## 6. Modelo físico real encontrado
- `service_orders`
  - Confirmado en `supabase/migrations/20260424_baseline_schema.sql`, `20260530143000_add_public_token_to_service_orders.sql`.
  - Columnas: `id`, `tenant_id`, `customer_id`, `service_request_id`, `folio`, `status`, `device_type`, `device_brand`, `device_model`, `serial_number`, `reported_issue`, `internal_diagnosis`, `estimated_cost`, `final_cost`, `promised_date`, `received_at`, `completed_at`, `delivered_at`, `created_at`, `updated_at`, `public_token`.
  - Uso T12: expediente público sanitizado; `public_token` acceso sensible; `folio` riesgo de enumeración.
- `service_requests`
  - Confirmado en `supabase/migrations/20260424_baseline_schema.sql`.
  - Columnas: `tenant_id`, `branch_id`, `folio`, `customer_name`, `customer_phone`, `customer_email`, `device_type`, `device_model`, `issue_description`, `quoted_total`, `deposit_amount`, `balance_amount`, `solicitud_origen_ip`.
  - Uso T12: origen de solicitudes públicas; no es orden final para portal completo.
- `service_order_documents`
  - Confirmado en `supabase/migrations/20260523190000_order_documents_events.sql` y T02.
  - Columnas: `tenant_id`, `service_order_id`, `bucket_name`, `storage_path`, `public_url`, `file_name`, `file_type`, `mime_type`, `file_size`, `source`, `created_by`, `created_at`, `is_customer_visible`, `retention_policy_version`, `retention_expires_at`.
  - Uso T12: documentos/galería visibles solo si `is_customer_visible=true` y no expirados.
- `service_order_events`
  - Confirmado en `supabase/migrations/20260523190000_order_documents_events.sql`.
  - Columnas: `tenant_id`, `service_order_id`, `event_type`, `previous_status`, `new_status`, `note`, `actor_name`, `created_by`, `created_at`.
  - Uso T12: timeline público sanitizado; no existe columna visible/público.
- `service_order_authorizations`
  - Confirmado en `supabase/migrations/20260624173310_t11_service_order_authorizations.sql`.
  - Columnas: `tenant_id`, `service_order_id`, `authorization_type`, `status`, `authorized_amount`, `estimated_cost_snapshot`, `final_cost_snapshot`, `scope_snapshot`, `terms_version`, `terms_snapshot`, `accepted_by_name`, `signature_method`, `public_token_last4`, `ip_address`, `user_agent`, `idempotency_key`, `decided_at`.
  - Uso T12: mostrar estado de autorización y enlazar flujo público T11 sin exponer IP/user-agent ni token.
- `service_order_warranties`
  - Confirmado en `supabase/migrations/20260624170000_t10_service_order_warranties.sql`.
  - Columnas: `tenant_id`, `original_order_id`, `claim_order_id`, `warranty_until`, `eligibility_status`, `status`, `coverage_scope`, `claim_reason`, `reported_issue`, `requested_resolution`, `resolution_notes`, `created_at`, `updated_at`.
  - Uso T12: mostrar garantía vigente/resumen; cuidar no exponer flujo interno de reclamos.
- `customers`
  - Confirmado en `supabase/migrations/20260424_baseline_schema.sql` y T02.
  - Columnas: `tenant_id`, `full_name`, `phone`, `email`, `tag`, `notes`, `is_active`, `data_consent_status`, `data_consent_date`, `data_consent_scope`, `data_consent_updated_at`.
  - Uso T12: validación pública posible por email/teléfono y contexto del cliente.
- `audit_logs`
  - Confirmado en migraciones de seguridad/T04 y usado por T10/T11.
  - Columnas relevantes observadas en tickets previos: `tenant_id`, `user_id`, `action`, `ip_address`, `user_agent`, `request_id`, `data_before`, `data_after`, `created_at`.
  - Uso T12: no exponer al cliente; solo auditar si se agregan acciones públicas nuevas.
- Storage/bucket
  - Confirmado en `apps/api/src/controllers/orders.ts`: `supabaseAdmin.storage.getBucket/createBucket/upload/getPublicUrl`.
  - Campos persistidos: `bucket_name`, `storage_path`, `public_url`.
  - Uso T12: riesgo de URLs públicas persistentes; decidir si T12 cambia contrato o solo filtra metadata.

## 7. Código backend real relacionado
- `apps/api/src/routes/public.ts`
  - Rutas actuales: `GET /tenant/:tenantSlug/orders/:publicToken/authorization`, `POST /tenant/:tenantSlug/orders/:publicToken/authorization`, `GET /tenant/:tenantSlug/orders/:folio`, `GET /tenant/:tenantSlug/orders/:folio/pdf`.
  - Expone hoy: portal por folio/token, PDF, autorización T11.
  - Riesgo: rutas de portal nombran `:folio` aunque aceptan `public_token`.
  - Candidato: modificación T12 si se agrega endpoint por token o resumen completo.
- `apps/api/src/controllers/public.ts`
  - `getPublicPortalOrder`: filtra tenant y busca `.or(folio.eq,public_token.eq)`.
  - Expone documentos con `is_customer_visible=true` y retención vigente.
  - Expone eventos con `event_type != note`, sin flag público/privado.
  - Candidato: modificación principal para contrato T12.
- `apps/api/src/controllers/public.ts`
  - `getPublicOrderPdf`: busca por folio/token, filtra documentos visibles y genera PDF con `Cache-Control: no-store`.
  - Riesgo: PDF por folio puede ser enumerado; contenido debe seguir sanitizado.
  - Candidato: ajustar acceso/contrato si GPT-5.5 lo autoriza.
- `apps/api/src/controllers/public.ts`
  - `getPublicOrderAuthorization` / `submitPublicOrderAuthorization`: usan `public_token`, no folio.
  - Importa: patrón seguro para T12.
  - Candidato: referencia o integración visual desde frontend.
- `apps/api/src/controllers/orders.ts`
  - Maneja carga de documentos, generación de recibo, `is_customer_visible`, retención, `public_url`.
  - Importa: define origen real de documentos del portal.
  - Candidato: solo referencia salvo que T12 requiera campos nuevos.
- `apps/api/src/services/evidence-adapter.ts`
  - Lee `service_order_events` y `service_order_documents`.
  - Importa: confirma normalización de evidencia/eventos.
  - Candidato: referencia para no duplicar criterio.
- `apps/api/src/services/tenant-capabilities.ts`
  - Planes incluyen `public_portal: true` y `storage_mb`.
  - Importa: portal puede estar sujeto a capacidad/plan.
  - Candidato: referencia si T12 valida capacidades.
- RPCs existentes
  - `submit_service_order_authorization` en T11, `create_service_order_warranty_claim` y `update_service_order_warranty_claim_status` en T10.
  - Importa: T12 puede leer resultados, pero no debe crear acciones nuevas sin workpack.

## 8. Código frontend real relacionado
- `apps/web-clientes/src/app/t/[tenantSlug]/portal/page.tsx`
  - Acepta query `folio` o `token` y pasa `initialFolio`.
  - Falta: decisión de UX/acceso seguro.
  - Candidato: modificación T12.
- `apps/web-clientes/src/app/t/[tenantSlug]/portal/[folio]/page.tsx`
  - Ruta dinámica pasa `folio` a `PortalView`.
  - Falta: naming token/folio y posible ruta por token.
  - Candidato: modificación T12 si se redefine acceso.
- `apps/web-clientes/src/lib/api/orders.ts`
  - `getOrderByFolio` llama `/api/public/tenant/:tenantSlug/orders/:folio`.
  - Falta: cliente API para autorización/garantía pública.
  - Candidato: modificación T12.
- `apps/web-clientes/src/lib/portal/portal-view.tsx`
  - Busca folio/token, muestra resumen, timeline, evidencia, documentos y PDF.
  - Usa PDF por `result.order.folio`, no por token.
  - Falta: UI de autorización T11, garantía T10, errores/retención más claros.
  - Candidato: modificación principal.
- `apps/web-clientes/src/components/portal/document-list.tsx`
  - Renderiza documentos como links directos `href={doc.url}`.
  - Falta: manejo de URL vacía/expirada y privacidad.
  - Candidato: modificación T12.
- `apps/web-clientes/src/components/portal/evidence-gallery.tsx`
  - Renderiza imágenes/video por URL directa.
  - Falta: manejo de documentos sin URL o evidencia expirada.
  - Candidato: modificación T12.
- `apps/web-clientes/src/components/portal/order-timeline.tsx`
  - Renderiza timeline normalizado.
  - Falta: diferenciar timeline calculado vs eventos reales seguros.
  - Candidato: modificación T12.
- `apps/web-clientes/src/lib/utils/normalizers.ts`
  - Normaliza `timeline`, `documents`, `events`, `messages`.
  - Falta: tipos/normalización para garantías y autorizaciones.
  - Candidato: modificación T12.
- `apps/web-clientes/src/lib/types.ts`
  - `BackendOrderResponse` no incluye warranty ni authorization en el portal.
  - Candidato: modificación T12.
- `apps/web-admin/src/components/dashboard/orders/order-detail-drawer.tsx`
  - Construye tracking URL por folio y lista documentos con `public_url`.
  - Riesgo: admin sigue compartiendo folio plano.
  - Candidato: modificación si T12 decide cambiar link público.
- `apps/web-admin/src/components/dashboard/orders/order-intake-modal.tsx`, `apps/web-admin/src/app/dashboard/operativo/page.tsx`, `apps/web-admin/src/components/operativo/success.tsx`
  - Generan tracking URL con `folio`.
  - Riesgo: incompatibilidad si portal cambia a token obligatorio.
  - Candidatos: potenciales si se cambia contrato público.

## 9. Flujo actual encontrado
- Public folio lookup: sí, `getPublicPortalOrder` acepta `folio`.
- Public token lookup: sí, el mismo endpoint acepta `public_token`.
- Visible docs: sí, filtra `is_customer_visible=true` y `retention_expires_at`.
- Public timeline: parcialmente, mezcla timeline calculado y eventos sin flag público; excluye solo `event_type = note`.
- Public PDF: sí, `GET /public/tenant/:tenantSlug/orders/:folio/pdf`.
- Doc downloads: sí, links directos a `public_url`.
- T11 auth visible: backend sí, frontend portal no.
- T10 warranty visible: backend interno sí, portal público no.
- Errores: portal muestra mensajes genéricos; no distingue token/folio/expirado.
- Expiry/retention: documentos expirados se filtran; no hay aviso de expiración visible.
- Private doc blocking: backend filtra documentos, pero si `public_url` ya se compartió fuera del portal no hay control adicional observado.

## 10. Opciones técnicas para T12
### A. Portal completo sobre endpoints existentes
- Ventajas: menos backend; usa `GET /orders/:folio`, PDF actual y T11 auth.
- Riesgos: conserva folio enumerado, no resuelve contrato de garantía pública, timeline sigue sin flag visible.
- Archivos afectados: `apps/web-clientes`, posiblemente `apps/web-admin` enlaces.
- Compatibilidad T02/T09/T10/T11: media; requiere disciplina de frontend.

### B. Nuevo endpoint público por `public_token`
- Ventajas: alinea portal sensible con T11; permite payload sanitizado único con documentos, authorization summary y warranty summary.
- Riesgos: requiere backend, contrato nuevo y migración solo si faltan flags; debe mantener compatibilidad temporal con folio.
- Archivos afectados: `controllers/public.ts`, `routes/public.ts`, `apps/web-clientes`, quizá `apps/web-admin` para compartir token.
- Compatibilidad T02/T09/T10/T11: alta si no expone T09 completo y solo lee T10/T11.

### C. Solo frontend sobre API actual
- Ventajas: cero SQL/backend; rápido para producción temprana.
- Riesgos: no puede arreglar privacidad de timeline ni folio enumeration; garantía T10 no tiene endpoint público.
- Archivos afectados: `apps/web-clientes` y tipos.
- Compatibilidad T02/T09/T10/T11: baja-media; útil solo como mejora visual.

## 11. Reglas de seguridad/privacidad que debe cuidar T12
- No exponer documentos privados ni internos.
- No generar signed URLs para documentos privados.
- Mostrar solo `service_order_documents.is_customer_visible=true`.
- Respetar `retention_expires_at`; documentos expirados no aparecen.
- No exponer `internal_diagnosis` salvo decisión explícita y sanitizada.
- No exponer `audit_logs`.
- No devolver `public_token` completo.
- Evitar cruce de tenant en toda consulta pública.
- Preferir `public_token` para acciones y contenido sensible.
- Mitigar enumeración por folio o exigir validación adicional Folio + Pin/Email.
- Rate limit: no se encontró dependencia/patrón de rate limit; si T12 mantiene folio público, debe decidirlo.
- No exponer historial T09 completo al cliente.

## 12. Riesgos reales
- Enumeración de folios si el portal sigue aceptando folio plano.
- Fuga de documentos privados si se omite `is_customer_visible`.
- Documentos expirados visibles si se omite `retention_expires_at`.
- PDF con datos privados si se agrega `internal_diagnosis` o notas sin sanitizar.
- Eventos internos visibles porque `service_order_events` no tiene flag público.
- T11 no visible en UI o demasiado visible si expone snapshots legales completos.
- Confusión T10: garantía vigente vs reclamos internos.
- Fuga de token si se devuelve o se loggea completo.
- URLs públicas persistentes fuera de portal.
- Inconsistencia web-client/API si se cambia `folio` por token sin actualizar admin links.
- Regresión del portal si se cambia shape de `BackendOrderResponse`.

## 13. Preguntas para GPT-5.5
1. ¿T12 debe elegir opción B y crear un endpoint público canónico por `public_token`?
2. ¿Se mantiene compatibilidad por folio o se exige Folio + Email/PIN para consulta pública?
3. ¿Qué eventos de `service_order_events` son seguros para cliente si no existe flag público?
4. ¿Qué resumen público exacto de T10/T11 debe mostrarse en portal?
5. ¿T12 autoriza cambios en `apps/web-admin` para compartir links por token en vez de folio?

## 14. Lo que GPT-5.5 debe devolver
- T12 WORKPACK cerrado.
- Decisión A/B/C.
- Archivos autorizados.
- SQL exacto si requiere migración.
- Endpoints públicos exactos.
- Contratos request/response.
- Cambios frontend permitidos.
- Reglas de privacidad para documentos, timeline, autorización y garantía.
- Reglas de acceso por folio/token/email/PIN.
- Pasos cerrados para Codex Mini.
- Comandos de validación.
- Rollback.
- Criterios de aceptación.
