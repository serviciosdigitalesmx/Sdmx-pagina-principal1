# AUDITORÍA COSTOS SERVICE_ORDERS - Fixi
Fecha: miércoles,  3 de junio de 2026, 09:38:35 CST
Repo: /Users/jesusvilla/Desktop/Sdmx-pagina-principal


---

## 1. Referencias backend a estimated_cost / final_cost / total_cost


---

## 2. Referencias frontend a estimatedCost / finalCost / totalCost / estimated_cost / final_cost / total_cost

apps/web-admin/src/app/dashboard/ordenes/page.tsx:34:  estimated_cost?: number;
apps/web-admin/src/app/dashboard/ordenes/page.tsx:35:  final_cost?: number;
apps/web-admin/src/app/dashboard/ordenes/page.tsx:86:  estimatedCost: "",
apps/web-admin/src/app/dashboard/ordenes/page.tsx:537:        estimatedCost: Number(form.estimatedCost || 0),
apps/web-admin/src/app/dashboard/ordenes/page.tsx:657:    const estimated = window.prompt("Costo estimado", String(detailOrder.estimated_cost ?? 0));
apps/web-admin/src/app/dashboard/ordenes/page.tsx:659:    const finalValue = window.prompt("Costo final", String(detailOrder.final_cost ?? detailOrder.estimated_cost ?? 0));
apps/web-admin/src/app/dashboard/ordenes/page.tsx:665:        estimatedCost: Number(estimated),
apps/web-admin/src/app/dashboard/ordenes/page.tsx:666:        finalCost: Number(finalValue),
apps/web-admin/src/app/dashboard/ordenes/page.tsx:907:                          Estimado ${Number(order.estimated_cost ?? 0).toFixed(2)} · Final ${Number(order.final_cost ?? 0).toFixed(2)}
apps/web-admin/src/app/dashboard/solicitudes/page.tsx:56:  const [estimatedCost, setEstimatedCost] = useState("0");
apps/web-admin/src/app/dashboard/solicitudes/page.tsx:192:        estimatedCost: Number(estimatedCost || 0),
apps/web-admin/src/app/dashboard/solicitudes/page.tsx:324:                      value={estimatedCost}
apps/web-admin/src/components/dashboard/operational-hub.tsx:13:  total_cost?: number;
apps/web-admin/src/components/dashboard/operational-hub.tsx:146:        <span className="font-semibold text-emerald-300">{formatMoney(order.total_cost)}</span>
apps/web-admin/src/components/dashboard/orders/order-detail-drawer.tsx:21:    estimated_cost?: number;
apps/web-admin/src/components/dashboard/orders/order-detail-drawer.tsx:22:    final_cost?: number;
apps/web-admin/src/components/dashboard/orders/order-detail-drawer.tsx:436:                        <div className="mt-2 text-sm text-zinc-300">${Number(order?.estimated_cost ?? 0).toFixed(2)}</div>
apps/web-admin/src/components/dashboard/orders/order-intake-modal.tsx:20:  estimatedCost: string;
apps/web-admin/src/components/dashboard/orders/order-intake-modal.tsx:123:  const stepThreeComplete = Boolean(form.promisedDate.trim() && form.estimatedCost.trim());
apps/web-admin/src/components/dashboard/orders/order-intake-modal.tsx:126:  const estimatedCostValue = Number(form.estimatedCost);
apps/web-admin/src/components/dashboard/orders/order-intake-modal.tsx:127:  const estimatedCostValid = Number.isFinite(estimatedCostValue) && estimatedCostValue >= 0;
apps/web-admin/src/components/dashboard/orders/order-intake-modal.tsx:132:    stepThreeComplete && !estimatedCostValid ? "Costo estimado inválido" : null,
apps/web-admin/src/components/dashboard/orders/order-intake-modal.tsx:343:                          <div className="flex justify-between"><span className="text-zinc-400">Costo estimado:</span><span className="font-semibold text-zinc-50">${Number(form.estimatedCost || 0).toFixed(2)}</span></div>
apps/web-admin/src/components/dashboard/orders/order-intake-modal.tsx:355:                        <input value={form.estimatedCost} onChange={(e) => onChange("estimatedCost", e.target.value)} type="number" min="0" step="0.01" className="w-full rounded-2xl border border-sky-400/30 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none" />
apps/web-admin/src/components/dashboard/orders/order-intake-modal.tsx:370:                        disabled={!stepThreeComplete || !estimatedCostValid || saving}
apps/web-admin/src/services/fixService.ts:532:  public async updateOrderFinancials(orderId: string, data: { estimatedCost?: number; finalCost?: number; receiptUrl?: string; note?: string }): Promise<JsonRecord> {
apps/web-admin/src/services/fixService.ts:1042:    estimatedCost: number;
apps/web-public/src/app/t/[tenantSlug]/portal/page.tsx:27:      total_cost?: number | null;
apps/web-public/src/components/public-portal-lookup.tsx:33:      total_cost?: number | null;
apps/web-public/src/components/public-portal-lookup.tsx:281:                      <p><span className="text-zinc-400">Total:</span> {typeof result.order.total_cost === "number" ? `$${result.order.total_cost.toFixed(2)} MXN` : "No disponible"}</p>
apps/web-clientes/src/lib/types.ts:82:      total_cost?: number | null;
apps/web-clientes/src/lib/types.ts:97:      estimated_cost?: number | null;
apps/web-clientes/src/lib/types.ts:98:      final_cost?: number | null;

---

## 3. Selects de service_orders en backend

apps/api/src/controllers/meta.ts:249:        default_workflow_key: String(industryRecord.default_workflow_key ?? industryRecord.defaultWorkflowKey ?? 'service_orders').trim() || 'service_orders',
apps/api/src/controllers/meta.ts:351:            workflow_key: String(record.workflow_key ?? 'service_orders').trim(),
apps/api/src/controllers/meta.ts:445:            workflow_key: String(record.workflow_key ?? record.workflowKey ?? 'service_orders').trim() || 'service_orders',
apps/api/src/controllers/requests.ts:144:      .from('service_orders')
apps/api/src/controllers/reports.ts:17:    let ordersQuery = supabase.from('service_orders').select('id, status, created_at, total_cost, final_cost, sucursal_id, promised_date, folio').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/orders.ts:344:  const statuses = config.statusOptions.service_orders ?? [];
apps/api/src/controllers/orders.ts:512:      .from('service_orders')
apps/api/src/controllers/orders.ts:578:      .from('service_orders')
apps/api/src/controllers/orders.ts:659:      .from('service_orders')
apps/api/src/controllers/orders.ts:708:      .from('service_orders')
apps/api/src/controllers/orders.ts:809:      .from('service_orders')
apps/api/src/controllers/orders.ts:882:        .from('service_orders')
apps/api/src/controllers/orders.ts:889:        .from('service_orders')
apps/api/src/controllers/orders.ts:915:        .from('service_orders')
apps/api/src/controllers/orders.ts:942:        .from('service_orders')
apps/api/src/controllers/orders.ts:957:        .from('service_orders')
apps/api/src/controllers/orders.ts:1040:      .from('service_orders')
apps/api/src/controllers/orders.ts:1066:      .from('service_orders')
apps/api/src/controllers/orders.ts:1124:      .from('service_orders')
apps/api/src/controllers/orders.ts:1147:      .from('service_orders')
apps/api/src/controllers/orders.ts:1165:      .from('service_orders')
apps/api/src/controllers/orders.ts:1228:      .from('service_orders')
apps/api/src/controllers/orders.ts:1246:      .from('service_orders')
apps/api/src/controllers/orders.ts:1276:        .from('service_orders')
apps/api/src/controllers/orders.ts:1323:      .from('service_orders')
apps/api/src/controllers/orders.ts:1349:      .from('service_orders')
apps/api/src/controllers/orders.ts:1423:      .from('service_orders')
apps/api/src/controllers/orders.ts:1480:      .from('service_orders')
apps/api/src/controllers/orders.ts:1498:      .from('service_orders')
apps/api/src/controllers/orders.ts:1522:      .from('service_orders')
apps/api/src/controllers/finance.ts:40:      .from('service_orders')
apps/api/src/controllers/public.ts:296:      .from('service_orders')
apps/api/src/controllers/public.ts:350:      .from('service_orders')
apps/api/src/controllers/public.ts:455:    const workflowStatuses = runtimeConfig.statusOptions.service_orders ?? [];
apps/api/src/services/operational-risk.ts:158:  const workflowKey = 'service_orders';
apps/api/src/services/operational-risk.ts:161:      .filter((entry: TenantWorkflowStatus) => (entry.workflow_key || 'service_orders') === workflowKey && entry.is_terminal)
apps/api/src/services/tenant-config.ts:41:  { workflow_key: 'service_orders', status_key: 'recibido', label: 'Recibido', tone: 'blue', sort_order: 1, is_default: true, is_terminal: false },
apps/api/src/services/tenant-config.ts:42:  { workflow_key: 'service_orders', status_key: 'en_espera_de_refaccion', label: 'En espera de refacción', tone: 'amber', sort_order: 2, is_default: false, is_terminal: false },
apps/api/src/services/tenant-config.ts:43:  { workflow_key: 'service_orders', status_key: 'diagnostico', label: 'Diagnóstico', tone: 'amber', sort_order: 3, is_default: false, is_terminal: false },
apps/api/src/services/tenant-config.ts:44:  { workflow_key: 'service_orders', status_key: 'cotizado', label: 'Cotizado', tone: 'violet', sort_order: 4, is_default: false, is_terminal: false },
apps/api/src/services/tenant-config.ts:45:  { workflow_key: 'service_orders', status_key: 'reparacion', label: 'En reparación', tone: 'orange', sort_order: 5, is_default: false, is_terminal: false },
apps/api/src/services/tenant-config.ts:46:  { workflow_key: 'service_orders', status_key: 'listo_para_entrega', label: 'Listo para entrega', tone: 'emerald', sort_order: 6, is_default: false, is_terminal: false },
apps/api/src/services/tenant-config.ts:47:  { workflow_key: 'service_orders', status_key: 'listo', label: 'Listo', tone: 'emerald', sort_order: 7, is_default: false, is_terminal: false },
apps/api/src/services/tenant-config.ts:48:  { workflow_key: 'service_orders', status_key: 'entregado', label: 'Entregado', tone: 'slate', sort_order: 8, is_default: false, is_terminal: true },
apps/api/src/services/tenant-config.ts:98:    workflow_key: extra.workflow_key ?? 'service_orders',
apps/api/src/services/tenant-config.ts:161:    templateField('service_orders', 'diagnosis_summary', 'Resumen del diagnóstico', 'textarea', [], { required: false, field_order: 1, placeholder: 'Hallazgos del técnico' }),
apps/api/src/services/tenant-config.ts:162:    templateField('service_orders', 'repair_estimate', 'Estimado de reparación', 'number', [], { required: false, field_order: 2, placeholder: 'Monto estimado' }),
apps/api/src/services/tenant-config.ts:163:    templateField('service_orders', 'parts_required', 'Refacciones necesarias', 'textarea', [], { required: false, field_order: 3, placeholder: 'Lista de partes y consumibles' }),
apps/api/src/services/tenant-config.ts:164:    templateField('service_orders', 'warranty_days', 'Días de garantía', 'number', [], { required: false, field_order: 4, placeholder: 'Ej. 30' }),
apps/api/src/services/tenant-config.ts:263:    { workflow_key: 'service_orders', status_key: 'solicitud_recibida', label: 'Solicitud recibida', tone: 'blue', sort_order: 1, is_default: true, is_terminal: false, metadata: {} },
apps/api/src/services/tenant-config.ts:264:    { workflow_key: 'service_orders', status_key: 'visita_programada', label: 'Visita programada', tone: 'amber', sort_order: 2, is_default: false, is_terminal: false, metadata: {} },
apps/api/src/services/tenant-config.ts:265:    { workflow_key: 'service_orders', status_key: 'en_revision', label: 'En revisión', tone: 'orange', sort_order: 3, is_default: false, is_terminal: false, metadata: {} },
apps/api/src/services/tenant-config.ts:266:    { workflow_key: 'service_orders', status_key: 'cotizacion_enviada', label: 'Cotización enviada', tone: 'violet', sort_order: 4, is_default: false, is_terminal: false, metadata: {} },
apps/api/src/services/tenant-config.ts:267:    { workflow_key: 'service_orders', status_key: 'autorizado', label: 'Autorizado', tone: 'sky', sort_order: 5, is_default: false, is_terminal: false, metadata: {} },
apps/api/src/services/tenant-config.ts:268:    { workflow_key: 'service_orders', status_key: 'servicio_programado', label: 'Servicio programado', tone: 'amber', sort_order: 6, is_default: false, is_terminal: false, metadata: {} },
apps/api/src/services/tenant-config.ts:269:    { workflow_key: 'service_orders', status_key: 'servicio_realizado', label: 'Servicio realizado', tone: 'emerald', sort_order: 7, is_default: false, is_terminal: false, metadata: {} },
apps/api/src/services/tenant-config.ts:270:    { workflow_key: 'service_orders', status_key: 'garantia_activa', label: 'Garantía activa', tone: 'blue', sort_order: 8, is_default: false, is_terminal: false, metadata: {} },
apps/api/src/services/tenant-config.ts:271:    { workflow_key: 'service_orders', status_key: 'cerrado', label: 'Cerrado', tone: 'slate', sort_order: 9, is_default: false, is_terminal: true, metadata: {} },
apps/api/src/services/tenant-config.ts:272:    { workflow_key: 'service_orders', status_key: 'cancelado', label: 'Cancelado', tone: 'rose', sort_order: 10, is_default: false, is_terminal: true, metadata: {} },
apps/api/src/services/tenant-config.ts:414:      defaultWorkflowKey: 'service_orders',
apps/api/src/services/tenant-config.ts:421:      defaultWorkflowKey: 'service_orders',
apps/api/src/services/tenant-config.ts:504:            workflow_key: 'service_orders',
apps/api/src/services/tenant-config.ts:686:        id: `${entry.workflow_key ?? 'service_orders'}:${entry.status_key}:${index}`,
apps/api/src/services/tenant-config.ts:699:    const workflowKey = entry.workflow_key || 'service_orders';

---

## 4. Escrituras insert/update hacia service_orders

apps/api/src/controllers/orders.ts:303:  const { error } = await supabase.from('service_order_documents').insert([row]);
apps/api/src/controllers/orders.ts:319:  const { error } = await supabase.from('service_order_events').insert([row]);
apps/api/src/controllers/orders.ts:513:      .insert([
apps/api/src/controllers/orders.ts:556:    const { error: checklistError } = await supabase.from('service_order_checklists').insert([
apps/api/src/controllers/orders.ts:579:      .update({
apps/api/src/controllers/orders.ts:890:        .update({
apps/api/src/controllers/orders.ts:958:        .update({
apps/api/src/controllers/orders.ts:1067:      .update({ evidence_metadata: appendEvidenceEntry((order as { evidence_metadata?: unknown }).evidence_metadata, noteEntry) })
apps/api/src/controllers/orders.ts:1148:      .update({
apps/api/src/controllers/orders.ts:1166:      .update({
apps/api/src/controllers/orders.ts:1247:      .update({
apps/api/src/controllers/orders.ts:1277:        .update({
apps/api/src/controllers/orders.ts:1350:      .update({
apps/api/src/controllers/orders.ts:1499:      .update({ warranty_until: warrantyUntil })
apps/api/src/controllers/orders.ts:1523:      .update({
apps/api/src/controllers/requests.ts:120:        .insert([
apps/api/src/controllers/requests.ts:145:      .insert([
apps/api/src/controllers/requests.ts:175:      .update({
apps/api/src/controllers/public.ts:244:      .insert([
apps/api/src/controllers/finance.ts:188:      .insert([

---

## 5. Bloques relevantes orders.ts

### Around estimated/final usage in orders.ts

#### apps/api/src/controllers/orders.ts:35

const noteRequestSchema = z.object({
  note: z.string().min(1),
  actorName: z.string().optional(),
});

const statusRequestSchema = z.object({
  status: orderStatusSchema,
  note: z.string().optional(),
});

const financialUpdateSchema = z.object({
  estimatedCost: z.coerce.number().min(0).optional(),
  finalCost: z.coerce.number().min(0).optional(),
  receiptUrl: z.string().url().optional().or(z.literal('')),
  note: z.string().optional(),
});

const orderDetailsUpdateSchema = z.object({
  clientName: z.string().min(1).optional(),
  clientPhone: z.string().min(7).optional(),
  clientEmail: z.string().email().optional().or(z.literal('')),
  deviceType: z.string().min(1).optional(),
  deviceModel: z.string().min(1).optional(),
  issue: z.string().min(1).optional(),

#### apps/api/src/controllers/orders.ts:36
const noteRequestSchema = z.object({
  note: z.string().min(1),
  actorName: z.string().optional(),
});

const statusRequestSchema = z.object({
  status: orderStatusSchema,
  note: z.string().optional(),
});

const financialUpdateSchema = z.object({
  estimatedCost: z.coerce.number().min(0).optional(),
  finalCost: z.coerce.number().min(0).optional(),
  receiptUrl: z.string().url().optional().or(z.literal('')),
  note: z.string().optional(),
});

const orderDetailsUpdateSchema = z.object({
  clientName: z.string().min(1).optional(),
  clientPhone: z.string().min(7).optional(),
  clientEmail: z.string().email().optional().or(z.literal('')),
  deviceType: z.string().min(1).optional(),
  deviceModel: z.string().min(1).optional(),
  issue: z.string().min(1).optional(),
  promisedDate: z.string().optional().or(z.literal('')),

#### apps/api/src/controllers/orders.ts:168
  };
}

// Esquema de validación para la creación de órdenes
const createOrderSchema = z.object({
  clientName: z.string().min(1, 'El nombre del cliente es requerido'),
  clientPhone: z.string().min(10, 'El teléfono debe tener al menos 10 dígitos'),
  clientEmail: z.string().email('Email inválido').optional().or(z.literal('')),
  deviceType: z.string().min(1, 'El tipo de dispositivo es requerido'),
  deviceModel: z.string().min(1, 'La marca y modelo son requeridos'),
  issue: z.string().min(1, 'La falla es requerida'),
  quoteFolio: z.string().optional(),
  estimatedCost: z.coerce.number().min(0).default(0),
  promisedDate: z.string().optional().or(z.literal('')),
  includeIva: z.coerce.boolean().default(false),
  checklist: z.object({
    hasCharger: z.coerce.boolean().default(false),
    screenCondition: z.string().optional().default(''),
    powersOn: z.coerce.boolean().default(false),
    backupRequired: z.coerce.boolean().default(false),
    notes: z.string().optional().default(''),
  }).default({
    hasCharger: false,
    screenCondition: '',
    powersOn: false,

#### apps/api/src/controllers/orders.ts:507
    const requestedSucursalId = isUuid(validatedData.sucursalId)
      ? validatedData.sucursalId
      : isUuid(scopeSucursalId)
        ? scopeSucursalId
        : null;

    if (scope?.role === 'manager' && isUuid(scopeSucursalId) && requestedSucursalId && requestedSucursalId !== scopeSucursalId) {
      return res.status(403).json({ error: 'Sucursal mismatch' });
    }

    const folioPrefix = process.env.ORDER_FOLIO_PREFIX ?? 'ORD';
    const newFolio = `${folioPrefix}-${Date.now().toString(36).toUpperCase()}`;
    const estimatedCost = Number.isFinite(validatedData.estimatedCost) ? validatedData.estimatedCost : 0;
    const ivaAmount = validatedData.includeIva ? Number((estimatedCost * 0.16).toFixed(2)) : 0;
    const finalCost = Number((estimatedCost + ivaAmount).toFixed(2));

    const { data, error } = await supabase
      .from('service_orders')
      .insert([
        {
          tenant_id: tenantId,
          sucursal_id: requestedSucursalId,
          folio: newFolio,
          public_token: randomUUID(),
          status: 'recibido',

#### apps/api/src/controllers/orders.ts:508
      ? validatedData.sucursalId
      : isUuid(scopeSucursalId)
        ? scopeSucursalId
        : null;

    if (scope?.role === 'manager' && isUuid(scopeSucursalId) && requestedSucursalId && requestedSucursalId !== scopeSucursalId) {
      return res.status(403).json({ error: 'Sucursal mismatch' });
    }

    const folioPrefix = process.env.ORDER_FOLIO_PREFIX ?? 'ORD';
    const newFolio = `${folioPrefix}-${Date.now().toString(36).toUpperCase()}`;
    const estimatedCost = Number.isFinite(validatedData.estimatedCost) ? validatedData.estimatedCost : 0;
    const ivaAmount = validatedData.includeIva ? Number((estimatedCost * 0.16).toFixed(2)) : 0;
    const finalCost = Number((estimatedCost + ivaAmount).toFixed(2));

    const { data, error } = await supabase
      .from('service_orders')
      .insert([
        {
          tenant_id: tenantId,
          sucursal_id: requestedSucursalId,
          folio: newFolio,
          public_token: randomUUID(),
          status: 'recibido',
          device_info: {

#### apps/api/src/controllers/orders.ts:509
      : isUuid(scopeSucursalId)
        ? scopeSucursalId
        : null;

    if (scope?.role === 'manager' && isUuid(scopeSucursalId) && requestedSucursalId && requestedSucursalId !== scopeSucursalId) {
      return res.status(403).json({ error: 'Sucursal mismatch' });
    }

    const folioPrefix = process.env.ORDER_FOLIO_PREFIX ?? 'ORD';
    const newFolio = `${folioPrefix}-${Date.now().toString(36).toUpperCase()}`;
    const estimatedCost = Number.isFinite(validatedData.estimatedCost) ? validatedData.estimatedCost : 0;
    const ivaAmount = validatedData.includeIva ? Number((estimatedCost * 0.16).toFixed(2)) : 0;
    const finalCost = Number((estimatedCost + ivaAmount).toFixed(2));

    const { data, error } = await supabase
      .from('service_orders')
      .insert([
        {
          tenant_id: tenantId,
          sucursal_id: requestedSucursalId,
          folio: newFolio,
          public_token: randomUUID(),
          status: 'recibido',
          device_info: {
            brand: validatedData.deviceModel,

#### apps/api/src/controllers/orders.ts:530
          public_token: randomUUID(),
          status: 'recibido',
          device_info: {
            brand: validatedData.deviceModel,
            model: validatedData.deviceModel,
            type: validatedData.deviceType,
            customer_name: validatedData.clientName,
            customer_phone: validatedData.clientPhone,
            customer_email: validatedData.clientEmail || null,
          },
          problem_description: validatedData.issue,
          metadata: validatedData.metadata ?? {},
          estimated_cost: estimatedCost,
          final_cost: finalCost,
          promised_date: validatedData.promisedDate || null,
          receipt_url: validatedData.receiptUrl || null,
          assigned_user_id: req.user?.role === 'technician' ? req.user.userId ?? null : null,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error.message);
      return res.status(502).json({

#### apps/api/src/controllers/orders.ts:531
          status: 'recibido',
          device_info: {
            brand: validatedData.deviceModel,
            model: validatedData.deviceModel,
            type: validatedData.deviceType,
            customer_name: validatedData.clientName,
            customer_phone: validatedData.clientPhone,
            customer_email: validatedData.clientEmail || null,
          },
          problem_description: validatedData.issue,
          metadata: validatedData.metadata ?? {},
          estimated_cost: estimatedCost,
          final_cost: finalCost,
          promised_date: validatedData.promisedDate || null,
          receipt_url: validatedData.receiptUrl || null,
          assigned_user_id: req.user?.role === 'technician' ? req.user.userId ?? null : null,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error.message);
      return res.status(502).json({
        error: 'Failed to persist order',

#### apps/api/src/controllers/orders.ts:626
          folio: newFolio,
          tenantId,
          assignedUserId: data.assigned_user_id,
        },
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Orden creada exitosamente',
      data: {
        ...data,
        final_cost: finalCost,
        estimated_cost: estimatedCost,
        receipt_url: validatedData.receiptUrl || null,
        sucursal_id: requestedSucursalId,
        public_token: data.public_token,
        pdf_attachment: pdfAttachment,
        attachments: pdfAttachment ? [pdfAttachment] : [],
        include_iva: validatedData.includeIva,
      },
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({

#### apps/api/src/controllers/orders.ts:627
          tenantId,
          assignedUserId: data.assigned_user_id,
        },
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Orden creada exitosamente',
      data: {
        ...data,
        final_cost: finalCost,
        estimated_cost: estimatedCost,
        receipt_url: validatedData.receiptUrl || null,
        sucursal_id: requestedSucursalId,
        public_token: data.public_token,
        pdf_attachment: pdfAttachment,
        attachments: pdfAttachment ? [pdfAttachment] : [],
        include_iva: validatedData.includeIva,
      },
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Datos de validación incorrectos',

#### apps/api/src/controllers/orders.ts:1229
    const orderId = req.params.id;
    const scope = getRequestScope(req);

    if (!tenantId) {
      return res.status(401).json({ error: 'Tenant context is required' });
    }

    const body = financialUpdateSchema.parse(req.body);
    const supabase = getTenantClient(tenantId);

    const { data: order, error: orderError } = await supabase
      .from('service_orders')
      .select('id, estimated_cost, final_cost, evidence_metadata')
      .eq('tenant_id', tenantId)
      .eq('id', orderId)
      .eq(
        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? scope.sucursalId : tenantId,
      )
      .single();

    if (orderError || !order) {
      return res.status(404).json({ error: 'Order not found', details: orderError?.message ?? 'Not found' });
    }


#### apps/api/src/controllers/orders.ts:1242
      .eq('tenant_id', tenantId)
      .eq('id', orderId)
      .eq(
        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? scope.sucursalId : tenantId,
      )
      .single();

    if (orderError || !order) {
      return res.status(404).json({ error: 'Order not found', details: orderError?.message ?? 'Not found' });
    }

    const nextEstimatedCost = typeof body.estimatedCost === 'number' ? body.estimatedCost : Number(order.estimated_cost ?? 0);
    const nextFinalCost = typeof body.finalCost === 'number' ? body.finalCost : Number(order.final_cost ?? nextEstimatedCost);

    const { data, error } = await supabase
      .from('service_orders')
      .update({
        estimated_cost: nextEstimatedCost,
        final_cost: nextFinalCost,
        receipt_url: body.receiptUrl || undefined,
      })
      .eq('tenant_id', tenantId)
      .eq('id', orderId)
      .select()

#### apps/api/src/controllers/orders.ts:1243
      .eq('id', orderId)
      .eq(
        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? scope.sucursalId : tenantId,
      )
      .single();

    if (orderError || !order) {
      return res.status(404).json({ error: 'Order not found', details: orderError?.message ?? 'Not found' });
    }

    const nextEstimatedCost = typeof body.estimatedCost === 'number' ? body.estimatedCost : Number(order.estimated_cost ?? 0);
    const nextFinalCost = typeof body.finalCost === 'number' ? body.finalCost : Number(order.final_cost ?? nextEstimatedCost);

    const { data, error } = await supabase
      .from('service_orders')
      .update({
        estimated_cost: nextEstimatedCost,
        final_cost: nextFinalCost,
        receipt_url: body.receiptUrl || undefined,
      })
      .eq('tenant_id', tenantId)
      .eq('id', orderId)
      .select()
      .single();

#### apps/api/src/controllers/orders.ts:1248
      .single();

    if (orderError || !order) {
      return res.status(404).json({ error: 'Order not found', details: orderError?.message ?? 'Not found' });
    }

    const nextEstimatedCost = typeof body.estimatedCost === 'number' ? body.estimatedCost : Number(order.estimated_cost ?? 0);
    const nextFinalCost = typeof body.finalCost === 'number' ? body.finalCost : Number(order.final_cost ?? nextEstimatedCost);

    const { data, error } = await supabase
      .from('service_orders')
      .update({
        estimated_cost: nextEstimatedCost,
        final_cost: nextFinalCost,
        receipt_url: body.receiptUrl || undefined,
      })
      .eq('tenant_id', tenantId)
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      return res.status(502).json({ error: 'Failed to update order financials', details: error.message });
    }


#### apps/api/src/controllers/orders.ts:1249

    if (orderError || !order) {
      return res.status(404).json({ error: 'Order not found', details: orderError?.message ?? 'Not found' });
    }

    const nextEstimatedCost = typeof body.estimatedCost === 'number' ? body.estimatedCost : Number(order.estimated_cost ?? 0);
    const nextFinalCost = typeof body.finalCost === 'number' ? body.finalCost : Number(order.final_cost ?? nextEstimatedCost);

    const { data, error } = await supabase
      .from('service_orders')
      .update({
        estimated_cost: nextEstimatedCost,
        final_cost: nextFinalCost,
        receipt_url: body.receiptUrl || undefined,
      })
      .eq('tenant_id', tenantId)
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      return res.status(502).json({ error: 'Failed to update order financials', details: error.message });
    }

    const noteEntry = body.note?.trim()

---

## 6. Bloques relevantes finance.ts


#### apps/api/src/controllers/finance.ts:17
const createExpenseSchema = z.object({
  sucursalId: z.string().min(1, 'sucursalId is required'),
  amount: z.number().positive('amount must be positive'),
  description: z.string().min(1, 'description is required'),
  category: z.string().min(1, 'category is required'),
  date: z.string().optional(),
});

function toDayKey(value?: string | null) {
  return value ? value.slice(0, 10) : new Date().toISOString().slice(0, 10);
}

function resolveOrderIncome(order: { total_cost?: number | null; final_cost?: number | null }) {
  return Number(order.total_cost ?? order.final_cost ?? 0);
}

async function assertSucursalOwnership(supabase: ReturnType<typeof getTenantClient>, tenantId: string, sucursalId: string) {
  const { data, error } = await supabase
    .from('sucursales')
    .select('id')
    .eq('tenant_id', tenantId)
    .eq('id', sucursalId)
    .maybeSingle();

  if (error) {

#### apps/api/src/controllers/finance.ts:18
  sucursalId: z.string().min(1, 'sucursalId is required'),
  amount: z.number().positive('amount must be positive'),
  description: z.string().min(1, 'description is required'),
  category: z.string().min(1, 'category is required'),
  date: z.string().optional(),
});

function toDayKey(value?: string | null) {
  return value ? value.slice(0, 10) : new Date().toISOString().slice(0, 10);
}

function resolveOrderIncome(order: { total_cost?: number | null; final_cost?: number | null }) {
  return Number(order.total_cost ?? order.final_cost ?? 0);
}

async function assertSucursalOwnership(supabase: ReturnType<typeof getTenantClient>, tenantId: string, sucursalId: string) {
  const { data, error } = await supabase
    .from('sucursales')
    .select('id')
    .eq('tenant_id', tenantId)
    .eq('id', sucursalId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);

#### apps/api/src/controllers/finance.ts:41
  if (error) {
    throw new Error(error.message);
  }

  return Boolean(data);
}

async function loadFinanceFacts(tenantId: string) {
  const supabase = getTenantClient(tenantId);
  const [ordersResult, expensesResult] = await Promise.all([
    supabase
      .from('service_orders')
      .select('id, tenant_id, sucursal_id, total_cost, final_cost, created_at, status')
      .eq('tenant_id', tenantId)
      .limit(1000),
    supabase
      .from('finances')
      .select('id, tenant_id, sucursal_id, balance, income, expense, created_at')
      .eq('tenant_id', tenantId)
      .limit(1000),
  ]);

  const errors = [ordersResult.error, expensesResult.error].filter(Boolean);
  if (errors.length > 0) {
    throw new Error(errors.map((item) => (item as Error).message ?? String(item)).join(', '));

#### apps/api/src/controllers/finance.ts:46
}

async function loadFinanceFacts(tenantId: string) {
  const supabase = getTenantClient(tenantId);
  const [ordersResult, expensesResult] = await Promise.all([
    supabase
      .from('service_orders')
      .select('id, tenant_id, sucursal_id, total_cost, final_cost, created_at, status')
      .eq('tenant_id', tenantId)
      .limit(1000),
    supabase
      .from('finances')
      .select('id, tenant_id, sucursal_id, balance, income, expense, created_at')
      .eq('tenant_id', tenantId)
      .limit(1000),
  ]);

  const errors = [ordersResult.error, expensesResult.error].filter(Boolean);
  if (errors.length > 0) {
    throw new Error(errors.map((item) => (item as Error).message ?? String(item)).join(', '));
  }

  return {
    orders: ordersResult.data ?? [],
    expenses: expensesResult.data ?? [],

#### apps/api/src/controllers/finance.ts:67

  return {
    orders: ordersResult.data ?? [],
    expenses: expensesResult.data ?? [],
  };
}

export const getBalance = async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId;
    if (!tenantId) return res.status(401).json({ error: 'Tenant context is required' });
    if (req.user?.role !== 'owner') {
      return res.status(403).json({ error: 'Only owner can access global balance' });
    }

    const scope = req.scope;
    const sucursalId = scope?.mode === 'branch' ? scope.sucursalId ?? '' : '';
    const { orders, expenses } = await loadFinanceFacts(tenantId);

    const filteredOrders = sucursalId
      ? orders.filter((order) => String((order as { sucursal_id?: string | null }).sucursal_id ?? '') === sucursalId)
      : orders;
    const filteredExpenses = sucursalId
      ? expenses.filter((expense) => String((expense as { sucursal_id?: string | null }).sucursal_id ?? '') === sucursalId)
      : expenses;

#### apps/api/src/controllers/finance.ts:81

    const scope = req.scope;
    const sucursalId = scope?.mode === 'branch' ? scope.sucursalId ?? '' : '';
    const { orders, expenses } = await loadFinanceFacts(tenantId);

    const filteredOrders = sucursalId
      ? orders.filter((order) => String((order as { sucursal_id?: string | null }).sucursal_id ?? '') === sucursalId)
      : orders;
    const filteredExpenses = sucursalId
      ? expenses.filter((expense) => String((expense as { sucursal_id?: string | null }).sucursal_id ?? '') === sucursalId)
      : expenses;

    const totalIncome = filteredOrders.reduce((sum, order) => sum + resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null }), 0);
    const totalExpense = filteredExpenses.reduce((sum, item) => sum + Number((item as { expense?: number }).expense ?? 0), 0);
    const totalBalance = Number((totalIncome - totalExpense).toFixed(2));

    const rows = [
      {
        id: `income-${tenantId}`,
        tenant_id: tenantId,
        balance: totalBalance,
        income: totalIncome,
        expense: totalExpense,
        created_at: new Date().toISOString(),
        type: 'summary',

#### apps/api/src/controllers/finance.ts:87
      ? orders.filter((order) => String((order as { sucursal_id?: string | null }).sucursal_id ?? '') === sucursalId)
      : orders;
    const filteredExpenses = sucursalId
      ? expenses.filter((expense) => String((expense as { sucursal_id?: string | null }).sucursal_id ?? '') === sucursalId)
      : expenses;

    const totalIncome = filteredOrders.reduce((sum, order) => sum + resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null }), 0);
    const totalExpense = filteredExpenses.reduce((sum, item) => sum + Number((item as { expense?: number }).expense ?? 0), 0);
    const totalBalance = Number((totalIncome - totalExpense).toFixed(2));

    const rows = [
      {
        id: `income-${tenantId}`,
        tenant_id: tenantId,
        balance: totalBalance,
        income: totalIncome,
        expense: totalExpense,
        created_at: new Date().toISOString(),
        type: 'summary',
      },
      ...filteredOrders.slice(0, 25).map((order) => ({
        id: String((order as { id?: string }).id ?? `${tenantId}-order`),
        tenant_id: tenantId,
        balance: resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null }),
        income: resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null }),

#### apps/api/src/controllers/finance.ts:89
    const filteredExpenses = sucursalId
      ? expenses.filter((expense) => String((expense as { sucursal_id?: string | null }).sucursal_id ?? '') === sucursalId)
      : expenses;

    const totalIncome = filteredOrders.reduce((sum, order) => sum + resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null }), 0);
    const totalExpense = filteredExpenses.reduce((sum, item) => sum + Number((item as { expense?: number }).expense ?? 0), 0);
    const totalBalance = Number((totalIncome - totalExpense).toFixed(2));

    const rows = [
      {
        id: `income-${tenantId}`,
        tenant_id: tenantId,
        balance: totalBalance,
        income: totalIncome,
        expense: totalExpense,
        created_at: new Date().toISOString(),
        type: 'summary',
      },
      ...filteredOrders.slice(0, 25).map((order) => ({
        id: String((order as { id?: string }).id ?? `${tenantId}-order`),
        tenant_id: tenantId,
        balance: resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null }),
        income: resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null }),
        expense: 0,
        created_at: String((order as { created_at?: string }).created_at ?? new Date().toISOString()),

#### apps/api/src/controllers/finance.ts:90
      ? expenses.filter((expense) => String((expense as { sucursal_id?: string | null }).sucursal_id ?? '') === sucursalId)
      : expenses;

    const totalIncome = filteredOrders.reduce((sum, order) => sum + resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null }), 0);
    const totalExpense = filteredExpenses.reduce((sum, item) => sum + Number((item as { expense?: number }).expense ?? 0), 0);
    const totalBalance = Number((totalIncome - totalExpense).toFixed(2));

    const rows = [
      {
        id: `income-${tenantId}`,
        tenant_id: tenantId,
        balance: totalBalance,
        income: totalIncome,
        expense: totalExpense,
        created_at: new Date().toISOString(),
        type: 'summary',
      },
      ...filteredOrders.slice(0, 25).map((order) => ({
        id: String((order as { id?: string }).id ?? `${tenantId}-order`),
        tenant_id: tenantId,
        balance: resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null }),
        income: resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null }),
        expense: 0,
        created_at: String((order as { created_at?: string }).created_at ?? new Date().toISOString()),
        type: 'order',

#### apps/api/src/controllers/finance.ts:98
      {
        id: `income-${tenantId}`,
        tenant_id: tenantId,
        balance: totalBalance,
        income: totalIncome,
        expense: totalExpense,
        created_at: new Date().toISOString(),
        type: 'summary',
      },
      ...filteredOrders.slice(0, 25).map((order) => ({
        id: String((order as { id?: string }).id ?? `${tenantId}-order`),
        tenant_id: tenantId,
        balance: resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null }),
        income: resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null }),
        expense: 0,
        created_at: String((order as { created_at?: string }).created_at ?? new Date().toISOString()),
        type: 'order',
      })),
      ...filteredExpenses.slice(0, 25).map((expense) => ({
        id: String((expense as { id?: string }).id ?? `${tenantId}-expense`),
        tenant_id: tenantId,
        balance: Number((expense as { balance?: number; expense?: number }).balance ?? 0),
        income: 0,
        expense: Number((expense as { expense?: number }).expense ?? 0),
        created_at: String((expense as { created_at?: string }).created_at ?? new Date().toISOString()),

#### apps/api/src/controllers/finance.ts:99
        id: `income-${tenantId}`,
        tenant_id: tenantId,
        balance: totalBalance,
        income: totalIncome,
        expense: totalExpense,
        created_at: new Date().toISOString(),
        type: 'summary',
      },
      ...filteredOrders.slice(0, 25).map((order) => ({
        id: String((order as { id?: string }).id ?? `${tenantId}-order`),
        tenant_id: tenantId,
        balance: resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null }),
        income: resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null }),
        expense: 0,
        created_at: String((order as { created_at?: string }).created_at ?? new Date().toISOString()),
        type: 'order',
      })),
      ...filteredExpenses.slice(0, 25).map((expense) => ({
        id: String((expense as { id?: string }).id ?? `${tenantId}-expense`),
        tenant_id: tenantId,
        balance: Number((expense as { balance?: number; expense?: number }).balance ?? 0),
        income: 0,
        expense: Number((expense as { expense?: number }).expense ?? 0),
        created_at: String((expense as { created_at?: string }).created_at ?? new Date().toISOString()),
        type: 'expense',

#### apps/api/src/controllers/finance.ts:107
      ...filteredOrders.slice(0, 25).map((order) => ({
        id: String((order as { id?: string }).id ?? `${tenantId}-order`),
        tenant_id: tenantId,
        balance: resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null }),
        income: resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null }),
        expense: 0,
        created_at: String((order as { created_at?: string }).created_at ?? new Date().toISOString()),
        type: 'order',
      })),
      ...filteredExpenses.slice(0, 25).map((expense) => ({
        id: String((expense as { id?: string }).id ?? `${tenantId}-expense`),
        tenant_id: tenantId,
        balance: Number((expense as { balance?: number; expense?: number }).balance ?? 0),
        income: 0,
        expense: Number((expense as { expense?: number }).expense ?? 0),
        created_at: String((expense as { created_at?: string }).created_at ?? new Date().toISOString()),
        type: 'expense',
      })),
    ].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));

    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error getting balance:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }

#### apps/api/src/controllers/finance.ts:108
        id: String((order as { id?: string }).id ?? `${tenantId}-order`),
        tenant_id: tenantId,
        balance: resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null }),
        income: resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null }),
        expense: 0,
        created_at: String((order as { created_at?: string }).created_at ?? new Date().toISOString()),
        type: 'order',
      })),
      ...filteredExpenses.slice(0, 25).map((expense) => ({
        id: String((expense as { id?: string }).id ?? `${tenantId}-expense`),
        tenant_id: tenantId,
        balance: Number((expense as { balance?: number; expense?: number }).balance ?? 0),
        income: 0,
        expense: Number((expense as { expense?: number }).expense ?? 0),
        created_at: String((expense as { created_at?: string }).created_at ?? new Date().toISOString()),
        type: 'expense',
      })),
    ].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));

    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error getting balance:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

#### apps/api/src/controllers/finance.ts:117
        id: String((expense as { id?: string }).id ?? `${tenantId}-expense`),
        tenant_id: tenantId,
        balance: Number((expense as { balance?: number; expense?: number }).balance ?? 0),
        income: 0,
        expense: Number((expense as { expense?: number }).expense ?? 0),
        created_at: String((expense as { created_at?: string }).created_at ?? new Date().toISOString()),
        type: 'expense',
      })),
    ].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));

    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error getting balance:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getCashflow = async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId;
    const scope = req.scope;
    const sucursalId = scope?.sucursalId ?? req.params.sucursalId;

    if (!tenantId) return res.status(401).json({ error: 'Tenant context is required' });
    if (!sucursalId) return res.status(400).json({ error: 'Missing sucursalId' });

#### apps/api/src/controllers/finance.ts:140
    if (!tenantId) return res.status(401).json({ error: 'Tenant context is required' });
    if (!sucursalId) return res.status(400).json({ error: 'Missing sucursalId' });

    const supabase = getTenantClient(tenantId);
    if (!(await assertSucursalOwnership(supabase, tenantId, sucursalId))) {
      return res.status(403).json({ error: 'Sucursal mismatch' });
    }

    const { orders, expenses } = await loadFinanceFacts(tenantId);
    const sucursalOrders = orders.filter((order) => String((order as { sucursal_id?: string | null }).sucursal_id ?? '') === sucursalId);
    const sucursalExpenses = expenses.filter((expense) => String((expense as { sucursal_id?: string | null }).sucursal_id ?? '') === sucursalId);

    const grouped = new Map<string, { id: string; tenant_id: string; sucursal_id: string; balance: number; income: number; expense: number; created_at: string }>();

    for (const order of sucursalOrders) {
      const day = toDayKey((order as { created_at?: string }).created_at ?? null);
      const current = grouped.get(day) ?? { id: `${sucursalId}-${day}`, tenant_id: tenantId, sucursal_id: sucursalId, balance: 0, income: 0, expense: 0, created_at: day };
      const income = resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null });
      current.income += income;
      current.balance += income;
      grouped.set(day, current);
    }

    for (const expense of sucursalExpenses) {
      const day = toDayKey((expense as { expense_date?: string; created_at?: string }).expense_date ?? (expense as { created_at?: string }).created_at ?? null);

#### apps/api/src/controllers/finance.ts:144
    if (!(await assertSucursalOwnership(supabase, tenantId, sucursalId))) {
      return res.status(403).json({ error: 'Sucursal mismatch' });
    }

    const { orders, expenses } = await loadFinanceFacts(tenantId);
    const sucursalOrders = orders.filter((order) => String((order as { sucursal_id?: string | null }).sucursal_id ?? '') === sucursalId);
    const sucursalExpenses = expenses.filter((expense) => String((expense as { sucursal_id?: string | null }).sucursal_id ?? '') === sucursalId);

    const grouped = new Map<string, { id: string; tenant_id: string; sucursal_id: string; balance: number; income: number; expense: number; created_at: string }>();

    for (const order of sucursalOrders) {
      const day = toDayKey((order as { created_at?: string }).created_at ?? null);
      const current = grouped.get(day) ?? { id: `${sucursalId}-${day}`, tenant_id: tenantId, sucursal_id: sucursalId, balance: 0, income: 0, expense: 0, created_at: day };
      const income = resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null });
      current.income += income;
      current.balance += income;
      grouped.set(day, current);
    }

    for (const expense of sucursalExpenses) {
      const day = toDayKey((expense as { expense_date?: string; created_at?: string }).expense_date ?? (expense as { created_at?: string }).created_at ?? null);
      const current = grouped.get(day) ?? { id: `${sucursalId}-${day}`, tenant_id: tenantId, sucursal_id: sucursalId, balance: 0, income: 0, expense: 0, created_at: day };
      const amount = Number((expense as { expense?: number }).expense ?? 0);
      current.expense += amount;
      current.balance -= amount;

#### apps/api/src/controllers/finance.ts:145
      return res.status(403).json({ error: 'Sucursal mismatch' });
    }

    const { orders, expenses } = await loadFinanceFacts(tenantId);
    const sucursalOrders = orders.filter((order) => String((order as { sucursal_id?: string | null }).sucursal_id ?? '') === sucursalId);
    const sucursalExpenses = expenses.filter((expense) => String((expense as { sucursal_id?: string | null }).sucursal_id ?? '') === sucursalId);

    const grouped = new Map<string, { id: string; tenant_id: string; sucursal_id: string; balance: number; income: number; expense: number; created_at: string }>();

    for (const order of sucursalOrders) {
      const day = toDayKey((order as { created_at?: string }).created_at ?? null);
      const current = grouped.get(day) ?? { id: `${sucursalId}-${day}`, tenant_id: tenantId, sucursal_id: sucursalId, balance: 0, income: 0, expense: 0, created_at: day };
      const income = resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null });
      current.income += income;
      current.balance += income;
      grouped.set(day, current);
    }

    for (const expense of sucursalExpenses) {
      const day = toDayKey((expense as { expense_date?: string; created_at?: string }).expense_date ?? (expense as { created_at?: string }).created_at ?? null);
      const current = grouped.get(day) ?? { id: `${sucursalId}-${day}`, tenant_id: tenantId, sucursal_id: sucursalId, balance: 0, income: 0, expense: 0, created_at: day };
      const amount = Number((expense as { expense?: number }).expense ?? 0);
      current.expense += amount;
      current.balance -= amount;
      grouped.set(day, current);

#### apps/api/src/controllers/finance.ts:146
    }

    const { orders, expenses } = await loadFinanceFacts(tenantId);
    const sucursalOrders = orders.filter((order) => String((order as { sucursal_id?: string | null }).sucursal_id ?? '') === sucursalId);
    const sucursalExpenses = expenses.filter((expense) => String((expense as { sucursal_id?: string | null }).sucursal_id ?? '') === sucursalId);

    const grouped = new Map<string, { id: string; tenant_id: string; sucursal_id: string; balance: number; income: number; expense: number; created_at: string }>();

    for (const order of sucursalOrders) {
      const day = toDayKey((order as { created_at?: string }).created_at ?? null);
      const current = grouped.get(day) ?? { id: `${sucursalId}-${day}`, tenant_id: tenantId, sucursal_id: sucursalId, balance: 0, income: 0, expense: 0, created_at: day };
      const income = resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null });
      current.income += income;
      current.balance += income;
      grouped.set(day, current);
    }

    for (const expense of sucursalExpenses) {
      const day = toDayKey((expense as { expense_date?: string; created_at?: string }).expense_date ?? (expense as { created_at?: string }).created_at ?? null);
      const current = grouped.get(day) ?? { id: `${sucursalId}-${day}`, tenant_id: tenantId, sucursal_id: sucursalId, balance: 0, income: 0, expense: 0, created_at: day };
      const amount = Number((expense as { expense?: number }).expense ?? 0);
      current.expense += amount;
      current.balance -= amount;
      grouped.set(day, current);
    }

#### apps/api/src/controllers/finance.ts:147

    const { orders, expenses } = await loadFinanceFacts(tenantId);
    const sucursalOrders = orders.filter((order) => String((order as { sucursal_id?: string | null }).sucursal_id ?? '') === sucursalId);
    const sucursalExpenses = expenses.filter((expense) => String((expense as { sucursal_id?: string | null }).sucursal_id ?? '') === sucursalId);

    const grouped = new Map<string, { id: string; tenant_id: string; sucursal_id: string; balance: number; income: number; expense: number; created_at: string }>();

    for (const order of sucursalOrders) {
      const day = toDayKey((order as { created_at?: string }).created_at ?? null);
      const current = grouped.get(day) ?? { id: `${sucursalId}-${day}`, tenant_id: tenantId, sucursal_id: sucursalId, balance: 0, income: 0, expense: 0, created_at: day };
      const income = resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null });
      current.income += income;
      current.balance += income;
      grouped.set(day, current);
    }

    for (const expense of sucursalExpenses) {
      const day = toDayKey((expense as { expense_date?: string; created_at?: string }).expense_date ?? (expense as { created_at?: string }).created_at ?? null);
      const current = grouped.get(day) ?? { id: `${sucursalId}-${day}`, tenant_id: tenantId, sucursal_id: sucursalId, balance: 0, income: 0, expense: 0, created_at: day };
      const amount = Number((expense as { expense?: number }).expense ?? 0);
      current.expense += amount;
      current.balance -= amount;
      grouped.set(day, current);
    }


#### apps/api/src/controllers/finance.ts:153

    for (const order of sucursalOrders) {
      const day = toDayKey((order as { created_at?: string }).created_at ?? null);
      const current = grouped.get(day) ?? { id: `${sucursalId}-${day}`, tenant_id: tenantId, sucursal_id: sucursalId, balance: 0, income: 0, expense: 0, created_at: day };
      const income = resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null });
      current.income += income;
      current.balance += income;
      grouped.set(day, current);
    }

    for (const expense of sucursalExpenses) {
      const day = toDayKey((expense as { expense_date?: string; created_at?: string }).expense_date ?? (expense as { created_at?: string }).created_at ?? null);
      const current = grouped.get(day) ?? { id: `${sucursalId}-${day}`, tenant_id: tenantId, sucursal_id: sucursalId, balance: 0, income: 0, expense: 0, created_at: day };
      const amount = Number((expense as { expense?: number }).expense ?? 0);
      current.expense += amount;
      current.balance -= amount;
      grouped.set(day, current);
    }

    const data = [...grouped.values()].sort((a, b) => b.created_at.localeCompare(a.created_at));
    return res.json({ success: true, data });
  } catch (error) {
    console.error('Error getting cashflow:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }

#### apps/api/src/controllers/finance.ts:156
      const current = grouped.get(day) ?? { id: `${sucursalId}-${day}`, tenant_id: tenantId, sucursal_id: sucursalId, balance: 0, income: 0, expense: 0, created_at: day };
      const income = resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null });
      current.income += income;
      current.balance += income;
      grouped.set(day, current);
    }

    for (const expense of sucursalExpenses) {
      const day = toDayKey((expense as { expense_date?: string; created_at?: string }).expense_date ?? (expense as { created_at?: string }).created_at ?? null);
      const current = grouped.get(day) ?? { id: `${sucursalId}-${day}`, tenant_id: tenantId, sucursal_id: sucursalId, balance: 0, income: 0, expense: 0, created_at: day };
      const amount = Number((expense as { expense?: number }).expense ?? 0);
      current.expense += amount;
      current.balance -= amount;
      grouped.set(day, current);
    }

    const data = [...grouped.values()].sort((a, b) => b.created_at.localeCompare(a.created_at));
    return res.json({ success: true, data });
  } catch (error) {
    console.error('Error getting cashflow:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const createExpense = async (req: Request, res: Response) => {

#### apps/api/src/controllers/finance.ts:192
    }

    if (scope?.mode === 'branch' && tokenSucursalId && body.sucursalId !== tokenSucursalId) {
      return res.status(403).json({ error: 'Sucursal mismatch' });
    }

    const { data, error } = await supabase
      .from('finances')
      .insert([
        {
          tenant_id: tenantId,
          sucursal_id: body.sucursalId,
          balance: Number((-body.amount).toFixed(2)),
          income: 0,
          expense: body.amount,
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(502).json({ error: 'Failed to create expense', details: error.message });
    }

    return res.status(201).json({ success: true, data });

#### apps/api/src/controllers/finance.ts:193

    if (scope?.mode === 'branch' && tokenSucursalId && body.sucursalId !== tokenSucursalId) {
      return res.status(403).json({ error: 'Sucursal mismatch' });
    }

    const { data, error } = await supabase
      .from('finances')
      .insert([
        {
          tenant_id: tenantId,
          sucursal_id: body.sucursalId,
          balance: Number((-body.amount).toFixed(2)),
          income: 0,
          expense: body.amount,
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(502).json({ error: 'Failed to create expense', details: error.message });
    }

    return res.status(201).json({ success: true, data });
  } catch (error) {

---

## 7. Bloques relevantes reports.ts


#### apps/api/src/controllers/reports.ts:17
  try {
    const tenantId = req.tenantId;
    const scope = req.scope;
    const requestedSucursalId = scope?.requestedSucursalId ?? '';
    const effectiveSucursalId = scope?.mode === 'branch' ? scope.sucursalId ?? requestedSucursalId : '';

    if (!tenantId) {
      return res.status(401).json({ error: 'Tenant context is required' });
    }

    const supabase = getTenantClient(tenantId);

    let ordersQuery = supabase.from('service_orders').select('id, status, created_at, total_cost, final_cost, sucursal_id, promised_date, folio').eq('tenant_id', tenantId).limit(500);
    let customersQuery = supabase.from('customers').select('id').eq('tenant_id', tenantId).limit(500);
    let inventoryQuery = supabase.from('sucursal_inventory').select('id, stock_current, product_id, sucursal_id, products:product_id (id, cost)').eq('tenant_id', tenantId).limit(500);
    let financeQuery = supabase.from('finances').select('id, balance, income, expense, created_at, sucursal_id').eq('tenant_id', tenantId).limit(500);
    let requestsQuery = supabase.from('service_requests').select('id, balance_amount, status, created_at').eq('tenant_id', tenantId).limit(500);
    let usersQuery = supabase.from('users').select('id, full_name, role, sucursal_id').eq('tenant_id', tenantId).limit(500);
    let movementsQuery = supabase
      .from('inventory_movements')
      .select('id, tenant_id, sucursal_id, product_id, service_order_id, movement_type, quantity, created_at, products:product_id (id, sku, name)')
      .eq('tenant_id', tenantId)
      .limit(1000);

    if (effectiveSucursalId) {

#### apps/api/src/controllers/reports.ts:20
    const requestedSucursalId = scope?.requestedSucursalId ?? '';
    const effectiveSucursalId = scope?.mode === 'branch' ? scope.sucursalId ?? requestedSucursalId : '';

    if (!tenantId) {
      return res.status(401).json({ error: 'Tenant context is required' });
    }

    const supabase = getTenantClient(tenantId);

    let ordersQuery = supabase.from('service_orders').select('id, status, created_at, total_cost, final_cost, sucursal_id, promised_date, folio').eq('tenant_id', tenantId).limit(500);
    let customersQuery = supabase.from('customers').select('id').eq('tenant_id', tenantId).limit(500);
    let inventoryQuery = supabase.from('sucursal_inventory').select('id, stock_current, product_id, sucursal_id, products:product_id (id, cost)').eq('tenant_id', tenantId).limit(500);
    let financeQuery = supabase.from('finances').select('id, balance, income, expense, created_at, sucursal_id').eq('tenant_id', tenantId).limit(500);
    let requestsQuery = supabase.from('service_requests').select('id, balance_amount, status, created_at').eq('tenant_id', tenantId).limit(500);
    let usersQuery = supabase.from('users').select('id, full_name, role, sucursal_id').eq('tenant_id', tenantId).limit(500);
    let movementsQuery = supabase
      .from('inventory_movements')
      .select('id, tenant_id, sucursal_id, product_id, service_order_id, movement_type, quantity, created_at, products:product_id (id, sku, name)')
      .eq('tenant_id', tenantId)
      .limit(1000);

    if (effectiveSucursalId) {
      ordersQuery = ordersQuery.eq('sucursal_id', effectiveSucursalId);
      inventoryQuery = inventoryQuery.eq('sucursal_id', effectiveSucursalId);
      financeQuery = financeQuery.eq('sucursal_id', effectiveSucursalId);

#### apps/api/src/controllers/reports.ts:103
        return acc;
      }, {});

    const statusCountsWeek = orders
      .filter((order) => withinWeek((order as { created_at?: string | null }).created_at))
      .reduce<Record<string, number>>((acc, order) => {
        const status = String((order as { status?: string }).status ?? 'unknown').toLowerCase();
        acc[status] = (acc[status] ?? 0) + 1;
        return acc;
      }, {});

    const totalIncome = orders.reduce(
      (sum, order) => sum + Number((order as { total_cost?: number | null; final_cost?: number | null }).total_cost ?? (order as { total_cost?: number | null; final_cost?: number | null }).final_cost ?? 0),
      0,
    );
    const totalExpense = finances.reduce((sum, item) => sum + Number((item as { expense?: number }).expense ?? 0), 0);
    const totalBalance = Number((totalIncome - totalExpense).toFixed(2));
    const lowStockCount = inventory.filter((item) => Number((item as { stock_current?: number }).stock_current ?? 0) <= Number(process.env.LOW_STOCK_THRESHOLD ?? 5)).length;
    const productivity = orders.length > 0 ? Number((orders.filter((order) => String((order as { status?: string }).status ?? '').toLowerCase().includes('entreg')).length / orders.length * 100).toFixed(2)) : 0;
    const inventoryValuation = inventory.reduce((sum, item) => {
      const stock = Number((item as { stock_current?: number }).stock_current ?? 0);
      const productCost = Number(((item as { products?: { cost?: number | null } }).products?.cost ?? 0));
      return sum + (stock * productCost);
    }, 0);
    const accountsReceivable = requests.reduce((sum, item) => sum + Number((item as { balance_amount?: number }).balance_amount ?? 0), 0);

---

## 8. Bloques relevantes public.ts


#### apps/api/src/controllers/public.ts:297

  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid query', details: parsed.error.flatten() });
  }

  try {
    const { tenantSlug, folio, email } = parsed.data;
    const tenant = await resolveTenantIdBySlug(tenantSlug);
    const runtimeConfig = await loadTenantRuntimeConfig(tenant.id);
    const supabase = getTenantClient(tenant.id);
    const { data, error } = await supabase
      .from('service_orders')
      .select('id, tenant_id, folio, status, total_cost, created_at, device_info, problem_description, serial_number, receipt_url, estimated_cost, final_cost, metadata')
      .eq('tenant_id', tenant.id)
      .eq('folio', folio)
      .maybeSingle();

    if (error) {
      return res.status(502).json({ error: 'Failed to query order', details: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'No encontramos tu reparación', details: 'Order not found' });
    }


#### apps/api/src/controllers/public.ts:351
    return res.status(400).json({ error: 'Invalid params', details: parsed.error.flatten() });
  }

  try {
    const { tenantSlug, folio } = parsed.data;
    const tenant = await resolveTenantIdBySlug(tenantSlug);
    const runtimeConfig = await loadTenantRuntimeConfig(tenant.id);
    const supabase = getTenantClient(tenant.id);
    const searchValue = folio.trim();

    const { data, error } = await supabase
      .from('service_orders')
      .select('id, tenant_id, folio, status, total_cost, created_at, updated_at, promised_date, device_info, problem_description, serial_number, receipt_url, estimated_cost, final_cost, evidence_metadata, metadata')
      .eq('tenant_id', tenant.id)
      .or(`folio.eq.${searchValue},public_token.eq.${searchValue}`)
      .maybeSingle();

    if (error || !data) {
      return res.status(404).json({ error: 'No encontramos una orden con ese folio', details: error?.message });
    }

    const { data: documents, error: documentsError } = await supabase
      .from('service_order_documents')
      .select('id, file_name, file_type, public_url, mime_type, created_at, source')
      .eq('tenant_id', tenant.id)

---

## 9. Bloques relevantes requests.ts


#### apps/api/src/controllers/requests.ts:6
import { Request, Response } from 'express';
import { z } from 'zod';
import { getTenantClient } from '@white-label/database';

const convertRequestSchema = z.object({
  estimatedCost: z.coerce.number().min(0).default(0),
  deviceType: z.string().min(1).optional(),
  deviceModel: z.string().min(1).optional(),
  issue: z.string().min(1).optional(),
  createCustomer: z.coerce.boolean().default(true),
});

function normalizeRequestStatus(status?: string | null) {
  const value = String(status ?? '').toLowerCase();
  if (value.includes('revis')) return 'en_revision';
  if (value.includes('conv')) return 'convertida';
  if (value.includes('rech')) return 'rechazada';
  return 'pendiente';

#### apps/api/src/controllers/requests.ts:140
        .select('id')
        .single();

      if (customerError || !customerData) {
        return res.status(502).json({ error: 'Failed to create customer from request', details: customerError?.message ?? 'Unknown error' });
      }

      customerId = customerData.id;
    }

    const folioPrefix = process.env.ORDER_FOLIO_PREFIX ?? 'ORD';
    const nextFolio = `ORD-${Date.now().toString(36).toUpperCase()}`;
    const estimatedCost = Number.isFinite(body.estimatedCost) ? body.estimatedCost : Number((requestRow.quoted_total ?? 0) || 0);
    const finalCost = Number((estimatedCost || 0).toFixed(2));

    const { data: orderData, error: orderError } = await supabase
      .from('service_orders')
      .insert([
        {
          tenant_id: tenantId,
          customer_id: customerId,
          folio: nextFolio.replace('ORD-', `${folioPrefix}-`),
          status: 'recibido',
          device_info: {
            customer_name: requestRow.customer_name,

#### apps/api/src/controllers/requests.ts:141
        .single();

      if (customerError || !customerData) {
        return res.status(502).json({ error: 'Failed to create customer from request', details: customerError?.message ?? 'Unknown error' });
      }

      customerId = customerData.id;
    }

    const folioPrefix = process.env.ORDER_FOLIO_PREFIX ?? 'ORD';
    const nextFolio = `ORD-${Date.now().toString(36).toUpperCase()}`;
    const estimatedCost = Number.isFinite(body.estimatedCost) ? body.estimatedCost : Number((requestRow.quoted_total ?? 0) || 0);
    const finalCost = Number((estimatedCost || 0).toFixed(2));

    const { data: orderData, error: orderError } = await supabase
      .from('service_orders')
      .insert([
        {
          tenant_id: tenantId,
          customer_id: customerId,
          folio: nextFolio.replace('ORD-', `${folioPrefix}-`),
          status: 'recibido',
          device_info: {
            customer_name: requestRow.customer_name,
            customer_phone: requestRow.customer_phone,

#### apps/api/src/controllers/requests.ts:161
          folio: nextFolio.replace('ORD-', `${folioPrefix}-`),
          status: 'recibido',
          device_info: {
            customer_name: requestRow.customer_name,
            customer_phone: requestRow.customer_phone,
            customer_email: requestRow.customer_email,
            type: body.deviceType || requestRow.device_type || '',
            brand: body.deviceModel || requestRow.device_model || '',
            model: body.deviceModel || requestRow.device_model || '',
          },
          problem_description: body.issue || requestRow.issue_description || '',
          metadata: typeof requestRow.metadata === 'object' && requestRow.metadata ? requestRow.metadata : {},
          estimated_cost: estimatedCost,
          final_cost: finalCost,
          receipt_url: null,
        },
      ])
      .select()
      .single();

    if (orderError || !orderData) {
      return res.status(502).json({ error: 'Failed to convert request to order', details: orderError?.message ?? 'Unknown error' });
    }

    const { error: updateRequestError } = await supabase

#### apps/api/src/controllers/requests.ts:162
          status: 'recibido',
          device_info: {
            customer_name: requestRow.customer_name,
            customer_phone: requestRow.customer_phone,
            customer_email: requestRow.customer_email,
            type: body.deviceType || requestRow.device_type || '',
            brand: body.deviceModel || requestRow.device_model || '',
            model: body.deviceModel || requestRow.device_model || '',
          },
          problem_description: body.issue || requestRow.issue_description || '',
          metadata: typeof requestRow.metadata === 'object' && requestRow.metadata ? requestRow.metadata : {},
          estimated_cost: estimatedCost,
          final_cost: finalCost,
          receipt_url: null,
        },
      ])
      .select()
      .single();

    if (orderError || !orderData) {
      return res.status(502).json({ error: 'Failed to convert request to order', details: orderError?.message ?? 'Unknown error' });
    }

    const { error: updateRequestError } = await supabase
      .from('service_requests')

---

## 10. Migraciones service_orders y costos

supabase/migrations/20260530143000_add_public_token_to_service_orders.sql:1:alter table if exists public.service_orders
supabase/migrations/20260530143000_add_public_token_to_service_orders.sql:4:update public.service_orders
supabase/migrations/20260530143000_add_public_token_to_service_orders.sql:8:alter table public.service_orders
supabase/migrations/20260530143000_add_public_token_to_service_orders.sql:11:alter table public.service_orders
supabase/migrations/20260530143000_add_public_token_to_service_orders.sql:14:create unique index if not exists service_orders_tenant_public_token_uidx
supabase/migrations/20260530143000_add_public_token_to_service_orders.sql:15:  on public.service_orders (tenant_id, public_token);
supabase/migrations/20260530121000_add_assigned_user_to_service_orders.sql:3:alter table public.service_orders
supabase/migrations/20260530121000_add_assigned_user_to_service_orders.sql:6:create index if not exists service_orders_tenant_assigned_idx
supabase/migrations/20260530121000_add_assigned_user_to_service_orders.sql:7:  on public.service_orders (tenant_id, assigned_user_id, created_at desc);
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:20:-- service_orders
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:21:alter table if exists public.service_orders
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:24:update public.service_orders
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:29:create index if not exists service_orders_tenant_sucursal_idx
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:30:  on public.service_orders (tenant_id, sucursal_id);
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:32:alter table public.service_orders
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:33:  drop constraint if exists service_orders_sucursal_id_fkey;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:35:alter table public.service_orders
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:36:  add constraint service_orders_sucursal_id_fkey
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:41:drop trigger if exists trg_service_orders_sync_sucursal_branch on public.service_orders;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:42:create trigger trg_service_orders_sync_sucursal_branch
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:43:before insert or update on public.service_orders
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:11:  default_workflow_key text not null default 'service_orders',
supabase/migrations/20260527050000_tenant_field_definitions_phase2.sql:42:alter table public.service_orders
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:13:create index if not exists service_orders_tenant_promised_status_idx
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:14:  on public.service_orders (tenant_id, promised_date, status);
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:19:  service_order_id uuid not null references public.service_orders(id) on delete cascade,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:35:  service_order_id uuid references public.service_orders(id) on delete set null,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:95:  service_order_id uuid references public.service_orders(id) on delete set null,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:125:  payment_amount numeric(12,2);
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:148:      payment_amount := coalesce(nullif(new.final_cost, 0), nullif(new.estimated_cost, 0), 0);
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:180:          payment_amount,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:197:drop trigger if exists trg_service_orders_status_audit_and_payment on public.service_orders;
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:198:create trigger trg_service_orders_status_audit_and_payment
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:199:after update of status on public.service_orders
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:8:update public.service_orders
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:25:drop trigger if exists trg_service_orders_sync_sucursal_branch on public.service_orders;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:31:alter table public.service_orders
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:32:  drop constraint if exists service_orders_branch_id_fkey;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:44:alter table public.service_orders
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:27:  related_service_order_id uuid references public.service_orders(id) on delete set null,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:63:  service_order_id uuid references public.service_orders(id) on delete set null,
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:17:drop trigger if exists trg_service_orders_sync_sucursal_branch on public.service_orders;
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:23:alter table public.service_orders
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:24:  drop constraint if exists service_orders_branch_id_fkey;
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:36:alter table public.service_orders
supabase/migrations/20260525021500_relax_service_order_status_constraint.sql:1:alter table public.service_orders
supabase/migrations/20260525021500_relax_service_order_status_constraint.sql:2:  drop constraint if exists service_orders_status_check;
supabase/migrations/20260525021500_relax_service_order_status_constraint.sql:4:alter table public.service_orders
supabase/migrations/20260525021500_relax_service_order_status_constraint.sql:5:  add constraint service_orders_status_check
supabase/migrations/20260514133525_remote_schema.sql:9:drop trigger if exists "trg_service_orders_updated_at" on "public"."service_orders";
supabase/migrations/20260514133525_remote_schema.sql:30:drop policy "service_orders_delete_owner_manager" on "public"."service_orders";
supabase/migrations/20260514133525_remote_schema.sql:31:drop policy "service_orders_select" on "public"."service_orders";
supabase/migrations/20260514133525_remote_schema.sql:32:drop policy "service_orders_update_owner_manager" on "public"."service_orders";
supabase/migrations/20260514133525_remote_schema.sql:33:drop policy "service_orders_update_technician" on "public"."service_orders";
supabase/migrations/20260514133525_remote_schema.sql:34:drop policy "service_orders_write_owner_manager" on "public"."service_orders";
supabase/migrations/20260514133525_remote_schema.sql:464:alter table "public"."service_orders" drop constraint "service_orders_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:465:alter table "public"."service_orders" drop constraint "service_orders_created_by_fkey";
supabase/migrations/20260514133525_remote_schema.sql:466:alter table "public"."service_orders" drop constraint "service_orders_service_request_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:467:alter table "public"."service_orders" drop constraint "service_orders_updated_by_fkey";
supabase/migrations/20260514133525_remote_schema.sql:488:alter table "public"."service_orders" drop constraint "service_orders_customer_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:489:alter table "public"."service_orders" drop constraint "service_orders_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:532:drop index if exists "public"."service_orders_tenant_branch_idx";
supabase/migrations/20260514133525_remote_schema.sql:533:drop index if exists "public"."service_orders_tenant_folio_uidx";
supabase/migrations/20260514133525_remote_schema.sql:534:drop index if exists "public"."service_orders_tenant_status_idx";
supabase/migrations/20260514133525_remote_schema.sql:592:alter table "public"."service_orders" drop column "archived_at";
supabase/migrations/20260514133525_remote_schema.sql:593:alter table "public"."service_orders" drop column "branch_id";
supabase/migrations/20260514133525_remote_schema.sql:594:alter table "public"."service_orders" drop column "caso_resolucion_tecnica";
supabase/migrations/20260514133525_remote_schema.sql:595:alter table "public"."service_orders" drop column "completed_at";
supabase/migrations/20260514133525_remote_schema.sql:596:alter table "public"."service_orders" drop column "created_by";
supabase/migrations/20260514133525_remote_schema.sql:597:alter table "public"."service_orders" drop column "delivered_at";
supabase/migrations/20260514133525_remote_schema.sql:598:alter table "public"."service_orders" drop column "device_brand";
supabase/migrations/20260514133525_remote_schema.sql:599:alter table "public"."service_orders" drop column "device_model";
supabase/migrations/20260514133525_remote_schema.sql:600:alter table "public"."service_orders" drop column "device_type";
supabase/migrations/20260514133525_remote_schema.sql:601:alter table "public"."service_orders" drop column "estimated_cost";
supabase/migrations/20260514133525_remote_schema.sql:602:alter table "public"."service_orders" drop column "final_cost";
supabase/migrations/20260514133525_remote_schema.sql:603:alter table "public"."service_orders" drop column "folio";
supabase/migrations/20260514133525_remote_schema.sql:604:alter table "public"."service_orders" drop column "internal_diagnosis";
supabase/migrations/20260514133525_remote_schema.sql:605:alter table "public"."service_orders" drop column "priority";
supabase/migrations/20260514133525_remote_schema.sql:606:alter table "public"."service_orders" drop column "promised_date";
supabase/migrations/20260514133525_remote_schema.sql:607:alter table "public"."service_orders" drop column "received_at";
supabase/migrations/20260514133525_remote_schema.sql:608:alter table "public"."service_orders" drop column "reported_issue";
supabase/migrations/20260514133525_remote_schema.sql:609:alter table "public"."service_orders" drop column "service_request_id";
supabase/migrations/20260514133525_remote_schema.sql:610:alter table "public"."service_orders" drop column "updated_at";
supabase/migrations/20260514133525_remote_schema.sql:611:alter table "public"."service_orders" drop column "updated_by";
supabase/migrations/20260514133525_remote_schema.sql:612:alter table "public"."service_orders" add column "accessories" text;
supabase/migrations/20260514133525_remote_schema.sql:613:alter table "public"."service_orders" add column "device_info" jsonb not null;
supabase/migrations/20260514133525_remote_schema.sql:614:alter table "public"."service_orders" add column "evidence_metadata" jsonb default '[]'::jsonb;
supabase/migrations/20260514133525_remote_schema.sql:615:alter table "public"."service_orders" add column "internal_notes" text;
supabase/migrations/20260514133525_remote_schema.sql:616:alter table "public"."service_orders" add column "problem_description" text not null;
supabase/migrations/20260514133525_remote_schema.sql:617:alter table "public"."service_orders" add column "total_cost" numeric(12,2) default 0;
supabase/migrations/20260514133525_remote_schema.sql:618:alter table "public"."service_orders" add column "warranty_until" timestamp with time zone;
supabase/migrations/20260514133525_remote_schema.sql:619:alter table "public"."service_orders" alter column "created_at" set default now();
supabase/migrations/20260514133525_remote_schema.sql:620:alter table "public"."service_orders" alter column "created_at" drop not null;
supabase/migrations/20260514133525_remote_schema.sql:621:alter table "public"."service_orders" alter column "id" set default extensions.uuid_generate_v4();
supabase/migrations/20260514133525_remote_schema.sql:622:alter table "public"."service_orders" alter column "status" set default 'pending'::text;
supabase/migrations/20260514133525_remote_schema.sql:623:alter table "public"."service_orders" alter column "status" drop not null;
supabase/migrations/20260514133525_remote_schema.sql:647:alter table "public"."service_orders" add constraint "check_device_info_structure" CHECK (((device_info ? 'brand'::text) AND (device_info ? 'model'::text))) not valid;
supabase/migrations/20260514133525_remote_schema.sql:648:alter table "public"."service_orders" validate constraint "check_device_info_structure";
supabase/migrations/20260514133525_remote_schema.sql:649:alter table "public"."service_orders" add constraint "service_orders_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'diagnosing'::text, 'waiting_parts'::text, 'ready'::text, 'delivered'::text, 'cancelled'::text]))) not valid;
supabase/migrations/20260514133525_remote_schema.sql:650:alter table "public"."service_orders" validate constraint "service_orders_status_check";
supabase/migrations/20260514133525_remote_schema.sql:651:alter table "public"."service_orders" add constraint "service_orders_total_cost_check" CHECK ((total_cost >= (0)::numeric)) not valid;
supabase/migrations/20260514133525_remote_schema.sql:652:alter table "public"."service_orders" validate constraint "service_orders_total_cost_check";
supabase/migrations/20260514133525_remote_schema.sql:655:alter table "public"."service_orders" add constraint "service_orders_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES public.customers(id) not valid;
supabase/migrations/20260514133525_remote_schema.sql:656:alter table "public"."service_orders" validate constraint "service_orders_customer_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:657:alter table "public"."service_orders" add constraint "service_orders_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE not valid;
supabase/migrations/20260514133525_remote_schema.sql:658:alter table "public"."service_orders" validate constraint "service_orders_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:659:create or replace view "public"."view_service_orders_detail" as  SELECT so.id,
supabase/migrations/20260514133525_remote_schema.sql:664:    so.total_cost,
supabase/migrations/20260514133525_remote_schema.sql:668:   FROM (public.service_orders so
supabase/migrations/20260514133525_remote_schema.sql:729:  on "public"."service_orders"
supabase/migrations/20260424_baseline_schema.sql:95:create table if not exists public.service_orders (
supabase/migrations/20260424_baseline_schema.sql:110:  estimated_cost numeric(12,2) not null default 0,
supabase/migrations/20260424_baseline_schema.sql:111:  final_cost numeric(12,2) not null default 0,
supabase/migrations/20260424_baseline_schema.sql:123:create unique index if not exists service_orders_tenant_folio_uidx
supabase/migrations/20260424_baseline_schema.sql:124:  on public.service_orders (tenant_id, folio);
supabase/migrations/20260424_baseline_schema.sql:125:create index if not exists service_orders_tenant_branch_idx
supabase/migrations/20260424_baseline_schema.sql:126:  on public.service_orders (tenant_id, branch_id);
supabase/migrations/20260424_baseline_schema.sql:127:create index if not exists service_orders_tenant_status_idx
supabase/migrations/20260424_baseline_schema.sql:128:  on public.service_orders (tenant_id, status);
supabase/migrations/20260424_baseline_schema.sql:132:  service_order_id uuid not null references public.service_orders(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:146:  service_order_id uuid not null references public.service_orders(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:159:  service_order_id uuid references public.service_orders(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:245:  related_service_order_id uuid references public.service_orders(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:281:  service_order_id uuid references public.service_orders(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:308:  service_order_id uuid references public.service_orders(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:330:  service_order_id uuid references public.service_orders(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:345:  service_order_id uuid references public.service_orders(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:385:drop trigger if exists trg_service_orders_updated_at on public.service_orders;
supabase/migrations/20260424_baseline_schema.sql:386:create trigger trg_service_orders_updated_at
supabase/migrations/20260424_baseline_schema.sql:387:before update on public.service_orders
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:88:  service_order_id uuid not null references public.service_orders(id) on delete cascade,
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:101:alter table public.service_orders
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:102:  add column if not exists estimated_cost numeric(12,2) not null default 0;
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:104:alter table public.service_orders
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:105:  add column if not exists final_cost numeric(12,2) not null default 0;
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:107:alter table public.service_orders
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:110:alter table public.service_orders
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:113:alter table public.service_orders
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:116:create index if not exists service_orders_tenant_folio_uidx
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:117:  on public.service_orders (tenant_id, folio);
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:119:create index if not exists service_orders_tenant_status_idx
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:120:  on public.service_orders (tenant_id, status);
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:122:create index if not exists service_orders_tenant_created_at_idx
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:123:  on public.service_orders (tenant_id, created_at desc);
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:125:alter table public.service_orders
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:126:  drop constraint if exists service_orders_status_check;
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:128:alter table public.service_orders
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:129:  add constraint service_orders_status_check
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:150:drop trigger if exists trg_service_orders_updated_at on public.service_orders;
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:151:create trigger trg_service_orders_updated_at
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:152:before update on public.service_orders
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:51:alter table if exists public.service_orders enable row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:72:alter table if exists public.service_orders force row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:223:  if to_regclass('public.service_orders') is not null then
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:224:    execute 'drop policy if exists service_orders_select on public.service_orders';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:226:      create policy service_orders_select
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:227:      on public.service_orders
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:232:    execute 'drop policy if exists service_orders_write_owner_manager on public.service_orders';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:234:      create policy service_orders_write_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:235:      on public.service_orders
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:240:    execute 'drop policy if exists service_orders_update_owner_manager on public.service_orders';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:242:      create policy service_orders_update_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:243:      on public.service_orders
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:249:    execute 'drop policy if exists service_orders_delete_owner_manager on public.service_orders';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:251:      create policy service_orders_delete_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:252:      on public.service_orders
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:257:    execute 'drop policy if exists service_orders_update_technician on public.service_orders';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:259:      create policy service_orders_update_technician
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:260:      on public.service_orders
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:636:  if to_regclass('public.service_orders') is not null then
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:637:    grant select, insert, update, delete on public.service_orders to authenticated;
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:20:-- service_orders
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:21:alter table if exists public.service_orders
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:26:create index if not exists service_orders_tenant_sucursal_idx
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:27:  on public.service_orders (tenant_id, sucursal_id);
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:29:alter table public.service_orders
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:30:  drop constraint if exists service_orders_sucursal_id_fkey;
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:32:alter table public.service_orders
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:33:  add constraint service_orders_sucursal_id_fkey
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:38:drop trigger if exists trg_service_orders_sync_sucursal_branch on public.service_orders;
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:39:create trigger trg_service_orders_sync_sucursal_branch
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:40:before insert or update on public.service_orders
supabase/migrations/20260514120000_enable_rls_and_policies.sql:2:alter table if exists public.service_orders enable row level security;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:11:drop policy if exists service_orders_select on public.service_orders;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:12:create policy service_orders_select
supabase/migrations/20260514120000_enable_rls_and_policies.sql:13:on public.service_orders
supabase/migrations/20260514120000_enable_rls_and_policies.sql:18:drop policy if exists service_orders_write_owner_manager on public.service_orders;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:19:create policy service_orders_write_owner_manager
supabase/migrations/20260514120000_enable_rls_and_policies.sql:20:on public.service_orders
supabase/migrations/20260514120000_enable_rls_and_policies.sql:26:drop policy if exists service_orders_update_owner_manager on public.service_orders;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:27:create policy service_orders_update_owner_manager
supabase/migrations/20260514120000_enable_rls_and_policies.sql:28:on public.service_orders
supabase/migrations/20260514120000_enable_rls_and_policies.sql:38:drop policy if exists service_orders_delete_owner_manager on public.service_orders;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:39:create policy service_orders_delete_owner_manager
supabase/migrations/20260514120000_enable_rls_and_policies.sql:40:on public.service_orders
supabase/migrations/20260514120000_enable_rls_and_policies.sql:46:drop policy if exists service_orders_update_technician on public.service_orders;
supabase/migrations/20260514120000_enable_rls_and_policies.sql:47:create policy service_orders_update_technician
supabase/migrations/20260514120000_enable_rls_and_policies.sql:48:on public.service_orders
supabase/migrations/20260523190000_order_documents_events.sql:4:  service_order_id uuid not null references public.service_orders(id) on delete cascade,
supabase/migrations/20260523190000_order_documents_events.sql:21:  service_order_id uuid not null references public.service_orders(id) on delete cascade,

---

## 11. Migraciones alrededor de service_orders


### supabase/migrations/20260424_baseline_schema.sql
95:create table if not exists public.service_orders (
110:  estimated_cost numeric(12,2) not null default 0,
111:  final_cost numeric(12,2) not null default 0,
123:create unique index if not exists service_orders_tenant_folio_uidx
124:  on public.service_orders (tenant_id, folio);
125:create index if not exists service_orders_tenant_branch_idx
126:  on public.service_orders (tenant_id, branch_id);
127:create index if not exists service_orders_tenant_status_idx
128:  on public.service_orders (tenant_id, status);
132:  service_order_id uuid not null references public.service_orders(id) on delete cascade,
146:  service_order_id uuid not null references public.service_orders(id) on delete cascade,
159:  service_order_id uuid references public.service_orders(id) on delete set null,
245:  related_service_order_id uuid references public.service_orders(id) on delete set null,
281:  service_order_id uuid references public.service_orders(id) on delete set null,
308:  service_order_id uuid references public.service_orders(id) on delete set null,
330:  service_order_id uuid references public.service_orders(id) on delete set null,
345:  service_order_id uuid references public.service_orders(id) on delete set null,
385:drop trigger if exists trg_service_orders_updated_at on public.service_orders;
386:create trigger trg_service_orders_updated_at
387:before update on public.service_orders

### supabase/migrations/20260514120000_enable_rls_and_policies.sql
2:alter table if exists public.service_orders enable row level security;
11:drop policy if exists service_orders_select on public.service_orders;
12:create policy service_orders_select
13:on public.service_orders
18:drop policy if exists service_orders_write_owner_manager on public.service_orders;
19:create policy service_orders_write_owner_manager
20:on public.service_orders
26:drop policy if exists service_orders_update_owner_manager on public.service_orders;
27:create policy service_orders_update_owner_manager
28:on public.service_orders
38:drop policy if exists service_orders_delete_owner_manager on public.service_orders;
39:create policy service_orders_delete_owner_manager
40:on public.service_orders
46:drop policy if exists service_orders_update_technician on public.service_orders;
47:create policy service_orders_update_technician
48:on public.service_orders

### supabase/migrations/20260514133525_remote_schema.sql
9:drop trigger if exists "trg_service_orders_updated_at" on "public"."service_orders";
30:drop policy "service_orders_delete_owner_manager" on "public"."service_orders";
31:drop policy "service_orders_select" on "public"."service_orders";
32:drop policy "service_orders_update_owner_manager" on "public"."service_orders";
33:drop policy "service_orders_update_technician" on "public"."service_orders";
34:drop policy "service_orders_write_owner_manager" on "public"."service_orders";
464:alter table "public"."service_orders" drop constraint "service_orders_branch_id_fkey";
465:alter table "public"."service_orders" drop constraint "service_orders_created_by_fkey";
466:alter table "public"."service_orders" drop constraint "service_orders_service_request_id_fkey";
467:alter table "public"."service_orders" drop constraint "service_orders_updated_by_fkey";
488:alter table "public"."service_orders" drop constraint "service_orders_customer_id_fkey";
489:alter table "public"."service_orders" drop constraint "service_orders_tenant_id_fkey";
532:drop index if exists "public"."service_orders_tenant_branch_idx";
533:drop index if exists "public"."service_orders_tenant_folio_uidx";
534:drop index if exists "public"."service_orders_tenant_status_idx";
592:alter table "public"."service_orders" drop column "archived_at";
593:alter table "public"."service_orders" drop column "branch_id";
594:alter table "public"."service_orders" drop column "caso_resolucion_tecnica";
595:alter table "public"."service_orders" drop column "completed_at";
596:alter table "public"."service_orders" drop column "created_by";
597:alter table "public"."service_orders" drop column "delivered_at";
598:alter table "public"."service_orders" drop column "device_brand";
599:alter table "public"."service_orders" drop column "device_model";
600:alter table "public"."service_orders" drop column "device_type";
601:alter table "public"."service_orders" drop column "estimated_cost";
602:alter table "public"."service_orders" drop column "final_cost";
603:alter table "public"."service_orders" drop column "folio";
604:alter table "public"."service_orders" drop column "internal_diagnosis";
605:alter table "public"."service_orders" drop column "priority";
606:alter table "public"."service_orders" drop column "promised_date";
607:alter table "public"."service_orders" drop column "received_at";
608:alter table "public"."service_orders" drop column "reported_issue";
609:alter table "public"."service_orders" drop column "service_request_id";
610:alter table "public"."service_orders" drop column "updated_at";
611:alter table "public"."service_orders" drop column "updated_by";
612:alter table "public"."service_orders" add column "accessories" text;
613:alter table "public"."service_orders" add column "device_info" jsonb not null;
614:alter table "public"."service_orders" add column "evidence_metadata" jsonb default '[]'::jsonb;
615:alter table "public"."service_orders" add column "internal_notes" text;
616:alter table "public"."service_orders" add column "problem_description" text not null;
617:alter table "public"."service_orders" add column "total_cost" numeric(12,2) default 0;
618:alter table "public"."service_orders" add column "warranty_until" timestamp with time zone;
619:alter table "public"."service_orders" alter column "created_at" set default now();
620:alter table "public"."service_orders" alter column "created_at" drop not null;
621:alter table "public"."service_orders" alter column "id" set default extensions.uuid_generate_v4();
622:alter table "public"."service_orders" alter column "status" set default 'pending'::text;
623:alter table "public"."service_orders" alter column "status" drop not null;
647:alter table "public"."service_orders" add constraint "check_device_info_structure" CHECK (((device_info ? 'brand'::text) AND (device_info ? 'model'::text))) not valid;
648:alter table "public"."service_orders" validate constraint "check_device_info_structure";
649:alter table "public"."service_orders" add constraint "service_orders_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'diagnosing'::text, 'waiting_parts'::text, 'ready'::text, 'delivered'::text, 'cancelled'::text]))) not valid;
650:alter table "public"."service_orders" validate constraint "service_orders_status_check";
651:alter table "public"."service_orders" add constraint "service_orders_total_cost_check" CHECK ((total_cost >= (0)::numeric)) not valid;
652:alter table "public"."service_orders" validate constraint "service_orders_total_cost_check";
655:alter table "public"."service_orders" add constraint "service_orders_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES public.customers(id) not valid;
656:alter table "public"."service_orders" validate constraint "service_orders_customer_id_fkey";
657:alter table "public"."service_orders" add constraint "service_orders_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE not valid;
658:alter table "public"."service_orders" validate constraint "service_orders_tenant_id_fkey";
659:create or replace view "public"."view_service_orders_detail" as  SELECT so.id,
664:    so.total_cost,
668:   FROM (public.service_orders so
729:  on "public"."service_orders"

### supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql
88:  service_order_id uuid not null references public.service_orders(id) on delete cascade,
101:alter table public.service_orders
102:  add column if not exists estimated_cost numeric(12,2) not null default 0;
104:alter table public.service_orders
105:  add column if not exists final_cost numeric(12,2) not null default 0;
107:alter table public.service_orders
110:alter table public.service_orders
113:alter table public.service_orders
116:create index if not exists service_orders_tenant_folio_uidx
117:  on public.service_orders (tenant_id, folio);
119:create index if not exists service_orders_tenant_status_idx
120:  on public.service_orders (tenant_id, status);
122:create index if not exists service_orders_tenant_created_at_idx
123:  on public.service_orders (tenant_id, created_at desc);
125:alter table public.service_orders
126:  drop constraint if exists service_orders_status_check;
128:alter table public.service_orders
129:  add constraint service_orders_status_check
150:drop trigger if exists trg_service_orders_updated_at on public.service_orders;
151:create trigger trg_service_orders_updated_at
152:before update on public.service_orders

### supabase/migrations/20260523190000_order_documents_events.sql
4:  service_order_id uuid not null references public.service_orders(id) on delete cascade,
21:  service_order_id uuid not null references public.service_orders(id) on delete cascade,

### supabase/migrations/20260525012000_restore_inventory_purchase_products.sql
27:  related_service_order_id uuid references public.service_orders(id) on delete set null,
63:  service_order_id uuid references public.service_orders(id) on delete set null,

### supabase/migrations/20260525021500_relax_service_order_status_constraint.sql
1:alter table public.service_orders
2:  drop constraint if exists service_orders_status_check;
4:alter table public.service_orders
5:  add constraint service_orders_status_check

### supabase/migrations/20260527030000_tenant_industry_config_phase1.sql
11:  default_workflow_key text not null default 'service_orders',

### supabase/migrations/20260527050000_tenant_field_definitions_phase2.sql
42:alter table public.service_orders

### supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql
51:alter table if exists public.service_orders enable row level security;
72:alter table if exists public.service_orders force row level security;
223:  if to_regclass('public.service_orders') is not null then
224:    execute 'drop policy if exists service_orders_select on public.service_orders';
226:      create policy service_orders_select
227:      on public.service_orders
232:    execute 'drop policy if exists service_orders_write_owner_manager on public.service_orders';
234:      create policy service_orders_write_owner_manager
235:      on public.service_orders
240:    execute 'drop policy if exists service_orders_update_owner_manager on public.service_orders';
242:      create policy service_orders_update_owner_manager
243:      on public.service_orders
249:    execute 'drop policy if exists service_orders_delete_owner_manager on public.service_orders';
251:      create policy service_orders_delete_owner_manager
252:      on public.service_orders
257:    execute 'drop policy if exists service_orders_update_technician on public.service_orders';
259:      create policy service_orders_update_technician
260:      on public.service_orders
636:  if to_regclass('public.service_orders') is not null then
637:    grant select, insert, update, delete on public.service_orders to authenticated;

### supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql
20:-- service_orders
21:alter table if exists public.service_orders
26:create index if not exists service_orders_tenant_sucursal_idx
27:  on public.service_orders (tenant_id, sucursal_id);
29:alter table public.service_orders
30:  drop constraint if exists service_orders_sucursal_id_fkey;
32:alter table public.service_orders
33:  add constraint service_orders_sucursal_id_fkey
38:drop trigger if exists trg_service_orders_sync_sucursal_branch on public.service_orders;
39:create trigger trg_service_orders_sync_sucursal_branch
40:before insert or update on public.service_orders

### supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql
17:drop trigger if exists trg_service_orders_sync_sucursal_branch on public.service_orders;
23:alter table public.service_orders
24:  drop constraint if exists service_orders_branch_id_fkey;
36:alter table public.service_orders

### supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql
20:-- service_orders
21:alter table if exists public.service_orders
24:update public.service_orders
29:create index if not exists service_orders_tenant_sucursal_idx
30:  on public.service_orders (tenant_id, sucursal_id);
32:alter table public.service_orders
33:  drop constraint if exists service_orders_sucursal_id_fkey;
35:alter table public.service_orders
36:  add constraint service_orders_sucursal_id_fkey
41:drop trigger if exists trg_service_orders_sync_sucursal_branch on public.service_orders;
42:create trigger trg_service_orders_sync_sucursal_branch
43:before insert or update on public.service_orders

### supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql
8:update public.service_orders
25:drop trigger if exists trg_service_orders_sync_sucursal_branch on public.service_orders;
31:alter table public.service_orders
32:  drop constraint if exists service_orders_branch_id_fkey;
44:alter table public.service_orders

### supabase/migrations/20260530121000_add_assigned_user_to_service_orders.sql
3:alter table public.service_orders
6:create index if not exists service_orders_tenant_assigned_idx
7:  on public.service_orders (tenant_id, assigned_user_id, created_at desc);

### supabase/migrations/20260530143000_add_public_token_to_service_orders.sql
1:alter table if exists public.service_orders
4:update public.service_orders
8:alter table public.service_orders
11:alter table public.service_orders
14:create unique index if not exists service_orders_tenant_public_token_uidx
15:  on public.service_orders (tenant_id, public_token);

### supabase/migrations/20260530193000_audit_hardening_multitenant.sql
13:create index if not exists service_orders_tenant_promised_status_idx
14:  on public.service_orders (tenant_id, promised_date, status);
19:  service_order_id uuid not null references public.service_orders(id) on delete cascade,
35:  service_order_id uuid references public.service_orders(id) on delete set null,
95:  service_order_id uuid references public.service_orders(id) on delete set null,
125:  payment_amount numeric(12,2);
148:      payment_amount := coalesce(nullif(new.final_cost, 0), nullif(new.estimated_cost, 0), 0);
180:          payment_amount,
197:drop trigger if exists trg_service_orders_status_audit_and_payment on public.service_orders;
198:create trigger trg_service_orders_status_audit_and_payment
199:after update of status on public.service_orders

---

## 12. Posible schema actual desde types o dist

apps/api/src/controllers/requests.ts:161:          estimated_cost: estimatedCost,
apps/api/src/controllers/requests.ts:162:          final_cost: finalCost,
apps/api/src/controllers/reports.ts:17:    let ordersQuery = supabase.from('service_orders').select('id, status, created_at, total_cost, final_cost, sucursal_id, promised_date, folio').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:103:      (sum, order) => sum + Number((order as { total_cost?: number | null; final_cost?: number | null }).total_cost ?? (order as { total_cost?: number | null; final_cost?: number | null }).final_cost ?? 0),
apps/api/src/controllers/orders.ts:530:          estimated_cost: estimatedCost,
apps/api/src/controllers/orders.ts:531:          final_cost: finalCost,
apps/api/src/controllers/orders.ts:626:        final_cost: finalCost,
apps/api/src/controllers/orders.ts:627:        estimated_cost: estimatedCost,
apps/api/src/controllers/orders.ts:1229:      .select('id, estimated_cost, final_cost, evidence_metadata')
apps/api/src/controllers/orders.ts:1242:    const nextEstimatedCost = typeof body.estimatedCost === 'number' ? body.estimatedCost : Number(order.estimated_cost ?? 0);
apps/api/src/controllers/orders.ts:1243:    const nextFinalCost = typeof body.finalCost === 'number' ? body.finalCost : Number(order.final_cost ?? nextEstimatedCost);
apps/api/src/controllers/orders.ts:1248:        estimated_cost: nextEstimatedCost,
apps/api/src/controllers/orders.ts:1249:        final_cost: nextFinalCost,
apps/api/src/controllers/finance.ts:17:function resolveOrderIncome(order: { total_cost?: number | null; final_cost?: number | null }) {
apps/api/src/controllers/finance.ts:18:  return Number(order.total_cost ?? order.final_cost ?? 0);
apps/api/src/controllers/finance.ts:41:      .select('id, tenant_id, sucursal_id, total_cost, final_cost, created_at, status')
apps/api/src/controllers/finance.ts:81:    const totalIncome = filteredOrders.reduce((sum, order) => sum + resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null }), 0);
apps/api/src/controllers/finance.ts:98:        balance: resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null }),
apps/api/src/controllers/finance.ts:99:        income: resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null }),
apps/api/src/controllers/finance.ts:145:      const income = resolveOrderIncome(order as { total_cost?: number | null; final_cost?: number | null });
apps/api/src/controllers/public.ts:297:      .select('id, tenant_id, folio, status, total_cost, created_at, device_info, problem_description, serial_number, receipt_url, estimated_cost, final_cost, metadata')
apps/api/src/controllers/public.ts:351:      .select('id, tenant_id, folio, status, total_cost, created_at, updated_at, promised_date, device_info, problem_description, serial_number, receipt_url, estimated_cost, final_cost, evidence_metadata, metadata')
apps/api/dist/controllers/orders.js:389:                estimated_cost: estimatedCost,
apps/api/dist/controllers/orders.js:390:                final_cost: finalCost,
apps/api/dist/controllers/orders.js:476:                final_cost: finalCost,
apps/api/dist/controllers/orders.js:477:                estimated_cost: estimatedCost,
apps/api/dist/controllers/orders.js:1006:            .select('id, estimated_cost, final_cost, evidence_metadata')
apps/api/dist/controllers/orders.js:1014:        const nextEstimatedCost = typeof body.estimatedCost === 'number' ? body.estimatedCost : Number(order.estimated_cost ?? 0);
apps/api/dist/controllers/orders.js:1015:        const nextFinalCost = typeof body.finalCost === 'number' ? body.finalCost : Number(order.final_cost ?? nextEstimatedCost);
apps/api/dist/controllers/orders.js:1019:            estimated_cost: nextEstimatedCost,
apps/api/dist/controllers/orders.js:1020:            final_cost: nextFinalCost,
apps/api/dist/controllers/public.js:214:            .select('id, tenant_id, folio, status, total_cost, created_at, device_info, problem_description, serial_number, receipt_url, estimated_cost, final_cost, metadata')
apps/api/dist/controllers/public.js:261:            .select('id, tenant_id, folio, status, total_cost, created_at, updated_at, promised_date, device_info, problem_description, serial_number, receipt_url, estimated_cost, final_cost, evidence_metadata, metadata')
apps/api/dist/controllers/finance.js:17:    return Number(order.total_cost ?? order.final_cost ?? 0);
apps/api/dist/controllers/finance.js:36:            .select('id, tenant_id, sucursal_id, total_cost, final_cost, created_at, status')
apps/api/dist/controllers/requests.js:146:                estimated_cost: estimatedCost,
apps/api/dist/controllers/requests.js:147:                final_cost: finalCost,
apps/api/dist/controllers/reports.js:15:        let ordersQuery = supabase.from('service_orders').select('id, status, created_at, total_cost, final_cost, sucursal_id, promised_date, folio').eq('tenant_id', tenantId).limit(500);
apps/api/dist/controllers/reports.js:94:        const totalIncome = orders.reduce((sum, order) => sum + Number(order.total_cost ?? order.final_cost ?? 0), 0);

---

## 13. Validación actual typecheck/build

### Typecheck
.                                        | [WARN] Unsupported engine: wanted: {"node":"22.x"} (current: {"node":"v24.13.1","pnpm":"11.3.0"})
apps/web-admin                           | [WARN] Unsupported engine: wanted: {"node":"22.x"} (current: {"node":"v24.13.1","pnpm":"11.3.0"})
apps/web-clientes                        | [WARN] Unsupported engine: wanted: {"node":"22.x"} (current: {"node":"v24.13.1","pnpm":"11.3.0"})
apps/web-public                          | [WARN] Unsupported engine: wanted: {"node":"22.x"} (current: {"node":"v24.13.1","pnpm":"11.3.0"})
$ tsc --noEmit

### Build
.                                        | [WARN] Unsupported engine: wanted: {"node":"22.x"} (current: {"node":"v24.13.1","pnpm":"11.3.0"})
apps/web-admin                           | [WARN] Unsupported engine: wanted: {"node":"22.x"} (current: {"node":"v24.13.1","pnpm":"11.3.0"})
apps/web-clientes                        | [WARN] Unsupported engine: wanted: {"node":"22.x"} (current: {"node":"v24.13.1","pnpm":"11.3.0"})
apps/web-public                          | [WARN] Unsupported engine: wanted: {"node":"22.x"} (current: {"node":"v24.13.1","pnpm":"11.3.0"})
$ tsc

---

FIN AUDITORÍA COSTOS
