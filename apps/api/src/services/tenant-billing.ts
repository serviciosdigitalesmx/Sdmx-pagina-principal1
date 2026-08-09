import { supabaseAdmin } from '@white-label/database';
import { getBillingStatus } from './billing-adapter';
import { BILLING_ADAPTER_MODE } from '../config/feature-flags';

export type TenantBillingSummary = {
  tenantId: string;
  tenantSlug: string;
  subscriptionStatus: string;
  planKey: 'basic' | 'pro' | 'scale';
  trialExpiresAt: string | null;
  billingExempt: boolean;
  isTrialActive: boolean;
  isBillingBlocked: boolean;
  daysLeft: number | null;
  upgradeHref: string | null;
};

function normalizePlanKey(value: string | null | undefined): TenantBillingSummary['planKey'] {
  const plan = String(value ?? '').trim().toLowerCase();
  if (['enterprise', 'empresarial', 'business', 'scale'].includes(plan)) return 'scale';
  if (['pro', 'professional', 'profesional'].includes(plan)) return 'pro';
  return 'basic';
}

function computeDaysLeft(trialExpiresAt: string | null) {
  if (!trialExpiresAt) {
    return null;
  }

  const expiresAt = new Date(trialExpiresAt);
  if (Number.isNaN(expiresAt.getTime())) {
    return null;
  }

  const diffMs = expiresAt.getTime() - Date.now();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export async function loadTenantBillingSummary(tenantId: string, tenantSlug?: string | null): Promise<TenantBillingSummary> {
  const [{ data: tenantRow, error: tenantError }, { data: organizationRow, error: orgError }] = await Promise.all([
    supabaseAdmin
      .from('tenants')
      .select('id, slug, plan, trial_expires_at, billing_exempt')
      .eq('id', tenantId)
      .maybeSingle(),
    supabaseAdmin
      .from('organizations')
      .select('id, slug, subscription_status')
      .eq('id', tenantId)
      .maybeSingle(),
  ]);

  if (tenantError) {
    throw tenantError;
  }

  const resolvedTenantSlug = tenantSlug ?? tenantRow?.slug ?? null;
  const trialExpiresAt = tenantRow?.trial_expires_at ?? null;
  const billingExempt = Boolean(tenantRow?.billing_exempt);
  const subscriptionStatus = billingExempt
    ? 'active'
    : String((await getBillingStatus(tenantId, BILLING_ADAPTER_MODE)) ?? 'trial').trim() || 'trial';
  const planKey = normalizePlanKey(tenantRow?.plan);
  const daysLeft = computeDaysLeft(trialExpiresAt ? new Date(trialExpiresAt).toISOString() : null);
  const isTrialActive = subscriptionStatus === 'trial' && daysLeft !== null && daysLeft > 0;
  const isBillingBlocked = !billingExempt && subscriptionStatus !== 'active' && (!isTrialActive || daysLeft === 0);
  const upgradeBaseUrl = process.env.APP_URL?.trim() || process.env.CORS_ALLOWED_ORIGINS?.split(',').map((origin) => origin.trim()).find(Boolean) || null;
  const upgradeHref = upgradeBaseUrl ? new URL('/onboarding', upgradeBaseUrl).toString() : null;

  return {
    tenantId,
    tenantSlug: resolvedTenantSlug ?? '',
    subscriptionStatus,
    planKey,
    trialExpiresAt: trialExpiresAt ? new Date(trialExpiresAt).toISOString() : null,
    billingExempt,
    isTrialActive,
    isBillingBlocked,
    daysLeft,
    upgradeHref,
  };
}
