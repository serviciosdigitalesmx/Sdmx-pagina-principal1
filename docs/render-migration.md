# Fixi Render Migration

## Servicio

- **Nombre del servicio:** `sdmx-backend-api`
- **Tipo de servicio:** `web`
- **Runtime:** `node`
- **Root Directory:** repositorio raíz
- **Región recomendada:** `oregon`
- **Build Command:** `pnpm install --frozen-lockfile && pnpm --filter @white-label/api build`
- **Start Command:** `pnpm --filter @white-label/api start`
- **Health Check Path:** `/api/health`

## Auditoría rápida

- `render.yaml` es válido y apunta al backend correcto.
- El `buildCommand` compila `apps/api` vía el workspace package `@white-label/api`.
- El `startCommand` ejecuta `dist/index.js` como proceso de producción.
- El backend arranca por variables de entorno y no requiere lógica hardcodeada para funcionar.
- No se encontraron secretos hardcodeados en el backend; los secretos viven en env vars.

## Variables de entorno requeridas

### Deben configurarse en Render

- `NODE_ENV=production`
- `PORT=10000`
- `CORS_ALLOWED_ORIGINS=https://serviciosdigitalesmx.online,https://app.serviciosdigitalesmx.online,https://clientes.serviciosdigitalesmx.online,https://api.serviciosdigitalesmx.online,http://localhost:3000,http://localhost:3001`
- `APP_URL=https://serviciosdigitalesmx.online`
- `BASE_DOMAIN=serviciosdigitalesmx.online`
- `API_NAME=Sdmx Backend API`

### Deben copiarse desde el Render anterior

- `WEBHOOK_BASE_URL`
- `JWT_SECRET`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- Cualquier otro valor operacional ya existente para este backend que no esté documentado aquí y que el servicio use por lectura directa de `process.env`

### Deben venir desde Supabase

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Deben generarse nuevamente

- `JWT_SECRET` si no se puede recuperar del Render anterior
- Cualquier secreto nuevo de webhook si el anterior no está disponible

## Notas de compatibilidad

- El backend escucha `PORT` y en Render debe quedar fijo a `10000`.
- El health check funciona en:
  - `/health`
  - `/healthz`
  - `/api/health`
  - `/health/dependencies`
  - `/api/health/dependencies`
- Para Render, el path recomendado es `/api/health`.

## Qué no tocar

- No cambiar lógica de backend.
- No cambiar Supabase.
- No cambiar Vercel.
- No agregar secretos al repositorio.

## Validación previa al deploy

Antes de crear o actualizar el servicio en Render:

1. Confirmar que el repo apunta al commit correcto.
2. Confirmar que `render.yaml` no cambió el comando de build/start.
3. Confirmar que `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` y `JWT_SECRET` estén cargados en la nueva cuenta.
4. Confirmar que `WEBHOOK_BASE_URL` coincide con el dominio público del backend.
5. Confirmar que el health endpoint responde 200 una vez desplegado.
