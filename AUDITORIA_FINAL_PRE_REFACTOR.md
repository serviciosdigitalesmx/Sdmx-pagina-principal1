# AUDITORIA FINAL PRE REFACTOR

Fecha: miércoles,  3 de junio de 2026, 10:14:52 CST
Repo: /Users/jesusvilla/Desktop/Sdmx-pagina-principal


---

## 1. Rutas Express

apps/api/src/index.ts:59:app.use(cors({
apps/api/src/index.ts:104:app.use(express.json());
apps/api/src/index.ts:107:app.use('/api/auth', authRouter);
apps/api/src/index.ts:108:app.use('/api/:tenantSlug/auth', authRouter); // Support for tenant-prefixed auth
apps/api/src/index.ts:110:app.use('/api/:tenantSlug/orders', ordersRouter);
apps/api/src/index.ts:111:app.use('/api/orders', ordersRouter);
apps/api/src/index.ts:112:app.use('/api/:tenantSlug/requests', requestsRouter);
apps/api/src/index.ts:113:app.use('/api/requests', requestsRouter);
apps/api/src/index.ts:115:app.use('/api/:tenantSlug/finance', financeRouter);
apps/api/src/index.ts:116:app.use('/api/finance', financeRouter);
apps/api/src/index.ts:118:app.use('/api/:tenantSlug/customers', customersRouter);
apps/api/src/index.ts:119:app.use('/api/customers', customersRouter);
apps/api/src/index.ts:121:app.use('/api/:tenantSlug/inventory', inventoryRouter);
apps/api/src/index.ts:122:app.use('/api/inventory', inventoryRouter);
apps/api/src/index.ts:123:app.use('/api/:tenantSlug/sucursales', sucursalesRouter);
apps/api/src/index.ts:124:app.use('/api/sucursales', sucursalesRouter);
apps/api/src/index.ts:125:app.use('/api/:tenantSlug/suppliers', suppliersRouter);
apps/api/src/index.ts:126:app.use('/api/suppliers', suppliersRouter);
apps/api/src/index.ts:127:app.use('/api/:tenantSlug/purchase-orders', purchaseOrdersRouter);
apps/api/src/index.ts:128:app.use('/api/purchase-orders', purchaseOrdersRouter);
apps/api/src/index.ts:129:app.use('/api/:tenantSlug/tasks', tasksRouter);
apps/api/src/index.ts:130:app.use('/api/tasks', tasksRouter);
apps/api/src/index.ts:131:app.use('/api/:tenantSlug/users', usersRouter);
apps/api/src/index.ts:132:app.use('/api/users', usersRouter);
apps/api/src/index.ts:133:app.use('/api/:tenantSlug/security', securityRouter);
apps/api/src/index.ts:134:app.use('/api/security', securityRouter);
apps/api/src/index.ts:136:app.use('/api/:tenantSlug/procurement', procurementRouter);
apps/api/src/index.ts:137:app.use('/api/procurement', procurementRouter);
apps/api/src/index.ts:138:app.use('/api/:tenantSlug/reports', reportsRouter);
apps/api/src/index.ts:139:app.use('/api/reports', reportsRouter);
apps/api/src/index.ts:140:app.use('/api/:tenantSlug/stock-alerts', stockAlertsRouter);
apps/api/src/index.ts:141:app.use('/api/stock-alerts', stockAlertsRouter);
apps/api/src/index.ts:142:app.use('/api/:tenantSlug/pwa', pwaRouter);
apps/api/src/index.ts:143:app.use('/api/pwa', pwaRouter);
apps/api/src/index.ts:144:app.use('/api/:tenantSlug/billing', billingRouter);
apps/api/src/index.ts:145:app.use('/api/billing', billingRouter);
apps/api/src/index.ts:146:app.use('/api/webhooks', webhookRouter);
apps/api/src/index.ts:147:app.use('/api/public', publicRouter);
apps/api/src/index.ts:157:app.use(errorHandler);

---

## 2. Orders Router

import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { validateTenant } from '../middleware/validateTenant';
import { attachScope } from '../middleware/scope';
import { requireTenantBillingActive } from '../middleware/tenantBilling';
import { requireRole } from '../middleware/requireRole';
import { attachTenantCapabilities, requireTenantModule } from '../middleware/tenantCapabilities';
import { addOrderMessage, addOrderNote, createOrder, getOrderById, getOrderChecklist, listOrders, updateOrderChecklist, updateOrderDetails, updateOrderFinancials, updateOrderStatus, updateOrderWarranty, uploadOrderAttachments } from '../controllers/orders';

const router = Router({ mergeParams: true });

router.use(requireAuth);
router.use(validateTenant);
router.use(attachScope);
router.use(requireTenantBillingActive);
router.use(attachTenantCapabilities);

router.get('/', requireTenantModule('orders'), listOrders);
router.post('/', requireTenantModule('orders'), createOrder);

// Legacy compatibility while migrating clients.
router.get('/legacy', requireRole('owner', 'manager'), listOrders);
router.get('/:id', requireTenantModule('orders'), getOrderById);
router.post('/:id/attachments', requireTenantModule('documents'), uploadOrderAttachments);
router.post('/:id/notes', requireTenantModule('orders'), addOrderNote);
router.post('/:id/messages', requireTenantModule('orders'), addOrderMessage);
router.patch('/:id/status', requireTenantModule('orders'), updateOrderStatus);
router.patch('/:id/details', requireTenantModule('orders'), updateOrderDetails);
router.patch('/:id/financials', requireTenantModule('finance'), updateOrderFinancials);
router.get('/:id/checklist', requireTenantModule('orders'), getOrderChecklist);
router.put('/:id/checklist', requireTenantModule('orders'), updateOrderChecklist);
router.patch('/:id/warranty', requireTenantModule('warranty'), updateOrderWarranty);

export default router;

---

## 3. Orders Controller

import { Request, Response } from 'express';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import PDFDocument from 'pdfkit';
import { getTenantClient, supabaseAdmin } from '@white-label/database';
import { loadTenantRuntimeConfig } from '../services/tenant-config';
import { calculateOperationalRisk } from '../services/operational-risk';
import { sendTenantPushNotification } from '../services/pwa-push';

const defaultOrderStatuses = ['recibido', 'diagnostico', 'reparacion', 'listo', 'entregado'] as const;
const orderStatusSchema = z.string().min(1);

const encodedFileSchema = z.object({
  fileName: z.string().min(1),
  mimeType: z.string().min(1),
  base64: z.string().min(1),
  fileType: z.enum(['intake_photo', 'attachment_pdf']),
});

const attachmentRequestSchema = z.object({
  files: z.array(encodedFileSchema).min(1),
});

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
  metadata: z.record(z.unknown()).optional(),
});

type EvidenceEntry =
  | {
      kind: 'document';
      id: string;
      file_name: string;
      file_type: 'intake_photo' | 'attachment_pdf' | 'receipt_pdf';
      public_url: string | null;
      mime_type: string;
      created_at: string;
    }
  | {
      kind: 'event';
      id: string;
      event_type: string;
      previous_status: string | null;
      new_status: string | null;
      note: string | null;
      actor_name: string | null;
      created_at: string;
    };

type TenantBranding = {
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
};

type OperationalStatus = {
  key?: string;
  label?: string;
  tone?: string;
};

type OrderDocumentRow = {
  id: string;
  tenant_id: string;
  service_order_id: string;
  bucket_name: string;
  storage_path: string;
  public_url: string | null;
  file_name: string;
  file_type: string;
  mime_type: string | null;
  file_size: number | null;
  source: string;
  created_at: string;
};

type OrderEventRow = {
  id: string;
  tenant_id: string;
  service_order_id: string;
  event_type: string;
  previous_status: string | null;
  new_status: string | null;
  note: string | null;
  actor_name: string | null;
  created_at: string;
};

function isUuid(value: unknown) {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function getRequestScope(req: Request) {
  return req.scope ?? null;
}

function getScopedBranchId(req: Request) {
  const scope = getRequestScope(req);
  if (scope?.mode === 'branch' && isUuid(scope.sucursalId)) {
    return scope.sucursalId;
  }

  return null;
}

function applyOrderAccessScope(query: any, req: Request) {
  let scopedQuery = query;
  const branchId = getScopedBranchId(req);
  if (branchId) {
    scopedQuery = scopedQuery.eq('sucursal_id', branchId);
  }

  if (req.user?.role === 'technician' && req.user.userId) {
    scopedQuery = scopedQuery.eq('assigned_user_id', req.user.userId);
  }

  return scopedQuery;
}

function buildPdfAttachment(receiptUrl?: string | null) {
  if (!receiptUrl) {
    return null;
  }

  const isDataUrl = receiptUrl.startsWith('data:');
  return {
    type: 'receipt_pdf' as const,
    label: 'PDF de la orden',
    url: receiptUrl,
    fileName: isDataUrl ? null : 'recepcion.pdf',
    mimeType: 'application/pdf',
    source: isDataUrl ? ('inline_data_url' as const) : ('stored_url' as const),
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
    backupRequired: false,
    notes: '',
  }),
  receiptUrl: z.string().optional().or(z.literal('')),
  sucursalId: z.string().min(1).optional(),
  metadata: z.record(z.unknown()).optional(),
});

function normalizeOrderStatus(status?: string | null) {
  const value = String(status ?? '').toLowerCase();
  if (value.includes('diag')) return 'diagnostico';
  if (value.includes('refaccion')) return 'en_espera_de_refaccion';
  if (value.includes('cotiz')) return 'cotizado';
  if (value.includes('repar')) return 'reparacion';
  if (value.includes('listo') && value.includes('entrega')) return 'listo_para_entrega';
  if (value.includes('list')) return 'listo';
  if (value.includes('entreg')) return 'entregado';
  return 'recibido';
}

function getStorageBucketName() {
  return process.env.SUPABASE_ORDER_BUCKET ?? 'order-assets';
}

function getFileExtension(fileName: string, mimeType: string) {
  if (mimeType === 'application/pdf') return 'pdf';
  const lower = fileName.toLowerCase();
  const dotIndex = lower.lastIndexOf('.');
  return dotIndex >= 0 ? lower.slice(dotIndex + 1) : mimeType.split('/').pop() ?? 'bin';
}

function decodeBase64File(base64: string) {
  const cleaned = base64.includes(',') ? base64.split(',').pop() ?? '' : base64;
  return Buffer.from(cleaned, 'base64');
}

function readEvidenceMetadata(input: unknown): EvidenceEntry[] {
  if (!Array.isArray(input)) {
    return [];
  }
  return input.filter(Boolean) as EvidenceEntry[];
}

function appendEvidenceEntry(input: unknown, entry: EvidenceEntry) {
  return [...readEvidenceMetadata(input), entry];
}

function normalizeOrderDocuments(rows: OrderDocumentRow[] | null | undefined, metadata: EvidenceEntry[]) {
  const tableDocuments = (rows ?? []).map((row) => ({
    id: row.id,
    file_name: row.file_name,
    file_type: row.file_type,
    public_url: row.public_url,
    mime_type: row.mime_type ?? 'application/octet-stream',
    created_at: row.created_at,
    source: row.source ?? 'upload',
  }));

  const metadataDocuments = metadata
    .filter((entry): entry is Extract<EvidenceEntry, { kind: 'document' }> => entry.kind === 'document')
    .map((entry) => ({
      id: entry.id,
      file_name: entry.file_name,
      file_type: entry.file_type,
      public_url: entry.public_url,
      mime_type: entry.mime_type,
      created_at: entry.created_at,
      source: 'metadata',
    }));

  const documents = [...tableDocuments, ...metadataDocuments];
  const deduped = new Map<string, (typeof documents)[number]>();
  for (const document of documents) {
    deduped.set(document.id, document);
  }
  return [...deduped.values()];
}

function normalizeOrderEvents(rows: OrderEventRow[] | null | undefined, metadata: EvidenceEntry[]) {
  const tableEvents = (rows ?? []).map((row) => ({
    id: row.id,
    event_type: row.event_type,
    previous_status: row.previous_status,
    new_status: row.new_status,
    note: row.note,
    actor_name: row.actor_name,
    created_at: row.created_at,
  }));

  const metadataEvents = metadata
    .filter((entry): entry is Extract<EvidenceEntry, { kind: 'event' }> => entry.kind === 'event')
    .map((entry) => ({
      id: entry.id,
      event_type: entry.event_type,
      previous_status: entry.previous_status,
      new_status: entry.new_status,
      note: entry.note,
      actor_name: entry.actor_name,
      created_at: entry.created_at,
    }));

  const events = [...tableEvents, ...metadataEvents];
  const deduped = new Map<string, (typeof events)[number]>();
  for (const event of events) {
    deduped.set(event.id, event);
  }
  return [...deduped.values()];
}

async function insertOrderDocument(supabase: ReturnType<typeof getTenantClient>, row: {
  id: string;
  tenant_id: string;
  service_order_id: string;
  bucket_name: string;
  storage_path: string;
  public_url: string | null;
  file_name: string;
  file_type: string;
  mime_type: string;
  file_size: number;
  source: string;
}) {
  const { error } = await supabase.from('service_order_documents').insert([row]);
  if (error) {
    throw new Error(`Failed to persist service_order_documents: ${error.message}`);
  }
}

async function insertOrderEvent(supabase: ReturnType<typeof getTenantClient>, row: {
  id: string;
  tenant_id: string;
  service_order_id: string;
  event_type: string;
  previous_status: string | null;
  new_status: string | null;
  note: string | null;
  actor_name: string | null;
}) {
  const { error } = await supabase.from('service_order_events').insert([row]);
  if (error) {
    throw new Error(`Failed to persist service_order_events: ${error.message}`);
  }
}

async function getTenantBranding(tenantId: string): Promise<{ name: string; branding: TenantBranding | null }> {
  const { data, error } = await supabaseAdmin
    .from('tenants')
    .select('name, branding')
    .eq('id', tenantId)
    .single();

  if (error || !data) {
    return { name: 'FIXI', branding: null };
  }

  return {
    name: String(data.name ?? 'FIXI'),
    branding: (data.branding as TenantBranding | null) ?? null,
  };
}

async function getTenantOperationalStatuses(tenantId: string) {
  const config = await loadTenantRuntimeConfig(tenantId);
  const statuses = config.statusOptions.service_orders ?? [];
  if (statuses.length > 0) {
    return statuses.map((status) => ({
      key: String(status.key),
      label: String(status.label ?? status.key),
      tone: String(status.tone ?? 'zinc'),
    }));
  }

  return defaultOrderStatuses.map((status) => ({ key: status, label: status, tone: 'zinc' }));
}

async function getAllowedOrderStatusKeys(tenantId: string) {
  const statuses = await getTenantOperationalStatuses(tenantId);
  return new Set(statuses.map((status) => status.key ?? '').filter(Boolean));
}

async function generateReceiptPdf(options: {
  order: Record<string, unknown>;
  tenantName: string;
  tenantBranding?: TenantBranding | null;
  photo?: {
    buffer: Buffer;
    mimeType: string;
    fileName: string;
  } | null;
}) {
  const doc = new PDFDocument({ size: 'A4', margin: 40 });
  const chunks: Buffer[] = [];

  doc.on('data', (chunk: Buffer | Uint8Array) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));

  const ended = new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });

  const primaryColor = options.tenantBranding?.primaryColor || '#2c6e9f';
  const secondaryColor = options.tenantBranding?.secondaryColor || '#0f172a';
  const logoUrl = options.tenantBranding?.logoUrl?.trim() || '';

  doc.rect(40, 40, 515, 70).fill(primaryColor);
  doc.fillColor('#ffffff').fontSize(20).text(options.tenantName || 'FIXI', 58, 58, { width: 340 });
  doc.fillColor('#ffffff').fontSize(10).text('Comprobante de recepción', 58, 82, { width: 340 });
  doc.fillColor('#ffffff').fontSize(9).text('Documento generado automáticamente', 420, 60, { width: 120, align: 'right' });
  doc.moveDown(3.5);

  if (logoUrl) {
    try {
      const response = await fetch(logoUrl);
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        doc.image(Buffer.from(arrayBuffer), 415, 128, { fit: [110, 52] });
      }
    } catch {
      doc.rect(415, 128, 110, 52).lineWidth(1).strokeColor(primaryColor).stroke();
      doc.fillColor(primaryColor).fontSize(8).text('Logo no disponible', 420, 150, { width: 100, align: 'center' });
    }
  }

  doc.fillColor(secondaryColor).fontSize(18).text('Comprobante de Recepción', { align: 'left' });
  doc.moveDown(0.5);
  doc.fontSize(10).fillColor('#374151').text(`Folio: ${String(options.order.folio ?? '')}`);
  doc.text(`Cliente: ${String((options.order.device_info as { customer_name?: string } | undefined)?.customer_name ?? '')}`);
  doc.text(`Teléfono: ${String((options.order.device_info as { customer_phone?: string } | undefined)?.customer_phone ?? '')}`);
  doc.text(`Correo: ${String((options.order.device_info as { customer_email?: string } | undefined)?.customer_email ?? '')}`);
  doc.text(`Equipo: ${String((options.order.device_info as { type?: string } | undefined)?.type ?? options.order.device_type ?? '')} - ${String(options.order.device_model ?? '')}`);
  doc.text(`Problema: ${String(options.order.problem_description ?? '')}`);
  doc.text(`Estado: ${String(options.order.status ?? '')}`);
  doc.text(`Fecha: ${new Date().toLocaleString('es-MX')}`);

  doc.moveDown(0.75);
  doc.fontSize(12).fillColor(secondaryColor).text('Evidencia fotográfica', { underline: true });
  doc.moveDown(0.5);

  if (options.photo) {
    try {
      doc.image(options.photo.buffer, {
        fit: [500, 280],
        align: 'center',
        valign: 'center',
      });
    } catch {
      doc.fontSize(10).fillColor('#6b7280').text('La evidencia fotográfica no pudo incrustarse en el PDF, pero sí quedó almacenada como archivo.');
    }
  } else {
    doc.fontSize(10).fillColor('#6b7280').text('No se recibió evidencia fotográfica en este flujo.');
  }

  doc.moveDown(0.8);
  doc.fontSize(10).fillColor('#6b7280').text(`Documento generado automáticamente por ${options.tenantName || 'FIXI'}.`);
  doc.end();

  return ended;
}

async function ensureBucketExists(bucketName: string) {
  const { error } = await supabaseAdmin.storage.getBucket(bucketName);
  if (!error) {
    return;
  }
  const { error: createError } = await supabaseAdmin.storage.createBucket(bucketName, {
    public: true,
    fileSizeLimit: 52428800,
  });
  if (createError) {
    throw new Error(`Unable to ensure storage bucket ${bucketName}: ${createError.message}`);
  }
}

async function uploadBufferToStorage(options: {
  tenantId: string;
  orderId: string;
  bucketName: string;
  fileName: string;
  mimeType: string;
  buffer: Buffer;
  fileType: 'intake_photo' | 'attachment_pdf' | 'receipt_pdf';
}) {
  const storagePath = `tenant/${options.tenantId}/orders/${options.orderId}/${Date.now()}-${options.fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const { error: uploadError } = await supabaseAdmin.storage
    .from(options.bucketName)
    .upload(storagePath, options.buffer, {
      contentType: options.mimeType,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Failed to upload ${options.fileType}: ${uploadError.message}`);
  }

  const { data: publicData } = supabaseAdmin.storage.from(options.bucketName).getPublicUrl(storagePath);
  return {
    storagePath,
    publicUrl: publicData.publicUrl ?? null,
  };
}

export const createOrder = async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId;

    if (!tenantId) {
      return res.status(401).json({ error: 'Tenant context is required' });
    }

    const validatedData = createOrderSchema.parse(req.body);
    const supabase = getTenantClient(tenantId);

    const scope = getRequestScope(req);
    const scopeSucursalId = scope?.sucursalId ?? null;
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
        details: error.message,
      });
    }

    const checklist = validatedData.checklist ?? {
      hasCharger: false,
      screenCondition: '',
      powersOn: false,
      backupRequired: false,
      notes: '',
    };

    const { error: checklistError } = await supabase.from('service_order_checklists').insert([
      {
        tenant_id: tenantId,
        service_order_id: data.id,
        has_charger: checklist.hasCharger,
        screen_condition: checklist.screenCondition || null,
        powers_on: checklist.powersOn,
        backup_required: checklist.backupRequired,
        notes: checklist.notes || null,
      },
    ]);

    if (checklistError) {
      console.error('Supabase checklist insert error:', checklistError.message);
      return res.status(502).json({
        error: 'Failed to persist order checklist',
        details: checklistError.message,
      });
    }

    const createdEventId = randomUUID();
    await supabase
      .from('service_orders')
      .update({
        evidence_metadata: appendEvidenceEntry(data.evidence_metadata, {
          kind: 'event',
          id: createdEventId,
          event_type: 'created',
          previous_status: null,
          new_status: 'recibido',
          note: validatedData.issue,
          actor_name: req.user?.email ?? req.user?.role ?? 'system',
          created_at: new Date().toISOString(),
        }),
      })
      .eq('tenant_id', tenantId)
      .eq('id', data.id);

    await insertOrderEvent(supabase, {
      id: createdEventId,
      tenant_id: tenantId,
      service_order_id: data.id,
      event_type: 'created',
      previous_status: null,
      new_status: 'recibido',
      note: validatedData.issue,
      actor_name: req.user?.email ?? req.user?.role ?? 'system',
    });

    const pdfAttachment = buildPdfAttachment(validatedData.receiptUrl || null);

    if (data.assigned_user_id) {
      void sendTenantPushNotification(tenantId, {
        type: 'order.assigned',
        title: 'Nueva orden asignada',
        body: `Se asignó la orden ${newFolio} para seguimiento.`,
        data: {
          orderId: data.id,
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
        error: 'Datos de validación incorrectos',
        details: error.errors,
      });
    }
    console.error('Error creating order:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const listOrders = async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId;
    const scope = getRequestScope(req);

    if (!tenantId) {
      return res.status(401).json({ error: 'Tenant context is required' });
    }

    const supabase = getTenantClient(tenantId);
    let query = supabase
      .from('service_orders')
      .select('*, service_order_checklists(*)')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .limit(50);

    query = applyOrderAccessScope(query, req);

    const { data, error } = await query;

    if (error) {
      return res.status(502).json({
        error: 'Failed to fetch orders',
        details: error.message,
      });
    }

    const runtimeConfig = await loadTenantRuntimeConfig(tenantId);
    const enrichedData = (data ?? []).map((order) => ({
      ...order,
      operational_risk: calculateOperationalRisk({ order, runtimeConfig }),
    }));

    return res.status(200).json({
      success: true,
      data: enrichedData,
    });
  } catch (error) {
    console.error('Error listing orders:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId;
    const orderId = req.params.id;
    const scope = getRequestScope(req);

    if (!tenantId) {
      return res.status(401).json({ error: 'Tenant context is required' });
    }

    if (!orderId) {
      return res.status(400).json({ error: 'Order id is required' });
    }

    const supabase = getTenantClient(tenantId);
    let orderQuery = supabase
      .from('service_orders')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('id', orderId);

    orderQuery = applyOrderAccessScope(orderQuery, req);

    const [orderResult, checklistResult, documentsResult, eventsResult, runtimeConfig] = await Promise.all([
      orderQuery.select('*, metadata').single(),
      supabase
        .from('service_order_checklists')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('service_order_id', orderId)
        .maybeSingle(),
      supabase
        .from('service_order_documents')
        .select('id, tenant_id, service_order_id, bucket_name, storage_path, public_url, file_name, file_type, mime_type, file_size, source, created_at')
        .eq('tenant_id', tenantId)
        .eq('service_order_id', orderId)
        .order('created_at', { ascending: true }),
      supabase
        .from('service_order_events')
        .select('id, tenant_id, service_order_id, event_type, previous_status, new_status, note, actor_name, created_at')
        .eq('tenant_id', tenantId)
        .eq('service_order_id', orderId)
        .order('created_at', { ascending: true }),
      loadTenantRuntimeConfig(tenantId),
    ]);

    if (orderResult.error || !orderResult.data) {
      return res.status(404).json({
        error: 'Order not found',
        details: orderResult.error?.message ?? 'Not found',
      });
    }

    if (checklistResult.error) {
      return res.status(502).json({ error: 'Failed to fetch order checklist', details: checklistResult.error.message });
    }

    if (documentsResult.error) {
      return res.status(502).json({ error: 'Failed to fetch order documents', details: documentsResult.error.message });
    }

    if (eventsResult.error) {
      return res.status(502).json({ error: 'Failed to fetch order events', details: eventsResult.error.message });
    }

    const evidenceMetadata = readEvidenceMetadata(orderResult.data.evidence_metadata);
    const documents = normalizeOrderDocuments(documentsResult.data ?? [], evidenceMetadata);
    const events = normalizeOrderEvents(eventsResult.data ?? [], evidenceMetadata);
    const operationalRisk = calculateOperationalRisk({
      order: orderResult.data,
      runtimeConfig,
      statusEvents: events
        .filter((event) => event.event_type === 'status_changed')
        .map((event) => ({
          created_at: event.created_at,
          new_status: event.new_status,
        })),
    });
    const pdfAttachment = buildPdfAttachment(
      orderResult.data.receipt_url || documents.find((document) => document.file_type === 'receipt_pdf' && document.public_url)?.public_url || null
    );

    return res.json({
      success: true,
      data: {
        order: {
          ...orderResult.data,
          operational_risk: operationalRisk,
        },
        operational_risk: operationalRisk,
        documents,
        events,
        checklist: checklistResult.data ?? null,
        pdf_attachment: pdfAttachment,
        attachments: pdfAttachment ? [pdfAttachment] : [],
      },
    });
  } catch (error) {
    console.error('Error getting order by id:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const uploadOrderAttachments = async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId;
    const orderId = req.params.id;
    const scope = getRequestScope(req);

    if (!tenantId) {
      return res.status(401).json({ error: 'Tenant context is required' });
    }

    const parsed = attachmentRequestSchema.parse(req.body);
    const supabase = getTenantClient(tenantId);

    const { data: order, error: orderError } = await supabase
      .from('service_orders')
      .select('id, tenant_id, evidence_metadata')
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

    const bucketName = getStorageBucketName();
    await ensureBucketExists(bucketName);
    const tenantBranding = await getTenantBranding(tenantId);

    const createdDocuments = [];
    let uploadedPhoto: { buffer: Buffer; mimeType: string; fileName: string } | null = null;
    for (const file of parsed.files) {
      const fileBuffer = decodeBase64File(file.base64);
      const extension = getFileExtension(file.fileName, file.mimeType);
      const safeName = file.fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `tenant/${tenantId}/orders/${orderId}/${Date.now()}-${safeName}`;

      const { error: uploadError } = await supabaseAdmin.storage.from(bucketName).upload(storagePath, fileBuffer, {
        contentType: file.mimeType,
        upsert: false,
      });

      if (uploadError) {
        return res.status(502).json({
          error: 'Failed to upload attachment',
          details: uploadError.message,
        });
      }

      const { data: publicData } = supabaseAdmin.storage.from(bucketName).getPublicUrl(storagePath);
      const documentId = randomUUID();
      const documentRow = {
        id: documentId,
        tenant_id: tenantId,
        service_order_id: orderId,
        bucket_name: bucketName,
        storage_path: storagePath,
        public_url: publicData.publicUrl ?? null,
        file_name: file.fileName,
        file_type: file.fileType,
        mime_type: file.mimeType,
        file_size: fileBuffer.length,
        source: 'upload',
        created_by: null,
        created_at: new Date().toISOString(),
        extension,
      };
      createdDocuments.push(documentRow);

      await insertOrderDocument(supabase, {
        id: documentId,
        tenant_id: tenantId,
        service_order_id: orderId,
        bucket_name: bucketName,
        storage_path: storagePath,
        public_url: publicData.publicUrl ?? null,
        file_name: file.fileName,
        file_type: file.fileType,
        mime_type: file.mimeType,
        file_size: fileBuffer.length,
        source: 'upload',
      });

      const { data: latestDocumentEvidence } = await supabase
        .from('service_orders')
        .select('evidence_metadata')
        .eq('tenant_id', tenantId)
        .eq('id', orderId)
        .single();

      await supabase
        .from('service_orders')
        .update({
          evidence_metadata: appendEvidenceEntry(latestDocumentEvidence?.evidence_metadata, {
            kind: 'document',
            id: documentId,
            file_name: file.fileName,
            file_type: file.fileType,
            public_url: publicData.publicUrl ?? null,
            mime_type: file.mimeType,
            created_at: new Date().toISOString(),
          }),
        })
        .eq('tenant_id', tenantId)
        .eq('id', orderId);

      if (file.fileType === 'intake_photo') {
        uploadedPhoto = {
          buffer: fileBuffer,
          mimeType: file.mimeType,
          fileName: file.fileName,
        };
      }
    }

    if (uploadedPhoto) {
      const { data: latestOrder, error: latestOrderError } = await supabase
        .from('service_orders')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('id', orderId)
        .single();

      if (latestOrderError || !latestOrder) {
        return res.status(404).json({ error: 'Order not found', details: latestOrderError?.message ?? 'Not found' });
      }

      const receiptPdfBuffer = await generateReceiptPdf({
        order: latestOrder,
        photo: uploadedPhoto,
        tenantName: tenantBranding.name,
        tenantBranding: tenantBranding.branding,
      });
      const receiptUpload = await uploadBufferToStorage({
        tenantId,
        orderId,
        bucketName,
        fileName: 'recepcion.pdf',
        mimeType: 'application/pdf',
        buffer: receiptPdfBuffer,
        fileType: 'receipt_pdf',
      });

      const { data: latestReceiptOrder, error: latestReceiptOrderError } = await supabase
        .from('service_orders')
        .select('evidence_metadata')
        .eq('tenant_id', tenantId)
        .eq('id', orderId)
        .single();

      if (latestReceiptOrderError) {
        return res.status(502).json({
          error: 'Failed to persist receipt evidence',
          details: latestReceiptOrderError.message,
        });
      }

      const receiptDocumentId = randomUUID();
      const { error: receiptUpdateError } = await supabase
        .from('service_orders')
        .update({
          receipt_url: receiptUpload.publicUrl,
          evidence_metadata: appendEvidenceEntry(latestReceiptOrder?.evidence_metadata, {
            kind: 'document',
            id: receiptDocumentId,
            file_name: 'recepcion.pdf',
            file_type: 'receipt_pdf',
            public_url: receiptUpload.publicUrl,
            mime_type: 'application/pdf',
            created_at: new Date().toISOString(),
          }),
        })
        .eq('tenant_id', tenantId)
        .eq('id', orderId);

      if (receiptUpdateError) {
        return res.status(502).json({
          error: 'Failed to persist receipt url',
          details: receiptUpdateError.message,
        });
      }

      createdDocuments.push({
        id: receiptDocumentId,
        tenant_id: tenantId,
        service_order_id: orderId,
        bucket_name: bucketName,
        storage_path: receiptUpload.storagePath,
        public_url: receiptUpload.publicUrl,
        file_name: 'recepcion.pdf',
        file_type: 'receipt_pdf',
        mime_type: 'application/pdf',
        file_size: receiptPdfBuffer.length,
        source: 'generated',
        created_by: null,
        created_at: new Date().toISOString(),
      });

      await insertOrderDocument(supabase, {
        id: receiptDocumentId,
        tenant_id: tenantId,
        service_order_id: orderId,
        bucket_name: bucketName,
        storage_path: receiptUpload.storagePath,
        public_url: receiptUpload.publicUrl,
        file_name: 'recepcion.pdf',
        file_type: 'receipt_pdf',
        mime_type: 'application/pdf',
        file_size: receiptPdfBuffer.length,
        source: 'generated',
      });

      // receipt evidence is appended in the single update above to avoid duplicate writes
    }

    return res.status(201).json({
      success: true,
      data: createdDocuments,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid payload', details: error.errors });
    }
    console.error('Error uploading attachments:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const addOrderNote = async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId;
    const orderId = req.params.id;
    const scope = getRequestScope(req);

    if (!tenantId) {
      return res.status(401).json({ error: 'Tenant context is required' });
    }

    const body = noteRequestSchema.parse(req.body);
    const supabase = getTenantClient(tenantId);

    const { data: order, error: orderError } = await supabase
      .from('service_orders')
      .select('id, status, evidence_metadata')
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

    const noteEntry: EvidenceEntry = {
      kind: 'event',
      id: randomUUID(),
      event_type: 'note',
      previous_status: order.status,
      new_status: order.status,
      note: body.note,
      actor_name: body.actorName ?? req.user?.email ?? req.user?.role ?? 'system',
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('service_orders')
      .update({ evidence_metadata: appendEvidenceEntry((order as { evidence_metadata?: unknown }).evidence_metadata, noteEntry) })
      .eq('tenant_id', tenantId)
      .eq('id', orderId);

    if (error) {
      return res.status(502).json({ error: 'Failed to persist order note', details: error.message });
    }

    const noteEventId = (noteEntry as { id: string }).id;
    await insertOrderEvent(supabase, {
      id: noteEventId,
      tenant_id: tenantId,
      service_order_id: orderId,
      event_type: 'note',
      previous_status: order.status,
      new_status: order.status,
      note: body.note,
      actor_name: body.actorName ?? req.user?.email ?? req.user?.role ?? 'system',
    });

    void sendTenantPushNotification(tenantId, {
      type: 'order.message',
      title: 'Nuevo mensaje técnico',
      body: body.note,
      data: {
        orderId,
        tenantId,
        eventType: 'note',
      },
    });

    return res.status(201).json({ success: true, data: noteEntry });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid payload', details: error.errors });
    }
    console.error('Error adding note:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const addOrderMessage = addOrderNote;

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId;
    const orderId = req.params.id;
    const scope = getRequestScope(req);

    if (!tenantId) {
      return res.status(401).json({ error: 'Tenant context is required' });
    }

    const body = statusRequestSchema.parse(req.body);
    const supabase = getTenantClient(tenantId);

    const { data: order, error: orderError } = await supabase
      .from('service_orders')
      .select('id, status, evidence_metadata')
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

    const previousStatus = normalizeOrderStatus(order.status);
    const nextStatus = body.status;
    const allowedStatuses = await getAllowedOrderStatusKeys(tenantId);

    if (!allowedStatuses.has(nextStatus)) {
      return res.status(400).json({ error: 'Invalid status', details: { allowedStatuses: [...allowedStatuses] } });
    }

    const { data, error } = await supabase
      .from('service_orders')
      .update({
        status: nextStatus,
        received_at: nextStatus === 'recibido' ? new Date().toISOString() : undefined,
        completed_at: nextStatus === 'listo' ? new Date().toISOString() : undefined,
        delivered_at: nextStatus === 'entregado' ? new Date().toISOString() : undefined,
      })
      .eq('tenant_id', tenantId)
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      return res.status(502).json({ error: 'Failed to update order status', details: error.message });
    }

    const statusEventId = randomUUID();
    await supabase
      .from('service_orders')
      .update({
        evidence_metadata: appendEvidenceEntry(data.evidence_metadata, {
          kind: 'event',
          id: statusEventId,
          event_type: 'status_changed',
          previous_status: previousStatus,
          new_status: nextStatus,
          note: body.note || null,
          actor_name: req.user?.email ?? req.user?.role ?? 'system',
          created_at: new Date().toISOString(),
        }),
      })
      .eq('tenant_id', tenantId)
      .eq('id', orderId);

    await insertOrderEvent(supabase, {
      id: statusEventId,
      tenant_id: tenantId,
      service_order_id: orderId,
      event_type: 'status_changed',
      previous_status: previousStatus,
      new_status: nextStatus,
      note: body.note || null,
      actor_name: req.user?.email ?? req.user?.role ?? 'system',
    });

    void sendTenantPushNotification(tenantId, {
      type: 'order.status_changed',
      title: 'Cambio de estado',
      body: `La orden ${orderId} cambió a ${nextStatus}.`,
      data: {
        orderId,
        tenantId,
        previousStatus,
        nextStatus,
      },
    });

    return res.json({ success: true, data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid payload', details: error.errors });
    }
    console.error('Error updating status:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateOrderFinancials = async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId;
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
      ? {
          kind: 'event' as const,
          id: randomUUID(),
          event_type: 'financials_updated',
          previous_status: null,
          new_status: null,
          note: body.note.trim(),
          actor_name: req.user?.email ?? req.user?.role ?? 'system',
          created_at: new Date().toISOString(),
        }
      : null;

    if (noteEntry) {
      const { error: metadataError } = await supabase
        .from('service_orders')
        .update({
          evidence_metadata: appendEvidenceEntry((order as { evidence_metadata?: unknown }).evidence_metadata, noteEntry),
        })
        .eq('tenant_id', tenantId)
        .eq('id', orderId);

      if (metadataError) {
        return res.status(502).json({ error: 'Failed to persist financial note', details: metadataError.message });
      }

      await insertOrderEvent(supabase, {
        id: noteEntry.id,
        tenant_id: tenantId,
        service_order_id: orderId,
        event_type: noteEntry.event_type,
        previous_status: null,
        new_status: null,
        note: noteEntry.note,
        actor_name: noteEntry.actor_name,
      });
    }

    return res.json({ success: true, data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid payload', details: error.errors });
    }
    console.error('Error updating order financials:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateOrderDetails = async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId;
    const orderId = req.params.id;
    const scope = getRequestScope(req);

    if (!tenantId) {
      return res.status(401).json({ error: 'Tenant context is required' });
    }

    const body = orderDetailsUpdateSchema.parse(req.body);
    const supabase = getTenantClient(tenantId);

    const { data: existing, error: existingError } = await supabase
      .from('service_orders')
      .select('id, device_info')
      .eq('tenant_id', tenantId)
      .eq('id', orderId)
      .eq(
        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? scope.sucursalId : tenantId,
      )
      .single();

    if (existingError || !existing) {
      return res.status(404).json({ error: 'Order not found', details: existingError?.message ?? 'Not found' });
    }

    const currentDeviceInfo = (existing.device_info as Record<string, unknown> | null) ?? {};
    const nextDeviceInfo = {
      ...currentDeviceInfo,
      customer_name: body.clientName ?? String(currentDeviceInfo.customer_name ?? ''),
      customer_phone: body.clientPhone ?? String(currentDeviceInfo.customer_phone ?? ''),
      customer_email: body.clientEmail === undefined ? currentDeviceInfo.customer_email ?? null : body.clientEmail || null,
      type: body.deviceType ?? String(currentDeviceInfo.type ?? ''),
      brand: body.deviceModel ?? String(currentDeviceInfo.brand ?? ''),
      model: body.deviceModel ?? String(currentDeviceInfo.model ?? ''),
    };

    const { data, error } = await supabase
      .from('service_orders')
      .update({
        device_info: nextDeviceInfo,
        device_type: body.deviceType ?? undefined,
        device_model: body.deviceModel ?? undefined,
        problem_description: body.issue ?? undefined,
        promised_date: body.promisedDate === '' ? null : body.promisedDate,
        metadata: body.metadata ?? undefined,
      })
      .eq('tenant_id', tenantId)
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      return res.status(502).json({ error: 'Failed to update order details', details: error.message });
    }

    return res.json({ success: true, data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid payload', details: error.errors });
    }
    console.error('Error updating order details:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getOrderChecklist = async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId;
    const orderId = req.params.id;
    if (!tenantId) return res.status(401).json({ error: 'Tenant context is required' });
    const supabase = getTenantClient(tenantId);
    const { data, error } = await supabase
      .from('service_order_checklists')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('service_order_id', orderId)
      .maybeSingle();

    if (error) {
      return res.status(502).json({ error: 'Failed to fetch order checklist', details: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'Checklist not found' });
    }

    return res.json({ success: true, data });
  } catch (error) {
    console.error('Error getting checklist:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const updateChecklistSchema = z.object({
  hasCharger: z.coerce.boolean().optional(),
  screenCondition: z.string().optional().or(z.literal('')),
  powersOn: z.coerce.boolean().optional(),
  backupRequired: z.coerce.boolean().optional(),
  notes: z.string().optional().or(z.literal('')),
});

export const updateOrderChecklist = async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId;
    const orderId = req.params.id;
    if (!tenantId) return res.status(401).json({ error: 'Tenant context is required' });

    const body = updateChecklistSchema.parse(req.body);
    const supabase = getTenantClient(tenantId);

    const { data: existing, error: existingError } = await supabase
      .from('service_orders')
      .select('id')
      .eq('tenant_id', tenantId)
      .eq('id', orderId)
      .maybeSingle();

    if (existingError) {
      return res.status(502).json({ error: 'Failed to inspect order', details: existingError.message });
    }

    if (!existing) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const { data, error } = await supabase
      .from('service_order_checklists')
      .upsert({
        tenant_id: tenantId,
        service_order_id: orderId,
        has_charger: body.hasCharger ?? false,
        screen_condition: body.screenCondition || null,
        powers_on: body.powersOn ?? false,
        backup_required: body.backupRequired ?? false,
        notes: body.notes || null,
      }, { onConflict: 'service_order_id' })
      .select('*')
      .single();

    if (error) {
      return res.status(502).json({ error: 'Failed to persist order checklist', details: error.message });
    }

    return res.json({ success: true, data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid payload', details: error.errors });
    }
    console.error('Error updating checklist:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const warrantySchema = z.object({
  warrantyUntil: z.string().datetime().optional(),
  warrantyDays: z.coerce.number().int().positive().optional(),
  note: z.string().optional().or(z.literal('')),
});

export const updateOrderWarranty = async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId;
    const orderId = req.params.id;
    if (!tenantId) return res.status(401).json({ error: 'Tenant context is required' });

    const body = warrantySchema.parse(req.body);
    const supabase = getTenantClient(tenantId);
    const { data: order, error: orderError } = await supabase
      .from('service_orders')
      .select('id, warranty_until, evidence_metadata')
      .eq('tenant_id', tenantId)
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return res.status(404).json({ error: 'Order not found', details: orderError?.message ?? 'Not found' });
    }

    let warrantyUntil = body.warrantyUntil ?? null;
    if (!warrantyUntil && body.warrantyDays) {
      const future = new Date();
      future.setDate(future.getDate() + body.warrantyDays);
      warrantyUntil = future.toISOString();
    }

    const { data, error } = await supabase
      .from('service_orders')
      .update({ warranty_until: warrantyUntil })
      .eq('tenant_id', tenantId)
      .eq('id', orderId)
      .select('*')
      .single();

    if (error) {
      return res.status(502).json({ error: 'Failed to update warranty', details: error.message });
    }

    const warrantyEventId = randomUUID();
    await insertOrderEvent(supabase, {
      id: warrantyEventId,
      tenant_id: tenantId,
      service_order_id: orderId,
      event_type: 'warranty_updated',
      previous_status: null,
      new_status: null,
      note: body.note || (warrantyUntil ? `Garantía hasta ${warrantyUntil}` : 'Garantía actualizada'),
      actor_name: req.user?.email ?? req.user?.role ?? 'system',
    });

    await supabase
      .from('service_orders')
      .update({
        evidence_metadata: appendEvidenceEntry(order.evidence_metadata, {
          kind: 'event',
          id: warrantyEventId,
          event_type: 'warranty_updated',
          previous_status: null,
          new_status: null,
          note: body.note || (warrantyUntil ? `Garantía hasta ${warrantyUntil}` : 'Garantía actualizada'),
          actor_name: req.user?.email ?? req.user?.role ?? 'system',
          created_at: new Date().toISOString(),
        }),
      })
      .eq('tenant_id', tenantId)
      .eq('id', orderId);

    return res.json({ success: true, data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid payload', details: error.errors });
    }
    console.error('Error updating warranty:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

---

## 4. Requests Controller

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
}

export async function listServiceRequests(req: Request, res: Response) {
  try {
    const tenantId = req.tenantId;

    if (!tenantId) {
      return res.status(401).json({ error: 'Tenant context is required' });
    }

    const supabase = getTenantClient(tenantId);
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      return res.status(502).json({ error: 'Failed to fetch service requests', details: error.message });
    }

    return res.status(200).json({
      success: true,
      data: data ?? [],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}

export async function getServiceRequestById(req: Request, res: Response) {
  try {
    const tenantId = req.tenantId;
    const requestId = req.params.id;

    if (!tenantId) {
      return res.status(401).json({ error: 'Tenant context is required' });
    }

    if (!requestId) {
      return res.status(400).json({ error: 'Request id is required' });
    }

    const supabase = getTenantClient(tenantId);
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('id', requestId)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Request not found', details: error?.message ?? 'Not found' });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...data,
        normalized_status: normalizeRequestStatus((data as { status?: string | null }).status ?? null),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}

export async function convertServiceRequestToOrder(req: Request, res: Response) {
  try {
    const tenantId = req.tenantId;
    const requestId = req.params.id;

    if (!tenantId) {
      return res.status(401).json({ error: 'Tenant context is required' });
    }

    if (!requestId) {
      return res.status(400).json({ error: 'Request id is required' });
    }

    const body = convertRequestSchema.parse(req.body);
    const supabase = getTenantClient(tenantId);

    const { data: requestRow, error: requestError } = await supabase
      .from('service_requests')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('id', requestId)
      .single();

    if (requestError || !requestRow) {
      return res.status(404).json({ error: 'Request not found', details: requestError?.message ?? 'Not found' });
    }

    let customerId: string | null = null;
    if (body.createCustomer) {
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .insert([
          {
            tenant_id: tenantId,
            name: requestRow.customer_name,
            phone: requestRow.customer_phone,
            email: requestRow.customer_email || null,
          },
        ])
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
      .update({
        status: 'convertida',
      })
      .eq('tenant_id', tenantId)
      .eq('id', requestId);

    if (updateRequestError) {
      return res.status(502).json({ error: 'Failed to update request status', details: updateRequestError.message });
    }

    return res.status(201).json({
      success: true,
      data: {
        request: {
          ...requestRow,
          status: 'convertida',
        },
        order: orderData,
        customer_id: customerId,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid payload', details: error.errors });
    }
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}

---

## 5. Billing Controller

import { Request, Response } from 'express';
import { z } from 'zod';
import { createBillingCheckout, handleMercadoPagoWebhook } from '../services/billing';

const checkoutSchema = z.object({
  plan: z.enum(['basic', 'pro', 'enterprise']),
});

export async function createCheckout(req: Request, res: Response) {
  if (!req.user?.sub) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const parsed = checkoutSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
  }

  try {
    const result = await createBillingCheckout(req.user.sub, parsed.data);
    return res.status(201).json({
      success: true,
      initPoint: result.initPoint,
      preferenceId: result.preferenceId ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}

export async function createPublicCheckout(req: Request, res: Response) {
  const bodySchema = z.object({
    tenantSlug: z.string().min(1),
    plan: z.enum(['basic', 'pro', 'enterprise']),
  });

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
  }

  try {
    const { tenantSlug, plan } = parsed.data;
    const result = await createBillingCheckout(null, { plan, tenantSlug });
    return res.status(201).json({ success: true, initPoint: result.initPoint, preferenceId: result.preferenceId ?? null });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}

export async function mercadopagoWebhook(req: Request, res: Response) {
  const signature = (req.headers['x-signature'] as string | undefined) ?? (req.headers['x-mp-signature'] as string | undefined);
  const requestId = (req.headers['x-request-id'] as string | undefined) ?? (req.headers['x-correlation-id'] as string | undefined);

  if (!process.env.MP_ACCESS_TOKEN) {
    return res.status(500).json({ error: 'MP_ACCESS_TOKEN no configurado' });
  }

  try {
    const result = await handleMercadoPagoWebhook(req.body, signature, requestId);
    return res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}

---

## 6. Billing Service

import { createHmac } from 'node:crypto';
import { supabaseAdmin } from '@white-label/database';

export type BillingPlanCode = 'basic' | 'pro' | 'enterprise';

type CheckoutRequest = {
  plan: BillingPlanCode;
  tenantSlug?: string;
};

type CheckoutResponse = {
  initPoint: string;
  preferenceId?: string;
};

type MercadoPagoPreferenceResponse = {
  id?: string;
  init_point?: string;
  sandbox_init_point?: string;
};

type MercadoPagoPaymentResponse = {
  id?: string | number;
  status?: string;
  metadata?: {
    tenantId?: string;
    tenantSlug?: string;
    plan?: BillingPlanCode;
    userId?: string;
  };
};

const PLAN_PRICES: Record<BillingPlanCode, number> = {
  basic: 300,
  pro: 450,
  enterprise: 600,
};

function resolveBillingBaseUrl() {
  const candidates = [
    process.env.NEXT_PUBLIC_WEB_PUBLIC_URL,
    process.env.APP_URL,
    process.env.NEXT_PUBLIC_WEB_ADMIN_URL,
    process.env.CORS_ALLOWED_ORIGINS?.split(',').map((origin) => origin.trim()).find(Boolean),
  ].filter((value): value is string => Boolean(value?.trim()));

  if (candidates.length === 0) {
    throw new Error('APP_URL is required');
  }

  return new URL(candidates[0]).toString().replace(/\/$/, '');
}

function requireMercadoPagoAccessToken() {
  const accessToken = process.env.MP_ACCESS_TOKEN?.trim();
  if (!accessToken) {
    throw new Error('MP_ACCESS_TOKEN no configurado');
  }
  return accessToken;
}

function resolveWebhookBaseUrl() {
  const webhookBaseUrl = process.env.WEBHOOK_BASE_URL?.trim() || process.env.APP_URL?.trim();
  if (!webhookBaseUrl) {
    throw new Error('WEBHOOK_BASE_URL is required');
  }
  return webhookBaseUrl.replace(/\/$/, '');
}

function mapPaymentStatus(status: string) {
  if (status === 'approved') return 'active';
  if (status === 'rejected') return 'canceled';
  if (status === 'in_process') return 'pending';
  if (status === 'pending') return 'pending';
  return 'past_due';
}

function buildSignature(paymentId: string, topic: string, signature: string) {
  const webhookSecret = process.env.MP_WEBHOOK_SECRET?.trim();
  if (!webhookSecret) {
    return true;
  }

  const parts = signature.split(',').reduce((acc, part) => {
    const [key, value] = part.split('=');
    if (key && value) {
      acc[key.trim()] = value.trim();
    }
    return acc;
  }, {} as Record<string, string>);

  const ts = parts.ts;
  const v1 = parts.v1;

  if (!ts || !v1) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - Number(ts)) > 600) {
    return false;
  }

  const template = `id:${paymentId};topic:${topic};ts:${ts};`;
  const computed = createHmac('sha256', webhookSecret).update(template).digest('hex');
  return computed === v1;
}

async function writeAuditLog(tenantId: string, action: string, payload: Record<string, unknown>) {
  const { error } = await supabaseAdmin.from('audit_logs').insert([{
    tenant_id: tenantId,
    action,
    data_after: payload,
    created_at: new Date().toISOString(),
  }]);

  if (error) {
    return;
  }
}

async function resolveTenantForCheckout(authUserId?: string | null, tenantSlug?: string) {
  if (tenantSlug) {
    const { data: tenantRow, error: tenantError } = await supabaseAdmin
      .from('tenants')
      .select('id, slug, name, trial_expires_at, billing_exempt')
      .eq('slug', tenantSlug)
      .maybeSingle();

    if (tenantError) {
      throw new Error(tenantError.message);
    }

    if (!tenantRow) {
      throw new Error('Tenant not found');
    }

    return {
      userRow: null,
      tenantRow,
    };
  }

  if (!authUserId) {
    throw new Error('No se pudo resolver el tenant de la sesión');
  }

  const { data: userRow, error: userError } = await supabaseAdmin
    .from('users')
    .select('id, tenant_id, role, email')
    .eq('auth_user_id', authUserId)
    .maybeSingle();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!userRow?.tenant_id) {
    throw new Error('No se pudo resolver el tenant de la sesión');
  }

  const { data: tenantRow, error: tenantError } = await supabaseAdmin
    .from('tenants')
    .select('id, slug, name, trial_expires_at, billing_exempt')
    .eq('id', userRow.tenant_id)
    .maybeSingle();

  if (tenantError) {
    throw new Error(tenantError.message);
  }

  if (!tenantRow) {
    throw new Error('Tenant not found');
  }

  return { userRow, tenantRow };
}

async function updateOrganizationSubscription(input: {
  tenantId: string;
  tenantSlug: string;
  status: string;
}) {
  const { data: existing } = await supabaseAdmin
    .from('organizations')
    .select('id')
    .eq('id', input.tenantId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabaseAdmin
      .from('organizations')
      .update({
        subscription_status: input.status,
      })
      .eq('id', input.tenantId);

    if (error) {
      throw error;
    }
    return;
  }

  const { error } = await supabaseAdmin.from('organizations').insert([{
    id: input.tenantId,
    name: input.tenantSlug,
    slug: input.tenantSlug,
    subscription_status: input.status,
  }]);

  if (error) {
    throw error;
  }
}

export async function createBillingCheckout(authUserId: string | null, request: CheckoutRequest): Promise<CheckoutResponse> {
  const accessToken = requireMercadoPagoAccessToken();
  const amount = PLAN_PRICES[request.plan];

  if (!amount) {
    throw new Error('Plan inválido');
  }

  const { userRow, tenantRow } = await resolveTenantForCheckout(authUserId, request.tenantSlug);
  const appUrl = resolveBillingBaseUrl();
  const webhookBaseUrl = resolveWebhookBaseUrl();

  const preference = {
    items: [
      {
        title: `Servicios Digitales MX - Plan ${request.plan}`,
        quantity: 1,
        currency_id: 'MXN',
        unit_price: amount,
      },
    ],
    back_urls: {
      success: `${appUrl}/billing/success`,
      failure: `${appUrl}/billing/failure`,
      pending: `${appUrl}/billing/pending`,
    },
    auto_return: 'approved',
    notification_url: `${webhookBaseUrl}/api/webhooks/mercadopago`,
    metadata: {
      tenantId: tenantRow.id,
      tenantSlug: tenantRow.slug,
      plan: request.plan,
      ...(userRow ? { userId: userRow.id } : {}),
    },
  };

  const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(preference),
  });

  const json = await response.json().catch(() => ({} as MercadoPagoPreferenceResponse));

  if (!response.ok) {
    throw new Error('Mercado Pago rechazó la preferencia');
  }

  const initPoint = String(json.init_point || json.sandbox_init_point || '').trim();
  if (!initPoint) {
    throw new Error('Mercado Pago no devolvió init_point');
  }

  await writeAuditLog(tenantRow.id, 'billing.checkout_created', {
    tenantId: tenantRow.id,
    tenantSlug: tenantRow.slug,
    plan: request.plan,
    preferenceId: json.id ?? null,
    initPoint,
  });

  return {
    initPoint,
    preferenceId: json.id ? String(json.id) : undefined,
  };
}

export async function handleMercadoPagoWebhook(payload: unknown, signature?: string, requestId?: string) {
  const accessToken = requireMercadoPagoAccessToken();
  const typedPayload = payload as {
    type?: string;
    action?: string;
    data?: { id?: string | number };
    id?: string | number;
    topic?: string;
  };

  const topic = String(typedPayload.type || typedPayload.action || typedPayload.topic || '');
  const paymentId = String(typedPayload.data?.id || typedPayload.id || '');

  if (!paymentId || !topic.includes('payment')) {
    return { received: true };
  }

  if (signature && !buildSignature(paymentId, topic, signature)) {
    throw new Error('Firma inválida');
  }

  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { authorization: `Bearer ${accessToken}` },
  });

  const payment = await response.json().catch(() => ({} as MercadoPagoPaymentResponse));
  if (!response.ok) {
    throw new Error('No se pudo obtener el pago');
  }

  const tenantId = String(payment.metadata?.tenantId || '');
  const tenantSlug = String(payment.metadata?.tenantSlug || '');
  const plan = (payment.metadata?.plan || 'basic') as BillingPlanCode;
  const mappedStatus = mapPaymentStatus(String(payment.status || 'pending'));

  if (tenantId) {
    await updateOrganizationSubscription({
      tenantId,
      tenantSlug,
      status: mappedStatus,
    });
  }

  await writeAuditLog(tenantId || 'unknown', 'billing.mercadopago_webhook', {
    paymentId,
    status: payment.status,
    requestId,
    plan,
  });

  return { received: true };
}

---

## 7. Tenant Billing

import { supabaseAdmin } from '@white-label/database';

export type TenantBillingSummary = {
  tenantId: string;
  tenantSlug: string;
  subscriptionStatus: string;
  trialExpiresAt: string | null;
  billingExempt: boolean;
  isTrialActive: boolean;
  isBillingBlocked: boolean;
  daysLeft: number | null;
  upgradeHref: string | null;
};

function computeDaysLeft(trialExpiresAt: string | null) {
  if (!trialExpiresAt) {
    return null;
  }

  const expiresAt = new Date(trialExpiresAt);
  if (Number.isNaN(expiresAt.getTime())) {
    return null;
  }

  const diffMs = expiresAt.getTime() - Date.now();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export async function loadTenantBillingSummary(tenantId: string, tenantSlug?: string | null): Promise<TenantBillingSummary> {
  const [{ data: tenantRow, error: tenantError }, { data: organizationRow, error: orgError }] = await Promise.all([
    supabaseAdmin
      .from('tenants')
      .select('id, slug, trial_expires_at, billing_exempt')
      .eq('id', tenantId)
      .maybeSingle(),
    supabaseAdmin
      .from('organizations')
      .select('id, slug, subscription_status')
      .eq('id', tenantId)
      .maybeSingle(),
  ]);

  if (tenantError) {
    throw tenantError;
  }

  const resolvedTenantSlug = tenantSlug ?? tenantRow?.slug ?? organizationRow?.slug ?? null;
  const trialExpiresAt = tenantRow?.trial_expires_at ?? null;
  const billingExempt = Boolean(tenantRow?.billing_exempt);
  const subscriptionStatus = String(!orgError ? organizationRow?.subscription_status : 'trial').trim() || 'trial';
  const daysLeft = computeDaysLeft(trialExpiresAt ? new Date(trialExpiresAt).toISOString() : null);
  const isTrialActive = subscriptionStatus === 'trial' && daysLeft !== null && daysLeft > 0;
  const isBillingBlocked = !billingExempt && subscriptionStatus !== 'active' && (!isTrialActive || daysLeft === 0);
  const upgradeBaseUrl = process.env.APP_URL?.trim() || process.env.CORS_ALLOWED_ORIGINS?.split(',').map((origin) => origin.trim()).find(Boolean) || null;
  const upgradeHref = upgradeBaseUrl ? new URL('/onboarding', upgradeBaseUrl).toString() : null;

  return {
    tenantId,
    tenantSlug: resolvedTenantSlug ?? '',
    subscriptionStatus,
    trialExpiresAt: trialExpiresAt ? new Date(trialExpiresAt).toISOString() : null,
    billingExempt,
    isTrialActive,
    isBillingBlocked,
    daysLeft,
    upgradeHref,
  };
}

---

## 8. Public Controller

import { Request, Response } from 'express';
import { z } from 'zod';
import { getTenantClient, supabaseAdmin } from '@white-label/database';
import { loadTenantRuntimeConfig } from '../services/tenant-config';

type PdfAttachment = {
  type: 'receipt_pdf';
  label: string;
  url: string;
  fileName: string | null;
  mimeType: string;
  source: 'stored_url' | 'inline_data_url';
};

type LandingService = {
  title: string;
  description: string;
};

type LandingSocialLink = {
  label: string;
  href: string;
};

type LandingContent = {
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  contactLabel?: string;
  contactHref?: string;
  seoTitle?: string;
  seoDescription?: string;
  services?: LandingService[];
  socialLinks?: LandingSocialLink[];
  showMap?: boolean;
  mapEmbedUrl?: string;
  showVideo?: boolean;
  videoUrl?: string;
};

type LandingTemplate = {
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  contactLabel?: string;
  contactHref?: string;
  services?: LandingService[];
  socialLinks?: LandingSocialLink[];
  showMap?: boolean;
  mapEmbedUrl?: string;
  showVideo?: boolean;
  videoUrl?: string;
};

type ContactInfo = {
  contactPhone: string | null;
  contactEmail: string | null;
  contact_phone: string | null;
  contact_email: string | null;
};

const publicQuoteSchema = z.object({
  tenantSlug: z.string().min(1),
  fullName: z.string().min(1),
  phone: z.string().min(7),
  email: z.string().email().optional().or(z.literal('')),
  deviceBrand: z.string().min(1),
  deviceModel: z.string().min(1),
  issue: z.string().min(1),
  deviceType: z.string().optional().or(z.literal('')),
  serialNumber: z.string().optional().or(z.literal('')),
  priorityLevel: z.string().optional().or(z.literal('')),
  passwordOrPin: z.string().optional().or(z.literal('')),
  metadata: z.record(z.unknown()).optional(),
});

const publicTrackingSchema = z.object({
  tenantSlug: z.string().min(1),
  folio: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
});

const publicPortalSchema = z.object({
  tenantSlug: z.string().min(1),
  folio: z.string().min(1),
});

async function resolveTenantIdBySlug(slug: string) {
  const { data, error } = await supabaseAdmin
    .from('tenants')
    .select('id, slug, name, branding, landing_content')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !data) {
    const message = error?.message ?? 'Tenant not found';
    const notFound = !data || /single json object/i.test(message) || /0 rows/i.test(message);
    const tenantError = new Error(message);
    tenantError.name = notFound ? 'TenantNotFoundError' : 'TenantLookupError';
    throw tenantError;
  }

  return data;
}

function extractContactInfo(input: unknown): ContactInfo {
  const content = input && typeof input === 'object' ? (input as LandingContent) : {};
  const rawHref = typeof content.contactHref === 'string' ? content.contactHref.trim() : '';
  let contactPhone: string | null = null;
  let contactEmail: string | null = null;

  if (rawHref) {
    if (rawHref.startsWith('mailto:')) {
      contactEmail = rawHref.slice('mailto:'.length).trim() || null;
    } else if (rawHref.startsWith('tel:')) {
      contactPhone = rawHref.slice('tel:'.length).trim() || null;
    } else if (rawHref.includes('wa.me')) {
      const digits = rawHref.replace(/\D/g, '');
      contactPhone = digits.length > 0 ? digits : null;
    } else if (rawHref.includes('@')) {
      contactEmail = rawHref;
    } else if (/^\+?\d[\d\s().-]+$/.test(rawHref)) {
      contactPhone = rawHref;
    }
  }

  return {
    contactPhone,
    contactEmail,
    contact_phone: contactPhone,
    contact_email: contactEmail,
  };
}

function normalizeLandingContent(input: unknown, tenantName: string, tenantSlug: string): Required<LandingContent> {
  const content = input && typeof input === 'object' ? (input as LandingContent) : {};
  const services = Array.isArray(content.services)
    ? content.services.filter((item): item is LandingService => Boolean(item && item.title && item.description))
    : [];
  const socialLinks = Array.isArray(content.socialLinks)
    ? content.socialLinks.filter((item): item is LandingSocialLink => Boolean(item && item.label && item.href))
    : [];

  return {
    heroTitle: content.heroTitle?.trim() || tenantName,
    heroSubtitle: content.heroSubtitle?.trim() || 'Landing pública por tenant',
    heroDescription: content.heroDescription?.trim() || 'Cotización, estado y contacto directo con marca propia.',
    primaryCtaLabel: content.primaryCtaLabel?.trim() || 'Cotizar ahora',
    primaryCtaHref: content.primaryCtaHref?.trim() || '/onboarding',
    secondaryCtaLabel: content.secondaryCtaLabel?.trim() || 'Ver estatus',
    secondaryCtaHref: content.secondaryCtaHref?.trim() || '/login',
    contactLabel: content.contactLabel?.trim() || 'WhatsApp / contacto',
    contactHref: content.contactHref?.trim() || '',
    seoTitle: content.seoTitle?.trim() || tenantName,
    seoDescription: content.seoDescription?.trim() || `Landing pública del taller ${tenantSlug}.`,
    services,
    socialLinks,
    showMap: Boolean(content.showMap),
    mapEmbedUrl: content.mapEmbedUrl?.trim() || '',
    showVideo: Boolean(content.showVideo),
    videoUrl: content.videoUrl?.trim() || '',
  };
}

function mergeLandingContent(
  rawLandingContent: unknown,
  landingTemplate: LandingTemplate | null,
  tenantName: string,
  tenantSlug: string,
): Required<LandingContent> {
  const normalized = normalizeLandingContent(rawLandingContent, tenantName, tenantSlug);
  const template = landingTemplate ?? {};

  return {
    heroTitle: template.heroTitle?.trim() || normalized.heroTitle,
    heroSubtitle: template.heroSubtitle?.trim() || normalized.heroSubtitle,
    heroDescription: template.heroDescription?.trim() || normalized.heroDescription,
    primaryCtaLabel: template.primaryCtaLabel?.trim() || normalized.primaryCtaLabel,
    primaryCtaHref: template.primaryCtaHref?.trim() || normalized.primaryCtaHref,
    secondaryCtaLabel: template.secondaryCtaLabel?.trim() || normalized.secondaryCtaLabel,
    secondaryCtaHref: template.secondaryCtaHref?.trim() || normalized.secondaryCtaHref,
    contactLabel: template.contactLabel?.trim() || normalized.contactLabel,
    contactHref: template.contactHref?.trim() || normalized.contactHref,
    seoTitle: normalized.seoTitle,
    seoDescription: normalized.seoDescription,
    services: Array.isArray(template.services) && template.services.length > 0 ? template.services : normalized.services,
    socialLinks: Array.isArray(template.socialLinks) && template.socialLinks.length > 0 ? template.socialLinks : normalized.socialLinks,
    showMap: typeof template.showMap === 'boolean' ? template.showMap : normalized.showMap,
    mapEmbedUrl: template.mapEmbedUrl?.trim() || normalized.mapEmbedUrl,
    showVideo: typeof template.showVideo === 'boolean' ? template.showVideo : normalized.showVideo,
    videoUrl: template.videoUrl?.trim() || normalized.videoUrl,
  };
}

function buildPdfAttachment(receiptUrl?: string | null): PdfAttachment | null {
  if (!receiptUrl) {
    return null;
  }

  const isDataUrl = receiptUrl.startsWith('data:');
  return {
    type: 'receipt_pdf',
    label: 'PDF de la orden',
    url: receiptUrl,
    fileName: isDataUrl ? null : 'recepcion.pdf',
    mimeType: 'application/pdf',
    source: isDataUrl ? 'inline_data_url' : 'stored_url',
  };
}

export async function createPublicQuote(req: Request, res: Response) {
  const parsed = publicQuoteSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
  }

  try {
    const { tenantSlug, fullName, phone, email, deviceBrand, deviceModel, issue, deviceType, serialNumber, priorityLevel, passwordOrPin } = parsed.data;
    const metadata = parsed.data.metadata ?? {};
    const tenant = await resolveTenantIdBySlug(tenantSlug);
    const runtimeConfig = await loadTenantRuntimeConfig(tenant.id);
    const supabase = getTenantClient(tenant.id);
    const requestMetadata = {
      ...metadata,
      device_type: deviceType || deviceBrand,
      device_brand: deviceBrand,
      device_model: deviceModel,
      serial_number: serialNumber || null,
      priority_level: priorityLevel || null,
      password_or_pin: passwordOrPin || null,
    };

    const { data, error } = await supabase
      .from('service_requests')
      .insert([
        {
          tenant_id: tenant.id,
          folio: `REQ-${Date.now().toString(36).toUpperCase()}`,
          customer_name: fullName,
          customer_phone: phone,
          customer_email: email || null,
          device_type: deviceBrand,
          device_model: deviceModel,
          issue_description: issue,
          metadata: requestMetadata,
          status: 'pendiente',
          quoted_total: 0,
          deposit_amount: 0,
          balance_amount: 0,
          solicitud_origen_ip: req.ip ?? null,
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(502).json({ error: 'Failed to create quote request', details: error.message });
    }

    return res.status(201).json({
      success: true,
      tenant: {
        ...tenant,
        config: runtimeConfig,
      },
      data,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}

export async function trackPublicOrder(req: Request, res: Response) {
  const parsed = publicTrackingSchema.safeParse(req.query);

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
      .select('id, tenant_id, folio, status, created_at, device_info, problem_description, serial_number, receipt_url, estimated_cost, final_cost, metadata')
      .eq('tenant_id', tenant.id)
      .eq('folio', folio)
      .maybeSingle();

    if (error) {
      return res.status(502).json({ error: 'Failed to query order', details: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'No encontramos tu reparación', details: 'Order not found' });
    }

    if (email && data.device_info?.customer_email && data.device_info.customer_email !== email) {
      return res.status(403).json({ error: 'No encontramos una coincidencia con ese correo' });
    }

    return res.json({
      success: true,
      tenant: {
        id: tenant.id,
        slug: tenant.slug,
        name: tenant.name,
        branding: tenant.branding ?? null,
        ...extractContactInfo(tenant.landing_content),
        config: runtimeConfig,
      },
      data,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    if (error instanceof Error && error.name === 'TenantNotFoundError') {
      return res.status(404).json({ error: 'No encontramos un tenant con ese slug', details: message });
    }
    return res.status(500).json({ error: message });
  }
}

export async function getPublicPortalOrder(req: Request, res: Response) {
  const parsed = publicPortalSchema.safeParse(req.params);

  if (!parsed.success) {
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
      .select('id, tenant_id, folio, status, created_at, updated_at, promised_date, device_info, problem_description, serial_number, receipt_url, estimated_cost, final_cost, evidence_metadata, metadata')
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
      .eq('service_order_id', data.id)
      .order('created_at', { ascending: true });

    if (documentsError) {
      return res.status(502).json({ error: 'Failed to load documents', details: documentsError.message });
    }

    const { data: events, error: eventsError } = await supabase
      .from('service_order_events')
      .select('id, event_type, previous_status, new_status, note, actor_name, created_at')
      .eq('tenant_id', tenant.id)
      .eq('service_order_id', data.id)
      .order('created_at', { ascending: true });

    if (eventsError) {
      return res.status(502).json({ error: 'Failed to load events', details: eventsError.message });
    }

    const evidenceMetadata = Array.isArray(data.evidence_metadata) ? data.evidence_metadata : [];
    const metadataDocuments = evidenceMetadata
      .filter((entry) => entry && typeof entry === 'object' && (entry as { kind?: string }).kind === 'document')
      .map((entry) => {
        const document = entry as Record<string, unknown>;
        return {
          id: String(document.id ?? ''),
          file_name: String(document.file_name ?? ''),
          file_type: String(document.file_type ?? 'attachment_pdf'),
          public_url: typeof document.public_url === 'string' ? document.public_url : null,
          mime_type: String(document.mime_type ?? 'application/octet-stream'),
          created_at: String(document.created_at ?? new Date().toISOString()),
          source: 'metadata',
        };
      });
    const metadataEvents = evidenceMetadata
      .filter((entry) => entry && typeof entry === 'object' && (entry as { kind?: string }).kind === 'event')
      .map((entry) => {
        const event = entry as Record<string, unknown>;
        return {
          id: String(event.id ?? ''),
          event_type: String(event.event_type ?? 'note'),
          previous_status: typeof event.previous_status === 'string' ? event.previous_status : null,
          new_status: typeof event.new_status === 'string' ? event.new_status : null,
          note: typeof event.note === 'string' ? event.note : null,
          actor_name: typeof event.actor_name === 'string' ? event.actor_name : null,
          created_at: String(event.created_at ?? new Date().toISOString()),
        };
      });

    const normalizedDocuments = [
      ...(documents ?? []).map((entry) => ({
        id: entry.id,
        file_name: entry.file_name,
        file_type: entry.file_type,
        public_url: entry.public_url,
        mime_type: entry.mime_type ?? 'application/octet-stream',
        created_at: entry.created_at,
        source: entry.source ?? 'upload',
      })),
      ...metadataDocuments,
    ];
    const dedupedEvents = new Map<string, (typeof events)[number] & { note?: string | null; actor_name?: string | null; created_at?: string }>();
    for (const event of [...(events ?? []), ...metadataEvents]) {
      dedupedEvents.set(event.id, event);
    }
    const normalizedEvents = [...dedupedEvents.values()];
    const messages = normalizedEvents
      .filter((event) => String(event.event_type ?? '').toLowerCase() === 'note')
      .map((event) => ({
        id: event.id,
        note: event.note,
        actor_name: event.actor_name,
        created_at: event.created_at,
      }));

    const receiptDocument = normalizedDocuments.find((document) => document.file_type === 'receipt_pdf' && document.public_url);
    const pdfAttachment = buildPdfAttachment(data.receipt_url || receiptDocument?.public_url || null);
    const statusLabelMap: Record<string, string> = {
      pending: runtimeConfig.statusLabels.pending ?? 'Recibido',
      pendiente: runtimeConfig.statusLabels.pendiente ?? 'Recibido',
      recibido: runtimeConfig.statusLabels.recibido ?? 'Recibido',
      en_espera_de_refaccion: runtimeConfig.statusLabels.en_espera_de_refaccion ?? 'En espera de refacción',
      diagnostico: runtimeConfig.statusLabels.diagnostico ?? 'Diagnóstico',
      diagnosticado: runtimeConfig.statusLabels.diagnosticado ?? 'Diagnóstico',
      cotizado: runtimeConfig.statusLabels.cotizado ?? 'Cotizado',
      reparacion: runtimeConfig.statusLabels.reparacion ?? 'En reparación',
      reparando: runtimeConfig.statusLabels.reparando ?? 'En reparación',
      listo_para_entrega: runtimeConfig.statusLabels.listo_para_entrega ?? 'Listo para entrega',
      listo: runtimeConfig.statusLabels.listo ?? 'Listo',
      entregado: runtimeConfig.statusLabels.entregado ?? 'Entregado',
    };
    const statusKey = String(data.status ?? '').toLowerCase();
    const workflowStatuses = runtimeConfig.statusOptions.service_orders ?? [];
    const getTimelineStatus = (keys: string[]) => (keys.some((key) => statusKey.includes(key)) ? 'completado' as const : 'actual' as const);
    const workflowLabel = (key: string, fallback: string) => runtimeConfig.statusLabels[key] ?? fallback;
    const timeline = [
      { label: workflowLabel(workflowStatuses[0]?.key ?? 'recibido', 'Recepción'), status: 'completado' as const, note: 'Orden registrada en el sistema.' },
      {
        label: workflowLabel('diagnostico', 'Diagnóstico'),
        status: getTimelineStatus(['diagnostico', 'reparacion', 'listo', 'entregado']),
        note: 'Evaluación técnica del activo o elemento atendido.',
      },
      {
        label: workflowLabel('reparacion', 'En reparación'),
        status: getTimelineStatus(['reparacion', 'listo', 'entregado']),
        note: 'Trabajo operativo en proceso.',
      },
      {
        label: workflowLabel('entregado', 'Entrega'),
        status: ['listo', 'entregado'].includes(statusKey) ? 'actual' as const : 'pendiente' as const,
        note: 'Lista para entregar al cliente.',
      },
    ];

    return res.json({
      success: true,
      tenant: {
        id: tenant.id,
        slug: tenant.slug,
        name: tenant.name,
        branding: tenant.branding ?? null,
        ...extractContactInfo(tenant.landing_content),
        config: runtimeConfig,
      },
      data: {
        order: data,
        orderStatusLabel: statusLabelMap[statusKey] ?? String(data.status ?? 'Sin estado'),
        timeline,
        pdf_attachment: pdfAttachment,
        attachments: pdfAttachment ? [pdfAttachment] : [],
        documents: normalizedDocuments,
        events: normalizedEvents,
        messages,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    if (error instanceof Error && error.name === 'TenantNotFoundError') {
      return res.status(404).json({ error: 'No encontramos un tenant con ese slug', details: message });
    }
    return res.status(500).json({ error: message });
  }
}

export async function getPublicTenantLanding(req: Request, res: Response) {
  const tenantSlug = req.params.tenantSlug;

  if (!tenantSlug) {
    return res.status(400).json({ error: 'Tenant slug is required' });
  }

  try {
    const tenant = await resolveTenantIdBySlug(tenantSlug);
    const runtimeConfig = await loadTenantRuntimeConfig(tenant.id);
    const landingContent = mergeLandingContent(tenant.landing_content, (runtimeConfig.templates.landing ?? null) as LandingTemplate | null, tenant.name, tenant.slug);

    return res.json({
      success: true,
      data: {
        tenant: {
          id: tenant.id,
          slug: tenant.slug,
          name: tenant.name,
          branding: tenant.branding ?? null,
          ...extractContactInfo(tenant.landing_content),
          config: runtimeConfig,
        },
        landingContent,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    if (error instanceof Error && error.name === 'TenantNotFoundError') {
      return res.status(404).json({ error: 'No encontramos un tenant con ese slug', details: message });
    }
    return res.status(500).json({ error: message });
  }
}

---

## 9. Customers

apps/api/src/controllers/requests.ts:119:        .from('customers')
apps/api/src/controllers/reports.ts:18:    let customersQuery = supabase.from('customers').select('id').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/catalogs.ts:163:      .from('customers')
apps/api/src/controllers/catalogs.ts:190:    const { data, error } = await supabase.from('customers').insert([{

---

## 10. Organizations

apps/api/src/services/tenant-billing.ts:37:      .from('organizations')
apps/api/src/services/billing.ts:179:async function updateOrganizationSubscription(input: {
apps/api/src/services/billing.ts:185:    .from('organizations')
apps/api/src/services/billing.ts:192:      .from('organizations')
apps/api/src/services/billing.ts:204:  const { error } = await supabaseAdmin.from('organizations').insert([{
apps/api/src/services/billing.ts:322:    await updateOrganizationSubscription({
supabase/migrations/20260514133525_remote_schema.sql:565:create table "public"."organizations" (
supabase/migrations/20260514133525_remote_schema.sql:572:alter table "public"."organizations" enable row level security;
supabase/migrations/20260514133525_remote_schema.sql:633:CREATE UNIQUE INDEX organizations_pkey ON public.organizations USING btree (id);
supabase/migrations/20260514133525_remote_schema.sql:634:CREATE UNIQUE INDEX organizations_slug_key ON public.organizations USING btree (slug);
supabase/migrations/20260514133525_remote_schema.sql:637:alter table "public"."organizations" add constraint "organizations_pkey" PRIMARY KEY using index "organizations_pkey";
supabase/migrations/20260514133525_remote_schema.sql:639:alter table "public"."organizations" add constraint "organizations_slug_key" UNIQUE using index "organizations_slug_key";
supabase/migrations/20260514133525_remote_schema.sql:643:alter table "public"."profiles" add constraint "profiles_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES public.organizations(id) not valid;
supabase/migrations/20260514133525_remote_schema.sql:653:alter table "public"."customers" add constraint "customers_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE not valid;
supabase/migrations/20260514133525_remote_schema.sql:657:alter table "public"."service_orders" add constraint "service_orders_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE not valid;
supabase/migrations/20260514133525_remote_schema.sql:670:grant delete on table "public"."organizations" to "anon";
supabase/migrations/20260514133525_remote_schema.sql:671:grant insert on table "public"."organizations" to "anon";
supabase/migrations/20260514133525_remote_schema.sql:672:grant references on table "public"."organizations" to "anon";
supabase/migrations/20260514133525_remote_schema.sql:673:grant select on table "public"."organizations" to "anon";
supabase/migrations/20260514133525_remote_schema.sql:674:grant trigger on table "public"."organizations" to "anon";
supabase/migrations/20260514133525_remote_schema.sql:675:grant truncate on table "public"."organizations" to "anon";
supabase/migrations/20260514133525_remote_schema.sql:676:grant update on table "public"."organizations" to "anon";
supabase/migrations/20260514133525_remote_schema.sql:677:grant delete on table "public"."organizations" to "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:678:grant insert on table "public"."organizations" to "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:679:grant references on table "public"."organizations" to "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:680:grant select on table "public"."organizations" to "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:681:grant trigger on table "public"."organizations" to "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:682:grant truncate on table "public"."organizations" to "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:683:grant update on table "public"."organizations" to "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:684:grant delete on table "public"."organizations" to "service_role";
supabase/migrations/20260514133525_remote_schema.sql:685:grant insert on table "public"."organizations" to "service_role";
supabase/migrations/20260514133525_remote_schema.sql:686:grant references on table "public"."organizations" to "service_role";
supabase/migrations/20260514133525_remote_schema.sql:687:grant select on table "public"."organizations" to "service_role";
supabase/migrations/20260514133525_remote_schema.sql:688:grant trigger on table "public"."organizations" to "service_role";
supabase/migrations/20260514133525_remote_schema.sql:689:grant truncate on table "public"."organizations" to "service_role";
supabase/migrations/20260514133525_remote_schema.sql:690:grant update on table "public"."organizations" to "service_role";
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:15:  tenant_id uuid not null references public.organizations(id) on delete cascade,
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:50:  tenant_id uuid not null references public.organizations(id) on delete cascade,
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:70:  tenant_id uuid not null references public.organizations(id) on delete cascade,
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:87:  tenant_id uuid not null references public.organizations(id) on delete cascade,

---

## 11. Tenants

apps/api/src/middleware/tenantCapabilities.ts:16:    loadTenantBillingSummary(tenantId, req.user?.tenantSlug ?? req.params.tenantSlug ?? null).catch(() => null),
apps/api/src/middleware/tenantCapabilities.ts:21:    tenantSlug: req.user?.tenantSlug ?? req.params.tenantSlug ?? null,
apps/api/src/middleware/validateTenant.ts:4:  const routeTenantSlug = req.params.tenantSlug ?? req.params.tenantId ?? req.params.tenant;
apps/api/src/middleware/validateTenant.ts:5:  const tokenTenantSlug = req.user?.tenantSlug ?? null;
apps/api/src/middleware/validateTenant.ts:8:  if (!tokenTenantSlug) {
apps/api/src/middleware/validateTenant.ts:12:  if (routeTenantSlug && routeTenantSlug !== tokenTenantSlug) {
apps/api/src/middleware/tenantResolver.ts:4:  const routeTenantSlug = req.params.tenantSlug ?? req.params.tenantId ?? req.params.tenant;
apps/api/src/middleware/tenantResolver.ts:6:  const tokenTenantSlug = req.user?.tenantSlug ?? null;
apps/api/src/middleware/tenantResolver.ts:8:  if (!tokenTenantSlug) {
apps/api/src/middleware/tenantResolver.ts:12:  if (routeTenantSlug && routeTenantSlug !== tokenTenantSlug) {
apps/api/src/middleware/auth.ts:134:        tenantSlug: claims.tenant_slug ?? null,
apps/api/src/middleware/tenantBilling.ts:6:  const tenantSlug = req.user?.tenantSlug ?? req.params.tenantSlug ?? null;
apps/api/src/middleware/tenantBilling.ts:7:  const masterTenantSlug = process.env.MASTER_TENANT_SLUG?.trim() ?? '';
apps/api/src/middleware/tenantBilling.ts:14:  if ((masterTenantSlug && tenantSlug && tenantSlug === masterTenantSlug) || (masterAccountEmail && req.user?.email && req.user.email === masterAccountEmail)) {
apps/api/src/middleware/tenantBilling.ts:19:    const billing = await loadTenantBillingSummary(tenantId, tenantSlug);
apps/api/src/middleware/tenantBilling.ts:29:        tenantSlug: billing.tenantSlug || null,
apps/api/src/types/express.d.ts:8:      tenantSlug: string | null;
apps/api/src/types/express.d.ts:39:        tenantSlug?: string | null;
apps/api/src/lib/scope.ts:11:  tenantSlug: string | null;
apps/api/src/lib/resolve-scope.ts:8:function resolveTenantSlug(req: Pick<Request, 'user' | 'params'>) {
apps/api/src/lib/resolve-scope.ts:9:  return req.user?.tenantSlug ?? (typeof req.params?.tenantSlug === 'string' ? req.params.tenantSlug : null);
apps/api/src/lib/resolve-scope.ts:23:  const tenantSlug = resolveTenantSlug(req);
apps/api/src/lib/resolve-scope.ts:32:      tenantSlug,
apps/api/src/lib/resolve-scope.ts:46:    tenantSlug,
apps/api/src/index.ts:108:app.use('/api/:tenantSlug/auth', authRouter); // Support for tenant-prefixed auth
apps/api/src/index.ts:110:app.use('/api/:tenantSlug/orders', ordersRouter);
apps/api/src/index.ts:112:app.use('/api/:tenantSlug/requests', requestsRouter);
apps/api/src/index.ts:115:app.use('/api/:tenantSlug/finance', financeRouter);
apps/api/src/index.ts:118:app.use('/api/:tenantSlug/customers', customersRouter);
apps/api/src/index.ts:121:app.use('/api/:tenantSlug/inventory', inventoryRouter);
apps/api/src/index.ts:123:app.use('/api/:tenantSlug/sucursales', sucursalesRouter);
apps/api/src/index.ts:125:app.use('/api/:tenantSlug/suppliers', suppliersRouter);
apps/api/src/index.ts:127:app.use('/api/:tenantSlug/purchase-orders', purchaseOrdersRouter);
apps/api/src/index.ts:129:app.use('/api/:tenantSlug/tasks', tasksRouter);
apps/api/src/index.ts:131:app.use('/api/:tenantSlug/users', usersRouter);
apps/api/src/index.ts:133:app.use('/api/:tenantSlug/security', securityRouter);
apps/api/src/index.ts:136:app.use('/api/:tenantSlug/procurement', procurementRouter);
apps/api/src/index.ts:138:app.use('/api/:tenantSlug/reports', reportsRouter);
apps/api/src/index.ts:140:app.use('/api/:tenantSlug/stock-alerts', stockAlertsRouter);
apps/api/src/index.ts:142:app.use('/api/:tenantSlug/pwa', pwaRouter);
apps/api/src/index.ts:144:app.use('/api/:tenantSlug/billing', billingRouter);
apps/api/src/controllers/meta.ts:76:      .from('tenants')
apps/api/src/controllers/meta.ts:94:        tenantSlug: tenantRow.slug,
apps/api/src/controllers/meta.ts:105:export const getTenantSettings = async (req: Request, res: Response) => {
apps/api/src/controllers/meta.ts:106:  const tenantSlug = req.params.tenantSlug;
apps/api/src/controllers/meta.ts:109:  if (!tenantSlug && !tenantId) {
apps/api/src/controllers/meta.ts:115:      .from('tenants')
apps/api/src/controllers/meta.ts:120:      : await query.eq('slug', tenantSlug).maybeSingle();
apps/api/src/controllers/meta.ts:130:      tenantSlug: data.slug,
apps/api/src/controllers/meta.ts:170:export const updateTenantSettings = async (req: Request, res: Response) => {
apps/api/src/controllers/meta.ts:171:  const tenantSlug = req.params.tenantSlug;
apps/api/src/controllers/meta.ts:174:  if (!tenantSlug && !tenantId) {
apps/api/src/controllers/meta.ts:180:      .from('tenants')
apps/api/src/controllers/meta.ts:185:      : await tenantQuery.eq('slug', tenantSlug).maybeSingle();
apps/api/src/controllers/meta.ts:216:        .from('tenants')
apps/api/src/controllers/meta.ts:487:      tenantSlug: data.slug,
apps/api/src/controllers/auth.controller.ts:101:      tenantSlug: tenant.slug ?? null,
apps/api/src/controllers/auth.controller.ts:182:      tenantSlug: tenant?.slug ?? tenant?.tenant_slug ?? null,
apps/api/src/controllers/auth.controller.ts:186:    const tenantSlug = tenant.slug ?? tenant.tenant_slug;
apps/api/src/controllers/auth.controller.ts:187:    if (!tenant?.tenant_id || !tenantSlug) {
apps/api/src/controllers/auth.controller.ts:191:    console.log('STEP_TENANT_OBTAINED', { tenantId: tenant.tenant_id, tenantSlug });
apps/api/src/controllers/auth.controller.ts:198:      tenant_slug: tenantSlug,
apps/api/src/controllers/auth.controller.ts:206:    const redirectUrl = `${appUrl}/onboarding/success?tenant=${encodeURIComponent(tenantSlug)}&token=${encodeURIComponent(token)}`;
apps/api/src/controllers/auth.controller.ts:214:      tenantSlug,
apps/api/src/controllers/auth.controller.ts:220:        slug: tenantSlug,
apps/api/src/controllers/auth.controller.ts:323:  const tenantSlug = tenant.slug ?? tenant.tenant_slug;
apps/api/src/controllers/auth.controller.ts:324:  if (!tenant?.tenant_id || !tenantSlug) {
apps/api/src/controllers/auth.controller.ts:327:  console.log('STEP_GOOGLE_TENANT_OBTAINED', { tenantId: tenant.tenant_id, tenantSlug });
apps/api/src/controllers/auth.controller.ts:330:    { id: tenant.tenant_id, slug: tenantSlug },
apps/api/src/controllers/auth.controller.ts:339:        slug: tenantSlug,
apps/api/src/controllers/auth.controller.ts:346:      redirectUrl: `${appUrl}/onboarding/success?tenant=${encodeURIComponent(tenantSlug)}&token=${encodeURIComponent(authPayload.token)}`,
apps/api/src/controllers/auth.controller.ts:408:    const { data: tenantSecurity, error: tenantSecurityError } = await supabaseAdmin
apps/api/src/controllers/auth.controller.ts:409:      .from('tenants')
apps/api/src/controllers/auth.controller.ts:414:    if (tenantSecurityError) {
apps/api/src/controllers/auth.controller.ts:415:      return res.status(502).json({ error: tenantSecurityError.message });
apps/api/src/controllers/auth.controller.ts:418:    if (!tenantSecurity) {
apps/api/src/controllers/auth.controller.ts:423:    if (tenantSecurity.require_admin_mfa && isAdminRole) {
apps/api/src/controllers/auth.controller.ts:428:        .eq('tenant_id', tenantSecurity.id)
apps/api/src/controllers/auth.controller.ts:443:      { id: tenantSecurity.id, slug: tenantSecurity.slug },
apps/api/src/controllers/auth.controller.ts:456:      .eq('tenant_id', tenantSecurity.id);
apps/api/src/controllers/auth.controller.ts:459:      tenant_id: tenantSecurity.id,
apps/api/src/controllers/auth.controller.ts:474:        id: tenantSecurity.id,
apps/api/src/controllers/auth.controller.ts:475:        slug: tenantSecurity.slug,
apps/api/src/controllers/auth.controller.ts:476:        name: tenantSecurity.name,
apps/api/src/controllers/orders.ts:327:    .from('tenants')
apps/api/src/controllers/security.ts:130:      .from('tenants')
apps/api/src/controllers/security.ts:366:      .from('tenants')
apps/api/src/controllers/security.ts:377:      .from('tenants')
apps/api/src/controllers/security.ts:535:      .from('tenants')
apps/api/src/controllers/security.ts:545:      .from('tenants')
apps/api/src/controllers/users.ts.bak.20260603_093424:61:async function resolveTenantSlug(tenantId: string) {
apps/api/src/controllers/users.ts.bak.20260603_093424:63:    .from('tenants')
apps/api/src/controllers/users.ts.bak.20260603_093424:195:    const tenantRow = await resolveTenantSlug(tenantId);
apps/api/src/controllers/users.ts:61:async function resolveTenantSlug(tenantId: string) {
apps/api/src/controllers/users.ts:63:    .from('tenants')
apps/api/src/controllers/users.ts:195:    const tenantRow = await resolveTenantSlug(tenantId);
apps/api/src/controllers/billing.ts:34:    tenantSlug: z.string().min(1),
apps/api/src/controllers/billing.ts:44:    const { tenantSlug, plan } = parsed.data;
apps/api/src/controllers/billing.ts:45:    const result = await createBillingCheckout(null, { plan, tenantSlug });
apps/api/src/controllers/public.ts:71:  tenantSlug: z.string().min(1),
apps/api/src/controllers/public.ts:86:  tenantSlug: z.string().min(1),
apps/api/src/controllers/public.ts:92:  tenantSlug: z.string().min(1),
apps/api/src/controllers/public.ts:98:    .from('tenants')
apps/api/src/controllers/public.ts:143:function normalizeLandingContent(input: unknown, tenantName: string, tenantSlug: string): Required<LandingContent> {
apps/api/src/controllers/public.ts:163:    seoDescription: content.seoDescription?.trim() || `Landing pública del taller ${tenantSlug}.`,
apps/api/src/controllers/public.ts:177:  tenantSlug: string,
apps/api/src/controllers/public.ts:179:  const normalized = normalizeLandingContent(rawLandingContent, tenantName, tenantSlug);
apps/api/src/controllers/public.ts:227:    const { tenantSlug, fullName, phone, email, deviceBrand, deviceModel, issue, deviceType, serialNumber, priorityLevel, passwordOrPin } = parsed.data;
apps/api/src/controllers/public.ts:229:    const tenant = await resolveTenantIdBySlug(tenantSlug);
apps/api/src/controllers/public.ts:291:    const { tenantSlug, folio, email } = parsed.data;
apps/api/src/controllers/public.ts:292:    const tenant = await resolveTenantIdBySlug(tenantSlug);
apps/api/src/controllers/public.ts:343:    const { tenantSlug, folio } = parsed.data;
apps/api/src/controllers/public.ts:344:    const tenant = await resolveTenantIdBySlug(tenantSlug);
apps/api/src/controllers/public.ts:508:  const tenantSlug = req.params.tenantSlug;
apps/api/src/controllers/public.ts:510:  if (!tenantSlug) {
apps/api/src/controllers/public.ts:515:    const tenant = await resolveTenantIdBySlug(tenantSlug);
apps/api/src/controllers/sucursales.ts:40:async function countTenantSucursales(tenantId: string) {
apps/api/src/controllers/sucursales.ts:94:      const currentSucursales = await countTenantSucursales(tenantId);
apps/api/src/routes/billing.ts:10:// Public checkout endpoint for customer-initiated purchases (tenantSlug must be provided)
apps/api/src/routes/public.ts:8:router.get('/tenant/:tenantSlug/landing', getPublicTenantLanding);
apps/api/src/routes/public.ts:9:router.get('/tenant/:tenantSlug/orders/:folio', getPublicPortalOrder);
apps/api/src/routes/auth.ts:5:import { getCurrentUser, resolveTenantForSupabaseUser, getTenantSettings, updateTenantSettings } from '../controllers/meta';
apps/api/src/routes/auth.ts:15:router.get('/tenant/:tenantSlug/settings', requireAuth, validateTenant, getTenantSettings);
apps/api/src/routes/auth.ts:16:router.put('/tenant/:tenantSlug/settings', requireAuth, validateTenant, updateTenantSettings);
apps/api/src/services/security-backoffice.ts:93:    .from('tenants')
apps/api/src/services/operational-risk.ts:1:import type { TenantRuntimeConfig, TenantSemaphoreRule, TenantWorkflowStatus } from '@white-label/types';
apps/api/src/services/operational-risk.ts:80:  rules: TenantSemaphoreRule[],
apps/api/src/services/operational-risk.ts:94:function resolveElapsedMinutes(order: OrderLike, metric: TenantSemaphoreRule['metric'], statusChangedAt: Date | null) {
apps/api/src/services/operational-risk.ts:117:function resolveThresholdColor(metric: TenantSemaphoreRule['metric'], elapsedMinutes: number | null, rule: TenantSemaphoreRule) {
apps/api/src/services/tenant-capabilities.ts:91:function getAccessStatus(billing: TenantBillingSummary | null | undefined, tenantSlug?: string | null, tenantEmail?: string | null): TenantCapabilities['access_status'] {
apps/api/src/services/tenant-capabilities.ts:92:  const masterTenantSlug = normalizeKey(process.env.MASTER_TENANT_SLUG);
apps/api/src/services/tenant-capabilities.ts:94:  if (tenantSlug && masterTenantSlug && normalizeKey(tenantSlug) === masterTenantSlug) return 'master';
apps/api/src/services/tenant-capabilities.ts:104:  tenantSlug,
apps/api/src/services/tenant-capabilities.ts:110:  tenantSlug?: string | null;
apps/api/src/services/tenant-capabilities.ts:116:  const accessStatus = getAccessStatus(billing, tenantSlug, tenantEmail);
apps/api/src/services/tenant-config.ts:8:  TenantSemaphoreRule,
apps/api/src/services/tenant-config.ts:60:  semaphoreRules: Array<Pick<TenantSemaphoreRule, 'industry_key' | 'workflow_key' | 'status_key' | 'metric' | 'green_until_minutes' | 'yellow_until_minutes' | 'red_after_minutes' | 'priority' | 'reason_template' | 'suggested_action_template' | 'action_key' | 'enabled' | 'metadata'>>;
apps/api/src/services/tenant-config.ts:90:  metric: TenantSemaphoreRule['metric'],
apps/api/src/services/tenant-config.ts:94:  extra: Partial<Pick<TenantSemaphoreRule, 'industry_key' | 'workflow_key' | 'priority' | 'action_key' | 'enabled' | 'metadata'>> = {},
apps/api/src/services/tenant-config.ts:578:  semaphoreRules: TenantSemaphoreRule[];
apps/api/src/services/tenant-config.ts:596:      .from('tenants')
apps/api/src/services/tenant-config.ts:683:  const semaphoreRules = (((semaphoreRulesResult.data as TenantSemaphoreRule[] | null) ?? []) as TenantSemaphoreRule[]).length > 0
apps/api/src/services/tenant-config.ts:684:    ? ((semaphoreRulesResult.data as TenantSemaphoreRule[] | null) ?? [])
apps/api/src/services/tenant-billing.ts:5:  tenantSlug: string;
apps/api/src/services/tenant-billing.ts:29:export async function loadTenantBillingSummary(tenantId: string, tenantSlug?: string | null): Promise<TenantBillingSummary> {
apps/api/src/services/tenant-billing.ts:32:      .from('tenants')
apps/api/src/services/tenant-billing.ts:47:  const resolvedTenantSlug = tenantSlug ?? tenantRow?.slug ?? organizationRow?.slug ?? null;
apps/api/src/services/tenant-billing.ts:59:    tenantSlug: resolvedTenantSlug ?? '',
apps/api/src/services/billing.ts:8:  tenantSlug?: string;
apps/api/src/services/billing.ts:27:    tenantSlug?: string;
apps/api/src/services/billing.ts:122:async function resolveTenantForCheckout(authUserId?: string | null, tenantSlug?: string) {
apps/api/src/services/billing.ts:123:  if (tenantSlug) {
apps/api/src/services/billing.ts:125:      .from('tenants')
apps/api/src/services/billing.ts:127:      .eq('slug', tenantSlug)
apps/api/src/services/billing.ts:163:    .from('tenants')
apps/api/src/services/billing.ts:181:  tenantSlug: string;
apps/api/src/services/billing.ts:206:    name: input.tenantSlug,
apps/api/src/services/billing.ts:207:    slug: input.tenantSlug,
apps/api/src/services/billing.ts:224:  const { userRow, tenantRow } = await resolveTenantForCheckout(authUserId, request.tenantSlug);
apps/api/src/services/billing.ts:246:      tenantSlug: tenantRow.slug,
apps/api/src/services/billing.ts:274:    tenantSlug: tenantRow.slug,
apps/api/src/services/billing.ts:317:  const tenantSlug = String(payment.metadata?.tenantSlug || '');
apps/api/src/services/billing.ts:324:      tenantSlug,
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:2:  tenant_id uuid primary key references public.tenants(id) on delete cascade,
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:38:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:69:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:98:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260515110000_restore_users_compat.sql:3:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260527070000_tenant_semaphore_rules.sql:3:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:3:alter table if exists public.tenants
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:13:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:34:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:25:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:113:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260527010000_align_service_requests_tenant_fk.sql:9:  references public.tenants(id)
supabase/migrations/20260523204000_restore_branches_table.sql:4:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260527050000_tenant_field_definitions_phase2.sql:3:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:18:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:32:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:93:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:3:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:24:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:46:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:60:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:77:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260514133525_remote_schema.sql:13:drop trigger if exists "trg_tenants_updated_at" on "public"."tenants";
supabase/migrations/20260514133525_remote_schema.sql:624:alter table "public"."tenants" drop column "contact_email";
supabase/migrations/20260514133525_remote_schema.sql:625:alter table "public"."tenants" drop column "contact_name";
supabase/migrations/20260514133525_remote_schema.sql:626:alter table "public"."tenants" drop column "contact_phone";
supabase/migrations/20260514133525_remote_schema.sql:627:alter table "public"."tenants" drop column "plan";
supabase/migrations/20260514133525_remote_schema.sql:628:alter table "public"."tenants" drop column "status";
supabase/migrations/20260514133525_remote_schema.sql:629:alter table "public"."tenants" drop column "updated_at";
supabase/migrations/20260514133525_remote_schema.sql:630:alter table "public"."tenants" add column "billing_exempt" boolean not null default false;
supabase/migrations/20260514133525_remote_schema.sql:631:alter table "public"."tenants" alter column "created_at" set default now();
supabase/migrations/20260514133525_remote_schema.sql:632:alter table "public"."tenants" enable row level security;
supabase/migrations/20260424_baseline_schema.sql:14:create table if not exists public.tenants (
supabase/migrations/20260424_baseline_schema.sql:28:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:44:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:60:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:75:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:97:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:131:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:145:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:157:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:177:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:186:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:211:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:232:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:242:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:264:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:278:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:295:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:305:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:327:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:343:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:356:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:365:drop trigger if exists trg_tenants_updated_at on public.tenants;
supabase/migrations/20260424_baseline_schema.sql:366:create trigger trg_tenants_updated_at
supabase/migrations/20260424_baseline_schema.sql:367:before update on public.tenants
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:25:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:106:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:47:alter table if exists public.tenants enable row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:68:alter table if exists public.tenants force row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:91:  if to_regclass('public.tenants') is not null then
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:92:    execute 'drop policy if exists tenants_select_same_tenant on public.tenants';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:94:      create policy tenants_select_same_tenant
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:95:      on public.tenants
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:101:    execute 'drop policy if exists tenants_insert_owner on public.tenants';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:103:      create policy tenants_insert_owner
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:104:      on public.tenants
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:110:    execute 'drop policy if exists tenants_update_owner on public.tenants';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:112:      create policy tenants_update_owner
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:113:      on public.tenants
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:120:    execute 'drop policy if exists tenants_delete_owner on public.tenants';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:122:      create policy tenants_delete_owner
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:123:      on public.tenants
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:612:  if to_regclass('public.tenants') is not null then
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:613:    grant select, insert, update, delete on public.tenants to authenticated;
supabase/migrations/20260602113500_restore_tenant_contact_columns.sql:1:alter table public.tenants
supabase/migrations/20260602113500_restore_tenant_contact_columns.sql:6:comment on column public.tenants.contact_name is 'Primary contact name for tenant onboarding and public pages.';
supabase/migrations/20260602113500_restore_tenant_contact_columns.sql:7:comment on column public.tenants.contact_email is 'Primary contact email for tenant onboarding and public pages.';
supabase/migrations/20260602113500_restore_tenant_contact_columns.sql:8:comment on column public.tenants.contact_phone is 'Primary contact phone for tenant onboarding and public pages.';
supabase/migrations/20260530132000_security_backoffice_tables.sql:3:alter table public.tenants
supabase/migrations/20260530132000_security_backoffice_tables.sql:14:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260530132000_security_backoffice_tables.sql:35:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260514150000_add_tenant_onboarding.sql:4:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260514150000_add_tenant_onboarding.sql:16:alter table public.tenants
supabase/migrations/20260514150000_add_tenant_onboarding.sql:23:update public.tenants
supabase/migrations/20260514150000_add_tenant_onboarding.sql:26:alter table public.tenants
supabase/migrations/20260514150000_add_tenant_onboarding.sql:28:alter table public.tenants
supabase/migrations/20260514150000_add_tenant_onboarding.sql:76:  while exists (select 1 from public.tenants where slug = v_slug) loop
supabase/migrations/20260514150000_add_tenant_onboarding.sql:80:  insert into public.tenants (
supabase/migrations/20260514150000_add_tenant_onboarding.sql:133:alter table public.tenants enable row level security;
supabase/migrations/20260514150000_add_tenant_onboarding.sql:134:drop policy if exists tenants_select_same_tenant on public.tenants;
supabase/migrations/20260514150000_add_tenant_onboarding.sql:135:create policy tenants_select_same_tenant
supabase/migrations/20260514150000_add_tenant_onboarding.sql:136:on public.tenants
supabase/migrations/20260514150000_add_tenant_onboarding.sql:139:drop policy if exists tenants_insert_owner on public.tenants;
supabase/migrations/20260514150000_add_tenant_onboarding.sql:140:create policy tenants_insert_owner
supabase/migrations/20260514150000_add_tenant_onboarding.sql:141:on public.tenants
supabase/migrations/20260514150000_add_tenant_onboarding.sql:144:drop policy if exists tenants_update_owner on public.tenants;
supabase/migrations/20260514150000_add_tenant_onboarding.sql:145:create policy tenants_update_owner
supabase/migrations/20260514150000_add_tenant_onboarding.sql:146:on public.tenants
supabase/migrations/20260514150000_add_tenant_onboarding.sql:156:drop policy if exists tenants_delete_owner on public.tenants;
supabase/migrations/20260514150000_add_tenant_onboarding.sql:157:create policy tenants_delete_owner
supabase/migrations/20260514150000_add_tenant_onboarding.sql:158:on public.tenants
supabase/migrations/20260530150000_add_pwa_push_subscriptions.sql:3:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260523190000_order_documents_events.sql:3:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260523190000_order_documents_events.sql:20:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260523193000_tenant_landing_content.sql:1:alter table public.tenants
supabase/migrations/20260523193000_tenant_landing_content.sql:21:update public.tenants
supabase/migrations/20260523193000_tenant_landing_content.sql:60:alter table public.tenants
supabase/migrations/20260523193000_tenant_landing_content.sql:61:  drop constraint if exists tenants_landing_content_is_object;
supabase/migrations/20260523193000_tenant_landing_content.sql:62:alter table public.tenants
supabase/migrations/20260523193000_tenant_landing_content.sql:63:  add constraint tenants_landing_content_is_object

---

## 12. Evidence Metadata

apps/api/src/controllers/orders.ts:580:        evidence_metadata: appendEvidenceEntry(data.evidence_metadata, {
apps/api/src/controllers/orders.ts:757:    const evidenceMetadata = readEvidenceMetadata(orderResult.data.evidence_metadata);
apps/api/src/controllers/orders.ts:810:      .select('id, tenant_id, evidence_metadata')
apps/api/src/controllers/orders.ts:883:        .select('evidence_metadata')
apps/api/src/controllers/orders.ts:891:          evidence_metadata: appendEvidenceEntry(latestDocumentEvidence?.evidence_metadata, {
apps/api/src/controllers/orders.ts:943:        .select('evidence_metadata')
apps/api/src/controllers/orders.ts:960:          evidence_metadata: appendEvidenceEntry(latestReceiptOrder?.evidence_metadata, {
apps/api/src/controllers/orders.ts:1041:      .select('id, status, evidence_metadata')
apps/api/src/controllers/orders.ts:1067:      .update({ evidence_metadata: appendEvidenceEntry((order as { evidence_metadata?: unknown }).evidence_metadata, noteEntry) })
apps/api/src/controllers/orders.ts:1125:      .select('id, status, evidence_metadata')
apps/api/src/controllers/orders.ts:1167:        evidence_metadata: appendEvidenceEntry(data.evidence_metadata, {
apps/api/src/controllers/orders.ts:1229:      .select('id, estimated_cost, final_cost, evidence_metadata')
apps/api/src/controllers/orders.ts:1278:          evidence_metadata: appendEvidenceEntry((order as { evidence_metadata?: unknown }).evidence_metadata, noteEntry),
apps/api/src/controllers/orders.ts:1481:      .select('id, warranty_until, evidence_metadata')
apps/api/src/controllers/orders.ts:1524:        evidence_metadata: appendEvidenceEntry(order.evidence_metadata, {
apps/api/src/controllers/public.ts:351:      .select('id, tenant_id, folio, status, created_at, updated_at, promised_date, device_info, problem_description, serial_number, receipt_url, estimated_cost, final_cost, evidence_metadata, metadata')
apps/api/src/controllers/public.ts:382:    const evidenceMetadata = Array.isArray(data.evidence_metadata) ? data.evidence_metadata : [];
supabase/migrations/20260514133525_remote_schema.sql:614:alter table "public"."service_orders" add column "evidence_metadata" jsonb default '[]'::jsonb;

---

## 13. Service Order Events

apps/api/src/controllers/orders.ts:319:  const { error } = await supabase.from('service_order_events').insert([row]);
apps/api/src/controllers/orders.ts:321:    throw new Error(`Failed to persist service_order_events: ${error.message}`);
apps/api/src/controllers/orders.ts:730:        .from('service_order_events')
apps/api/src/controllers/public.ts:372:      .from('service_order_events')
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:53:alter table if exists public.service_order_events enable row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:74:alter table if exists public.service_order_events force row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:288:  if to_regclass('public.service_order_events') is not null then
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:289:    execute 'drop policy if exists service_order_events_select on public.service_order_events';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:291:      create policy service_order_events_select
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:292:      on public.service_order_events
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:297:    execute 'drop policy if exists service_order_events_write_owner_manager on public.service_order_events';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:299:      create policy service_order_events_write_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:300:      on public.service_order_events
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:648:  if to_regclass('public.service_order_events') is not null then
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:649:    grant select, insert, update, delete on public.service_order_events to authenticated;
supabase/migrations/20260523190000_order_documents_events.sql:18:create table if not exists public.service_order_events (
supabase/migrations/20260523190000_order_documents_events.sql:30:create index if not exists service_order_events_tenant_order_idx
supabase/migrations/20260523190000_order_documents_events.sql:31:  on public.service_order_events (tenant_id, service_order_id, created_at desc);
supabase/migrations/20260523190000_order_documents_events.sql:33:alter table public.service_order_events enable row level security;
supabase/migrations/20260523190000_order_documents_events.sql:45:drop policy if exists service_order_events_select on public.service_order_events;
supabase/migrations/20260523190000_order_documents_events.sql:46:create policy service_order_events_select
supabase/migrations/20260523190000_order_documents_events.sql:47:on public.service_order_events
supabase/migrations/20260523190000_order_documents_events.sql:50:drop policy if exists service_order_events_write_owner_manager on public.service_order_events;
supabase/migrations/20260523190000_order_documents_events.sql:51:create policy service_order_events_write_owner_manager
supabase/migrations/20260523190000_order_documents_events.sql:52:on public.service_order_events

---

## 14. Service Order Status History

supabase/migrations/20260530193000_audit_hardening_multitenant.sql:16:create table if not exists public.service_order_status_history (
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:27:create index if not exists service_order_status_history_tenant_order_idx
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:28:  on public.service_order_status_history (tenant_id, service_order_id, created_at desc);
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:129:    insert into public.service_order_status_history (
supabase/migrations/20260514133525_remote_schema.sql:273:revoke delete on table "public"."service_order_status_history" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:274:revoke insert on table "public"."service_order_status_history" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:275:revoke references on table "public"."service_order_status_history" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:276:revoke select on table "public"."service_order_status_history" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:277:revoke trigger on table "public"."service_order_status_history" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:278:revoke truncate on table "public"."service_order_status_history" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:279:revoke update on table "public"."service_order_status_history" from "anon";
supabase/migrations/20260514133525_remote_schema.sql:280:revoke delete on table "public"."service_order_status_history" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:281:revoke insert on table "public"."service_order_status_history" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:282:revoke references on table "public"."service_order_status_history" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:283:revoke select on table "public"."service_order_status_history" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:284:revoke trigger on table "public"."service_order_status_history" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:285:revoke truncate on table "public"."service_order_status_history" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:286:revoke update on table "public"."service_order_status_history" from "authenticated";
supabase/migrations/20260514133525_remote_schema.sql:287:revoke delete on table "public"."service_order_status_history" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:288:revoke insert on table "public"."service_order_status_history" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:289:revoke references on table "public"."service_order_status_history" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:290:revoke select on table "public"."service_order_status_history" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:291:revoke trigger on table "public"."service_order_status_history" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:292:revoke truncate on table "public"."service_order_status_history" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:293:revoke update on table "public"."service_order_status_history" from "service_role";
supabase/migrations/20260514133525_remote_schema.sql:461:alter table "public"."service_order_status_history" drop constraint "service_order_status_history_changed_by_fkey";
supabase/migrations/20260514133525_remote_schema.sql:462:alter table "public"."service_order_status_history" drop constraint "service_order_status_history_service_order_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:463:alter table "public"."service_order_status_history" drop constraint "service_order_status_history_tenant_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:502:alter table "public"."service_order_status_history" drop constraint "service_order_status_history_pkey";
supabase/migrations/20260514133525_remote_schema.sql:530:drop index if exists "public"."service_order_status_history_order_idx";
supabase/migrations/20260514133525_remote_schema.sql:531:drop index if exists "public"."service_order_status_history_pkey";
supabase/migrations/20260514133525_remote_schema.sql:558:drop table "public"."service_order_status_history";
supabase/migrations/20260424_baseline_schema.sql:143:create table if not exists public.service_order_status_history (
supabase/migrations/20260424_baseline_schema.sql:153:create index if not exists service_order_status_history_order_idx
supabase/migrations/20260424_baseline_schema.sql:154:  on public.service_order_status_history (service_order_id, created_at desc);

---

## 15. Service Order Documents

apps/api/src/controllers/orders.ts:303:  const { error } = await supabase.from('service_order_documents').insert([row]);
apps/api/src/controllers/orders.ts:305:    throw new Error(`Failed to persist service_order_documents: ${error.message}`);
apps/api/src/controllers/orders.ts:724:        .from('service_order_documents')
apps/api/src/controllers/public.ts:361:      .from('service_order_documents')
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:52:alter table if exists public.service_order_documents enable row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:73:alter table if exists public.service_order_documents force row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:268:  if to_regclass('public.service_order_documents') is not null then
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:269:    execute 'drop policy if exists service_order_documents_select on public.service_order_documents';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:271:      create policy service_order_documents_select
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:272:      on public.service_order_documents
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:277:    execute 'drop policy if exists service_order_documents_write_owner_manager on public.service_order_documents';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:279:      create policy service_order_documents_write_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:280:      on public.service_order_documents
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:642:  if to_regclass('public.service_order_documents') is not null then
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:643:    grant select, insert, update, delete on public.service_order_documents to authenticated;
supabase/migrations/20260523190000_order_documents_events.sql:1:create table if not exists public.service_order_documents (
supabase/migrations/20260523190000_order_documents_events.sql:16:create index if not exists service_order_documents_tenant_order_idx
supabase/migrations/20260523190000_order_documents_events.sql:17:  on public.service_order_documents (tenant_id, service_order_id, created_at desc);
supabase/migrations/20260523190000_order_documents_events.sql:32:alter table public.service_order_documents enable row level security;
supabase/migrations/20260523190000_order_documents_events.sql:34:drop policy if exists service_order_documents_select on public.service_order_documents;
supabase/migrations/20260523190000_order_documents_events.sql:35:create policy service_order_documents_select
supabase/migrations/20260523190000_order_documents_events.sql:36:on public.service_order_documents
supabase/migrations/20260523190000_order_documents_events.sql:39:drop policy if exists service_order_documents_write_owner_manager on public.service_order_documents;
supabase/migrations/20260523190000_order_documents_events.sql:40:create policy service_order_documents_write_owner_manager
supabase/migrations/20260523190000_order_documents_events.sql:41:on public.service_order_documents

---

## 16. Foreign Keys

supabase/migrations/20260530121000_add_assigned_user_to_service_orders.sql:4:  add column if not exists assigned_user_id uuid references public.users(id) on delete set null;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:38:  references public.sucursales(id)
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:64:  references public.sucursales(id)
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:90:  references public.sucursales(id)
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:116:  references public.sucursales(id)
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:2:  tenant_id uuid primary key references public.tenants(id) on delete cascade,
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:38:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:69:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260527030000_tenant_industry_config_phase1.sql:98:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260515110000_restore_users_compat.sql:3:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260530120000_expand_users_admin_module.sql:4:  add column if not exists sucursal_id uuid references public.sucursales(id) on delete set null,
supabase/migrations/20260527070000_tenant_semaphore_rules.sql:3:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:13:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:14:  user_id uuid references public.users(id) on delete set null,
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:34:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260531110000_fix_security_backoffice_schema.sql:35:  user_id uuid not null references public.users(id) on delete cascade,
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:25:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:113:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:114:  sucursal_id uuid references public.sucursales(id) on delete set null,
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:115:  product_id uuid not null references public.products(id) on delete cascade,
supabase/migrations/20260527010000_align_service_requests_tenant_fk.sql:9:  references public.tenants(id)
supabase/migrations/20260523204000_restore_branches_table.sql:4:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260527050000_tenant_field_definitions_phase2.sql:3:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:18:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:19:  service_order_id uuid not null references public.service_orders(id) on delete cascade,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:23:  changed_by uuid references public.users(id) on delete set null,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:32:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:34:  customer_id uuid references public.customers(id) on delete set null,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:35:  service_order_id uuid references public.service_orders(id) on delete set null,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:36:  service_request_id uuid references public.service_requests(id) on delete set null,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:43:  created_by uuid references public.users(id) on delete set null,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:93:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:95:  service_order_id uuid references public.service_orders(id) on delete set null,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:96:  service_request_id uuid references public.service_requests(id) on delete set null,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:101:  assigned_user_id uuid references public.users(id) on delete set null,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:103:  created_by uuid references public.users(id) on delete set null,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:104:  updated_by uuid references public.users(id) on delete set null,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:3:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:9:  primary_supplier_id uuid references public.suppliers(id) on delete set null,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:24:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:25:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:26:  supplier_id uuid references public.suppliers(id) on delete set null,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:27:  related_service_order_id uuid references public.service_orders(id) on delete set null,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:37:  created_by uuid references public.users(id) on delete set null,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:38:  updated_by uuid references public.users(id) on delete set null,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:46:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:47:  purchase_order_id uuid not null references public.purchase_orders(id) on delete cascade,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:48:  product_id uuid references public.products(id) on delete set null,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:60:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:61:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:62:  product_id uuid not null references public.products(id) on delete cascade,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:63:  service_order_id uuid references public.service_orders(id) on delete set null,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:64:  purchase_order_id uuid references public.purchase_orders(id) on delete set null,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:70:  created_by uuid references public.users(id) on delete set null,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:77:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:78:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:79:  product_id uuid not null references public.products(id) on delete cascade,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:81:  acknowledged_by uuid references public.users(id) on delete set null,
supabase/migrations/20260530180000_add_customer_sucursal_id.sql:18:      references public.sucursales(id)
supabase/migrations/20260527100000_migrate_users_branch_to_sucursal.sql:5:  add column if not exists sucursal_id uuid references public.sucursales(id) on delete set null;
supabase/migrations/20260514133525_remote_schema.sql:643:alter table "public"."profiles" add constraint "profiles_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES public.organizations(id) not valid;
supabase/migrations/20260514133525_remote_schema.sql:653:alter table "public"."customers" add constraint "customers_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE not valid;
supabase/migrations/20260514133525_remote_schema.sql:655:alter table "public"."service_orders" add constraint "service_orders_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES public.customers(id) not valid;
supabase/migrations/20260514133525_remote_schema.sql:657:alter table "public"."service_orders" add constraint "service_orders_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.organizations(id) ON DELETE CASCADE not valid;
supabase/migrations/20260424_baseline_schema.sql:28:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:44:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:45:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:60:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:75:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:76:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:97:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:98:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:99:  customer_id uuid references public.customers(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:100:  service_request_id uuid references public.service_requests(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:118:  created_by uuid references public.users(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:119:  updated_by uuid references public.users(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:131:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:132:  service_order_id uuid not null references public.service_orders(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:145:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:146:  service_order_id uuid not null references public.service_orders(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:150:  changed_by uuid references public.users(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:157:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:158:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:159:  service_order_id uuid references public.service_orders(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:160:  service_request_id uuid references public.service_requests(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:165:  assigned_user_id uuid references public.users(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:167:  created_by uuid references public.users(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:168:  updated_by uuid references public.users(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:177:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:178:  task_id uuid not null references public.tasks(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:181:  changed_by uuid references public.users(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:186:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:211:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:217:  primary_supplier_id uuid references public.suppliers(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:232:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:233:  branch_id uuid not null references public.branches(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:234:  product_id uuid not null references public.products(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:242:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:243:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:244:  supplier_id uuid references public.suppliers(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:245:  related_service_order_id uuid references public.service_orders(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:255:  created_by uuid references public.users(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:256:  updated_by uuid references public.users(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:264:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:265:  purchase_order_id uuid not null references public.purchase_orders(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:266:  product_id uuid references public.products(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:278:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:279:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:280:  product_id uuid not null references public.products(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:281:  service_order_id uuid references public.service_orders(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:282:  purchase_order_id uuid references public.purchase_orders(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:288:  created_by uuid references public.users(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:295:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:296:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:297:  product_id uuid not null references public.products(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:299:  acknowledged_by uuid references public.users(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:305:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:306:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:307:  supplier_id uuid references public.suppliers(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:308:  service_order_id uuid references public.service_orders(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:309:  purchase_order_id uuid references public.purchase_orders(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:319:  created_by uuid references public.users(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:327:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:328:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:329:  customer_id uuid references public.customers(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:330:  service_order_id uuid references public.service_orders(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:331:  service_request_id uuid references public.service_requests(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:338:  created_by uuid references public.users(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:343:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:344:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:345:  service_order_id uuid references public.service_orders(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:346:  service_request_id uuid references public.service_requests(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:351:  uploaded_by uuid references public.users(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:356:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:25:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:106:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:107:  sucursal_id uuid references public.sucursales(id) on delete set null,
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:108:  product_id uuid not null references public.products(id) on delete cascade,
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:15:  tenant_id uuid not null references public.organizations(id) on delete cascade,
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:50:  tenant_id uuid not null references public.organizations(id) on delete cascade,
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:70:  tenant_id uuid not null references public.organizations(id) on delete cascade,
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:87:  tenant_id uuid not null references public.organizations(id) on delete cascade,
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:88:  service_order_id uuid not null references public.service_orders(id) on delete cascade,
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:35:  references public.sucursales(id)
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:58:  references public.sucursales(id)
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:81:  references public.sucursales(id)
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:104:  references public.sucursales(id)
supabase/migrations/20260530132000_security_backoffice_tables.sql:14:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260530132000_security_backoffice_tables.sql:15:  user_id uuid references public.users(id) on delete set null,
supabase/migrations/20260530132000_security_backoffice_tables.sql:35:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260530132000_security_backoffice_tables.sql:36:  user_id uuid not null references public.users(id) on delete cascade,
supabase/migrations/20260514150000_add_tenant_onboarding.sql:4:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260530150000_add_pwa_push_subscriptions.sql:3:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260530150000_add_pwa_push_subscriptions.sql:4:  user_id uuid references public.users(id) on delete set null,
supabase/migrations/20260523190000_order_documents_events.sql:3:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260523190000_order_documents_events.sql:4:  service_order_id uuid not null references public.service_orders(id) on delete cascade,
supabase/migrations/20260523190000_order_documents_events.sql:13:  created_by uuid references public.users(id) on delete set null,
supabase/migrations/20260523190000_order_documents_events.sql:20:  tenant_id uuid not null references public.tenants(id) on delete cascade,
supabase/migrations/20260523190000_order_documents_events.sql:21:  service_order_id uuid not null references public.service_orders(id) on delete cascade,
supabase/migrations/20260523190000_order_documents_events.sql:27:  created_by uuid references public.users(id) on delete set null,

---

## 17. Tenant Isolation

apps/api/src/middleware/auth.ts:10:  tenant_id: string;
apps/api/src/middleware/auth.ts:34:  const tenantId = typeof payload.tenant_id === 'string' ? payload.tenant_id : null;
apps/api/src/middleware/auth.ts:57:    tenant_id: z.string().min(1),
apps/api/src/middleware/auth.ts:93:        .select('id, tenant_id, role, sucursal_id, activo, is_active, mfa_enabled')
apps/api/src/middleware/auth.ts:95:        .eq('tenant_id', claims.tenant_id)
apps/api/src/middleware/auth.ts:110:          .select('id, tenant_id, user_id, revoked_at')
apps/api/src/middleware/auth.ts:112:          .eq('tenant_id', claims.tenant_id)
apps/api/src/middleware/auth.ts:133:        tenantId: claims.tenant_id,
apps/api/src/controllers/meta.ts:63:      .select('tenant_id, role, sucursal_id')
apps/api/src/controllers/meta.ts:71:    if (!userRow?.tenant_id) {
apps/api/src/controllers/meta.ts:78:      .eq('id', userRow.tenant_id)
apps/api/src/controllers/meta.ts:240:        tenant_id: tenantRow.id,
apps/api/src/controllers/meta.ts:256:        .upsert(industryPayload, { onConflict: 'tenant_id' });
apps/api/src/controllers/meta.ts:276:            tenant_id: tenantRow.id,
apps/api/src/controllers/meta.ts:290:          .eq('tenant_id', tenantRow.id);
apps/api/src/controllers/meta.ts:300:          .upsert(rows, { onConflict: 'tenant_id,module_key' });
apps/api/src/controllers/meta.ts:315:            tenant_id: tenantRow.id,
apps/api/src/controllers/meta.ts:326:        .eq('tenant_id', tenantRow.id);
apps/api/src/controllers/meta.ts:350:            tenant_id: tenantRow.id,
apps/api/src/controllers/meta.ts:367:          .eq('tenant_id', tenantRow.id);
apps/api/src/controllers/meta.ts:377:          .upsert(rows, { onConflict: 'tenant_id,workflow_key,status_key' });
apps/api/src/controllers/meta.ts:395:            tenant_id: tenantRow.id,
apps/api/src/controllers/meta.ts:416:          .eq('tenant_id', tenantRow.id);
apps/api/src/controllers/meta.ts:426:          .upsert(rows, { onConflict: 'tenant_id,entity,field_key' });
apps/api/src/controllers/meta.ts:443:            tenant_id: tenantRow.id,
apps/api/src/controllers/meta.ts:465:          .eq('tenant_id', tenantRow.id);
apps/api/src/controllers/meta.ts:475:          .upsert(rows, { onConflict: 'tenant_id,industry_key,workflow_key,status_key,metric' });
apps/api/src/controllers/auth.controller.ts:89:    tenant_id: tenant.id,
apps/api/src/controllers/auth.controller.ts:181:      tenantId: tenant?.tenant_id ?? null,
apps/api/src/controllers/auth.controller.ts:187:    if (!tenant?.tenant_id || !tenantSlug) {
apps/api/src/controllers/auth.controller.ts:191:    console.log('STEP_TENANT_OBTAINED', { tenantId: tenant.tenant_id, tenantSlug });
apps/api/src/controllers/auth.controller.ts:197:      tenant_id: tenant.tenant_id,
apps/api/src/controllers/auth.controller.ts:199:    }, tenant.tenant_id);
apps/api/src/controllers/auth.controller.ts:202:      tenantId: tenant.tenant_id,
apps/api/src/controllers/auth.controller.ts:213:      tenantId: tenant.tenant_id,
apps/api/src/controllers/auth.controller.ts:219:        id: tenant.tenant_id,
apps/api/src/controllers/auth.controller.ts:324:  if (!tenant?.tenant_id || !tenantSlug) {
apps/api/src/controllers/auth.controller.ts:327:  console.log('STEP_GOOGLE_TENANT_OBTAINED', { tenantId: tenant.tenant_id, tenantSlug });
apps/api/src/controllers/auth.controller.ts:330:    { id: tenant.tenant_id, slug: tenantSlug },
apps/api/src/controllers/auth.controller.ts:338:        id: tenant.tenant_id,
apps/api/src/controllers/auth.controller.ts:392:      .select('id, tenant_id, role, sucursal_id, activo, is_active')
apps/api/src/controllers/auth.controller.ts:400:    if (!userRow?.tenant_id) {
apps/api/src/controllers/auth.controller.ts:411:      .eq('id', userRow.tenant_id)
apps/api/src/controllers/auth.controller.ts:428:        .eq('tenant_id', tenantSecurity.id)
apps/api/src/controllers/auth.controller.ts:456:      .eq('tenant_id', tenantSecurity.id);
apps/api/src/controllers/auth.controller.ts:459:      tenant_id: tenantSecurity.id,
apps/api/src/controllers/requests.ts:33:      .eq('tenant_id', tenantId)
apps/api/src/controllers/requests.ts:68:      .eq('tenant_id', tenantId)
apps/api/src/controllers/requests.ts:108:      .eq('tenant_id', tenantId)
apps/api/src/controllers/requests.ts:122:            tenant_id: tenantId,
apps/api/src/controllers/requests.ts:147:          tenant_id: tenantId,
apps/api/src/controllers/requests.ts:178:      .eq('tenant_id', tenantId)
apps/api/src/controllers/suppliers.ts:42:    tenant_id: row.tenant_id,
apps/api/src/controllers/suppliers.ts:86:    .select('id, tenant_id, business_name, rfc, legal_name, contact_name, phone, whatsapp, email, address, city, state, categories, lead_time_days, payment_terms, price_score, speed_score, quality_score, reliability_score, notes, is_active, created_at, updated_at', { count: 'exact' })
apps/api/src/controllers/suppliers.ts:87:    .eq('tenant_id', tenantId);
apps/api/src/controllers/suppliers.ts:162:      .select('id, tenant_id, business_name, rfc, legal_name, contact_name, phone, whatsapp, email, address, city, state, categories, lead_time_days, payment_terms, price_score, speed_score, quality_score, reliability_score, notes, is_active, created_at, updated_at')
apps/api/src/controllers/suppliers.ts:163:      .eq('tenant_id', tenantId)
apps/api/src/controllers/suppliers.ts:197:          tenant_id: tenantId,
apps/api/src/controllers/suppliers.ts:219:      .select('id, tenant_id, business_name, rfc, legal_name, contact_name, phone, whatsapp, email, address, city, state, categories, lead_time_days, payment_terms, price_score, speed_score, quality_score, reliability_score, notes, is_active, created_at, updated_at')
apps/api/src/controllers/suppliers.ts:262:      .eq('tenant_id', tenantId)
apps/api/src/controllers/suppliers.ts:294:      .eq('tenant_id', tenantId)
apps/api/src/controllers/suppliers.ts:296:      .select('id, tenant_id, business_name, rfc, legal_name, contact_name, phone, whatsapp, email, address, city, state, categories, lead_time_days, payment_terms, price_score, speed_score, quality_score, reliability_score, notes, is_active, created_at, updated_at')
apps/api/src/controllers/suppliers.ts:340:      .eq('tenant_id', tenantId)
apps/api/src/controllers/suppliers.ts:355:      .eq('tenant_id', tenantId)
apps/api/src/controllers/suppliers.ts:357:      .select('id, tenant_id, business_name, rfc, legal_name, contact_name, phone, whatsapp, email, address, city, state, categories, lead_time_days, payment_terms, price_score, speed_score, quality_score, reliability_score, notes, is_active, created_at, updated_at')
apps/api/src/controllers/suppliers.ts:400:      .eq('tenant_id', tenantId)
apps/api/src/controllers/suppliers.ts:414:      .select('id, tenant_id, sucursal_id, supplier_id, related_service_order_id, folio, status, reference, payment_terms, expected_date, subtotal, tax_amount, total, notes, created_at, updated_at')
apps/api/src/controllers/suppliers.ts:415:      .eq('tenant_id', tenantId)
apps/api/src/controllers/suppliers.ts:445:      .eq('tenant_id', tenantId)
apps/api/src/controllers/suppliers.ts:460:      .eq('tenant_id', tenantId)
apps/api/src/controllers/reports.ts:17:    let ordersQuery = supabase.from('service_orders').select('id, status, created_at, final_cost, sucursal_id, promised_date, folio').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:18:    let customersQuery = supabase.from('customers').select('id').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:19:    let inventoryQuery = supabase.from('sucursal_inventory').select('id, stock_current, product_id, sucursal_id, products:product_id (id, cost)').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:20:    let financeQuery = supabase.from('finances').select('id, balance, income, expense, created_at, sucursal_id').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:21:    let requestsQuery = supabase.from('service_requests').select('id, balance_amount, status, created_at').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:22:    let usersQuery = supabase.from('users').select('id, full_name, role, sucursal_id').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:25:      .select('id, tenant_id, sucursal_id, product_id, service_order_id, movement_type, quantity, created_at, products:product_id (id, sku, name)')
apps/api/src/controllers/reports.ts:26:      .eq('tenant_id', tenantId)
apps/api/src/controllers/purchase-orders.ts:60:    .eq('tenant_id', tenantId)
apps/api/src/controllers/purchase-orders.ts:71:    .eq('tenant_id', tenantId)
apps/api/src/controllers/purchase-orders.ts:82:    .eq('tenant_id', tenantId)
apps/api/src/controllers/purchase-orders.ts:98:    .select('id, tenant_id, sku, name')
apps/api/src/controllers/purchase-orders.ts:99:    .eq('tenant_id', tenantId)
apps/api/src/controllers/purchase-orders.ts:114:      tenant_id: tenantId,
apps/api/src/controllers/purchase-orders.ts:129:    .select('id, tenant_id, sku, name')
apps/api/src/controllers/purchase-orders.ts:141:    supabase.from('purchase_orders').select('*').eq('tenant_id', tenantId).eq('id', orderId).maybeSingle(),
apps/api/src/controllers/purchase-orders.ts:142:    supabase.from('purchase_order_items').select('*').eq('tenant_id', tenantId).eq('purchase_order_id', orderId).order('created_at', { ascending: true }),
apps/api/src/controllers/purchase-orders.ts:143:    supabase.from('inventory_movements').select('id, tenant_id, sucursal_id, product_id, purchase_order_id, movement_type, quantity, unit_cost, reference, notes, created_by, created_at').eq('tenant_id', tenantId).eq('purchase_order_id', orderId).order('created_at', { ascending: true }),
apps/api/src/controllers/purchase-orders.ts:161:      .select('id, tenant_id, sucursal_id, supplier_id, related_service_order_id, folio, status, reference, payment_terms, expected_date, subtotal, tax_amount, total, notes, created_at, updated_at')
apps/api/src/controllers/purchase-orders.ts:162:      .eq('tenant_id', tenantId)
apps/api/src/controllers/purchase-orders.ts:232:        tenant_id: tenantId,
apps/api/src/controllers/purchase-orders.ts:255:      tenant_id: tenantId,
apps/api/src/controllers/purchase-orders.ts:296:    const { data: existing, error: existingError } = await supabase.from('purchase_orders').select('id').eq('tenant_id', tenantId).eq('id', orderId).maybeSingle();
apps/api/src/controllers/purchase-orders.ts:322:      .eq('tenant_id', tenantId)
apps/api/src/controllers/purchase-orders.ts:346:    const { data: existing, error: existingError } = await supabase.from('purchase_orders').select('id').eq('tenant_id', tenantId).eq('id', orderId).maybeSingle();
apps/api/src/controllers/purchase-orders.ts:354:      .eq('tenant_id', tenantId)
apps/api/src/controllers/purchase-orders.ts:377:    const { data: existing, error: existingError } = await supabase.from('purchase_orders').select('id').eq('tenant_id', tenantId).eq('id', orderId).maybeSingle();
apps/api/src/controllers/purchase-orders.ts:384:      .eq('tenant_id', tenantId)
apps/api/src/controllers/purchase-orders.ts:404:    const { data: order, error: orderError } = await supabase.from('purchase_orders').select('*').eq('tenant_id', tenantId).eq('id', orderId).single();
apps/api/src/controllers/purchase-orders.ts:414:      .eq('tenant_id', tenantId)
apps/api/src/controllers/purchase-orders.ts:445:        .select('id, tenant_id, sucursal_id, product_id, stock_current')
apps/api/src/controllers/purchase-orders.ts:446:        .eq('tenant_id', tenantId)
apps/api/src/controllers/purchase-orders.ts:457:            tenant_id: tenantId,
apps/api/src/controllers/purchase-orders.ts:462:          .select('id, tenant_id, sucursal_id, product_id, stock_current')
apps/api/src/controllers/purchase-orders.ts:475:        .eq('tenant_id', tenantId)
apps/api/src/controllers/purchase-orders.ts:482:        tenant_id: tenantId,
apps/api/src/controllers/purchase-orders.ts:500:        .eq('tenant_id', tenantId)
apps/api/src/controllers/purchase-orders.ts:515:      .eq('tenant_id', tenantId)
apps/api/src/controllers/pwa.ts:34:        tenant_id: tenantId,
apps/api/src/controllers/pwa.ts:42:      }, { onConflict: 'tenant_id,endpoint' })
apps/api/src/controllers/pwa.ts:43:      .select('id, tenant_id, user_id, endpoint, active, created_at, updated_at')
apps/api/src/controllers/pwa.ts:70:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:87:  tenant_id: string;
apps/api/src/controllers/orders.ts:102:  tenant_id: string;
apps/api/src/controllers/orders.ts:292:  tenant_id: string;
apps/api/src/controllers/orders.ts:311:  tenant_id: string;
apps/api/src/controllers/orders.ts:515:          tenant_id: tenantId,
apps/api/src/controllers/orders.ts:558:        tenant_id: tenantId,
apps/api/src/controllers/orders.ts:591:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:596:      tenant_id: tenantId,
apps/api/src/controllers/orders.ts:661:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:710:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:720:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:725:        .select('id, tenant_id, service_order_id, bucket_name, storage_path, public_url, file_name, file_type, mime_type, file_size, source, created_at')
apps/api/src/controllers/orders.ts:726:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:731:        .select('id, tenant_id, service_order_id, event_type, previous_status, new_status, note, actor_name, created_at')
apps/api/src/controllers/orders.ts:732:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:810:      .select('id, tenant_id, evidence_metadata')
apps/api/src/controllers/orders.ts:811:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:814:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts:851:        tenant_id: tenantId,
apps/api/src/controllers/orders.ts:869:        tenant_id: tenantId,
apps/api/src/controllers/orders.ts:884:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:901:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:917:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:944:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:970:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:982:        tenant_id: tenantId,
apps/api/src/controllers/orders.ts:998:        tenant_id: tenantId,
apps/api/src/controllers/orders.ts:1042:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1045:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts:1068:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1078:      tenant_id: tenantId,
apps/api/src/controllers/orders.ts:1126:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1129:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts:1154:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1178:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1183:      tenant_id: tenantId,
apps/api/src/controllers/orders.ts:1230:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1233:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts:1252:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1280:        .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1289:        tenant_id: tenantId,
apps/api/src/controllers/orders.ts:1325:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1328:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts:1358:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1386:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1425:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1440:        tenant_id: tenantId,
apps/api/src/controllers/orders.ts:1482:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1500:      .eq('tenant_id', tenantId)
apps/api/src/controllers/orders.ts:1512:      tenant_id: tenantId,
apps/api/src/controllers/orders.ts:1535:      .eq('tenant_id', tenantId)
apps/api/src/controllers/security.ts:38:    .eq('tenant_id', tenantId);
apps/api/src/controllers/security.ts:51:    .eq('tenant_id', tenantId)
apps/api/src/controllers/security.ts:71:      supabaseAdmin.from('users').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId),
apps/api/src/controllers/security.ts:72:      supabaseAdmin.from('sucursales').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId),
apps/api/src/controllers/security.ts:145:        tenant_id: tenantId,
apps/api/src/controllers/security.ts:159:        tenant_id: tenantId,
apps/api/src/controllers/security.ts:167:      .select('id, tenant_id, auth_user_id, full_name, email, role, is_active, sucursal_id, created_at')
apps/api/src/controllers/security.ts:221:      .select('id, tenant_id, user_id, action, ip_address, user_agent, data_before, data_after, created_at', { count: 'exact' })
apps/api/src/controllers/security.ts:222:      .eq('tenant_id', tenantId)
apps/api/src/controllers/security.ts:276:      .select('id, tenant_id, user_id, session_key, ip_address, user_agent, last_activity_at, revoked_at, created_at, updated_at, users(id, name, full_name, email, role)')
apps/api/src/controllers/security.ts:277:      .eq('tenant_id', tenantId)
apps/api/src/controllers/security.ts:320:      .eq('tenant_id', tenantId)
apps/api/src/controllers/security.ts:322:      .select('id, tenant_id, user_id, revoked_at')
apps/api/src/controllers/security.ts:388:      .eq('tenant_id', tenantId)
apps/api/src/controllers/security.ts:419:      .eq('tenant_id', tenantId)
apps/api/src/controllers/security.ts:437:      .eq('tenant_id', tenantId);
apps/api/src/controllers/security.ts:473:      .eq('tenant_id', tenantId)
apps/api/src/controllers/security.ts:496:      .eq('tenant_id', tenantId);
apps/api/src/controllers/catalogs.ts:39:    .select('id, tenant_id, sku, name')
apps/api/src/controllers/catalogs.ts:40:    .eq('tenant_id', tenantId)
apps/api/src/controllers/catalogs.ts:55:      tenant_id: tenantId,
apps/api/src/controllers/catalogs.ts:70:    .select('id, tenant_id, sku, name')
apps/api/src/controllers/catalogs.ts:89:    .select('id, tenant_id, sucursal_id, product_id, stock_current')
apps/api/src/controllers/catalogs.ts:90:    .eq('tenant_id', tenantId)
apps/api/src/controllers/catalogs.ts:103:      .eq('tenant_id', tenantId)
apps/api/src/controllers/catalogs.ts:105:      .select('id, tenant_id, sucursal_id, product_id, stock_current')
apps/api/src/controllers/catalogs.ts:118:      tenant_id: tenantId,
apps/api/src/controllers/catalogs.ts:123:    .select('id, tenant_id, sucursal_id, product_id, stock_current')
apps/api/src/controllers/catalogs.ts:145:    .eq('tenant_id', tenantId)
apps/api/src/controllers/catalogs.ts:164:      .select('id, tenant_id, sucursal_id, name, phone, email, created_at')
apps/api/src/controllers/catalogs.ts:165:      .eq('tenant_id', tenantId)
apps/api/src/controllers/catalogs.ts:191:      tenant_id: tenantId,
apps/api/src/controllers/catalogs.ts:196:    }]).select('id, tenant_id, sucursal_id, name, phone, email, created_at').single();
apps/api/src/controllers/catalogs.ts:220:      .select('id, tenant_id, sucursal_id, product_id, stock_current, created_at, updated_at, products:product_id (id, sku, name, minimum_stock)')
apps/api/src/controllers/catalogs.ts:221:      .eq('tenant_id', tenantId)
apps/api/src/controllers/catalogs.ts:235:      ? await supabase.from('products').select('id, sku, name, tenant_id').eq('tenant_id', tenantId).in('id', productIds)
apps/api/src/controllers/catalogs.ts:314:    .select('id, tenant_id, sucursal_id, product_id, stock_current, created_at, products:product_id (id, sku, name, minimum_stock)')
apps/api/src/controllers/catalogs.ts:315:      .eq('tenant_id', tenantId)
apps/api/src/controllers/catalogs.ts:349:      .select('id, tenant_id, sku, name')
apps/api/src/controllers/catalogs.ts:350:      .eq('tenant_id', tenantId)
apps/api/src/controllers/catalogs.ts:364:      .eq('tenant_id', tenantId)
apps/api/src/controllers/catalogs.ts:366:      .select('id, tenant_id, sucursal_id, product_id, stock_current, created_at, products:product_id (id, sku, name, minimum_stock)')
apps/api/src/controllers/catalogs.ts:377:        tenant_id: tenantId,
apps/api/src/controllers/catalogs.ts:413:      .select('id, tenant_id, product_id, stock_current, sucursal_id')
apps/api/src/controllers/catalogs.ts:414:      .eq('tenant_id', tenantId)
apps/api/src/controllers/catalogs.ts:436:      .select('id, tenant_id, sku, name')
apps/api/src/controllers/catalogs.ts:437:      .eq('tenant_id', tenantId)
apps/api/src/controllers/catalogs.ts:447:      .select('id, tenant_id, sucursal_id, product_id, service_order_id, purchase_order_id, movement_type, quantity, unit_cost, reference, notes, created_by, created_at')
apps/api/src/controllers/catalogs.ts:448:      .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts.bak.20260603_093424:50:    .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts.bak.20260603_093424:79:    tenantId: String(row.tenant_id ?? ''),
apps/api/src/controllers/users.ts.bak.20260603_093424:127:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at', { count: 'exact' })
apps/api/src/controllers/users.ts.bak.20260603_093424:128:      .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts.bak.20260603_093424:202:        tenant_id: tenantId,
apps/api/src/controllers/users.ts.bak.20260603_093424:217:      .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts.bak.20260603_093424:239:        .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
apps/api/src/controllers/users.ts.bak.20260603_093424:265:        tenant_id: tenantId,
apps/api/src/controllers/users.ts.bak.20260603_093424:276:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
apps/api/src/controllers/users.ts.bak.20260603_093424:335:      .select('id, tenant_id, auth_user_id, role, activo, is_active')
apps/api/src/controllers/users.ts.bak.20260603_093424:337:      .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts.bak.20260603_093424:354:      .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts.bak.20260603_093424:355:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
apps/api/src/controllers/users.ts.bak.20260603_093424:405:      .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts.bak.20260603_093424:406:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
apps/api/src/controllers/users.ts.bak.20260603_093424:450:      .select('id, tenant_id, auth_user_id, name, full_name, email, role, activo')
apps/api/src/controllers/users.ts.bak.20260603_093424:452:      .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts.bak.20260603_093424:465:      .select('id, tenant_id, sucursal_id, supplier_id, related_service_order_id, folio, status, reference, payment_terms, expected_date, subtotal, tax_amount, total, notes, created_at, updated_at')
apps/api/src/controllers/users.ts.bak.20260603_093424:466:      .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts:50:    .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts:79:    tenantId: String(row.tenant_id ?? ''),
apps/api/src/controllers/users.ts:127:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, created_at, updated_at', { count: 'exact' })
apps/api/src/controllers/users.ts:128:      .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts:202:        tenant_id: tenantId,
apps/api/src/controllers/users.ts:217:      .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts:238:        .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, created_at, updated_at')
apps/api/src/controllers/users.ts:264:        tenant_id: tenantId,
apps/api/src/controllers/users.ts:274:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, created_at, updated_at')
apps/api/src/controllers/users.ts:333:      .select('id, tenant_id, auth_user_id, role, activo, is_active')
apps/api/src/controllers/users.ts:335:      .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts:352:      .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts:353:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, created_at, updated_at')
apps/api/src/controllers/users.ts:403:      .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts:404:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, created_at, updated_at')
apps/api/src/controllers/users.ts:448:      .select('id, tenant_id, auth_user_id, name, full_name, email, role, activo')
apps/api/src/controllers/users.ts:450:      .eq('tenant_id', tenantId)
apps/api/src/controllers/users.ts:463:      .select('id, tenant_id, sucursal_id, supplier_id, related_service_order_id, folio, status, reference, payment_terms, expected_date, subtotal, tax_amount, total, notes, created_at, updated_at')
apps/api/src/controllers/users.ts:464:      .eq('tenant_id', tenantId)
apps/api/src/controllers/finance.ts:25:    .eq('tenant_id', tenantId)
apps/api/src/controllers/finance.ts:41:      .select('id, tenant_id, sucursal_id, final_cost, created_at, status')
apps/api/src/controllers/finance.ts:42:      .eq('tenant_id', tenantId)
apps/api/src/controllers/finance.ts:46:      .select('id, tenant_id, sucursal_id, balance, income, expense, created_at')
apps/api/src/controllers/finance.ts:47:      .eq('tenant_id', tenantId)
apps/api/src/controllers/finance.ts:88:        tenant_id: tenantId,
apps/api/src/controllers/finance.ts:97:        tenant_id: tenantId,
apps/api/src/controllers/finance.ts:106:        tenant_id: tenantId,
apps/api/src/controllers/finance.ts:140:    const grouped = new Map<string, { id: string; tenant_id: string; sucursal_id: string; balance: number; income: number; expense: number; created_at: string }>();
apps/api/src/controllers/finance.ts:144:      const current = grouped.get(day) ?? { id: `${sucursalId}-${day}`, tenant_id: tenantId, sucursal_id: sucursalId, balance: 0, income: 0, expense: 0, created_at: day };
apps/api/src/controllers/finance.ts:153:      const current = grouped.get(day) ?? { id: `${sucursalId}-${day}`, tenant_id: tenantId, sucursal_id: sucursalId, balance: 0, income: 0, expense: 0, created_at: day };
apps/api/src/controllers/finance.ts:190:          tenant_id: tenantId,
apps/api/src/controllers/finance.ts:225:      .eq('tenant_id', tenantId)
apps/api/src/controllers/finance.ts:260:      .eq('tenant_id', tenantId)
apps/api/src/controllers/finance.ts:276:      .eq('tenant_id', tenantId)
apps/api/src/controllers/tasks.ts:81:    .eq('tenant_id', tenantId)
apps/api/src/controllers/tasks.ts:89:  tenant_id: string;
apps/api/src/controllers/tasks.ts:97:    tenant_id: row.tenant_id,
apps/api/src/controllers/tasks.ts:115:    let query = supabase.from('tasks').select('*').eq('tenant_id', tenantId).order('created_at', { ascending: false }).limit(100);
apps/api/src/controllers/tasks.ts:136:      supabase.from('tasks').select('*').eq('tenant_id', tenantId).eq('id', taskId).maybeSingle(),
apps/api/src/controllers/tasks.ts:137:      supabase.from('task_history').select('*').eq('tenant_id', tenantId).eq('task_id', taskId).order('created_at', { ascending: false }),
apps/api/src/controllers/tasks.ts:170:      tenant_id: tenantId,
apps/api/src/controllers/tasks.ts:189:      tenant_id: tenantId,
apps/api/src/controllers/tasks.ts:237:    const { data, error } = await supabase.from('tasks').update(payload).eq('tenant_id', tenantId).eq('id', taskId).select('*').single();
apps/api/src/controllers/tasks.ts:241:    await insertTaskHistory(supabase, { tenant_id: tenantId, task_id: taskId, event_type: 'updated', comment: body.description || body.title || null, changed_by: null });
apps/api/src/controllers/tasks.ts:268:    const { data: current, error: currentError } = await supabase.from('tasks').select('status').eq('tenant_id', tenantId).eq('id', taskId).single();
apps/api/src/controllers/tasks.ts:273:    const { data, error } = await supabase.from('tasks').update({ status: body.status, updated_by: null }).eq('tenant_id', tenantId).eq('id', taskId).select('*').single();
apps/api/src/controllers/tasks.ts:279:      tenant_id: tenantId,
apps/api/src/controllers/tasks.ts:305:    const { error } = await supabase.from('tasks').delete().eq('tenant_id', tenantId).eq('id', taskId);
apps/api/src/controllers/tasks.ts:309:    await insertTaskHistory(supabase, { tenant_id: tenantId, task_id: taskId, event_type: 'deleted', comment: null, changed_by: null }).catch(() => null);
apps/api/src/controllers/tasks.ts:326:      .eq('tenant_id', tenantId)
apps/api/src/controllers/procurement.ts:15:      .select('id, tenant_id, product_id, stock_current, sucursal_id, created_at')
apps/api/src/controllers/procurement.ts:16:      .eq('tenant_id', tenantId)
apps/api/src/controllers/procurement.ts:27:      ? await supabase.from('products').select('id, sku, name').eq('tenant_id', tenantId).in('id', productIds)
apps/api/src/controllers/public.ts:246:          tenant_id: tenant.id,
apps/api/src/controllers/public.ts:297:      .select('id, tenant_id, folio, status, created_at, device_info, problem_description, serial_number, receipt_url, estimated_cost, final_cost, metadata')
apps/api/src/controllers/public.ts:298:      .eq('tenant_id', tenant.id)
apps/api/src/controllers/public.ts:351:      .select('id, tenant_id, folio, status, created_at, updated_at, promised_date, device_info, problem_description, serial_number, receipt_url, estimated_cost, final_cost, evidence_metadata, metadata')
apps/api/src/controllers/public.ts:352:      .eq('tenant_id', tenant.id)
apps/api/src/controllers/public.ts:363:      .eq('tenant_id', tenant.id)
apps/api/src/controllers/public.ts:374:      .eq('tenant_id', tenant.id)
apps/api/src/controllers/sucursales.ts:28:    .select('id, tenant_id')
apps/api/src/controllers/sucursales.ts:29:    .eq('tenant_id', tenantId)
apps/api/src/controllers/sucursales.ts:44:    .eq('tenant_id', tenantId);
apps/api/src/controllers/sucursales.ts:64:      .select('id, tenant_id, name, code, address, city, state, phone, is_active, created_at, updated_at')
apps/api/src/controllers/sucursales.ts:65:      .eq('tenant_id', tenantId)
apps/api/src/controllers/sucursales.ts:110:      tenant_id: tenantId,
apps/api/src/controllers/sucursales.ts:123:      .select('id, tenant_id, name, code, address, city, state, phone, is_active, created_at, updated_at')
apps/api/src/controllers/sucursales.ts:176:      .eq('tenant_id', tenantId)
apps/api/src/controllers/sucursales.ts:178:      .select('id, tenant_id, name, code, address, city, state, phone, is_active, created_at, updated_at')
apps/api/src/controllers/sucursales.ts:220:      .eq('tenant_id', tenantId)
apps/api/src/controllers/sucursales.ts:260:      .select('id, tenant_id')
apps/api/src/controllers/sucursales.ts:261:      .eq('tenant_id', tenantId)
apps/api/src/controllers/sucursales.ts:276:      .eq('tenant_id', tenantId)
apps/api/src/controllers/sucursales.ts:278:      .select('id, tenant_id, sucursal_id, full_name, email, role, is_active')
apps/api/src/services/security-backoffice.ts:111:    tenant_id: input.tenantId,
apps/api/src/services/pwa-push.ts:37:    .eq('tenant_id', tenantId)
apps/api/src/services/pwa-push.ts:69:    tenant_id: tenantId,
apps/api/src/services/tenant-config.ts:527:    tenant_id: '',
apps/api/src/services/tenant-config.ts:553:        tenant_id: '',
apps/api/src/services/tenant-config.ts:602:      .select('tenant_id, industry_key, industry_label, asset_label, order_label, request_label, customer_label, portal_label, quote_label, default_workflow_key, is_active, metadata')
apps/api/src/services/tenant-config.ts:603:      .eq('tenant_id', tenantId)
apps/api/src/services/tenant-config.ts:607:      .select('id, tenant_id, module_key, module_label, enabled, sort_order, metadata')
apps/api/src/services/tenant-config.ts:608:      .eq('tenant_id', tenantId)
apps/api/src/services/tenant-config.ts:613:      .select('id, tenant_id, label_key, label_value, context')
apps/api/src/services/tenant-config.ts:614:      .eq('tenant_id', tenantId)
apps/api/src/services/tenant-config.ts:618:      .select('id, tenant_id, workflow_key, status_key, label, tone, sort_order, is_default, is_terminal, metadata')
apps/api/src/services/tenant-config.ts:619:      .eq('tenant_id', tenantId)
apps/api/src/services/tenant-config.ts:625:      .select('id, tenant_id, entity, field_key, field_label, field_type, required, options, field_order, placeholder, help_text, visible, validation, metadata')
apps/api/src/services/tenant-config.ts:626:      .eq('tenant_id', tenantId)
apps/api/src/services/tenant-config.ts:632:      .select('id, tenant_id, industry_key, workflow_key, status_key, metric, green_until_minutes, yellow_until_minutes, red_after_minutes, priority, reason_template, suggested_action_template, action_key, enabled, metadata, created_at')
apps/api/src/services/tenant-config.ts:633:      .eq('tenant_id', tenantId)
apps/api/src/services/tenant-config.ts:680:          tenant_id: '',
apps/api/src/services/tenant-config.ts:687:        tenant_id: '',
apps/api/src/services/tenant-config.ts:694:        tenant_id: '',
apps/api/src/services/billing.ts:111:    tenant_id: tenantId,
apps/api/src/services/billing.ts:150:    .select('id, tenant_id, role, email')
apps/api/src/services/billing.ts:158:  if (!userRow?.tenant_id) {
apps/api/src/services/billing.ts:165:    .eq('id', userRow.tenant_id)
apps/api/src/services/stock-alerts.ts:5:  tenant_id: string;
apps/api/src/services/stock-alerts.ts:33:    .eq('tenant_id', params.tenantId)
apps/api/src/services/stock-alerts.ts:49:        .eq('tenant_id', params.tenantId)
apps/api/src/services/stock-alerts.ts:58:    tenant_id: params.tenantId,
apps/api/src/services/stock-alerts.ts:70:      .eq('tenant_id', params.tenantId)
apps/api/src/services/stock-alerts.ts:88:    .select('id, tenant_id, sucursal_id, product_id, severity, acknowledged_by, acknowledged_at, created_at')
apps/api/src/services/stock-alerts.ts:89:    .eq('tenant_id', tenantId);
apps/api/src/services/stock-alerts.ts:109:    .eq('tenant_id', params.tenantId)

---

## 18. Sucursal Isolation

apps/api/src/middleware/auth.ts:14:  sucursal_id?: string;
apps/api/src/middleware/auth.ts:61:    sucursal_id: z.string().min(1).optional(),
apps/api/src/middleware/auth.ts:93:        .select('id, tenant_id, role, sucursal_id, activo, is_active, mfa_enabled')
apps/api/src/middleware/auth.ts:137:        sucursalId: userRow.sucursal_id ?? claims.sucursal_id,
apps/api/src/controllers/meta.ts:63:      .select('tenant_id, role, sucursal_id')
apps/api/src/controllers/meta.ts:96:        sucursalId: userRow.sucursal_id ?? null,
apps/api/src/controllers/auth.controller.ts:91:    sucursal_id: sucursalId ?? undefined,
apps/api/src/controllers/auth.controller.ts:392:      .select('id, tenant_id, role, sucursal_id, activo, is_active')
apps/api/src/controllers/auth.controller.ts:445:      userRow.sucursal_id,
apps/api/src/controllers/suppliers.ts:414:      .select('id, tenant_id, sucursal_id, supplier_id, related_service_order_id, folio, status, reference, payment_terms, expected_date, subtotal, tax_amount, total, notes, created_at, updated_at')
apps/api/src/controllers/reports.ts:17:    let ordersQuery = supabase.from('service_orders').select('id, status, created_at, final_cost, sucursal_id, promised_date, folio').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:19:    let inventoryQuery = supabase.from('sucursal_inventory').select('id, stock_current, product_id, sucursal_id, products:product_id (id, cost)').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:20:    let financeQuery = supabase.from('finances').select('id, balance, income, expense, created_at, sucursal_id').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:22:    let usersQuery = supabase.from('users').select('id, full_name, role, sucursal_id').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:25:      .select('id, tenant_id, sucursal_id, product_id, service_order_id, movement_type, quantity, created_at, products:product_id (id, sku, name)')
apps/api/src/controllers/reports.ts:30:      ordersQuery = ordersQuery.eq('sucursal_id', effectiveSucursalId);
apps/api/src/controllers/reports.ts:31:      inventoryQuery = inventoryQuery.eq('sucursal_id', effectiveSucursalId);
apps/api/src/controllers/reports.ts:32:      financeQuery = financeQuery.eq('sucursal_id', effectiveSucursalId);
apps/api/src/controllers/reports.ts:33:      usersQuery = usersQuery.eq('sucursal_id', effectiveSucursalId);
apps/api/src/controllers/reports.ts:34:      movementsQuery = movementsQuery.eq('sucursal_id', effectiveSucursalId);
apps/api/src/controllers/reports.ts:125:      const key = String((order as { sucursal_id?: string | null }).sucursal_id ?? 'sin_sucursal');
apps/api/src/controllers/purchase-orders.ts:143:    supabase.from('inventory_movements').select('id, tenant_id, sucursal_id, product_id, purchase_order_id, movement_type, quantity, unit_cost, reference, notes, created_by, created_at').eq('tenant_id', tenantId).eq('purchase_order_id', orderId).order('created_at', { ascending: true }),
apps/api/src/controllers/purchase-orders.ts:161:      .select('id, tenant_id, sucursal_id, supplier_id, related_service_order_id, folio, status, reference, payment_terms, expected_date, subtotal, tax_amount, total, notes, created_at, updated_at')
apps/api/src/controllers/purchase-orders.ts:166:      query = query.eq('sucursal_id', scope.sucursalId);
apps/api/src/controllers/purchase-orders.ts:191:    if (scope?.mode === 'branch' && scope.sucursalId && String((order.data as { sucursal_id?: string | null }).sucursal_id ?? '') !== scope.sucursalId) {
apps/api/src/controllers/purchase-orders.ts:233:        sucursal_id: resolvedSucursalId,
apps/api/src/controllers/purchase-orders.ts:312:    if (body.sucursalId !== undefined) payload.sucursal_id = resolvedSucursalId;
apps/api/src/controllers/purchase-orders.ts:407:    if (scope?.mode === 'branch' && scope.sucursalId && String(order.sucursal_id ?? '') !== scope.sucursalId) {
apps/api/src/controllers/purchase-orders.ts:433:      const orderSucursalId = order.sucursal_id ?? scope?.sucursalId ?? null;
apps/api/src/controllers/purchase-orders.ts:445:        .select('id, tenant_id, sucursal_id, product_id, stock_current')
apps/api/src/controllers/purchase-orders.ts:448:        .eq('sucursal_id', orderSucursalId)
apps/api/src/controllers/purchase-orders.ts:458:            sucursal_id: orderSucursalId,
apps/api/src/controllers/purchase-orders.ts:462:          .select('id, tenant_id, sucursal_id, product_id, stock_current')
apps/api/src/controllers/purchase-orders.ts:473:          sucursal_id: orderSucursalId ?? nextInventory.sucursal_id ?? null,
apps/api/src/controllers/purchase-orders.ts:478:      await refreshInventoryAlert(tenantId, productCatalog.id, orderSucursalId ?? nextInventory.sucursal_id ?? null, nextStock);
apps/api/src/controllers/purchase-orders.ts:483:        sucursal_id: orderSucursalId,
apps/api/src/controllers/orders.ts:133:    scopedQuery = scopedQuery.eq('sucursal_id', branchId);
apps/api/src/controllers/orders.ts:516:          sucursal_id: requestedSucursalId,
apps/api/src/controllers/orders.ts:629:        sucursal_id: requestedSucursalId,
apps/api/src/controllers/orders.ts:814:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts:1045:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts:1129:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts:1233:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/orders.ts:1328:        scope?.mode === 'branch' && isUuid(scope.sucursalId) ? 'sucursal_id' : 'tenant_id',
apps/api/src/controllers/security.ts:148:        sucursal_id: body.sucursalId ?? undefined,
apps/api/src/controllers/security.ts:165:        sucursal_id: body.sucursalId ?? null,
apps/api/src/controllers/security.ts:167:      .select('id, tenant_id, auth_user_id, full_name, email, role, is_active, sucursal_id, created_at')
apps/api/src/controllers/catalogs.ts:89:    .select('id, tenant_id, sucursal_id, product_id, stock_current')
apps/api/src/controllers/catalogs.ts:92:    .eq('sucursal_id', sucursalId)
apps/api/src/controllers/catalogs.ts:105:      .select('id, tenant_id, sucursal_id, product_id, stock_current')
apps/api/src/controllers/catalogs.ts:119:      sucursal_id: sucursalId,
apps/api/src/controllers/catalogs.ts:123:    .select('id, tenant_id, sucursal_id, product_id, stock_current')
apps/api/src/controllers/catalogs.ts:164:      .select('id, tenant_id, sucursal_id, name, phone, email, created_at')
apps/api/src/controllers/catalogs.ts:171:      query = query.eq('sucursal_id', scopedSucursalId);
apps/api/src/controllers/catalogs.ts:192:      sucursal_id: scope?.sucursalId ?? null,
apps/api/src/controllers/catalogs.ts:196:    }]).select('id, tenant_id, sucursal_id, name, phone, email, created_at').single();
apps/api/src/controllers/catalogs.ts:220:      .select('id, tenant_id, sucursal_id, product_id, stock_current, created_at, updated_at, products:product_id (id, sku, name, minimum_stock)')
apps/api/src/controllers/catalogs.ts:226:      query = query.eq('sucursal_id', effectiveSucursalId);
apps/api/src/controllers/catalogs.ts:314:    .select('id, tenant_id, sucursal_id, product_id, stock_current, created_at, products:product_id (id, sku, name, minimum_stock)')
apps/api/src/controllers/catalogs.ts:326:      : (body.sucursalId ?? scope?.sucursalId ?? currentRow.sucursal_id ?? null);
apps/api/src/controllers/catalogs.ts:343:    if (scope?.mode === 'branch' && currentRow.sucursal_id && scope.sucursalId && currentRow.sucursal_id !== scope.sucursalId) {
apps/api/src/controllers/catalogs.ts:362:        sucursal_id: scope?.mode === 'branch' ? (scope.sucursalId ?? currentRow.sucursal_id ?? nextSucursalId) : nextSucursalId,
apps/api/src/controllers/catalogs.ts:366:      .select('id, tenant_id, sucursal_id, product_id, stock_current, created_at, products:product_id (id, sku, name, minimum_stock)')
apps/api/src/controllers/catalogs.ts:378:        sucursal_id: scope?.mode === 'branch' ? (scope.sucursalId ?? currentRow.sucursal_id ?? nextSucursalId) : nextSucursalId,
apps/api/src/controllers/catalogs.ts:391:      await refreshInventoryAlert(tenantId, productRow.id, scope?.mode === 'branch' ? (scope.sucursalId ?? currentRow.sucursal_id ?? nextSucursalId) : nextSucursalId, nextStock);
apps/api/src/controllers/catalogs.ts:413:      .select('id, tenant_id, product_id, stock_current, sucursal_id')
apps/api/src/controllers/catalogs.ts:422:    if (inventoryRow?.sucursal_id && !(await validateSucursalOwnership(supabase, tenantId, inventoryRow.sucursal_id))) {
apps/api/src/controllers/catalogs.ts:430:    if (req.scope?.mode === 'branch' && req.scope.sucursalId && inventoryRow.sucursal_id && inventoryRow.sucursal_id !== req.scope.sucursalId) {
apps/api/src/controllers/catalogs.ts:447:      .select('id, tenant_id, sucursal_id, product_id, service_order_id, purchase_order_id, movement_type, quantity, unit_cost, reference, notes, created_by, created_at')
apps/api/src/controllers/users.ts.bak.20260603_093424:92:    sucursalId: row.sucursal_id ?? row.branch_id ?? null,
apps/api/src/controllers/users.ts.bak.20260603_093424:127:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at', { count: 'exact' })
apps/api/src/controllers/users.ts.bak.20260603_093424:205:        sucursal_id: body.sucursalId ?? undefined,
apps/api/src/controllers/users.ts.bak.20260603_093424:235:          sucursal_id: body.sucursalId ?? null,
apps/api/src/controllers/users.ts.bak.20260603_093424:239:        .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
apps/api/src/controllers/users.ts.bak.20260603_093424:273:        sucursal_id: body.sucursalId ?? null,
apps/api/src/controllers/users.ts.bak.20260603_093424:276:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
apps/api/src/controllers/users.ts.bak.20260603_093424:355:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
apps/api/src/controllers/users.ts.bak.20260603_093424:406:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
apps/api/src/controllers/users.ts.bak.20260603_093424:465:      .select('id, tenant_id, sucursal_id, supplier_id, related_service_order_id, folio, status, reference, payment_terms, expected_date, subtotal, tax_amount, total, notes, created_at, updated_at')
apps/api/src/controllers/users.ts:92:    sucursalId: row.sucursal_id ?? null,
apps/api/src/controllers/users.ts:127:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, created_at, updated_at', { count: 'exact' })
apps/api/src/controllers/users.ts:205:        sucursal_id: body.sucursalId ?? undefined,
apps/api/src/controllers/users.ts:235:          sucursal_id: body.sucursalId ?? null,
apps/api/src/controllers/users.ts:238:        .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, created_at, updated_at')
apps/api/src/controllers/users.ts:272:        sucursal_id: body.sucursalId ?? null,
apps/api/src/controllers/users.ts:274:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, created_at, updated_at')
apps/api/src/controllers/users.ts:353:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, created_at, updated_at')
apps/api/src/controllers/users.ts:404:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, created_at, updated_at')
apps/api/src/controllers/users.ts:463:      .select('id, tenant_id, sucursal_id, supplier_id, related_service_order_id, folio, status, reference, payment_terms, expected_date, subtotal, tax_amount, total, notes, created_at, updated_at')
apps/api/src/controllers/finance.ts:41:      .select('id, tenant_id, sucursal_id, final_cost, created_at, status')
apps/api/src/controllers/finance.ts:46:      .select('id, tenant_id, sucursal_id, balance, income, expense, created_at')
apps/api/src/controllers/finance.ts:75:      ? orders.filter((order) => String((order as { sucursal_id?: string | null }).sucursal_id ?? '') === sucursalId)
apps/api/src/controllers/finance.ts:78:      ? expenses.filter((expense) => String((expense as { sucursal_id?: string | null }).sucursal_id ?? '') === sucursalId)
apps/api/src/controllers/finance.ts:137:    const sucursalOrders = orders.filter((order) => String((order as { sucursal_id?: string | null }).sucursal_id ?? '') === sucursalId);
apps/api/src/controllers/finance.ts:138:    const sucursalExpenses = expenses.filter((expense) => String((expense as { sucursal_id?: string | null }).sucursal_id ?? '') === sucursalId);
apps/api/src/controllers/finance.ts:140:    const grouped = new Map<string, { id: string; tenant_id: string; sucursal_id: string; balance: number; income: number; expense: number; created_at: string }>();
apps/api/src/controllers/finance.ts:144:      const current = grouped.get(day) ?? { id: `${sucursalId}-${day}`, tenant_id: tenantId, sucursal_id: sucursalId, balance: 0, income: 0, expense: 0, created_at: day };
apps/api/src/controllers/finance.ts:153:      const current = grouped.get(day) ?? { id: `${sucursalId}-${day}`, tenant_id: tenantId, sucursal_id: sucursalId, balance: 0, income: 0, expense: 0, created_at: day };
apps/api/src/controllers/finance.ts:191:          sucursal_id: body.sucursalId,
apps/api/src/controllers/finance.ts:233:    if (data?.sucursal_id && !(await assertSucursalOwnership(supabase, tenantId, data.sucursal_id))) {
apps/api/src/controllers/finance.ts:238:    if (scope?.mode === 'branch' && (scope?.sucursalId ?? '') && data.sucursal_id !== scope.sucursalId) {
apps/api/src/controllers/finance.ts:259:      .select('id, sucursal_id')
apps/api/src/controllers/finance.ts:269:    if (scope?.mode === 'branch' && (scope?.sucursalId ?? '') && lookup.data.sucursal_id !== scope.sucursalId) {
apps/api/src/controllers/tasks.ts:118:      query = query.eq('sucursal_id', effectiveSucursalId);
apps/api/src/controllers/tasks.ts:171:      sucursal_id: resolvedSucursalId,
apps/api/src/controllers/tasks.ts:228:      payload.sucursal_id = resolvedSucursalId;
apps/api/src/controllers/procurement.ts:15:      .select('id, tenant_id, product_id, stock_current, sucursal_id, created_at')
apps/api/src/controllers/sucursales.ts:275:      .update({ sucursal_id: sucursalId })
apps/api/src/controllers/sucursales.ts:278:      .select('id, tenant_id, sucursal_id, full_name, email, role, is_active')
apps/api/src/services/stock-alerts.ts:6:  sucursal_id: string | null;
apps/api/src/services/stock-alerts.ts:37:    ? await baseQuery.is('sucursal_id', null).maybeSingle()
apps/api/src/services/stock-alerts.ts:38:    : await baseQuery.eq('sucursal_id', sucursalId).maybeSingle();
apps/api/src/services/stock-alerts.ts:51:      const { error } = sucursalId === null ? await deleteQuery.is('sucursal_id', null) : await deleteQuery.eq('sucursal_id', sucursalId);
apps/api/src/services/stock-alerts.ts:59:    sucursal_id: sucursalId,
apps/api/src/services/stock-alerts.ts:72:      .is('sucursal_id', sucursalId)
apps/api/src/services/stock-alerts.ts:88:    .select('id, tenant_id, sucursal_id, product_id, severity, acknowledged_by, acknowledged_at, created_at')
apps/api/src/services/stock-alerts.ts:92:    query = query.eq('sucursal_id', sucursalId.trim());

---

## 19. Legacy References

apps/api/src/controllers/users.ts.bak.20260603_093424:92:    sucursalId: row.sucursal_id ?? row.branch_id ?? null,
apps/api/src/controllers/users.ts.bak.20260603_093424:127:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at', { count: 'exact' })
apps/api/src/controllers/users.ts.bak.20260603_093424:236:          branch_id: body.sucursalId ?? null,
apps/api/src/controllers/users.ts.bak.20260603_093424:239:        .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
apps/api/src/controllers/users.ts.bak.20260603_093424:274:        branch_id: body.sucursalId ?? null,
apps/api/src/controllers/users.ts.bak.20260603_093424:276:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
apps/api/src/controllers/users.ts.bak.20260603_093424:355:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
apps/api/src/controllers/users.ts.bak.20260603_093424:406:      .select('id, tenant_id, auth_user_id, name, full_name, email, phone, role, activo, is_active, ultimo_acceso, last_login_at, sucursal_id, branch_id, created_at, updated_at')
supabase/migrations/20260603095001_drop_total_cost_from_service_orders.sql:1:-- Drop legacy total_cost after migrating all runtime consumers to final_cost.
supabase/migrations/20260603095001_drop_total_cost_from_service_orders.sql:5:-- 3) total_cost was backfilled to final_cost before this migration.
supabase/migrations/20260603095001_drop_total_cost_from_service_orders.sql:8:  drop constraint if exists service_orders_total_cost_check;
supabase/migrations/20260603095001_drop_total_cost_from_service_orders.sql:11:  drop column if exists total_cost;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:4:-- The old branch_id columns remain in place for compatibility during cutover.
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:6:create or replace function public._sync_sucursal_id_from_branch_id()
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:11:  if new.sucursal_id is null and new.branch_id is not null then
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:12:    new.sucursal_id := new.branch_id;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:13:  elsif new.branch_id is null and new.sucursal_id is not null then
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:14:    new.branch_id := new.sucursal_id;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:25:set sucursal_id = branch_id
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:27:  and branch_id is not null;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:44:for each row execute function public._sync_sucursal_id_from_branch_id();
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:51:set sucursal_id = branch_id
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:53:  and branch_id is not null;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:70:for each row execute function public._sync_sucursal_id_from_branch_id();
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:77:set sucursal_id = branch_id
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:79:  and branch_id is not null;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:96:for each row execute function public._sync_sucursal_id_from_branch_id();
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:103:set sucursal_id = branch_id
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:105:  and branch_id is not null;
supabase/migrations/20260528001652_migrate_branch_fks_to_sucursales.sql:122:for each row execute function public._sync_sucursal_id_from_branch_id();
supabase/migrations/20260515110000_restore_users_compat.sql:4:  branch_id uuid,
supabase/migrations/20260530120000_expand_users_admin_module.sql:5:  add column if not exists branch_id uuid,
supabase/migrations/20260530120000_expand_users_admin_module.sql:37:  if new.sucursal_id is null and new.branch_id is not null then
supabase/migrations/20260530120000_expand_users_admin_module.sql:38:    new.sucursal_id := new.branch_id;
supabase/migrations/20260530120000_expand_users_admin_module.sql:39:  elsif new.branch_id is null and new.sucursal_id is not null then
supabase/migrations/20260530120000_expand_users_admin_module.sql:40:    new.branch_id := new.sucursal_id;
supabase/migrations/20260527091000_cutover_branches_to_sucursales.sql:172:  i.branch_id,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:33:  branch_id uuid,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:94:  branch_id uuid,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:149:      order_sucursal_id := coalesce(new.sucursal_id, new.branch_id);
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:160:          branch_id,
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:5:-- and no client, job, or integration depends on branch_id or public.branches.
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:9:set sucursal_id = coalesce(sucursal_id, branch_id)
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:10:where sucursal_id is null and branch_id is not null;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:13:set sucursal_id = coalesce(sucursal_id, branch_id)
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:14:where sucursal_id is null and branch_id is not null;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:17:set sucursal_id = coalesce(sucursal_id, branch_id)
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:18:where sucursal_id is null and branch_id is not null;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:21:set sucursal_id = coalesce(sucursal_id, branch_id)
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:22:where sucursal_id is null and branch_id is not null;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:32:  drop constraint if exists service_orders_branch_id_fkey;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:35:  drop constraint if exists purchase_orders_branch_id_fkey;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:38:  drop constraint if exists inventory_movements_branch_id_fkey;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:41:  drop constraint if exists stock_alerts_branch_id_fkey;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:45:  drop column if exists branch_id;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:48:  drop column if exists branch_id;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:51:  drop column if exists branch_id;
supabase/migrations/20260528001842_drop_branch_compat_after_cutover.sql:54:  drop column if exists branch_id;
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:25:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:61:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260525012000_restore_inventory_purchase_products.sql:78:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:5:-- and no client, job, or integration depends on branch_id or public.branches.
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:24:  drop constraint if exists service_orders_branch_id_fkey;
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:27:  drop constraint if exists purchase_orders_branch_id_fkey;
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:30:  drop constraint if exists inventory_movements_branch_id_fkey;
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:33:  drop constraint if exists stock_alerts_branch_id_fkey;
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:37:  drop column if exists branch_id;
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:40:  drop column if exists branch_id;
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:43:  drop column if exists branch_id;
supabase/migrations/20260527095000_drop_branch_compat_after_cutover.sql:46:  drop column if exists branch_id;
supabase/migrations/20260527100000_migrate_users_branch_to_sucursal.sql:7:-- Sync data from branch_id to sucursal_id for local/dev databases
supabase/migrations/20260527100000_migrate_users_branch_to_sucursal.sql:9:set sucursal_id = branch_id
supabase/migrations/20260527100000_migrate_users_branch_to_sucursal.sql:11:  and branch_id is not null;
supabase/migrations/20260527100000_migrate_users_branch_to_sucursal.sql:13:-- Drop the old branch_id column from users if it exists
supabase/migrations/20260527100000_migrate_users_branch_to_sucursal.sql:15:  drop column if exists branch_id;
supabase/migrations/20260514133525_remote_schema.sql:420:alter table "public"."branch_inventory" drop constraint "branch_inventory_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:424:alter table "public"."customer_payments" drop constraint "customer_payments_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:430:alter table "public"."expenses" drop constraint "expenses_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:436:alter table "public"."file_assets" drop constraint "file_assets_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:441:alter table "public"."inventory_movements" drop constraint "inventory_movements_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:453:alter table "public"."purchase_orders" drop constraint "purchase_orders_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:464:alter table "public"."service_orders" drop constraint "service_orders_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:468:alter table "public"."service_requests" drop constraint "service_requests_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:471:alter table "public"."stock_alerts" drop constraint "stock_alerts_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:479:alter table "public"."tasks" drop constraint "tasks_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:485:alter table "public"."users" drop constraint "users_branch_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:532:drop index if exists "public"."service_orders_tenant_branch_idx";
supabase/migrations/20260514133525_remote_schema.sql:543:drop index if exists "public"."tasks_tenant_branch_idx";
supabase/migrations/20260514133525_remote_schema.sql:577:    "organization_id" uuid,
supabase/migrations/20260514133525_remote_schema.sql:593:alter table "public"."service_orders" drop column "branch_id";
supabase/migrations/20260514133525_remote_schema.sql:617:alter table "public"."service_orders" add column "total_cost" numeric(12,2) default 0;
supabase/migrations/20260514133525_remote_schema.sql:643:alter table "public"."profiles" add constraint "profiles_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES public.organizations(id) not valid;
supabase/migrations/20260514133525_remote_schema.sql:644:alter table "public"."profiles" validate constraint "profiles_organization_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:651:alter table "public"."service_orders" add constraint "service_orders_total_cost_check" CHECK ((total_cost >= (0)::numeric)) not valid;
supabase/migrations/20260514133525_remote_schema.sql:652:alter table "public"."service_orders" validate constraint "service_orders_total_cost_check";
supabase/migrations/20260514133525_remote_schema.sql:664:    so.total_cost,
supabase/migrations/20260514133525_remote_schema.sql:717:using ((tenant_id = ( SELECT profiles.organization_id
supabase/migrations/20260514133525_remote_schema.sql:725:using ((organization_id = ( SELECT profiles_1.organization_id
supabase/migrations/20260514133525_remote_schema.sql:733:using ((tenant_id = ( SELECT profiles.organization_id
supabase/migrations/20260424_baseline_schema.sql:45:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:76:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:98:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:125:create index if not exists service_orders_tenant_branch_idx
supabase/migrations/20260424_baseline_schema.sql:126:  on public.service_orders (tenant_id, branch_id);
supabase/migrations/20260424_baseline_schema.sql:158:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:172:create index if not exists tasks_tenant_branch_idx on public.tasks (tenant_id, branch_id);
supabase/migrations/20260424_baseline_schema.sql:233:  branch_id uuid not null references public.branches(id) on delete cascade,
supabase/migrations/20260424_baseline_schema.sql:239:  on public.branch_inventory (tenant_id, branch_id, product_id);
supabase/migrations/20260424_baseline_schema.sql:243:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:279:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:296:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:306:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:328:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:344:  branch_id uuid references public.branches(id) on delete set null,
supabase/migrations/20260528001442_cutover_branches_to_sucursales.sql:161:  i.branch_id,
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:51:  branch_id uuid,
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:62:create index if not exists inventory_tenant_branch_idx
supabase/migrations/20260523121919_align_orders_suppliers_reports_schema.sql:63:  on public.inventory (tenant_id, branch_id);
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:4:-- The old branch_id columns remain in place for compatibility during cutover.
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:6:create or replace function public._sync_sucursal_id_from_branch_id()
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:11:  if new.sucursal_id is null and new.branch_id is not null then
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:12:    new.sucursal_id := new.branch_id;
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:13:  elsif new.branch_id is null and new.sucursal_id is not null then
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:14:    new.branch_id := new.sucursal_id;
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:41:for each row execute function public._sync_sucursal_id_from_branch_id();
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:64:for each row execute function public._sync_sucursal_id_from_branch_id();
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:87:for each row execute function public._sync_sucursal_id_from_branch_id();
supabase/migrations/20260527093000_migrate_branch_fks_to_sucursales.sql:110:for each row execute function public._sync_sucursal_id_from_branch_id();
supabase/migrations/20260514120000_enable_rls_and_policies.sql:217:  and branch_id::text = auth.jwt() ->> 'sucursal_id'
supabase/migrations/20260514120000_enable_rls_and_policies.sql:226:  and branch_id::text = auth.jwt() ->> 'sucursal_id'
supabase/migrations/20260514120000_enable_rls_and_policies.sql:235:  and branch_id::text = auth.jwt() ->> 'sucursal_id'
supabase/migrations/20260514120000_enable_rls_and_policies.sql:240:  and branch_id::text = auth.jwt() ->> 'sucursal_id'
supabase/migrations/20260514120000_enable_rls_and_policies.sql:249:  and branch_id::text = auth.jwt() ->> 'sucursal_id'
supabase/migrations/20260514150000_add_tenant_onboarding.sql:5:  branch_id uuid,

---

## 20. Runtime Tables

apps/api/src/middleware/auth.ts:92:        .from('users')
apps/api/src/middleware/auth.ts:109:          .from('security_sessions')
apps/api/src/middleware/auth.ts:124:          .from('security_sessions')
apps/api/src/controllers/meta.ts:62:      .from('users')
apps/api/src/controllers/meta.ts:76:      .from('tenants')
apps/api/src/controllers/meta.ts:115:      .from('tenants')
apps/api/src/controllers/meta.ts:180:      .from('tenants')
apps/api/src/controllers/meta.ts:216:        .from('tenants')
apps/api/src/controllers/meta.ts:255:        .from('tenant_industry_profiles')
apps/api/src/controllers/meta.ts:288:          .from('tenant_enabled_modules')
apps/api/src/controllers/meta.ts:299:          .from('tenant_enabled_modules')
apps/api/src/controllers/meta.ts:324:        .from('tenant_label_overrides')
apps/api/src/controllers/meta.ts:334:          .from('tenant_label_overrides')
apps/api/src/controllers/meta.ts:365:          .from('tenant_workflow_statuses')
apps/api/src/controllers/meta.ts:376:          .from('tenant_workflow_statuses')
apps/api/src/controllers/meta.ts:414:          .from('tenant_field_definitions')
apps/api/src/controllers/meta.ts:425:          .from('tenant_field_definitions')
apps/api/src/controllers/meta.ts:463:          .from('tenant_semaphore_rules')
apps/api/src/controllers/meta.ts:474:          .from('tenant_semaphore_rules')
apps/api/src/controllers/auth.controller.ts:391:      .from('users')
apps/api/src/controllers/auth.controller.ts:409:      .from('tenants')
apps/api/src/controllers/auth.controller.ts:425:        .from('users')
apps/api/src/controllers/auth.controller.ts:450:      .from('users')
apps/api/src/controllers/auth.controller.ts:458:    const { error: sessionInsertError } = await supabaseAdmin.from('security_sessions').insert([{
apps/api/src/controllers/requests.ts:31:      .from('service_requests')
apps/api/src/controllers/requests.ts:66:      .from('service_requests')
apps/api/src/controllers/requests.ts:106:      .from('service_requests')
apps/api/src/controllers/requests.ts:119:        .from('customers')
apps/api/src/controllers/requests.ts:144:      .from('service_orders')
apps/api/src/controllers/requests.ts:174:      .from('service_requests')
apps/api/src/controllers/suppliers.ts:85:    .from('suppliers')
apps/api/src/controllers/suppliers.ts:161:      .from('suppliers')
apps/api/src/controllers/suppliers.ts:194:      .from('suppliers')
apps/api/src/controllers/suppliers.ts:260:      .from('suppliers')
apps/api/src/controllers/suppliers.ts:292:      .from('suppliers')
apps/api/src/controllers/suppliers.ts:338:      .from('suppliers')
apps/api/src/controllers/suppliers.ts:353:      .from('suppliers')
apps/api/src/controllers/suppliers.ts:398:      .from('suppliers')
apps/api/src/controllers/suppliers.ts:413:      .from('purchase_orders')
apps/api/src/controllers/suppliers.ts:443:      .from('suppliers')
apps/api/src/controllers/suppliers.ts:458:      .from('suppliers')
apps/api/src/controllers/reports.ts:17:    let ordersQuery = supabase.from('service_orders').select('id, status, created_at, final_cost, sucursal_id, promised_date, folio').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:18:    let customersQuery = supabase.from('customers').select('id').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:19:    let inventoryQuery = supabase.from('sucursal_inventory').select('id, stock_current, product_id, sucursal_id, products:product_id (id, cost)').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:20:    let financeQuery = supabase.from('finances').select('id, balance, income, expense, created_at, sucursal_id').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:21:    let requestsQuery = supabase.from('service_requests').select('id, balance_amount, status, created_at').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:22:    let usersQuery = supabase.from('users').select('id, full_name, role, sucursal_id').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/reports.ts:24:      .from('inventory_movements')
apps/api/src/controllers/purchase-orders.ts:58:    .from('sucursales')
apps/api/src/controllers/purchase-orders.ts:69:    .from('suppliers')
apps/api/src/controllers/purchase-orders.ts:80:    .from('products')
apps/api/src/controllers/purchase-orders.ts:97:    .from('products')
apps/api/src/controllers/purchase-orders.ts:112:    .from('products')
apps/api/src/controllers/purchase-orders.ts:141:    supabase.from('purchase_orders').select('*').eq('tenant_id', tenantId).eq('id', orderId).maybeSingle(),
apps/api/src/controllers/purchase-orders.ts:142:    supabase.from('purchase_order_items').select('*').eq('tenant_id', tenantId).eq('purchase_order_id', orderId).order('created_at', { ascending: true }),
apps/api/src/controllers/purchase-orders.ts:143:    supabase.from('inventory_movements').select('id, tenant_id, sucursal_id, product_id, purchase_order_id, movement_type, quantity, unit_cost, reference, notes, created_by, created_at').eq('tenant_id', tenantId).eq('purchase_order_id', orderId).order('created_at', { ascending: true }),
apps/api/src/controllers/purchase-orders.ts:160:      .from('purchase_orders')
apps/api/src/controllers/purchase-orders.ts:230:      .from('purchase_orders')
apps/api/src/controllers/purchase-orders.ts:272:    const { error: itemsError } = await supabase.from('purchase_order_items').insert(itemRows);
apps/api/src/controllers/purchase-orders.ts:296:    const { data: existing, error: existingError } = await supabase.from('purchase_orders').select('id').eq('tenant_id', tenantId).eq('id', orderId).maybeSingle();
apps/api/src/controllers/purchase-orders.ts:320:      .from('purchase_orders')
apps/api/src/controllers/purchase-orders.ts:346:    const { data: existing, error: existingError } = await supabase.from('purchase_orders').select('id').eq('tenant_id', tenantId).eq('id', orderId).maybeSingle();
apps/api/src/controllers/purchase-orders.ts:352:      .from('purchase_orders')
apps/api/src/controllers/purchase-orders.ts:377:    const { data: existing, error: existingError } = await supabase.from('purchase_orders').select('id').eq('tenant_id', tenantId).eq('id', orderId).maybeSingle();
apps/api/src/controllers/purchase-orders.ts:382:      .from('purchase_orders')
apps/api/src/controllers/purchase-orders.ts:404:    const { data: order, error: orderError } = await supabase.from('purchase_orders').select('*').eq('tenant_id', tenantId).eq('id', orderId).single();
apps/api/src/controllers/purchase-orders.ts:412:      .from('purchase_order_items')
apps/api/src/controllers/purchase-orders.ts:444:        .from('sucursal_inventory')
apps/api/src/controllers/purchase-orders.ts:455:          .from('sucursal_inventory')
apps/api/src/controllers/purchase-orders.ts:470:        .from('sucursal_inventory')
apps/api/src/controllers/purchase-orders.ts:495:        .from('purchase_order_items')
apps/api/src/controllers/purchase-orders.ts:506:      const { error: movementError } = await supabase.from('inventory_movements').insert(movementRows);
apps/api/src/controllers/purchase-orders.ts:511:      .from('purchase_orders')
apps/api/src/controllers/pwa.ts:32:      .from('pwa_push_subscriptions')
apps/api/src/controllers/pwa.ts:68:      .from('pwa_push_subscriptions')
apps/api/src/controllers/orders.ts:303:  const { error } = await supabase.from('service_order_documents').insert([row]);
apps/api/src/controllers/orders.ts:319:  const { error } = await supabase.from('service_order_events').insert([row]);
apps/api/src/controllers/orders.ts:327:    .from('tenants')
apps/api/src/controllers/orders.ts:512:      .from('service_orders')
apps/api/src/controllers/orders.ts:556:    const { error: checklistError } = await supabase.from('service_order_checklists').insert([
apps/api/src/controllers/orders.ts:578:      .from('service_orders')
apps/api/src/controllers/orders.ts:659:      .from('service_orders')
apps/api/src/controllers/orders.ts:708:      .from('service_orders')
apps/api/src/controllers/orders.ts:718:        .from('service_order_checklists')
apps/api/src/controllers/orders.ts:724:        .from('service_order_documents')
apps/api/src/controllers/orders.ts:730:        .from('service_order_events')
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
apps/api/src/controllers/orders.ts:1384:      .from('service_order_checklists')
apps/api/src/controllers/orders.ts:1423:      .from('service_orders')
apps/api/src/controllers/orders.ts:1438:      .from('service_order_checklists')
apps/api/src/controllers/orders.ts:1480:      .from('service_orders')
apps/api/src/controllers/orders.ts:1498:      .from('service_orders')
apps/api/src/controllers/orders.ts:1522:      .from('service_orders')
apps/api/src/controllers/security.ts:36:    .from('users')
apps/api/src/controllers/security.ts:49:    .from('sucursales')
apps/api/src/controllers/security.ts:71:      supabaseAdmin.from('users').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId),
apps/api/src/controllers/security.ts:72:      supabaseAdmin.from('sucursales').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId),
apps/api/src/controllers/security.ts:130:      .from('tenants')
apps/api/src/controllers/security.ts:157:      .from('users')
apps/api/src/controllers/security.ts:220:      .from('audit_logs')
apps/api/src/controllers/security.ts:275:      .from('security_sessions')
apps/api/src/controllers/security.ts:318:      .from('security_sessions')
apps/api/src/controllers/security.ts:366:      .from('tenants')
apps/api/src/controllers/security.ts:377:      .from('tenants')
apps/api/src/controllers/security.ts:386:      .from('security_sessions')
apps/api/src/controllers/security.ts:416:      .from('users')
apps/api/src/controllers/security.ts:434:      .from('users')
apps/api/src/controllers/security.ts:470:      .from('users')
apps/api/src/controllers/security.ts:490:      .from('users')
apps/api/src/controllers/security.ts:535:      .from('tenants')
apps/api/src/controllers/security.ts:545:      .from('tenants')
apps/api/src/controllers/catalogs.ts:38:    .from('products')
apps/api/src/controllers/catalogs.ts:53:    .from('products')
apps/api/src/controllers/catalogs.ts:88:    .from('sucursal_inventory')
apps/api/src/controllers/catalogs.ts:101:      .from('sucursal_inventory')
apps/api/src/controllers/catalogs.ts:116:    .from('sucursal_inventory')
apps/api/src/controllers/catalogs.ts:143:    .from('sucursales')
apps/api/src/controllers/catalogs.ts:163:      .from('customers')
apps/api/src/controllers/catalogs.ts:190:    const { data, error } = await supabase.from('customers').insert([{
apps/api/src/controllers/catalogs.ts:219:      .from('sucursal_inventory')
apps/api/src/controllers/catalogs.ts:235:      ? await supabase.from('products').select('id, sku, name, tenant_id').eq('tenant_id', tenantId).in('id', productIds)
apps/api/src/controllers/catalogs.ts:313:      .from('sucursal_inventory')
apps/api/src/controllers/catalogs.ts:348:      .from('products')
apps/api/src/controllers/catalogs.ts:359:      .from('sucursal_inventory')
apps/api/src/controllers/catalogs.ts:376:      const { error: movementError } = await supabase.from('inventory_movements').insert([{
apps/api/src/controllers/catalogs.ts:412:      .from('sucursal_inventory')
apps/api/src/controllers/catalogs.ts:435:      .from('products')
apps/api/src/controllers/catalogs.ts:446:      .from('inventory_movements')
apps/api/src/controllers/users.ts.bak.20260603_093424:48:    .from('sucursales')
apps/api/src/controllers/users.ts.bak.20260603_093424:63:    .from('tenants')
apps/api/src/controllers/users.ts.bak.20260603_093424:126:      .from('users')
apps/api/src/controllers/users.ts.bak.20260603_093424:215:      .from('users')
apps/api/src/controllers/users.ts.bak.20260603_093424:227:        .from('users')
apps/api/src/controllers/users.ts.bak.20260603_093424:263:      .from('users')
apps/api/src/controllers/users.ts.bak.20260603_093424:334:      .from('users')
apps/api/src/controllers/users.ts.bak.20260603_093424:349:      .from('users')
apps/api/src/controllers/users.ts.bak.20260603_093424:399:      .from('users')
apps/api/src/controllers/users.ts.bak.20260603_093424:449:      .from('users')
apps/api/src/controllers/users.ts.bak.20260603_093424:464:      .from('purchase_orders')
apps/api/src/controllers/users.ts:48:    .from('sucursales')
apps/api/src/controllers/users.ts:63:    .from('tenants')
apps/api/src/controllers/users.ts:126:      .from('users')
apps/api/src/controllers/users.ts:215:      .from('users')
apps/api/src/controllers/users.ts:227:        .from('users')
apps/api/src/controllers/users.ts:262:      .from('users')
apps/api/src/controllers/users.ts:332:      .from('users')
apps/api/src/controllers/users.ts:347:      .from('users')
apps/api/src/controllers/users.ts:397:      .from('users')
apps/api/src/controllers/users.ts:447:      .from('users')
apps/api/src/controllers/users.ts:462:      .from('purchase_orders')
apps/api/src/controllers/finance.ts:23:    .from('sucursales')
apps/api/src/controllers/finance.ts:40:      .from('service_orders')
apps/api/src/controllers/finance.ts:45:      .from('finances')
apps/api/src/controllers/finance.ts:187:      .from('finances')
apps/api/src/controllers/finance.ts:223:      .from('finances')
apps/api/src/controllers/finance.ts:258:      .from('finances')
apps/api/src/controllers/finance.ts:274:      .from('finances')
apps/api/src/controllers/tasks.ts:79:    .from('tasks')
apps/api/src/controllers/tasks.ts:95:  const { error } = await supabase.from('task_history').insert([{
apps/api/src/controllers/tasks.ts:115:    let query = supabase.from('tasks').select('*').eq('tenant_id', tenantId).order('created_at', { ascending: false }).limit(100);
apps/api/src/controllers/tasks.ts:136:      supabase.from('tasks').select('*').eq('tenant_id', tenantId).eq('id', taskId).maybeSingle(),
apps/api/src/controllers/tasks.ts:137:      supabase.from('task_history').select('*').eq('tenant_id', tenantId).eq('task_id', taskId).order('created_at', { ascending: false }),
apps/api/src/controllers/tasks.ts:169:    const { data, error } = await supabase.from('tasks').insert([{
apps/api/src/controllers/tasks.ts:237:    const { data, error } = await supabase.from('tasks').update(payload).eq('tenant_id', tenantId).eq('id', taskId).select('*').single();
apps/api/src/controllers/tasks.ts:268:    const { data: current, error: currentError } = await supabase.from('tasks').select('status').eq('tenant_id', tenantId).eq('id', taskId).single();
apps/api/src/controllers/tasks.ts:273:    const { data, error } = await supabase.from('tasks').update({ status: body.status, updated_by: null }).eq('tenant_id', tenantId).eq('id', taskId).select('*').single();
apps/api/src/controllers/tasks.ts:305:    const { error } = await supabase.from('tasks').delete().eq('tenant_id', tenantId).eq('id', taskId);
apps/api/src/controllers/tasks.ts:324:      .from('task_history')
apps/api/src/controllers/procurement.ts:14:      .from('sucursal_inventory')
apps/api/src/controllers/procurement.ts:27:      ? await supabase.from('products').select('id, sku, name').eq('tenant_id', tenantId).in('id', productIds)
apps/api/src/controllers/public.ts:98:    .from('tenants')
apps/api/src/controllers/public.ts:243:      .from('service_requests')
apps/api/src/controllers/public.ts:296:      .from('service_orders')
apps/api/src/controllers/public.ts:350:      .from('service_orders')
apps/api/src/controllers/public.ts:361:      .from('service_order_documents')
apps/api/src/controllers/public.ts:372:      .from('service_order_events')
apps/api/src/controllers/sucursales.ts:27:    .from('sucursales')
apps/api/src/controllers/sucursales.ts:42:    .from('sucursales')
apps/api/src/controllers/sucursales.ts:63:      .from('sucursales')
apps/api/src/controllers/sucursales.ts:121:      .from('sucursales')
apps/api/src/controllers/sucursales.ts:174:      .from('sucursales')
apps/api/src/controllers/sucursales.ts:218:      .from('sucursales')
apps/api/src/controllers/sucursales.ts:259:      .from('users')
apps/api/src/controllers/sucursales.ts:274:      .from('users')
apps/api/src/services/security-backoffice.ts:93:    .from('tenants')
apps/api/src/services/security-backoffice.ts:110:  const { error } = await supabaseAdmin.from('audit_logs').insert([{
apps/api/src/services/pwa-push.ts:35:    .from('pwa_push_subscriptions')
apps/api/src/services/pwa-push.ts:61:          .from('pwa_push_subscriptions')
apps/api/src/services/pwa-push.ts:68:  await supabaseAdmin.from('notification_events').insert([{
apps/api/src/services/tenant-config.ts:596:      .from('tenants')
apps/api/src/services/tenant-config.ts:601:      .from('tenant_industry_profiles')
apps/api/src/services/tenant-config.ts:606:      .from('tenant_enabled_modules')
apps/api/src/services/tenant-config.ts:612:      .from('tenant_label_overrides')
apps/api/src/services/tenant-config.ts:617:      .from('tenant_workflow_statuses')
apps/api/src/services/tenant-config.ts:624:      .from('tenant_field_definitions')
apps/api/src/services/tenant-config.ts:631:      .from('tenant_semaphore_rules')
apps/api/src/services/tenant-billing.ts:32:      .from('tenants')
apps/api/src/services/tenant-billing.ts:37:      .from('organizations')
apps/api/src/services/billing.ts:110:  const { error } = await supabaseAdmin.from('audit_logs').insert([{
apps/api/src/services/billing.ts:125:      .from('tenants')
apps/api/src/services/billing.ts:149:    .from('users')
apps/api/src/services/billing.ts:163:    .from('tenants')
apps/api/src/services/billing.ts:185:    .from('organizations')
apps/api/src/services/billing.ts:192:      .from('organizations')
apps/api/src/services/billing.ts:204:  const { error } = await supabaseAdmin.from('organizations').insert([{
apps/api/src/services/stock-alerts.ts:31:    .from('stock_alerts')
apps/api/src/services/stock-alerts.ts:47:        .from('stock_alerts')
apps/api/src/services/stock-alerts.ts:68:      .from('stock_alerts')
apps/api/src/services/stock-alerts.ts:79:  const { error } = await supabase.from('stock_alerts').insert([payload]);
apps/api/src/services/stock-alerts.ts:87:    .from('stock_alerts')
apps/api/src/services/stock-alerts.ts:104:    .from('stock_alerts')
===================================================
FIN AUDITORIA
===================================================
