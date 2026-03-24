import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { deleteMenuItem, updateMenuItem } from "@/lib/menu-store";
import { menuItemUpdateSchema } from "@/lib/validators/menu-item";

interface RouteContext {
  params: {
    id: string;
  };
}

export async function PUT(request: Request, { params }: RouteContext) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = menuItemUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.issues[0]?.message || "Invalid menu update payload."
      },
      { status: 400 }
    );
  }

  const item = await updateMenuItem(params.id, parsed.data);

  if (!item) {
    return NextResponse.json({ error: "Menu item not found." }, { status: 404 });
  }

  return NextResponse.json({ item });
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const hardDelete = searchParams.get("hard") === "true";
  const item = await deleteMenuItem(params.id, hardDelete);

  if (!item) {
    return NextResponse.json({ error: "Menu item not found." }, { status: 404 });
  }

  return NextResponse.json({ item });
}
