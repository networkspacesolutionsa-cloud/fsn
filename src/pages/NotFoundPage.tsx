import React from 'react';
import { Home } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp';
import { useContent } from '../content/ContentContext';
import { SERVICE_SEO, servicePath } from '../seo/pages';

const openBooking = () => window.location.assign('/#booking');

/** Served by Cloudflare with a 404 status for any unknown path (dist/404.html) */
export const NotFoundPage: React.FC = () => {
  const { services } = useContent();

  return (
    <div dir="rtl" className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans">
      <Navbar activeTab="home" onTabChange={() => {}} onOpenBooking={openBooking} />

      <main className="flex-grow py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-6xl sm:text-7xl font-black text-blue-600 dark:text-blue-400 mb-4">404</p>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-4">الصفحة غير موجودة</h1>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
            ربما تغيّر رابط الصفحة أو أُزيلت. يمكنك العودة إلى الصفحة الرئيسية أو تصفح خدماتنا:
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 transition mb-10"
          >
            <Home className="w-4 h-4" />
            <span>الصفحة الرئيسية</span>
          </a>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm font-bold">
            {services.map((category) => (
              <li key={category.key}>
                <a
                  href={servicePath(category.key)}
                  className="block px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 text-slate-800 dark:text-slate-100 transition"
                >
                  {SERVICE_SEO[category.key].heading}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <Footer onTabChange={() => {}} onOpenBooking={openBooking} />
      <FloatingWhatsApp />
    </div>
  );
};
