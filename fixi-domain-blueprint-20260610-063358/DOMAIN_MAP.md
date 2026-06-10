# FIXI DOMAIN BLUEPRINT

## Tenant

Responsabilidades:
- Identidad del negocio
- Configuración
- Branding
- Facturación

Campos:
- tenantId
- tenantSlug
- tenantName

---

## Branch

Responsabilidades:
- Sucursal física
- Inventario
- Caja
- Compras

Campos:
- branchId
- branchCode
- branchName

---

## User

Responsabilidades:
- Acceso
- Roles
- Permisos

Campos:
- userId
- email
- role

---

## Session

Responsabilidades:
- Login
- Refresh
- JWT

Campos:
- sessionId
- tenantId
- userId

---

## Scope

Responsabilidades:
- tenant actual
- sucursal actual

Campos:
- tenantId
- branchId
