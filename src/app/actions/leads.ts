"use server";

import { prisma } from "@/lib/prisma";
import { leadSchema } from "@/lib/validation";

export type LeadFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
};

export async function submitLead(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  // Honeypot: real people leave this hidden field empty.
  if (formData.get("company")) {
    return { status: "success", message: "Thanks — we'll be in touch shortly." };
  }

  const parsed = leadSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") ?? undefined,
    message: formData.get("message") ?? undefined,
    vehicleId: formData.get("vehicleId") ?? undefined,
    type: formData.get("type") ?? "AVAILABILITY",
  });

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      errors[key] ??= issue.message;
    }
    return { status: "error", message: "Please fix the highlighted fields.", errors };
  }

  const { vehicleId, ...lead } = parsed.data;

  // Only attach a vehicle that actually exists, so a stale form can't fail the insert.
  const vehicle = vehicleId
    ? await prisma.vehicle.findUnique({ where: { id: vehicleId }, select: { id: true } })
    : null;

  await prisma.lead.create({
    data: { ...lead, vehicleId: vehicle?.id ?? null },
  });

  return {
    status: "success",
    message: "Thanks — a member of our team will reach out within one business hour.",
  };
}
