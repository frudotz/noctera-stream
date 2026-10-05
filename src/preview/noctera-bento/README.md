# NOCTERA — Bento × Neo-Brutalist homepage preview

A second, independent homepage concept. Served at `/preview/noctera-bento/` (`npm run dev`, or `npm run build && npm run preview`). Not linked from the site, `noindex`, no canonical URL, not in `sitemap.xml`. Ships **no JavaScript** — one linked stylesheet.

## System

- One grid: 12 columns ≥1024px (24px gap / 40px margin from 1200px, 16 / 24 below), 6 columns 768–1023px, a single deliberate column on phones.
- Blocks are outlined in ink (1px, no radius); rows inside blocks use a quieter rule. Three weights in the hero: image (latest release), solid (identity), outline (release index).
- No blur, glass, gradients or artwork-derived backgrounds. Colour comes from the cover; each release may set one accent (in `bento.css`, by slug) used only for the cover's offset shadow and the "latest" marker.
- Artist photos are monochrome until pointed at, so photos shot in very different light read as one set and the cover stays the page's colour.
- Archivo (display, wide caps for names) and IBM Plex Mono (numbers and metadata only) — the site's existing self-hosted fonts.

## Files

| File | What it is |
| --- | --- |
| `BentoPage.tsx` | page shell: notice, header, sections, footer |
| `Hero.tsx` | 7 / 3 / 2 row: latest release, identity, release index |
| `Releases.tsx` | catalogue rows (2 / 4 / 3 / 2 / 1 columns) |
| `Artists.tsx` | 4 + 8: roster list beside name-led photo blocks |
| `Listen.tsx` | 8 + 4: streaming platforms and NOCTERA's accounts |
| `primitives.tsx` | image, arrows, section head, external link |
| `catalog.ts` | index numbers and the release year span |
| `bento.css` | all styles, prefixed `nb-` |

`NOCTERA-001` / `001` are **derived from release order** (`catalog.ts`), not official catalogue numbers.

Wiring outside this folder: one page entry in `src/routes.tsx`, one build input in `vite.config.ts`, one stylesheet tag in `scripts/prerender.mjs`, and the dev import in `src/main.tsx`. Delete those and this folder to remove it.
