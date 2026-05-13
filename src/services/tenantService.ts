import { fixService } from './fixService';

export interface TenantConfig {
  id: string;
  name: string;
  logoUrl: string;
  landingUrl: string;
  primaryColor?: string;
  secondaryColor?: string;
  tiendaWhatsapp?: string;
}

class TenantService {
  private currentConfig: TenantConfig | null = null;

  /**
   * Carga la configuración del tenant desde la API
   * Esto permite la "marca blanca" dinámica.
   */
  public async loadConfig(): Promise<TenantConfig | null> {
    try {
      const tenantId = fixService.getTenantId();
      if (!tenantId) return null;

      const config = await fixService.request<TenantConfig>(`tenant/config/${tenantId}`, {}, 'GET');
      this.currentConfig = config;
      this.applyIdentity(config);
      return config;
    } catch (e) {
      console.error('Error cargando TenantConfig:', e);
      return null;
    }
  }

  /**
   * Aplica la identidad visual al DOM de forma global
   */
  private applyIdentity(config: TenantConfig): void {
    // 1. Nombre de la pestaña
    document.title = `${config.name} | Sr. Fix`;

    // 2. Logo principal (si existe el elemento)
    const logoImg = document.getElementById('main-logo') as HTMLImageElement;
    if (logoImg && config.logoUrl) {
      logoImg.src = config.logoUrl;
    }

    // 3. Colores corporativos (Variables CSS)
    if (config.primaryColor) {
      document.documentElement.style.setProperty('--color-primary', config.primaryColor);
    }
    if (config.secondaryColor) {
      document.documentElement.style.setProperty('--color-secondary', config.secondaryColor);
    }

    console.log(`[Identity] Aplicada marca blanca para: ${config.name}`);
  }

  public getConfig(): TenantConfig | null {
    return this.currentConfig;
  }
}

export const tenantService = new TenantService();
