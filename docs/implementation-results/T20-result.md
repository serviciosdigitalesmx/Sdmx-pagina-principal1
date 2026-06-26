# T20 RESULT — Export/import preview backend-only

## Decision final

T20 se implemento como backend-only sin migracion, sin SQL nuevo y sin UI. El MVP entrega export JSON tenant-scoped y preview de import sin persistir datos.

## Endpoints agregados

- `GET /api/:tenantSlug/export/summary`
- `GET /api/:tenantSlug/export/data`
- `POST /api/:tenantSlug/import/preview`

## Formato

- `schema_version`: `fixi-portability-v1`
- Export: JSON con `tenant`, `entities`, `excluded`, `warnings`, `limits` y `requestId`.
- Import preview: JSON con `valid`, `summary`, `entities`, `would_create`, `would_skip`, `would_conflict` y `requestId`.

## Entidades incluidas

- `customers`
- `sucursales`
- `users_sanitized`
- `products`
- `suppliers`
- `service_requests`
- `service_orders_sanitized`
- `service_order_events`
- `service_order_checklists`
- `service_order_documents_metadata`
- `sucursal_inventory_snapshot`

## Entidades excluidas

- `payments`
- `refunds`
- `cash`
- `expenses`
- `finance`
- `billing`
- `audit_logs`
- `message_queue`
- `pwa_push_subscriptions`
- `security_sessions`
- `raw_storage_objects`

## Seguridad

- Todas las rutas usan `requireAuth`, `validateTenant` y `requireRole('owner', 'manager')`.
- Todas las lecturas filtran por `tenant_id`.
- No se usa `select('*')`.
- El export no devuelve `tenant_id` como destino.
- No se exportan tokens completos, secretos, credenciales, audit logs, rutas de storage ni URLs publicas de storage.
- No se aplica `requireTenantBillingActive` para no bloquear portabilidad por estado de billing.

## Auditoria

Cada endpoint audita con el writer existente:

- `portability.export.summary`
- `portability.export.data`
- `portability.import.preview`

La auditoria guarda solo metadata: version, entity keys, conteos, limites y `requestId`. No guarda filas completas ni payloads importados completos. Export data e import preview fallan cerrado si la auditoria falla.

## Import preview

- Acepta body JSON, no multipart.
- No persiste datos.
- No inserta, actualiza ni borra.
- Rechaza entidades no soportadas o excluidas.
- Rechaza campos peligrosos como tenant destino, passwords, secrets, tokens, storage paths y service role keys.
- Limita 1000 filas por entidad y 5000 filas totales.
- Detecta duplicados posibles por claves naturales en `customers`, `products` y `sucursales`.

## Que NO se toco

- No se creo migracion T20.
- No se ejecuto `supabase db push`.
- No se tocaron frontends.
- No se tocaron package files.
- No se instalaron dependencias.
- No se toco pagos, caja, refunds, MercadoPago ni billing.
- No se toco WhatsApp, `message_queue`, PWA ni `notification_events`.
- No se toco portal cliente ni autorizacion publica.
- No se implemento `import/apply`.
- No se persisten datos importados.

## Validaciones

- `pnpm --dir apps/api typecheck`
- `bash docs/implementation-bundles/T20/verify.sh`
- `verify.sh` fue endurecido para revisar working tree, staged y archivos nuevos no trackeados, además de escanear archivos T20 completos para evitar falsos negativos.

## Riesgos restantes

- Export sync limitado a 1000 filas por entidad en MVP.
- No hay jobs/background workers.
- No exporta binarios ni storage privado.
- No hay import apply.
- No hay CSV/XLSX.
- Runtime real queda pendiente de variables/env y datos de Supabase.
