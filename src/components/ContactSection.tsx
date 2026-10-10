import React from 'react';
import { Phone, Mail, MapPin, MessageCircle, ArrowLeft, ExternalLink } from 'lucide-react';
import { useContent, whatsappUrl, telUrl } from '../content/ContentContext';

export const ContactSection: React.FC = () => {
  const { contact } = useContent();
  const openWhatsApp = () => {
    window.open(
      whatsappUrl(contact, 'السلام عليكم، أود الاستفسار عن خدمات FSN | فضاء الشبكات'),
      '_blank'
    );
  };

  const openGoogleMaps = () => {
    window.open(contact.mapUrl, '_blank');
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-bold mb-3">
            <Phone className="w-3.5 h-3.5" />
            <span>تواصل معنا</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            نحن هنا لخدمتك
          </h2>
          <div className="w-12 h-1 bg-blue-600 rounded-full mx-auto mb-6" />
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            إذا كان لديك استفسار أو تحتاج إلى عرض سعر أو تريد حجز موعد، يمكنك التواصل معنا مباشرة عبر الهاتف أو واتساب، أو إرسال طلبك من خلال نموذج الموقع.
          </p>
        </div>

        {/* 4 Direct Contact Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          
          {/* Action 1: اتصل بنا */}
          <a
            href={telUrl(contact)}
            className="bg-slate-50 dark:bg-slate-950 hover:bg-blue-50/60 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 rounded-2xl p-6 text-right transition-all duration-200 flex flex-col justify-between group shadow-xs hover:shadow-md"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">اتصل بنا</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">للمكالمات الهاتفية المباشرة والاستفسارات السريعة</p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-200/80 dark:border-slate-800 text-blue-700 dark:text-blue-300 font-bold text-xs sm:text-sm">
              <span dir="ltr">{contact.phoneDisplay}</span>
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </div>
          </a>

          {/* Action 2: تواصل معنا عبر واتساب */}
          <button
            type="button"
            onClick={openWhatsApp}
            className="bg-slate-50 dark:bg-slate-950 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 rounded-2xl p-6 text-right transition-all duration-200 flex flex-col justify-between group shadow-xs hover:shadow-md cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">تواصل معنا عبر واتساب</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">محادثة فورية وإرسال المواقع والصور والاستفسارات</p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-200/80 dark:border-slate-800 text-emerald-700 dark:text-emerald-400 font-bold text-xs sm:text-sm w-full">
              <span>فتح محادثة واتساب</span>
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </div>
          </button>

          {/* Action 3: أرسل لنا بريدًا إلكترونيًا */}
          <a
            href={`mailto:${contact.email}`}
            className="bg-slate-50 dark:bg-slate-950 hover:bg-blue-50/60 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 rounded-2xl p-6 text-right transition-all duration-200 flex flex-col justify-between group shadow-xs hover:shadow-md"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">أرسل لنا بريدًا إلكترونيًا</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">للمراسلات الرسمية والشركات وجداول الكميات</p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-200/80 dark:border-slate-800 text-blue-700 dark:text-blue-300 font-bold text-xs sm:text-sm">
              <span dir="ltr">{contact.email}</span>
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </div>
          </a>

          {/* Action 4: موقعنا على الخريطة */}
          <button
            type="button"
            onClick={openGoogleMaps}
            className="bg-slate-50 dark:bg-slate-950 hover:bg-blue-50/60 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 rounded-2xl p-6 text-right transition-all duration-200 flex flex-col justify-between group shadow-xs hover:shadow-md cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">موقعنا على الخريطة</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{contact.locationText}</p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-200/80 dark:border-slate-800 text-blue-700 dark:text-blue-300 font-bold text-xs sm:text-sm w-full">
              <span>عرض في خرائط Google</span>
              <ExternalLink className="w-4 h-4" />
            </div>
          </button>

        </div>

      </div>
    </section>
  );
};
