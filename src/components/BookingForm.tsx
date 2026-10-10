import React, { useState } from 'react';
import { CalendarClockVisual } from './ServiceVisuals';
import { MapPin, CheckCircle, AlertCircle, Loader2, MessageCircle, RefreshCw, Send } from 'lucide-react';
import { useContent, whatsappUrl } from '../content/ContentContext';
import { supabase } from '../lib/supabase';
import { normalizeSaudiPhone, formatSaudiPhone, SAUDI_PHONE_ERROR } from '../lib/phone';

interface BookingFormProps {
  initialService?: string;
  initialCategory?: string;
}

export const BookingForm: React.FC<BookingFormProps> = ({ initialService = '', initialCategory = '' }) => {
  const { contact, services } = useContent();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [department, setDepartment] = useState(initialCategory || '');
  const [serviceRequired, setServiceRequired] = useState(initialService || '');
  const [siteType, setSiteType] = useState('');
  const [city, setCity] = useState('الرياض');
  const [serviceLocation, setServiceLocation] = useState('');
  const [notes, setNotes] = useState('');

  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Update if props change
  React.useEffect(() => {
    if (initialService) {
      setServiceRequired(initialService);
    }
    if (initialCategory) {
      setDepartment(initialCategory);
    }
  }, [initialService, initialCategory]);

  // Geolocation Handler
  const handleGetLocation = () => {
    setIsLocating(true);
    setErrorMessage('');

    if (!navigator.geolocation) {
      setServiceLocation('الرياض - تم التحديد الافتراضي');
      setLocationSuccess(true);
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const formatted = `موقع معتمد بدقة (${latitude.toFixed(4)}, ${longitude.toFixed(4)}) - ${city}`;
        setServiceLocation(formatted);
        setLocationSuccess(true);
        setIsLocating(false);
      },
      (error) => {
        console.warn('Geolocation error:', error.message);
        setServiceLocation(`${city} - المملكة العربية السعودية`);
        setLocationSuccess(true);
        setIsLocating(false);
      },
      { timeout: 8000 }
    );
  };

  const phoneInvalid = phoneTouched && phone.trim() !== '' && !normalizeSaudiPhone(phone);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('يرجى إدخال الاسم الكريم.');
      return;
    }

    const cleanPhone = normalizeSaudiPhone(phone);
    if (!cleanPhone) {
      setPhoneTouched(true);
      setErrorMessage(SAUDI_PHONE_ERROR);
      return;
    }

    if (!department) {
      setErrorMessage('يرجى اختيار القسم المطلوب.');
      return;
    }

    setLoading(true);
    const generatedRef = 'FSN-' + Math.floor(100000 + Math.random() * 900000);

    // Saved to the control panel inbox when Supabase is connected; WhatsApp confirmation works either way
    if (supabase) {
      const { error } = await supabase.from('bookings').insert({
        ref: generatedRef,
        name: name.trim(),
        phone: cleanPhone,
        department,
        service: serviceRequired || null,
        site_type: siteType || null,
        city,
        location: serviceLocation || null,
        notes: notes.trim() || null,
      });
      if (error) {
        console.error('Booking insert failed:', error.message);
        setLoading(false);
        setErrorMessage('تعذر إرسال الطلب حاليًا. يرجى المحاولة مرة أخرى أو التواصل معنا عبر واتساب.');
        return;
      }
    }

    setBookingRef(generatedRef);
    setLoading(false);
    setSubmitted(true);
  };

  const departmentServices = services.find((c) => c.name === department)?.items ?? [];

  const handleWhatsAppConfirm = () => {
    const message = `السلام عليكم ورحمة الله،
أود إرسال طلب حجز خدمة لدى FSN | فضاء الشبكات:
*رقم الطلب:* ${bookingRef}
*الاسم:* ${name}
*رقم الجوال:* ${normalizeSaudiPhone(phone) ? formatSaudiPhone(normalizeSaudiPhone(phone)!) : phone}
*القسم:* ${department}
*الخدمة المطلوبة:* ${serviceRequired || 'حسب المعاينة والاتفاق'}
*نوع الموقع:* ${siteType || 'غير محدد'}
*المدينة:* ${city}
*موقع الخدمة:* ${serviceLocation || 'سيتم إرسال اللوكيشن'}
*ملاحظات إضافية:* ${notes || 'لا يوجد'}`;

    window.open(whatsappUrl(contact, message), '_blank');
  };

  const handleReset = () => {
    setSubmitted(false);
    setName('');
    setPhone('');
    setPhoneTouched(false);
    setDepartment('');
    setServiceRequired('');
    setSiteType('');
    setServiceLocation('');
    setNotes('');
    setLocationSuccess(false);
    setErrorMessage('');
  };

  return (
    <section id="booking" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* Outer Card Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden p-4 sm:p-10 lg:p-12">
        
        {submitted ? (
          /* Success Confirmation State */
          <div className="py-8 text-center max-w-xl mx-auto flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>
            <span dir="rtl" className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800/60 mb-2">
              رقم طلب الحجز: {bookingRef}
            </span>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              تم إرسال طلبك بنجاح!
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
              شكرًا لك يا <span className="font-bold text-slate-900 dark:text-white">{name}</span>. وصل طلبك إلى فريق فضاء الشبكات، وسنتواصل معك في أقرب وقت لتأكيد الموعد وتنسيق تفاصيل الخدمة والمعاينة.
            </p>

            <div className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-right text-xs space-y-2 mb-6">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500 dark:text-slate-400">القسم:</span>
                <span className="font-bold text-slate-800 dark:text-slate-100 text-left">{department}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500 dark:text-slate-400">الخدمة:</span>
                <span className="font-bold text-slate-800 dark:text-slate-100 text-left">{serviceRequired || 'معاينة الموقع وتحديد الاحتياج'}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500 dark:text-slate-400">المدينة والموقع:</span>
                <span className="font-bold text-slate-800 dark:text-slate-100 text-left">{city} - {serviceLocation || 'تم التحديد'}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                type="button"
                onClick={handleWhatsAppConfirm}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>محادثة الفريق عبر واتساب (اختياري)</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm flex items-center justify-center gap-1.5 cursor-pointer transition"
              >
                <RefreshCw className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>إرسال طلب جديد</span>
              </button>
            </div>
          </div>
        ) : (
          /* Normal Booking Form Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column (in RTL): Calendar & Clock Graphic + Description */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-right gap-5 sm:gap-6 p-5 sm:p-6 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex-shrink-0 mx-auto">
                <CalendarClockVisual />
              </div>

              <div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">
                  نموذج الحجز المباشر
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-snug mb-3">
                  احجز موعد
                </h3>
                <h4 className="text-base font-bold text-blue-700 dark:text-blue-300 mb-2">
                  أخبرنا ماذا تحتاج
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  سواء كنت تحتاج إلى تمديد شبكة، تحسين تغطية الإنترنت، تركيب كاميرات مراقبة أو تركيب نظام إنتركوم، يمكنك إرسال طلبك من خلال نموذج الحجز وسيتواصل معك فريق فضاء الشبكات.
                </p>
              </div>

              <div className="w-full pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1.5 text-right">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>معاينة وتحديد الاحتياج بدقة</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>توضيح التكلفة قبل بدء العمل</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>إمكانية العمل في نفس اليوم عند الاتفاق</span>
                </div>
              </div>
            </div>

            {/* Right Column (in RTL): Complete Form Fields */}
            <div className="lg:col-span-8 px-1 sm:px-0">
              <div className="mb-6 text-right">
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  بيانات طلب الخدمة
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  املأ البيانات التالية لنقوم بترتيب المعاينة أو تقديم عرض السعر المناسب
                </p>
              </div>

              {errorMessage && (
                <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 text-xs sm:text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Row 1: Name and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 mb-1.5 text-right">
                      الاسم <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="مثال: محمد أحمد"
                      className="w-full px-4 py-3 sm:py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition text-right"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 mb-1.5 text-right">
                      رقم الجوال <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onBlur={() => setPhoneTouched(true)}
                      placeholder="05xxxxxxxx"
                      dir="ltr"
                      aria-invalid={phoneInvalid}
                      className={`w-full px-4 py-3 sm:py-2.5 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 outline-none transition text-right ${
                        phoneInvalid
                          ? 'border-red-400 dark:border-red-600 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-slate-300 dark:border-slate-700 focus:border-blue-600 focus:ring-blue-600/20'
                      }`}
                    />
                    {phoneInvalid ? (
                      <p className="mt-1 text-[11px] text-red-600 dark:text-red-400 text-right">
                        رقم جوال سعودي فقط: يبدأ بـ 05 ويتكون من 10 أرقام (أو +9665...).
                      </p>
                    ) : (
                      <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500 text-right">
                        أرقام الجوال السعودية فقط
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 2: Department (القسم) and Required Service (الخدمة المطلوبة) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Department */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 mb-1.5 text-right">
                      القسم <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={department}
                      onChange={(e) => {
                        setDepartment(e.target.value);
                        setServiceRequired('');
                      }}
                      className="w-full px-4 py-3 sm:py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition text-right cursor-pointer"
                    >
                      <option value="">اختر القسم</option>
                      {services.map((c) => (
                        <option key={c.key} value={c.name}>
                          {c.cardTitle}
                        </option>
                      ))}
                      <option value="باقات متكاملة">باقة متكاملة (شبكات + كاميرات + إنتركوم)</option>
                    </select>
                  </div>

                  {/* Service Required */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 mb-1.5 text-right">
                      الخدمة المطلوبة
                    </label>
                    <select
                      value={serviceRequired}
                      onChange={(e) => setServiceRequired(e.target.value)}
                      className="w-full px-4 py-3 sm:py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition text-right cursor-pointer"
                    >
                      <option value="">اختر الخدمة المطلوبة</option>
                      {departmentServices.map((item) => (
                        <option key={item.id} value={item.title}>
                          {item.badgeTone === 'price' ? `${item.title} (${item.badge})` : item.title}
                        </option>
                      ))}
                      {/* A service picked from the gallery that isn't in the list */}
                      {serviceRequired &&
                        serviceRequired !== 'معاينة عامة وشاملة للموقع' &&
                        !departmentServices.some((item) => item.title === serviceRequired) && (
                          <option value={serviceRequired}>{serviceRequired}</option>
                        )}
                      <option value="معاينة عامة وشاملة للموقع">معاينة عامة وشاملة للموقع</option>
                    </select>
                  </div>
                </div>

                {/* Row 3: Site Type (نوع الموقع) and City (المدينة) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Site Type */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 mb-1.5 text-right">
                      نوع الموقع
                    </label>
                    <select
                      value={siteType}
                      onChange={(e) => setSiteType(e.target.value)}
                      className="w-full px-4 py-3 sm:py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition text-right cursor-pointer"
                    >
                      <option value="">اختر نوع الموقع</option>
                      <option value="فيلا سكنية">فيلا سكنية</option>
                      <option value="شقة">شقة</option>
                      <option value="عمارة سكنية / مجمع">عمارة سكنية / مجمع</option>
                      <option value="مكتب / مقر شركة">مكتب / مقر شركة</option>
                      <option value="محل تجاري / معرض">محل تجاري / معرض</option>
                      <option value="مستودع / منشأة صناعية">مستودع / منشأة صناعية</option>
                      <option value="موقع قيد الإنشاء">موقع قيد الإنشاء والتشطيب</option>
                    </select>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 mb-1.5 text-right">
                      المدينة
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 sm:py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition text-right cursor-pointer"
                    >
                      <option value="الرياض">الرياض</option>
                      <option value="جدة">جدة</option>
                      <option value="مكة المكرمة">مكة المكرمة</option>
                      <option value="المدينة المنورة">المدينة المنورة</option>
                      <option value="الدمام">الدمام</option>
                      <option value="الخبر">الخبر</option>
                      <option value="القصيم">القصيم</option>
                      <option value="أخرى">مدينة أخرى</option>
                    </select>
                  </div>
                </div>

                {/* Row 4: Service Location and Auto-detect (موقع الخدمة مع تحديد الموقع تلقائياً) */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 mb-1.5 text-right">
                    موقع الخدمة
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={serviceLocation}
                      onChange={(e) => setServiceLocation(e.target.value)}
                      placeholder="الحي والشارع (مثال: حي الياسمين - شارع أنس بن مالك)"
                      className="flex-1 px-4 py-3 sm:py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition text-right"
                    />

                    {/* Geolocation Button */}
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={isLocating}
                      className="px-4 py-3 sm:py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 active:bg-blue-800 text-white text-xs sm:text-sm font-bold shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer transition disabled:opacity-70"
                    >
                      {isLocating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>جاري التحديد...</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-4 h-4" />
                          <span>تحديد الموقع تلقائيًا</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 text-right">
                    {locationSuccess ? '✓ تم تحديد الموقع بنجاح' : 'يمكنك كتابة الحي أو الضغط على زر تحديد الموقع تلقائيًا'}
                  </p>
                </div>

                {/* Row 5: Notes & Additional Details (مساحة لكتابة أي ملاحظات أو تفاصيل إضافية) */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 mb-1.5 text-right">
                    ملاحظات أو تفاصيل إضافية
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="اكتب هنا أي تفاصيل إضافية تساعدنا على فهم احتياجك (مثال: عدد الكاميرات التقريبي، مساحة الفيلا، حالة التمديدات الحالية...)"
                    className="w-full px-4 py-3 sm:py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition text-right"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/30 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-75"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>جاري إرسال طلبك...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>إرسال طلب الحجز</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
