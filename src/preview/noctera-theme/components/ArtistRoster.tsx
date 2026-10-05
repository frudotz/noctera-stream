import { artistPath, linksOf, releasesBy, roleOn, type Artist } from "../../../data";
import { Arrow } from "../../../components/Arrow";
import { PreviewImage } from "./PreviewImage";

type Props = {
  artists: Artist[];
};

const panelId = (artist: Artist) => `nx-artist-${artist.slug}`;

/**
 * The roster: names set large on one side, the selected artist's portrait and
 * summary on the other. The names are links to each artist page; the preview
 * script turns them into tabs that switch the portrait in place.
 */
export function ArtistRoster({ artists }: Props) {
  if (artists.length === 0) return null;

  return (
    <section id="artists" className="nx-section" aria-labelledby="nx-artists-heading">
      <div className="nx-shell">
        <header className="nx-section__head">
          <h2 id="nx-artists-heading" className="nx-section__title">Artists</h2>
          <p className="nx-label">{String(artists.length).padStart(2, "0")}</p>
        </header>

        <div className="nx-roster" data-nx-tabs>
          <ol className="nx-roster__names" aria-labelledby="nx-artists-heading" data-nx-tablist>
            {artists.map((artist, i) => (
              <li key={artist.slug}>
                <a
                  className="nx-roster__name"
                  href={artistPath(artist)}
                  aria-controls={panelId(artist)}
                  data-nx-tab
                  data-active={i === 0 || undefined}
                >
                  <span className="nx-label nx-roster__no" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <span className="nx-roster__stage-name">{artist.name}</span>
                  {artist.realName && (
                    <span className="nx-roster__real" lang={artist.bioLang}>{artist.realName}</span>
                  )}
                </a>
              </li>
            ))}
          </ol>

          <div className="nx-stack nx-roster__panels">
            {artists.map((artist, i) => (
              <ArtistPanel key={artist.slug} artist={artist} active={i === 0} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ArtistPanel({ artist, active }: { artist: Artist; active: boolean }) {
  const id = panelId(artist);
  const links = linksOf(artist);
  const works = releasesBy(artist);

  return (
    <article id={id} className="nx-roster__panel" aria-labelledby={`${id}-name`} data-nx-panel data-active={active || undefined}>
      <div className="nx-portrait">
        {artist.image && (
          <PreviewImage picture={artist.image} alt={artist.image.alt} sizes="(min-width: 1024px) 38vw, calc(100vw - 40px)" />
        )}
      </div>

      <div className="nx-roster__about">
        <h3 id={`${id}-name`} className="nx-roster__heading">{artist.name}</h3>
        {artist.role && <p className="nx-label">{artist.role}</p>}
        {artist.summary && (
          <p className="nx-roster__summary" lang={artist.bioLang}>{artist.summary}</p>
        )}

        {works.length > 0 && (
          <ul className="nx-roster__works">
            {works.map((release) => {
              const role = roleOn(release, artist);
              return (
                <li key={release.slug}>
                  <span lang={release.titleLang}>{release.title}</span>
                  {role && <span className="nx-label">{role}</span>}
                </li>
              );
            })}
          </ul>
        )}

        <p className="nx-roster__links">
          <a className="nx-morelink" href={artistPath(artist)}>
            <span>Artist page</span>
            <Arrow direction="in" />
          </a>
          {links.map(({ label, url, handle }) => (
            <a
              key={url}
              className="nx-morelink nx-morelink--quiet"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${artist.name} on ${label}${handle ? ` (@${handle})` : ""} (opens in a new tab)`}
            >
              <span>
                {label}
                {handle && <span className="nx-handle"> @{handle}</span>}
              </span>
              <Arrow />
            </a>
          ))}
        </p>
      </div>
    </article>
  );
}
