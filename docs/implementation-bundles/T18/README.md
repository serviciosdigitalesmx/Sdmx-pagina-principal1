# T18 Implementation Bundle

## Alcance

T18 implementa observabilidad minima backend sin migracion:

- health superficial preservado;
- health de dependencias saneado;
- correlacion global con `requestId`;
- header `x-request-id`;
- logs estructurados seguros;
- error handler con `requestId`.

## No incluido

- No UI.
- No migraciones.
- No proveedor APM.
- No tabla `operational_events`.
- No T16.
- No cambios en dominios de negocio.

## Validacion

```bash
pnpm --dir apps/api typecheck
bash docs/implementation-bundles/T18/verify.sh
```
