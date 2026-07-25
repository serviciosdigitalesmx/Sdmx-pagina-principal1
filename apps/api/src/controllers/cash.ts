import { Request, Response } from 'express';
import { getTenantClient } from '@white-label/database';

// Helper to get active shift
async function findActiveShift(supabase: any, tenantId: string, userId: string) {
  const { data: shift, error } = await supabase
    .from('cash_shifts')
    .select('*, cash_registers(id, name, sucursal_id)')
    .eq('tenant_id', tenantId)
    .eq('opened_by', userId)
    .eq('status', 'open')
    .maybeSingle();

  if (error) return null;
  return shift;
}

// 1. GET /api/cash/registers
export async function getRegisters(req: Request, res: Response) {
  const tenantId = req.headers['x-tenant-id'] as string;
  const sucursalId = req.headers['x-sucursal-id'] as string;

  if (!tenantId) return res.status(400).json({ error: 'Tenant ID required' });
  if (!sucursalId) return res.status(400).json({ error: 'Sucursal ID required' });

  const supabase = getTenantClient(tenantId);
  const { data, error } = await supabase
    .from('cash_registers')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('sucursal_id', sucursalId)
    .eq('is_active', true)
    .order('name');

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
}

// 2. POST /api/cash/shifts/open
export async function openShift(req: Request, res: Response) {
  const tenantId = req.headers['x-tenant-id'] as string;
  const userId = req.user?.userId || req.user?.sub;
  const { cashRegisterId, initialCash } = req.body;

  if (!tenantId) return res.status(400).json({ error: 'Tenant ID required' });
  if (!userId) return res.status(401).json({ error: 'User unauthorized' });
  if (!cashRegisterId) return res.status(400).json({ error: 'cashRegisterId is required' });

  const supabase = getTenantClient(tenantId);

  // Check if user already has an active shift
  const existingActive = await findActiveShift(supabase, tenantId, userId);
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
  const tenantId = req.headers['x-tenant-id'] as string;
  const userId = req.user?.userId || req.user?.sub;

  if (!tenantId) return res.status(400).json({ error: 'Tenant ID required' });
  if (!userId) return res.status(401).json({ error: 'User unauthorized' });

  const supabase = getTenantClient(tenantId);
  const activeShift = await findActiveShift(supabase, tenantId, userId);

  return res.json(activeShift || null);
}

// 4. POST /api/cash/shifts/close
export async function closeShift(req: Request, res: Response) {
  const tenantId = req.headers['x-tenant-id'] as string;
  const userId = req.user?.userId || req.user?.sub;
  const { finalCash, notes } = req.body;

  if (!tenantId) return res.status(400).json({ error: 'Tenant ID required' });
  if (!userId) return res.status(401).json({ error: 'User unauthorized' });

  const supabase = getTenantClient(tenantId);
  const activeShift = await findActiveShift(supabase, tenantId, userId);

  if (!activeShift) {
    return res.status(400).json({ error: 'No tienes ningún turno abierto.' });
  }

  // Calculate Expected Cash:
  // Initial cash + sales (cash) + customer_payments (cash) - expenses
  const salesPromise = supabase
    .from('sales')
    .select('total')
    .eq('cash_shift_id', activeShift.id)
    .eq('payment_method', 'cash');

  const paymentsPromise = supabase
    .from('customer_payments')
    .select('amount')
    .eq('cash_shift_id', activeShift.id)
    .eq('payment_method', 'cash');

  const expensesPromise = supabase
    .from('cash_shift_expenses')
    .select('amount')
    .eq('cash_shift_id', activeShift.id);

  const [salesRes, paymentsRes, expensesRes] = await Promise.all([
    salesPromise,
    paymentsPromise,
    expensesPromise
  ]);

  const salesCash = (salesRes.data || []).reduce((acc: number, curr: any) => acc + Number(curr.total), 0);
  const paymentsCash = (paymentsRes.data || []).reduce((acc: number, curr: any) => acc + Number(curr.amount), 0);
  const expensesCash = (expensesRes.data || []).reduce((acc: number, curr: any) => acc + Number(curr.amount), 0);

  const expectedCash = Number(activeShift.initial_cash) + salesCash + paymentsCash - expensesCash;
  const difference = Number(finalCash) - expectedCash;

  const { data: closedShift, error } = await supabase
    .from('cash_shifts')
    .update({
      status: 'closed',
      closed_by: userId,
      closed_at: new Date().toISOString(),
      final_cash: Number(finalCash),
      expected_cash: expectedCash,
      difference: difference,
      notes: notes || null
    })
    .eq('id', activeShift.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.json(closedShift);
}

// 5. POST /api/cash/sales
export async function createSale(req: Request, res: Response) {
  const tenantId = req.headers['x-tenant-id'] as string;
  const userId = req.user?.userId || req.user?.sub;
  const { customerName, customerPhone, items, paymentMethod, reference, notes } = req.body;

  if (!tenantId) return res.status(400).json({ error: 'Tenant ID required' });
  if (!userId) return res.status(401).json({ error: 'User unauthorized' });

  const supabase = getTenantClient(tenantId);
  const activeShift = await findActiveShift(supabase, tenantId, userId);

  if (!activeShift) {
    return res.status(400).json({ error: 'Debes abrir caja antes de realizar una venta.' });
  }

  const sucursalId = activeShift.cash_registers.sucursal_id;

  // Compute subtotal and total
  let subtotal = 0;
  const processedItems = [];

  for (const item of items) {
    const { data: product, error: prodErr } = await supabase
      .from('products')
      .select('id, name, sku, price')
      .eq('id', item.productId)
      .single();

    if (prodErr || !product) {
      return res.status(400).json({ error: `Producto no encontrado: ${item.productId}` });
    }

    // Verify stock in sucursal_inventory
    const { data: invItem, error: invErr } = await supabase
      .from('sucursal_inventory')
      .select('id, stock_current')
      .eq('tenant_id', tenantId)
      .eq('sucursal_id', sucursalId)
      .eq('product_id', product.id)
      .maybeSingle();

    if (invErr || !invItem || Number(invItem.stock_current ?? 0) < item.quantity) {
      return res.status(400).json({ error: `Stock insuficiente para ${product.name}. Disponible: ${invItem?.stock_current ?? 0}` });
    }

    const itemTotal = Number(product.price) * Number(item.quantity);
    subtotal += itemTotal;

    processedItems.push({
      product_id: product.id,
      sku_snapshot: product.sku,
      description: product.name,
      quantity: Number(item.quantity),
      unit_price: Number(product.price),
      total: itemTotal,
      inv_id: invItem.id,
      new_stock: Number(invItem.stock_current) - Number(item.quantity)
    });
  }

  // Create Sale record
  const { data: sale, error: saleErr } = await supabase
    .from('sales')
    .insert({
      tenant_id: tenantId,
      cash_shift_id: activeShift.id,
      customer_name: customerName || 'Venta Mostrador',
      customer_phone: customerPhone || null,
      subtotal: subtotal,
      total: subtotal,
      payment_method: paymentMethod,
      reference: reference || null,
      notes: notes || null,
      created_by: userId
    })
    .select()
    .single();

  if (saleErr) return res.status(500).json({ error: saleErr.message });

  // Create sale items and deduct stock
  for (const item of processedItems) {
    await supabase.from('sale_items').insert({
      sale_id: sale.id,
      product_id: item.product_id,
      sku_snapshot: item.sku_snapshot,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total: item.total
    });

    await supabase
      .from('sucursal_inventory')
      .update({ stock_current: item.new_stock })
      .eq('id', item.inv_id);
  }

  return res.status(201).json(sale);
}

// 6. POST /api/cash/expenses
export async function createExpense(req: Request, res: Response) {
  const tenantId = req.headers['x-tenant-id'] as string;
  const userId = req.user?.userId || req.user?.sub;
  const { amount, category, description, receiptUrl } = req.body;

  if (!tenantId) return res.status(400).json({ error: 'Tenant ID required' });
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
  const tenantId = req.headers['x-tenant-id'] as string;
  const { shiftId } = req.params;

  if (!tenantId) return res.status(400).json({ error: 'Tenant ID required' });

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
