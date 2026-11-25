import type { Locale } from '~/i18n/ui';

/** Joins the configured base path (GitHub Pages sub-path or "/") with a site path. */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}`;
}

export type PageKey = 'home' | 'music' | 'about' | 'book' | 'links';

const SEGMENT: Record<PageKey, string> = {
  home: '',
  music: 'music/',
  about: 'about/',
  book: 'book/',
  links: 'links/',
};

export function pagePath(locale: Locale, page: PageKey): string {
  return withBase(`/${locale}/${SEGMENT[page]}`);
}

export function releasePath(locale: Locale, id: string): string {
  return withBase(`/${locale}/music/${id}/`);
}

/** Same page in the other language: swaps only the leading /en/ or /es/ segment. */
export function swapLocale(pathname: string, to: Locale): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const rest = pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  const swapped = rest.replace(/^\/(en|es)(?=\/|$)/, `/${to}`);
  return `${base}${swapped === rest ? `/${to}/` : swapped}`;
}
