import { Request, Response } from 'express';
import { getTenantClient } from '@white-label/database';
import { z } from 'zod';

const updateRoleSchema = z.object({
  role: z.string().trim().min(1),
  permissions: z.record(z.boolean()),
});

export async function getRolePermissions(req: Request, res: Response) {
  const tenantId = req.tenantId as string;
  const role = req.query.role as string;
  
  if (!role) {
    return res.status(400).json({ error: 'role query parameter is required' });
  }

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

  // Since we only update/insert, we should loop through permissions
  for (const [permission_key, allowed] of Object.entries(permissions)) {
    const { error } = await supabase
      .from('tenant_role_permissions')
      .upsert({
        tenant_id: tenantId,
        role,
        permission_key,
        allowed,
        updated_by: userId,
        updated_at: new Date().toISOString()
      }, { onConflict: 'tenant_id,role,permission_key' });
      
    if (error) {
      console.error(`Failed to update permission ${permission_key} for role ${role}:`, error);
    }
  }

  return res.json({ success: true, message: 'Permissions updated successfully' });
}
