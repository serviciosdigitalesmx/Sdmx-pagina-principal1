# FIXI ARCHITECTURE FREEZE
# VERSION 1.0

Fecha: $(date)

==================================================
OBJETIVO
==================================================

Congelar la arquitectura actual de Fixi.

A partir de este momento:

- una sola fuente de verdad
- una sola estrategia de configuración
- una sola estrategia de autenticación
- una sola estrategia multitenant
- una sola estrategia de branding
- una sola estrategia de rutas
- una sola estrategia de API

Ningún desarrollo nuevo puede violar este documento.

==================================================
REGLA 1
CONFIGURACIÓN CENTRALIZADA
==================================================

PROHIBIDO:

process.env en apps.

Permitido:

packages/config

Único punto de acceso:

packages/config/src/env.ts

Ejemplo:

export const API_URL

export const SUPABASE_URL

export const SUPABASE_ANON_KEY

export const WEB_ADMIN_URL

export const WEB_PUBLIC_URL

export const WEB_CLIENTES_URL

==================================================
REGLA 2
VARIABLES PERMITIDAS
==================================================

ÚNICAMENTE:

NEXT_PUBLIC_API_URL

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

NEXT_PUBLIC_WEB_ADMIN_URL

NEXT_PUBLIC_WEB_PUBLIC_URL

NEXT_PUBLIC_WEB_CLIENTES_URL

NODE_ENV

SUPABASE_SERVICE_ROLE_KEY

JWT_SECRET

Cualquier otra variable:

DEPRECADA

==================================================
REGLA 3
API
==================================================

Única resolución:

resolveApiBaseUrl()

Ubicación:

packages/config

Prohibido:

https://api.serviciosdigitalesmx.online

hardcodeado.

Prohibido:

https://sdmx-backend-api.onrender.com

hardcodeado.

Toda llamada:

API_URL + endpoint

==================================================
REGLA 4
SUPABASE
==================================================

Único cliente:

packages/supabase

Prohibido:

createClient()

duplicado.

Prohibido:

clientes Supabase por aplicación.

Permitido:

un singleton compartido.

==================================================
REGLA 5
AUTENTICACIÓN
==================================================

Único flujo:

Supabase
↓
exchange
↓
JWT interno
↓
sesión

Prohibido:

guardar tokens en múltiples lugares.

Prohibido:

localStorage disperso.

Único storage:

AuthStore

==================================================
REGLA 6
MULTITENANCY
==================================================

Única identidad:

TenantIdentity

Campos:

tenantId
tenantSlug
tenantName
branchId
branchCode
branchName

Prohibido:

leer tenant desde localStorage.

Prohibido:

inventar tenant.

Prohibido:

defaults falsos.

==================================================
REGLA 7
BRANDING
==================================================

Plataforma:

FIXI

Tenant:

tenantName

Prohibido:

sr fixi

demo

codex

qa

test

branding mezclado

==================================================
REGLA 8
FRONTENDS
==================================================

web-public

Landing SaaS

--------------------------------

web-admin

Dashboard SaaS

--------------------------------

web-clientes

Landing Tenant
+
Portal Cliente

==================================================
REGLA 9
SERVICIOS
==================================================

Todos los módulos deben consumir:

CustomerService

InventoryService

FinanceService

PurchaseService

TaskService

TenantService

Prohibido:

queries ad-hoc en componentes.

==================================================
REGLA 10
SOURCE OF TRUTH
==================================================

Clientes:

customers

--------------------------------

Órdenes:

service_orders

--------------------------------

Inventario:

inventory_items

--------------------------------

Compras:

purchase_orders

--------------------------------

Finanzas:

financial_movements

--------------------------------

Usuarios:

profiles

==================================================
REGLA 11
DEPLOYS
==================================================

Vercel:

web-public
web-admin
web-clientes

Render:

api

Prohibido:

configuración duplicada.

Prohibido:

build commands inconsistentes.

==================================================
REGLA 12
ARTEFACTOS
==================================================

Excluir siempre:

.next

dist

coverage

turbo

cache

build

standalone

No forman parte del código fuente.

==================================================
REGLA 13
DEUDA TÉCNICA
==================================================

Toda deuda detectada debe clasificarse:

CONFIG_DRIFT

ARCHITECTURE_DRIFT

AUTH_DRIFT

MULTITENANT_DRIFT

ENV_DRIFT

BRANDING_DRIFT

DEPLOY_DRIFT

==================================================
ESTADO OBJETIVO
==================================================

Una sola fuente de verdad.

Cero hardcodes.

Cero configuraciones duplicadas.

Cero clientes Supabase duplicados.

Cero resoluciones de API duplicadas.

Cero branding inconsistente.

Cero lógica multitenant dispersa.

