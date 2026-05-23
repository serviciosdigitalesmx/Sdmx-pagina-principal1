import { Request, Response } from 'express';
import { getTenantClient } from '@white-label/database';

export const listBranches = async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId;

    if (!tenantId) {
      return res.status(401).json({ error: 'Tenant context is required' });
    }

    const supabase = getTenantClient(tenantId);
    const { data, error } = await supabase
      .from('branches')
      .select('id, tenant_id, name, code, address, city, state, phone, is_active, created_at, updated_at')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      return res.status(502).json({ error: 'Failed to fetch branches', details: error.message });
    }

    return res.json({ success: true, data });
  } catch (error) {
    console.error('Error listing branches:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
