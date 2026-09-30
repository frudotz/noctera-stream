type Props = {
  /** On the homepage the wordmark is the page's h1; elsewhere it links home. */
  isHome: boolean;
};

export function Header({ isHome }: Props) {
  return (
    <header className="masthead grid">
      {isHome ? (
        <h1 className="wordmark">NOCTERA</h1>
      ) : (
        <p className="wordmark">
          <a href="/" aria-label="NOCTERA — home">NOCTERA</a>
        </p>
      )}
      <p className="label">Independent music label / collective</p>
    </header>
  );
}
