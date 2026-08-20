import Link from "next/link";

import { AdminInventoryTable } from "@/components/admin/AdminInventoryTable";
import { FlashMessage } from "@/components/admin/FlashMessage";
import { formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "PUBLISHED", label: "Live" },
  { value: "DRAFT", label: "Drafts" },
  { value: "SOLD", label: "Sold" },
] as const;

export default async function AdminInventoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const statusParam = typeof params.status === "string" ? params.status : "all";
  const query = (typeof params.q === "string" ? params.q : "").trim();

  const where = {
    ...(statusParam !== "all" && ["PUBLISHED", "DRAFT", "SOLD"].includes(statusParam)
      ? { status: statusParam as "PUBLISHED" | "DRAFT" | "SOLD" }
      : {}),
    ...(query
      ? {
          OR: [
            { make: { contains: query, mode: "insensitive" as const } },
            { model: { contains: query, mode: "insensitive" as const } },
            { stockNumber: { contains: query, mode: "insensitive" as const } },
            { vin: { contains: query, mode: "insensitive" as const } },
            { bodyType: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [vehicles, counts, totals] = await Promise.all([
    prisma.vehicle.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      take: 200,
      include: { images: { orderBy: { position: "asc" }, take: 1 }, _count: { select: { leads: true } } },
    }),
    prisma.vehicle.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.vehicle.aggregate({ where: { status: "PUBLISHED" }, _sum: { price: true } }),
  ]);

  const countFor = (status: string) =>
    status === "all"
      ? counts.reduce((sum, row) => sum + row._count._all, 0)
      : (counts.find((row) => row.status === status)?._count._all ?? 0);

  return (
    <div>
      <FlashMessage />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
            Inventory
          </h1>
          <p className="mt-1 text-ink-600">
            {countFor("PUBLISHED")} live listings ·{" "}
            {formatPrice(totals._sum.price ?? 0)} total lot value
          </p>
        </div>
        <Link
          href="/admin/vehicles/new"
          className="inline-flex items-center gap-2 rounded-full bg-amber-brand-500 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-amber-brand-600"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
          Add a vehicle
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          {STATUS_TABS.map((tab) => {
            const active = statusParam === tab.value;
            const href =
              tab.value === "all"
                ? `/admin${query ? `?q=${encodeURIComponent(query)}` : ""}`
                : `/admin?status=${tab.value}${query ? `&q=${encodeURIComponent(query)}` : ""}`;
            return (
              <Link
                key={tab.value}
                href={href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-ink-900 text-white"
                    : "border border-ink-300 bg-white text-ink-700 hover:bg-ink-100"
                }`}
              >
                {tab.label}
                <span className={active ? "ml-1.5 text-ink-300" : "ml-1.5 text-ink-400"}>
                  {countFor(tab.value)}
                </span>
              </Link>
            );
          })}
        </div>

        <form className="ml-auto flex items-center gap-2" action="/admin">
          {statusParam !== "all" && <input type="hidden" name="status" value={statusParam} />}
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search make, model, stock #, VIN"
            className="h-12 w-64 rounded-lg border border-ink-300 bg-white px-3.5 text-base text-ink-900 placeholder:text-ink-400 focus:border-amber-brand-400"
          />
          <button
            type="submit"
            className="h-12 rounded-lg bg-ink-900 px-5 text-base font-semibold text-white hover:bg-ink-800"
          >
            Search
          </button>
        </form>
      </div>

      <div className="mt-6">
        {vehicles.length === 0 ? (
          <div className="rounded-card border border-dashed border-ink-300 bg-white px-6 py-20 text-center">
            <h2 className="text-lg font-bold text-ink-900">
              {query || statusParam !== "all" ? "Nothing matches that" : "No vehicles yet"}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-ink-600">
              {query || statusParam !== "all"
                ? "Try a different search or switch tabs."
                : "Add your first truck and it will appear on the website immediately."}
            </p>
            <Link
              href="/admin/vehicles/new"
              className="mt-6 inline-flex rounded-full bg-amber-brand-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-brand-600"
            >
              Add a vehicle
            </Link>
          </div>
        ) : (
          <AdminInventoryTable vehicles={vehicles} />
        )}
      </div>
    </div>
  );
}
