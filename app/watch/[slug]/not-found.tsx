import Link from "next/link";

export default function TrailerNotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-signal">404</p>
      <h1 className="mt-3 font-display text-2xl font-semibold text-ink">
        This trailer isn&rsquo;t in the catalog.
      </h1>
      <p className="mt-2 text-sm text-ink-muted">
        It may have been removed upstream, or the link is broken. Try browsing the full catalog
        instead.
      </p>
      <Link
        href="/catalog"
        className="mt-6 inline-block rounded-lg bg-signal px-5 py-2.5 text-sm font-medium text-white hover:bg-signal-dim"
      >
        Browse Catalog
      </Link>
    </div>
  );
}
