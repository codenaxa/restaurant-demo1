"use client";

import { CSSProperties } from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { GripVertical, Pencil, Star, Trash2 } from "lucide-react";

import type { MenuItemRecord } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";

interface MenuTableProps {
  items: MenuItemRecord[];
  loading?: boolean;
  onEdit: (item: MenuItemRecord) => void;
  onDelete: (item: MenuItemRecord) => void;
  onToggleField: (
    item: MenuItemRecord,
    field: "isAvailable" | "isFeatured",
    value: boolean
  ) => void;
  onReorder: (items: MenuItemRecord[]) => void;
}

interface SortableItemProps {
  item: MenuItemRecord;
  onEdit: (item: MenuItemRecord) => void;
  onDelete: (item: MenuItemRecord) => void;
  onToggleField: (
    item: MenuItemRecord,
    field: "isAvailable" | "isFeatured",
    value: boolean
  ) => void;
}

function SortableRow({ item, onEdit, onDelete, onToggleField }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style: CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "grid items-center gap-4 border-b border-gold/10 px-4 py-4 text-sm text-cream md:grid-cols-[44px_1.6fr_1fr_0.8fr_0.9fr_0.7fr_0.7fr_120px]",
        isDragging && "bg-gold/10"
      )}
    >
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center border border-gold/15 text-cream-muted hover:text-cream"
        aria-label={`Reorder ${item.name}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/25 bg-gold/10 text-xl">
          {item.emoji}
        </span>
        <div>
          <p className="font-display text-2xl leading-none text-cream">{item.name}</p>
          <p className="mt-1 text-[0.68rem] uppercase tracking-[0.3em] text-cream-muted">
            Sort {item.sortOrder}
          </p>
        </div>
      </div>

      <p className="text-cream-muted">{item.category}</p>
      <p className="text-gold">{formatCurrency(item.price)}</p>
      <p className="truncate text-cream-muted">{item.tag || "No tag"}</p>

      <button
        type="button"
        className={cn(
          "min-h-[40px] border px-3 text-xs uppercase tracking-[0.24em]",
          item.isAvailable
            ? "border-success/25 bg-success/10 text-success"
            : "border-gold/10 bg-ink text-cream-muted"
        )}
        onClick={() => onToggleField(item, "isAvailable", !item.isAvailable)}
      >
        {item.isAvailable ? "Live" : "Hidden"}
      </button>

      <button
        type="button"
        className={cn(
          "min-h-[40px] border px-3 text-xs uppercase tracking-[0.24em]",
          item.isFeatured
            ? "border-gold/25 bg-gold/10 text-gold"
            : "border-gold/10 bg-ink text-cream-muted"
        )}
        onClick={() => onToggleField(item, "isFeatured", !item.isFeatured)}
      >
        {item.isFeatured ? "Featured" : "Standard"}
      </button>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center border border-gold/15 text-cream-muted hover:border-gold hover:text-cream"
          aria-label={`Edit ${item.name}`}
          onClick={() => onEdit(item)}
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center border border-gold/15 text-cream-muted hover:border-gold hover:text-gold"
          aria-label={`Feature ${item.name}`}
          onClick={() => onToggleField(item, "isFeatured", !item.isFeatured)}
        >
          <Star className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center border border-gold/15 text-cream-muted hover:border-danger/50 hover:text-danger"
          aria-label={`Delete ${item.name}`}
          onClick={() => onDelete(item)}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function MenuTable({
  items,
  loading = false,
  onEdit,
  onDelete,
  onToggleField,
  onReorder
}: MenuTableProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    const nextItems = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
      ...item,
      sortOrder: (index + 1) * 10
    }));

    onReorder(nextItems);
  };

  return (
    <div className="editorial-card shape-b overflow-hidden">
      <div className="border-b border-gold/10 px-6 py-5">
        <p className="text-[0.68rem] uppercase tracking-[0.4em] text-gold">Menu Library</p>
        <h2 className="mt-3 font-display text-4xl text-cream">Drag, feature, and publish</h2>
      </div>

      {loading ? (
        <div className="space-y-3 p-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="skeleton-block h-20 w-full rounded-[24px]" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="px-6 py-10 text-sm leading-7 text-cream-muted">
          No menu items yet. Use the form to publish your first plate.
        </div>
      ) : (
        <>
          <div className="hidden border-b border-gold/10 px-4 py-3 text-[0.68rem] uppercase tracking-[0.28em] text-cream-muted md:grid md:grid-cols-[44px_1.6fr_1fr_0.8fr_0.9fr_0.7fr_0.7fr_120px]">
            <span>Move</span>
            <span>Item</span>
            <span>Category</span>
            <span>Price</span>
            <span>Tag</span>
            <span>Available</span>
            <span>Featured</span>
            <span>Actions</span>
          </div>

          <div className="md:hidden space-y-4 p-4">
            {items.map((item) => (
              <div key={item.id} className="border border-gold/10 bg-ink-3/70 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-2xl text-cream">
                      {item.emoji} {item.name}
                    </p>
                    <p className="mt-1 text-[0.68rem] uppercase tracking-[0.28em] text-cream-muted">
                      {item.category}
                    </p>
                  </div>
                  <p className="text-sm uppercase tracking-[0.24em] text-gold">
                    {formatCurrency(item.price)}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="border border-gold/15 px-3 py-2 text-xs uppercase tracking-[0.24em] text-cream"
                    onClick={() => onEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="border border-gold/15 px-3 py-2 text-xs uppercase tracking-[0.24em] text-cream"
                    onClick={() => onToggleField(item, "isAvailable", !item.isAvailable)}
                  >
                    {item.isAvailable ? "Hide" : "Show"}
                  </button>
                  <button
                    type="button"
                    className="border border-gold/15 px-3 py-2 text-xs uppercase tracking-[0.24em] text-cream"
                    onClick={() => onToggleField(item, "isFeatured", !item.isFeatured)}
                  >
                    {item.isFeatured ? "Unfeature" : "Feature"}
                  </button>
                  <button
                    type="button"
                    className="border border-danger/30 px-3 py-2 text-xs uppercase tracking-[0.24em] text-danger"
                    onClick={() => onDelete(item)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                {items.map((item) => (
                  <SortableRow
                    key={item.id}
                    item={item}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleField={onToggleField}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </>
      )}
    </div>
  );
}
