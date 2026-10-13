/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar, TabKey } from './components/Navbar';
import { HeroGraphic } from './components/HeroGraphic';
import { ServicesSection } from './components/ServicesSection';
import { GallerySection } from './components/GallerySection';
import { LatestWorkSlider } from './components/LatestWorkSlider';
import { PackagesSection } from './components/PackagesSection';
import { WhyUsSection } from './components/WhyUsSection';
import { OffersSection } from './components/OffersSection';
import { ReviewsSection } from './components/ReviewsSection';
import { BookingForm } from './components/BookingForm';
import { FaqSection } from './components/FaqSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { TrustBanner } from './components/TrustBanner';
import { Footer } from './components/Footer';
import { Calendar, ArrowLeft, MessageCircle, CheckCircle2 } from 'lucide-react';
import { useContent, whatsappUrl } from './content/ContentContext';

// Hero highlight chips use the logo's brand blue
const HIGHLIGHT_TONE = 'border-blue-200 dark:border-blue-800/60 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400';

export default function App() {
  const { contact, hero } = useContent();
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [preselectedService, setPreselectedService] = useState<string>('');
  const [preselectedCategory, setPreselectedCategory] = useState<string>('');

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
  };

  const handleOpenBooking = () => {
    const bookingElement = document.getElementById('booking');
    if (bookingElement) {
      bookingElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreServices = () => {
    const servicesElement = document.getElementById('services');
    if (servicesElement) {
      servicesElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectServiceFromCard = (serviceName: string, category: string) => {
    setPreselectedService(serviceName);
    setPreselectedCategory(category);
    const bookingElement = document.getElementById('booking');
    if (bookingElement) {
      bookingElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectWorkFromGallery = (workTitle: string) => {
    setPreselectedService(workTitle);
    const bookingElement = document.getElementById('booking');
    if (bookingElement) {
      bookingElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openWhatsApp = () => {
    window.open(
      whatsappUrl(contact, 'السلام عليكم، أود حجز موعد استشارة ومعاينة لدى FSN | فضاء الشبكات'),
      '_blank'
    );
  };

  return (
    <div dir="rtl" className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Header / Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenBooking={handleOpenBooking}
      />

      <main className="flex-grow">
        {/* 2. Hero Section - Exact Approved Text */}
        <section id="home" className="relative pt-8 pb-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white dark:from-slate-950 via-slate-50/80 dark:via-slate-950 to-slate-100 dark:to-slate-900 overflow-hidden">
          {/* Subtle Ambient Background Mesh */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/40 dark:bg-blue-900/20 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute top-1/3 left-10 w-80 h-80 bg-slate-200/50 dark:bg-slate-800/40 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              
              {/* Right Side (in RTL): Hero Text & Exact Actions */}
              <div className="lg:col-span-6 flex flex-col items-start text-right">
                
                {/* Main Headline */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.25] mb-5">
                  <span>{hero.titleLine1}</span>
                  <span className="block text-blue-600 dark:text-blue-400 mt-1">
                    {hero.titleLine2}
                  </span>
                </h1>

                {/* Subtitle Paragraph */}
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mb-8">
                  {hero.subtitle}
                </p>

                {/* 2 Primary CTA Buttons from Document */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto mb-8">
                  <button
                    onClick={handleOpenBooking}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 sm:px-7 py-3.5 rounded-xl whitespace-nowrap bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/30 transition-all duration-200 hover:shadow-blue-500/40 cursor-pointer group"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>احجز موعد</span>
                  </button>

                  <button
                    onClick={handleExploreServices}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 sm:px-7 py-3.5 rounded-xl whitespace-nowrap bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-sm sm:text-base shadow-xs transition-all duration-200 cursor-pointer hover:border-blue-400 group"
                  >
                    <span>استكشف خدمات التركيب</span>
                    <ArrowLeft className="w-4 h-4 text-blue-600 dark:text-blue-400 transition-transform group-hover:-translate-x-1" />
                  </button>
                </div>

                {/* Selling points — large badges so they read at a glance */}
                {hero.highlights.some((h) => h.text.trim()) && (
                  <div className="pt-5 border-t border-slate-200/80 dark:border-slate-800 w-full flex flex-wrap items-center gap-2.5 sm:gap-3">
                    {hero.highlights.filter((h) => h.text.trim()).map((h) => (
                      <span
                        key={h.id}
                        className={`inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-white dark:bg-slate-900 border shadow-sm text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 ${HIGHLIGHT_TONE}`}
                      >
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        {h.text}
                      </span>
                    ))}
                  </div>
                )}

              </div>

              {/* Left Side (in RTL): High-Tech Hardware Composite Visual */}
              <div className="lg:col-span-6 flex items-center justify-center">
                {hero.image ? (
                  <div className="relative w-full max-w-xl mx-auto p-2 sm:p-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100/60 via-slate-100/40 to-blue-50/50 dark:from-blue-900/30 dark:via-slate-900/30 dark:to-blue-950/30 rounded-3xl -rotate-1 scale-95 blur-xl -z-10" />
                    <img
                      src={hero.image}
                      alt={`${hero.titleLine1} ${hero.titleLine2}`}
                      className="w-full aspect-[16/11] object-cover rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xl"
                    />
                  </div>
                ) : (
                  <HeroGraphic />
                )}
              </div>

            </div>
          </div>
        </section>

        {/* Latest work slider: the newest gallery works right after the hero */}
        <LatestWorkSlider onSelectBookingForWork={handleSelectWorkFromGallery} />

        {/* 3. Services Section ("خدمات التركيب" مع تفاصيل الشبكات، كاميرات المراقبة، الإنتركوم والأسعار) */}
        <ServicesSection onSelectService={handleSelectServiceFromCard} />

        {/* 4. Gallery Section ("أعمال سابقة") */}
        <GallerySection onSelectBookingForWork={handleSelectWorkFromGallery} />

        {/* 5. Packages Section ("الباقات - حلول متكاملة تناسب احتياجك") */}
        <PackagesSection onOpenBooking={handleOpenBooking} onSelectPackage={handleSelectServiceFromCard} />

        {/* 5. Why Us Section ("لماذا فضاء الشبكات؟" + "كيف نعمل؟" + "هل تعلم؟") */}
        <WhyUsSection />

        {/* 6. Offers Section ("عروض أسعار المشاريع") */}
        <OffersSection onSelectOffer={handleSelectServiceFromCard} />

        {/* 7. Reviews Section ("تقييمات العملاء - تجارب عملائنا تهمنا") */}
        <ReviewsSection />

        {/* 8. Booking Form ("احجز موعد - أخبرنا ماذا تحتاج") */}
        <BookingForm
          initialService={preselectedService}
          initialCategory={preselectedCategory}
        />

        {/* 9. About Section ("من نحن - فضاء الشبكات | FSN") */}
        <AboutSection />

        {/* 10. FAQ Section ("الأسئلة الشائعة") */}
        <FaqSection />

        {/* 11. Contact Section ("تواصل معنا - نحن هنا لخدمتك") */}
        <ContactSection />

        {/* 12. Trust Banner (Dark Blue Foundation Band) */}
        <TrustBanner />
      </main>

      {/* 13. Footer */}
      <Footer onTabChange={handleTabChange} onOpenBooking={handleOpenBooking} />

      {/* Floating Instant WhatsApp Button */}
      <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40">
        <button
          onClick={openWhatsApp}
          title="محادثة واتساب سريعة مع فضاء الشبكات"
          aria-label="واتساب"
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white flex items-center justify-center shadow-xl shadow-emerald-500/40 hover:scale-110 transition-all duration-200 cursor-pointer"
        >
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
      </div>
    </div>
  );
}
