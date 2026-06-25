# T16 Implementation Bundle

## Alcance

T16 fase 1 implementa smoke/API minimo sin dependencias nuevas y sin Playwright UI todavia.

Valida:

- `GET /health`
- `GET /healthz`
- `GET /api/health`
- `GET /health/dependencies`
- `GET /api/health/dependencies`
- header `x-request-id`
- `requestId` en dependency health JSON
- ausencia de textos sensibles en responses revisadas

## Uso Local

```bash
API_BASE_URL="http://localhost:4000" bash scripts/validate-t16-api-smoke.sh
```

`API_BASE_URL` usa default `http://localhost:4000`.

## Uso Preview/Staging

```bash
API_BASE_URL="https://api.staging.example" bash scripts/validate-t16-api-smoke.sh
```

Usar solo ambientes seguros. No apuntar a produccion si hay riesgo de mutacion o datos reales.

## Variables Opcionales

- `API_BASE_URL`: base de API.
- `T16_PRODUCTIVITY_URL`: URL exacta para probar productividad read-only.
- `T16_PUBLIC_PORTAL_URL`: URL exacta para probar portal publico por GET.
- `T16_PUBLIC_AUTHORIZATION_URL`: URL exacta para probar autorizacion publica por GET.
- `T16_AUTH_TOKEN`: token opcional para `T16_PRODUCTIVITY_URL`; no se imprime.

## Seguridad

- No crea datos.
- No borra datos.
- No imprime tokens completos.
- No hace pagos reales.
- No manda WhatsApp real.
- No toca caja real.
- No muta inventario real.
- No ejecuta `supabase db push`.
- No requiere `jq`.

## Limitaciones

- No cubre UI visual.
- No reemplaza tests de integracion existentes.
- Dependency health puede devolver `503` y aun pasar como `DEGRADED_OK` si el body esta saneado.
- Flujos opcionales no se ejecutan si sus variables no estan definidas.
