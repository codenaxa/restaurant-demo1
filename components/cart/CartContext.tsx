"use client";

import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren
} from "react";

import type { CartItem, MenuItemRecord } from "@/lib/types";
import { buildWhatsAppLink } from "@/lib/utils";

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isDrawerOpen: boolean;
  whatsappLink: string;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: MenuItemRecord) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const STORAGE_KEY = "maison-elite-cart";

export const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        setItems(JSON.parse(saved) as CartItem[]);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      items,
      itemCount,
      subtotal,
      isDrawerOpen,
      whatsappLink: buildWhatsAppLink(items),
      openCart: () => setIsDrawerOpen(true),
      closeCart: () => setIsDrawerOpen(false),
      addItem: (item) => {
        setItems((current) => {
          const existing = current.find((entry) => entry.id === item.id);

          if (existing) {
            return current.map((entry) =>
              entry.id === item.id
                ? { ...entry, quantity: entry.quantity + 1 }
                : entry
            );
          }

          return [...current, { ...item, quantity: 1 }];
        });

        setIsDrawerOpen(true);
      },
      updateQuantity: (id, quantity) => {
        setItems((current) =>
          current
            .map((item) => (item.id === id ? { ...item, quantity } : item))
            .filter((item) => item.quantity > 0)
        );
      },
      removeItem: (id) => {
        setItems((current) => current.filter((item) => item.id !== id));
      },
      clearCart: () => setItems([])
    };
  }, [isDrawerOpen, items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
