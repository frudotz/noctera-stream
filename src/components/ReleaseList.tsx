import { creditOf, releasePath, roleOn, type Artist, type Release } from "../data";
import { Arrow } from "./Arrow";
import { Band } from "./Band";
import { useUiLang } from "./UiLang";

type Props = {
  heading: string;
  releases: Release[];
  /** On an artist page: show that artist's role on releases they contributed to. */
  artist?: Artist;
};

/** Numbered release rows, in the same ruled style as the platform list. */
export function ReleaseList({ heading, releases, artist }: Props) {
  const uiLang = useUiLang();
  if (releases.length === 0) return null;

  return (
    <Band heading={heading}>
      <ol className="rows">
        {releases.map((release, i) => {
          const role = artist ? roleOn(release, artist) : "";

          return (
            <li key={release.slug}>
              <a className="row row--release" href={releasePath(release)}>
                <span className="row__index" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <span className="row__label">
                  <span className="row__title" lang={release.titleLang}>{release.title}</span>
                  <span className="row__meta" lang={uiLang}>
                    {creditOf(release)} <span aria-hidden="true">·</span> {release.type}{" "}
                    <span aria-hidden="true">·</span> {release.year}
                  </span>
                  {role && <span className="row__meta row__meta--role" lang={uiLang}>{role}</span>}
                </span>
                <Arrow direction="in" />
              </a>
            </li>
          );
        })}
      </ol>
    </Band>
  );
}
