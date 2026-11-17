import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import { safeReturnTo } from "@/lib/return-to";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = { title: "Masuk" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string | string[]; mode?: string | string[] }>;
}) {
  const params = await searchParams;
  const returnTo = safeReturnTo(params.returnTo);
  const signup = (Array.isArray(params.mode) ? params.mode[0] : params.mode) === "signup";

  const session = await auth0.getSession();
  if (session) {
    redirect(returnTo ?? "/dashboard");
  }

  const query = new URLSearchParams();
  if (returnTo) query.set("returnTo", returnTo);
  if (signup) query.set("screen_hint", "signup");
  const authHref = `/auth/login${query.size ? `?${query}` : ""}`;

  const switchQuery = new URLSearchParams();
  if (returnTo) switchQuery.set("returnTo", returnTo);
  if (!signup) switchQuery.set("mode", "signup");
  const switchHref = `/login${switchQuery.size ? `?${switchQuery}` : ""}`;

  return (
    <>
      <SiteHeader />
      <main className="container">
        <section className="auth-card" aria-labelledby="auth-title">
          <h1 id="auth-title">{signup ? "Buat akun portal" : "Masuk ke portal"}</h1>
          <p>
            Akun portal dipakai untuk halaman dashboard. Layanan tetap bisa dibuka
            tanpa login portal.
          </p>
          <div className="auth-actions">
            <a className="btn btn-primary btn-block" href={authHref}>
              {signup ? "Lanjut membuat akun" : "Lanjut untuk masuk"}
            </a>
            <Link className="btn btn-ghost btn-block" href="/layanan">Lihat layanan tanpa login</Link>
          </div>
          <p className="auth-switch">
            {signup ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
            <Link href={switchHref}>{signup ? "Masuk" : "Buat akun"}</Link>
          </p>
        </section>

        <div className="auth-note">
          <div className="note-box">
            <b>Catatan</b>
            Login portal tidak menggantikan login layanan. Setelah membuka layanan,
            masuk dengan akun layanan tersebut.
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
