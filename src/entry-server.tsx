import { renderToStaticMarkup } from "react-dom/server";
import { SITE_URL, validateData } from "./data";
import { renderHead } from "./head";
import { getPages } from "./routes";

export { SITE_URL };

/**
 * Every page of the site rendered to HTML (used by scripts/prerender.mjs).
 * `hasFile` checks a root-relative path against the build output, so a
 * social preview image that doesn't exist yet is left out rather than linked.
 */
export function renderPages(hasFile: (path: string) => boolean) {
  validateData();

  return getPages().map(({ path, meta, element, scripts }) => {
    let { image, card } = meta;
    if (image && image.src.startsWith("/") && !hasFile(image.src)) {
      console.warn(`prerender: ${path} — ${image.src} not found, social preview image omitted`);
      image = undefined;
      card = "summary";
    }

    return {
      path,
      head: renderHead({ ...meta, image, card }),
      html: renderToStaticMarkup(element),
      scripts,
      indexable: !meta.noindex,
    };
  });
}
