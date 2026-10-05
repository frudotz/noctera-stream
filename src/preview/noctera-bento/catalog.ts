import { releases, type Release } from "../../data";

/**
 * Index number of a release, counted from the first one (releases.ts is newest
 * first). Derived from release order, not an official catalogue number — replace
 * with a real field if NOCTERA starts assigning them.
 */
export function indexOf(release: Release): string {
  return String(releases.length - releases.indexOf(release)).padStart(3, "0");
}

export const catalogNumber = (release: Release) => `NOCTERA-${indexOf(release)}`;

/** "2026", or "2024–2026" once releases span several years. */
export function yearSpan(): string {
  const years = releases.map((r) => Number(r.year)).filter(Boolean);
  const [first, last] = [Math.min(...years), Math.max(...years)];
  return first === last ? String(last) : `${first}–${last}`;
}
