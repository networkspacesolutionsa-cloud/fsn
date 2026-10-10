import React, { useCallback, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import {
  CalendarCheck,
  ExternalLink,
  BadgePercent,
  Home,
  Image as ImageIcon,
  Loader2,
  LogOut,
  Package,
  MessageSquareQuote,
  Phone,
  Wrench,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from './ui';
import { BookingsPanel } from './BookingsPanel';
import { ReviewsPanel } from './ReviewsPanel';
import { ContactPanel } from './ContactPanel';
import { ServicesPanel } from './ServicesPanel';
import { GalleryPanel } from './GalleryPanel';
import { OffersPanel } from './OffersPanel';
import { HeroPanel } from './HeroPanel';
import { PackagesPanel } from './PackagesPanel';

type Tab = 'bookings' | 'reviews' | 'hero' | 'contact' | 'services' | 'gallery' | 'packages' | 'offers';

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: 'bookings', label: 'طلبات الحجز', icon: CalendarCheck },
  { key: 'reviews', label: 'التقييمات', icon: MessageSquareQuote },
  { key: 'hero', label: 'الصفحة الرئيسية', icon: Home },
  { key: 'services', label: 'الخدمات والأسعار', icon: Wrench },
  { key: 'gallery', label: 'معرض الصور', icon: ImageIcon },
  { key: 'packages', label: 'الباقات', icon: Package },
  { key: 'offers', label: 'عروض الأسعار', icon: BadgePercent },
  { key: 'contact', label: 'معلومات التواصل', icon: Phone },
];

const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div dir="rtl" className="min-h-screen bg-slate-100 text-slate-800 font-sans">
    {children}
  </div>
);

const Brand: React.FC = () => (
  <div className="flex items-center gap-2.5">
    <img src="/logo-mark.png" alt="" className="w-9 h-9 object-contain" />
    <div className="leading-tight">
      <p className="text-sm font-black text-white">مؤسسة فضاء الشبكات</p>
      <p className="text-[11px] text-blue-300 font-bold">لوحة التحكم</p>
    </div>
  </div>
);

const SetupNeeded: React.FC = () => (
  <Shell>
    <div className="max-w-xl mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 text-right">
        <h1 className="text-xl font-black text-slate-900 mb-2">لوحة التحكم غير مربوطة بعد</h1>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          لتفعيل لوحة التحكم يجب ربط الموقع بقاعدة بيانات Supabase:
        </p>
        <ol className="list-decimal pr-5 space-y-2 text-sm text-slate-700 leading-relaxed">
          <li>أنشئ مشروعًا مجانيًا على supabase.com.</li>
          <li>شغّل ملف <code className="font-mono text-xs bg-slate-100 px-1 rounded">supabase/setup.sql</code> في SQL Editor.</li>
          <li>
            أضف المفتاحين في ملف <code className="font-mono text-xs bg-slate-100 px-1 rounded">.env.local</code>:{' '}
            <code className="font-mono text-xs bg-slate-100 px-1 rounded" dir="ltr">VITE_SUPABASE_URL</code> و{' '}
            <code className="font-mono text-xs bg-slate-100 px-1 rounded" dir="ltr">VITE_SUPABASE_ANON_KEY</code>
          </li>
          <li>أعد بناء الموقع ورفعه.</li>
        </ol>
      </div>
    </div>
  </Shell>
);

const Login: React.FC<{ notAdmin?: boolean }> = ({ notAdmin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase!.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) setError(error.message === 'Invalid login credentials' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' : error.message);
  };

  return (
    <Shell>
      <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-b from-[#0b1a30] to-[#081324]">
        <form onSubmit={submit} className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-right space-y-4">
          <div className="flex flex-col items-center text-center mb-2">
            <img src="/logo-mark-color.png" alt="" className="w-14 h-14 object-contain mb-3" />
            <h1 className="text-xl font-black text-slate-900">لوحة التحكم</h1>
            <p className="text-xs text-slate-500 mt-1">مؤسسة فضاء الشبكات الأمنية</p>
          </div>
          {notAdmin && (
            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
              هذا الحساب ليس لديه صلاحية الإدارة. أضفه في جدول admin_users (آخر خطوة في setup.sql).
            </p>
          )}
          <label className="block">
            <span className="block text-xs font-bold text-slate-700 mb-1.5">البريد الإلكتروني</span>
            <input
              type="email"
              required
              dir="ltr"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-left text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none"
            />
          </label>
          <label className="block">
            <span className="block text-xs font-bold text-slate-700 mb-1.5">كلمة المرور</span>
            <input
              type="password"
              required
              dir="ltr"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-left text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none"
            />
          </label>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <Button type="submit" loading={loading} className="w-full !py-3">
            تسجيل الدخول
          </Button>
          <a href="/" className="block text-center text-xs text-slate-500 hover:text-blue-600">
            ← العودة إلى الموقع
          </a>
        </form>
      </div>
    </Shell>
  );
};

const Dashboard: React.FC<{ email: string }> = ({ email }) => {
  const [tab, setTab] = useState<Tab>('bookings');
  const [newBookings, setNewBookings] = useState(0);
  const [pendingReviews, setPendingReviews] = useState(0);
  const onNewBookings = useCallback((n: number) => setNewBookings(n), []);
  const onPendingReviews = useCallback((n: number) => setPendingReviews(n), []);

  const badge = (key: Tab) => (key === 'bookings' ? newBookings : key === 'reviews' ? pendingReviews : 0);

  return (
    <Shell>
      <header className="sticky top-0 z-30 bg-[#0b1a30] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Brand />
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-200 hover:bg-white/10"
            >
              <ExternalLink className="w-4 h-4" /> عرض الموقع
            </a>
            <span className="hidden md:inline text-[11px] text-slate-400" dir="ltr">
              {email}
            </span>
            <button
              type="button"
              onClick={() => supabase!.auth.signOut()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-200 hover:bg-white/10 cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> خروج
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-8 lg:grid lg:grid-cols-[220px_1fr] lg:gap-8">
        {/* Navigation: horizontal swipe row on phones, sidebar on desktop */}
        <nav className="-mx-4 px-4 lg:mx-0 lg:px-0 mb-5 lg:mb-0 overflow-x-auto scrollbar-none">
          <div className="flex lg:flex-col gap-2 w-max lg:w-auto lg:sticky lg:top-24">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition cursor-pointer ${
                  tab === key ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'bg-white lg:bg-transparent text-slate-700 hover:bg-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="flex-1 text-right">{label}</span>
                {badge(key) > 0 && (
                  <span
                    className={`min-w-5 h-5 px-1.5 rounded-full text-[11px] flex items-center justify-center ${
                      tab === key ? 'bg-white text-blue-700' : 'bg-red-500 text-white'
                    }`}
                  >
                    {badge(key)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Panels stay mounted so unsaved edits survive switching tabs */}
        <main className="min-w-0">
          <div className={tab === 'bookings' ? '' : 'hidden'}>
            <BookingsPanel onNewCount={onNewBookings} />
          </div>
          <div className={tab === 'reviews' ? '' : 'hidden'}>
            <ReviewsPanel onPendingCount={onPendingReviews} />
          </div>
          <div className={tab === 'services' ? '' : 'hidden'}>
            <ServicesPanel />
          </div>
          <div className={tab === 'gallery' ? '' : 'hidden'}>
            <GalleryPanel />
          </div>
          <div className={tab === 'packages' ? '' : 'hidden'}>
            <PackagesPanel />
          </div>
          <div className={tab === 'offers' ? '' : 'hidden'}>
            <OffersPanel />
          </div>
          <div className={tab === 'hero' ? '' : 'hidden'}>
            <HeroPanel />
          </div>
          <div className={tab === 'contact' ? '' : 'hidden'}>
            <ContactPanel />
          </div>
        </main>
      </div>
    </Shell>
  );
};

export default function AdminApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [rejected, setRejected] = useState(false);

  useEffect(() => {
    document.title = 'لوحة التحكم | فضاء الشبكات';
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!supabase || !session) {
      setIsAdmin(null);
      return;
    }
    supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        setIsAdmin(!!data);
        if (!data) {
          // Signed in but not listed in admin_users: sign out and explain on the login screen
          setRejected(true);
          supabase!.auth.signOut();
        } else {
          setRejected(false);
        }
      });
  }, [session]);

  if (!supabase) return <SetupNeeded />;
  if (checking || (session && isAdmin === null)) {
    return (
      <Shell>
        <div className="min-h-screen flex items-center justify-center text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin" />
        </div>
      </Shell>
    );
  }
  if (!session || !isAdmin) return <Login notAdmin={rejected} />;
  return <Dashboard email={session.user.email ?? ''} />;
}
