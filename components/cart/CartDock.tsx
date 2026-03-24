"use client";

import { ShoppingBag } from "lucide-react";

import { CartDrawer } from "@/components/cart/CartDrawer";
import { useCart } from "@/hooks/useCart";

export function CartDock() {
  const { itemCount, openCart } = useCart();

  return (
    <>
      <button
        type="button"
        aria-label="Open cart"
        className="fixed bottom-5 right-5 z-30 flex min-h-[56px] min-w-[56px] items-center justify-center gap-3 rounded-full border border-gold/35 bg-ink-2/95 px-4 text-cream shadow-gold md:hidden"
        onClick={openCart}
      >
        <ShoppingBag className="h-5 w-5" />
        <span className="text-sm uppercase tracking-[0.24em]">{itemCount}</span>
      </button>
      <CartDrawer />
    </>
  );
}
