// بناء تصاميم السوشال ميديا لمؤسسة فضاء الشبكات الأمنية
// يولّد ملفات HTML ثم يصوّرها PNG عبر Google Chrome (headless)
// التشغيل:  node social-media/build.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SITE = 'fsn-networks.sa';

/* ---------------------------------- الستايل ---------------------------------- */

const BASE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400..900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
html,body{background:#000}
body{font-family:'Cairo',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.card{position:relative;overflow:hidden;display:flex;flex-direction:column;
  background:#0B1A30;color:#fff}
.card.light{background:#EEF3FA;color:#0B1A30}
/* خلفية: توهج + شبكة نقاط */
.glow{position:absolute;inset:0;pointer-events:none}
.glow i{position:absolute;border-radius:50%;filter:blur(90px);opacity:.55}
.g1{width:640px;height:640px;background:#1E6FD9;top:-220px;left:-180px}
.g2{width:520px;height:520px;background:#0EA5E9;bottom:-200px;right:-160px;opacity:.38}
.light .g1{opacity:.22}.light .g2{opacity:.18}
.grid{position:absolute;inset:0;opacity:.14;
  background-image:linear-gradient(#ffffff22 1px,transparent 1px),linear-gradient(90deg,#ffffff22 1px,transparent 1px);
  background-size:60px 60px;mask-image:radial-gradient(circle at 70% 25%,#000 10%,transparent 72%)}
.light .grid{background-image:linear-gradient(#0B1A3022 1px,transparent 1px),linear-gradient(90deg,#0B1A3022 1px,transparent 1px);opacity:.5}
.watermark{position:absolute;opacity:.055;pointer-events:none}
/* الهيدر */
.head{position:relative;display:flex;align-items:center;justify-content:space-between;gap:24px}
.chip{background:#fff;border-radius:22px;padding:18px 26px;display:flex;align-items:center;
  box-shadow:0 18px 40px rgba(0,0,0,.25)}
.chip img{display:block;height:54px;width:auto}
.tag{display:inline-flex;align-items:center;gap:10px;font-weight:700;letter-spacing:.2px;
  background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.22);border-radius:999px;
  padding:14px 24px;font-size:26px;color:#CFE3FF}
.light .tag{background:#fff;border-color:#CBD8EA;color:#1E4C8A}
.tag b{width:12px;height:12px;border-radius:50%;background:#22D3EE;display:block}
/* المحتوى */
.body{position:relative;flex:1;display:flex;flex-direction:column;justify-content:center}
.eyebrow{display:inline-flex;align-self:flex-start;align-items:center;gap:12px;font-size:28px;font-weight:800;
  color:#0B1A30;background:linear-gradient(90deg,#22D3EE,#38BDF8);border-radius:999px;padding:12px 28px}
h1{font-weight:900;line-height:1.18;letter-spacing:-.5px}
.sub{color:#B9CBE4;font-weight:500;line-height:1.75}
.light .sub{color:#3C5578}
/* السعر */
.price{display:flex;align-items:center;gap:26px;background:linear-gradient(135deg,#1E6FD9,#0EA5E9);
  border-radius:32px;padding:30px 40px;box-shadow:0 24px 60px rgba(30,111,217,.38)}
.price .num{font-size:110px;font-weight:900;line-height:1;letter-spacing:-2px;color:#fff;direction:ltr}
.price .cur{font-size:38px;font-weight:800;color:#DFF1FF}
.price .note{font-size:28px;font-weight:700;color:#EAF6FF;line-height:1.5;border-right:3px solid rgba(255,255,255,.4);padding-right:26px}
/* النقاط */
ul{list-style:none;display:flex;flex-direction:column;gap:22px}
li{display:flex;align-items:flex-start;gap:18px;font-size:34px;font-weight:600;line-height:1.5;color:#E6EEFA}
.light li{color:#1B3252}
li svg{flex:none;margin-top:4px}
/* جدول الأسعار */
.rows{display:flex;flex-direction:column;gap:18px}
.row{display:flex;align-items:center;justify-content:space-between;gap:20px;
  background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14);border-radius:24px;padding:26px 32px}
.light .row{background:#fff;border-color:#D7E2F1;box-shadow:0 10px 24px rgba(11,26,48,.06)}
.row .n{font-size:34px;font-weight:700;line-height:1.35}
.row .p{font-size:40px;font-weight:900;color:#22D3EE;direction:ltr;white-space:nowrap}
.light .row .p{color:#1E6FD9}
.row small{display:block;font-size:24px;font-weight:600;color:#9DB4D4;margin-top:6px}
.light .row small{color:#5B7496}
/* الفوتر */
.foot{position:relative;display:flex;align-items:center;justify-content:space-between;gap:20px;
  border-top:1px solid rgba(255,255,255,.16);padding-top:30px}
.light .foot{border-color:#C9D7E8}
.foot .meta{display:flex;align-items:center;gap:18px;font-size:27px;font-weight:700;color:#C3D6F0}
.light .foot .meta{color:#36507A}
.foot .dot{width:8px;height:8px;border-radius:50%;background:#22D3EE}
.foot .site{font-size:30px;font-weight:900;color:#fff;direction:ltr;letter-spacing:.4px}
.light .foot .site{color:#0B1A30}
.cta{display:inline-flex;align-items:center;gap:14px;background:#fff;color:#0B1A30;font-weight:900;
  border-radius:999px;padding:22px 40px;font-size:32px}
.light .cta{background:#0B1A30;color:#fff}
.note{font-size:24px;font-weight:600;color:#8FA8C9;line-height:1.6}
.light .note{color:#5B7496}
`;

const check = (c = '#22D3EE') =>
  `<svg width="34" height="34" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="${c}" opacity=".18"/><path d="M7 12.5l3.2 3.2L17 9" stroke="${c}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/* --------------------------------- القوالب --------------------------------- */

function page(w, h, css, inner) {
  return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">
<style>${BASE_CSS}
.card{width:${w}px;height:${h}px}
${css}</style></head><body>${inner}</body></html>`;
}

function bg(light) {
  return `<div class="glow"><i class="g1"></i><i class="g2"></i></div><div class="grid"></div>
  <img class="watermark" src="../assets/${light ? 'logo-mark-color' : 'logo-mark'}.png">`;
}

// منشور إنستقرام 1080×1350
function igPost(p) {
  const light = p.theme === 'light';
  const css = `
  .card{padding:68px 68px 60px}
  ul{gap:20px}
  li{font-size:32px}
  .foot{margin-top:30px}
  .watermark{width:640px;left:50%;transform:translateX(-50%);bottom:-230px}
  h1{font-size:${p.titleSize || 78}px;margin-top:34px;max-width:900px}
  .sub{font-size:33px;margin-top:26px;max-width:880px}
  .body{gap:0}
  .block{margin-top:46px}
  ul{margin-top:44px}
  ${p.dense ? `
  h1{font-size:58px;margin-top:22px}
  .block{margin-top:32px}
  .rows{gap:12px}
  .row{padding:16px 30px;border-radius:20px}
  .row .n{font-size:31px}.row .p{font-size:35px}.row small{font-size:22px;margin-top:4px}
  .eyebrow{font-size:26px;padding:10px 24px}
  .chip img{height:46px}
  .card{padding:62px 68px 54px}
  .body>.note{margin-top:26px!important;font-size:23px}
  .foot{padding-top:24px}` : ''}`;

  const price = p.price
    ? `<div class="block price"><div><span class="num">${p.price}</span> <span class="cur">ريال</span></div>
       ${p.priceNote ? `<div class="note" style="color:#EAF6FF;font-size:28px;font-weight:700;border-right:3px solid rgba(255,255,255,.4);padding-right:26px">${p.priceNote}</div>` : ''}</div>`
    : '';

  const rows = p.rows
    ? `<div class="block rows">${p.rows
        .map(
          (r) =>
            `<div class="row"><div class="n">${r.n}${r.s ? `<small>${r.s}</small>` : ''}</div><div class="p">${r.p}</div></div>`,
        )
        .join('')}</div>`
    : '';

  const bullets = p.bullets
    ? `<ul>${p.bullets.map((b) => `<li>${check(light ? '#1E6FD9' : '#22D3EE')}<span>${b}</span></li>`).join('')}</ul>`
    : '';

  return page(
    1080,
    1350,
    css,
    `<div class="card ${light ? 'light' : ''}">
      ${bg(light)}
      <div class="head">
        <div class="chip"><img src="../assets/logo-full.png"></div>
        <div class="tag"><b></b> الرياض</div>
      </div>
      <div class="body">
        <span class="eyebrow">${p.eyebrow}</span>
        <h1>${p.title}</h1>
        ${p.sub ? `<p class="sub">${p.sub}</p>` : ''}
        ${price}${rows}${bullets}
        ${p.footnote ? `<p class="note" style="margin-top:28px">${p.footnote}</p>` : ''}
      </div>
      <div class="foot">
        <div class="meta"><span>${p.cta || 'معاينة مجانية'}</span><span class="dot"></span><span>ضمان معتمد</span></div>
        <div class="site">${SITE}</div>
      </div>
    </div>`,
  );
}

// غلاف تيك توك / ستوري 1080×1920 (المحتوى داخل المنطقة الآمنة)
function ttCover(p) {
  const light = p.theme === 'light';
  const css = `
  .card{padding:150px 80px 430px}
  .watermark{width:820px;left:50%;transform:translateX(-50%);bottom:150px}
  h1{font-size:${p.titleSize || 104}px;margin-top:44px}
  .sub{font-size:40px;margin-top:34px}
  ul{margin-top:54px}
  li{font-size:40px}
  .body{justify-content:flex-start;padding-top:90px}
  .price{margin-top:54px}
  .price .num{font-size:130px}
  .rows{margin-top:48px;gap:16px}
  .row{padding:22px 32px}
  .row .n{font-size:38px}.row .p{font-size:44px}
  .safe{position:absolute;left:0;right:0;bottom:330px;display:flex;justify-content:center}`;

  const bullets = p.bullets
    ? `<ul>${p.bullets.map((b) => `<li>${check(light ? '#1E6FD9' : '#22D3EE')}<span>${b}</span></li>`).join('')}</ul>`
    : '';
  const rows = p.rows
    ? `<div class="rows">${p.rows.map((r) => `<div class="row"><div class="n">${r.n}</div><div class="p">${r.p}</div></div>`).join('')}</div>`
    : '';
  const price = p.price
    ? `<div class="price"><div><span class="num">${p.price}</span> <span class="cur">ريال</span></div>${p.priceNote ? `<div class="note" style="color:#EAF6FF;font-size:30px;font-weight:700;border-right:3px solid rgba(255,255,255,.4);padding-right:26px">${p.priceNote}</div>` : ''}</div>`
    : '';

  return page(
    1080,
    1920,
    css,
    `<div class="card ${light ? 'light' : ''}">
      ${bg(light)}
      <div class="head">
        <div class="chip"><img src="../assets/logo-full.png"></div>
        <div class="tag"><b></b> الرياض</div>
      </div>
      <div class="body">
        <span class="eyebrow">${p.eyebrow}</span>
        <h1>${p.title}</h1>
        ${p.sub ? `<p class="sub">${p.sub}</p>` : ''}
        ${price}${rows}${bullets}
      </div>
      <div class="safe"><span class="cta">${p.cta || 'تابعنا للمزيد'} · ${SITE}</span></div>
    </div>`,
  );
}

/* ---------------------------------- المحتوى --------------------------------- */

const IG = [
  {
    file: 'ig-01-intro',
    eyebrow: 'مؤسسة فضاء الشبكات الأمنية',
    title: 'شبكتك وكاميراتك<br>بأيدٍ محترفة',
    sub: 'نخدم المنازل والفلل والمنشآت في الرياض: تنفيذ نظيف، أسعار واضحة من البداية، وضمان مكتوب على كل خدمة.',
    bullets: [
      'تمديد وصيانة الشبكات والألياف الضوئية',
      'تركيب وبرمجة كاميرات المراقبة',
      'أنظمة الإنتركوم والربط مع الجوال',
      'تقوية تغطية الواي فاي للمنزل والمنشأة',
    ],
    cta: 'معاينة مجانية',
  },
  {
    file: 'ig-02-sockets',
    eyebrow: 'خدمات الشبكات',
    title: 'تركيب وتجهيز<br>أفياش الشبكة الجدارية',
    sub: 'عندك كابلات ممددة وتحتاج تركيب الرؤوس والأفياش وتشغيلها؟ نجهزها لك باحترافية ونسلمها شغالة.',
    price: '120',
    priceNote: 'للفيش الواحد<br>أكثر من 5 أفياش: 100 ريال',
    bullets: ['تركيب رأس الكابل والفيش', 'تشغيل واختبار الاتصال', 'فيش أبيض أو أسود مشمول بالسعر'],
    cta: 'احجز الخدمة',
  },
  {
    file: 'ig-03-camera-wifi',
    eyebrow: 'كاميرات المراقبة',
    title: 'تركيب وبرمجة<br>كاميرا Wi-Fi',
    sub: 'كاميرا واحدة، تركيب وبرمجة وتشغيل على جوالك، وتسليمها جاهزة في نفس الزيارة.',
    price: '150',
    priceNote: 'شامل التركيب<br>والبرمجة والتشغيل',
    bullets: ['تمديدات كهربائية حتى 15 متر', 'برمجة الكاميرا وربطها بالجوال', 'دعم فني لمدة 3 أشهر'],
    footnote: 'السعر لا يشمل قطع الغيار، وأي خدمة خارج وصف الخدمة تُحتسب بعد الاتفاق مع العميل.',
    cta: 'احجز الخدمة',
  },
  {
    file: 'ig-04-camera-wired',
    eyebrow: 'كاميرات المراقبة',
    title: 'كاميرا مراقبة سلكية<br>داخلية أو خارجية',
    sub: 'تمديد الكابل، تركيب الكاميرا والهاردسك، وبرمجة جهاز التسجيل واختبار النظام كامل.',
    price: '250',
    priceNote: 'للكاميرا الواحدة<br>تمديد حتى 30 متر',
    bullets: ['الكابل والتمديد مشمول حتى 30 متر', 'تركيب الهاردسك وبرمجة جهاز التسجيل', 'ضمان 3 أشهر على التركيب والبرمجة'],
    footnote: 'السعر لا يشمل قطع الغيار والإكسسوارات. الجرجور البلاستيكي للتمديد الواحد 130 ريال شامل التركيب.',
    cta: 'احجز الخدمة',
  },
  {
    file: 'ig-05-intercom',
    eyebrow: 'أنظمة الإنتركوم',
    title: 'إنتركوم مربوط<br>مع جوالك',
    sub: 'شوف مين على الباب وافتح له وأنت خارج البيت. نركب ونبرمج النظام ونسلمه جاهز للعمل.',
    price: '400',
    priceNote: 'جرس واحد + شاشة واحدة<br>شامل البرمجة والربط',
    bullets: ['تركيب وبرمجة الجرس والشاشة', 'ربط النظام مع الجوال', 'صيانة مجانية لمدة 3 أشهر'],
    footnote: 'الجهاز والإكسسوارات غير مشمولة في سعر الخدمة، ونقدر نوفر لك الجهاز المناسب حسب احتياجك.',
    cta: 'احجز الخدمة',
  },
  {
    file: 'ig-06-wifi',
    eyebrow: 'تغطية الواي فاي',
    title: 'النت ضعيف<br>في نص البيت؟',
    sub: 'نعاين الموقع ونحدد الحل المناسب لمساحته: مقوي شبكة، نقاط وصول، أو تمديد كابل للتغطية الكاملة.',
    price: '150',
    priceNote: 'تركيب وبرمجة<br>مقوي شبكة Wi-Fi',
    bullets: [
      'ربط المقوي بالراوتر لاسلكيًا أو بكابل',
      'ضبط الإعدادات والتأكد من التغطية',
      'برمجة مجانية لمدة 3 أشهر',
      'حلول التغطية الكاملة للفلل: ضمان سنتين على الأجهزة',
    ],
    footnote: 'الخدمة لا تشمل تمديد كابل الشبكة ولا سعر الجهاز، وتوضَّح أي تكلفة إضافية قبل التنفيذ.',
    cta: 'احجز الخدمة',
  },
  {
    file: 'ig-07-pricelist',
    theme: 'light',
    dense: true,
    eyebrow: 'قائمة الأسعار',
    title: 'أسعارنا واضحة<br>من أول مكالمة',
    titleSize: 70,
    rows: [
      { n: 'فيش شبكة جداري', s: 'أكثر من 5 أفياش: 100 ريال', p: '120 ريال' },
      { n: 'تركيب وبرمجة كاميرا Wi-Fi', s: 'دعم فني 3 أشهر', p: '150 ريال' },
      { n: 'تركيب وبرمجة مقوي Wi-Fi', s: 'برمجة مجانية 3 أشهر', p: '150 ريال' },
      { n: 'كاميرا مراقبة سلكية', s: 'تمديد حتى 30 متر', p: '250 ريال' },
      { n: 'معاينة كاميرات المراقبة', s: 'تُخصم عند تنفيذ المشروع', p: '200 ريال' },
      { n: 'تركيب وبرمجة إنتركوم', s: 'جرس + شاشة وربط بالجوال', p: '400 ريال' },
    ],
    footnote: 'الأسعار لا تشمل الأجهزة وقطع الغيار، وتمديد الشبكات والألياف الضوئية يُسعَّر بعد المعاينة.',
    cta: 'اطلب عرض سعر',
  },
  {
    file: 'ig-08-whyus',
    eyebrow: 'ليش فضاء الشبكات؟',
    title: 'شغل نظيف<br>وضمان مكتوب',
    sub: 'ما نترك العميل بعد التركيب. كل خدمة لها وصف واضح، سعر معروف، وفترة ضمان ودعم فني.',
    bullets: [
      'فنيون متخصصون ومعاينة قبل التنفيذ',
      'سعر واضح قبل بدء العمل بدون مفاجآت',
      'ضمان يصل إلى سنة على التمديدات',
      'إمكانية التنفيذ في نفس اليوم عند الاتفاق',
      'مؤسسة مسجلة — سجل تجاري 1010809778',
    ],
    cta: 'تواصل معنا',
  },
];

const TT = [
  {
    file: 'tt-01-wifi-weak',
    eyebrow: 'معلومة تهمك',
    title: 'ليش النت ضعيف<br>في غرفتك؟',
    sub: 'ثلاثة أسباب تتكرر في أغلب البيوت… والحل أبسط مما تتوقع.',
    bullets: ['مكان الراوتر غلط', 'جدران خرسانية تقطع الإشارة', 'مقوي شبكة غير مبرمج صح'],
    cta: 'شاهد الحل',
  },
  {
    file: 'tt-02-camera-compare',
    eyebrow: 'قبل ما تشتري',
    title: 'كاميرا واي فاي<br>ولا كاميرا سلكية؟',
    sub: 'الفرق مو في السعر بس… الفرق في ثبات الاتصال ومكان التركيب.',
    bullets: ['واي فاي: تركيب أسرع — 150 ريال', 'سلكية: أثبت وأوضح — 250 ريال', 'المكان هو اللي يحدد الأنسب'],
    cta: 'استشرنا مجانًا',
  },
  {
    file: 'tt-03-intercom',
    eyebrow: 'إنتركوم',
    title: 'افتح الباب<br>وأنت برا البيت',
    sub: 'نركب الإنتركوم ونربطه بجوالك، وتشوف مين على الباب من أي مكان.',
    price: '400',
    priceNote: 'شامل التركيب<br>والبرمجة والربط',
    cta: 'احجز الآن',
  },
  {
    file: 'tt-04-pricelist',
    eyebrow: 'بدون مفاجآت',
    title: 'أسعارنا واضحة',
    titleSize: 92,
    rows: [
      { n: 'فيش شبكة جداري', p: '120 ريال' },
      { n: 'كاميرا Wi-Fi', p: '150 ريال' },
      { n: 'مقوي شبكة Wi-Fi', p: '150 ريال' },
      { n: 'كاميرا مراقبة سلكية', p: '250 ريال' },
      { n: 'تركيب إنتركوم', p: '400 ريال' },
    ],
    cta: 'اطلب عرض سعر',
  },
  {
    file: 'tt-05-before-after',
    eyebrow: 'قبل وبعد',
    title: 'كابينة شبكة<br>من فوضى لترتيب',
    sub: 'ترتيب الكابينة مو شكل بس — يسهّل الصيانة ويقلل أعطال الشبكة.',
    bullets: ['ترقيم وتنظيم كل كابل', 'باتش بانل مرتب ومجرب', 'تسليم الشبكة وهي شغالة'],
    cta: 'شوف أعمالنا',
  },
];

/* ---------------------------------- التنفيذ --------------------------------- */

mkdirSync(join(ROOT, 'html'), { recursive: true });
const jobs = [];
for (const p of IG) {
  const f = join(ROOT, 'html', `${p.file}.html`);
  writeFileSync(f, igPost(p));
  jobs.push({ html: f, out: join(ROOT, 'instagram', `${p.file}.png`), w: 1080, h: 1350 });
}
for (const p of TT) {
  const f = join(ROOT, 'html', `${p.file}.html`);
  writeFileSync(f, ttCover(p));
  jobs.push({ html: f, out: join(ROOT, 'tiktok', `${p.file}.png`), w: 1080, h: 1920 });
}

for (const j of jobs) {
  execFileSync(
    CHROME,
    [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--allow-file-access-from-files',
      `--window-size=${j.w},${j.h}`,
      `--screenshot=${j.out}`,
      '--virtual-time-budget=10000',
      j.html,
    ],
    { stdio: 'ignore' },
  );
  console.log('✓', j.out.replace(ROOT + '/', ''));
}
console.log(`\nتم توليد ${jobs.length} تصميم.`);
