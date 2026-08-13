import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export type UploadResult = { url: string };

/**
 * Stores an uploaded photo.
 *
 * On Vercel (BLOB_READ_WRITE_TOKEN present) it goes to Vercel Blob, because the
 * serverless filesystem is read-only and wiped between deploys. Anywhere else it
 * lands in public/uploads so local development works with no cloud setup.
 */
export async function storeImage(file: File): Promise<UploadResult> {
  if (!ALLOWED.has(file.type)) {
    throw new Error("Unsupported file type. Upload a JPEG, PNG, WebP, or AVIF image.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("That image is larger than 8 MB. Please compress it and try again.");
  }

  const extension = file.type.split("/")[1].replace("jpeg", "jpg");
  const filename = `${Date.now()}-${randomUUID().slice(0, 8)}.${extension}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`vehicles/${filename}`, file, {
      access: "public",
      contentType: file.type,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return { url: blob.url };
  }

  const directory = path.join(process.cwd(), "public", "uploads");
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()));
  return { url: `/uploads/${filename}` };
}
