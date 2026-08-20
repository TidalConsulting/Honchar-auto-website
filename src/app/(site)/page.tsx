import Link from "next/link";

import { HeroSearch } from "@/components/HeroSearch";
import { VehicleCard } from "@/components/VehicleCard";
import { VehicleIllustration } from "@/components/VehicleIllustration";
import { formatPrice } from "@/lib/format";
import { BODY_TYPES, site } from "@/lib/site";
import { getBodyTypeCounts, getFeaturedVehicles, getInventoryStats } from "@/lib/vehicles";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, counts, stats] = await Promise.all([
    getFeaturedVehicles(8),
    getBodyTypeCounts(),
    getInventoryStats(),
  ]);

  return (
    <>
      <Hero count={stats.count} startingPrice={stats.startingPrice} />
      <BodyTypeTiles counts={counts} />
      <FeaturedRow vehicles={featured} />
      <ValueProps />
      <SellCta />
    </>
  );
}

function Hero({ count, startingPrice }: { count: number; startingPrice: number }) {
  return (
    <section className="relative overflow-hidden bg-ink-950">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 22px, #ffa62b 22px, #ffa62b 44px)",
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:px-8 lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-brand-500/40 bg-amber-brand-500/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-brand-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-brand-400" />
            {count} work trucks in stock
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Trucks that show up
            <br />
            <span className="text-amber-brand-400">ready to work.</span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-300">
            Pickups, cargo vans, dump trucks, and flatbeds — picked and inspected by contractors
            who run this stuff every day. Straightforward deals, no pressure, no wasted job days.
          </p>

          <div className="mt-8 max-w-xl">
            <HeroSearch />
          </div>

          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-6">
            {[
              { label: "In stock now", value: String(count) },
              {
                label: "Starting at",
                value: startingPrice ? formatPrice(startingPrice) : "—",
              },
              site.reviews
                ? { label: "Customer rating", value: `${site.reviews.rating}★` }
                : { label: "Family owned", value: site.address?.city ?? "Local" },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="text-xs uppercase tracking-wider text-ink-400">{stat.label}</dt>
                <dd className="mt-1 text-2xl font-bold text-white">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative hidden lg:block">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl">
            <VehicleIllustration bodyType="Dump Truck" exteriorColor="Yellow" className="w-full" />
          </div>
          <div className="absolute -bottom-6 -left-6 rounded-xl border border-white/10 bg-ink-900 px-5 py-4 shadow-xl">
            <p className="text-xs uppercase tracking-wider text-ink-400">Every truck includes</p>
            <p className="mt-1 text-sm font-bold text-white">
              Inspected like we&apos;d use it ourselves
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function BodyTypeTiles({ counts }: { counts: Map<string, number> }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
            Shop by body type
          </h2>
          <p className="mt-2 text-ink-600">Pick the shape of the job and we&apos;ll narrow it down.</p>
        </div>
        <Link
          href="/inventory"
          className="hidden shrink-0 text-sm font-semibold text-amber-brand-600 hover:underline sm:block"
        >
          View all inventory →
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {BODY_TYPES.map((type) => (
          <Link
            key={type}
            href={`/inventory?body=${encodeURIComponent(type)}`}
            className="group flex flex-col items-center rounded-card border border-ink-200 bg-white p-4 text-center transition-all hover:-translate-y-0.5 hover:border-amber-brand-300 hover:shadow-md"
          >
            <VehicleIllustration
              bodyType={type}
              exteriorColor="Silver"
              className="h-24 w-full rounded-lg"
            />
            <span className="mt-3 text-sm font-semibold text-ink-900 group-hover:text-amber-brand-600">
              {type}
            </span>
            <span className="mt-0.5 text-xs text-ink-500">
              {counts.get(type) ?? 0} available
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function FeaturedRow({
  vehicles,
}: {
  vehicles: Awaited<ReturnType<typeof getFeaturedVehicles>>;
}) {
  if (vehicles.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-card border border-dashed border-ink-300 bg-white px-6 py-16 text-center">
          <h2 className="text-xl font-bold text-ink-900">Inventory is being loaded in</h2>
          <p className="mt-2 text-ink-600">
            Sign in to the <Link href="/admin" className="font-semibold text-amber-brand-600 hover:underline">staff dashboard</Link>{" "}
            to add your first truck.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
              Fresh on the lot
            </h2>
            <p className="mt-2 text-ink-600">Recently inspected and ready for a walkaround.</p>
          </div>
          <Link
            href="/inventory"
            className="hidden shrink-0 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink-800 sm:block"
          >
            See all {vehicles.length > 0 ? "inventory" : ""}
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {vehicles.slice(0, 8).map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        <Link
          href="/inventory"
          className="mt-8 block rounded-full bg-ink-900 px-5 py-3 text-center text-sm font-semibold text-white sm:hidden"
        >
          See all inventory
        </Link>
      </div>
    </section>
  );
}

function ValueProps() {
  const items = [
    {
      title: "Inspected before it&rsquo;s listed",
      body: "We&rsquo;re contractors. Every truck and van is picked and checked over the way we&rsquo;d check one we were going to run ourselves.",
      icon: <ShieldIcon />,
    },
    {
      title: "No games, no pressure",
      body: "The number on the listing is the number on the paperwork. Straightforward deals, and nobody chasing you around the lot.",
      icon: <TagIcon />,
    },
    {
      title: "Financing built for contractors",
      body: "Commercial lenders who understand seasonal cash flow, owner-operators, and small fleets.",
      icon: <BankIcon />,
    },
    {
      title: "We buy trucks too",
      body: "Bring in your old unit for a real offer. Trade it toward the next one or take the check — no obligation.",
      icon: <SwapIcon />,
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
        Why crews buy from {site.name}
      </h2>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.title} className="rounded-card border border-ink-200 bg-white p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-brand-50 text-amber-brand-600">
              {item.icon}
            </div>
            <h3
              className="mt-4 text-base font-bold text-ink-900"
              dangerouslySetInnerHTML={{ __html: item.title }}
            />
            <p className="mt-2 text-sm leading-relaxed text-ink-600">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SellCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start gap-6 rounded-2xl bg-ink-900 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Sitting on a truck you don&apos;t run anymore?
          </h2>
          <p className="mt-2 max-w-2xl text-ink-300">
            Send us the year, make, and hours. You&apos;ll have a real cash offer the same day —
            trade it toward anything on the lot or just take the check.
          </p>
        </div>
        <Link
          href="/sell"
          className="shrink-0 rounded-full bg-amber-brand-500 px-7 py-3.5 text-base font-bold text-white transition-colors hover:bg-amber-brand-600"
        >
          Get my offer
        </Link>
      </div>
    </section>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
      <path d="M12 3 5 6v6c0 4.4 3 8.2 7 9 4-.8 7-4.6 7-9V6l-7-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
      <path d="M4 12.5V5a1 1 0 0 1 1-1h7.5L20 11.5 12.5 19 4 12.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

function BankIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
      <path d="M3 10 12 4l9 6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M5 10v8M10 10v8M14 10v8M19 10v8M3 20h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SwapIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
      <path d="M4 8h13l-3-3M20 16H7l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
