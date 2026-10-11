import React from 'react';
import { Package, Sparkles, Clock, CheckCircle2, Home } from 'lucide-react';
import { useContent } from '../content/ContentContext';
import type { ServicePackage } from '../content/types';

interface PackagesSectionProps {
  onOpenBooking: () => void;
  onSelectPackage: (packageTitle: string, category: string) => void;
}

/** Department name the booking form uses for packages */
const PACKAGES_DEPARTMENT = 'باقات متكاملة';

type SelectPackage = PackagesSectionProps['onSelectPackage'];

const cleanList = (list: string[]) => list.filter((i) => i.trim());

const IncludesList: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="space-y-2 mb-4">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
        <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const PriceLine: React.FC<{ price: string; oldPrice: string }> = ({ price, oldPrice }) =>
  price || oldPrice ? (
    <div className="flex items-baseline flex-wrap gap-x-3 gap-y-1 mb-4">
      {price && <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">{price}</span>}
      {oldPrice && <span className="text-sm text-slate-400 dark:text-slate-500 line-through">{oldPrice}</span>}
    </div>
  ) : null;

const PackageCard: React.FC<{ pkg: ServicePackage; onSelect: SelectPackage }> = ({ pkg, onSelect }) => {
  const includes = cleanList(pkg.includes);
  return (
    <div
      className={`relative w-full bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 flex flex-col text-right shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
        pkg.featured ? 'border-2 border-blue-600 shadow-blue-600/10' : 'border border-slate-200/90 dark:border-slate-800'
      }`}
    >
      {pkg.badge && (
        <span className="absolute z-10 -top-3 right-5 px-3 py-1 rounded-full bg-blue-600 text-white text-[11px] font-bold shadow-md shadow-blue-600/30">
          {pkg.badge}
        </span>
      )}

      {pkg.image && (
        // Bleeds to the card edges; the badge sits above it on the top border
        <div className="-mx-5 sm:-mx-6 -mt-5 sm:-mt-6 mb-4 aspect-[16/10] overflow-hidden rounded-t-2xl bg-slate-100 dark:bg-slate-800">
          <img src={pkg.image} alt={pkg.title} loading="lazy" className="w-full h-full object-cover" />
        </div>
      )}

      {pkg.target && (
        <span className="self-start inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-[11px] font-bold mb-3 mt-1">
          <Home className="w-3 h-3" />
          {pkg.target}
        </span>
      )}
      <h3 className={`text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug mb-3 ${pkg.target ? '' : 'mt-1'}`}>
        {pkg.title}
      </h3>

      <PriceLine price={pkg.price} oldPrice={pkg.oldPrice} />

      {pkg.description && (
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">{pkg.description}</p>
      )}

      {includes.length > 0 && <IncludesList items={includes} />}

      {pkg.note && <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{pkg.note}</p>}

      <button
        type="button"
        onClick={() => onSelect(pkg.title, PACKAGES_DEPARTMENT)}
        className={`mt-auto w-full py-3 rounded-xl font-bold text-sm transition cursor-pointer ${
          pkg.featured
            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30'
            : 'bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300'
        }`}
      >
        اطلب هذه الباقة
      </button>
    </div>
  );
};

export const PackagesSection: React.FC<PackagesSectionProps> = ({ onOpenBooking, onSelectPackage }) => {
  const { packages } = useContent();

  return (
    <section id="packages" className="py-16 sm:py-20 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-bold mb-3">
            <Package className="w-3.5 h-3.5" />
            <span>الباقات المتكاملة</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            الباقات
          </h2>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            حلول متكاملة تناسب احتياجك
          </p>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {packages.length > 0
              ? 'باقات متخصصة تجمع الخدمات والحلول المناسبة للمنازل والمنشآت، بخيارات واضحة ومتكاملة تناسب احتياجك.'
              : 'نعمل على إعداد باقات متخصصة تجمع الخدمات والحلول المناسبة للمنازل والمنشآت، بحيث يحصل العميل على خيارات واضحة ومتكاملة تناسب احتياجه.'}
          </p>
        </div>

        {packages.length > 0 ? (
          <>
            {/* flex-wrap + justify-center keeps one or two packages centred */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 pt-3 mb-8">
              {packages.map((pkg) => (
                <div key={pkg.id} className="w-full md:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)] flex">
                  <PackageCard pkg={pkg} onSelect={onSelectPackage} />
                </div>
              ))}
            </div>
            <div className="text-center">
              <button
                type="button"
                onClick={onOpenBooking}
                className="text-sm font-bold text-blue-700 dark:text-blue-300 hover:underline cursor-pointer"
              >
                تحتاج باقة مخصصة لمنشأتك؟ تواصل معنا
              </button>
            </div>
          </>
        ) : (
          /* Coming Soon Card — shown until packages are added in the control panel */
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-slate-50 dark:from-slate-900 via-blue-50/40 dark:via-blue-950/20 to-slate-50 dark:to-slate-950 rounded-3xl border-2 border-dashed border-blue-300 p-8 sm:p-12 text-center shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-6 shadow-md shadow-blue-600/30">
              <Sparkles className="w-8 h-8" />
            </div>

            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 text-white text-xs sm:text-sm font-black mb-4">
              <Clock className="w-4 h-4" />
              <span>الباقات قريبًا</span>
            </span>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3">
              سيتم إضافة الباقات إلى الموقع بعد الانتهاء من دراسة تفاصيلها واعتمادها
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto mb-8">
              باقات مخصصة للفلل السكنية، المكاتب، والمتاجر تشمل (كاميرات المراقبة + تقوية شبكة الواي فاي + جهاز الإنتركوم الذكي) بأسعار تشجيعية وضمان موحد.
            </p>

            <button
              type="button"
              onClick={onOpenBooking}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition cursor-pointer"
            >
              تواصل معنا لتصميم باقة مخصصة لمنشأتك
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
