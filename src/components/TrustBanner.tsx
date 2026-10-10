import React from 'react';
import { ThumbsUp, Award, Clock, Headphones, ShieldCheck } from 'lucide-react';

export const TrustBanner: React.FC = () => {
  const trustItems = [
    {
      icon: ThumbsUp,
      title: 'خبرة واحترافية',
      subtitle: 'فريق هندسي متخصص',
    },
    {
      icon: Award,
      title: 'أسعار تنافسية',
      subtitle: 'جودة عالية بسعر مناسب',
    },
    {
      icon: Clock,
      title: 'التزام بالمواعيد',
      subtitle: 'ننفذ في الوقت المحدد',
    },
    {
      icon: Headphones,
      title: 'دعم فني متواصل',
      subtitle: 'قبل وبعد التنفيذ',
    },
    {
      icon: ShieldCheck,
      title: 'ضمان على العمل',
      subtitle: 'راحة بالك مضمونة',
    },
  ];

  return (
    <div className="w-full bg-[#0a182f] border-t border-slate-800/80 py-8 sm:py-10 text-white select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 items-center justify-center">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`flex flex-col items-center text-center group cursor-default transition-transform hover:-translate-y-0.5 duration-200 ${
                  index === trustItems.length - 1 ? 'col-span-2 md:col-span-1' : ''
                }`}
              >
                {/* Icon Container with subtle blue rim */}
                <div className="w-12 h-12 rounded-xl bg-blue-900/40 border border-blue-500/30 flex items-center justify-center mb-3 group-hover:border-blue-400 group-hover:bg-blue-800/50 transition-colors shadow-inner">
                  <Icon className="w-6 h-6 text-blue-400 group-hover:text-blue-300" strokeWidth={1.8} />
                </div>

                {/* Primary Text */}
                <span className="text-sm sm:text-base font-bold text-white mb-1">
                  {item.title}
                </span>

                {/* Subtitle Text */}
                <span className="text-xs text-slate-400">
                  {item.subtitle}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
