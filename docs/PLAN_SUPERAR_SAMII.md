# Plan para superar Sammy Web

## Propósito

Construir Fixi como un SaaS multi-tenant para talleres, con una experiencia más clara, rápida, segura y orientada al flujo real de reparación. Sammy Web se usa únicamente como referencia funcional y competitiva. No se copia código, textos, recursos ni diseño.

## Reglas de implementación

- Respetar aislamiento por `tenant_id` y, cuando corresponda, por `sucursal_id`.
- Seguir `docs/canonical/` y `docs/specs/` como fuente de verdad.
- Mantener las tablas físicas existentes: `service_orders`, `service_order_checklists`, `service_order_documents`, `service_order_events`, `users`, `sucursales`, `products`, `sucursal_inventory`, `inventory_movements` y `audit_logs`.
- No inventar rutas, columnas, mocks, datos de prueba ni URLs de producción.
- Cada cambio debe pasar typecheck/build y validarse en producción.

## Estado de fases

### Fase 1: Fundaciones y recepción

Estado: completada en entregas anteriores.

- Endpoints y dashboards degradan con gracia ante fuentes legacy.
- Recepción y PDF público tienen hardening.
- Se respeta el contexto tenant en los flujos principales.

### Fase 2: Dashboard y ficha central de orden

Estado: implementada parcialmente y funcional en producción.

- Dashboard con KPIs reales.
- Lista, búsqueda, kanban y detalle de órdenes.
- Edición de cliente, equipo, serie/IMEI y problema.
- Checklist, evidencias, documentos y timeline.
- Costos, pagos, saldo, garantía y portal del cliente.
- WhatsApp con folio/token cuando existe.

### Fase 3: Multisucursal, usuarios y alcance

Estado: publicada en producción en commit `b5703be`.

- Edición de sucursales alineada con el contrato real del backend.
- Estado activo enviado como `isActive`.
- Eliminado el campo de correo de sucursal que no existe en la tabla física.
- Usuarios muestran su sucursal real.
- Usuarios activos pueden reasignarse mediante la ruta existente y protegida del backend.
- Invitaciones conservan asignación inicial de sucursal.

### Fase 4: Orden operativa completa

Estado: la base ya existe; debe auditarse y cerrarse antes de ampliar alcance.

- Recepción -> diagnóstico -> cotización -> reparación -> listo -> entrega.
- Validación de checklist requerido en recepción.
- Registro de eventos y auditoría.
- Pagos y saldo dentro del detalle.
- Pendientes: matriz formal de transiciones, entrega con identidad/verificación y reapertura por garantía.

### Fase 5: Inventario, refacciones y finanzas operativas

Siguiente fase recomendada.

1. Reservas de refacciones por orden.
2. Consumo, devolución y trazabilidad de piezas.
3. Transferencias entre sucursales con historial.
4. Caja y movimientos financieros por sucursal.
5. Pagos, saldos y reembolsos idempotentes.
6. Reportes individuales y consolidados.
7. Validación de límites por plan.

No iniciar cambios de esquema sin revisar primero `docs/specs/decisions_t07_t08.md` y `docs/specs/spec_02_recepcion_finanzas.md`.

## Diferenciadores que debe construir Fixi

- Ficha de orden como centro de trabajo, no como formulario aislado.
- Prellenado real por tenant y configuración útil desde onboarding.
- Portal del cliente con estatus, documentos, evidencias permitidas y contacto directo del taller.
- Multisucursal visible y comprensible: alcance, cambio de sucursal, inventario y reportes.
- Degradación segura ante schemas legacy, sin romper la operación.
- Historial auditable de estados, pagos, evidencias e inventario.
- Planes comerciales expresados como resultados: seguimiento para clientes, control de refacciones, indicadores del negocio e integración con WhatsApp.

## Fuentes canónicas relacionadas

- `docs/canonical/especificacion_aprobada.md`
- `docs/canonical/spec_00_modelo_datos_maestro.md`
- `docs/specs/implementation_order.md`
- `docs/specs/spec_02_recepcion_finanzas.md`
- `docs/specs/decisions_t07_t08.md`
- `docs/plan/fixi-mvp-execution-roadmap.md`
- `docs/DEPLOYMENT_SOURCE_OF_TRUTH.md`
