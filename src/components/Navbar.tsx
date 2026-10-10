import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Logo } from './Logo';
import { useLockBodyScroll } from './useLockBodyScroll';
import { ThemeToggle } from './ThemeToggle';
import { MessageCircle, Menu, X, Phone, Calendar, ChevronLeft, ChevronDown, Network, Video, Tv, ArrowLeft } from 'lucide-react';
import { useContent, whatsappUrl } from '../content/ContentContext';
import type { CategoryKey } from '../content/types';
import { showService } from './serviceNav';

const CATEGORY_ICONS: Record<CategoryKey, React.ElementType> = { networks: Network, cameras: Video, intercom: Tv };

// Arabic plural: خدمة واحدة / خدمتان / 3–10 خدمات / 11+ خدمة
const servicesCount = (n: number) =>
  n === 1 ? 'خدمة واحدة' : n === 2 ? 'خدمتان' : n >= 3 && n <= 10 ? `${n} خدمات` : `${n} خدمة`;

export type TabKey =
  | 'home'
  | 'services'
  | 'networks'
  | 'cameras'
  | 'intercom'
  | 'packages'
  | 'why-us'
  | 'offers'
  | 'gallery'
  | 'faq'
  | 'about'
  | 'contact';

interface NavbarProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange, onOpenBooking }) => {
  const { contact, services } = useContent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const servicesMenuRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Desktop dropdown: opens on hover or click, closes on outside click / Escape
  useEffect(() => {
    if (!servicesMenuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!servicesMenuRef.current?.contains(e.target as Node)) setServicesMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setServicesMenuOpen(false);
    document.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [servicesMenuOpen]);

  const openServicesMenu = () => {
    clearTimeout(closeTimer.current);
    setServicesMenuOpen(true);
  };
  const closeServicesMenuSoon = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setServicesMenuOpen(false), 150);
  };

  const goToService = (category: CategoryKey | 'all', itemId?: string) => {
    onTabChange('services');
    setServicesMenuOpen(false);
    setMobileMenuOpen(false);
    showService(category, itemId);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useLockBodyScroll(mobileMenuOpen);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileMenuOpen]);

  const navLinks: { id: TabKey; label: string; href: string }[] = [
    { id: 'home', label: 'الرئيسية', href: '#home' },
    { id: 'services', label: 'خدماتنا', href: '#services' },
    { id: 'gallery', label: 'معرض الصور', href: '#gallery' },
    { id: 'packages', label: 'الباقات', href: '#packages' },
    { id: 'why-us', label: 'لماذا FSN', href: '#why-us' },
    { id: 'offers', label: 'عروض الأسعار', href: '#offers' },
    { id: 'faq', label: 'الأسئلة الشائعة', href: '#faq' },
    { id: 'about', label: 'من نحن', href: '#about' },
    { id: 'contact', label: 'تواصل معنا', href: '#contact' },
  ];

  const handleLinkClick = (tabId: TabKey, href: string) => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openWhatsApp = () => {
    window.open(
      whatsappUrl(contact, 'السلام عليكم، أود الاستفسار عن خدمات FSN | فضاء الشبكات'),
      '_blank'
    );
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'bg-[#091527]/95 backdrop-blur-md shadow-xl' : 'bg-[#0b1a30]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 h-16 sm:h-20">
          
          {/* Right Zone (in RTL): Brand Logo */}
          <div className="flex-shrink-0" onClick={() => handleLinkClick('home', '#home')}>
            <Logo isDark={true} />
          </div>

          {/* Center Zone: Navigation Links (Desktop) */}
          <nav className="hidden xl:flex items-center gap-6 2xl:gap-8 text-slate-200 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              if (link.id === 'services') {
                return (
                  <div
                    key={link.id}
                    ref={servicesMenuRef}
                    className="relative"
                    onMouseEnter={openServicesMenu}
                    onMouseLeave={closeServicesMenuSoon}
                  >
                    <button
                      onClick={() => setServicesMenuOpen((o) => !o)}
                      aria-expanded={servicesMenuOpen}
                      aria-haspopup="true"
                      className={`relative py-2 text-xs 2xl:text-sm font-semibold transition-colors duration-200 whitespace-nowrap cursor-pointer inline-flex items-center gap-1 ${
                        isActive || servicesMenuOpen ? 'text-blue-400 font-bold' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {link.label}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${servicesMenuOpen ? 'rotate-180' : ''}`} />
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full shadow-[0_0_8px_#0ea5e9]" />
                      )}
                    </button>

                    {servicesMenuOpen && (
                      <div className="absolute top-full right-1/2 translate-x-1/2 pt-3 z-50">
                        <div className="w-[min(46rem,90vw)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden text-right">
                          <div className="grid grid-cols-3 divide-x divide-x-reverse divide-slate-100 dark:divide-slate-800">
                            {services.map((category) => {
                              const Icon = CATEGORY_ICONS[category.key];
                              return (
                                <div key={category.key} className="p-4">
                                  <button
                                    onClick={() => goToService(category.key)}
                                    className="w-full flex items-center gap-2.5 mb-3 group cursor-pointer"
                                  >
                                    <span className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                                      <Icon className="w-5 h-5" />
                                    </span>
                                    <span className="text-sm font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                      {category.cardTitle}
                                    </span>
                                  </button>
                                  <ul className="space-y-0.5">
                                    {category.items.map((item) => (
                                      <li key={item.id}>
                                        <button
                                          onClick={() => goToService(category.key, item.id)}
                                          className="w-full text-right px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer leading-relaxed"
                                        >
                                          {item.title}
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              );
                            })}
                          </div>
                          <button
                            onClick={() => goToService('all')}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors cursor-pointer"
                          >
                            <span>عرض جميع الخدمات والأسعار</span>
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id, link.href)}
                  className={`relative py-2 text-xs 2xl:text-sm font-semibold transition-colors duration-200 whitespace-nowrap cursor-pointer ${
                    isActive ? 'text-blue-400 font-bold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {/* Active Indicator Underline */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full shadow-[0_0_8px_#0ea5e9]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Left Zone (in RTL): WhatsApp & Consultation CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <ThemeToggle />

            {/* WhatsApp Icon Button */}
            <button
              onClick={openWhatsApp}
              title="تواصل معنا عبر واتساب"
              className="w-10 h-10 rounded-full border border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-emerald-500/20 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 text-emerald-400" />
            </button>

            {/* Book Consultation Button */}
            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-900/30 transition-all duration-200 hover:shadow-blue-500/30 whitespace-nowrap cursor-pointer flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              <span>احجز موعد</span>
            </button>
          </div>

          {/* Mobile Right Controls: WhatsApp + Hamburger Toggle */}
          <div className="flex xl:hidden items-center gap-2">
            <ThemeToggle className="sm:hidden" />

            <button
              onClick={openWhatsApp}
              className="hidden min-[360px]:flex sm:hidden w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 items-center justify-center cursor-pointer"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200 flex items-center justify-center hover:bg-slate-700 transition cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-blue-400" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation (Responsive across all mobile devices) */}
      {mobileMenuOpen && createPortal(
        <div dir="rtl" className="fixed inset-0 z-[60] xl:hidden">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-out Drawer from Right */}
          <div className="fixed inset-y-0 right-0 max-w-xs w-[85%] bg-[#0a182f] border-l border-slate-800 shadow-2xl p-5 sm:p-6 flex flex-col justify-between overflow-y-auto overscroll-contain z-10">
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-800">
                <Logo isDark={true} />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="إغلاق القائمة"
                  className="w-10 h-10 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Nav Links */}
              <div className="py-4 flex flex-col gap-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">
                  أقسام الموقع
                </span>
                {navLinks.map((link) => {
                  const isActive = activeTab === link.id;
                  if (link.id === 'services') {
                    return (
                      <div key={link.id}>
                        <button
                          onClick={() => setMobileServicesOpen((o) => !o)}
                          aria-expanded={mobileServicesOpen}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-right font-medium text-sm transition-colors cursor-pointer ${
                            isActive || mobileServicesOpen
                              ? 'bg-blue-600/20 text-blue-400 font-bold border-r-4 border-blue-500'
                              : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                          }`}
                        >
                          <span>{link.label}</span>
                          <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {mobileServicesOpen && (
                          <div className="mt-1 mb-1 mr-3 pr-3 border-r border-slate-700/80 flex flex-col gap-0.5">
                            {services.map((category) => {
                              const Icon = CATEGORY_ICONS[category.key];
                              return (
                                <button
                                  key={category.key}
                                  onClick={() => goToService(category.key)}
                                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-right text-sm text-slate-300 hover:bg-slate-800/60 hover:text-white cursor-pointer"
                                >
                                  <Icon className="w-4 h-4 text-blue-400 shrink-0" />
                                  <span className="flex-1">{category.cardTitle}</span>
                                  <span className="text-[11px] text-slate-500">{servicesCount(category.items.length)}</span>
                                </button>
                              );
                            })}
                            <button
                              onClick={() => goToService('all')}
                              className="px-3 py-2 rounded-lg text-right text-xs font-bold text-blue-400 hover:bg-slate-800/60 cursor-pointer"
                            >
                              عرض جميع الخدمات والأسعار ←
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return (
                    <button
                      key={link.id}
                      onClick={() => handleLinkClick(link.id, link.href)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-right font-medium text-sm transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-blue-600/20 text-blue-400 font-bold border-r-4 border-blue-500'
                          : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronLeft className="w-4 h-4 text-slate-500" />
                    </button>
                  );
                })}

              </div>
            </div>

            {/* Bottom Actions inside drawer */}
            <div className="pt-4 border-t border-slate-800 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>احجز موعد الآن</span>
              </button>

              <button
                onClick={openWhatsApp}
                className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>محادثة واتساب مباشرة</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-1">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span dir="ltr">{contact.phoneDisplay}</span>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};
