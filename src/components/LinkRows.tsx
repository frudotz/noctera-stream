import type { SocialLink } from "../data";
import { Arrow } from "./Arrow";
import { Band } from "./Band";

type Props = {
  heading: string;
  owner: string;
  links: (SocialLink & { url: string })[];
};

/** External profile links as ruled rows (artist pages). */
export function LinkRows({ heading, owner, links }: Props) {
  if (links.length === 0) return null;

  return (
    <Band heading={heading}>
      <ul className="rows">
        {links.map(({ label, url }) => (
          <li key={url}>
            <a
              className="row row--plain"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${owner} on ${label} (opens in a new tab)`}
            >
              <span className="row__label">{label}</span>
              <Arrow />
            </a>
          </li>
        ))}
      </ul>
    </Band>
  );
}
