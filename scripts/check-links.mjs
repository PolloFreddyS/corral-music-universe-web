#!/usr/bin/env node
/**
 * Post-build checks on dist/:
 *  1. every internal href/src resolves to a built file
 *  2. every page has both hreflang alternates and lang="en"|"es"
 *  3. no external link opens a new tab without rel="noopener"
 *  4. nothing private leaked (local paths, .env, PDFs, unreleased titles listed in scripts/blocklist.txt)
 * Run after `astro build`. BASE_PATH must match the build.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const base = (process.env.BASE_PATH ?? '/').replace(/\/+$/, '');
const errors = [];

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const files = walk(dist);
const html = files.filter((f) => f.endsWith('.html'));

function resolveInternal(url) {
  let path = url.split('#')[0].split('?')[0];
  if (!path) return true;
  if (base && path.startsWith(base)) path = path.slice(base.length) || '/';
  else if (base) return false; // internal URL missing the base path
  const target = join(dist, decodeURIComponent(path));
  if (path.endsWith('/')) return existsSync(join(target, 'index.html'));
  return existsSync(target) || existsSync(join(target, 'index.html'));
}

const blocklistFile = new URL('./blocklist.txt', import.meta.url);
const blocklist = existsSync(blocklistFile)
  ? readFileSync(blocklistFile, 'utf8')
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#'))
  : [];

for (const file of html) {
  const rel = relative(dist, file);
  const src = readFileSync(file, 'utf8');

  for (const m of src.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (/^(https?:|mailto:|data:|#)/.test(url)) continue;
    if (!url.startsWith('/')) {
      errors.push(`${rel}: relative URL "${url}" (use base-aware absolute paths)`);
      continue;
    }
    if (!resolveInternal(url)) errors.push(`${rel}: broken internal link ${url}`);
  }
  for (const m of src.matchAll(/srcset="([^"]+)"/g)) {
    for (const part of m[1].split(',')) {
      const url = part.trim().split(/\s+/)[0];
      if (url.startsWith('/') && !resolveInternal(url)) errors.push(`${rel}: broken srcset ${url}`);
    }
  }
  for (const m of src.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    if (!/rel="[^"]*noopener/.test(m[0])) errors.push(`${rel}: target=_blank without rel=noopener`);
  }

  const isLocalized = /^(en|es)[\\/]/.test(rel);
  if (isLocalized) {
    if (!/<html lang="(en|es)"/.test(src)) errors.push(`${rel}: missing html lang`);
    for (const l of ['en', 'es', 'x-default'])
      if (!src.includes(`hreflang="${l}"`)) errors.push(`${rel}: missing hreflang=${l}`);
    if (!/<meta name="description" content="[^"]{20,}"/.test(src)) errors.push(`${rel}: missing meta description`);
  }

  // CSP guards: every page carries the hash-based policy, without 'unsafe-inline',
  // and has no inline style attributes (the policy would block them).
  if (!/<meta http-equiv="content-security-policy"/i.test(src)) errors.push(`${rel}: missing Content-Security-Policy`);
  if (/content-security-policy"[^>]*unsafe-inline/i.test(src)) errors.push(`${rel}: CSP allows 'unsafe-inline'`);
  if (/<[a-z][^>]*\sstyle="/i.test(src)) errors.push(`${rel}: inline style attribute (blocked by CSP)`);

  if (/[A-Za-z]:\\\\Users|\/Users\/|OneDrive|localhost:\d|127\.0\.0\.1/.test(src))
    errors.push(`${rel}: contains a local path or local address`);
  for (const term of blocklist)
    if (src.toLowerCase().includes(term.toLowerCase())) errors.push(`${rel}: contains blocked term "${term}"`);
}

// The only PDF allowed is the book the owner authorised for free distribution.
const allowedFiles = new Set(['book/la-formula-del-verso.pdf']);
for (const f of files) {
  if (allowedFiles.has(relative(dist, f).split(sep).join('/'))) continue;
  if (/\.(pdf|docx|wav|mp3|env)$/i.test(f)) errors.push(`dist contains a private-type file: ${relative(dist, f)}`);
}

// Both languages must produce the same set of pages.
const pagesFor = (l) =>
  new Set(html.filter((f) => relative(dist, f).startsWith(l)).map((f) => relative(join(dist, l), f)));
const en = pagesFor('en');
const es = pagesFor('es');
for (const p of en) if (!es.has(p)) errors.push(`es is missing page ${p}`);
for (const p of es) if (!en.has(p)) errors.push(`en is missing page ${p}`);

if (errors.length) {
  console.error(`✗ ${errors.length} problem(s):\n` + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(`✓ ${html.length} HTML files checked: internal links, hreflang, rel=noopener, privacy scan, EN/ES parity.`);
