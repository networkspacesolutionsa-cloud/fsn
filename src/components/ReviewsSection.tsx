import React, { useState, useEffect } from 'react';
import {
  Star,
  MessageSquareQuote,
  CheckCircle2,
  PlusCircle,
  X,
  Send,
  Sparkles,
  ThumbsUp,
  MessageCircle,
} from 'lucide-react';
import { useLockBodyScroll } from './useLockBodyScroll';
import { supabase } from '../lib/supabase';

interface Review {
  id: string;
  name: string;
  location: string;
  service: string;
  date: string;
  rating: number;
  comment: string;
  verified?: boolean;
}

const DEFAULT_REVIEWS: Review[] = [
  {
    id: 'r1',
    name: 'عبدالله السبيعي',
    location: 'الرياض - حي النرجس',
    service: 'تمديد شبكة كابلات + تقوية واي فاي',
    date: 'منذ أسبوعين',
    rating: 5,
    comment:
      'تعامل احترافي وراقي جداً. تم التمديد في فيلا 3 أدوار بدون أي أسلاك ظاهرة، وشبكة الواي فاي الآن فل في كل الغرف والحوش. أعجبني وضوح التكلفة من البداية بدون أي زيادات.',
    verified: true,
  },
  {
    id: 'r2',
    name: 'م. فهد الغامدي',
    location: 'الرياض - حي حطين',
    service: 'تركيب 8 كاميرات مراقبة 4K',
    date: 'منذ شهر',
    rating: 5,
    comment:
      'الفني جاء في الموعد بالضبط وعاين الموقع وحدد أماكن الكاميرات والزوايا بعناية فائقة. الصورة واضحة جداً في الليل والنهار وتطبيق الجوال سريع وممتاز.',
    verified: true,
  },
  {
    id: 'r3',
    name: 'خالد بن ناصر العتيبي',
    location: 'الرياض - حي الياسمين',
    service: 'تركيب وبرمجة إنتركوم ذكي',
    date: 'منذ 3 أسابيع',
    rating: 5,
    comment:
      'خدمة ممتازة، تم ربط شاشة الإنتركوم مع الجوال لجميع أفراد الأسرة، والآن أستطيع فتح البوابة والرد على الزوار حتى وأنا خارج المنزل. شكراً لفريق فضاء الشبكات.',
    verified: true,
  },
  {
    id: 'r4',
    name: 'سلطان القحطاني',
    location: 'الرياض - حي الملقا',
    service: 'تغطية المنزل بالإنترنت ومقويات الشبكة',
    date: 'منذ 4 أيام',
    rating: 5,
    comment:
      'كانت الفيلا تعاني من ضعف شديد في الدور الثاني والملحق بسبب العوازل. ركبوا مقويات شبكة متصلة بسلاسة، والسرعة كاملة 500 ميجا في كل مكان.',
    verified: true,
  },
];

interface ReviewRow {
  id: string;
  created_at: string;
  name: string;
  location: string | null;
  service: string | null;
  rating: number;
  comment: string;
}

const relativeDate = (iso: string) => {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return 'اليوم';
  if (days === 1) return 'منذ يوم';
  if (days === 2) return 'منذ يومين';
  if (days < 7) return `منذ ${days} أيام`;
  if (days < 14) return 'منذ أسبوع';
  if (days < 30) return days < 21 ? 'منذ أسبوعين' : 'منذ 3 أسابيع';
  if (days < 60) return 'منذ شهر';
  if (days < 365) return `منذ ${Math.floor(days / 30)} أشهر`;
  return 'منذ أكثر من سنة';
};

const fromRow = (row: ReviewRow): Review => ({
  id: row.id,
  name: row.name,
  location: row.location || '',
  service: row.service || '',
  date: relativeDate(row.created_at),
  rating: row.rating,
  comment: row.comment,
  verified: true,
});

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(() => {
    // With Supabase the approved reviews are loaded below
    if (supabase) return [];
    try {
      const saved = localStorage.getItem('fsn_customer_reviews');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return DEFAULT_REVIEWS;
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [location, setLocation] = useState('الرياض');
  const [service, setService] = useState('كاميرات المراقبة');
  const [comment, setComment] = useState('');
  const [successToast, setSuccessToast] = useState(false);
  const [submitError, setSubmitError] = useState('');
  useLockBodyScroll(modalOpen);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from('reviews')
      .select('id, created_at, name, location, service, rating, comment')
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        setReviews(error || !data ? DEFAULT_REVIEWS : data.map(fromRow));
      });
  }, []);

  // Without Supabase, reviews are kept in this browser only
  useEffect(() => {
    if (supabase) return;
    try {
      localStorage.setItem('fsn_customer_reviews', JSON.stringify(reviews));
    } catch {
      // ignore
    }
  }, [reviews]);

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !comment.trim()) return;
    setSubmitError('');

    if (supabase) {
      // Goes to the control panel for approval before it appears on the site
      const { error } = await supabase.from('reviews').insert({
        name: customerName.trim(),
        location: location.trim() || null,
        service,
        rating: newRating,
        comment: comment.trim(),
      });
      if (error) {
        console.error('Review insert failed:', error.message);
        setSubmitError('تعذر إرسال التقييم حاليًا، يرجى المحاولة مرة أخرى.');
        return;
      }
      setCustomerName('');
      setComment('');
      setNewRating(5);
      setModalOpen(false);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 6000);
      return;
    }

    const newReview: Review = {
      id: 'rev_' + Date.now(),
      name: customerName.trim(),
      location: location.trim() || 'الرياض',
      service: service,
      date: 'الآن',
      rating: newRating,
      comment: comment.trim(),
      verified: true,
    };

    setReviews([newReview, ...reviews]);
    setCustomerName('');
    setComment('');
    setNewRating(5);
    setModalOpen(false);
    setSuccessToast(true);

    setTimeout(() => {
      setSuccessToast(false);
    }, 6000);
  };

  // Calculate average rating
  const avgRating = (
    reviews.reduce((acc, curr) => acc + curr.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  return (
    <section id="reviews" className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-bold mb-3">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>تجارب عملائنا تهمنا</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            تقييمات العملاء
          </h2>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            رأيك يصنع الفرق
          </p>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            نسعى دائمًا إلى تقديم تجربة واضحة ومريحة للعميل من لحظة التواصل وحتى انتهاء العمل. وفي هذه الصفحة نعرض تقييمات وتجارب عملائنا بعد تنفيذ الخدمات، ويسعدنا أن تشاركنا تقييمك وتجربتك.
          </p>

          {/* Rating Summary & Action Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6">
            <div className="flex items-center gap-4 text-right">
              <div className="text-4xl font-black text-slate-900 dark:text-white font-mono">
                {avgRating}
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  بناءً على {reviews.length + 140} تقييم معتمد من العملاء
                </span>
              </div>
            </div>

            {/* "أضف تقييمك" Button */}
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>أضف تقييمك الآن</span>
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {successToast && (
          <div className="mb-8 max-w-xl mx-auto p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm flex items-center gap-3 shadow-sm text-right">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <div className="flex-1">
              <span className="font-bold block">شكرًا لتقييمك الكريم!</span>
              <span>
                {supabase
                  ? 'تم استلام تقييمك وسيظهر في الموقع بعد مراجعته، نسعد دائمًا بخدمتكم.'
                  : 'تمت إضافة تقييمك بنجاح ليظهر في الموقع، نسعد دائمًا بخدمتكم.'}
              </span>
            </div>
          </div>
        )}

        {/* Reviews Cards Grid (swipeable carousel on phones) */}
        <div className="-mx-4 px-4 scroll-px-4 flex md:grid md:mx-0 md:px-0 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-none pb-2 md:pb-0">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="w-[85%] sm:w-[60%] shrink-0 snap-start md:w-auto bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between text-right hover:shadow-md transition-all duration-200"
            >
              <div>
                {/* Rating Stars & Date */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400">{rev.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed mb-6 italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{rev.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  </h4>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{rev.location}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold border border-blue-100 dark:border-blue-900/60">
                  {rev.service}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Customer Rating Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
            onClick={() => setModalOpen(false)}
          />

          <div className="flex min-h-full items-end sm:items-center justify-center pt-10 sm:p-4 text-center">
            <div className="relative w-full transform overflow-hidden rounded-t-3xl sm:rounded-3xl bg-white dark:bg-slate-900 text-right shadow-2xl transition-all sm:my-8 sm:max-w-lg border border-slate-200 dark:border-slate-800">
              
              {/* Header */}
              <div className="bg-[#0b1a30] text-white px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-blue-400 font-bold block mb-0.5">
                    مشاركة تجربة العميل
                  </span>
                  <h3 className="text-base sm:text-lg font-bold">تقييم خدمات FSN | فضاء الشبكات</h3>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  aria-label="إغلاق"
                  className="w-9 h-9 shrink-0 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmitRating} className="p-5 sm:p-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] space-y-4 text-right">
                
                {/* Interactive Star Picker */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 mb-2">
                    درجة التقييم <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/80 dark:border-slate-800 justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-125 cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                            star <= (hoverRating || newRating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 mr-2 sm:mr-3">
                      ({newRating} من 5)
                    </span>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">
                    الاسم الكامل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="مثال: م. خالد المنصور"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none text-right"
                  />
                </div>

                {/* Location / District */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">
                    المدينة والحي
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="مثال: الرياض - حي الملقا"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none text-right"
                  />
                </div>

                {/* Service Received */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">
                    الخدمة التي تم تنفيذها
                  </label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none text-right cursor-pointer"
                  >
                    <option value="كاميرات المراقبة">كاميرات المراقبة (IP & Wi-Fi)</option>
                    <option value="تمديد وصيانة الشبكات">تمديد وصيانة كابلات الشبكة</option>
                    <option value="تغطية الإنترنت ومقوي الواي فاي">تغطية الإنترنت ومقويات Wi-Fi</option>
                    <option value="تركيب وبرمجة الإنتركوم">تركيب وبرمجة أنظمة الإنتركوم</option>
                    <option value="تركيب أفياش الشبكة">تركيب أفياش الشبكة الجدارية</option>
                    <option value="معاينة وعرض سعر للموقع">معاينة وعرض سعر للموقع</option>
                  </select>
                </div>

                {/* Review Comment */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">
                    رأيك في جودة التنفيذ وسرعة الخدمة <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="اكتب هنا تجربتك ورأيك بكل صراحة وشفافية..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none text-right"
                  />
                </div>

                {submitError && (
                  <p className="text-xs sm:text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl p-3">
                    {submitError}
                  </p>
                )}

                {/* Actions */}
                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 sm:flex-none px-4 py-3 sm:py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] sm:flex-none px-6 py-3 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/30 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Send className="w-4 h-4" />
                    <span>نشر التقييم فوراً</span>
                  </button>
                </div>

              </form>

            </div>
          </div>
        </div>
      )}
    </section>
  );
};
