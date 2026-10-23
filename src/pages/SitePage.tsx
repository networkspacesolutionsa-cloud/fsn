import React from 'react';
import App from '../App';
import type { Route } from '../seo/pages';
import { ServicePage } from './ServicePage';
import { NotFoundPage } from './NotFoundPage';

/** The public page for a route (the control panel is loaded separately in main.tsx) */
export const SitePage: React.FC<{ route: Route }> = ({ route }) =>
  route.page === 'service' ? <ServicePage category={route.category} /> : route.page === 'home' ? <App /> : <NotFoundPage />;
