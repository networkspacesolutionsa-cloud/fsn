// Shared Tamara helpers for the edge functions (Deno).
// Secrets (set with `supabase secrets set`, never in the website code):
//   TAMARA_API_URL            https://api.tamara.co (or https://api-sandbox.tamara.co for testing)
//   TAMARA_API_TOKEN          Merchant API token
//   TAMARA_NOTIFICATION_TOKEN Signs the webhooks Tamara sends us
//   SITE_URL                  https://netspacesol.com — where customers come back after paying
import { createClient, SupabaseClient } from 'npm:@supabase/supabase-js@2.49.4';

const env = (name: string) => {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing secret ${name}`);
  return value;
};

export const CURRENCY = 'SAR';
export const MIN_AMOUNT = 1;
export const MAX_AMOUNT = 100000;

export const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

/** Service-role client: bypasses RLS, only used inside the edge functions */
export const adminDb = (): SupabaseClient =>
  createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), { auth: { persistSession: false } });

export const siteUrl = () => env('SITE_URL').replace(/\/+$/, '');

export class TamaraError extends Error {
  constructor(message: string, readonly status: number, readonly body: unknown) {
    super(message);
  }
}

export const tamara = async <T = Record<string, unknown>>(path: string, init: { method?: string; body?: unknown } = {}) => {
  const res = await fetch(`${env('TAMARA_API_URL').replace(/\/+$/, '')}${path}`, {
    method: init.method ?? 'GET',
    headers: { Authorization: `Bearer ${env('TAMARA_API_TOKEN')}`, 'Content-Type': 'application/json' },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  const text = await res.text();
  let body: unknown = text;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    /* keep the raw text */
  }
  if (!res.ok) throw new TamaraError(`Tamara ${init.method ?? 'GET'} ${path} → HTTP ${res.status}`, res.status, body);
  return body as T;
};

const money = (amount: number) => ({ amount, currency: CURRENCY });

/* ---------------- Prices ---------------- */

interface ServiceItem {
  id: string;
  title: string;
  badge: string;
  badgeTone: 'price' | 'info';
  onlinePrice?: number | null;
}
interface ServiceCategory {
  name: string;
  items: ServiceItem[];
}

/**
 * Price a customer can pay online for a service, or null when it is priced after a visit.
 * Keep in sync with onlinePriceOf() in src/content/pricing.ts.
 */
export const onlinePriceOf = (item: ServiceItem): number | null => {
  if (typeof item.onlinePrice === 'number') return item.onlinePrice >= MIN_AMOUNT ? item.onlinePrice : null;
  if (item.badgeTone !== 'price') return null;
  const match = item.badge.trim().match(/^(\d{1,6})\s*(ريال|ر\.?\s?س\.?|SAR)$/i);
  return match ? Number(match[1]) : null;
};

/** Looks the price up in the content saved from the control panel, never from what the browser sends */
export const findServicePrice = async (db: SupabaseClient, department: string | null, service: string | null) => {
  if (!department || !service) return null;
  const { data } = await db.from('site_content').select('data').eq('key', 'services').maybeSingle();
  const categories = (data?.data ?? []) as ServiceCategory[];
  const item = categories.find((c) => c.name === department)?.items.find((i) => i.title === service);
  if (!item) return null;
  const price = onlinePriceOf(item);
  return price === null ? null : { item, price };
};

/* ---------------- Checkout ---------------- */

export interface Payment {
  id: string;
  booking_id: string | null;
  booking_ref: string | null;
  source: 'online' | 'link';
  amount: number;
  description: string;
  status: 'pending' | 'paid' | 'cancelled' | 'refunded';
  tamara_order_id: string | null;
  tamara_status: string | null;
}

interface BookingRow {
  name: string;
  phone: string;
  city: string | null;
  location: string | null;
}

const splitName = (full: string) => {
  const parts = full.trim().split(/\s+/);
  const first = parts[0] || 'عميل';
  return { first_name: first, last_name: parts.slice(1).join(' ') || first };
};

/** Starts a fresh Tamara checkout for a pending payment and returns where to send the customer */
export const startCheckout = async (db: SupabaseClient, payment: Payment) => {
  const { data: booking } = payment.booking_id
    ? await db.from('bookings').select('name, phone, city, location').eq('id', payment.booking_id).maybeSingle<BookingRow>()
    : { data: null };
  const name = splitName(booking?.name ?? 'عميل فضاء الشبكات');
  const phone = booking?.phone ? `+${booking.phone.replace(/^\+/, '')}` : undefined;
  const city = booking?.city || 'الرياض';
  const back = (result: string) => `${siteUrl()}/pay/?id=${payment.id}&result=${result}`;
  const amount = Number(payment.amount);

  const session = await tamara<{ order_id: string; checkout_url: string }>('/checkout', {
    method: 'POST',
    body: {
      order_reference_id: payment.id,
      order_number: payment.booking_ref ?? payment.id.slice(0, 8),
      total_amount: money(amount),
      description: payment.description,
      country_code: 'SA',
      payment_type: 'PAY_BY_INSTALMENTS',
      locale: 'ar_SA',
      items: [
        {
          reference_id: payment.id,
          type: 'Digital',
          name: payment.description,
          sku: payment.source === 'online' ? 'SERVICE' : 'QUOTE',
          quantity: 1,
          unit_price: money(amount),
          total_amount: money(amount),
        },
      ],
      consumer: { ...name, ...(phone ? { phone_number: phone } : {}) },
      shipping_address: {
        ...name,
        line1: (booking?.location || city).slice(0, 255),
        city,
        country_code: 'SA',
        ...(phone ? { phone_number: phone } : {}),
      },
      tax_amount: money(0),
      shipping_amount: money(0),
      merchant_url: { success: back('success'), failure: back('failure'), cancel: back('cancel') },
      platform: 'netspacesol.com',
    },
  });

  await db
    .from('payments')
    .update({ tamara_order_id: session.order_id, tamara_status: 'new', updated_at: new Date().toISOString() })
    .eq('id', payment.id);
  return session.checkout_url;
};

/* ---------------- Order status ---------------- */

interface TamaraOrder {
  order_id: string;
  order_reference_id: string;
  status: string;
  total_amount: { amount: number; currency: string };
}

const PAID = ['authorised', 'partially_captured', 'fully_captured'];

const logRace = (err: unknown) => {
  if (!(err instanceof TamaraError)) throw err;
  console.warn(err.message, JSON.stringify(err.body));
};

/**
 * Reads the order from Tamara (never trusting what a redirect or webhook claims), authorises and
 * captures it once the customer is approved, and stores the result on the payment.
 */
export const syncOrder = async (db: SupabaseClient, orderId: string) => {
  let order = await tamara<TamaraOrder>(`/orders/${encodeURIComponent(orderId)}`);

  const { data: payment } = await db.from('payments').select('*').eq('id', order.order_reference_id).maybeSingle<Payment>();
  // Not one of ours (e.g. an order made another way on the same Tamara account)
  if (!payment) return null;

  // Another attempt for this payment already went through: leave this one unauthorised so it expires
  if (payment.status === 'paid' && payment.tamara_order_id !== order.order_id) return payment;

  if (order.status === 'approved') {
    if (Number(order.total_amount.amount) !== Number(payment.amount) || order.total_amount.currency !== CURRENCY) {
      throw new Error(`Amount mismatch on Tamara order ${orderId}`);
    }
    // The webhook and the customer's return can arrive together: if the other one won, just re-read
    await tamara(`/orders/${encodeURIComponent(order.order_id)}/authorise`, { method: 'POST' }).catch(logRace);
    order = await tamara<TamaraOrder>(`/orders/${encodeURIComponent(order.order_id)}`);
  }

  // A service booking is "delivered" when the payment is confirmed: capture straight away so it settles
  if (order.status === 'authorised') {
    await tamara('/payments/capture', {
      method: 'POST',
      body: {
        order_id: order.order_id,
        total_amount: money(Number(payment.amount)),
        shipping_info: { shipped_at: new Date().toISOString(), shipping_company: 'FSN' },
      },
    }).catch(logRace);
    order = await tamara<TamaraOrder>(`/orders/${encodeURIComponent(order.order_id)}`);
  }

  const update: Record<string, unknown> = {
    tamara_order_id: order.order_id,
    tamara_status: order.status,
    updated_at: new Date().toISOString(),
  };
  if (PAID.includes(order.status) && payment.status !== 'paid') {
    update.status = 'paid';
    update.paid_at = new Date().toISOString();
  } else if (order.status === 'fully_refunded') {
    update.status = 'refunded';
  } else if (order.status === 'canceled' && payment.status === 'paid') {
    update.status = 'cancelled';
  }
  // declined / expired: the payment stays pending so the customer can try again from the same link

  const { data: saved } = await db.from('payments').update(update).eq('id', payment.id).select('*').single<Payment>();
  return saved ?? payment;
};

/* ---------------- Webhook signature ---------------- */

const b64url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

/** Tamara signs each notification as an HS256 JWT ("tamaraToken") with the Notification Token */
export const verifyTamaraToken = async (token: string | null) => {
  if (!token) return false;
  const [header, payload, signature] = token.split('.');
  if (!header || !payload || !signature) return false;
  try {
    const alg = JSON.parse(atob(header.replace(/-/g, '+').replace(/_/g, '/'))).alg;
    if (alg !== 'HS256') return false;
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(env('TAMARA_NOTIFICATION_TOKEN')),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const expected = b64url(
      new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${header}.${payload}`)))
    );
    if (expected.length !== signature.length) return false;
    let diff = 0;
    for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
    if (diff !== 0) return false;
    const claims = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return typeof claims.exp !== 'number' || claims.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};
