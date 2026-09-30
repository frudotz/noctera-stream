import { useUiLang } from "./UiLang";

type Props = {
  /** Trail above the page heading; the page itself is the h1 that follows. */
  items: { label: string; href?: string }[];
};

/** Breadcrumb trail, set in the same small label style as the eyebrow it replaces. */
export function Breadcrumbs({ items }: Props) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb" lang={useUiLang()}>
      <ol className="label">
        {items.map(({ label, href }) => (
          <li key={label}>{href ? <a href={href}>{label}</a> : label}</li>
        ))}
      </ol>
    </nav>
  );
}
