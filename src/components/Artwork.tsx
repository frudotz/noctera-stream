import type { Release } from "../config";

type Props = { release: Release };

export function Artwork({ release }: Props) {
  const { artist, title, titleLang, year, cover } = release;

  if (cover) {
    const srcSet = [...(cover.variants ?? []), cover]
      .map(({ src, width }) => `${src} ${width}w`)
      .join(", ");

    return (
      <div className="artwork">
        <img
          src={cover.src}
          srcSet={srcSet}
          sizes="(min-width: 820px) min(600px, 100svh - 190px), min(100vw - 40px, 544px)"
          alt={`Cover artwork for “${title}” by ${artist}`}
          width={cover.width}
          height={cover.width}
          decoding="async"
          fetchPriority="high"
        />
      </div>
    );
  }

  // Neutral stand-in until real artwork is added.
  return (
    <div
      className="artwork artwork--placeholder"
      role="img"
      aria-label={`${artist} — ${title}. Artwork coming soon.`}
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
        <span>{artist}</span>
        <span lang={titleLang}>{title}</span>
      </div>
    </div>
  );
}
