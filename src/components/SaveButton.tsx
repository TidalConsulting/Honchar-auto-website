"use client";

import { useSaved } from "@/lib/useSaved";

export function SaveButton({
  vehicleId,
  className = "",
  withLabel = false,
}: {
  vehicleId: string;
  className?: string;
  withLabel?: boolean;
}) {
  const { isSaved, toggle, ready } = useSaved();
  const saved = ready && isSaved(vehicleId);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(vehicleId);
      }}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved" : "Save this vehicle"}
      className={
        withLabel
          ? `inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${
              saved
                ? "border-amber-brand-300 bg-amber-brand-50 text-amber-brand-700"
                : "border-ink-200 text-ink-700 hover:bg-ink-50"
            } ${className}`
          : `inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:bg-white ${className}`
      }
    >
      <svg
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px]"
        fill={saved ? "var(--color-amber-brand-500)" : "none"}
        stroke={saved ? "var(--color-amber-brand-500)" : "currentColor"}
        strokeWidth="1.9"
      >
        <path d="M12 20.3 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 0 1 19.4 13L12 20.3Z" strokeLinejoin="round" />
      </svg>
      {withLabel && <span>{saved ? "Saved" : "Save"}</span>}
    </button>
  );
}
