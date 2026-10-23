import React, { useEffect, useState } from 'react';
import { Network, Video, Tv, ArrowLeft, Zap } from 'lucide-react';
import { useContent } from '../content/ContentContext';
import type { CategoryKey, ServiceCategory, ServiceItem } from '../content/types';
import { RichText } from './RichText';
import { SHOW_SERVICE_EVENT, ShowServiceDetail } from './serviceNav';
import { servicePath } from '../seo/pages';

interface ServicesSectionProps {
  onSelectService: (serviceName: string, category: string) => void;
}

const CATEGORY_ICONS: Record<CategoryKey, React.ElementType> = {
  networks: Network,
  cameras: Video,
  intercom: Tv,
};

// The bundled camera photo has the camera in its upper half; uploaded photos stay centred
const imagePosition = (category: ServiceCategory) =>
  category.cardImage === '/images/cctv-camera-white.webp' ? 'object-[center_35%]' : '';

export const ServiceCard: React.FC<{
  item: ServiceItem;
  category: ServiceCategory;
  onSelect: ServicesSectionProps['onSelectService'];
  highlighted?: boolean;
  /** h4 under the home page's category headings, h3 on a service page */
  headingLevel?: 3 | 4;
}> = ({ item, category, onSelect, highlighted = false, headingLevel = 4 }) => {
  const Heading = headingLevel === 3 ? 'h3' : 'h4';
  return (
    <div
      id={`service-${item.id}`}
      className={`scroll-mt-28 target:ring-2 target:ring-blue-500 target:ring-offset-2 target:ring-offset-slate-50 dark:target:ring-offset-slate-950 bg-white dark:bg-slate-900 sm:bg-slate-50/80 dark:sm:bg-slate-800/40 rounded-2xl p-5 sm:p-6 border border-slate-200/70 dark:border-slate-800 shadow-sm sm:shadow-none flex flex-col justify-between text-right transition-shadow duration-500 ${
        highlighted ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-950' : ''
      }`}
    >
      <div>
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 mb-3">
          {item.badge && (
            <span
              className={
                item.badgeTone === 'price'
                  ? 'px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs font-bold font-mono'
                  : 'px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-xs font-bold'
              }
            >
              {item.badge}
            </span>
          )}
          {item.sideNote && <span className="text-xs text-slate-500 dark:text-slate-400">{item.sideNote}</span>}
        </div>
        <Heading className="text-lg font-bold text-blue-700 dark:text-blue-400 mb-2">
          <RichText text={item.title} />
        </Heading>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
          <RichText text={item.description} />
        </p>
        {(item.details || item.detailsNote) && (
          <div
            className={
              item.detailsTone === 'info'
                ? 'bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 rounded-xl p-3 text-xs text-blue-900 dark:text-blue-200 mb-5 leading-relaxed space-y-1'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-700 dark:text-slate-200 mb-5 leading-relaxed space-y-1'
            }
          >
            {item.details && (
              <RichText
                text={item.details}
                boldClass={item.detailsTone === 'info' ? 'text-blue-950 dark:text-blue-100' : 'text-slate-900 dark:text-white'}
              />
            )}
            {item.detailsNote && <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{item.detailsNote}</p>}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => onSelect(item.title, category.name)}
        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-sm transition cursor-pointer"
      >
        {item.buttonLabel || 'احجز الخدمة'}
      </button>
    </div>
  );
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const { services } = useContent();
  const [activeCategory, setActiveCategory] = useState<'all' | CategoryKey>('all');
  const [highlightId, setHighlightId] = useState<string | null>(null);

  // Header dropdown → show the chosen category (and flash the chosen service)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onShow = (e: Event) => {
      const { category, itemId } = (e as CustomEvent<ShowServiceDetail>).detail;
      setActiveCategory(category);
      setHighlightId(itemId ?? null);
      // wait for the filtered sections to render before scrolling
      requestAnimationFrame(() => {
        const target = document.getElementById(itemId ? `service-${itemId}` : category === 'all' ? 'services' : category);
        target?.scrollIntoView({ behavior: 'smooth', block: itemId ? 'center' : 'start' });
      });
      clearTimeout(timer);
      if (itemId) timer = setTimeout(() => setHighlightId(null), 2500);
    };
    window.addEventListener(SHOW_SERVICE_EVENT, onShow);
    return () => {
      window.removeEventListener(SHOW_SERVICE_EVENT, onShow);
      clearTimeout(timer);
    };
  }, []);

  const filterButtonClass = (active: boolean) =>
    `px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer whitespace-nowrap ${
      active
        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
    }`;

  const visible = services.filter((c) => activeCategory === 'all' || activeCategory === c.key);

  // The filter bar sits at the top of the section; jump down to the services it shows
  const applyFilter = (key: 'all' | CategoryKey) => {
    setActiveCategory(key);
    requestAnimationFrame(() =>
      document.getElementById(key === 'all' ? 'service-details' : key)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    );
  };

  return (
    <section id="services" className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-950 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Filter Bar (top of the section) */}
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 mb-8 sm:mb-12 overflow-x-auto scrollbar-none pb-2">
          <div className="flex items-center gap-2 sm:gap-3 w-max mx-auto">
            <button onClick={() => applyFilter('all')} className={filterButtonClass(activeCategory === 'all')}>
              جميع الخدمات والتفاصيل
            </button>
            {services.map((category) => (
              <button
                key={category.key}
                onClick={() => applyFilter(category.key)}
                className={filterButtonClass(activeCategory === category.key)}
              >
                {category.filterLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Main Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-bold mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>خدمات التركيب</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            خدمات فضاء الشبكات
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            نقدم حلولًا متكاملة باحترافية عالية مع وضوح تام في تفاصيل الخدمة والتكلفة قبل البدء
          </p>
        </div>

        {/* 1. Category Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 lg:gap-8 mb-12 sm:mb-20">
          {services.map((category) => {
            const Icon = CATEGORY_ICONS[category.key];
            return (
              <div
                key={category.key}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={category.cardImage}
                    alt={category.cardTitle}
                    loading="lazy"
                    className={`w-full h-48 sm:h-52 object-cover ${imagePosition(category)}`}
                  />
                  <div className="absolute -bottom-5 right-5 w-12 h-12 rounded-xl bg-blue-600 text-white shadow-lg flex items-center justify-center border-2 border-white dark:border-slate-900">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="p-6 md:p-5 lg:p-6 pt-8 md:pt-8 lg:pt-8 flex-1 flex flex-col justify-between text-right">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      <a href={servicePath(category.key)} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {category.cardTitle}
                      </a>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                      <RichText text={category.cardDescription} />
                    </p>
                  </div>
                  <a
                    href={servicePath(category.key)}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm md:text-xs lg:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition cursor-pointer self-start whitespace-nowrap group"
                  >
                    <span>{category.cardLinkLabel}</span>
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. Detailed Sections */}
        <div id="service-details" className="scroll-mt-24">
          {visible.map((category, index) => (
            <div
              key={category.key}
              id={category.key}
              className={`${index === visible.length - 1 ? 'mb-8' : 'mb-12 sm:mb-20'} scroll-mt-24`}
            >
              <div className="sm:bg-white dark:sm:bg-slate-900 sm:rounded-3xl sm:p-10 sm:border sm:border-slate-200/90 dark:sm:border-slate-800 sm:shadow-sm">
                <div className="border-b border-slate-200 dark:border-slate-800 sm:border-slate-100 dark:sm:border-slate-800 pb-5 sm:pb-6 mb-6 sm:mb-8 text-right">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">
                    {category.sectionLabel}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-3">
                    {category.sectionTitle}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
                    <RichText text={category.sectionDescription} />
                  </p>
                </div>

                <div
                  className={`grid grid-cols-1 ${
                    category.items.length % 3 === 0 ? 'md:grid-cols-3' : 'md:grid-cols-2'
                  } gap-4 sm:gap-6`}
                >
                  {category.items.map((item) => (
                    <ServiceCard key={item.id} item={item} category={category} onSelect={onSelectService} highlighted={highlightId === item.id} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
