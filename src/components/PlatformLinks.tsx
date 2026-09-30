import { platforms, type Release } from "../config";
import { Arrow } from "./Arrow";

type Props = { release: Release };

export function PlatformLinks({ release }: Props) {
  return (
    <div className="listen">
      <h3 className="label listen__heading">Listen</h3>
      <ol className="rows">
        {platforms.map(({ key, label }, i) => {
          const url = release.links[key];
          const index = String(i + 1).padStart(2, "0");

          return (
            <li key={key}>
              {url ? (
                <a
                  className="row"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Listen on ${label} (opens in a new tab)`}
                >
                  <span className="row__index" aria-hidden="true">{index}</span>
                  <span className="row__label">{label}</span>
                  <Arrow />
                </a>
              ) : (
                <span className="row row--pending">
                  <span className="row__index" aria-hidden="true">{index}</span>
                  <span className="row__label">{label}</span>
                  <span className="row__status">Soon</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
