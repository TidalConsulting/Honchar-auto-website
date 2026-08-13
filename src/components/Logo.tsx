export function Logo({
  className = "",
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  const word = tone === "light" ? "#ffffff" : "var(--color-ink-900)";
  const sub = tone === "light" ? "#ffffffb3" : "var(--color-ink-500)";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 44 32" className="h-8 w-11 shrink-0" aria-hidden="true">
        <path
          d="M2 22V9a2 2 0 0 1 2-2h17a2 2 0 0 1 2 2v13H2Z"
          fill="var(--color-amber-brand-400)"
        />
        <path d="M25 22V12h8l7 6v4H25Z" fill="var(--color-ink-800)" />
        <path d="M27 14h5.4l4 3.6H27V14Z" fill="var(--color-amber-brand-200)" />
        <circle cx="12" cy="24" r="5" fill="var(--color-ink-900)" />
        <circle cx="12" cy="24" r="2" fill="var(--color-ink-300)" />
        <circle cx="33" cy="24" r="5" fill="var(--color-ink-900)" />
        <circle cx="33" cy="24" r="2" fill="var(--color-ink-300)" />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className="text-[1.35rem] font-extrabold tracking-tight"
          style={{ color: word }}
        >
          Honchar<span style={{ color: "var(--color-amber-brand-500)" }}>Auto</span>
        </span>
        <span
          className="mt-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.18em]"
          style={{ color: sub }}
        >
          Work Truck Specialists
        </span>
      </span>
    </span>
  );
}
