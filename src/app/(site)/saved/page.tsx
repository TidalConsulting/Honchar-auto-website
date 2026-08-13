"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { VehicleCard } from "@/components/VehicleCard";
import { useSaved } from "@/lib/useSaved";
import type { VehicleCard as VehicleCardData } from "@/lib/vehicles";

export default function SavedPage() {
  const { ids, ready } = useSaved();
  const key = ids.join(",");
  const [cache, setCache] = useState<{ key: string; vehicles: VehicleCardData[] } | null>(null);

  useEffect(() => {
    if (!ready || !key) return;

    const controller = new AbortController();
    fetch(`/api/vehicles?ids=${key}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((data) => setCache({ key, vehicles: data.vehicles ?? [] }))
      .catch(() => {
        if (!controller.signal.aborted) setCache({ key, vehicles: [] });
      });

    return () => controller.abort();
  }, [key, ready]);

  // null means "still loading"; an empty array means "nothing saved".
  const vehicles = !ready ? null : !key ? [] : cache?.key === key ? cache.vehicles : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
        Saved trucks
      </h1>
      <p className="mt-2 text-ink-600">
        Saved on this device. Tap the heart on any listing to add it here.
      </p>

      {vehicles === null ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-96 animate-pulse rounded-card border border-ink-200 bg-white" />
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="mt-8 rounded-card border border-dashed border-ink-300 bg-white px-6 py-20 text-center">
          <h2 className="text-xl font-bold text-ink-900">Nothing saved yet</h2>
          <p className="mx-auto mt-2 max-w-md text-ink-600">
            Browse the lot and heart the ones worth a second look.
          </p>
          <Link
            href="/inventory"
            className="mt-6 inline-flex rounded-full bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink-800"
          >
            Browse inventory
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
}
