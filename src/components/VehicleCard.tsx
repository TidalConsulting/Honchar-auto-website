import Link from "next/link";

import { SaveButton } from "@/components/SaveButton";
import { VehiclePhoto } from "@/components/VehiclePhoto";
import { estimatedMonthly } from "@/lib/finance";
import { formatHours, formatMileage, formatPrice, formatWeight, vehicleTitle } from "@/lib/format";
import { cityState, site } from "@/lib/site";
import type { VehicleCard as VehicleCardData } from "@/lib/vehicles";

const CONDITION_LABEL: Record<string, string> = {
  NEW: "New",
  USED: "Used",
  CERTIFIED: "Certified",
};

export function VehicleCard({
  vehicle,
  priority = false,
}: {
  vehicle: VehicleCardData;
  priority?: boolean;
}) {
  const title = vehicleTitle(vehicle);
  const drop =
    vehicle.previousPrice && vehicle.previousPrice > vehicle.price
      ? vehicle.previousPrice - vehicle.price
      : null;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-card border border-ink-200 bg-white transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full">
        <VehiclePhoto
          images={vehicle.images}
          bodyType={vehicle.bodyType}
          exteriorColor={vehicle.exteriorColor}
          title={title}
          priority={priority}
        />
        <SaveButton vehicleId={vehicle.id} className="absolute right-3 top-3 z-10" />
        {vehicle.featured && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-ink-900/90 px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-white">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <p className="text-[1.6rem] font-bold leading-none tracking-tight text-ink-900">
            {formatPrice(vehicle.price)}
          </p>
          {drop ? (
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-700">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                <path d="M12 20 4 9h16l-8 11Z" />
              </svg>
              {formatPrice(drop)}
            </span>
          ) : vehicle.msrp && vehicle.msrp > vehicle.price ? (
            <span className="text-sm text-ink-500">MSRP {formatPrice(vehicle.msrp)}</span>
          ) : null}
        </div>

        <p className="mt-1.5 text-sm text-ink-500">
          Est. ${estimatedMonthly(vehicle.price).toLocaleString()}/mo
        </p>

        <h3 className="mt-2.5 text-base font-semibold leading-snug text-ink-900">
          <Link href={`/inventory/${vehicle.slug}`} className="after:absolute after:inset-0">
            <span className="text-ink-500">{CONDITION_LABEL[vehicle.condition]}</span> {title}
          </Link>
        </h3>

        <p className="mt-1 text-sm text-ink-500">{vehicle.bodyType}</p>

        <ul className="mt-3 flex flex-wrap gap-1.5">
          {[
            vehicle.mileage !== null ? formatMileage(vehicle.mileage) : null,
            vehicle.engineHours !== null ? formatHours(vehicle.engineHours) : null,
            vehicle.axleConfig,
            vehicle.fuelType,
            vehicle.gvwr ? formatWeight(vehicle.gvwr) : null,
          ]
            .filter(Boolean)
            .slice(0, 4)
            .map((spec) => (
              <li
                key={spec as string}
                className="rounded-md bg-ink-100 px-2 py-1 text-xs font-medium text-ink-700"
              >
                {spec}
              </li>
            ))}
        </ul>

        <div className="mt-auto pt-4">
          <div className="flex items-center gap-1.5 text-xs text-ink-500">
            <span className="font-semibold text-ink-700">{site.name}</span>
            {site.reviews && (
              <>
                <StarIcon className="h-3.5 w-3.5 text-amber-brand-400" />
                <span>{site.reviews.rating}</span>
              </>
            )}
            {(vehicle.location ?? cityState) && (
              <>
                <span aria-hidden="true">·</span>
                <span>{vehicle.location ?? cityState}</span>
              </>
            )}
          </div>
          {vehicle.stockNumber && (
            <p className="mt-1 text-xs text-ink-400">Stock #{vehicle.stockNumber}</p>
          )}
          <span className="relative z-10 mt-3 flex w-full items-center justify-center rounded-full bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors group-hover:bg-amber-brand-500">
            Check Availability
          </span>
        </div>
      </div>
    </article>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="m12 3 2.6 5.6 6.1.8-4.5 4.2 1.2 6.1L12 16.8 6.6 19.7l1.2-6.1L3.3 9.4l6.1-.8L12 3Z" />
    </svg>
  );
}
