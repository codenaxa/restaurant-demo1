import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { createMenuItem, listMenuItems } from "@/lib/menu-store";
import { menuItemSchema } from "@/lib/validators/menu-item";

export async function GET(request: Request) {
  const session = await auth();
  const { searchParams } = new URL(request.url);
  const includeUnavailable =
    searchParams.get("includeUnavailable") === "true" && Boolean(session);
  const featuredOnly = searchParams.get("featuredOnly") === "true";

  const items = await listMenuItems({
    includeUnavailable,
    featuredOnly
  });

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = menuItemSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.issues[0]?.message || "Invalid menu item payload."
      },
      { status: 400 }
    );
  }

  const item = await createMenuItem(parsed.data);

  return NextResponse.json({ item }, { status: 201 });
}
