import { artists, getLatestRelease, labelLinks, releases } from "../../data";
import { Arrow } from "../../components/Arrow";
import { FeaturedRelease } from "./components/FeaturedRelease";
import { ReleaseIndex } from "./components/ReleaseIndex";
import { ArtistRoster } from "./components/ArtistRoster";

/**
 * DESIGN PREVIEW — the homepage in the proposed NOCTERA theme.
 * Served at /preview/noctera-theme/ (noindex, not in the sitemap). Uses the same
 * data as production; nothing here is imported by the production pages.
 */
export function PreviewPage() {
  const follow = labelLinks.filter((link): link is typeof link & { url: string } => Boolean(link.url));

  return (
    <div className="nx">
      <a className="nx-skip" href="#nx-main">Skip to content</a>

      <p className="nx-notice">
        <span>Design preview — not the live site</span>
        <a href="/">View current site</a>
      </p>

      <header className="nx-header">
        <div className="nx-shell nx-header__inner">
          <h1 className="nx-wordmark">NOCTERA</h1>
          <p className="nx-label nx-header__tagline">Independent music label / collective</p>
          <nav className="nx-nav" aria-label="Sections">
            <a href="#release">Release</a>
            <a href="#catalogue">Catalogue</a>
            <a href="#artists">Artists</a>
            {follow.length > 0 && <a href="#follow">Follow</a>}
          </nav>
        </div>
      </header>

      <main id="nx-main">
        <FeaturedRelease releases={releases} featured={getLatestRelease()} />
        <ReleaseIndex releases={releases} />
        <ArtistRoster artists={artists} />

        {follow.length > 0 && (
          <section id="follow" className="nx-section" aria-labelledby="nx-follow-heading">
            <div className="nx-shell">
              <header className="nx-section__head">
                <h2 id="nx-follow-heading" className="nx-section__title">Follow</h2>
                <p className="nx-label">{String(follow.length).padStart(2, "0")}</p>
              </header>
              <ul className="nx-follow">
                {follow.map(({ label, url }) => (
                  <li key={url}>
                    <a
                      className="nx-follow__link"
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`NOCTERA on ${label} (opens in a new tab)`}
                    >
                      <span>{label}</span>
                      <Arrow />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>

      <footer className="nx-footer">
        <div className="nx-shell">
          <p className="nx-footer__mark" aria-hidden="true">NOCTERA</p>
          <div className="nx-footer__row nx-label">
            <p>© {new Date().getFullYear()} NOCTERA. All rights reserved.</p>
            <p>Independent music label / collective</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
