import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/url";

export const dynamic = "force-dynamic";

/**
 * Lists every public page plus one entry per listed truck, so a new vehicle
 * becomes discoverable by search engines as soon as it's published.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();

  const staticPages = ["", "/inventory", "/financing", "/sell", "/about", "/contact"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: path === "/inventory" ? ("daily" as const) : ("monthly" as const),
      priority: path === "" ? 1 : path === "/inventory" ? 0.9 : 0.5,
    }),
  );

  let vehicles: { slug: string; updatedAt: Date }[] = [];
  try {
    vehicles = await prisma.vehicle.findMany({
      where: { status: { in: ["PUBLISHED", "SOLD"] } },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 5000,
    });
  } catch {
    // A sitemap is not worth failing a page render over.
  }

  return [
    ...staticPages,
    ...vehicles.map((vehicle) => ({
      url: `${base}/inventory/${vehicle.slug}`,
      lastModified: vehicle.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
