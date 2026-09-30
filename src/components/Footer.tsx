export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="colophon grid">
      <p className="label">NOCTERA</p>
      <p className="label">© {year} NOCTERA. All rights reserved.</p>
    </footer>
  );
}
