#!/usr/bin/env bash
set -euo pipefail

OUT="fixi-domain-blueprint-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUT"

cat > "$OUT/DOMAIN_MAP.md" <<'DOC'
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
DOC

echo "OUTPUT=$OUT"
