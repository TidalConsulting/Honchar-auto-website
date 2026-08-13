"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { signOut } from "@/app/actions/auth";
import { Logo } from "@/components/Logo";

const LINKS = [
  { href: "/admin", label: "Inventory" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/users", label: "Team" },
];

export function AdminNav({
  user,
  newLeads,
}: {
  user: { name: string; email: string; role: string };
  newLeads: number;
}) {
  const pathname = usePathname();

  return (
    <header className="border-b border-ink-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/admin" className="shrink-0">
          <Logo />
        </Link>

        <nav className="flex items-center gap-1">
          {LINKS.map((link) => {
            const active =
              link.href === "/admin"
                ? pathname === "/admin" || pathname.startsWith("/admin/vehicles")
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  active ? "bg-ink-900 text-white" : "text-ink-600 hover:bg-ink-100"
                }`}
              >
                {link.label}
                {link.href === "/admin/leads" && newLeads > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[0.65rem] font-bold ${
                      active ? "bg-white text-ink-900" : "bg-amber-brand-500 text-white"
                    }`}
                  >
                    {newLeads}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden text-sm font-semibold text-ink-600 hover:text-ink-900 sm:block"
          >
            View site ↗
          </Link>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold leading-tight text-ink-900">{user.name}</p>
            <p className="text-xs leading-tight text-ink-500">
              {user.role === "OWNER" ? "Owner" : "Staff"}
            </p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-lg border border-ink-300 px-3 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-50"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
