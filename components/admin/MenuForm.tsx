"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
  emoji: "🍽️",
  tag: undefined,
  isAvailable: true,
  isFeatured: false,
  sortOrder: 10
};

export function MenuForm({
  initialItem,
  isSubmitting = false,
  onSubmit,
  onCancelEdit
}: MenuFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<MenuItemInput>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: emptyValues
  });

  useEffect(() => {
    if (initialItem) {
      reset({
        name: initialItem.name,
        description: initialItem.description,
        price: initialItem.price,
        category: initialItem.category,
        emoji: initialItem.emoji,
        tag: initialItem.tag,
        isAvailable: initialItem.isAvailable,
        isFeatured: initialItem.isFeatured,
        sortOrder: initialItem.sortOrder
      });
    } else {
      reset(emptyValues);
    }
  }, [initialItem, reset]);

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
            <input type="checkbox" className="h-5 w-5 rounded border-gold/30 bg-ink" {...register("isAvailable")} />
            Available
          </label>
          <label className="flex min-h-[54px] items-center gap-3 border border-gold/15 bg-ink-3/70 px-4 text-sm text-cream">
            <input type="checkbox" className="h-5 w-5 rounded border-gold/30 bg-ink" {...register("isFeatured")} />
            Featured
          </label>
        </div>

        <div className="flex flex-col gap-3 pt-4 sm:flex-row">
          <button type="submit" className="gold-button w-full sm:w-auto" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initialItem ? "Update Item" : "Add Item"}
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
