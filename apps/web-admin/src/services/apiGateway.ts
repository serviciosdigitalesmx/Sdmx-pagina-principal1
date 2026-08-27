type JsonRecord = Record<string, unknown>;

type ApiMeta = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

type AutomationRule = {
  id: string;
  name: string;
  event_type: string;
  action_type: string;
  is_active: boolean;
  condition: unknown;
  action_config: unknown;
};

type AutomationLog = {
  id: string;
  event_type: string;
  status: string;
  error_message: string | null;
  created_at: string;
  rule?: AutomationRule;
};

type ProcurementSuggestion = {
  product_id: string;
  sku: string;
  name: string;
  current_stock: number;
  pending_reservations: number;
  minimum_stock: number;
  suggested_quantity: number;
};

type PublicOrderResponse = JsonRecord & {
  authorization?: JsonRecord;
  order?: JsonRecord & {
    device_info?: JsonRecord & {
      customer_name?: string;
      customer_phone?: string;
    };
  };
  initPoint?: string;
};

export type CatalogFamily = { id: string; name: string; description?: string | null };
export type CatalogBrand = { id: string; family_id: string; name: string; logo_url?: string | null };
export type CatalogModel = { id: string; brand_id: string; name: string; reference_image_url?: string | null; catalog_brands?: { name?: string | null } | null };
export type CatalogFault = { id: string; model_id: string; name: string; description?: string | null; default_cost?: number | null };
export type OmniSearchCustomer = { id: string; name: string; phone?: string | null; email?: string | null };
export type OmniSearchOrder = { id: string; folio: string; status: string; serial_number?: string | null; created_at?: string | null };
export type OmniSearchResult = {
  customers: OmniSearchCustomer[];
  orders: OmniSearchOrder[];
  catalogs: CatalogModel[];
};

type ApiListResponse<T> = {
  success: true;
  data: T;
  meta?: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

type ApiSingleResponse<T> = {
  success: true;
  data: T;
};

type ApiErrorResponse = {
  error?: string;
  details?: unknown;
};

type EncodedFilePayload = {
  fileName: string;
  mimeType: string;
  base64: string;
  fileType: 'intake_photo' | 'attachment_pdf';
};

type LandingServicePayload = {
  title: string;
  description: string;
};

type SocialLinkPayload = {
  label: string;
  href: string;
};

type FieldDefinitionPayload = {
  id?: string;
  tenant_id?: string;
  entity: string;
  field_key: string;
  field_label: string;
  field_type: "text" | "textarea" | "number" | "select" | "boolean" | "date" | "money";
  required?: boolean;
  options?: unknown[];
  field_order?: number;
  placeholder?: string | null;
  help_text?: string | null;
  visible?: boolean;
  validation?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
};

type BrandingAssetType = 'logo' | 'favicon' | 'heroImage' | 'coverImage';

type SemaphoreRulePayload = {
  id?: string;
  tenant_id?: string;
  industry_key?: string | null;
  workflow_key?: string | null;
  status_key: string;
  metric: string;
  green_until_minutes?: number | null;
  yellow_until_minutes?: number | null;
  red_after_minutes?: number | null;
  priority?: number | null;
  reason_template?: string | null;
  suggested_action_template?: string | null;
  action_key?: string | null;
  enabled?: boolean;
  metadata?: Record<string, unknown>;
};

type WhatsAppTemplatePayload = {
  event_key: string;
  label: string;
  template: string;
  enabled: boolean;
  variables: string[];
  fallback_template: string;
};

type ServiceRequestPayload = {
  id?: string;
  tenant_id?: string;
  folio?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string | null;
  device_type?: string | null;
  device_model?: string | null;
  issue_description?: string | null;
  metadata?: Record<string, unknown>;
  status?: string;
  quoted_total?: number;
  deposit_amount?: number;
  balance_amount?: number;
  solicitud_origen_ip?: string | null;
  created_at?: string;
  updated_at?: string;
  normalized_status?: string;
};

type TenantLandingSettings = {
  availableIndustries?: Array<{
    key: string;
    label: string;
    description: string;
    defaultWorkflowKey: string;
    modules: string[];
  }>;
  tenant: {
    id: string;
    slug: string;
    name: string;
    contact_name?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    branding?: Record<string, unknown> | null;
    landing_content?: Record<string, unknown> | null;
    operational_settings?: Record<string, unknown> | null;
    industry_profile?: Record<string, unknown> | null;
    enabled_modules?: Array<Record<string, unknown>>;
    label_overrides?: Array<Record<string, unknown>>;
    workflow_statuses?: Array<Record<string, unknown>>;
    field_definitions?: FieldDefinitionPayload[];
    semaphore_rules?: SemaphoreRulePayload[];
    templates?: {
      whatsapp?: WhatsAppTemplatePayload[];
      landing?: Record<string, unknown>;
      portal?: Record<string, unknown>;
      document?: Record<string, unknown>;
    };
    labels?: Record<string, string>;
    status_options?: Record<string, Array<{ key: string; label: string; tone?: string | null; isDefault?: boolean; isTerminal?: boolean }>>;
    status_labels?: Record<string, string>;
    active_modules?: string[];
    capabilities?: {
      plan_key: 'basic' | 'pro' | 'scale';
      access_status: 'active' | 'trial' | 'billing_exempt' | 'master' | 'blocked';
      active_modules: string[];
      locked_modules: string[];
      limits: {
        users: number | null;
        sucursales: number | null;
        monthly_orders: number | null;
        storage_mb: number | null;
        public_portal: boolean;
        whatsapp_templates: number | null;
        document_templates: number | null;
      };
      reasons: string[];
    };
    trial_expires_at?: string | null;
    billing_exempt?: boolean | null;
    updated_at?: string;
  };
  config?: {
    industryProfile?: Record<string, unknown> | null;
    enabledModules?: Array<Record<string, unknown>>;
    labelOverrides?: Array<Record<string, unknown>>;
    workflowStatuses?: Array<Record<string, unknown>>;
    fieldDefinitions?: FieldDefinitionPayload[];
    semaphoreRules?: SemaphoreRulePayload[];
    templates?: {
      whatsapp?: WhatsAppTemplatePayload[];
      landing?: Record<string, unknown>;
      portal?: Record<string, unknown>;
      document?: Record<string, unknown>;
    };
    labels?: Record<string, string>;
    statusOptions?: Record<string, Array<{ key: string; label: string; tone?: string | null; isDefault?: boolean; isTerminal?: boolean }>>;
    statusLabels?: Record<string, string>;
    activeModules?: string[];
    capabilities?: {
      plan_key: 'basic' | 'pro' | 'scale';
      access_status: 'active' | 'trial' | 'billing_exempt' | 'master' | 'blocked';
      active_modules: string[];
      locked_modules: string[];
      limits: {
        users: number | null;
        sucursales: number | null;
        monthly_orders: number | null;
        storage_mb: number | null;
        public_portal: boolean;
        whatsapp_templates: number | null;
        document_templates: number | null;
      };
      reasons: string[];
    };
  };
  billing?: {
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
};

type TaskPayload = {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  sucursalId?: string;
  serviceOrderId?: string;
  serviceRequestId?: string;
  assignedUserId?: string;
  dueDate?: string;
};

type PurchaseOrderItemPayload = {
  productId?: string;
  skuSnapshot?: string;
  productNameSnapshot?: string;
  quantity: number;
  unitCost: number;
};

type PurchaseOrderPayload = {
  supplierId: string;
  sucursalId?: string;
  expectedDate?: string;
  notes?: string;
  paymentTerms?: string;
  reference?: string;
  items: PurchaseOrderItemPayload[];
};

type SupplierStatus = 'active' | 'inactive';

type SupplierQueryParams = {
  page?: number;
  pageSize?: number;
  q?: string;
  name?: string;
  rfc?: string;
  status?: SupplierStatus | 'all';
};

type UserRole = 'admin' | 'operador' | 'tecnico' | 'cliente' | 'compras';

type AuditLogRecord = {
  id: string;
  tenant_id: string;
  user_id: string | null;
  action: string;
  ip_address: string | null;
  user_agent: string | null;
  data_before: JsonRecord | null;
  data_after: JsonRecord | null;
  created_at: string;
};

type SecuritySessionRecord = {
  id: string;
  userId: string;
  sessionKey: string;
  ipAddress: string | null;
  userAgent: string | null;
  lastActivityAt: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    full_name?: string;
    email: string;
    role: string;
  } | null;
};

type UserQueryParams = {
  page?: number;
  pageSize?: number;
  q?: string;
  role?: string;
  status?: 'active' | 'inactive' | 'all';
};

type AdminUserRecord = {
  id: string;
  tenantId: string;
  authUserId: string | null;
  name: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: UserRole | string;
  displayRole?: string | null;
  effectiveRole?: string | null;
  activo: boolean;
  is_active: boolean;
  ultimo_acceso: string | null;
  last_login_at: string | null;
  sucursalId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

import { readAuthToken } from "@/lib/auth-storage";
import { clearAuthToken } from "@/lib/auth-storage";
import { getCurrentSession } from "@/lib/session";
import { getPlatformScope } from "@/lib/scope";
import { enqueueOfflineRequest } from "@/lib/pwa/offline-queue";
import { resolveAdminApiBaseUrl } from "@/lib/api-base-url";

class ApiGateway {
  private get apiUrl() {
    return resolveAdminApiBaseUrl();
  }

  private apiPath(path: string) {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `/api${normalizedPath}`;
  }

  private get scope() {
    const scope = getPlatformScope();

    if (!scope?.tenantSlug || !scope?.tenantId) {
      throw new Error("Scope inválido: tenant ausente");
    }

    return scope;
  }

  private get tenantSlug() {
    return this.scope.tenantSlug;
  }

  private get tenantId() {
    return this.scope.tenantId;
  }

  private getToken(): string {
    if (typeof window === 'undefined') {
      return '';
    }
    return readAuthToken() || '';
  }

  private getSucursalId() {
    return this.scope.branchId ?? '';
  }

  private getScopeHeaders() {
    const sucursalId = this.getSucursalId();
    return sucursalId
      ? {
          'x-fixi-sucursal-id': sucursalId,
          'x-sucursal-id': sucursalId,
        }
      : null;
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = this.getToken();

    if (!token) {
      throw new Error('No hay sesión activa. Vuelve a iniciar sesión.');
    }

    const method = String(init.method ?? 'GET').toUpperCase();
    const isMutation = !['GET', 'HEAD', 'OPTIONS'].includes(method);
    const body = typeof init.body === 'string' ? init.body : null;

    if (typeof navigator !== 'undefined' && !navigator.onLine && isMutation) {
      if (path.includes('/api/cash/sales') || path.includes('/api/cash/shifts/close')) {
        throw new Error('Sin conexión: Esta acción financiera crítica requiere internet.');
      }
      
      const session = getCurrentSession();
      await enqueueOfflineRequest({
        tenantId: session?.tenantId ?? this.tenantId,
        url: `${this.apiUrl}${path}`,
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });
      throw new Error('Acción guardada sin conexión. Se sincronizará al reconectar.');
    }

    let response: Response;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
      const headers = new Headers(init.headers);
      if (!(init.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
      }
      headers.set('Authorization', `Bearer ${token}`);

      const scopeHeaders = this.getScopeHeaders();
      if (scopeHeaders) {
        headers.set('x-fixi-sucursal-id', scopeHeaders['x-fixi-sucursal-id']);
        headers.set('x-sucursal-id', scopeHeaders['x-sucursal-id']);
      }

      response = await fetch(`${this.apiUrl}${path}`, {
        ...init,
        headers,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new Error('La petición ha tardado demasiado (Timeout)');
      }
      // network or fetch-level error
      throw new Error(`Network error: ${err instanceof Error ? err.message : String(err)}`);
    }

    if (!response.ok) {
      const payload = await response.json().catch(() => ({} as ApiErrorResponse));
      // prefer structured payload messages when available
      const message =
        (payload && typeof payload.message === 'string' && payload.message) ||
        (payload && typeof payload.error === 'string' && payload.error) ||
        `HTTP ${response.status}`;
      const details = (payload as ApiErrorResponse).details ? ` - ${JSON.stringify((payload as ApiErrorResponse).details)}` : '';

      if (
        response.status === 401 &&
        /invalid token signature|token expired|session revoked|missing or invalid authorization header|unauthorized/i.test(message)
      ) {
        clearAuthToken();
        if (typeof window !== 'undefined') {
          window.location.replace('/login');
        }
      }

      if (response.status === 403 && /limit exceeded/i.test(message)) {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('plan_limit_exceeded', { detail: payload.details }));
        }
      }

      throw new Error(`${message}${details}`);
    }

    return response.json() as Promise<T>;
  }

  /** Public request — no auth token required. For customer portal endpoints. */
  private async publicRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
    const headers = new Headers(init.headers);
    headers.set('Content-Type', 'application/json');

    const response = await fetch(`${this.apiUrl}${path}`, {
      ...init,
      headers,
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({} as ApiErrorResponse));
      const message =
        (payload && typeof payload.message === 'string' && payload.message) ||
        (payload && typeof payload.error === 'string' && payload.error) ||
        `HTTP ${response.status}`;
      throw new Error(message);
    }

    return response.json() as Promise<T>;
  }

  private normalizeCustomerRow(row: JsonRecord): JsonRecord {
    return {
      ...row,
      name: String(row.name ?? row.full_name ?? ''),
      full_name: String(row.full_name ?? row.name ?? ''),
      phone: typeof row.phone === 'string' ? row.phone : '',
      email: typeof row.email === 'string' ? row.email : '',
    };
  }

  private normalizeServiceRequestRow(row: JsonRecord): ServiceRequestPayload {
    const normalizedStatus = String(
      row.normalized_status ??
      row.status ??
      'pendiente'
    ).trim().toLowerCase();

    return {
      ...row,
      normalized_status: normalizedStatus,
      customer_name: String(row.customer_name ?? ''),
      customer_phone: typeof row.customer_phone === 'string' ? row.customer_phone : '',
      customer_email: typeof row.customer_email === 'string' ? row.customer_email : null,
      device_type: typeof row.device_type === 'string' ? row.device_type : null,
      device_model: typeof row.device_model === 'string' ? row.device_model : null,
      issue_description: typeof row.issue_description === 'string' ? row.issue_description : null,
      metadata: (row.metadata as Record<string, unknown> | undefined) ?? undefined,
      status: typeof row.status === 'string' ? row.status : normalizedStatus,
      quoted_total: Number(row.quoted_total ?? 0),
      deposit_amount: Number(row.deposit_amount ?? 0),
      balance_amount: Number(row.balance_amount ?? 0),
    };
  }

  private normalizeOrderRow(row: JsonRecord): JsonRecord {
    const deviceInfo = (row.device_info as Record<string, unknown> | undefined) ?? {};
    const deviceModel = String(
      row.device_model ??
      deviceInfo.model ??
      deviceInfo.brand ??
      ''
    );
    const deviceType = String(
      row.device_type ??
      deviceInfo.type ??
      ''
    );

    return {
      ...row,
      device_model: deviceModel,
      device_type: deviceType,
      device_info: {
        ...(deviceInfo ?? {}),
        model: String(deviceInfo.model ?? deviceModel ?? ''),
        brand: String(deviceInfo.brand ?? ''),
        type: String(deviceInfo.type ?? deviceType ?? ''),
        customer_name: String(deviceInfo.customer_name ?? row.clientName ?? row.customer_name ?? ''),
        customer_phone: String(deviceInfo.customer_phone ?? row.clientPhone ?? row.customer_phone ?? ''),
        customer_email: String(deviceInfo.customer_email ?? row.clientEmail ?? row.customer_email ?? ''),
      },
      estimated_cost: Number(row.estimated_cost ?? 0),
      final_cost: Number(row.final_cost ?? 0),
      status: String(row.status ?? 'recibido'),
    };
  }

  private normalizeSupplierRow(row: JsonRecord): JsonRecord {
    return {
      ...row,
      id: String(row.id ?? ''),
      business_name: String(row.business_name ?? row.nombre ?? row.legal_name ?? ''),
      nombre: String(row.nombre ?? row.business_name ?? row.legal_name ?? ''),
      rfc: typeof row.rfc === 'string' ? row.rfc : null,
      legal_name: typeof row.legal_name === 'string' ? row.legal_name : null,
      contact_name: typeof row.contact_name === 'string' ? row.contact_name : null,
      phone: typeof row.phone === 'string' ? row.phone : null,
      telefono: typeof row.telefono === 'string' ? row.telefono : null,
      whatsapp: typeof row.whatsapp === 'string' ? row.whatsapp : null,
      email: typeof row.email === 'string' ? row.email : null,
      address: typeof row.address === 'string' ? row.address : null,
      direccion: typeof row.direccion === 'string' ? row.direccion : null,
      city: typeof row.city === 'string' ? row.city : null,
      state: typeof row.state === 'string' ? row.state : null,
      categories: typeof row.categories === 'string' ? row.categories : null,
      lead_time_days: typeof row.lead_time_days === 'number' ? row.lead_time_days : null,
      payment_terms: typeof row.payment_terms === 'string' ? row.payment_terms : null,
      condiciones_pago: typeof row.condiciones_pago === 'string' ? row.condiciones_pago : null,
      notes: typeof row.notes === 'string' ? row.notes : null,
      is_active: typeof row.is_active === 'boolean' ? row.is_active : typeof row.is_active === 'string' ? row.is_active : null,
      estatus: row.estatus === 'active' || row.estatus === 'inactive' ? row.estatus : (row.is_active === true || row.is_active === 'true' ? 'active' : 'inactive'),
      created_at: typeof row.created_at === 'string' ? row.created_at : null,
      updated_at: typeof row.updated_at === 'string' ? row.updated_at : null,
    };
  }

  private normalizePurchaseOrderRow(row: JsonRecord): JsonRecord {
    return {
      ...row,
      id: String(row.id ?? ''),
      folio: String(row.folio ?? ''),
      status: String(row.status ?? 'pendiente'),
      supplier_id: String(row.supplier_id ?? row.supplierId ?? ''),
      sucursal_id: typeof row.sucursal_id === 'string' ? row.sucursal_id : null,
      expected_date: typeof row.expected_date === 'string' ? row.expected_date : null,
      total: Number(row.total ?? row.total_amount ?? 0),
      notes: typeof row.notes === 'string' ? row.notes : null,
      items: Array.isArray(row.items) ? row.items : [],
      movements: Array.isArray(row.movements) ? row.movements : [],
    };
  }

  private normalizePurchaseOrderDetail(row: JsonRecord): JsonRecord {
    if (row && typeof row === 'object' && row.order) {
      return {
        ...row,
        order: this.normalizePurchaseOrderRow(row.order as JsonRecord),
        items: Array.isArray(row.items) ? row.items : [],
        movements: Array.isArray(row.movements) ? row.movements : [],
      };
    }

    const normalizedOrder = this.normalizePurchaseOrderRow(row);
    return {
      order: normalizedOrder,
      items: Array.isArray(row.items) ? row.items : normalizedOrder.items ?? [],
      movements: Array.isArray(row.movements) ? row.movements : normalizedOrder.movements ?? [],
    };
  }

  private normalizeReportsSummary(row: JsonRecord): JsonRecord {
    return {
      ...row,
      ordersCount: Number(row.ordersCount ?? row.orders_count ?? 0),
      customersCount: Number(row.customersCount ?? row.customers_count ?? 0),
      inventoryCount: Number(row.inventoryCount ?? row.inventory_count ?? 0),
      lowStockCount: Number(row.lowStockCount ?? row.low_stock_count ?? 0),
      totalIncome: Number(row.totalIncome ?? row.total_income ?? 0),
      totalExpense: Number(row.totalExpense ?? row.total_expense ?? 0),
      totalBalance: Number(row.totalBalance ?? row.total_balance ?? 0),
      productivity: typeof row.productivity === 'number' ? row.productivity : Number(row.productivity ?? 0),
      inventoryValuation: typeof row.inventoryValuation === 'number' ? row.inventoryValuation : Number(row.inventoryValuation ?? row.inventory_valuation ?? 0),
      accountsReceivable: typeof row.accountsReceivable === 'number' ? row.accountsReceivable : Number(row.accountsReceivable ?? row.accounts_receivable ?? 0),
      ordersByTechnician: (row.ordersByTechnician as Record<string, number> | undefined) ?? (row.orders_by_technician as Record<string, number> | undefined) ?? {},
      statusCounts: (row.statusCounts as Record<string, number> | undefined) ?? (row.status_counts as Record<string, number> | undefined) ?? {},
      lastUpdatedAt: typeof row.lastUpdatedAt === 'string' ? row.lastUpdatedAt : typeof row.last_updated_at === 'string' ? row.last_updated_at : null,
    };
  }

  public async getCustomers(): Promise<JsonRecord[]> {
    const result = await this.request<ApiListResponse<JsonRecord[]>>(
      this.apiPath('/customers'),
      { method: 'GET' }
    );
    return (result.data ?? []).map((row) => this.normalizeCustomerRow(row));
  }

  public async getInventory(): Promise<JsonRecord[]> {
    const result = await this.request<ApiListResponse<JsonRecord[]>>(
      this.apiPath('/inventory'),
      { method: 'GET' }
    );
    return (result.data ?? []).map((row) => ({
      ...row,
      sku: String(row.sku ?? ''),
      description: String(row.description ?? ''),
      stock_current: Number(row.stock_current ?? 0),
      minimum_stock: Number(row.minimum_stock ?? 0),
      sucursal_id: typeof row.sucursal_id === 'string' ? row.sucursal_id : null,
    }));
  }

  public async createInventoryItem(data: { sku: string; description: string; stock: number; sucursalId?: string }): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath('/inventory'),
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    return {
      ...result.data,
      stock_current: Number((result.data as { stock_current?: number }).stock_current ?? data.stock),
    };
  }

  public async updateInventoryItem(id: string, data: { description?: string; stock?: number; sucursalId?: string | null; note?: string }): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/inventory/${encodeURIComponent(id)}`),
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      }
    );
    return {
      ...result.data,
      stock_current: Number((result.data as { stock_current?: number }).stock_current ?? data.stock ?? 0),
    };
  }

  public async getInventoryMovements(id: string): Promise<JsonRecord[]> {
    const result = await this.request<ApiListResponse<JsonRecord[]>>(
      this.apiPath(`/inventory/${encodeURIComponent(id)}/movements`),
      { method: 'GET' }
    );
    return result.data ?? [];
  }

  public async transferInventory(data: { sku: string; sucursalOrigen: string; sucursalDestino: string; cantidad: number; motivo?: string; notas?: string; idempotencyKey: string }): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath('/inventory/transfer'),
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    return result.data;
  }

  public async createCustomer(data: JsonRecord): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath('/customers'),
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    return this.normalizeCustomerRow(result.data);
  }

  public async updateCustomer(id: string, data: JsonRecord): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/customers/${encodeURIComponent(id)}`),
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      }
    );
    return this.normalizeCustomerRow(result.data);
  }

  public async updateCustomerConsent(id: string, consent: boolean): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/customers/${encodeURIComponent(id)}/consent`),
      {
        method: 'POST',
        body: JSON.stringify({ consent }),
      }
    );
    return result.data;
  }

  public async getCustomerHistory(id: string): Promise<JsonRecord[]> {
    const result = await this.request<ApiListResponse<JsonRecord[]>>(
      this.apiPath(`/customers/${encodeURIComponent(id)}/history`),
      { method: 'GET' }
    );
    return result.data || [];
  }

  public async createOrder(data: JsonRecord): Promise<JsonRecord> {
    const result = await this.request<ApiListResponse<JsonRecord>>(
      this.apiPath('/orders'),
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    return this.normalizeOrderRow(result.data as JsonRecord);
  }

  public async getOrderById(id: string): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/orders/${encodeURIComponent(id)}`),
      { method: 'GET' }
    );
    return this.normalizeOrderRow(result.data);
  }

  public async uploadOrderAttachment(orderId: string, file: File, fileType: 'intake_photo' | 'attachment_pdf'): Promise<JsonRecord> {
    const mimeType = file.type || (fileType === 'attachment_pdf' ? 'application/pdf' : 'image/*');
    
    // 1. Get Signed URL Intent
    const intentResult = await this.request<ApiSingleResponse<{ uploadUrl: string; storagePath: string; bucketName: string }>>(
      this.apiPath(`/orders/${encodeURIComponent(orderId)}/upload-intent`),
      {
        method: 'POST',
        body: JSON.stringify({
          fileName: file.name,
          mimeType,
          fileSize: file.size,
        }),
      }
    );

    const { uploadUrl, storagePath, bucketName } = intentResult.data;

    // 2. Upload directly to Supabase Storage via PUT
    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': mimeType,
      },
      body: file,
    });

    if (!uploadRes.ok) {
      throw new Error(`Failed to upload to storage: ${uploadRes.statusText}`);
    }

    // 3. Confirm Upload
    const confirmResult = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/orders/${encodeURIComponent(orderId)}/confirm-upload`),
      {
        method: 'POST',
        body: JSON.stringify({
          storagePath,
          bucketName,
          fileName: file.name,
          fileType,
          mimeType,
          fileSize: file.size,
        }),
      }
    );

    return confirmResult.data;
  }

  public async addOrderNote(orderId: string, note: string): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/orders/${encodeURIComponent(orderId)}/notes`),
      {
        method: 'POST',
        body: JSON.stringify({ note }),
      }
    );
    return result.data;
  }

  public async startOrderWorkLog(orderId: string): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/orders/${encodeURIComponent(orderId)}/worklogs/start`),
      { method: 'POST' }
    );
    return result.data;
  }

  public async pauseOrderWorkLog(orderId: string): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/orders/${encodeURIComponent(orderId)}/worklogs/pause`),
      { method: 'POST' }
    );
    return result.data;
  }

  public async resumeOrderWorkLog(orderId: string): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/orders/${encodeURIComponent(orderId)}/worklogs/resume`),
      { method: 'POST' }
    );
    return result.data;
  }

  public async stopOrderWorkLog(orderId: string): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/orders/${encodeURIComponent(orderId)}/worklogs/stop`),
      { method: 'POST' }
    );
    return result.data;
  }

  public async listOrderWorkLogs(orderId: string): Promise<JsonRecord[]> {
    const result = await this.request<ApiListResponse<JsonRecord[]>>(
      this.apiPath(`/orders/${encodeURIComponent(orderId)}/worklogs`),
      { method: 'GET' }
    );
    return result.data || [];
  }

  public async createOrderWhatsAppDraft(orderId: string, templateKey: string): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/orders/${encodeURIComponent(orderId)}/whatsapp/draft`),
      {
        method: 'POST',
        body: JSON.stringify({ templateKey }),
      }
    );
    return result.data;
  }

  public async listOrderWhatsAppMessages(orderId: string): Promise<JsonRecord[]> {
    const result = await this.request<ApiListResponse<JsonRecord[]>>(
      this.apiPath(`/orders/${encodeURIComponent(orderId)}/whatsapp/messages`),
      { method: 'GET' }
    );
    return result.data || [];
  }

  public async listTechnicianCommissionRules(): Promise<JsonRecord[]> {
    const result = await this.request<ApiListResponse<JsonRecord[]>>(
      this.apiPath('/commissions/rules'),
      { method: 'GET' }
    );
    return result.data || [];
  }

  public async updateOrderStatus(orderId: string, status: string, note?: string, deliveryData?: { deliveredToName?: string; deliveredToRelationship?: string }): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/orders/${encodeURIComponent(orderId)}/status`),
      {
        method: 'PATCH',
        body: JSON.stringify({ status, note, ...deliveryData }),
      }
    );
    return result.data;
  }

  public async updateOrderFinancials(orderId: string, data: { estimatedCost?: number; finalCost?: number; receiptUrl?: string; note?: string }): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/orders/${encodeURIComponent(orderId)}/financials`),
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      }
    );
    return result.data;
  }

  public async updateOrderDetails(orderId: string, data: {
    clientName?: string;
    clientPhone?: string;
    clientEmail?: string;
    deviceType?: string;
    deviceModel?: string;
    issue?: string;
    promisedDate?: string;
    }): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/orders/${encodeURIComponent(orderId)}/details`),
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      }
    );
    return result.data;
  }

  public async getOrderChecklist(orderId: string): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/orders/${encodeURIComponent(orderId)}/checklist`),
      { method: 'GET' }
    );
    return result.data;
  }

  public async updateOrderChecklist(orderId: string, data: JsonRecord): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/orders/${encodeURIComponent(orderId)}/checklist`),
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
    return result.data;
  }

  public async updateOrderWarranty(orderId: string, data: { warrantyUntil?: string; warrantyDays?: number; note?: string }): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/orders/${encodeURIComponent(orderId)}/warranty`),
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      }
    );
    return result.data;
  }

  public async getOrderWarrantySummary(orderId: string): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/orders/${encodeURIComponent(orderId)}/warranty`),
      { method: 'GET' }
    );
    return result.data;
  }

  public async createOrderWarrantyClaim(orderId: string, data: { claimReason: string; reportedIssue?: string; requestedResolution?: string; coverageScope?: string }): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/orders/${encodeURIComponent(orderId)}/warranty/claims`),
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    return result.data;
  }

  public async updateOrderWarrantyClaimStatus(orderId: string, claimId: string, status: string, resolutionNotes?: string): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/orders/${encodeURIComponent(orderId)}/warranty/claims/${encodeURIComponent(claimId)}/status`),
      {
        method: 'PATCH',
        body: JSON.stringify({ status, resolutionNotes }),
      }
    );
    return result.data;
  }

  public async getDeviceHistoryBySerial(serialNumber: string, limit: number = 50): Promise<JsonRecord[]> {
    const result = await this.request<ApiListResponse<JsonRecord[]>>(
      this.apiPath(`/orders/device-history?serialNumber=${encodeURIComponent(serialNumber)}&limit=${limit}`),
      { method: 'GET' }
    );
    return result.data ?? [];
  }

  public async getOrders(params: { page?: number; limit?: number; search?: string; status?: string } = {}): Promise<{ data: JsonRecord[], meta?: ApiMeta }> {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.search) searchParams.set('search', params.search);
    if (params.status && params.status !== 'all') searchParams.set('status', params.status);

    const query = searchParams.toString();
    const result = await this.request<{ success: true; data: JsonRecord[]; meta?: ApiMeta }>(
      this.apiPath(`/orders${query ? `?${query}` : ''}`),
      { method: 'GET' }
    );
    
    return {
      data: (result.data ?? []).map((row) => this.normalizeOrderRow(row)),
      meta: result.meta
    };
  }

  public async getBalance(): Promise<JsonRecord[]> {
    const result = await this.request<ApiListResponse<JsonRecord[]>>(
      this.apiPath('/finance/balance'),
      { method: 'GET' }
    );
    return result.data ?? [];
  }

  public async getCashflow(sucursalId: string): Promise<JsonRecord[]> {
    const resolvedSucursalId = sucursalId.trim();
    if (!resolvedSucursalId) {
      throw new Error('Sucursal activa requerida para consultar flujo de caja');
    }
    const result = await this.request<ApiListResponse<JsonRecord[]>>(
      this.apiPath(`/finance/cashflow/${encodeURIComponent(resolvedSucursalId)}`),
      { method: 'GET' }
    );
    return result.data ?? [];
  }

  public async getInventoryReservations(orderId: string): Promise<JsonRecord[]> {
    const result = await this.request<ApiListResponse<JsonRecord[]>>(
      this.apiPath(`/inventory/reservations?serviceOrderId=${encodeURIComponent(orderId)}`),
      { method: 'GET' }
    );
    return result.data ?? [];
  }

  public async listInventoryReservations(): Promise<JsonRecord[]> {
    const result = await this.request<ApiListResponse<JsonRecord[]>>(
      this.apiPath('/inventory/reservations'),
      { method: 'GET' }
    );
    return result.data ?? [];
  }

  public async createInventoryReservation(data: { serviceOrderId: string; productId: string; quantity: number; reason?: string }): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath('/inventory/reservations'),
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    return result.data;
  }

  public async consumeInventoryReservation(reservationId: string, data: { quantity: number; idempotencyKey: string; reason?: string }): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/inventory/reservations/${encodeURIComponent(reservationId)}/consume`),
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    return result.data;
  }

  public async releaseInventoryReservation(reservationId: string, data: { quantity: number; reason?: string }): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/inventory/reservations/${encodeURIComponent(reservationId)}/release`),
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      }
    );
    return result.data;
  }

  public async createOrderPayment(orderId: string, data: { amount: number; paymentMethod: string; reference?: string; notes?: string }): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/orders/${encodeURIComponent(orderId)}/payments`),
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    return result.data;
  }

  public async refundOrderPayment(orderId: string, paymentId: string, data: { amount: number; reason: string }): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/orders/${encodeURIComponent(orderId)}/payments/${encodeURIComponent(paymentId)}/refund`),
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    return result.data;
  }

  public async getExpenses(): Promise<JsonRecord[]> {
    const result = await this.request<ApiListResponse<JsonRecord[]>>(
      this.apiPath('/finance/balance'),
      { method: 'GET' }
    );
    return (result.data ?? [])
      .filter((row) => String(row.type ?? '').toLowerCase() === 'expense')
      .map((row) => ({
        ...row,
        description: String(row.description ?? row.reference ?? 'Gasto'),
        category: String(row.category ?? 'operativo'),
        expense: Number(row.expense ?? 0),
        created_at: String(row.created_at ?? new Date().toISOString()),
      }));
  }

  public async createExpense(payload: {
    sucursalId: string;
    amount: number;
    description: string;
    category: string;
    date?: string;
  }): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath('/finance/expense'),
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
    return result.data;
  }

  public async createAdjustment(payload: {
    sucursalId: string;
    amount: number;
    description: string;
    category: string;
  }): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath('/finance/adjustment'),
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
    return result.data;
  }

  public async getExpense(id: string): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/finance/expense/${encodeURIComponent(id)}`),
      { method: 'GET' }
    );
    return result.data;
  }

  public async deleteExpense(id: string): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/finance/expense/${encodeURIComponent(id)}`),
      { method: 'DELETE' }
    );
    return result.data;
  }

  public async getSucursales(): Promise<JsonRecord[]> {
    const result = await this.request<ApiListResponse<JsonRecord[]>>(
      this.apiPath('/sucursales'),
      { method: 'GET' }
    );
    return (result.data ?? []).map((row) => ({
      ...row,
      name: String(row.name ?? ''),
      code: typeof row.code === 'string' ? row.code : null,
      address: typeof row.address === 'string' ? row.address : null,
      city: typeof row.city === 'string' ? row.city : null,
      state: typeof row.state === 'string' ? row.state : null,
      phone: typeof row.phone === 'string' ? row.phone : null,
      is_active: Boolean(row.is_active ?? true),
    }));
  }

  public async createSucursal(data: {
    name: string;
    code?: string;
    address?: string;
    city?: string;
    state?: string;
    phone?: string;
    isActive?: boolean;
  }): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath('/sucursales'),
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    return {
      ...result.data,
      is_active: Boolean((result.data as { is_active?: boolean }).is_active ?? data.isActive ?? true),
    };
  }

  public async updateSucursal(id: string, data: {
    name?: string;
    code?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    phone?: string | null;
    isActive?: boolean;
  }): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/sucursales/${encodeURIComponent(id)}`),
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
    return {
      ...result.data,
      is_active: Boolean((result.data as { is_active?: boolean }).is_active ?? data.isActive ?? true),
    };
  }

  public async deleteSucursal(id: string): Promise<void> {
    await this.request(
      this.apiPath(`/sucursales/${encodeURIComponent(id)}`),
      { method: 'DELETE' }
    );
  }

  public async assignUserToSucursal(sucursalId: string, userId: string): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/sucursales/${encodeURIComponent(sucursalId)}/users`),
      {
        method: 'PUT',
        body: JSON.stringify({ userId }),
      }
    );
    return result.data;
  }

  public async getProcurementSummary(): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      `/api/${this.tenantSlug}/procurement/summary`,
      { method: 'GET' }
    );
    return result.data;
  }

  public async getStockAlerts(): Promise<JsonRecord[]> {
    const result = await this.request<ApiListResponse<JsonRecord[]>>(
      this.apiPath('/stock-alerts'),
      { method: 'GET' }
    );
    return result.data ?? [];
  }

  public async acknowledgeStockAlert(id: string, note?: string): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/stock-alerts/${encodeURIComponent(id)}/acknowledge`),
      {
        method: 'PATCH',
        body: JSON.stringify({ note }),
      }
    );
    return result.data;
  }

  public async getReportsSummary(): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath('/reports/summary'),
      { method: 'GET' }
    );
    return this.normalizeReportsSummary(result.data);
  }

  public async getProductivityReport(startDate?: string, endDate?: string): Promise<JsonRecord> {
    const query = new URLSearchParams();
    if (startDate) query.set('startDate', startDate);
    if (endDate) query.set('endDate', endDate);
    
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/reports/productivity?${query.toString()}`),
      { method: 'GET' }
    );
    return result.data;
  }

  public async getBillingStatus(): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath('/billing/status'),
      { method: 'GET' }
    );
    return result.data;
  }

  public async createCheckout(priceId: string): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath('/billing/checkout'),
      {
        method: 'POST',
        body: JSON.stringify({ priceId }),
      }
    );
    return result.data;
  }

  public async getSuppliers(params: SupplierQueryParams = {}): Promise<JsonRecord[] & { page: number; pageSize: number; total: number; hasMore: boolean; }> {
    const searchParams = new URLSearchParams();
    if (typeof params.page === 'number') searchParams.set('page', String(params.page));
    if (typeof params.pageSize === 'number') searchParams.set('pageSize', String(params.pageSize));
    if (params.q) searchParams.set('q', params.q);
    if (params.name) searchParams.set('name', params.name);
    if (params.rfc) searchParams.set('rfc', params.rfc);
    if (params.status) searchParams.set('status', params.status);

    const suffix = searchParams.toString();
    const result = await this.request<{
      success: true;
      data: JsonRecord[];
      page: number;
      pageSize: number;
      total: number;
      hasMore: boolean;
    }>(
      `${this.apiPath('/suppliers')}${suffix ? `?${suffix}` : ''}`,
      { method: 'GET' }
    );
    const payload = Object.assign((result.data ?? []).map((row) => this.normalizeSupplierRow(row)), {
      page: result.page,
      pageSize: result.pageSize,
      total: result.total,
      hasMore: result.hasMore,
    });
    return payload;
  }

  public async getSupplierById(id: string): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/suppliers/${encodeURIComponent(id)}`),
      { method: 'GET' }
    );
    return this.normalizeSupplierRow(result.data);
  }

  public async createSupplier(data: JsonRecord): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath('/suppliers'),
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    return this.normalizeSupplierRow(result.data);
  }

  public async updateSupplier(id: string, data: JsonRecord): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/suppliers/${encodeURIComponent(id)}`),
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
    return this.normalizeSupplierRow(result.data);
  }

  public async updateSupplierStatus(id: string, status: SupplierStatus): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/suppliers/${encodeURIComponent(id)}/status`),
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }
    );
    return this.normalizeSupplierRow(result.data);
  }

  public async getSupplierPurchaseOrders(id: string): Promise<JsonRecord[]> {
    const result = await this.request<ApiListResponse<JsonRecord[]>>(
      this.apiPath(`/suppliers/${encodeURIComponent(id)}/purchase-orders`),
      { method: 'GET' }
    );
    return (result.data ?? []).map((row) => this.normalizePurchaseOrderRow(row));
  }

  public async deleteSupplier(id: string): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/suppliers/${encodeURIComponent(id)}`),
      { method: 'DELETE' }
    );
    return this.normalizeSupplierRow(result.data);
  }

  public async getPurchaseOrders(): Promise<JsonRecord[]> {
    const result = await this.request<ApiListResponse<JsonRecord[]>>(
      this.apiPath('/purchase-orders'),
      { method: 'GET' }
    );
    return (result.data ?? []).map((row) => this.normalizePurchaseOrderRow(row));
  }

  public async getPurchaseOrderById(id: string): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/purchase-orders/${encodeURIComponent(id)}`),
      { method: 'GET' }
    );
    return this.normalizePurchaseOrderDetail(result.data);
  }

  public async createPurchaseOrder(data: PurchaseOrderPayload): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath('/purchase-orders'),
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    return this.normalizePurchaseOrderRow(result.data);
  }

  public async updatePurchaseOrder(id: string, data: JsonRecord): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/purchase-orders/${encodeURIComponent(id)}`),
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
    return this.normalizePurchaseOrderRow(result.data);
  }

  public async updatePurchaseOrderStatus(id: string, status: string, note?: string): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/purchase-orders/${encodeURIComponent(id)}/status`),
      {
        method: 'PATCH',
        body: JSON.stringify({ status, note }),
      }
    );
    return this.normalizePurchaseOrderRow(result.data);
  }

  public async receivePurchaseOrder(id: string, payload?: { notes?: string; receivedItems?: Array<{ skuSnapshot?: string; quantity: number }> }): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      `/api/${this.tenantSlug}/purchase-orders/${encodeURIComponent(id)}/receive`,
      {
        method: 'POST',
        body: JSON.stringify(payload ?? {}),
      }
    );
    return result.data;
  }

  public async deletePurchaseOrder(id: string): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/purchase-orders/${encodeURIComponent(id)}`),
      { method: 'DELETE' }
    );
    return this.normalizePurchaseOrderRow(result.data);
  }

  public async getSecuritySummary(): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      `/api/${this.tenantSlug}/security/summary`,
      { method: 'GET' }
    );
    return result.data;
  }

  public async getAuditLogs(params: { page?: number; pageSize?: number; action?: string; userId?: string; from?: string; to?: string } = {}): Promise<{ data: AuditLogRecord[]; page: number; pageSize: number; total: number; hasMore: boolean }> {
    const search = new URLSearchParams();
    if (typeof params.page === 'number') search.set('page', String(params.page));
    if (typeof params.pageSize === 'number') search.set('pageSize', String(params.pageSize));
    if (params.action) search.set('action', params.action);
    if (params.userId) search.set('userId', params.userId);
    if (params.from) search.set('from', params.from);
    if (params.to) search.set('to', params.to);

    const result = await this.request<ApiSingleResponse<{ items: AuditLogRecord[]; page: number; pageSize: number; total: number; hasMore: boolean }>>(
      `/api/${this.tenantSlug}/security/audit${search.toString() ? `?${search.toString()}` : ''}`,
      { method: 'GET' }
    );

    return {
      data: result.data.items,
      page: result.data.page,
      pageSize: result.data.pageSize,
      total: result.data.total,
      hasMore: result.data.hasMore,
    };
  }

  public async getSecuritySessions(): Promise<SecuritySessionRecord[]> {
    const result = await this.request<ApiSingleResponse<SecuritySessionRecord[]>>(
      `/api/${this.tenantSlug}/security/sessions`,
      { method: 'GET' }
    );
    return result.data;
  }

  public async revokeSecuritySession(id: string): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      `/api/${this.tenantSlug}/security/sessions/${encodeURIComponent(id)}`,
      { method: 'DELETE' }
    );
    return result.data;
  }

  public async rotateSecurityKeys(confirm = true): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      `/api/${this.tenantSlug}/security/rotate-keys`,
      {
        method: 'POST',
        body: JSON.stringify({ confirm }),
      }
    );
    return result.data;
  }

  public async getMfaSetup(): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      `/api/${this.tenantSlug}/security/mfa/setup`,
      { method: 'GET' }
    );
    return result.data;
  }

  public async verifyMfaCode(code: string): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      `/api/${this.tenantSlug}/security/mfa/verify`,
      {
        method: 'POST',
        body: JSON.stringify({ code }),
      }
    );
    return result.data;
  }

  public async setAdminMfaRequirement(enabled: boolean): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      `/api/${this.tenantSlug}/security/mfa/require-admins`,
      {
        method: 'PATCH',
        body: JSON.stringify({ enabled }),
      }
    );
    return result.data;
  }

  public async getUsers(params: UserQueryParams = {}): Promise<{ data: AdminUserRecord[]; page: number; pageSize: number; total: number; hasMore: boolean }> {
    const search = new URLSearchParams();
    if (typeof params.page === 'number') search.set('page', String(params.page));
    if (typeof params.pageSize === 'number') search.set('pageSize', String(params.pageSize));
    if (params.q) search.set('q', params.q);
    if (params.role) search.set('role', params.role);
    if (params.status) search.set('status', params.status);

    const query = search.toString();
    const result = await this.request<ApiSingleResponse<{ items: AdminUserRecord[]; page: number; pageSize: number; total: number; hasMore: boolean }>>(
      `/api/users${query ? `?${query}` : ''}`,
      { method: 'GET' }
    );

    return {
      data: result.data.items,
      page: result.data.page ?? params.page ?? 1,
      pageSize: result.data.pageSize ?? params.pageSize ?? 20,
      total: result.data.total ?? result.data.items.length,
      hasMore: Boolean(result.data.hasMore),
    };
  }

  public async inviteUser(payload: { email: string; name: string; role: string; sucursalId?: string | null }): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      `/api/users/invite`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
    return result.data;
  }

  public async updateUserRole(id: string, role: string): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      `/api/users/${encodeURIComponent(id)}/role`,
      {
        method: 'PUT',
        body: JSON.stringify({ role }),
      }
    );
    return result.data;
  }

  public async getTenantRolePermissions(role: 'manager' | 'technician'): Promise<Record<string, boolean>> {
    const result = await this.request<ApiSingleResponse<{ role: string; permissions: Record<string, boolean> }>>(
      this.apiPath(`/tenant-roles/permissions?role=${encodeURIComponent(role)}`),
      { method: 'GET' },
    );
    return result.data.permissions ?? {};
  }

  public async updateTenantRolePermissions(
    role: 'manager' | 'technician',
    permissions: Record<string, boolean>,
  ): Promise<void> {
    await this.request(this.apiPath('/tenant-roles/permissions'), {
      method: 'POST',
      body: JSON.stringify({ role, permissions }),
    });
  }

  public async deactivateUser(id: string): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      `/api/users/${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
      }
    );
    return result.data;
  }

  public async getUserPurchaseOrders(id: string): Promise<JsonRecord[]> {
    const result = await this.request<ApiSingleResponse<JsonRecord[]>>(
      `/api/users/${encodeURIComponent(id)}/purchase-orders`,
      { method: 'GET' }
    );
    return result.data;
  }

  public async getServiceRequests(): Promise<ServiceRequestPayload[]> {
    const result = await this.request<ApiListResponse<ServiceRequestPayload[]>>(
      this.apiPath('/requests'),
      { method: 'GET' }
    );
    return (result.data ?? []).map((row) => this.normalizeServiceRequestRow(row as JsonRecord));
  }

  public async getServiceRequestById(id: string): Promise<ServiceRequestPayload> {
    const result = await this.request<ApiSingleResponse<ServiceRequestPayload>>(
      this.apiPath(`/requests/${encodeURIComponent(id)}`),
      { method: 'GET' }
    );
    return this.normalizeServiceRequestRow(result.data as JsonRecord);
  }

  public async convertServiceRequestToOrder(id: string, payload: {
    estimatedCost: number;
    deviceType?: string;
    deviceModel?: string;
    issue?: string;
    createCustomer?: boolean;
    }): Promise<ApiSingleResponse<{ request: ServiceRequestPayload; order: JsonRecord }>> {
    return this.request<ApiSingleResponse<{ request: ServiceRequestPayload; order: JsonRecord }>>(
      this.apiPath(`/requests/${encodeURIComponent(id)}/convert`),
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    ).then((response) => ({
      ...response,
      data: {
        request: this.normalizeServiceRequestRow(response.data.request as JsonRecord),
        order: this.normalizeOrderRow(response.data.order as JsonRecord),
      },
    }));
  }

  public async getTenantLandingSettings(): Promise<ApiSingleResponse<TenantLandingSettings>> {
    return this.request<ApiSingleResponse<TenantLandingSettings>>(`/api/auth/tenant/${encodeURIComponent(this.tenantSlug)}/settings`, {
      method: 'GET',
    });
  }

  public async getTenantSettings(): Promise<ApiSingleResponse<TenantLandingSettings>> {
    return this.request<ApiSingleResponse<TenantLandingSettings>>(`/api/auth/tenant/${encodeURIComponent(this.tenantSlug)}/settings`, {
      method: 'GET',
    });
  }

  public async updateTenantSettings(payload: {
    branding?: Record<string, unknown>;
    landingContent?: Record<string, unknown>;
    operationalSettings?: Record<string, unknown>;
    industryProfile?: Record<string, unknown> | null;
    enabledModules?: Array<Record<string, unknown>> | null;
    labelOverrides?: Array<Record<string, unknown>> | null;
    workflowStatuses?: Array<Record<string, unknown>> | null;
    fieldDefinitions?: FieldDefinitionPayload[] | null;
  }): Promise<ApiSingleResponse<TenantLandingSettings>> {
    return this.request<ApiSingleResponse<TenantLandingSettings>>(`/api/auth/tenant/${encodeURIComponent(this.tenantSlug)}/settings`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  public async getTasks(): Promise<JsonRecord[]> {
    const result = await this.request<ApiListResponse<JsonRecord[]>>(
      this.apiPath('/tasks'),
      { method: 'GET' }
    );
    return (result.data ?? []).map((row) => ({
      ...row,
      title: String(row.title ?? ''),
      description: typeof row.description === 'string' ? row.description : null,
      status: String(row.status ?? 'pendiente'),
      priority: String(row.priority ?? 'media'),
      sucursal_id: typeof row.sucursal_id === 'string' ? row.sucursal_id : null,
      service_order_id: typeof row.service_order_id === 'string' ? row.service_order_id : null,
      service_request_id: typeof row.service_request_id === 'string' ? row.service_request_id : null,
      assigned_user_id: typeof row.assigned_user_id === 'string' ? row.assigned_user_id : null,
      due_date: typeof row.due_date === 'string' ? row.due_date : null,
    }));
  }

  public async getTaskById(id: string): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/tasks/${encodeURIComponent(id)}`),
      { method: 'GET' }
    );
    return result.data;
  }

  public async createTask(data: TaskPayload): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath('/tasks'),
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    return result.data;
  }

  public async updateTask(id: string, data: TaskPayload): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/tasks/${encodeURIComponent(id)}`),
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
    return result.data;
  }

  public async updateTaskStatus(id: string, status: string, note?: string): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/tasks/${encodeURIComponent(id)}/status`),
      {
        method: 'PATCH',
        body: JSON.stringify({ status, note }),
      }
    );
    return result.data;
  }

  public async getTaskHistory(id: string): Promise<JsonRecord[]> {
    const result = await this.request<ApiListResponse<JsonRecord[]>>(
      this.apiPath(`/tasks/${encodeURIComponent(id)}/history`),
      { method: 'GET' }
    );
    return result.data ?? [];
  }

  public async deleteTask(id: string): Promise<JsonRecord> {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(
      this.apiPath(`/tasks/${encodeURIComponent(id)}`),
      { method: 'DELETE' }
    );
    return result.data;
  }

  public async updateTenantLandingSettings(payload: {
    branding?: Record<string, unknown>;
    landingContent?: {
      heroTitle: string;
      heroSubtitle: string;
      heroDescription: string;
      primaryCtaLabel: string;
      primaryCtaHref: string;
      secondaryCtaLabel: string;
      secondaryCtaHref: string;
      contactLabel: string;
      contactHref: string;
      seoTitle: string;
      seoDescription: string;
      services: LandingServicePayload[];
      socialLinks: SocialLinkPayload[];
      showMap: boolean;
      mapEmbedUrl: string;
      showVideo: boolean;
      videoUrl: string;
    };
    industryProfile?: Record<string, unknown>;
    enabledModules?: Array<Record<string, unknown>>;
    labelOverrides?: Array<Record<string, unknown>>;
    workflowStatuses?: Array<Record<string, unknown>>;
    fieldDefinitions?: FieldDefinitionPayload[] | null;
    semaphoreRules?: Array<Record<string, unknown>> | null;
  }): Promise<ApiSingleResponse<TenantLandingSettings>> {
    return this.request<ApiSingleResponse<TenantLandingSettings>>(`/api/auth/tenant/${encodeURIComponent(this.tenantSlug)}/settings`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  public async uploadTenantBrandingAsset(payload: {
    file: File;
    assetType: BrandingAssetType;
  }): Promise<ApiSingleResponse<{
    tenant: TenantLandingSettings['tenant'];
    asset: {
      assetType: BrandingAssetType;
      publicUrl: string | null;
      bucketName: string;
      storagePath: string;
    };
  }>> {
    const base64 = await this.fileToBase64(payload.file);
    return this.request<ApiSingleResponse<{
      tenant: TenantLandingSettings['tenant'];
      asset: {
        assetType: BrandingAssetType;
        publicUrl: string | null;
        bucketName: string;
        storagePath: string;
      };
    }>>(`/api/auth/tenant/${encodeURIComponent(this.tenantSlug)}/assets`, {
      method: 'POST',
      body: JSON.stringify({
        assetType: payload.assetType,
        fileName: payload.file.name,
        mimeType: payload.file.type || 'application/octet-stream',
        base64,
      }),
    });
  }

  private async fileToBase64(file: File): Promise<string> {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const value = typeof reader.result === 'string' ? reader.result : '';
        resolve(value);
      };
      reader.onerror = () => reject(new Error('No se pudo leer el archivo'));
      reader.readAsDataURL(file);
    });
  }

  // --- Catálogos (Fase 1) ---

  public async getCatalogFamilies(): Promise<CatalogFamily[]> {
    return this.request<CatalogFamily[]>(`/api/catalog/families`, { method: 'GET' });
  }
  public async createCatalogFamily(data: { name: string, description?: string }) {
    return this.request<JsonRecord>(`/api/catalog/families`, { method: 'POST', body: JSON.stringify(data) });
  }
  public async updateCatalogFamily(id: string, data: { name: string, description?: string }) {
    return this.request<JsonRecord>(`/api/catalog/families/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }
  public async deleteCatalogFamily(id: string) {
    return this.request<JsonRecord>(`/api/catalog/families/${id}`, { method: 'DELETE' });
  }

  public async getCatalogBrands(familyId: string): Promise<CatalogBrand[]> {
    return this.request<CatalogBrand[]>(`/api/catalog/brands?familyId=${encodeURIComponent(familyId)}`, { method: 'GET' });
  }
  public async createCatalogBrand(data: { family_id: string, name: string, logo_url?: string }) {
    return this.request<JsonRecord>(`/api/catalog/brands`, { method: 'POST', body: JSON.stringify(data) });
  }
  public async updateCatalogBrand(id: string, data: { name: string, logo_url?: string }) {
    return this.request<JsonRecord>(`/api/catalog/brands/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }
  public async deleteCatalogBrand(id: string) {
    return this.request<JsonRecord>(`/api/catalog/brands/${id}`, { method: 'DELETE' });
  }

  public async getCatalogModels(brandId: string): Promise<CatalogModel[]> {
    return this.request<CatalogModel[]>(`/api/catalog/models?brandId=${encodeURIComponent(brandId)}`, { method: 'GET' });
  }
  public async createCatalogModel(data: { brand_id: string, name: string, reference_image_url?: string }) {
    return this.request<JsonRecord>(`/api/catalog/models`, { method: 'POST', body: JSON.stringify(data) });
  }
  public async updateCatalogModel(id: string, data: { name: string, reference_image_url?: string }) {
    return this.request<JsonRecord>(`/api/catalog/models/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }
  public async deleteCatalogModel(id: string) {
    return this.request<JsonRecord>(`/api/catalog/models/${id}`, { method: 'DELETE' });
  }

  public async getCatalogFaults(modelId: string): Promise<CatalogFault[]> {
    return this.request<CatalogFault[]>(`/api/catalog/faults?modelId=${encodeURIComponent(modelId)}`, { method: 'GET' });
  }
  public async createCatalogFault(data: { model_id: string, name: string, description?: string, estimated_labor_minutes?: number, default_cost?: number }) {
    return this.request<JsonRecord>(`/api/catalog/faults`, { method: 'POST', body: JSON.stringify(data) });
  }
  public async updateCatalogFault(id: string, data: { name: string, description?: string, estimated_labor_minutes?: number, default_cost?: number }) {
    return this.request<JsonRecord>(`/api/catalog/faults/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }
  public async deleteCatalogFault(id: string) {
    return this.request<JsonRecord>(`/api/catalog/faults/${id}`, { method: 'DELETE' });
  }

  public async getCatalogParts(faultId: string) {
    return this.request<JsonRecord>(`/api/catalog/parts?faultId=${encodeURIComponent(faultId)}`, { method: 'GET' });
  }
  public async createCatalogPart(data: { fault_id: string, product_id?: string, name: string, sku?: string, default_cost?: number }) {
    return this.request<JsonRecord>(`/api/catalog/parts`, { method: 'POST', body: JSON.stringify(data) });
  }
  public async updateCatalogPart(id: string, data: { product_id?: string, name: string, sku?: string, default_cost?: number }) {
    return this.request<JsonRecord>(`/api/catalog/parts/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }
  public async deleteCatalogPart(id: string) {
    return this.request<JsonRecord>(`/api/catalog/parts/${id}`, { method: 'DELETE' });
  }

  // --- OmniSearch (Fase 1) ---

  public async omniSearch(query: string): Promise<OmniSearchResult> {
    return this.request<OmniSearchResult>(`/api/search?q=${encodeURIComponent(query)}`, { method: 'GET' });
  }

  // --- POS y Caja (Fase 3) ---

  public async getCashRegisters() {
    const result = await this.request<ApiListResponse<JsonRecord[]>>(`/api/cash/registers`, { method: 'GET' });
    return result.data ?? [];
  }

  public async createCashRegister(data: { name: string; sucursalId: string }) {
    const result = await this.request<ApiSingleResponse<JsonRecord>>(`/api/cash/registers`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return result.data;
  }

  public async openCashShift(cashRegisterId: string, initialCash: number) {
    return this.request<JsonRecord>(`/api/cash/shifts/open`, {
      method: 'POST',
      body: JSON.stringify({ cashRegisterId, initialCash }),
    });
  }

  public async getActiveCashShift() {
    return this.request<JsonRecord>(`/api/cash/shifts/active`, { method: 'GET' });
  }

  public async closeCashShift(finalCash: number, notes?: string) {
    return this.request<JsonRecord>(`/api/cash/shifts/close`, {
      method: 'POST',
      body: JSON.stringify({ finalCash, notes }),
    });
  }

  public async createSale(data: {
    customerName: string;
    customerPhone?: string;
    items: Array<{ productId: string; quantity: number }>;
    paymentMethod: 'cash' | 'card' | 'transfer';
    reference?: string;
    notes?: string;
  }) {
    return this.request<JsonRecord>(`/api/cash/sales`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async createCashExpense(data: {
    amount: number;
    category: string;
    description: string;
    receiptUrl?: string;
  }) {
    return this.request<JsonRecord>(`/api/cash/expenses`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async getCashShiftDetails(shiftId: string) {
    return this.request<JsonRecord>(`/api/cash/shifts/${encodeURIComponent(shiftId)}`, { method: 'GET' });
  }

  // --- Checklists y Compras (Fase 2) ---

  public async getCatalogChecklists(familyId: string) {
    return this.request<JsonRecord>(`/api/catalog/checklists?familyId=${encodeURIComponent(familyId)}`, { method: 'GET' });
  }

  public async getProcurementSuggestions() {
    return this.request<ApiListResponse<ProcurementSuggestion[]>>(`/api/procurement/suggestions`, { method: 'GET' });
  }

  // --- Portal del Cliente e Inbound MP (Fase 4) ---

  public async getPublicOrderDetails(publicToken: string) {
    return this.publicRequest<PublicOrderResponse>(`/api/public-portal/order/${encodeURIComponent(publicToken)}`, { method: 'GET' });
  }

  public async authorizeOrder(publicToken: string, data: { decision: 'accepted' | 'rejected', acceptedByName?: string, acceptedByPhone?: string, acceptedByEmail?: string, signatureDataUrl?: string, termsVersion?: string }) {
    return this.publicRequest<PublicOrderResponse>(`/api/public-portal/order/${encodeURIComponent(publicToken)}/authorize`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async createPublicOrderPayment(publicToken: string, paymentMethod: string) {
    return this.publicRequest<PublicOrderResponse>(`/api/public-portal/order/${encodeURIComponent(publicToken)}/payment`, {
      method: 'POST',
      body: JSON.stringify({ paymentMethod }),
    });
  }

  // --- Automatizaciones y Plantillas (Fase 4) ---

  public async getAutomationRules() {
    return this.request<AutomationRule[]>(`/api/automation/rules`, { method: 'GET' });
  }

  public async createAutomationRule(data: { name: string, event_type: string, condition?: unknown, action_type: string, action_config: unknown, is_active?: boolean }) {
    return this.request<JsonRecord>(`/api/automation/rules`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async updateAutomationRule(id: string, data: Partial<{ name: string, event_type: string, condition: unknown, action_type: string, action_config: unknown, is_active: boolean }>) {
    return this.request<JsonRecord>(`/api/automation/rules/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  public async getAutomationLogs() {
    return this.request<AutomationLog[]>(`/api/automation/logs`, { method: 'GET' });
  }

  public async getMessageTemplates() {
    return this.request<JsonRecord[]>(`/api/automation/templates`, { method: 'GET' });
  }

  public async createMessageTemplate(data: { name: string, channel: 'whatsapp' | 'email' | 'sms', subject?: string, body: string, variables?: string[] }) {
    return this.request<JsonRecord>(`/api/automation/templates`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiGateway = new ApiGateway();
