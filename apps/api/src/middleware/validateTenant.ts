import { Request, Response, NextFunction } from 'express';

export const validateTenant = (req: Request, res: Response, next: NextFunction) => {
  const routeTenantSlug = req.params.tenantSlug ?? req.params.tenantId ?? req.params.tenant;
  const tokenTenantSlug = req.user?.tenantSlug ?? null;
  const tokenTenantId = req.user?.tenantId;

  if (!tokenTenantSlug) {
    return res.status(401).json({ error: 'Missing tenant_slug in token' });
  }

  if (routeTenantSlug && routeTenantSlug !== tokenTenantSlug) {
    return res.status(403).json({ error: 'Tenant mismatch: Route param does not match token' });
  }

  const finalTenantId = tokenTenantId;

  if (!finalTenantId) {
    return res.status(400).json({ error: 'Missing tenant identification in route or token' });
  }

  req.tenantId = finalTenantId;
  next();
};
