# Spec 02 — Recepción y Finanzas

Fuente canónica:

- `docs/canonical/especificacion_aprobada.md`
- `docs/canonical/spec_00_modelo_datos_maestro.md`
- `docs/canonical/index_documentacion_canonica.md`

## Compatibilidad con Canonical

- **Tablas canónicas usadas:** `tenants`, `customers`, `repair_orders`, `service_order_checklists`, `service_order_documents`, `service_order_events`, `customer_payments`, `expenses`, `finances`, `audit_logs`.
- **Cambios de esquema propuestos:** ninguno para T01/T03/T02 dentro de esta spec.
- **Dependencias:** Spec 01 (Fundaciones).
- **Decisiones cerradas:** el checklist legal vive sobre `service_order_checklists`; la evidencia nueva vive en `service_order_documents` y `service_order_events`; el consentimiento no se mezcla con `PUT /customers/:id`.

---

## T01 — Checklist Legal Obligatorio De Recepción

### Objetivo Técnico

Garantizar que una orden no quede recibida sin registrar condición física, accesorios y aceptación.

### Tablas Utilizadas

- `tenants`
- `users`
- `customers`
- `repair_orders` / `service_orders`
- `service_order_checklists`
- `audit_logs`

### Contratos Del Sistema

- La obligatoriedad depende de la configuración del tenant.
- `service_order_checklists` guarda el checklist legal de recepción.
- `service_orders.status` debe respetar la validación del backend cuando el tenant exige checklist.
- La auditoría central debe registrar la creación y actualización del checklist con `request_id`.

## T02 — Consentimiento, Retención y Control De Evidencias

### Objetivo Técnico

Controlar clasificación y visibilidad de evidencias asociadas a órdenes.

### Tablas Utilizadas

- `tenants`
- `customers`
- `repair_orders` / `service_orders`
- `service_order_documents`
- `service_order_events`
- `audit_logs`

### Contratos Del Sistema

- La fuente primaria de evidencia nueva es `service_order_documents`.
- La fuente primaria de timeline/eventos es `service_order_events`.
- `service_orders.evidence_metadata` queda únicamente como puente legacy temporal.
- Evidencia interna nunca aparece en portal cliente.
- El consentimiento legal se gestiona en `PATCH /customers/:id/consent`, no en `PUT /customers/:id`.

## T03 — IMEI/Serie Obligatorio Configurable

### Objetivo Técnico

Identificar equipos de forma confiable según su categoría.

### Tablas Utilizadas

- `tenants`
- `repair_orders` / `service_orders`
- `customers`

### Contratos Del Sistema

- La fuente única de verdad es `tenant_field_definitions`.
- `service_orders.serial_number` aplica para recepción interna.
- `service_requests.serial_number` aplica para solicitud/cotización pública.
- La obligatoriedad no se duplica en frontend.
- No depende de `device_categories` en este bloque.

## T05 — Motor De Caja Ligado A Órdenes

### Objetivo Técnico

Vincular ingresos y egresos con órdenes, sucursal y reporte financiero.

### Tablas Utilizadas

- `tenants`
- `repair_orders` / `service_orders`
- `customers`
- `customer_payments`
- `expenses`
- `finances`
- `audit_logs`

### Contratos Del Sistema

- Todo ingreso de cliente se registra en `customer_payments`.
- Todo egreso operativo se registra en `expenses`.
- `finances` funciona como resumen financiero por tenant/sucursal.
- El monto de la orden se calcula desde `service_orders.final_cost` o `estimated_cost` según el flujo aplicable.
- No se inventan tablas de caja nuevas dentro de este bloque.

## T06 — Cancelaciones, Reembolsos y Ajustes Financieros

### Objetivo Técnico

Permitir correcciones financieras sin destruir historial de ingresos/egresos.

### Tablas Utilizadas

- `tenants`
- `repair_orders` / `service_orders`
- `customer_payments`
- `expenses`
- `finances`
- `audit_logs`

### Contratos Del Sistema

- Todo ajuste debe registrarse como nuevo movimiento o reversa lógica, no como edición destructiva del registro original.
- Los reembolsos deben referenciar el pago original en `customer_payments`.
- Las cancelaciones operativas de orden no deben borrar `customer_payments` ni `expenses`.
- Si el ajuste afecta el resumen financiero, `finances` debe reflejar el impacto por tenant/sucursal.
