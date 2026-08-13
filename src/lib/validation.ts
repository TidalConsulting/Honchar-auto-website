import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().email("Enter a valid email address").max(200),
  phone: z
    .string()
    .trim()
    .max(40)
    .optional()
    .transform((value) => (value ? value : undefined)),
  message: z.string().trim().max(2000).optional(),
  vehicleId: z.string().trim().optional(),
  type: z.enum(["AVAILABILITY", "FINANCING", "TRADE", "GENERAL"]).default("AVAILABILITY"),
});

export type LeadInput = z.infer<typeof leadSchema>;

const optionalInt = (max = 100_000_000) =>
  z
    .union([z.string(), z.number(), z.null()])
    .optional()
    .transform((value) => {
      if (value === null || value === undefined || value === "") return null;
      const parsed = typeof value === "number" ? value : Number(String(value).replace(/[^0-9.-]/g, ""));
      return Number.isFinite(parsed) ? Math.round(parsed) : null;
    })
    .refine((value) => value === null || (value >= 0 && value <= max), "Value is out of range");

const optionalFloat = () =>
  z
    .union([z.string(), z.number(), z.null()])
    .optional()
    .transform((value) => {
      if (value === null || value === undefined || value === "") return null;
      const parsed = typeof value === "number" ? value : Number(String(value).replace(/[^0-9.-]/g, ""));
      return Number.isFinite(parsed) ? parsed : null;
    });

const optionalText = (max = 200) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value ? value : null));

export const vehicleSchema = z.object({
  year: z.coerce.number().int().min(1950).max(new Date().getFullYear() + 2),
  make: z.string().trim().min(1, "Make is required").max(60),
  model: z.string().trim().min(1, "Model is required").max(80),
  trim: optionalText(80),
  bodyType: z.string().trim().min(1, "Body type is required").max(60),
  condition: z.enum(["NEW", "USED", "CERTIFIED"]).default("USED"),

  price: z.coerce.number().int().min(1, "Price is required").max(100_000_000),
  msrp: optionalInt(),

  stockNumber: optionalText(40),
  vin: optionalText(40),

  mileage: optionalInt(5_000_000),
  engineHours: optionalInt(500_000),

  engine: optionalText(120),
  fuelType: optionalText(40),
  transmission: optionalText(60),
  drivetrain: optionalText(40),
  axleConfig: optionalText(20),

  gvwr: optionalInt(500_000),
  gvwrClass: optionalInt(8),
  cdlRequired: z.coerce.boolean().default(false),
  payloadCapacity: optionalInt(500_000),
  towingCapacity: optionalInt(500_000),
  bodyLength: optionalFloat(),
  pto: z.coerce.boolean().default(false),
  hydraulics: z.coerce.boolean().default(false),

  exteriorColor: optionalText(60),
  interiorColor: optionalText(60),
  doors: optionalInt(8),
  seats: optionalInt(12),

  description: z.string().trim().max(6000).optional().transform((value) => value || null),
  features: z.array(z.string().trim().max(60)).max(60).default([]),
  location: optionalText(120),

  status: z.enum(["DRAFT", "PUBLISHED", "SOLD"]).default("PUBLISHED"),
  featured: z.coerce.boolean().default(false),

  images: z
    .array(z.object({ url: z.string().trim().min(1).max(2000), alt: z.string().trim().max(200).optional() }))
    .max(30)
    .default([]),
});

export type VehicleInput = z.infer<typeof vehicleSchema>;

export const userSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(200),
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
  role: z.enum(["OWNER", "STAFF"]).default("STAFF"),
});
