# T09 PACKET PARA GPT-5.5

## 1. Objetivo
T09 debe entregar historial clínico por dispositivo sin inventar una nueva capa de datos.
La documentación canónica ya congeló que la identidad del dispositivo vive hoy en `service_orders.serial_number`.
El objetivo es leer ese historial dentro del tenant, con compatibilidad hacia el esquema actual.

## 2. Estado Git
- Rama actual: `main`
- Estado al inicio: limpio
- Últimos 8 commits:
  - `43d962e feat(t08): consume reserved inventory atomically`
  - `96e8835 feat(t07): add inventory reservations`
  - `266c362 docs: define T00 canonical foundations strategy`
  - `5912caf chore: add supabase cli dependency`
  - `6935a29 feat(t02): add consent and evidence visibility controls`
  - `343b0bb feat(t06): add order payment refunds`
  - `327c375 feat(t05): register order payments`
  - `0c7fef5 feat(t03): enforce configurable serial number`
- Archivos creados por esta tarea: `docs/ai-packets/T09-packet.md`

## 3. Dependencias
- `docs/specs/implementation_order.md`: T09 va después de T08.
- `docs/specs/dependencies.md`: T09 depende de T03 y de la base ya estabilizada.

## 4. Decisiones heredadas de T00
- `repair_orders` / `orders` → `service_orders`.
- No se renombra tabla física para este bloque.
- No se crea `devices` como requisito de T09.
- El mapeo oficial para órdenes, eventos y evidencias ya está fijado en `AGENTS.md` y `docs/specs/decisions_t00_fundaciones_canonicas.md`.

## 5. Documentación revisada
- `AGENTS.md`
  - Regla: seguir mapeo canónico ↔ físico y no inventar tablas/rutas.
  - Impacto: T09 debe colgarse de `service_orders`.
- `docs/specs/decisions_t00_fundaciones_canonicas.md`
  - Regla: compatibilidad progresiva; no migración destructiva.
  - Impacto: T09 debe usar el modelo físico existente.
- `docs/specs/spec_01_fundaciones.md`
  - Regla: el dominio canónico habla de órdenes, usuarios, auditoría y contratos; el repositorio aún materializa parte de eso como `service_orders`.
  - Impacto: no obliga a crear `devices` para T09.
- `docs/specs/spec_02_recepcion_finanzas.md`
  - Regla: `service_orders`, `service_order_documents`, `service_order_events`, `service_order_checklists` ya son el soporte real de la orden.
  - Impacto: T09 puede reutilizar el ledger de orden existente.
- `docs/specs/spec_03_inventario_cliente.md`
  - Regla: el repo ya opera con `service_orders`, `customers` y módulos de evidencia, pero T09 no es inventario.
  - Impacto: solo aporta contexto de modelo real.
- `docs/specs/implementation_order.md`
  - Regla: T09 viene después de T07/T08.
  - Impacto: no debe romper lo que inventario ya dejó publicado.
- `docs/specs/dependencies.md`
  - Regla: T09 se apoya en bloques previos.
  - Impacto: no debe introducir nuevas dependencias estructurales.
- `docs/specs/decisions_t09_t10.md`
  - Regla: el identificador canónico del dispositivo para T09 es `service_orders.serial_number`.
  - Impacto: define la ruta y el filtro exactos del historial.
- `docs/ai-packets/T07-packet.md`
  - Regla: T07 ya fijó inventario y no toca historial clínico.
  - Impacto: T09 no debe mezclar reservas con historial.
- `docs/ai-packets/T08-packet.md`
  - Regla: T08 consumió reservas atómicas y quedó aislado del historial.
  - Impacto: no reutilizar lógica de consumo para T09.
- `docs/implementation-results/T07-result.md`
  - Regla: `service_orders.sucursal_id` es la columna real usada en órdenes.
  - Impacto: T09 no debe depender de sucursal para identificar historial.
- `docs/implementation-results/T08-result.md`
  - Regla: T08 valida consumo atómico sobre inventario.
  - Impacto: no afecta la lectura de historial por serial.

## 6. Modelo físico actual del repo
- `tenants`
  - Confirmado en migraciones base y relaciones de tenant en órdenes/auditoría.
  - Uso para T09: aislar el historial por tenant.
- `users`
  - Existe como tabla tenant-scoped real.
  - Uso para T09: autoría y permisos de lectura.
- `customers`
  - Existe y ya alimenta el contexto de órdenes y portal.
  - Uso para T09: contexto secundario, no identidad del equipo.
- `service_orders`
  - Existe y guarda `serial_number`, `device_info`, `device_type`, `device_brand`, `device_model`.
  - Uso para T09: fuente principal del historial por dispositivo.
- `service_order_status_history`
  - Existe como ledger temporal de estado.
  - Uso para T09: timeline clínico de la orden.
- `service_order_events`
  - Existe como bitácora de eventos.
  - Uso para T09: evidencia complementaria.
- `service_order_documents`
  - Existe como repositorio de adjuntos.
  - Uso para T09: evidencia complementaria.
- `audit_logs`
  - Existe como auditoría.
  - Uso para T09: trazabilidad de consultas sensibles si aplica.

## 7. Posibles identificadores de dispositivo
- `service_orders.serial_number` es el identificador canónico confirmado para T09.
- `service_orders.device_info.serial_number` aparece como compatibilidad en frontend, pero no reemplaza al campo físico de la orden.
- `device_info`, `device_type`, `device_brand`, `device_model` son metadatos inline, no una entidad `devices`.
- No se encontró una tabla física `devices` necesaria para este bloque.

## 8. Código real relacionado
- `apps/api/src/controllers/orders.ts`
  - Función relevante: `getOrderById`, `updateOrderWarranty`.
  - Importa porque ya carga `service_order_documents`, `service_order_events` y usa `serial_number`.
  - Candidato: referencia para formato de respuesta, no para reescritura masiva.
- `apps/api/src/routes/orders.ts`
  - Función relevante: rutas de órdenes y warranty.
  - Importa porque T09 probablemente se monta ahí o en un alias compatible.
  - Candidato: alta probabilidad de modificación mínima.
- `apps/api/src/services/evidence-adapter.ts`
  - Función relevante: normalización de evidencia.
  - Importa porque T09 puede reutilizar el patrón de lectura de evidencias.
  - Candidato: referencia, no necesariamente modificación.
- `apps/api/src/routes/customers.ts`
  - Función relevante: `GET /:id/history`.
  - Importa porque muestra patrón de historial ya expuesto en el backend.
  - Candidato: solo referencia.
- `apps/api/src/controllers/catalogs.ts`
  - Función relevante: historial de cliente.
  - Importa porque contiene lectura por tenant y agregación de historial.
  - Candidato: posible referencia para shape de respuesta.
- `apps/web-admin/src/components/dashboard/orders/order-detail-drawer.tsx`
  - Función relevante: consumo de `device_info` y `serial_number`.
  - Importa porque confirma que la UI ya entiende el serial inline.
  - Candidato: referencia.
- `apps/web-clientes/src/lib/utils/normalizers.ts`
  - Función relevante: normalización de `serialNumber`.
  - Importa porque confirma compatibilidad de frontend con el campo actual.
  - Candidato: referencia.

## 9. Opciones técnicas
### A. Consultar `service_orders` directamente
- Ventajas: cero tablas nuevas; se alinea con T00 y con la decisión congelada de T09.
- Riesgos: la respuesta depende del shape actual de `service_orders`.
- Archivos afectados: backend de órdenes y ruta de historial.
- Seguridad para producción temprana: sí, es la opción más segura.

### B. Crear adaptador/vista canónica
- Ventajas: desacopla contrato de lectura y puede estabilizar el payload.
- Riesgos: añade una capa extra sin resolver la identidad física.
- Archivos afectados: SQL de vista/adaptador y route/controller de historial.
- Seguridad para producción temprana: media, si se mantiene solo lectura.

### C. Crear `devices`
- Ventajas: modela explícitamente la entidad equipo.
- Riesgos: rompe el principio de compatibilidad y abre una migración más amplia.
- Archivos afectados: migraciones, controllers, rutas, frontends y reportes.
- Seguridad para producción temprana: no recomendable para T09.

## 10. Riesgos reales
- Cruce de tenant si el filtro por `tenant_id` no es explícito.
- Mezcla de órdenes de distintos clientes con el mismo serial si se omite el tenant.
- Falso aislamiento por sucursal: T09 no debe depender de sucursal.
- Duplicación de historial si se mezclan `service_orders` con otra fuente no canónica.
- Inconsistencia de casing en `serial_number` si la entrada no se normaliza.
- Regresión en portal cliente si se cambia el shape esperado por frontend.
- Riesgo de tocar inventario o garantías por accidente si se intenta resolver T09 como refactor general.
- Desalineación con T04 si se omite trazabilidad para consultas críticas.

## 11. Preguntas para GPT-5.5
1. ¿T09 debe exponer solo lectura desde `service_orders` o conviene una vista/adaptador canónico?
2. ¿La comparación de `serial_number` debe ser exacta o normalizada por casing?
3. ¿El endpoint oficial debe vivir en `routes/orders.ts` o en un controlador nuevo?
4. ¿Qué campos mínimos del historial son obligatorios en la respuesta?
5. ¿Se requiere incluir `service_order_status_history` y `service_order_events` en la misma respuesta?

## 12. Lo que GPT-5.5 debe devolver
- Decisión técnica final cerrada.
- Si T09 debe resolverse con lectura directa, vista/adaptador, o entidad nueva.
- Archivos autorizados.
- SQL exacto si hay migración.
- Endpoints exactos.
- Contrato request/response.
- Reglas de autorización.
- Pasos cerrados para Codex Mini.
- Comandos de validación.
- Rollback.
- Criterios de aceptación.
