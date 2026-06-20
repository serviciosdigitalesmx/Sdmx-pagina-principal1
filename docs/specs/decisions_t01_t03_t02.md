# Decisions T01 / T03 / T02

Fecha de resolución: 2026-06-20

Alcance:

- T01 Checklist legal obligatorio de recepción.
- T03 IMEI/Serie obligatorio configurable.
- T02 Consentimiento, retención y control de evidencias.

Este documento solo resuelve bloqueantes de diseño y compatibilidad. No implementa código.

## Evidencia Encontrada En El Repo

### Mapa real de órdenes y checklist

- [apps/api/src/controllers/orders.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/controllers/orders.ts) usa `service_orders` como tabla operativa real de órdenes.
- [apps/api/src/controllers/orders.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/controllers/orders.ts) lee y escribe `service_order_checklists`.
- [supabase/migrations/20260424_baseline_schema.sql](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/supabase/migrations/20260424_baseline_schema.sql) define `service_orders` y `service_order_checklists`.
- [supabase/migrations/20260619100000_add_checklist_legal_fields_to_service_order_checklists.sql](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/supabase/migrations/20260619100000_add_checklist_legal_fields_to_service_order_checklists.sql) agrega los campos legales del checklist.

### Mapa real de clientes

- [supabase/migrations/20260424_baseline_schema.sql](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/supabase/migrations/20260424_baseline_schema.sql) define `customers`.
- [apps/api/src/controllers/catalogs.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/controllers/catalogs.ts) crea y actualiza clientes con `name`, `phone`, `email`.
- [apps/api/src/routes/customers.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/routes/customers.ts) expone `GET /customers`, `POST /customers`, `PUT /customers/:id`, `GET /customers/:id/history`.

### Mapa real de evidencias y documentos

- [supabase/migrations/20260523190000_order_documents_events.sql](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/supabase/migrations/20260523190000_order_documents_events.sql) define `service_order_documents` y `service_order_events`.
- [apps/api/src/controllers/orders.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/controllers/orders.ts) inserta filas en `service_order_documents` y también appendea evidencia en `service_orders.evidence_metadata`.
- [apps/api/src/services/evidence-adapter.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/services/evidence-adapter.ts) todavía soporta modo `legacy` leyendo `service_orders.evidence_metadata`.
- [apps/api/src/controllers/public.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/controllers/public.ts) mezcla documentos normalizados con `evidence_metadata` en portal público.

### Mapa real de configuración del tenant

- [supabase/migrations/20260527050000_tenant_field_definitions_phase2.sql](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/supabase/migrations/20260527050000_tenant_field_definitions_phase2.sql) define `tenant_field_definitions`.
- [apps/api/src/services/tenant-config.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/services/tenant-config.ts) carga `fieldDefinitions` desde `tenant_field_definitions`.
- [apps/api/src/services/tenant-config.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/services/tenant-config.ts) ya tiene seed para `service_order_checklists` y `service_requests.serial_number`.

### Ausencia real de `device_categories`

- No existe ninguna migración que cree `device_categories`.
- No existe ningún controlador, servicio o UI que lea `device_categories`.
- La obligatoriedad de IMEI/serie no puede depender hoy de `device_categories` porque esa tabla no existe en el repo.

## Dominio Canónico Vs Tablas Físicas Actuales

### Mapa oficial

| Dominio canónico | Tabla física actual | Estrategia de compatibilidad |
| --- | --- | --- |
| `repair_orders` | `service_orders` | Mantener `service_orders` como tabla física hasta una migración posterior explícita. No renombrar ahora. |
| `repair_order_checklists` | `service_order_checklists` | Mantener tabla física actual. Usar los campos legales ya agregados. |
| `customers` | `customers` | Coincide en nombre; ampliar contrato sin romper campos actuales. |
| `devices` | Sin tabla física propia | El dispositivo vive hoy inline en `service_orders.device_info`, `service_orders.serial_number` y en `service_requests` metadata/campos. No crear renombrado ahora. |
| `repair_order_documents` | `service_order_documents` | Usar `service_order_documents` como tabla física primaria para evidencia/documentos nuevos. |
| `repair_order_events` | `service_order_events` | Usar `service_order_events` como tabla física primaria para eventos/timeline. |
| `quotations` | Sin tabla física propia en este repo | El flujo cercano hoy vive como `service_requests` y cotización pública/lead intake. No forzar renombrado en este bloque. |
| `quotation_items` | Sin tabla física propia | No existe todavía en el repo. Fuera del bloque T01/T03/T02. |

### Estrategia de compatibilidad

- No renombrar tablas físicas.
- Mantener `service_orders` y `service_order_checklists` como compatibilidad operativa.
- Mantener `service_orders.evidence_metadata` solo como puente legado temporal.
- Usar `service_order_documents` y `service_order_events` como fuentes normalizadas nuevas.
- No introducir `device_categories` como dependencia del primer bloque porque no existe físicamente.

## Decisión Final Por Bloqueante

### 1. Dominio vs tablas físicas

#### Decisión

- Órdenes: dominio canónico `repair_orders` mapea a `service_orders`.
- Checklist: dominio canónico `repair_order_checklists` mapea a `service_order_checklists`.
- Clientes: dominio canónico `customers` mapea a `customers`.
- Dispositivos: dominio canónico `devices` no tiene tabla física propia todavía; el dato está inline.
- Documentos: dominio canónico `repair_order_documents` mapea a `service_order_documents`.
- Eventos: dominio canónico `repair_order_events` mapea a `service_order_events`.
- Cotizaciones: dominio canónico `quotations` no tiene tabla física en este repo; el flujo actual más cercano es `service_requests`.

#### Bloqueante resuelto

- Sí. El primer bloque puede implementarse sin renombrar tablas, usando compatibilidad explícita.

### 2. Evidencias T02

#### Decisión

- La fuente primaria de evidencia nueva será `service_order_documents` para archivos/documentos y `service_order_events` para eventos de timeline.
- `service_orders.evidence_metadata` seguirá como puente temporal de lectura/escritura solo mientras existan consumidores legacy.
- La evidencia nueva no debe escribirse solo en `evidence_metadata`.

#### Qué contiene `service_orders.evidence_metadata`

- Arreglo JSON de objetos `EvidenceEntry`.
- Tipos actuales:
- `kind: 'document'` con `id`, `file_name`, `file_type`, `public_url`, `mime_type`, `created_at`.
- `kind: 'event'` con `id`, `event_type`, `previous_status`, `new_status`, `note`, `actor_name`, `created_at`.

#### Qué se escribe en cada lado

- En cada nuevo archivo subido: insertar fila en `service_order_documents` y, además, append a `service_orders.evidence_metadata` mientras exista puente.
- En cada evento/note relevante: insertar fila en `service_order_events` y, además, append a `service_orders.evidence_metadata` mientras exista puente.

#### Cuándo se elimina el puente

- Cuando todos los consumidores de detalle/portal dejen de leer `service_orders.evidence_metadata` y lean exclusivamente `service_order_documents` + `service_order_events`.
- El puente debe retirarse en una limpieza posterior, no en el primer bloque.

#### Bloqueante resuelto

- Sí. Hay una sola fuente primaria para evidencia nueva: tablas normalizadas.

### 3. Consentimiento T02

#### Decisión

- El consentimiento no debe mezclarse con `PUT /customers/:id`.
- Debe existir un endpoint específico de consentimiento para evitar mezclar identidad/contacto con tratamiento legal de datos.

#### Contrato final propuesto

- `PATCH /customers/:id/consent`

#### Payload final

```json
{
  "dataConsentStatus": "pending | accepted | rejected | revoked",
  "dataConsentDate": "ISO-8601 datetime | null",
  "dataConsentVersion": "string"
}
```

#### Validaciones

- `dataConsentStatus` obligatorio.
- `dataConsentDate` obligatorio cuando el estado sea `accepted` o `revoked`.
- `dataConsentVersion` obligatorio cuando el estado sea `accepted`.
- El customer debe pertenecer al tenant activo.
- El estado debe ser uno de los valores canónicos.

#### Permisos

- Owner y manager administran consentimiento.
- Recepción puede crear/editar cliente de contacto, pero no debería sobreescribir consentimiento legal salvo permiso explícito.

#### Compatibilidad

- `PUT /customers/:id` se conserva para nombre/teléfono/email.
- El nuevo endpoint es aditivo y no rompe clientes existentes.

#### Bloqueante resuelto

- Sí. Consentimiento queda separado y con contrato claro.

### 4. IMEI/Serie T03

#### Decisión

- La fuente de verdad de obligatoriedad para el primer bloque será `tenant_field_definitions`.
- `device_categories` no puede ser fuente de verdad en este repo porque no existe físicamente.
- No se deben duplicar reglas de obligatoriedad en frontend.

#### Fuente de verdad exacta

- `tenant_field_definitions` con `entity` igual a:
- `service_requests` para la cotización/lead pública.
- `service_orders` para la recepción interna.
- El campo clave relevante es `serial_number`.
- El `required` del field definition es la señal oficial.
- El seed visible en el repo solo confirma `service_requests.serial_number`; la definición equivalente para `service_orders.serial_number` debe existir antes de cerrar T03.

#### Precedencia exacta

1. Regla tenant en `tenant_field_definitions` es obligatoria y manda.
2. Regla de categoría no aplica en el primer bloque porque no hay `device_categories`.
3. Excepción manual solo vale si el tenant la permite explícitamente en `validation` o metadata de campo; si no, no exime.

#### Manual exception

- No se debe usar como bypass silencioso.
- Debe quedar registrada como motivo explícito.

#### Bloqueante resuelto

- Sí, para el primer bloque la obligatoriedad puede resolverse con tenant field definitions sin esperar `device_categories`.

## Contratos API Finales

### T01

- `POST /orders`
- `GET /orders/:id/checklist`
- `PUT /orders/:id/checklist`

### T02

- `POST /orders/:id/attachments`
- `GET /orders/:id`
- `GET /public/tenant/:slug/orders/:folio`
- `PATCH /customers/:id/consent`

### T03

- `POST /orders`
- `POST /api/public/quotes`
- `GET /tenant/:tenantSlug/settings`

## Migraciones Necesarias

### T01

- Ninguna nueva si `service_order_checklists` con campos legales ya está desplegada.
- Si falta en un ambiente, aplicar `add_checklist_legal_fields_to_service_order_checklists`.

### T02

- `add_customer_consent_fields` para `customers`.
- `add_evidence_visibility_retention` para `service_order_documents` y, si se decide, campos auxiliares para normalización de evidencia.
- Índices por tenant/orden/visibilidad/retención.

### T03

- No requiere nueva tabla.
- Solo requiere asegurar que la definición de campos tenga `serial_number` en `service_requests` y `service_orders`.
- Si falta seed en tenants, agregarlo como migración de datos o actualización de template.

## Archivos Exactos A Modificar

### T01

- [apps/api/src/controllers/orders.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/controllers/orders.ts)
- [apps/api/src/routes/orders.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/routes/orders.ts)
- [apps/api/src/services/tenant-config.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/services/tenant-config.ts)
- [apps/api/src/services/audit.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/services/audit.ts)
- [apps/api/src/middleware/requestId.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/middleware/requestId.ts)
- [apps/api/src/types/express.d.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/types/express.d.ts)
- [apps/web-admin/src/app/dashboard/operativo/page.tsx](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/app/dashboard/operativo/page.tsx)
- [apps/web-admin/src/components/operativo/step-2.tsx](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/components/operativo/step-2.tsx)
- [apps/web-admin/src/components/operativo/step-3.tsx](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/components/operativo/step-3.tsx)
- [apps/web-admin/src/components/dashboard/orders/order-intake-modal.tsx](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/components/dashboard/orders/order-intake-modal.tsx)
- [apps/web-admin/src/components/dashboard/orders/order-detail-drawer.tsx](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/components/dashboard/orders/order-detail-drawer.tsx)
- [apps/web-admin/src/components/tecnico/order-modal.tsx](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/components/tecnico/order-modal.tsx)
- [apps/web-admin/src/services/apiGateway.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/services/apiGateway.ts)
- [apps/web-admin/src/services/orders/ordersService.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/services/orders/ordersService.ts)
- [apps/web-admin/src/types.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/types.ts)
- [packages/types/index.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/packages/types/index.ts)

### T02

- [apps/api/src/controllers/orders.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/controllers/orders.ts)
- [apps/api/src/controllers/catalogs.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/controllers/catalogs.ts)
- [apps/api/src/controllers/public.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/controllers/public.ts)
- [apps/api/src/routes/customers.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/routes/customers.ts)
- [apps/api/src/routes/orders.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/routes/orders.ts)
- [apps/api/src/services/evidence-adapter.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/services/evidence-adapter.ts)
- [apps/api/src/services/audit.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/services/audit.ts)
- [apps/api/src/services/tenant-config.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/services/tenant-config.ts)
- [apps/web-admin/src/components/dashboard/orders/order-detail-drawer.tsx](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/components/dashboard/orders/order-detail-drawer.tsx)
- [apps/web-admin/src/components/dashboard/orders/order-intake-modal.tsx](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/components/dashboard/orders/order-intake-modal.tsx)
- [apps/web-admin/src/components/tecnico/order-modal.tsx](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/components/tecnico/order-modal.tsx)
- [apps/web-admin/src/components/clientes/customer-modal.tsx](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/components/clientes/customer-modal.tsx)
- [apps/web-admin/src/services/apiGateway.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/services/apiGateway.ts)
- [apps/web-admin/src/types.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/types.ts)
- [apps/web-clientes/src/components/portal/evidence-gallery.tsx](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-clientes/src/components/portal/evidence-gallery.tsx)
- [apps/web-clientes/src/components/portal/document-list.tsx](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-clientes/src/components/portal/document-list.tsx)
- [apps/web-clientes/src/lib/portal/portal-view.tsx](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-clientes/src/lib/portal/portal-view.tsx)
- [apps/web-clientes/src/lib/utils/normalizers.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-clientes/src/lib/utils/normalizers.ts)
- [apps/web-clientes/src/lib/types.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-clientes/src/lib/types.ts)
- [apps/web-clientes/src/lib/api/orders.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-clientes/src/lib/api/orders.ts)
- [apps/web-clientes/src/lib/api/leads.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-clientes/src/lib/api/leads.ts)
- [apps/web-clientes/src/lib/lead/lead-form.tsx](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-clientes/src/lib/lead/lead-form.tsx)
- [apps/web-public/src/app/portal/[folio]/page.tsx](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-public/src/app/portal/[folio]/page.tsx)
- [apps/web-public/src/components/public-portal-lookup.tsx](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-public/src/components/public-portal-lookup.tsx)
- [packages/types/index.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/packages/types/index.ts)

### T03

- [apps/api/src/controllers/orders.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/controllers/orders.ts)
- [apps/api/src/controllers/public.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/controllers/public.ts)
- [apps/api/src/controllers/meta.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/controllers/meta.ts)
- [apps/api/src/routes/auth.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/routes/auth.ts)
- [apps/api/src/routes/public.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/routes/public.ts)
- [apps/api/src/services/tenant-config.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/api/src/services/tenant-config.ts)
- [apps/web-admin/src/app/dashboard/operativo/page.tsx](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/app/dashboard/operativo/page.tsx)
- [apps/web-admin/src/components/operativo/step-2.tsx](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/components/operativo/step-2.tsx)
- [apps/web-admin/src/components/dashboard/orders/order-intake-modal.tsx](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/components/dashboard/orders/order-intake-modal.tsx)
- [apps/web-admin/src/components/dashboard/orders/order-detail-drawer.tsx](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/components/dashboard/orders/order-detail-drawer.tsx)
- [apps/web-admin/src/components/tecnico/order-modal.tsx](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/components/tecnico/order-modal.tsx)
- [apps/web-admin/src/services/apiGateway.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/services/apiGateway.ts)
- [apps/web-admin/src/types.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-admin/src/types.ts)
- [apps/web-clientes/src/lib/lead/lead-form.tsx](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-clientes/src/lib/lead/lead-form.tsx)
- [apps/web-clientes/src/lib/api/leads.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/apps/web-clientes/src/lib/api/leads.ts)
- [packages/types/index.ts](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/packages/types/index.ts)

## Pruebas Requeridas

### T01

- Crear orden con checklist completo.
- Crear orden sin checklist completo y validar bloqueo cuando el tenant lo exige.
- Obtener checklist con `GET /orders/:id/checklist`.
- Actualizar checklist con `PUT /orders/:id/checklist`.
- Verificar que la auditoría se escriba.

### T02

- Crear/actualizar cliente y luego consentimiento con permisos válidos.
- Verificar que el portal público no exponga evidencia interna.
- Verificar que `service_order_documents` y `service_order_events` sean leídos por el API.
- Verificar que `service_orders.evidence_metadata` siga como puente mientras exista.

### T03

- Orden interna sin serial/IMEI cuando el tenant lo exige debe fallar.
- Cotización pública sin serial/IMEI cuando el tenant lo exige debe fallar.
- Verificar que la obligatoriedad proviene de `tenant_field_definitions`.
- Verificar que no haya reglas duplicadas en frontend.

## Rollback

### T01

- Revertir la obligatoriedad del checklist en `reception_config`.
- Mantener columnas y filas ya creadas.
- No borrar evidencias ni checklists existentes.

### T02

- Desactivar la visibilidad pública de evidencia.
- Mantener `service_order_documents` y `service_order_events` como histórico.
- Mantener `customers.data_consent_*` aunque el flujo se apague temporalmente.
- Conservar `service_orders.evidence_metadata` hasta retirar el puente de forma controlada.

### T03

- Volver `required=false` en las definiciones de campo del tenant.
- Mantener los valores capturados.
- No borrar `serial_number` ni datos asociados.

## Definition Of Done

### T01

- La recepción no se completa sin checklist legal cuando el tenant lo exige.
- El checklist queda visible y editable por roles autorizados.
- La auditoría se escribe.
- El flujo sigue funcionando para tenants sin obligatoriedad.

### T02

- Evidencia nueva queda escrita en tablas normalizadas.
- El portal público no expone evidencia interna.
- El consentimiento se gestiona con endpoint propio.
- El puente legacy permanece solo el tiempo estrictamente necesario.

### T03

- La obligatoriedad del serial/IMEI queda gobernada por `tenant_field_definitions`.
- La recepción interna y la cotización pública respetan la misma regla.
- No hay duplicación de lógica en frontend.
- Los tenants sin regla obligatoria siguen operando.

## Veredicto

**LISTO PARA IMPLEMENTAR T01/T03/T02**

Motivo:

- Las tablas físicas reales están identificadas.
- La compatibilidad legacy está acotada.
- La fuente de evidencia nueva quedó definida.
- El consentimiento quedó aislado en un endpoint específico.
- T03 no depende de `device_categories` porque hoy no existe en el esquema real.
