import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { FAQS } from '../content/faqs';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-bold mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>إجابات واضحة ومباشرة</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            الأسئلة الشائعة
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300">
            كل ما تود معرفته عن خدمات المعاينة والتركيب والأسعار
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4 text-right">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-800/30 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full px-6 py-4 sm:py-5 flex items-center justify-between text-right font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 flex-shrink-0 mr-3">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
