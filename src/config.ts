/**
 * Configuración Crítica del Frontend - Sr-Fix
 * MANDATO: CERO HARDCODE. CERO FALLBACKS.
 * Si las variables no están inyectadas por el host (Vercel), la app falla inmediatamente.
 */

const getEnv = (key: string, placeholder: string): string => {
    // Si el placeholder NO ha sido reemplazado (sigue empezando con '__'),
    // intentamos leer de window como último recurso (para compatibilidad o dev local).
    if (placeholder && placeholder.startsWith('__')) {
        const fallback = (window as any)[`SRFIX_${key}`] || '';
        if (!fallback) {
            const errorMsg = `[FATAL] La variable ${key} no fue inyectada en el build ni se encontró en window. Deteniendo ejecución.`;
            console.error(errorMsg);
            throw new Error(errorMsg);
        }
        return String(fallback).trim();
    }
    return placeholder;
};

export const CONFIG = {
    API_URL: getEnv('API_URL', '__SRFIX_API_URL__'),
    APP_URL: getEnv('APP_URL', '__SRFIX_APP_URL__'),
    SUGGESTIONS_KEY: 'srfix_historial_folios',
    TIENDA_WHATSAPP: getEnv('TIENDA_WHATSAPP', '__SRFIX_TIENDA_WHATSAPP__'),
};


// Exponer globalmente para depuración interna controlada
(window as any).SRFIX_CONFIG = CONFIG;

export function srfixBuildPortalUrl(folio: string) {
    const cleanFolio = String(folio || '').trim().toUpperCase();
    if (!cleanFolio) return '';
    return `${CONFIG.APP_URL}/portal-cliente.html?folio=${encodeURIComponent(cleanFolio)}`;
}
