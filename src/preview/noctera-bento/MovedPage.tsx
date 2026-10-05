import { Layout } from "../../components/Layout";

/**
 * /preview/noctera-bento/ — the bento concept is now the homepage. This page only
 * forwards old preview links to / (an instant meta refresh, see routes.tsx) and is
 * noindex, so it never competes with the homepage. Safe to delete once old links
 * no longer matter.
 */
export function MovedPage() {
  return (
    <Layout>
      <section className="intro grid">
        <p className="label">Moved</p>
        <div className="intro__body">
          <h1 className="display">This design is now the homepage</h1>
          <p>
            <a className="follow__link" href="/">Go to NOCTERA</a>
          </p>
        </div>
      </section>
    </Layout>
  );
}
