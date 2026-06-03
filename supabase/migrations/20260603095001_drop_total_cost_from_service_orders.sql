-- Drop legacy total_cost after migrating all runtime consumers to final_cost.
-- Preconditions already validated:
-- 1) service_orders.final_cost is the canonical charged amount.
-- 2) service_orders.estimated_cost is the quote/estimate.
-- 3) total_cost was backfilled to final_cost before this migration.

alter table public.service_orders
  drop constraint if exists service_orders_total_cost_check;

alter table public.service_orders
  drop column if exists total_cost;
