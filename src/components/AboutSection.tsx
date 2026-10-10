import React from 'react';
import { Shield, Target, Users, Award, BadgeCheck } from 'lucide-react';
import { useContent } from '../content/ContentContext';

export const AboutSection: React.FC = () => {
  const { contact } = useContent();

  return (
    <section id="about" className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-bold mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>من نحن</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            فضاء الشبكات | FSN
          </h2>
          <div className="w-12 h-1 bg-blue-600 rounded-full mx-auto mb-6" />
          
          <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed font-semibold mb-4">
            فضاء الشبكات مؤسسة متخصصة في تنفيذ حلول الشبكات وكاميرات المراقبة وأنظمة الإنتركوم للمنازل والشركات والمنشآت التجارية.
          </p>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            نقدم خدماتنا من خلال فهم احتياج العميل واختيار الحل المناسب للموقع، ثم تنفيذ أعمال التركيب والبرمجة والتشغيل باحترافية، مع الحرص على أن تكون تفاصيل الخدمة والتكلفة واضحة للعميل قبل بدء العمل.
          </p>
          <p className="text-sm sm:text-base text-blue-700 dark:text-blue-300 font-bold leading-relaxed">
            هدفنا أن تكون تجربة العميل بسيطة وواضحة، من أول تواصل وحتى اكتمال التنفيذ.
          </p>

          {contact.commercialRegistration && (
            <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-sm">
              <BadgeCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="text-slate-600 dark:text-slate-300">رقم السجل التجاري:</span>
              <span dir="ltr" className="font-mono font-bold text-slate-900 dark:text-white">{contact.commercialRegistration}</span>
            </div>
          )}
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm text-right">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">الفهم الدقيق للاحتياج</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              دراسة الموقع ومتطلبات العميل قبل ترشيح أي جهاز أو تمديد، لتفادي التكاليف الزائدة وضمان أعلى كفاءة تشغيلية.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm text-right">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">تنفيذ وبرمجة باحترافية</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              فريق فني متخصص ينفذ التمديدات المعزولة والبرمجة واختبار النظام وضبطه بالشكل الصحيح مع ربطه بتطبيقات الجوال.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm text-right">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">شفافية والتزام بالضمان</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              توضيح تفاصيل الخدمة والتكلفة وما يشمله السعر وما لا يشمله قبل البدء، مع توفير الدعم والضمان المعتمد.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
