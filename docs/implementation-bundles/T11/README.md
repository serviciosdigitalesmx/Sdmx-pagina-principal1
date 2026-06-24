# T11 — Autorizacion online con aceptacion/firma

## Alcance
- Implementa autorizaciones online formales sobre `service_orders`.
- Agrega tabla aditiva `service_order_authorizations`.
- Agrega endpoints publicos por `public_token`.
- Agrega endpoint interno para consultar autorizaciones por orden.

## Fuera de alcance
- No implementa T12.
- No toca frontend.
- No crea `devices`.
- No crea `quotations` ni `quotation_items`.
- No modifica inventario ni finanzas.
- No ejecuta `supabase db push`.

## Validacion
Ejecutar:

```bash
bash docs/implementation-bundles/T11/verify.sh
```
