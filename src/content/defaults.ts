import type { ContactInfo, GalleryItem, HeroContent, Offer, ServiceCategory, ServicePackage, SiteContent } from './types';

// Built-in content: shown when Supabase isn't configured yet, and used as the starting
// point for anything the admin hasn't edited in the control panel.

export const DEFAULT_CONTACT: ContactInfo = {
  phoneDisplay: '+962 77 894 7384',
  phone: '962778947384',
  whatsapp: '962778947384',
  email: 'info@fsn-networks.sa',
  locationText: 'الرياض، المملكة العربية السعودية',
  mapUrl: 'https://maps.google.com/?q=Riyadh+Saudi+Arabia',
  commercialRegistration: '1010809778',
};

export const DEFAULT_SERVICES: ServiceCategory[] = [
  {
    key: 'networks',
    name: 'الشبكات',
    cardTitle: 'الشبكات',
    cardDescription:
      'نوفر حلولًا متكاملة للشبكات تبدأ من تمديد وصيانة كابلات الشبكة السلكية والألياف الضوئية، وصولًا إلى تحسين تغطية الإنترنت وتركيب وتجهيز أفياش الشبكة وبرمجة مقويات Wi-Fi.',
    cardImage: '/images/networks-patch-panel.webp',
    cardLinkLabel: 'استكشف خدمات الشبكات',
    filterLabel: 'خدمات الشبكات',
    sectionLabel: 'قسم الشبكات',
    sectionTitle: 'حلول شبكات مصممة حسب احتياجك',
    sectionDescription:
      'الشبكة الجيدة تبدأ من التمديد الصحيح. في فضاء الشبكات ننفذ أعمال الشبكات الداخلية والخارجية ونوفر حلول الألياف الضوئية وتغطية Wi-Fi للمنازل والمنشآت، مع الاهتمام بجودة التنفيذ وتنظيم الشبكة واستقرار الاتصال.',
    items: [
      {
        id: 'net-cabling',
        title: 'تمديد وصيانة كابلات الشبكة السلكية والألياف الضوئية',
        badge: 'معاينة وعرض سعر',
        badgeTone: 'info',
        sideNote: 'ضمان عام كامل',
        description:
          'نحن متخصصون في تمديد الكابلات الداخلية والخارجية وصيانة وتمديد الألياف الضوئية، بخبرات عالية وضمان يمتد لعام كامل. نعمل على تمديد كابلات الشبكة السلكية باحترافية لتوفير اتصال سريع ومستقر وتنظيم مناسب للشبكة في المنازل والمنشآت، كما نوفر صيانة وتمديد كابلات الألياف الضوئية حسب احتياج الموقع.',
        details:
          'ℹ️ هذه الخدمة تعتمد على معاينة الموقع وتحديد الاحتياج، وبعد ذلك نقدم لك الحل المناسب والتكلفة بكل وضوح، مع إمكانية العمل في نفس اليوم في حال الاتفاق.',
        detailsNote: '',
        detailsTone: 'info',
        buttonLabel: 'احصل على عرض سعر مجاني',
      },
      {
        id: 'net-sockets',
        title: 'تركيب وصيانة أفياش الشبكة الجدارية',
        badge: '120 ريال / فيش',
        badgeTone: 'price',
        sideNote: 'أكثر من 5 أفياش: 100 ريال',
        description:
          'إذا كانت لديك كابلات شبكة ممددة وتحتاج إلى تركيب رؤوس الكابل والفيش وتجهيزها وتشغيلها، نوفر لك خدمة تركيب وتجهيز أفياش الشبكة بشكل احترافي.',
        details:
          'سعر الخدمة **120 ريال للفيش الواحد**، ويشمل تركيب وتجهيز الفيش وتركيب رأس الكابل وتشغيل الاتصال، كما يشمل فيش شبكة باللون الأبيض أو الأسود. وفي حال كان عدد الأفياش أكثر من خمسة، يصبح السعر !!100 ريال للفيش الواحد!!.',
        detailsNote: '',
        detailsTone: 'plain',
        buttonLabel: 'احجز الخدمة',
      },
      {
        id: 'net-coverage',
        title: 'تغطية المنزل بالإنترنت',
        badge: 'حلول شاملة للفلل والمنشآت',
        badgeTone: 'info',
        sideNote: 'ضمان عامين على الأجهزة',
        description:
          'إذا كنت تعاني من ضعف تغطية الإنترنت في المنزل أو المؤسسة، نوفر لك حلولًا لتصميم وتركيب مقويات الشبكة بما يتناسب مع مساحة الموقع وطبيعته واحتياجه.',
        details:
          '• نختار الأجهزة المناسبة ونقوم بتركيبها وبرمجتها للحصول على أفضل تغطية ممكنة، مع دعم فني يمتد لعام كامل على البرمجة وضمان لمدة عامين على الأجهزة.\n• نرسل لك فنيًا متخصصًا لمعاينة الموقع وتحديد احتياجك، ثم نقدم لك الحل المناسب والتكلفة بكل وضوح، مع إمكانية العمل في نفس اليوم في حال الاتفاق.',
        detailsNote: '',
        detailsTone: 'info',
        buttonLabel: 'احصل على عرض سعر مجاني',
      },
      {
        id: 'net-extender',
        title: 'تركيب وبرمجة مقوي شبكة Wi-Fi',
        badge: '150 ريال',
        badgeTone: 'price',
        sideNote: 'برمجة مجانية 3 أشهر',
        description:
          'إذا كان لديك جهاز مقوي شبكة وتحتاج إلى ربطه بالراوتر الأساسي، سواء عن طريق الاتصال اللاسلكي أو باستخدام كابل شبكة، نوفر لك خدمة التركيب والبرمجة وضبط الإعدادات والتأكد من عمل الجهاز بالشكل الصحيح.',
        details:
          'سعر الخدمة **150 ريال**، وتشمل برمجة مجانية لمدة ثلاثة أشهر. الخدمة لا تشمل تمديد كابل الشبكة، وفي حال الحاجة إلى تمديد كابل يتم توضيح التكلفة قبل التنفيذ، كما أن الجهاز غير مشمول في السعر.',
        detailsNote: '',
        detailsTone: 'plain',
        buttonLabel: 'احجز الخدمة',
      },
    ],
  },
  {
    key: 'cameras',
    name: 'كاميرات المراقبة',
    cardTitle: 'كاميرات المراقبة',
    cardDescription:
      'نقدم خدمات تركيب وبرمجة كاميرات المراقبة وكاميرات Wi-Fi، بالإضافة إلى معاينة المواقع وتحديد الأماكن المناسبة للتركيب وتقديم الحل الذي يتناسب مع احتياج الموقع وميزانيته.',
    cardImage: '/images/cctv-camera-white.webp',
    cardLinkLabel: 'استكشف كاميرات المراقبة',
    filterLabel: 'كاميرات المراقبة',
    sectionLabel: 'قسم كاميرات المراقبة',
    sectionTitle: 'حماية تبدأ من المكان الصحيح',
    sectionDescription:
      'اختيار كاميرات المراقبة لا يعتمد فقط على نوع الكاميرا أو سعرها، بل يعتمد على المكان الذي سيتم تركيبها فيه، وزاوية الرؤية والإضاءة والمسافة وطبيعة الموقع. لذلك نساعدك في تحديد الحل المناسب قبل التنفيذ.',
    items: [
      {
        id: 'cam-wifi',
        title: 'برمجة وتركيب كاميرا Wi-Fi',
        badge: '150 ريال',
        badgeTone: 'price',
        sideNote: 'دعم فني 3 أشهر',
        description: 'نوفر خدمة تركيب وبرمجة كاميرا Wi-Fi وتشغيلها وتجهيزها بالشكل الصحيح.',
        details:
          'سعر الخدمة **150 ريال**، وتشمل تركيب كاميرا واحدة وتمديدات كهربائية لا تتجاوز 15 مترًا، بالإضافة إلى البرمجة والدعم الفني لمدة ثلاثة أشهر.',
        detailsNote:
          'السعر لا يشمل قطع الغيار، ويحق لمؤسسة فضاء الشبكات احتساب رسوم إضافية في حال طلب العميل خدمات خارج وصف الخدمة.',
        detailsTone: 'plain',
        buttonLabel: 'احجز الخدمة',
      },
      {
        id: 'cam-wired',
        title: 'برمجة وتركيب كاميرا مراقبة',
        badge: '250 ريال',
        badgeTone: 'price',
        sideNote: 'تمديد حتى 30 متر',
        description:
          'نقدم خدمة تركيب كاميرا مراقبة داخلية أو خارجية مع تمديد الكابل والبرمجة وتركيب الهاردسك وبرمجة جهاز التسجيل.',
        details:
          'سعر الخدمة **250 ريال**، وتشمل تركيب كاميرا واحدة وتمديدًا يصل إلى 30 مترًا لكل كاميرا، مع الكابل وتركيب الهاردسك وبرمجة جهاز التسجيل واختبار النظام وتشغيله.',
        detailsNote:
          'السعر لا يشمل قطع الغيار والإكسسوارات، والجرجور البلاستيكي للتمديد الواحد يبلغ 130 ريال شامل التركيب. ضمان 3 أشهر على التركيب والبرمجة.',
        detailsTone: 'plain',
        buttonLabel: 'احجز الخدمة',
      },
      {
        id: 'cam-survey',
        title: 'معاينة وعرض سعر كاميرات المراقبة',
        badge: '200 ريال (تُخصم)',
        badgeTone: 'info',
        sideNote: 'دراسة فنية للموقع',
        description:
          'قبل تنفيذ مشروع كاميرات المراقبة، يمكنك طلب معاينة للموقع من فني متخصص لتحديد أماكن الكاميرات المناسبة واختيار الحل الذي يتناسب مع احتياجك وميزانيتك.',
        details:
          'قيمة خدمة المعاينة **200 ريال**، وبعد معاينة الموقع وتحديد الاحتياج نقدم لك عرضًا تفصيليًا بالحلول والأسعار. **وفي حال الموافقة على تنفيذ المشروع، يتم خصم رسوم الزيارة من القيمة الإجمالية لخدمة التركيب.**',
        detailsNote: '',
        detailsTone: 'info',
        buttonLabel: 'احجز المعاينة',
      },
    ],
  },
  {
    key: 'intercom',
    name: 'الإنتركوم',
    cardTitle: 'الإنتركوم',
    cardDescription:
      'نوفر خدمات تركيب وبرمجة أنظمة الإنتركوم للمنازل والمنشآت، مع إمكانية ربط النظام بالجوال وضبطه وتشغيله بالشكل الصحيح.',
    cardImage: '/images/intercom-indoor-screen.webp',
    cardLinkLabel: 'استكشف الإنتركوم',
    filterLabel: 'أنظمة الإنتركوم',
    sectionLabel: 'قسم الإنتركوم',
    sectionTitle: 'اتصال أسهل وتحكم أفضل',
    sectionDescription:
      'نوفر حلول الإنتركوم للمنازل والفلل والمنشآت، مع خدمات التركيب والبرمجة وربط النظام بالجوال وتجهيزه للعمل بالشكل الصحيح.',
    items: [
      {
        id: 'ic-install',
        title: 'تركيب وبرمجة الإنتركوم',
        badge: '400 ريال',
        badgeTone: 'price',
        sideNote: 'صيانة مجانية 3 أشهر',
        description:
          'نقوم بتركيب وبرمجة جهاز الإنتركوم باحترافية، مع ضبط الإعدادات والتأكد من جاهزية النظام للعمل، ويشمل ذلك تمديد كابل شبكة عند الحاجة.',
        details:
          'سعر الخدمة **400 ريال**، وتشمل تركيب وبرمجة إنتركوم مكون من جرس واحد وشاشة واحدة، بالإضافة إلى ربط النظام مع الجوال وصيانة مجانية لمدة ثلاثة أشهر.',
        detailsNote: 'الجهاز والإكسسوارات غير مشمولة في سعر الخدمة.',
        detailsTone: 'plain',
        buttonLabel: 'احجز الخدمة',
      },
      {
        id: 'ic-device',
        title: 'توفير جهاز الإنتركوم',
        badge: 'أجهزة أصلية معتمدة',
        badgeTone: 'info',
        sideNote: 'حسب المشروع',
        description:
          'إذا كنت تحتاج إلى جهاز إنتركوم، يمكننا توفير الجهاز المناسب لاحتياجك ومساعدتك في اختيار الموديل الأنسب حسب موقع التركيب وعدد الوحدات والمواصفات المطلوبة.',
        details: 'سيتم تحديد الجهاز والسعر حسب احتياج المشروع ومواصفات المنشأة وعدد الشاشات الداخلية المطلوبة.',
        detailsNote: '',
        detailsTone: 'info',
        buttonLabel: 'اطلب جهاز الإنتركوم',
      },
    ],
  },
];

export const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: 'g1',
    title: 'تنظيم كابينة سيرفر 12U وباتش بانل Cat6A',
    category: 'networks',
    categoryLabel: 'الشبكات وكبائن السيرفرات',
    location: 'الرياض - حي حطين',
    date: 'سبتمبر 2026',
    description: 'تركيب كابينة جدارية 12U مع سويتش Gigabit PoE وتنظيم وتثبيت 24 كابل شبكة Cat6A بأربطة فيلكرو احترافية.',
    gradient: 'from-slate-950 via-slate-900 to-blue-950',
    iconSymbol: '🖧',
    badge: 'تمديد كابلات وكبائن',
    image: '/images/gallery-server-cabinet.webp',
  },
  {
    id: 'g2',
    title: 'تركيب كاميرا مراقبة 4K ColorVu مقاومة للشمس والحرارة',
    category: 'cameras',
    categoryLabel: 'كاميرات المراقبة 4K',
    location: 'الرياض - حي الملقا',
    date: 'أغسطس 2026',
    description: 'كاميرا خارجية 8MP بدقة فائقة مع إضاءة ليلية دافئة لمشاهدة ملونة 24 ساعة، وتمديد داخل جرجور بلاستيكي مقاوم للأشعة فوق البنفسجية.',
    gradient: 'from-slate-800 via-slate-700 to-slate-900',
    iconSymbol: '📹',
    badge: 'رؤية ليلية ملونة 4K',
    image: '/images/gallery-camera-4k.webp',
  },
  {
    id: 'g3',
    title: 'شاشة إنتركوم لمس 7 بوصة على جدار ديكور رخامي',
    category: 'intercom',
    categoryLabel: 'أنظمة الإنتركوم الذكية',
    location: 'الرياض - حي الياسمين',
    date: 'سبتمبر 2026',
    description: 'شاشة إنتركوم لمس ذكية Full HD مع ربطها بشبكة الواي فاي وتفعيل فتح الباب الرئيسي مباشرة من الجوال.',
    gradient: 'from-slate-900 via-blue-950 to-black',
    iconSymbol: '📟',
    badge: 'إنتركوم IP متصل بالجوال',
    image: '/images/intercom-indoor-screen.webp',
  },
  {
    id: 'g5',
    title: 'لوحة جرس خارجية معدنية تدعم الكارت الذكي والرمز السري',
    category: 'intercom',
    categoryLabel: 'أنظمة الإنتركوم الذكية',
    location: 'الرياض - حي الغدير',
    date: 'يوليو 2026',
    description: 'لوحة جرس ألومنيوم مقاومة للأمطار بمعيار IP65 مع كاميرا واسعة الزاوية 180 درجة وميكروفون مانع للضوضاء.',
    gradient: 'from-slate-800 via-zinc-900 to-slate-900',
    iconSymbol: '🔔',
    badge: 'لوحة خارجية مقاومة للماء',
    image: '/images/gallery-door-station-ip65.webp',
  },
  {
    id: 'g6',
    title: 'تركيب 12 كاميرا مراقبة شبكية لمستودع تجاري',
    category: 'cameras',
    categoryLabel: 'كاميرات المراقبة 4K',
    location: 'الرياض - حي السلي',
    date: 'يونيو 2026',
    description: 'نظام مراقبة متكامل لمستودع 1500 متر مع جهاز تسجيل 32 قناة وهاردسك مخصص للمراقبة يعمل 24/7 لمدة 90 يوماً.',
    gradient: 'from-slate-900 via-slate-950 to-blue-900',
    iconSymbol: '🏢',
    badge: 'منشآت ومستودعات',
    image: '/images/gallery-monitoring-room.webp',
  },
  {
    id: 'g4',
    title: 'نقطة وصول Wi-Fi 6 سقفية لتغطية بهو وفيلا دورين',
    category: 'wifi',
    categoryLabel: 'أفياش ونقاط الواي فاي',
    location: 'الرياض - حي النرجس',
    date: 'أغسطس 2026',
    description: 'تركيب أكسس بوينت Wi-Fi 6 بسرعات تصل إلى 3000Mbps بدون تقطيع أو انخفاض في الإشارة خلف العوازل والجدران السميكة.',
    gradient: 'from-blue-950 via-slate-900 to-slate-950',
    iconSymbol: '📡',
    badge: 'تغطية واي فاي 6',
  },
  {
    id: 'g7',
    title: 'أفياش شبكة جدارية مزدوجة Cat6 مع فحص الجودة',
    category: 'wifi',
    categoryLabel: 'أفياش ونقاط الواي فاي',
    location: 'الرياض - حي الروضة',
    date: 'سبتمبر 2026',
    description: 'تجهيز وتركيب 16 فيش شبكة باللون الأبيض متناسقة مع الديكور، واختبار جودة الاتصال وتوصيل السرعة الكاملة.',
    gradient: 'from-slate-900 via-slate-800 to-blue-950',
    iconSymbol: '🔌',
    badge: 'أفياش جدارية احترافية',
  },
  {
    id: 'g8',
    title: 'تمديد مسارات كابلات وألياف ضوئية داخل مجاري خاصة',
    category: 'networks',
    categoryLabel: 'الشبكات وكبائن السيرفرات',
    location: 'الرياض - طريق التخصصي',
    date: 'مايو 2026',
    description: 'أعمال تمديد ألياف ضوئية وشبكة داخلية لمقر شركة طابقين مع ترتيب مسارات الكابلات بعيداً عن خطوط الكهرباء لمنع التشويش.',
    gradient: 'from-blue-950 via-slate-900 to-slate-950',
    iconSymbol: '⚡',
    badge: 'تمديدات فايبر وشبكات',
  },
];

export const DEFAULT_HERO: HeroContent = {
  titleLine1: 'حلول احترافية',
  titleLine2: 'للشبكات والأنظمة الأمنية',
  subtitle:
    'في فضاء الشبكات نقدم حلولًا متكاملة للشبكات وكاميرات المراقبة وأنظمة الإنتركوم للمنازل والشركات والمنشآت التجارية. نبدأ بفهم احتياجك ومعاينة الموقع عند الحاجة، ثم نساعدك في اختيار الحل المناسب وننفذ أعمال التركيب والبرمجة باحترافية، مع توضيح تفاصيل الخدمة والتكلفة قبل البدء.',
  highlights: [
    { id: 'h1', text: 'معاينة مجانية للموقع' },
    { id: 'h2', text: 'وضوح التكلفة قبل البدء' },
    { id: 'h3', text: 'ضمان معتمد على الأجهزة والتركيب' },
  ],
};

// Offers are added from the control panel (prices are the business's call), so none ship by default
export const DEFAULT_OFFERS: Offer[] = [];

// Packages too — until some are added the site shows the «الباقات قريبًا» card
export const DEFAULT_PACKAGES: ServicePackage[] = [];

export const DEFAULT_CONTENT: SiteContent = {
  contact: DEFAULT_CONTACT,
  services: DEFAULT_SERVICES,
  gallery: DEFAULT_GALLERY,
  offers: DEFAULT_OFFERS,
  packages: DEFAULT_PACKAGES,
  hero: DEFAULT_HERO,
};
