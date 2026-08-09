import { Request, Response } from 'express';
import { getTenantClient } from '@white-label/database';

export async function searchOmni(req: Request, res: Response) {
  const tenantId = req.tenantId;
  const rawQuery = typeof req.query.q === 'string' ? req.query.q.trim() : '';

  if (!tenantId) {
    return res.status(401).json({ error: 'Tenant context is required' });
  }

  if (rawQuery.length < 2) {
    return res.json({ customers: [], orders: [], catalogs: [] });
  }

  // PostgREST `.or()` accepts a filter expression, so strip its control characters
  // while preserving the user's searchable text.
  const query = rawQuery.replace(/[,%()]/g, ' ').replace(/\s+/g, ' ').trim();
  if (query.length < 2) {
    return res.status(400).json({ error: 'Search query must contain at least two searchable characters' });
  }

  const supabase = getTenantClient(tenantId);

  const customersPromise = supabase
    .from('customers')
    .select('id, name, phone, email')
    .or(`name.ilike.%${query}%,phone.ilike.%${query}%,email.ilike.%${query}%`)
    .limit(5);

  let ordersQuery = supabase
    .from('service_orders')
    .select('id, folio, status, device_info, serial_number, sucursal_id, created_at')
    .or(`folio.ilike.%${query}%,serial_number.ilike.%${query}%`);

  if (req.scope?.mode === 'branch' && req.scope.sucursalId) {
    ordersQuery = ordersQuery.eq('sucursal_id', req.scope.sucursalId);
  }

  const ordersPromise = ordersQuery.limit(5);

  const catalogsPromise = supabase
    .from('catalog_models')
    .select('id, name, brand_id, catalog_brands(name)')
    .ilike('name', `%${query}%`)
    .limit(5);

  const [customersRes, ordersRes, catalogsRes] = await Promise.all([
    customersPromise,
    ordersPromise,
    catalogsPromise
  ]);

  const failedQuery = [customersRes.error, ordersRes.error, catalogsRes.error].find(Boolean);
  if (failedQuery) {
    return res.status(502).json({ error: 'Search failed', details: failedQuery.message });
  }

  return res.status(200).json({
    customers: customersRes.data || [],
    orders: ordersRes.data || [],
    catalogs: catalogsRes.data || []
  });
}
