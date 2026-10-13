import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BeforeAfterSliderProps {
  before: string;
  after: string;
  alt: string;
  beforeLabel?: string;
  afterLabel?: string;
  /** 'drag' = grab the handle (lightbox); 'hover' = divider follows the mouse, taps pass through (cards) */
  mode?: 'drag' | 'hover';
  /** 'contain' shows the whole photo (portrait phone shots) over a blurred copy instead of cropping */
  fit?: 'cover' | 'contain';
  /** Sweep the divider once when it scrolls into view, so visitors notice it moves */
  hint?: boolean;
  /** Tailwind position classes for the قبل / بعد labels */
  labelsClassName?: string;
  lazy?: boolean;
  className?: string;
}

const clamp = (n: number) => Math.min(100, Math.max(0, n));

// Arabic reads right-to-left, so "before" sits on the right and "after" is revealed from the left.
// `pos` is the divider's distance from the left edge, in percent.
export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  before,
  after,
  alt,
  beforeLabel = 'قبل',
  afterLabel = 'بعد',
  mode = 'drag',
  fit = 'cover',
  hint = false,
  labelsClassName = 'top-3',
  lazy = false,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const touched = useRef(false);
  const [pos, setPos] = useState(50);
  const [smooth, setSmooth] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!hint || !el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timers: number[] = [];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setSmooth(true);
        [30, 70, 50].forEach((p, i) =>
          timers.push(window.setTimeout(() => !touched.current && setPos(p), 300 + i * 650))
        );
        timers.push(window.setTimeout(() => setSmooth(false), 300 + 3 * 650));
      },
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [hint]);

  const moveTo = (clientX: number) => {
    const rect = ref.current!.getBoundingClientRect();
    touched.current = true;
    setSmooth(false);
    setPos(clamp(((clientX - rect.left) / rect.width) * 100));
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (mode !== 'drag') return;
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    moveTo(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragging.current || (mode === 'hover' && e.pointerType === 'mouse')) moveTo(e.clientX);
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  const onPointerLeave = () => {
    if (mode !== 'hover') return;
    setSmooth(true);
    setPos(50);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.key === 'ArrowLeft' ? -5 : e.key === 'ArrowRight' ? 5 : 0;
    if (!step) return;
    e.preventDefault();
    touched.current = true;
    setSmooth(true);
    setPos((p) => clamp(p + step));
  };

  const ease = smooth ? 'duration-700 ease-in-out' : 'duration-0';

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={onPointerLeave}
      onKeyDown={mode === 'drag' ? onKeyDown : undefined}
      role={mode === 'drag' ? 'slider' : undefined}
      tabIndex={mode === 'drag' ? 0 : undefined}
      aria-label={mode === 'drag' ? 'مقارنة قبل وبعد التنفيذ' : undefined}
      aria-valuemin={mode === 'drag' ? 0 : undefined}
      aria-valuemax={mode === 'drag' ? 100 : undefined}
      aria-valuenow={mode === 'drag' ? Math.round(100 - pos) : undefined}
      className={`absolute inset-0 overflow-hidden select-none outline-none focus-visible:ring-4 focus-visible:ring-blue-500/60 ${
        mode === 'drag' ? 'cursor-ew-resize touch-pan-y' : ''
      } ${className}`}
    >
      {fit === 'contain' && (
        <img
          src={after}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-60 pointer-events-none"
        />
      )}

      {/* After: the full base layer */}
      <img
        src={after}
        alt={`${alt} - ${afterLabel}`}
        loading={lazy ? 'lazy' : undefined}
        draggable={false}
        className={`absolute inset-0 w-full h-full ${fit === 'contain' ? 'object-contain' : 'object-cover'} pointer-events-none`}
      />

      {/* Before: clipped to the right of the divider */}
      <img
        src={before}
        alt={`${alt} - ${beforeLabel}`}
        loading={lazy ? 'lazy' : undefined}
        draggable={false}
        style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
        className={`absolute inset-0 w-full h-full ${fit === 'contain' ? 'object-contain' : 'object-cover'} pointer-events-none transition-[clip-path] ${ease}`}
      />

      {/* Labels fade out once their side is nearly hidden */}
      <span
        className={`absolute right-3 ${labelsClassName} z-[5] px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-sm border border-white/20 text-[11px] font-black text-white pointer-events-none transition-opacity duration-300 ${
          pos > 85 ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {beforeLabel}
      </span>
      <span
        className={`absolute left-3 ${labelsClassName} z-[5] px-2.5 py-1 rounded-full bg-blue-600/90 backdrop-blur-sm border border-white/25 text-[11px] font-black text-white shadow-md shadow-blue-900/40 pointer-events-none transition-opacity duration-300 ${
          pos < 15 ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {afterLabel}
      </span>

      {/* Divider + handle */}
      <div
        style={{ left: `${pos}%` }}
        className={`absolute inset-y-0 z-[6] w-0.5 -translate-x-1/2 bg-white shadow-[0_0_12px_rgba(0,0,0,0.55)] pointer-events-none transition-[left] ${ease}`}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-blue-600 shadow-[0_4px_18px_rgba(0,0,0,0.35)] ring-4 ring-white/30 flex items-center justify-center">
          <ChevronLeft className="w-4 h-4 -mr-1" strokeWidth={3} />
          <ChevronRight className="w-4 h-4 -ml-1" strokeWidth={3} />
        </div>
      </div>
    </div>
  );
};
