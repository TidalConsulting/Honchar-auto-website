"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { BODY_TYPES } from "@/lib/site";

const QUICK_LINKS = [
  { label: "Under $50k", href: "/inventory?priceMax=50000" },
  { label: "Low miles", href: "/inventory?mileageMax=100000" },
  { label: "No CDL needed", href: "/inventory?cdl=no" },
  { label: "4x4", href: "/inventory?axle=4x4" },
];

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [bodyType, setBodyType] = useState("");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (bodyType) params.set("body", bodyType);
    router.push(`/inventory${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <div>
      <form
        onSubmit={submit}
        className="flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-xl sm:flex-row sm:items-center sm:rounded-full"
      >
        <label className="sr-only" htmlFor="hero-body">
          Body type
        </label>
        <select
          id="hero-body"
          value={bodyType}
          onChange={(event) => setBodyType(event.target.value)}
          className="rounded-xl border-0 bg-ink-100 px-4 py-3 text-sm font-semibold text-ink-900 sm:rounded-full"
        >
          <option value="">All body types</option>
          {BODY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="hero-query">
          Search inventory
        </label>
        <input
          id="hero-query"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Make, model, or keyword"
          className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
        />

        <button
          type="submit"
          className="rounded-xl bg-amber-brand-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-amber-brand-600 sm:rounded-full"
        >
          Search inventory
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-400">
          Popular:
        </span>
        {QUICK_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-ink-200 transition-colors hover:border-amber-brand-400 hover:text-white"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
