import { Request, Response, NextFunction } from 'express';
// import { supabaseAdmin } from '@white-label/database';
// import { loadTenantBillingSummary } from '../services/tenant-billing';

// ============================================================
// 🔓 BILLING ENFORCEMENT DISABLED
// Fixi is free-to-use until further notice.
// To re-enable billing, revert this file to the previous commit.
// Disabled on: 2026-07-29
// ============================================================

export async function requireTenantBillingActive(_req: Request, _res: Response, next: NextFunction) {
  // All tenants pass through — no billing check
  return next();
}

