import { CONFIG } from '../config';

class FixService {
  private baseUrl: string;
  private tokenKey = 'srfix_auth_token';

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  public setToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }

  public getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  /**
   * Extrae el tenantId del JWT claim de forma segura
   */
  public getTenantId(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const parts = token.split('.');
      const payloadBase64 = parts[1];
      if (!payloadBase64) return null;
      const payload = JSON.parse(atob(payloadBase64));
      return payload.tenantId || null;
    } catch (e) {
      console.warn('Error decodificando token para tenantId');
      return null;
    }
  }

  public logout(): void {
    sessionStorage.removeItem(this.tokenKey);
    window.location.reload();
  }

  /**
   * Centraliza la construcción de rutas para inyectar el contexto de tenant
   */
  private buildPath(action: string): string {
    const cleanAction = action.startsWith('/') ? action : `/${action}`;
    return cleanAction;
  }

  private async apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const token = this.getToken();
    const tenantId = this.getTenantId();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as any) || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (tenantId) {
      headers['X-Tenant-ID'] = tenantId;
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (response.status === 401 || response.status === 403) {
       if (token) {
         console.warn('Sesión expirada o permisos insuficientes');
         this.logout();
       }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP Error: ${response.status}`);
    }

    return response.json();
  }

  public async request<T = any>(action: string, payload: any = {}, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST'): Promise<T> {
    const path = this.buildPath(action);
    if (method === 'GET') {
      const qs = new URLSearchParams(payload).toString();
      return this.apiFetch<T>(`${path}${qs ? '?' + qs : ''}`, { method });
    }
    return this.apiFetch<T>(path, {
      method,
      body: JSON.stringify(payload)
    });
  }

  // --- Mapeo de Métodos Especializados ---

  public async listarSolicitudes(params: Record<string, any> = {}): Promise<any> {
    return this.request('solicitudes', params, 'GET');
  }

  public async obtenerSolicitud(folio: string): Promise<any> {
    return this.request(`solicitudes/${folio}`, {}, 'GET');
  }

  public async crearSolicitud(payload: any): Promise<any> {
    return this.request('solicitudes', payload, 'POST');
  }

  public async listarEquipos(params: Record<string, any> = {}): Promise<any> {
    return this.request('equipos', params, 'GET');
  }

  public async obtenerEquipo(folio: string): Promise<any> {
    return this.request(`equipos/${folio}`, {}, 'GET');
  }

  public async actualizarEquipo(folio: string, payload: any): Promise<any> {
    return this.request(`equipos/${folio}`, payload, 'PUT');
  }

  public async crearEquipo(payload: any): Promise<any> {
    return this.request('equipos', payload, 'POST');
  }

  public async listarArchivo(params: any): Promise<any> {
    return this.request('archivo', params, 'GET');
  }

  public async obtenerDetalleArchivo(tipo: string, folio: string): Promise<any> {
    return this.request(`archivo/${tipo}/${folio}`, {}, 'GET');
  }

  public async reabrirArchivo(payload: any): Promise<any> {
    return this.request('archivo/reabrir', payload, 'POST');
  }

  public async listarClientes(params: Record<string, any> = {}): Promise<any> {
    return this.request('clientes', params, 'GET');
  }

  public async login(payload: any): Promise<any> {
    const result: any = await this.apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (result.ok && result.token) {
      this.setToken(result.token);
    }
    return result;
  }

  public async listarTareas(params: any): Promise<any> {
    return this.request('tareas', params, 'GET');
  }

  public async obtenerTarea(folio: string, sucursalId: string): Promise<any> {
    return this.request(`tareas/${folio}?sucursalId=${sucursalId}`, {}, 'GET');
  }

  public async crearTarea(payload: any): Promise<any> {
    return this.request('tareas', payload, 'POST');
  }

  public async actualizarTarea(payload: any): Promise<any> {
    const { folio } = payload;
    return this.request(`tareas/${folio}`, payload, 'PUT');
  }

  public async listarProveedores(params: any = {}): Promise<any> {
    return this.request('proveedores', params, 'GET');
  }

  public async listarGastos(params: any = {}): Promise<any> {
    return this.request('gastos', params, 'GET');
  }

  public async obtenerReporteOperativo(params: any = {}): Promise<any> {
    return this.request('reportes/operativo', params, 'GET');
  }

  public async listarStock(params: any = {}): Promise<any> {
    return this.request('stock', params, 'GET');
  }
}

export const fixService = new FixService(CONFIG.API_URL);
// @ts-ignore
window.fixService = fixService;
