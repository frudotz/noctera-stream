import { linksOf, releasesBy, type Artist } from "../data";
import { Layout } from "../components/Layout";
import { ReleaseList } from "../components/ReleaseList";
import { LinkRows } from "../components/LinkRows";
import { ResponsiveImage } from "../components/ResponsiveImage";

type Props = { artist: Artist };

export function ArtistPage({ artist }: Props) {
  const { slug, name, realName, bio, bioLang, image } = artist;
  const headingId = `artist-${slug}`;

  const intro = (
    <div className="intro__body">
      <h1 id={headingId} className="display">{name}</h1>
      {realName && <p className="label intro__name" lang={bioLang}>{realName}</p>}
      {bio.length > 0 && (
        <div className="intro__bio" lang={bioLang}>
          {bio.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Layout>
      {image ? (
        // Same composition as a release: photo in the artwork column, text beside it.
        <section className="release grid" aria-labelledby={headingId}>
          <div className={image.height && image.height !== image.width ? "artwork artwork--natural" : "artwork"}>
            <ResponsiveImage picture={image} alt={image.alt} />
          </div>
          <div className="release__body">
            <div className="release__intro">
              <p className="label">Artist</p>
              {intro}
            </div>
          </div>
        </section>
      ) : (
        <section className="intro grid" aria-labelledby={headingId}>
          <p className="label">Artist</p>
          {intro}
        </section>
      )}
      <ReleaseList heading="Releases" releases={releasesBy(artist)} artist={artist} />
      <LinkRows heading="Follow" owner={name} links={linksOf(artist)} />
    </Layout>
  );
}
