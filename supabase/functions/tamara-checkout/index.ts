// POST { action, ... } — everything the website and control panel need from Tamara:
//   booking  { ref }                       visitor: pay a fixed-price service right after booking → { url }
//   custom   { name, phone, amount, ref?, note? }  visitor: /pay page, pay a quoted amount → { url }
//   link     { bookingId, amount, note? }  admin:   create a payment link for a quoted job → { payment, payUrl }
//   info     { id, sync? }                 /pay page: amount and status (sync = re-check with Tamara)
//   start    { id }                        /pay page: open a fresh Tamara checkout → { url }
import { createClient } from 'npm:@supabase/supabase-js@2.49.4';
import {
  MAX_AMOUNT,
  MIN_AMOUNT,
  Payment,
  TamaraError,
  adminDb,
  cors,
  findServicePrice,
  json,
  siteUrl,
  startCheckout,
  syncOrder,
} from '../_shared/tamara.ts';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const validAmount = (amount: number) =>
  Number.isFinite(amount) && amount >= MIN_AMOUNT && amount <= MAX_AMOUNT && Math.abs(Math.round(amount * 100) - amount * 100) < 1e-6;

/** Same rule as src/lib/phone.ts: Saudi mobile → "9665XXXXXXXX", else null */
const normalizeSaudiPhone = (raw: string) => {
  let digits = raw
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[\s\-().]/g, '');
  if (digits.startsWith('+')) digits = digits.slice(1);
  if (!/^\d+$/.test(digits)) return null;
  if (digits.startsWith('00966')) digits = digits.slice(5);
  else if (digits.startsWith('966')) digits = digits.slice(3);
  else if (digits.startsWith('0')) digits = digits.slice(1);
  return /^5\d{8}$/.test(digits) ? `966${digits}` : null;
};

const isAdmin = async (req: Request) => {
  const auth = req.headers.get('Authorization');
  if (!auth) return false;
  const userDb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: auth } },
    auth: { persistSession: false },
  });
  const { data } = await userDb.rpc('is_admin');
  return data === true;
};

const publicView = (p: Payment) => ({
  id: p.id,
  status: p.status,
  amount: Number(p.amount),
  description: p.description,
  ref: p.booking_ref,
  lastAttempt: p.tamara_status,
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'bad_request' }, 400);
  }
  const db = adminDb();

  try {
    switch (body.action) {
      case 'booking': {
        const ref = String(body.ref ?? '').trim();
        if (!/^FSN-\d{6}$/.test(ref)) return json({ error: 'bad_request' }, 400);
        const since = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
        const { data: booking } = await db
          .from('bookings')
          .select('id, ref, department, service')
          .eq('ref', ref)
          .gte('created_at', since)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (!booking) return json({ error: 'booking_not_found' }, 404);

        const priced = await findServicePrice(db, booking.department, booking.service);
        if (!priced) return json({ error: 'not_payable_online' }, 422);

        // Pressing "pay" twice for the same booking reuses the same payment
        let { data: payment } = await db
          .from('payments')
          .select('*')
          .eq('booking_id', booking.id)
          .eq('source', 'online')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle<Payment>();
        if (payment?.status === 'paid') return json({ error: 'already_paid' }, 409);
        if (!payment) {
          const inserted = await db
            .from('payments')
            .insert({
              booking_id: booking.id,
              booking_ref: booking.ref,
              source: 'online',
              amount: priced.price,
              description: priced.item.title.slice(0, 200),
            })
            .select('*')
            .single<Payment>();
          if (inserted.error) throw inserted.error;
          payment = inserted.data;
        }
        return json({ url: await startCheckout(db, payment), id: payment.id });
      }

      case 'custom': {
        // Public payment page: the customer pays the amount they were quoted
        const name = String(body.name ?? '').trim().slice(0, 100);
        const phone = normalizeSaudiPhone(String(body.phone ?? ''));
        const amount = Number(body.amount);
        const ref = String(body.ref ?? '').trim().toUpperCase().slice(0, 20);
        const note = String(body.note ?? '').trim().slice(0, 200);
        if (!name) return json({ error: 'bad_name' }, 400);
        if (!phone) return json({ error: 'bad_phone' }, 400);
        if (!validAmount(amount)) return json({ error: 'bad_amount' }, 400);

        // Attach to their booking when the number and phone both match it; otherwise record a new
        // booking so the control panel (and the WhatsApp alert) shows who is paying
        let booking: { id: string; ref: string | null; service: string | null } | null = null;
        if (/^FSN-\d{6}$/.test(ref)) {
          const { data } = await db
            .from('bookings')
            .select('id, ref, service')
            .eq('ref', ref)
            .eq('phone', phone)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
          booking = data;
        }
        if (!booking) {
          const { data, error } = await db
            .from('bookings')
            .insert({
              ref: 'FSN-' + Math.floor(100000 + Math.random() * 900000),
              name,
              phone,
              department: 'دفع إلكتروني',
              service: note || 'دفعة عبر تمارا',
              notes: `دفع عبر صفحة الدفع بالموقع: ${amount} ريال${ref ? ` — رقم الطلب الذي كتبه العميل: ${ref}` : ''}`,
            })
            .select('id, ref, service')
            .single();
          if (error) throw error;
          booking = data;
        }

        const { data: payment, error } = await db
          .from('payments')
          .insert({
            booking_id: booking.id,
            booking_ref: booking.ref,
            source: 'online',
            amount,
            description: (note || booking.service || 'خدمات فضاء الشبكات').slice(0, 200),
          })
          .select('*')
          .single<Payment>();
        if (error) throw error;
        return json({ url: await startCheckout(db, payment), id: payment.id });
      }

      case 'link': {
        if (!(await isAdmin(req))) return json({ error: 'forbidden' }, 403);
        const bookingId = String(body.bookingId ?? '');
        const amount = Number(body.amount);
        if (!UUID.test(bookingId)) return json({ error: 'bad_request' }, 400);
        if (!validAmount(amount)) return json({ error: 'bad_amount' }, 400);
        const { data: booking } = await db.from('bookings').select('id, ref, service, department').eq('id', bookingId).maybeSingle();
        if (!booking) return json({ error: 'booking_not_found' }, 404);
        const note = String(body.note ?? '').trim();
        const description = (note || booking.service || booking.department || 'خدمات فضاء الشبكات').slice(0, 200);

        const { data: payment, error } = await db
          .from('payments')
          .insert({ booking_id: booking.id, booking_ref: booking.ref, source: 'link', amount, description })
          .select('*')
          .single<Payment>();
        if (error) throw error;
        return json({ payment, payUrl: `${siteUrl()}/pay/?id=${payment.id}` });
      }

      case 'info':
      case 'start': {
        const id = String(body.id ?? '');
        if (!UUID.test(id)) return json({ error: 'not_found' }, 404);
        let { data: payment } = await db.from('payments').select('*').eq('id', id).maybeSingle<Payment>();
        if (!payment) return json({ error: 'not_found' }, 404);

        if (body.action === 'info') {
          if (body.sync && payment.tamara_order_id && payment.status === 'pending') {
            const current = payment;
            payment = (await syncOrder(db, payment.tamara_order_id).catch((err) => {
              console.error('sync failed', err instanceof TamaraError ? JSON.stringify(err.body) : err);
              return null;
            })) ?? current;
          }
          return json(publicView(payment));
        }

        if (payment.status !== 'pending') return json({ ...publicView(payment), error: 'not_pending' }, 409);
        return json({ url: await startCheckout(db, payment) });
      }

      default:
        return json({ error: 'bad_request' }, 400);
    }
  } catch (err) {
    if (err instanceof TamaraError) {
      console.error(err.message, JSON.stringify(err.body));
      return json({ error: 'tamara_error', detail: err.body }, 502);
    }
    console.error(err);
    return json({ error: 'server_error' }, 500);
  }
});
