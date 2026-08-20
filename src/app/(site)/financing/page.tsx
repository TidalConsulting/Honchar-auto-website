import type { Metadata } from "next";
import Link from "next/link";

import { LeadForm } from "@/components/LeadForm";
import { PaymentCalculator } from "@/components/PaymentCalculator";
import { getInventoryStats } from "@/lib/vehicles";

export const metadata: Metadata = {
  title: "Commercial Truck Financing",
  description:
    "Financing for owner-operators, small fleets, and contractors. Same-day decisions on most commercial truck applications.",
};

export const dynamic = "force-dynamic";

export default async function FinancingPage() {
  const stats = await getInventoryStats();
  const samplePrice = stats.startingPrice > 0 ? Math.round(stats.startingPrice * 1.4) : 65000;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
          Financing built around how contractors actually get paid
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-600">
          Bank underwriters see a dump truck and get nervous. Our lenders don&apos;t — they finance
          work trucks all day. Seasonal cash flow, one-truck LLCs, and credit that took a hit in a
          slow winter are all things we can work with.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {[
          {
            title: "Same-day decisions",
            body: "Most applications come back within a few hours during business days.",
          },
          {
            title: "Terms to 84 months",
            body: "Stretch the payment across the life of the truck instead of one hard season.",
          },
          {
            title: "New business OK",
            body: "Under two years in business? We have lenders who specialize in exactly that.",
          },
        ].map((item) => (
          <div key={item.title} className="rounded-card border border-ink-200 bg-white p-6">
            <h2 className="text-base font-bold text-ink-900">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <PaymentCalculator price={samplePrice} editablePrice />

        <div className="space-y-6">
          <div className="rounded-card border border-ink-200 bg-white p-6">
            <LeadForm
              type="FINANCING"
              heading="Start a pre-approval"
              subheading="No hard credit pull to get started — we'll reach out to collect the rest."
              submitLabel="Request pre-approval"
              defaultMessage=""
            />
          </div>

          <div className="rounded-card border border-ink-200 bg-white p-6">
            <h2 className="text-base font-bold text-ink-900">What to have ready</h2>
            <ul className="mt-3 space-y-2 text-sm text-ink-600">
              {[
                "Driver's license and CDL (if applicable)",
                "Business name, EIN, and years in operation",
                "Three months of business bank statements",
                "Proof of commercial insurance",
              ].map((item) => (
                <li key={item} className="flex gap-2.5">
                  <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-amber-brand-500" fill="none">
                    <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/inventory"
              className="mt-5 inline-flex rounded-full bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink-800"
            >
              Browse what you can finance
            </Link>
          </div>
        </div>
      </div>

      <p className="mt-10 max-w-3xl text-xs leading-relaxed text-ink-500">
        All financing is subject to lender approval. Rates, terms, and payment estimates shown on
        this site are illustrations only and do not constitute an offer of credit. Actual terms
        depend on credit history, business financials, down payment, and the vehicle financed.
      </p>
    </div>
  );
}
