# AUDIT EVIDENCE_METADATA

## ESCRITURAS
apps/api/src/controllers/orders.ts:580:        evidence_metadata: appendEvidenceEntry(data.evidence_metadata, {
apps/api/src/controllers/orders.ts:891:          evidence_metadata: appendEvidenceEntry(latestDocumentEvidence?.evidence_metadata, {
apps/api/src/controllers/orders.ts:960:          evidence_metadata: appendEvidenceEntry(latestReceiptOrder?.evidence_metadata, {
apps/api/src/controllers/orders.ts:1067:      .update({ evidence_metadata: appendEvidenceEntry((order as { evidence_metadata?: unknown }).evidence_metadata, noteEntry) })
apps/api/src/controllers/orders.ts:1167:        evidence_metadata: appendEvidenceEntry(data.evidence_metadata, {
apps/api/src/controllers/orders.ts:1278:          evidence_metadata: appendEvidenceEntry((order as { evidence_metadata?: unknown }).evidence_metadata, noteEntry),
apps/api/src/controllers/orders.ts:1524:        evidence_metadata: appendEvidenceEntry(order.evidence_metadata, {
apps/api/src/controllers/orders.ts:1067:      .update({ evidence_metadata: appendEvidenceEntry((order as { evidence_metadata?: unknown }).evidence_metadata, noteEntry) })

## TODAS LAS REFERENCIAS BACKEND
apps/api/src/controllers/orders.ts:580:        evidence_metadata: appendEvidenceEntry(data.evidence_metadata, {
apps/api/src/controllers/orders.ts:757:    const evidenceMetadata = readEvidenceMetadata(orderResult.data.evidence_metadata);
apps/api/src/controllers/orders.ts:810:      .select('id, tenant_id, evidence_metadata')
apps/api/src/controllers/orders.ts:883:        .select('evidence_metadata')
apps/api/src/controllers/orders.ts:891:          evidence_metadata: appendEvidenceEntry(latestDocumentEvidence?.evidence_metadata, {
apps/api/src/controllers/orders.ts:943:        .select('evidence_metadata')
apps/api/src/controllers/orders.ts:960:          evidence_metadata: appendEvidenceEntry(latestReceiptOrder?.evidence_metadata, {
apps/api/src/controllers/orders.ts:1041:      .select('id, status, evidence_metadata')
apps/api/src/controllers/orders.ts:1067:      .update({ evidence_metadata: appendEvidenceEntry((order as { evidence_metadata?: unknown }).evidence_metadata, noteEntry) })
apps/api/src/controllers/orders.ts:1125:      .select('id, status, evidence_metadata')
apps/api/src/controllers/orders.ts:1167:        evidence_metadata: appendEvidenceEntry(data.evidence_metadata, {
apps/api/src/controllers/orders.ts:1229:      .select('id, estimated_cost, final_cost, evidence_metadata')
apps/api/src/controllers/orders.ts:1278:          evidence_metadata: appendEvidenceEntry((order as { evidence_metadata?: unknown }).evidence_metadata, noteEntry),
apps/api/src/controllers/orders.ts:1481:      .select('id, warranty_until, evidence_metadata')
apps/api/src/controllers/orders.ts:1524:        evidence_metadata: appendEvidenceEntry(order.evidence_metadata, {
apps/api/src/controllers/public.ts:351:      .select('id, tenant_id, folio, status, created_at, updated_at, promised_date, device_info, problem_description, serial_number, receipt_url, estimated_cost, final_cost, evidence_metadata, metadata')
apps/api/src/controllers/public.ts:382:    const evidenceMetadata = Array.isArray(data.evidence_metadata) ? data.evidence_metadata : [];

## TODAS LAS REFERENCIAS FRONTEND

## DOCUMENTOS
apps/api/src/controllers/orders.ts:303:  const { error } = await supabase.from('service_order_documents').insert([row]);
apps/api/src/controllers/orders.ts:305:    throw new Error(`Failed to persist service_order_documents: ${error.message}`);
apps/api/src/controllers/orders.ts:724:        .from('service_order_documents')
apps/api/src/controllers/public.ts:361:      .from('service_order_documents')
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:52:alter table if exists public.service_order_documents enable row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:73:alter table if exists public.service_order_documents force row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:268:  if to_regclass('public.service_order_documents') is not null then
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:269:    execute 'drop policy if exists service_order_documents_select on public.service_order_documents';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:271:      create policy service_order_documents_select
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:272:      on public.service_order_documents
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:277:    execute 'drop policy if exists service_order_documents_write_owner_manager on public.service_order_documents';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:279:      create policy service_order_documents_write_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:280:      on public.service_order_documents
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:642:  if to_regclass('public.service_order_documents') is not null then
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:643:    grant select, insert, update, delete on public.service_order_documents to authenticated;
supabase/migrations/20260523190000_order_documents_events.sql:1:create table if not exists public.service_order_documents (
supabase/migrations/20260523190000_order_documents_events.sql:16:create index if not exists service_order_documents_tenant_order_idx
supabase/migrations/20260523190000_order_documents_events.sql:17:  on public.service_order_documents (tenant_id, service_order_id, created_at desc);
supabase/migrations/20260523190000_order_documents_events.sql:32:alter table public.service_order_documents enable row level security;
supabase/migrations/20260523190000_order_documents_events.sql:34:drop policy if exists service_order_documents_select on public.service_order_documents;
supabase/migrations/20260523190000_order_documents_events.sql:35:create policy service_order_documents_select
supabase/migrations/20260523190000_order_documents_events.sql:36:on public.service_order_documents
supabase/migrations/20260523190000_order_documents_events.sql:39:drop policy if exists service_order_documents_write_owner_manager on public.service_order_documents;
supabase/migrations/20260523190000_order_documents_events.sql:40:create policy service_order_documents_write_owner_manager
supabase/migrations/20260523190000_order_documents_events.sql:41:on public.service_order_documents

## EVENTS
apps/api/src/controllers/orders.ts:319:  const { error } = await supabase.from('service_order_events').insert([row]);
apps/api/src/controllers/orders.ts:321:    throw new Error(`Failed to persist service_order_events: ${error.message}`);
apps/api/src/controllers/orders.ts:730:        .from('service_order_events')
apps/api/src/controllers/public.ts:372:      .from('service_order_events')
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:53:alter table if exists public.service_order_events enable row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:74:alter table if exists public.service_order_events force row level security;
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:288:  if to_regclass('public.service_order_events') is not null then
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:289:    execute 'drop policy if exists service_order_events_select on public.service_order_events';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:291:      create policy service_order_events_select
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:292:      on public.service_order_events
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:297:    execute 'drop policy if exists service_order_events_write_owner_manager on public.service_order_events';
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:299:      create policy service_order_events_write_owner_manager
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:300:      on public.service_order_events
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:648:  if to_regclass('public.service_order_events') is not null then
supabase/migrations/20260527083000_harden_tenant_isolation_rls.sql:649:    grant select, insert, update, delete on public.service_order_events to authenticated;
supabase/migrations/20260523190000_order_documents_events.sql:18:create table if not exists public.service_order_events (
supabase/migrations/20260523190000_order_documents_events.sql:30:create index if not exists service_order_events_tenant_order_idx
supabase/migrations/20260523190000_order_documents_events.sql:31:  on public.service_order_events (tenant_id, service_order_id, created_at desc);
supabase/migrations/20260523190000_order_documents_events.sql:33:alter table public.service_order_events enable row level security;
supabase/migrations/20260523190000_order_documents_events.sql:45:drop policy if exists service_order_events_select on public.service_order_events;
supabase/migrations/20260523190000_order_documents_events.sql:46:create policy service_order_events_select
supabase/migrations/20260523190000_order_documents_events.sql:47:on public.service_order_events
supabase/migrations/20260523190000_order_documents_events.sql:50:drop policy if exists service_order_events_write_owner_manager on public.service_order_events;
supabase/migrations/20260523190000_order_documents_events.sql:51:create policy service_order_events_write_owner_manager
supabase/migrations/20260523190000_order_documents_events.sql:52:on public.service_order_events
