import site from '~/data/site-config.json';

/** localStorage key holding the visitor's manually chosen language ("en" | "es"). */
export const STORAGE_KEY: string = site.languageStorageKey;

/**
 * First-visit language choice. A stored manual choice wins; otherwise the
 * browser's preferred languages are scanned for Spanish; English is the fallback.
 */
export function chooseLocale(stored: string | null, browserLanguages: readonly string[]): 'en' | 'es' {
  if (stored === 'en' || stored === 'es') return stored;
  for (const lang of browserLanguages) {
    const primary = lang.toLowerCase().split('-')[0];
    if (primary === 'es') return 'es';
    if (primary === 'en') return 'en';
  }
  return 'en';
}
