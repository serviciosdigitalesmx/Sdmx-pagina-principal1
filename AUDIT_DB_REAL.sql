select
  table_name,
  column_name
from information_schema.columns
where column_name in (
  'branch_id',
  'sucursal_id',
  'total_cost',
  'estimated_cost',
  'final_cost',
  'organization_id',
  'tenant_id'
)
order by table_name,column_name;

select
  table_name
from information_schema.tables
where table_schema='public'
and table_name in (
  'organizations',
  'tenants',
  'branches',
  'sucursales'
)
order by table_name;
