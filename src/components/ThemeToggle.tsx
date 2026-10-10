import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const STORAGE_KEY = 'fsn-theme';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  // index.html applies the saved theme before React loads; read it back from the <html> class
  // (no document during the build-time prerender)
  const [isDark, setIsDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  const toggle = () => {
    const next = !isDark;
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
    } catch {
      // storage unavailable (private mode): the choice just won't persist
    }
    setIsDark(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'}
      title={isDark ? 'الوضع الفاتح' : 'الوضع الداكن'}
      className={`w-10 h-10 rounded-full border border-slate-600/70 bg-slate-800/60 hover:bg-slate-700/80 text-amber-300 flex items-center justify-center transition-colors cursor-pointer ${className}`}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-slate-200" />}
    </button>
  );
};
