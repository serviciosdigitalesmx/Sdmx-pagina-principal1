# T13 IMPLEMENTATION RESULT

## 1. Decision tecnica final

- T13 se implemento como Opcion C limitada + Opcion A.
- Se creo outbox interno `message_queue`.
- Solo se generan borradores manuales de WhatsApp con `wa.me`.
- No se envia automaticamente.
- No se integro proveedor externo.

## 2. Archivos tocados

- `supabase/migrations/20260625070326_t13_message_queue.sql`
- `apps/api/src/services/whatsapp-messages.ts`
- `apps/api/src/controllers/orders.ts`
- `apps/api/src/routes/orders.ts`
- `apps/web-admin/src/components/dashboard/orders/order-detail-drawer.tsx`
- `docs/implementation-bundles/T13/README.md`
- `docs/implementation-bundles/T13/verify.sh`
- `docs/implementation-results/T13-result.md`

## 3. Migracion creada

- `supabase/migrations/20260625070326_t13_message_queue.sql`
- Quedo posterior a `20260624173310_t11_service_order_authorizations.sql`.
- No hubo migracion T12.
- No se ejecuto `supabase db push`.

## 4. Tabla message_queue

- Tabla interna para cola/bitacora.
- Canal limitado a `whatsapp`.
- Proveedor limitado a `manual_wa_me` o reserva futura.
- Estados permitidos: `generated`, `opened_manual`, `cancelled`, `failed`.
- Templates permitidos: `order_received`, `status_update`, `authorization_request`, `portal_link`, `warranty_info`.
- Tiene indice unico por `(tenant_id, idempotency_key)` cuando existe.
- RLS habilitada.
- Acceso revocado a `anon` y `authenticated`.
- Acceso concedido solo a `service_role`.

## 5. Endpoints agregados

- `POST /orders/:id/whatsapp/draft`
- `GET /orders/:id/whatsapp/messages`
- Ambos requieren modulo `whatsapp`.
- Ambos requieren rol `owner`, `manager` o `technician`.
- Las rutas quedaron antes de `GET /:id`.

## 6. Reglas de consentimiento

- Se toma snapshot de `customers.data_consent_status`.
- Se toma snapshot de `customers.data_consent_scope`.
- Si consentimiento es `revoked`, `denied`, `rejected` o `declined`, se bloquea con `409`.
- Si no hay consentimiento confirmado, se permite borrador manual y se devuelve `consentWarning`.

## 7. Reglas de telefono

- Se resuelve telefono por prioridad:
  - `recipientPhone` del body.
  - `customers.phone`.
  - `device_info.customer_phone` como fallback documentado.
- Se eliminan caracteres no numericos.
- Si hay 10 digitos y `countryCode=52`, se construye numero con pais.
- Si hay 11 a 15 digitos, se usa tal cual.
- Si queda invalido, responde `400`.

## 8. Reglas de templates

- Los mensajes usan datos seguros:
  - nombre de cliente si existe.
  - folio solo informativo.
  - estado.
  - portal por token.
  - monto estimado solo en template de autorizacion.
  - nombre del tenant.
- No usan diagnostico interno.
- No usan notas internas.
- No usan documentos directos.

## 9. Portal token

- El link generado usa la ruta real del portal cliente:
  - `/t/:tenantSlug/portal?token=:publicToken`
- Si existe `NEXT_PUBLIC_WEB_PUBLIC_URL` o `APP_URL`, se usa como base.
- `message_queue` guarda `public_token_last4`, no token completo en columna separada.
- `message_body` y `wa_me_url` contienen link sensible, por eso la tabla queda restringida a `service_role`.
- La respuesta no devuelve `public_token` como campo independiente.

## 10. Privacidad

- No se exponen `audit_logs`.
- No se envia `internal_diagnosis`.
- No se mandan documentos directos ni URLs de documentos.
- No se devuelven IP, user-agent, firma ni reclamos internos.
- La lista de mensajes no devuelve `message_body` ni `wa_me_url`.

## 11. Notification_events/PWA

- No se uso `notification_events`.
- No se modifico `apps/api/src/services/pwa-push.ts`.
- T13 usa `message_queue` porque `notification_events` pertenece a push interno y esta desalineada en migraciones.

## 12. Proveedor real

- No se agrego proveedor real.
- No se agregaron credenciales.
- No se agrego worker/dispatcher.
- No se promete entrega real; solo borrador manual con `wa.me`.

## 13. Web-admin

- Se actualizo `order-detail-drawer.tsx` para usar portal T12 por token si el objeto de orden ya trae `public_token` o `publicToken`.
- Si no hay token disponible, mantiene fallback legacy por folio.
- No se agrego fetch pesado ni se modifico `apiGateway.ts`.
- `order-intake-modal.tsx`, `success.tsx` y `quote-modal.tsx` quedan pendientes porque sus props actuales no incluyen token seguro.

## 14. Validacion

Ejecutado al cierre:

- `pnpm --dir apps/api typecheck`: OK (`tsc --noEmit`).
- `pnpm --dir apps/web-admin typecheck`: OK (`tsc --noEmit`).
- `bash docs/implementation-bundles/T13/verify.sh`: OK.
- Se observo warning de engine por Node 24 vs 22.x en web-admin, pero no bloqueo typecheck.

## 15. Riesgos restantes

- Los componentes admin sin `public_token` siguen usando fallback legacy.
- No existe envio automatico ni confirmacion de entrega.
- No hay adaptador de proveedor externo.
- El link sensible vive dentro de `message_body` y `wa_me_url`; por eso `message_queue` debe permanecer restringida.
- Falta decidir si T14 o un ticket dedicado agrega configuracion de proveedor y automatizacion real.

## 16. Siguiente ticket recomendado

- T14 o ticket dedicado para automatizacion real/configuracion de proveedor, segun decision documental.
