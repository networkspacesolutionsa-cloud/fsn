// Runs after `vite build` + the SSR build: bakes the rendered home page, its structured data
// and the control-panel content into dist/index.html, and writes robots.txt + sitemap.xml.
import { readFile, rm, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { loadEnv } from 'vite';

const env = loadEnv('production', process.cwd(), '');
const siteUrl = (env.VITE_SITE_URL || '').replace(/\/+$/, '');
if (!siteUrl) throw new Error('VITE_SITE_URL is not set (see .env.production)');

const { render, buildStructuredData, mergeContent } = await import(
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
const appHtml = render(rows);
const jsonLd = JSON.stringify(buildStructuredData(mergeContent(rows), siteUrl));
// Keep "</script>" inside JSON from closing the tag early
const safe = (json) => json.replace(/</g, '\\u003c');

let html = await readFile('dist/index.html', 'utf8');
if (!html.includes('<div id="root"></div>')) throw new Error('prerender: #root not found in dist/index.html');
html = html
  .replace(
    '</head>',
    `  <script type="application/ld+json">${safe(jsonLd)}</script>\n` +
      `    <script>window.__FSN_CONTENT__=${safe(JSON.stringify(rows))}</script>\n  </head>`
  )
  .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
await writeFile('dist/index.html', html);

await writeFile(
  'dist/robots.txt',
  `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${siteUrl}/sitemap.xml\n`
);
await writeFile(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`
);

await rm('dist-ssr', { recursive: true, force: true });
console.log(`prerender: home page rendered (${rows.length} content rows) for ${siteUrl}`);
