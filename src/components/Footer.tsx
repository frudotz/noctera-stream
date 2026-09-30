import { useUiLang } from "./UiLang";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="colophon grid" lang={useUiLang()}>
      <p className="label">NOCTERA</p>
      <p className="label">© {year} NOCTERA. All rights reserved.</p>
    </footer>
  );
}
