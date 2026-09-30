/**
 * Site content — the only file you need to edit for a new release.
 *
 * Any value set to PLACEHOLDER is not published yet:
 *   - streaming platforms without a URL are listed as "Soon"
 *   - social accounts without a URL are hidden
 */
const PLACEHOLDER = null;

export type Url = string | null;

export type PlatformKey =
  | "spotify"
  | "appleMusic"
  | "youtubeMusic"
  | "youtube"
  | "soundcloud"
  | "deezer"
  | "amazonMusic";

export type Cover = {
  /** Original artwork in /public. Square. */
  src: string;
  /** Pixel width (= height) of the original. */
  width: number;
  /** Optional smaller copies of the same image; the browser picks the best fit for the screen. */
  variants?: { src: string; width: number }[];
};

export type Release = {
  artist: string;
  title: string;
  /** BCP 47 language of the title, so screen readers pronounce it correctly. */
  titleLang?: string;
  type: string;
  year: string;
  /** null shows the neutral placeholder. */
  cover: Cover | null;
  links: Record<PlatformKey, Url>;
};

export type SocialLink = {
  label: string;
  url: Url;
  /** Where the link goes, when the label alone doesn't say (e.g. an artist's Instagram). */
  platform?: string;
};

export const latestRelease: Release = {
  artist: "BOEM & RATH",
  title: "Bi Düş Ver",
  titleLang: "tr",
  type: "Single",
  year: "2026",
  cover: {
    src: "/assets/bi-dus-ver-cover.png",
    width: 2508,
    variants: [
      { src: "/assets/bi-dus-ver-cover-640.webp", width: 640 },
      { src: "/assets/bi-dus-ver-cover-1200.webp", width: 1200 },
    ],
  },
  links: {
    spotify: "https://open.spotify.com/intl-tr/track/4xlOfyEVBzBrDSyTVtjb3W",
    appleMusic: "https://music.apple.com/tr/song/bi-d%C3%BC%C5%9F-ver-feat-rath/6817214093",
    youtubeMusic: "https://music.youtube.com/watch?v=o3SHFFHw1LM",
    youtube: "https://www.youtube.com/watch?v=o3SHFFHw1LM",
    soundcloud: PLACEHOLDER,
    deezer: "https://www.deezer.com/tr/track/4316324352",
    amazonMusic: "https://music.amazon.com/tracks/B0HLCLVSJR",
  },
};

/** Display order and names of the streaming platforms. */
export const platforms: { key: PlatformKey; label: string }[] = [
  { key: "spotify", label: "Spotify" },
  { key: "appleMusic", label: "Apple Music" },
  { key: "youtubeMusic", label: "YouTube Music" },
  { key: "youtube", label: "YouTube" },
  { key: "soundcloud", label: "SoundCloud" },
  { key: "deezer", label: "Deezer" },
  { key: "amazonMusic", label: "Amazon Music" },
];

/** NOCTERA's own accounts. */
export const socialLinks: SocialLink[] = [
  { label: "Instagram", url: "https://www.instagram.com/noctera.stream" },
  { label: "TikTok", url: PLACEHOLDER },
  { label: "YouTube", url: PLACEHOLDER },
  { label: "X", url: "https://x.com/nocterastream" },
  { label: "SoundCloud", url: PLACEHOLDER },
];

/** The artists on the latest release. */
export const artistLinks: SocialLink[] = [
  { label: "BOEM", platform: "Instagram", url: "https://www.instagram.com/boem1n" },
  { label: "RATH", platform: "Instagram", url: "https://www.instagram.com/yslhc0/" },
];
