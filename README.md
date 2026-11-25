# Corral Music Universe — official website

The official bilingual (EN/ES) static site for **Corral Music Universe**. It is built with Astro 7 and TypeScript, and is ready for GitHub Pages.

> **Status:** not deployed yet. Deployment is manual and gated (see *Deployment* below).

- No backend, database, tracking or paid services. It is plain static hosting.

## Quick start

```bash
npm ci
npm run dev          # http://127.0.0.1:4321  (loopback only)
npm run verify       # lint + type check + tests + build + link check
npm run build && npm run preview   # serve the production build locally
npm run screenshots  # with preview running: headless screenshots + axe a11y + overflow audit
npm run check:launch # lists what still blocks a public launch (expected to fail for now)
```

Node 22.23.4+ is required (see `.nvmrc`).

## Structure

```
src/
  content/releases/*.json   one file per release (validated by src/content.config.ts)
  data/platforms.json       artist profile links (only verified ones are shown)
  data/site-config.json     name, contact, domain, language storage key
  data/brand.json           logo provenance, tagline, colour + font tokens
  data/book.json            La Fórmula del Verso: description, cover, excerpts, PDF flags
  i18n/ui.ts                every interface string; Spanish is type-checked against English
  lib/visibility.ts         who is public (pure, unit-tested)
  lib/releases.ts           collection helpers, verified links, date format
  lib/paths.ts              base-path aware URLs + locale swapping
  components/               Header, Footer, Artwork (with labelled placeholder), cards, embeds
  layouts/BaseLayout.astro  SEO, hreflang, Open Graph, view transitions, reveal motion
  pages/index.astro         language gateway (saved choice → browser language → English)
  pages/[lang]/…            home, music, music/[slug], about, book, links
public/                     favicons, OG image, manifest (scaled copies of the official logo)
scripts/                    check-links, check-launch, screenshots
docs/                       creative direction, owner asset request, readiness, screenshots
```

## Adding or updating a release

1. Create `src/content/releases/<id>.json`. The `id` becomes the URL: `/en/music/<id>/`.
2. Fill in `title`, `type` (`album` / `ep` / `single`), `releaseDate` (`YYYY-MM-DD`), `language` and `tracklist`.
3. Set `status` and `approved`. A release is rendered **only** when all three conditions hold:
   - `status` is `"published"`
   - `approved` is `true`
   - `releaseDate` is on or before the build date

   `draft`, `scheduled`, `archived`, unapproved and future-dated entries never produce a page, card or link.
4. Add links with `"verified": true` only after opening them yourself. Unverified links are ignored.
5. Put the cover in `src/assets/releases/` and set `"artwork": "<file>"`. Without it, a labelled placeholder appears.
6. Optional: add `description` and `story` (`{ "en": …, "es": … }`), set `editorialStatus: "approved"`, then add `credits` and `literarySource` per track.
7. Run `npm run verify`.

The homepage hero always shows the newest public release. It is calculated from the data, never hard-coded.

## How new releases arrive (automatic)

`scripts/sync/sync-releases.mjs` asks **Spotify's Web API** (client-credentials) for every Corral Music Universe album and single. For each one that isn't in the catalog yet, it:

- writes `src/content/releases/<slug>.json` with title, type, date, tracks, durations and the Spotify link;
- downloads the 640 px cover into `src/assets/releases/`.

It also asks **Apple's public iTunes Lookup API** (no key needed) and adds Apple Music links as soon as a release appears there.

On GitHub, `sync-releases.yml` runs this every 6 hours. When something changed, it verifies the whole site and opens or updates one pull request, **"New release(s) detected"**. **Merging that PR is the approval**: after launch, the merge triggers the deploy automatically. Nothing is published without that merge.

A release dated in the future is hidden until its date. The daily rebuild makes it appear on release day.

**One-time setup on GitHub:**

1. In **Settings → Secrets and variables → Actions → Secrets**, add `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` from your Spotify developer app.
2. In **Settings → Actions → General → Workflow permissions**, tick **"Allow GitHub Actions to create and approve pull requests"**.

**Running it locally:**

1. Create `.env.local` in the repo root. It is git-ignored and must never be committed:
   ```
   SPOTIFY_CLIENT_ID=...
   SPOTIFY_CLIENT_SECRET=...
   ```
2. Run `node scripts/sync/sync-releases.mjs --dry-run` to see what it would add.
3. Drop `--dry-run` to actually write the files.

**What still needs a human:** descriptions and stories, credits, a check of the language guess, and full-resolution artwork if you want it. The PR checklist reminds you.

## Languages

- The routes are `/en/…` and `/es/…`.
- On a first visit, `/` picks Spanish for Spanish browsers and English otherwise. A manual EN/ES choice is saved in `localStorage` (`cmu-lang`) and wins afterwards.
- Every page outputs `hreflang` for en, es and x-default, plus a localised title, description and `og:locale`.
- Song titles, poem titles, lyrics and the book are **never translated**.
- A missing Spanish string fails `npm run check`.

## Deployment (when approved)

This repository is ready for GitHub Pages; nothing is deployed yet.

1. Push to a GitHub repository. `ci.yml` builds and checks every push and PR, and never deploys.
2. In **Settings → Pages**, choose **Source: GitHub Actions**.
3. After the owner approves, set the repository variable `PAGES_DEPLOY_APPROVED=true`.
4. Run **Deploy to GitHub Pages** manually and type `PUBLISH CMU`. The launch-readiness gate must pass before it builds.

| Target | `SITE_URL` | `BASE_PATH` |
|---|---|---|
| Project page (default) | `https://<user>.github.io` | `/<repo>` |
| Custom domain | `https://www.your-domain` | `/` (add `public/CNAME`) |

Set these as repository variables. Locally, use env vars (see `.env.example`). Nothing secret is needed.

## Privacy & safety rules baked in

- External links use `rel="noopener noreferrer"`, and the post-build scan also blocks local paths and addresses, private file types, and blocklisted terms.
- Keep private terms (for example unreleased titles) in `scripts/blocklist.local.txt`. It is git-ignored, and the link check fails if any of them appear in the build.
- The Spotify player is click-to-load: nothing is fetched from Spotify until the visitor asks.
- No analytics and no third-party fonts (fonts are self-hosted).
- `*.pdf`, `*.docx`, audio files and `.env*` files are git-ignored.
- A strict Content-Security-Policy (hash-based scripts and styles, no third-party origins except the on-click Spotify player) is generated at build time.

## Security

See [SECURITY.md](SECURITY.md). Report vulnerabilities privately through GitHub's **Report a vulnerability** button, not in public issues.
