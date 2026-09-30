import { latestRelease, socialLinks } from "./config";
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
        <SocialLinks links={socialLinks} />
      </main>
      <Footer />
    </div>
  );
}
