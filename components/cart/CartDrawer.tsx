"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ArrowRight, ShoppingBag, X } from "lucide-react";

import { CartItem } from "@/components/cart/CartItem";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/utils";

export function CartDrawer() {
  const {
    items,
    subtotal,
    clearCart,
    closeCart,
    isDrawerOpen,
    updateQuantity,
    removeItem,
    whatsappLink
  } = useCart();
  const [displaySubtotal, setDisplaySubtotal] = useState(subtotal);

  useEffect(() => {
    if (!isDrawerOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCart();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeCart, isDrawerOpen]);

  useEffect(() => {
    const value = { amount: displaySubtotal };

    gsap.to(value, {
      amount: subtotal,
      duration: 0.55,
      ease: "power2.out",
      onUpdate: () => setDisplaySubtotal(value.amount)
    });
  }, [subtotal]);

  const isEmpty = items.length === 0;
  const itemKey = useMemo(() => items.map((item) => item.id).join(","), [items]);

  return (
    <AnimatePresence>
      {isDrawerOpen ? (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          <motion.aside
            className="glass-panel fixed right-0 top-0 z-50 flex h-dvh w-full flex-col border-l border-gold/15 md:w-[420px]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-gold/10 px-5 py-4">
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.4em] text-gold">
                  Order Cart
                </p>
                <h2 className="mt-2 font-display text-3xl text-cream">Your table edit</h2>
              </div>
              <button
                type="button"
                className="rounded-full border border-gold/15 p-3 text-cream hover:border-gold"
                aria-label="Close cart drawer"
                onClick={closeCart}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              {isEmpty ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <Image
                    src="/illustrations/empty-cart.svg"
                    alt="Decorative empty cart illustration"
                    width={240}
                    height={160}
                    className="h-auto w-full max-w-[240px]"
                  />
                  <h3 className="mt-6 font-display text-3xl text-cream">No plates selected yet</h3>
                  <p className="mt-3 max-w-xs text-sm leading-7 text-cream-muted">
                    Add a few dishes and this editorial cart will assemble your WhatsApp order.
                  </p>
                  <Link href="/menu" className="gold-button mt-6" onClick={closeCart}>
                    Explore Menu
                  </Link>
                </div>
              ) : (
                <div key={itemKey} className="space-y-4">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        onRemove={() => removeItem(item.id)}
                        onUpdateQuantity={(quantity) => updateQuantity(item.id, quantity)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <div className="border-t border-gold/10 px-5 py-5">
              <div className="mb-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.38em] text-cream-muted">
                    Subtotal
                  </p>
                  <p className="mt-2 font-display text-4xl text-cream">
                    {formatCurrency(displaySubtotal)}
                  </p>
                </div>
                {!isEmpty ? (
                  <button
                    type="button"
                    className="text-xs uppercase tracking-[0.28em] text-cream-muted hover:text-cream"
                    onClick={clearCart}
                  >
                    Clear
                  </button>
                ) : null}
              </div>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className={`flex min-h-[54px] w-full items-center justify-center gap-3 border px-5 py-4 text-sm uppercase tracking-[0.28em] ${
                  isEmpty
                    ? "pointer-events-none border-gold/10 bg-ink-3 text-cream-muted"
                    : "border-[#25D366]/60 bg-[#25D366] text-[#07140D] hover:-translate-y-0.5"
                }`}
                aria-label="Checkout with WhatsApp"
              >
                <ShoppingBag className="h-4 w-4" />
                Checkout on WhatsApp
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
