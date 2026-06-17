# Fixi MVP Execution Roadmap

Fecha: 2026-06-16

Objetivo: cerrar el MVP de Fixi con una secuencia de trabajo segura para producción, sin mocks, sin hardcode y sin tocar contratos innecesarios.

## Principios

- Frontend: Next.js en `apps/web-admin`, `apps/web-public` y `apps/web-clientes`.
- Backend: API en Render.
- DB: Supabase con `tenant_id` y RLS.
- No cambiar contratos API salvo que sea indispensable y documentado.
- No usar mocks, datos falsos ni simulaciones.
- No hardcodear URLs ni secretos.
- Cada fase debe poder validarse con evidencia real.

## Fuentes de verdad

- [docs/BACKLOG_MVP_SDMX.md](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/docs/BACKLOG_MVP_SDMX.md)
- [docs/plan/fixi-frontend-modernization-master-plan.md](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/docs/plan/fixi-frontend-modernization-master-plan.md)
- [docs/plan/tenant-website-engine-master-plan.md](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/docs/plan/tenant-website-engine-master-plan.md)
- [docs/endpoints.md](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/docs/endpoints.md)
- [docs/DOMAIN_SERVICES_CURRENT.md](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/docs/DOMAIN_SERVICES_CURRENT.md)
- [docs/ARCHITECTURE_CURRENT.md](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/docs/ARCHITECTURE_CURRENT.md)

## Fase 0. Contrato base y estabilidad

### Objetivo

Eliminar los fallos de integración que bloquean el resto del producto.

### Incluye

- Resolver `Network Error` y `Failed to Fetch`.
- Alinear `APP_URL`, `WEB_ADMIN_URL`, `WEB_PUBLIC_URL`, `API_URL`, `BASE_DOMAIN` y CORS.
- Confirmar que el bridge público -> admin funciona en producción.
- Confirmar que auth, cookies, JWT y tenant runtime siguen estables.

### Criterio de aceptación

- No hay 404 en onboarding/callback.
- No hay errores de red en flujos críticos.
- El tenant correcto se resuelve en admin y public.

---

## Fase 1. Recepción y Seguimiento

### Objetivo

Cerrar el flujo operativo mínimo de una orden.

### Incluye

- WhatsApp con link público de tracking.
- PDF real de recepción.
- Evidencias end-to-end.
- Vista pública de orden para taller y cliente.

### Criterio de aceptación

- El mensaje de WhatsApp abre la orden correcta.
- El PDF existe, se guarda y se puede abrir.
- Las evidencias se guardan y se ven en panel y portal.

---

## Fase 2. Tenant Public Frontend

### Objetivo

Hacer que la web pública del tenant sea funcional de principio a fin.

### Incluye

- URL pública visible en Landing.
- Landing comercial.
- Información del negocio.
- Servicios.
- Cotizador.
- Seguimiento.
- Portal cliente.
- Evidencias públicas.

### Criterio de aceptación

- El dueño puede copiar y compartir la URL pública.
- La web pública renderiza con datos reales.
- No hay `Failed to Fetch` en el frontend público.

---

## Fase 3. Panel Técnico

### Objetivo

Dar al técnico una experiencia aislada, clara y accionable.

### Incluye

- Datos completos en ficha técnica.
- Edición de orden.
- Flujo correcto de técnico.
- Dashboard técnico funcional.

### Criterio de aceptación

- El técnico entra al panel correcto.
- No ve módulos administrativos.
- Ve datos completos y editables de la orden.

---

## Fase 4. CRM

### Objetivo

Automatizar el cliente como entidad viva del sistema.

### Incluye

- Alta o actualización automática de clientes.
- Deduplicación por teléfono.
- Deduplicación por coincidencia parcial de nombre.
- Historial unificado.

### Criterio de aceptación

- Cada cliente tiene un solo historial consolidado.
- No se generan duplicados obvios.

---

## Fase 5. Roles y Permisos

### Objetivo

Cerrar RBAC real para operación multiusuario.

### Roles

- Dueño
- Gerente
- Técnico
- Recepción

### Incluye

- Permisos por rol.
- Bloqueo de módulos sensibles.
- Navegación coherente por perfil.

### Criterio de aceptación

- Cada rol solo ve y ejecuta lo que le corresponde.
- Técnico no accede a finanzas, seguridad, usuarios o configuración.

---

## Fase 6. Seguridad Operativa

### Objetivo

Proteger acciones sensibles.

### Incluye

- Autorización para acciones críticas.
- Crear sucursal.
- Ajustar inventario.
- Transferir stock.

### Criterio de aceptación

- Las operaciones críticas requieren autorización adecuada.
- Queda trazabilidad de la acción sensible.

---

## Fase 7. Landing SaaS

### Objetivo

Unificar la identidad visual comercial del producto.

### Incluye

- Nueva identidad visual.
- Hero.
- Dashboard preview.
- Navegación.
- Componentes.
- Paleta visual.
- Quitar Portal Cliente de la landing SaaS.

### Criterio de aceptación

- La landing vende el producto, no el tenant.
- La experiencia visual se percibe como una sola familia.

---

## Orden recomendado de ejecución

1. Fase 0: Contrato base y estabilidad.
2. Fase 1: Recepción y Seguimiento.
3. Fase 2: Tenant Public Frontend.
4. Fase 3: Panel Técnico.
5. Fase 4: CRM.
6. Fase 5: Roles y Permisos.
7. Fase 6: Seguridad Operativa.
8. Fase 7: Landing SaaS.

## Validaciones obligatorias por fase

- `pnpm --filter web-admin build`
- `pnpm --filter web-public build`
- `pnpm --filter web-clientes build` cuando aplique
- `pnpm --filter api build` cuando aplique
- Verificación en navegador con sesión real
- Evidencia de dominio/URL final

## Cierre MVP

El MVP se considera listo solo si todo esto está probado en producción:

- Tenant público funcional.
- Tracking por enlace.
- PDF operativo.
- Evidencias visibles.
- Sin `Failed to Fetch`.
- CRM autogenerado.
- RBAC completo.
- Flujo técnico corregido.
- Landing SaaS nueva.
- Portal Cliente removido de la landing SaaS.

