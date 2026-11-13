import { supabase } from './supabase';

/** Payment row as stored in Supabase (public.payments, supabase/tamara.sql) */
export interface Payment {
  id: string;
  created_at: string;
  booking_id: string | null;
  booking_ref: string | null;
  source: 'online' | 'link';
  amount: number;
  currency: string;
  description: string;
  status: 'pending' | 'paid' | 'cancelled' | 'refunded';
  tamara_order_id: string | null;
  tamara_status: string | null;
  paid_at: string | null;
}

/** What the /pay page is allowed to see about a payment */
export interface PublicPayment {
  id: string;
  status: Payment['status'];
  amount: number;
  description: string;
  ref: string | null;
  lastAttempt: string | null;
  error?: string;
}

/**
 * Calls the tamara-checkout edge function. The merchant key lives only there, so the browser
 * never talks to Tamara's API directly.
 */
export const callTamara = async <T>(body: Record<string, unknown>): Promise<T> => {
  if (!supabase) throw new Error('Supabase is not configured');
  const { data, error } = await supabase.functions.invoke('tamara-checkout', { body });
  if (error) {
    // Non-2xx: the function's JSON body ({ error: '...' }) is on error.context
    let code = error.message;
    try {
      const res = (error as { context?: Response }).context;
      if (res) code = (await res.json()).error ?? code;
    } catch {
      /* keep the generic message */
    }
    throw new Error(code);
  }
  return data as T;
};

export const formatSar = (amount: number) =>
  `${amount.toLocaleString('ar-SA-u-nu-latn', { maximumFractionDigits: 2 })} ريال`;
