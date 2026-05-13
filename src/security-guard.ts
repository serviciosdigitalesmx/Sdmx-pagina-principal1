import { fixService } from './services/fixService';
import { tenantService } from './services/tenantService';

/**
 * Módulo de Seguridad - Fin de confianza en cliente.
 * El backend valida el token en cada petición.
 */

export async function ensureAuthenticated(): Promise<boolean> {
  const token = fixService.getToken();
  if (!token) {
    const pass = window.prompt('Sesión requerida. Ingresa tu clave de acceso:') || '';
    if (!pass) return false;

    try {
      const res = await fixService.login({ usuario: 'admin', password: pass });
      if (res.ok) {
        await tenantService.loadConfig();
        return true;
      }
      return false;
    } catch (e) {
      alert('Error de autenticación');
      return false;
    }
  }
  
  // Si ya tiene sesión, aseguramos que la marca esté cargada
  if (!tenantService.getConfig()) {
    await tenantService.loadConfig();
  }
  
  return true;
}

export const SecurityGuard = {
  ensureAuthenticated,
  logout: () => fixService.logout(),
  hasSession: () => !!fixService.getToken(),
  getTenant: () => tenantService.getConfig()
};

(window as any).SRFXSecurityGuard = SecurityGuard;
