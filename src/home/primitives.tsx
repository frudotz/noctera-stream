import type { ReactNode } from "react";
import type { Picture } from "../data";

type ImgProps = {
  picture: Picture;
  alt: string;
  /** Rendered width in this layout, so the browser picks the right file. */
  sizes: string;
  priority?: boolean;
};

/** The production image set (original + -640/-1200 copies) with per-slot sizes and lazy loading. */
export function Img({ picture, alt, sizes, priority = false }: ImgProps) {
  const srcSet = [...(picture.variants ?? []), picture].map(({ src, width }) => `${src} ${width}w`).join(", ");

  return (
    <img
      src={picture.src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={picture.width}
      height={picture.height ?? picture.width}
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "low"}
    />
  );
}

/** Hairline arrows drawn as SVG (the self-hosted font subset has no arrow glyphs). */
export function Arrow({ to }: { to: "out" | "in" | "down" }) {
  const d = {
    out: "M2.5 9.5 9.5 2.5M3.5 2.5h6v6",
    in: "M1.5 6h9M6.5 2l4 4-4 4",
    down: "M2.5 2.5l7 7M9.5 3.5v6h-6",
  }[to];

  return (
    <svg className="nb-arrow" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" focusable="false">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

type SectionHeadProps = {
  number: string;
  id: string;
  title: string;
  aside?: ReactNode;
};

/** "02 / Releases" — the numbered rule that opens each section. */
export function SectionHead({ number, id, title, aside }: SectionHeadProps) {
  return (
    <header className="nb-head">
      {/* The section number is visual numbering, kept out of the heading text. */}
      <div className="nb-head__title">
        <span className="nb-meta" aria-hidden="true">{number} /</span>
        <h2 id={id}>{title}</h2>
      </div>
      {aside && <p className="nb-meta">{aside}</p>}
    </header>
  );
}

/** External link that announces it opens a new tab. */
export function OutLink({ href, label, className, children }: { href: string; label: string; className: string; children: ReactNode }) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} (opens in a new tab)`}>
      {children}
    </a>
  );
}
