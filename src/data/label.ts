import type { SocialLink } from "./types";

export const SITE_URL = "https://noctera.stream";

/** Shown in search results and link previews for the homepage. */
export const LABEL_DESCRIPTION =
  "NOCTERA — independent music label and collective. Discover releases, artists and music from NOCTERA.";

/**
 * Google Search Console "HTML tag" verification code (the content="…" value only).
 * Leave empty unless you verify that way; DNS verification needs nothing here.
 */
export const GOOGLE_SITE_VERIFICATION = "";

/** NOCTERA's own accounts, shown under "Follow". Accounts set to null are hidden. */
export const labelLinks: SocialLink[] = [
  { label: "Instagram", url: "https://www.instagram.com/noctera.stream" },
  { label: "TikTok", url: null },
  { label: "YouTube", url: null },
  { label: "X", url: "https://x.com/nocterastream" },
  { label: "SoundCloud", url: null },
];
