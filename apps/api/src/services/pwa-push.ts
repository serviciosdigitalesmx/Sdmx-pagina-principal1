import webpush from 'web-push';
import { supabaseAdmin } from '@white-label/database';

let configured = false;

function ensureConfigured() {
  if (configured) {
    return;
  }

  const publicKey = process.env.PWA_VAPID_PUBLIC_KEY?.trim();
  const privateKey = process.env.PWA_VAPID_PRIVATE_KEY?.trim();
  const subject = process.env.PWA_VAPID_SUBJECT?.trim();

  if (!publicKey || !privateKey || !subject) {
    return;
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  configured = true;
}

export async function sendTenantPushNotification(tenantId: string, payload: Record<string, unknown>) {
  ensureConfigured();

  const publicKey = process.env.PWA_VAPID_PUBLIC_KEY?.trim();
  const privateKey = process.env.PWA_VAPID_PRIVATE_KEY?.trim();
  const subject = process.env.PWA_VAPID_SUBJECT?.trim();

  if (!publicKey || !privateKey || !subject) {
    return { sent: 0, skipped: true };
  }

  const { data: subscriptions, error } = await supabaseAdmin
    .from('pwa_push_subscriptions')
    .select('id, endpoint, p256dh, auth, active')
    .eq('tenant_id', tenantId)
    .eq('active', true);

  if (error || !subscriptions) {
    throw new Error(error?.message ?? 'Failed to load push subscriptions');
  }

  const message = JSON.stringify(payload);
  let sent = 0;

  for (const subscription of subscriptions) {
    try {
      await webpush.sendNotification({
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth,
        },
      }, message);
      sent += 1;
    } catch (pushError) {
      const statusCode = typeof pushError === 'object' && pushError && 'statusCode' in pushError ? Number((pushError as { statusCode?: number }).statusCode ?? 0) : 0;
      if (statusCode === 404 || statusCode === 410) {
        await supabaseAdmin
          .from('pwa_push_subscriptions')
          .update({ active: false })
          .eq('id', subscription.id);
      }
    }
  }

  await supabaseAdmin.from('notification_events').insert([{
    tenant_id: tenantId,
    channel: 'push',
    event_type: String(payload.type ?? 'unknown'),
    recipient: 'tenant_subscribers',
    payload_json: payload,
    status: sent > 0 ? 'sent' : 'pending',
    sent_at: sent > 0 ? new Date().toISOString() : null,
  }]);

  return { sent, skipped: false };
}

