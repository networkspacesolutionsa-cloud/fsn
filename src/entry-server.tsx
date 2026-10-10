// Build-time prerender entry (scripts/prerender.mjs): renders the home page to static HTML
// so search engines and link previews see the full content without running JavaScript.
import { renderToString } from 'react-dom/server';
import App from './App';
import { ContentProvider, mergeContent } from './content/ContentContext';
import { buildStructuredData } from './seo/structuredData';

export { mergeContent, buildStructuredData };

export const render = (rows: { key: string; data: unknown }[]) =>
  renderToString(
    <ContentProvider initialContent={mergeContent(rows)}>
      <App />
    </ContentProvider>
  );
