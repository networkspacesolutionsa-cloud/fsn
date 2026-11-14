import React, { useState } from 'react';
import { Check, Copy, CreditCard, Link2, MessageCircle, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Payment, callTamara, formatSar } from '../lib/tamara';
import { Button } from './ui';

const STATUS: Record<Payment['status'], { label: string; className: string }> = {
  pending: { label: 'بانتظار الدفع', className: 'bg-amber-100 text-amber-800' },
  paid: { label: 'مدفوع', className: 'bg-emerald-100 text-emerald-800' },
  cancelled: { label: 'ملغي', className: 'bg-slate-200 text-slate-600' },
  refunded: { label: 'مسترد', className: 'bg-slate-200 text-slate-600' },
};

const LAST_ATTEMPT: Record<string, string> = {
  new: 'فتح العميل صفحة الدفع ولم يكملها بعد',
  declined: 'آخر محاولة: رفضتها تمارا',
  expired: 'آخر محاولة: انتهت مهلتها',
  approved: 'تمت الموافقة، جارٍ التأكيد',
};

const ERRORS: Record<string, string> = {
  bad_amount: 'المبلغ يجب أن يكون بين 1 و 100,000 ريال.',
  forbidden: 'انتهت جلسة الدخول، سجّل الدخول من جديد.',
  booking_not_found: 'لم يُعثر على الطلب.',
};

export const payUrl = (p: Payment) => `${window.location.origin}/pay/?id=${p.id}`;

interface Props {
  booking: { id: string; name: string; phone: string; ref: string | null };
  payments: Payment[];
  onChange: (payment: Payment) => void;
}

/** Tamara payments of one booking: their status, and payment links for quoted jobs */
export const BookingPayments: React.FC<Props> = ({ booking, payments, onChange }) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  const copy = async (p: Payment) => {
    await navigator.clipboard?.writeText(payUrl(p));
    setCopied(p.id);
    setTimeout(() => setCopied(''), 2000);
  };

  const sendWhatsApp = (p: Payment) => {
    const text = `مرحبًا ${booking.name}،
شكرًا لاختيارك فضاء الشبكات.${booking.ref ? `\nرقم الطلب: ${booking.ref}` : ''}
المبلغ: ${formatSar(Number(p.amount))} (${p.description})
يمكنك الدفع وتقسيمه على دفعات بدون فوائد عبر تمارا من هذا الرابط:
${payUrl(p)}`;
    window.open(`https://wa.me/${booking.phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const create = async () => {
    setError('');
    const value = Number(amount);
    if (!Number.isFinite(value) || value < 1 || value > 100000) return setError(ERRORS.bad_amount);
    setCreating(true);
    try {
      const { payment } = await callTamara<{ payment: Payment }>({ action: 'link', bookingId: booking.id, amount: value, note });
      onChange(payment);
      setOpen(false);
      setAmount('');
      setNote('');
      copy(payment).catch(() => {});
    } catch (err) {
      setError(ERRORS[(err as Error).message] ?? `تعذر إنشاء الرابط (${(err as Error).message})`);
    }
    setCreating(false);
  };

  const cancel = async (p: Payment) => {
    if (!window.confirm(`إلغاء رابط دفع ${formatSar(Number(p.amount))}؟ لن يستطيع العميل الدفع منه بعد ذلك.`)) return;
    const { data, error } = await supabase!
      .from('payments')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', p.id)
      .select('*')
      .single();
    if (error) return alert('تعذر الإلغاء: ' + error.message);
    onChange(data as Payment);
  };

  return (
    <div className="rounded-xl border border-slate-200 p-3 space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5 text-blue-600" /> الدفع عبر تمارا
        </span>
        {!open && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg cursor-pointer"
          >
            <Link2 className="w-3.5 h-3.5" /> إنشاء رابط دفع
          </button>
        )}
      </div>

      {payments.length === 0 && !open && <p className="text-[11px] text-slate-400">لا توجد مدفوعات لهذا الطلب.</p>}

      {payments.map((p) => (
        <div key={p.id} className="bg-slate-50 rounded-lg p-2.5 text-xs space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-black text-slate-900">{formatSar(Number(p.amount))}</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${STATUS[p.status].className}`}>{STATUS[p.status].label}</span>
          </div>
          <p className="text-slate-600">
            {p.description} · {p.source === 'online' ? 'دفع من العميل' : 'رابط دفع'}
          </p>
          {p.status === 'paid' && p.paid_at && (
            <p className="text-emerald-700">دُفع في {new Date(p.paid_at).toLocaleString('ar', { dateStyle: 'medium', timeStyle: 'short' })}</p>
          )}
          {p.status === 'pending' && p.tamara_status && LAST_ATTEMPT[p.tamara_status] && (
            <p className="text-slate-500">{LAST_ATTEMPT[p.tamara_status]}</p>
          )}
          {p.status === 'pending' && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => sendWhatsApp(p)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" /> إرسال للعميل واتساب
              </button>
              <button
                type="button"
                onClick={() => copy(p)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
              >
                {copied === p.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied === p.id ? 'تم النسخ' : 'نسخ الرابط'}
              </button>
              <button
                type="button"
                onClick={() => cancel(p)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-red-600 hover:bg-red-50 font-semibold cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> إلغاء
              </button>
            </div>
          )}
        </div>
      ))}

      {open && (
        <div className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-[8rem_1fr] gap-2">
            <input
              type="number"
              inputMode="decimal"
              min={1}
              max={100000}
              dir="ltr"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="المبلغ (ريال)"
              className="px-3 py-2 rounded-lg border border-slate-300 text-sm text-right"
            />
            <input
              type="text"
              value={note}
              maxLength={200}
              onChange={(e) => setNote(e.target.value)}
              placeholder="وصف يراه العميل (اختياري، مثال: تركيب 6 كاميرات)"
              className="px-3 py-2 rounded-lg border border-slate-300 text-sm text-right"
            />
          </div>
          {error && <p className="text-[11px] text-red-600">{error}</p>}
          <div className="flex gap-2">
            <Button onClick={create} loading={creating} className="!px-3 !py-2 !text-xs">
              إنشاء الرابط
            </Button>
            <Button variant="ghost" onClick={() => setOpen(false)} className="!px-3 !py-2 !text-xs">
              إلغاء
            </Button>
          </div>
          <p className="text-[11px] text-slate-500">الرابط لا تنتهي صلاحيته حتى يُدفع أو تلغيه، ويُنسخ تلقائيًا بعد إنشائه.</p>
        </div>
      )}
    </div>
  );
};
