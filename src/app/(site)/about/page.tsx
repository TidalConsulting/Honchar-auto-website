import type { Metadata } from "next";
import Link from "next/link";

import { addressLine, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `${site.name} sells inspected work trucks and construction vehicles in ${site.address.city}, ${site.address.state}.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
        We sell the trucks we&apos;d put our own crews in
      </h1>

      <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink-700">
        <p>
          {site.name} started because buying a work truck was miserable. Auction units with no
          history. Dealers who&apos;d never run a PTO in their lives. Prices that moved every time
          you asked. Meanwhile a truck sitting in the shop is a crew standing around getting paid to
          do nothing.
        </p>
        <p>
          So we built the lot we wanted to buy from. Every unit gets a 150-point mechanical and
          safety inspection before it&apos;s listed, and the report goes in your hands before you
          sign anything. The price on the listing is the price on the paperwork — no prep fee, no
          reconditioning fee, no doc-fee surprise at the desk.
        </p>
        <p>
          We specialize in construction and vocational equipment: dump trucks, flatbeds, roll-offs,
          service bodies, mixers, and the pickups that pull them. If we don&apos;t have what you
          need, tell us and we&apos;ll go find it.
        </p>
      </div>

      <dl className="mt-12 grid gap-5 sm:grid-cols-3">
        {[
          { label: "Point inspection", value: "150" },
          { label: "Customer rating", value: `${site.rating}★` },
          { label: "Reviews", value: String(site.reviewCount) },
        ].map((stat) => (
          <div key={stat.label} className="rounded-card border border-ink-200 bg-white p-6 text-center">
            <dd className="text-3xl font-extrabold text-ink-900">{stat.value}</dd>
            <dt className="mt-1 text-sm text-ink-600">{stat.label}</dt>
          </div>
        ))}
      </dl>

      <div className="mt-12 rounded-card bg-ink-900 p-8 text-center">
        <h2 className="text-2xl font-extrabold text-white">Come kick the tires</h2>
        <p className="mt-2 text-ink-300">{addressLine}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/inventory"
            className="rounded-full bg-amber-brand-500 px-6 py-3 text-sm font-bold text-white hover:bg-amber-brand-600"
          >
            Browse inventory
          </Link>
          <a
            href={site.phoneHref}
            className="rounded-full border border-white/25 px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
          >
            Call {site.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
