import { supabase } from './supabase.js';
import type { 
  ServiceOrderCreateRequestDto, 
  ServiceOrderStatusUpdateRequestDto,
  ServiceOrderDto,
  TimelineEventDto
} from '@sdmx/contracts';

export class ServiceOrdersService {
  async create(token: string, request: ServiceOrderCreateRequestDto): Promise<ServiceOrderDto> {
    const { data, error } = await supabase
      .from('service_orders')
      .insert({
        tenant_id: request.tenantId,
        branch_id: request.branchId ?? null,
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

  async findAll(token: string): Promise<ServiceOrderDto[]> {
    const { data, error } = await supabase
      .from('service_orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  }

  async findById(token: string, id: string): Promise<ServiceOrderDto> {
    const { data, error } = await supabase
      .from('service_orders')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async update(token: string, id: string, request: ServiceOrderStatusUpdateRequestDto): Promise<ServiceOrderDto> {
    const { data, error } = await supabase
      .from('service_orders')
      .update({ status: request.status })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async getHistory(token: string, id: string): Promise<TimelineEventDto[]> {
    const { data, error } = await supabase
      .from('service_order_timeline')
      .select('*')
      .eq('service_order_id', id)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  }

  async findByFolioForClient(folio: string): Promise<ServiceOrderDto> {
    const { data, error } = await supabase
      .from('service_orders')
      .select('*')
      .eq('folio', folio)
      .single();
    if (error) throw new Error('Orden no encontrada');
    return data;
  }
}

export const serviceOrdersService = new ServiceOrdersService();
