# T11 IMPLEMENTATION RESULT

## 1. Decision tecnica final
- Opcion B: tabla nueva `service_order_authorizations`.
- La entidad autorizable real es `service_orders`.

## 2. Archivos tocados
- `apps/api/src/controllers/public.ts`
- `apps/api/src/routes/public.ts`
- `apps/api/src/controllers/orders.ts`
- `apps/api/src/routes/orders.ts`
- `supabase/migrations/20260624173310_t11_service_order_authorizations.sql`
- `docs/implementation-bundles/T11/README.md`
- `docs/implementation-bundles/T11/verify.sh`
- `docs/implementation-results/T11-result.md`

## 3. Migracion creada
- Tabla aditiva `service_order_authorizations`.
- Indices por orden, status, idempotencia y aceptacion por snapshot.
- RLS habilitado.
- Sin grants a `anon` ni `authenticated`.
- Grant de tabla y RPC solo a `service_role`.
- RPC `submit_service_order_authorization` con `security definer` y `set search_path = public`.

## 4. Endpoints publicos agregados
- `GET /public/tenant/:tenantSlug/orders/:publicToken/authorization`
- `POST /public/tenant/:tenantSlug/orders/:publicToken/authorization`

## 5. Endpoint interno agregado
- `GET /orders/:id/authorizations`

## 6. Reglas de token publico
- La autorizacion usa exclusivamente `service_orders.public_token`.
- No acepta autorizacion por folio plano.
- No devuelve `public_token`; solo se guarda `public_token_last4`.
- No cambia el endpoint historico del portal.

## 7. Reglas de aceptacion/firma
- Decision permitida: `accepted` o `rejected`.
- Tipos permitidos: `diagnosis`, `repair`, `quotation`, `work`, `other`.
- Congela monto, scope, terminos, version, nombre, contacto, IP, user-agent y timestamp servidor.
- No guarda firma base64; permite `typed_name`, `checkbox` o `none`.
- Para `accepted`, `authorizedAmount` es requerido y debe igualar `service_orders.estimated_cost`.

## 8. Auditoria critica
- Inserta evento `authorization_accepted` o `authorization_rejected` en `service_order_events`.
- Inserta `audit_logs.action = service_order.authorization.submitted`.
- Usa `request_id`, `ip_address`, `user_agent` y `data_after`.
- Si falla la auditoria, falla toda la autorizacion.

## 9. Privacidad/documentos
- No genera signed URLs.
- No devuelve documentos privados.
- No modifica `service_order_documents`.

## 10. Relacion con T02/T09/T10
- T02: respeta visibilidad/privacidad; no reemplaza consentimiento de datos.
- T09: no crea `devices`; sigue usando `service_orders`.
- T10: no modifica garantias ni `service_order_warranties`.
- No modifica inventario ni finanzas.

## 11. Typecheck
Salida:

```text
$ tsc --noEmit
```

## 12. Verify
Salida:

```text
== Git ==
## main...origin/main
 M apps/api/src/controllers/orders.ts
 M apps/api/src/controllers/public.ts
 M apps/api/src/routes/orders.ts
 M apps/api/src/routes/public.ts
?? docs/ai-packets/T11-packet.md
?? docs/implementation-bundles/T11/
?? docs/implementation-results/T11-result.md
?? supabase/migrations/20260624173310_t11_service_order_authorizations.sql

== Typecheck API ==
$ tsc --noEmit

== Verificar T11 ==
supabase/migrations/20260624173310_t11_service_order_authorizations.sql:3:create table if not exists public.service_order_authorizations (
supabase/migrations/20260624173310_t11_service_order_authorizations.sql:77:create or replace function public.submit_service_order_authorization(
apps/api/src/routes/public.ts:11:router.get('/tenant/:tenantSlug/orders/:publicToken/authorization', getPublicOrderAuthorization);
apps/api/src/routes/public.ts:12:router.post('/tenant/:tenantSlug/orders/:publicToken/authorization', submitPublicOrderAuthorization);
apps/api/src/controllers/public.ts:915:export async function getPublicOrderAuthorization(req: Request, res: Response) {
apps/api/src/controllers/public.ts:992:export async function submitPublicOrderAuthorization(req: Request, res: Response) {
apps/api/src/routes/orders.ts:27:router.get('/:id/authorizations', requireTenantModule('orders'), requireRole('owner', 'manager', 'technician'), getOrderAuthorizations);
apps/api/src/controllers/orders.ts:2341:export const getOrderAuthorizations = async (req: Request, res: Response) => {
supabase/migrations/20260624173310_t11_service_order_authorizations.sql:224:    case when v_decision = 'accepted' then 'authorization_accepted' else 'authorization_rejected' end,
supabase/migrations/20260624173310_t11_service_order_authorizations.sql:248:    'service_order.authorization.submitted',

== Diff stat ==
 apps/api/src/controllers/orders.ts |  85 ++++++++++++++++++
 apps/api/src/controllers/public.ts | 172 +++++++++++++++++++++++++++++++++++++
 apps/api/src/routes/orders.ts      |   3 +-
 apps/api/src/routes/public.ts      |   4 +-
 4 files changed, 262 insertions(+), 2 deletions(-)

T11 verify OK
```

## 13. Riesgos restantes
- La migracion no fue aplicada a Supabase remoto en esta tarea.
- El frontend aun no consume los endpoints nuevos.
- El portal historico sigue permitiendo consulta por folio/token; T11 solo endurece autorizacion por token.

## 14. Siguiente ticket recomendado
- T12 portal cliente completo con documentos.
