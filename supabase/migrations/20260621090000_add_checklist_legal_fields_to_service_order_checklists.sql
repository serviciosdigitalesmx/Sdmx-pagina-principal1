alter table public.service_order_checklists
  add column if not exists cosmetic_condition text,
  add column if not exists reported_physical_damage text,
  add column if not exists accessories_received text,
  add column if not exists customer_acceptance_required boolean not null default false,
  add column if not exists accepted_at timestamptz,
  add column if not exists accepted_by_name text;

create index if not exists service_order_checklists_tenant_order_idx
  on public.service_order_checklists (tenant_id, service_order_id);

insert into public.tenant_field_definitions (
  tenant_id,
  entity,
  field_key,
  field_label,
  field_type,
  required,
  options,
  field_order,
  placeholder,
  help_text,
  visible,
  validation,
  metadata
)
select
  tenant.id,
  'service_order_checklists',
  field_definition.field_key,
  field_definition.field_label,
  field_definition.field_type,
  false,
  '[]'::jsonb,
  field_definition.field_order,
  field_definition.placeholder,
  field_definition.help_text,
  true,
  '{}'::jsonb,
  '{"section":"legal_intake"}'::jsonb
from public.tenants tenant
cross join (
  values
    ('cosmetic_condition', 'Condición cosmética', 'textarea', 10, 'Rayones, golpes, humedad visible, pantalla, carcasa', 'Estado visible del equipo al recibirlo.'),
    ('reported_physical_damage', 'Daño físico reportado', 'textarea', 20, 'Ej. golpe en esquina, pantalla rota, equipo mojado', 'Daños reportados por el cliente o detectados en recepción.'),
    ('accessories_received', 'Accesorios recibidos', 'textarea', 30, 'Ej. cargador, funda, SIM, memoria, caja', 'Accesorios entregados junto con el equipo.'),
    ('customer_acceptance_required', 'Aceptación del cliente requerida', 'boolean', 40, null, 'Indica si esta recepción requiere aceptación explícita del cliente.'),
    ('accepted_at', 'Fecha de aceptación', 'date', 50, null, 'Fecha en la que el cliente acepta las condiciones de recepción.'),
    ('accepted_by_name', 'Nombre de quien acepta', 'text', 60, 'Nombre completo', 'Persona que acepta las condiciones de recepción.')
) as field_definition(field_key, field_label, field_type, field_order, placeholder, help_text)
on conflict (tenant_id, entity, field_key) do nothing;
