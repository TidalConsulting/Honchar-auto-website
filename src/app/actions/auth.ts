"use server";

import { redirect } from "next/navigation";

import {
  createSession,
  destroySession,
  hashPassword,
  needsFirstUser,
  verifyPassword,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { userSchema } from "@/lib/validation";

export type AuthState = { error?: string };

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "Enter your email and password." };

  const user = await prisma.user.findUnique({ where: { email } });
  // Same message either way so the form can't be used to enumerate accounts.
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "That email and password combination didn't work." };
  }

  await createSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  redirect("/admin");
}

/** First-run setup: only works while the users table is empty. */
export async function createFirstUser(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (!(await needsFirstUser())) {
    return { error: "An account already exists. Sign in instead." };
  }

  const parsed = userSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: "OWNER",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  // Optional guard for deployments on a public URL with no password in front
  // of them: when SETUP_EMAIL is set, only that address can claim the owner
  // account. Unset, the form works for whoever reaches it first.
  const allowed = process.env.SETUP_EMAIL?.trim().toLowerCase();
  if (allowed && parsed.data.email !== allowed) {
    return { error: "That email address isn't authorised to set up this site." };
  }

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash: await hashPassword(parsed.data.password),
      role: "OWNER",
    },
  });

  await createSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  redirect("/admin");
}

export async function signOut() {
  await destroySession();
  redirect("/admin/login");
}
