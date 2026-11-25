import data from '~/data/platforms.json';

export interface Platform {
  id: string;
  label: string;
  url: string;
}

/** Artist-level profiles that have been verified. Unverified entries are never rendered. */
export const verifiedPlatforms: Platform[] = data.platforms.flatMap((p) =>
  p.verified && typeof p.url === 'string' && p.url.startsWith('https://')
    ? [{ id: p.id, label: p.label, url: p.url }]
    : [],
);
