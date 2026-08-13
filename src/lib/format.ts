const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const num = new Intl.NumberFormat("en-US");

export function formatPrice(value: number | null | undefined) {
  if (value === null || value === undefined) return "Call for price";
  return usd.format(value);
}

export function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  return num.format(value);
}

export function formatMileage(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  return `${num.format(value)} mi`;
}

export function formatHours(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  return `${num.format(value)} hrs`;
}

export function formatWeight(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  return `${num.format(value)} lbs`;
}

export function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

/** "2019 Freightliner M2 106 Dump Truck" */
export function vehicleTitle(v: {
  year: number;
  make: string;
  model: string;
  trim?: string | null;
}) {
  return [v.year, v.make, v.model, v.trim].filter(Boolean).join(" ");
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
