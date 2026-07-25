import { Request, Response } from 'express';
import { getTenantClient } from '@white-label/database';

export async function searchOmni(req: Request, res: Response) {
  const tenantId = req.tenantId as string;
  const query = req.query.q as string;

  if (!query || query.length < 2) return res.json({ customers: [], orders: [], catalogs: [] });

  const supabase = getTenantClient(tenantId);
  
  // Search customers (name, phone, email)
  const customersPromise = supabase
    .from('customers')
    .select('id, name, phone, email')
    .or(`name.ilike.%${query}%,phone.ilike.%${query}%,email.ilike.%${query}%`)
    .limit(5);

  // Search orders (folio)
  const ordersPromise = supabase
    .from('service_orders')
    .select('id, folio, status, device_info, created_at')
    .ilike('folio', `%${query}%`)
    .limit(5);
    
  // Search catalog models
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

  return res.json({
    customers: customersRes.data || [],
    orders: ordersRes.data || [],
    catalogs: catalogsRes.data || []
  });
}
