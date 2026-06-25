# T16 PACKET PARA GPT-5.5

## 1. Objetivo

Definir pruebas E2E reales para flujos criticos ya construidos, ahora que T18 aporta health, dependency health y `x-request-id`. T16 debe cubrir smoke/API primero y UI E2E solo si hay datos de prueba y autorizacion explicita. No debe tocar produccion destructivamente ni instalar dependencias sin decision.

## 2. Estado Git

- Rama actual: `## main...origin/main`.
- Cambios locales antes de crear el packet: ninguno.
- Archivo creado por esta tarea: `docs/ai-packets/T16-packet.md`.

Ultimos 30 commits:

```text
9322ca6 feat(t18): add observability health and request ids
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
07a539d feat(public): refresh SaaS landing surfaces
ef8db74 feat(public): unify tenant surfaces
c9dfbd2 feat(clientes): refresh tenant landing surfaces
391d31f feat(clientes): unify portal visual system
```

## 3. Que dice la documentacion sobre T16

- `docs/specs/implementation_order.md`: T16 va despues de T18, como pruebas robustas con todo el ciclo base construido.
- `docs/specs/dependencies.md`: T16 depende de flujos criticos y T18; desbloquea estabilidad para releases.
- `docs/specs/dependencies.md`: T18 debe existir antes de T16 para diagnosticar fallas.
- `docs/specs/spec_04_plataforma.md`: T16 debe garantizar que no haya regresiones en recepcion, caja y portal.
- `docs/implementation-results/T18-result.md`: T18 agrego `/health/dependencies`, `x-request-id`, logs seguros y recomienda seguir con T16 packet.
- `docs/canonical/analisis_destructivo_fixi.md`: advierte riesgo alto por pruebas E2E tardias; confirma que T16 debe reducir regresiones.

## 4. Dependencias previas

- T00: T16 debe respetar mapeo canonico/fisico y no renombrar tablas.
- T04: flujos de escritura deben dejar auditoria; pruebas deben verificar `request_id` cuando aplique.
- T11: autorizacion publica por token debe probar aceptacion/rechazo sin exponer tokens completos.
- T12: portal cliente por `public_token` debe probar documentos/timeline sin PII interna.
- T13: WhatsApp es draft/manual; T16 no debe enviar mensajes reales.
- T14: `work_logs` debe probar inicio/pausa/reanudar/cierre solo en entorno test.
- T15: reportes de productividad deben probar lectura read-only y scope.
- T18: health, dependency health y `x-request-id` son base para diagnostico de fallas E2E.

## 5. Estado real del repo

- Playwright existe como devDependency root: `package.json` tiene `playwright`.
- No se encontro Cypress/Vitest/Jest configurado.
- `apps/api/package.json` tiene tests con Node test runner:
  - `test:breaking`
  - `test:orders-checklist`
  - `test:orders-serial`
  - `test:inventory`
  - `test:evidence`
- Apps disponibles: `apps/api`, `apps/web-admin`, `apps/web-clientes`, `apps/web-public`, `apps/mobile`.
- Web apps tienen `dev`, `build`, `start`, `lint`, `typecheck`; no tienen script E2E.
- Root tiene `build`, `dev`, `lint`, `typecheck`; no tiene script E2E.
- T18 health actual: `/health`, `/healthz`, `/api/health`.
- T18 dependency health: `/health/dependencies`, `/api/health/dependencies`.
- Existe `scripts/validate-e2e-public-flow.sh` con curl para `/api/health`, landing publica y settings con token opcional.
- Existe `scripts/create-test-user.js`, requiere `SUPABASE_SERVICE_ROLE_KEY`; no debe usarse contra produccion sin autorizacion.
- Limitacion local: algunas pruebas API arrancan `pnpm --dir apps/api dev`; en esta terminal `node/pnpm` pueden requerir PATH del runtime de Codex.

## 6. Flujos criticos candidatos para E2E

- P0 health API
  - Objetivo: `/health`, `/healthz`, `/api/health` responden 200.
  - App/API: API.
  - Datos: ninguno.
  - Riesgo: bajo.
  - Tipo: smoke.
- P0 health dependencies
  - Objetivo: `/health/dependencies` y `/api/health/dependencies` devuelven ok/degraded saneado y `requestId`.
  - App/API: API/Supabase.
  - Datos: env Supabase test.
  - Riesgo: medio por dependencia remota.
  - Tipo: smoke/integration.
- P0 auth/login admin
  - Objetivo: login con usuario test y `/api/auth/me`.
  - App/API: web-admin/API.
  - Datos: tenant, usuario, token o credenciales test.
  - Riesgo: alto por secretos/login Google.
  - Tipo: integration primero; E2E visual despues.
- P1 onboarding/tenant
  - Objetivo: registro/configuracion basica de tenant sin contaminar produccion.
  - App/API: web-public/API.
  - Datos: email y tenant efimeros.
  - Riesgo: alto por estado persistente.
  - Tipo: integration/E2E visual solo en sandbox.
- P0 crear orden
  - Objetivo: crear orden con tenant/auth/sucursal validos.
  - App/API: API/web-admin.
  - Datos: customer, sucursal, auth token.
  - Riesgo: medio.
  - Tipo: integration.
- P0 checklist legal
  - Objetivo: validar campos obligatorios T01 y auditoria.
  - App/API: API.
  - Datos: orden test.
  - Riesgo: medio.
  - Tipo: integration; ya hay `test:orders-checklist`.
- P1 evidencia/documentos
  - Objetivo: visibilidad cliente y metadatos seguros.
  - App/API: API/web-clientes.
  - Datos: orden con documento visible/no visible.
  - Riesgo: alto por storage/PII.
  - Tipo: integration; visual posterior.
- P0 autorizacion publica T11
  - Objetivo: GET/POST authorization por `public_token`, aceptar/rechazar sin filtrar token completo.
  - App/API: public API.
  - Datos: orden con public token y monto estimado.
  - Riesgo: alto por autorizacion legal.
  - Tipo: integration.
- P0 portal cliente T12
  - Objetivo: portal por token, documentos visibles, timeline publico, fallback folio si aplica.
  - App/API: web-clientes/public API.
  - Datos: orden con public token.
  - Riesgo: alto por privacidad.
  - Tipo: smoke + E2E visual minimo.
- P1 WhatsApp draft manual T13
  - Objetivo: crear borrador wa.me sin enviar mensaje real.
  - App/API: API/web-admin.
  - Datos: orden/customer con telefono y consentimiento.
  - Riesgo: medio.
  - Tipo: integration.
- P1 work logs T14
  - Objetivo: start/pause/resume/stop y duracion consistente.
  - App/API: API/web-admin.
  - Datos: orden/tecnico test.
  - Riesgo: medio por tiempos.
  - Tipo: integration con reloj tolerante.
- P1 reports productivity T15
  - Objetivo: `GET /reports/productivity` read-only, scope y filtros.
  - App/API: API.
  - Datos: work_logs test.
  - Riesgo: bajo-medio.
  - Tipo: integration/smoke.
- P1 pagos/refunds T05/T06
  - Objetivo: pago y reembolso no destructivo en tenant test.
  - App/API: API/web-admin.
  - Datos: orden test y caja test.
  - Riesgo: alto por dinero/caja.
  - Tipo: integration solo sandbox.
- P1 inventario/reservas T07/T08
  - Objetivo: reservar, liberar, consumir sin stock negativo.
  - App/API: API.
  - Datos: product/sucursal/orden test.
  - Riesgo: alto por stock persistente.
  - Tipo: integration; ya hay `test:inventory` para RPC.
- P1 warranties T10
  - Objetivo: crear claim, cambiar status, summary sin tocar inventario/finanzas.
  - App/API: API.
  - Datos: orden con garantia.
  - Riesgo: medio.
  - Tipo: integration.

## 7. Opciones tecnicas para T16

### Opcion A - Smoke/API tests minimos

- Ventajas: usa Node test/curl existente, bajo riesgo, compatible con T18.
- Riesgos: poca cobertura visual.
- Requiere dependencia nueva: no.
- Modifica package files: no necesariamente.
- Requiere datos seed: minimo.
- Compatibilidad T18: alta, usa health y `x-request-id`.

### Opcion B - Playwright E2E admin minimo

- Ventajas: root ya tiene Playwright; cubre login/portal visual.
- Riesgos: flakiness, puertos, browser install, datos UI.
- Requiere dependencia nueva: no si Playwright root basta.
- Modifica package files: solo si GPT-5.5 autoriza script/config.
- Requiere datos seed: si.
- Compatibilidad T18: buena para diagnostico por request ids.

### Opcion C - Tests hibridos API + UI

- Ventajas: mejor cobertura de flujos criticos.
- Riesgos: mayor tiempo, mas datos, mas fallas ambientales.
- Requiere dependencia nueva: no necesariamente.
- Modifica package files: probablemente.
- Requiere datos seed: si.
- Compatibilidad T18: alta, pero requiere runbook claro.

### Opcion D - No recomendado

- E2E completo de todos los modulos de golpe.
- Ventajas: cobertura amplia.
- Riesgos: demasiado scope, flakiness, costo, datos productivos, bloqueo de releases.
- Requiere dependencia nueva: posible.
- Modifica package files: si.
- Requiere datos seed: si, complejo.
- Compatibilidad T18: demasiadas senales para una primera etapa.

## 8. Datos de prueba y ambiente

- No se encontro seed unico completo para T16.
- Tests existentes dependen de variables como `*_TESTS_TENANT_ID`, `*_TESTS_TENANT_SLUG`, `*_TESTS_AUTH_TOKEN`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
- `.env.example` documenta `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `API_URL`, `NEXT_PUBLIC_DEV_AUTH_TOKEN` y tenant defaults demo.
- Evitar produccion: usar proyecto Supabase test/staging y tenant dedicado.
- Limpieza: preferir datos con prefijo `e2e_` y cleanup por IDs creados; no borrar datos amplios por tenant.
- No ejecutar `supabase db push`; tests deben operar contra esquema ya desplegado.
- No imprimir secretos; logs deben mostrar solo ultimos 4 caracteres de tokens si fuera necesario.

## 9. Reglas de seguridad para T16

- No usar produccion destructivamente.
- No imprimir secretos ni tokens completos.
- No usar cliente real ni datos reales.
- No crear pagos reales ni llamar proveedores de pago reales.
- No mandar WhatsApp real; solo draft/wa.me.
- No tocar caja real.
- No mutar inventario real salvo entorno test.
- No depender de sleeps fragiles; usar polling con timeout.
- Registrar y reportar `x-request-id` en fallas.
- Preservar `/healthz` superficial.
- Usar tenant/sucursal/orden test dedicados.
- No modificar migraciones remotas.

## 10. Riesgos reales

- Datos productivos si se usan env vars equivocadas.
- Tests flakey por Next dev server, API dev server o Supabase remoto.
- Ausencia de seed completo.
- Login Google no apto para E2E estable sin estrategia.
- Dependencia de Supabase remoto y rate limits.
- Costos si se tocan proveedores externos.
- Estados persistentes de orden/inventario/caja.
- UI aun cambiante en web-admin/web-clientes.
- Migraciones remotas desincronizadas.
- Service role en tests puede saltarse permisos si no se separan pruebas API autenticadas.

## 11. Preguntas para GPT-5.5

1. ¿T16 primera entrega debe ser solo smoke/API o incluir Playwright UI minimo?
2. ¿Se autoriza modificar `package.json` para agregar scripts T16 o se usa shell script sin package changes?
3. ¿Que ambiente/tenant de prueba queda autorizado y con que variables sin secretos?
4. ¿Se permite crear/limpiar datos test via service role o solo usar fixtures preexistentes?
5. ¿Que flujos son P0 obligatorios para aceptar T16 MVP?

## 12. Lo que GPT-5.5 debe devolver

- T16 WORKPACK cerrado.
- Decision de alcance.
- Archivos autorizados.
- Si se permite instalar dependencia o modificar package files.
- Scripts exactos.
- Tests exactos.
- Datos de prueba y estrategia de cleanup.
- Variables requeridas sin secretos.
- Comandos de validacion.
- Rollback.
- Criterios de aceptacion.

## 13. Recomendacion del recolector

Implementar T16 en fase 1 como smoke/API tests minimos sin dependencias nuevas: health, dependency health, request-id, portal publico por token, autorizacion publica y un flujo autenticado read-only/productivity. Dejar Playwright UI para una fase 2 si GPT-5.5 autoriza datos seed y scripts package.
