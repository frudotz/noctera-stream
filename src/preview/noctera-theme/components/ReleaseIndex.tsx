import { creditOf, releasePath, streamingPlatforms, type Release } from "../../../data";
import { Arrow } from "../../../components/Arrow";
import { PreviewImage } from "./PreviewImage";

type Props = {
  releases: Release[];
};

/** The catalogue as an editorial index: one ruled line per release, linking to its page. */
export function ReleaseIndex({ releases }: Props) {
  return (
    <section id="catalogue" className="nx-section" aria-labelledby="nx-catalogue-heading">
      <div className="nx-shell">
        <header className="nx-section__head">
          <h2 id="nx-catalogue-heading" className="nx-section__title">Catalogue</h2>
          <p className="nx-label">
            {releases.length} {releases.length === 1 ? "release" : "releases"}
          </p>
        </header>

        <ol className="nx-index">
          {releases.map((release, i) => {
            const available = streamingPlatforms.filter(({ key }) => release.links[key]).length;

            return (
              <li key={release.slug}>
                <a className="nx-index__row" href={releasePath(release)}>
                  <span className="nx-label nx-index__no" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <span className="nx-index__thumb">
                    {release.cover && <PreviewImage picture={release.cover} alt="" sizes="96px" />}
                  </span>
                  <span className="nx-index__main">
                    <span className="nx-index__title" lang={release.titleLang}>{release.title}</span>
                    <span className="nx-index__credit">{creditOf(release)}</span>
                  </span>
                  <span className="nx-index__meta nx-label">
                    <span>{release.type}</span>
                    <span>{release.year}</span>
                    <span>{available} {available === 1 ? "platform" : "platforms"}</span>
                  </span>
                  <Arrow direction="in" />
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
