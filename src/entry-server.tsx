// Build-time prerender entry (scripts/prerender.mjs): renders each public page to static HTML
// so search engines and link previews see the full content without running JavaScript.
import { renderToString } from 'react-dom/server';
import { ContentProvider, mergeContent } from './content/ContentContext';
import { SitePage } from './pages/SitePage';
import { SERVICE_GALLERY, Route, servicePath } from './seo/pages';
import { canonicalPath, renderHead } from './seo/head';

export { mergeContent, renderHead, canonicalPath, servicePath, SERVICE_GALLERY };

export const render = (rows: { key: string; data: unknown }[], route: Route) =>
  renderToString(
    <ContentProvider initialContent={mergeContent(rows)}>
      <SitePage route={route} />
    </ContentProvider>
  );
