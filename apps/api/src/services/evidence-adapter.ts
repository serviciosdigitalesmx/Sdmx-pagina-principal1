import { supabaseAdmin } from '@white-label/database';

export type EvidenceAdapterMode = 'legacy' | 'normalized';

export type EvidenceEntry =
  | {
      kind: 'document';
      id: string;
      file_name: string;
      file_type: 'intake_photo' | 'attachment_pdf' | 'receipt_pdf';
      public_url: string | null;
      mime_type: string;
      created_at: string;
    }
  | {
      kind: 'event';
      id: string;
      event_type: string;
      previous_status: string | null;
      new_status: string | null;
      note: string | null;
      actor_name: string | null;
      created_at: string;
    };

export async function getEvidenceMetadata(orderId: string, mode: EvidenceAdapterMode = 'legacy'): Promise<EvidenceEntry[] | null> {
  if (mode === 'legacy') {
    const { data, error } = await supabaseAdmin.from('service_orders').select('evidence_metadata').eq('id', orderId).maybeSingle();
    if (error) throw error;
    return (data?.evidence_metadata as EvidenceEntry[]) ?? null;
  }

  // normalized mode: fetch from service_order_events and service_order_documents
  const { data: events, error: eventsError } = await supabaseAdmin
    .from('service_order_events')
    .select('id, event_type, previous_status, new_status, note, actor_name, created_at')
    .eq('service_order_id', orderId)
    .order('created_at', { ascending: true });
  if (eventsError) throw eventsError;

  const { data: documents, error: docsError } = await supabaseAdmin
    .from('service_order_documents')
    .select('id, file_name, file_type, public_url, mime_type, created_at')
    .eq('service_order_id', orderId)
    .order('created_at', { ascending: true });
  if (docsError) throw docsError;

  const allEvidence: EvidenceEntry[] = [];

  // Map events to EvidenceEntry with kind: 'event'
  (events ?? []).forEach(event => {
    allEvidence.push({
      kind: 'event',
      id: event.id,
      event_type: event.event_type,
      previous_status: event.previous_status,
      new_status: event.new_status,
      note: event.note,
      actor_name: event.actor_name,
      created_at: event.created_at,
    });
  });

  // Map documents to EvidenceEntry with kind: 'document'
  (documents ?? []).forEach(doc => {
    allEvidence.push({
      kind: 'document',
      id: doc.id,
      file_name: doc.file_name,
      file_type: doc.file_type,
      public_url: doc.public_url,
      mime_type: doc.mime_type,
      created_at: doc.created_at,
    });
  });

  // Sort by created_at to maintain append order
  allEvidence.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  return allEvidence.length > 0 ? allEvidence : null;
}
