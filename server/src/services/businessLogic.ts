import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ENV } from '../config/env';
import { db } from '../db';

/**
 * Lógica de Negocio de Grado Producción - Cero Fallback.
 * Toda validación ocurre contra registros persistentes en DB.
 */

export async function handleLoginInterno(payload: any) {
  const { usuario, password } = payload;
  
  // Búsqueda estricta: Solo usuarios reales vinculados a un tenant activo.
  const res = await db.query(
    `SELECT u.*, t.slug as tenant_slug 
     FROM usuarios u 
     JOIN tenants t ON u.tenant_id = t.id 
     WHERE u.usuario = $1`, 
    [usuario]
  );
  
  const user = res.rows[0];

  if (user) {
     const match = await bcrypt.compare(password, user.password);
     if (match) {
        const token = jwt.sign(
          { 
            id: user.id, 
            usuario: user.usuario, 
            rol: user.rol,
            tenantId: user.tenant_id 
          },
          ENV.JWT_SECRET,
          { expiresIn: '8h' }
        );

        return {
          ok: true,
          token,
          user: {
            id: user.id,
            usuario: user.usuario,
            rol: user.rol,
            nombre: user.nombre,
            tenantId: user.tenant_id,
            tenantSlug: user.tenant_slug
          }
        };
     }
  }

  // CERO FALLBACK: Si no hay registro, el acceso es denegado.
  return { ok: false, error: 'Credenciales inválidas o cuenta no autorizada' };
}

export async function handleValidarAdminPassword(tenantId: string, payload: any) {
  const { password } = payload;
  
  // Validación contra todos los administradores del tenant.
  const res = await db.query(
    'SELECT password FROM usuarios WHERE tenant_id = $1 AND rol = $2', 
    [tenantId, 'ADMIN']
  );
  
  for (const row of res.rows) {
    if (await bcrypt.compare(password, row.password)) {
      return { ok: true };
    }
  }

  return { ok: false, error: 'Clave administrativa incorrecta' };
}
