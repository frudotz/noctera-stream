# NOCTERA theme — design preview

A proposed visual direction for the homepage, built as an isolated page so it can be reviewed before anything changes in production.

- **URL:** `/preview/noctera-theme/` (`npm run dev`, or `npm run build && npm run preview`)
- **Status:** not linked from the site, `noindex`, no canonical URL, not in `sitemap.xml`
- **Content:** the same data as production (`src/data/`); nothing is duplicated or invented

## Files

| File | What it is |
| --- | --- |
| `PreviewPage.tsx` | page shell: notice bar, header, sections, footer |
| `components/FeaturedRelease.tsx` | the stage: large cover, blurred-cover atmosphere, credits, listen panel; a cover strip switches releases once there is more than one |
| `components/StreamingLinks.tsx` | main "Listen on …" action plus the other platforms ("Soon" when unpublished) |
| `components/ReleaseIndex.tsx` | catalogue as a ruled index, linking to each release page |
| `components/ArtistRoster.tsx` | names set large, selected artist's portrait, summary and links |
| `components/PreviewImage.tsx` | the production image set with per-slot `sizes` and lazy loading |
| `theme.css` | all preview styles, prefixed `nx-`, loaded only on this page |
| `client.ts` | 1 KB progressive enhancement: turns the release strip and artist names into accessible tabs (links without JavaScript) |

Wiring outside this folder: one page entry in `src/routes.tsx`, one build input in `vite.config.ts`, the matching script/stylesheet tags in `scripts/prerender.mjs`, and the dev-server import in `src/main.tsx`.

## Removing it

Delete this folder and those four small additions. Production pages are byte-identical with or without it.
