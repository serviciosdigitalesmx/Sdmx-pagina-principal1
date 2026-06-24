# T09 IMPLEMENTATION RESULT

## 1. Archivos modificados
- `apps/api/src/controllers/orders.ts`
- `apps/api/src/routes/orders.ts`
- `supabase/migrations/20260624155000_t09_device_history.sql`
- `docs/implementation-bundles/T09/README.md`
- `docs/implementation-bundles/T09/verify.sh`
- `docs/implementation-results/T09-result.md`

## 2. Migración creada
- Índice funcional aditivo sobre `service_orders` por `tenant_id + lower(btrim(serial_number))`.
- RPC de solo lectura `public.find_device_history_by_serial(...)`.
- `security definer` con `set search_path = public`.

## 3. Endpoint agregado
- `GET /orders/device-history?serialNumber=<serial>&limit=50`
- Ruta colocada antes de `/:id`.

## 4. Comparación de serial
- Comparación case-insensitive + trim.
- Contrato normalizado: `lower(btrim(serial_number)) = lower(btrim(input))`.

## 5. Auditoría
- La lectura no quedó auditada en este ticket.
- No se añadió `writeCriticalAuditLog`.

## 6. Datos incluidos en historial
- Incluye órdenes base desde `service_orders`.
- Agrega timeline desde `service_order_status_history`.
- Agrega eventos desde `service_order_events`.
- Agrega documentos como metadata segura desde `service_order_documents`.
- Agrega consumos de inventario desde `inventory_movements` con `movement_type = 'service_order_consumed'`.
- No genera signed URLs.

## 7. Typecheck
- OK.

## 8. Verify
- OK.

## 9. Diff stat
- `apps/api/src/controllers/orders.ts | 350 ++++++++++++++++++++++++++++++++++++ -`
- `apps/api/src/routes/orders.ts | 3 +-`

## 10. Estado Git
- El trabajo sigue sin commit.
- El estado queda con archivos nuevos/modificados locales hasta que se publique el ticket.

## 11. Riesgos restantes
- Dependencia del shape actual de `service_orders`.
- Si el serial se ingresa con variantes extrañas, la comparación depende de `trim + lower`.
- El endpoint es interno y no debe exponerse en portal público.

## 12. Recomendación
- LISTO PARA REVIEW
