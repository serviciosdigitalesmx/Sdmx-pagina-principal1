import { supabase } from './supabase';
import { ServiceOrderCreateRequestDto, ServiceOrderUpdateRequestDto, ServiceOrderResponseDto } from '@sdmx/contracts';

export class ServiceOrdersService {
  async create(tenantId: string, data: ServiceOrderCreateRequestDto): Promise<ServiceOrderResponseDto> {
    const { cliente_id, tipo_dispositivo, marca_modelo, falla_reportada, fecha_promesa, costo_estimado, checklist, foto_recepcion_url, notas_internas } = data;
    const { data: order, error } = await supabase
      .from('equipos')
      .insert({
        tenant_id: tenantId,
        cliente_id,
        tipo_dispositivo,
        marca_modelo,
        falla_reportada,
        fecha_promesa,
        costo_estimado,
        checklist: checklist || { cargador: false, pantalla: false, prende: false, respaldo: false },
        foto_recepcion_url,
        notas_internas,
        estado: 'Recibido',
        fecha_ingreso: new Date().toISOString().split('T')[0],
      })
      .select('*, clientes(*)')
      .single();
    if (error) throw new Error(error.message);
    await supabase.from('equipo_historial').insert({
      equipo_id: order.id,
      estado_nuevo: 'Recibido',
      comentario: 'Orden creada desde recepción'
    });
    return order;
  }

  async findAll(tenantId: string, filters: any): Promise<ServiceOrderResponseDto[]> {
    let query = supabase.from('equipos').select('*, clientes(*)').eq('tenant_id', tenantId);
    if (filters.estado && filters.estado !== 'todos') query = query.eq('estado', filters.estado);
    if (filters.tecnico) query = query.eq('tecnico_asignado', filters.tecnico);
    if (filters.folio) query = query.ilike('folio', `%${filters.folio}%`);
    if (filters.cliente) query = query.ilike('clientes.nombre', `%${filters.cliente}%`);
    if (filters.desde) query = query.gte('fecha_ingreso', filters.desde);
    if (filters.hasta) query = query.lte('fecha_ingreso', filters.hasta);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  }

  async findById(tenantId: string, id: string): Promise<ServiceOrderResponseDto> {
    const { data, error } = await supabase
      .from('equipos')
      .select('*, clientes(*), equipo_fotos(*)')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .single();
    if (error) throw new Error('Orden no encontrada');
    return data;
  }

  async findByFolioForClient(folio: string): Promise<any> {
    const { data, error } = await supabase
      .from('equipos')
      .select('*, clientes(nombre, telefono), equipo_fotos(url, tipo)')
      .eq('folio', folio)
      .single();
    if (error) throw new Error('Folio no encontrado');
    return data;
  }

  async update(tenantId: string, id: string, updates: ServiceOrderUpdateRequestDto): Promise<ServiceOrderResponseDto> {
    const { data: old } = await supabase.from('equipos').select('estado').eq('id', id).eq('tenant_id', tenantId).single();
    const { data, error } = await supabase
      .from('equipos')
      .update({ ...updates, updated_at: new Date() })
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .select('*, clientes(*)')
      .single();
    if (error) throw new Error(error.message);
    if (updates.estado && old && old.estado !== updates.estado) {
      await supabase.from('equipo_historial').insert({
        equipo_id: id,
        estado_anterior: old.estado,
        estado_nuevo: updates.estado,
        comentario: updates.comentario_estado || `Cambio a ${updates.estado}`
      });
    }
    return data;
  }

  async addFollowUpPhoto(equipoId: string, url: string, tenantId: string): Promise<void> {
    await supabase.from('equipo_fotos').insert({
      equipo_id: equipoId,
      url,
      tipo: 'seguimiento'
    });
  }

  async getHistory(equipoId: string, tenantId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('equipo_historial')
      .select('*')
      .eq('equipo_id', equipoId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  }
}

export const serviceOrdersService = new ServiceOrdersService();
