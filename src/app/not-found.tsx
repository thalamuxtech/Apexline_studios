import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[100svh] flex items-center justify-center bg-onyx text-bone px-6">
      <div className="text-center max-w-xl">
        <p className="font-mono text-sm text-gold mb-4">404 — Not Found</p>
        <h1 className="font-display text-5xl md:text-7xl leading-tight">This page has not been built.</h1>
        <p className="mt-6 text-bone/70">But many more have been. Return to the studio to see our work.</p>
        <Link href="/" className="btn-primary mt-10">Back to home</Link>
      </div>
    </main>
  );
}
