import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { LeadForm } from "@/components/LeadForm";
import { PaymentCalculator } from "@/components/PaymentCalculator";
import { SaveButton } from "@/components/SaveButton";
import { VehicleCard } from "@/components/VehicleCard";
import { VehicleGallery } from "@/components/VehicleGallery";
import { estimatedMonthly } from "@/lib/finance";
import {
  formatHours,
  formatMileage,
  formatNumber,
  formatPrice,
  formatWeight,
  vehicleTitle,
} from "@/lib/format";
import { addressLine, site } from "@/lib/site";
import { getSimilarVehicles, getVehicleBySlug } from "@/lib/vehicles";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) return { title: "Vehicle not found" };

  const title = `${vehicleTitle(vehicle)} — ${formatPrice(vehicle.price)}`;
  return {
    title,
    description:
      vehicle.description?.slice(0, 180) ??
      `${vehicleTitle(vehicle)} ${vehicle.bodyType} for sale at ${site.name} in ${site.address.city}, ${site.address.state}.`,
  };
}

const CONDITION_LABEL: Record<string, string> = {
  NEW: "New",
  USED: "Used",
  CERTIFIED: "Certified",
};

export default async function VehicleDetailPage({ params }: Props) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) notFound();

  const title = vehicleTitle(vehicle);
  const sold = vehicle.status === "SOLD";
  const similar = await getSimilarVehicles(vehicle);

  const drop =
    vehicle.previousPrice && vehicle.previousPrice > vehicle.price
      ? vehicle.previousPrice - vehicle.price
      : null;

  const overview: { label: string; value: string }[] = [
    { label: "Body type", value: vehicle.bodyType },
    { label: "Condition", value: CONDITION_LABEL[vehicle.condition] },
    { label: "Mileage", value: formatMileage(vehicle.mileage) },
    { label: "Engine hours", value: formatHours(vehicle.engineHours) },
    { label: "Exterior", value: vehicle.exteriorColor ?? "—" },
    { label: "Interior", value: vehicle.interiorColor ?? "—" },
  ];

  const powertrain: { label: string; value: string }[] = [
    { label: "Engine", value: vehicle.engine ?? "—" },
    { label: "Fuel type", value: vehicle.fuelType ?? "—" },
    { label: "Transmission", value: vehicle.transmission ?? "—" },
    { label: "Drivetrain", value: vehicle.drivetrain ?? "—" },
    { label: "Axle configuration", value: vehicle.axleConfig ?? "—" },
  ];

  const commercial: { label: string; value: string }[] = [
    { label: "GVWR", value: formatWeight(vehicle.gvwr) },
    { label: "GVWR class", value: vehicle.gvwrClass ? `Class ${vehicle.gvwrClass}` : "—" },
    { label: "CDL required", value: vehicle.cdlRequired ? "Yes" : "No" },
    { label: "Payload capacity", value: formatWeight(vehicle.payloadCapacity) },
    { label: "Towing capacity", value: formatWeight(vehicle.towingCapacity) },
    { label: "Body length", value: vehicle.bodyLength ? `${vehicle.bodyLength} ft` : "—" },
    { label: "PTO", value: vehicle.pto ? "Yes" : "No" },
    { label: "Hydraulics", value: vehicle.hydraulics ? "Yes" : "No" },
  ];

  const identity: { label: string; value: string }[] = [
    { label: "Stock number", value: vehicle.stockNumber ?? "—" },
    { label: "VIN", value: vehicle.vin ?? "—" },
    { label: "Doors", value: vehicle.doors ? formatNumber(vehicle.doors) : "—" },
    { label: "Seats", value: vehicle.seats ? formatNumber(vehicle.seats) : "—" },
    { label: "Located at", value: vehicle.location ?? `${site.address.city}, ${site.address.state}` },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <nav aria-label="Breadcrumb" className="mb-5 text-sm text-ink-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-ink-900">Home</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/inventory" className="hover:text-ink-900">Inventory</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/inventory?body=${encodeURIComponent(vehicle.bodyType)}`}
              className="hover:text-ink-900"
            >
              {vehicle.bodyType}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-ink-800">{title}</li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3 lg:hidden">
            <PriceBlock vehicle={vehicle} drop={drop} title={title} sold={sold} />
          </div>

          <VehicleGallery
            images={vehicle.images}
            bodyType={vehicle.bodyType}
            exteriorColor={vehicle.exteriorColor}
            title={title}
          />

          {vehicle.features.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl font-bold text-ink-900">Equipment &amp; features</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {vehicle.features.map((feature) => (
                  <li
                    key={feature}
                    className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3.5 py-1.5 text-sm font-medium text-ink-800"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-amber-brand-500" fill="none">
                      <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {vehicle.description && (
            <section className="mt-8">
              <h2 className="text-xl font-bold text-ink-900">About this truck</h2>
              <div className="mt-3 space-y-3 text-[0.95rem] leading-relaxed text-ink-700">
                {vehicle.description.split(/\n{2,}/).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>
          )}

          <SpecSection title="Overview" specs={overview} />
          <SpecSection title="Engine & drivetrain" specs={powertrain} />
          <SpecSection title="Commercial specs" specs={commercial} />
          <SpecSection title="Vehicle details" specs={identity} />

          <section className="mt-8 rounded-card border border-ink-200 bg-white p-6">
            <h2 className="text-xl font-bold text-ink-900">How buying works</h2>
            <ol className="mt-4 grid gap-5 sm:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Reserve a walkaround",
                  body: "Tell us when you're free. We'll have it pulled up front, warmed up, and ready to inspect.",
                },
                {
                  step: "2",
                  title: "Test drive & inspect",
                  body: "Bring your mechanic, run the PTO, dump the bed. We hand you the full inspection report.",
                },
                {
                  step: "3",
                  title: "Finance and drive off",
                  body: "Commercial financing decisions typically come back same day. Title work handled in house.",
                },
              ].map((item) => (
                <li key={item.step}>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-brand-500 text-sm font-bold text-white">
                    {item.step}
                  </span>
                  <h3 className="mt-3 text-base font-bold text-ink-900">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-600">{item.body}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="min-w-0">
          <div className="space-y-5 lg:sticky lg:top-24">
            <div className="hidden lg:block">
              <PriceBlock vehicle={vehicle} drop={drop} title={title} sold={sold} />
            </div>

            <div className="rounded-card border border-ink-200 bg-white p-5">
              {sold ? (
                <>
                  <h3 className="text-lg font-bold text-ink-900">This one sold</h3>
                  <p className="mt-1 text-sm text-ink-600">
                    We move units fast. Tell us what you were after and we&apos;ll call you the day
                    something similar lands.
                  </p>
                  <Link
                    href="/inventory"
                    className="mt-4 block rounded-full bg-ink-900 px-5 py-3 text-center text-sm font-bold text-white hover:bg-ink-800"
                  >
                    Browse similar trucks
                  </Link>
                </>
              ) : (
                <LeadForm
                  vehicleId={vehicle.id}
                  heading="Check availability"
                  subheading={`Ask about stock #${vehicle.stockNumber ?? title}`}
                  compact
                  defaultMessage=""
                />
              )}
            </div>

            <div className="rounded-card border border-ink-200 bg-white p-5">
              <h3 className="text-base font-bold text-ink-900">{site.name}</h3>
              <div className="mt-1 flex items-center gap-1.5 text-sm text-ink-600">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-amber-brand-400" fill="currentColor">
                  <path d="m12 3 2.6 5.6 6.1.8-4.5 4.2 1.2 6.1L12 16.8 6.6 19.7l1.2-6.1L3.3 9.4l6.1-.8L12 3Z" />
                </svg>
                {site.rating} · {site.reviewCount} reviews
              </div>
              <p className="mt-3 text-sm text-ink-600">{addressLine}</p>
              <a
                href={site.phoneHref}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-ink-300 px-5 py-3 text-sm font-bold text-ink-900 hover:bg-ink-50"
              >
                Call {site.phone}
              </a>
            </div>

            {!sold && <PaymentCalculator price={vehicle.price} />}
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-extrabold tracking-tight text-ink-900">
              Similar trucks on the lot
            </h2>
            <Link href="/inventory" className="text-sm font-semibold text-amber-brand-600 hover:underline">
              View all →
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((item) => (
              <VehicleCard key={item.id} vehicle={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function PriceBlock({
  vehicle,
  drop,
  title,
  sold,
}: {
  vehicle: { id: string; price: number; msrp: number | null; condition: string; bodyType: string };
  drop: number | null;
  title: string;
  sold: boolean;
}) {
  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-ink-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink-700">
          {CONDITION_LABEL[vehicle.condition]}
        </span>
        <span className="rounded-full bg-ink-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink-700">
          {vehicle.bodyType}
        </span>
        {sold && (
          <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            Sold
          </span>
        )}
        {drop && !sold && (
          <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            {formatPrice(drop)} price drop
          </span>
        )}
      </div>

      <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
        {title}
      </h1>

      <div className="mt-3 flex flex-wrap items-baseline gap-3">
        <p className="text-4xl font-extrabold tracking-tight text-ink-900">
          {formatPrice(vehicle.price)}
        </p>
        {vehicle.msrp && vehicle.msrp > vehicle.price && (
          <p className="text-base text-ink-500 line-through">{formatPrice(vehicle.msrp)}</p>
        )}
      </div>
      <p className="mt-1 text-sm text-ink-600">
        Est. <span className="font-semibold text-ink-900">${estimatedMonthly(vehicle.price).toLocaleString()}/mo</span>{" "}
        with 10% down
      </p>

      <div className="mt-4">
        <SaveButton vehicleId={vehicle.id} withLabel />
      </div>
    </div>
  );
}

function SpecSection({
  title,
  specs,
}: {
  title: string;
  specs: { label: string; value: string }[];
}) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold text-ink-900">{title}</h2>
      <dl className="mt-4 grid gap-x-8 gap-y-0 overflow-hidden rounded-card border border-ink-200 bg-white sm:grid-cols-2">
        {specs.map((spec) => (
          <div
            key={spec.label}
            className="flex items-baseline justify-between gap-4 border-b border-ink-100 px-5 py-3.5 last:border-b-0"
          >
            <dt className="text-sm text-ink-500">{spec.label}</dt>
            <dd className="text-right text-sm font-semibold text-ink-900">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
