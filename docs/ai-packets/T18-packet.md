# T18 PACKET PARA GPT-5.5

## 1. Ticket recomendado

SIGUE T18 PACKET.

T18 sigue despues de T15 porque `docs/specs/implementation_order.md` coloca T18 Observabilidad y alertas en la posicion 16, antes de T16. `docs/specs/dependencies.md` confirma que T16 depende de T18: observabilidad y monitoreo temprano deben existir antes de pruebas E2E formales.

## 2. Evidencia de orden

- `docs/specs/implementation_order.md`: orden definitivo: T15 Reportes operativos confiables, luego T18 Observabilidad y alertas, luego T16 Pruebas E2E.
- `docs/specs/dependencies.md`: T18 depende de flujos criticos y T04; T16 depende de flujos criticos y T18.
- `docs/specs/dependencies.md`: nota explicita "T18 antes de T16".
- `docs/specs/spec_04_plataforma.md`: T18 captura y reacciona a excepciones y anomalias; es independiente del modelo de datos de dominio.
- `docs/specs/decisions_t17_t18_t19_t20.md`: T18 esta listo para implementar; no requiere cambio de esquema obligatorio para MVP.
- `docs/implementation-results/T15-result.md`: T15 no implemento UI ni T16; recomienda seguir con T18/T16 segun orden canonico.

## 3. Objetivo del ticket

Agregar observabilidad minima para produccion temprana: health basico y health de dependencias, errores correlacionables por `request_id`, logs sin secretos, y criterios/artefactos de alerta para API caida, 5xx, billing, auditoria y jobs fallidos existentes.

## 4. Estado Git

- Rama actual: `## main...origin/main`.
- Cambios locales antes de crear este packet: ninguno detectado.
- Archivo creado por esta tarea: `docs/ai-packets/T18-packet.md`.

Ultimos 25 commits:

```text
be8bcae feat(t15): add productivity reports
cfdfe8c feat(t14): add work logs and commission rules
6e5b565 feat(t13): add whatsapp message queue drafts
1f95c27 feat(t12): add secure customer portal by token
317ce2b feat(t11): add online order authorizations
50ffcf7 feat(t10): add service order warranty claims
312b8b5 feat(t09): add device history by serial
43d962e feat(t08): consume reserved inventory atomically
96e8835 feat(t07): add inventory reservations
266c362 docs: define T00 canonical foundations strategy
5912caf chore: add supabase cli dependency
6935a29 feat(t02): add consent and evidence visibility controls
343b0bb feat(t06): add order payment refunds
327c375 feat(t05): register order payments
0c7fef5 feat(t03): enforce configurable serial number
9afcada feat(t01): enforce legal intake checklist
62d9c78 docs: finalize Fixi implementation decisions
67b8e4f docs: add technical design and repo reality for T17 to T20
9f554e7 docs: add technical design and repo reality for T13, T14 and T15
7c71294 chore(docs): finalize T11 T12 technical decisions
db6a248 docs: add technical design and repo reality for T11 and T12
d259a3a docs: align T05 T06 with real finance model
9f1b05b docs: finalize T01 T03 T02 implementation decisions
9e1e39d docs: add approved Fixi technical specifications
a0c582a docs: add canonical Fixi specifications
```

## 5. Dependencias previas

- T00: mantiene mapeo canonico-fisico; T18 no debe renombrar tablas ni reabrir fundaciones.
- T04: auditoria critica ya rige escrituras; T18 debe observar fallas de auditoria, no cambiar append-only.
- T13: `message_queue` existe; jobs fallidos aplican si se consideran drafts/cola de WhatsApp.
- T14: `work_logs` existe; T18 no debe modificar productividad ni comisiones.
- T15: reportes read-only ya publicados; T18 debe observar, no cambiar reportes.
- T05/T06: billing/finanzas ya existen; T18 debe detectar fallos de webhook/billing sin tocar caja/pagos.

## 6. Estado real del repo

- Health actual existe en `apps/api/src/index.ts`: rutas `/health`, `/healthz`, `/api/health`.
- `apps/api/src/controllers/meta.ts` implementa `getHealth` con `status`, `timestamp` y `service`.
- `apps/api/src/middleware/errorHandler.ts` registra `console.error('Unhandled error:', err)` y responde error/timestamp.
- Hay `request_id` parcial en flujos T07/T08/T10/T11, pero no middleware global de correlacion.
- Billing webhook existe en `apps/api/src/controllers/billing.ts` y `apps/api/src/services/billing.ts`.
- T13 `message_queue` existe con status `generated`, `opened_manual`, `cancelled`, `failed`.
- No se encontro `/metrics`.
- No se encontro tabla `operational_events`.
- No se encontro proveedor APM configurado.
- No se encontraron alertas configuradas en codigo.

## 7. Modelo físico real encontrado

- `audit_logs`
  - Confirmado en `supabase/migrations/20260530132000_security_backoffice_tables.sql`.
  - Columnas relevantes: `tenant_id`, `user_id`, `action`, `data_before`, `data_after`, `request_id`, `created_at`.
  - Riesgo: no usar como log voluminoso de requests; solo auditoria/eventos criticos.
- `message_queue`
  - Confirmado en `supabase/migrations/20260625070326_t13_message_queue.sql`.
  - Columnas relevantes: `tenant_id`, `service_order_id`, `status`, `template_key`, `idempotency_key`, `created_at`.
  - Riesgo: solo puede observar status `failed`; no inventar dispatcher/proveedor WhatsApp.
- `tenants`
  - Usado en muchos servicios para scope; T18 debe evitar exponer nombres, slugs o datos sensibles en health publico.
- `service_orders`, `work_logs`, finanzas e inventario`
  - Existen por tickets previos, pero T18 MVP no debe modificar su esquema ni su logica.
- `operational_events`
  - No existe; decisiones T18 dicen que es opcional posterior, no obligatorio para MVP.

## 8. Código real relacionado

- `apps/api/src/index.ts`
  - Registra rutas health y monta `errorHandler`.
  - Candidato a middleware global de `request_id` si GPT-5.5 lo autoriza.
- `apps/api/src/controllers/meta.ts`
  - Contiene `getHealth` superficial.
  - Candidato a separar health superficial vs dependencias.
- `apps/api/src/middleware/errorHandler.ts`
  - Maneja errores no controlados.
  - Candidato a incluir `request_id`, sanitizar respuesta y evitar filtrar stack.
- `apps/api/src/controllers/billing.ts`
  - Lee `x-request-id`/`x-correlation-id` para webhook MercadoPago.
  - Referencia para observabilidad de billing.
- `apps/api/src/services/billing.ts`
  - Escribe `audit_logs` best-effort para checkout/webhook.
  - Riesgo: `writeAuditLog` ignora error; T18 debe decidir como observar fallas sin romper T04.
- `apps/api/src/services/whatsapp-messages.ts`
  - Usa `message_queue`; status `failed` existe.
  - Referencia para jobs/cola T13, no para proveedor real.
- `apps/api/package.json`
  - Tiene `typecheck`, tests existentes y dependencias actuales; no hay SDK APM.

## 9. Opciones técnicas

### Opcion minima

- Mantener `/healthz` superficial 200.
- Agregar endpoint interno o query param para health de dependencias con Supabase query ligera.
- Agregar middleware global de `request_id` y header `x-request-id`.
- Mejorar `errorHandler` para log estructurado sin secretos.
- Documentar alertas externas Render/Vercel/Supabase sin proveedor nuevo.
- Ventajas: bajo riesgo, sin SQL, no bloquea operacion.
- Riesgos: alertas automaticas dependen de plataforma externa.
- Requiere SQL: no.
- Toca frontend: no.
- Toca backend: si.
- Toca dominios sensibles: billing/auditoria solo como observacion.

### Opcion completa

- Todo lo minimo.
- Agregar `/api/health/dependencies` protegido o no sensible.
- Agregar checks de Supabase, storage bucket critico si env existe y billing config minima.
- Agregar servicio de observabilidad central con logs estructurados.
- Agregar scripts de verificacion y docs de runbook.
- Ventajas: prepara T16 con mejor diagnostico.
- Riesgos: checks profundos pueden generar ruido o exponer detalles si no se sanea.
- Requiere SQL: no obligatorio.
- Toca frontend: no.
- Toca backend: si.
- Toca dominios sensibles: billing/storage/auditoria como checks sin payloads.

### Opcion que NO recomiendo

- Crear `operational_events`, `/metrics`, proveedor APM y alertas custom completas en una sola entrega.
- Ventajas: mas ambicioso.
- Riesgos: scope creep, migracion innecesaria, costo operativo, exposicion accidental de PII.
- Requiere SQL: probablemente si.
- Toca frontend: no necesariamente.
- Toca backend: si.
- Toca dominios sensibles: alto.

## 10. Reglas de seguridad

- No ejecutar `supabase db push`.
- No crear migracion salvo decision explicita de GPT-5.5.
- No tocar T16, T17, T19 ni T20.
- No modificar logica de caja, pagos, inventario, WhatsApp, PWA ni reportes.
- No exponer secretos, tokens, Authorization headers, public tokens completos, URLs internas completas, stack traces ni PII.
- Health publico debe ser seguro y superficial; checks profundos deben ser saneados o protegidos.
- Logs deben incluir `request_id` cuando sea posible.
- Fallas de auditoria critica deben ser visibles como alerta/incidente.
- Mantener `/health`, `/healthz`, `/api/health` compatibles.
- No usar `audit_logs` como log masivo de requests.

## 11. Riesgos reales

- Romper pingers/deploy si cambia semantica de `/healthz`.
- Exponer configuracion interna en health de dependencias.
- Duplicar o fragmentar `request_id` si cada controlador sigue generando uno propio.
- Ocultar errores criticos si `errorHandler` se vuelve demasiado generico.
- Generar falsos positivos de alerta si Supabase/storage tiene latencia temporal.
- T13 no tiene proveedor real ni dispatcher; "jobs fallidos" solo puede basarse en `message_queue.status = failed`.
- Billing webhook actualmente puede devolver 500 sin log estructurado suficiente.
- `writeAuditLog` de billing ignora errores; hay que decidir si T18 solo observa o cambia severidad.

## 12. Preguntas para GPT-5.5

1. ¿T18 MVP debe incluir solo backend health/logging o tambien runbook documental de alertas externas?
2. ¿El health de dependencias debe ser publico saneado o endpoint interno protegido?
3. ¿Se autoriza middleware global de `request_id` que responda header `x-request-id`?
4. ¿Se debe cambiar `writeAuditLog` de billing para reportar fallas visibles sin bloquear checkout/webhook?
5. ¿Se permite agregar checks de storage solo si `SUPABASE_ORDER_BUCKET` o `SUPABASE_BRANDING_BUCKET` estan configurados?

## 13. Lo que GPT-5.5 debe devolver

- WORKPACK cerrado para T18.
- Decision de alcance: minimo o completo.
- Archivos autorizados.
- SQL exacto si aplica, o confirmacion de no SQL.
- Endpoints exactos si aplica.
- Contratos request/response de health.
- Cambios UI si aplica, idealmente ninguno.
- Reglas de permisos para health profundo.
- Validaciones: typecheck, verify T18, curl health, simulacion error, checks Supabase/billing.
- Rollback: mantener health superficial, desactivar checks profundos por env var si fallan.
- Criterios de aceptacion.

## 14. Recomendación del recolector

Implementar T18 como backend minimo sin migracion: preservar health superficial, agregar health de dependencias saneado, correlacion global con `request_id`, logs estructurados seguros y bundle de verificacion/runbook de alertas. No elegir proveedor APM ni crear `operational_events` todavia.
