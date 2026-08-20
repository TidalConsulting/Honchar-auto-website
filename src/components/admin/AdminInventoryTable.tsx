"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  deleteVehicle,
  duplicateVehicle,
  setVehicleStatus,
  toggleVehicleFeatured,
} from "@/app/actions/vehicles";
import { VehicleIllustration } from "@/components/VehicleIllustration";
import { formatMileage, formatPrice, vehicleTitle } from "@/lib/format";

type Row = {
  id: string;
  slug: string;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  bodyType: string;
  price: number;
  mileage: number | null;
  status: "DRAFT" | "PUBLISHED" | "SOLD";
  featured: boolean;
  stockNumber: string | null;
  exteriorColor: string | null;
  updatedAt: Date;
  images: { url: string }[];
  _count: { leads: number };
};

const STATUS_STYLE: Record<Row["status"], string> = {
  PUBLISHED: "bg-green-100 text-green-800",
  DRAFT: "bg-ink-200 text-ink-700",
  SOLD: "bg-red-100 text-red-700",
};

export function AdminInventoryTable({ vehicles }: { vehicles: Row[] }) {
  const [confirming, setConfirming] = useState<string | null>(null);

  return (
    <div className="overflow-hidden rounded-card border border-ink-200 bg-white">
      <div className="hidden grid-cols-[minmax(0,1fr)_110px_120px_90px_70px_400px] gap-4 border-b border-ink-200 bg-ink-50 px-5 py-3 text-xs font-bold uppercase tracking-wider text-ink-500 lg:grid">
        <span>Vehicle</span>
        <span>Price</span>
        <span>Mileage</span>
        <span>Status</span>
        <span>Leads</span>
        <span className="text-right">Actions</span>
      </div>

      <ul className="divide-y divide-ink-100">
        {vehicles.map((vehicle) => {
          const title = vehicleTitle(vehicle);
          const deleting = confirming === vehicle.id;

          return (
            <li
              key={vehicle.id}
              className="grid grid-cols-1 gap-4 px-5 py-4 lg:grid-cols-[minmax(0,1fr)_110px_120px_90px_70px_400px] lg:items-center"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-ink-100">
                  {vehicle.images[0] ? (
                    <Image
                      src={vehicle.images[0].url}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <VehicleIllustration
                      bodyType={vehicle.bodyType}
                      exteriorColor={vehicle.exteriorColor}
                      className="h-full w-full"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <Link
                    href={`/admin/vehicles/${vehicle.id}`}
                    className="block truncate text-sm font-bold text-ink-900 hover:text-amber-brand-600"
                  >
                    {title}
                  </Link>
                  <p className="truncate text-xs text-ink-500">
                    {vehicle.bodyType}
                    {vehicle.stockNumber ? ` · Stock #${vehicle.stockNumber}` : ""}
                    {vehicle.featured ? " · Featured" : ""}
                  </p>
                </div>
              </div>

              <div className="text-sm font-semibold text-ink-900 lg:font-bold">
                <span className="mr-2 text-xs font-normal text-ink-500 lg:hidden">Price</span>
                {formatPrice(vehicle.price)}
              </div>

              <div className="text-sm text-ink-700">
                <span className="mr-2 text-xs text-ink-500 lg:hidden">Mileage</span>
                {formatMileage(vehicle.mileage)}
              </div>

              <div>
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_STYLE[vehicle.status]}`}
                >
                  {vehicle.status === "PUBLISHED" ? "Live" : vehicle.status === "DRAFT" ? "Draft" : "Sold"}
                </span>
              </div>

              <div className="text-sm text-ink-700">
                <span className="mr-2 text-xs text-ink-500 lg:hidden">Leads</span>
                {vehicle._count.leads}
              </div>

              <div className="flex flex-wrap items-center justify-start gap-1.5 lg:justify-end">
                {deleting ? (
                  <form action={deleteVehicle} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={vehicle.id} />
                    <span className="text-xs font-semibold text-red-700">Delete for good?</span>
                    <button
                      type="submit"
                      className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700"
                    >
                      Yes, delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirming(null)}
                      className="rounded-lg border border-ink-300 px-3 py-1.5 text-xs font-semibold text-ink-700"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <Link
                      href={`/inventory/${vehicle.slug}`}
                      target="_blank"
                      className="rounded-lg border border-ink-300 px-2.5 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ink-50"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/vehicles/${vehicle.id}`}
                      className="rounded-lg border border-ink-300 px-2.5 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ink-50"
                    >
                      Edit
                    </Link>

                    <StatusMenu vehicle={vehicle} />

                    <form action={toggleVehicleFeatured}>
                      <input type="hidden" name="id" value={vehicle.id} />
                      <button
                        type="submit"
                        title={vehicle.featured ? "Remove from featured" : "Feature on the homepage"}
                        className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${
                          vehicle.featured
                            ? "border-amber-brand-300 bg-amber-brand-50 text-amber-brand-700"
                            : "border-ink-300 text-ink-700 hover:bg-ink-50"
                        }`}
                      >
                        ★
                      </button>
                    </form>

                    <form action={duplicateVehicle}>
                      <input type="hidden" name="id" value={vehicle.id} />
                      <button
                        type="submit"
                        title="Duplicate as a draft"
                        className="rounded-lg border border-ink-300 px-2.5 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ink-50"
                      >
                        Copy
                      </button>
                    </form>

                    <button
                      type="button"
                      onClick={() => setConfirming(vehicle.id)}
                      className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function StatusMenu({ vehicle }: { vehicle: Row }) {
  const [sellingPrice, setSellingPrice] = useState<string | null>(null);

  const next =
    vehicle.status === "PUBLISHED"
      ? [{ value: "DRAFT", label: "Unpublish" }]
      : vehicle.status === "DRAFT"
        ? [{ value: "PUBLISHED", label: "Publish" }]
        : [{ value: "PUBLISHED", label: "Relist" }];

  // Marking a vehicle sold is the one moment the final price is known. Asking
  // for it here is what makes "sold at % of list" possible at all — it's
  // optional, so it never blocks recording the sale.
  const markSold = vehicle.status === "PUBLISHED" && (
    sellingPrice === null ? (
      <button
        type="button"
        onClick={() => setSellingPrice("")}
        className="rounded-lg border border-ink-300 px-2.5 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ink-50"
      >
        Mark sold
      </button>
    ) : (
      <form action={setVehicleStatus} className="flex items-center gap-1.5">
        <input type="hidden" name="id" value={vehicle.id} />
        <input type="hidden" name="status" value="SOLD" />
        <label className="flex items-center gap-1">
          <span className="text-xs font-semibold text-ink-600">Sold for</span>
          <input
            name="soldPrice"
            inputMode="numeric"
            autoFocus
            value={sellingPrice}
            onChange={(event) => setSellingPrice(event.target.value.replace(/[^0-9]/g, ""))}
            placeholder={String(vehicle.price)}
            className="w-24 rounded-lg border border-ink-300 px-2 py-1.5 text-xs text-ink-900"
          />
        </label>
        <button
          type="submit"
          className="rounded-lg bg-ink-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-ink-800"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => setSellingPrice(null)}
          className="rounded-lg border border-ink-300 px-2.5 py-1.5 text-xs font-semibold text-ink-700"
        >
          Cancel
        </button>
      </form>
    )
  );

  return (
    <>
      {markSold}
      {next.map((option) => (
        <form key={option.value} action={setVehicleStatus}>
          <input type="hidden" name="id" value={vehicle.id} />
          <input type="hidden" name="status" value={option.value} />
          <button
            type="submit"
            className="rounded-lg border border-ink-300 px-2.5 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ink-50"
          >
            {option.label}
          </button>
        </form>
      ))}
    </>
  );
}
