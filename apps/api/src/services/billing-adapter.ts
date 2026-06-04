import { supabaseAdmin } from '@white-label/database';

export type BillingAdapterMode = 'legacy' | 'mixed' | 'tenants';

export async function getBillingStatus(tenantId: string, mode: BillingAdapterMode = 'legacy') {
  if (mode === 'legacy') {
    const { data, error } = await supabaseAdmin.from('organizations').select('subscription_status, slug').eq('id', tenantId).maybeSingle();
    if (error) throw error;
    return data?.subscription_status ?? null;
  }

  // mixed or tenants: prefer tenants
  const { data: tenantRow, error: tenantError } = await supabaseAdmin.from('tenants').select('subscription_status, status, slug').eq('id', tenantId).maybeSingle();
  if (tenantError) throw tenantError;
  const tenantStatus = tenantRow?.subscription_status ?? tenantRow?.status ?? null;
  if (tenantStatus || mode === 'tenants') return tenantStatus;

  // fallback to organizations when mixed
  const { data: orgRow, error: orgError } = await supabaseAdmin.from('organizations').select('subscription_status').eq('id', tenantId).maybeSingle();
  if (orgError) throw orgError;
  return orgRow?.subscription_status ?? null;
}

export async function upsertSubscriptionStatus(tenantId: string, status: string, mode: BillingAdapterMode = 'legacy') {
  if (mode === 'legacy') {
    const { error } = await supabaseAdmin.from('organizations').update({ subscription_status: status }).eq('id', tenantId);
    if (error) throw error;
    return;
  }

  // tenants (or mixed): update tenants
  const { error } = await supabaseAdmin.from('tenants').update({ subscription_status: status }).eq('id', tenantId);
  if (error) throw error;
  // in mixed mode we intentionally do NOT mirror to organizations here in this PR
}
