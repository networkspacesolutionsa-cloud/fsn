import React from 'react';

export const HeroGraphic: React.FC = () => {
  return (
    <div className="relative w-full max-w-xl mx-auto flex items-center justify-center p-2 sm:p-4 select-none">
      {/* Background Soft Glow / Tech Office Architecture */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/60 via-slate-100/40 to-blue-50/50 dark:from-blue-900/30 dark:via-slate-900/30 dark:to-blue-950/30 rounded-3xl transform -rotate-1 scale-95 blur-xl -z-10" />
      
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-30 pointer-events-none -z-10">
        <div className="w-full h-full bg-[linear-gradient(to_right,#0284c715_1px,transparent_1px),linear-gradient(to_bottom,#0284c715_1px,transparent_1px)] bg-[size:28px_28px]" />
      </div>

      {/* Main Composite Hardware Stage */}
      <div className="relative w-full aspect-[16/11] flex items-end justify-center">
        {/* Modern Bright Corporate Office & Server Room Backdrop */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-b from-slate-100 via-white to-slate-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-2xl flex flex-col justify-between p-4 sm:p-6">
          {/* Upper Office Windows / Depth Horizon */}
          <div className="flex justify-between items-start opacity-70">
            <div className="w-24 h-32 bg-gradient-to-b from-blue-200/40 to-transparent border-r border-blue-200/50 transform -skew-x-12" />
            <div className="flex flex-col gap-1 items-end">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[10px] font-bold text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                SYSTEM ONLINE
              </span>
              <div className="text-[10px] text-slate-400 font-mono">10Gbps Core Fiber</div>
            </div>
          </div>

          {/* Depth Light Flare */}
          <div className="absolute top-1/4 left-1/3 w-64 h-32 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* 1. Network Rack Switch (Bottom Foundation) */}
        <div className="relative z-20 w-[94%] bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-lg p-2.5 sm:p-3.5 shadow-2xl border-t border-slate-700/80 mb-2 sm:mb-3">
          {/* Metallic Ears / Mounting Screws */}
          <div className="absolute -left-2 top-2 bottom-2 w-2 bg-slate-700 rounded-l flex flex-col justify-between py-1 items-center">
            <div className="w-1 h-1 rounded-full bg-slate-900" />
            <div className="w-1 h-1 rounded-full bg-slate-900" />
          </div>
          <div className="absolute -right-2 top-2 bottom-2 w-2 bg-slate-700 rounded-r flex flex-col justify-between py-1 items-center">
            <div className="w-1 h-1 rounded-full bg-slate-900" />
            <div className="w-1 h-1 rounded-full bg-slate-900" />
          </div>

          <div className="flex items-center justify-between">
            {/* Brand Mark */}
            <div className="flex items-center gap-2 pl-1">
              <div className="px-1.5 py-0.5 rounded border border-blue-400/40 bg-blue-950/60 text-[10px] font-bold text-blue-300 font-mono">
                FSN
              </div>
              <span className="text-[9px] text-slate-400 font-mono hidden sm:inline">FSN-SW24-PRO GIGABIT</span>
            </div>

            {/* RJ45 Ports Matrix with LEDs */}
            <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-950 px-2 py-1 rounded border border-slate-800">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  {/* Status LED */}
                  <div
                    className={`w-1 h-1 rounded-full ${
                      i % 3 === 0
                        ? 'bg-emerald-400 shadow-[0_0_4px_#34d399]'
                        : i % 2 === 0
                        ? 'bg-amber-400 shadow-[0_0_4px_#fbbf24]'
                        : 'bg-blue-400 shadow-[0_0_4px_#38bdf8]'
                    }`}
                  />
                  {/* RJ45 Port Socket */}
                  <div className="w-2.5 sm:w-3.5 h-3 sm:h-3.5 bg-slate-800 rounded-xs border border-slate-700/80 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-slate-950 rounded-xs" />
                  </div>
                </div>
              ))}
            </div>

            {/* Power / SFP Uplink Ports */}
            <div className="flex items-center gap-1">
              <div className="w-3.5 h-4 bg-slate-800 border border-blue-500/60 rounded-xs flex items-center justify-center">
                <div className="w-1.5 h-2 bg-blue-400 rounded-xs animate-pulse" />
              </div>
              <div className="w-3.5 h-4 bg-slate-800 border border-blue-500/60 rounded-xs flex items-center justify-center">
                <div className="w-1.5 h-2 bg-blue-400 rounded-xs animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Wi-Fi Router with 4 High-Gain Antennas (Right-Center) */}
        <div className="absolute right-6 sm:right-10 bottom-12 sm:bottom-16 z-10 flex flex-col items-center">
          {/* Antennas */}
          <div className="flex items-end justify-between w-28 sm:w-36 px-2 mb-[-4px]">
            <div className="w-1.5 sm:w-2 h-14 sm:h-20 bg-gradient-to-t from-slate-900 to-slate-800 rounded-t-sm shadow-md transform -rotate-12 origin-bottom border-t border-slate-600" />
            <div className="w-1.5 sm:w-2 h-16 sm:h-22 bg-gradient-to-t from-slate-900 to-slate-800 rounded-t-sm shadow-md transform -rotate-3 origin-bottom border-t border-slate-600" />
            <div className="w-1.5 sm:w-2 h-16 sm:h-22 bg-gradient-to-t from-slate-900 to-slate-800 rounded-t-sm shadow-md transform rotate-3 origin-bottom border-t border-slate-600" />
            <div className="w-1.5 sm:w-2 h-14 sm:h-20 bg-gradient-to-t from-slate-900 to-slate-800 rounded-t-sm shadow-md transform rotate-12 origin-bottom border-t border-slate-600" />
          </div>

          {/* Router Body */}
          <div className="w-32 sm:w-44 h-9 sm:h-12 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 rounded-xl shadow-xl border-t border-slate-700/80 flex items-center justify-between px-3 relative">
            <span className="text-[8px] font-mono text-slate-400 font-bold">FSN AX6000</span>
            {/* LED Status Row */}
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-blue-400 shadow-[0_0_5px_#38bdf8]" />
              <div className="w-1 h-1 rounded-full bg-blue-400 shadow-[0_0_5px_#38bdf8]" />
              <div className="w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_5px_#34d399]" />
              <div className="w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_5px_#34d399]" />
              <div className="w-1 h-1 rounded-full bg-blue-400 shadow-[0_0_5px_#38bdf8]" />
            </div>
          </div>
        </div>

        {/* 3. Circular Ceiling/Wall Access Point (Center-Left) */}
        <div className="absolute left-[30%] sm:left-[35%] bottom-10 sm:bottom-14 z-20 flex flex-col items-center">
          <div className="relative w-18 h-18 sm:w-24 sm:h-24 rounded-full bg-gradient-to-b from-white via-slate-50 to-slate-200 shadow-2xl border border-slate-200/90 flex items-center justify-center">
            {/* Glowing Ring */}
            <div className="absolute inset-1.5 rounded-full border border-blue-400/40 shadow-[0_0_12px_rgba(59,130,246,0.3)] pointer-events-none" />
            <div className="relative flex flex-col items-center justify-center">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-blue-50 to-blue-100/60 border border-blue-200 flex items-center justify-center">
                <span className="text-[9px] sm:text-[11px] font-black text-blue-700 tracking-wider">FSN</span>
              </div>
              <span className="text-[7px] text-slate-500 font-mono mt-0.5">Wi-Fi 6</span>
            </div>
          </div>
        </div>

        {/* 4. High-End Security Dome Camera (Left Foreground) */}
        <div className="absolute left-4 sm:left-8 bottom-12 sm:bottom-16 z-30 flex flex-col items-center">
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex flex-col items-center">
            {/* Base Mount */}
            <div className="w-22 sm:w-28 h-6 sm:h-8 bg-gradient-to-b from-slate-100 via-white to-slate-200 rounded-t-2xl shadow-lg border-t border-l border-r border-slate-300 flex items-center justify-center relative">
              <div className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200/80 text-[8px] font-black text-blue-700 tracking-wider">
                FSN
              </div>
            </div>

            {/* Glass Dome with Inner Lens */}
            <div className="w-20 sm:w-26 h-18 sm:h-22 bg-gradient-to-b from-slate-200/90 via-slate-100 to-slate-300 rounded-b-full shadow-2xl border border-slate-300 flex items-center justify-center relative overflow-hidden">
              {/* Inner Dark Camera Ball */}
              <div className="w-14 sm:w-18 h-14 sm:h-18 rounded-full bg-gradient-to-b from-slate-900 via-slate-950 to-black shadow-inner flex items-center justify-center relative border border-slate-800">
                {/* 4K Lens Glass with Blue Optical Coating */}
                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-gradient-to-tr from-blue-950 via-slate-900 to-blue-900 border border-blue-500/40 shadow-inner flex items-center justify-center relative">
                  {/* Glass Reflection Highlight */}
                  <div className="absolute top-1 right-2 w-2.5 h-1.5 bg-white/70 rounded-full blur-[0.5px] transform rotate-45" />
                  <div className="w-4 h-4 rounded-full bg-slate-950 border border-blue-400/50 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400/80 animate-ping opacity-75" />
                  </div>
                </div>
                {/* IR Night Vision Ring Sockets */}
                <div className="absolute inset-1 rounded-full border border-slate-800/80 pointer-events-none" />
              </div>

              {/* Outer Dome Glass Reflection */}
              <div className="absolute top-0 left-2 right-2 h-4 bg-gradient-to-b from-white/60 to-transparent rounded-full pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
