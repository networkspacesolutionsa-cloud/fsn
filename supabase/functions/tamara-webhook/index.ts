// Tamara calls this when an order changes (approved, declined, expired, captured, refunded...).
// Deployed with --no-verify-jwt: Tamara can't send a Supabase key, so the request is checked with
// the tamaraToken it signs using our Notification Token instead.
import { TamaraError, adminDb, json, syncOrder, verifyTamaraToken } from '../_shared/tamara.ts';

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const token =
    new URL(req.url).searchParams.get('tamaraToken') ??
    req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '') ??
    null;
  if (!(await verifyTamaraToken(token))) return json({ error: 'unauthorized' }, 401);

  let event: { order_id?: string; event_type?: string };
  try {
    event = await req.json();
  } catch {
    return json({ error: 'bad_request' }, 400);
  }
  if (!event.order_id) return json({ ok: true, ignored: 'no order_id' });

  try {
    // The status comes from Tamara's API, not from the notification body
    const payment = await syncOrder(adminDb(), event.order_id);
    console.log(`tamara ${event.event_type} ${event.order_id} → ${payment ? `payment ${payment.id} ${payment.status}` : 'not a website payment'}`);
    return json({ ok: true });
  } catch (err) {
    console.error('webhook failed', event.event_type, event.order_id, err instanceof TamaraError ? JSON.stringify(err.body) : err);
    // Non-2xx so Tamara retries; the /pay page also re-checks when the customer comes back
    return json({ error: 'processing_failed' }, 500);
  }
});
