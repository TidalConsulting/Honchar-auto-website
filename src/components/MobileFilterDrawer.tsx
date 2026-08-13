"use client";

import { useEffect, useState } from "react";

import { InventoryFilters } from "@/components/InventoryFilters";
import type { InventoryResult } from "@/lib/vehicles";

export function MobileFilterDrawer(props: {
  facets: InventoryResult["facets"];
  priceRange: InventoryResult["priceRange"];
  total: number;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-ink-300 bg-white px-4 py-2 text-sm font-semibold text-ink-900 lg:hidden"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
          <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Filters
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink-950/50"
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(24rem,92vw)] flex-col bg-ink-50 shadow-xl">
            <div className="flex items-center justify-between border-b border-ink-200 bg-white px-4 py-4">
              <h2 className="text-lg font-bold text-ink-900">Filters</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink-200 text-ink-700"
                aria-label="Close filters"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <InventoryFilters {...props} />
            </div>

            <div className="border-t border-ink-200 bg-white p-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full rounded-full bg-ink-900 py-3 text-sm font-bold text-white"
              >
                Show {props.total.toLocaleString()} results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
