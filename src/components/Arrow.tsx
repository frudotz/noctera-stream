type Props = {
  /** "out" (↗) for external links, "in" (→) for pages on this site. */
  direction?: "out" | "in";
};

/** Hairline arrow, drawn as SVG so it renders identically on every platform. */
export function Arrow({ direction = "out" }: Props) {
  return (
    <svg className="arrow" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" focusable="false">
      <path
        d={direction === "out" ? "M2.5 9.5 9.5 2.5M3.5 2.5h6v6" : "M1.5 6h9M6.5 2l4 4-4 4"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
      />
    </svg>
  );
}
