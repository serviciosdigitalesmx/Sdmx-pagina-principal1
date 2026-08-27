export const BILLING_ADAPTER_MODE =
  process.env.BILLING_ADAPTER_MODE === 'mixed' || process.env.BILLING_ADAPTER_MODE === 'tenants'
    ? process.env.BILLING_ADAPTER_MODE
    : 'legacy';
export const FEATURE_EVIDENCE_MODE = process.env.FEATURE_EVIDENCE_MODE === 'normalized' ? 'normalized' : 'legacy';
