-- Enable RLS on real production tables
alter table if exists public.service_orders enable row level security;
alter table if exists public.customers enable row level security;
alter table if exists public.service_requests enable row level security;
alter table if exists public.branch_inventory enable row level security;
alter table if exists public.expenses enable row level security;
alter table if exists public.tasks enable row level security;
alter table if exists public.suppliers enable row level security;
alter table if exists public.products enable row level security;

-- SERVICE ORDERS
drop policy if exists service_orders_select on public.service_orders;
create policy service_orders_select
on public.service_orders
for select
using (
  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
);

drop policy if exists service_orders_write_owner_manager on public.service_orders;
create policy service_orders_write_owner_manager
on public.service_orders
for insert
with check (
  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
  and auth.jwt() ->> 'role' in ('owner', 'manager')
);

drop policy if exists service_orders_update_owner_manager on public.service_orders;
create policy service_orders_update_owner_manager
on public.service_orders
for update
using (
  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
  and auth.jwt() ->> 'role' in ('owner', 'manager')
)
with check (
  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
  and auth.jwt() ->> 'role' in ('owner', 'manager')
);

drop policy if exists service_orders_delete_owner_manager on public.service_orders;
create policy service_orders_delete_owner_manager
on public.service_orders
for delete
using (
  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
  and auth.jwt() ->> 'role' in ('owner', 'manager')
);

drop policy if exists service_orders_update_technician on public.service_orders;
create policy service_orders_update_technician
on public.service_orders
for update
using (
  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
  and auth.jwt() ->> 'role' = 'technician'
)
with check (
  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
  and auth.jwt() ->> 'role' = 'technician'
);

-- CUSTOMERS
drop policy if exists customers_select on public.customers;
create policy customers_select
on public.customers
for select
using (
  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
);

drop policy if exists customers_write_owner_manager on public.customers;
create policy customers_write_owner_manager
on public.customers
for insert
with check (
  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
  and auth.jwt() ->> 'role' in ('owner', 'manager')
);

drop policy if exists customers_update_owner_manager on public.customers;
create policy customers_update_owner_manager
on public.customers
for update
using (
  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
  and auth.jwt() ->> 'role' in ('owner', 'manager')
)
with check (
  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
  and auth.jwt() ->> 'role' in ('owner', 'manager')
);

drop policy if exists customers_delete_owner_manager on public.customers;
create policy customers_delete_owner_manager
on public.customers
for delete
using (
  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
  and auth.jwt() ->> 'role' in ('owner', 'manager')
);

-- SERVICE REQUESTS
drop policy if exists service_requests_select on public.service_requests;
create policy service_requests_select
on public.service_requests
for select
using (
  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
);

drop policy if exists service_requests_write_owner_manager on public.service_requests;
create policy service_requests_write_owner_manager
on public.service_requests
for insert
with check (
  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
  and auth.jwt() ->> 'role' in ('owner', 'manager')
);

drop policy if exists service_requests_update_owner_manager on public.service_requests;
create policy service_requests_update_owner_manager
on public.service_requests
for update
using (
  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
  and auth.jwt() ->> 'role' in ('owner', 'manager')
)
with check (
  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
  and auth.jwt() ->> 'role' in ('owner', 'manager')
);

-- INVENTORY
drop policy if exists branch_inventory_select on public.branch_inventory;
create policy branch_inventory_select
on public.branch_inventory
for select
using (
  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
);

drop policy if exists branch_inventory_write_owner_manager on public.branch_inventory;
create policy branch_inventory_write_owner_manager
on public.branch_inventory
for insert
with check (
  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
  and auth.jwt() ->> 'role' in ('owner', 'manager')
);

drop policy if exists branch_inventory_update_owner_manager on public.branch_inventory;
create policy branch_inventory_update_owner_manager
on public.branch_inventory
for update
using (
  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
  and auth.jwt() ->> 'role' in ('owner', 'manager')
)
with check (
  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
  and auth.jwt() ->> 'role' in ('owner', 'manager')
);

drop policy if exists branch_inventory_delete_owner_manager on public.branch_inventory;
create policy branch_inventory_delete_owner_manager
on public.branch_inventory
for delete
using (
  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
  and auth.jwt() ->> 'role' in ('owner', 'manager')
);

-- PRODUCTS / SUPPLIERS
drop policy if exists products_select on public.products;
create policy products_select
on public.products
for select
using (
  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
);

drop policy if exists suppliers_select on public.suppliers;
create policy suppliers_select
on public.suppliers
for select
using (
  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
);

drop policy if exists products_write_owner_manager on public.products;
create policy products_write_owner_manager
on public.products
for all
using (
  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
  and auth.jwt() ->> 'role' in ('owner', 'manager')
)
with check (
  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
  and auth.jwt() ->> 'role' in ('owner', 'manager')
);

drop policy if exists suppliers_write_owner_manager on public.suppliers;
create policy suppliers_write_owner_manager
on public.suppliers
for all
using (
  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
  and auth.jwt() ->> 'role' in ('owner', 'manager')
)
with check (
  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
  and auth.jwt() ->> 'role' in ('owner', 'manager')
);

-- EXPENSES
drop policy if exists expenses_owner on public.expenses;
create policy expenses_owner
on public.expenses
for all
using (
  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
  and auth.jwt() ->> 'role' = 'owner'
)
with check (
  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
  and auth.jwt() ->> 'role' = 'owner'
);

drop policy if exists expenses_manager_read_own_sucursal on public.expenses;
create policy expenses_manager_read_own_sucursal
on public.expenses
for select
using (
  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
  and auth.jwt() ->> 'role' = 'manager'
  and branch_id::text = auth.jwt() ->> 'sucursal_id'
);

drop policy if exists expenses_manager_write_own_sucursal on public.expenses;
create policy expenses_manager_write_own_sucursal
on public.expenses
for insert
with check (
  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
  and auth.jwt() ->> 'role' = 'manager'
  and branch_id::text = auth.jwt() ->> 'sucursal_id'
);

drop policy if exists expenses_manager_update_own_sucursal on public.expenses;
create policy expenses_manager_update_own_sucursal
on public.expenses
for update
using (
  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
  and auth.jwt() ->> 'role' = 'manager'
  and branch_id::text = auth.jwt() ->> 'sucursal_id'
)
with check (
  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
  and auth.jwt() ->> 'role' = 'manager'
  and branch_id::text = auth.jwt() ->> 'sucursal_id'
);

drop policy if exists expenses_manager_delete_own_sucursal on public.expenses;
create policy expenses_manager_delete_own_sucursal
on public.expenses
for delete
using (
  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
  and auth.jwt() ->> 'role' = 'manager'
  and branch_id::text = auth.jwt() ->> 'sucursal_id'
);

-- TASKS
drop policy if exists tasks_select on public.tasks;
create policy tasks_select
on public.tasks
for select
using (
  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
);

drop policy if exists tasks_write_owner_manager on public.tasks;
create policy tasks_write_owner_manager
on public.tasks
for all
using (
  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
  and auth.jwt() ->> 'role' in ('owner', 'manager')
)
with check (
  (auth.jwt() ->> 'tenant_id')::uuid = tenant_id
  and auth.jwt() ->> 'role' in ('owner', 'manager')
);
