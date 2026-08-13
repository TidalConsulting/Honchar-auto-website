import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { vehicleCardSelect } from "@/lib/vehicles";

/** Used by the saved-vehicles page, which keeps its list in localStorage. */
export async function GET(request: Request) {
  const ids = (new URL(request.url).searchParams.get("ids") ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, 60);

  if (ids.length === 0) return NextResponse.json({ vehicles: [] });

  const vehicles = await prisma.vehicle.findMany({
    where: { id: { in: ids }, status: { in: ["PUBLISHED", "SOLD"] } },
    select: vehicleCardSelect,
  });

  // Preserve the order the shopper saved them in.
  const order = new Map(ids.map((id, index) => [id, index]));
  vehicles.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));

  return NextResponse.json({ vehicles });
}
