import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { storeImage } from "@/lib/storage";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const formData = await request.formData();
  const files = formData.getAll("files").filter((entry): entry is File => entry instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "No files were uploaded." }, { status: 400 });
  }
  if (files.length > 20) {
    return NextResponse.json({ error: "Upload at most 20 photos at a time." }, { status: 400 });
  }

  try {
    const uploaded = await Promise.all(files.map((file) => storeImage(file)));
    return NextResponse.json({ urls: uploaded.map((entry) => entry.url) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
