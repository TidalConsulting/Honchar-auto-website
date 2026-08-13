"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { slugify, vehicleTitle } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { vehicleSchema, type VehicleInput } from "@/lib/validation";

export type VehicleFormState = {
  status: "idle" | "error";
  message?: string;
  errors?: Record<string, string>;
};

function readForm(formData: FormData) {
  const bool = (key: string) => formData.get(key) === "on" || formData.get(key) === "true";

  return {
    year: formData.get("year"),
    make: formData.get("make"),
    model: formData.get("model"),
    trim: formData.get("trim"),
    bodyType: formData.get("bodyType"),
    condition: formData.get("condition") || "USED",

    price: formData.get("price"),
    msrp: formData.get("msrp"),

    stockNumber: formData.get("stockNumber"),
    vin: formData.get("vin"),

    mileage: formData.get("mileage"),
    engineHours: formData.get("engineHours"),

    engine: formData.get("engine"),
    fuelType: formData.get("fuelType"),
    transmission: formData.get("transmission"),
    drivetrain: formData.get("drivetrain"),
    axleConfig: formData.get("axleConfig"),

    gvwr: formData.get("gvwr"),
    gvwrClass: formData.get("gvwrClass"),
    cdlRequired: bool("cdlRequired"),
    payloadCapacity: formData.get("payloadCapacity"),
    towingCapacity: formData.get("towingCapacity"),
    bodyLength: formData.get("bodyLength"),
    pto: bool("pto"),
    hydraulics: bool("hydraulics"),

    exteriorColor: formData.get("exteriorColor"),
    interiorColor: formData.get("interiorColor"),
    doors: formData.get("doors"),
    seats: formData.get("seats"),

    description: formData.get("description"),
    features: formData.getAll("features").map(String),
    location: formData.get("location"),

    status: formData.get("status") || "PUBLISHED",
    featured: bool("featured"),

    images: parseImages(formData.get("images")),
  };
}

function parseImages(raw: FormDataEntryValue | null) {
  if (typeof raw !== "string" || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((entry) => entry && typeof entry.url === "string")
      .map((entry) => ({ url: String(entry.url), alt: entry.alt ? String(entry.alt) : undefined }));
  } catch {
    return [];
  }
}

function fieldErrors(issues: { path: (string | number | symbol)[]; message: string }[]) {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    errors[key] ??= issue.message;
  }
  return errors;
}

/** Slugs stay unique and readable: "2019-freightliner-m2-106-dump-truck-a4f2". */
async function uniqueSlug(data: VehicleInput, currentId?: string) {
  const base = slugify(`${vehicleTitle(data)} ${data.bodyType}`) || "vehicle";
  let candidate = base;
  let counter = 2;

  for (;;) {
    const existing = await prisma.vehicle.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing || existing.id === currentId) return candidate;
    candidate = `${base}-${counter++}`;
  }
}

function toCreateData(data: VehicleInput, slug: string) {
  const { images, ...rest } = data;
  return {
    ...rest,
    slug,
    images: {
      create: images.map((image, index) => ({
        url: image.url,
        alt: image.alt ?? null,
        position: index,
      })),
    },
  };
}

export async function createVehicle(
  _prev: VehicleFormState,
  formData: FormData,
): Promise<VehicleFormState> {
  await requireUser();

  const parsed = vehicleSchema.safeParse(readForm(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields.",
      errors: fieldErrors(parsed.error.issues),
    };
  }

  const slug = await uniqueSlug(parsed.data);

  try {
    await prisma.vehicle.create({ data: toCreateData(parsed.data, slug) });
  } catch (error) {
    return { status: "error", message: describeDbError(error) };
  }

  revalidatePath("/");
  revalidatePath("/inventory");
  revalidatePath("/admin");
  redirect("/admin?created=1");
}

export async function updateVehicle(
  vehicleId: string,
  _prev: VehicleFormState,
  formData: FormData,
): Promise<VehicleFormState> {
  await requireUser();

  const parsed = vehicleSchema.safeParse(readForm(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields.",
      errors: fieldErrors(parsed.error.issues),
    };
  }

  const existing = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    select: { price: true, previousPrice: true },
  });
  if (!existing) return { status: "error", message: "That vehicle no longer exists." };

  const { images, ...rest } = parsed.data;
  const slug = await uniqueSlug(parsed.data, vehicleId);

  // Dropping the price records the old one so the listing shows a price-drop badge.
  const previousPrice =
    rest.price < existing.price ? existing.price : rest.price > existing.price ? null : existing.previousPrice;

  try {
    await prisma.$transaction([
      prisma.vehicleImage.deleteMany({ where: { vehicleId } }),
      prisma.vehicle.update({
        where: { id: vehicleId },
        data: {
          ...rest,
          slug,
          previousPrice,
          images: {
            create: images.map((image, index) => ({
              url: image.url,
              alt: image.alt ?? null,
              position: index,
            })),
          },
        },
      }),
    ]);
  } catch (error) {
    return { status: "error", message: describeDbError(error) };
  }

  revalidatePath("/");
  revalidatePath("/inventory");
  revalidatePath(`/inventory/${slug}`);
  revalidatePath("/admin");
  redirect("/admin?updated=1");
}

export async function deleteVehicle(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.vehicle.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/inventory");
  revalidatePath("/admin");
  redirect("/admin?deleted=1");
}

/** Quick status flips from the inventory table (Publish / Draft / Mark sold). */
export async function setVehicleStatus(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !["DRAFT", "PUBLISHED", "SOLD"].includes(status)) return;

  await prisma.vehicle.update({
    where: { id },
    data: { status: status as "DRAFT" | "PUBLISHED" | "SOLD" },
  });

  revalidatePath("/");
  revalidatePath("/inventory");
  revalidatePath("/admin");
}

export async function toggleVehicleFeatured(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const vehicle = await prisma.vehicle.findUnique({ where: { id }, select: { featured: true } });
  if (!vehicle) return;

  await prisma.vehicle.update({ where: { id }, data: { featured: !vehicle.featured } });

  revalidatePath("/");
  revalidatePath("/inventory");
  revalidatePath("/admin");
}

/** Copies a listing so near-identical units can be added in seconds. */
export async function duplicateVehicle(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const source = await prisma.vehicle.findUnique({
    where: { id },
    include: { images: { orderBy: { position: "asc" } } },
  });
  if (!source) return;

  const slug = await uniqueSlug(source as unknown as VehicleInput);

  const copy = await prisma.vehicle.create({
    data: {
      year: source.year,
      make: source.make,
      model: source.model,
      trim: source.trim,
      bodyType: source.bodyType,
      condition: source.condition,
      price: source.price,
      msrp: source.msrp,
      mileage: source.mileage,
      engineHours: source.engineHours,
      engine: source.engine,
      fuelType: source.fuelType,
      transmission: source.transmission,
      drivetrain: source.drivetrain,
      axleConfig: source.axleConfig,
      gvwr: source.gvwr,
      gvwrClass: source.gvwrClass,
      cdlRequired: source.cdlRequired,
      payloadCapacity: source.payloadCapacity,
      towingCapacity: source.towingCapacity,
      bodyLength: source.bodyLength,
      pto: source.pto,
      hydraulics: source.hydraulics,
      exteriorColor: source.exteriorColor,
      interiorColor: source.interiorColor,
      doors: source.doors,
      seats: source.seats,
      description: source.description,
      features: source.features,
      location: source.location,
      featured: false,
      slug,
      // A copy starts hidden, and identifiers that must stay unique are cleared.
      status: "DRAFT",
      stockNumber: source.stockNumber ? `${source.stockNumber}-COPY` : null,
      vin: null,
      previousPrice: null,
      images: {
        create: source.images.map((image, index) => ({
          url: image.url,
          alt: image.alt,
          position: index,
        })),
      },
    },
  });

  revalidatePath("/admin");
  redirect(`/admin/vehicles/${copy.id}`);
}

function describeDbError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("Unique constraint") && message.includes("stockNumber")) {
    return "That stock number is already used by another vehicle.";
  }
  return "Something went wrong saving this vehicle. Please try again.";
}
