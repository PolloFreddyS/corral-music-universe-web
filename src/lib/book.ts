import type { ImageMetadata } from 'astro';
import book from '~/data/book.json';

/**
 * The approved book cover. Uses `book.json → cover` if set; otherwise the first image
 * dropped into src/assets/book/. Returns undefined (placeholder shown) when there is none.
 */
export async function getBookCover(): Promise<ImageMetadata | undefined> {
  const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/book/*.{jpg,jpeg,png,webp}');
  const keys = Object.keys(files).sort();
  const key = book.cover ? `/src/assets/book/${book.cover}` : keys[0];
  const loader = key ? files[key] : undefined;
  return loader ? (await loader()).default : undefined;
}
