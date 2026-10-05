import { artistPath, type Artist } from "../data";
import { Arrow, Img, SectionHead } from "./primitives";

const pad = (n: number) => String(n).padStart(2, "0");

/** 4 + 8: the roster as a list of names beside a grid of name-led photo blocks. */
export function Artists({ artists }: { artists: Artist[] }) {
  if (artists.length === 0) return null;

  return (
    <section id="artists" className="nb-section" aria-labelledby="nb-artists-title">
      <SectionHead number="03" id="nb-artists-title" title="Artists" aside={`${pad(artists.length)} on the roster`} />

      <div className="nb-artists">
        <div className="nb-block nb-roster">
          <p className="nb-roster__count" aria-hidden="true">{pad(artists.length)}</p>
          <ul className="nb-roster__list">
            {artists.map((artist) => (
              <li key={artist.slug}>
                <a className="nb-roster__name" href={artistPath(artist)}>
                  <span>{artist.name}</span>
                  {artist.realName && (
                    <span className="nb-meta" lang={artist.bioLang}>{artist.realName}</span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <ul className="nb-tiles" data-count={artists.length}>
          {artists.map((artist, i) => (
            <li key={artist.slug} className="nb-tile">
              {/* Not a second tab stop: the roster list already links each artist. */}
              <a className="nb-tile__link" href={artistPath(artist)} tabIndex={-1} aria-hidden="true">
                <span className="nb-tile__photo">
                  {artist.image ? (
                    <Img picture={artist.image} alt={artist.image.alt} sizes="(min-width: 1200px) 30vw, (min-width: 768px) 45vw, 50vw" />
                  ) : (
                    <span className="nb-tile__initial">{artist.name.charAt(0)}</span>
                  )}
                </span>
                <span className="nb-tile__bar">
                  <span className="nb-mono">{pad(i + 1)}</span>
                  <span className="nb-tile__name">{artist.name}</span>
                  <Arrow to="in" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
