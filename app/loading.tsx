export default function Loading() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center" aria-live="polite" aria-busy="true">
      <p className="font-mono text-xs uppercase tracking-[0.35em] text-neutral-500">Opening the archive…</p>
    </main>
  );
}
