import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { InventoryFilters } from "@/components/InventoryFilters";
import { FilterChips, Pagination, SortSelect } from "@/components/InventoryToolbar";
import { MobileFilterDrawer } from "@/components/MobileFilterDrawer";
import { VehicleCard } from "@/components/VehicleCard";
import { getInventory, parseFilters, type SearchParams } from "@/lib/vehicles";

export const metadata: Metadata = {
  title: "Truck & Equipment Inventory",
  description:
    "Browse dump trucks, flatbeds, box trucks, and heavy-duty work vehicles in stock at Honchar Auto.",
};

export const dynamic = "force-dynamic";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const filters = parseFilters(params);
  const result = await getInventory(filters);

  const heading = filters.bodyType.length === 1 ? `${filters.bodyType[0]}s for sale` : "Trucks & equipment for sale";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            {heading}
          </h1>
          <p className="mt-2 text-ink-600">
            {result.total.toLocaleString()} vehicles on the lot in Tampa, FL — inspected, road
            tested, and priced up front.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Suspense fallback={null}>
            <MobileFilterDrawer
              facets={result.facets}
              priceRange={result.priceRange}
              total={result.total}
            />
          </Suspense>
          <Suspense fallback={null}>
            <SortSelect />
          </Suspense>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-[19rem] shrink-0 lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pb-8 pr-1">
            <Suspense fallback={<FilterSkeleton />}>
              <InventoryFilters
                facets={result.facets}
                priceRange={result.priceRange}
                total={result.total}
              />
            </Suspense>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <Suspense fallback={null}>
            <FilterChips />
          </Suspense>

          {result.vehicles.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {result.vehicles.map((vehicle, index) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} priority={index < 3} />
                ))}
              </div>
              <Suspense fallback={null}>
                <Pagination page={result.page} pageCount={result.pageCount} />
              </Suspense>
              <p className="mt-4 text-center text-sm text-ink-500">
                Showing page {result.page} of {result.pageCount}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-card border border-dashed border-ink-300 bg-white px-6 py-20 text-center">
      <h2 className="text-xl font-bold text-ink-900">No trucks match those filters</h2>
      <p className="mx-auto mt-2 max-w-md text-ink-600">
        Try widening the price or year range, or clear a filter or two. We also source trucks to
        order — tell us what you need and we&apos;ll find it.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/inventory"
          className="rounded-full bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink-800"
        >
          Clear all filters
        </Link>
        <Link
          href="/contact"
          className="rounded-full border border-ink-300 px-5 py-2.5 text-sm font-semibold text-ink-800 hover:bg-ink-50"
        >
          Request a truck
        </Link>
      </div>
    </div>
  );
}

function FilterSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-14 animate-pulse rounded-card border border-ink-200 bg-white" />
      ))}
    </div>
  );
}
