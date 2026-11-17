import type { Metadata } from "next";
import Link from "next/link";
import { apps } from "@/lib/apps";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = { title: "Layanan" };

const variant = ["is-dark", "", "is-tint"];

export default function LayananPage() {
  return (
    <>
      <SiteHeader active="layanan" />
      <main className="container">
        <header className="page-head">
          <h1>Layanan</h1>
          <p className="sub">
            Pilih layanan yang kamu butuhkan. Setiap layanan punya akun dan
            datanya sendiri, dan tetap dibuka lewat alamat portal ini.
          </p>
        </header>

        <div className="service-list">
          {apps.map((app, i) => (
            <article className={`service-row ${variant[i % variant.length]}`} key={app.id}>
              <div>
                <span className={`badge ${i === 0 ? "badge-soft" : "badge-muted"}`}>{app.category}</span>
                <h2>{app.name}</h2>
                <p>{app.description}</p>
                <dl className="meta">
                  <div><dt>Status</dt><dd>{app.status === "active" ? "Tersedia" : "Sedang dalam perawatan"}</dd></div>
                  <div><dt>Alamat</dt><dd>{app.href}</dd></div>
                  <div><dt>Akun</dt><dd>Masuk dengan akun {app.name}</dd></div>
                </dl>
              </div>
              {app.status === "active" ? (
                <Link className={`btn ${i === 0 ? "btn-light" : "btn-primary"}`} href={app.href}>
                  Buka {app.name}
                </Link>
              ) : (
                <span className="badge badge-muted">Belum tersedia</span>
              )}
            </article>
          ))}
        </div>

        <div className="notice" role="note" style={{ marginTop: 32 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
            <path d="M12 9v4M12 17h.01" />
          </svg>
          <div>
            <b>SISKA bukan layanan darurat.</b>
            Jika kamu dalam bahaya sekarang, menjauhlah ke tempat aman dan hubungi
            layanan darurat setempat.
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
