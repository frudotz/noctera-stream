import { renderToStaticMarkup } from "react-dom/server";
import { SITE_URL, validateData } from "./data";
import { analyticsCsp, analyticsEnabled, validateAnalyticsConfig } from "./data/analytics";
import { renderHead } from "./head";
import { getPages } from "./routes";

export { SITE_URL };

/** Analytics settings for scripts/prerender.mjs: whether to add the client script, and extra CSP sources. */
export function analyticsBuildConfig() {
  validateAnalyticsConfig();
  return { enabled: analyticsEnabled(), csp: analyticsCsp() };
}

/**
 * Every page of the site rendered to HTML (used by scripts/prerender.mjs).
 * `hasFile` checks a root-relative path against the build output, so the
 * preview image is the first candidate that actually exists.
 */
export function renderPages(hasFile: (path: string) => boolean) {
  validateData();

  return getPages().map(({ path, meta, element, scripts }) => {
    const image = meta.images.find((candidate) => hasFile(candidate.src));
    const skipped = meta.images.slice(0, image ? meta.images.indexOf(image) : undefined);
    for (const missing of skipped) {
      console.log(`prerender: ${path} — ${missing.src} not found, using ${image?.src ?? "no preview image"}`);
    }

    return {
      path,
      lang: meta.lang,
      title: meta.title,
      description: meta.description,
      head: renderHead(meta, image),
      html: renderToStaticMarkup(element),
      scripts,
      indexable: !meta.noindex,
    };
  });
}
