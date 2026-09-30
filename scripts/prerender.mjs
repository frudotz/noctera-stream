// Post-build step: turns the Vite build into a fully static page.
//   1. renders <App /> to HTML (from the SSR bundle in dist-ssr/)
//   2. inlines the stylesheet and drops the client script — the page needs no JS
//   3. copies CNAME into dist/ so the custom domain survives deployment
//   4. fails the build if index.html references a local file that doesn't exist
import { copyFile, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const dist = new URL("dist/", root);
const ssrDir = new URL("dist-ssr/", root);
const indexFile = new URL("index.html", dist);

const { render } = await import(new URL("entry-server.js", ssrDir).href);
let html = await readFile(indexFile, "utf8");

if (!html.includes("<!--app-->")) throw new Error("index.html is missing the <!--app--> placeholder");
html = html.replace("<!--app-->", () => render());

// Inline the stylesheet.
const cssTag = /<link rel="stylesheet"[^>]*href="\/(assets\/[^"]+\.css)"[^>]*>/;
const cssMatch = html.match(cssTag);
if (!cssMatch) throw new Error("Could not find the built stylesheet in index.html");
const cssFile = new URL(cssMatch[1], dist);
const css = await readFile(cssFile, "utf8");
html = html.replace(cssMatch[0], () => `<style>${css.trim()}</style>`);
await rm(cssFile);

// Remove the client bundle; the prerendered markup is the whole page.
const scriptTag = /<script type="module"[^>]*src="\/(assets\/[^"]+\.js)"[^>]*><\/script>\s*/;
const scriptMatch = html.match(scriptTag);
if (!scriptMatch) throw new Error("Could not find the client script in index.html");
html = html.replace(scriptMatch[0], "");
await rm(new URL(scriptMatch[1], dist));
html = html.replace(/<link rel="modulepreload"[^>]*>\s*/g, "");

await writeFile(indexFile, html);
await copyFile(new URL("CNAME", root), new URL("CNAME", dist));
await rm(ssrDir, { recursive: true, force: true });

// Verify every root-relative src/href/srcset URL points at a file in dist/.
const refs = [
  ...[...html.matchAll(/(?:src|href)="(\/[^"]*)"/g)].map((m) => m[1]),
  ...[...html.matchAll(/srcSet="([^"]*)"/gi)].flatMap((m) => m[1].split(",").map((c) => c.trim().split(/\s+/)[0])),
];
const missing = refs
  .filter((path) => path.startsWith("/"))
  .map((path) => path.split(/[?#]/)[0])
  .filter((path) => path !== "/" && !existsSync(fileURLToPath(new URL("." + path, dist))));

if (missing.length > 0) {
  throw new Error(`index.html references missing files:\n  ${missing.join("\n  ")}`);
}

console.log("prerender: dist/index.html is static (no client JS), CNAME copied, local assets verified");
