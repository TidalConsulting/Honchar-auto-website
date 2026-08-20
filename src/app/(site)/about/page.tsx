import type { Metadata } from "next";
import Link from "next/link";

import { addressLine, cityState, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `${site.name} is a family-owned dealership selling reliable, work-ready trucks and vans${cityState ? ` in ${cityState}` : ""}.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
        We sell the trucks we&apos;d put our own crews in
      </h1>

      <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink-700">
        <p>
          {site.name} is a family-owned dealership built from the same values behind our
          remodeling business — hard work, honesty, and doing things the right way.
        </p>
        <p>
          As contractors, we know vehicles aren&apos;t just for getting around. They&apos;re how
          you make a living. We rely on trucks and vans every day, so we understand what
          actually holds up on the job.
        </p>
        <p>
          That&apos;s why we focus on providing reliable, work-ready vehicles that are carefully
          selected and inspected like we&apos;d use them ourselves. No games, no pressure — just
          straightforward deals and vehicles you can count on.
        </p>
        <p className="font-semibold text-ink-900">
          At {site.name}, you&apos;re not just buying a car — you&apos;re investing in yourself
          and your business.
        </p>
      </div>

      <dl className="mt-12 grid gap-5 sm:grid-cols-3">
        {[
          { label: "Family owned & operated", value: "Since day one" },
          { label: "Run by contractors", value: "Not salespeople" },
          {
            label: "Where we are",
            value: site.address ? `${site.address.city}, ${site.address.state}` : "Southwest Florida",
          },
        ].map((stat) => (
          <div key={stat.label} className="rounded-card border border-ink-200 bg-white p-6 text-center">
            <dd className="text-xl font-extrabold text-ink-900">{stat.value}</dd>
            <dt className="mt-1 text-sm text-ink-600">{stat.label}</dt>
          </div>
        ))}
      </dl>

      <div className="mt-12 rounded-card bg-ink-900 p-8 text-center">
        <h2 className="text-2xl font-extrabold text-white">Come kick the tires</h2>
        {addressLine && <p className="mt-2 text-ink-300">{addressLine}</p>}
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
