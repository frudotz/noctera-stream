import { linksOf, releasesBy, type Artist } from "../data";
import { Layout } from "../components/Layout";
import { ReleaseList } from "../components/ReleaseList";
import { LinkRows } from "../components/LinkRows";

type Props = { artist: Artist };

export function ArtistPage({ artist }: Props) {
  const { name, role, bio, image } = artist;

  const intro = (
    <div className="intro__body">
      <h1 className="display">{name}</h1>
      {role && <p className="label">{role}</p>}
      {bio && <p className="intro__bio">{bio}</p>}
    </div>
  );

  return (
    <Layout>
      {image ? (
        <section className="release grid">
          <div className="artwork">
            <img src={image.src} alt={name} width={image.width} height={image.width} decoding="async" />
          </div>
          <div className="release__body">
            <div className="release__intro">
              <p className="label">Artist</p>
              {intro}
            </div>
          </div>
        </section>
      ) : (
        <section className="intro grid">
          <p className="label">Artist</p>
          {intro}
        </section>
      )}
      <ReleaseList heading="Releases" releases={releasesBy(artist)} />
      <LinkRows heading="Follow" owner={name} links={linksOf(artist)} />
    </Layout>
  );
}
