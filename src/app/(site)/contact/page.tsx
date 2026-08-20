import type { Metadata } from "next";

import { LeadForm } from "@/components/LeadForm";
import { addressLine, cityState, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Call, email, or visit ${site.name}${cityState ? ` in ${cityState}` : ""}.`,
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
          Talk to someone who actually drives these
        </h1>
        <p className="mt-3 text-lg text-ink-600">
          Questions about a specific unit, or looking for something we don&apos;t have listed? Call
          the lot or send a note — we answer both.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-5">
          <InfoCard title="Call or text" body={site.phone} href={site.phoneHref} />
          <InfoCard title="Email" body={site.email} href={`mailto:${site.email}`} />
          {addressLine && <InfoCard title="Visit the lot" body={addressLine} />}

          <div className="rounded-card border border-ink-200 bg-white p-6">
            <h2 className="text-base font-bold text-ink-900">Hours</h2>
            <dl className="mt-3 space-y-2 text-sm">
              {site.hours.map((entry) => (
                <div key={entry.days} className="flex justify-between gap-4">
                  <dt className="text-ink-600">{entry.days}</dt>
                  <dd className="font-semibold text-ink-900">{entry.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="rounded-card border border-ink-200 bg-white p-6">
          <LeadForm
            type="GENERAL"
            heading="Send us a message"
            subheading="We reply within one business hour during open hours."
            submitLabel="Send message"
          />
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, body, href }: { title: string; body: string; href?: string }) {
  return (
    <div className="rounded-card border border-ink-200 bg-white p-6">
      <h2 className="text-sm font-bold uppercase tracking-wider text-ink-500">{title}</h2>
      {href ? (
        <a href={href} className="mt-1 block text-lg font-bold text-ink-900 hover:text-amber-brand-600">
          {body}
        </a>
      ) : (
        <p className="mt-1 text-lg font-bold text-ink-900">{body}</p>
      )}
    </div>
  );
}
