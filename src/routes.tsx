import type { ReactElement } from "react";
import {
  artistPath,
  artists,
  creditOf,
  releasePath,
  releases,
  releasesBy,
  type Artist,
  type Release,
} from "./data";
import type { PageMeta } from "./head";
import { HomePage } from "./pages/HomePage";
import { ReleasePage } from "./pages/ReleasePage";
import { ArtistPage } from "./pages/ArtistPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export type Page = {
  /** "/" or "/section/slug/"; written to <path>/index.html. The 404 page uses "/404.html". */
  path: string;
  meta: PageMeta;
  element: ReactElement;
  /** Client scripts the page needs; everything else ships as plain HTML. */
  scripts: "copy-link"[];
};

function releaseMeta(release: Release): PageMeta {
  const credit = creditOf(release);
  const image = release.cover?.share ?? release.cover;

  return {
    title: `${credit} — ${release.title} | NOCTERA`,
    description: `${credit} — ${release.title}. A NOCTERA release.`,
    path: releasePath(release),
    type: release.type.toLowerCase() === "single" ? "music.song" : "music.album",
    image: image
      ? {
          src: image.src,
          width: image.width,
          height: image.width,
          alt: `Cover artwork for “${release.title}” by ${credit}`,
        }
      : undefined,
    card: "summary",
  };
}

function artistMeta(artist: Artist): PageMeta {
  const works = releasesBy(artist);
  // The artist's photo; without one, their most recent artwork.
  const photo = artist.image && { ...(artist.image.share ?? artist.image), alt: artist.image.alt };
  const cover = works.find((r) => r.cover)?.cover;
  const coverImage = cover && { ...(cover.share ?? cover), alt: `Cover artwork for “${works[0].title}” by ${creditOf(works[0])}` };
  const picked = photo ?? coverImage;
  const image = picked
    ? { src: picked.src, width: picked.width, height: picked.height ?? picked.width, alt: picked.alt }
    : undefined;

  // First sentence of the supplied biography, verbatim.
  const firstSentence = artist.bio[0]?.split(/(?<=[.!?])\s+/)[0];

  return {
    title: `${artist.name} — NOCTERA`,
    description:
      firstSentence ??
      (works.length > 0
        ? `${artist.name} on NOCTERA — ${works.map((r) => r.title).join(", ")}.`
        : `${artist.name} on NOCTERA.`),
    path: artistPath(artist),
    type: "profile",
    image,
    card: "summary",
  };
}

export function getPages(): Page[] {
  return [
    {
      path: "/",
      meta: {
        title: "NOCTERA — Independent Music Label",
        description: "NOCTERA — independent music, releases and artists.",
        path: "/",
        type: "website",
        image: { src: "/og-image.jpg", width: 1200, height: 630, alt: "NOCTERA" },
        card: "summary_large_image",
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
        type: "website",
        card: "summary",
        noindex: true,
      },
      element: <NotFoundPage />,
      scripts: [],
    },
  ];
}

/** Dev server only: picks the page for the current URL. */
export function findPage(pathname: string): Page {
  const normalized = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const pages = getPages();
  return pages.find((p) => p.path === normalized) ?? pages.find((p) => p.path === "/404.html")!;
}
