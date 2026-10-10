import { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ContentProvider } from './content/ContentContext';
import './index.css';

const AdminApp = lazy(() => import('./admin/AdminApp'));
const isAdmin = window.location.pathname.replace(/\/+$/, '') === '/admin';

if (isAdmin) {
  // The control panel is light-only, whatever theme the visitor picked on the site
  document.documentElement.classList.remove('dark');
}

createRoot(document.getElementById('root')!).render(
  isAdmin ? (
    <Suspense fallback={null}>
      <AdminApp />
    </Suspense>
  ) : (
    <ContentProvider>
      <App />
    </ContentProvider>
  )
);
