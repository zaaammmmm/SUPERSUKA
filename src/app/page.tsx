import Link from "next/link";
import { apps } from "@/lib/apps";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AppIcon from "@/components/AppIcon";

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="8" fill="#e4f1e8" />
      <path d="M4.8 8.2l2 2 4.4-4.6" fill="none" stroke="#155e38" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function HomePage() {
  return (
    <>
      <SiteHeader active="home" />
      <main className="container">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow"><span className="eyebrow-dot" /> EKOSISTEM DIGITAL KAMPUS</span>
            <h1>Semua layanan kampus, <span>dalam satu tempat.</span></h1>
            <p className="lead">
              Pilih layanan yang kamu butuhkan. Setiap aplikasi tetap memakai
              akun dan datanya sendiri, jadi kamu bisa mulai dari mana saja.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#layanan">Lihat layanan</a>
              <Link className="btn btn-ghost" href="/tentang">Baca dulu</Link>
            </div>
            <ul className="checks">
              <li><CheckIcon /> Tiga layanan dalam satu alamat</li>
              <li><CheckIcon /> Data tetap di layanan masing-masing</li>
              <li><CheckIcon /> Layanan bisa dibuka tanpa login portal</li>
            </ul>
          </div>

          <aside className="portal-visual" aria-label="Pratinjau ekosistem layanan kampus">
            <div className="visual-orbit orbit-one" />
            <div className="visual-orbit orbit-two" />
            <div className="visual-topline"><span className="visual-brand-mark">S</span><span>Ruang digital kampus</span><span className="visual-live"><i /> LIVE</span></div>
            <div className="visual-heading"><span className="eyebrow">SATU PORTAL, BANYAK KEMUDAHAN</span><strong>Temukan layanan<br />yang kamu perlukan.</strong><small>Terhubung dalam satu ekosistem.</small></div>
            <div className="visual-apps">
              {apps.map((app, index) => (
                <div className={`visual-app visual-app-${app.id}`} key={app.id}>
                  <AppIcon id={app.id} size={21} />
                  <span>{app.name}</span>
                  <small>{index + 1}</small>
                </div>
              ))}
            </div>
            <div className="visual-foot"><span className="visual-foot-icon">✓</span><span><b>Semua dalam satu akses</b><small>Pilih layanan, lanjutkan aktivitasmu.</small></span></div>
            <div className="visual-spark spark-one">✳</div><div className="visual-spark spark-two">✦</div>
          </aside>

        </section>

        <section className="section" id="layanan">
          <h2>Layanan yang tersedia</h2>
          <p className="sub">
            Pilih salah satu untuk membuka aplikasinya. Kamu tetap berada di
            alamat portal ini.
          </p>
          <div className="app-grid">
            {apps.map((app) => (
              <article className="app-card" key={app.id}>
                <AppIcon id={app.id} />
                <span className="badge badge-tint">{app.category}</span>
                <h3>{app.name}</h3>
                <p>{app.description}</p>
                <Link className="open" href={app.href}>Buka {app.name}</Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mobile-section" aria-labelledby="mobile-title">
          <div className="mobile-copy">
            <span className="eyebrow"><span className="eyebrow-dot" /> SELALU DALAM GENGGAMAN</span>
            <h2 id="mobile-title">Pengalaman kampus yang nyaman dari layar ponsel.</h2>
            <p>
              Akses SuperApp melalui browser ponsel dengan tampilan yang
              responsif. Pengembangan versi PWA dan aplikasi di toko aplikasi
              akan mengikuti kesiapan rilis masing-masing platform.
            </p>

            <div className="platform-list" aria-label="Status ketersediaan platform">
              <div className="platform-item platform-available">
                <span className="platform-symbol" aria-hidden="true">↗</span>
                <span className="platform-text"><b>Web Mobile</b><small>Dapat diakses sekarang melalui browser</small></span>
                <span className="platform-status">Tersedia</span>
              </div>
              <div className="platform-item">
                <span className="platform-symbol" aria-hidden="true">＋</span>
                <span className="platform-text"><b>PWA</b><small>Fitur instalasi ke layar utama dalam pengembangan</small></span>
                <span className="platform-status platform-status-planned">Disiapkan</span>
              </div>
              <div className="platform-item">
                <span className="platform-symbol platform-store-symbol" aria-hidden="true">▶</span>
                <span className="platform-text"><b>Google Play</b><small>Tautan unduhan resmi belum tersedia</small></span>
                <span className="platform-status platform-status-muted">Belum tersedia</span>
              </div>
              <div className="platform-item">
                <span className="platform-symbol" aria-hidden="true">◉</span>
                <span className="platform-text"><b>App Store</b><small>Tautan unduhan resmi belum tersedia</small></span>
                <span className="platform-status platform-status-muted">Belum tersedia</span>
              </div>
            </div>
            <p className="mobile-note">Portal saat ini dapat dibuka melalui browser mobile. Informasi instalasi PWA dan tautan toko aplikasi akan ditambahkan setelah tersedia.</p>
          </div>

          <div className="phone-stage" aria-label="Mockup tampilan SuperApp pada ponsel">
            <div className="phone-orbit phone-orbit-one" />
            <div className="phone-orbit phone-orbit-two" />
            <div className="phone-device">
              <div className="phone-frame-top"><span /><i /></div>
              <div className="phone-screen">
                <div className="phone-status"><b>09:41</b><span>● ● ●</span></div>
                <div className="phone-brand"><span className="phone-brand-mark">S</span><b>SuperApp</b><span className="phone-avatar">A</span></div>
                <div className="phone-greeting"><small>SELAMAT DATANG</small><strong>Halo, Sobat Kampus! 👋</strong><span>Ada yang bisa dibantu hari ini?</span></div>
                <div className="phone-search"><span>⌕</span> Cari layanan kampus</div>
                <div className="phone-section-head"><b>Layanan kampus</b><small>Lihat semua</small></div>
                <div className="phone-app-grid">
                  {apps.slice(0, 4).map((app) => (
                    <div className="phone-app" key={app.id}>
                      <AppIcon id={app.id} size={20} />
                      <b>{app.name}</b>
                    </div>
                  ))}
                </div>
                <div className="phone-highlight"><span>RUANG DIGITAL KAMPUS</span><b>Satu akses untuk berbagai kebutuhan.</b><i>Jelajahi layanan&nbsp; →</i></div>
                <div className="phone-tabbar"><span className="active">⌂<small>Beranda</small></span><span>▦<small>Layanan</small></span><span>♙<small>Akun</small></span></div>
              </div>
            </div>
            <div className="phone-float phone-float-top"><span>✓</span> Akses praktis</div>
            <div className="phone-float phone-float-bottom"><span>✦</span> Desain responsif</div>
          </div>
        </section>

        {/* <section className="section">
          <div className="notice" role="note">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
              <path d="M12 9v4M12 17h.01" />
            </svg>
            <div>
              <b>Login portal tidak menggantikan login layanan.</b>
              Setelah membuka layanan, masuk dengan akun layanan tersebut. Setiap
              layanan tetap memeriksa sesi dan perannya sendiri.
            </div>
          </div>
        </section>

        <section className="cta">
          <div>
            <h2>{session ? "Kamu sudah masuk ke portal." : "Mulai dari layanan yang kamu butuhkan."}</h2>
            <p>
              {session
                ? "Buka dashboard untuk melihat akun portalmu, atau langsung pilih layanan di atas."
                : "Akun portal dipakai untuk halaman dashboard. Layanan tetap bisa dibuka tanpa login portal."}
            </p>
          </div>
          <div className="cta-actions">
            {session ? (
              <Link className="btn btn-light" href="/dashboard">Buka dashboard</Link>
            ) : (
              <>
                <Link className="btn btn-light" href="/login?mode=signup">Buat akun</Link>
                <Link className="btn btn-outline-light" href="/login">Masuk</Link>
              </>
            )}
          </div>
        </section> */}
      </main>
      <SiteFooter />
    </>
  );
}
