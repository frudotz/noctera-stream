import { creditOf, releasePath, type Release } from "../../data";
import { Arrow, SectionHead } from "./primitives";
import { indexOf } from "./catalog";

/** The catalogue as an editorial list (2 / 4 / 3 / 2 / 1 columns), one row per release. */
export function Releases({ releases }: { releases: Release[] }) {
  return (
    <section id="releases" className="nb-section" aria-labelledby="nb-releases-title">
      <SectionHead
        number="02"
        id="nb-releases-title"
        title="Releases"
        aside={`${releases.length} ${releases.length === 1 ? "release" : "releases"}`}
      />

      <ol className="nb-rows">
        {releases.map((release) => (
          <li key={release.slug}>
            <a className="nb-row" href={releasePath(release)}>
              <span className="nb-row__no nb-mono">{indexOf(release)}</span>
              <span className="nb-row__title" lang={release.titleLang}>{release.title}</span>
              <span className="nb-row__credit">{creditOf(release)}</span>
              <span className="nb-row__meta nb-meta">
                <span>{release.year}</span>
                <span>{release.type}</span>
              </span>
              <span className="nb-row__go">
                <span className="visually-hidden">Release page</span>
                <Arrow to="in" />
              </span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
