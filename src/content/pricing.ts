import type { ServiceItem } from './types';

/**
 * Price a customer can pay online with Tamara for this service, or null when it is priced after a
 * site visit. An explicit onlinePrice wins (0 turns online payment off); otherwise a green badge
 * that is exactly a price ("150 ريال") counts, but not "120 ريال / فيش" or "200 ريال (تُخصم)".
 *
 * The edge function repeats this rule (supabase/functions/_shared/tamara.ts) and is what decides
 * the amount actually charged — keep the two in sync.
 */
export const onlinePriceOf = (item: Pick<ServiceItem, 'badge' | 'badgeTone' | 'onlinePrice'>): number | null => {
  if (typeof item.onlinePrice === 'number') return item.onlinePrice >= 1 ? item.onlinePrice : null;
  if (item.badgeTone !== 'price') return null;
  const match = item.badge.trim().match(/^(\d{1,6})\s*(ريال|ر\.?\s?س\.?|SAR)$/i);
  return match ? Number(match[1]) : null;
};
