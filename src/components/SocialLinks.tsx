import type { SocialLink } from "../config";

type Props = { links: SocialLink[] };

export function SocialLinks({ links }: Props) {
  const published = links.filter((link): link is SocialLink & { url: string } => Boolean(link.url));
  if (published.length === 0) return null;

  return (
    <section className="follow grid" aria-labelledby="follow-heading">
      <h2 id="follow-heading" className="label">Follow</h2>
      <ul className="follow__list">
        {published.map(({ label, url }) => (
          <li key={label}>
            <a
              className="follow__link"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`NOCTERA on ${label} (opens in a new tab)`}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
