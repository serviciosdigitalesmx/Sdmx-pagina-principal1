export {};

declare global {
  namespace Express {
    interface ScopeContext {
      mode: 'consolidated' | 'branch';
      tenantId: string;
      tenantSlug: string | null;
      sucursalId: string | null;
      canUseConsolidatedView: boolean;
      role: 'owner' | 'manager' | 'technician' | 'client';
      source: 'query' | 'session' | 'token' | 'default';
      requestedSucursalId: string | null;
    }

    interface TenantCapabilities {
      plan_key: 'basic' | 'pro' | 'scale';
      access_status: 'active' | 'trial' | 'billing_exempt' | 'master' | 'blocked';
      active_modules: string[];
      locked_modules: string[];
      limits: {
        users: number | null;
        sucursales: number | null;
        monthly_orders: number | null;
        storage_mb: number | null;
        public_portal: boolean;
        whatsapp_templates: number | null;
        document_templates: number | null;
      };
      reasons: string[];
    }

    interface Request {
      tenantId?: string;
      tenantCapabilities?: TenantCapabilities;
      scope?: ScopeContext;
      user?: {
        tenantId: string;
        tenantSlug?: string | null;
        role: 'owner' | 'manager' | 'technician' | 'client';
        email?: string;
        sucursalId?: string;
        sub?: string;
        userId?: string;
      };
    }
  }
}
