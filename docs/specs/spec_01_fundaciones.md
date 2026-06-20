# Spec 01 — Fundaciones

Fuente canónica:

- `docs/canonical/especificacion_aprobada.md`
- `docs/canonical/spec_00_modelo_datos_maestro.md`
- `docs/canonical/index_documentacion_canonica.md`

## Compatibilidad con Canonical

- **Tablas canónicas usadas:** `tenants`, `users`, `customers`, `repair_orders`, `quotations`, `quotation_items`, `audit_logs`.
- **Nota de alcance:** `quotations` y `quotation_items` son nombres canónicos de dominio; no tienen tabla física en el estado actual del repo y no forman parte del bloque T01/T03/T02.
- **Cambios de esquema propuestos:**
  - `branches`: Para soportar múltiples sucursales separadas operativamente. Impacto: Alto (añadir `branch_id` a operaciones).
  - `tenant_memberships` y `user_roles`: Para escalar multi-tenant puro y permisos granulares. Impacto: Medio-Alto (migrar `users.tenant_id` y `users.roles`).
  - `devices` y `device_categories`: Para independizar historial de equipo de las órdenes. Impacto: Alto. En el estado actual del repo, el bloque T01/T03/T02 no depende de estas tablas y el dato del equipo sigue inline en `repair_orders`/`service_orders`.
- **Dependencias:** Ninguna, es el módulo base.
- **Decisiones abiertas:** Ninguna para el bloque T01/T03/T02. Se respeta el modelo canónico actual de 9 estados, con dispositivos inline y roles en array.

---

## Principios Técnicos

- Todo dato operativo pertenece a un tenant, definido en `tenants`.
- Los usuarios se asocian directamente al tenant mediante `users.tenant_id`.
- Los roles se manejan directamente en `users.roles TEXT[]`.
- Los dispositivos se capturan directamente en `repair_orders` / `service_orders`.
- Se mantiene estrictamente el ciclo canónico de 9 estados en `repair_orders`.
- Toda tabla operativa usa aislamiento por `tenant_id`.
- T04 ya está aprobado para producción temprana y rige toda acción crítica.

## Tenant

### Objetivo Técnico

Representar la frontera legal, comercial, operativa y de aislamiento de datos.

### Tablas Utilizadas

- `tenants`
- `users`
- `audit_logs`

### Contratos Del Sistema

- Un tenant activo puede operar. Un tenant suspendido no debe crear nuevas operaciones.
- `users` pertenecen a un solo tenant activo mediante `users.tenant_id`.

## Sucursal

### Objetivo Técnico

*Nota: Se maneja a nivel lógico o con campos de configuración hasta que se apruebe el CAMBIO DE ESQUEMA PROPUESTO (`branches`). Actualmente, el tenant funciona como una sucursal única.*

## Usuario y Roles

### Objetivo Técnico

Controlar la autenticación y autorización mediante los roles canónicos.

### Tablas Utilizadas

- `users`

### Contratos Del Sistema

- Los roles canónicos permitidos son: `admin`, `recepcionista`, `tecnico`, `supervisor`.
- Se almacena en `users.roles TEXT[]`.
- Los permisos de lectura/escritura dependen de la intersección del estado de `repair_orders` y los roles del usuario.

## Cliente

### Objetivo Técnico

Representar a la persona o empresa que solicita servicio.

### Tablas Utilizadas

- `customers`
- `repair_orders`

### Contratos Del Sistema

- Un cliente pertenece a un tenant.
- Se reutiliza para múltiples órdenes (`repair_orders.customer_id`).

## Dispositivo

### Objetivo Técnico

Identificar el equipo a reparar. En el esquema canónico, el dispositivo vive dentro de la orden.

### Tablas Utilizadas

- `repair_orders`

### Contratos Del Sistema

- Los datos del equipo (`device_type`, `device_brand`, `device_model`, `serial_number`) son campos en `repair_orders`.
- *CAMBIO DE ESQUEMA PROPUESTO:* Tabla `devices` separada para historial avanzado.

## Orden

### Objetivo Técnico

Representar el expediente central de una reparación.

### Tablas Utilizadas

- `repair_orders`
- `audit_logs`

### Contratos Del Sistema

- Se utilizan los nombres físicos canónicos (`repair_orders`).
- Se mantiene el ciclo de vida estricto de 9 estados canónicos. No se introducen estados extra sin decisión de producto formal.
- Cada transición crítica entre los 9 estados genera auditoría en `audit_logs`.
- La evidencia operativa y documental para recepción y soporte se modela con tablas dedicadas del bloque T01/T02, no con `order_photos`.

## Presupuesto

### Objetivo Técnico

Propuesta económica versionada.

### Tablas Utilizadas

- `quotations`
- `quotation_items`

### Contratos Del Sistema

- Vinculado a `repair_orders`.
- Los nombres físicos canónicos (`quotations`, `quotation_items`) se respetan en todas las consultas y lógicas.

## Ciclo De Estados Base

### Contratos Del Sistema

- Se implementan los 9 estados canónicos y transiciones aprobadas en la fuente de verdad.
- Cualquier estado intermedio necesario se maneja funcionalmente, pero la columna `status` de `repair_orders` permanece en uno de los 9 estados base para garantizar compatibilidad con la base de datos.
