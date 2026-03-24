"use client";

import type { PropsWithChildren } from "react";
import { Toaster } from "sonner";

import { CartProvider } from "@/components/cart/CartContext";
import { SmoothScroll } from "@/components/providers/SmoothScroll";

export function SiteProviders({ children }: PropsWithChildren) {
  return (
    <CartProvider>
      <SmoothScroll />
      {children}
      <Toaster
        position="top-right"
        theme="dark"
        richColors
        toastOptions={{
          classNames: {
            toast: "!border !border-gold/20 !bg-ink-2 !text-cream",
            description: "!text-cream-muted"
          }
        }}
      />
    </CartProvider>
  );
}
