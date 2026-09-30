// Schema.org JSON-LD for each page type. Only facts already in src/data are used:
// no genres, dates beyond the release year, ISRCs, durations or logos are invented.
import {
  artistPath,
  artistsOf,
  LABEL_DESCRIPTION,
  labelLinks,
  linksOf,
  peopleOf,
  releasePath,
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
  return { ...node, description: LABEL_DESCRIPTION, ...(sameAs.length > 0 && { sameAs }) };
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

export function homeGraph(description: string, lang: string) {
  return [
    website(),
    organization(true),
    {
      "@type": "WebPage",
      "@id": `${HOME}#webpage`,
      url: HOME,
      name: "NOCTERA — Independent Music Label",
      description,
      inLanguage: lang,
      isPartOf: { "@id": SITE_ID },
      about: { "@id": ORG_ID },
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
  const streaming = streamingPlatforms.flatMap(({ key }) => (release.links[key] ? [release.links[key]!] : []));
  const releaseType = RELEASE_TYPES[release.type.toLowerCase()];

  return [
    website(),
    organization(),
    ...[...credited, ...producers].map(personRef),
    {
      "@type": "MusicAlbum",
      "@id": releaseId(release),
      name: release.title,
      url,
      datePublished: release.year,
      ...(releaseType && { albumReleaseType: releaseType }),
      byArtist: credited.map((a) => ({ "@id": personId(a) })),
      ...(producers.length > 0 && { producer: producers.map((a) => ({ "@id": personId(a) })) }),
      ...(image && { image: imageObject(image) }),
      ...(streaming.length > 0 && { sameAs: streaming }),
      albumRelease: {
        "@type": "MusicRelease",
        name: release.title,
        datePublished: release.year,
        recordLabel: { "@id": ORG_ID },
        ...(streaming.length > 0 && { musicReleaseFormat: "https://schema.org/DigitalFormat" }),
      },
    },
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
