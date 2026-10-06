# noctera.stream

Link page for NOCTERA — independent music label / collective. Used as the profile link on Instagram, TikTok, YouTube, Spotify and other platforms.

Built with Vite, React and TypeScript. At build time every page is prerendered to static HTML with the CSS inlined. Pages ship almost no JavaScript: a 0.8 KB "Copy link" script on release pages and a ~3 KB (gzipped) analytics client that loads after the content (see [Analytics](#analytics)). Fonts are self-hosted; without GA4/Yandex IDs configured, the only request to another host is the first-party analytics beacon.

## Development

Requires Node.js 22+.

```sh
npm install
npm run dev        # local dev server (all pages, e.g. /artists/boem/)
npm run build      # typecheck + static build into dist/
npm run preview    # serve dist/ locally
```

`npm run build` fails if data is inconsistent (duplicate slugs, a release credits an unknown artist) or if any page references a local file that doesn't exist (e.g. a missing cover image).

## Pages

Generated from the data on every build — no router, just HTML files:

| URL | Source |
| --- | --- |
| `/` | 12-column bento homepage (`src/pages/HomePage.tsx`, `src/home/`): the release marked `latest: true`, all releases, all artists, streaming and social links |
| `/releases/<slug>/` | one page per entry in `src/data/releases.ts` |
| `/artists/<slug>/` | one page per entry in `src/data/artists.ts` |
| `/404.html`, `/sitemap.xml` | generated |
| `/preview/noctera-theme/` | design preview of an alternative theme — `noindex`, not in the sitemap |
| `/preview/noctera-bento/` | retired preview of the current homepage — `noindex`, forwards to `/` |

Each page has its own title, description, canonical URL and Open Graph / X card tags (`src/routes.tsx`). Release pages use the cover artwork as their preview image; artist pages use the artist's image or, without one, their latest cover.

## Content

All content lives in [`src/data/`](src/data/). A `null` link means "not published yet": a streaming platform is then listed as "Soon", and any other link is hidden.

### A new release

Add an entry at the top of `src/data/releases.ts`, move `latest: true` to it, and remove `latest` from the previous one:

```ts
{
  slug: "new-single",            // → https://noctera.stream/releases/new-single/
  title: "New Single",
  titleLang: "tr",               // language of the title, for screen readers
  artists: ["boem"],             // slugs from artists.ts, in credit order
  credit: "BOEM",                // optional; defaults to the names joined with " & "
  type: "Single",
  year: "2026",
  latest: true,
  cover: { /* see Artwork */ },
  links: {
    spotify: "https://open.spotify.com/...",
    appleMusic: null,            // → "Soon"
    // youtubeMusic, youtube, soundcloud, deezer, amazonMusic
  },
},
```

The homepage's "Releases" list, the release pages and the artist pages update automatically. Each release can also get an accent colour (used only for small details on the homepage) in `src/home/home.css`, keyed by its slug.

### Artists

Each artist is an entry in `src/data/artists.ts` plus a biography file in `src/data/bios/<slug>.txt`:

```text
BOEM                        ← line 1: stage name
Muhammed Emin Dönmez        ← line 2: legal name

First paragraph…            ← paragraphs separated by blank lines

Second paragraph…
```

The biography is shown exactly as written in that file (edit the file, not the page). The first sentence becomes the page's description for search and social previews.

Photos go in `public/assets/artists/` — the original plus `-640.webp`, `-1200.webp` and `-1200.jpg` copies with the same base name (e.g. `boem.jpg`, `boem-640.webp`, …); `photo("boem.jpg", 1536, "BOEM — NOCTERA artist")` wires them up. The `-1200.jpg` copy is the social preview.

`links` covers Instagram, Spotify, Apple Music, YouTube, SoundCloud, TikTok and X; `role` is shown next to the name on the homepage. Leave anything unconfirmed empty — empty fields aren't shown.

To credit someone on a release without adding them to the credit line (e.g. a producer), use `contributors` on the release: `contributors: [{ artist: "siara", role: "Main Producer / Executive Producer" }]`. The release then appears on their artist page with that role.

### NOCTERA's accounts

Edit `src/data/label.ts` (shown in the homepage header, "Listen" section and footer).

### Artwork

1. Put the original square artwork in `public/assets/`, with a URL-safe file name (e.g. `public/assets/new-single-cover.png`).
2. Add smaller copies of the same image: 640 px and 1200 px WebP so phones don't download the original, and a 1200 px JPEG for social previews.
3. Set `cover` on the release:

   ```ts
   cover: {
     src: "/assets/new-single-cover.png",
     width: 3000, // pixel width of the original
     variants: [
       { src: "/assets/new-single-cover-640.webp", width: 640 },
       { src: "/assets/new-single-cover-1200.webp", width: 1200 },
     ],
     share: { src: "/assets/new-single-cover-1200.jpg", width: 1200 },
   },
   ```

The browser picks the smallest file that is sharp enough for the screen. With `cover: null` a neutral placeholder is shown.

### Homepage preview image

The homepage looks for `public/og-image.jpg` (1200×630). Until that file exists, the homepage is shared without an image (the build prints a note).

## SEO and metadata

Generated for every page at build time (`src/routes.tsx`, `src/head.ts`, `src/structured-data.ts`):

- **Title, description, canonical URL** — unique per page; artist descriptions come from each artist's `summary` in `src/data/artists.ts`.
- **Open Graph and X cards** — compact `summary` card (small thumbnail beside the text) with the page's own image: the release cover on release pages, the artist photo on artist pages, and on the homepage `public/og-image.jpg` if it exists (1200×630), otherwise the latest cover.
- **JSON-LD** — homepage: `WebSite` + `Organization` (NOCTERA, with its logo `public/assets/noctera-logo-512.png` and its social profiles as `sameAs`) + what the page shows: each artist as a `Person` affiliated with NOCTERA, each release as a `MusicAlbum` (the latest with its cover and streaming links), using the same `@id`s as their own pages; artist pages: `ProfilePage` + `Person` (affiliated with NOCTERA) + `BreadcrumbList`; release pages: `MusicAlbum` (credited artists as `byArtist`, producer contributors as `producer`, streaming links as `sameAs`) with a `MusicRelease` whose `recordLabel` is NOCTERA, + `BreadcrumbList`.
- **Language** — `<html lang>` follows the page's main content (`tr` on artist pages, whose biographies are Turkish; English interface text is marked `lang="en"`).
- **sitemap.xml / robots.txt** — the sitemap lists every indexable page and is rebuilt on each build; `robots.txt` allows everything and points to it.
- **Content-Security-Policy** — sent as a `<meta>` tag (GitHub Pages can't set response headers): same-origin, plus only the origins of the analytics providers that are switched on (`src/data/analytics.ts`). No inline scripts.

`npm run build` fails if a page has a missing or duplicate title/description, a wrong canonical URL, not exactly one `<h1>`, an image without `alt`, invalid JSON-LD, or a development URL.

### Google Search Console

1. Add a **Domain** property for `noctera.stream` and verify it with the DNS TXT record Google shows (added in Cloudflare) — nothing in the site needs to change.
   Alternatively, use a **URL prefix** property with the *HTML tag* method: paste the code into `GOOGLE_SITE_VERIFICATION` in `src/data/label.ts` and push.
2. Submit `https://noctera.stream/sitemap.xml` under *Sitemaps*.

## Analytics

The site sends lightweight analytics to NOCTERA's own collector at `https://analytics.noctera.stream/collect`. The collector, database, private dashboard and reports live in a separate private repository (`noctera-analytics`); this repository only contains the browser side:

| File | What it does |
| --- | --- |
| [`src/data/analytics.ts`](src/data/analytics.ts) | All analytics settings: collector URL, session timeout, GA4 Measurement ID, Yandex Metrica counter ID, Webvisor switch. Also validates the IDs and lists the CSP origins each provider needs. |
| [`src/client/analytics.ts`](src/client/analytics.ts) | The client (≈3 KB gzipped, no dependencies), added to every page by `scripts/prerender.mjs` as a `type="module"` script — it never blocks rendering. |

**What it records (first-party):** pageviews (page, title, previous page), clicks on internal links and outbound links (Spotify, YouTube, Instagram…), and how long the page was visible. Each browser gets a random visitor ID and a random session ID (30-minute inactivity timeout) in `localStorage`. The referrer is reduced to its scheme and host before it leaves the browser; UTM parameters are read from the landing URL. No cookies, IP addresses, fingerprints, form contents or session recordings. Requests use `fetch(…, { keepalive: true })`, or `navigator.sendBeacon()` while the page is being hidden or closed.

**Failure-safe:** everything is wrapped so that errors are swallowed; if the collector is down or blocked, the site behaves exactly the same. Analytics runs only on `noctera.stream` / `www.noctera.stream` — never on `localhost` or `npm run preview`.

**Excluding yourself:** open any page with `?analytics=off` to stop analytics in that browser (`?analytics=on` to undo).

### Google Analytics 4 and Yandex Metrica (optional)

Both are off until an ID is set. The IDs are public identifiers (every visitor's browser receives them), not secrets — but never use them to protect anything. Set them either in `src/data/analytics.ts`, or without a code change as repository **variables** (Settings → Secrets and variables → Actions → *Variables*): `GA4_MEASUREMENT_ID` (`G-…`) and `YANDEX_METRICA_ID` (digits). The build rejects malformed IDs and adds the providers' origins to the CSP automatically.

- **GA4:** page views, sessions, first visits, engagement and scrolls are recorded automatically by GA4. The client adds custom events `internal_link_click`, `outbound_link_click` (with `platform`) and `campaign_landing` (UTM landings). In GA4 → Admin → Data streams → Enhanced measurement, **turn off "Outbound clicks"** so outbound clicks aren't recorded twice (as GA4's `click` and as `outbound_link_click`). Google signals and ad personalization are disabled; query strings other than UTM parameters are removed from `page_location`.
- **Yandex Metrica:** page views, sources, visits, link clicks (native `trackLinks`), click map and bounce accuracy. **Webvisor (session recording) is off** — see the privacy notes in `noctera-analytics` before switching `webvisor` on.
- Browsers sending Global Privacy Control get no GA4 or Yandex Metrica.

The numbers in GA4, Yandex Metrica and NOCTERA's own dashboard will not match exactly (ad blockers, cookies, session and attribution rules, bot filtering, reporting delays).

## Deployment (GitHub Pages)

Pushing to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds the site and publishes `dist/` to GitHub Pages. In the repository settings, **Pages → Build and deployment → Source** must be set to **GitHub Actions**.

## Custom domain

The site is served from the root of `https://noctera.stream` (Vite `base` is `/`). The `CNAME` file in the repository root is copied into `dist/` on every build.

DNS for `noctera.stream`, at the domain registrar:

| Type  | Name  | Value |
| ----- | ----- | ----- |
| A     | `@`   | `185.199.108.153` |
| A     | `@`   | `185.199.109.153` |
| A     | `@`   | `185.199.110.153` |
| A     | `@`   | `185.199.111.153` |
| CNAME | `www` | `frudotz.github.io` |

Then in **Settings → Pages**, set the custom domain to `noctera.stream` and enable **Enforce HTTPS** once the certificate is issued.

## Fonts

[Archivo](https://github.com/Omnibus-Type/Archivo) and [IBM Plex Mono](https://github.com/IBM/plex), both under the SIL Open Font License 1.1, self-hosted in `public/fonts/` and subset to Latin + Latin Extended-A (covers Turkish).
