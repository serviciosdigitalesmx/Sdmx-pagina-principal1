# T15 PACKET PARA GPT-5.5

## 1. Objetivo
T15 debe convertir la evidencia de T14 (`work_logs`, `work_log_events`, `technician_commission_rules`) en reportes operativos confiables.
La documentación canónica pide métricas consistentes por periodo, sucursal, estado, técnico, finanzas e inventario.
Este packet limita el análisis a productividad/reportes sobre `work_logs` y reportes existentes, sin implementar UI ni SQL todavía.
No debe crear pagos, tocar caja, modificar inventario ni reabrir T14.

## 2. Estado Git
- Rama actual: `## main...origin/main`.
- Últimos 20 commits:
  - `cfdfe8c feat(t14): add work logs and commission rules`
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
  - `db6a248 docs: add technical design and repo reality for T11 and T12`
- Cambios locales antes de crear packet: ninguno; repo estaba limpio.
- Archivo creado por esta tarea: `docs/ai-packets/T15-packet.md`.

## 3. Qué dice la documentación sobre T15
- `AGENTS.md`: exige seguir `docs/canonical/` y `docs/specs/`, no renombrar tablas físicas, no inventar helpers/rutas/tablas/columnas y usar el mapeo `repair_orders/orders -> service_orders`, sucursal `sucursales/branches`, auditoría `audit_logs`.
- `docs/specs/implementation_order.md`: coloca T15 como punto 15, `Reportes operativos confiables`, después de T14 y antes de T18/T16.
- `docs/specs/dependencies.md`: T15 depende de `T05, T06, T07, T08, T14` y desbloquea reportes ejecutivos.
- `docs/specs/decisions_t13_t14_t15.md`: T15 debe mostrar datos consistentes por periodo, sucursal, estado, técnico, finanzas e inventario; advierte que reportes actuales agregan en memoria y limitan filas.
- `docs/canonical/especificacion_aprobada.md`: T15 busca evitar reportes lentos/inconsistentes; owner revisa ventas, caja, inventario y productividad; métricas deben ser consistentes por periodo, sucursal, estado, técnico y finanzas.
- `docs/specs/spec_04_plataforma.md`: T14 cubre tiempos/comisiones; T15 es reportes operativos confiables.
- `docs/implementation-results/T14-result.md`: T14 creó `work_logs`, `work_log_events`, `technician_commission_rules`, dejó fuera UI pesada y reportes T15 basados en `work_logs`.

## 4. Dependencias previas
- T00: obliga mapeo canónico-físico; T15 debe leer `service_orders`, `users`, `sucursales`, `audit_logs`, no tablas canónicas inexistentes.
- T04 auditoría: cambios manuales/correcciones futuras de reportes o reglas deben quedar auditables; T15 idealmente solo lee.
- T09: historial por dispositivo puede enriquecer métricas de retrabajo, pero no es base MVP de productividad.
- T10: garantías pueden indicar retrabajos; usar solo si hay fórmula cerrada para no mezclar garantía con productividad normal.
- T14: fuente principal de tiempos reales es `work_logs`; `work_log_events` es bitácora; reglas de comisión quedan en `technician_commission_rules`.
- Reportes existentes: `GET /reports/summary` ya agrega órdenes, clientes, inventario, finanzas, solicitudes, usuarios y movimientos.
- Roles/sucursales: reportes actuales son `owner/manager`; scope se resuelve con `req.scope` y filtra `sucursal_id`.

## 5. Estado real después de T14
- `work_logs`: tiene `tenant_id`, `service_order_id`, `technician_user_id`, `sucursal_id`, `status`, `started_at`, `paused_at`, `ended_at`, `paused_minutes`, `duration_minutes`, `commission_status`, `commission_amount`, `commission_snapshot`.
- `work_log_events`: registra eventos `started`, `paused`, `resumed`, `stopped`, `cancelled`, `corrected`, `approved`.
- `technician_commission_rules`: guarda reglas activas con `basis`, montos, porcentaje, vigencia y prioridad.
- Endpoints T14: `GET/POST/PATCH /orders/commission-rules`, `GET /orders/:id/work-logs`, `POST /orders/:id/work-logs/start|pause|resume|stop`.
- Fuera de T14: UI pesada, reportes T15, aprobación/anulación avanzada de comisiones, segmentos auditables de pausas.
- Ya calculable sin finanzas: horas por técnico, logs por estado, duración promedio, logs sin cerrar, comisiones calculadas/pending como montos informativos no pagados.

## 6. Modelo físico real encontrado
- `work_logs`
  - Ruta: `supabase/migrations/20260625075448_t14_work_logs_commissions.sql`.
  - Columnas: `tenant_id`, `service_order_id`, `technician_user_id`, `sucursal_id`, `status`, `started_at`, `ended_at`, `paused_minutes`, `duration_minutes`, `commission_status`, `commission_amount`, `commission_snapshot`.
  - Uso T15: fuente primaria de horas, productividad y comisiones informativas.
  - Riesgo: logs abiertos o pausados pueden distorsionar métricas si se mezclan con completados.
- `work_log_events`
  - Ruta: migración T14.
  - Columnas: `tenant_id`, `work_log_id`, `service_order_id`, `event_type`, `previous_status`, `new_status`, `actor_user_id`, `created_at`.
  - Uso T15: auditoría operativa de cambios y conteo de eventos.
  - Riesgo: no usar como fuente primaria de duración.
- `technician_commission_rules`
  - Ruta: migración T14.
  - Columnas: `tenant_id`, `name`, `active`, `priority`, `basis`, `rate_percent`, `fixed_amount`, `hourly_amount`, `valid_from`, `valid_until`.
  - Uso T15: contexto de reglas, no recalcular histórico salvo con snapshot.
  - Riesgo: confundir comisión calculada con pago real.
- `service_orders`
  - Rutas: `20260424_baseline_schema.sql`, `20260523121919_align_orders_suppliers_reports_schema.sql`, `20260530121000_add_assigned_user_to_service_orders.sql`.
  - Columnas: `tenant_id`, `sucursal_id`, `status`, `assigned_user_id`, `estimated_cost`, `final_cost`, `promised_date`, `created_at`.
  - Uso T15: estado, sucursal, costo base, SLA prometido, vínculo con técnico asignado.
  - Riesgo: `folio` tuvo historia migratoria irregular; T14 ya evitó depender de él.
- `users`
  - Rutas: `20260424_baseline_schema.sql`, migraciones de sucursal.
  - Columnas: `id`, `tenant_id`, `full_name`, `email`, `role`, `sucursal_id`.
  - Uso T15: nombres/roles de técnicos y scope.
  - Riesgo: usuarios multi-sucursal requieren no asumir una sola sucursal si el modelo crece.
- `sucursales` / `branches`
  - Rutas: baseline `branches`; `20260527091000_cutover_branches_to_sucursales.sql`; migraciones de sync.
  - Columnas: `tenant_id`, `name`, `is_active`; compatibilidad `branch_id/sucursal_id`.
  - Uso T15: filtros por sucursal y productividad por sucursal.
  - Riesgo: compatibilidad histórica exige usar `sucursal_id` vivo y no renombrar.
- Reportes actuales
  - Ruta: `apps/api/src/controllers/reports.ts`.
  - Datos: `service_orders`, `customers`, `sucursal_inventory`, `finances`, `service_requests`, `users`, `inventory_movements`.
  - Uso T15: endpoint base o referencia.
  - Riesgo: agrega en memoria con `.limit(500)`/`.limit(1000)`.
- `audit_logs`
  - Rutas: `20260530132000_security_backoffice_tables.sql`, `20260530193000_audit_hardening_multitenant.sql`.
  - Uso T15: evidencia si se agregan exportes/correcciones; no necesario para reportes read-only.
  - Riesgo: no exponer datos de auditoría en reportes operativos.

## 7. Código real relacionado
- `apps/api/src/controllers/reports.ts`: `getReportsSummary` arma resumen en memoria, filtra por tenant/sucursal, limita 500 filas y 1000 movimientos.
- `apps/api/src/routes/reports.ts`: `GET /reports/summary`, módulo `reports`, roles `owner/manager`.
- `apps/api/src/services/work-logs.ts`: operaciones T14, normaliza logs/reglas y calcula comisiones al cerrar log.
- `apps/api/src/controllers/orders.ts`: handlers T14 para work logs y commission rules.
- `apps/api/src/routes/orders.ts`: rutas T14 antes de `GET /:id`, todas bajo módulo `reports`.
- `apps/web-admin/src/services/reports/reportsService.ts`: delega a `apiGateway.getReportsSummary`.
- `apps/web-admin/src/services/apiGateway.ts`: normaliza `ReportsSummary` y llama `/reports/summary`.
- `apps/web-admin/src/types.ts`: define `ReportsSummary` actual con `productivity`, `ordersByTechnician`, `ordersBySucursal`, estados, productos usados.
- `apps/web-admin/src/app/dashboard/reportes/page.tsx`: UI actual muestra summary, estados, órdenes por técnico y productividad porcentual.
- `apps/web-admin/src/app/dashboard/page.tsx` y `operational-hub.tsx`: consumen summary para dashboard.

## 8. Métricas candidatas para T15
- Horas trabajadas por técnico
  - Fuente: `work_logs.duration_minutes` completados.
  - Fórmula: `sum(duration_minutes) / 60` por `technician_user_id`.
  - Endpoint: `GET /reports/productivity`.
  - Riesgo: excluir logs activos/pausados.
- Logs activos/pausados/completados
  - Fuente: `work_logs.status`.
  - Fórmula: conteo por estado.
  - Endpoint: `GET /reports/productivity`.
  - Riesgo: logs olvidados inflan activos.
- Duración promedio por orden
  - Fuente: `work_logs.duration_minutes`, `service_order_id`.
  - Fórmula: promedio de duración completada por orden.
  - Endpoint: `GET /reports/productivity`.
  - Riesgo: varias sesiones por orden requieren agrupar.
- Productividad por sucursal
  - Fuente: `work_logs.sucursal_id`.
  - Fórmula: horas/completados por sucursal.
  - Endpoint: `GET /reports/productivity?groupBy=sucursal`.
  - Riesgo: logs sin sucursal.
- Órdenes atendidas por técnico
  - Fuente: `count(distinct service_order_id)` en `work_logs`.
  - Fórmula: distinto por técnico.
  - Endpoint: `GET /reports/productivity`.
  - Riesgo: no confundir con `service_orders.assigned_user_id`.
- Comisión calculada pendiente / total
  - Fuente: `work_logs.commission_status`, `commission_amount`.
  - Fórmula: sumas por status; solo informativo.
  - Endpoint: `GET /reports/productivity`.
  - Riesgo: no presentarlo como pago.
- Logs sin cerrar / trabajos pausados
  - Fuente: `work_logs.status in active, paused`.
  - Fórmula: conteo y antigüedad desde `started_at`/`paused_at`.
  - Endpoint: `GET /reports/productivity`.
  - Riesgo: requiere criterio de alerta.
- Tiempo promedio por status
  - Fuente: `work_log_events`.
  - Fórmula: diferencia entre eventos; no recomendado MVP.
  - Endpoint: diferir.
  - Riesgo: eventos no son fuente primaria de tiempos.
- Ranking técnico por duración/completados
  - Fuente: `work_logs` + `users`.
  - Fórmula: sort por horas/completados.
  - Endpoint: `GET /reports/productivity`.
  - Riesgo: rankings injustos si no se normaliza por tipo de trabajo.
- Garantías/retrabajos
  - Fuente: `service_order_warranties`, `service_orders`.
  - Fórmula: reclamos por técnico/sucursal.
  - Endpoint: futuro.
  - Riesgo: atribución no definida; no MVP.
- SLA
  - Fuente: `service_orders.promised_date`, estados terminales.
  - Fórmula: vencidas vs entregadas a tiempo.
  - Endpoint: `GET /reports/summary` o productivity.
  - Riesgo: no hay timezone/fecha de entrega robusta para todos los casos.

## 9. Opciones técnicas para T15

### Opción A — Backend report summary solamente
- Ventajas: menor riesgo, no toca UI, amplía reports con datos de `work_logs`.
- Riesgos: web-admin no verá nuevas métricas si no consume contrato.
- SQL: no necesariamente; puede agregar consulta controlada.
- Archivos afectados: `apps/api/src/controllers/reports.ts`, quizá `routes/reports.ts`.
- Compatibilidad T14: alta.

### Opción B — Backend + UI ligera en reportes admin
- Ventajas: valor visible rápido en `dashboard/reportes`.
- Riesgos: toca `apps/web-admin`, requiere tipos y normalizadores.
- SQL: opcional.
- Archivos: API reports, `apiGateway`, `reportsService`, `types`, `reportes/page.tsx`.
- Compatibilidad T14: alta si solo lee.

### Opción C — Reportes avanzados con filtros/sucursal/técnico
- Ventajas: más útil para owner/manager.
- Riesgos: más validación de permisos, queries, fechas y performance.
- SQL: recomendado si habrá agregaciones por periodo.
- Archivos: API reports, quizá migración con índices/RPC/vistas.
- Compatibilidad T14: media; requiere contratos cerrados.

### Opción D — Comisiones avanzadas/aprobaciones
- Ventajas: acerca payroll/operación.
- Riesgos: toca dinero laboral, aprobaciones, auditoría y posible caja.
- SQL: sí.
- Archivos: work logs, reports, orders, quizá nuevas tablas.
- Compatibilidad T14: baja para MVP; no recomendado en T15.

## 10. Reglas de seguridad para T15
- No crear pagos.
- No tocar caja.
- No modificar comisiones desde reportes.
- No exponer datos privados de cliente.
- Respetar tenant y sucursal.
- Técnicos solo ven su productividad si se autoriza endpoint para técnico; owner/manager ven todo.
- No usar `task_history` como fuente de horas.
- No usar `service_order_events` como fuente primaria de tiempos.
- No inventar métricas sin datos confiables.
- `commission_amount` es informativo/calculado, no deuda pagada.
- Mantener `reports` module; no crear capability nueva sin decisión explícita.

## 11. Riesgos reales
- Métricas falsas por logs sin cerrar.
- Comisiones confundidas con pagos reales.
- Reportes por técnico sin scope de tenant/sucursal.
- Sucursal incorrecta en logs históricos nulos.
- Tiempos negativos o pausas mal calculadas si hay datos corruptos.
- Doble conteo si se suman logs y órdenes sin agrupar.
- Mezclar órdenes completadas con logs completados.
- Exponer datos sensibles de cliente si se une de más.
- Performance si se agregan muchas filas en memoria.
- Timezone no cerrado para periodos diarios/semanales.

## 12. Preguntas para GPT-5.5
1. ¿T15 MVP debe ser solo backend (`/reports/productivity`) o también UI ligera en `web-admin`?
2. ¿Qué roles pueden consultar productividad: solo owner/manager o también técnico con scope propio?
3. ¿Se autoriza SQL/RPC/vista para agregaciones o debe ser TypeScript sobre queries existentes?
4. ¿Las comisiones calculadas se muestran como informativas o se ocultan hasta aprobar flujo financiero/laboral?
5. ¿Qué filtros son obligatorios en MVP: periodo, sucursal, técnico, status?

## 13. Lo que GPT-5.5 debe devolver
- T15 WORKPACK cerrado.
- Decisión de alcance.
- Archivos autorizados.
- SQL exacto si aplica.
- Endpoints exactos.
- Contratos request/response.
- Fórmulas de métricas.
- Reglas de permisos.
- Cambios UI si aplica.
- Validaciones.
- Rollback.
- Criterios de aceptación.

## 14. Recomendación del recolector
Recomendación conservadora: implementar T15 como Opción A primero, con endpoint backend read-only `GET /reports/productivity` o extensión controlada de `/reports/summary`, usando `work_logs` como fuente primaria de tiempos.
No tocar finanzas/caja/pagos, no aprobar comisiones, no recalcular reglas históricas y no usar `task_history`.
Si GPT-5.5 quiere valor visible inmediato, permitir Opción B con UI ligera en `apps/web-admin/src/app/dashboard/reportes/page.tsx`, pero solo después de cerrar contrato response y filtros.
