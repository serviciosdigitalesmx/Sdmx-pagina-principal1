export {};

declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
      user?: {
        tenantId: string;
        tenantSlug?: string | null;
        role: 'owner' | 'manager' | 'technician';
        email?: string;
        sucursalId?: string;
        sub?: string;
      };
    }
  }
}
