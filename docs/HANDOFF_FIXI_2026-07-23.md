# Handoff Fixi - 2026-07-23

## Estado de entrega

- Branch: `agent/fix-public-pdf-portal-onboarding`
- Commit publicado: `b5703be feat: align branch and user scope management`
- Worktree: limpio y alineado con `origin/agent/fix-public-pdf-portal-onboarding`.
- Producción web-admin: `Ready`.
- Alias principal: https://admin.serviciosdigitalesmx.online
- Alias Vercel: https://web-admin-jet.vercel.app
- Última verificación HTTP: `/login` respondió `200`.

## Cambios realizados en esta entrega

### Sucursales

Archivo: `apps/web-admin/src/components/sucursales/sucursal-modal.tsx`

- El formulario dejó de enviar `is_active`, que el API no acepta.
- Ahora envía `isActive`, igual que `createSucursalSchema` y `updateSucursalSchema`.
- Se retiró el campo `email`, porque no forma parte del contrato físico de `sucursales`.

### Usuarios y sucursales

Archivos:

- `apps/web-admin/src/app/dashboard/usuarios/page.tsx`
- `apps/web-admin/src/services/users/usersService.ts`

- Se muestra `sucursalId` en la tabla de usuarios.
- Se puede reasignar un usuario activo a una sucursal activa.
- La operación usa el endpoint existente `PUT /api/sucursales/:id/users`.
- La autorización final permanece en backend: `owner` y `manager`.
- La asignación de invitaciones ya existente se conserva mediante `sucursalId`.

## Rutas frontend principales

- `/login`
- `/dashboard`
- `/dashboard/operativo`
- `/dashboard/ordenes`
- `/dashboard/clientes`
- `/dashboard/tecnico`
- `/dashboard/solicitudes`
- `/dashboard/sucursales`
- `/dashboard/usuarios`
- `/dashboard/landing`
- `/dashboard/stock`
- `/dashboard/compras`
- `/dashboard/proveedores`
- `/dashboard/gastos`
- `/dashboard/finanzas`
- `/dashboard/reportes`
- `/dashboard/seguridad`
- `/dashboard/archivo`
- `/dashboard/tareas`

## Endpoints relevantes existentes

- `GET /api/sucursales`
- `POST /api/sucursales`
- `PUT /api/sucursales/:id`
- `DELETE /api/sucursales/:id`
- `PUT /api/sucursales/:id/users`
- `GET /api/users`
- `POST /api/users/invite`
- `PUT /api/users/:id/role`
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/:id`
- `PUT /api/orders/:id/status`
- `GET /api/orders/:id/checklist`
- `PUT /api/orders/:id/checklist`
- `GET /api/orders/:id/authorizations`
- `GET /api/orders/:id/payments`
- `GET /api/health`
- `GET /api/public/tenant/:slug/landing`
- `GET /api/public/tenant/:slug/orders/:folio`

Los prefijos pueden resolverse mediante el gateway según el tenant; revisar `apps/api/src/routes/` antes de agregar una ruta nueva.

## Validaciones ejecutadas

```bash
git diff --check
pnpm --filter web-admin typecheck
pnpm --filter @white-label/api typecheck
vercel --prod --scope serviciosdigitalesmxs-projects --yes
curl -L -I https://admin.serviciosdigitalesmx.online/login
```

Los typechecks pasaron. El entorno local muestra una advertencia de engine porque usa Node 24 y el repo declara Node 22; no bloqueó la compilación ni el despliegue.

## Cómo continuar

1. Leer `docs/PLAN_SUPERAR_SAMII.md`.
2. Leer `docs/canonical/` y `docs/specs/` antes de tocar datos.
3. Ejecutar `git status --short --branch`.
4. Auditar la Fase 4 de órdenes antes de ampliar la funcionalidad.
5. Iniciar Fase 5 con `docs/specs/decisions_t07_t08.md` para reservas e inventario.
6. Validar tenant y sucursal en cada lectura y escritura.
7. Ejecutar typecheck/build, commit, push y deploy de producción.

## Riesgos pendientes

- No existe todavía un modelo granular completo de permisos por acción y sucursal.
- La asignación actual de usuario usa un único `users.sucursal_id`; no inventar membresías múltiples sin workpack/migración.
- La eliminación de sucursales sigue siendo una operación física para owner; evaluar desactivación antes de cambiarla.
- El flujo completo de entrega/reapertura por garantía requiere una especificación de transición antes de imponer bloqueos.
- Inventario avanzado y finanzas deben respetar concurrencia, idempotencia y alcance por sucursal.
