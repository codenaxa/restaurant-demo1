"use client";

import { useState, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { useCart } from "@/hooks/useCart";
import type { MenuItemRecord } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";

interface MenuCardProps {
  item: MenuItemRecord;
  index?: number;
  variant?: "preview" | "full";
}

const shapes = ["shape-a", "shape-b", "shape-c"] as const;

export function MenuCard({ item, index = 0, variant = "full" }: MenuCardProps) {
  const { addItem } = useCart();
  const [ripple, setRipple] = useState<{ x: number; y: number; key: number } | null>(null);

  const isPreview = variant === "preview";

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setRipple({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
      key: Date.now()
    });
    addItem(item);
  };

  return (
    <motion.article
      whileHover={isPreview ? undefined : { y: -6 }}
      transition={{ duration: 0.24 }}
      className={cn(
        "editorial-card z-0 flex h-full flex-col justify-between overflow-hidden border-gold/15 p-5 hover:border-gold/40 hover:shadow-gold",
        shapes[index % shapes.length],
        isPreview ? "min-h-[330px]" : "min-h-[308px]"
      )}
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-2xl">
            {item.emoji}
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <span className="rounded-full border border-gold/20 px-3 py-1 text-[0.62rem] uppercase tracking-[0.32em] text-cream-muted">
              {item.category}
            </span>
            {item.tag ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-gold/12 px-3 py-1 text-[0.62rem] uppercase tracking-[0.28em] text-gold">
                <Sparkles className="h-3 w-3" />
                {item.tag}
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-6 flex items-start justify-between gap-5">
          <h3 className="font-display text-3xl leading-none text-cream">{item.name}</h3>
          <p className="whitespace-nowrap text-sm uppercase tracking-[0.28em] text-gold">
            {formatCurrency(item.price)}
          </p>
        </div>

        <p className="mt-4 text-sm leading-7 text-cream-muted">{item.description}</p>
      </div>

      <div className="mt-8">
        <button
          type="button"
          className={cn(
            "relative flex min-h-[52px] w-full items-center justify-center overflow-hidden border text-sm uppercase tracking-[0.28em] transition-all duration-300 active:scale-[0.97]",
            item.isAvailable
              ? "border-gold/35 bg-gold/10 text-cream hover:border-gold hover:bg-gold/15"
              : "cursor-not-allowed border-gold/10 bg-ink-3 text-cream-muted"
          )}
          aria-label={`Add ${item.name} to order`}
          disabled={!item.isAvailable}
          onClick={handleClick}
        >
          {ripple ? (
            <span
              key={ripple.key}
              className="pointer-events-none absolute h-8 w-8 rounded-full bg-gold/35 animate-ripple"
              style={{ left: ripple.x, top: ripple.y }}
            />
          ) : null}
          <span className="relative z-10">
            {item.isAvailable ? "Add to Order" : "Unavailable"}
          </span>
        </button>
      </div>
    </motion.article>
  );
}
