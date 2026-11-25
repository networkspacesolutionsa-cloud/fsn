import React from 'react';
import { ChevronLeft, MessageCircle, Phone } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp';
import { RichText } from '../components/RichText';
import { useContent, whatsappUrl, telUrl } from '../content/ContentContext';
import { POLICIES, POLICIES_UPDATED, POLICY_KEYS, PolicyKey, policyPath } from '../content/policies';

const openBooking = () => window.location.assign('/#booking');

/** Terms, privacy and returns pages, e.g. /refund-policy/ */
export const PolicyPage: React.FC<{ policy: PolicyKey }> = ({ policy: key }) => {
  const { contact } = useContent();
  const policy = POLICIES[key];

  // "{phone}" in the policy text becomes the contact number, tappable
  const withPhone = (text: string) => {
    const [before, after] = text.split('{phone}');
    if (after === undefined) return <RichText text={text} />;
    return (
      <>
        <RichText text={before} />
        <a href={telUrl(contact)} dir="ltr" className="font-bold text-blue-700 dark:text-blue-400 hover:underline whitespace-nowrap">
          {contact.phoneDisplay}
        </a>
        <RichText text={after} />
      </>
    );
  };

  return (
    <div dir="rtl" className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans">
      <Navbar activeTab="home" onTabChange={() => {}} onOpenBooking={openBooking} />

      <main className="flex-grow py-10 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <nav aria-label="مسار التنقل" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <li>
                <a href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">الرئيسية</a>
              </li>
              <li aria-hidden="true"><ChevronLeft className="w-3.5 h-3.5" /></li>
              <li aria-current="page" className="font-bold text-slate-800 dark:text-slate-200">{policy.title}</li>
            </ol>
          </nav>

          <article className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 sm:p-10 text-right">
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">{policy.title}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">آخر تحديث: {POLICIES_UPDATED}</p>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-loose mb-8">{policy.intro}</p>

            {policy.sections.map((section) => (
              <section key={section.heading} className="mb-8 last:mb-0">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 border-r-4 border-blue-600 pr-3">
                  {section.heading}
                </h2>
                {section.paragraphs?.map((p) => (
                  <p key={p} className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-loose">
                    {withPhone(p)}
                  </p>
                ))}
                {section.items && (
                  <ol className="list-decimal pr-6 space-y-2.5 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-loose marker:text-blue-600 marker:font-bold">
                    {section.items.map((item) => (
                      <li key={item}>{withPhone(item)}</li>
                    ))}
                  </ol>
                )}
              </section>
            ))}

            {/* Contact */}
            <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
              <a
                href={telUrl(contact)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition"
              >
                <Phone className="w-4 h-4" />
                <span>اتصل بنا</span>
                <span dir="ltr">{contact.phoneDisplay}</span>
              </a>
              <a
                href={whatsappUrl(contact, `السلام عليكم، لدي استفسار بخصوص ${policy.title} لدى FSN | فضاء الشبكات`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 hover:border-emerald-400 text-slate-800 dark:text-slate-100 font-bold text-sm transition"
              >
                <MessageCircle className="w-4 h-4 text-emerald-500" />
                <span>تواصل عبر واتساب</span>
              </a>
            </div>
          </article>

          {/* The other policies */}
          <ul className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-bold">
            {POLICY_KEYS.filter((k) => k !== key).map((k) => (
              <li key={k}>
                <a href={policyPath(k)} className="text-blue-700 dark:text-blue-400 hover:underline">
                  {POLICIES[k].title}
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
