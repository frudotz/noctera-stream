import type { SocialLink } from "../config";

type Props = {
  heading: string;
  /** Who the accounts belong to, for link labels when an entry has no `platform`. */
  owner?: string;
  links: SocialLink[];
};

export function SocialLinks({ heading, owner = "NOCTERA", links }: Props) {
  const published = links.filter((link): link is SocialLink & { url: string } => Boolean(link.url));
  if (published.length === 0) return null;

  const headingId = `${heading.toLowerCase()}-heading`;

  return (
    <section className="follow grid" aria-labelledby={headingId}>
      <h2 id={headingId} className="label">{heading}</h2>
      <ul className="follow__list">
        {published.map(({ label, url, platform }) => (
          <li key={url}>
            <a
              className="follow__link"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${platform ? label : owner} on ${platform ?? label} (opens in a new tab)`}
            >
              {label}
              {platform && <span className="follow__via" aria-hidden="true">{platform}</span>}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
