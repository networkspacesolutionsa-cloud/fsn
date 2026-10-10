import type { CategoryKey } from '../content/types';

export const SHOW_SERVICE_EVENT = 'fsn:show-service';

export interface ShowServiceDetail {
  category: CategoryKey | 'all';
  itemId?: string;
}

/**
 * Jump to a service category (or one service card) from anywhere, e.g. the header dropdown.
 * ServicesSection listens, switches its filter so the target is rendered, then scrolls to it.
 */
export const showService = (category: ShowServiceDetail['category'], itemId?: string) =>
  window.dispatchEvent(new CustomEvent<ShowServiceDetail>(SHOW_SERVICE_EVENT, { detail: { category, itemId } }));
