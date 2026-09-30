import type { Cover } from "../data";
import { ResponsiveImage } from "./ResponsiveImage";

type Props = {
  cover: Cover | null;
  title: string;
  titleLang?: string;
  credit: string;
  year: string;
};

export function Artwork({ cover, title, titleLang, credit, year }: Props) {
  if (cover) {
    return (
      <div className="artwork">
        <ResponsiveImage picture={cover} alt={`Cover artwork for “${title}” by ${credit}`} />
      </div>
    );
  }

  // Neutral stand-in until real artwork is added.
  return (
    <div
      className="artwork artwork--placeholder"
      role="img"
      aria-label={`${credit} — ${title}. Artwork coming soon.`}
    >
      <svg className="artwork__mark" viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <clipPath id="above-horizon">
            <rect width="100" height="60" />
          </clipPath>
        </defs>
        <circle cx="50" cy="60" r="22" clipPath="url(#above-horizon)" />
        <line x1="0" y1="60" x2="100" y2="60" />
      </svg>
      <div className="artwork__top" aria-hidden="true">
        <span>NOCTERA</span>
        <span>{year}</span>
      </div>
      <div className="artwork__bottom" aria-hidden="true">
        <span>{credit}</span>
        <span lang={titleLang}>{title}</span>
      </div>
    </div>
  );
}
