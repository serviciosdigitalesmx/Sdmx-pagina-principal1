export type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];

export interface JsonObject {
  [key: string]: JsonValue;
}

export interface TenantContext {
  tenantId: string;
  tenantName: string;
  brandName: string;
  branchName: string;
  userEmail: string;
  userSucursalId: string;
  userRole: string;
}
