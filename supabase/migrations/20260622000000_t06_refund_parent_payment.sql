begin;

alter table public.customer_payments
  add column if not exists parent_payment_id uuid references public.customer_payments(id) on delete restrict,
  add column if not exists refund_reason text;

create index if not exists customer_payments_parent_payment_idx
  on public.customer_payments (tenant_id, parent_payment_id)
  where parent_payment_id is not null;

commit;
