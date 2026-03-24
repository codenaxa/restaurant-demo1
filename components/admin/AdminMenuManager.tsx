"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { MenuForm } from "@/components/admin/MenuForm";
import { MenuTable } from "@/components/admin/MenuTable";
import type { MenuItemRecord } from "@/lib/types";
import type { MenuItemInput } from "@/lib/validators/menu-item";

async function getErrorMessage(response: Response) {
  try {
    const data = (await response.json()) as { error?: string };
    return data.error || "Request failed.";
  } catch {
    return "Request failed.";
  }
}

export function AdminMenuManager() {
  const [items, setItems] = useState<MenuItemRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItemRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MenuItemRecord | null>(null);

  const loadItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/menu?includeUnavailable=true", {
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const data = (await response.json()) as { items: MenuItemRecord[] };
      setItems(data.items);
    } catch (error) {
      toast.error("Unable to load menu items", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadItems();
  }, []);

  const saveItem = async (values: MenuItemInput) => {
    try {
      setSaving(true);

      const response = await fetch(selectedItem ? `/api/menu/${selectedItem.id}` : "/api/menu", {
        method: selectedItem ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      await loadItems();
      setSelectedItem(null);
      toast.success(selectedItem ? "Menu item updated" : "Menu item created");
    } catch (error) {
      toast.error("Unable to save item", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setSaving(false);
    }
  };

  const updateToggle = async (
    item: MenuItemRecord,
    field: "isAvailable" | "isFeatured",
    value: boolean
  ) => {
    try {
      const response = await fetch(`/api/menu/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ [field]: value })
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      setItems((current) =>
        current.map((entry) =>
          entry.id === item.id ? { ...entry, [field]: value } : entry
        )
      );
    } catch (error) {
      toast.error("Unable to update item", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };

  const reorderItems = async (nextItems: MenuItemRecord[]) => {
    setItems(nextItems);

    try {
      await Promise.all(
        nextItems.map((item) =>
          fetch(`/api/menu/${item.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ sortOrder: item.sortOrder })
          }).then(async (response) => {
            if (!response.ok) {
              throw new Error(await getErrorMessage(response));
            }
          })
        )
      );

      toast.success("Menu order updated");
    } catch (error) {
      toast.error("Unable to reorder items", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
      await loadItems();
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const response = await fetch(`/api/menu/${deleteTarget.id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      toast.success("Menu item archived");
      setDeleteTarget(null);
      if (selectedItem?.id === deleteTarget.id) {
        setSelectedItem(null);
      }
      await loadItems();
    } catch (error) {
      toast.error("Unable to delete item", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <MenuForm
          initialItem={selectedItem}
          isSubmitting={saving}
          onSubmit={saveItem}
          onCancelEdit={() => setSelectedItem(null)}
        />
        <MenuTable
          items={items}
          loading={loading}
          onEdit={setSelectedItem}
          onDelete={setDeleteTarget}
          onToggleField={updateToggle}
          onReorder={reorderItems}
        />
      </div>

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm">
          <div className="editorial-card shape-a w-full max-w-md p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-danger/30 bg-danger/10">
              <AlertTriangle className="h-6 w-6 text-danger" />
            </div>
            <h3 className="mt-6 font-display text-4xl text-cream">Archive this item?</h3>
            <p className="mt-4 text-sm leading-7 text-cream-muted">
              {deleteTarget.name} will be marked unavailable and removed from the public menu.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" className="gold-button w-full sm:w-auto" onClick={confirmDelete}>
                Archive Item
              </button>
              <button
                type="button"
                className="ghost-button w-full sm:w-auto"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
