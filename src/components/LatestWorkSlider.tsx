import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, MapPin, Pause, Play, Sparkles, SplitSquareHorizontal, ZoomIn } from 'lucide-react';
import { useContent } from '../content/ContentContext';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { WorkDetailModal, hasCompare } from './WorkDetailModal';
import type { GalleryItem } from '../content/types';

interface LatestWorkSliderProps {
  onSelectBookingForWork?: (workTitle: string) => void;
}

/** The admin adds new works to the top of the gallery list, so the first ones are the latest */
const MAX_SLIDES = 6;
/** How long each slide stays before auto-advancing; the progress bar's animation drives the timing */
const SLIDE_MS = 6000;

const pad = (n: number) => String(n).padStart(2, '0');

export const LatestWorkSlider: React.FC<LatestWorkSliderProps> = ({ onSelectBookingForWork }) => {
  const { gallery } = useContent();
  const slides = gallery.filter((item) => item.image).slice(0, MAX_SLIDES);

  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  // Autoplay runs only while nothing asks it to wait
  const [userPaused, setUserPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const playing = slides.length > 1 && !userPaused && !hovering && !focused && inView && pageVisible && !activeItem;

  useEffect(() => {
    // Moving content must not start on its own for visitors who asked for less motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setUserPaused(true);

    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      observer.disconnect();
    };
  }, []);

  // In RTL the track scrolls with negative scrollLeft, slide i sits at -i × width
  const goTo = useCallback(
    (i: number) => {
      const track = trackRef.current;
      if (!track || slides.length === 0) return;
      const target = (i + slides.length) % slides.length;
      const dir = getComputedStyle(track).direction === 'rtl' ? -1 : 1;
      track.scrollTo({ left: dir * target * track.clientWidth, behavior: 'smooth' });
    },
    [slides.length]
  );

  // The index follows the scroll position, so swiping, arrows and autoplay all stay in sync
  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const next = Math.round(Math.abs(track.scrollLeft) / track.clientWidth);
    if (next !== index) setIndex(Math.min(next, slides.length - 1));
  };

  // RTL: the left arrow key moves forward
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goTo(index + 1);
    else if (e.key === 'ArrowRight') goTo(index - 1);
    else return;
    e.preventDefault();
  };

  const bookWork = (item: GalleryItem) => {
    setActiveItem(null);
    onSelectBookingForWork?.(item.title);
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (slides.length === 0) return null;
  const many = slides.length > 1;

  return (
    <section
      ref={sectionRef}
      id="latest-work"
      className="relative py-16 sm:py-20 bg-gradient-to-br from-fsn-dark via-fsn-navy to-[#0d2a52] text-white overflow-hidden scroll-mt-20"
    >
      {/* Network-node dot grid + soft glow, same language as the package headers */}
      <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.12)_1px,transparent_0)] bg-[length:22px_22px] pointer-events-none" />
      <div className="absolute -top-32 left-1/4 w-96 h-96 rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div className="text-right max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-sky-300 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>أحدث أعمالنا</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">أعمال نفّذناها مؤخرًا</h2>
            <p className="text-sm sm:text-base text-blue-100/80 leading-relaxed">
              نماذج حقيقية من آخر المشاريع التي سلّمناها لعملائنا في الشبكات والكاميرات والإنتركوم.
            </p>
          </div>
          <a
            href="#gallery"
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-sm font-bold transition whitespace-nowrap"
          >
            عرض جميع الأعمال
            <ArrowLeft className="w-4 h-4" />
          </a>
        </div>

        {/* Carousel */}
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="أحدث أعمالنا"
          onKeyDown={onKeyDown}
          onPointerEnter={(e) => e.pointerType === 'mouse' && setHovering(true)}
          onPointerLeave={() => setHovering(false)}
          onFocus={() => setFocused(true)}
          onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node | null) && setFocused(false)}
        >
          <div className="relative rounded-3xl overflow-hidden bg-slate-900/70 border border-white/10 shadow-2xl shadow-black/40">
            <div
              ref={trackRef}
              onScroll={onScroll}
              aria-live={playing ? 'off' : 'polite'}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none overscroll-x-contain"
            >
              {slides.map((item, i) => {
                const active = i === index;
                const compare = hasCompare(item);
                return (
                  <div
                    key={item.id}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${i + 1} من ${slides.length}: ${item.title}`}
                    inert={!active}
                    className="w-full shrink-0 snap-start snap-always grid lg:grid-cols-12"
                  >
                    {/* Photo, or the before/after comparison */}
                    <div className="relative lg:col-span-7 aspect-[4/3] lg:aspect-auto lg:min-h-[440px] bg-slate-800 overflow-hidden">
                      {compare ? (
                        <BeforeAfterSlider
                          before={item.beforeImage!}
                          after={item.image!}
                          alt={item.title}
                          beforeLabel={item.beforeLabel || undefined}
                          mode="hover"
                          hint
                          lazy={i > 0}
                          labelsClassName="top-4"
                        />
                      ) : (
                        <img
                          src={item.image}
                          alt={item.title}
                          loading={i > 0 ? 'lazy' : undefined}
                          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[6000ms] ease-out ${
                            active && playing ? 'scale-105' : 'scale-100'
                          }`}
                        />
                      )}
                      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                      {item.badge && (
                        <span className="absolute bottom-4 right-4 z-[7] px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-[11px] font-bold pointer-events-none">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="lg:col-span-5 flex flex-col justify-center text-right p-5 sm:p-8 lg:p-10">
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="px-3 py-1 rounded-full bg-blue-600 text-[11px] font-bold">{item.categoryLabel}</span>
                        {compare && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold text-sky-200">
                            <SplitSquareHorizontal className="w-3.5 h-3.5" />
                            قبل وبعد
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-black leading-snug mb-3 line-clamp-3">{item.title}</h3>

                      {(item.location || item.date) && (
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-blue-100/80 mb-4">
                          {item.location && (
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-sky-400" />
                              {item.location}
                            </span>
                          )}
                          {item.date && (
                            <span className="inline-flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-sky-400" />
                              {item.date}
                            </span>
                          )}
                        </div>
                      )}

                      {item.description && (
                        <p className="text-sm text-slate-300 leading-relaxed line-clamp-3 mb-6">{item.description}</p>
                      )}

                      <div className="flex flex-col sm:flex-row gap-3 mt-auto lg:mt-2">
                        <button
                          type="button"
                          onClick={() => bookWork(item)}
                          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-600/30 transition cursor-pointer"
                        >
                          اطلب مثل هذا العمل
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveItem(item)}
                          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/20 text-white text-sm font-bold transition cursor-pointer"
                        >
                          <ZoomIn className="w-4 h-4" />
                          عرض التفاصيل
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Time left on this slide; when it fills up, the next slide comes in */}
            {many && (
              <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10" aria-hidden="true">
                <div
                  key={index}
                  onAnimationEnd={() => goTo(index + 1)}
                  style={{ animationDuration: `${SLIDE_MS}ms`, animationPlayState: playing ? 'running' : 'paused' }}
                  className="h-full origin-right bg-gradient-to-l from-sky-400 to-blue-600 animate-slide-progress"
                />
              </div>
            )}
          </div>

          {/* Controls */}
          {many && (
            <div className="flex items-center justify-between gap-4 mt-5">
              {/* Thumbnails (desktop) / dots (phones and tablets) */}
              <div className="flex items-center gap-2 min-w-0">
                {slides.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`عرض العمل ${i + 1}: ${item.title}`}
                    aria-current={i === index ? 'true' : undefined}
                    className="group cursor-pointer shrink-0"
                  >
                    <span
                      className={`lg:hidden block h-2 rounded-full transition-all duration-300 ${
                        i === index ? 'w-7 bg-sky-400' : 'w-2 bg-white/30 group-hover:bg-white/50'
                      }`}
                    />
                    <span
                      className={`hidden lg:block relative w-24 aspect-[4/3] rounded-lg overflow-hidden ring-2 transition-all duration-300 ${
                        i === index ? 'ring-sky-400 opacity-100' : 'ring-transparent opacity-50 group-hover:opacity-90'
                      }`}
                    >
                      <img src={item.image} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span dir="ltr" className="hidden sm:inline text-sm font-bold tabular-nums text-blue-100/80 ml-2" aria-hidden="true">
                  <span className="text-white">{pad(index + 1)}</span> / {pad(slides.length)}
                </span>
                <button
                  type="button"
                  onClick={() => setUserPaused((p) => !p)}
                  aria-label={userPaused ? 'تشغيل العرض التلقائي' : 'إيقاف العرض التلقائي'}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center transition cursor-pointer"
                >
                  {userPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => goTo(index - 1)}
                  aria-label="العمل السابق"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center transition cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(index + 1)}
                  aria-label="العمل التالي"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 flex items-center justify-center transition cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {activeItem && <WorkDetailModal item={activeItem} onClose={() => setActiveItem(null)} onBook={bookWork} />}
    </section>
  );
};
