import Head from "next/head";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page introuvable</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">404</p>
        <h1 className="text-3xl font-bold text-slate-900">Page introuvable</h1>
        <p className="text-slate-600">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/actualites"
          className="mt-2 rounded-full bg-brand px-5 py-2.5 font-semibold text-white transition hover:bg-brand-dark"
        >
          Retour aux actualités
        </Link>
      </main>
    </>
  );
}
