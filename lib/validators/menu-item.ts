import { z } from "zod";

import { menuCategories } from "@/lib/types";

const tagSchema = z.union([z.string().trim().max(32), z.literal(""), z.undefined()]);
const imageSchema = z.union([z.string().trim().max(2048), z.literal(""), z.undefined()]);

function isValidImageReference(value: string) {
  if (value.startsWith("/")) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const menuItemBaseSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  description: z.string().trim().min(16, "Description must be at least 16 characters."),
  price: z.coerce.number().min(0, "Price must be 0 or higher."),
  category: z.enum(menuCategories),
  emoji: z.string().trim().min(1, "Emoji is required.").max(8, "Emoji is too long."),
  image: imageSchema.refine(
    (value) => !value || isValidImageReference(value),
    "Image must be a full URL or a site path that starts with /."
  ),
  tag: tagSchema,
  isAvailable: z.coerce.boolean().default(true),
  isFeatured: z.coerce.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).max(9999)
});

export const menuItemSchema = menuItemBaseSchema.transform((data) => ({
  ...data,
  image: data.image?.trim() ? data.image.trim() : undefined,
  tag: data.tag?.trim() ? data.tag.trim() : undefined
}));

export const menuItemUpdateSchema = menuItemBaseSchema.partial().transform((data) => ({
  ...data,
  image: typeof data.image === "string" ? data.image.trim() || undefined : data.image,
  tag: typeof data.tag === "string" ? data.tag.trim() || undefined : data.tag
}));

export type MenuItemInput = z.output<typeof menuItemSchema>;
export type MenuItemUpdateInput = z.output<typeof menuItemUpdateSchema>;
