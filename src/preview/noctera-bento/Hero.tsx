import { coverAlt, creditOf, releasePath, releases, type Release } from "../../data";
import { Artwork } from "../../components/Artwork";
import { Arrow, Img } from "./primitives";
import { catalogNumber, indexOf, yearSpan } from "./catalog";

/**
 * The 7 / 3 / 2 opening row: latest release, NOCTERA identity, release index.
 * Three blocks with deliberately different weights — image, solid, outline.
 */
export function Hero({ release }: { release: Release }) {
  const credit = creditOf(release);

  return (
    <div className="nb-hero">
      {/* 7 columns — the release */}
      <article className="nb-block nb-latest" data-release={release.slug} aria-labelledby="nb-latest-title">
        <div className="nb-latest__text">
          <p className="nb-meta nb-latest__kicker">
            <span className="nb-marker" aria-hidden="true" />
            01 / Latest release
          </p>
          <hgroup className="nb-latest__heading">
            <h2 id="nb-latest-title" className="nb-latest__title" lang={release.titleLang}>
              <a href={releasePath(release)}>{release.title}</a>
            </h2>
            <p className="nb-latest__credit">{credit}</p>
          </hgroup>

          <dl className="nb-latest__facts">
            <div>
              <dt className="nb-meta">Year</dt>
              <dd>{release.year}</dd>
            </div>
            <div>
              <dt className="nb-meta">Format</dt>
              <dd>{release.type}</dd>
            </div>
            <div>
              <dt className="nb-meta">Index</dt>
              <dd className="nb-mono">{catalogNumber(release)}</dd>
            </div>
          </dl>

          <a className="nb-cta" href="#listen">
            Where to listen <Arrow to="down" />
          </a>
        </div>

        <div className="nb-latest__art">
          <div className="nb-cover">
            {release.cover ? (
              <Img
                picture={release.cover}
                alt={coverAlt(release)}
                sizes="(min-width: 1200px) 470px, (min-width: 768px) 46vw, calc(100vw - 42px)"
                priority
              />
            ) : (
              <Artwork cover={null} title={release.title} titleLang={release.titleLang} credit={credit} year={release.year} />
            )}
          </div>
        </div>
      </article>

      {/* 3 columns — who NOCTERA is */}
      <section className="nb-block nb-identity" aria-label="About NOCTERA">
        <p className="nb-identity__name">NOCTERA</p>
        {/* The favicon's N, drawn at block size. */}
        <svg className="nb-identity__mark" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
          <path d="M10.5 23V9l11 14V9" fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
        <p className="nb-identity__line">
          Independent
          <br />
          music label
          <br />
          / collective
        </p>
        <p className="nb-meta nb-identity__url">noctera.stream</p>
      </section>

      {/* 2 columns — the catalogue, as a printed index reference */}
      <a className="nb-block nb-index" href="#releases" aria-label={`Release index: ${releases.length} ${releases.length === 1 ? "release" : "releases"}, ${yearSpan()}`}>
        <span className="nb-index__no">{indexOf(releases[0])}</span>
        <span className="nb-index__label">
          NOCTERA
          <br />
          Release
          <br />
          Index
        </span>
        <span className="nb-index__foot">
          <span className="nb-meta">{yearSpan()}</span>
          <Arrow to="down" />
        </span>
      </a>
    </div>
  );
}
