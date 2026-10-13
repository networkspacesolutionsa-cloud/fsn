import { FAQS } from '../content/faqs';
import type { SiteContent } from '../content/types';

export const BUSINESS_NAME = 'مؤسسة فضاء الشبكات الأمنية';
export const BRAND_NAME = 'فضاء الشبكات FSN';

const absolute = (siteUrl: string, path: string) => (/^https?:\/\//.test(path) ? path : `${siteUrl}${path}`);

/** schema.org JSON-LD for the home page: the business, its services and the FAQ (Google rich results). */
export const buildStructuredData = (content: SiteContent, siteUrl: string) => {
  const { contact, services } = content;
  const businessId = `${siteUrl}/#business`;

  const business = {
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': businessId,
    name: BUSINESS_NAME,
    alternateName: ['فضاء الشبكات', 'FSN', 'Fadaa Al Shabakat'],
    description:
      'حلول احترافية للشبكات والأنظمة الأمنية للمنازل والشركات والمنشآت: تمديد وصيانة الشبكات والألياف الضوئية، تركيب كاميرات المراقبة، أنظمة الإنتركوم وتقوية تغطية Wi-Fi.',
    url: `${siteUrl}/`,
    logo: `${siteUrl}/icon-512.png`,
    image: `${siteUrl}/og-image.jpg`,
    telephone: `+${contact.phone}`,
    email: contact.email || undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'الرياض',
      addressCountry: 'SA',
    },
    areaServed: { '@type': 'City', name: 'الرياض' },
    priceRange: '$$',
    hasMap: contact.mapUrl || undefined,
    identifier: contact.commercialRegistration
      ? { '@type': 'PropertyValue', name: 'السجل التجاري', value: contact.commercialRegistration }
      : undefined,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: `+${contact.phone}`,
      contactType: 'customer service',
      availableLanguage: ['Arabic'],
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'خدمات التركيب',
      itemListElement: services.map((category) => ({
        '@type': 'OfferCatalog',
        name: category.cardTitle,
        description: category.cardDescription,
        image: category.cardImage ? absolute(siteUrl, category.cardImage) : undefined,
        itemListElement: category.items.map((item) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: item.title, description: item.description },
        })),
      })),
    },
  };

  const website = {
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: `${siteUrl}/`,
    name: BRAND_NAME,
    inLanguage: 'ar',
    publisher: { '@id': businessId },
  };

  const faq = {
    '@type': 'FAQPage',
    '@id': `${siteUrl}/#faq`,
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return { '@context': 'https://schema.org', '@graph': [business, website, faq] };
};
