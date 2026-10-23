import { FAQS } from '../content/faqs';
import type { ServiceItem, SiteContent } from '../content/types';
import { HOME_SEO, Route, SERVICE_SEO, servicePath } from './pages';

export const BUSINESS_NAME = 'مؤسسة فضاء الشبكات الأمنية';
export const BRAND_NAME = 'فضاء الشبكات FSN';

const absolute = (siteUrl: string, path: string) => (/^https?:\/\//.test(path) ? path : `${siteUrl}${path}`);

/** Control-panel text without the RichText markers (**bold**, !!green!!, "• " bullets) */
export const plainText = (text: string) => text.replace(/\*\*|!!/g, '').replace(/^•\s*/gm, '').trim();

// Only "price" badges carry a fixed price, e.g. "150 ريال" or "120 ريال / فيش"
const offerFor = (item: ServiceItem) => {
  const price = item.badgeTone === 'price' ? item.badge.replace(/[,٬]/g, '').match(/\d+(\.\d+)?/)?.[0] : undefined;
  return {
    '@type': 'Offer',
    itemOffered: { '@type': 'Service', name: plainText(item.title), description: plainText(item.description) },
    ...(price && { price, priceCurrency: 'SAR' }),
  };
};

/** schema.org JSON-LD for a page: the business on every page, plus the FAQ (home) or the service (service pages). */
export const buildStructuredData = (content: SiteContent, siteUrl: string, route: Route = { page: 'home' }) => {
  const { contact, services } = content;
  const businessId = `${siteUrl}/#business`;
  const areaServed = { '@type': 'City', name: 'الرياض' };

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
      addressRegion: 'منطقة الرياض',
      addressCountry: 'SA',
    },
    areaServed,
    priceRange: '$$',
    hasMap: contact.mapUrl || undefined,
    identifier: contact.commercialRegistration
      ? { '@type': 'PropertyValue', name: 'السجل التجاري', value: contact.commercialRegistration }
      : undefined,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: `+${contact.phone}`,
      contactType: 'customer service',
      areaServed: 'SA',
      availableLanguage: ['Arabic'],
    },
    knowsAbout: ['تمديد الشبكات', 'الألياف الضوئية', 'كاميرات المراقبة', 'أنظمة الإنتركوم', 'تقوية Wi-Fi'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'خدمات التركيب',
      itemListElement: services.map((category) => ({
        '@type': 'OfferCatalog',
        name: category.cardTitle,
        description: plainText(category.cardDescription),
        url: `${siteUrl}${servicePath(category.key)}`,
        image: category.cardImage ? absolute(siteUrl, category.cardImage) : undefined,
        itemListElement: category.items.map(offerFor),
      })),
    },
  };

  const website = {
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: `${siteUrl}/`,
    name: BRAND_NAME,
    description: HOME_SEO.description,
    inLanguage: 'ar',
    publisher: { '@id': businessId },
  };

  const graph: object[] = [business, website];

  if (route.page === 'home') {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${siteUrl}/#faq`,
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }

  const category = route.page === 'service' ? services.find((c) => c.key === route.category) : undefined;
  if (category) {
    const seo = SERVICE_SEO[category.key];
    const pageUrl = `${siteUrl}${servicePath(category.key)}`;
    graph.push(
      {
        '@type': 'Service',
        '@id': `${pageUrl}#service`,
        name: seo.heading,
        serviceType: seo.serviceType,
        description: plainText(category.sectionDescription),
        url: pageUrl,
        image: category.cardImage ? absolute(siteUrl, category.cardImage) : undefined,
        provider: { '@id': businessId },
        areaServed,
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: category.cardTitle,
          itemListElement: category.items.map(offerFor),
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${siteUrl}/` },
          { '@type': 'ListItem', position: 2, name: category.cardTitle, item: pageUrl },
        ],
      }
    );
  }

  return { '@context': 'https://schema.org', '@graph': graph };
};
