import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { DEFAULT_CONTENT } from './defaults';
import type { ContactInfo, ContentKey, HeroContent, SiteContent } from './types';

const CACHE_KEY = 'fsn-content-cache';
const KEYS: ContentKey[] = ['contact', 'services', 'gallery', 'offers', 'packages', 'hero'];

/** Overlay rows saved in the control panel on top of the built-in defaults. */
export const mergeContent = (rows: { key: string; data: unknown }[]): SiteContent => {
  const merged: SiteContent = { ...DEFAULT_CONTENT };
  for (const row of rows) {
    if (!KEYS.includes(row.key as ContentKey) || row.data == null) continue;
    if (row.key === 'contact') {
      merged.contact = { ...DEFAULT_CONTENT.contact, ...(row.data as Partial<ContactInfo>) };
    } else if (row.key === 'hero') {
      merged.hero = { ...DEFAULT_CONTENT.hero, ...(row.data as Partial<HeroContent>) };
    } else {
      (merged as any)[row.key] = row.data;
    }
  }
  return merged;
};

const readCache = (): SiteContent | null => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? mergeContent(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
};

const ContentContext = createContext<SiteContent>(DEFAULT_CONTENT);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Last-seen content from this browser first, so returning visitors don't see old prices flash
  const [content, setContent] = useState<SiteContent>(() => readCache() ?? DEFAULT_CONTENT);

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;
    supabase
      .from('site_content')
      .select('key, data')
      .then(({ data, error }) => {
        if (cancelled || error || !data) return;
        setContent(mergeContent(data));
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        } catch {
          // cache is optional
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
};

export const useContent = () => useContext(ContentContext);

const digits = (value: string) => value.replace(/\D/g, '');

export const whatsappUrl = (contact: ContactInfo, message: string) =>
  `https://wa.me/${digits(contact.whatsapp)}?text=${encodeURIComponent(message)}`;

export const telUrl = (contact: ContactInfo) => `tel:+${digits(contact.phone)}`;
