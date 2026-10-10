import React from 'react';
import { BadgePercent, CheckCircle2, FileText, MessageCircle, Sparkles } from 'lucide-react';
import { useContent, whatsappUrl } from '../content/ContentContext';
import type { Offer } from '../content/types';

interface OffersSectionProps {
  onSelectOffer: (offerTitle: string, category: string) => void;
}

const CUSTOM_QUOTE = 'عرض سعر مخصص لمشروع';

const OfferCard: React.FC<{ offer: Offer; onSelect: OffersSectionProps['onSelectOffer'] }> = ({ offer, onSelect }) => (
  <div
    className={`relative w-full bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 flex flex-col text-right shadow-sm hover:shadow-xl transition-all duration-300 ${
      offer.featured
        ? 'border-2 border-blue-600 shadow-blue-600/10'
        : 'border border-slate-200/90 dark:border-slate-800'
    }`}
  >
    {offer.badge && (
      <span className="absolute -top-3 right-5 px-3 py-1 rounded-full bg-blue-600 text-white text-[11px] font-bold shadow-md shadow-blue-600/30">
        {offer.badge}
      </span>
    )}

    <span className="self-start px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-[11px] font-bold mb-3 mt-1">
      {offer.category}
    </span>
    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug mb-3">{offer.title}</h3>

    {(offer.price || offer.oldPrice) && (
      <div className="flex items-baseline flex-wrap gap-x-3 gap-y-1 mb-4">
        {offer.price && <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">{offer.price}</span>}
        {offer.oldPrice && (
          <span className="text-sm text-slate-400 dark:text-slate-500 line-through">{offer.oldPrice}</span>
        )}
      </div>
    )}

    {offer.description && (
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">{offer.description}</p>
    )}

    {offer.includes.filter((i) => i.trim()).length > 0 && (
      <ul className="space-y-2 mb-4">
        {offer.includes
          .filter((i) => i.trim())
          .map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
      </ul>
    )}

    {offer.note && <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{offer.note}</p>}

    <button
      type="button"
      onClick={() => onSelect(offer.title, offer.category)}
      className={`mt-auto w-full py-3 rounded-xl font-bold text-sm transition cursor-pointer ${
        offer.featured
          ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30'
          : 'bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300'
      }`}
    >
      اطلب هذا العرض
    </button>
  </div>
);

export const OffersSection: React.FC<OffersSectionProps> = ({ onSelectOffer }) => {
  const { offers, contact } = useContent();

  return (
    <section id="offers" className="py-16 sm:py-24 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-bold mb-3">
            <BadgePercent className="w-3.5 h-3.5" />
            <span>عروض الأسعار</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            عروض أسعار المشاريع
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            عروض واضحة ومحددة السعر لأكثر المشاريع طلبًا، ويمكنك أيضًا طلب عرض سعر مخصص يناسب موقعك واحتياجك.
          </p>
        </div>

        {offers.length > 0 && (
          // flex-wrap + justify-center keeps one or two offers centred instead of hugging the right edge
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-10 pt-3">
            {offers.map((offer) => (
              <div key={offer.id} className="w-full md:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)] flex">
                <OfferCard offer={offer} onSelect={onSelectOffer} />
              </div>
            ))}
          </div>
        )}

        {/* Custom quote — always available, and the whole section when no offers are published yet */}
        <div className="max-w-4xl mx-auto bg-gradient-to-l from-[#0b1a30] to-blue-900 rounded-3xl p-6 sm:p-8 text-right text-white shadow-xl flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
            {offers.length > 0 ? <FileText className="w-7 h-7 text-blue-200" /> : <Sparkles className="w-7 h-7 text-blue-200" />}
          </div>
          <div className="flex-1">
            <h3 className="text-xl sm:text-2xl font-black mb-2">
              {offers.length > 0 ? 'تحتاج عرض سعر مخصص لمشروعك؟' : 'اطلب عرض سعر لمشروعك'}
            </h3>
            <p className="text-sm text-blue-100/90 leading-relaxed">
              أرسل لنا تفاصيل مشروعك (شبكات، كاميرات مراقبة، إنتركوم أو مشروع متكامل)، وسنرسل لك عرض سعر واضحًا ومفصلًا بعد دراسة الاحتياج ومعاينة الموقع عند الحاجة.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 md:w-52 shrink-0">
            <button
              type="button"
              onClick={() => onSelectOffer(CUSTOM_QUOTE, 'باقات متكاملة')}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-blue-50 text-blue-700 font-bold text-sm shadow-md transition cursor-pointer"
            >
              اطلب عرض السعر
            </button>
            <button
              type="button"
              onClick={() =>
                window.open(whatsappUrl(contact, 'السلام عليكم، أود طلب عرض سعر لمشروع لدى FSN | فضاء الشبكات'), '_blank')
              }
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>عبر واتساب</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
