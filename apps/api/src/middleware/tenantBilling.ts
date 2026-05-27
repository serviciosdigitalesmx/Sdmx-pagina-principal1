import { Request, Response, NextFunction } from 'express';
import { loadTenantBillingSummary } from '../services/tenant-billing';

export async function requireTenantBillingActive(req: Request, res: Response, next: NextFunction) {
  const tenantId = req.tenantId ?? req.user?.tenantId;
  const tenantSlug = req.user?.tenantSlug ?? req.params.tenantSlug ?? null;
  const masterTenantSlug = process.env.MASTER_TENANT_SLUG?.trim() ?? '';
  const masterAccountEmail = process.env.MASTER_ACCOUNT_EMAIL?.trim() ?? '';

  if (!tenantId) {
    return res.status(400).json({ error: 'Missing tenant identification' });
  }

  if ((masterTenantSlug && tenantSlug && tenantSlug === masterTenantSlug) || (masterAccountEmail && req.user?.email && req.user.email === masterAccountEmail)) {
    return next();
  }

  try {
    const billing = await loadTenantBillingSummary(tenantId, tenantSlug);

    if (!billing.isBillingBlocked) {
      return next();
    }

    return res.status(402).json({
      error: 'Trial expired',
      details: {
        tenantId: billing.tenantId,
        tenantSlug: billing.tenantSlug || null,
        subscriptionStatus: billing.subscriptionStatus,
        billingExempt: billing.billingExempt,
        trialExpiresAt: billing.trialExpiresAt,
        daysLeft: billing.daysLeft,
        upgradeHref: billing.upgradeHref,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to validate billing status';
    return res.status(502).json({ error: message });
  }
}
