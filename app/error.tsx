"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app-error]", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-cartridge">
        Something glitched
      </p>
      <h1 className="mt-3 font-display text-2xl font-semibold text-ink">
        We hit a snag loading that page.
      </h1>
      <p className="mt-2 text-sm text-ink-muted">
        This is usually a temporary hiccup talking to our trailer database. Try again in a
        moment.
      </p>
      <button
        onClick={() => reset()}
        className="mt-6 rounded-lg bg-signal px-5 py-2.5 text-sm font-medium text-white hover:bg-signal-dim"
      >
        Try again
      </button>
    </div>
  );
}
