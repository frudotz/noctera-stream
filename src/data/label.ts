import type { SocialLink } from "./types";

export const SITE_URL = "https://noctera.stream";

/** Who NOCTERA is, in one sentence: the Organization description, and the start of the homepage description. */
export const LABEL_DESCRIPTION = "NOCTERA is an independent music label and collective.";

/** NOCTERA's mark (the favicon's N) as a 512 px PNG, used as the Organization logo in structured data. */
export const LABEL_LOGO = { src: "/assets/noctera-logo-512.png", width: 512, height: 512 };

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
