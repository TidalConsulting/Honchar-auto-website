import Image from "next/image";

/**
 * Brand lockup.
 *
 * Drop the real logo artwork in at `public/logo.svg` (or .png) and set
 * LOGO_FILE below — it then renders everywhere the mark appears. Until then
 * this draws a typographic stand-in using the brand's own navy and grey and
 * the roof motif from the badge, so nothing on the site is off-brand.
 *
 * The supplied artwork sits on a white background, so on the dark footer it is
 * placed on a white chip rather than knocked out — that keeps the vehicle
 * line art intact instead of flattening it to a silhouette.
 */
const LOGO_FILE: string | null = null;
const LOGO_ASPECT = 1500 / 971; // width / height of the supplied badge

export function Logo({
  className = "",
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  if (LOGO_FILE) {
    const height = 44;
    return tone === "light" ? (
      <span className={`inline-flex rounded-lg bg-white px-2.5 py-1.5 ${className}`}>
        <Image
          src={LOGO_FILE}
          alt="Honchar Auto"
          width={Math.round(height * LOGO_ASPECT)}
          height={height}
          priority
        />
      </span>
    ) : (
      <span className={`inline-flex ${className}`}>
        <Image
          src={LOGO_FILE}
          alt="Honchar Auto"
          width={Math.round(height * LOGO_ASPECT)}
          height={height}
          priority
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
        <path
          d="M20 3 37 17h-6L20 8.5 9 17H3L20 3Z"
          fill={navy}
        />
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
