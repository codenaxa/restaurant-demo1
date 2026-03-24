"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface CategoryTabsProps<T extends string> {
  categories: readonly T[];
  activeCategory: T;
  onChange: (category: T) => void;
}

export function CategoryTabs<T extends string>({
  categories,
  activeCategory,
  onChange
}: CategoryTabsProps<T>) {
  return (
    <div className="sticky top-[77px] z-20 overflow-x-auto border-y border-gold/10 bg-ink/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl gap-2 px-5 py-4 sm:px-8 lg:px-12 xl:px-16">
        {categories.map((category) => {
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              type="button"
              className={cn(
                "relative whitespace-nowrap px-4 py-3 text-xs uppercase tracking-[0.32em] transition-colors",
                isActive ? "text-cream" : "text-cream-muted hover:text-cream"
              )}
              aria-pressed={isActive}
              onClick={() => onChange(category)}
            >
              {isActive ? (
                <motion.span
                  layoutId="menu-tab-highlight"
                  className="absolute inset-0 border border-gold/25 bg-gold/10"
                  transition={{ type: "spring", stiffness: 340, damping: 32 }}
                />
              ) : null}
              <span className="relative z-10">{category}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
