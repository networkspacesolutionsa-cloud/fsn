import React from 'react';

interface LogoProps {
  className?: string;
  isDark?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', isDark = true }) => {
  return (
    <div className={`flex items-center gap-3 select-none cursor-pointer ${className}`}>
      {/* Icon Emblem: white/blue mark on dark backgrounds, full-color mark on light ones */}
      <img
        src={isDark ? '/logo-mark.png' : '/logo-mark-color.png'}
        alt="مؤسسة فضاء الشبكات الأمنية"
        className="w-11 h-11 sm:w-12 sm:h-12 object-contain"
        draggable={false}
      />

      {/* Brand Text Lockup */}
      <div className={`flex flex-col text-right font-black leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
        <span className="text-base sm:text-lg">مؤسسة فضاء</span>
        <span className="text-base sm:text-lg">الشبكات الأمنية</span>
      </div>
    </div>
  );
};
