import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE } from "@/lib/session";

export { SESSION_COOKIE };
const SESSION_MAX_AGE = 60 * 60 * 24 * 14; // 14 days

export type SessionPayload = {
  userId: string;
  email: string;
  name: string;
  role: "OWNER" | "STAFF";
};

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 24) {
    throw new Error(
      "AUTH_SECRET is missing or too short. Set it to a random string of at least 24 characters.",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey());

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function readSessionToken(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * The signed-in user for the current request, or null.
 * Cached per request so multiple components can call it freely.
 */
export const getCurrentUser = cache(async () => {
  const store = await cookies();
  const session = await readSessionToken(store.get(SESSION_COOKIE)?.value);
  if (!session) return null;

  // Re-read the user so a deleted or demoted account loses access immediately.
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true, role: true },
  });
  return user;
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

/** True when no accounts exist yet, which unlocks the first-run setup screen. */
export async function needsFirstUser() {
  return (await prisma.user.count()) === 0;
}
