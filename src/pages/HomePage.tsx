import { artists, getLatestRelease, labelLinks, releases } from "../data";
import { Layout } from "../components/Layout";
import { ReleaseCard } from "../components/ReleaseCard";
import { ReleaseList } from "../components/ReleaseList";
import { SocialLinks } from "../components/SocialLinks";
import { ArtistList } from "../components/ArtistList";

export function HomePage() {
  return (
    <Layout isHome>
      <ReleaseCard release={getLatestRelease()} eyebrow="Latest release" headingLevel={2} linkTitle />
      {/* Only worth a section once there is more than the featured release. */}
      {releases.length > 1 && <ReleaseList heading="Selected releases" releases={releases} />}
      <SocialLinks links={labelLinks} />
      <ArtistList artists={artists} />
    </Layout>
  );
}
