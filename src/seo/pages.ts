import type { CategoryKey, GalleryCategory } from '../content/types';

// Each service category has its own page so it can rank for its own searches
// ("تركيب كاميرات مراقبة الرياض" etc.). Slugs are part of the public URL: don't rename them.
export const SERVICE_SLUGS: Record<CategoryKey, string> = {
  networks: 'networks',
  cameras: 'cctv-cameras',
  intercom: 'intercom',
};

export const servicePath = (key: CategoryKey) => `/services/${SERVICE_SLUGS[key]}/`;

/** Gallery photos shown on each service page */
export const SERVICE_GALLERY: Record<CategoryKey, GalleryCategory[]> = {
  networks: ['networks', 'wifi'],
  cameras: ['cameras'],
  intercom: ['intercom'],
};

export type Route =
  | { page: 'home' }
  | { page: 'service'; category: CategoryKey }
  | { page: 'admin' }
  | { page: 'not-found' };

export const matchRoute = (pathname: string): Route => {
  const path = pathname.replace(/\/index\.html$/, '/').replace(/\/+$/, '') || '/';
  if (path === '/') return { page: 'home' };
  if (path === '/admin') return { page: 'admin' };
  const category = (Object.keys(SERVICE_SLUGS) as CategoryKey[]).find((key) => `${path}/` === servicePath(key));
  return category ? { page: 'service', category } : { page: 'not-found' };
};

export const HOME_SEO = {
  title: 'فضاء الشبكات FSN | تمديد شبكات وكاميرات مراقبة وإنتركوم في الرياض',
  description:
    'مؤسسة فضاء الشبكات الأمنية في الرياض: تمديد وصيانة الشبكات والألياف الضوئية، تركيب كاميرات المراقبة وأنظمة الإنتركوم وتقوية Wi-Fi للمنازل والشركات. معاينة مجانية وضمان معتمد.',
};

/** Search-facing copy per service page; the rest of the page comes from the control panel content */
export const SERVICE_SEO: Record<CategoryKey, { title: string; description: string; heading: string; serviceType: string }> = {
  networks: {
    title: 'تمديد شبكات وألياف ضوئية وتقوية Wi-Fi في الرياض | فضاء الشبكات',
    description:
      'تمديد وصيانة كابلات الشبكة والألياف الضوئية، تركيب أفياش الشبكة، وتقوية تغطية الإنترنت وبرمجة مقويات Wi-Fi للمنازل والفلل والشركات في الرياض. أسعار واضحة ومعاينة للموقع.',
    heading: 'تمديد وصيانة الشبكات وتقوية Wi-Fi في الرياض',
    serviceType: 'تمديد شبكات وتقوية Wi-Fi',
  },
  cameras: {
    title: 'تركيب كاميرات مراقبة في الرياض | فضاء الشبكات FSN',
    description:
      'تركيب وبرمجة كاميرات المراقبة السلكية وكاميرات Wi-Fi للمنازل والمحلات والشركات في الرياض، مع تمديد الكابلات وتركيب الهاردسك وبرمجة جهاز التسجيل. أسعار واضحة ومعاينة فنية للموقع.',
    heading: 'تركيب وبرمجة كاميرات المراقبة في الرياض',
    serviceType: 'تركيب كاميرات مراقبة',
  },
  intercom: {
    title: 'تركيب وبرمجة الإنتركوم في الرياض | فضاء الشبكات FSN',
    description:
      'تركيب وبرمجة أنظمة الإنتركوم للمنازل والفلل والمنشآت في الرياض، مع ربط النظام بالجوال وتوفير أجهزة إنتركوم أصلية حسب احتياج الموقع. أسعار واضحة وصيانة مجانية بعد التركيب.',
    heading: 'تركيب وبرمجة أنظمة الإنتركوم في الرياض',
    serviceType: 'تركيب أنظمة إنتركوم',
  },
};

export const NOT_FOUND_SEO = {
  title: 'الصفحة غير موجودة | فضاء الشبكات FSN',
  description: 'الصفحة التي تبحث عنها غير موجودة. تصفح خدمات الشبكات وكاميرات المراقبة والإنتركوم لدى فضاء الشبكات في الرياض.',
};
