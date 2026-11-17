import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default async function DashboardPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/login?returnTo=/dashboard");
  }

  return (
    <>
      <SiteHeader />
      <main className="container">
        <section className="panel">
          <h1>Dashboard</h1>
          <p>Kamu masuk sebagai {session.user.name ?? session.user.email}.</p>
          <a className="btn btn-primary" href="/">Kembali ke portal</a>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
