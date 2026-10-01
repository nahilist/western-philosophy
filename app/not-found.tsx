import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <section className="max-w-2xl text-center border border-neutral-800 p-10 sm:p-16">
        <p className="font-mono text-xs tracking-[0.35em] text-neutral-500 mb-5">404 · LOST FRAGMENT</p>
        <h1 className="font-serif-classic text-4xl sm:text-6xl font-bold uppercase tracking-wider">
          The page is not in the archive
        </h1>
        <p className="font-garamond text-lg text-neutral-300 mt-6 leading-relaxed">
          The requested text may have moved, or it may never have belonged to this philosophical corpus.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/" className="border border-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
            Return home
          </Link>
          <Link href="/philosophers" className="border border-neutral-700 px-6 py-3 text-xs uppercase tracking-widest hover:border-white transition-colors">
            Explore philosophers
          </Link>
        </div>
      </section>
    </main>
  );
}
