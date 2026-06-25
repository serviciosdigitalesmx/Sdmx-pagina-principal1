# T12 IMPLEMENTATION RESULT

## 1. Decisión técnica final

- Opción B: nuevo endpoint público canónico por `public_token`.
- No se elimina el endpoint legacy por folio/token.
- El portal usa contrato T12 cuando recibe token y mantiene fallback legacy por folio.

## 2. Archivos tocados

- `apps/api/src/controllers/public.ts`
- `apps/api/src/routes/public.ts`
- `apps/web-clientes/src/app/t/[tenantSlug]/portal/page.tsx`
- `apps/web-clientes/src/app/t/[tenantSlug]/portal/[folio]/page.tsx`
- `apps/web-clientes/src/lib/api/orders.ts`
- `apps/web-clientes/src/lib/portal/portal-view.tsx`
- `apps/web-clientes/src/components/portal/document-list.tsx`
- `apps/web-clientes/src/lib/utils/normalizers.ts`
- `apps/web-clientes/src/lib/types.ts`
- `docs/implementation-bundles/T12/README.md`
- `docs/implementation-bundles/T12/verify.sh`
- `docs/implementation-results/T12-result.md`

## 3. Migración

- No hubo migración T12.
- No se tocó `supabase/migrations/`.
- No se ejecutó `supabase db push`.

## 4. Endpoint público agregado

- `GET /public/tenant/:tenantSlug/orders/:publicToken/portal`
- Busca exclusivamente por `tenant_id + public_token`.
- No devuelve `public_token`.
- No devuelve `internal_diagnosis`.
- No devuelve `audit_logs`.

### Nota sobre `priority`

T12 no usa `service_orders.priority` como columna física porque no está garantizada en el estado migratorio real: aparece en baseline, pero fue eliminada en `20260514133525_remote_schema.sql`. El portal devuelve `priority: "normal"` como valor calculado seguro.

## 5. Cambios frontend

- `getPortalOrderByToken(tenantSlug, publicToken)` consume el endpoint canónico T12.
- `getOrderByFolio` se mantiene para compatibilidad legacy.
- `PortalView` usa token cuando llega query `token`.
- `PortalView` intenta endpoint token si un valor dinámico parece token y cae a legacy si falla.
- El portal muestra resumen de orden, documentos, evidencias, timeline, autorización y garantía.
- Documentos sin URL no se renderizan como links rotos.

## 6. Reglas de documentos

- Backend filtra `is_customer_visible = true`.
- Backend filtra `retention_expires_at is null OR retention_expires_at > now()`.
- No devuelve `bucket_name`.
- No devuelve `storage_path`.
- No genera signed URLs.
- Si un documento visible no tiene `public_url`, devuelve `url: null`.

## 7. Reglas de timeline

- Usa timeline calculado básico de recepción/estado actual.
- Agrega eventos solo desde whitelist:
  - `status_changed`
  - `authorization_accepted`
  - `authorization_rejected`
  - `warranty_claim_created`
  - `warranty_claim_status_updated`
  - `document_uploaded`
  - `customer_message`
- No devuelve eventos `note`, `internal_note`, `audit`, `payment`, `refund`, `inventory` ni `technician_private`.
- No devuelve `created_by`.

## 8. Reglas de autorización visibles

- Muestra `hasAcceptedAuthorization`, `latestStatus`, `latestDecisionAt`, `latestAuthorizationType` y `authorizedAmount`.
- No devuelve IP.
- No devuelve user-agent.
- No devuelve `signature_text`.
- No devuelve `terms_snapshot`.
- No devuelve token completo.

## 9. Reglas de garantía visibles

- Muestra `warrantyUntil`, `isWarrantyActive`, `claimsCount` y `latestClaimStatus`.
- No expone expediente interno completo de reclamos.
- No modifica inventario.
- No modifica finanzas.

## 10. Manejo folio/token

- Token: usa endpoint canónico T12.
- Folio: se mantiene endpoint legacy para compatibilidad temporal.
- PDF legacy se conserva sin cambios.
- No se implementó PDF token-based en T12 para no devolver `public_token` completo en payload.

## 11. Admin links

- No se actualizaron links en `apps/web-admin`.
- Motivo: no se confirmó que el objeto usado por esos componentes tenga `public_token` estable disponible sin fetch adicional.
- Queda pendiente para ticket dedicado o workpack explícito.

## 12. Typecheck API

```text
$ tsc --noEmit
```

## 13. Typecheck web-clientes

```text
[WARN] Unsupported engine: wanted: {"node":"22.x"} (current: {"node":"v24.14.0","pnpm":"11.7.0"})
$ tsc --noEmit
```

## 14. Verify

```text
== Git ==
## main...origin/main
 M apps/api/src/controllers/public.ts
 M apps/api/src/routes/public.ts
 M apps/web-clientes/src/app/t/[tenantSlug]/portal/[folio]/page.tsx
 M apps/web-clientes/src/app/t/[tenantSlug]/portal/page.tsx
 M apps/web-clientes/src/components/portal/document-list.tsx
 M apps/web-clientes/src/lib/api/orders.ts
 M apps/web-clientes/src/lib/portal/portal-view.tsx
 M apps/web-clientes/src/lib/types.ts
 M apps/web-clientes/src/lib/utils/normalizers.ts
?? docs/ai-packets/T12-packet.md
?? docs/implementation-bundles/T12/
?? docs/implementation-results/T12-result.md

== Typecheck API ==
$ tsc --noEmit

== Typecheck web-clientes ==
[WARN] Unsupported engine: wanted: {"node":"22.x"} (current: {"node":"v24.14.0","pnpm":"11.7.0"})
$ tsc --noEmit

== Verificar T12 ==
apps/api/src/routes/public.ts:2:import { createPublicQuote, createPublicStoreOrder, getPublicOrderAuthorization, getPublicOrderPdf, getPublicPortalByToken, getPublicPortalOrder, getPublicStoreCatalog, getPublicTenantLanding, submitPublicOrderAuthorization, trackPublicOrder } from '../controllers/public';
apps/api/src/routes/public.ts:13:router.get('/tenant/:tenantSlug/orders/:publicToken/portal', getPublicPortalByToken);
apps/api/src/controllers/public.ts:930:export async function getPublicPortalByToken(req: Request, res: Response) {
apps/web-clientes/src/lib/api/orders.ts:8:export function getPortalOrderByToken(tenantSlug: string, publicToken: string) {
apps/web-clientes/src/lib/portal/portal-view.tsx:107:            const portalPayload = await getPortalOrderByToken(tenantSlug, cleanValue);
apps/web-clientes/src/lib/portal/portal-view.tsx:428:                {result.authorization ? (
apps/web-clientes/src/lib/portal/portal-view.tsx:445:                {result.warranty ? (
apps/web-clientes/src/lib/utils/normalizers.ts:37:    timeline: normalizePortalTimeline(raw.timeline.items),
apps/web-clientes/src/lib/utils/normalizers.ts:39:    documents: normalizePortalDocuments(raw.documents.items),
apps/api/src/controllers/public.ts:964:        .eq('is_customer_visible', true)
apps/api/src/controllers/public.ts:965:        .or(`retention_expires_at.is.null,retention_expires_at.gt.${nowIso}`)
apps/api/src/controllers/public.ts:975:        .from('service_order_authorizations')
apps/api/src/controllers/public.ts:983:        .from('service_order_warranties')

== Confirmar que no hubo migración T12 ==
No T12 migration found, OK

== Diff stat ==
 apps/api/src/controllers/public.ts                 | 194 +++++++++++++++++++++
 apps/api/src/routes/public.ts                      |   3 +-
 .../src/app/t/[tenantSlug]/portal/[folio]/page.tsx |   2 +-
 .../src/app/t/[tenantSlug]/portal/page.tsx         |   3 +-
 .../src/components/portal/document-list.tsx        |  52 ++++--
 apps/web-clientes/src/lib/api/orders.ts            |   6 +-
 apps/web-clientes/src/lib/portal/portal-view.tsx   |  71 ++++++--
 apps/web-clientes/src/lib/types.ts                 |  87 ++++++++-
 apps/web-clientes/src/lib/utils/normalizers.ts     |  77 +++++++-
 9 files changed, 459 insertions(+), 36 deletions(-)

T12 verify OK
```

## 15. Riesgos restantes

- El portal legacy por folio sigue existiendo por compatibilidad.
- PDF token-based no se implementó; el PDF legacy queda vigente.
- `apps/web-admin` aún comparte enlaces por folio si no recibe `public_token`.
- Las URLs públicas persistentes siguen dependiendo del diseño actual de Storage/documentos.
- El endpoint nuevo depende de que las migraciones T10/T11 estén aplicadas en el entorno objetivo.

## 16. Siguiente ticket recomendado

- T13 WhatsApp automatizado con cola y bitácora.
