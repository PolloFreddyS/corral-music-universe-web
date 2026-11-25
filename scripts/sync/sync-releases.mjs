#!/usr/bin/env node
/**
 * Release sync: finds new Corral Music Universe releases on Spotify and missing
 * Apple Music links, and writes them into the catalog (JSON + cover).
 *
 * It never deploys. In GitHub Actions the changes go into a pull request that the
 * owner approves; merging is the approval.
 *
 *   node scripts/sync/sync-releases.mjs            # write changes
 *   node scripts/sync/sync-releases.mjs --dry-run  # report only
 *
 * Credentials (never committed): SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET
 * from the environment, or from a git-ignored .env.local file.
 * Without them, only the Apple Music step runs.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, appendFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  cleanAppleUrl,
  knownSpotifyIds,
  matchApple,
  pickImage,
  releaseFromSpotify,
  uniqueSlug,
} from './core.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const relDir = `${root}src/content/releases/`;
const artDir = `${root}src/assets/releases/`;
const platforms = JSON.parse(readFileSync(`${root}src/data/platforms.json`, 'utf8')).platforms;
const DRY = process.argv.includes('--dry-run');
const today = new Date().toISOString().slice(0, 10);

const spotifyArtistId = platforms.find((p) => p.id === 'spotify')?.url.match(/artist\/([A-Za-z0-9]+)/)?.[1];
const appleArtistId = platforms.find((p) => p.id === 'appleMusic')?.url.match(/\/(\d+)$/)?.[1];

// --- credentials: env first, then .env.local (git-ignored). Values are never printed.
function loadEnvLocal() {
  const f = `${root}.env.local`;
  if (!existsSync(f)) return;
  for (const line of readFileSync(f, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*"?([^"]*)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
loadEnvLocal();

const log = [];
const say = (s) => {
  console.log(s);
  log.push(s);
};

async function getJson(url, init) {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${new URL(url).pathname}`);
  return res.json();
}

async function spotifyToken() {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) return undefined;
  const body = new URLSearchParams({ grant_type: 'client_credentials' });
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });
  if (!res.ok) throw new Error(`Spotify auth failed: ${res.status} (check the client id/secret)`);
  return (await res.json()).access_token;
}

function loadReleases() {
  return readdirSync(relDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => ({ file: f, id: f.slice(0, -5), data: JSON.parse(readFileSync(relDir + f, 'utf8')) }));
}

async function download(url, path) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`cover download failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf[0] !== 0xff || buf[1] !== 0xd8) throw new Error('cover is not a JPEG');
  writeFileSync(path, buf);
}

// ---------------------------------------------------------------- Spotify
async function syncSpotify(releases) {
  const token = await spotifyToken();
  if (!token) {
    say('· Spotify: skipped (no SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET).');
    return 0;
  }
  const auth = { headers: { Authorization: `Bearer ${token}` } };
  const albums = [];
  let next = `https://api.spotify.com/v1/artists/${spotifyArtistId}/albums?include_groups=album,single&limit=10`;
  while (next) {
    const page = await getJson(next, auth);
    albums.push(...page.items);
    next = page.next;
  }
  const known = knownSpotifyIds(releases.map((r) => r.data));
  const fresh = albums.filter((a) => !known.has(a.id));
  say(`· Spotify: ${albums.length} releases on the artist page, ${fresh.length} new.`);
  const taken = new Set(releases.map((r) => r.id));
  let added = 0;
  for (const a of fresh) {
    const album = await getJson(`https://api.spotify.com/v1/albums/${a.id}`, auth);
    // Only releases where Corral Music Universe is a main artist.
    if (!album.artists?.some((x) => x.id === spotifyArtistId)) continue;
    const slug = uniqueSlug(album.name, taken);
    taken.add(slug);
    const cover = pickImage(album.images);
    const artworkFile = cover ? `${slug}.jpg` : undefined;
    const record = releaseFromSpotify(album, { today, artworkFile });
    say(`  + ${record.title} (${record.type}, ${record.releaseDate}, ${record.tracklist.length} track(s), language guess: ${record.language}) → ${slug}`);
    if (!DRY) {
      if (cover) await download(cover, artDir + artworkFile);
      writeFileSync(`${relDir}${slug}.json`, JSON.stringify(record, null, 2) + '\n');
    }
    added++;
  }
  return added;
}

// ---------------------------------------------------------------- Apple Music
async function syncApple(releases) {
  if (!appleArtistId) return 0;
  // Apple's public iTunes Lookup API: no key needed.
  const data = await getJson(`https://itunes.apple.com/lookup?id=${appleArtistId}&entity=album&limit=200&country=us`);
  const collections = data.results.filter((r) => r.wrapperType === 'collection');
  let updated = 0;
  for (const r of releases) {
    if (r.data.links?.appleMusic?.verified) continue;
    const c = matchApple(r.data, collections);
    if (!c) continue;
    const url = cleanAppleUrl(c.collectionViewUrl);
    say(`  + Apple Music link for ${r.data.title}`);
    if (!DRY) {
      r.data.links = { ...r.data.links, appleMusic: { url, verified: true, verifiedOn: today } };
      writeFileSync(relDir + r.file, JSON.stringify(r.data, null, 2) + '\n');
    }
    updated++;
  }
  say(`· Apple Music: ${collections.length} releases listed, ${updated} link(s) added.`);
  return updated;
}

const releases = loadReleases();
let changes = 0;
try {
  changes += await syncSpotify(releases);
} catch (e) {
  say(`✗ Spotify step failed: ${e.message}`);
  process.exitCode = 1;
}
try {
  changes += await syncApple(loadReleases());
} catch (e) {
  say(`✗ Apple step failed: ${e.message}`);
  process.exitCode = 1;
}
say(DRY ? `Dry run: ${changes} change(s) would be made.` : `${changes} change(s) written.`);

if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `changes=${changes}\n`);
writeFileSync(`${root}.sync-report.md`, log.map((l) => l.replace(/^\s*\+ /, '- ')).join('\n') + '\n');
