"use client";

import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";

import type { CartItem as CartItemType } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      className="editorial-card shape-a flex items-start gap-4 p-4"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/25 bg-gold/10 text-2xl">
        {item.emoji}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-2xl leading-none text-cream">{item.name}</h3>
            <p className="mt-1 text-sm uppercase tracking-[0.32em] text-cream-muted">
              {item.category}
            </p>
          </div>
          <button
            type="button"
            aria-label={`Remove ${item.name} from cart`}
            className="rounded-full border border-gold/20 p-2 text-cream-muted hover:border-danger/40 hover:text-danger"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              className="flex h-10 w-10 items-center justify-center border border-gold/20 bg-ink-3 text-cream"
              aria-label={`Decrease quantity of ${item.name}`}
              onClick={() => onUpdateQuantity(item.quantity - 1)}
            >
              <Minus className="h-4 w-4" />
            </motion.button>
            <span className="min-w-8 text-center text-sm tracking-[0.2em] text-cream">
              {item.quantity}
            </span>
            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              className="flex h-10 w-10 items-center justify-center border border-gold/20 bg-ink-3 text-cream"
              aria-label={`Increase quantity of ${item.name}`}
              onClick={() => onUpdateQuantity(item.quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </motion.button>
          </div>

          <p className="text-sm uppercase tracking-[0.28em] text-gold">
            {formatCurrency(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
