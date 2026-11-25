import { getCollection, type CollectionEntry } from 'astro:content';
import { buildDate, isPublic, pickLatest, sortNewestFirst } from './visibility';

export type Release = CollectionEntry<'releases'>;

/** Only published, owner-approved, already-released entries. Everything else never reaches a page. */
export async function getPublicReleases(): Promise<Release[]> {
  const today = buildDate();
  const all = await getCollection('releases', ({ data }) => isPublic(data, today));
  return sortNewestFirst(all);
}

export async function getLatestRelease(): Promise<Release | undefined> {
  return pickLatest(await getCollection('releases'), buildDate());
}

export type PlatformId = 'spotify' | 'appleMusic' | 'youtube' | 'youtubeMusic';

export const PLATFORM_LABEL: Record<PlatformId, string> = {
  spotify: 'Spotify',
  appleMusic: 'Apple Music',
  youtube: 'YouTube',
  youtubeMusic: 'YouTube Music',
};

/** Verified links only, in a stable display order. */
export function verifiedLinks(r: Release): { id: PlatformId; label: string; url: string }[] {
  const order: PlatformId[] = ['spotify', 'appleMusic', 'youtube', 'youtubeMusic'];
  return order.flatMap((id) => {
    const l = r.data.links[id];
    return l && l.verified ? [{ id, label: PLATFORM_LABEL[id], url: l.url }] : [];
  });
}

export function formatDate(iso: string, locale: 'en' | 'es'): string {
  const [y, m, d] = iso.split('-').map(Number) as [number, number, number];
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(y, m - 1, d)));
}
