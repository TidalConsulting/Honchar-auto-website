import type { Metadata } from "next";

import { LeadForm } from "@/components/LeadForm";
import { VehicleIllustration } from "@/components/VehicleIllustration";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sell or Trade Your Truck",
  description: `Get a real cash offer on your work truck from ${site.name}. Trade it in or take the check.`,
};

export default function SellPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            Get a real offer on your truck — usually the same day
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-600">
            Send us the year, make, model, and hours. We&apos;ll come back with a firm number, not a
            range. Bring it by for a 30-minute look and you can leave with a check or roll the value
            straight into your next unit.
          </p>

          <ol className="mt-8 space-y-5">
            {[
              {
                title: "Tell us what you have",
                body: "Year, make, model, mileage or hours, and anything that's been replaced recently.",
              },
              {
                title: "We put a number on it",
                body: "Based on real auction and retail comps for commercial units — not a consumer book value.",
              },
              {
                title: "Bring it in",
                body: "A 30-minute inspection confirms the offer. Take the check or apply it as a trade.",
              },
            ].map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-brand-500 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <div>
                  <h2 className="text-base font-bold text-ink-900">{step.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-ink-600">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 overflow-hidden rounded-card border border-ink-200 bg-white">
            <VehicleIllustration bodyType="Flatbed" exteriorColor="Blue" className="w-full" />
          </div>
        </div>

        <div className="rounded-card border border-ink-200 bg-white p-6 lg:sticky lg:top-24">
          <LeadForm
            type="TRADE"
            heading="Get my offer"
            subheading="Include the year, make, model, and mileage or hours in your message."
            submitLabel="Get my offer"
            defaultMessage=""
          />
        </div>
      </div>
    </div>
  );
}
