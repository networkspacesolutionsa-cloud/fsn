/**
 * Saudi mobile number validation.
 *
 * Accepts the ways people actually type a KSA mobile:
 *   05XXXXXXXX · 5XXXXXXXX · 9665XXXXXXXX · +9665XXXXXXXX · 009665XXXXXXXX
 * with optional spaces, dashes or brackets, and Arabic-Indic digits (٠١٢…).
 *
 * Returns the number in canonical international form "9665XXXXXXXX", or null if it is
 * not a valid Saudi mobile number.
 */

const ARABIC_INDIC = '٠١٢٣٤٥٦٧٨٩';
const EXTENDED_ARABIC_INDIC = '۰۱۲۳۴۵۶۷۸۹';

const toLatinDigits = (value: string) =>
  value.replace(/[٠-٩۰-۹]/g, (ch) => {
    const i = ARABIC_INDIC.indexOf(ch);
    return String(i !== -1 ? i : EXTENDED_ARABIC_INDIC.indexOf(ch));
  });

export const normalizeSaudiPhone = (raw: string): string | null => {
  let digits = toLatinDigits(raw).replace(/[\s\-().]/g, '');
  if (digits.startsWith('+')) digits = digits.slice(1);
  if (!/^\d+$/.test(digits)) return null;

  if (digits.startsWith('00966')) digits = digits.slice(5);
  else if (digits.startsWith('966')) digits = digits.slice(3);
  else if (digits.startsWith('0')) digits = digits.slice(1);

  // Saudi mobiles: 9 digits starting with 5
  return /^5\d{8}$/.test(digits) ? `966${digits}` : null;
};

export const isSaudiPhone = (raw: string) => normalizeSaudiPhone(raw) !== null;

/** "9665XXXXXXXX" → "05X XXX XXXX" for display */
export const formatSaudiPhone = (normalized: string) => {
  const local = `0${normalized.slice(3)}`;
  return `${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
};

export const SAUDI_PHONE_ERROR = 'يرجى إدخال رقم جوال سعودي صحيح يبدأ بـ 05 (مثال: 05xxxxxxxx).';
