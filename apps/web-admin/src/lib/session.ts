"use client";

import { readAuthToken } from "@/lib/auth-storage";

export type CurrentSession = {
  token: string;
  userId: string;
  email: string;
  role: string;
  tenantId: string;
  tenantSlug: string;
  tenantName: string | null;
  branchId: string | null;
};

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const decoded = atob(padded);
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function readString(payload: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

export function getCurrentSession(): CurrentSession | null {
  if (typeof window === "undefined") return null;

  const token = readAuthToken();
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  const tenantId = readString(payload, ["tenant_id", "tenantId"]);
  const tenantSlug = readString(payload, ["tenant_slug", "tenantSlug"]);
  const tenantName = readString(payload, ["tenant_name", "tenantName", "business_name", "businessName"]);
  const email = readString(payload, ["email"]);
  const role = readString(payload, ["role"]);
  const userId = readString(payload, ["user_id", "userId", "sub", "id"]) || email || tenantId;
  const branchId = readString(payload, ["sucursal_id", "sucursalId", "branch_id", "branchId"]);

  if (!tenantId || !tenantSlug) return null;

  return {
    token,
    userId,
    email,
    role,
    tenantId,
    tenantSlug,
    tenantName: tenantName || null,
    branchId: branchId || null,
  };
}
