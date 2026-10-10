import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// null until the keys are added to .env.local — the site then falls back to its built-in content
export const supabase: SupabaseClient | null = url && anonKey ? createClient(url, anonKey) : null;

export const IMAGES_BUCKET = 'site-images';
