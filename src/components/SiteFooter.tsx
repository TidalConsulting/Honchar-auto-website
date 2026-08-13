import Link from "next/link";

import { Logo } from "@/components/Logo";
import { addressLine, site, BODY_TYPES } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-ink-800 bg-ink-950 text-ink-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-1">
          <Logo tone="light" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-400">
            {site.description}
          </p>
          <a
            href={site.phoneHref}
            className="mt-5 inline-flex rounded-full bg-amber-brand-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-amber-brand-600"
          >
            Call {site.phone}
          </a>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">Shop</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {BODY_TYPES.slice(0, 6).map((type) => (
              <li key={type}>
                <Link
                  href={`/inventory?body=${encodeURIComponent(type)}`}
                  className="text-ink-400 transition-colors hover:text-white"
                >
                  {type}s
                </Link>
              </li>
            ))}
            <li>
              <Link href="/inventory" className="font-semibold text-white hover:underline">
                View all inventory →
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">Company</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              { href: "/about", label: "About Honchar Auto" },
              { href: "/financing", label: "Financing" },
              { href: "/sell", label: "Sell or trade your truck" },
              { href: "/contact", label: "Contact us" },
              { href: "/admin", label: "Staff login" },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ink-400 transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">Visit the lot</h2>
          <address className="mt-4 space-y-1 text-sm not-italic text-ink-400">
            <div>{site.address.street}</div>
            <div>
              {site.address.city}, {site.address.state} {site.address.zip}
            </div>
            <a href={`mailto:${site.email}`} className="mt-2 inline-block hover:text-white">
              {site.email}
            </a>
          </address>
          <dl className="mt-5 space-y-1.5 text-sm">
            {site.hours.map((entry) => (
              <div key={entry.days} className="flex justify-between gap-4">
                <dt className="text-ink-400">{entry.days}</dt>
                <dd className="font-medium text-ink-200">{entry.time}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="border-t border-ink-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="max-w-2xl">
            Prices exclude tax, tag, title, and dealer fees. Payment estimates are for
            illustration only and are not a financing offer. {addressLine}
          </p>
        </div>
      </div>
    </footer>
  );
}
