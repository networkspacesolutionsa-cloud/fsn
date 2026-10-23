import { Suspense, lazy } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { ContentProvider } from './content/ContentContext';
import { SitePage } from './pages/SitePage';
import { matchRoute } from './seo/pages';
import './index.css';

const AdminApp = lazy(() => import('./admin/AdminApp'));
const route = matchRoute(window.location.pathname);
const root = document.getElementById('root')!;

if (route.page === 'admin') {
  // The control panel is light-only, whatever theme the visitor picked on the site
  document.documentElement.classList.remove('dark');
  // Never index the control panel (public/_headers also sends X-Robots-Tag: noindex)
  document.querySelector('meta[name="robots"]')?.setAttribute('content', 'noindex, nofollow');
  createRoot(root).render(
    <Suspense fallback={null}>
      <AdminApp />
    </Suspense>
  );
} else {
  const page = (
    <ContentProvider>
      <SitePage route={route} />
    </ContentProvider>
  );
  // Built pages arrive prerendered (scripts/prerender.mjs): attach to that HTML instead of redrawing it
  if (root.hasChildNodes()) hydrateRoot(root, page);
  else createRoot(root).render(page);
}
