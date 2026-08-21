"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Brand lockup.
 *
 * Drop the real artwork in at `public/logo.png` (or set NEXT_PUBLIC_LOGO_FILE
 * to another path — an .svg or .webp works just as well) and it appears
 * everywhere the mark is used. No code change needed: if the file isn't there,
 * or fails to load, this quietly falls back to the drawn mark below, so the
 * header is never broken while the asset is being sorted out.
 *
 * The supplied badge sits on a white background, so against the dark footer it
 * is placed on a white chip rather than knocked out — that keeps the vehicle
 * line art intact instead of flattening it to a silhouette.
 */
const LOGO_FILE = process.env.NEXT_PUBLIC_LOGO_FILE || "/logo.png";

export function Logo({
  className = "",
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  const [artworkFailed, setArtworkFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // The image is server-rendered, so the browser can finish failing to load it
  // before React hydrates and attaches onError — the event is then missed
  // entirely. Checking the element's own state on mount catches that case.
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth === 0) setArtworkFailed(true);
  }, []);

  if (!artworkFailed) {
    return (
      <span
        className={`inline-flex ${
          tone === "light" ? "rounded-lg bg-white px-2.5 py-1.5" : ""
        } ${className}`}
      >
        {/* A plain img rather than next/image: this one asset may be PNG or SVG
            depending on what the client supplies, and it needs an error handler
            to fall back. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={LOGO_FILE}
          alt="Honchar Auto"
          className="h-11 w-auto"
          onError={() => setArtworkFailed(true)}
        />
      </span>
    );
  }

  const navy = tone === "light" ? "#ffffff" : "var(--color-brand-navy)";
  const grey = tone === "light" ? "#ffffffb3" : "var(--color-brand-grey)";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Roof and chevron from the badge — the nod to the remodeling business. */}
      <svg viewBox="0 0 40 34" className="h-9 w-10 shrink-0" aria-hidden="true">
        <path d="M20 3 37 17h-6L20 8.5 9 17H3L20 3Z" fill={navy} />
        <rect x="16" y="13.5" width="3.4" height="3.4" fill={grey} />
        <rect x="20.6" y="13.5" width="3.4" height="3.4" fill={grey} />
        <rect x="16" y="18.1" width="3.4" height="3.4" fill={grey} />
        <rect x="20.6" y="18.1" width="3.4" height="3.4" fill={grey} />
        <path d="M3 24h34L20 33 3 24Z" fill={navy} />
        <path d="M9.5 27.4h21L20 33 9.5 27.4Z" fill={grey} opacity="0.55" />
      </svg>

      <span className="flex flex-col leading-none">
        <span
          className="font-serif text-[1.4rem] font-bold leading-none tracking-[0.01em]"
          style={{ color: navy }}
        >
          HONCHAR
        </span>
        <span
          className="mt-1 text-[0.62rem] font-semibold uppercase leading-none tracking-[0.42em]"
          style={{ color: grey }}
        >
          Auto
        </span>
      </span>
    </span>
  );
}
