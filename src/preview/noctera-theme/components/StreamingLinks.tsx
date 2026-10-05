import { streamingPlatforms, type Release } from "../../../data";
import { Arrow } from "../../../components/Arrow";

type Props = {
  release: Release;
  headingId: string;
};

/**
 * Where to listen: the first published platform as the main call to action,
 * the rest as a quiet two-column index. Unpublished platforms read "Soon",
 * exactly like the production release page.
 */
export function StreamingLinks({ release, headingId }: Props) {
  const platforms = streamingPlatforms.map(({ key, label }) => ({ key, label, url: release.links[key] }));
  const published = platforms.filter((p): p is typeof p & { url: string } => Boolean(p.url));
  const [primary, ...others] = published;
  const pending = platforms.filter((p) => !p.url);

  return (
    <section className="nx-listen" aria-labelledby={headingId}>
      <div className="nx-listen__head">
        <h3 id={headingId} className="nx-label nx-label--bright">Listen</h3>
        <p className="nx-label">
          {published.length} {published.length === 1 ? "platform" : "platforms"}
        </p>
      </div>

      {primary ? (
        <a
          className="nx-listen__primary"
          href={primary.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Listen on ${primary.label} (opens in a new tab)`}
        >
          <span>
            <span className="nx-listen__primary-kicker">Listen on</span>
            <span className="nx-listen__primary-label">{primary.label}</span>
          </span>
          <Arrow />
        </a>
      ) : (
        <p className="nx-listen__soon">Streaming links coming soon.</p>
      )}

      {others.length + pending.length > 0 && (
        <ul className="nx-listen__grid">
          {others.map(({ key, label, url }) => (
            <li key={key}>
              <a
                className="nx-listen__link"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Listen on ${label} (opens in a new tab)`}
              >
                <span>{label}</span>
                <Arrow />
              </a>
            </li>
          ))}
          {pending.map(({ key, label }) => (
            <li key={key}>
              <span className="nx-listen__link nx-listen__link--pending">
                <span>{label}</span>
                <span className="nx-label">Soon</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
