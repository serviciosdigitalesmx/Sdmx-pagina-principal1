alter table public.service_orders
  add column if not exists received_at timestamptz,
  add column if not exists completed_at timestamptz,
  add column if not exists delivered_at timestamptz;
