# T13 Implementation Bundle

## Objetivo

Implementar WhatsApp semi-automatizado con outbox interno:

- `message_queue` como cola/bitacora interna.
- Generacion manual de URL `wa.me`.
- Sin proveedor externo.
- Sin credenciales.
- Sin `supabase db push`.

## Validacion

```bash
bash docs/implementation-bundles/T13/verify.sh
```

## Alcance

- Backend agrega endpoints internos en ordenes.
- Se registra evento `whatsapp_draft_generated`.
- Web-admin solo mejora links existentes cuando ya existe `public_token`.
- `notification_events` y PWA push no se modifican.
