import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = { title: "Tentang" };

const steps = [
  {
    title: "Pilih layanan",
    text: "Buka halaman Layanan dan pilih aplikasi yang kamu butuhkan. Alamatnya tetap berada di portal ini.",
  },
  {
    title: "Masuk di layanan",
    text: "Gunakan akun layanan tersebut. Login portal belum otomatis memasukkan kamu ke layanan.",
  },
  {
    title: "Data tetap di layanan",
    text: "Laporan, pesan, dan data lain disimpan oleh layanan yang kamu pakai, bukan oleh portal.",
  },
];

const faqs = [
  {
    q: "Apakah aku harus login ke portal?",
    a: "Tidak. Semua layanan bisa dibuka tanpa login portal. Akun portal dipakai untuk halaman dashboard.",
  },
  {
    q: "Apakah login portal otomatis masuk ke layanan?",
    a: "Belum. Setelah membuka layanan, kamu masuk dengan akun layanan itu. Setiap layanan juga memeriksa sesi dan perannya sendiri.",
  },
  {
    q: "Siapa yang mengelola datanya?",
    a: "Masing-masing layanan. Portal hanya mengarahkan kamu ke layanan yang tepat.",
  },
];

export default function TentangPage() {
  return (
    <>
      <SiteHeader active="tentang" />
      <main className="container">
        <header className="page-head">
          <h1>Tentang Super App</h1>
          <p className="sub">
            Super App adalah satu pintu masuk ke layanan digital kampus. Layanan
            tetap berdiri sendiri; portal ini hanya mengumpulkannya di satu alamat
            supaya mudah ditemukan.
          </p>
        </header>

        <section className="section">
          <h2>Cara kerjanya</h2>
          <div className="steps">
            {steps.map((step, i) => (
              <div className="step" key={step.title}>
                <span className="step-num">{i + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>Pertanyaan umum</h2>
          <div className="faq">
            {faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="cta">
          <div>
            <h2>Siap memilih layanan?</h2>
            <p>Lihat semua layanan yang tersedia dan buka yang kamu butuhkan.</p>
          </div>
          <div className="cta-actions">
            <Link className="btn btn-light" href="/layanan">Lihat layanan</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
