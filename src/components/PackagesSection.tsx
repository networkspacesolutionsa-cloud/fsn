import React from 'react';
import { Package, Sparkles, Clock, CheckCircle2, Home, Layers, Star } from 'lucide-react';
import { useContent } from '../content/ContentContext';
import type { ServicePackage, SubPackage } from '../content/types';

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

/** Signal-strength bars: the option's level within its group (1 bar = first option) */
const LevelBars: React.FC<{ level: number; total: number; active: boolean }> = ({ level, total, active }) => (
  <span className="inline-flex items-end gap-[3px] h-5 shrink-0" aria-hidden="true">
    {Array.from({ length: total }, (_, i) => (
      <span
        key={i}
        style={{ height: `${((i + 1) / total) * 100}%` }}
        className={`w-1.5 rounded-sm ${
          i < level ? (active ? 'bg-blue-600 dark:bg-blue-400' : 'bg-slate-500 dark:bg-slate-400') : 'bg-slate-200 dark:bg-slate-700'
        }`}
      />
    ))}
  </span>
);

const SubPackageCard: React.FC<{
  group: ServicePackage;
  sub: SubPackage;
  level: number;
  total: number;
  hasShared: boolean;
  onSelect: SelectPackage;
}> = ({ group, sub, level, total, hasShared, onSelect }) => {
  const includes = cleanList(sub.includes);
  return (
    <div
      className={`relative h-full bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 flex flex-col text-right transition-all duration-300 hover:shadow-xl ${
        sub.featured
          ? 'border-2 border-blue-600 shadow-lg shadow-blue-600/15 md:-translate-y-2'
          : 'border border-slate-200/90 dark:border-slate-800 shadow-sm hover:-translate-y-1'
      }`}
    >
      {sub.badge && (
        <span className="absolute z-10 -top-3 right-5 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-l from-blue-600 to-sky-500 text-white text-[11px] font-bold shadow-md shadow-blue-600/30">
          <Star className="w-3 h-3 fill-white" />
          {sub.badge}
        </span>
      )}

      {sub.image && (
        // Bleeds to the card edges; the badge sits above it on the top border
        <div className="-mx-5 sm:-mx-6 -mt-5 sm:-mt-6 mb-4 aspect-[16/10] overflow-hidden rounded-t-2xl bg-slate-100 dark:bg-slate-800">
          <img src={sub.image} alt={sub.title} loading="lazy" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex items-center justify-between gap-3 mb-3 mt-1">
        <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">{sub.title}</h4>
        {total > 1 && <LevelBars level={level} total={total} active={sub.featured} />}
      </div>

      <PriceLine price={sub.price} oldPrice={sub.oldPrice} />

      {sub.description && (
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">{sub.description}</p>
      )}

      {(includes.length > 0 || hasShared) && <div className="border-t border-dashed border-slate-200 dark:border-slate-800 mb-4" />}

      {hasShared && (
        <p className="flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-700 dark:text-blue-300 mb-2">
          <Layers className="w-4 h-4 flex-shrink-0" />
          جميع المزايا الأساسية للباقة
        </p>
      )}
      {includes.length > 0 && <IncludesList items={includes} />}

      <button
        type="button"
        onClick={() => onSelect(`${group.title} - ${sub.title}`, PACKAGES_DEPARTMENT)}
        className={`mt-auto w-full py-3 rounded-xl font-bold text-sm transition cursor-pointer ${
          sub.featured
            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30'
            : 'bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300'
        }`}
      >
        اطلب {sub.title}
      </button>
    </div>
  );
};

// Tailwind needs literal class names, so pick the desktop grid by option count
const SUB_GRID: Record<number, string> = {
  1: 'md:grid-cols-1 md:max-w-md md:mx-auto',
  2: 'md:grid-cols-2 md:max-w-4xl md:mx-auto',
  3: 'md:grid-cols-3',
};

/** A package that branches into priced options: shared header on top, options side by side below */
const PackageGroup: React.FC<{ group: ServicePackage; subs: SubPackage[]; onSelect: SelectPackage }> = ({ group, subs, onSelect }) => {
  const shared = cleanList(group.includes);
  const many = subs.length > 1;
  return (
    <div className="rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shadow-sm">
      <div className="relative overflow-hidden bg-gradient-to-br from-fsn-navy via-[#0d2a52] to-fsn-blue text-white p-6 sm:p-8 lg:p-10">
        {/* Network-node dot grid + soft glow */}
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.14)_1px,transparent_0)] bg-[length:22px_22px]" />
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-sky-400/25 blur-3xl" />

        <div className={`relative grid gap-6 lg:gap-10 items-center ${group.image ? 'lg:grid-cols-[1fr_22rem]' : ''}`}>
          <div className="text-right">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {group.badge && (
                <span className="px-3 py-1 rounded-full bg-white text-blue-700 text-[11px] font-black">{group.badge}</span>
              )}
              {group.target && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-bold">
                  <Home className="w-3 h-3" />
                  {group.target}
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-bold">
                <Layers className="w-3 h-3" />
                {subs.length === 1 ? 'خيار واحد' : subs.length === 2 ? 'خياران' : `${subs.length} خيارات`}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black leading-snug mb-2">{group.title}</h3>
            {(group.price || group.oldPrice) && (
              <p className="flex items-baseline flex-wrap gap-x-2 gap-y-1 mb-3">
                <span className="text-sm text-blue-100">تبدأ من</span>
                {group.price && <span className="text-2xl font-black text-sky-300">{group.price}</span>}
                {group.oldPrice && <span className="text-sm text-blue-200/70 line-through">{group.oldPrice}</span>}
              </p>
            )}
            {group.description && (
              <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed max-w-2xl mb-5">{group.description}</p>
            )}

            {shared.length > 0 && (
              <div>
                <p className="text-xs font-bold text-sky-300 mb-2.5">المزايا الأساسية في جميع الخيارات</p>
                <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                  {shared.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-white/90">
                      <CheckCircle2 className="w-4 h-4 text-sky-300 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {group.image && (
            <div className="order-first lg:order-none aspect-[16/10] rounded-2xl overflow-hidden ring-1 ring-white/20 shadow-2xl shadow-black/30">
              <img src={group.image} alt={group.title} loading="lazy" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between gap-3 mb-1">
          <p className="text-sm font-black text-slate-900 dark:text-white">اختر الخيار المناسب لك</p>
          {many && <p className="md:hidden text-[11px] text-slate-500 dark:text-slate-400">اسحب لعرض المزيد ←</p>}
        </div>

        {/* Phone: swipeable row of options. Tablet and up: a grid. */}
        <div
          className={`flex md:grid gap-4 md:gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 pt-5 pb-3 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            SUB_GRID[subs.length] ?? 'md:grid-cols-2 xl:grid-cols-4'
          }`}
        >
          {subs.map((sub, i) => (
            <div key={sub.id} className={`${many ? 'w-[85%] sm:w-[60%]' : 'w-full'} md:w-auto shrink-0 snap-center`}>
              <SubPackageCard
                group={group}
                sub={sub}
                level={i + 1}
                total={subs.length}
                hasShared={shared.length > 0}
                onSelect={onSelect}
              />
            </div>
          ))}
        </div>

        {group.note && (
          <p className="mt-5 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-relaxed text-center">{group.note}</p>
        )}
      </div>
    </div>
  );
};

const visibleSubs = (pkg: ServicePackage) => (pkg.subPackages ?? []).filter((s) => s.title.trim());

/** Keep the admin's order: runs of single packages share a grid, each group gets a full-width block */
const toSegments = (packages: ServicePackage[]) => {
  const segments: ({ kind: 'singles'; items: ServicePackage[] } | { kind: 'group'; pkg: ServicePackage; subs: SubPackage[] })[] = [];
  for (const pkg of packages) {
    const subs = visibleSubs(pkg);
    if (subs.length > 0) {
      segments.push({ kind: 'group', pkg, subs });
    } else {
      const last = segments[segments.length - 1];
      if (last?.kind === 'singles') last.items.push(pkg);
      else segments.push({ kind: 'singles', items: [pkg] });
    }
  }
  return segments;
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
            <div className="space-y-10 sm:space-y-12 mb-8">
              {toSegments(packages).map((seg) =>
                seg.kind === 'group' ? (
                  <PackageGroup key={seg.pkg.id} group={seg.pkg} subs={seg.subs} onSelect={onSelectPackage} />
                ) : (
                  // flex-wrap + justify-center keeps one or two packages centred
                  <div key={seg.items[0].id} className="flex flex-wrap justify-center gap-6 sm:gap-8 pt-3">
                    {seg.items.map((pkg) => (
                      <div key={pkg.id} className="w-full md:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)] flex">
                        <PackageCard pkg={pkg} onSelect={onSelectPackage} />
                      </div>
                    ))}
                  </div>
                )
              )}
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
