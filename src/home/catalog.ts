import { releases, type Release } from "../data";

/** "004" for NOCTERA-004: the number part of a release's permanent catalogue number. */
export function catalogIndex(release: Release): string {
  return release.catalogNumber.slice(release.catalogNumber.lastIndexOf("-") + 1);
}

/** Number of releases, padded like a catalogue number ("004"), for the release index block. */
export const releaseCount = () => String(releases.length).padStart(3, "0");

/** "2026", or "2024–2026" once releases span several years. */
export function yearSpan(): string {
  const years = releases.map((r) => Number(r.year)).filter(Boolean);
  const [first, last] = [Math.min(...years), Math.max(...years)];
  return first === last ? String(last) : `${first}–${last}`;
}
