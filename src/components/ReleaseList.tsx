import { creditOf, releasePath, type Release } from "../data";
import { Arrow } from "./Arrow";
import { Band } from "./Band";

type Props = {
  heading: string;
  releases: Release[];
};

/** Numbered release rows, in the same ruled style as the platform list. */
export function ReleaseList({ heading, releases }: Props) {
  if (releases.length === 0) return null;

  return (
    <Band heading={heading}>
      <ol className="rows">
        {releases.map((release, i) => (
          <li key={release.slug}>
            <a className="row row--release" href={releasePath(release)}>
              <span className="row__index" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <span className="row__label">
                <span className="row__title" lang={release.titleLang}>{release.title}</span>
                <span className="row__meta">
                  {creditOf(release)} <span aria-hidden="true">·</span> {release.type}{" "}
                  <span aria-hidden="true">·</span> {release.year}
                </span>
              </span>
              <Arrow direction="in" />
            </a>
          </li>
        ))}
      </ol>
    </Band>
  );
}
