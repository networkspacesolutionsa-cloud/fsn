import React from 'react';
import { X, CheckCircle2, ShieldCheck, Zap, Wrench, PhoneCall } from 'lucide-react';

export type ServiceType = 'networks' | 'cameras' | 'intercom';

interface ServiceDetailModalProps {
  service: ServiceType | null;
  onClose: () => void;
  onSelectServiceForBooking: (serviceName: string) => void;
}

interface ServiceData {
  title: string;
  category: string;
  badge: string;
  description: string;
  features: string[];
  specs: { label: string; value: string }[];
  guarantees: string[];
  pricingNote: string;
}

const SERVICES_DATA: Record<ServiceType, ServiceData> = {
  intercom: {
    title: 'أنظمة الانتركوم الذكية والمرئية',
    category: 'أنظمة الاتصال الداخلي والأمني',
    badge: 'دقة عالية وشاشات لمس متطورة',
    description:
      'نقدم في FSN أرقى أنظمة الانتركوم السلكية واللاسلكية للفلل، العمائر السكنية، والمجمعات التجارية. إمكانية الرد عن بُعد وفتح الأبواب عبر الهاتف الذكي أينما كنت.',
    features: [
      'شاشات داخلية ذكية تعمل باللمس عالية الوضوح بدقة Full HD',
      'لوحات خارجية مقاومة للعوامل الجوية والأمطار (معيار IP65/IP67)',
      'كاميرا خارجية بزاوية واسعة جداً مع رؤية ليلية بالأشعة تحت الحمراء',
      'ربط كامل بتطبيق الهاتف الذكي (iOS & Android) لاستقبال المكالمات وفتح الباب',
      'دعم فتح الأبواب عبر الكرت الممغنط، بصمة الإصبع، أو رمز المرور السري',
      'إمكانية تسجيل الزوار والتقاط صور وفيديوهات تلقائية عند رن الجرس',
    ],
    specs: [
      { label: 'دقة الشاشة والكاميرا', value: '1080p Full HD زاوية 180°' },
      { label: 'خيارات التوصيل', value: 'PoE سلكي / Wi-Fi لاسلكي' },
      { label: 'التحكم عن بُعد', value: 'تطبيق هاتف سحابي مجاني' },
      { label: 'الضمان المعتمد', value: 'سنتان شاملة الاستبدال والصيانة' },
    ],
    guarantees: [
      'ضمان شامل لمدة سنتين على جميع الأجهزة وقطع الغيار',
      'دعم فني واستجابة خلال 24 ساعة لجميع الأعطال',
      'تدريب كامل للعميل على استخدام التطبيق والشاشات',
    ],
    pricingNote: 'تبدأ المعاينة مجاناً مع تقديم عرض سعر مخصص حسب عدد الوحدات ونوع المنشأة.',
  },
  cameras: {
    title: 'كاميرات المراقبة الأمنية المتطورة',
    category: 'أنظمة الحماية والمراقبة الذكية',
    badge: 'دقة 4K ورؤية ليلية ملونة 24/7',
    description:
      'حلول مراقبة متكاملة تناسب الفلل والقصور، المحلات التجارية، والمستودعات والشركات، معتمدة ومطابقة للمواصفات الأمنية لوزارة الداخلية والبلديات.',
    features: [
      'كاميرات بدقة 4K و 8MP مع مستشعرات فائقة الحساسية للضوء',
      'تقنية ColorVu الرؤية الليلية الملونة بالكامل في الظلام الدامس',
      'أجهزة تسجيل NVR و DVR احترافية تدعم التخزين طويل الأمد بسعات عالية',
      'مستشعرات الذكاء الاصطناعي لكشف الأشخاص والسيارات وتقليل الإنذارات الكاذبة',
      'تطبيق هاتف ذكي سريع وسلس لمشاهدة البث المباشر والرجوع للتسجيلات',
      'كاميرات متحركة PTZ مع تقريب بصري هائل وتتبع الحركة التلقائي',
    ],
    specs: [
      { label: 'الدقة المتاحة', value: '4MP / 5MP / 8MP 4K Ultra HD' },
      { label: 'معيار الحماية', value: 'IP67 مقاوم للحرارة والغبار والماء' },
      { label: 'التخزين السحابي والمحلي', value: 'أقراص صلبة مخصصة Surveillance' },
      { label: 'الضمان والتوافق', value: 'مطابق لاشتراطات الأمن والسلامة' },
    ],
    guarantees: [
      'ضمان استبدال فوري للقطع التالفة لمدة 24 شهراً',
      'تمديدات احترافية داخل مواسير وعوازل لحماية الأسلاك',
      'شهادة إنجاز للمنشآت التجارية لاستخراج وتجديد الرخص',
    ],
    pricingNote: 'نوفر باقات اقتصادية، متوسطة، واحترافية تناسب كافة الميزانيات مع المعاينة المجانية.',
  },
  networks: {
    title: 'تمديد وصيانة الشبكات السلكية واللاسلكية',
    category: 'البنية التحتية وحلول الاتصالات',
    badge: 'تغطية Wi-Fi شاملة وسرعات فائقة',
    description:
      'تصميم وتنفيذ شبكات المؤسسات والفلل بأحدث كابلات Cat6 / Cat6A والألياف الضوئية Fiber Optics، لضمان استقرار الإشارة وسرعة التصفح وانعدام التقطيع في كل زاوية.',
    features: [
      'تمديد كابلات الشبكة Cat6/Cat6A النحاسية الخالصة 100% داخل مسارات معزولة',
      'تركيب وبرمجة نقاط وصول Wi-Fi 6 Mesh لتغطية المنازل والمكاتب بدون انقطاع',
      'تنظيم وترتيب كبائن السيرفرات (Server Racks) مع Patch Panels وأجهزة الفحص',
      'تثبيت وتكوين السويتشات المدارة Managed PoE Switches وراوترات الميكروتك وسيسكو',
      'حل مشاكل ضعف الإشارة والـ Dead Zones في القصور والمكاتب ذات العوازل القوية',
      'فحص الجودة واختبار الفقد باستخدام أجهزة Fluke المعتمدة عالمياً',
    ],
    specs: [
      { label: 'نوعية الكابلات', value: 'Cat6 & Cat6A UTP/FTP النحاس النقي' },
      { label: 'سرعات النقل', value: 'تصل إلى 10Gbps بسرعات تدفق هائلة' },
      { label: 'أنظمة التوزيع', value: 'كبائن 4U إلى 42U مجهزة بالتبريد' },
      { label: 'الضمان', value: 'ضمان 5 سنوات على تمديدات الكيابل' },
    ],
    guarantees: [
      'ضمان عدم انقطاع الإشارة وتوزيع متوازن للسرعات',
      'فريق مهندسين شبكات معتمدين من Cisco و Ubiquiti',
      'صيانة دورية وزيارات دعم فني سريعة',
    ],
    pricingNote: 'تحديد تكلفة التمديدات يعتمد على عدد النقاط والمسافات مع تقديم جدول كميات دقيق مجاناً.',
  },
};

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onSelectServiceForBooking,
}) => {
  if (!service) return null;
  const data = SERVICES_DATA[service];

  const handleBook = () => {
    onSelectServiceForBooking(data.title);
    onClose();
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-right shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl border border-slate-200">
          
          {/* Header */}
          <div className="bg-gradient-to-l from-[#0b1a30] to-[#122849] px-6 py-5 text-white flex items-center justify-between">
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-1">
                {data.category}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold">{data.title}</h3>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="px-6 py-6 space-y-6">
            {/* Description */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {data.description}
            </p>

            {/* Key Features List */}
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600" />
                <span>المميزات والخدمات المشمولة:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {data.features.map((feat, index) => (
                  <div key={index} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="bg-blue-50/60 rounded-xl p-4 border border-blue-100">
              <h4 className="text-sm font-bold text-blue-950 mb-3 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-600" />
                <span>المواصفات الفنية المعتمدة:</span>
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                {data.specs.map((spec, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-slate-500 text-[11px] font-medium">{spec.label}</span>
                    <span className="text-slate-900 font-bold mt-0.5">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Guarantees */}
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>الضمان وخدمات ما بعد البيع:</span>
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 pr-2">
                {data.guarantees.map((g, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price note */}
            <div className="text-xs text-slate-500 bg-slate-100 p-3 rounded-lg">
              ℹ️ {data.pricingNote}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-blue-600" />
              <span>استشارة ومعاينة ميدانية مجانية فورية</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs sm:text-sm font-semibold cursor-pointer"
              >
                إغلاق
              </button>
              <button
                type="button"
                onClick={handleBook}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/30 cursor-pointer"
              >
                طلب هذه الخدمة الآن
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
