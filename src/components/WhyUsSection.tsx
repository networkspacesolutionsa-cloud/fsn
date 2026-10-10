import React from 'react';
import { HelpCircle, CheckCircle, ArrowRight, Lightbulb, Workflow, ShieldCheck, HeartHandshake } from 'lucide-react';

export const WhyUsSection: React.FC = () => {
  return (
    <section id="why-us" className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Part 1: لماذا فضاء الشبكات؟ */}
        <div className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-bold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>قيمنا والتزامنا المهني</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
              لماذا فضاء الشبكات؟
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              في فضاء الشبكات نؤمن أن الحل الجيد يبدأ من فهم احتياج العميل، وليس من بيع منتج أو خدمة بشكل عشوائي. لذلك نركز على تقديم حلول مناسبة للموقع وتنفيذها بطريقة احترافية، مع توضيح الخدمة والتكلفة وما يشمله السعر قبل البدء.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Box 1 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col text-right">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                فهم الاحتياج الحقيقي أولاً
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                لا نبيعك أجهزة فائضة عن حاجتك. ندرس طبيعة المبنى، زوايا التغطية، والميزانية المتوفرة لترشيح الأنسب لك ولعائلتك أو منشأتك التجارية.
              </p>
            </div>

            {/* Box 2 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col text-right">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                الاهتمام بأدق التفاصيل والضمان
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                نهتم بالتفاصيل من المعاينة واختيار الحل المناسب وحتى التركيب والبرمجة والاختبار، ونوفر الدعم والضمان وفق طبيعة كل خدمة.
              </p>
            </div>
          </div>
        </div>

        {/* Part 2: كيف نعمل؟ */}
        <div className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-bold mb-3">
              <Workflow className="w-3.5 h-3.5" />
              <span>مراحل واضحة ومحددة</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
              كيف نعمل؟
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              خطوات تنفيذ مرنة وشفافة تضمن لك راحة البال من أول مكالمة وحتى تشغيل النظام
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm relative text-right flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-mono font-bold text-base flex items-center justify-center mb-5">
                  1
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">التواصل والمعاينة</h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  تبدأ التجربة عندما تتواصل معنا وتوضح لنا ما تحتاجه. إذا كانت الخدمة تتطلب معاينة، نرسل لك فنيًا متخصصًا لمعاينة الموقع وفهم احتياجك بشكل دقيق.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm relative text-right flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-mono font-bold text-base flex items-center justify-center mb-5">
                  2
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">العرض المناسب والاتفاق</h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  بعد المعاينة نوضح لك الحل المناسب والتكلفة والتفاصيل المتعلقة بالخدمة، بكل وضوح وشفافية ودون أي رسوم خفية.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm relative text-right flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-mono font-bold text-base flex items-center justify-center mb-5">
                  3
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">التنفيذ والاختبار</h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  بعد موافقتك نبدأ بالتنفيذ والتركيب والبرمجة، ثم نتأكد من جاهزية النظام وتشغيله بالشكل الصحيح وتدريبك على استخدامه.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Part 3: هل تعلم؟ (Did You Know?) Box */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-blue-800/60 relative overflow-hidden text-right">
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-400/20 border border-blue-400/40 text-blue-300 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-8 h-8" />
              </div>
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-blue-400/20 text-blue-300 text-xs font-bold mb-2">
                  هل تعلم؟
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
                  الكاميرا الأغلى ليست دائمًا الأفضل
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  اختيار الكاميرا المناسبة يعتمد على المكان الذي سيتم تركيبها فيه وزاوية الرؤية والإضاءة والمسافة وطبيعة الاستخدام. لذلك اختيار الحل الصحيح أهم من اختيار الكاميرا الأعلى سعرًا.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
