// Schema.org JSON-LD for each page type. Only facts already in src/data are used:
// no genres, dates beyond the release year, ISRCs, durations or logos are invented.
import {
  artistPath,
  artists,
  artistsOf,
  LABEL_DESCRIPTION,
  LABEL_LOGO,
  labelLinks,
  linksOf,
  peopleOf,
  releasePath,
  releases,
  streamingPlatforms,
  type Artist,
  type Release,
} from "./data";
import { absolute, type MetaImage } from "./head";

const HOME = absolute("/");
const ORG_ID = `${HOME}#organization`;
const SITE_ID = `${HOME}#website`;

const personId = (artist: Artist) => `${absolute(artistPath(artist))}#person`;
const releaseId = (release: Release) => `${absolute(releasePath(release))}#release`;

const RELEASE_TYPES: Record<string, string> = {
  single: "https://schema.org/SingleRelease",
  ep: "https://schema.org/EPRelease",
  album: "https://schema.org/AlbumRelease",
};

function organization(full = false) {
  const node = { "@type": "Organization", "@id": ORG_ID, name: "NOCTERA", url: HOME };
  if (!full) return node;
  const sameAs = labelLinks.flatMap((link) => (link.url ? [link.url] : []));
  const logo = { "@type": "ImageObject", url: absolute(LABEL_LOGO.src), width: LABEL_LOGO.width, height: LABEL_LOGO.height };
  return { ...node, description: LABEL_DESCRIPTION, logo, ...(sameAs.length > 0 && { sameAs }) };
}

const website = () => ({
  "@type": "WebSite",
  "@id": SITE_ID,
  url: HOME,
  name: "NOCTERA",
  publisher: { "@id": ORG_ID },
});

const personRef = (artist: Artist) => ({
  "@type": "Person",
  "@id": personId(artist),
  name: artist.name,
  url: absolute(artistPath(artist)),
});

const imageObject = (image: MetaImage) => ({
  "@type": "ImageObject",
  url: absolute(image.src),
  width: image.width,
  height: image.height,
  caption: image.alt,
});

function breadcrumbs(pageUrl: string, trail: { name: string; url: string }[]) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: trail.map(({ name, url }, i) => ({ "@type": "ListItem", position: i + 1, name, item: url })),
  };
}

/**
 * One release as MusicAlbum. The release page passes everything it shows; the homepage
 * passes only what its rows and featured block show (cover and links for the latest).
 */
function musicAlbum(release: Release, { image, producers = [], links = false }: { image?: MetaImage; producers?: Artist[]; links?: boolean }) {
  const credited = artistsOf(release);
  const streaming = streamingPlatforms.flatMap(({ key }) => (release.links[key] ? [release.links[key]!] : []));
  const releaseType = RELEASE_TYPES[release.type.toLowerCase()];

  return {
    "@type": "MusicAlbum",
    "@id": releaseId(release),
    name: release.title,
    url: absolute(releasePath(release)),
    datePublished: release.year,
    ...(releaseType && { albumReleaseType: releaseType }),
    byArtist: credited.map((a) => ({ "@id": personId(a) })),
    ...(producers.length > 0 && { producer: producers.map((a) => ({ "@id": personId(a) })) }),
    ...(image && { image: imageObject(image) }),
    ...(links && streaming.length > 0 && { sameAs: streaming }),
    albumRelease: {
      "@type": "MusicRelease",
      name: release.title,
      datePublished: release.year,
      recordLabel: { "@id": ORG_ID },
      ...(streaming.length > 0 && { musicReleaseFormat: "https://schema.org/DigitalFormat" }),
    },
  };
}

/**
 * Homepage: the label, plus what the page visibly presents — the roster (linked to
 * each artist page) and the releases, the latest with its cover and streaming links.
 * Same @ids as the artist and release pages, so each entity is described once.
 */
export function homeGraph(title: string, description: string, lang: string, latestCover?: MetaImage) {
  const latest = releases.find((r) => r.latest) ?? releases[0];

  return [
    website(),
    organization(true),
    ...artists.map((artist) => ({ ...personRef(artist), affiliation: { "@id": ORG_ID } })),
    ...releases.map((release) =>
      musicAlbum(release, release === latest ? { image: latestCover, links: true } : {}),
    ),
    {
      "@type": "WebPage",
      "@id": `${HOME}#webpage`,
      url: HOME,
      name: title,
      description,
      inLanguage: lang,
      isPartOf: { "@id": SITE_ID },
      about: { "@id": ORG_ID },
      ...(latestCover && { primaryImageOfPage: imageObject(latestCover) }),
    },
  ];
}

export function artistGraph(artist: Artist, title: string, lang: string, image?: MetaImage) {
  const url = absolute(artistPath(artist));
  const sameAs = linksOf(artist).map((link) => link.url);

  return [
    website(),
    organization(),
    {
      ...personRef(artist),
      ...(artist.realName && { alternateName: artist.realName }),
      ...(artist.summary && { description: artist.summary }),
      ...(image && { image: imageObject(image) }),
      ...(sameAs.length > 0 && { sameAs }),
      affiliation: { "@id": ORG_ID },
    },
    {
      "@type": "ProfilePage",
      "@id": `${url}#webpage`,
      url,
      name: title,
      inLanguage: lang,
      isPartOf: { "@id": SITE_ID },
      mainEntity: { "@id": personId(artist) },
      breadcrumb: { "@id": `${url}#breadcrumb` },
      ...(image && { primaryImageOfPage: imageObject(image) }),
    },
    breadcrumbs(url, [
      { name: "NOCTERA", url: HOME },
      { name: artist.name, url },
    ]),
  ];
}

export function releaseGraph(release: Release, title: string, lang: string, image?: MetaImage) {
  const url = absolute(releasePath(release));
  const credited = artistsOf(release);
  // Credited artists are `byArtist`. Contributors are never presented as artists: Schema.org
  // only has `producer` (no "executive producer"), so only producer roles are expressed.
  const producers = peopleOf(release)
    .filter(({ role }) => /producer/i.test(role))
    .map(({ artist }) => artist);

  return [
    website(),
    organization(),
    ...[...credited, ...producers].map(personRef),
    musicAlbum(release, { image, producers, links: true }),
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: title,
      inLanguage: lang,
      isPartOf: { "@id": SITE_ID },
      mainEntity: { "@id": releaseId(release) },
      breadcrumb: { "@id": `${url}#breadcrumb` },
      ...(image && { primaryImageOfPage: imageObject(image) }),
    },
    breadcrumbs(url, [
      { name: "NOCTERA", url: HOME },
      { name: release.title, url },
    ]),
  ];
}
