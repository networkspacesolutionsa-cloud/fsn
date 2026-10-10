import React from 'react';

/**
 * Calendar and Clock Graphic for Booking Section
 */
export const CalendarClockVisual: React.FC = () => {
  return (
    <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center select-none">
      {/* Background Soft Blue Halo */}
      <div className="absolute inset-0 bg-blue-100/70 rounded-full blur-xl -z-10" />

      {/* Calendar Card Graphic */}
      <div className="relative w-22 sm:w-28 h-24 sm:h-30 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col">
        {/* Top Spiral Rings / Header Band */}
        <div className="w-full bg-gradient-to-r from-blue-600 to-blue-700 py-1.5 px-3 flex justify-between items-center">
          <div className="w-2 h-2 rounded-full bg-slate-900 border border-white" />
          <div className="w-2 h-2 rounded-full bg-slate-900 border border-white" />
          <div className="w-2 h-2 rounded-full bg-slate-900 border border-white" />
        </div>

        {/* Calendar Grid Sheet */}
        <div className="flex-1 p-2 flex flex-col justify-around">
          <div className="grid grid-cols-4 gap-1">
            <div className="h-2 rounded-xs bg-slate-100" />
            <div className="h-2 rounded-xs bg-blue-100" />
            <div className="h-2 rounded-xs bg-slate-100" />
            <div className="h-2 rounded-xs bg-blue-200" />
          </div>
          <div className="grid grid-cols-4 gap-1">
            <div className="h-2 rounded-xs bg-blue-600" />
            <div className="h-2 rounded-xs bg-slate-100" />
            <div className="h-2 rounded-xs bg-slate-100" />
            <div className="h-2 rounded-xs bg-blue-100" />
          </div>
          <div className="grid grid-cols-4 gap-1">
            <div className="h-2 rounded-xs bg-slate-100" />
            <div className="h-2 rounded-xs bg-blue-100" />
            <div className="h-2 rounded-xs bg-slate-100" />
            <div className="h-2 rounded-xs bg-slate-100" />
          </div>
        </div>
      </div>

      {/* Clock Badge Overlapping Lower Left */}
      <div className="absolute -bottom-1 -left-1 sm:-bottom-2 sm:-left-2 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white shadow-xl border-2 border-blue-600 flex items-center justify-center p-1">
        <div className="relative w-full h-full rounded-full bg-blue-50 flex items-center justify-center">
          {/* Clock Center Pin */}
          <div className="w-2 h-2 rounded-full bg-blue-700 z-10" />
          {/* Minute Hand */}
          <div className="absolute top-2 w-0.5 h-4 sm:h-5 bg-blue-700 rounded-full origin-bottom transform rotate-45" />
          {/* Hour Hand */}
          <div className="absolute w-3 sm:w-3.5 h-0.5 bg-slate-800 rounded-full origin-right transform -rotate-45" />
          {/* Ticks */}
          <div className="absolute top-0.5 w-0.5 h-1 bg-slate-400" />
          <div className="absolute bottom-0.5 w-0.5 h-1 bg-slate-400" />
          <div className="absolute left-0.5 w-1 h-0.5 bg-slate-400" />
          <div className="absolute right-0.5 w-1 h-0.5 bg-slate-400" />
        </div>
      </div>
    </div>
  );
};
