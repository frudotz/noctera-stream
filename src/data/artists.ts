import type { Artist } from "./types";

/**
 * Artists, in the order they appear on the homepage. Each one gets a page at /artists/<slug>/.
 * Leave anything unconfirmed empty ("" or null) — empty fields are simply not shown.
 */
export const artists: Artist[] = [
  {
    slug: "boem",
    name: "BOEM",
    role: "",
    bio: "",
    image: null,
    links: {
      instagram: "https://www.instagram.com/boem1n",
      spotify: null,
      appleMusic: null,
      youtube: null,
      soundcloud: null,
      tiktok: null,
      x: null,
    },
  },
  {
    slug: "rath",
    name: "RATH",
    role: "",
    bio: "",
    image: null,
    links: {
      instagram: "https://www.instagram.com/yslhc0/",
      spotify: null,
      appleMusic: null,
      youtube: null,
      soundcloud: null,
      tiktok: null,
      x: null,
    },
  },
];
