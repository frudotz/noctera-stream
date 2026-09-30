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

export type Release = {
  artist: string;
  title: string;
  /** BCP 47 language of the title, so screen readers pronounce it correctly. */
  titleLang?: string;
  type: string;
  year: string;
  /** Square artwork in /public, e.g. "/assets/cover.jpg". null shows the neutral placeholder. */
  cover: string | null;
  links: Record<PlatformKey, Url>;
};

export type SocialLink = {
  label: string;
  url: Url;
};

export const latestRelease: Release = {
  artist: "BOEM",
  title: "Bi Düş Ver",
  titleLang: "tr",
  type: "Single",
  year: "2026",
  cover: null, // e.g. "/assets/cover.jpg"
  links: {
    spotify: PLACEHOLDER,
    appleMusic: PLACEHOLDER,
    youtubeMusic: PLACEHOLDER,
    youtube: PLACEHOLDER,
    soundcloud: PLACEHOLDER,
    deezer: PLACEHOLDER,
    amazonMusic: PLACEHOLDER,
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

export const socialLinks: SocialLink[] = [
  { label: "Instagram", url: PLACEHOLDER },
  { label: "TikTok", url: PLACEHOLDER },
  { label: "YouTube", url: PLACEHOLDER },
  { label: "X", url: PLACEHOLDER },
  { label: "SoundCloud", url: PLACEHOLDER },
];
