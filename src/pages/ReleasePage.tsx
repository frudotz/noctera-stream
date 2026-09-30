import { peopleOf, type Release } from "../data";
import { Layout } from "../components/Layout";
import { ReleaseCard } from "../components/ReleaseCard";
import { ArtistList } from "../components/ArtistList";
import { Breadcrumbs } from "../components/Breadcrumbs";

type Props = { release: Release };

export function ReleasePage({ release }: Props) {
  return (
    <Layout>
      <ReleaseCard
        release={release}
        eyebrow={<Breadcrumbs items={[{ label: "NOCTERA", href: "/" }, { label: "Releases" }]} />}
        headingLevel={1}
        showCopyLink
      />
      <ArtistList people={peopleOf(release)} />
    </Layout>
  );
}
