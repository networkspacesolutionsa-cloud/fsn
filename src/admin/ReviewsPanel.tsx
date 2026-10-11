import React, { useEffect, useState } from 'react';
import { Check, Copy, Eye, EyeOff, MessageCircle, RefreshCw, Star, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button, LoadingBlock, PanelHeader } from './ui';

interface ReviewRow {
  id: string;
  created_at: string;
  name: string;
  location: string | null;
  service: string | null;
  rating: number;
  comment: string;
  approved: boolean;
}

// Link sent to a customer after a job; /?review opens the review form on the site
const reviewLink = () => `${(import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/+$/, '')}/?review`;

const reviewRequestMessage = () =>
  `مرحباً، شكراً لاختيارك فضاء الشبكات FSN 🌟\nيسعدنا أن تشاركنا رأيك في الخدمة، لن يستغرق أكثر من دقيقة:\n${reviewLink()}`;

const RequestReviewCard: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(reviewRequestMessage());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('انسخ الرسالة:', reviewRequestMessage());
    }
  };
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-5 mb-5 flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        <h3 className="text-sm font-black text-slate-900">اطلب تقييماً من عميل</h3>
        <p className="text-xs text-slate-600 mt-1">
          بعد انتهاء العمل أرسل للعميل هذا الرابط، يفتح نموذج التقييم مباشرة:{' '}
          <span dir="ltr" className="font-mono text-blue-700 break-all">
            {reviewLink()}
          </span>
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(reviewRequestMessage())}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition"
        >
          <MessageCircle className="w-4 h-4" /> إرسال عبر واتساب
        </a>
        <Button variant="secondary" onClick={copy}>
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'تم النسخ' : 'نسخ الرسالة'}
        </Button>
      </div>
    </div>
  );
};

export const ReviewsPanel: React.FC<{ onPendingCount: (n: number) => void }> = ({ onPendingCount }) => {
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'pending' | 'approved' | 'all'>('pending');

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase!.from('reviews').select('*').order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setReviews(data as ReviewRow[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    onPendingCount(reviews.filter((r) => !r.approved).length);
  }, [reviews, onPendingCount]);

  const setApproved = async (id: string, approved: boolean) => {
    const { error } = await supabase!.from('reviews').update({ approved }).eq('id', id);
    if (error) return alert('تعذر التحديث: ' + error.message);
    setReviews((list) => list.map((r) => (r.id === id ? { ...r, approved } : r)));
  };

  const remove = async (r: ReviewRow) => {
    if (!window.confirm(`حذف تقييم ${r.name} نهائيًا؟`)) return;
    const { error } = await supabase!.from('reviews').delete().eq('id', r.id);
    if (error) return alert('تعذر الحذف: ' + error.message);
    setReviews((list) => list.filter((x) => x.id !== r.id));
  };

  const pending = reviews.filter((r) => !r.approved);
  const approved = reviews.filter((r) => r.approved);
  const visible = filter === 'pending' ? pending : filter === 'approved' ? approved : reviews;

  return (
    <div>
      <PanelHeader
        title="تقييمات العملاء"
        description="التقييمات الجديدة لا تظهر في الموقع حتى تضغط «نشر»."
        actions={
          <Button variant="secondary" onClick={load} loading={loading}>
            {!loading && <RefreshCw className="w-4 h-4" />} تحديث
          </Button>
        }
      />

      <RequestReviewCard />

      <div className="flex flex-wrap gap-2 mb-4">
        {([
          ['pending', `بانتظار المراجعة (${pending.length})`],
          ['approved', `منشورة (${approved.length})`],
          ['all', `الكل (${reviews.length})`],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              filter === key ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-600 mb-3">تعذر تحميل التقييمات: {error}</p>}
      {loading && reviews.length === 0 ? (
        <LoadingBlock />
      ) : visible.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 py-14 text-center text-sm text-slate-500">
          لا توجد تقييمات هنا
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {visible.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col gap-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-black text-slate-900">{r.name}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {[r.location, new Date(r.created_at).toLocaleDateString('ar', { dateStyle: 'medium' })].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    r.approved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {r.approved ? 'منشور' : 'بانتظار المراجعة'}
                </span>
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                ))}
                {r.service && (
                  <span className="mr-2 text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-100">
                    {r.service}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">"{r.comment}"</p>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                {r.approved ? (
                  <Button variant="secondary" onClick={() => setApproved(r.id, false)} className="!py-2 text-xs">
                    <EyeOff className="w-4 h-4" /> إخفاء من الموقع
                  </Button>
                ) : (
                  <Button onClick={() => setApproved(r.id, true)} className="!py-2 text-xs">
                    <Eye className="w-4 h-4" /> نشر في الموقع
                  </Button>
                )}
                <button
                  type="button"
                  onClick={() => remove(r)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
