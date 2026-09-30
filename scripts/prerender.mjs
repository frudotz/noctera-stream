// Post-build step: turns the Vite build into a fully static multi-page site.
//   1. renders every page (home, releases, artists, 404) from the SSR bundle in dist-ssr/
//   2. inlines the stylesheet; drops the dev client bundle — pages are plain HTML
//   3. adds the tiny copy-link script only to pages that use it
//   4. writes sitemap.xml and copies CNAME so the custom domain survives deployment
//   5. fails the build if any page references a local file that doesn't exist
import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const dist = new URL("dist/", root);
const ssrDir = new URL("dist-ssr/", root);
const inDist = (path) => fileURLToPath(new URL("." + decodeURI(path.split(/[?#]/)[0]), dist));

const manifest = JSON.parse(await readFile(new URL(".vite/manifest.json", dist), "utf8"));
const mainEntry = manifest["index.html"];
const copyLinkEntry = manifest["src/client/copy-link.ts"];
if (!mainEntry?.css?.length || !copyLinkEntry) throw new Error("Unexpected Vite manifest layout");

// Template: the built index.html minus the dev client bundle, with CSS inlined.
let template = await readFile(new URL("index.html", dist), "utf8");
const css = (await Promise.all(mainEntry.css.map((f) => readFile(new URL(f, dist), "utf8")))).join("\n");
template = template
  .replace(new RegExp(`<script type="module"[^>]*src="/${mainEntry.file}"[^>]*></script>\\s*`), "")
  .replace(/<link rel="modulepreload"[^>]*>\s*/g, "")
  .replace(/<link rel="stylesheet"[^>]*>/, () => `<style>${css.trim()}</style>`);
if (template.includes(mainEntry.file) || !template.includes("<!--head-->") || !template.includes("<!--app-->")) {
  throw new Error("index.html template is missing placeholders or still references the client bundle");
}

const scriptTags = { "copy-link": `<script type="module" src="/${copyLinkEntry.file}"></script>` };

const { renderPages, SITE_URL } = await import(new URL("entry-server.js", ssrDir).href);
const pages = renderPages((path) => existsSync(inDist(path)));

const written = [];
for (const page of pages) {
  const scripts = page.scripts.map((name) => scriptTags[name]).join("");
  const html = template
    .replace("<!--head-->", () => page.head)
    .replace("<!--app-->", () => page.html)
    .replace("</body>", () => `${scripts}</body>`);

  const file = page.path.endsWith(".html") ? page.path : `${page.path}index.html`;
  await mkdir(new URL("." + file.slice(0, file.lastIndexOf("/") + 1), dist), { recursive: true });
  await writeFile(new URL("." + file, dist), html);
  written.push({ file, html });
}

// Every root-relative src/href/srcset URL on every page must exist in dist/.
const problems = [];
for (const { file, html } of written) {
  const refs = [
    ...[...html.matchAll(/(?:src|href)="(\/[^"]*)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/srcSet="([^"]*)"/gi)].flatMap((m) => m[1].split(",").map((c) => c.trim().split(/\s+/)[0])),
  ];
  for (const ref of refs) {
    if (!ref.startsWith("/")) continue;
    const target = ref.endsWith("/") ? `${ref}index.html` : ref;
    if (!existsSync(inDist(target))) problems.push(`${file} → ${ref}`);
  }
}

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...pages.filter((p) => p.indexable).map((p) => `  <url><loc>${SITE_URL}${p.path}</loc></url>`),
  "</urlset>",
  "",
].join("\n");
await writeFile(new URL("sitemap.xml", dist), sitemap);

// Clean up: the dev bundle, the separate stylesheet, the manifest and the SSR build.
await rm(new URL(mainEntry.file, dist));
for (const f of mainEntry.css) await rm(new URL(f, dist));
await rm(new URL(".vite/", dist), { recursive: true, force: true });
await rm(ssrDir, { recursive: true, force: true });
await copyFile(new URL("CNAME", root), new URL("CNAME", dist));

if (problems.length > 0) {
  throw new Error(`Pages reference missing files:\n  ${problems.join("\n  ")}`);
}

console.log(`prerender: ${pages.length} pages written (${pages.map((p) => p.path).join(", ")}); assets verified`);
