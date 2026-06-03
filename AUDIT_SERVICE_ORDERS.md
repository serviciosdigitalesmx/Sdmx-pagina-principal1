# SERVICE ORDERS

apps/api/src/controllers/orders.ts.pre_evidence_cleanup:344:  const statuses = config.statusOptions.service_orders ?? [];
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:512:      .from('service_orders')
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:578:      .from('service_orders')
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:659:      .from('service_orders')
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:708:      .from('service_orders')
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:809:      .from('service_orders')
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:882:        .from('service_orders')
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:889:        .from('service_orders')
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:915:        .from('service_orders')
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:942:        .from('service_orders')
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:957:        .from('service_orders')
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1040:      .from('service_orders')
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1066:      .from('service_orders')
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1124:      .from('service_orders')
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1147:      .from('service_orders')
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1165:      .from('service_orders')
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1228:      .from('service_orders')
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1246:      .from('service_orders')
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1276:        .from('service_orders')
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1323:      .from('service_orders')
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1349:      .from('service_orders')
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1423:      .from('service_orders')
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1480:      .from('service_orders')
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1498:      .from('service_orders')
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1522:      .from('service_orders')
apps/api/src/controllers/meta.ts:249:        default_workflow_key: String(industryRecord.default_workflow_key ?? industryRecord.defaultWorkflowKey ?? 'service_orders').trim() || 'service_orders',
apps/api/src/controllers/meta.ts:351:            workflow_key: String(record.workflow_key ?? 'service_orders').trim(),
apps/api/src/controllers/meta.ts:445:            workflow_key: String(record.workflow_key ?? record.workflowKey ?? 'service_orders').trim() || 'service_orders',
apps/api/src/controllers/requests.ts:179:      .from('service_orders')
apps/api/src/controllers/reports.ts:17:    let ordersQuery = supabase.from('service_orders').select('id, status, created_at, final_cost, sucursal_id, promised_date, folio').eq('tenant_id', tenantId).limit(500);
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
apps/api/src/controllers/requests.ts.bak.20260603_101809:144:      .from('service_orders')
apps/api/src/controllers/orders.ts.bak.20260603_102231:344:  const statuses = config.statusOptions.service_orders ?? [];
apps/api/src/controllers/orders.ts.bak.20260603_102231:512:      .from('service_orders')
apps/api/src/controllers/orders.ts.bak.20260603_102231:578:      .from('service_orders')
apps/api/src/controllers/orders.ts.bak.20260603_102231:659:      .from('service_orders')
apps/api/src/controllers/orders.ts.bak.20260603_102231:708:      .from('service_orders')
apps/api/src/controllers/orders.ts.bak.20260603_102231:809:      .from('service_orders')
apps/api/src/controllers/orders.ts.bak.20260603_102231:882:        .from('service_orders')
apps/api/src/controllers/orders.ts.bak.20260603_102231:889:        .from('service_orders')
apps/api/src/controllers/orders.ts.bak.20260603_102231:915:        .from('service_orders')
apps/api/src/controllers/orders.ts.bak.20260603_102231:942:        .from('service_orders')
apps/api/src/controllers/orders.ts.bak.20260603_102231:957:        .from('service_orders')
apps/api/src/controllers/orders.ts.bak.20260603_102231:1040:      .from('service_orders')
apps/api/src/controllers/orders.ts.bak.20260603_102231:1066:      .from('service_orders')
apps/api/src/controllers/orders.ts.bak.20260603_102231:1124:      .from('service_orders')
apps/api/src/controllers/orders.ts.bak.20260603_102231:1147:      .from('service_orders')
apps/api/src/controllers/orders.ts.bak.20260603_102231:1165:      .from('service_orders')
apps/api/src/controllers/orders.ts.bak.20260603_102231:1228:      .from('service_orders')
apps/api/src/controllers/orders.ts.bak.20260603_102231:1246:      .from('service_orders')
apps/api/src/controllers/orders.ts.bak.20260603_102231:1276:        .from('service_orders')
apps/api/src/controllers/orders.ts.bak.20260603_102231:1323:      .from('service_orders')
apps/api/src/controllers/orders.ts.bak.20260603_102231:1349:      .from('service_orders')
apps/api/src/controllers/orders.ts.bak.20260603_102231:1423:      .from('service_orders')
apps/api/src/controllers/orders.ts.bak.20260603_102231:1480:      .from('service_orders')
apps/api/src/controllers/orders.ts.bak.20260603_102231:1498:      .from('service_orders')
apps/api/src/controllers/orders.ts.bak.20260603_102231:1522:      .from('service_orders')
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

================================

apps/api/src/controllers/orders.ts:10:const defaultOrderStatuses = ['recibido', 'diagnostico', 'reparacion', 'listo', 'entregado'] as const;
apps/api/src/controllers/orders.ts:11:const orderStatusSchema = z.string().min(1);
apps/api/src/controllers/orders.ts:29:const statusRequestSchema = z.object({
apps/api/src/controllers/orders.ts:30:  status: orderStatusSchema,
apps/api/src/controllers/orders.ts:66:      previous_status: string | null;
apps/api/src/controllers/orders.ts:67:      new_status: string | null;
apps/api/src/controllers/orders.ts:79:type OperationalStatus = {
apps/api/src/controllers/orders.ts:87:  tenant_id: string;
apps/api/src/controllers/orders.ts:102:  tenant_id: string;
apps/api/src/controllers/orders.ts:105:  previous_status: string | null;
apps/api/src/controllers/orders.ts:106:  new_status: string | null;
apps/api/src/controllers/orders.ts:133:    scopedQuery = scopedQuery.eq('sucursal_id', branchId);
apps/api/src/controllers/orders.ts:189:function normalizeOrderStatus(status?: string | null) {
apps/api/src/controllers/orders.ts:190:  const value = String(status ?? '').toLowerCase();
apps/api/src/controllers/orders.ts:263:    previous_status: row.previous_status,
apps/api/src/controllers/orders.ts:264:    new_status: row.new_status,
apps/api/src/controllers/orders.ts:275:      previous_status: entry.previous_status,
apps/api/src/controllers/orders.ts:276:      new_status: entry.new_status,
apps/api/src/controllers/orders.ts:292:  tenant_id: string;
apps/api/src/controllers/orders.ts:311:  tenant_id: string;
apps/api/src/controllers/orders.ts:314:  previous_status: string | null;
apps/api/src/controllers/orders.ts:315:  new_status: string | null;
apps/api/src/controllers/orders.ts:342:async function getTenantOperationalStatuses(tenantId: string) {
apps/api/src/controllers/orders.ts:344:  const statuses = config.statusOptions.service_orders ?? [];
apps/api/src/controllers/orders.ts:345:  if (statuses.length > 0) {
apps/api/src/controllers/orders.ts:346:    return statuses.map((status) => ({
apps/api/src/controllers/orders.ts:347:      key: String(status.key),
apps/api/src/controllers/orders.ts:348:      label: String(status.label ?? status.key),
apps/api/src/controllers/orders.ts:349:      tone: String(status.tone ?? 'zinc'),
apps/api/src/controllers/orders.ts:353:  return defaultOrderStatuses.map((status) => ({ key: status, label: status, tone: 'zinc' }));
apps/api/src/controllers/orders.ts:356:async function getAllowedOrderStatusKeys(tenantId: string) {
apps/api/src/controllers/orders.ts:357:  const statuses = await getTenantOperationalStatuses(tenantId);
apps/api/src/controllers/orders.ts:358:  return new Set(statuses.map((status) => status.key ?? '').filter(Boolean));
apps/api/src/controllers/orders.ts:412:  doc.text(`Estado: ${String(options.order.status ?? '')}`);
apps/api/src/controllers/orders.ts:487:      return res.status(401).json({ error: 'Tenant context is required' });
apps/api/src/controllers/orders.ts:502:      return res.status(403).json({ error: 'Sucursal mismatch' });
apps/api/src/controllers/orders.ts:515:          tenant_id: tenantId,
apps/api/src/controllers/orders.ts:516:          sucursal_id: requestedSucursalId,
apps/api/src/controllers/orders.ts:519:          status: 'recibido',
apps/api/src/controllers/orders.ts:530:          estimated_cost: estimatedCost,
apps/api/src/controllers/orders.ts:531:          final_cost: finalCost,
apps/api/src/controllers/orders.ts:542:      return res.status(502).json({
apps/api/src/controllers/orders.ts:558:        tenant_id: tenantId,
apps/api/src/controllers/orders.ts:570:      return res.status(502).json({
apps/api/src/controllers/orders.ts:584:          previous_status: null,
apps/api/src/controllers/orders.ts:585:          new_status: 'recibido',
apps/api/src/controllers/orders.ts:591:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:596:      tenant_id: tenantId,
apps/api/src/controllers/orders.ts:599:      previous_status: null,
apps/api/src/controllers/orders.ts:600:      new_status: 'recibido',
apps/api/src/controllers/orders.ts:621:    return res.status(201).json({
apps/api/src/controllers/orders.ts:626:        final_cost: finalCost,
apps/api/src/controllers/orders.ts:627:        estimated_cost: estimatedCost,
apps/api/src/controllers/orders.ts:629:        sucursal_id: requestedSucursalId,
apps/api/src/controllers/orders.ts:638:      return res.status(400).json({
apps/api/src/controllers/orders.ts:644:    return res.status(500).json({ error: 'Error interno del servidor' });
apps/api/src/controllers/orders.ts:654:      return res.status(401).json({ error: 'Tenant context is required' });
apps/api/src/controllers/orders.ts:661:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:670:      return res.status(502).json({
apps/api/src/controllers/orders.ts:682:    return res.status(200).json({
apps/api/src/controllers/orders.ts:688:    return res.status(500).json({ error: 'Error interno del servidor' });
apps/api/src/controllers/orders.ts:699:      return res.status(401).json({ error: 'Tenant context is required' });
apps/api/src/controllers/orders.ts:703:      return res.status(400).json({ error: 'Order id is required' });
apps/api/src/controllers/orders.ts:710:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:720:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:725:        .select('id, tenant_id, service_order_id, bucket_name, storage_path, public_url, file_name, file_type, mime_type, file_size, source, created_at')
apps/api/src/controllers/orders.ts:726:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:731:        .select('id, tenant_id, service_order_id, event_type, previous_status, new_status, note, actor_name, created_at')
apps/api/src/controllers/orders.ts:732:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:739:      return res.status(404).json({
apps/api/src/controllers/orders.ts:746:      return res.status(502).json({ error: 'Failed to fetch order checklist', details: checklistResult.error.message });
apps/api/src/controllers/orders.ts:750:      return res.status(502).json({ error: 'Failed to fetch order documents', details: documentsResult.error.message });
apps/api/src/controllers/orders.ts:754:      return res.status(502).json({ error: 'Failed to fetch order events', details: eventsResult.error.message });
apps/api/src/controllers/orders.ts:763:      statusEvents: events
apps/api/src/controllers/orders.ts:764:        .filter((event) => event.event_type === 'status_changed')
apps/api/src/controllers/orders.ts:767:          new_status: event.new_status,
apps/api/src/controllers/orders.ts:791:    return res.status(500).json({ error: 'Error interno del servidor' });
apps/api/src/controllers/orders.ts:802:      return res.status(401).json({ error: 'Tenant context is required' });
apps/api/src/controllers/orders.ts:810:      .select('id, tenant_id, evidence_metadata')
apps/api/src/controllers/orders.ts:811:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:814:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts:820:      return res.status(404).json({ error: 'Order not found', details: orderError?.message ?? 'Not found' });
apps/api/src/controllers/orders.ts:841:        return res.status(502).json({
apps/api/src/controllers/orders.ts:851:        tenant_id: tenantId,
apps/api/src/controllers/orders.ts:869:        tenant_id: tenantId,
apps/api/src/controllers/orders.ts:884:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:901:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:917:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:922:        return res.status(404).json({ error: 'Order not found', details: latestOrderError?.message ?? 'Not found' });
apps/api/src/controllers/orders.ts:944:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:949:        return res.status(502).json({
apps/api/src/controllers/orders.ts:970:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:974:        return res.status(502).json({
apps/api/src/controllers/orders.ts:982:        tenant_id: tenantId,
apps/api/src/controllers/orders.ts:998:        tenant_id: tenantId,
apps/api/src/controllers/orders.ts:1013:    return res.status(201).json({
apps/api/src/controllers/orders.ts:1019:      return res.status(400).json({ error: 'Invalid payload', details: error.errors });
apps/api/src/controllers/orders.ts:1022:    return res.status(500).json({ error: 'Error interno del servidor' });
apps/api/src/controllers/orders.ts:1033:      return res.status(401).json({ error: 'Tenant context is required' });
apps/api/src/controllers/orders.ts:1041:      .select('id, status, evidence_metadata')
apps/api/src/controllers/orders.ts:1042:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1045:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts:1051:      return res.status(404).json({ error: 'Order not found', details: orderError?.message ?? 'Not found' });
apps/api/src/controllers/orders.ts:1058:      previous_status: order.status,
apps/api/src/controllers/orders.ts:1059:      new_status: order.status,
apps/api/src/controllers/orders.ts:1068:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1072:      return res.status(502).json({ error: 'Failed to persist order note', details: error.message });
apps/api/src/controllers/orders.ts:1078:      tenant_id: tenantId,
apps/api/src/controllers/orders.ts:1081:      previous_status: order.status,
apps/api/src/controllers/orders.ts:1082:      new_status: order.status,
apps/api/src/controllers/orders.ts:1098:    return res.status(201).json({ success: true, data: noteEntry });
apps/api/src/controllers/orders.ts:1101:      return res.status(400).json({ error: 'Invalid payload', details: error.errors });
apps/api/src/controllers/orders.ts:1104:    return res.status(500).json({ error: 'Error interno del servidor' });
apps/api/src/controllers/orders.ts:1110:export const updateOrderStatus = async (req: Request, res: Response) => {
apps/api/src/controllers/orders.ts:1117:      return res.status(401).json({ error: 'Tenant context is required' });
apps/api/src/controllers/orders.ts:1120:    const body = statusRequestSchema.parse(req.body);
apps/api/src/controllers/orders.ts:1125:      .select('id, status, evidence_metadata')
apps/api/src/controllers/orders.ts:1126:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1129:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts:1135:      return res.status(404).json({ error: 'Order not found', details: orderError?.message ?? 'Not found' });
apps/api/src/controllers/orders.ts:1138:    const previousStatus = normalizeOrderStatus(order.status);
apps/api/src/controllers/orders.ts:1139:    const nextStatus = body.status;
apps/api/src/controllers/orders.ts:1140:    const allowedStatuses = await getAllowedOrderStatusKeys(tenantId);
apps/api/src/controllers/orders.ts:1142:    if (!allowedStatuses.has(nextStatus)) {
apps/api/src/controllers/orders.ts:1143:      return res.status(400).json({ error: 'Invalid status', details: { allowedStatuses: [...allowedStatuses] } });
apps/api/src/controllers/orders.ts:1149:        status: nextStatus,
apps/api/src/controllers/orders.ts:1150:        received_at: nextStatus === 'recibido' ? new Date().toISOString() : undefined,
apps/api/src/controllers/orders.ts:1151:        completed_at: nextStatus === 'listo' ? new Date().toISOString() : undefined,
apps/api/src/controllers/orders.ts:1152:        delivered_at: nextStatus === 'entregado' ? new Date().toISOString() : undefined,
apps/api/src/controllers/orders.ts:1154:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1160:      return res.status(502).json({ error: 'Failed to update order status', details: error.message });
apps/api/src/controllers/orders.ts:1163:    const statusEventId = randomUUID();
apps/api/src/controllers/orders.ts:1169:          id: statusEventId,
apps/api/src/controllers/orders.ts:1170:          event_type: 'status_changed',
apps/api/src/controllers/orders.ts:1171:          previous_status: previousStatus,
apps/api/src/controllers/orders.ts:1172:          new_status: nextStatus,
apps/api/src/controllers/orders.ts:1178:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1182:      id: statusEventId,
apps/api/src/controllers/orders.ts:1183:      tenant_id: tenantId,
apps/api/src/controllers/orders.ts:1185:      event_type: 'status_changed',
apps/api/src/controllers/orders.ts:1186:      previous_status: previousStatus,
apps/api/src/controllers/orders.ts:1187:      new_status: nextStatus,
apps/api/src/controllers/orders.ts:1193:      type: 'order.status_changed',
apps/api/src/controllers/orders.ts:1195:      body: `La orden ${orderId} cambió a ${nextStatus}.`,
apps/api/src/controllers/orders.ts:1199:        previousStatus,
apps/api/src/controllers/orders.ts:1200:        nextStatus,
apps/api/src/controllers/orders.ts:1207:      return res.status(400).json({ error: 'Invalid payload', details: error.errors });
apps/api/src/controllers/orders.ts:1209:    console.error('Error updating status:', error);
apps/api/src/controllers/orders.ts:1210:    return res.status(500).json({ error: 'Error interno del servidor' });
apps/api/src/controllers/orders.ts:1221:      return res.status(401).json({ error: 'Tenant context is required' });
apps/api/src/controllers/orders.ts:1229:      .select('id, estimated_cost, final_cost, evidence_metadata')
apps/api/src/controllers/orders.ts:1230:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1233:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts:1239:      return res.status(404).json({ error: 'Order not found', details: orderError?.message ?? 'Not found' });
apps/api/src/controllers/orders.ts:1242:    const nextEstimatedCost = typeof body.estimatedCost === 'number' ? body.estimatedCost : Number(order.estimated_cost ?? 0);
apps/api/src/controllers/orders.ts:1243:    const nextFinalCost = typeof body.finalCost === 'number' ? body.finalCost : Number(order.final_cost ?? nextEstimatedCost);
apps/api/src/controllers/orders.ts:1248:        estimated_cost: nextEstimatedCost,
apps/api/src/controllers/orders.ts:1249:        final_cost: nextFinalCost,
apps/api/src/controllers/orders.ts:1252:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1258:      return res.status(502).json({ error: 'Failed to update order financials', details: error.message });
apps/api/src/controllers/orders.ts:1266:          previous_status: null,
apps/api/src/controllers/orders.ts:1267:          new_status: null,
apps/api/src/controllers/orders.ts:1280:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1284:        return res.status(502).json({ error: 'Failed to persist financial note', details: metadataError.message });
apps/api/src/controllers/orders.ts:1289:        tenant_id: tenantId,
apps/api/src/controllers/orders.ts:1292:        previous_status: null,
apps/api/src/controllers/orders.ts:1293:        new_status: null,
apps/api/src/controllers/orders.ts:1302:      return res.status(400).json({ error: 'Invalid payload', details: error.errors });
apps/api/src/controllers/orders.ts:1305:    return res.status(500).json({ error: 'Error interno del servidor' });
apps/api/src/controllers/orders.ts:1316:      return res.status(401).json({ error: 'Tenant context is required' });
apps/api/src/controllers/orders.ts:1325:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1328:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts:1334:      return res.status(404).json({ error: 'Order not found', details: existingError?.message ?? 'Not found' });
apps/api/src/controllers/orders.ts:1358:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1364:      return res.status(502).json({ error: 'Failed to update order details', details: error.message });
apps/api/src/controllers/orders.ts:1370:      return res.status(400).json({ error: 'Invalid payload', details: error.errors });
apps/api/src/controllers/orders.ts:1373:    return res.status(500).json({ error: 'Error interno del servidor' });
apps/api/src/controllers/orders.ts:1381:    if (!tenantId) return res.status(401).json({ error: 'Tenant context is required' });
apps/api/src/controllers/orders.ts:1386:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1391:      return res.status(502).json({ error: 'Failed to fetch order checklist', details: error.message });
apps/api/src/controllers/orders.ts:1395:      return res.status(404).json({ error: 'Checklist not found' });
apps/api/src/controllers/orders.ts:1401:    return res.status(500).json({ error: 'Error interno del servidor' });
apps/api/src/controllers/orders.ts:1417:    if (!tenantId) return res.status(401).json({ error: 'Tenant context is required' });
apps/api/src/controllers/orders.ts:1425:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1430:      return res.status(502).json({ error: 'Failed to inspect order', details: existingError.message });
apps/api/src/controllers/orders.ts:1434:      return res.status(404).json({ error: 'Order not found' });
apps/api/src/controllers/orders.ts:1440:        tenant_id: tenantId,
apps/api/src/controllers/orders.ts:1452:      return res.status(502).json({ error: 'Failed to persist order checklist', details: error.message });
apps/api/src/controllers/orders.ts:1458:      return res.status(400).json({ error: 'Invalid payload', details: error.errors });
apps/api/src/controllers/orders.ts:1461:    return res.status(500).json({ error: 'Error interno del servidor' });
apps/api/src/controllers/orders.ts:1475:    if (!tenantId) return res.status(401).json({ error: 'Tenant context is required' });
apps/api/src/controllers/orders.ts:1482:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1487:      return res.status(404).json({ error: 'Order not found', details: orderError?.message ?? 'Not found' });
apps/api/src/controllers/orders.ts:1500:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1506:      return res.status(502).json({ error: 'Failed to update warranty', details: error.message });
apps/api/src/controllers/orders.ts:1512:      tenant_id: tenantId,
apps/api/src/controllers/orders.ts:1515:      previous_status: null,
apps/api/src/controllers/orders.ts:1516:      new_status: null,
apps/api/src/controllers/orders.ts:1528:          previous_status: null,
apps/api/src/controllers/orders.ts:1529:          new_status: null,
apps/api/src/controllers/orders.ts:1535:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1541:      return res.status(400).json({ error: 'Invalid payload', details: error.errors });
apps/api/src/controllers/orders.ts:1544:    return res.status(500).json({ error: 'Error interno del servidor' });

================================

supabase/migrations/20260530143000_add_public_token_to_service_orders.sql:15:  on public.service_orders (tenant_id, public_token);
supabase/migrations/20260530121000_add_assigned_user_to_service_orders.sql:7:  on public.service_orders (tenant_id, assigned_user_id, created_at desc);
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:29:create index if not exists service_orders_tenant_sucursal_idx
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:30:  on public.service_orders (tenant_id, sucursal_id);
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:33:  drop constraint if exists service_orders_sucursal_id_fkey;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:36:  add constraint service_orders_sucursal_id_fkey
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:14:  on public.service_orders (tenant_id, promised_date, status);
supabase/migrations/20260514133525_remote_schema.sql:488:alter table "public"."service_orders" drop constraint "service_orders_customer_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:489:alter table "public"."service_orders" drop constraint "service_orders_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:655:alter table "public"."service_orders" add constraint "service_orders_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES public.customers(id) not valid;
supabase/migrations/20260514133525_remote_schema.sql:656:alter table "public"."service_orders" validate constraint "service_orders_customer_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:657:alter table "public"."service_orders" add constraint "service_orders_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE not valid;
supabase/migrations/20260514133525_remote_schema.sql:658:alter table "public"."service_orders" validate constraint "service_orders_tenant_id_fkey";
supabase/migrations/20260424_baseline_schema.sql:124:  on public.service_orders (tenant_id, folio);
supabase/migrations/20260424_baseline_schema.sql:126:  on public.service_orders (tenant_id, branch_id);
supabase/migrations/20260424_baseline_schema.sql:128:  on public.service_orders (tenant_id, status);
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:117:  on public.service_orders (tenant_id, folio);
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:120:  on public.service_orders (tenant_id, status);
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:123:  on public.service_orders (tenant_id, created_at desc);
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:26:create index if not exists service_orders_tenant_sucursal_idx
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:27:  on public.service_orders (tenant_id, sucursal_id);
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:30:  drop constraint if exists service_orders_sucursal_id_fkey;
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:33:  add constraint service_orders_sucursal_id_fkey
