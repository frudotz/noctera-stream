import { SITE_URL, type Image } from "./data";

export type PageMeta = {
  title: string;
  description: string;
  /** Root-relative path of the page, e.g. "/releases/bi-dus-ver/". */
  path: string;
  type: "website" | "music.song" | "music.album" | "profile";
  image?: Image & { height: number; alt: string };
  /** "summary" keeps square artwork uncropped; "summary_large_image" suits 1200×630 images. */
  card: "summary" | "summary_large_image";
  noindex?: boolean;
};

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const absolute = (path: string) => (/^https?:\/\//.test(path) ? path : SITE_URL + path);

/** Page-specific <head> tags: title, description, canonical, Open Graph, X/Twitter card. */
export function renderHead(meta: PageMeta): string {
  const url = absolute(meta.path);
  const tags: [string, string, string][] = [
    ["name", "description", meta.description],
    ["property", "og:type", meta.type],
    ["property", "og:site_name", "NOCTERA"],
    ["property", "og:title", meta.title],
    ["property", "og:description", meta.description],
    ["property", "og:url", url],
    ["name", "twitter:card", meta.card],
    ["name", "twitter:title", meta.title],
    ["name", "twitter:description", meta.description],
  ];

  if (meta.image) {
    const image = absolute(meta.image.src);
    tags.push(
      ["property", "og:image", image],
      ["property", "og:image:width", String(meta.image.width)],
      ["property", "og:image:height", String(meta.image.height)],
      ["property", "og:image:alt", meta.image.alt],
      ["name", "twitter:image", image],
      ["name", "twitter:image:alt", meta.image.alt],
    );
  }
  if (meta.noindex) tags.push(["name", "robots", "noindex"]);

  return [
    `<title>${escape(meta.title)}</title>`,
    meta.noindex ? "" : `<link rel="canonical" href="${escape(url)}" />`,
    ...tags.map(([attr, key, value]) => `<meta ${attr}="${key}" content="${escape(value)}" />`),
  ]
    .filter(Boolean)
    .join("\n    ");
}
