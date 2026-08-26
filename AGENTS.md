# Codex Rules

- Seguir siempre `docs/canonical/` y `docs/specs/`.
- No renombrar tablas físicas sin un workpack explícito.
- Usar el mapeo canónico ↔ físico oficial definido en este archivo.
- No implementar tickets fuera de alcance.
- No hacer commit sin permiso explícito.
- No usar mocks.
- No inventar helpers, rutas, tablas, columnas ni variables.
- Correr `git status --short --branch` antes de tocar archivos.
- Correr validación después de cambios.
- Un baseline sucio declarado por el supervisor NO bloquea el trabajo: preservar sin tocar `.gitignore`, `node_modules/`, `.pnpm-store/`, `.turbo/`, `.next/`, `coverage/` ni cachés.
- Detenerse y pedir dirección únicamente si el archivo que la A.SPEC exige modificar ya contiene cambios ajenos no autorizados.
- Nunca limpiar, resetear, stashear, borrar ni normalizar cambios preexistentes.

## Mapeo Canónico ↔ Físico

| Canónico | Físico vivo actual |
| --- | --- |
| `repair_orders` / `orders` | `service_orders` |
| solicitudes públicas | `service_requests` |
| evidencias/documentos | `service_order_documents` |
| timeline/eventos | `service_order_events` |
| checklist legal | `service_order_checklists` |
| usuarios | `users` tenant-scoped actual |
| roles/membresías | `users.role`, `users.roles`, `tenant_id`, `sucursal_id` actuales |
| sucursal | `sucursales` / compatibilidad `branches` según repo |
| productos/refacciones | `products` |
| inventario por sucursal | `sucursal_inventory` |
| movimientos inventario | `inventory_movements` |
| auditoría | `audit_logs` |
