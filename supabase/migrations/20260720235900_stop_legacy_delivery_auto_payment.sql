create or replace function public._sync_order_status_audit_and_payment()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'UPDATE' and coalesce(old.status, '') is distinct from coalesce(new.status, '') then
    insert into public.service_order_status_history (
      tenant_id,
      service_order_id,
      previous_status,
      new_status,
      comment,
      changed_by,
      created_at
    ) values (
      new.tenant_id,
      new.id,
      old.status,
      new.status,
      null,
      new.updated_by,
      timezone('utc', now())
    );
  end if;

  return new;
end;
$$;
