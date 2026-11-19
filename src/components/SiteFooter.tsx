import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <span className="brand">
            <span className="brand-mark" aria-hidden="true">S</span>
            Super App
          </span>
          <p className="footer-note">
            Portal layanan digital terintegrasi. Setiap layanan tetap dikelola
            dengan akun dan datanya masing-masing.
          </p>
        </div>
        <nav className="footer-links" aria-label="Tautan footer">
          <Link href="/layanan">Layanan</Link>
          <Link href="/tentang">Tentang portal</Link>
          <Link href="/dashboard">Dashboard</Link>
        </nav>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} Super App</p>
        </div>
      </div>
    </footer>
  );
}
