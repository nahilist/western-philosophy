import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Offline",
  description: "Reconnect to continue exploring Western philosophy.",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_55%)]" />
      <section className="relative mx-auto max-w-xl text-center">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-white/20 font-[family-name:var(--font-cinzel)] text-4xl">
          Φ
        </div>
        <p className="mb-4 font-[family-name:var(--font-inter)] text-xs uppercase tracking-[0.35em] text-white/45">
          The connection is quiet
        </p>
        <h1 className="font-[family-name:var(--font-cormorant)] text-5xl font-medium sm:text-6xl">You are offline.</h1>
        <p className="mx-auto mt-5 max-w-md font-[family-name:var(--font-inter)] text-sm leading-7 text-white/55">
          Reconnect to open new lessons. Pages and images you have already visited may remain available.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex rounded-full border border-white/25 px-7 py-3 font-[family-name:var(--font-inter)] text-xs uppercase tracking-[0.22em] transition hover:border-white hover:bg-white hover:text-black"
        >
          Try again
        </Link>
      </section>
    </main>
  );
}
