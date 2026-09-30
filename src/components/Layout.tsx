import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { UiLangContext } from "./UiLang";

type Props = {
  isHome?: boolean;
  /** Language of the page's main content; must match the page's <html lang>. */
  lang?: string;
  children: ReactNode;
};

export function Layout({ isHome = false, lang = "en", children }: Props) {
  return (
    <UiLangContext.Provider value={lang === "en" ? undefined : "en"}>
      <div className="page">
        <Header isHome={isHome} />
        <main>{children}</main>
        <Footer />
      </div>
    </UiLangContext.Provider>
  );
}
