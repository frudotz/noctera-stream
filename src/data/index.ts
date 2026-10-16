import { artists } from "./artists";
import { releases } from "./releases";
import { artistPlatforms } from "./platforms";
import type { Artist, Release, SocialLink } from "./types";

export { artists, releases };
export { GOOGLE_SITE_VERIFICATION, LABEL_DESCRIPTION, LABEL_LOGO, labelLinks, SITE_URL } from "./label";
export { streamingPlatforms } from "./platforms";
export type * from "./types";

export const releasePath = (release: Release) => `/releases/${release.slug}/`;
export const artistPath = (artist: Artist) => `/artists/${artist.slug}/`;

export function getArtist(slug: string): Artist {
  const artist = artists.find((a) => a.slug === slug);
  if (!artist) throw new Error(`Unknown artist slug "${slug}"`);
  return artist;
}

export function artistsOf(release: Release): Artist[] {
  return release.artists.map(getArtist);
}

export function creditOf(release: Release): string {
  return release.credit ?? artistsOf(release).map((a) => a.name).join(" & ");
}

/** Alt text for a release's cover, e.g. "BOEM & RATH — Bi Düş Ver cover artwork". */
export function coverAlt(release: Release): string {
  return `${creditOf(release)} — ${release.title} cover artwork`;
}

/** Everyone on a release: credited artists first, then contributors with their role. */
export function peopleOf(release: Release): { artist: Artist; role: string }[] {
  return [
    ...artistsOf(release).map((artist) => ({ artist, role: "" })),
    ...(release.contributors ?? []).map(({ artist, role }) => ({ artist: getArtist(artist), role })),
  ];
}

/** Releases an artist is credited on or contributed to. */
export function releasesBy(artist: Artist): Release[] {
  return releases.filter((r) => peopleOf(r).some((p) => p.artist.slug === artist.slug));
}

/** The artist's contributor role on a release ("" when they're a credited artist). */
export function roleOn(release: Release, artist: Artist): string {
  return release.contributors?.find((c) => c.artist === artist.slug)?.role ?? "";
}

export function getLatestRelease(): Release {
  return releases.find((r) => r.latest) ?? releases[0];
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-10-16" → "16 Oct 2026". Read from the string itself, never via Date, so no time zone can shift the day. */
export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

/** An artist's published links, in display order. Several accounts on one platform are told apart by handle. */
export function linksOf(artist: Artist): (SocialLink & { url: string })[] {
  return artistPlatforms.flatMap(({ key, label }) => {
    const value = artist.links[key];
    const urls = Array.isArray(value) ? value : value ? [value] : [];
    return urls.map((url) => ({
      label,
      url,
      handle: urls.length > 1 ? new URL(url).pathname.split("/").filter(Boolean)[0] : undefined,
    }));
  });
}

/** Fails the build early on data mistakes (duplicate slugs, unknown artists, broken bio files). */
export function validateData() {
  if (releases.length === 0) throw new Error("releases.ts must contain at least one release");
  if (releases.filter((r) => r.latest).length > 1) throw new Error("Only one release can be marked latest");

  const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  for (const [kind, items] of [["release", releases], ["artist", artists]] as const) {
    const seen = new Set<string>();
    for (const { slug: s } of items) {
      if (!slug.test(s)) throw new Error(`Invalid ${kind} slug "${s}" (use lowercase a-z, 0-9 and hyphens)`);
      if (seen.has(s)) throw new Error(`Duplicate ${kind} slug "${s}"`);
      seen.add(s);
    }
  }
  releases.forEach(peopleOf);

  for (const [i, release] of releases.entries()) {
    const { slug: s, releaseDate: date } = release;
    const [y, m, d] = date.split("-").map(Number);
    const real = new Date(Date.UTC(y, m - 1, d));
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || real.getUTCMonth() !== m - 1 || real.getUTCDate() !== d) {
      throw new Error(`Release "${s}" has an invalid releaseDate "${date}" (use YYYY-MM-DD)`);
    }
    if (date.slice(0, 4) !== release.year) throw new Error(`Release "${s}": year ${release.year} doesn't match releaseDate ${date}`);
    if (i > 0 && date > releases[i - 1].releaseDate) {
      throw new Error(`releases.ts must be newest first: "${s}" (${date}) is listed after "${releases[i - 1].slug}"`);
    }
  }
  const latest = releases.find((r) => r.latest);
  if (latest && latest.releaseDate !== releases[0].releaseDate) {
    throw new Error(`"${latest.slug}" is marked latest but "${releases[0].slug}" is newer`);
  }

  for (const artist of artists) {
    if (!artist.name) throw new Error(`Artist "${artist.slug}" has no name (check its bio file)`);
  }
}
