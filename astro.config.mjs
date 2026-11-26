// @ts-check
import { defineConfig } from 'astro/config';

/**
 * Deployment targets are configured with environment variables so the same
 * source works for a GitHub Pages project site, a custom domain, and local dev.
 *
 *   SITE_URL   absolute origin, e.g. https://<owner>.github.io or https://www.example.com
 *   BASE_PATH  sub-path, e.g. /corral-music-universe-web  (use "/" for a custom domain)
 */
const site = process.env.SITE_URL ?? 'https://example.invalid';
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  output: 'static',
  build: { format: 'directory', inlineStylesheets: 'never' },
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
  image: { responsiveStyles: false },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  devToolbar: { enabled: false },
  markdown: { syntaxHighlight: false },
  security: {
    // Emitted as <meta http-equiv="Content-Security-Policy"> with SHA-256 hashes of
    // every script/style Astro renders, so no 'unsafe-inline' is needed.
    csp: {
      algorithm: 'SHA-256',
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        'frame-src https://open.spotify.com',
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'none'",
        'upgrade-insecure-requests',
      ],
    },
  },
});
