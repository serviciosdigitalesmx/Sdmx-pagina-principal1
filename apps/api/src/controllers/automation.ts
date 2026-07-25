import { Request, Response } from 'express';
import { getTenantClient } from '@white-label/database';

// Rules CRUD
export async function getRules(req: Request, res: Response) {
  const tenantId = req.tenantId as string;

  const supabase = getTenantClient(tenantId);
  const { data, error } = await supabase.from('automation_rules').select('*').eq('tenant_id', tenantId).order('created_at');
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
}

export async function createRule(req: Request, res: Response) {
  const tenantId = req.tenantId as string;
  const { name, event_type, condition, action_type, action_config, is_active } = req.body;

  const supabase = getTenantClient(tenantId);
  const { data, error } = await supabase
    .from('automation_rules')
    .insert({ tenant_id: tenantId, name, event_type, condition, action_type, action_config, is_active })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data);
}

export async function updateRule(req: Request, res: Response) {
  const tenantId = req.tenantId as string;
  const { id } = req.params;
  const { name, event_type, condition, action_type, action_config, is_active } = req.body;

  const supabase = getTenantClient(tenantId);
  const { data, error } = await supabase
    .from('automation_rules')
    .update({ name, event_type, condition, action_type, action_config, is_active })
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
}

// Templates CRUD
export async function getTemplates(req: Request, res: Response) {
  const tenantId = req.tenantId as string;

  const supabase = getTenantClient(tenantId);
  const { data, error } = await supabase.from('message_templates').select('*').eq('tenant_id', tenantId).order('name');
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
}

export async function createTemplate(req: Request, res: Response) {
  const tenantId = req.tenantId as string;
  const { name, channel, subject, body, variables } = req.body;

  const supabase = getTenantClient(tenantId);
  const { data, error } = await supabase
    .from('message_templates')
    .insert({ tenant_id: tenantId, name, channel, subject, body, variables })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data);
}

// Logs List
export async function getLogs(req: Request, res: Response) {
  const tenantId = req.tenantId as string;

  const supabase = getTenantClient(tenantId);
  const { data, error } = await supabase.from('automation_logs').select('*, rule:rule_id(*)').eq('tenant_id', tenantId).order('created_at', { ascending: false }).limit(100);
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
}
