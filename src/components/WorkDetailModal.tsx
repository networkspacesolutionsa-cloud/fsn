import React, { useEffect } from 'react';
import { X, MapPin, Calendar, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useLockBodyScroll } from './useLockBodyScroll';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import type { GalleryItem } from '../content/types';

export const hasCompare = (item: GalleryItem) => Boolean(item.image && item.beforeImage);

interface WorkDetailModalProps {
  item: GalleryItem;
  onClose: () => void;
  onBook: (item: GalleryItem) => void;
}

/** Full details of one gallery work: big photo (or before/after), description and a booking button */
export const WorkDetailModal: React.FC<WorkDetailModalProps> = ({ item, onClose, onBook }) => {
  useLockBodyScroll(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={() => onClose()}
      />

      <div className="flex min-h-full items-end sm:items-center justify-center pt-10 sm:p-4 text-center">
        <div className="relative w-full transform overflow-hidden rounded-t-3xl sm:rounded-3xl bg-white dark:bg-slate-900 text-right shadow-2xl transition-all sm:my-8 sm:max-w-2xl border border-slate-200 dark:border-slate-800">
          
          {/* Header */}
          <div className="bg-[#0b1a30] text-white px-5 sm:px-6 py-4 flex items-start sm:items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-2 min-w-0">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-[10px] font-bold">
                {item.categoryLabel}
              </span>
              <h3 className="text-base sm:text-lg font-bold">{item.title}</h3>
            </div>
            <button
              onClick={() => onClose()}
              aria-label="إغلاق"
              className="w-9 h-9 shrink-0 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Large Visual Area */}
          <div className={`relative w-full aspect-[4/3] sm:aspect-[16/10] bg-gradient-to-br ${item.gradient} p-4 sm:p-8 flex flex-col justify-between overflow-hidden select-none`}>
            {hasCompare(item) ? (
              <>
                <BeforeAfterSlider
                  key={item.id}
                  before={item.beforeImage!}
                  after={item.image!}
                  alt={item.title}
                  beforeLabel={item.beforeLabel || undefined}
                  fit="contain"
                  hint
                  labelsClassName="top-14 sm:top-20"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50 pointer-events-none" />
              </>
            ) : item.image ? (
              <>
                {/* Whole photo over a blurred copy, so portrait phone shots aren't cropped */}
                <img src={item.image} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-60" />
                <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-contain" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50 pointer-events-none" />
              </>
            ) : (
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:24px_24px]" />
            )}

            <div className="relative z-10 flex justify-between items-center text-white pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-blue-900/60 border border-blue-400/40 text-xs font-bold">
                {item.badge}
              </span>
              {hasCompare(item) ? (
                <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-[11px] font-bold">
                  اسحب الشريط للمقارنة ↔
                </span>
              ) : null}
            </div>

            {!item.image && (
              <div className="relative z-10 flex flex-col items-center justify-center my-auto">
                <div className="text-5xl sm:text-7xl mb-2 drop-shadow-lg">
                  {item.iconSymbol}
                </div>
                <span className="text-xs sm:text-sm text-blue-200 font-bold text-center">
                  فضاء الشبكات FSN
                </span>
              </div>
            )}

            {item.location || item.date ? (
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-xs text-slate-200 bg-black/40 backdrop-blur-xs p-2.5 rounded-xl border border-white/10 pointer-events-none">
                {item.location && (
                  <span className="flex items-center gap-1.5 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    <span>الموقع: {item.location}</span>
                  </span>
                )}
                {item.date && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>تاريخ التنفيذ: {item.date}</span>
                  </span>
                )}
              </div>
            ) : (
              <div />
            )}
          </div>

          {/* Details & Specs */}
          <div className="p-5 sm:p-6 space-y-4">
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">تفاصيل العمل:</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-200 space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <span>فحص النظام وتجربته بالكامل قبل التسليم.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <span>تمديدات مرتبة ومحمية تحافظ على مظهر المكان.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <span>متابعة ودعم فني بعد التركيب.</span>
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
                onClick={() => onClose()}
                className="flex-1 sm:flex-none px-4 py-3 sm:py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold cursor-pointer"
              >
                إغلاق
              </button>
              <button
                type="button"
                onClick={() => onBook(item)}
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
  );
};
