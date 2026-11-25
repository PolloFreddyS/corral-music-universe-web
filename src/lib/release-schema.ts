import { z } from 'astro/zod';

const localized = z.object({ en: z.string().min(1), es: z.string().min(1) });

/** A link is only rendered when `verified` is true. */
const link = z.object({
  url: z.url({ protocol: /^https$/ }),
  verified: z.boolean(),
  verifiedOn: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

export const RELEASE_STATUSES = ['draft', 'scheduled', 'published', 'archived'] as const;
export const RELEASE_TYPES = ['album', 'ep', 'single'] as const;

export const releaseSchema = z.object({
  title: z.string().min(1),
  type: z.enum(RELEASE_TYPES),
  /** Official release date (YYYY-MM-DD). A date alone never makes a release public. */
  releaseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(RELEASE_STATUSES),
  /** Owner approval for showing this release on the public site. */
  approved: z.boolean(),
  featured: z.boolean().default(false),
  language: z.enum(['en', 'es', 'instrumental', 'mixed']),
  /** Filename inside src/assets/releases/. Omit to show a labelled development placeholder. */
  artwork: z.string().optional(),
  /** true once the full-resolution master replaces the 640px streaming-service copy. */
  artworkMaster: z.boolean().default(false),
  description: localized.optional(),
  story: localized.optional(),
  /** draft = written by the web team, not yet approved by the owner. */
  editorialStatus: z.enum(['draft', 'approved']).default('draft'),
  tracklist: z
    .array(
      z.object({
        title: z.string().min(1),
        duration: z
          .string()
          .regex(/^\d{1,2}:\d{2}$/)
          .optional(),
        /** Title of the source poem, exactly as printed in the book. */
        literarySource: z.string().optional(),
      }),
    )
    .min(1),
  literarySourceBook: z.literal('la-formula-del-verso').optional(),
  credits: z.array(z.object({ role: localized, name: z.string().min(1) })).default([]),
  copyright: z.string().optional(),
  links: z
    .object({
      spotify: link.optional(),
      appleMusic: link.optional(),
      youtube: link.optional(),
      youtubeMusic: link.optional(),
    })
    .default({}),
  /** Spotify album id used for the click-to-load embed. */
  spotifyEmbedId: z
    .string()
    .regex(/^[A-Za-z0-9]{22}$/)
    .optional(),
});
