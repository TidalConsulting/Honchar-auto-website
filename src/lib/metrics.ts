import "server-only";

import { prisma } from "@/lib/prisma";

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * A metric that has no data yet reports `value: null` rather than 0 — "no sales
 * yet" and "sold at 0% of list" are very different things, and a dashboard that
 * confuses them is worse than one that admits the gap.
 */
export type Metric = {
  value: number | null;
  /** Where the number came from, e.g. "across 4 sold vehicles". */
  basis: string;
  /** Extra context, e.g. which truck has been sitting longest. */
  detail?: string;
};

export type DashboardMetrics = {
  avgDaysOnMarket: Metric;
  avgSaleVsList: Metric;
  longestDaysOnMarket: Metric;
  totalLeads: Metric;
  visits: Metric;
  avgMinutesOnSite: Metric;
  windowDays: number;
};

const plural = (count: number, one: string, many = `${one}s`) =>
  `${count} ${count === 1 ? one : many}`;

export async function getDashboardMetrics(windowDays = 30): Promise<DashboardMetrics> {
  const since = new Date(Date.now() - windowDays * DAY_MS);

  const [sold, live, leadCount, newLeads, views] = await Promise.all([
    prisma.vehicle.findMany({
      where: { status: "SOLD", soldAt: { not: null }, listedAt: { not: null } },
      select: { listedAt: true, soldAt: true, soldPrice: true, originalPrice: true, price: true },
    }),
    prisma.vehicle.findMany({
      where: { status: "PUBLISHED", listedAt: { not: null } },
      orderBy: { listedAt: "asc" },
      take: 1,
      select: { listedAt: true, year: true, make: true, model: true },
    }),
    prisma.lead.count(),
    prisma.lead.count({ where: { createdAt: { gte: since } } }),
    prisma.pageView.findMany({
      where: { createdAt: { gte: since } },
      select: { sessionId: true, dwellMs: true },
    }),
  ]);

  // --- Days on market -------------------------------------------------------
  const daysToSell = sold
    .map((v) => (v.soldAt!.getTime() - v.listedAt!.getTime()) / DAY_MS)
    .filter((days) => days >= 0);

  const avgDaysOnMarket: Metric = daysToSell.length
    ? {
        value: Math.round(daysToSell.reduce((sum, d) => sum + d, 0) / daysToSell.length),
        basis: `across ${plural(daysToSell.length, "sold vehicle")}`,
      }
    : { value: null, basis: "no sales recorded yet" };

  // --- Sale price as a share of the original asking price -------------------
  // Falls back to the current price when a vehicle predates originalPrice being
  // recorded, so older stock still contributes something meaningful.
  const ratios = sold
    .map((v) => {
      const list = v.originalPrice ?? v.price;
      return v.soldPrice && list > 0 ? (v.soldPrice / list) * 100 : null;
    })
    .filter((r): r is number => r !== null);

  const avgSaleVsList: Metric = ratios.length
    ? {
        value: Math.round((ratios.reduce((sum, r) => sum + r, 0) / ratios.length) * 10) / 10,
        basis: `across ${plural(ratios.length, "sale")} with a recorded price`,
      }
    : { value: null, basis: "no sale prices recorded yet" };

  // --- Longest currently on the lot ----------------------------------------
  const oldest = live[0];
  const longestDaysOnMarket: Metric = oldest?.listedAt
    ? {
        value: Math.floor((Date.now() - oldest.listedAt.getTime()) / DAY_MS),
        basis: "longest-listed vehicle still live",
        detail: `${oldest.year} ${oldest.make} ${oldest.model}`,
      }
    : { value: null, basis: "nothing published yet" };

  // --- Leads ----------------------------------------------------------------
  const totalLeads: Metric = {
    value: leadCount,
    basis: "since launch",
    detail: newLeads > 0 ? `${newLeads} in the last ${windowDays} days` : undefined,
  };

  // --- Visits and time on site ---------------------------------------------
  const perSession = new Map<string, number>();
  for (const view of views) {
    perSession.set(view.sessionId, (perSession.get(view.sessionId) ?? 0) + view.dwellMs);
  }

  const visits: Metric = perSession.size
    ? {
        value: perSession.size,
        basis: `in the last ${windowDays} days`,
        detail: `${plural(views.length, "page view")}`,
      }
    : { value: null, basis: "no visits recorded yet" };

  // Only sessions that reported a dwell time count, so sessions cut short by a
  // browser that never fired the beacon don't drag the average toward zero.
  const timed = [...perSession.values()].filter((ms) => ms > 0);
  const avgMinutesOnSite: Metric = timed.length
    ? {
        value: Math.round((timed.reduce((sum, ms) => sum + ms, 0) / timed.length / 60000) * 10) / 10,
        basis: `across ${plural(timed.length, "visit")}`,
      }
    : { value: null, basis: "not enough visits yet" };

  return {
    avgDaysOnMarket,
    avgSaleVsList,
    longestDaysOnMarket,
    totalLeads,
    visits,
    avgMinutesOnSite,
    windowDays,
  };
}
