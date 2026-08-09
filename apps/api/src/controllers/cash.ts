import { Request, Response } from 'express';
import { getTenantClient } from '@white-label/database';
import { z } from 'zod';
import { requireScopedBranch } from '../lib/require-scoped-branch';

// Helper to get active shift
async function findActiveShift(supabase: any, tenantId: string, userId: string, sucursalId?: string) {
  const select = sucursalId
    ? '*, cash_registers!inner(id, name, sucursal_id)'
    : '*, cash_registers(id, name, sucursal_id)';
  const { data: shift, error } = await supabase
    .from('cash_shifts')
    .select(select)
    .eq('tenant_id', tenantId)
    .eq('opened_by', userId)
    .eq('status', 'open')
    .match(sucursalId ? { 'cash_registers.sucursal_id': sucursalId } : {})
    .maybeSingle();

  if (error) return null;
  return shift;
}

const createRegisterSchema = z.object({
  name: z.string().trim().min(1).max(120),
  sucursalId: z.string().uuid(),
});

export async function createRegister(req: Request, res: Response) {
  const tenantId = req.tenantId;
  if (!tenantId) return res.status(401).json({ success: false, error: 'Tenant requerido' });
  if (req.user?.role !== 'owner' && req.user?.role !== 'manager') {
    return res.status(403).json({ success: false, error: 'Permisos insuficientes' });
  }

  const parsed = createRegisterSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: 'Datos de caja inválidos', details: parsed.error.flatten() });
  }

  const sucursalId = requireScopedBranch(req);
  if (parsed.data.sucursalId !== sucursalId) {
    return res.status(403).json({ success: false, error: 'La caja debe pertenecer a la sucursal activa' });
  }

  const supabase = getTenantClient(tenantId);
  const { data, error } = await supabase
    .from('cash_registers')
    .insert({ tenant_id: tenantId, sucursal_id: sucursalId, name: parsed.data.name, is_active: true })
    .select('*')
    .single();

  if (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, error: 'Ya existe una caja activa con ese nombre' });
    }
    return res.status(502).json({ success: false, error: 'No se pudo crear la caja', details: error.message });
  }
  return res.status(201).json({ success: true, data });
}

// 1. GET /api/cash/registers
export async function getRegisters(req: Request, res: Response) {
  const tenantId = req.tenantId;
  if (!tenantId) {
    return res.status(401).json({ success: false, error: 'Tenant requerido' });
  }

  const sucursalId = requireScopedBranch(req);
  const supabase = getTenantClient(tenantId);

  const { data, error } = await supabase
    .from('cash_registers')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('sucursal_id', sucursalId)
    .eq('is_active', true)
    .order('name');

  if (error) {
    return res.status(502).json({
      success: false,
      error: 'No se pudieron cargar las cajas',
      details: error.message,
    });
  }

  return res.json({ success: true, data: data ?? [] });
}

// 2. POST /api/cash/shifts/open
export async function openShift(req: Request, res: Response) {
  const tenantId = req.tenantId as string;
  const userId = req.user?.userId || req.user?.sub;
  const { cashRegisterId, initialCash } = req.body;

  if (!userId) return res.status(401).json({ error: 'User unauthorized' });
  if (!cashRegisterId) return res.status(400).json({ error: 'cashRegisterId is required' });

  const supabase = getTenantClient(tenantId);
  const sucursalId = requireScopedBranch(req);

  const { data: register, error: registerError } = await supabase
    .from('cash_registers')
    .select('id')
    .eq('tenant_id', tenantId)
    .eq('sucursal_id', sucursalId)
    .eq('id', cashRegisterId)
    .eq('is_active', true)
    .maybeSingle();
  if (registerError) return res.status(502).json({ error: 'No se pudo validar la caja', details: registerError.message });
  if (!register) return res.status(404).json({ error: 'Caja no encontrada en la sucursal activa' });

  // Check if user already has an active shift
  const existingActive = await findActiveShift(supabase, tenantId, userId, sucursalId);
  if (existingActive) {
    return res.status(400).json({ error: 'Ya tienes un turno de caja abierto.' });
  }

  const { data: newShift, error } = await supabase
    .from('cash_shifts')
    .insert({
      tenant_id: tenantId,
      cash_register_id: cashRegisterId,
      opened_by: userId,
      opened_at: new Date().toISOString(),
      initial_cash: Number(initialCash) || 0,
      status: 'open'
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(newShift);
}

// 3. GET /api/cash/shifts/active
export async function getActiveShift(req: Request, res: Response) {
  const tenantId = req.tenantId as string;
  const userId = req.user?.userId || req.user?.sub;

  if (!userId) return res.status(401).json({ error: 'User unauthorized' });

  const supabase = getTenantClient(tenantId);
  const sucursalId = requireScopedBranch(req);
  const activeShift = await findActiveShift(supabase, tenantId, userId, sucursalId);

  return res.json(activeShift || null);
}

// 4. POST /api/cash/shifts/close
const closeShiftSchema = z.object({
  finalCash: z.coerce.number().min(0),
  notes: z.string().trim().max(1000).optional(),
});

export async function closeShift(req: Request, res: Response) {
  const tenantId = req.tenantId as string;
  const userId = req.user?.userId || req.user?.sub;
  const parsed = closeShiftSchema.safeParse(req.body);

  if (!tenantId || !userId) {
    return res.status(401).json({
      success: false,
      error: 'Sesión inválida',
    });
  }

  if (!parsed.success) {
    return res.status(422).json({
      success: false,
      error: 'Arqueo inválido',
      details: parsed.error.flatten(),
    });
  }

  const supabase = getTenantClient(tenantId);
  const activeShift = await findActiveShift(supabase, tenantId, userId);

  if (!activeShift) {
    return res.status(409).json({
      success: false,
      error: 'No tienes ningún turno abierto.',
      code: 'ACTIVE_SHIFT_NOT_FOUND',
    });
  }

  // Atomic closing via RPC
  const { data: closedShift, error } = await supabase.rpc('close_cash_shift_atomic', {
    p_tenant_id: tenantId,
    p_shift_id: activeShift.id,
    p_user_id: userId,
    p_final_cash: parsed.data.finalCash,
    p_notes: parsed.data.notes || null
  });

  if (error) {
    return res.status(409).json({
      success: false,
      error: error.message,
      code: 'SHIFT_CLOSE_FAILED',
    });
  }

  return res.json({ success: true, data: closedShift });
}

// 5. POST /api/cash/sales
const saleSchema = z.object({
  customerName: z.string().trim().max(160).optional(),
  customerPhone: z.string().trim().max(30).optional(),
  paymentMethod: z.enum(['cash', 'card', 'transfer']),
  reference: z.string().trim().max(160).optional(),
  notes: z.string().trim().max(1000).optional(),
  idempotencyKey: z.string().trim().min(12).max(160),
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.coerce.number().positive(),
    })
  ).min(1).max(100),
});

export async function createSale(req: Request, res: Response) {
  const tenantId = req.tenantId as string;
  const userId = req.user?.userId || req.user?.sub;

  if (!tenantId || !userId) {
    return res.status(401).json({
      success: false,
      error: 'Sesión inválida',
      code: 'UNAUTHORIZED',
      requestId: req.requestId ?? null,
    });
  }

  const parsed = saleSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({
      success: false,
      error: 'Datos de venta inválidos',
      code: 'INVALID_SALE',
      details: parsed.error.flatten(),
      requestId: req.requestId ?? null,
    });
  }

  const supabase = getTenantClient(tenantId);
  const activeShift = await findActiveShift(supabase, tenantId, userId);

  if (!activeShift) {
    return res.status(409).json({
      success: false,
      error: 'Debes abrir caja antes de realizar una venta',
      code: 'ACTIVE_SHIFT_REQUIRED',
      requestId: req.requestId ?? null,
    });
  }

  const { data, error } = await supabase.rpc('execute_pos_sale_transaction', {
    p_tenant_id: tenantId,
    p_user_id: userId,
    p_cash_shift_id: activeShift.id,
    p_customer_name: parsed.data.customerName ?? '',
    p_customer_phone: parsed.data.customerPhone ?? '',
    p_payment_method: parsed.data.paymentMethod,
    p_reference: parsed.data.reference ?? '',
    p_notes: parsed.data.notes ?? '',
    p_items: parsed.data.items,
    p_idempotency_key: parsed.data.idempotencyKey,
  });

  if (error) {
    const conflict =
      /INSUFFICIENT_STOCK|CONCURRENT_STOCK_CONFLICT|ACTIVE_SHIFT_NOT_FOUND/.test(error.message);

    return res.status(conflict ? 409 : 502).json({
      success: false,
      error: error.message,
      code: conflict ? 'SALE_CONFLICT' : 'SALE_TRANSACTION_FAILED',
      requestId: req.requestId ?? null,
    });
  }

  return res.status(201).json({
    success: true,
    data,
    requestId: req.requestId ?? null,
  });
}

// 6. POST /api/cash/expenses
export async function createExpense(req: Request, res: Response) {
  const tenantId = req.tenantId as string;
  const userId = req.user?.userId || req.user?.sub;
  const { amount, category, description, receiptUrl } = req.body;

  if (!userId) return res.status(401).json({ error: 'User unauthorized' });

  const supabase = getTenantClient(tenantId);
  const activeShift = await findActiveShift(supabase, tenantId, userId);

  if (!activeShift) {
    return res.status(400).json({ error: 'No tienes un turno de caja activo para registrar egresos.' });
  }

  const { data: expense, error } = await supabase
    .from('cash_shift_expenses')
    .insert({
      tenant_id: tenantId,
      cash_shift_id: activeShift.id,
      amount: Number(amount),
      category: category,
      description: description,
      receipt_url: receiptUrl || null,
      created_by: userId
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(expense);
}

// 7. GET /api/cash/shifts/:shiftId
export async function getShiftDetails(req: Request, res: Response) {
  const tenantId = req.tenantId as string;
  const { shiftId } = req.params;


  const supabase = getTenantClient(tenantId);

  const shiftPromise = supabase.from('cash_shifts').select('*, cash_registers(*)').eq('id', shiftId).single();
  const salesPromise = supabase.from('sales').select('*').eq('cash_shift_id', shiftId);
  const paymentsPromise = supabase.from('customer_payments').select('*, service_orders(folio)').eq('cash_shift_id', shiftId);
  const expensesPromise = supabase.from('cash_shift_expenses').select('*').eq('cash_shift_id', shiftId);

  const [shiftRes, salesRes, paymentsRes, expensesRes] = await Promise.all([
    shiftPromise,
    salesPromise,
    paymentsPromise,
    expensesPromise
  ]);

  if (shiftRes.error) return res.status(500).json({ error: shiftRes.error.message });

  return res.json({
    shift: shiftRes.data,
    sales: salesRes.data || [],
    payments: paymentsRes.data || [],
    expenses: expensesRes.data || []
  });
}
