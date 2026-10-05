import { creditOf, streamingPlatforms, type Release, type SocialLink } from "../../data";
import { Arrow, OutLink, SectionHead } from "./primitives";

type Props = {
  release: Release;
  social: (SocialLink & { url: string })[];
};

/** 8 + 4: where to hear the latest release, and where to follow NOCTERA. Plain text links. */
export function Listen({ release, social }: Props) {
  const credit = creditOf(release);

  return (
    <section id="listen" className="nb-section" aria-labelledby="nb-listen-title">
      <SectionHead number="04" id="nb-listen-title" title="Listen" />

      <div className="nb-listen">
        <div className="nb-block nb-platforms">
          <p className="nb-meta nb-block__label">
            {credit} — <span lang={release.titleLang}>{release.title}</span>
          </p>
          <ul className="nb-links">
            {streamingPlatforms.map(({ key, label }) => {
              const url = release.links[key];
              return (
                <li key={key}>
                  {url ? (
                    <OutLink className="nb-link" href={url} label={`Listen to ${release.title} on ${label}`}>
                      <span>{label}</span>
                      <Arrow to="out" />
                    </OutLink>
                  ) : (
                    <span className="nb-link nb-link--soon">
                      <span>{label}</span>
                      <span className="nb-meta">Soon</span>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {social.length > 0 && (
          <div className="nb-block nb-social" aria-labelledby="nb-social-title" role="group">
            <h3 id="nb-social-title" className="nb-meta nb-block__label">Social</h3>
            <ul className="nb-links nb-links--single">
              {social.map(({ label, url }) => (
                <li key={url}>
                  <OutLink className="nb-link" href={url} label={`NOCTERA on ${label}`}>
                    <span>{label}</span>
                    <Arrow to="out" />
                  </OutLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
