#!/usr/bin/env node
/**
 * Launch-readiness gate. Lists everything that still blocks a PUBLIC launch.
 * It is expected to FAIL until the owner supplies assets and approvals.
 * It is not part of CI's build check; the deploy workflow runs it as a gate.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root), 'utf8'));
const blockers = [];
const notes = [];

const relDir = new URL('src/content/releases/', root);
for (const f of readdirSync(relDir).filter((x) => x.endsWith('.json'))) {
  const r = JSON.parse(readFileSync(new URL(f, relDir), 'utf8'));
  if (r.status !== 'published' || !r.approved) continue;
  if (!r.artwork) blockers.push(`${f}: official artwork missing (placeholder is shown)`);
  else if (!existsSync(new URL(`src/assets/releases/${r.artwork}`, root)))
    blockers.push(`${f}: artwork file ${r.artwork} not found`);
  else if (!r.artworkMaster) notes.push(`${f}: artwork is the 640px Spotify copy — a full-resolution master would be sharper`);
  if ((r.description || r.story) && r.editorialStatus !== 'approved')
    blockers.push(`${f}: editorial copy is still a draft — owner approval needed`);
  for (const [k, l] of Object.entries(r.links ?? {})) if (!l.verified) notes.push(`${f}: ${k} link not verified (hidden)`);
  if (!r.credits?.length) notes.push(`${f}: no credits listed (page says credits will follow)`);
}

const book = read('src/data/book.json');
if (book.editorialStatus !== 'approved') blockers.push('book.json: book description is a draft — owner approval needed');
const bookDir = new URL('src/assets/book/', root);
const bookImgs = existsSync(bookDir) ? readdirSync(bookDir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)) : [];
if (!book.cover && bookImgs.length === 0)
  blockers.push('book cover missing — drop the front cover into src/assets/book/ (placeholder is shown)');
if (book.pdf.public) {
  if (!book.pdf.file) blockers.push('book.json: pdf.public is true but no file is set');
  notes.push('book.json: PDF marked public — confirm owner authorisation and distribution rights');
}

const site = read('src/data/site-config.json');
if (!site.customDomain) notes.push('site-config.json: no custom domain — site will live at <owner>.github.io/<repo>/');
if (!site.contactEmail) notes.push('site-config.json: no public contact email (Contact section says it will follow)');

const plats = read('src/data/platforms.json').platforms;
for (const p of plats) if (!p.verified) notes.push(`platforms.json: ${p.label} not verified (hidden)`);

const aboutDraft = false; // owner approved the About copy on 2026-11-25
if (aboutDraft) blockers.push('About page copy (src/i18n/ui.ts about.*) awaits owner approval');

console.log('Launch readiness\n================');
if (notes.length) console.log('\nNotes (not blocking):\n' + notes.map((n) => `  · ${n}`).join('\n'));
if (blockers.length) {
  console.log('\nBLOCKERS:\n' + blockers.map((b) => `  ✗ ${b}`).join('\n'));
  process.exit(1);
}
console.log('\n✓ No blockers. Owner approval is still required before deploying.');
