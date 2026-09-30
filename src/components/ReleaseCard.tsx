import type { ReactNode } from "react";
import { creditOf, releasePath, SITE_URL, type Release } from "../data";
import { Artwork } from "./Artwork";
import { CopyLink } from "./CopyLink";
import { PlatformLinks } from "./PlatformLinks";

type Props = {
  release: Release;
  /** Small label above the heading ("Latest release", or a breadcrumb trail). */
  eyebrow: ReactNode;
  /** h1 on the release's own page, h2 where it's featured (homepage). */
  headingLevel: 1 | 2;
  /** Link the title to the release page (used on the homepage). */
  linkTitle?: boolean;
  showCopyLink?: boolean;
};

export function ReleaseCard({ release, eyebrow, headingLevel, linkTitle = false, showCopyLink = false }: Props) {
  const { title, titleLang, type, year, cover } = release;
  const credit = creditOf(release);
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const headingId = `release-${release.slug}`;

  return (
    <article className="release grid" aria-labelledby={headingId}>
      <Artwork cover={cover} title={title} titleLang={titleLang} credit={credit} year={year} />

      <div className="release__body">
        <div className="release__intro">
          {typeof eyebrow === "string" ? <p className="label">{eyebrow}</p> : eyebrow}
          {/* The heading is the title alone; the artist credit is its subheading. */}
          <hgroup className="release__heading">
            <p className="release__artist">{credit}</p>
            <Heading id={headingId} className="release__title" lang={titleLang}>
              {linkTitle ? (
                <a className="release__title-link" href={releasePath(release)}>{title}</a>
              ) : (
                title
              )}
            </Heading>
          </hgroup>
          <div className="release__meta">
            <p className="label">
              {type} <span aria-hidden="true">·</span> {year}
            </p>
            {showCopyLink && <CopyLink url={SITE_URL + releasePath(release)} />}
          </div>
        </div>

        <PlatformLinks release={release} headingLevel={headingLevel === 1 ? 2 : 3} />
      </div>
    </article>
  );
}
