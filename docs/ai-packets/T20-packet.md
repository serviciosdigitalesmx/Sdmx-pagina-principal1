# T20 PACKET PARA GPT-5.5

## 1. Ticket recomendado

SIGUE T20 PACKET.

T20 viene despues de T19 porque `docs/specs/implementation_order.md` lo coloca al final del bloque de escalamiento SaaS, despues de T17 y T19. `docs/specs/dependencies.md` declara que T20 depende de T17, T19 y Fundaciones. T17 ya publico backoffice interno y T19 ya publico diagnostico/enforcement inicial de limites.

## 2. Evidencia de orden

- `docs/specs/implementation_order.md`: orden definitivo termina con T17 Backoffice, T19 Limites de plan y T20 Exportacion/importacion por tenant.
- `docs/specs/dependencies.md`: T20 depende de T17, T19 y Fundaciones; desbloquea portabilidad.
- `docs/specs/decisions_t17_t18_t19_t20.md`: T20 existe como decision tecnica, pero advierte que faltan worker/runtime asincrono y storage privado.
- `docs/specs/spec_04_plataforma.md`: T20 exige portabilidad segura y recorrido de tablas respetando RLS/tenant.
- `docs/implementation-results/T19-result.md`: T19 queda backend-only sin migracion; `PLAN_REGISTRY` temporal y limites diagnosticos.
- Commits recientes: `adce03f feat(t19): add plan limit diagnostics`, `d5ff60e feat(t17): add platform admin backoffice api`, `2915489 test(t16): add api smoke validation`, `9322ca6 feat(t18): add observability health and request ids`.

## 3. Objetivo del ticket

T20 debe resolver portabilidad de datos tenant-scoped sin mezclar tenants. Debe permitir exportar datos operativos seguros y preparar importacion con diagnostico/preview antes de persistir. No debe hacer import destructivo, borrar datos, truncar tablas ni tocar pagos/caja. Debe evitar secretos, tokens completos y datos internos de plataforma. Debe auditar export/import con `requestId`.

## 4. Estado Git

- Rama actual: `## main...origin/main`.
- Ultimos commits: `adce03f` T19, `d5ff60e` T17, `2915489` T16, `9322ca6` T18, `be8bcae` T15.
- Cambios locales antes de crear packet: ninguno.
- Archivo creado por esta tarea: `docs/ai-packets/T20-packet.md`.

## 5. Dependencias previas

- T00: define mapeo canonico/fisico; no renombrar tablas ni asumir `repair_orders` fisico.
- T04: auditoria critica rige export/import; acciones sensibles deben tener trazabilidad.
- T16: smoke/API debe seguir compatible; T20 no debe romper health ni endpoints base.
- T17: backoffice interno con `requireSuperAdmin` y `supportReason` para soporte.
- T18: request ids, health dependencies y logs seguros para diagnosticar jobs.
- T19: limites/planes y `PLAN_REGISTRY`; T20 debe respetar limites cuando aplique.
- Tenant isolation: `requireAuth`, `validateTenant`, `tenant_id` y RLS son obligatorios.
- Auditoria: `audit_logs.data_before/data_after` y `request_id` son columnas reales.

## 6. Estado real del repo

- Rutas API reales en `apps/api/src/index.ts`: `/api/:tenantSlug/orders`, `requests`, `customers`, `inventory`, `sucursales`, `suppliers`, `purchase-orders`, `users`, `security`, `reports`, `billing`, `public`; admin en `/api/admin`.
- No existen rutas/controladores/servicios `exports`, `imports`, `data_export_jobs` ni `data_import_jobs`.
- No hay dependencia confirmada de CSV/XLSX/zip (`papaparse`, `json2csv`, `xlsx`, `archiver`, `multer`) en package files inspeccionados.
- Tablas exportables reales: `customers`, `service_requests`, `service_orders`, `service_order_checklists`, `service_order_documents`, `service_order_events`, `products`, `sucursal_inventory`, `inventory_movements`, `suppliers`, `purchase_orders`, `purchase_order_items`, `sucursales`, `users`, `work_logs`.
- Tablas sensibles/excluibles por defecto: `audit_logs`, `customer_payments`, `expenses`, `finances`, `message_queue`, `pwa_push_subscriptions`, `security_sessions`, billing/MercadoPago.
- Storage/evidencias existen por `service_order_documents` y `orders.ts`; usan `bucket_name`, `storage_path`, `public_url`, metadata y documentos visibles.
- Huecos reales: no hay jobs asincronos, no hay bucket privado de exportaciones, no hay signed URLs de export, no hay preview/import validation.

## 7. Modelo físico real encontrado

- `tenant_id`: aparece en las entidades operativas clave y debe filtrar toda lectura/escritura.
- `sucursal_id`: existe en `service_orders`, `purchase_orders`, `inventory_movements`, `sucursal_inventory`, `users`, `customers` por migraciones de sucursales.
- Tokens/public tokens: `service_orders.public_token` existe y tiene indice unico por `(tenant_id, public_token)`; T11 guarda solo `public_token_last4` en autorizaciones.
- Documentos/evidencias: `service_order_documents` tiene `tenant_id`, `service_order_id`, `bucket_name`, `storage_path`, `public_url`, `file_name`, `mime_type`, `file_size`, `is_customer_visible`, `retention_expires_at`.
- Relaciones a preservar: cliente -> ordenes -> checklist/eventos/documentos/pagos; productos -> inventario sucursal -> movimientos; proveedores -> compras -> items.
- Nunca exportar completos: `public_token`, JWT/security secrets, MFA secrets, service role keys, auth credentials, session keys, `security_jwt_secret`, payloads internos completos de plataforma.
- Migraciones muestran drift historico (`organizations` vs `tenants`, ramas vs `sucursales`, columnas drop/readd); T20 debe usar mapeo T00 y no asumir que el canonico existe fisicamente.

## 8. Código real relacionado

- `apps/api/src/index.ts`: monta rutas reales y middleware global `requestIdMiddleware`.
- `apps/api/src/routes/orders.ts` / `controllers/orders.ts`: ordenes, documentos, checklist, pagos/refunds, work logs, WhatsApp; cuidado con pagos/caja.
- `apps/api/src/routes/requests.ts` / `controllers/requests.ts`: solicitudes y conversion a orden.
- `apps/api/src/routes/customers.ts` / `controllers/catalogs.ts`: clientes y consentimiento.
- `apps/api/src/routes/inventory.ts` / `controllers/catalogs.ts` / `inventory-reservations.ts`: productos, inventario, reservas; import debe ser no mutante hasta preview.
- `apps/api/src/routes/suppliers.ts` / `purchase-orders.ts`: proveedores, compras e inventario recibido.
- `apps/api/src/routes/sucursales.ts` / `controllers/sucursales.ts`: sucursales y asignacion de usuarios.
- `apps/api/src/routes/users.ts` / `controllers/users.ts`: usuarios operativos; no exportar credenciales.
- `apps/api/src/middleware/auth.ts`: JWT interno, usuario activo, tenant y sesion revocable.
- `apps/api/src/middleware/validateTenant.ts`: valida que ruta y token pertenezcan al mismo tenant.
- `apps/api/src/middleware/tenantBilling.ts`: billing bloqueado responde 402; portabilidad puede requerir excepcion owner.
- `apps/api/src/middleware/requestId.ts`: propaga `x-request-id`.
- `apps/api/src/middleware/requireSuperAdmin.ts`: acceso backoffice T17.
- `apps/api/src/services/security-backoffice.ts`: `writeAuditLog`, `audit_logs`, secretos JWT/MFA.
- `apps/api/src/services/evidence-adapter.ts`: lee evidencias legacy y normalizadas.

## 9. Problemas que T20 debe resolver

- Exportar solo datos del tenant autenticado o tenant objetivo autorizado por backoffice.
- Definir formato seguro JSON/CSV sin dependencias nuevas si se elige MVP.
- Excluir secretos, tokens completos, credenciales, pagos/caja y datos internos.
- Preview/import validation sin escribir datos.
- Idempotencia y deduplicacion por claves naturales.
- Errores por fila y campo.
- Limites de archivo, filas y timeout.
- No hacer import destructivo ni restauracion total.
- Evitar mezcla de tenants y remapear IDs internos.
- Auditar solicitud, descarga, preview y apply.
- No tocar pagos reales, refunds, MercadoPago ni caja.

## 10. Opciones técnicas

### Opción mínima

Backend-only, sin migracion. `GET` summary/export JSON tenant-scoped y `POST` import preview/validate sin persistir.

- Ventajas: bajo riesgo, sin SQL, sin dependencias, valida contratos y seguridad.
- Riesgos: no resuelve volumen real ni persistencia de jobs; export puede ser sync y acotado.
- Requiere SQL: no.
- Toca frontend: no.
- Toca backend: si.
- Dominios sensibles: evita pagos/caja, storage privado y mutaciones import.

### Opción completa

Backend-only con import real append-only/upsert controlado, auditoria y quizas tablas de jobs si GPT-5.5 autoriza SQL.

- Ventajas: cubre portabilidad real, estados, errores por fila e idempotencia.
- Riesgos: requiere diseno de jobs, storage privado/descarga temporal, rollback y limites de volumen.
- Requiere SQL: probablemente si se crean `data_export_jobs`, `data_import_jobs`, errores por fila.
- Toca frontend: no obligatorio.
- Toca backend: si.
- Dominios sensibles: debe excluir pagos/caja y binarios masivos en MVP.

### Opción no recomendada

Dump/restore total, SQL dump con service role, import destructivo, truncate/delete masivo o edicion masiva sin preview.

- Ventajas: aparentemente rapido para soporte interno.
- Riesgos: mezcla de tenants, fuga PII, perdida de datos, rompe RLS/auditoria y produccion.
- Requiere SQL: si, destructivo.
- Toca frontend: no necesariamente.
- Toca backend: alto riesgo.
- Dominios sensibles: toca todo; no apto para T20.

## 11. Reglas de seguridad

- Tenant scoped obligatorio en cada query.
- No service-role dumps ni exportaciones fuera de endpoints controlados.
- No secretos, no tokens completos, no MFA secrets, no service role keys, no passwords/hash.
- No pagos reales, no refunds, no caja, no MercadoPago.
- No borrar, no truncate, no restore completo.
- Import requiere preview antes de persistir.
- Auditoria T04/T17 obligatoria para export/import y soporte.
- Incluir `requestId` en respuestas y auditoria.
- No `supabase db push`.
- No romper T16 smoke.
- Backoffice requiere `requireSuperAdmin` y soporte con motivo si opera otro tenant.

## 12. Endpoints candidatos

MVP:

- `GET /api/:tenantSlug/export/summary`
- `GET /api/:tenantSlug/export/data`
- `POST /api/:tenantSlug/import/preview`

Opcional:

- `POST /api/:tenantSlug/import/apply`
- `GET /api/admin/tenants/:tenantId/export/summary`
- `GET /api/admin/tenants/:tenantId/export/data`

Dejar fuera:

- import destructivo;
- restore completo;
- dumps SQL;
- export de pagos/caja;
- export de secretos/tokens;
- UI frontend.

## 13. Formatos candidatos

- MVP: JSON bundle.
- Opcional: CSV por entidad.
- XLSX fuera si requiere dependencia nueva.
- Incluir `schema_version`.
- Incluir `exported_at`.
- Incluir `tenant_slug`.
- No incluir `tenant_id` destino durante import.
- Usar natural keys donde existan: customer email/phone, product SKU, sucursal code/name, order folio si existe.
- Mapear IDs internos durante import; no confiar en IDs UUID del origen como IDs destino.

## 14. Validaciones necesarias

- `pnpm --dir apps/api typecheck`.
- `bash docs/implementation-bundles/T20/verify.sh` si GPT-5.5 autoriza bundle.
- Prueba estatica de no tocar pagos/caja/MercadoPago/refunds.
- Confirmar no migracion si opcion minima.
- Confirmar no cambios en `package.json` ni `pnpm-lock.yaml`.
- Confirmar no frontend.
- Confirmar no SQL destructivo.
- T16 smoke compatible.
- Guardias para no exportar `public_token`, secrets, session keys ni storage paths privados.

## 15. Riesgos reales

- T20 completo canonico necesita jobs asincronos y storage privado; no existen en repo.
- Export sync puede hacer timeout o consumir memoria si no se limita.
- `service_order_documents.public_url` puede apuntar a buckets publicos; exportarlo puede perpetuar accesos.
- Import real puede duplicar clientes/productos/inventario si no hay idempotencia.
- Drift migratorio puede romper selects si se asumen columnas no garantizadas.
- Billing vencido puede bloquear portabilidad si se reutiliza `requireTenantBillingActive` sin decision explicita.
- Backoffice export de tenant ajeno requiere motivo y auditoria, no solo permiso tecnico.
- `audit_logs` puede contener payloads sensibles; exportarlo debe quedar fuera de MVP.
- Importar inventario puede mutar stock real; preview-only es mas seguro para primer paso.

## 16. Preguntas para GPT-5.5

1. ¿T20 MVP debe ser sin SQL con export JSON + import preview, o debe crear jobs persistentes?
2. ¿Se autoriza migracion para `data_export_jobs`, `data_import_jobs` y errores por fila?
3. ¿Export debe saltarse bloqueo billing para owners por derecho de portabilidad?
4. ¿Que entidades entran al MVP: customers/products/sucursales/orders metadata, o tambien inventario/compras?
5. ¿Documentos se exportan solo como metadata o tambien binarios via storage privado?
6. ¿Se autoriza `import/apply` en T20 o solo `import/preview`?

## 17. Lo que GPT-5.5 debe devolver

- T20 WORKPACK cerrado.
- Decision de alcance.
- Archivos autorizados.
- Si habra SQL o no.
- Endpoints exactos.
- Contratos request/response.
- Formato export/import.
- Entidades incluidas/excluidas.
- Permisos.
- Auditoria.
- Validaciones.
- Rollback.
- Criterios de aceptacion.

## 18. Recomendación del recolector

Recomendacion conservadora: iniciar T20 como backend-only sin migracion, con `GET /export/summary`, `GET /export/data` JSON acotado y `POST /import/preview` sin persistir. Excluir pagos/caja, secretos, tokens completos, audit logs y binarios. Pedir a GPT-5.5 decision explicita antes de cualquier SQL, jobs asincronos, storage privado o `import/apply`.
