import React, { useState } from 'react';
import { Image as ImageIcon, ZoomIn, MapPin, SplitSquareHorizontal } from 'lucide-react';
import { useContent } from '../content/ContentContext';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { WorkDetailModal, hasCompare } from './WorkDetailModal';
import type { GalleryItem } from '../content/types';

// Cards shown before "عرض المزيد"
const PAGE_SIZE = 8;

interface GallerySectionProps {
  onSelectBookingForWork?: (workTitle: string) => void;
  /** Service pages: only these categories' works, without the category tabs */
  only?: GalleryItem['category'][];
  title?: string;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ onSelectBookingForWork, only, title = 'أعمال سابقة' }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'beforeAfter' | GalleryItem['category']>('all');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [showAll, setShowAll] = useState(false);

  const { gallery } = useContent();
  const galleryItems = only ? gallery.filter((item) => only.includes(item.category)) : gallery;

  const compareCount = galleryItems.filter(hasCompare).length;

  const filteredItems =
    selectedCategory === 'all'
      ? galleryItems
      : selectedCategory === 'beforeAfter'
        ? galleryItems.filter(hasCompare)
        : galleryItems.filter((item) => item.category === selectedCategory);
  const visibleItems = showAll ? filteredItems : filteredItems.slice(0, PAGE_SIZE);

  const handleBookWork = (work: GalleryItem) => {
    setActiveItem(null);
    if (onSelectBookingForWork) {
      onSelectBookingForWork(work.title);
    }
    const bookingEl = document.getElementById('booking');
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="gallery" className="py-16 sm:py-24 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-bold mb-3">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>من مواقع عملائنا</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            {title}
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            صور من أعمال نفّذها فريقنا: تركيب كاميرات المراقبة، وتجهيز كبائن الشبكات وأجهزة التسجيل، وأنظمة الإنتركوم ونقاط
            الواي فاي. وفي صور «قبل وبعد» حرّك الشريط لتقارن بين المرحلتين.
          </p>
        </div>

        {/* Filter Tabs */}
        {!only && (
          <div className="-mx-4 px-4 sm:mx-0 sm:px-0 mb-8 sm:mb-12 overflow-x-auto scrollbar-none pb-2">
            <div className="flex items-center gap-2 sm:gap-3 w-max mx-auto">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                جميع الصور ({galleryItems.length})
              </button>
              {compareCount > 0 && (
                <button
                  onClick={() => setSelectedCategory('beforeAfter')}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    selectedCategory === 'beforeAfter'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 hover:bg-blue-100 dark:hover:bg-blue-900/50'
                  }`}
                >
                  <SplitSquareHorizontal className="w-4 h-4" />
                  قبل وبعد ({compareCount})
                </button>
              )}
              <button
                onClick={() => setSelectedCategory('networks')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer whitespace-nowrap ${
                  selectedCategory === 'networks'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                الشبكات وكبائن السيرفرات
              </button>
              <button
                onClick={() => setSelectedCategory('cameras')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer whitespace-nowrap ${
                  selectedCategory === 'cameras'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                كاميرات المراقبة 4K
              </button>
              <button
                onClick={() => setSelectedCategory('intercom')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer whitespace-nowrap ${
                  selectedCategory === 'intercom'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                أنظمة الإنتركوم
              </button>
              <button
                onClick={() => setSelectedCategory('wifi')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer whitespace-nowrap ${
                  selectedCategory === 'wifi'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                أفياش ونقاط الواي فاي
              </button>
            </div>
          </div>
        )}

        {/* Gallery Grid (swipeable carousel on phones) */}
        <div className="-mx-4 px-4 scroll-px-4 flex sm:grid sm:mx-0 sm:px-0 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory scrollbar-none pb-2 sm:pb-0">
          {visibleItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group w-[80%] shrink-0 snap-start sm:w-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col text-right"
            >
              {/* Visual Card Canvas */}
              <div className={`relative w-full aspect-[4/3] bg-gradient-to-br ${item.gradient} p-4 flex flex-col justify-between overflow-hidden`}>
                {hasCompare(item) ? (
                  <>
                    <BeforeAfterSlider
                      before={item.beforeImage!}
                      after={item.image!}
                      alt={item.title}
                      beforeLabel={item.beforeLabel || undefined}
                      mode="hover"
                      hint
                      lazy
                      labelsClassName="top-12"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/75 pointer-events-none" />
                  </>
                ) : item.image ? (
                  <>
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Shade top and bottom so the badge and meta text stay readable */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/75 pointer-events-none" />
                  </>
                ) : (
                  /* Tech Grid Overlay */
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                )}

                {/* Top Badge */}
                <div className="relative z-10 flex justify-between items-center pointer-events-none">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white border border-white/20">
                    {item.badge}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                </div>

                {/* Central Emblem & Tech Visual (only when there is no photo yet) */}
                {!item.image && (
                  <div className="relative z-10 flex flex-col items-center justify-center py-4">
                    <div className="text-4xl sm:text-5xl drop-shadow-md group-hover:scale-110 transition-transform duration-300">
                      {item.iconSymbol}
                    </div>
                    <span className="text-[10px] text-blue-300 font-mono mt-2 font-bold tracking-wider">FSN</span>
                  </div>
                )}

                {/* Bottom Meta Bar on Image */}
                <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-200 pointer-events-none min-h-4">
                  {item.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-blue-400" />
                      <span>{item.location}</span>
                    </span>
                  )}
                  {item.date && <span>{item.date}</span>}
                </div>
              </div>

              {/* Card Text Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 block mb-1">
                    {item.categoryLabel}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                  {hasCompare(item) ? (
                    <>
                      <span>شاهد المقارنة قبل وبعد</span>
                      <SplitSquareHorizontal className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <span>تكبير الصورة والتفاصيل</span>
                      <ZoomIn className="w-3.5 h-3.5" />
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length > PAGE_SIZE && (
          <div className="mt-8 sm:mt-10 text-center">
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="px-6 py-3 rounded-xl border border-blue-200 dark:border-blue-800/60 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-sm font-bold transition cursor-pointer"
            >
              {showAll ? 'عرض أقل' : `عرض المزيد (${filteredItems.length - PAGE_SIZE})`}
            </button>
          </div>
        )}

      </div>

      {activeItem && <WorkDetailModal item={activeItem} onClose={() => setActiveItem(null)} onBook={handleBookWork} />}
    </section>
  );
};
