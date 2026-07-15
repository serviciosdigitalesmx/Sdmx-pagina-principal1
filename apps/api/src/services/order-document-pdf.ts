import PDFDocument from 'pdfkit';
import { supabaseAdmin } from '@white-label/database';
import { loadTenantRuntimeConfig } from './tenant-config';

type JsonRecord = Record<string, unknown>;

export type TenantOrderDocumentProfile = {
  tenantId: string;
  tenantName: string;
  branchId: string | null;
  branchName: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  documentTitle: string;
  documentSubtitle: string;
  footerText: string | null;
  terms: string[];
  statusLabels: Record<string, string>;
};

export type OrderDocumentEvidence = {
  fileName: string;
  mimeType?: string | null;
  url?: string | null;
  buffer?: Buffer | null;
};

export type OrderDocumentChecklist = {
  screen_condition?: unknown;
  cosmetic_condition?: unknown;
  reported_physical_damage?: unknown;
  accessories_received?: unknown;
  accepted_at?: unknown;
  accepted_by_name?: unknown;
};

export type OrderDocumentData = Record<string, unknown> & {
  tenant_id?: unknown;
  sucursal_id?: unknown;
  folio?: unknown;
  status?: unknown;
  created_at?: unknown;
  promised_date?: unknown;
  device_info?: unknown;
  problem_description?: unknown;
  reported_issue?: unknown;
  serial_number?: unknown;
  estimated_cost?: unknown;
  final_cost?: unknown;
};

function asRecord(value: unknown): JsonRecord {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as JsonRecord : {};
}

function readText(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function readTextList(value: unknown) {
  if (Array.isArray(value)) {
    return value.map(readText).filter((entry): entry is string => Boolean(entry));
  }

  const text = readText(value);
  return text ? text.split('\n').map((entry) => entry.trim()).filter(Boolean) : [];
}

function normalizeColor(value: unknown, fallback: string) {
  const color = readText(value);
  return color && /^#[0-9a-f]{6}$/i.test(color) ? color : fallback;
}

function joinAddress(parts: unknown[]) {
  const values = parts.map(readText).filter((entry): entry is string => Boolean(entry));
  return values.length > 0 ? values.join(', ') : null;
}

function statusLabel(status: unknown, labels: Record<string, string>) {
  const key = readText(status)?.toLowerCase() ?? '';
  return labels[key] ?? readText(status) ?? '';
}

async function fetchBuffer(url: string | null | undefined) {
  if (!url) return null;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return Buffer.from(await response.arrayBuffer());
  } catch {
    return null;
  }
}

export async function resolveTenantOrderDocumentProfile(
  tenantId: string,
  sucursalId?: string | null,
): Promise<TenantOrderDocumentProfile> {
  const [tenantResult, runtimeConfig] = await Promise.all([
    supabaseAdmin
      .from('tenants')
      .select('id, name, contact_email, contact_phone, branding, landing_content')
      .eq('id', tenantId)
      .maybeSingle(),
    loadTenantRuntimeConfig(tenantId),
  ]);

  if (tenantResult.error || !tenantResult.data) {
    throw new Error(`Unable to resolve tenant document profile: ${tenantResult.error?.message ?? 'Tenant not found'}`);
  }

  let branch: JsonRecord | null = null;
  if (sucursalId) {
    const branchResult = await supabaseAdmin
      .from('sucursales')
      .select('id, tenant_id, name, address, city, state, phone')
      .eq('tenant_id', tenantId)
      .eq('id', sucursalId)
      .maybeSingle();

    if (branchResult.error) {
      throw new Error(`Unable to resolve tenant branch for document: ${branchResult.error.message}`);
    }

    branch = branchResult.data as JsonRecord | null;
  }

  const tenant = tenantResult.data as JsonRecord;
  const branding = asRecord(tenant.branding);
  const landingContent = asRecord(tenant.landing_content);
  const documentConfig = asRecord(runtimeConfig.templates.document);
  const branchAddress = branch
    ? joinAddress([branch.address, branch.city, branch.state])
    : null;

  return {
    tenantId,
    tenantName: readText(tenant.name) ?? '',
    branchId: readText(branch?.id) ?? null,
    branchName: readText(branch?.name) ?? null,
    phone: readText(branch?.phone) ?? readText(tenant.contact_phone),
    email: readText(tenant.contact_email),
    address: branchAddress ?? readText(landingContent.locationDescription),
    logoUrl: readText(branding.logoUrl),
    primaryColor: normalizeColor(branding.primaryColor, '#0066ff'),
    secondaryColor: normalizeColor(branding.secondaryColor, '#00a6a6'),
    documentTitle: readText(documentConfig.title) ?? 'Orden de servicio',
    documentSubtitle: readText(documentConfig.subtitle) ?? '',
    footerText: readText(documentConfig.footerText),
    terms: readTextList(documentConfig.terms),
    statusLabels: runtimeConfig.statusLabels,
  };
}

function createPdfBuffer(doc: InstanceType<typeof PDFDocument>) {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer | Uint8Array) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    doc.end();
  });
}

function formatDate(value: unknown, includeTime = false) {
  const text = readText(value);
  if (!text) return '';
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return '';
  return includeTime
    ? date.toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })
    : date.toLocaleDateString('es-MX', { dateStyle: 'medium' });
}

function readMoney(value: unknown) {
  if (value === null || value === undefined || value === '') return null;
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function initials(value: string) {
  const letters = value
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .join('')
    .slice(0, 3)
    .toUpperCase();
  return letters || 'FX';
}

function isImageEvidence(item: OrderDocumentEvidence) {
  const mimeType = readText(item.mimeType) ?? '';
  return Boolean(item.buffer) || mimeType.startsWith('image/') || /\.(png|jpe?g|webp|gif|bmp)$/i.test(item.fileName);
}

export async function renderServiceOrderPdf(params: {
  profile: TenantOrderDocumentProfile;
  order: OrderDocumentData;
  checklist?: OrderDocumentChecklist | null;
  evidence?: OrderDocumentEvidence[];
}) {
  const { profile, order } = params;
  const orderTenantId = readText(order.tenant_id);
  if (orderTenantId && orderTenantId !== profile.tenantId) {
    throw new Error('Tenant mismatch while rendering service order document');
  }

  const orderBranchId = readText(order.sucursal_id);
  if (orderBranchId && profile.branchId && orderBranchId !== profile.branchId) {
    throw new Error('Branch mismatch while rendering service order document');
  }

  const device = asRecord(order.device_info);
  const checklist = params.checklist ?? {};
  const logoBuffer = await fetchBuffer(profile.logoUrl);
  const imageEvidence: Array<OrderDocumentEvidence & { image: Buffer }> = [];

  for (const evidence of (params.evidence ?? []).filter(isImageEvidence)) {
    const image = evidence.buffer ?? await fetchBuffer(evidence.url);
    if (image) imageEvidence.push({ ...evidence, image });
  }

  const doc = new PDFDocument({ size: 'A4', margin: 0, autoFirstPage: true });
  doc.info.Title = `${profile.documentTitle} ${readText(order.folio) ?? ''}`.trim();
  doc.info.Author = profile.tenantName;
  doc.info.Subject = 'Orden de servicio';

  const ink = '#101827';
  const muted = '#64748b';
  const border = '#dbe4ee';
  const surface = '#f8fafc';
  const pageLeft = 28;
  const pageWidth = 539;

  const drawSection = (x: number, y: number, width: number, height: number, title: string, accent = profile.primaryColor) => {
    doc.roundedRect(x, y, width, height, 9).fillAndStroke('#ffffff', border);
    doc.roundedRect(x, y, width, 24, 9).fill(accent);
    doc.rect(x, y + 12, width, 12).fill(accent);
    doc.font('Helvetica-Bold').fontSize(8.7).fillColor('#ffffff').text(title, x + 11, y + 8, {
      width: width - 22,
      characterSpacing: 0.35,
    });
  };

  const drawField = (label: string, value: string | null, x: number, y: number, width: number, options?: { height?: number }) => {
    const labelWidth = Math.min(84, Math.max(46, doc.widthOfString(label) + 8));
    doc.font('Helvetica-Bold').fontSize(7.8).fillColor(muted).text(label, x, y, { width: labelWidth });
    doc.moveTo(x + labelWidth, y + 10).lineTo(x + width, y + 10).strokeColor(border).lineWidth(0.7).stroke();
    doc.font('Helvetica').fontSize(8.6).fillColor(ink).text(value ?? '', x + labelWidth + 4, y - 1, {
      width: Math.max(20, width - labelWidth - 4),
      height: options?.height ?? 13,
      ellipsis: true,
    });
  };

  const drawRuledText = (value: string | null, x: number, y: number, width: number, height: number) => {
    if (value) {
      doc.font('Helvetica').fontSize(8.6).fillColor(ink).text(value, x, y, { width, height, lineGap: 2, ellipsis: true });
      return;
    }

    for (let lineY = y + 15; lineY <= y + height; lineY += 15) {
      doc.moveTo(x, lineY).lineTo(x + width, lineY).strokeColor('#e5ebf2').lineWidth(0.6).stroke();
    }
  };

  const tenantName = profile.tenantName;
  const customerName = readText(device.customer_name);
  const customerPhone = readText(device.customer_phone);
  const customerEmail = readText(device.customer_email);
  const deviceType = readText(order.device_type) ?? readText(device.type);
  const brand = readText(order.device_brand) ?? readText(device.brand);
  const model = readText(order.device_model) ?? readText(device.model);
  const brandModel = [...new Set([brand, model].filter((entry): entry is string => Boolean(entry)))].join(' / ');
  const serialNumber = readText(order.serial_number) ?? readText(device.serial_number);
  const accessories = readText(checklist.accessories_received);
  const issue = readText(order.problem_description) ?? readText(order.reported_issue);
  const orderStatus = statusLabel(order.status, profile.statusLabels);
  const acceptedBy = readText(checklist.accepted_by_name);
  const acceptedAt = formatDate(checklist.accepted_at);
  const observations = [
    readText(checklist.screen_condition) ? `Pantalla: ${readText(checklist.screen_condition)}` : null,
    readText(checklist.cosmetic_condition) ? `Condición: ${readText(checklist.cosmetic_condition)}` : null,
    readText(checklist.reported_physical_damage) ? `Daño reportado: ${readText(checklist.reported_physical_damage)}` : null,
  ].filter((entry): entry is string => Boolean(entry)).join('\n');
  const estimatedCost = readMoney(order.estimated_cost);
  const finalCost = readMoney(order.final_cost);
  const contactParts = [profile.phone, profile.email, profile.address].filter((entry): entry is string => Boolean(entry));

  doc.rect(0, 0, 595.28, 841.89).fill('#ffffff');
  doc.roundedRect(pageLeft, 28, pageWidth, 99, 16).fill(ink);
  doc.roundedRect(pageLeft, 28, 10, 99, 10).fill(profile.primaryColor);
  doc.rect(pageLeft + 5, 28, 5, 99).fill(profile.primaryColor);
  doc.roundedRect(pageLeft + 18, 44, 66, 66, 14).fill('#ffffff');

  if (logoBuffer) {
    try {
      doc.image(logoBuffer, pageLeft + 25, 51, { fit: [52, 52], align: 'center', valign: 'center' });
    } catch {
      doc.font('Helvetica-Bold').fontSize(18).fillColor(profile.primaryColor).text(initials(tenantName), pageLeft + 25, 70, { width: 52, align: 'center' });
    }
  } else {
    doc.font('Helvetica-Bold').fontSize(18).fillColor(profile.primaryColor).text(initials(tenantName), pageLeft + 25, 70, { width: 52, align: 'center' });
  }

  doc.font('Helvetica-Bold').fontSize(16).fillColor('#ffffff').text(tenantName, pageLeft + 98, 49, { width: 232, height: 24, ellipsis: true });
  doc.font('Helvetica').fontSize(8.5).fillColor('#cbd5e1').text(profile.documentSubtitle, pageLeft + 98, 77, { width: 225, height: 26, ellipsis: true });
  if (profile.branchName) {
    doc.font('Helvetica-Bold').fontSize(8).fillColor(profile.secondaryColor).text(profile.branchName.toUpperCase(), pageLeft + 98, 104, { width: 225, ellipsis: true });
  }

  doc.moveTo(365, 44).lineTo(365, 110).strokeColor('#334155').lineWidth(1).stroke();
  doc.font('Helvetica-Bold').fontSize(16).fillColor('#ffffff').text(profile.documentTitle.toUpperCase(), 380, 45, { width: 166, align: 'right', height: 35, ellipsis: true });
  doc.font('Helvetica-Bold').fontSize(10).fillColor(profile.secondaryColor).text(readText(order.folio) ?? '', 380, 84, { width: 166, align: 'right' });
  doc.font('Helvetica').fontSize(8).fillColor('#cbd5e1').text(formatDate(order.created_at, true), 380, 102, { width: 166, align: 'right' });

  doc.roundedRect(pageLeft, 135, pageWidth, 29, 7).fill(surface);
  doc.font('Helvetica').fontSize(7.6).fillColor(muted).text(contactParts.join('  |  '), pageLeft + 12, 145, { width: pageWidth - 24, align: 'center', height: 10, ellipsis: true });

  const gap = 10;
  const half = (pageWidth - gap) / 2;
  drawSection(pageLeft, 174, half, 111, '1. DATOS DEL CLIENTE');
  drawField('Nombre:', customerName, pageLeft + 12, 207, half - 24);
  drawField('Teléfono:', customerPhone, pageLeft + 12, 230, half - 24);
  drawField('Correo:', customerEmail, pageLeft + 12, 253, half - 24);

  const rightX = pageLeft + half + gap;
  drawSection(rightX, 174, half, 111, '2. DATOS DEL EQUIPO', ink);
  drawField('Tipo:', deviceType, rightX + 12, 203, half - 24);
  drawField('Marca / modelo:', brandModel || null, rightX + 12, 224, half - 24);
  drawField('Serie / IMEI:', serialNumber, rightX + 12, 245, half - 24);
  drawField('Accesorios:', accessories, rightX + 12, 266, half - 24);

  drawSection(pageLeft, 295, pageWidth, 74, '3. DESCRIPCIÓN DE LA FALLA');
  drawRuledText(issue, pageLeft + 12, 329, pageWidth - 24, 27);

  drawSection(pageLeft, 379, half, 81, '4. DIAGNÓSTICO TÉCNICO', ink);
  drawRuledText(null, pageLeft + 12, 411, half - 24, 35);
  drawSection(rightX, 379, half, 81, '5. ESTADO DEL SERVICIO');
  drawField('Estado:', orderStatus || null, rightX + 12, 414, half - 24);
  drawField('Fecha promesa:', formatDate(order.promised_date) || null, rightX + 12, 437, half - 24);

  drawSection(pageLeft, 470, half, 90, '6. COSTOS REGISTRADOS');
  if (estimatedCost !== null && finalCost !== null && estimatedCost !== finalCost) {
    drawField('Estimado:', formatMoney(estimatedCost), pageLeft + 12, 505, half - 24);
    drawField('Final:', formatMoney(finalCost), pageLeft + 12, 530, half - 24);
  } else {
    const recordedCost = finalCost ?? estimatedCost;
    drawField('Total:', recordedCost === null ? null : formatMoney(recordedCost), pageLeft + 12, 518, half - 24);
  }
  drawSection(rightX, 470, half, 90, '7. OBSERVACIONES', ink);
  drawRuledText(observations || null, rightX + 12, 504, half - 24, 42);

  drawSection(pageLeft, 570, pageWidth, 76, '8. CONDICIONES DEL SERVICIO');
  if (profile.terms.length > 0) {
    doc.font('Helvetica').fontSize(7.8).fillColor(ink).text(
      profile.terms.map((term) => `• ${term}`).join('\n'),
      pageLeft + 12,
      603,
      { width: pageWidth - 24, height: 33, columns: profile.terms.length > 3 ? 2 : 1, columnGap: 18, lineGap: 2, ellipsis: true },
    );
  } else {
    drawRuledText(null, pageLeft + 12, 602, pageWidth - 24, 31);
  }

  drawSection(pageLeft, 656, half, 91, 'FIRMA / ACEPTACIÓN DEL CLIENTE');
  drawRuledText(null, pageLeft + 12, 688, half - 24, 20);
  drawField('Nombre:', acceptedBy, pageLeft + 12, 713, half - 24);
  drawField('Fecha:', acceptedAt || null, pageLeft + 12, 733, half - 24);
  drawSection(rightX, 656, half, 91, 'FIRMA DEL TÉCNICO', ink);
  drawRuledText(null, rightX + 12, 688, half - 24, 20);
  drawField('Nombre:', null, rightX + 12, 713, half - 24);
  drawField('Fecha:', null, rightX + 12, 733, half - 24);

  doc.roundedRect(pageLeft, 757, pageWidth, 55, 12).fill(ink);
  doc.roundedRect(pageLeft, 757, 8, 55, 8).fill(profile.secondaryColor);
  doc.rect(pageLeft + 4, 757, 4, 55).fill(profile.secondaryColor);
  doc.font('Helvetica-Bold').fontSize(12).fillColor('#ffffff').text('GRACIAS POR SU CONFIANZA', pageLeft + 24, 772, { width: 230 });
  doc.font('Helvetica').fontSize(7.8).fillColor('#cbd5e1').text(profile.footerText ?? tenantName, 280, 769, { width: 260, align: 'right', height: 25, ellipsis: true });
  doc.font('Helvetica').fontSize(7).fillColor('#94a3b8').text(readText(order.folio) ?? '', 280, 795, { width: 260, align: 'right' });

  for (let pageIndex = 0; pageIndex < imageEvidence.length; pageIndex += 4) {
    const pageEvidence = imageEvidence.slice(pageIndex, pageIndex + 4);
    doc.addPage({ size: 'A4', margin: 0 });
    doc.rect(0, 0, 595.28, 841.89).fill('#ffffff');
    doc.roundedRect(pageLeft, 28, pageWidth, 74, 14).fill(ink);
    doc.roundedRect(pageLeft, 28, 9, 74, 9).fill(profile.primaryColor);
    doc.rect(pageLeft + 4, 28, 5, 74).fill(profile.primaryColor);
    doc.font('Helvetica-Bold').fontSize(16).fillColor('#ffffff').text('EVIDENCIA DE LA ORDEN', pageLeft + 24, 49, { width: 320 });
    doc.font('Helvetica-Bold').fontSize(10).fillColor(profile.secondaryColor).text(readText(order.folio) ?? '', 390, 52, { width: 150, align: 'right' });
    doc.font('Helvetica').fontSize(8).fillColor('#cbd5e1').text(tenantName, 390, 73, { width: 150, align: 'right' });

    const boxes = [
      { x: pageLeft, y: 124 },
      { x: rightX, y: 124 },
      { x: pageLeft, y: 442 },
      { x: rightX, y: 442 },
    ];

    pageEvidence.forEach((evidence, index) => {
      const box = boxes[index];
      doc.roundedRect(box.x, box.y, half, 297, 10).fillAndStroke(surface, border);
      try {
        doc.image(evidence.image, box.x + 10, box.y + 10, {
          fit: [half - 20, 250],
          align: 'center',
          valign: 'center',
        });
      } catch {
        return;
      }
      doc.font('Helvetica').fontSize(8).fillColor(ink).text(evidence.fileName, box.x + 10, box.y + 270, { width: half - 20, align: 'center', height: 14, ellipsis: true });
    });

    doc.font('Helvetica').fontSize(7).fillColor(muted).text(
      `Página de evidencia ${Math.floor(pageIndex / 4) + 1}`,
      pageLeft,
      807,
      { width: pageWidth, align: 'center' },
    );
  }

  return await createPdfBuffer(doc);
}
