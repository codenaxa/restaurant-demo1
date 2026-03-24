"use client";

import Image from "next/image";
import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";

import { CategoryTabs } from "@/components/menu/CategoryTabs";
import { MenuCard } from "@/components/menu/MenuCard";
import { menuCategories, type MenuItemRecord } from "@/lib/types";

type MenuCategoryFilter = "All" | (typeof menuCategories)[number];

const categories = ["All", ...menuCategories] as const;

function MenuSkeletonGrid() {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="editorial-card min-h-[308px] rounded-[0_32px_0_32px] p-5">
          <div className="skeleton-block h-14 w-14 rounded-full" />
          <div className="mt-6 skeleton-block h-10 w-2/3" />
          <div className="mt-5 skeleton-block h-4 w-full" />
          <div className="mt-3 skeleton-block h-4 w-11/12" />
          <div className="mt-3 skeleton-block h-4 w-8/12" />
          <div className="mt-10 skeleton-block h-12 w-full" />
        </div>
      ))}
    </div>
  );
}

export function MenuGrid() {
  const [items, setItems] = useState<MenuItemRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<MenuCategoryFilter>("All");
  const deferredCategory = useDeferredValue(activeCategory);

  useEffect(() => {
    let isMounted = true;

    const loadItems = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/menu", { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Unable to load the menu.");
        }

        const data = (await response.json()) as { items: MenuItemRecord[] };

        if (isMounted) {
          setItems(data.items);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(
            fetchError instanceof Error ? fetchError.message : "Unable to load the menu."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadItems();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    if (deferredCategory === "All") {
      return items;
    }

    return items.filter((item) => item.category === deferredCategory);
  }, [deferredCategory, items]);

  return (
    <div className="pb-20">
      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onChange={(category) => {
          startTransition(() => setActiveCategory(category));
        }}
      />

      <section className="section-shell">
        <div className="section-content">
          {loading ? <MenuSkeletonGrid /> : null}

          {!loading && error ? (
            <div className="editorial-card shape-a flex flex-col items-center justify-center px-6 py-14 text-center">
              <AlertCircle className="h-10 w-10 text-danger" />
              <h3 className="mt-5 font-display text-3xl text-cream">Menu unavailable</h3>
              <p className="mt-3 max-w-md text-sm leading-7 text-cream-muted">{error}</p>
            </div>
          ) : null}

          {!loading && !error && filteredItems.length === 0 ? (
            <div className="editorial-card shape-a flex flex-col items-center justify-center px-6 py-14 text-center">
              <Image
                src="/illustrations/empty-menu.svg"
                alt="Decorative empty menu illustration"
                width={240}
                height={180}
                className="h-auto w-full max-w-[240px]"
              />
              <h3 className="mt-6 font-display text-3xl text-cream">
                Nothing plated in this chapter
              </h3>
              <p className="mt-3 max-w-md text-sm leading-7 text-cream-muted">
                Switch categories to browse the rest of the collection or republish this
                section from the admin dashboard.
              </p>
            </div>
          ) : null}

          {!loading && !error && filteredItems.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item, index) => (
                <MenuCard key={item.id} item={item} index={index} />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
