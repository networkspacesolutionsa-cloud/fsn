import React, { useEffect, useState } from 'react';
import { Copy, MapPin, Phone, RefreshCw, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button, LoadingBlock, PanelHeader } from './ui';

export interface Booking {
  id: string;
  created_at: string;
  ref: string | null;
  name: string;
  phone: string;
  department: string | null;
  service: string | null;
  site_type: string | null;
  city: string | null;
  location: string | null;
  notes: string | null;
  status: BookingStatus;
}

type BookingStatus = 'new' | 'contacted' | 'done' | 'cancelled';

const STATUS: Record<BookingStatus, { label: string; className: string }> = {
  new: { label: 'جديد', className: 'bg-blue-100 text-blue-800' },
  contacted: { label: 'تم التواصل', className: 'bg-amber-100 text-amber-800' },
  done: { label: 'مكتمل', className: 'bg-emerald-100 text-emerald-800' },
  cancelled: { label: 'ملغي', className: 'bg-slate-200 text-slate-600' },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('ar', { dateStyle: 'medium', timeStyle: 'short' });

export const BookingsPanel: React.FC<{ onNewCount: (n: number) => void }> = ({ onNewCount }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | BookingStatus>('all');

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase!
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);
    if (error) setError(error.message);
    else setBookings(data as Booking[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    onNewCount(bookings.filter((b) => b.status === 'new').length);
  }, [bookings, onNewCount]);

  const setStatus = async (id: string, status: BookingStatus) => {
    const { error } = await supabase!.from('bookings').update({ status }).eq('id', id);
    if (error) return alert('تعذر التحديث: ' + error.message);
    setBookings((list) => list.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const remove = async (b: Booking) => {
    if (!window.confirm(`حذف طلب ${b.name} نهائيًا؟`)) return;
    const { error } = await supabase!.from('bookings').delete().eq('id', b.id);
    if (error) return alert('تعذر الحذف: ' + error.message);
    setBookings((list) => list.filter((x) => x.id !== b.id));
  };

  const visible = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);
  const count = (s: BookingStatus) => bookings.filter((b) => b.status === s).length;

  return (
    <div>
      <PanelHeader
        title="طلبات الحجز"
        description="الطلبات المرسلة من نموذج «احجز موعد» في الموقع."
        actions={
          <Button variant="secondary" onClick={load} loading={loading}>
            {!loading && <RefreshCw className="w-4 h-4" />} تحديث
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2 mb-4">
        {(['all', 'new', 'contacted', 'done', 'cancelled'] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              filter === key ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {key === 'all' ? `الكل (${bookings.length})` : `${STATUS[key].label} (${count(key)})`}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-600 mb-3">تعذر تحميل الطلبات: {error}</p>}
      {loading && bookings.length === 0 ? (
        <LoadingBlock />
      ) : visible.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 py-14 text-center text-sm text-slate-500">
          لا توجد طلبات {filter !== 'all' && `بحالة «${STATUS[filter].label}»`}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {visible.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col gap-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-black text-slate-900">{b.name}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {formatDate(b.created_at)} {b.ref && <span className="font-mono">· {b.ref}</span>}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${STATUS[b.status].className}`}>
                  {STATUS[b.status].label}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={`tel:${b.phone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span dir="ltr">{b.phone}</span>
                </a>
                <button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(b.phone)}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" /> نسخ الرقم
                </button>
              </div>

              <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-xs bg-slate-50 rounded-xl p-3 border border-slate-100">
                {[
                  ['القسم', b.department],
                  ['الخدمة', b.service],
                  ['نوع الموقع', b.site_type],
                  ['المدينة', b.city],
                ].map(([k, v]) =>
                  v ? (
                    <React.Fragment key={k}>
                      <dt className="text-slate-500">{k}:</dt>
                      <dd className="font-semibold text-slate-800">{v}</dd>
                    </React.Fragment>
                  ) : null
                )}
                {b.location && (
                  <>
                    <dt className="text-slate-500">الموقع:</dt>
                    <dd className="font-semibold text-slate-800 flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                      {b.location}
                    </dd>
                  </>
                )}
              </dl>
              {b.notes && <p className="text-xs text-slate-700 leading-relaxed bg-amber-50/60 border border-amber-100 rounded-xl p-3">{b.notes}</p>}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  الحالة:
                  <select
                    value={b.status}
                    onChange={(e) => setStatus(b.id, e.target.value as BookingStatus)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs cursor-pointer"
                  >
                    {Object.entries(STATUS).map(([value, s]) => (
                      <option key={value} value={value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  onClick={() => remove(b)}
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
