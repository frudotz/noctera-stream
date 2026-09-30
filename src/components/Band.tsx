import type { ReactNode } from "react";
import { useUiLang } from "./UiLang";

type Props = {
  heading: string;
  children: ReactNode;
};

/** A ruled row on the page grid: small label in the first column, content in the second. */
export function Band({ heading, children }: Props) {
  const id = `${heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-heading`;

  return (
    <section className="band grid" aria-labelledby={id}>
      <h2 id={id} className="label" lang={useUiLang()}>{heading}</h2>
      <div className="band__content">{children}</div>
    </section>
  );
}
