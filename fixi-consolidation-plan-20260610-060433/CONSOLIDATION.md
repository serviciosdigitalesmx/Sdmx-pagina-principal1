# FIXI CONSOLIDATION PLAN

## AUTH

Crear:

AuthProvider

Eliminar accesos directos a:

- localStorage
- sessionStorage
- JWT manual

---

## TENANT

Crear:

TenantIdentity

Campos únicos:

tenantId
tenantSlug
tenantName
branchId
branchName

---

## API

Crear:

ApiConfig

Única fuente:

NEXT_PUBLIC_API_URL

---

## SUPABASE

Crear:

SupabaseProvider

Único lugar permitido para:

createClient()

---

## DEPLOY

Crear:

DeploymentConfig

Únicos archivos:

apps/web-public/vercel.json
apps/web-clientes/vercel.json
apps/web-admin/vercel.json

Prohibido:

hardcodes
urls directas
dominios embebidos

