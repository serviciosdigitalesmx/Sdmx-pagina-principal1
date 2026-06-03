-- TENANTS ACTUALES
select
  'TENANTS_ACTUALES' as bloque,
  id::text,
  slug,
  name,
  created_at::text
from tenants;

-- TENANTS USADOS EN ORDENES
select
  'TENANTS_ORDENES' as bloque,
  tenant_id::text,
  count(*)::text,
  min(created_at)::text,
  max(created_at)::text
from service_orders
group by tenant_id
order by count(*) desc;

-- CLIENTES POR TENANT
select
  tenant_id,
  count(*) clientes
from customers
group by tenant_id
order by clientes desc;

-- REQUESTS POR TENANT
select
  tenant_id,
  count(*) requests
from service_requests
group by tenant_id
order by requests desc;

-- USUARIOS POR TENANT
select
  tenant_id,
  count(*) usuarios
from users
group by tenant_id
order by usuarios desc;

-- ORDENES CON EVIDENCIA
select
  tenant_id,
  count(*) ordenes_con_evidencia
from service_orders
where evidence_metadata is not null
and jsonb_array_length(evidence_metadata) > 0
group by tenant_id
order by ordenes_con_evidencia desc;
