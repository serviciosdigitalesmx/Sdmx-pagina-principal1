import { Request, Response } from 'express';
import { getTenantClient } from '@white-label/database';

// --- FAMILIES ---
export async function getFamilies(req: Request, res: Response) {
  const tenantId = req.tenantId as string;

  const supabase = getTenantClient(tenantId);
  const { data, error } = await supabase.from('catalog_families').select('*').order('name');
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
}

export async function createFamily(req: Request, res: Response) {
  const tenantId = req.tenantId as string;
  const { name, description } = req.body;
  
  const supabase = getTenantClient(tenantId);
  const { data, error } = await supabase.from('catalog_families').insert({ tenant_id: tenantId, name, description }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data);
}

export async function updateFamily(req: Request, res: Response) {
  const tenantId = req.tenantId as string;
  const { id } = req.params;
  const { name, description } = req.body;

  const supabase = getTenantClient(tenantId);
  const { data, error } = await supabase.from('catalog_families').update({ name, description }).eq('id', id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
}

export async function deleteFamily(req: Request, res: Response) {
  const tenantId = req.tenantId as string;
  const { id } = req.params;

  const supabase = getTenantClient(tenantId);
  const { error } = await supabase.from('catalog_families').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  return res.status(204).send();
}

// --- BRANDS ---
export async function getBrands(req: Request, res: Response) {
  const tenantId = req.tenantId as string;
  const { familyId } = req.query;
  if (!familyId) return res.status(400).json({ error: 'familyId query parameter required' });

  const supabase = getTenantClient(tenantId);
  const { data, error } = await supabase.from('catalog_brands').select('*').eq('family_id', familyId).order('name');
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
}

export async function createBrand(req: Request, res: Response) {
  const tenantId = req.tenantId as string;
  const { family_id, name, logo_url } = req.body;

  const supabase = getTenantClient(tenantId);
  const { data, error } = await supabase.from('catalog_brands').insert({ tenant_id: tenantId, family_id, name, logo_url }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data);
}

export async function updateBrand(req: Request, res: Response) {
  const tenantId = req.tenantId as string;
  const { id } = req.params;
  const { name, logo_url } = req.body;

  const supabase = getTenantClient(tenantId);
  const { data, error } = await supabase.from('catalog_brands').update({ name, logo_url }).eq('id', id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
}

export async function deleteBrand(req: Request, res: Response) {
  const tenantId = req.tenantId as string;
  const { id } = req.params;

  const supabase = getTenantClient(tenantId);
  const { error } = await supabase.from('catalog_brands').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  return res.status(204).send();
}

// --- MODELS ---
export async function getModels(req: Request, res: Response) {
  const tenantId = req.tenantId as string;
  const { brandId } = req.query;
  if (!brandId) return res.status(400).json({ error: 'brandId query parameter required' });

  const supabase = getTenantClient(tenantId);
  const { data, error } = await supabase.from('catalog_models').select('*').eq('brand_id', brandId).order('name');
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
}

export async function createModel(req: Request, res: Response) {
  const tenantId = req.tenantId as string;
  const { brand_id, name, reference_image_url } = req.body;

  const supabase = getTenantClient(tenantId);
  const { data, error } = await supabase.from('catalog_models').insert({ tenant_id: tenantId, brand_id, name, reference_image_url }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data);
}

export async function updateModel(req: Request, res: Response) {
  const tenantId = req.tenantId as string;
  const { id } = req.params;
  const { name, reference_image_url } = req.body;

  const supabase = getTenantClient(tenantId);
  const { data, error } = await supabase.from('catalog_models').update({ name, reference_image_url }).eq('id', id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
}

export async function deleteModel(req: Request, res: Response) {
  const tenantId = req.tenantId as string;
  const { id } = req.params;

  const supabase = getTenantClient(tenantId);
  const { error } = await supabase.from('catalog_models').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  return res.status(204).send();
}

// --- FAULTS ---
export async function getFaults(req: Request, res: Response) {
  const tenantId = req.tenantId as string;
  const { modelId } = req.query;
  if (!modelId) return res.status(400).json({ error: 'modelId query parameter required' });

  const supabase = getTenantClient(tenantId);
  const { data, error } = await supabase.from('catalog_faults').select('*').eq('model_id', modelId).order('name');
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
}

export async function createFault(req: Request, res: Response) {
  const tenantId = req.tenantId as string;
  const { model_id, name, description, estimated_labor_minutes, default_cost } = req.body;

  const supabase = getTenantClient(tenantId);
  const { data, error } = await supabase.from('catalog_faults').insert({ tenant_id: tenantId, model_id, name, description, estimated_labor_minutes, default_cost }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data);
}

export async function updateFault(req: Request, res: Response) {
  const tenantId = req.tenantId as string;
  const { id } = req.params;
  const { name, description, estimated_labor_minutes, default_cost } = req.body;

  const supabase = getTenantClient(tenantId);
  const { data, error } = await supabase.from('catalog_faults').update({ name, description, estimated_labor_minutes, default_cost }).eq('id', id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
}

export async function deleteFault(req: Request, res: Response) {
  const tenantId = req.tenantId as string;
  const { id } = req.params;

  const supabase = getTenantClient(tenantId);
  const { error } = await supabase.from('catalog_faults').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  return res.status(204).send();
}

// --- PARTS ---
export async function getParts(req: Request, res: Response) {
  const tenantId = req.tenantId as string;
  const { faultId } = req.query;
  if (!faultId) return res.status(400).json({ error: 'faultId query parameter required' });

  const supabase = getTenantClient(tenantId);
  const { data, error } = await supabase.from('catalog_parts').select('*').eq('fault_id', faultId).order('name');
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
}

export async function createPart(req: Request, res: Response) {
  const tenantId = req.tenantId as string;
  const { fault_id, name, sku, default_cost, product_id } = req.body;

  const supabase = getTenantClient(tenantId);
  const { data, error } = await supabase.from('catalog_parts').insert({ tenant_id: tenantId, fault_id, name, sku, default_cost, product_id }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data);
}

export async function updatePart(req: Request, res: Response) {
  const tenantId = req.tenantId as string;
  const { id } = req.params;
  const { name, sku, default_cost, product_id } = req.body;

  const supabase = getTenantClient(tenantId);
  const { data, error } = await supabase.from('catalog_parts').update({ name, sku, default_cost, product_id }).eq('id', id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
}

export async function deletePart(req: Request, res: Response) {
  const tenantId = req.tenantId as string;
  const { id } = req.params;

  const supabase = getTenantClient(tenantId);
  const { error } = await supabase.from('catalog_parts').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  return res.status(204).send();
}

export async function getChecklists(req: Request, res: Response) {
  const tenantId = req.tenantId as string;
  const { familyId } = req.query;

  if (!familyId) return res.status(400).json({ error: 'familyId query parameter required' });

  const supabase = getTenantClient(tenantId);
  const { data, error } = await supabase
    .from('catalog_checklists')
    .select('*')
    .eq('family_id', familyId)
    .order('sort_order', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
}

