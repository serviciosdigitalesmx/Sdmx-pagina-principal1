import { Request, Response } from 'express';
import { getTenantClient } from '@white-label/database';
import { z } from 'zod';

const updateRoleSchema = z.object({
  role: z.enum(['manager', 'technician']),
  permissions: z.record(z.boolean()),
});

const roleQuerySchema = z.enum(['manager', 'technician']);

export async function getRolePermissions(req: Request, res: Response) {
  const tenantId = req.tenantId as string;
  const parsedRole = roleQuerySchema.safeParse(req.query.role);

  if (!parsedRole.success) {
    return res.status(400).json({ error: 'role must be manager or technician' });
  }
  const role = parsedRole.data;

  const supabase = getTenantClient(tenantId);
  const { data, error } = await supabase
    .from('tenant_role_permissions')
    .select('permission_key, allowed')
    .eq('tenant_id', tenantId)
    .eq('role', role);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const permissions = data.reduce((acc: Record<string, boolean>, curr) => {
    acc[curr.permission_key] = curr.allowed;
    return acc;
  }, {});

  return res.json({ success: true, data: { role, permissions } });
}

export async function updateRolePermissions(req: Request, res: Response) {
  const tenantId = req.tenantId as string;
  const userId = req.user?.userId || req.user?.sub;
  const parsed = updateRoleSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(422).json({ error: 'Invalid payload', details: parsed.error.flatten() });
  }

  const supabase = getTenantClient(tenantId);
  const { role, permissions } = parsed.data;

  const rows = Object.entries(permissions).map(([permission_key, allowed]) => ({
    tenant_id: tenantId,
    role,
    permission_key,
    allowed,
    updated_by: userId,
    updated_at: new Date().toISOString(),
  }));

  if (rows.length > 0) {
    const { error } = await supabase
      .from('tenant_role_permissions')
      .upsert(rows, { onConflict: 'tenant_id,role,permission_key' });

    if (error) {
      return res.status(502).json({ error: 'Failed to update permissions', details: error.message });
    }
  }

  return res.json({ success: true, message: 'Permissions updated successfully' });
}
