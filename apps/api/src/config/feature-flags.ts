export const BILLING_ADAPTER_MODE = (process.env.BILLING_ADAPTER_MODE as 'legacy' | 'mixed' | 'tenants') ?? 'legacy';
export const FEATURE_EVIDENCE_MODE = (process.env.FEATURE_EVIDENCE_MODE as 'legacy' | 'normalized') ?? 'legacy';
