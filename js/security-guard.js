import { fixService } from './services/fixService';
/**
 * Módulo de Seguridad - Fin de confianza en cliente.
 * El backend valida el token en cada petición.
 */
export async function ensureAuthenticated() {
    const token = fixService.getToken();
    if (!token) {
        // En lugar de prompt, redirigimos a login o pedimos credenciales
        const pass = window.prompt('Sesión requerida. Ingresa tu clave de acceso:') || '';
        if (!pass)
            return false;
        try {
            const res = await fixService.login({ usuario: 'admin', password: pass });
            return !!res.ok;
        }
        catch (e) {
            alert('Error de autenticación');
            return false;
        }
    }
    return true;
}
export const SecurityGuard = {
    ensureAuthenticated,
    logout: () => fixService.logout(),
    hasSession: () => !!fixService.getToken()
};
window.SRFXSecurityGuard = SecurityGuard;
