import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Trash2, X } from 'lucide-react';
import { supabase, IMAGES_BUCKET } from '../lib/supabase';
import { DEFAULT_CONTENT } from '../content/defaults';
import type { ContentKey, SiteContent } from '../content/types';

/* ---------------- Form controls ---------------- */

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition';

export const Field: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  dir?: 'rtl' | 'ltr';
  placeholder?: string;
  type?: string;
}> = ({ label, value, onChange, hint, dir, placeholder, type = 'text' }) => (
  <label className="block">
    <span className="block text-xs font-bold text-slate-700 mb-1.5">{label}</span>
    <input
      type={type}
      value={value}
      dir={dir}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputClass} ${dir === 'ltr' ? 'text-left' : 'text-right'}`}
    />
    {hint && <span className="block text-[11px] text-slate-500 mt-1">{hint}</span>}
  </label>
);

export const TextArea: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  rows?: number;
}> = ({ label, value, onChange, hint, rows = 3 }) => (
  <label className="block">
    <span className="block text-xs font-bold text-slate-700 mb-1.5">{label}</span>
    <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} className={`${inputClass} text-right leading-relaxed`} />
    {hint && <span className="block text-[11px] text-slate-500 mt-1">{hint}</span>}
  </label>
);

export const Select: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}> = ({ label, value, onChange, options }) => (
  <label className="block">
    <span className="block text-xs font-bold text-slate-700 mb-1.5">{label}</span>
    <select value={value} onChange={(e) => onChange(e.target.value)} className={`${inputClass} text-right cursor-pointer`}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </label>
);

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost'; loading?: boolean }
> = ({ variant = 'primary', loading, className = '', children, disabled, ...rest }) => {
  const styles = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm',
    secondary: 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300',
    danger: 'bg-white hover:bg-red-50 text-red-600 border border-red-200',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600',
  }[variant];
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${styles} ${className}`}
      {...rest}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

export const Card: React.FC<{ title?: string; actions?: React.ReactNode; children: React.ReactNode; className?: string }> = ({
  title,
  actions,
  children,
  className = '',
}) => (
  <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm ${className}`}>
    {(title || actions) && (
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3.5 border-b border-slate-100">
        {title && <h3 className="text-sm sm:text-base font-black text-slate-900">{title}</h3>}
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    )}
    <div className="p-4 sm:p-5">{children}</div>
  </div>
);

export const PanelHeader: React.FC<{ title: string; description: string; actions?: React.ReactNode }> = ({
  title,
  description,
  actions,
}) => (
  <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
    <div>
      <h2 className="text-xl sm:text-2xl font-black text-slate-900">{title}</h2>
      <p className="text-xs sm:text-sm text-slate-500 mt-1">{description}</p>
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </div>
);

/** Up / down / delete controls for an item in an editable list */
export const ListControls: React.FC<{
  index: number;
  count: number;
  onMove: (from: number, to: number) => void;
  onDelete: () => void;
}> = ({ index, count, onMove, onDelete }) => (
  <div className="flex items-center gap-1">
    <button
      type="button"
      title="تحريك للأعلى"
      disabled={index === 0}
      onClick={() => onMove(index, index - 1)}
      className="w-8 h-8 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 flex items-center justify-center cursor-pointer"
    >
      <ArrowUp className="w-4 h-4" />
    </button>
    <button
      type="button"
      title="تحريك للأسفل"
      disabled={index === count - 1}
      onClick={() => onMove(index, index + 1)}
      className="w-8 h-8 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 flex items-center justify-center cursor-pointer"
    >
      <ArrowDown className="w-4 h-4" />
    </button>
    <button
      type="button"
      title="حذف"
      onClick={onDelete}
      className="w-8 h-8 rounded-lg text-red-500 hover:bg-red-50 flex items-center justify-center cursor-pointer"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  </div>
);

export const moveItem = <T,>(list: T[], from: number, to: number): T[] => {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

export const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/* ---------------- Image upload ---------------- */

// Resize in the browser before uploading so phone photos (often 5–10 MB) load fast on the site
const resizeImage = async (file: File, maxSize = 1600): Promise<Blob> => {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const toBlob = (type: string, quality: number) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
  const webp = await toBlob('image/webp', 0.82);
  // Safari can't encode WebP and silently returns PNG; use JPEG there
  if (webp && webp.type === 'image/webp') return webp;
  return (await toBlob('image/jpeg', 0.85)) ?? file;
};

export const uploadImage = async (file: File, folder: string): Promise<string> => {
  if (!supabase) throw new Error('Supabase is not configured');
  const blob = await resizeImage(file);
  const ext = blob.type === 'image/webp' ? 'webp' : 'jpg';
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from(IMAGES_BUCKET)
    .upload(path, blob, { contentType: blob.type, cacheControl: '31536000' });
  if (error) throw error;
  return supabase.storage.from(IMAGES_BUCKET).getPublicUrl(path).data.publicUrl;
};

export const ImageInput: React.FC<{
  label: string;
  value?: string;
  onChange: (url: string | undefined) => void;
  folder: string;
  allowRemove?: boolean;
}> = ({ label, value, onChange, folder, allowRemove = true }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file?: File) => {
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      onChange(await uploadImage(file, folder));
    } catch (e) {
      setError('تعذر رفع الصورة: ' + (e instanceof Error ? e.message : ''));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      <span className="block text-xs font-bold text-slate-700 mb-1.5">{label}</span>
      <div className="flex items-center gap-3">
        <div className="w-28 h-20 rounded-xl border border-slate-200 bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
          {value ? (
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-[11px] text-slate-400">لا توجد صورة</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Button variant="secondary" loading={uploading} onClick={() => inputRef.current?.click()}>
            {!uploading && <ImagePlus className="w-4 h-4" />}
            {uploading ? 'جاري الرفع...' : value ? 'تغيير الصورة' : 'رفع صورة'}
          </Button>
          {value && allowRemove && (
            <Button variant="ghost" onClick={() => onChange(undefined)} className="!py-1.5 text-xs">
              <X className="w-3.5 h-3.5" /> إزالة الصورة
            </Button>
          )}
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
      </div>
      {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
    </div>
  );
};

/* ---------------- Load / save a content section ---------------- */

export const useContentEditor = <K extends ContentKey>(key: K) => {
  const [value, setValue] = useState<SiteContent[K]>(DEFAULT_CONTENT[key]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  useEffect(() => {
    supabase!
      .from('site_content')
      .select('data')
      .eq('key', key)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) setStatus({ type: 'error', text: 'تعذر تحميل المحتوى: ' + error.message });
        else if (data?.data) {
          // Object sections are merged so fields added later fall back to their defaults
          const fallback = DEFAULT_CONTENT[key];
          setValue(
            Array.isArray(fallback) ? data.data : ({ ...(fallback as object), ...(data.data as object) } as SiteContent[K])
          );
        }
        setLoading(false);
      });
  }, [key]);

  // Warn before closing the tab with unsaved edits
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const update = (next: SiteContent[K]) => {
    setValue(next);
    setDirty(true);
    setStatus(null);
  };

  const save = async () => {
    setSaving(true);
    const { error } = await supabase!
      .from('site_content')
      .upsert({ key, data: value, updated_at: new Date().toISOString() });
    setSaving(false);
    if (error) {
      setStatus({ type: 'error', text: 'لم يتم الحفظ: ' + error.message });
    } else {
      setDirty(false);
      setStatus({ type: 'ok', text: 'تم الحفظ ونشر التغييرات على الموقع ✓' });
    }
  };

  const resetToDefault = () => {
    if (window.confirm('استعادة المحتوى الأصلي لهذا القسم؟ لن يتم الحفظ حتى تضغط "حفظ ونشر".')) {
      update(DEFAULT_CONTENT[key]);
    }
  };

  return { value, update, loading, saving, dirty, status, save, resetToDefault };
};

export const SaveBar: React.FC<{
  dirty: boolean;
  saving: boolean;
  status: { type: 'ok' | 'error'; text: string } | null;
  onSave: () => void;
  onReset: () => void;
}> = ({ dirty, saving, status, onSave, onReset }) => (
  <div className="sticky bottom-0 z-20 -mx-4 sm:mx-0 mt-6 px-4 sm:px-5 py-3 bg-white/95 backdrop-blur border-t sm:border sm:rounded-2xl border-slate-200 shadow-[0_-8px_24px_-12px_rgba(15,23,42,0.25)] flex flex-wrap items-center justify-between gap-3">
    <span
      className={`text-xs sm:text-sm font-semibold ${
        status ? (status.type === 'ok' ? 'text-emerald-700' : 'text-red-600') : dirty ? 'text-amber-600' : 'text-slate-400'
      }`}
    >
      {status?.text ?? (dirty ? 'لديك تغييرات غير محفوظة' : 'لا توجد تغييرات')}
    </span>
    <div className="flex items-center gap-2">
      <Button variant="ghost" onClick={onReset} className="text-xs">
        استعادة الأصل
      </Button>
      <Button onClick={onSave} loading={saving} disabled={!dirty}>
        حفظ ونشر
      </Button>
    </div>
  </div>
);

export const LoadingBlock: React.FC = () => (
  <div className="py-16 flex items-center justify-center text-slate-400">
    <Loader2 className="w-6 h-6 animate-spin" />
  </div>
);
