# T20 Implementation Bundle

T20 agrega portabilidad tenant-scoped backend-only sin migracion:

- `GET /api/:tenantSlug/export/summary`
- `GET /api/:tenantSlug/export/data`
- `POST /api/:tenantSlug/import/preview`

## Alcance

- Export JSON con formato `fixi-portability-v1`.
- Preview de import sin persistencia.
- Rutas protegidas por `requireAuth`, `validateTenant` y `requireRole('owner', 'manager')`.
- Auditoria con acciones `portability.export.summary`, `portability.export.data` y `portability.import.preview`.
- Sin `requireTenantBillingActive` para no bloquear portabilidad por estado de billing.

## Validacion

```bash
bash docs/implementation-bundles/T20/verify.sh
```

## Fuera de alcance

- Migraciones, SQL, jobs o storage privado.
- UI/frontend.
- Import real o apply.
- Pagos, caja, refunds, billing, audit logs, WhatsApp, PWA push y tokens completos.
