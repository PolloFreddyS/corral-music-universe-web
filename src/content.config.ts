import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { releaseSchema } from './lib/release-schema';

export { releaseSchema, RELEASE_STATUSES, RELEASE_TYPES } from './lib/release-schema';

const releases = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/releases' }),
  schema: releaseSchema,
});

export const collections = { releases };
