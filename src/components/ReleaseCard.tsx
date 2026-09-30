import type { Release } from "../config";
import { Artwork } from "./Artwork";
import { PlatformLinks } from "./PlatformLinks";

type Props = { release: Release };

export function ReleaseCard({ release }: Props) {
  const { artist, title, titleLang, type, year } = release;

  return (
    <section className="release grid" aria-labelledby="release-title">
      <Artwork release={release} />

      <div className="release__body">
        <div className="release__intro">
          <p className="label">Latest release</p>
          <h2 id="release-title" className="release__heading">
            <span className="release__artist">{artist}</span>{" "}
            <span className="release__title" lang={titleLang}>{title}</span>
          </h2>
          <p className="label release__meta">
            {type} <span aria-hidden="true">·</span> {year}
          </p>
        </div>

        <PlatformLinks release={release} />
      </div>
    </section>
  );
}
