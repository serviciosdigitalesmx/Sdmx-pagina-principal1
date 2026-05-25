import { getTenantClient } from '@white-label/database';

export type StockAlertRow = {
  id: string;
  tenant_id: string;
  branch_id: string | null;
  product_id: string;
  severity: string;
  acknowledged_by: string | null;
  acknowledged_at: string | null;
  created_at: string;
};

function getLowStockThreshold() {
  const parsed = Number(process.env.LOW_STOCK_THRESHOLD ?? 5);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 5;
}

export async function syncStockAlertForInventoryRow(params: {
  tenantId: string;
  productId: string;
  branchId?: string | null;
  stock: number;
}) {
  const supabase = getTenantClient(params.tenantId);
  const threshold = getLowStockThreshold();
  const isLowStock = Number(params.stock ?? 0) <= threshold;
  const branchId = params.branchId ?? null;

  const baseQuery = supabase
    .from('stock_alerts')
    .select('id')
    .eq('tenant_id', params.tenantId)
    .eq('product_id', params.productId);

  const lookup = branchId === null
    ? await baseQuery.is('branch_id', null).maybeSingle()
    : await baseQuery.eq('branch_id', branchId).maybeSingle();

  if (lookup.error) {
    throw lookup.error;
  }

  if (!isLowStock) {
    if (lookup.data) {
      const deleteQuery = supabase
        .from('stock_alerts')
        .delete()
        .eq('tenant_id', params.tenantId)
        .eq('product_id', params.productId);
      const { error } = branchId === null ? await deleteQuery.is('branch_id', null) : await deleteQuery.eq('branch_id', branchId);
      if (error) throw error;
    }
    return null;
  }

  const payload = {
    tenant_id: params.tenantId,
    branch_id: branchId,
    product_id: params.productId,
    severity: threshold <= 3 ? 'critical' : 'warning',
    acknowledged_by: null,
    acknowledged_at: null,
  };

  if (lookup.data) {
    const { error } = await supabase
      .from('stock_alerts')
      .update(payload)
      .eq('tenant_id', params.tenantId)
      .eq('product_id', params.productId)
      .is('branch_id', branchId)
      .select('id')
      .maybeSingle();
    if (error) throw error;
    return null;
  }

  const { error } = await supabase.from('stock_alerts').insert([payload]);
  if (error) throw error;
  return null;
}

export async function listStockAlerts(tenantId: string) {
  const supabase = getTenantClient(tenantId);
  const { data, error } = await supabase
    .from('stock_alerts')
    .select('id, tenant_id, branch_id, product_id, severity, acknowledged_by, acknowledged_at, created_at')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) throw error;
  return (data ?? []) as StockAlertRow[];
}

export async function acknowledgeStockAlert(params: { tenantId: string; alertId: string; userId?: string | null }) {
  const supabase = getTenantClient(params.tenantId);
  const { data, error } = await supabase
    .from('stock_alerts')
    .update({
      acknowledged_by: params.userId ?? null,
      acknowledged_at: new Date().toISOString(),
    })
    .eq('tenant_id', params.tenantId)
    .eq('id', params.alertId)
    .select('id')
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}
