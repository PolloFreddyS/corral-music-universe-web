import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import * as core from '../scripts/sync/core.mjs';
import { releaseSchema } from '../src/lib/release-schema';

const {
  slugify,
  uniqueSlug,
  msToDuration,
  guessLanguage,
  mapType,
  normalizeDate,
  knownSpotifyIds,
  releaseFromSpotify,
  matchApple,
  cleanAppleUrl,
  pickImage,
} = core;

describe('sync core', () => {
  it('slugifies titles like the existing catalog', () => {
    expect(slugify('Cuando Éramos Inmortales')).toBe('cuando-eramos-inmortales');
    expect(slugify('La Pelota Se Prendio (Live)')).toBe('la-pelota-se-prendio-live');
    expect(slugify('Los Gallos Sin Planes, Vol. 1')).toBe('los-gallos-sin-planes-vol-1');
    expect(slugify('Piedra Por Piedra')).toBe('piedra-por-piedra');
  });

  it('avoids slug collisions', () => {
    expect(uniqueSlug('Going Under', new Set(['going-under']))).toBe('going-under-2');
  });

  it('formats durations', () => {
    expect(msToDuration(337000)).toBe('5:37');
    expect(msToDuration(250400)).toBe('4:10');
  });

  it('guesses language from titles', () => {
    expect(guessLanguage(['Piedra Por Piedra'])).toBe('es');
    expect(guessLanguage(['The Weight of Everything'])).toBe('en');
  });

  it('maps release types', () => {
    expect(mapType('album', 8)).toBe('album');
    expect(mapType('single', 1)).toBe('single');
    expect(mapType('single', 5)).toBe('ep');
  });

  it('normalises partial dates', () => {
    expect(normalizeDate('2026', 'year')).toBe('2026-01-01');
    expect(normalizeDate('2026-11', 'month')).toBe('2026-11-01');
    expect(normalizeDate('2026-11-25', 'day')).toBe('2026-11-25');
  });

  it('picks the largest image', () => {
    expect(pickImage([{ url: 's', width: 64 }, { url: 'l', width: 640 }, { url: 'm', width: 300 }])).toBe('l');
  });

  it('recognises every release already in the catalog', () => {
    const dir = join(__dirname, '..', 'src', 'content', 'releases');
    const data = readdirSync(dir).map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')));
    const ids = knownSpotifyIds(data);
    expect(ids.size).toBe(data.length);
    expect(ids.has('5LI7diuBre9T41FDn79OE2')).toBe(true);
  });

  it('builds a record that passes the site schema', () => {
    const album = {
      id: '5LI7diuBre9T41FDn79OE2',
      name: 'Piedra Por Piedra',
      album_type: 'single',
      release_date: '2026-11-25',
      release_date_precision: 'day',
      tracks: { items: [{ name: 'Piedra Por Piedra', duration_ms: 337000 }] },
    };
    const rec = releaseFromSpotify(album, { today: '2026-11-25', artworkFile: 'piedra-por-piedra.jpg' });
    expect(() => releaseSchema.parse(rec)).not.toThrow();
    expect(rec).toMatchObject({ type: 'single', language: 'es', status: 'published', spotifyEmbedId: album.id });
    expect(rec.tracklist).toEqual([{ title: 'Piedra Por Piedra', duration: '5:37' }]);
  });

  it('matches Apple collection names (" - Single", accents, Live)', () => {
    const apple = [
      { collectionName: 'La Pelota Se Prendio (Live) - Single' },
      { collectionName: 'Los Gallos Sin Planes, Vol. 1' },
      { collectionName: 'Cuando Éramos Inmortales - Single' },
      { collectionName: 'I THOUGHT WE HAD MORE TIME - Single' },
    ];
    expect(matchApple({ title: 'La Pelota Se Prendio (Live)' }, apple)).toBe(apple[0]);
    expect(matchApple({ title: 'Los Gallos Sin Planes, Vol. 1' }, apple)).toBe(apple[1]);
    expect(matchApple({ title: 'Cuando Éramos Inmortales' }, apple)).toBe(apple[2]);
    expect(matchApple({ title: 'I THOUGHT WE HAD MORE TIME' }, apple)).toBe(apple[3]);
    expect(matchApple({ title: 'More Human Than Ever' }, apple)).toBeUndefined();
  });

  it('strips tracking params from Apple URLs', () => {
    expect(cleanAppleUrl('https://music.apple.com/us/album/x/123?uo=4')).toBe('https://music.apple.com/us/album/x/123');
  });

  it('rejects non-https and script URLs in release links', () => {
    const base = {
      title: 'x',
      type: 'single',
      releaseDate: '2026-01-01',
      status: 'published',
      approved: true,
      language: 'en',
      tracklist: [{ title: 'x' }],
    };
    const ok = (url: string) => releaseSchema.safeParse({ ...base, links: { spotify: { url, verified: true } } }).success;
    expect(ok('https://open.spotify.com/album/x')).toBe(true);
    expect(ok('http://open.spotify.com/album/x')).toBe(false);
    expect(ok('javascript:alert(1)')).toBe(false);
    expect(ok('data:text/html,hi')).toBe(false);
  });
});
