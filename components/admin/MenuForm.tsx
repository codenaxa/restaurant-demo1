"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { menuCategories, type MenuItemRecord } from "@/lib/types";
import type { MenuItemInput } from "@/lib/validators/menu-item";
import { menuItemSchema } from "@/lib/validators/menu-item";

interface MenuFormProps {
  initialItem?: MenuItemRecord | null;
  isSubmitting?: boolean;
  onSubmit: (values: MenuItemInput) => Promise<void> | void;
  onCancelEdit: () => void;
}

const emptyValues: MenuItemInput = {
  name: "",
  description: "",
  price: 0,
  category: "Starters",
  emoji: "\u{1F37D}\uFE0F",
  image: undefined,
  tag: undefined,
  isAvailable: true,
  isFeatured: false,
  sortOrder: 10
};

async function getUploadErrorMessage(response: Response) {
  try {
    const data = (await response.json()) as { error?: string };
    return data.error || "Request failed.";
  } catch {
    return "Request failed.";
  }
}

export function MenuForm({
  initialItem,
  isSubmitting = false,
  onSubmit,
  onCancelEdit
}: MenuFormProps) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreviewBroken, setImagePreviewBroken] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<MenuItemInput>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: emptyValues
  });

  const imageValue = watch("image");
  const isBusy = isSubmitting || uploadingImage;

  useEffect(() => {
    if (initialItem) {
      reset({
        name: initialItem.name,
        description: initialItem.description,
        price: initialItem.price,
        category: initialItem.category,
        emoji: initialItem.emoji,
        image: initialItem.image,
        tag: initialItem.tag,
        isAvailable: initialItem.isAvailable,
        isFeatured: initialItem.isFeatured,
        sortOrder: initialItem.sortOrder
      });
    } else {
      reset(emptyValues);
    }
  }, [initialItem, reset]);

  useEffect(() => {
    setImagePreviewBroken(false);
  }, [imageValue]);

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploadingImage(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/menu/upload", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error(await getUploadErrorMessage(response));
      }

      const data = (await response.json()) as { url: string };
      setValue("image", data.url, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true
      });

      toast.success("Image uploaded");
    } catch (error) {
      toast.error("Unable to upload image", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  return (
    <div className="editorial-card shape-a p-6">
      <div className="mb-8">
        <p className="text-[0.68rem] uppercase tracking-[0.4em] text-gold">
          {initialItem ? "Edit Plate" : "Add New Plate"}
        </p>
        <h2 className="mt-3 font-display text-4xl text-cream">
          {initialItem ? initialItem.name : "Compose a new menu item"}
        </h2>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit((values) => void onSubmit(values))}>
        <div>
          <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.34em] text-cream-muted">
            Name
          </label>
          <input className="input-dark" {...register("name")} />
          {errors.name ? (
            <p className="mt-2 text-xs text-danger">{errors.name.message}</p>
          ) : null}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.34em] text-cream-muted">
              Emoji
            </label>
            <input className="input-dark" {...register("emoji")} />
            {errors.emoji ? (
              <p className="mt-2 text-xs text-danger">{errors.emoji.message}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.34em] text-cream-muted">
              Category
            </label>
            <select className="select-dark" {...register("category")}>
              {menuCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category ? (
              <p className="mt-2 text-xs text-danger">{errors.category.message}</p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.34em] text-cream-muted">
              Price
            </label>
            <input
              type="number"
              step="0.01"
              className="input-dark"
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price ? (
              <p className="mt-2 text-xs text-danger">{errors.price.message}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.34em] text-cream-muted">
              Tag
            </label>
            <input className="input-dark" placeholder="Chef's Pick" {...register("tag")} />
            {errors.tag ? (
              <p className="mt-2 text-xs text-danger">{errors.tag.message as string}</p>
            ) : null}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.34em] text-cream-muted">
            Description
          </label>
          <textarea className="textarea-dark" {...register("description")} />
          {errors.description ? (
            <p className="mt-2 text-xs text-danger">{errors.description.message}</p>
          ) : null}
        </div>

        <div className="space-y-4 border border-gold/10 bg-ink-3/50 p-4">
          <div>
            <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.34em] text-cream-muted">
              Image Link
            </label>
            <input
              className="input-dark"
              placeholder="https://example.com/dish.jpg or /uploads/menu/item.jpg"
              {...register("image")}
            />
            {errors.image ? (
              <p className="mt-2 text-xs text-danger">{errors.image.message as string}</p>
            ) : (
              <p className="mt-2 text-xs text-cream-muted">
                Paste a direct image URL or use the uploader below.
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.34em] text-cream-muted">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
              className="block w-full text-sm text-cream-muted file:mr-4 file:border file:border-gold/30 file:bg-gold/10 file:px-4 file:py-3 file:text-xs file:uppercase file:tracking-[0.24em] file:text-cream hover:file:border-gold"
              disabled={isBusy}
              onChange={handleImageUpload}
            />
            <p className="mt-2 text-xs text-cream-muted">
              JPG, PNG, WEBP, AVIF, or GIF up to 5 MB.
            </p>
          </div>

          {imageValue ? (
            <div className="overflow-hidden border border-gold/15 bg-ink">
              {!imagePreviewBroken ? (
                <img
                  src={imageValue}
                  alt="Menu item preview"
                  className="h-44 w-full object-cover"
                  onError={() => setImagePreviewBroken(true)}
                />
              ) : (
                <div className="flex h-44 items-center justify-center bg-ink-2 px-4 text-center text-sm text-cream-muted">
                  Preview unavailable. Check the image link or upload another file.
                </div>
              )}

              <div className="flex flex-col gap-3 border-t border-gold/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="truncate text-xs text-cream-muted">{imageValue}</p>
                <button
                  type="button"
                  className="ghost-button w-full sm:w-auto"
                  onClick={() =>
                    setValue("image", undefined, {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true
                    })
                  }
                >
                  Remove Image
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div>
          <label className="mb-2 block text-[0.68rem] uppercase tracking-[0.34em] text-cream-muted">
            Sort Order
          </label>
          <input
            type="number"
            className="input-dark"
            {...register("sortOrder", { valueAsNumber: true })}
          />
          {errors.sortOrder ? (
            <p className="mt-2 text-xs text-danger">{errors.sortOrder.message}</p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex min-h-[54px] items-center gap-3 border border-gold/15 bg-ink-3/70 px-4 text-sm text-cream">
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-gold/30 bg-ink"
              {...register("isAvailable")}
            />
            Available
          </label>
          <label className="flex min-h-[54px] items-center gap-3 border border-gold/15 bg-ink-3/70 px-4 text-sm text-cream">
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-gold/30 bg-ink"
              {...register("isFeatured")}
            />
            Featured
          </label>
        </div>

        <div className="flex flex-col gap-3 pt-4 sm:flex-row">
          <button type="submit" className="gold-button w-full sm:w-auto" disabled={isBusy}>
            {uploadingImage
              ? "Uploading image..."
              : isSubmitting
                ? "Saving..."
                : initialItem
                  ? "Update Item"
                  : "Add Item"}
          </button>
          {initialItem ? (
            <button type="button" className="ghost-button w-full sm:w-auto" onClick={onCancelEdit}>
              Cancel Edit
            </button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
