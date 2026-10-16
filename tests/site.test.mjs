// Checks the prerendered site in dist/ (run `npm run build` first, then `npm test`).
// Uses only Node's built-in test runner, so there is nothing extra to install.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const dist = new URL("../dist/", import.meta.url);
if (!existsSync(new URL("index.html", dist))) {
  throw new Error("dist/ has no build — run `npm run build` before `npm test`");
}

const page = (path) => readFileSync(fileURLToPath(new URL(`.${path}index.html`, dist)), "utf8");
const text = (html) =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .trim();

/** The release sections of an artist page, in page order: heading, then each row's link, title and role. */
function profileSections(path) {
  return [...page(path).matchAll(/<section class="band grid"[^>]*><h2[^>]*>([^<]+)<\/h2>(.*?)<\/section>/gs)]
    .filter(([, , body]) => body.includes("row--release"))
    .map(([, heading, body]) => ({
      heading,
      rows: [...body.matchAll(/<a class="row row--release" href="([^"]+)">(.*?)<\/a>/gs)].map(([, href, row]) => ({
        href,
        title: text(row.match(/<span class="row__title"[^>]*>(.*?)<\/span>/s)[1]),
        role: text(row.match(/<span class="row__meta row__meta--role"[^>]*>(.*?)<\/span>/s)?.[1] ?? ""),
      })),
    }));
}
const titles = (section) => section.rows.map((r) => r.title);

const PRODUCER = "Main Producer / Executive Producer";
// The catalogue as published: newest first, same-day releases in catalogue order.
const catalogue = [
  { slug: "sevgi-ve-inanc", no: "004", title: "Sevgi ve İnanç", credit: "BOEM & RATH", date: "2026-10-16", people: ["BOEM", "RATH", "SIARA"] },
  { slug: "kor-duygular", no: "003", title: "Kör Duygular", credit: "BOEM & RATH", date: "2026-10-16", people: ["BOEM", "RATH", "SIARA"] },
  { slug: "karanligi-ben-secmedim", no: "002", title: "Karanlığı Ben Seçmedim", credit: "RATH", date: "2026-10-13", people: ["RATH", "SIARA"] },
  { slug: "bi-dus-ver", no: "001", title: "Bi' Düş Ver", credit: "BOEM & RATH", date: "2026-09-29", people: ["BOEM", "RATH", "SIARA"] },
];
const BOEM_RELEASES = ["Sevgi ve İnanç", "Kör Duygular", "Bi' Düş Ver"];

test("homepage roster heading is CREW", () => {
  const html = page("/");
  assert.equal(html.match(/<h2 id="nb-artists-title">([^<]+)<\/h2>/)?.[1].toUpperCase(), "CREW");
  assert.match(html, /<a href="#artists">Crew<\/a>/);
  for (const slug of ["boem", "rath", "siara"]) assert.ok(html.includes(`href="/artists/${slug}/"`), `homepage links ${slug}`);
});

test("BOEM: RELEASES holds the three BOEM releases and nothing else is shown", () => {
  const sections = profileSections("/artists/boem/");
  assert.deepEqual(sections.map((s) => s.heading.toUpperCase()), ["RELEASES"]);
  assert.deepEqual(titles(sections[0]), BOEM_RELEASES);
});

test("RATH: RELEASES (own release only), then FEATURED ON (the BOEM releases)", () => {
  const sections = profileSections("/artists/rath/");
  assert.deepEqual(sections.map((s) => s.heading.toUpperCase()), ["RELEASES", "FEATURED ON"]);
  assert.deepEqual(titles(sections[0]), ["Karanlığı Ben Seçmedim"]);
  assert.deepEqual(titles(sections[1]), BOEM_RELEASES);
});

test("SIARA: WORKS lists every production credit with its role; no RELEASES or FEATURED ON", () => {
  const sections = profileSections("/artists/siara/");
  assert.deepEqual(sections.map((s) => s.heading.toUpperCase()), ["WORKS"]);
  assert.deepEqual(titles(sections[0]), catalogue.map((r) => r.title));
  for (const row of sections[0].rows) assert.equal(row.role, PRODUCER, `${row.title} role`);
});

test("no release is listed twice on a profile, and empty sections are omitted", () => {
  for (const slug of ["boem", "rath", "siara"]) {
    const sections = profileSections(`/artists/${slug}/`);
    const hrefs = sections.flatMap((s) => s.rows.map((r) => r.href));
    assert.equal(new Set(hrefs).size, hrefs.length, `${slug} has a duplicate release`);
    for (const s of sections) assert.ok(s.rows.length > 0, `${slug} renders an empty ${s.heading}`);
  }
});

test("release pages keep their URLs, credits, dates, contributors and JSON-LD", () => {
  for (const r of catalogue) {
    const html = page(`/releases/${r.slug}/`);
    assert.ok(html.includes(`<link rel="canonical" href="https://noctera.stream/releases/${r.slug}/" />`), `${r.slug} canonical`);
    assert.equal(text(html.match(/<p class="release__artist">(.*?)<\/p>/s)[1]), r.credit);
    assert.ok(html.includes(`<time dateTime="${r.date}">`), `${r.slug} date`);
    assert.deepEqual([...html.matchAll(/class="person__name[^"]*"[^>]*>([^<]+)</g)].map((m) => m[1]), r.people);
    assert.ok(html.includes(`<span class="person__role">${PRODUCER}</span>`), `${r.slug} producer role`);
    const graph = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])["@graph"];
    const album = graph.find((n) => n["@type"] === "MusicAlbum");
    const ids = (names) => names.map((n) => ({ "@id": `https://noctera.stream/artists/${n.toLowerCase()}/#person` }));
    assert.deepEqual(album.byArtist, ids(r.credit.split(" & ")));
    assert.deepEqual(album.producer, ids(["SIARA"]));
  }
});

test("homepage keeps catalogue numbers, order and the featured latest release", () => {
  const html = page("/");
  const rows = [...html.matchAll(/<a class="nb-row" href="\/releases\/([^/]+)\/"><span class="nb-row__no nb-mono">(\d+)<\/span>/g)];
  assert.deepEqual(rows.map(([, slug, no]) => [slug, no]), catalogue.map((r) => [r.slug, r.no]));
  assert.match(html.match(/<div class="nb-hero">.*?<\/a>/s)[0], /href="\/releases\/sevgi-ve-inanc\/"/);
});

test("sitemap keeps every artist and release URL", () => {
  const sitemap = readFileSync(fileURLToPath(new URL("sitemap.xml", dist)), "utf8");
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.deepEqual(urls, [
    "https://noctera.stream/",
    ...catalogue.map((r) => `https://noctera.stream/releases/${r.slug}/`),
    ...["boem", "rath", "siara"].map((s) => `https://noctera.stream/artists/${s}/`),
  ]);
});
