/**
 * Pure logic for the release sync (no network, no file system) — unit-tested.
 */

/** "Cuando Éramos Inmortales" → "cuando-eramos-inmortales" */
export function slugify(title) {
  return title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function uniqueSlug(title, taken) {
  const base = slugify(title) || 'release';
  let slug = base;
  for (let i = 2; taken.has(slug); i++) slug = `${base}-${i}`;
  return slug;
}

/** 337000 → "5:37" */
export function msToDuration(ms) {
  const total = Math.round(ms / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

const ES_HINTS =
  /[ñáéíóúü¿¡]|\b(el|la|los|las|de|del|por|que|mi|tu|sin|con|una?|no|se|me|te|amor|piedra|cuando|quédate)\b/i;

/** Best-effort language guess from titles. The PR asks the owner to confirm it. */
export function guessLanguage(texts) {
  return texts.some((t) => ES_HINTS.test(t)) ? 'es' : 'en';
}

/** Spotify album_type → our release type. Spotify reports EPs as "single". */
export function mapType(albumType, trackCount) {
  if (albumType === 'album' || albumType === 'compilation') return 'album';
  return trackCount >= 4 ? 'ep' : 'single';
}

/** Spotify release_date may be "2026", "2026-11" or "2026-11-25". */
export function normalizeDate(date, precision) {
  if (precision === 'year' || /^\d{4}$/.test(date)) return `${date.slice(0, 4)}-01-01`;
  if (precision === 'month' || /^\d{4}-\d{2}$/.test(date)) return `${date.slice(0, 7)}-01`;
  return date.slice(0, 10);
}

/** Largest image ≤ 1000px wide (Spotify gives 640/300/64). */
export function pickImage(images) {
  return [...(images ?? [])].sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0]?.url;
}

/** Ids of Spotify albums already present in our catalog. */
export function knownSpotifyIds(releases) {
  const ids = new Set();
  for (const r of releases) {
    if (r.spotifyEmbedId) ids.add(r.spotifyEmbedId);
    const m = r.links?.spotify?.url?.match(/album\/([A-Za-z0-9]{22})/);
    if (m) ids.add(m[1]);
  }
  return ids;
}

/** Build a release record from a full Spotify album object. */
export function releaseFromSpotify(album, { today, artworkFile }) {
  const tracks = album.tracks?.items ?? [];
  const date = normalizeDate(album.release_date, album.release_date_precision);
  return {
    title: album.name,
    type: mapType(album.album_type, tracks.length),
    releaseDate: date,
    status: 'published',
    approved: true,
    language: guessLanguage([album.name, ...tracks.map((t) => t.name)]),
    ...(artworkFile ? { artwork: artworkFile } : {}),
    tracklist: tracks.map((t) => ({ title: t.name, duration: msToDuration(t.duration_ms) })),
    copyright: `℗ © ${date.slice(0, 4)} Corral Music Universe`,
    links: {
      spotify: { url: `https://open.spotify.com/album/${album.id}`, verified: true, verifiedOn: today },
    },
    spotifyEmbedId: album.id,
  };
}

const norm = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s*[-–]\s*(single|ep)$/i, '')
    .replace(/\(live\)/g, 'live')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

/**
 * Match an Apple Music collection to one of our releases by normalised title
 * (Apple appends " - Single"/" - EP"). Returns the collection or undefined.
 */
export function matchApple(release, collections) {
  const want = norm(release.title);
  return collections.find((c) => norm(c.collectionName ?? '') === want);
}

/** Apple collectionViewUrl without tracking params (?uo=4). */
export function cleanAppleUrl(url) {
  const u = new URL(url);
  u.search = '';
  return u.href;
}
