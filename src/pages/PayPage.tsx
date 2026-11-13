import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, CreditCard, Loader2, MessageCircle, XCircle } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useContent, whatsappUrl } from '../content/ContentContext';
import { PublicPayment, callTamara, formatSar } from '../lib/tamara';

const openBooking = () => window.location.assign('/#booking');
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * /pay/?id=<payment id> — the payment link sent to customers (and where Tamara sends them back,
 * with &result=success|failure|cancel). Rendered in the browser only, never indexed.
 */
export const PayPage: React.FC = () => {
  const { contact } = useContent();
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') ?? '';
  const result = params.get('result');

  const [payment, setPayment] = useState<PublicPayment | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'not-found' | 'error'>('loading');
  const [confirming, setConfirming] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [startError, setStartError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        let p = await callTamara<PublicPayment>({ action: 'info', id, sync: Boolean(result) });
        if (cancelled) return;
        setPayment(p);
        setState('ready');
        // Back from Tamara: the confirmation can take a few seconds to land
        if (result === 'success' && p.status === 'pending') {
          setConfirming(true);
          for (let i = 0; i < 5 && p.status === 'pending' && !cancelled; i++) {
            await wait(2500);
            p = await callTamara<PublicPayment>({ action: 'info', id, sync: true });
            if (!cancelled) setPayment(p);
          }
          if (!cancelled) setConfirming(false);
        }
      } catch (err) {
        if (cancelled) return;
        setState((err as Error).message === 'not_found' ? 'not-found' : 'error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, result]);

  const pay = async () => {
    setStartError('');
    setRedirecting(true);
    try {
      const { url } = await callTamara<{ url: string }>({ action: 'start', id });
      window.location.href = url;
    } catch {
      setRedirecting(false);
      setStartError('تعذر فتح صفحة الدفع عبر تمارا الآن. حاول مرة أخرى بعد قليل أو تواصل معنا عبر واتساب.');
    }
  };

  const help = whatsappUrl(
    contact,
    payment?.ref ? `السلام عليكم، لدي استفسار عن الدفع لطلب رقم ${payment.ref}` : 'السلام عليكم، لدي استفسار عن رابط الدفع'
  );

  let body: React.ReactNode;
  if (state === 'loading') {
    body = (
      <div className="py-12 flex justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  } else if (state !== 'ready' || !payment) {
    body = (
      <Status
        icon={<XCircle className="w-10 h-10" />}
        tone="red"
        title={state === 'not-found' ? 'رابط الدفع غير صالح' : 'تعذر تحميل بيانات الدفع'}
        text={state === 'not-found' ? 'تأكد من فتح الرابط كاملًا كما وصلك، أو تواصل معنا لإرسال رابط جديد.' : 'حدّث الصفحة بعد قليل، أو تواصل معنا عبر واتساب.'}
      />
    );
  } else if (payment.status === 'paid') {
    body = (
      <Status
        icon={<CheckCircle className="w-10 h-10" />}
        tone="green"
        title="تم الدفع بنجاح"
        text={`شكرًا لك! وصلنا دفع ${formatSar(payment.amount)} عبر تمارا${payment.ref ? ` لطلب ${payment.ref}` : ''}، وسيتواصل معك فريق فضاء الشبكات لتأكيد الموعد.`}
      />
    );
  } else if (payment.status !== 'pending') {
    body = (
      <Status
        icon={<XCircle className="w-10 h-10" />}
        tone="slate"
        title={payment.status === 'refunded' ? 'تم استرداد هذا المبلغ' : 'تم إلغاء رابط الدفع'}
        text="إذا كنت تحتاج إلى رابط جديد تواصل معنا عبر واتساب."
      />
    );
  } else {
    const notice = confirming
      ? null
      : result === 'cancel'
        ? 'ألغيت عملية الدفع. يمكنك المحاولة مرة أخرى متى شئت.'
        : result === 'failure' || payment.lastAttempt === 'declined'
          ? 'لم تكتمل عملية الدفع عبر تمارا. يمكنك المحاولة مرة أخرى، أو التواصل معنا لطريقة دفع أخرى.'
          : result === 'success'
            ? 'لم يصلنا تأكيد الدفع بعد. إذا أكملت الدفع فسيظهر التأكيد خلال دقائق، ولا داعي للدفع مرة أخرى.'
            : null;
    body = (
      <>
        <div className="text-center mb-6">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
            {payment.ref ? `طلب رقم ${payment.ref}` : 'رابط دفع'}
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">{payment.description}</h1>
          <p className="text-4xl font-black text-slate-900 dark:text-white mt-4" dir="rtl">
            {formatSar(payment.amount)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">قسّمها على دفعات بدون فوائد عبر تمارا</p>
        </div>

        {confirming && (
          <div className="mb-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-blue-800 dark:text-blue-200 text-xs flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
            <span>جارٍ تأكيد الدفع مع تمارا...</span>
          </div>
        )}
        {(notice || startError) && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{startError || notice}</span>
          </div>
        )}

        <button
          type="button"
          onClick={pay}
          disabled={redirecting || confirming}
          className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {redirecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
          <span>{redirecting ? 'جاري تحويلك إلى تمارا...' : 'ادفع عبر تمارا'}</span>
        </button>
      </>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans">
      <Navbar activeTab="home" onTabChange={() => {}} onOpenBooking={openBooking} />
      <main className="flex-grow py-16 sm:py-24 px-4">
        <div className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8">
          {body}
          <a
            href={help}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 w-full py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm flex items-center justify-center gap-2 transition"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>تواصل معنا عبر واتساب</span>
          </a>
        </div>
      </main>
      <Footer onTabChange={() => {}} onOpenBooking={openBooking} />
    </div>
  );
};

const TONES = {
  green: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
  red: 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400',
  slate: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400',
};

const Status: React.FC<{ icon: React.ReactNode; tone: keyof typeof TONES; title: string; text: string }> = ({ icon, tone, title, text }) => (
  <div className="text-center py-4">
    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${TONES[tone]}`}>{icon}</div>
    <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">{title}</h1>
    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{text}</p>
  </div>
);

export default PayPage;
