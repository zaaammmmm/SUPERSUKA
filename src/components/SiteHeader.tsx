import Link from "next/link";
import { auth0 } from "@/lib/auth0";

type Active = "home" | "layanan" | "tentang";

export default async function SiteHeader({ active }: { active?: Active }) {
  const session = await auth0.getSession();
  const current = (key: Active) => (active === key ? "page" : undefined);

  return (
    <header className="site-header">
      <div className="container">
        <div className="header-left">
          <Link className="brand" href="/">
            <span className="brand-mark" aria-hidden="true">S</span>
            Super App
          </Link>
          <nav className="nav" aria-label="Navigasi utama">
            <Link href="/" aria-current={current("home")}>Beranda</Link>
            <Link href="/layanan" aria-current={current("layanan")}>Layanan</Link>
            <Link href="/tentang" aria-current={current("tentang")}>Tentang</Link>
          </nav>
        </div>
        <div className="header-actions">
          {session ? (
            <>
              <span className="header-user">{session.user.name ?? session.user.email}</span>
              <a className="btn btn-primary btn-sm" href="/auth/logout">Keluar</a>
            </>
          ) : (
            <>
              <Link className="btn btn-primary btn-sm link-plain" href="/login">Masuk</Link>
              {/* <Link className="btn btn-primary btn-sm" href="/login?mode=signup">Daftar</Link> */}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
