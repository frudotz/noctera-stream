import type { ReactElement } from "react";
import {
  artistPath,
  artists,
  artistsOf,
  coverAlt,
  creditOf,
  getLatestRelease,
  LABEL_DESCRIPTION,
  releasePath,
  releases,
  releasesBy,
  type Artist,
  type Picture,
  type Release,
} from "./data";
import { absolute, type MetaImage, type PageMeta } from "./head";
import { artistGraph, homeGraph, releaseGraph } from "./structured-data";
import { HomePage } from "./pages/HomePage";
import { ReleasePage } from "./pages/ReleasePage";
import { ArtistPage } from "./pages/ArtistPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PreviewPage } from "./preview/noctera-theme/PreviewPage";
import { BentoPage } from "./preview/noctera-bento/BentoPage";

export type Page = {
  /** "/" or "/section/slug/"; written to <path>/index.html. The 404 page uses "/404.html". */
  path: string;
  meta: PageMeta;
  element: ReactElement;
  /** Client scripts the page needs; everything else ships as plain HTML. */
  scripts: ("copy-link" | "preview-theme" | "preview-bento")[];
};

/** Preview image for a picture (its 1200 px share copy when there is one). */
function metaImage(picture: Picture, alt: string): MetaImage {
  const file = picture.share ?? picture;
  return { src: file.src, width: file.width, height: file.height ?? file.width, alt };
}

function releaseMeta(release: Release): PageMeta {
  const credit = creditOf(release);
  const title = `${credit} — ${release.title} | NOCTERA`;
  const lang = "en";
  const images = release.cover ? [metaImage(release.cover, coverAlt(release))] : [];

  return {
    title,
    description: release.latest
      ? `${credit} — ${release.title}. Listen to the latest NOCTERA release across streaming platforms.`
      : `${credit} — ${release.title}. Listen to this NOCTERA release across streaming platforms.`,
    path: releasePath(release),
    lang,
    type: release.type.toLowerCase() === "single" ? "music.song" : "music.album",
    images,
    og: artistsOf(release).map((artist) => ["music:musician", absolute(artistPath(artist))]),
    jsonLd: releaseGraph(release, title, lang, images[0]),
  };
}

function artistMeta(artist: Artist): PageMeta {
  const title = `${artist.name} | NOCTERA`;
  // Artist pages are mostly the (Turkish) biography.
  const lang = artist.bioLang === "tr" ? "tr" : "en";
  const works = releasesBy(artist);
  const cover = works.find((r) => r.cover);
  const images = artist.image
    ? [metaImage(artist.image, artist.image.alt)]
    : cover?.cover
      ? [metaImage(cover.cover, coverAlt(cover))]
      : [];

  return {
    title,
    description: artist.summary || `${artist.name} on NOCTERA.`,
    path: artistPath(artist),
    lang,
    type: "profile",
    images,
    jsonLd: artistGraph(artist, title, lang, images[0]),
  };
}

export function getPages(): Page[] {
  const latest = getLatestRelease();

  return [
    {
      path: "/",
      meta: {
        title: "NOCTERA — Independent Music Label",
        description: LABEL_DESCRIPTION,
        path: "/",
        lang: "en",
        type: "website",
        // A dedicated 1200×630 public/og-image.jpg wins when it exists; until then, the latest cover.
        images: [
          { src: "/og-image.jpg", width: 1200, height: 630, alt: "NOCTERA" },
          ...(latest.cover ? [metaImage(latest.cover, coverAlt(latest))] : []),
        ],
        jsonLd: homeGraph(LABEL_DESCRIPTION, "en"),
      },
      element: <HomePage />,
      scripts: [],
    },
    ...releases.map((release) => ({
      path: releasePath(release),
      meta: releaseMeta(release),
      element: <ReleasePage release={release} />,
      scripts: ["copy-link" as const],
    })),
    ...artists.map((artist) => ({
      path: artistPath(artist),
      meta: artistMeta(artist),
      element: <ArtistPage artist={artist} />,
      scripts: [],
    })),
    {
      path: "/404.html",
      meta: {
        title: "Not found — NOCTERA",
        description: "This page does not exist.",
        path: "/404.html",
        lang: "en",
        type: "website",
        images: [],
        noindex: true,
      },
      element: <NotFoundPage />,
      scripts: [],
    },
    // DESIGN PREVIEW of a proposed theme (src/preview/noctera-theme/). Not linked from
    // the site, noindex, no canonical and left out of the sitemap; delete this entry
    // and the folder to remove it.
    {
      path: "/preview/noctera-theme/",
      meta: {
        title: "Theme preview — NOCTERA",
        description: "Design preview of a proposed NOCTERA theme. Not the live site.",
        path: "/preview/noctera-theme/",
        lang: "en",
        type: "website",
        images: [],
        noindex: true,
      },
      element: <PreviewPage />,
      scripts: ["preview-theme"],
    },
    // DESIGN PREVIEW of a second concept, "bento × neo-brutalist" (src/preview/noctera-bento/).
    // Same rules: not linked, noindex, no canonical, not in the sitemap. Ships CSS only.
    {
      path: "/preview/noctera-bento/",
      meta: {
        title: "Bento preview — NOCTERA",
        description: "Design preview of a bento-grid NOCTERA homepage concept. Not the live site.",
        path: "/preview/noctera-bento/",
        lang: "en",
        type: "website",
        images: [],
        noindex: true,
      },
      element: <BentoPage />,
      scripts: ["preview-bento"],
    },
  ];
}

/** Dev server only: picks the page for the current URL. */
export function findPage(pathname: string): Page {
  const normalized = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const pages = getPages();
  return pages.find((p) => p.path === normalized) ?? pages.find((p) => p.path === "/404.html")!;
}
