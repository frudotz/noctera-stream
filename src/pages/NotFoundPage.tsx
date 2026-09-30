import { Layout } from "../components/Layout";

export function NotFoundPage() {
  return (
    <Layout>
      <section className="intro grid">
        <p className="label">404</p>
        <div className="intro__body">
          <h1 className="display">Not found</h1>
          <p>
            <a className="follow__link" href="/">Back to NOCTERA</a>
          </p>
        </div>
      </section>
    </Layout>
  );
}
