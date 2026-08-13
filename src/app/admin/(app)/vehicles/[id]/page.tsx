import Link from "next/link";
import { notFound } from "next/navigation";

import { deleteVehicle, updateVehicle } from "@/app/actions/vehicles";
import { VehicleForm } from "@/components/admin/VehicleForm";
import { DeleteVehicleButton } from "@/components/admin/DeleteVehicleButton";
import { formatDateTime, vehicleTitle } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: { images: { orderBy: { position: "asc" } } },
  });

  if (!vehicle) notFound();

  const action = updateVehicle.bind(null, vehicle.id);

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin" className="text-sm font-semibold text-ink-600 hover:text-ink-900">
        ← Back to inventory
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
            {vehicleTitle(vehicle)}
          </h1>
          <p className="mt-1 text-sm text-ink-600">
            Last updated {formatDateTime(vehicle.updatedAt)}
            {vehicle.status === "PUBLISHED" && (
              <>
                {" · "}
                <Link
                  href={`/inventory/${vehicle.slug}`}
                  target="_blank"
                  className="font-semibold text-amber-brand-600 hover:underline"
                >
                  View on site ↗
                </Link>
              </>
            )}
          </p>
        </div>

        <DeleteVehicleButton id={vehicle.id} action={deleteVehicle} />
      </div>

      <div className="mt-6">
        <VehicleForm
          action={action}
          submitLabel="Save changes"
          vehicle={{
            ...vehicle,
            images: vehicle.images.map((image) => ({
              url: image.url,
              alt: image.alt ?? undefined,
            })),
          }}
        />
      </div>
    </div>
  );
}
