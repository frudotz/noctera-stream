import type { SocialLink } from "../data";
import { Band } from "./Band";

type Props = {
  links: SocialLink[];
};

/** NOCTERA's own accounts, as a single line of text links. */
export function SocialLinks({ links }: Props) {
  const published = links.filter((link): link is SocialLink & { url: string } => Boolean(link.url));
  if (published.length === 0) return null;

  return (
    <Band heading="Follow">
      <ul className="follow__list">
        {published.map(({ label, url }) => (
          <li key={url}>
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
    </Band>
  );
}
