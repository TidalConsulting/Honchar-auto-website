"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Logo } from "@/components/Logo";
import { site } from "@/lib/site";

const NAV = [
  { href: "/inventory", label: "Shop Inventory" },
  { href: "/financing", label: "Financing" },
  { href: "/sell", label: "Sell / Trade" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  // Tracking which route the menu was opened on closes it automatically on navigation.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link href="/" aria-label={`${site.name} home`}>
          <Logo />
        </Link>

        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active =
              item.href === "/inventory"
                ? pathname.startsWith("/inventory")
                : pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-ink-100 text-ink-900"
                    : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <a
            href={site.phoneHref}
            className="hidden items-center gap-2 rounded-full border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-800 transition-colors hover:border-ink-300 hover:bg-ink-50 sm:inline-flex"
          >
            <PhoneIcon className="h-4 w-4 text-amber-brand-500" />
            {site.phone}
          </a>
          <Link
            href="/inventory"
            className="hidden rounded-full bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink-800 md:inline-flex"
          >
            Browse Trucks
          </Link>
          <button
            type="button"
            onClick={() => setOpenedOn(open ? null : pathname)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-ink-200 text-ink-700 lg:hidden"
            aria-expanded={open}
            aria-label="Toggle navigation menu"
          >
            {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-ink-200 bg-white lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-3 text-base font-semibold text-ink-800 hover:bg-ink-50"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={site.phoneHref}
              className="mt-2 flex items-center justify-center gap-2 rounded-full bg-amber-brand-500 px-4 py-3 text-base font-bold text-white"
            >
              <PhoneIcon className="h-4 w-4" />
              Call {site.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M6.6 3h-.9A2.7 2.7 0 0 0 3 5.7c0 8.4 6.9 15.3 15.3 15.3a2.7 2.7 0 0 0 2.7-2.7v-.9a1.2 1.2 0 0 0-.9-1.16l-3.4-.85a1.2 1.2 0 0 0-1.24.45l-.9 1.2a12.3 12.3 0 0 1-5.4-5.4l1.2-.9a1.2 1.2 0 0 0 .45-1.24l-.85-3.4A1.2 1.2 0 0 0 6.6 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
