// Post-build step: turns the Vite build into a fully static multi-page site.
//   1. renders every page (home, releases, artists, 404) from the SSR bundle in dist-ssr/
//   2. inlines the stylesheet; drops the dev client bundle — pages are plain HTML
//   3. adds the tiny copy-link script only to pages that use it
//   4. adds a Content-Security-Policy (a <meta> tag — GitHub Pages can't send headers)
//   5. writes sitemap.xml and copies CNAME so the custom domain survives deployment
//   6. fails the build on missing local files or broken SEO basics (see audit below)
import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const dist = new URL("dist/", root);
const ssrDir = new URL("dist-ssr/", root);
const inDist = (path) => fileURLToPath(new URL("." + decodeURI(path.split(/[?#]/)[0]), dist));

const manifest = JSON.parse(await readFile(new URL(".vite/manifest.json", dist), "utf8"));
const mainEntry = manifest["index.html"];
const copyLinkEntry = manifest["src/client/copy-link.ts"];
const previewEntry = manifest["src/preview/noctera-theme/client.ts"];
if (!mainEntry?.css?.length || !copyLinkEntry || !previewEntry?.css?.length) throw new Error("Unexpected Vite manifest layout");

// Template: the built index.html minus the dev client bundle, with CSS inlined.
let template = await readFile(new URL("index.html", dist), "utf8");
const css = (await Promise.all(mainEntry.css.map((f) => readFile(new URL(f, dist), "utf8")))).join("\n").trim();
template = template
  .replace(new RegExp(`<script type="module"[^>]*src="/${mainEntry.file}"[^>]*></script>\\s*`), "")
  .replace(/<link rel="modulepreload"[^>]*>\s*/g, "")
  .replace(/<link rel="stylesheet"[^>]*>/, () => `<style>${css}</style>`);
if (template.includes(mainEntry.file) || !template.includes("<!--head-->") || !template.includes("<!--app-->")) {
  throw new Error("index.html template is missing placeholders or still references the client bundle");
}

// Everything is same-origin; the one inline stylesheet is allowed by its hash.
// (JSON-LD is data, not script, so CSP doesn't apply to it.)
const styleHash = createHash("sha256").update(css, "utf8").digest("base64");
const csp = [
  "default-src 'self'",
  "script-src 'self'",
  `style-src 'self' 'sha256-${styleHash}'`,
  "img-src 'self'",
  "font-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join("; ");
template = template.replace(
  /<meta charset="UTF-8" \/>/,
  (tag) => `${tag}\n    <meta http-equiv="Content-Security-Policy" content="${csp}" />`,
);

const scriptTags = {
  "copy-link": `<script type="module" src="/${copyLinkEntry.file}"></script>`,
  "preview-theme": `<script type="module" src="/${previewEntry.file}"></script>`,
};
// Stylesheets that only some pages load (linked, so the shared inline CSS and its hash stay the same).
const styleTags = {
  "preview-theme": previewEntry.css.map((f) => `<link rel="stylesheet" href="/${f}" />`).join("\n    "),
};

const { renderPages, SITE_URL } = await import(new URL("entry-server.js", ssrDir).href);
const pages = renderPages((path) => existsSync(inDist(path)));

const written = [];
for (const page of pages) {
  const scripts = page.scripts.map((name) => scriptTags[name]).join("");
  const styles = page.scripts.flatMap((name) => styleTags[name] ?? []).join("\n    ");
  const html = template
    .replace(/<html lang="[^"]*">/, `<html lang="${page.lang}">`)
    .replace("<!--head-->", () => page.head)
    .replace("</head>", () => (styles ? `  ${styles}\n  </head>` : "</head>"))
    .replace("<!--app-->", () => page.html)
    .replace("</body>", () => `${scripts}</body>`);

  const file = page.path.endsWith(".html") ? page.path : `${page.path}index.html`;
  await mkdir(new URL("." + file.slice(0, file.lastIndexOf("/") + 1), dist), { recursive: true });
  await writeFile(new URL("." + file, dist), html);
  written.push({ page, file, html });
}

// ---------- Audit ----------
const problems = [];
const attr = (html, selector) => html.match(selector)?.[1];
const seen = { title: new Map(), description: new Map() };

for (const { page, file, html } of written) {
  const fail = (message) => problems.push(`${file}: ${message}`);

  // Every root-relative src/href/srcset URL must exist in dist/.
  const refs = [
    ...[...html.matchAll(/(?:src|href)="(\/[^"]*)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/srcSet="([^"]*)"/gi)].flatMap((m) => m[1].split(",").map((c) => c.trim().split(/\s+/)[0])),
  ];
  for (const ref of refs) {
    const target = ref.endsWith("/") ? `${ref}index.html` : ref;
    if (ref.startsWith("/") && !existsSync(inDist(target))) fail(`missing file ${ref}`);
  }

  if ((html.match(/<h1[\s>]/g) ?? []).length !== 1) fail("must have exactly one <h1>");
  if (/localhost|127\.0\.0\.1|\/src\/|\/@vite/.test(html)) fail("contains a development URL");
  if (/name="keywords"/.test(html)) fail("contains meta keywords");
  if ([...html.matchAll(/<img\b(?![^>]*\balt=)[^>]*>/g)].length > 0) fail("<img> without alt");
  if (!/<html lang="[a-z]{2}">/.test(html)) fail("missing <html lang>");

  for (const block of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
    try {
      const { "@graph": graph = [] } = JSON.parse(block[1]);
      const ids = new Set(graph.map((node) => node["@id"]).filter(Boolean));
      const walk = (value) => {
        if (Array.isArray(value)) return value.forEach(walk);
        if (!value || typeof value !== "object") return;
        const keys = Object.keys(value);
        if (keys.length === 1 && keys[0] === "@id" && !ids.has(value["@id"])) fail(`JSON-LD reference ${value["@id"]} has no node`);
        Object.values(value).forEach(walk);
      };
      walk(graph);
    } catch (error) {
      fail(`invalid JSON-LD (${error.message})`);
    }
  }

  if (!page.indexable) {
    if (!/name="robots" content="noindex"/.test(html)) fail("non-indexable page without noindex");
    continue;
  }

  const expectedUrl = SITE_URL + page.path;
  const canonical = attr(html, /<link rel="canonical" href="([^"]*)"/);
  if (canonical !== expectedUrl) fail(`canonical is ${canonical}, expected ${expectedUrl}`);
  if (attr(html, /property="og:url" content="([^"]*)"/) !== expectedUrl) fail("og:url differs from canonical");
  if (/name="robots" content="[^"]*noindex/.test(html)) fail("indexable page has noindex");

  const ogImage = attr(html, /property="og:image" content="([^"]*)"/);
  if (!ogImage?.startsWith(`${SITE_URL}/`)) fail(`og:image must be an absolute ${SITE_URL}/ URL`);
  else if (!existsSync(inDist(ogImage.slice(SITE_URL.length)))) fail(`og:image file missing: ${ogImage}`);
  for (const property of ["og:title", "og:description", "og:type", "og:site_name", "og:locale", "og:image:width", "og:image:height", "og:image:type"]) {
    if (!html.includes(`property="${property}"`)) fail(`missing ${property}`);
  }
  for (const name of ["twitter:card", "twitter:title", "twitter:description", "twitter:image"]) {
    if (!html.includes(`name="${name}"`)) fail(`missing ${name}`);
  }
  if (!html.includes('type="application/ld+json"')) fail("missing JSON-LD");

  for (const key of ["title", "description"]) {
    const value = page[key];
    if (!value) fail(`missing ${key}`);
    else if (seen[key].has(value)) fail(`duplicate ${key} (also on ${seen[key].get(value)})`);
    else seen[key].set(value, file);
  }
}

// ---------- Sitemap ----------
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
  throw new Error(`Build audit failed:\n  ${problems.join("\n  ")}`);
}

console.log(`prerender: ${pages.length} pages written (${pages.map((p) => p.path).join(", ")}); assets and SEO audit passed`);
