import React, { useState } from 'react';
import { Image as ImageIcon, ZoomIn, X, MapPin, Calendar, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useLockBodyScroll } from './useLockBodyScroll';
import { useContent } from '../content/ContentContext';
import type { GalleryItem } from '../content/types';

interface GallerySectionProps {
  onSelectBookingForWork?: (workTitle: string) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ onSelectBookingForWork }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | GalleryItem['category']>('all');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  useLockBodyScroll(activeItem !== null);

  const { gallery: galleryItems } = useContent();

  const filteredItems =
    selectedCategory === 'all'
      ? galleryItems
      : galleryItems.filter((item) => item.category === selectedCategory);

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
            <span>معرض الصور والأعمال الميدانية</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            معرض صور FSN | فضاء الشبكات
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            صور حقيقية وتوثيق ميداني لأحدث أعمال تمديد الشبكات، كبائن السيرفرات، كاميرات المراقبة 4K، وشاشات الإنتركوم الذكية في مختلف مدن ومناطق المملكة.
          </p>
        </div>

        {/* Filter Tabs */}
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

        {/* Gallery Grid (swipeable carousel on phones) */}
        <div className="-mx-4 px-4 scroll-px-4 flex sm:grid sm:mx-0 sm:px-0 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory scrollbar-none pb-2 sm:pb-0">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group w-[80%] shrink-0 snap-start sm:w-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col text-right"
            >
              {/* Visual Card Canvas */}
              <div className={`relative w-full aspect-[4/3] bg-gradient-to-br ${item.gradient} p-4 flex flex-col justify-between overflow-hidden`}>
                {item.image ? (
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
                <div className="relative z-10 flex justify-between items-center">
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
                    <span className="text-[10px] text-blue-300 font-mono mt-2 font-bold tracking-wider">
                      FSN REAL PROJECT
                    </span>
                  </div>
                )}

                {/* Bottom Meta Bar on Image */}
                <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-200">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-blue-400" />
                    <span>{item.location}</span>
                  </span>
                  <span>{item.date}</span>
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
                  <span>تكبير الصورة والتفاصيل</span>
                  <ZoomIn className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
            onClick={() => setActiveItem(null)}
          />

          <div className="flex min-h-full items-end sm:items-center justify-center pt-10 sm:p-4 text-center">
            <div className="relative w-full transform overflow-hidden rounded-t-3xl sm:rounded-3xl bg-white dark:bg-slate-900 text-right shadow-2xl transition-all sm:my-8 sm:max-w-2xl border border-slate-200 dark:border-slate-800">
              
              {/* Header */}
              <div className="bg-[#0b1a30] text-white px-5 sm:px-6 py-4 flex items-start sm:items-center justify-between gap-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-2 min-w-0">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-[10px] font-bold">
                    {activeItem.categoryLabel}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold">{activeItem.title}</h3>
                </div>
                <button
                  onClick={() => setActiveItem(null)}
                  aria-label="إغلاق"
                  className="w-9 h-9 shrink-0 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Large Visual Area */}
              <div className={`relative w-full aspect-[4/3] sm:aspect-[16/10] bg-gradient-to-br ${activeItem.gradient} p-4 sm:p-8 flex flex-col justify-between overflow-hidden select-none`}>
                {activeItem.image ? (
                  <>
                    <img src={activeItem.image} alt={activeItem.title} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50 pointer-events-none" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:24px_24px]" />
                )}

                <div className="relative z-10 flex justify-between items-center text-white">
                  <span className="px-3 py-1 rounded-full bg-blue-900/60 border border-blue-400/40 text-xs font-bold">
                    {activeItem.badge}
                  </span>
                  <span className="hidden sm:inline text-xs text-slate-300 font-mono">FSN-PROJECT-DOC</span>
                </div>

                {!activeItem.image && (
                  <div className="relative z-10 flex flex-col items-center justify-center my-auto">
                    <div className="text-5xl sm:text-7xl mb-2 drop-shadow-lg">
                      {activeItem.iconSymbol}
                    </div>
                    <span className="text-xs sm:text-sm text-blue-200 font-bold text-center">
                      فضاء الشبكات | صور المشاريع الحقيقية
                    </span>
                  </div>
                )}

                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-xs text-slate-200 bg-black/40 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
                  <span className="flex items-center gap-1.5 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    <span>الموقع: {activeItem.location}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>تاريخ التنفيذ: {activeItem.date}</span>
                  </span>
                </div>
              </div>

              {/* Details & Specs */}
              <div className="p-5 sm:p-6 space-y-4">
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">وصف العمل المنفذ:</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {activeItem.description}
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-200 space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>فحص واختبار كامل للنظام بأحدث أجهزة الفحص المعتمدة عالمياً.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>تمديدات معزولة ومخفية بالكامل لضمان المظهر الجمالي والأمان.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>ضمان معتمد على الأجهزة والتركيبات مع دعم فني مستمر.</span>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="bg-slate-50 dark:bg-slate-950 px-5 sm:px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-right">
                  يمكنك طلب تنفيذ نفس هذا النظام أو طلب معاينة مجانية لموقعك
                </span>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setActiveItem(null)}
                    className="flex-1 sm:flex-none px-4 py-3 sm:py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold cursor-pointer"
                  >
                    إغلاق
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBookWork(activeItem)}
                    className="flex-[2] sm:flex-none px-4 sm:px-6 py-3 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/30 cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <span>طلب مثل هذا العمل لموقعي</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  );
};
