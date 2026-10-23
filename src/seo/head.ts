import type { SiteContent } from '../content/types';
import { HOME_SEO, NOT_FOUND_SEO, Route, SERVICE_SEO, servicePath } from './pages';
import { BRAND_NAME, buildStructuredData } from './structuredData';

const escapeAttr = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Keep "</script>" inside JSON from closing the tag early
const safeJson = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');

/** Path of the page, or null when it must not be indexed (404, control panel) */
export const canonicalPath = (route: Route) =>
  route.page === 'home' ? '/' : route.page === 'service' ? servicePath(route.category) : null;

/** The <head> tags that differ per page: title, description, canonical, link previews and JSON-LD */
export const renderHead = (route: Route, content: SiteContent, siteUrl: string) => {
  const seo =
    route.page === 'home'
      ? HOME_SEO
      : route.page === 'service'
        ? SERVICE_SEO[route.category]
        : route.page === 'admin'
          ? { title: `لوحة التحكم | ${BRAND_NAME}`, description: '' }
          : NOT_FOUND_SEO;
  const path = canonicalPath(route);
  const tags = [`<title>${escapeAttr(seo.title)}</title>`];
  if (seo.description) tags.push(`<meta name="description" content="${escapeAttr(seo.description)}" />`);

  if (!path) {
    tags.push('<meta name="robots" content="noindex, nofollow" />');
    return tags.join('\n    ');
  }

  const url = `${siteUrl}${path}`;
  const image = `${siteUrl}/og-image.jpg`;
  tags.push(
    '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />',
    `<link rel="canonical" href="${url}" />`,
    // Link previews (WhatsApp, X, Facebook, LinkedIn, Telegram)
    '<meta property="og:type" content="website" />',
    '<meta property="og:locale" content="ar_SA" />',
    `<meta property="og:site_name" content="${escapeAttr(BRAND_NAME)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${escapeAttr(seo.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(seo.description)}" />`,
    `<meta property="og:image" content="${image}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta property="og:image:alt" content="مؤسسة فضاء الشبكات الأمنية - تمديد الشبكات وكاميرات المراقبة وأنظمة الإنتركوم" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeAttr(seo.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(seo.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<script type="application/ld+json">${safeJson(buildStructuredData(content, siteUrl, route))}</script>`
  );
  return tags.join('\n    ');
};
