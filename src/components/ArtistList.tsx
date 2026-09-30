import { artistPath, linksOf, type Artist } from "../data";
import { Arrow } from "./Arrow";
import { Band } from "./Band";

type Props = { artists: Artist[] };

/** One line per artist: name (to the artist page), role if known, external profiles. */
export function ArtistList({ artists }: Props) {
  if (artists.length === 0) return null;

  return (
    <Band heading="Artists">
      <ul className="people">
        {artists.map((artist) => (
          <li key={artist.slug} className="person">
            <a className="person__name follow__link" href={artistPath(artist)}>
              {artist.name}
            </a>
            {artist.role && <span className="person__role">{artist.role}</span>}
            <span className="person__links">
              {linksOf(artist).map(({ label, url }) => (
                <a
                  key={url}
                  className="person__link"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${artist.name} on ${label} (opens in a new tab)`}
                >
                  {label}
                  <Arrow />
                </a>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </Band>
  );
}
