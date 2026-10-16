import type { Release } from "./types";

/**
 * All releases, newest first by `releaseDate`. Each one gets a page at /releases/<slug>/.
 * Releases that share a date keep the order they have here (the one listed first is the
 * newer one); the build fails if the dates are out of order.
 * `catalogNumber` is permanent: it never changes when releases are added or reordered.
 * Mark the first one with `latest: true` to feature it on the homepage.
 * `featured` lists credited guests (e.g. RATH on BOEM's singles): the release shows under
 * "Featured on" on their profile, and under "Releases" for the other credited artists.
 * Links set to null are listed as "Soon".
 */
export const releases: Release[] = [
  {
    slug: "sevgi-ve-inanc",
    catalogNumber: "NOCTERA-004",
    title: "Sevgi ve İnanç",
    titleLang: "tr",
    artists: ["boem", "rath"],
    credit: "BOEM & RATH",
    featured: ["rath"],
    contributors: [{ artist: "siara", role: "Main Producer / Executive Producer" }],
    type: "Single",
    year: "2026",
    releaseDate: "2026-10-16",
    latest: true,
    cover: {
      src: "/assets/sevgi-ve-inanc-cover.png",
      width: 2000,
      variants: [
        { src: "/assets/sevgi-ve-inanc-cover-640.webp", width: 640 },
        { src: "/assets/sevgi-ve-inanc-cover-1200.webp", width: 1200 },
      ],
      share: { src: "/assets/sevgi-ve-inanc-cover-1200.jpg", width: 1200 },
    },
    links: {
      spotify: "https://open.spotify.com/intl-tr/track/6q7tXn7nJYXpnov6foiNEw",
      appleMusic: null,
      youtubeMusic: "https://music.youtube.com/watch?v=uzg3eFMnwcQ",
      youtube: "https://www.youtube.com/watch?v=uzg3eFMnwcQ",
      soundcloud: null,
      deezer: null,
      amazonMusic: null,
    },
  },
  {
    slug: "kor-duygular",
    catalogNumber: "NOCTERA-003",
    title: "Kör Duygular",
    titleLang: "tr",
    artists: ["boem", "rath"],
    credit: "BOEM & RATH",
    featured: ["rath"],
    contributors: [{ artist: "siara", role: "Main Producer / Executive Producer" }],
    type: "Single",
    year: "2026",
    releaseDate: "2026-10-16",
    cover: {
      src: "/assets/kor-duygular-cover.png",
      width: 2040,
      variants: [
        { src: "/assets/kor-duygular-cover-640.webp", width: 640 },
        { src: "/assets/kor-duygular-cover-1200.webp", width: 1200 },
      ],
      share: { src: "/assets/kor-duygular-cover-1200.jpg", width: 1200 },
    },
    links: {
      spotify: "https://open.spotify.com/intl-tr/track/6curNqlKH2iF0tkDIcNY7e",
      appleMusic: "https://music.apple.com/tr/song/k%C3%B6r-duygular-feat-rath/6823731189",
      youtubeMusic: "https://music.youtube.com/watch?v=5yWB0_cgzt0",
      youtube: "https://www.youtube.com/watch?v=5yWB0_cgzt0",
      soundcloud: null,
      deezer: null,
      amazonMusic: null,
    },
  },
  {
    slug: "karanligi-ben-secmedim",
    catalogNumber: "NOCTERA-002",
    title: "Karanlığı Ben Seçmedim",
    titleLang: "tr",
    artists: ["rath"],
    contributors: [{ artist: "siara", role: "Main Producer / Executive Producer" }],
    type: "Single",
    year: "2026",
    releaseDate: "2026-10-13",
    // The supplied artwork is 1024 px, so its largest copies are 1024 px rather than upscaled to 1200.
    cover: {
      src: "/assets/karanligi-ben-secmedim-cover.png",
      width: 1024,
      variants: [
        { src: "/assets/karanligi-ben-secmedim-cover-640.webp", width: 640 },
        { src: "/assets/karanligi-ben-secmedim-cover-1024.webp", width: 1024 },
      ],
      share: { src: "/assets/karanligi-ben-secmedim-cover-1024.jpg", width: 1024 },
    },
    links: {
      spotify: "https://open.spotify.com/intl-tr/track/0oHFOJfJrEBwYv4Ixw83VS",
      appleMusic: "https://music.apple.com/tr/song/karanl%C4%B1%C4%9F%C4%B1-ben-se%C3%A7medim/6822255012",
      youtubeMusic: "https://music.youtube.com/watch?v=RRuWLO7sH9s",
      youtube: "https://www.youtube.com/watch?v=RRuWLO7sH9s",
      soundcloud: null,
      deezer: "https://link.deezer.com/s/34H4DbQmLvD2jbaBt6Wa6",
      amazonMusic: "https://music.amazon.com/tracks/B0HMW1L2WS",
    },
  },
  {
    slug: "bi-dus-ver",
    catalogNumber: "NOCTERA-001",
    title: "Bi' Düş Ver",
    titleLang: "tr",
    artists: ["boem", "rath"],
    credit: "BOEM & RATH",
    featured: ["rath"],
    contributors: [{ artist: "siara", role: "Main Producer / Executive Producer" }],
    type: "Single",
    year: "2026",
    releaseDate: "2026-09-29",
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
