import type { Artist, Picture } from "./types";
import { parseBio } from "./bio";
import boemBio from "./bios/boem.txt?raw";
import rathBio from "./bios/rath.txt?raw";
import siaraBio from "./bios/siara.txt?raw";

/**
 * A square photo in /public/assets/artists/ with -640.webp, -1200.webp and
 * -1200.jpg copies next to it (see README → Artwork).
 */
function photo(file: string, width: number, alt: string): Picture & { alt: string } {
  const base = `/assets/artists/${file.replace(/\.[^.]+$/, "")}`;
  return {
    src: `/assets/artists/${file}`,
    width,
    variants: [
      { src: `${base}-640.webp`, width: 640 },
      { src: `${base}-1200.webp`, width: 1200 },
    ],
    share: { src: `${base}-1200.jpg`, width: 1200 },
    alt,
  };
}

/**
 * Artists, in the order they appear on the homepage. Each one gets a page at /artists/<slug>/.
 * Name, legal name and biography come from the official files in ./bios/.
 * Leave anything unconfirmed empty ("" or null) — empty fields are simply not shown.
 */
export const artists: Artist[] = [
  {
    slug: "boem",
    ...parseBio(boemBio),
    bioLang: "tr",
    role: "",
    summary:
      "BOEM (Muhammed Emin Dönmez), ilk profesyonel projesi “Bi Düş Ver” ile dinleyici karşısına çıkan sanatçı ve söz yazarı. Rap ve Hip-Hop başta olmak üzere üretim yapıyor.",
    image: photo("boem.jpg", 2776, "BOEM — NOCTERA artist"),
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
    ...parseBio(rathBio),
    bioLang: "tr",
    role: "",
    summary:
      "RATH (Yusuf Çon); prodüktör, aranjör, söz yazarı ve besteci. BOEM ile “Bi Düş Ver” projesinde söz yazarı, ortak prodüktör ve mix-mastering mühendisi olarak yer aldı.",
    image: photo("rath.jpeg", 3000, "RATH — NOCTERA artist"),
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
  {
    slug: "siara",
    ...parseBio(siaraBio),
    bioLang: "tr",
    role: "",
    summary:
      "SIARA (Ahmet Safvan Aydın), müzik çalışmalarını NOCTERA ekibiyle sürdüren müzik prodüktörü. “Bi Düş Ver” projesinde ana prodüktör ve idari prodüktör olarak görev aldı.",
    image: photo("siara.jpeg", 3840, "SIARA — NOCTERA producer"),
    links: {
      instagram: ["https://www.instagram.com/ahmetsfvanaydin", "https://www.instagram.com/siaramadethis"],
      spotify: null,
      appleMusic: null,
      youtube: null,
      soundcloud: null,
      tiktok: null,
      x: null,
    },
  },
];
