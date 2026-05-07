import { supabase } from './supabase.js';
import type { 
  ServiceOrderCreateRequestDto, 
  ServiceOrderStatusUpdateRequestDto,
  DashboardSummaryDto,
  ServiceOrderDto,
  TimelineEventDto
} from '@sdmx/contracts';

export class ServiceOrdersService {
  async dashboardSummary(token: string): Promise<DashboardSummaryDto> {
    // Implementa la lógica para contar órdenes por estado. Usa la tabla real.
    const { data, error } = await supabase
      .from('service_orders')
      .select('status', { count: 'exact', head: true });
    // ... lógica de agregación
    return {
      openOrders: 0,
      inProgressOrders: 0,
      readyOrders: 0,
      totalCustomers: 0,
      totalSalesMxn: 0,
    };
  }

  async createServiceOrder(token: string, request: ServiceOrderCreateRequestDto): Promise<ServiceOrderDto> {
    const { data, error } = await supabase
      .from('service_orders')
      .insert({
        tenant_id: request.tenantId,
        branch_id: request.branchId,
        customer_id: request.customerId,
        device_type: request.deviceType,
        device_brand: request.deviceBrand,
        device_model: request.deviceModel,
        reported_issue: request.reportedIssue,
        estimated_cost: request.estimatedCost,
        notes: request.notes,
        reception_checklist: request.receptionChecklist,
        reception_photo_base64: request.receptionPhotoBase64,
        source_quote_folio: request.sourceQuoteFolio,
        promised_date: request.promisedDate,
        status: 'received'
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async listServiceOrders(token: string): Promise<ServiceOrderDto[]> {
    const { data, error } = await supabase
      .from('service_orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  }

  async updateServiceOrderStatus(token: string, serviceOrderId: string, request: ServiceOrderStatusUpdateRequestDto): Promise<ServiceOrderDto> {
    const { data, error } = await supabase
      .from('service_orders')
      .update({ status: request.status })
      .eq('id', serviceOrderId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async listStatusTimeline(token: string, serviceOrderId: string): Promise<TimelineEventDto[]> {
    const { data, error } = await supabase
      .from('service_order_timeline')
      .select('*')
      .eq('service_order_id', serviceOrderId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  }

  async getPortalOrderPublic(folio: string): Promise<ServiceOrderDto> {
    const { data, error } = await supabase
      .from('service_orders')
      .select('*')
      .eq('folio', folio)
      .single();
    if (error) throw new Error('Folio no encontrado');
    return data;
  }
}

export const serviceOrdersService = new ServiceOrdersService();
