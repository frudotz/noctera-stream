import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

type Props = {
  isHome?: boolean;
  children: ReactNode;
};

export function Layout({ isHome = false, children }: Props) {
  return (
    <div className="page">
      <Header isHome={isHome} />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
