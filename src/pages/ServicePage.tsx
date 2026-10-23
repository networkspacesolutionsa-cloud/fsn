import React, { useState } from 'react';
import { Calendar, ChevronLeft, MessageCircle, ArrowLeft, Network, Video, Tv } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { ServiceCard } from '../components/ServicesSection';
import { GallerySection } from '../components/GallerySection';
import { BookingForm } from '../components/BookingForm';
import { FaqSection } from '../components/FaqSection';
import { ContactSection } from '../components/ContactSection';
import { TrustBanner } from '../components/TrustBanner';
import { Footer } from '../components/Footer';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp';
import { RichText } from '../components/RichText';
import { useContent, whatsappUrl } from '../content/ContentContext';
import type { CategoryKey } from '../content/types';
import { SERVICE_GALLERY, SERVICE_SEO, servicePath } from '../seo/pages';
import { NotFoundPage } from './NotFoundPage';

const CATEGORY_ICONS: Record<CategoryKey, React.ElementType> = { networks: Network, cameras: Video, intercom: Tv };

const scrollToBooking = () => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });

/** Landing page for one service category, e.g. /services/cctv-cameras/ */
export const ServicePage: React.FC<{ category: CategoryKey }> = ({ category: key }) => {
  const { contact, services, gallery, hero } = useContent();
  const [preselectedService, setPreselectedService] = useState('');
  const category = services.find((c) => c.key === key);
  if (!category) return <NotFoundPage />;

  const seo = SERVICE_SEO[key];
  const others = services.filter((c) => c.key !== key);
  const hasWorks = gallery.some((item) => SERVICE_GALLERY[key].includes(item.category));

  const selectService = (serviceName: string) => {
    setPreselectedService(serviceName);
    scrollToBooking();
  };

  const openWhatsApp = () => {
    window.open(whatsappUrl(contact, `السلام عليكم، أود الاستفسار عن خدمات ${category.cardTitle} لدى FSN | فضاء الشبكات`), '_blank');
  };

  return (
    <div dir="rtl" className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      <Navbar activeTab="services" onTabChange={() => {}} onOpenBooking={scrollToBooking} />

      <main className="flex-grow">
        {/* Hero */}
        <section className="relative pt-6 pb-14 sm:pt-10 sm:pb-20 bg-gradient-to-b from-white dark:from-slate-950 via-slate-50/80 dark:via-slate-950 to-slate-100 dark:to-slate-900 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="مسار التنقل" className="mb-6 sm:mb-10">
              <ol className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                <li>
                  <a href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">الرئيسية</a>
                </li>
                <li aria-hidden="true"><ChevronLeft className="w-3.5 h-3.5" /></li>
                <li>
                  <a href="/#services" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">خدمات التركيب</a>
                </li>
                <li aria-hidden="true"><ChevronLeft className="w-3.5 h-3.5" /></li>
                <li aria-current="page" className="font-bold text-slate-800 dark:text-slate-200">{category.cardTitle}</li>
              </ol>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              <div className="lg:col-span-6 flex flex-col items-start text-right">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-bold mb-4">
                  {category.sectionLabel}
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.25] mb-5">
                  {seo.heading}
                </h1>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mb-8">
                  <RichText text={category.cardDescription} />
                </p>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto mb-8">
                  <button
                    onClick={scrollToBooking}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 sm:px-7 py-3.5 rounded-xl whitespace-nowrap bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/30 transition-all duration-200 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>احجز موعد</span>
                  </button>
                  <button
                    onClick={openWhatsApp}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 sm:px-7 py-3.5 rounded-xl whitespace-nowrap bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-sm sm:text-base transition-all duration-200 cursor-pointer hover:border-emerald-400"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-500" />
                    <span>استفسر عبر واتساب</span>
                  </button>
                </div>
                {hero.highlights.some((h) => h.text.trim()) && (
                  <ul className="pt-5 border-t border-slate-200/80 dark:border-slate-800 w-full flex flex-wrap items-center gap-2.5">
                    {hero.highlights.filter((h) => h.text.trim()).map((h) => (
                      <li
                        key={h.id}
                        className="px-3.5 py-2 rounded-full bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800/60 shadow-sm text-sm font-bold text-slate-800 dark:text-slate-100"
                      >
                        {h.text}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {category.cardImage && (
                <div className="lg:col-span-6">
                  <img
                    src={category.cardImage}
                    alt={seo.heading}
                    fetchPriority="high"
                    className="w-full max-w-xl mx-auto aspect-[16/11] object-cover rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xl"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Services and prices */}
        <section id="prices" className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-950 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-right max-w-4xl mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                {category.sectionTitle}
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                <RichText text={category.sectionDescription} />
              </p>
            </div>
            <div className={`grid grid-cols-1 ${category.items.length % 3 === 0 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4 sm:gap-6`}>
              {category.items.map((item) => (
                <ServiceCard key={item.id} item={item} category={category} onSelect={selectService} headingLevel={3} />
              ))}
            </div>
          </div>
        </section>

        {hasWorks && (
          <GallerySection
            only={SERVICE_GALLERY[key]}
            title={`أعمال سابقة: ${category.cardTitle}`}
            onSelectBookingForWork={setPreselectedService}
          />
        )}

        <BookingForm initialService={preselectedService} initialCategory={category.name} />

        {/* The other service pages */}
        <section className="py-16 sm:py-20 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-8 text-right">
              خدمات أخرى من فضاء الشبكات
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {others.map((other) => {
                const Icon = CATEGORY_ICONS[other.key];
                return (
                  <a
                    key={other.key}
                    href={servicePath(other.key)}
                    className="group flex items-start gap-4 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 hover:border-blue-400 hover:shadow-lg transition-all text-right"
                  >
                    <span className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                        {SERVICE_SEO[other.key].heading}
                      </span>
                      <span className="block text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                        <RichText text={other.cardDescription} />
                      </span>
                    </span>
                    <ArrowLeft className="w-5 h-5 text-blue-600 dark:text-blue-400 self-center transition-transform group-hover:-translate-x-1" />
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <FaqSection />
        <ContactSection />
        <TrustBanner />
      </main>

      <Footer onTabChange={() => {}} onOpenBooking={scrollToBooking} />
      <FloatingWhatsApp />
    </div>
  );
};
