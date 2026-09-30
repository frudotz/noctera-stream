import type { Release } from "./types";

/**
 * All releases, newest first. Each one gets a page at /releases/<slug>/.
 * Mark the one to feature on the homepage with `latest: true`.
 * Links set to null are listed as "Soon".
 */
export const releases: Release[] = [
  {
    slug: "bi-dus-ver",
    title: "Bi Düş Ver",
    titleLang: "tr",
    artists: ["boem", "rath"],
    credit: "BOEM & RATH",
    contributors: [{ artist: "siara", role: "Main Producer / Executive Producer" }],
    type: "Single",
    year: "2026",
    latest: true,
    cover: {
      src: "/assets/bi-dus-ver-cover.png",
      width: 2508,
      variants: [
        { src: "/assets/bi-dus-ver-cover-640.webp", width: 640 },
        { src: "/assets/bi-dus-ver-cover-1200.webp", width: 1200 },
      ],
      share: { src: "/assets/bi-dus-ver-cover-1200.jpg", width: 1200 },
    },
    links: {
      spotify: "https://open.spotify.com/intl-tr/track/4xlOfyEVBzBrDSyTVtjb3W",
      appleMusic: "https://music.apple.com/tr/song/bi-d%C3%BC%C5%9F-ver-feat-rath/6817214093",
      youtubeMusic: "https://music.youtube.com/watch?v=o3SHFFHw1LM",
      youtube: "https://www.youtube.com/watch?v=o3SHFFHw1LM",
      soundcloud: null,
      deezer: "https://www.deezer.com/tr/track/4316324352",
      amazonMusic: "https://music.amazon.com/tracks/B0HLCLVSJR",
    },
  },
];
