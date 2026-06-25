# T14 PACKET PARA GPT-5.5

## 1. Objetivo

T14 parece ser `Tiempos, productividad y comisiones`, no proveedor real de WhatsApp.
Debe medir trabajo tecnico por orden, pausas, responsable y posible comision.
El repo real aun no tiene `work_logs`, `timesheets` ni reglas de comision tecnica.
T13 dejo pendiente proveedor/dispatcher WhatsApp, pero ese pendiente no redefine T14.

## 2. Estado Git

- Rama actual antes de crear packet: `## main...origin/main`.
- Cambios locales antes del packet: ninguno.
- Archivo creado por esta tarea: `docs/ai-packets/T14-packet.md`.
- Ultimos 18 commits:
  - `6e5b565 feat(t13): add whatsapp message queue drafts`
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
  - `7c71294 chore(docs): finalize T11 T12 technical decisions`

## 3. Que dice la documentacion sobre T14

- `AGENTS.md`: manda seguir `docs/canonical/` y `docs/specs/`, no renombrar tablas sin workpack, no inventar rutas/tablas/columnas, y usar el mapeo canonico: `repair_orders/orders` -> `service_orders`, timeline -> `service_order_events`, auditoria -> `audit_logs`.
- `docs/specs/implementation_order.md`: coloca T13 como WhatsApp y T14 como `Tiempos, productividad y comisiones`; T14 esta en el quinto bloque `Operacion y Calidad`.
- `docs/specs/dependencies.md`: T14 depende de `Fundaciones, T09, T10` y desbloquea `T15 (Productividad)`.
- `docs/canonical/especificacion_aprobada.md`: T14 debe medir productividad tecnica, inicio/pausa/fin, responsable, resultado y posible comision; no debe comisionar sin regla.
- `docs/specs/decisions_t13_t14_t15.md`: decision oficial dice que `tasks` y `task_history` no son timesheet; propone `work_logs` como fuente fisica de tiempos y `technician_commission_rules` para reglas.
- `docs/implementation-results/T13-result.md`: T13 quedo como `message_queue` + `manual_wa_me`, sin proveedor real, sin credenciales y sin dispatcher/worker; recomienda decidir proveedor/automatizacion en T14 o ticket dedicado, pero la canonica T14 sigue siendo productividad/comisiones.

## 4. Dependencias previas

- T00: impone mapeo fisico actual; T14 debe usar `service_orders`, `users`, `sucursales`, `audit_logs`, no tablas canonicas inexistentes.
- T02: consentimiento aplica si T14 dispara comunicaciones, pero la medicion de tiempos no debe exponer datos privados.
- T04: cambios de tiempos, reglas y comisiones afectan productividad/dinero; deben auditarse, idealmente fail-closed para reglas/aprobaciones.
- T11: autorizaciones online pueden condicionar trabajos; T14 no debe alterar aceptaciones ni firmas.
- T12: portal por token existe para cliente; T14 no debe reintroducir folio como credencial ni exponer datos internos.
- T13: `message_queue` existe para borradores WhatsApp; T14 no debe mezclar PWA/WhatsApp con timesheets salvo decision explicita.

## 5. Estado real despues de T13

- `message_queue`: existe por `supabase/migrations/20260625070326_t13_message_queue.sql`.
- Endpoints T13: `POST /orders/:id/whatsapp/draft` y `GET /orders/:id/whatsapp/messages`.
- `manual_wa_me`: provider por default y unico flujo real implementado.
- Proveedor real: ausente; no hay Cloud API, credenciales, `provider_message_id` ni webhook WhatsApp.
- Dispatcher/worker: ausente; no hay worker/cron que drene cola.
- `pwa-push.ts`: sigue siendo push interno y escribe `notification_events`.
- Riesgo pendiente: `message_body` y `wa_me_url` contienen link sensible; `message_queue` esta restringida a `service_role`.
- Para T14: no hay `work_logs`, `timesheets`, `technician_commission_rules` ni cronometro tecnico.

## 6. Modelo fisico real encontrado

- `message_queue`
  - Ruta: `supabase/migrations/20260625070326_t13_message_queue.sql`.
  - Columnas: `tenant_id`, `service_order_id`, `customer_id`, `channel`, `provider`, `status`, `template_key`, `recipient_phone`, `message_body`, `wa_me_url`, `public_token_last4`, `portal_url_hash`, `consent_status_snapshot`, `idempotency_key`, timestamps.
  - Uso T14: solo referencia si GPT-5.5 decide separar pendiente WhatsApp; no es timesheet.
  - Riesgo: link sensible dentro de body/url.
- `service_order_events`
  - Ruta: `supabase/migrations/20260523190000_order_documents_events.sql`.
  - Columnas: `tenant_id`, `service_order_id`, `event_type`, `previous_status`, `new_status`, `note`, `actor_name`, `created_by`, `created_at`.
  - Uso T14: timeline de cambios o eventos de start/stop si se decide duplicar eventos visibles.
  - Riesgo: no sirve como fuente unica de duracion/comision.
- `audit_logs`
  - Rutas: `20260530132000_security_backoffice_tables.sql`, `20260531110000_fix_security_backoffice_schema.sql`.
  - Columnas: `tenant_id`, `user_id`, `action`, `ip_address`, `user_agent`, `data_before`, `data_after`, `created_at`.
  - Uso T14: auditoria de reglas, correcciones y aprobaciones.
  - Riesgo: acciones financieras/productividad deben fallar cerrado si auditoria falla.
- `customers`
  - Rutas: `20260424_baseline_schema.sql`, `20260514133525_remote_schema.sql`, `20260622001000_t02_consent_evidence_visibility.sql`.
  - Columnas reales relevantes: `tenant_id`, `name`, `phone`, `email`, `data_consent_status`, `data_consent_scope`.
  - Uso T14: casi nulo salvo comunicaciones/cliente; no base de tiempos.
  - Riesgo: `full_name` legacy no esta garantizado.
- `tenants`
  - Ruta: `20260424_baseline_schema.sql`.
  - Columnas: `id`, `name`, `slug`, `status`, `plan`, contactos, timestamps.
  - Uso T14: tenant isolation y plan/modulos.
  - Riesgo: no saltar aislamiento.
- `tenant_capabilities` o equivalente
  - Tabla fisica: no encontrada.
  - Equivalente codigo: `apps/api/src/services/tenant-capabilities.ts`.
  - Uso T14: podria requerir modulo futuro `productivity` o usar `reports/tasks`.
  - Riesgo: agregar modulo sin decision puede bloquear UI.
- `notification_events`
  - Ruta baseline: `20260424_baseline_schema.sql`; remote schema la elimina en `20260514133525_remote_schema.sql`; codigo PWA aun escribe en ella.
  - Columnas baseline: `tenant_id`, `channel`, `event_type`, `recipient`, `payload_json`, `status`, `sent_at`, `created_at`.
  - Uso T14: no recomendado; es push interno/desalineado.
  - Riesgo: mezclar WhatsApp/PWA/productividad.
- `pwa_push_subscriptions`
  - Ruta: `20260530150000_add_pwa_push_subscriptions.sql`.
  - Columnas: `tenant_id`, `user_id`, `endpoint`, `p256dh`, `auth`, `active`, timestamps.
  - Uso T14: notificaciones internas separadas, no comisiones.
  - Riesgo: credenciales push y consentimiento interno.
- `tasks` / `task_history`
  - Rutas: `20260609100001_create_tasks_table.sql`, `20260530193000_audit_hardening_multitenant.sql`.
  - Columnas tasks: `tenant_id`, `sucursal_id`, `service_order_id`, `title`, `status`, `priority`, `assigned_user_id`, `due_date`.
  - Columnas history: `tenant_id`, `task_id`, `event_type`, `comment`, `changed_by`, `created_at`.
  - Uso T14: relacion operativa opcional; no fuente de horas.
  - Riesgo: `task_history` mide cambios, no intervalos.
- Templates/proveedor
  - Tabla fisica: no encontrada.
  - Equivalente: `tenant-config.ts` y `tenant-capabilities.ts`.
  - Uso T14: solo si se decide pendiente proveedor, no productividad.

## 7. Codigo real relacionado

- `apps/api/src/services/whatsapp-messages.ts`: crea/lista borradores T13 en `message_queue`; usa `wa.me`, `public_token`, consentimiento, idempotencia.
- `apps/api/src/controllers/orders.ts`: expone handlers de ordenes; T13 agrego WhatsApp; ya escribe eventos y push en otros flujos.
- `apps/api/src/routes/orders.ts`: rutas T13 antes de `GET /:id`; candidato natural para `/:id/work-logs`.
- `apps/api/src/services/pwa-push.ts`: envia PWA push y escribe `notification_events`; no WhatsApp.
- `apps/api/src/services/tenant-config.ts`: contiene plantillas/config runtime por tenant; puede servir para reglas si GPT-5.5 lo autoriza.
- `apps/api/src/services/tenant-capabilities.ts`: registra modulos, incluido `whatsapp`, `tasks`, `reports`; no hay modulo T14 especifico.
- Workers/cron: no se encontro worker/dispatcher real para `message_queue` ni timesheets.
- `apps/api/src/controllers/tasks.ts` / `routes/tasks.ts`: CRUD de tareas e historial; no cronometro ni comision.
- `apps/api/src/controllers/reports.ts`: reportes actuales agregan en memoria; cuentan ordenes por `assigned_user_id`, no por tiempo real.
- `apps/web-admin/src/app/dashboard/tareas/page.tsx`: UI de tareas, sin cronometro/comisiones.
- `apps/web-admin/src/app/dashboard/reportes/page.tsx`: muestra reportes actuales; T15 deberia consumir productividad T14.
- `apps/web-admin/src/components/dashboard/orders/order-detail-drawer.tsx`: punto posible para iniciar/terminar trabajo, pero no implementado.

## 8. Opciones tecnicas para T14

### Opcion A - Solo UI/gestion de outbox
- Ventajas: bajo riesgo, aprovecha T13.
- Riesgos: no cumple T14 canonico; confunde WhatsApp con productividad.
- SQL: no.
- Credenciales: no.
- Archivos: web-admin/order drawer, API list/update `message_queue`.
- Compatibilidad T13: alta, pero deberia ser hotfix/T13.5, no T14.

### Opcion B - Dispatcher interno sin proveedor real
- Ventajas: ordena estados de cola.
- Riesgos: simular envio puede mentir; no cumple tiempos/comisiones.
- SQL: probablemente si se agregan estados/intentos.
- Credenciales: no.
- Archivos: servicios notifications/worker/rutas.
- Compatibilidad T13: media; requiere aclarar promesa de envio.

### Opcion C - Proveedor real WhatsApp
- Ventajas: envio real, delivery status, webhooks.
- Riesgos: credenciales, plantillas aprobadas, costos, rate limits, privacidad, webhook falso.
- SQL: si, para provider ids/intentos/webhook logs.
- Credenciales: si.
- Archivos: provider adapter, env, webhooks, dispatcher, admin config.
- Compatibilidad T13: T13 soporta base, pero T14 canonico no es esto.

### Opcion D - Notificaciones PWA separadas
- Ventajas: resuelve push interno sin mezclar WhatsApp.
- Riesgos: `notification_events` esta desalineada; no cumple productividad.
- SQL: quiza para reparar `notification_events`.
- Credenciales: VAPID ya existe via env.
- Archivos: `pwa-push.ts`, rutas PWA, migraciones.
- Compatibilidad T13: separada; no deberia mezclarse.

### Opcion E - Configuracion de templates/consentimiento
- Ventajas: prepara envio real responsable.
- Riesgos: sigue sin medir tiempos; puede abrir superficie de datos.
- SQL: posible tabla templates.
- Credenciales: no necesariamente.
- Archivos: tenant config/capabilities/admin settings.
- Compatibilidad T13: buena, pero no cierra T14 canonico.

### Opcion F - T14 canonico: `work_logs` + reglas de comision
- Ventajas: cumple docs; desbloquea T15 productividad.
- Riesgos: calculos laborales/comision, auditoria, correcciones y scope.
- SQL: si, `work_logs` y `technician_commission_rules`.
- Credenciales: no.
- Archivos: migracion, orders/tasks/reports API, web-admin tecnico/reportes, types.
- Compatibilidad T13: independiente; no toca proveedor real.

## 9. Reglas de seguridad para T14

- No enviar mensajes reales sin proveedor aprobado.
- No guardar credenciales en codigo.
- No exponer `message_body`/`wa_me_url` a roles no autorizados.
- No exponer `public_token`.
- Respetar consentimiento si T14 dispara comunicaciones.
- Idempotencia para start/stop y para cualquier enqueue.
- Auditar cambios de reglas, correcciones, aprobaciones y cierres.
- Diferenciar estados de mensajes (`generated`, `opened_manual`, `sent`, `delivered`, `failed`) solo si T14 toca mensajeria.
- No mezclar PWA con WhatsApp sin decision explicita.
- Para productividad: no usar `task_history` como fuente de horas; usar intervalos cerrados.
- No comisionar sin regla activa y snapshot de regla.
- Respetar `tenant_id`, sucursal y permisos de tecnico/manager/owner.

## 10. Riesgos reales

- Entregar a numero equivocado si se retoma WhatsApp.
- Token filtrado por `wa_me_url` o `message_body`.
- Webhook falso/no verificado si se implementa proveedor.
- Estados de entrega incorrectos si no hay proveedor real.
- Proveedor sin plantillas aprobadas.
- Costos/rate limits de WhatsApp.
- Credenciales expuestas.
- Duplicados por falta de idempotencia.
- Mezclar push interno con WhatsApp.
- Medir productividad con `task_history` y producir horas falsas.
- Comisiones injustas por reglas cambiantes sin snapshot.
- Tecnico con dos trabajos activos duplicados.
- Pausas multiples no modeladas si se venden como completas.

## 11. Preguntas para GPT-5.5

1. ¿T14 debe seguir estrictamente como `work_logs` + comisiones, dejando proveedor WhatsApp para otro ticket?
2. ¿El MVP de T14 requiere pausas multiples auditables (`work_log_segments`) o basta `paused_minutes` en `work_logs`?
3. ¿Las reglas de comision se implementan en T14 o solo se captura tiempo y se prepara T15?
4. ¿Que roles exactos pueden corregir/cerrar logs olvidados y aprobar/anular comisiones?
5. ¿Debe agregarse un modulo/capability nuevo (`productivity`/`commissions`) o usar `tasks`/`reports` existentes?

## 12. Lo que GPT-5.5 debe devolver

- T14 WORKPACK cerrado.
- Decision de alcance: productividad/comisiones vs pendiente WhatsApp.
- Archivos autorizados.
- SQL exacto si aplica.
- Endpoints y rutas exactas.
- Contratos request/response.
- Reglas de permisos por rol/scope.
- Reglas de auditoria y fail-closed.
- Reglas de proveedor/webhook solo si decide tocar mensajeria.
- Validaciones y comandos.
- Rollback.
- Criterios de aceptacion.

## 13. Recomendacion del recolector

Recomendacion conservadora: implementar T14 canonico como `work_logs` y, si se autoriza, `technician_commission_rules`.
No implementar proveedor real WhatsApp en T14; moverlo a ticket dedicado T13.5/T14-WhatsApp-provider.
No mezclar PWA/`notification_events` con productividad.
Mantener T13 como outbox manual seguro hasta tener credenciales, proveedor, webhooks y politica aprobada.
