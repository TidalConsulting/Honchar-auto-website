"use server";

import { revalidatePath } from "next/cache";

import { hashPassword, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { userSchema } from "@/lib/validation";

export type SimpleState = { error?: string; success?: string };

export async function updateLeadStatus(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !["NEW", "CONTACTED", "CLOSED"].includes(status)) return;

  await prisma.lead.update({
    where: { id },
    data: { status: status as "NEW" | "CONTACTED" | "CLOSED" },
  });
  revalidatePath("/admin/leads");
}

export async function deleteLead(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.lead.delete({ where: { id } });
  revalidatePath("/admin/leads");
}

export async function createUser(_prev: SimpleState, formData: FormData): Promise<SimpleState> {
  const current = await requireUser();
  if (current.role !== "OWNER") {
    return { error: "Only an owner account can add staff." };
  }

  const parsed = userSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role") || "STAFF",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return { error: "An account with that email already exists." };

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      role: parsed.data.role,
      passwordHash: await hashPassword(parsed.data.password),
    },
  });

  revalidatePath("/admin/users");
  return { success: `${parsed.data.name} can now sign in.` };
}

export async function deleteUser(formData: FormData) {
  const current = await requireUser();
  if (current.role !== "OWNER") return;

  const id = String(formData.get("id") ?? "");
  if (!id || id === current.id) return; // never delete the account you're signed in as

  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}

export async function changePassword(
  _prev: SimpleState,
  formData: FormData,
): Promise<SimpleState> {
  const current = await requireUser();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (password !== confirm) return { error: "The two passwords don't match." };

  await prisma.user.update({
    where: { id: current.id },
    data: { passwordHash: await hashPassword(password) },
  });

  return { success: "Password updated." };
}
