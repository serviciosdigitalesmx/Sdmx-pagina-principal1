import { Request, Response, NextFunction } from 'express';

function isUuidLike(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export const validateTenant = (req: Request, res: Response, next: NextFunction) => {
  const routeTenantSlug = req.params.tenantSlug ?? req.params.tenantId ?? req.params.tenant;
  const tokenTenantSlug = req.user?.tenantSlug ?? null;
  const tokenTenantId = req.user?.tenantId;
  const routeTenantParamType = routeTenantSlug
    ? (isUuidLike(routeTenantSlug) ? 'uuid_like' : 'slug_like')
    : 'missing';
  const tokenTenantIdMatchesRoute = Boolean(routeTenantSlug && tokenTenantId && routeTenantSlug === tokenTenantId);
  const tokenTenantSlugMatchesRoute = Boolean(routeTenantSlug && tokenTenantSlug && routeTenantSlug === tokenTenantSlug);

  if (process.env.TENANT_GUARD_DEBUG === '1') {
    console.warn('[tenant-guard]', {
      middlewareName: 'validateTenant',
      method: req.method,
      originalUrl: req.originalUrl,
      routeTenantSlug: routeTenantSlug ?? null,
      routeTenantId: req.params.tenantId ?? null,
      tokenTenantSlug: tokenTenantSlug ?? null,
      tokenTenantId: tokenTenantId ?? null,
      routeTenantParamType,
      tokenTenantIdMatchesRoute,
      tokenTenantSlugMatchesRoute,
      hasUser: Boolean(req.user),
    });
  }

  if (!tokenTenantSlug) {
    return res.status(401).json({ error: 'Missing tenant_slug in token' });
  }

  if (routeTenantSlug) {
    const matchesTokenTenant =
      routeTenantSlug === tokenTenantSlug ||
      routeTenantSlug === tokenTenantId ||
      (isUuidLike(routeTenantSlug) && routeTenantSlug === tokenTenantId);

    if (!matchesTokenTenant) {
      return res.status(403).json({ error: 'Tenant mismatch: Route param does not match token' });
    }
  }

  const finalTenantId = tokenTenantId;

  if (!finalTenantId) {
    return res.status(400).json({ error: 'Missing tenant identification in route or token' });
  }

  req.tenantId = finalTenantId;
  next();
};

export async function validateSelectedBranch(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const tenantId = req.tenantId;
  const requestedBranch =
    req.headers['x-fixi-sucursal-id'] ??
    req.headers['x-sucursal-id'] ??
    req.user?.sucursalId ??
    null;

  if (!tenantId) {
    return res.status(401).json({
      success: false,
      error: 'Tenant ausente',
      code: 'TENANT_REQUIRED',
    });
  }

  if (!requestedBranch || Array.isArray(requestedBranch)) {
    req.scope = { ...req.scope, sucursalId: null };
    return next();
  }

  // Import supabaseAdmin dynamically or at the top
  const { supabaseAdmin } = require('@white-label/database');
  const { data: branch } = await supabaseAdmin
    .from('sucursales')
    .select('id')
    .eq('id', requestedBranch)
    .eq('tenant_id', tenantId)
    .eq('is_active', true)
    .maybeSingle();

  if (!branch) {
    return res.status(403).json({
      success: false,
      error: 'Sucursal no permitida',
      code: 'BRANCH_SCOPE_DENIED',
    });
  }

  const role = req.user?.role;
  const fixedBranch = req.user?.sucursalId;

  if (fixedBranch && role !== 'owner' && role !== 'admin' && fixedBranch !== branch.id) {
    return res.status(403).json({
      success: false,
      error: 'No tienes acceso a esta sucursal',
      code: 'BRANCH_SCOPE_DENIED',
    });
  }

  req.scope = { ...req.scope, sucursalId: branch.id };
  next();
}
