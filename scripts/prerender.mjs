// Runs after `vite build` + the SSR build: bakes each public page (home, one per service category,
// the 404 page) with its own <head>, structured data and the control-panel content into dist/,
// and writes robots.txt + sitemap.xml.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadEnv } from 'vite';

const env = loadEnv('production', process.cwd(), '');
const siteUrl = (env.VITE_SITE_URL || '').replace(/\/+$/, '');
if (!siteUrl) throw new Error('VITE_SITE_URL is not set (see .env.production)');

const { render, renderHead, canonicalPath, mergeContent, servicePath, SERVICE_GALLERY } = await import(
  pathToFileURL('dist-ssr/entry-server.js').href
);

// Same content the live site shows: what was saved in the control panel, over the defaults
const fetchRows = async () => {
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const res = await fetch(`${url}/rest/v1/site_content?select=key,data`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`prerender: could not load Supabase content, using defaults (${err.message})`);
    return [];
  }
};

const rows = await fetchRows();
const content = mergeContent(rows);
// Keep "</script>" inside JSON from closing the tag early
const safe = (json) => json.replace(/</g, '\\u003c');

const template = await readFile('dist/index.html', 'utf8');
const SEO_BLOCK = /<!-- page-seo:[\s\S]*?<!-- \/page-seo -->/;
if (!template.includes('<div id="root"></div>')) throw new Error('prerender: #root not found in dist/index.html');
if (!SEO_BLOCK.test(template)) throw new Error('prerender: <!-- page-seo --> block not found in dist/index.html');

const pageHtml = (route, appHtml) =>
  template
    .replace(SEO_BLOCK, renderHead(route, content, siteUrl))
    .replace('</head>', `  <script>window.__FSN_CONTENT__=${safe(JSON.stringify(rows))}</script>\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

const write = async (file, html) => {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
};

const serviceRoutes = content.services.map((c) => ({ page: 'service', category: c.key }));
for (const route of [{ page: 'home' }, ...serviceRoutes]) {
  await write(`dist${canonicalPath(route)}index.html`, pageHtml(route, render(rows, route)));
}
// Cloudflare serves this with a 404 status for unknown paths (wrangler.jsonc not_found_handling)
const notFound = { page: 'not-found' };
await write('dist/404.html', pageHtml(notFound, render(rows, notFound)));
// The control panel renders in the browser only
await write(
  'dist/admin/index.html',
  template.replace(SEO_BLOCK, renderHead({ page: 'admin' }, content, siteUrl))
);

await writeFile(
  'dist/robots.txt',
  `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${siteUrl}/sitemap.xml\n`
);

// Sitemap with each page's photos, so the work photos can show up in Google Images
const absolute = (path) => (/^https?:\/\//.test(path) ? path : `${siteUrl}${path}`);
const xml = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const workPhotos = (items) => items.flatMap((item) => [item.image, item.beforeImage]);
const sitemapPages = [
  {
    path: '/',
    priority: '1.0',
    images: ['/og-image.jpg', content.hero.image, ...content.services.map((c) => c.cardImage), ...workPhotos(content.gallery)],
  },
  ...content.services.map((c) => ({
    path: servicePath(c.key),
    priority: '0.9',
    images: [c.cardImage, ...workPhotos(content.gallery.filter((item) => SERVICE_GALLERY[c.key].includes(item.category)))],
  })),
];
const lastmod = new Date().toISOString().slice(0, 10);
const urlEntry = ({ path, priority, images }) => {
  const imageTags = [...new Set(images.filter(Boolean).map(absolute))]
    .slice(0, 1000)
    .map((src) => `\n    <image:image><image:loc>${xml(src)}</image:loc></image:image>`)
    .join('');
  return `  <url>
    <loc>${siteUrl}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>${imageTags}
  </url>`;
};
await writeFile(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${sitemapPages.map(urlEntry).join('\n')}
</urlset>
`
);

await rm('dist-ssr', { recursive: true, force: true });
console.log(
  `prerender: ${1 + serviceRoutes.length} pages + 404 rendered (${rows.length} content rows) for ${siteUrl}`
);
