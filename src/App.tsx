import { artistLinks, latestRelease, socialLinks } from "./config";
import { Header } from "./components/Header";
import { ReleaseCard } from "./components/ReleaseCard";
import { SocialLinks } from "./components/SocialLinks";
import { Footer } from "./components/Footer";

export function App() {
  return (
    <div className="page">
      <Header />
      <main>
        <ReleaseCard release={latestRelease} />
        <SocialLinks heading="Follow" links={socialLinks} />
        <SocialLinks heading="Artists" links={artistLinks} />
      </main>
      <Footer />
    </div>
  );
}
