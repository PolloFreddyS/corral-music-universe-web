import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { isPublic, pickLatest, sortNewestFirst } from '../src/lib/visibility';
import { chooseLocale } from '../src/lib/lang-storage';
import { swapLocale } from '../src/lib/paths';

const TODAY = '2026-11-25';
type T = 'album' | 'ep' | 'single';
const r = (
  id: string,
  releaseDate: string,
  status: 'draft' | 'scheduled' | 'published' | 'archived' = 'published',
  approved = true,
  type: T = 'single',
) => ({ id, data: { releaseDate, status, approved, type } });

describe('isPublic', () => {
  it('shows only published + approved + already released', () => {
    expect(isPublic(r('a', '2026-11-01').data, TODAY)).toBe(true);
  });
  it.each(['draft', 'scheduled', 'archived'] as const)('hides %s even with a past date', (status) => {
    expect(isPublic(r('a', '2020-01-01', status).data, TODAY)).toBe(false);
  });
  it('hides unapproved entries', () => {
    expect(isPublic(r('a', '2026-11-01', 'published', false).data, TODAY)).toBe(false);
  });
  it('hides published entries dated in the future', () => {
    expect(isPublic(r('a', '2026-12-31').data, TODAY)).toBe(false);
  });
  it('shows an entry on its release day', () => {
    expect(isPublic(r('a', TODAY).data, TODAY)).toBe(true);
  });
});

describe('pickLatest', () => {
  it('picks the newest public release, ignoring drafts and future dates', () => {
    const items = [
      r('old', '2026-10-01'),
      r('secret-draft', '2026-11-20', 'draft'),
      r('future', '2027-01-01'),
      r('newest', '2026-11-17', 'published', true, 'album'),
    ];
    expect(pickLatest(items, TODAY)?.id).toBe('newest');
  });
  it('prefers an album over a single on the same day', () => {
    const items = [r('s', '2026-10-26', 'published', true, 'single'), r('a', '2026-10-26', 'published', true, 'album')];
    expect(pickLatest(items, TODAY)?.id).toBe('a');
  });
  it('returns undefined when nothing is public', () => {
    expect(pickLatest([r('d', '2026-01-01', 'draft')], TODAY)).toBeUndefined();
  });
});

describe('sortNewestFirst', () => {
  it('orders by date desc then id', () => {
    const out = sortNewestFirst([r('b', '2026-10-26'), r('c', '2026-11-07'), r('a', '2026-10-26')]).map((x) => x.id);
    expect(out).toEqual(['c', 'a', 'b']);
  });
});

describe('chooseLocale', () => {
  it('honours a stored manual choice first', () => {
    expect(chooseLocale('en', ['es-DO'])).toBe('en');
    expect(chooseLocale('es', ['en-US'])).toBe('es');
  });
  it('detects Spanish browsers', () => {
    expect(chooseLocale(null, ['es-419', 'en'])).toBe('es');
  });
  it('uses the first supported browser language', () => {
    expect(chooseLocale(null, ['fr-FR', 'en-GB', 'es'])).toBe('en');
  });
  it('falls back to English', () => {
    expect(chooseLocale(null, ['fr', 'de'])).toBe('en');
    expect(chooseLocale('garbage', [])).toBe('en');
  });
});

describe('swapLocale', () => {
  it('swaps only the language segment', () => {
    expect(swapLocale('/en/music/more-human-than-ever/', 'es')).toBe('/es/music/more-human-than-ever/');
    expect(swapLocale('/es/', 'en')).toBe('/en/');
  });
});

describe('release data files', () => {
  const dir = join(__dirname, '..', 'src', 'content', 'releases');
  const files = readdirSync(dir).filter((f) => f.endsWith('.json'));
  const data = files.map((f) => ({ f, d: JSON.parse(readFileSync(join(dir, f), 'utf8')) }));

  it('has at least one release', () => expect(files.length).toBeGreaterThan(0));

  it.each(data)('$f: every link is https on an allowed platform host', ({ d }) => {
    const allowed = ['open.spotify.com', 'music.apple.com', 'www.youtube.com', 'music.youtube.com'];
    for (const l of Object.values(d.links ?? {}) as { url: string }[]) {
      const u = new URL(l.url);
      expect(u.protocol).toBe('https:');
      expect(allowed).toContain(u.hostname);
    }
  });

  it.each(data)('$f: no lyrics fields are stored', ({ d }) => {
    expect(JSON.stringify(d)).not.toMatch(/"lyrics"/i);
  });
});
