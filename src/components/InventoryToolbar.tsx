"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { queryString, withParam, withToggledValue } from "@/lib/searchParams";
import { SORT_OPTIONS } from "@/lib/sort";

/** Labels for the removable chips above the results grid. */
const KEY_LABEL: Record<string, string> = {
  q: "Search",
  body: "Body",
  make: "Make",
  condition: "Condition",
  fuel: "Fuel",
  transmission: "Transmission",
  drivetrain: "Drivetrain",
  axle: "Axle",
  class: "Class",
  features: "Equipment",
  priceMin: "Min price",
  priceMax: "Max price",
  yearMin: "From year",
  yearMax: "To year",
  mileageMax: "Max miles",
  hoursMax: "Max hours",
  cdl: "CDL",
};

const MULTI_KEYS = new Set([
  "body",
  "make",
  "condition",
  "fuel",
  "transmission",
  "drivetrain",
  "axle",
  "class",
  "features",
]);

function displayValue(key: string, value: string) {
  if (key === "priceMin" || key === "priceMax") return `$${Number(value).toLocaleString()}`;
  if (key === "mileageMax") return `${Number(value).toLocaleString()} mi`;
  if (key === "hoursMax") return `${Number(value).toLocaleString()} hrs`;
  if (key === "class") return `Class ${value}`;
  if (key === "cdl") return value === "yes" ? "CDL required" : "No CDL";
  if (key === "condition") return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  return value;
}

export function FilterChips() {
  const router = useRouter();
  const params = useSearchParams();

  const chips: { key: string; value: string }[] = [];
  params.forEach((value, key) => {
    if (["sort", "page"].includes(key) || !value) return;
    if (MULTI_KEYS.has(key)) {
      value
        .split(",")
        .filter(Boolean)
        .forEach((entry) => chips.push({ key, value: entry }));
    } else {
      chips.push({ key, value });
    }
  });

  if (chips.length === 0) return null;

  const remove = (key: string, value: string) => {
    const next = MULTI_KEYS.has(key)
      ? withToggledValue(params, key, value)
      : withParam(params, key, null);
    router.push(`/inventory${queryString(next)}`, { scroll: false });
  };

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={`${chip.key}:${chip.value}`}
          type="button"
          onClick={() => remove(chip.key, chip.value)}
          className="inline-flex items-center gap-2 rounded-full border border-ink-300 bg-white py-1.5 pl-3 pr-2 text-sm font-medium text-ink-800 hover:border-ink-400"
        >
          <span className="text-ink-500">{KEY_LABEL[chip.key] ?? chip.key}:</span>
          {displayValue(chip.key, chip.value)}
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-ink-200 text-ink-700">
            <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
          </span>
        </button>
      ))}
      <button
        type="button"
        onClick={() => router.push("/inventory")}
        className="text-sm font-semibold text-amber-brand-600 hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}

export function SortSelect() {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get("sort") ?? "best";

  return (
    <label className="flex items-center gap-2 text-sm text-ink-600">
      <span className="hidden sm:inline">Sort:</span>
      <select
        value={current}
        onChange={(event) =>
          router.push(`/inventory${queryString(withParam(params, "sort", event.target.value))}`, {
            scroll: false,
          })
        }
        className="rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm font-semibold text-ink-900"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Pagination({ page, pageCount }: { page: number; pageCount: number }) {
  const router = useRouter();
  const params = useSearchParams();

  if (pageCount <= 1) return null;

  const go = (target: number) => {
    const next = new URLSearchParams(params);
    if (target <= 1) next.delete("page");
    else next.set("page", String(target));
    router.push(`/inventory${queryString(next)}`);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pages = pageWindow(page, pageCount);

  return (
    <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Pagination">
      <button
        type="button"
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        className="rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm font-semibold text-ink-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>
      {pages.map((entry, index) =>
        entry === null ? (
          <span key={`gap-${index}`} className="px-2 text-ink-400">
            …
          </span>
        ) : (
          <button
            key={entry}
            type="button"
            onClick={() => go(entry)}
            aria-current={entry === page ? "page" : undefined}
            className={`h-9 min-w-9 rounded-lg px-3 text-sm font-semibold ${
              entry === page
                ? "bg-ink-900 text-white"
                : "border border-ink-300 bg-white text-ink-800 hover:bg-ink-50"
            }`}
          >
            {entry}
          </button>
        ),
      )}
      <button
        type="button"
        onClick={() => go(page + 1)}
        disabled={page >= pageCount}
        className="rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm font-semibold text-ink-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </nav>
  );
}

function pageWindow(page: number, pageCount: number): (number | null)[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1);

  const pages = new Set<number>([1, pageCount, page, page - 1, page + 1]);
  const sorted = [...pages].filter((value) => value >= 1 && value <= pageCount).sort((a, b) => a - b);

  const result: (number | null)[] = [];
  let previous = 0;
  for (const value of sorted) {
    if (previous && value - previous > 1) result.push(null);
    result.push(value);
    previous = value;
  }
  return result;
}
