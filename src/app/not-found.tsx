import Link from "next/link";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-24">
        <div className="max-w-lg text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-amber-brand-600">
            Page not found
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            That one&apos;s not on the lot
          </h1>
          <p className="mt-3 text-ink-600">
            The page may have moved, or the truck you were looking at has been sold. The full
            inventory is a click away.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/inventory"
              className="rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white hover:bg-ink-800"
            >
              Browse inventory
            </Link>
            <a
              href={site.phoneHref}
              className="rounded-full border border-ink-300 px-6 py-3 text-sm font-semibold text-ink-800 hover:bg-ink-50"
            >
              Call {site.phone}
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
