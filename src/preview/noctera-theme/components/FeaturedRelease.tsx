import {
  artistPath,
  artistsOf,
  coverAlt,
  creditOf,
  peopleOf,
  releasePath,
  type Release,
} from "../../../data";
import { Arrow } from "../../../components/Arrow";
import { Artwork } from "../../../components/Artwork";
import { PreviewImage } from "./PreviewImage";
import { StreamingLinks } from "./StreamingLinks";

const pad = (n: number) => String(n).padStart(2, "0");
const panelId = (release: Release) => `nx-release-${release.slug}`;

type Props = {
  releases: Release[];
  /** The release shown first (the one marked `latest`). */
  featured: Release;
};

/**
 * The page's stage: the featured release with its artwork at full presence,
 * lit by a blurred copy of the cover. With more than one release, a strip of
 * covers switches the stage (src/preview/noctera-theme/client.ts); without
 * JavaScript those covers are plain links to each release page.
 */
export function FeaturedRelease({ releases, featured }: Props) {
  const switchable = releases.length > 1;

  return (
    <section id="release" className="nx-stage" aria-label="Featured release" data-nx-tabs>
      <div className="nx-stack">
        {releases.map((release, i) => (
          <ReleaseStage
            key={release.slug}
            release={release}
            position={i + 1}
            total={releases.length}
            active={release === featured}
            isFeatured={release === featured}
          />
        ))}
      </div>

      {switchable && (
        <div className="nx-shell nx-switcher">
          <p className="nx-label" id="nx-switcher-label">Releases</p>
          <ol className="nx-switcher__list" aria-labelledby="nx-switcher-label" data-nx-tablist data-nx-orientation="horizontal">
            {releases.map((release, i) => (
              <li key={release.slug}>
                <a
                  className="nx-switcher__item"
                  href={releasePath(release)}
                  aria-controls={panelId(release)}
                  data-nx-tab
                  data-active={release === featured || undefined}
                >
                  <span className="nx-switcher__thumb">
                    {release.cover ? (
                      <PreviewImage picture={release.cover} alt="" sizes="56px" />
                    ) : (
                      <span className="nx-switcher__blank" />
                    )}
                  </span>
                  <span className="nx-switcher__text">
                    <span className="nx-label">{pad(i + 1)}</span>
                    <span className="nx-switcher__title" lang={release.titleLang}>{release.title}</span>
                    <span className="nx-switcher__credit">{creditOf(release)}</span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}

type StageProps = {
  release: Release;
  position: number;
  total: number;
  active: boolean;
  isFeatured: boolean;
};

function ReleaseStage({ release, position, total, active, isFeatured }: StageProps) {
  const { title, titleLang, type, year, cover } = release;
  const credit = creditOf(release);
  const id = panelId(release);
  // Credited artists come first in peopleOf(); everyone with a role is a contributor.
  const contributors = peopleOf(release).filter(({ role }) => role);

  return (
    <article id={id} className="nx-stage__panel" aria-labelledby={`${id}-title`} data-nx-panel data-active={active || undefined}>
      {cover && (
        <div className="nx-atmosphere" aria-hidden="true">
          {/* The smallest copy is plenty once blurred. */}
          <img src={(cover.variants?.[0] ?? cover).src} alt="" width="640" height="640" decoding="async" fetchPriority="low" />
        </div>
      )}

      <div className="nx-shell nx-stage__grid">
        <div className="nx-stage__art nx-rise nx-rise--1">
          <div className="nx-cover">
            {cover ? (
              <PreviewImage
                picture={cover}
                alt={coverAlt(release)}
                sizes="(min-width: 1024px) min(46vw, 100svh - 220px, 720px), calc(100vw - 40px)"
                priority={isFeatured}
              />
            ) : (
              <Artwork cover={null} title={title} titleLang={titleLang} credit={credit} year={year} />
            )}
          </div>
          <p className="nx-cover__caption" aria-hidden="true">
            <span>{credit} — <span lang={titleLang}>{title}</span></span>
            <span>{year}</span>
          </p>
        </div>

        <div className="nx-stage__info">
          <p className="nx-eyebrow nx-rise nx-rise--2">
            <span className="nx-label nx-label--bright">{isFeatured ? "Featured release" : "Release"}</span>
            <span className="nx-eyebrow__rule" aria-hidden="true" />
            <span className="nx-label">
              {pad(position)} / {pad(total)}
            </span>
          </p>

          <hgroup className="nx-heading nx-rise nx-rise--3">
            <p className="nx-credit">{credit}</p>
            <h2 id={`${id}-title`} className="nx-title" lang={titleLang}>
              {title}
            </h2>
          </hgroup>

          <dl className="nx-facts nx-rise nx-rise--4">
            <div>
              <dt className="nx-label">Artists</dt>
              <dd>
                {artistsOf(release).map((artist, i) => (
                  <span key={artist.slug}>
                    {i > 0 && ", "}
                    <a className="nx-textlink" href={artistPath(artist)}>{artist.name}</a>
                  </span>
                ))}
              </dd>
            </div>
            {contributors.map(({ artist, role }) => (
              <div key={artist.slug}>
                <dt className="nx-label">{role}</dt>
                <dd>
                  <a className="nx-textlink" href={artistPath(artist)}>{artist.name}</a>
                </dd>
              </div>
            ))}
            <div>
              <dt className="nx-label">Format</dt>
              <dd>{type}</dd>
            </div>
            <div>
              <dt className="nx-label">Year</dt>
              <dd>{year}</dd>
            </div>
            <div>
              <dt className="nx-label">Label</dt>
              <dd>NOCTERA</dd>
            </div>
          </dl>

          <div className="nx-rise nx-rise--5">
            <StreamingLinks release={release} headingId={`${id}-listen`} />
          </div>

          <p className="nx-stage__more nx-rise nx-rise--5">
            <a className="nx-morelink" href={releasePath(release)}>
              <span>Release page</span>
              <Arrow direction="in" />
            </a>
          </p>
        </div>
      </div>
    </article>
  );
}
