"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Application route error", error.digest ?? error.message);
  }, [error]);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <section className="max-w-xl text-center border border-neutral-800 p-10">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-500">Archive interruption</p>
        <h1 className="font-serif-classic text-4xl font-bold uppercase tracking-wider mt-4">This page could not be opened</h1>
        <p className="font-garamond text-lg text-neutral-300 mt-5">The error has been contained. Retry the current route or return to the main archive.</p>
        <button onClick={reset} className="mt-7 border border-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors cursor-pointer">Try again</button>
      </section>
    </main>
  );
}
