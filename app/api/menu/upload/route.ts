import { mkdir, writeFile } from "fs/promises";
import { extname, join } from "path";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

const maxFileSize = 5 * 1024 * 1024;
const uploadDirectory = join(process.cwd(), "public", "uploads", "menu");
const allowedMimeTypes = new Map<string, string>([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/avif", ".avif"],
  ["image/gif", ".gif"]
]);
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

export const runtime = "nodejs";

function getExtension(file: File) {
  const mimeExtension = allowedMimeTypes.get(file.type);

  if (mimeExtension) {
    return mimeExtension;
  }

  const originalExtension = extname(file.name).toLowerCase();
  return allowedExtensions.has(originalExtension) ? originalExtension : null;
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Image file is required." }, { status: 400 });
  }

  if (file.size === 0) {
    return NextResponse.json({ error: "Uploaded image is empty." }, { status: 400 });
  }

  if (file.size > maxFileSize) {
    return NextResponse.json(
      { error: "Image must be 5 MB or smaller." },
      { status: 400 }
    );
  }

  const extension = getExtension(file);

  if (!extension) {
    return NextResponse.json(
      { error: "Only JPG, PNG, WEBP, AVIF, and GIF images are supported." },
      { status: 400 }
    );
  }

  await mkdir(uploadDirectory, { recursive: true });

  const fileName = `${Date.now()}-${crypto.randomUUID()}${extension}`;
  const filePath = join(uploadDirectory, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, buffer);

  return NextResponse.json({ url: `/uploads/menu/${fileName}` }, { status: 201 });
}
