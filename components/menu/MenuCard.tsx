"use client";

import { useEffect, useState, type MouseEvent } from "react";
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
  const [imageLoadFailed, setImageLoadFailed] = useState(false);
  const [ripple, setRipple] = useState<{ x: number; y: number; key: number } | null>(null);

  const isPreview = variant === "preview";
  const hasImage = Boolean(item.image && !imageLoadFailed);

  useEffect(() => {
    setImageLoadFailed(false);
  }, [item.image]);

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
        "editorial-card z-0 flex h-full flex-col justify-between overflow-hidden border-gold/15 p-5 hover:border-gold/28 hover:shadow-[0_14px_40px_rgba(201,169,110,0.09)]",
        shapes[index % shapes.length],
        isPreview ? "min-h-[424px]" : "min-h-[404px]"
      )}
    >
      <div>
        <div className="relative overflow-hidden rounded-[24px] border border-gold/15 bg-ink">
          {hasImage ? (
            <>
              <img
                src={item.image}
                alt={item.name}
                className={cn(
                  "w-full object-cover transition-transform duration-500",
                  isPreview ? "h-56" : "h-52"
                )}
                loading="lazy"
                onError={() => setImageLoadFailed(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
            </>
          ) : (
            <div
              className={cn(
                "relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(201,169,110,0.18),transparent_42%),linear-gradient(180deg,rgba(28,25,20,0.92),rgba(10,8,5,1))]",
                isPreview ? "h-56" : "h-52"
              )}
            >
              <div className="absolute inset-x-8 top-8 h-px bg-gold/10" />
              <div className="absolute inset-x-8 bottom-8 h-px bg-gold/10" />
              <div className="flex h-full items-center justify-center">
                <div className="h-28 w-28 rounded-full border border-gold/20 bg-gold/5 shadow-[0_0_0_18px_rgba(201,169,110,0.035)]" />
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
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

        <div className="mt-5 flex items-start justify-between gap-5">
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
              ? "border-gold/35 bg-gold/8 text-cream hover:border-gold/70 hover:bg-gold/10"
              : "cursor-not-allowed border-gold/10 bg-ink-3 text-cream-muted"
          )}
          aria-label={`Add ${item.name} to order`}
          disabled={!item.isAvailable}
          onClick={handleClick}
        >
          {ripple ? (
            <span
              key={ripple.key}
              className="pointer-events-none absolute h-8 w-8 animate-ripple rounded-full bg-gold/35"
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
