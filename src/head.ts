import { GOOGLE_SITE_VERIFICATION, SITE_URL } from "./data";

export type MetaImage = {
  /** Root-relative path in /public. */
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type PageMeta = {
  title: string;
  description: string;
  /** Root-relative path of the page, e.g. "/releases/bi-dus-ver/". */
  path: string;
  /** Language of the page's main content (<html lang>). */
  lang: "en" | "tr";
  type: "website" | "music.song" | "music.album" | "profile";
  /** Preview image candidates; the first one that exists in the build is used. */
  images: MetaImage[];
  /** Extra Open Graph properties, e.g. music:musician. */
  og?: [property: string, content: string][];
  /** Schema.org JSON-LD graph for this page. */
  jsonLd?: object[];
  noindex?: boolean;
  /** Forward visitors to this root-relative URL at once (retired URLs; GitHub Pages has no server redirects). */
  redirect?: string;
};

const LOCALES: Record<PageMeta["lang"], string> = { en: "en_US", tr: "tr_TR" };
const IMAGE_TYPES: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp" };

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const absolute = (path: string) => (/^https?:\/\//.test(path) ? path : SITE_URL + path);

/**
 * Page-specific <head> tags: title, description, canonical, Open Graph,
 * X/Twitter card and JSON-LD. `image` is the preview image chosen at build time.
 */
export function renderHead(meta: PageMeta, image: MetaImage | undefined): string {
  const url = absolute(meta.path);
  const tags: [string, string, string][] = [
    ["name", "description", meta.description],
    ["property", "og:site_name", "NOCTERA"],
    ["property", "og:locale", LOCALES[meta.lang]],
    ["property", "og:type", meta.type],
    ["property", "og:title", meta.title],
    ["property", "og:description", meta.description],
    ["property", "og:url", url],
  ];

  if (image) {
    const src = absolute(image.src);
    const ext = image.src.split(".").pop()!.toLowerCase();
    tags.push(
      ["property", "og:image", src],
      ["property", "og:image:secure_url", src],
      ["property", "og:image:type", IMAGE_TYPES[ext] ?? "image/jpeg"],
      ["property", "og:image:width", String(image.width)],
      ["property", "og:image:height", String(image.height)],
      ["property", "og:image:alt", image.alt],
    );
  }
  for (const [property, content] of meta.og ?? []) tags.push(["property", property, content]);

  tags.push(
    // "summary" = compact card with a small thumbnail beside the text (not a large image on top).
    // Discord and Telegram follow this too; og:image itself is unchanged.
    ["name", "twitter:card", "summary"],
    ["name", "twitter:title", meta.title],
    ["name", "twitter:description", meta.description],
  );
  if (image) {
    tags.push(["name", "twitter:image", absolute(image.src)], ["name", "twitter:image:alt", image.alt]);
  }

  if (meta.noindex) tags.push(["name", "robots", "noindex"]);
  // An instant refresh is treated by search engines like a permanent redirect.
  const refresh = meta.redirect ? `<meta http-equiv="refresh" content="0; url=${escape(meta.redirect)}" />` : "";
  if (GOOGLE_SITE_VERIFICATION && meta.path === "/") {
    tags.push(["name", "google-site-verification", GOOGLE_SITE_VERIFICATION]);
  }

  // "<" is escaped so the JSON can never close the <script> element early.
  const jsonLd = meta.jsonLd?.length
    ? `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": meta.jsonLd }).replace(/</g, "\\u003c")}</script>`
    : "";

  return [
    `<title>${escape(meta.title)}</title>`,
    refresh,
    meta.noindex ? "" : `<link rel="canonical" href="${escape(url)}" />`,
    ...tags.map(([attr, key, value]) => `<meta ${attr}="${key}" content="${escape(value)}" />`),
    jsonLd,
  ]
    .filter(Boolean)
    .join("\n    ");
}
