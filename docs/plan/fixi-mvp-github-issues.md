# Fixi MVP GitHub Issues

Fecha: 2026-06-16

Base:
- [docs/plan/fixi-mvp-execution-roadmap.md](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/docs/plan/fixi-mvp-execution-roadmap.md)
- [docs/BACKLOG_MVP_SDMX.md](/Users/jesusvilla/Desktop/Sdmx-pagina-principal/docs/BACKLOG_MVP_SDMX.md)

Objetivo:
convertir el MVP en issues accionables para ejecutar por fases sin mocks, sin hardcode y sin romper contratos reales.

---

## EPIC 1. Recepción y Seguimiento

### Issue 1.1 WhatsApp con link público de tracking

**Problema**
Hoy el flujo de WhatsApp no garantiza un enlace público de tracking funcional por tenant.

**Solución**
Generar el enlace público usando la URL real del tenant y embebirlo en el mensaje de WhatsApp.

**Criterios de aceptación**
- El mensaje contiene un enlace funcional.
- El enlace abre directamente la orden.
- El enlace muestra estado, timeline, evidencias públicas y PDF asociado.

**Impacto**
- Frontend: web-public / web-clientes
- Backend: API de tracking
- DB: lectura de ordenes, evidencias y tenant

### Issue 1.2 PDF de recepción real

**Problema**
La recepción necesita un PDF real, persistido y consultable.

**Solución**
Generar PDF al cerrar la recepción, guardar en Storage y asociarlo a la orden.

**Criterios de aceptación**
- El PDF se genera al finalizar la recepción.
- Se guarda en Storage.
- Se asocia a la orden.
- Se puede ver desde panel y portal.
- La acción UI pasa de "Descargar PDF" a "Ver PDF".

**Impacto**
- Frontend: panel y portal
- Backend: generación/serving del PDF
- DB/Storage: persistencia del archivo

### Issue 1.3 Evidencias end-to-end

**Problema**
El flujo de imágenes debe persistir y renderizarse de principio a fin.

**Solución**
Validar upload, persistencia, API y render frontend para taller y cliente.

**Criterios de aceptación**
- Upload funciona.
- Persistencia en BD o Storage.
- API devuelve evidencias.
- Frontend renderiza evidencias.

---

## EPIC 2. Tenant Public Frontend

### Issue 2.1 URL pública visible en Landing

**Problema**
El dueño no ve ni comparte de forma clara la URL pública del negocio.

**Solución**
Mostrar la URL pública dentro del módulo Landing con copiar/abrir.

**Criterios de aceptación**
- La URL pública se muestra en UI.
- Se puede copiar.
- Se puede abrir.

**Impacto**
- Frontend: web-admin landing settings
- Backend: lectura de config del tenant

### Issue 2.2 Frontend público completo del tenant

**Problema**
La experiencia pública del tenant no está completa o está fragmentada.

**Solución**
Renderizar landing comercial, información del negocio, servicios, cotizador, seguimiento, portal cliente y evidencias públicas.

**Criterios de aceptación**
- La URL pública funciona como frontend completo.
- El contenido viene de datos reales.

**Impacto**
- Frontend: web-public / web-clientes
- Backend: contratos públicos existentes

### Issue 2.3 Resolver Network Error / Failed to Fetch

**Problema**
Varias pantallas públicas presentan errores de red.

**Solución**
Auditar endpoints, JWT, tenant, middleware, CORS y variables de entorno.

**Criterios de aceptación**
- No existen `Network Error`.
- No existen `Failed to Fetch`.

**Impacto**
- Frontend: web-public / web-clientes
- Backend: API y middleware
- Infra: env vars y CORS

---

## EPIC 3. Panel Técnico

### Issue 3.1 Datos completos en ficha técnica

**Problema**
La ficha técnica no refleja toda la información capturada en recepción.

**Solución**
Completar la carga de datos reales de orden y dispositivo.

**Criterios de aceptación**
- La ficha técnica muestra la información completa.

**Impacto**
- Frontend: web-admin
- Backend: lectura de ordenes y detalle

### Issue 3.2 Edición de orden

**Problema**
No toda la información de la orden puede corregirse desde el panel adecuado.

**Solución**
Permitir edición de cliente, equipo, marca, modelo, serie, observaciones y diagnóstico.

**Criterios de aceptación**
- Los campos se pueden editar.
- El backend persiste los cambios.

**Impacto**
- Frontend: web-admin
- Backend: endpoints de update de orden

### Issue 3.3 Flujo correcto de Técnico

**Problema**
El técnico puede aterrizar en un dashboard administrativo en lugar de su panel.

**Solución**
Rutar al Panel Técnico con menú y permisos correctos.

**Criterios de aceptación**
- El técnico entra al panel correcto.
- No ve módulos administrativos.

**Impacto**
- Frontend: web-admin
- RBAC: módulo de permisos

### Issue 3.4 Dashboard técnico funcional

**Problema**
El dashboard técnico debe operar con datos reales y navegación clara.

**Solución**
Mostrar órdenes asignadas, estados y acciones relevantes.

**Criterios de aceptación**
- El dashboard técnico carga y opera sin errores.

---

## EPIC 4. CRM

### Issue 4.1 Alta/actualización automática de clientes

**Problema**
El cliente debe mantenerse como entidad viva y no duplicada manualmente.

**Solución**
Crear o actualizar el cliente al crear solicitud, cliente, dispositivo u orden.

**Criterios de aceptación**
- El cliente se crea o actualiza automáticamente.

### Issue 4.2 Deduplicación por teléfono y nombre

**Problema**
Hay riesgo de registros duplicados.

**Solución**
Deduplicar por teléfono y coincidencia parcial de nombre.

**Criterios de aceptación**
- No se generan duplicados obvios.
- El historial no se rompe.

### Issue 4.3 Historial unificado

**Problema**
El historial del cliente debe ser un solo hilo operativo.

**Solución**
Unificar órdenes, dispositivos, evidencias y seguimiento.

**Criterios de aceptación**
- Cada cliente tiene historial completo consolidado.

---

## EPIC 5. Roles y Permisos

### Issue 5.1 Roles oficiales

**Problema**
Los roles deben ser explícitos y consistentes.

**Solución**
Formalizar Dueño, Gerente, Técnico y Recepción.

**Criterios de aceptación**
- Los roles existen y se usan en RBAC.

### Issue 5.2 Permisos por rol

**Problema**
Cada rol necesita un conjunto claro de capacidades.

**Solución**
Implementar permisos por rol y navegación coherente.

**Criterios de aceptación**
- Técnico ve solo lo que le corresponde.
- Recepción ve solo lo que le corresponde.
- Gerente y Dueño tienen permisos ampliados.

### Issue 5.3 Bloqueo de módulos sensibles

**Problema**
Módulos críticos no deben estar disponibles para roles no autorizados.

**Solución**
Bloquear finanzas, seguridad, usuarios, configuración y sucursales cuando aplique.

**Criterios de aceptación**
- El acceso por rol queda aplicado en UI y rutas.

---

## EPIC 6. Seguridad Operativa

### Issue 6.1 Autorización para acciones críticas

**Problema**
Las acciones sensibles requieren control adicional.

**Solución**
Exigir autorización de Gerente o Dueño para crear sucursales, ajustar inventario y transferir stock.

**Criterios de aceptación**
- Las acciones críticas requieren autorización.
- La trazabilidad queda registrada.

---

## EPIC 7. Landing SaaS

### Issue 7.1 Nueva identidad visual

**Problema**
La landing SaaS debe verse como la misma familia visual del producto.

**Solución**
Migrar la landing al diseño de referencia.

**Criterios de aceptación**
- Hero, preview, navegación, componentes y paleta quedan alineados.

### Issue 7.2 Quitar Portal Cliente de la landing SaaS

**Problema**
La landing SaaS no debe vender funcionalidad específica del tenant como feature principal.

**Solución**
Remover Portal Cliente de la comunicación principal de la landing.

**Criterios de aceptación**
- Portal Cliente ya no aparece como módulo de venta del SaaS.

### Issue 7.3 Preview/demos y navegación alineados

**Problema**
La landing debe sentirse como una sola aplicación comercial.

**Solución**
Alinear preview, demo y navegación al nuevo sistema visual.

**Criterios de aceptación**
- La experiencia se percibe consistente en desktop y mobile.

---

## Orden de ejecución sugerido

1. Issue 2.3 Resolver Network Error / Failed to Fetch
2. Issue 5.2 Permisos por rol
3. Issue 3.3 Flujo correcto de Técnico
4. Issue 1.1 WhatsApp con link público de tracking
5. Issue 1.2 PDF de recepción real
6. Issue 1.3 Evidencias end-to-end
7. Issue 2.1 URL pública visible en Landing
8. Issue 2.2 Frontend público completo del tenant
9. Issue 3.1 Datos completos en ficha técnica
10. Issue 3.2 Edición de orden
11. Issue 3.4 Dashboard técnico funcional
12. Issue 4.1 Alta/actualización automática de clientes
13. Issue 4.2 Deduplicación por teléfono y nombre
14. Issue 4.3 Historial unificado
15. Issue 6.1 Autorización para acciones críticas
16. Issue 7.1 Nueva identidad visual
17. Issue 7.2 Quitar Portal Cliente de la landing SaaS
18. Issue 7.3 Preview/demos y navegación alineados

## Cierre MVP

El MVP se puede cerrar solo cuando todos los criterios de aceptación anteriores estén probados en producción con datos reales.

