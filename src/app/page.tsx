import Link from "next/link";
import { auth0 } from "@/lib/auth0";
import { apps } from "@/lib/apps";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const cardVariant = ["is-dark", "", "is-tint"];

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="8" fill="#e0efee" />
      <path d="M4.8 8.2l2 2 4.4-4.6" fill="none" stroke="#2a6f73" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function HomePage() {
  const session = await auth0.getSession();

  return (
    <>
      <SiteHeader active="home" />
      <main className="container">
        <section className="hero">
          <div>
            <h1>Semua layanan kampus dalam satu tempat.</h1>
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

          <aside className="status-card" aria-label="Ringkasan layanan">
            <div className="status-card-head">
              <div>
                <strong>Layanan aktif</strong>
                <span>Status saat ini</span>
              </div>
              <span className="badge badge-info"><i />{apps.length} layanan</span>
            </div>
            <ul className="service-rows">
              {apps.map((app) => (
                <li key={app.id}>
                  <div>
                    <b>{app.name}</b>
                    <small>{app.category}</small>
                  </div>
                  <span className="badge badge-ok"><i />Tersedia</span>
                </li>
              ))}
            </ul>
            {/* <div className="note-box">
              <b>Catatan</b>
              Masuk ke portal belum otomatis memasukkan kamu ke tiap layanan.
            </div> */}
          </aside>
        </section>

        <section className="section" id="layanan">
          <h2>Layanan yang tersedia</h2>
          <p className="sub">
            Pilih salah satu untuk membuka aplikasinya. Kamu tetap berada di
            alamat portal ini.
          </p>
          <div className="app-grid">
            {apps.map((app, i) => (
              <article className={`app-card ${cardVariant[i % cardVariant.length]}`} key={app.id}>
                <span className={`badge ${i === 0 ? "badge-soft" : "badge-muted"}`}>{app.category}</span>
                <h3>{app.name}</h3>
                <p>{app.description}</p>
                <Link className="open" href={app.href}>Buka {app.name}</Link>
              </article>
            ))}
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
