export type TenantRole = 'owner' | 'manager' | 'technician' | 'client';

export interface TenantIdentity {
  tenantId: string;
  tenantSlug: string;
  tenantName: string;

  branchId: string | null;
  branchCode: string | null;
  branchName: string | null;

  userId: string;
  userEmail: string;
  role: TenantRole;
}
