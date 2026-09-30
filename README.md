# noctera.stream

Link page for NOCTERA — independent music label / collective. Used as the profile link on Instagram, TikTok, YouTube, Spotify and other platforms.

Built with Vite, React and TypeScript. At build time the page is prerendered to static HTML with the CSS inlined, so the deployed site ships **no JavaScript**, makes no third-party requests (fonts are self-hosted) and has no analytics or trackers.

## Development

Requires Node.js 22+.

```sh
npm install
npm run dev        # local dev server
npm run build      # typecheck + static build into dist/
npm run preview    # serve dist/ locally
```

`npm run build` fails if the page references a local file that doesn't exist (e.g. a missing cover image).

## Updating the latest release

Everything lives in [`src/config.ts`](src/config.ts). Edit `latestRelease`:

```ts
export const latestRelease: Release = {
  artist: "BOEM & RATH",
  title: "Bi Düş Ver",
  titleLang: "tr",              // language of the title, for screen readers
  type: "Single",
  year: "2026",
  cover: { src: "/assets/bi-dus-ver-cover.png", width: 2508, variants: [/* … */] },
  links: {
    spotify: "https://open.spotify.com/...",
    appleMusic: null,           // not out yet → listed as "Soon"
    // ...
  },
};
```

Values still set to `PLACEHOLDER` are unpublished: a platform without a URL is shown as "Soon"; a social account without a URL is hidden (the whole Follow row is hidden if none are set). To change the order or names of platforms, edit `platforms` in the same file.

## Social links

Edit `socialLinks` (NOCTERA's accounts, shown under "Follow") and `artistLinks` (the release's artists, shown under "Artists") in `src/config.ts`. Replace `PLACEHOLDER` with the profile URL; add, remove or reorder entries freely.

## Artwork

1. Put the original square artwork in `public/assets/`, with a URL-safe file name (e.g. `public/assets/new-single-cover.png`).
2. Optionally add smaller copies of the same image (e.g. 640 px and 1200 px WebP) so phones don't download the full-size original.
3. Update `cover` in `src/config.ts`:

   ```ts
   cover: {
     src: "/assets/new-single-cover.png",
     width: 3000, // pixel width of the original
     variants: [
       { src: "/assets/new-single-cover-640.webp", width: 640 },
       { src: "/assets/new-single-cover-1200.webp", width: 1200 },
     ],
   },
   ```

The browser picks the smallest file that is sharp enough for the screen. With `cover: null` a neutral CSS/SVG placeholder is shown.

## Social preview (Open Graph)

`index.html` already points `og:image` / `twitter:image` to `https://noctera.stream/og-image.jpg`. Add a 1200×630 JPEG at `public/og-image.jpg` — the release artwork on the site's dark background works well. Until the file exists, platforms show the link without an image.

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
| CNAME | `www` | `<github-username>.github.io` |

Then in **Settings → Pages**, set the custom domain to `noctera.stream` and enable **Enforce HTTPS** once the certificate is issued.

## Fonts

[Archivo](https://github.com/Omnibus-Type/Archivo) and [IBM Plex Mono](https://github.com/IBM/plex), both under the SIL Open Font License 1.1, self-hosted in `public/fonts/` and subset to Latin + Latin Extended-A (covers Turkish).
