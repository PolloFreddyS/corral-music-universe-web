#!/usr/bin/env node
/**
 * Headless QA of the built site using the locally installed Chrome/Edge (no visible windows,
 * no browser download): full-page desktop + mobile screenshots, an axe-core accessibility audit
 * and a horizontal-overflow check on every page and viewport.
 *
 * Usage: npm run build && npm run preview   (another terminal), then: npm run screenshots
 * Env: PREVIEW_URL (default http://127.0.0.1:4321), CHROME (browser path), SHOTS=0 to skip images
 */
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';
import puppeteer from 'puppeteer-core';

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const origin = process.env.PREVIEW_URL ?? 'http://127.0.0.1:4321';
const takeShots = process.env.SHOTS !== '0';
const chrome = [
  process.env.CHROME,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
]
  .filter(Boolean)
  .find((c) => existsSync(c));
if (!chrome) throw new Error('No Chrome/Edge/Chromium found. Set CHROME=/path/to/browser');

const out = resolve('docs/screenshots');
mkdirSync(out, { recursive: true });

const pages = [
  ['home', '/en/'],
  ['home', '/es/'],
  ['music', '/en/music/'],
  ['music', '/es/music/'],
  ['release', '/en/music/more-human-than-ever/'],
  ['release', '/es/music/los-gallos-sin-planes-vol-1/'],
  ['release-single', '/en/music/the-weight-of-everything/'],
  ['about', '/en/about/'],
  ['about', '/es/about/'],
  ['book', '/en/book/'],
  ['book', '/es/book/'],
  ['links', '/en/links/'],
  ['links', '/es/links/'],
  ['404', '/404.html'],
];
const viewports = {
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1 },
  mobile: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
};
const shotSet = new Set(['/en/', '/es/', '/en/music/', '/en/music/more-human-than-ever/', '/es/music/los-gallos-sin-planes-vol-1/', '/en/about/', '/es/book/', '/en/links/']);

const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--no-first-run'] });
let failures = 0;
try {
  for (const [vpName, vp] of Object.entries(viewports)) {
    const page = await browser.newPage();
    await page.setViewport(vp);
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    const consoleProblems = [];
    page.on('console', (m) => {
      if (m.type() === 'error' || /Content Security Policy/i.test(m.text())) consoleProblems.push(m.text());
    });
    page.on('pageerror', (e) => consoleProblems.push(String(e)));
    for (const [name, path] of pages) {
      consoleProblems.length = 0;
      const res = await page.goto(origin + path, { waitUntil: 'networkidle0' });
      const status = res?.status() ?? 0;
      if (status !== 200 && status !== 304 && path !== '/404.html') {
        console.error(`✗ ${vpName} ${path}: HTTP ${status}`);
        failures++;
      }
      // Scroll through the page so lazy images load, then wait for every image to finish.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
        await Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => (i.onload = i.onerror = r)))));
      });
      const broken = await page.evaluate(() => [...document.images].filter((i) => !i.naturalWidth).map((i) => i.currentSrc || i.src));
      if (broken.length) {
        console.error(`✗ ${vpName} ${path}: images failed to load: ${broken.join(', ')}`);
        failures++;
      }
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (overflow > 1) {
        console.error(`✗ ${vpName} ${path}: horizontal overflow ${overflow}px`);
        failures++;
      }
      await page.evaluate(axeSource);
      const axe = await page.evaluate(async () =>
        // @ts-expect-error injected global
        window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] }),
      );
      const serious = axe.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      for (const v of axe.violations)
        console[serious.includes(v) ? 'error' : 'log'](
          `${serious.includes(v) ? '✗' : '·'} ${vpName} ${path}: [${v.impact}] ${v.id} — ${v.help} (${v.nodes.length})`,
        );
      failures += serious.length;
      const real = consoleProblems.filter((t) => !(path === '/404.html' && /404/.test(t)));
      if (real.length) {
        console.error(`✗ ${vpName} ${path}: console/CSP errors: ${real.join(' | ')}`);
        failures += real.length;
      }
      if (takeShots && shotSet.has(path)) {
        const lang = path.split('/')[1];
        const file = `${out}/${vpName}-${name}-${lang}.png`;
        await page.screenshot({ path: file, fullPage: true });
      }
    }
    // Navigate by clicking, not only by loading URLs: styles must survive in-site navigation.
    await page.goto(origin + '/en/', { waitUntil: 'networkidle0' });
    for (const href of ['/en/music/', '/en/about/', '/en/book/']) {
      consoleProblems.length = 0;
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
        page.evaluate((h) => document.querySelector(`a[href="${h}"]`)?.click(), href),
      ]);
      const styled = await page.evaluate(() => getComputedStyle(document.querySelector('.site-header')).position === 'sticky');
      const real = consoleProblems.filter((t) => !/Transition was aborted/.test(t));
      if (!styled || real.length) {
        console.error(`✗ ${vpName} click-through ${href}: ${styled ? '' : 'styles missing '}${real.join(' | ')}`);
        failures++;
      }
    }
    await page.close();
    console.log(`✓ ${vpName}: ${pages.length} pages audited + click-through navigation`);
  }
} finally {
  await browser.close();
}
if (failures) {
  console.error(`\n${failures} serious problem(s).`);
  process.exit(1);
}
console.log('✓ No serious/critical axe violations, no horizontal overflow.');
