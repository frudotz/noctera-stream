/** Hairline north-east arrow, drawn as SVG so it renders identically on every platform. */
export function Arrow() {
  return (
    <svg className="arrow" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" focusable="false">
      <path d="M2.5 9.5 9.5 2.5M3.5 2.5h6v6" fill="none" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}
