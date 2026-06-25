# T14 IMPLEMENTATION RESULT

## 1. Decision final

- T14 se implemento como tiempos, productividad y comisiones.
- No se implemento proveedor real de WhatsApp.
- No se implemento T15.
- Backend/API primero, sin UI pesada.

## 2. Archivos tocados

- `supabase/migrations/20260625075448_t14_work_logs_commissions.sql`
- `apps/api/src/services/work-logs.ts`
- `apps/api/src/controllers/orders.ts`
- `apps/api/src/routes/orders.ts`
- `docs/ai-packets/T14-packet.md`
- `docs/implementation-bundles/T14/README.md`
- `docs/implementation-bundles/T14/verify.sh`
- `docs/implementation-results/T14-result.md`

## 3. Migracion creada

- `supabase/migrations/20260625075448_t14_work_logs_commissions.sql`
- Quedo posterior a `20260625070326_t13_message_queue.sql`.
- No se ejecuto `supabase db push`.

## 4. Tablas creadas

- `work_logs`
- `work_log_events`
- `technician_commission_rules`

Todas quedan con RLS habilitada, sin grants a `anon` ni `authenticated`, y con grants solo a `service_role`.

## 5. Endpoints agregados

- `GET /orders/commission-rules`
- `POST /orders/commission-rules`
- `PATCH /orders/commission-rules/:ruleId`
- `GET /orders/:id/work-logs`
- `POST /orders/:id/work-logs/start`
- `POST /orders/:id/work-logs/:workLogId/pause`
- `POST /orders/:id/work-logs/:workLogId/resume`
- `POST /orders/:id/work-logs/:workLogId/stop`

Todos usan modulo `reports` para evitar crear capability nueva.

## 6. Reglas de tiempo

- `start` crea `work_logs` con status `active`.
- Solo puede existir un log `active` o `paused` por tecnico y tenant.
- `pause` solo opera logs `active`.
- `resume` solo opera logs `paused`.
- `stop` solo opera logs `active` o `paused`.
- `stop` calcula `duration_minutes` como tiempo total menos `paused_minutes`.
- `task_history` no se usa como fuente de horas.
- `service_order_events` no se usa como fuente primaria de tiempos.

## 7. Reglas de pausa/resume

- `pause` guarda `paused_at`.
- `resume` acumula los minutos desde `paused_at` en `paused_minutes`.
- Si `stop` ocurre durante pausa, suma la pausa abierta antes de calcular duracion.

## 8. Reglas de comision

- Al cerrar un work log se busca la regla activa de mayor prioridad.
- Si no hay regla, queda `commission_status = not_configured`.
- `fixed_per_work_log` usa `fixed_amount`.
- `per_hour` usa `duration_minutes / 60 * hourly_amount`.
- `percent_estimated_cost` usa `service_orders.estimated_cost`.
- `percent_final_cost` usa `service_orders.final_cost`.
- Si falta costo para reglas porcentuales, queda `pending_cost`.
- Se guarda `commission_snapshot`.
- No se crean pagos.
- No se toca caja.
- No se toca finanzas.

## 9. Permisos y scope

- Tecnico solo puede operar sus propios logs.
- Owner/manager pueden operar logs de cualquier tecnico.
- Se filtra orden por `tenant_id + id`.
- Si scope es sucursal, se filtra por `service_orders.sucursal_id`.
- Para tecnico se respeta `service_orders.assigned_user_id`.
- Si la orden no existe en tenant/scope, responde 404.

## 10. Auditoria/eventos

- Todo cambio de work log inserta `work_log_events`.
- Crear/actualizar reglas intenta escribir `audit_logs` usando el helper existente `writeAuditLog`.
- Si falla la auditoria de reglas, se documenta en logs y no se falsifica auditoria.

### Nota sobre `service_orders.folio`

T14 no usa `service_orders.folio` porque el cálculo de tiempos y comisiones no lo requiere y el estado migratorio no lo garantiza de forma limpia. La validación de orden se realiza por `tenant_id + id`.

## 11. Que NO se toco

- No se toco WhatsApp provider.
- No se toco `message_queue`.
- No se toco PWA.
- No se toco `notification_events`.
- No se toco inventario.
- No se toco finanzas.
- No se toco `apps/web-clientes`.
- No se tocaron `package.json` ni `pnpm-lock.yaml`.

## 12. Validacion

Ejecutado al cierre:

- `pnpm --dir apps/api typecheck`: OK (`tsc --noEmit`).
- `bash docs/implementation-bundles/T14/verify.sh`: OK.

## 13. Riesgos restantes

- No hay UI pesada para operar T14 desde admin.
- No hay reportes T15 basados en `work_logs`.
- No hay aprobacion/anulacion avanzada de comisiones.
- Pausas multiples quedan acumuladas en `paused_minutes`, no como segmentos auditables separados.
- El calculo de comision no crea pagos ni afecta caja.

## 14. Siguiente ticket recomendado

- T15 productividad/reportes basados en `work_logs`.
