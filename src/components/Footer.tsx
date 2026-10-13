import React from 'react';
import { Logo } from './Logo';
import { Phone, Mail, MapPin, MessageCircle, ChevronLeft } from 'lucide-react';
import { TabKey } from './Navbar';
import { useContent, whatsappUrl, telUrl } from '../content/ContentContext';

interface FooterProps {
  onTabChange: (tab: TabKey) => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onTabChange, onOpenBooking }) => {
  const { contact } = useContent();
  const links: { id: TabKey; label: string; href: string }[] = [
    { id: 'networks', label: 'الشبكات', href: '#networks' },
    { id: 'cameras', label: 'كاميرات المراقبة', href: '#cameras' },
    { id: 'intercom', label: 'الإنتركوم', href: '#intercom' },
    { id: 'gallery', label: 'أعمال سابقة', href: '#gallery' },
    { id: 'packages', label: 'الباقات', href: '#packages' },
    { id: 'offers', label: 'عروض الأسعار', href: '#offers' },
    { id: 'why-us', label: 'التقييمات', href: '#reviews' },
    { id: 'about', label: 'من نحن', href: '#about' },
    { id: 'home', label: 'حجز الموعد', href: '#booking' },
    { id: 'contact', label: 'التواصل معنا', href: '#contact' },
  ];

  const handleLink = (id: TabKey, href: string) => {
    onTabChange(id);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openWhatsApp = () => {
    window.open(
      whatsappUrl(contact, 'السلام عليكم، أود التواصل مع FSN | فضاء الشبكات'),
      '_blank'
    );
  };

  return (
    <footer className="bg-[#081324] text-slate-400 border-t border-slate-800 text-sm select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Logo isDark={true} />
            <h4 className="text-white font-bold text-base mt-2">
              FSN | فضاء الشبكات
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
              حلول احترافية للشبكات والأنظمة الأمنية للمنازل والشركات والمنشآت.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              يمكنك الوصول من خلال الفوتر إلى أقسام الشبكات وكاميرات المراقبة والإنتركوم والباقات والمشاريع والتقييمات ومن نحن وحجز الموعد والتواصل معنا.
            </p>

            {/* Direct 4 communication shortcuts */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-300">
              <button
                type="button"
                onClick={openWhatsApp}
                className="hover:text-emerald-400 transition cursor-pointer flex items-center gap-1"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>واتساب</span>
              </button>
              <span className="text-slate-600">|</span>
              <a
                href={telUrl(contact)}
                className="hover:text-blue-400 transition flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>اتصال</span>
              </a>
              <span className="text-slate-600">|</span>
              <a
                href={`mailto:${contact.email}`}
                className="hover:text-blue-400 transition flex items-center gap-1"
              >
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>البريد الإلكتروني</span>
              </a>
              <span className="text-slate-600">|</span>
              <button
                type="button"
                onClick={() => window.open(contact.mapUrl, '_blank')}
                className="hover:text-blue-400 transition cursor-pointer flex items-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>الموقع</span>
              </button>
            </div>
          </div>

          {/* Quick Access to All Required Links (4 cols) */}
          <div className="lg:col-span-4">
            <h4 className="text-white text-base font-bold mb-4 border-r-2 border-blue-500 pr-2">
              أقسام الموقع والخدمات
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
              {links.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleLink(item.id, item.href)}
                  className="text-right hover:text-blue-400 transition-colors flex items-center gap-1.5 py-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3 h-3 text-slate-600" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Booking CTA Box (3 cols) */}
          <div className="lg:col-span-3 flex flex-col justify-between">
            <div>
              <h4 className="text-white text-base font-bold mb-3 border-r-2 border-blue-500 pr-2">
                حجز موعد فوري
              </h4>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                معاينة مجانية للموقع وتقديم عرض سعر دقيق ومفصل قبل بدء أي عمل.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenBooking}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer"
            >
              احجز موعد الآن
            </button>
          </div>

        </div>

        {/* Bottom Rights Notice */}
        <div className="pt-8 mt-12 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 text-center sm:text-right">
            <p>© 2026 FSN | فضاء الشبكات — جميع الحقوق محفوظة</p>
            {contact.commercialRegistration && (
              <>
                <span className="hidden sm:inline">|</span>
                <p className="text-slate-300 font-bold">
                  رقم السجل التجاري: <span dir="ltr" className="font-mono text-white">{contact.commercialRegistration}</span>
                </p>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 transition cursor-pointer">سياسة الخصوصية</span>
            <span>|</span>
            <span className="hover:text-slate-400 transition cursor-pointer">الشروط والأحكام</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
