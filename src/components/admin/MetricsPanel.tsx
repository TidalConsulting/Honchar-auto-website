import type { DashboardMetrics, Metric } from "@/lib/metrics";

/**
 * Six numbers, no chart. None of these is a series over time — each is a single
 * current value — so a stat tile is the honest form. A metric with no data
 * shows a dash and says why, rather than a zero that reads like a real result.
 */
export function MetricsPanel({ metrics }: { metrics: DashboardMetrics }) {
  const tiles: { label: string; metric: Metric; format: (value: number) => string }[] = [
    {
      label: "Avg. days on market",
      metric: metrics.avgDaysOnMarket,
      format: (v) => `${v.toLocaleString()}`,
    },
    {
      label: "Avg. sold vs. asking",
      metric: metrics.avgSaleVsList,
      format: (v) => `${v}%`,
    },
    {
      label: "Longest on the lot",
      metric: metrics.longestDaysOnMarket,
      format: (v) => `${v.toLocaleString()} days`,
    },
    {
      label: "Total leads",
      metric: metrics.totalLeads,
      format: (v) => v.toLocaleString(),
    },
    {
      label: "Site visits",
      metric: metrics.visits,
      format: (v) => v.toLocaleString(),
    },
    {
      label: "Avg. time on site",
      metric: metrics.avgMinutesOnSite,
      format: (v) => `${v} min`,
    },
  ];

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h2 className="text-lg font-bold text-ink-900">How the lot is performing</h2>
        <p className="text-xs text-ink-500">
          Visits and time on site cover the last {metrics.windowDays} days
        </p>
      </div>

      <dl className="grid gap-px overflow-hidden rounded-card border border-ink-200 bg-ink-200 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((tile) => (
          <div key={tile.label} className="bg-white px-5 py-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-ink-500">
              {tile.label}
            </dt>
            <dd className="mt-1.5 flex items-baseline gap-2">
              {tile.metric.value === null ? (
                <span className="text-3xl font-extrabold tracking-tight text-ink-300">—</span>
              ) : (
                <span className="text-3xl font-extrabold tracking-tight text-ink-900 tabular-nums">
                  {tile.format(tile.metric.value)}
                </span>
              )}
            </dd>
            <p className="mt-1 text-xs text-ink-500">
              {tile.metric.detail ?? tile.metric.basis}
            </p>
          </div>
        ))}
      </dl>
    </section>
  );
}
