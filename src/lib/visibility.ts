/**
 * Pure release-visibility rules (no Astro imports, so they are unit-testable).
 *
 * A release is public only when ALL of these hold:
 *   - status === 'published'
 *   - approved === true (owner approval)
 *   - releaseDate is on or before the build date
 * A date in the past never promotes a draft/scheduled entry, and a published
 * entry with a future date stays hidden until a rebuild after that date.
 */
export interface VisibilityFields {
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  approved: boolean;
  releaseDate: string;
}

export function isPublic(r: VisibilityFields, today: string): boolean {
  return r.status === 'published' && r.approved === true && r.releaseDate <= today;
}

/** Newest first; ties broken by id for stable output. */
export function sortNewestFirst<T extends { id: string; data: { releaseDate: string } }>(items: T[]): T[] {
  return [...items].sort((a, b) =>
    a.data.releaseDate === b.data.releaseDate
      ? a.id.localeCompare(b.id)
      : b.data.releaseDate.localeCompare(a.data.releaseDate),
  );
}

/** Albums/EPs win a same-day tie over singles when choosing the latest release. */
const TYPE_WEIGHT = { album: 0, ep: 1, single: 2 } as const;

export function pickLatest<
  T extends { id: string; data: VisibilityFields & { type: keyof typeof TYPE_WEIGHT } },
>(items: T[], today: string): T | undefined {
  return [...items]
    .filter((r) => isPublic(r.data, today))
    .sort((a, b) => {
      if (a.data.releaseDate !== b.data.releaseDate) return b.data.releaseDate.localeCompare(a.data.releaseDate);
      return TYPE_WEIGHT[a.data.type] - TYPE_WEIGHT[b.data.type] || a.id.localeCompare(b.id);
    })[0];
}

/** Today's date (YYYY-MM-DD, UTC) — overridable with BUILD_DATE for reproducible builds/tests. */
export function buildDate(): string {
  const env = typeof process !== 'undefined' ? process.env['BUILD_DATE'] : undefined;
  if (env && /^\d{4}-\d{2}-\d{2}$/.test(env)) return env;
  return new Date().toISOString().slice(0, 10);
}
