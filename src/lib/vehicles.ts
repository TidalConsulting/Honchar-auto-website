import "server-only";

import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { SORT_OPTIONS, type SortValue } from "@/lib/sort";

export { SORT_OPTIONS };
export type { SortValue };

export const PAGE_SIZE = 12;

export type SearchParams = Record<string, string | string[] | undefined>;

export type VehicleFilters = {
  q: string;
  bodyType: string[];
  make: string[];
  condition: string[];
  fuelType: string[];
  transmission: string[];
  drivetrain: string[];
  axleConfig: string[];
  gvwrClass: number[];
  features: string[];
  priceMin?: number;
  priceMax?: number;
  yearMin?: number;
  yearMax?: number;
  mileageMax?: number;
  hoursMax?: number;
  cdl?: "yes" | "no";
  sort: SortValue;
  page: number;
};

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  const raw = Array.isArray(value) ? value : [value];
  return raw
    .flatMap((entry) => entry.split(","))
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function toInt(value: string | string[] | undefined): number | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return undefined;
  const parsed = Number.parseInt(raw.replace(/[^0-9-]/g, ""), 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function parseFilters(params: SearchParams): VehicleFilters {
  const sortRaw = Array.isArray(params.sort) ? params.sort[0] : params.sort;
  const sort = SORT_OPTIONS.some((option) => option.value === sortRaw)
    ? (sortRaw as SortValue)
    : "best";

  const cdlRaw = Array.isArray(params.cdl) ? params.cdl[0] : params.cdl;

  return {
    q: (Array.isArray(params.q) ? params.q[0] : params.q)?.trim() ?? "",
    bodyType: toArray(params.body),
    make: toArray(params.make),
    condition: toArray(params.condition).map((c) => c.toUpperCase()),
    fuelType: toArray(params.fuel),
    transmission: toArray(params.transmission),
    drivetrain: toArray(params.drivetrain),
    axleConfig: toArray(params.axle),
    gvwrClass: toArray(params.class)
      .map((value) => Number.parseInt(value, 10))
      .filter((value) => Number.isFinite(value)),
    features: toArray(params.features),
    priceMin: toInt(params.priceMin),
    priceMax: toInt(params.priceMax),
    yearMin: toInt(params.yearMin),
    yearMax: toInt(params.yearMax),
    mileageMax: toInt(params.mileageMax),
    hoursMax: toInt(params.hoursMax),
    cdl: cdlRaw === "yes" || cdlRaw === "no" ? cdlRaw : undefined,
    sort,
    page: Math.max(toInt(params.page) ?? 1, 1),
  };
}

/**
 * Builds the Prisma filter. `skip` omits one facet's own constraint so that
 * facet's option counts stay meaningful (the way cars.com keeps showing you
 * the other makes you could switch to).
 */
export function buildWhere(
  filters: VehicleFilters,
  skip?: keyof VehicleFilters,
): Prisma.VehicleWhereInput {
  const and: Prisma.VehicleWhereInput[] = [{ status: "PUBLISHED" }];

  if (filters.q) {
    const terms = filters.q.split(/\s+/).filter(Boolean).slice(0, 6);
    for (const term of terms) {
      and.push({
        OR: [
          { make: { contains: term, mode: "insensitive" } },
          { model: { contains: term, mode: "insensitive" } },
          { trim: { contains: term, mode: "insensitive" } },
          { bodyType: { contains: term, mode: "insensitive" } },
          { description: { contains: term, mode: "insensitive" } },
          { stockNumber: { contains: term, mode: "insensitive" } },
          { vin: { contains: term, mode: "insensitive" } },
          ...(Number.isFinite(Number(term)) ? [{ year: Number(term) }] : []),
        ],
      });
    }
  }

  if (skip !== "bodyType" && filters.bodyType.length) and.push({ bodyType: { in: filters.bodyType } });
  if (skip !== "make" && filters.make.length) and.push({ make: { in: filters.make } });
  if (skip !== "condition" && filters.condition.length) {
    and.push({ condition: { in: filters.condition as Prisma.EnumConditionFilter["in"] } });
  }
  if (skip !== "fuelType" && filters.fuelType.length) and.push({ fuelType: { in: filters.fuelType } });
  if (skip !== "transmission" && filters.transmission.length) {
    and.push({ transmission: { in: filters.transmission } });
  }
  if (skip !== "drivetrain" && filters.drivetrain.length) {
    and.push({ drivetrain: { in: filters.drivetrain } });
  }
  if (skip !== "axleConfig" && filters.axleConfig.length) {
    and.push({ axleConfig: { in: filters.axleConfig } });
  }
  if (skip !== "gvwrClass" && filters.gvwrClass.length) {
    and.push({ gvwrClass: { in: filters.gvwrClass } });
  }
  if (skip !== "features" && filters.features.length) {
    and.push({ features: { hasEvery: filters.features } });
  }
  if (filters.priceMin !== undefined) and.push({ price: { gte: filters.priceMin } });
  if (filters.priceMax !== undefined) and.push({ price: { lte: filters.priceMax } });
  if (filters.yearMin !== undefined) and.push({ year: { gte: filters.yearMin } });
  if (filters.yearMax !== undefined) and.push({ year: { lte: filters.yearMax } });
  if (filters.mileageMax !== undefined) and.push({ mileage: { lte: filters.mileageMax } });
  if (filters.hoursMax !== undefined) and.push({ engineHours: { lte: filters.hoursMax } });
  if (skip !== "cdl" && filters.cdl) and.push({ cdlRequired: filters.cdl === "yes" });

  return { AND: and };
}

function buildOrderBy(sort: SortValue): Prisma.VehicleOrderByWithRelationInput[] {
  switch (sort) {
    case "price-asc":
      return [{ price: "asc" }, { createdAt: "desc" }];
    case "price-desc":
      return [{ price: "desc" }, { createdAt: "desc" }];
    case "year-desc":
      return [{ year: "desc" }, { price: "asc" }];
    case "year-asc":
      return [{ year: "asc" }, { price: "asc" }];
    case "mileage-asc":
      return [{ mileage: "asc" }, { price: "asc" }];
    case "newest":
      return [{ createdAt: "desc" }];
    case "best":
    default:
      return [{ featured: "desc" }, { createdAt: "desc" }];
  }
}

export const vehicleCardSelect = {
  id: true,
  slug: true,
  year: true,
  make: true,
  model: true,
  trim: true,
  bodyType: true,
  condition: true,
  price: true,
  msrp: true,
  previousPrice: true,
  mileage: true,
  engineHours: true,
  fuelType: true,
  drivetrain: true,
  axleConfig: true,
  gvwr: true,
  cdlRequired: true,
  exteriorColor: true,
  location: true,
  featured: true,
  stockNumber: true,
  images: { orderBy: { position: "asc" }, take: 5, select: { url: true, alt: true } },
} satisfies Prisma.VehicleSelect;

export type VehicleCard = Prisma.VehicleGetPayload<{ select: typeof vehicleCardSelect }>;

export type FacetCount = { value: string; count: number };

export type InventoryResult = {
  vehicles: VehicleCard[];
  total: number;
  page: number;
  pageCount: number;
  facets: {
    bodyType: FacetCount[];
    make: FacetCount[];
    condition: FacetCount[];
    fuelType: FacetCount[];
    drivetrain: FacetCount[];
    axleConfig: FacetCount[];
    gvwrClass: FacetCount[];
    cdl: FacetCount[];
  };
  priceRange: { min: number; max: number };
};

async function facetCounts(
  field: "bodyType" | "make" | "fuelType" | "drivetrain" | "axleConfig" | "condition",
  filters: VehicleFilters,
): Promise<FacetCount[]> {
  const rows = await prisma.vehicle.groupBy({
    by: [field],
    where: buildWhere(filters, field),
    _count: { _all: true },
  });

  return rows
    .filter((row) => row[field] !== null)
    .map((row) => ({ value: String(row[field]), count: row._count._all }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

export async function getInventory(filters: VehicleFilters): Promise<InventoryResult> {
  const where = buildWhere(filters);

  const [total, vehicles, bodyType, make, condition, fuelType, drivetrain, axleConfig, classRows, cdlRows, aggregate] =
    await Promise.all([
      prisma.vehicle.count({ where }),
      prisma.vehicle.findMany({
        where,
        orderBy: buildOrderBy(filters.sort),
        skip: (filters.page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        select: vehicleCardSelect,
      }),
      facetCounts("bodyType", filters),
      facetCounts("make", filters),
      facetCounts("condition", filters),
      facetCounts("fuelType", filters),
      facetCounts("drivetrain", filters),
      facetCounts("axleConfig", filters),
      prisma.vehicle.groupBy({
        by: ["gvwrClass"],
        where: buildWhere(filters, "gvwrClass"),
        _count: { _all: true },
      }),
      prisma.vehicle.groupBy({
        by: ["cdlRequired"],
        where: buildWhere(filters, "cdl"),
        _count: { _all: true },
      }),
      prisma.vehicle.aggregate({
        where: { status: "PUBLISHED" },
        _min: { price: true },
        _max: { price: true },
      }),
    ]);

  return {
    vehicles,
    total,
    page: filters.page,
    pageCount: Math.max(Math.ceil(total / PAGE_SIZE), 1),
    facets: {
      bodyType,
      make,
      condition,
      fuelType,
      drivetrain,
      axleConfig,
      gvwrClass: classRows
        .filter((row) => row.gvwrClass !== null)
        .map((row) => ({ value: String(row.gvwrClass), count: row._count._all }))
        .sort((a, b) => Number(a.value) - Number(b.value)),
      cdl: cdlRows
        .map((row) => ({ value: row.cdlRequired ? "yes" : "no", count: row._count._all }))
        .sort((a, b) => a.value.localeCompare(b.value)),
    },
    priceRange: {
      min: aggregate._min.price ?? 0,
      max: aggregate._max.price ?? 250000,
    },
  };
}

export async function getVehicleBySlug(slug: string) {
  return prisma.vehicle.findFirst({
    where: { slug, status: { in: ["PUBLISHED", "SOLD"] } },
    include: { images: { orderBy: { position: "asc" } } },
  });
}

export async function getSimilarVehicles(vehicle: {
  id: string;
  bodyType: string;
  price: number;
}) {
  return prisma.vehicle.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: vehicle.id },
      OR: [
        { bodyType: vehicle.bodyType },
        { price: { gte: vehicle.price * 0.7, lte: vehicle.price * 1.3 } },
      ],
    },
    orderBy: [{ bodyType: vehicle.bodyType ? "asc" : "desc" }, { createdAt: "desc" }],
    take: 4,
    select: vehicleCardSelect,
  });
}

export async function getFeaturedVehicles(take = 8) {
  return prisma.vehicle.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take,
    select: vehicleCardSelect,
  });
}

export async function getBodyTypeCounts() {
  const rows = await prisma.vehicle.groupBy({
    by: ["bodyType"],
    where: { status: "PUBLISHED" },
    _count: { _all: true },
  });
  return new Map(rows.map((row) => [row.bodyType, row._count._all]));
}

export async function getInventoryStats() {
  const [count, aggregate] = await Promise.all([
    prisma.vehicle.count({ where: { status: "PUBLISHED" } }),
    prisma.vehicle.aggregate({
      where: { status: "PUBLISHED" },
      _min: { price: true },
    }),
  ]);
  return { count, startingPrice: aggregate._min.price ?? 0 };
}
