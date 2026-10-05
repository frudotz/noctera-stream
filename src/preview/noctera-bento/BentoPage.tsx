import { artists, getLatestRelease, labelLinks, releases } from "../../data";
import { Arrow, OutLink } from "./primitives";
import { Hero } from "./Hero";
import { Releases } from "./Releases";
import { Artists } from "./Artists";
import { Listen } from "./Listen";

/**
 * DESIGN PREVIEW — "Bento × Neo-Brutalist" homepage concept.
 * Served at /preview/noctera-bento/ (noindex, not in the sitemap). Same data as
 * production; nothing here is imported by production or by other previews.
 */
export function BentoPage() {
  const latest = getLatestRelease();
  const social = labelLinks.filter((link): link is typeof link & { url: string } => Boolean(link.url));
  const instagram = social.find((link) => link.label === "Instagram") ?? social[0];

  return (
    <div className="nb">
      <a className="nb-skip" href="#nb-main">Skip to content</a>

      <p className="nb-notice">
        Design preview (bento) — not the live site. <a href="/">View current site</a>
      </p>

      <header className="nb-header">
        <h1 className="nb-wordmark">NOCTERA</h1>
        <nav className="nb-nav" aria-label="Sections">
          <a href="#releases">Releases</a>
          <a href="#artists">Artists</a>
          <a href="#listen">Listen</a>
        </nav>
        {instagram && (
          <OutLink className="nb-header__out" href={instagram.url} label={`NOCTERA on ${instagram.label}`}>
            {instagram.label} <Arrow to="out" />
          </OutLink>
        )}
      </header>

      <main id="nb-main" className="nb-main">
        <Hero release={latest} />
        <Releases releases={releases} />
        <Artists artists={artists} />
        <Listen release={latest} social={social} />
      </main>

      <footer className="nb-footer">
        <div className="nb-footer__id">
          <p className="nb-footer__name">NOCTERA</p>
          <p className="nb-meta">Independent music label / collective</p>
        </div>
        <ul className="nb-footer__links">
          {social.map(({ label, url }) => (
            <li key={url}>
              <OutLink className="nb-footer__link" href={url} label={`NOCTERA on ${label}`}>
                {label}
              </OutLink>
            </li>
          ))}
        </ul>
        <p className="nb-meta nb-footer__copy">© {new Date().getFullYear()} NOCTERA</p>
      </footer>
    </div>
  );
}
