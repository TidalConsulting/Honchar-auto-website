"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4">
      <div className="max-w-lg text-center">
        <p className="text-sm font-bold uppercase tracking-wider text-amber-brand-600">
          Something went wrong
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900">
          This page didn&apos;t load
        </h1>
        <p className="mt-3 text-ink-600">
          Try again in a moment. If it keeps happening, give us a call and we&apos;ll help you
          straight away.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white hover:bg-ink-800"
        >
          Try again
        </button>
        {error.digest && (
          <p className="mt-6 font-mono text-xs text-ink-400">Reference: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
