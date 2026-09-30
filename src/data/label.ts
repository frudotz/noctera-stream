import type { SocialLink } from "./types";

export const SITE_URL = "https://noctera.stream";

/** NOCTERA's own accounts, shown under "Follow". Accounts set to null are hidden. */
export const labelLinks: SocialLink[] = [
  { label: "Instagram", url: "https://www.instagram.com/noctera.stream" },
  { label: "TikTok", url: null },
  { label: "YouTube", url: null },
  { label: "X", url: "https://x.com/nocterastream" },
  { label: "SoundCloud", url: null },
];
